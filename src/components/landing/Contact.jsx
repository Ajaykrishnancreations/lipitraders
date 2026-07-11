import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Phone, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { COMPANY } from "../../data/site";
import { useLanguage } from "../../hooks/useLanguage";
import { saveInquiry } from "../../lib/sheets";

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Fire-and-forget save to Google Sheets (no-cors, won't block UX)
    saveInquiry(form);

    const subject = encodeURIComponent(`Inquiry from ${form.firstName} ${form.lastName}`);
    const body = encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    }, 4000);
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-[#FF5722]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] font-semibold text-[#FF5722] uppercase mb-3">
            <span className="h-px w-10 bg-[#FF5722]" />
            {t.contact.kicker}
            <span className="h-px w-10 bg-[#FF5722]" />
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide">
            <span className="text-metallic">{t.contact.h1}</span>{" "}
            <span className="text-[#FF5722]">{t.contact.h2}</span>
          </h2>
          <p className="mt-5 text-gray-400 text-base sm:text-lg">{t.contact.sub}</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="lg:col-span-7 glass p-6 sm:p-10 relative"
          >
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-10 grid place-items-center bg-black/90 backdrop-blur-xl"
                >
                  <div className="text-center px-6">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className="mx-auto h-20 w-20 rounded-full bg-[#FF5722]/10 border-2 border-[#FF5722] grid place-items-center mb-4"
                    >
                      <CheckCircle2 className="text-[#FF5722]" size={42} />
                    </motion.div>
                    <h3 className="font-heading text-3xl tracking-widest text-white mb-2">{t.contact.successTitle}</h3>
                    <p className="text-sm text-gray-400">{t.contact.successDesc}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} data-testid="contact-form" className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-400 mb-2 block">{t.contact.firstName}</label>
                  <input name="firstName" required value={form.firstName} onChange={onChange} data-testid="contact-first-name"
                    className="w-full bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FF5722] transition-colors font-sans"
                    placeholder={t.contact.placeholders.firstName} />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-400 mb-2 block">{t.contact.lastName}</label>
                  <input name="lastName" required value={form.lastName} onChange={onChange} data-testid="contact-last-name"
                    className="w-full bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FF5722] transition-colors font-sans"
                    placeholder={t.contact.placeholders.lastName} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-400 mb-2 block">{t.contact.email}</label>
                  <input type="email" name="email" required value={form.email} onChange={onChange} data-testid="contact-email"
                    className="w-full bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FF5722] transition-colors font-sans"
                    placeholder={t.contact.placeholders.email} />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-400 mb-2 block">{t.contact.phone}</label>
                  <input name="phone" value={form.phone} onChange={onChange} data-testid="contact-phone"
                    className="w-full bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FF5722] transition-colors font-sans"
                    placeholder={t.contact.placeholders.phone} />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-400 mb-2 block">{t.contact.message}</label>
                <textarea name="message" required rows={5} value={form.message} onChange={onChange} data-testid="contact-message"
                  className="w-full bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FF5722] transition-colors font-sans resize-none"
                  placeholder={t.contact.placeholders.message} />
              </div>

              <button type="submit" data-testid="contact-submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white px-10 py-4 font-heading tracking-[0.25em] text-lg hover:shadow-[0_0_36px_rgba(255,87,34,0.55)] hover:-translate-y-0.5 transition-all">
                <Send size={18} /> {t.common.sendInquiry}
              </button>
            </form>
          </motion.div>

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            <div className="glass p-7">
              <div className="font-heading text-2xl tracking-widest text-gold-metallic mb-1">{COMPANY.name}</div>
              <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-400">{COMPANY.tagline}</div>

              <div className="mt-7 space-y-5">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 grid place-items-center bg-[#FF5722]/10 border border-[#FF5722]/30">
                    <MapPin className="text-[#FF5722]" size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-500 mb-1">{t.contact.infoAddress}</div>
                    <div className="text-sm text-gray-300 leading-relaxed">{COMPANY.address}</div>
                  </div>
                </div>

                {[COMPANY.email, COMPANY.emailAlt].filter(Boolean).map((email, index) => (
                  <a key={email} href={`mailto:${email}`} data-testid={index === 0 ? "info-email" : "info-email-alt"} className="flex gap-4 group">
                    <div className="h-10 w-10 shrink-0 grid place-items-center bg-[#FF5722]/10 border border-[#FF5722]/30">
                      <Mail className="text-[#FF5722]" size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-500 mb-1">{t.contact.infoEmail}</div>
                      <div className="text-sm text-gray-300 group-hover:text-[#FF5722] transition-colors">{email}</div>
                    </div>
                  </a>
                ))}

                <a href={`tel:${COMPANY.phoneRaw}`} data-testid="info-phone" className="flex gap-4 group">
                  <div className="h-10 w-10 shrink-0 grid place-items-center bg-[#FF5722]/10 border border-[#FF5722]/30">
                    <Phone className="text-[#FF5722]" size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-500 mb-1">{t.contact.infoPhone}</div>
                    <div className="text-sm text-gray-300 group-hover:text-[#FF5722] transition-colors">{COMPANY.phone}</div>
                  </div>
                </a>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <a href={`tel:${COMPANY.phoneRaw}`} data-testid="info-call-btn"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white px-4 py-3 font-heading tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all">
                  <Phone size={14} /> {t.common.call}
                </a>
                <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer" data-testid="info-whatsapp-btn"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-black px-4 py-3 font-heading tracking-[0.2em] text-xs hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all">
                  <MessageCircle size={14} /> {t.common.whatsapp}
                </a>
              </div>
            </div>

            <div className="glass p-5 border-l-2 border-[#D4A437]">
              <div className="font-heading text-xl tracking-widest text-gold-metallic mb-1">{t.contact.openHours}</div>
              <div className="text-sm text-gray-300">{t.contact.hours}</div>
              <div className="text-xs text-gray-500 mt-1">{t.contact.hoursSub}</div>
            </div>
          </motion.div>
        </div>

        {/* MAP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          data-testid="map-section"
          className="mt-10 glass border-2 border-white/10 overflow-hidden h-[380px] sm:h-[480px] relative"
        >
          <iframe
            title="Lipi Traders Location"
            src="https://www.google.com/maps?q=Lipi+Traders+Chinnavedampatti+Coimbatore+641049&output=embed"
            width="100%" height="100%"
            style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg) contrast(0.95) saturate(0.7)" }}
            loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute top-4 left-4 glass-strong px-4 py-3 border-l-2 border-[#FF5722] pointer-events-none">
            <div className="font-heading text-lg tracking-widest text-white">{t.contact.findUs}</div>
            <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-gray-300">{t.contact.findUsSub}</div>
          </div>
          <a href={COMPANY.mapsLink} target="_blank" rel="noopener noreferrer" data-testid="open-maps-link"
            className="absolute top-4 right-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5722] to-[#E64A19] px-4 py-2.5 text-xs font-heading tracking-[0.2em] text-white hover:shadow-[0_0_24px_rgba(255,87,34,0.5)] transition-all">
            {t.common.openInMaps}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
