import React from "react";
import { motion } from "framer-motion";
import { Anvil, Hammer, Cog, Factory, Wrench, Truck, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const ICONS = [Anvil, Hammer, Cog, Factory, Wrench, Truck];

const Materials = () => {
  const { t } = useLanguage();
  return (
    <section id="materials" data-testid="materials-section" className="relative py-24 lg:py-32 bg-[#08090C] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF5722]/10 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mb-16 grid md:grid-cols-12 gap-8 items-end"
        >
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] font-semibold text-[#FF5722] uppercase mb-3">
              <span className="h-px w-10 bg-[#FF5722]" />
              {t.materials.kicker}
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide leading-[0.95]">
              <span className="text-metallic">{t.materials.h1}</span>
              <span className="block text-white">{t.materials.h2} <span className="text-gold-metallic">{t.materials.h3}</span></span>
            </h2>
          </div>
          <div className="md:col-span-5 text-gray-400 text-base sm:text-lg">{t.materials.sub}</div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {t.materials.items.map((m, i) => {
            const Ic = ICONS[i] || Wrench;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                data-testid={`material-card-${i}`}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="glow-card glass p-7 sm:p-8 relative group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="h-14 w-14 grid place-items-center bg-gradient-to-br from-[#FF5722]/15 to-[#D4A437]/10 border border-white/10">
                    <Ic className="text-[#FF5722]" size={26} strokeWidth={1.5} />
                  </div>
                  <span className="font-heading text-xs text-[#FF5722]/50 tracking-widest">M.0{i + 1}</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl tracking-wide uppercase text-white mb-3">{m.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">{m.desc}</p>
                <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#FF5722] font-semibold">
                  {t.common.enquire}
                  <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Materials;
