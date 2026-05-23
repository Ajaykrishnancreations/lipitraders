import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ChevronRight, Shield } from "lucide-react";
import { COMPANY, HERO_VISUAL } from "../../data/site";
import { Sparks, FloatingParticles, SpinningGear } from "./Sparks";
import { useLanguage } from "../../hooks/useLanguage";
import JobImg from "../../assets/job.jpeg";

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen pt-28 lg:pt-32 pb-12 hero-gradient overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
      <FloatingParticles count={20} />

      {/* Background big text */}
      <div className="absolute -top-4 left-0 right-0 text-center pointer-events-none select-none overflow-hidden">
        <span className="font-heading text-[18vw] sm:text-[14vw] text-white/[0.025] tracking-widest whitespace-nowrap">
          IRON · SCRAP · STEEL
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-testid="hero-since-badge"
            className="inline-flex items-center gap-3 px-4 py-2 border border-[#D4A437]/40 bg-[#D4A437]/5 mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-[#D4A437] animate-pulse" />
            <span className="text-xs tracking-[0.3em] font-semibold text-[#D4A437]">{t.common.since2010}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            data-testid="hero-heading"
            className="font-heading text-5xl sm:text-6xl lg:text-8xl leading-[0.95] tracking-wide uppercase"
          >
            <span className="block text-metallic">{t.hero.h1a}</span>
            <span className="block text-white">{t.hero.h1b}</span>
            <span className="block">
              <span className="text-gold-metallic">{t.hero.h1c1}</span>{" "}
              <span className="text-[#FF5722] stat-glow">{t.hero.h1c2}</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-6 max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed"
            data-testid="hero-subtitle"
          >
            {t.hero.subtitle1}{" "}
            <span className="text-white font-semibold">{t.hero.subtitleHL}</span>
            {t.hero.subtitle2}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contact"
              data-testid="hero-cta-contact"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white px-8 py-5 font-heading tracking-[0.25em] text-lg hover:shadow-[0_0_36px_rgba(255,87,34,0.6)] hover:-translate-y-1 transition-all"
            >
              {t.common.contactUs}
              <ChevronRight className="transition-transform group-hover:translate-x-1" size={20} />
            </a>
            <a
              href={`https://wa.me/${COMPANY.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-cta-whatsapp"
              className="group inline-flex items-center justify-center gap-3 border border-white/20 text-white px-8 py-5 font-heading tracking-[0.25em] text-lg hover:bg-white hover:text-black hover:-translate-y-1 transition-all"
            >
              <MessageCircle size={20} />
              {t.common.whatsappNow}
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl"
          >
            {t.hero.trust.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                data-testid={`trust-badge-${i}`}
                className="glass p-4 sm:p-5 border-l-2 border-l-[#FF5722]"
              >
                <div className="font-heading text-3xl sm:text-4xl text-white stat-glow">{b.value}</div>
                <div className="text-[10px] sm:text-xs tracking-widest uppercase text-gray-400 mt-1 font-semibold">
                  {b.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT: industrial visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="lg:col-span-5 relative h-[420px] sm:h-[520px] lg:h-[640px]"
        >
          <div className="absolute -top-6 -right-6 opacity-80"><SpinningGear size={140} strokeColor="#FF5722" /></div>
          <div className="absolute bottom-10 -left-10 opacity-60"><SpinningGear size={100} reverse strokeColor="#D4A437" /></div>

          <div className="absolute inset-4 sm:inset-6 glass overflow-hidden img-zoom border-2 border-white/10">
            <img src={HERO_VISUAL} alt="Industrial scrap operations" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050507] via-transparent to-transparent" />
            <Sparks count={14} />

            <div className="absolute top-4 left-4 right-4 flex justify-between items-start text-[10px] tracking-widest font-semibold uppercase">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 border border-[#FF5722]/40">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722] animate-pulse" />
                <span className="text-[#FF5722]">{t.hero.liveYard}</span>
              </div>
              <div className="bg-black/60 backdrop-blur px-3 py-1.5 border border-white/10 text-gray-300">
                BATCH #LP-2025
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass p-4 border-l-2 border-[#FF5722]">
                <div className="flex items-center gap-3">
                  <Shield className="text-[#FF5722]" size={22} />
                  <div>
                    <div className="font-heading text-xl text-white tracking-wider">{t.hero.isoYard}</div>
                    <div className="text-[10px] tracking-widest text-gray-400 uppercase">{t.hero.isoSub}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full glass border-2 border-[#D4A437]/40 flex flex-col items-center justify-center text-center"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          >
            <div className="font-heading text-4xl text-gold-metallic leading-none">15+</div>
            <div className="text-[9px] tracking-widest text-gray-300 mt-1 font-semibold">{t.hero.yearsTrusted}</div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-[10px] tracking-[0.4em] font-semibold flex flex-col items-center gap-2"
      >
        <span>{t.common.scroll}</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#FF5722] to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
