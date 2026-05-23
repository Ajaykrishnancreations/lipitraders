import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { COMPANY } from "../../data/site";
import { useLanguage } from "../../hooks/useLanguage";
import SettingsMenu from "./SettingsMenu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const NAV = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.materials, href: "#materials" },
    { label: t.nav.gallery, href: "#gallery" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        <a href="#home" data-testid="nav-logo" className="flex items-center gap-3 group">
          <img
            src={COMPANY.logoUrl}
            alt="Lipi Traders"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain drop-shadow-[0_0_12px_rgba(212,164,55,0.35)] group-hover:drop-shadow-[0_0_20px_rgba(255,87,34,0.5)] transition-all"
          />
          <div className="hidden sm:block leading-tight">
            <div className="font-heading text-2xl text-gold-metallic tracking-widest">LIPI TRADERS</div>
            <div className="text-[10px] tracking-[0.3em] text-gray-400 font-semibold">
              IRON · SCRAP · STEEL
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((l, i) => (
            <a
              key={i}
              href={l.href}
              data-testid={`nav-link-${i}`}
              className="text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-[#FF5722] transition-colors relative group"
            >
              {l.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#FF5722] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SettingsMenu variant="desktop" />
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            data-testid="nav-call-btn"
            className="hidden md:inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white text-xs font-heading tracking-[0.2em] hover:shadow-[0_0_24px_rgba(255,87,34,0.55)] hover:-translate-y-0.5 transition-all"
          >
            <Phone size={14} /> {t.nav.callNow}
          </a>
          <button
            onClick={() => setOpen(!open)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
            className="lg:hidden p-2 text-[color:var(--text-primary)] hover:text-[#FF5722] transition-colors"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-strong border-t border-white/5"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-2">
              {NAV.map((l, i) => (
                <motion.a
                  key={i}
                  href={l.href}
                  data-testid={`nav-mobile-link-${i}`}
                  onClick={() => setOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-3 border-b border-white/5 font-heading text-2xl tracking-widest text-gray-200 hover:text-[#FF5722] flex items-center justify-between"
                >
                  <span>{l.label}</span>
                  <span className="text-[#FF5722] text-xs">0{i + 1}</span>
                </motion.a>
              ))}
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                data-testid="nav-mobile-call"
                className="mt-4 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white py-4 font-heading tracking-[0.2em] hover:shadow-[0_0_24px_rgba(255,87,34,0.55)]"
              >
                <Phone size={16} /> {t.nav.callNow} · {COMPANY.phone}
              </a>
              <div className="mt-3 flex items-center justify-center">
                <SettingsMenu variant="mobile" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
