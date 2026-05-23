import React from "react";
import { MessageCircle } from "lucide-react";
import { COMPANY } from "../../data/site";

const WhatsAppFab = () => {
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp}?text=Hello%20Lipi%20Traders%2C%20I%20have%20an%20inquiry.`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-fab"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full grid place-items-center bg-[#25D366] text-black shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
      style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
    >
      <MessageCircle size={26} strokeWidth={2} />
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
    </a>
  );
};

export default WhatsAppFab;
