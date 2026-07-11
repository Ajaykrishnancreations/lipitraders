import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SERVICE_SELL_IMG } from "../../data/site";
import { SpinningGear, Sparks } from "./Sparks";
import { useLanguage } from "../../hooks/useLanguage";
import PremiumCoils from "../../assets/premiumsteelcoils.jpeg";

const Services = () => {
  const { t } = useLanguage();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg2 = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="services" ref={ref} data-testid="services-section" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] font-semibold text-[#FF5722] uppercase mb-3">
            <span className="h-px w-10 bg-[#FF5722]" />
            {t.services.kicker}
            <span className="h-px w-10 bg-[#FF5722]" />
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide leading-tight">
            <span className="text-metallic">{t.services.h1}</span>{" "}
            <span className="text-[#FF5722]">{t.services.h2}</span>{" "}
            <span className="text-white">{t.services.h3}</span>
          </h2>
          <p className="mt-5 text-gray-400 text-base sm:text-lg">{t.services.sub}</p>
        </motion.div>

        {/* BUY (4/8) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="lg:col-span-4 relative h-[360px] sm:h-[440px] flex items-center justify-center"
          >
            <div className="relative w-full h-full glass border-2 border-white/10 overflow-hidden flex items-center justify-center">
              <Sparks count={10} />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/10 via-transparent to-[#D4A437]/10" />
              <div className="relative">
                <SpinningGear size={260} strokeColor="#FF5722" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <SpinningGear size={120} reverse strokeColor="#D4A437" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 glass-strong px-4 py-3 border-l-2 border-[#FF5722]">
                <div className="font-heading text-xl tracking-widest text-[#FF5722]">{t.services.buy.tag}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gray-300 font-semibold">{t.services.buy.tagSub}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
            data-testid="service-buy" className="lg:col-span-8"
          >
            <div className="text-xs tracking-[0.4em] font-semibold text-[#D4A437] uppercase mb-3">{t.services.buy.sectionTag}</div>
            <h3 className="font-heading text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wide leading-tight mb-6">
              {t.services.buy.title1} <span className="text-[#FF5722]">{t.services.buy.title2}</span> {t.services.buy.title3}
            </h3>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6">{t.services.buy.desc}</p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {t.services.buy.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 className="text-[#FF5722] shrink-0 mt-0.5" size={18} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" data-testid="service-buy-cta"
              className="inline-flex items-center gap-2 text-[#FF5722] font-heading tracking-[0.25em] text-sm uppercase border-b border-[#FF5722]/40 pb-2 hover:border-[#FF5722] transition-all group">
              {t.common.requestPickup}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* SELL (8/4) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            data-testid="service-sell" className="lg:col-span-8 order-2 lg:order-1"
          >
            <div className="text-xs tracking-[0.4em] font-semibold text-[#D4A437] uppercase mb-3">{t.services.sell.sectionTag}</div>
            <h3 className="font-heading text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wide leading-tight mb-6">
              {t.services.sell.title1} <span className="text-[#FF5722]">{t.services.sell.title2}</span> {t.services.sell.title3}
            </h3>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6">{t.services.sell.desc}</p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {t.services.sell.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 className="text-[#FF5722] shrink-0 mt-0.5" size={18} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" data-testid="service-sell-cta"
              className="inline-flex items-center gap-2 text-[#FF5722] font-heading tracking-[0.25em] text-sm uppercase border-b border-[#FF5722]/40 pb-2 hover:border-[#FF5722] transition-all group">
              {t.common.getQuotation}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div style={{ y: yImg2 }} className="lg:col-span-4 order-1 lg:order-2 relative h-[360px] sm:h-[440px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="relative w-full h-full glass border-2 border-white/10 overflow-hidden img-zoom"
            >
              <img src={PremiumCoils} alt="Premium Steel Turnings" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#050507]/80 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 glass-strong px-4 py-3 border-r-2 border-[#FF5722]">
                <div className="font-heading text-xl tracking-widest text-[#FF5722]">{t.services.sell.tag}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gray-300 font-semibold text-right">{t.services.sell.tagSub}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
