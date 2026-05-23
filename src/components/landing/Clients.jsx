import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";

const LOGOS = [
  { name: "TATA", letter: "0.22em" },
  { name: "JSW", letter: "0.18em" },
  { name: "L&T", letter: "0.10em" },
  { name: "BOSCH", letter: "0.25em" },
  { name: "ASHOK LEYLAND", letter: "0.18em" },
  { name: "MAHINDRA", letter: "0.18em" },
  { name: "HYUNDAI", letter: "0.20em" },
  { name: "RELIANCE", letter: "0.18em" },
  { name: "TVS MOTOR", letter: "0.18em" },
  { name: "JINDAL STEEL", letter: "0.18em" },
];

const LogoPlate = ({ logo }) => (
  <div
    data-testid={`client-logo-${logo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
    className="group mx-6 sm:mx-8 flex items-center justify-center h-20 sm:h-24 px-6 py-3 min-w-[180px] border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent hover:border-[#FF5722]/40 hover:from-[#FF5722]/[0.04] transition-all duration-500"
  >
    <span
      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: logo.letter }}
      className="text-xl sm:text-2xl text-gray-500 group-hover:text-white transition-colors duration-500 whitespace-nowrap"
    >
      {logo.name}
    </span>
  </div>
);

const Clients = () => {
  const { t } = useLanguage();
  return (
    <section
      id="clients"
      data-testid="clients-section"
      className="relative py-20 lg:py-28 border-y border-white/5 bg-[#08090C]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] font-semibold text-[#FF5722] uppercase mb-3">
            <span className="h-px w-10 bg-[#FF5722]" />
            {t.clients.kicker}
            <span className="h-px w-10 bg-[#FF5722]" />
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-wide uppercase text-white">
            {t.clients.heading1} <span className="text-gold-metallic">{t.clients.heading2}</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm tracking-[0.2em] uppercase text-gray-500 font-semibold">
            {t.clients.sub}
          </p>
        </motion.div>

        <div className="marquee-mask">
          <Marquee gradient={false} speed={45} pauseOnHover>
            {LOGOS.map((l) => <LogoPlate key={l.name} logo={l} />)}
          </Marquee>
        </div>
        <div className="marquee-mask mt-5">
          <Marquee gradient={false} speed={35} direction="right" pauseOnHover>
            {[...LOGOS].reverse().map((l) => <LogoPlate key={`r-${l.name}`} logo={l} />)}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Clients;
