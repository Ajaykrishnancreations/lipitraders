import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sun, Moon, X, Check } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";

const SettingsMenu = ({ variant = "desktop" }) => {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t, langs } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click / esc
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const buttonClass =
    variant === "desktop"
      ? "relative inline-flex items-center gap-2 h-10 px-3 border border-[color:var(--border-strong)] hover:border-[color:var(--accent-orange)] text-[color:var(--text-primary)] hover:text-[color:var(--accent-orange)] transition-all"
      : "relative inline-flex items-center gap-2 px-4 py-3 border border-[color:var(--border-strong)] hover:border-[color:var(--accent-orange)] text-[color:var(--text-primary)] transition-all";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="settings-toggle"
        aria-label={t.settings.open}
        className={buttonClass}
      >
        <Settings size={16} className={`transition-transform duration-500 ${open ? "rotate-90" : ""}`} />
        <span className="text-[10px] tracking-[0.25em] font-heading uppercase hidden xl:inline">
          {t.settings.title}
        </span>
        <span className="text-[10px] tracking-[0.18em] font-heading uppercase ml-1 text-[color:var(--accent-orange)]">
          {langs.find((l) => l.code === lang)?.short}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`absolute z-50 mt-3 w-72 glass-strong border border-[color:var(--border-subtle)] shadow-2xl ${
              variant === "desktop" ? "right-0" : "left-1/2 -translate-x-1/2"
            }`}
            data-testid="settings-popover"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)]">
              <div className="font-heading text-lg tracking-widest uppercase text-[color:var(--text-primary)]">
                {t.settings.title}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                data-testid="settings-close"
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* THEME */}
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[color:var(--text-secondary)] mb-3">
                  {t.settings.theme}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ThemeOption
                    active={theme === "light"}
                    onClick={() => setTheme("light")}
                    icon={<Sun size={16} />}
                    label={t.settings.light}
                    testid="theme-light"
                  />
                  <ThemeOption
                    active={theme === "dark"}
                    onClick={() => setTheme("dark")}
                    icon={<Moon size={16} />}
                    label={t.settings.dark}
                    testid="theme-dark"
                  />
                </div>
              </div>

              {/* LANGUAGE */}
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[color:var(--text-secondary)] mb-3">
                  {t.settings.language}
                </div>
                <div className="space-y-1.5">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      data-testid={`lang-${l.code}`}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border transition-all text-left ${
                        lang === l.code
                          ? "border-[color:var(--accent-orange)] bg-[color:var(--accent-orange)]/10 text-[color:var(--accent-orange)]"
                          : "border-[color:var(--border-subtle)] hover:border-[color:var(--accent-orange)]/60 text-[color:var(--text-primary)]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-heading text-xs tracking-widest w-7">{l.short}</span>
                        <span className="text-sm">{l.native}</span>
                      </span>
                      {lang === l.code && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-[color:var(--text-muted)] tracking-wider leading-relaxed pt-1">
                Preferences are saved to a cookie on this device.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ThemeOption = ({ active, onClick, icon, label, testid }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className={`flex items-center justify-center gap-2 py-3 border text-xs font-heading tracking-[0.2em] uppercase transition-all ${
      active
        ? "border-[color:var(--accent-orange)] bg-[color:var(--accent-orange)]/10 text-[color:var(--accent-orange)]"
        : "border-[color:var(--border-subtle)] text-[color:var(--text-primary)] hover:border-[color:var(--accent-orange)]/60"
    }`}
  >
    {icon}
    {label}
  </button>
);

export default SettingsMenu;
