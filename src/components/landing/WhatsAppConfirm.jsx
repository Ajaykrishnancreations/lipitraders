import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Factory, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

// Intercepts every WhatsApp link on the page (header, hero, contact, footer,
// floating button, chatbot) and asks the visitor to confirm before leaving.
const isWhatsAppLink = (a) => /(^|\/\/)(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(a.href);

const WhatsAppConfirm = () => {
  const { t } = useLanguage();
  const c = t.common.waConfirm;
  const [href, setHref] = useState(null);

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || !isWhatsAppLink(a)) return;
      e.preventDefault();
      e.stopPropagation();
      setHref(a.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const close = useCallback(() => setHref(null), []);
  const go = useCallback(() => {
    if (href) window.open(href, "_blank", "noopener,noreferrer");
    setHref(null);
  }, [href]);

  useEffect(() => {
    if (!href) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [href, close]);

  return (
    <AnimatePresence>
      {href && (
        <motion.div
          key="wa-confirm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 backdrop-blur-sm px-4"
          onClick={close}
          data-testid="wa-confirm-overlay"
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="wa-confirm-title"
            initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-strong border border-white/10 border-t-2 border-t-[#25D366] p-6 sm:p-7 shadow-2xl"
            data-testid="wa-confirm"
          >
            <button onClick={close} aria-label="Close"
              className="absolute top-3 right-3 p-2 text-[color:var(--text-secondary)] hover:text-[#FF5722] transition-colors">
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 grid place-items-center bg-[#25D366]/15 border border-[#25D366]/40">
                <MessageCircle className="text-[#25D366]" size={20} />
              </div>
              <div id="wa-confirm-title" className="font-heading text-2xl tracking-widest text-[color:var(--text-primary)]">
                {c.title}
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">{c.body}</p>
            <div className="mt-4 flex gap-3 p-3 bg-[#FF5722]/10 border border-[#FF5722]/30">
              <Factory className="text-[#FF5722] shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-gray-300 leading-relaxed font-semibold">{c.b2b}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={close} data-testid="wa-confirm-cancel"
                className="inline-flex items-center justify-center border border-white/15 text-[color:var(--text-primary)] px-4 py-3 font-heading tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all">
                {c.cancel}
              </button>
              <button onClick={go} autoFocus data-testid="wa-confirm-go"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-black px-4 py-3 font-heading tracking-[0.2em] text-xs hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all">
                <MessageCircle size={14} /> {c.go}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppConfirm;
