import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Phone, MessageCircle, RotateCcw } from "lucide-react";
import { COMPANY } from "../../data/site";
import { useLanguage } from "../../hooks/useLanguage";
import { processInput, initSession, STARTER_CHIPS, BOT_INTRO } from "../../chat/engine";
import { saveChatbotLead } from "../../lib/sheets";

const HISTORY_KEY = "lipi-chat-history";
const SESSION_KEY = "lipi-chat-session";
const SAVE_SIG_KEY = "lipi-chat-savesig";

const ChatbotWindow = ({ open, onClose }) => {
  const { lang } = useLanguage();
  const chipLang = lang === "ta" ? "ta" : lang === "hi" ? "hi" : "en";

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
  });
  const [session, setSession] = useState(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      return s || initSession(chipLang);
    } catch { return initSession(chipLang); }
  });
  const [stepChips, setStepChips] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Seed bot intro on first open of a fresh session
  useEffect(() => {
    if (open && messages.length === 0) {
      const intro = BOT_INTRO[chipLang] || BOT_INTRO.en;
      const initialMsgs = [{ role: "bot", text: intro, ts: Date.now() }];
      setMessages(initialMsgs);
      // attach intro to session conversation too
      setSession((s) => ({ ...s, conversation: [{ role: "bot", text: intro }] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);
  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* ignore */ }
  }, [session]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const persistAndSave = (lead, status) => {
    if (!lead) return;
    let prevSig = "";
    try { prevSig = sessionStorage.getItem(SAVE_SIG_KEY) || ""; } catch { /* ignore */ }
    const sig = `${status}|${lead.phone}|${lead.email}|${lead.location}|${lead.scrapType}`;
    if (sig === prevSig) return;
    saveChatbotLead({ ...lead, saveStatus: status });
    try { sessionStorage.setItem(SAVE_SIG_KEY, sig); } catch { /* ignore */ }
  };

  const sendMessage = (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    const userMsg = { role: "user", text: t, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setStepChips([]);

    setTimeout(() => {
      const result = processInput(t, session);
      setSession(result.session);
      setStepChips(result.chips || []);
      if (result.save && result.lead) {
        persistAndSave(result.lead, result.save);
      }
      setMessages((m) => [...m, { role: "bot", text: result.reply, ts: Date.now() }]);
      setTyping(false);
    }, 500 + Math.random() * 350);
  };

  const resetChat = () => {
    setMessages([]);
    setSession(initSession(chipLang));
    setStepChips([]);
    try {
      sessionStorage.removeItem(HISTORY_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SAVE_SIG_KEY);
    } catch { /* ignore */ }
    // re-seed intro on next render
    setTimeout(() => {
      const intro = BOT_INTRO[chipLang] || BOT_INTRO.en;
      setMessages([{ role: "bot", text: intro, ts: Date.now() }]);
      setSession((s) => ({ ...s, conversation: [{ role: "bot", text: intro }] }));
    }, 0);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Which chip set to show
  const showStarter = messages.length <= 2 && session.state === "IDLE";
  const starterChips = STARTER_CHIPS[chipLang] || STARTER_CHIPS.en;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          data-testid="chatbot-window"
          className="fixed z-50 flex flex-col overflow-hidden border-2 border-[color:var(--accent-orange)]/40 shadow-[0_24px_80px_rgba(0,0,0,0.5)]
                     glass-strong
                     bottom-0 right-0 left-0 sm:left-auto sm:bottom-6 sm:right-6
                     sm:w-[400px] h-[100dvh] sm:h-[640px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--border-subtle)] bg-gradient-to-r from-[#FF5722]/15 via-transparent to-[#D4A437]/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-[color:var(--accent-orange)]/50 bg-black/30">
                  <img src={COMPANY.logoUrl} alt="Lipi bot" className="w-full h-full object-contain" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[color:var(--bg-base)] animate-pulse" />
              </div>
              <div className="leading-tight">
                <div className="font-heading text-base tracking-widest text-[color:var(--text-primary)]">
                  LIPI ASSISTANT
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-[color:var(--accent-orange)] font-semibold">
                  Online · {chipLang.toUpperCase()} {session.intent ? `· ${session.intent.toUpperCase()}` : ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                aria-label="Restart chat"
                data-testid="chat-reset"
                title="Restart"
                className="p-2 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors rounded"
              >
                <RotateCcw size={15} />
              </button>
              <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
                aria-label="WhatsApp" data-testid="chat-whatsapp"
                className="p-2 text-[#25D366] hover:bg-[#25D366]/10 transition-colors rounded">
                <MessageCircle size={16} />
              </a>
              <a href={`tel:${COMPANY.phoneRaw}`} aria-label="Call" data-testid="chat-call"
                className="p-2 text-[color:var(--accent-orange)] hover:bg-[color:var(--accent-orange)]/10 transition-colors rounded">
                <Phone size={16} />
              </a>
              <button onClick={onClose} aria-label="Close chat" data-testid="chat-close"
                className="p-2 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[color:var(--bg-base)]" data-testid="chat-messages">
            {messages.map((m, i) => (
              <MessageBubble key={i} msg={m} />
            ))}
            {typing && <TypingDots />}
          </div>

          {/* Chips: step-specific OR starter */}
          {(stepChips.length > 0 || showStarter) && (
            <div className="px-3 py-2 border-t border-[color:var(--border-subtle)] flex gap-2 overflow-x-auto bg-[color:var(--bg-base)] no-scrollbar">
              {stepChips.length > 0
                ? stepChips.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(c)}
                      data-testid={`chat-step-chip-${i}`}
                      className="whitespace-nowrap text-xs px-3 py-2 border border-[color:var(--brand-gold)]/50 text-[color:var(--brand-gold)] hover:bg-[color:var(--brand-gold)]/10 transition-all font-semibold tracking-wide"
                    >
                      {c}
                    </button>
                  ))
                : starterChips.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(c.text)}
                      data-testid={`chat-chip-${i}`}
                      className="whitespace-nowrap text-xs px-3 py-2 border border-[color:var(--accent-orange)]/40 text-[color:var(--accent-orange)] hover:bg-[color:var(--accent-orange)]/10 transition-all font-semibold tracking-wide"
                    >
                      {c.label}
                    </button>
                  ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2 p-3 border-t border-[color:var(--border-subtle)] bg-[color:var(--bg-base)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              data-testid="chat-input"
              rows={1}
              placeholder={
                chipLang === "ta" ? "உங்கள் கேள்வியை இங்கே எழுதவும்…"
                  : chipLang === "hi" ? "अपना सवाल यहाँ लिखें…"
                  : "Type your question (EN / TA / HI / Tanglish)…"
              }
              className="flex-1 resize-none bg-transparent border border-[color:var(--border-subtle)] focus:border-[color:var(--accent-orange)] px-3 py-2.5 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] max-h-32"
            />
            <button
              onClick={() => sendMessage()}
              data-testid="chat-send"
              aria-label="Send"
              disabled={!input.trim()}
              className="h-11 w-11 grid place-items-center bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white hover:shadow-[0_0_20px_rgba(255,87,34,0.55)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MessageBubble = ({ msg }) => {
  const isBot = msg.role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${isBot ? "" : "flex-row-reverse"}`}
    >
      <div className={`h-8 w-8 shrink-0 rounded-full overflow-hidden border ${isBot ? "border-[color:var(--accent-orange)]/40 bg-black/20" : "border-[color:var(--border-subtle)] bg-[color:var(--bg-elev)]"} grid place-items-center`}>
        {isBot ? (
          <img src={COMPANY.logoUrl} alt="bot" className="w-full h-full object-contain" />
        ) : (
          <User size={14} className="text-[color:var(--text-secondary)]" />
        )}
      </div>
      <div
        className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? "bg-[color:var(--bg-elev)] text-[color:var(--text-primary)] border border-[color:var(--border-subtle)] rounded-r-xl rounded-tl-xl"
            : "bg-gradient-to-br from-[#FF5722] to-[#E64A19] text-white rounded-l-xl rounded-tr-xl"
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  );
};

const TypingDots = () => (
  <div className="flex items-end gap-2">
    <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden border border-[color:var(--accent-orange)]/40 bg-black/20">
      <img src={COMPANY.logoUrl} alt="bot" className="w-full h-full object-contain" />
    </div>
    <div className="bg-[color:var(--bg-elev)] border border-[color:var(--border-subtle)] rounded-r-xl rounded-tl-xl px-4 py-3 flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-[color:var(--accent-orange)] animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="h-2 w-2 rounded-full bg-[color:var(--accent-orange)] animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="h-2 w-2 rounded-full bg-[color:var(--accent-orange)] animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

export default ChatbotWindow;
