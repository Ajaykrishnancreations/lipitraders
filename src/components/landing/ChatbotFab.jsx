import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquareText } from "lucide-react";
import { COMPANY } from "../../data/site";
import { useLanguage } from "../../hooks/useLanguage";
import { getCookie, setCookie } from "../../lib/cookies";
import { WELCOME_BUBBLE } from "../../chat/engine";
import ChatbotWindow from "./ChatbotWindow";

const BUBBLE_COOKIE = "lipi-chat-bubble-seen";

const ChatbotFab = () => {
  const { lang } = useLanguage();
  const bubbleLang = lang === "en" ? "en" : lang === "ta" ? "ta" : lang === "hi" ? "hi" : "en";
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);

  // Show welcome bubble after 3s on first visit (until seen)
  useEffect(() => {
    if (getCookie(BUBBLE_COOKIE) === "1") return;
    const id = setTimeout(() => setBubble(true), 3000);
    // auto dismiss after 12s
    const id2 = setTimeout(() => setBubble(false), 15000);
    return () => {
      clearTimeout(id);
      clearTimeout(id2);
    };
  }, []);

  const dismissBubble = () => {
    setBubble(false);
    setCookie(BUBBLE_COOKIE, "1", 30);
  };

  const openChat = () => {
    setOpen(true);
    dismissBubble();
  };

  return (
    <>
      {/* Welcome bubble */}
      <AnimatePresence>
        {bubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
            data-testid="chat-welcome-bubble"
            className="fixed bottom-[10.5rem] right-5 z-40 max-w-[260px]"
          >
            <button
              onClick={dismissBubble}
              data-testid="chat-bubble-close"
              aria-label="Dismiss"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full grid place-items-center bg-[color:var(--bg-elev)] border border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] z-10"
            >
              <X size={12} />
            </button>
            <button
              onClick={openChat}
              className="block text-left glass-strong border-2 border-[color:var(--accent-orange)]/40 px-4 py-3 pr-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] cursor-pointer hover:border-[color:var(--accent-orange)] transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full overflow-hidden border border-[color:var(--accent-orange)]/50 bg-black/20 shrink-0">
                  <img src={COMPANY.logoUrl} alt="Lipi" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[color:var(--accent-orange)] mb-1">
                    LIPI ASSISTANT
                  </div>
                  <div className="text-sm text-[color:var(--text-primary)] leading-snug">
                    {WELCOME_BUBBLE[bubbleLang] || WELCOME_BUBBLE.en}
                  </div>
                </div>
              </div>
              {/* Speech tail */}
              <span className="absolute -bottom-2 right-7 h-4 w-4 rotate-45 border-r-2 border-b-2 border-[color:var(--accent-orange)]/40 glass-strong" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => (open ? setOpen(false) : openChat())}
        data-testid="chatbot-fab"
        aria-label="Open chat"
        className="fixed bottom-[5.5rem] right-5 z-40 h-14 w-14 rounded-full grid place-items-center bg-gradient-to-br from-[#FF5722] to-[#E64A19] text-white shadow-[0_8px_30px_rgba(255,87,34,0.45)] hover:scale-110 transition-transform"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquareText size={24} strokeWidth={2} />
              {!open && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[#FF5722] animate-pulse" />
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <ChatbotWindow open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ChatbotFab;
