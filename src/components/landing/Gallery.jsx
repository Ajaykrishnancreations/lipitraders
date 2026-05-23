import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GALLERY_IMAGES } from "../../data/site";
import { useLanguage } from "../../hooks/useLanguage";

const Gallery = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % GALLERY_IMAGES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const captions = t.gallery.captions;

  return (
    <section id="gallery" data-testid="gallery-section" className="relative py-24 lg:py-32 bg-[#08090C] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] font-semibold text-[#FF5722] uppercase mb-3">
              <span className="h-px w-10 bg-[#FF5722]" />
              {t.gallery.kicker}
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide">
              <span className="text-metallic">{t.gallery.h1}</span>{" "}
              <span className="text-gold-metallic">{t.gallery.h2}</span>{" "}
              <span className="text-white">{t.gallery.h3}</span>
            </h2>
          </div>
          <p className="text-gray-400 text-base sm:text-lg max-w-md">{t.gallery.sub}</p>
        </motion.div>

        {/* Desktop masonry */}
        <div className="hidden md:block">
          <div className="columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
            {GALLERY_IMAGES.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ delay: (i % 4) * 0.08 }}
                data-testid={`gallery-item-${i}`}
                className="relative group break-inside-avoid overflow-hidden glass border border-white/10 img-zoom"
                style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "5/4" }}
              >
                <img src={g.src} alt={captions[i] || g.caption} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-90"
                  style={{ "--tw-gradient-from": "rgba(0,0,0,0.85)" }} />
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#FF5722] mb-1">
                    #{String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="font-heading text-xl tracking-wider" style={{ color: "#FFFFFF" }}>
                    {captions[i] || g.caption}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="relative h-[420px] overflow-hidden glass border border-white/10">
            {GALLERY_IMAGES.map((g, i) => (
              <motion.div key={i} initial={false}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.05 }}
                transition={{ duration: 0.8 }} className="absolute inset-0"
              >
                <img src={g.src} alt={captions[i] || g.caption} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                  style={{ "--tw-gradient-from": "rgba(0,0,0,0.85)" }} />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#FF5722] mb-1">
                    #{String(i + 1).padStart(2, "0")} / {GALLERY_IMAGES.length}
                  </div>
                  <div className="font-heading text-2xl tracking-wider" style={{ color: "#FFFFFF" }}>
                    {captions[i] || g.caption}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {GALLERY_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} data-testid={`gallery-dot-${i}`}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 transition-all ${active === i ? "w-8 bg-[#FF5722]" : "w-3 bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
