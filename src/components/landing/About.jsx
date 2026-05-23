import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Target, Layers, Zap } from "lucide-react";
import { COMPANY } from "../../data/site";
import { useLanguage } from "../../hooks/useLanguage";

const ICONS = [Award, Target, Layers, Zap];
const STAT_VALUES = [
  { value: 15, suffix: "+" },
  { value: 500, suffix: "+" },
  { value: 1000, suffix: "+" },
  { value: 24, suffix: "/7" },
];

const Counter = ({ value, suffix = "", duration = 1.5 }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    let i = 0, start = 0;
    const steps = 40, end = value, inc = end / steps;
    const id = setInterval(() => {
      i += 1; start += inc;
      if (i >= steps) { setN(end); clearInterval(id); }
      else setN(Math.floor(start));
    }, (duration * 1000) / steps);
    return () => clearInterval(id);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className="font-heading text-5xl sm:text-6xl lg:text-7xl text-white stat-glow">
      {n}<span className="text-[#FF5722]">{suffix}</span>
    </span>
  );
};

const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" data-testid="about-section" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#FF5722]/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-[#D4A437]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] font-semibold text-[#FF5722] uppercase mb-4">
              <span className="h-px w-10 bg-[#FF5722]" />
              {t.about.kicker}
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide leading-[0.95] mb-6">
              <span className="text-metallic">{t.about.h1}</span>
              <span className="block text-white">{t.about.h2}</span>
              <span className="block text-gold-metallic">{t.about.h3}</span>
            </h2>

            <div className="divider-orange mb-6" />

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-5">
              {t.about.p1pre} <span className="text-white font-semibold">{COMPANY.since}</span> {t.about.p1by}{" "}
              <span className="text-[#D4A437] font-semibold">{COMPANY.founder}</span>,{" "}
              <span className="text-white">{COMPANY.name}</span> {t.about.p1post}
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-5">{t.about.p2}</p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">{t.about.p3}</p>

            <div className="mt-8 flex items-center gap-5">
              <img src={COMPANY.logoUrl} alt="Lipi Traders mark"
                className="h-16 w-16 object-contain drop-shadow-[0_0_18px_rgba(212,164,55,0.4)]" />
              <div>
                <div className="font-heading text-2xl text-gold-metallic tracking-widest">— {COMPANY.founder.toUpperCase()}</div>
                <div className="text-xs tracking-[0.3em] uppercase text-gray-400 font-semibold">{t.about.founderRole}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 grid grid-cols-2 gap-5 sm:gap-6"
          >
            {t.about.stats.map((s, i) => {
              const Ic = ICONS[i];
              const v = STAT_VALUES[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  data-testid={`stat-card-${i}`}
                  className="glow-card glass p-6 sm:p-8 relative"
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                >
                  <Ic className="text-[#FF5722] mb-4" size={32} strokeWidth={1.5} />
                  <Counter value={v.value} suffix={v.suffix} />
                  <div className="mt-3 text-xs sm:text-sm tracking-[0.18em] uppercase font-semibold text-gray-400">{s.label}</div>
                  <div className="absolute top-3 right-3 font-heading text-[10px] text-[#FF5722]/40 tracking-widest">0{i + 1}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
