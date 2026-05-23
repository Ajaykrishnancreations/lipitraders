import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { getCookie, setCookie } from "../../lib/cookies";

const COOKIE = "lipi-lang-prompted";

const detectSuggested = () => {
  if (typeof navigator === "undefined") return null;
  const candidates = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
  for (const c of candidates) {
    const code = c.toLowerCase().split("-")[0];
    if (code === "ta") return "ta";
    if (code === "hi") return "hi";
  }
  return null;
};

// Inline mini-translations for the prompt itself (so it speaks the suggested language)
const PROMPT_COPY = {
  ta: {
    welcome: "வணக்கம்",
    detect: "உங்கள் உலாவி தமிழில் உள்ளது.",
    ask: "இந்த தளத்தை தமிழில் பார்க்க விரும்புகிறீர்களா?",
    yes: "ஆம், தமிழுக்கு மாற்று",
    no: "ஆங்கிலத்தில் தொடரு",
  },
  hi: {
    welcome: "नमस्ते",
    detect: "आपका ब्राउज़र हिन्दी में है।",
    ask: "क्या आप इस साइट को हिन्दी में देखना चाहेंगे?",
    yes: "हाँ, हिन्दी पर बदलें",
    no: "अंग्रेज़ी रखें",
  },
};

const LanguagePrompt = () => {
  const { lang, setLang } = useLanguage();
  const [suggested, setSuggested] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getCookie(COOKIE)) return;
    const s = detectSuggested();
    if (s && s !== lang) {
      setSuggested(s);
      // small delay so it doesn't slam on first paint
      const id = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(id);
    } else {
      // Set cookie anyway so we don't keep recomputing
      setCookie(COOKIE, "1", 365);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = (accept) => {
    if (accept && suggested) setLang(suggested);
    setCookie(COOKIE, "1", 365);
    setOpen(false);
  };

  if (!suggested) return null;
  const c = PROMPT_COPY[suggested];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center px-4"
          style={{ background: "rgba(5, 5, 7, 0.7)", backdropFilter: "blur(8px)" }}
          data-testid="lang-prompt-overlay"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
            className="relative w-full max-w-md glass-strong border-2 border-[color:var(--accent-orange)]/40 p-7 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
            data-testid="lang-prompt"
          >
            <button
              onClick={() => dismiss(false)}
              aria-label="Close"
              data-testid="lang-prompt-close"
              className="absolute top-3 right-3 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] p-2"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 grid place-items-center bg-[color:var(--accent-orange)]/15 border border-[color:var(--accent-orange)]/40">
                <Languages className="text-[color:var(--accent-orange)]" size={22} />
              </div>
              <div>
                <div className="font-heading text-2xl tracking-widest text-[color:var(--text-primary)]">
                  {c.welcome}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[color:var(--text-secondary)]">
                  Welcome · वेलकम · வரவேற்பு
                </div>
              </div>
            </div>

            <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed mb-1">
              {c.detect}
            </p>
            <p className="text-base text-[color:var(--text-primary)] leading-relaxed mb-6">
              {c.ask}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => dismiss(true)}
                data-testid="lang-prompt-accept"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white py-3.5 px-5 font-heading tracking-[0.2em] text-sm uppercase hover:shadow-[0_0_24px_rgba(255,87,34,0.55)] hover:-translate-y-0.5 transition-all"
              >
                {c.yes}
              </button>
              <button
                onClick={() => dismiss(false)}
                data-testid="lang-prompt-decline"
                className="flex-1 inline-flex items-center justify-center border border-[color:var(--border-strong)] text-[color:var(--text-primary)] py-3.5 px-5 font-heading tracking-[0.2em] text-sm uppercase hover:bg-[color:var(--text-primary)] hover:text-[color:var(--bg-base)] transition-all"
              >
                {c.no}
              </button>
            </div>

            <div className="mt-5 text-[10px] text-[color:var(--text-muted)] tracking-wider text-center">
              Your choice is saved to a cookie. Change anytime from Settings.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguagePrompt;
