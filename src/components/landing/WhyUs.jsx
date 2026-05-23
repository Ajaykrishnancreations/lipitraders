import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Scale, Truck, Users, Handshake } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const ICONS = [ShieldCheck, TrendingUp, Scale, Truck, Users, Handshake];

const WhyUs = () => {
  const { t } = useLanguage();
  return (
    <section id="why" data-testid="why-section" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] font-semibold text-[#FF5722] uppercase mb-3">
            <span className="h-px w-10 bg-[#FF5722]" />
            {t.why.kicker}
            <span className="h-px w-10 bg-[#FF5722]" />
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide">
            <span className="text-metallic">{t.why.h1}</span>{" "}
            <span className="text-[#FF5722]">{t.why.h2}</span>{" "}
            <span className="text-white">{t.why.h3}</span>{" "}
            <span className="text-gold-metallic">{t.why.h4}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {t.why.items.map((w, i) => {
            const Ic = ICONS[i] || ShieldCheck;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                data-testid={`why-card-${i}`}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="glow-card glass p-7 sm:p-8 relative shimmer-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 grid place-items-center bg-[#FF5722]/10 border border-[#FF5722]/30">
                    <Ic className="text-[#FF5722]" size={22} strokeWidth={1.7} />
                  </div>
                  <span className="font-heading text-xs text-gray-500 tracking-[0.3em]">0{i + 1} / 06</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl tracking-wide uppercase text-white mb-2">{w.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{w.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
