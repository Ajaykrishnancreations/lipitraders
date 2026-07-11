import React from "react";
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook, Linkedin } from "lucide-react";
import { COMPANY } from "../../data/site";
import { useLanguage } from "../../hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  const NAV = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.materials, href: "#materials" },
    { label: t.nav.gallery, href: "#gallery" },
    { label: t.nav.contact, href: "#contact" },
  ];
  return (
    <footer data-testid="site-footer" className="relative bg-[#040406] border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#FF5722]/8 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-8">
        <div className="grid lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img src={COMPANY.logoUrl} alt="Lipi Traders"
                className="h-14 w-14 object-contain drop-shadow-[0_0_18px_rgba(212,164,55,0.4)]" />
              <div>
                <div className="font-heading text-2xl text-gold-metallic tracking-widest">LIPI TRADERS</div>
                <div className="text-[10px] tracking-[0.3em] text-gray-400 font-semibold">{COMPANY.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">{t.footer.tagline}</p>

            <div className="flex items-center gap-3 mt-6">
              {[Facebook, Instagram, Linkedin].map((Ic, i) => (
                <a key={i} href="#" data-testid={`social-${i}`} aria-label={`social-${i}`}
                  className="h-10 w-10 grid place-items-center border border-white/10 text-gray-400 hover:text-[#FF5722] hover:border-[#FF5722]/50 transition-all">
                  <Ic size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="font-heading text-xl tracking-widest text-white mb-5">{t.footer.quickLinks}</div>
            <ul className="space-y-3">
              {NAV.map((l, i) => (
                <li key={i}>
                  <a href={l.href} data-testid={`footer-link-${i}`}
                    className="text-sm text-gray-400 hover:text-[#FF5722] tracking-wide transition-colors">
                    → {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="font-heading text-xl tracking-widest text-white mb-5">{t.footer.getInTouch}</div>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex gap-3">
                <MapPin className="text-[#FF5722] shrink-0 mt-0.5" size={16} />
                <span className="leading-relaxed">{COMPANY.address}</span>
              </div>
              <a href={`mailto:${COMPANY.email}`} className="flex gap-3 hover:text-[#FF5722] transition-colors">
                <Mail className="text-[#FF5722] shrink-0 mt-0.5" size={16} />
                <span>{COMPANY.email}</span>
              </a>
              <a href={`tel:${COMPANY.phoneRaw}`} className="flex gap-3 hover:text-[#FF5722] transition-colors">
                <Phone className="text-[#FF5722] shrink-0 mt-0.5" size={16} />
                <span>{COMPANY.phone}</span>
              </a>
              <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 bg-[#25D366] text-black px-4 py-2.5 font-heading tracking-[0.2em] text-xs hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all">
                <MessageCircle size={14} /> {t.footer.chatWhatsapp}
              </a>
            </div>
          </div>
        </div>

        <div className="py-10 border-b border-white/10 text-center">
          <div className="font-heading text-[18vw] sm:text-[12vw] lg:text-[10vw] leading-none tracking-widest text-metallic select-none">
            LIPI TRADERS
          </div>
          <div className="mt-2 text-xs sm:text-sm tracking-[0.6em] uppercase font-semibold text-[#D4A437]">
            · IRON · SCRAP · STEEL ·
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>© {new Date().getFullYear()} Lipi Traders. {t.footer.rights}</div>
          <div className="tracking-[0.3em] uppercase font-semibold">
            {t.footer.crafted} <span className="text-[#FF5722]">{t.footer.craftedHL}</span> {t.footer.craftedEnd}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 text-[10px] sm:text-xs text-gray-500 leading-relaxed text-center">
          <span className="font-semibold tracking-widest uppercase text-gray-400">{t.footer.alsoKnownFor} </span>
          LIPI Iron Traders · Scrap Iron Dealers Coimbatore · Iron Scrap Buyers · Best Scrap Dealers in Coimbatore ·
          MS Steel Suppliers · Industrial Scrap Sale · Trusted Iron Traders · Scrap Metal Experts ·
          Steel Materials Supply · Iron &amp; Steel Traders · Metal Scrap Buyers · Bulk Scrap Purchase ·
          Scrap Pickup Available · MS Scrap · Steel Scrap · Heavy Melting Scrap · Machinery Scrap Dealers ·
          Factory Waste Buyers · Industrial Waste Disposal · Coimbatore Scrap Dealers · Tamil Nadu Scrap Buyers
        </div>
      </div>
    </footer>
  );
};

export default Footer;
