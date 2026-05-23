// Static site data for LIPI TRADERS

// Local asset imports
import Logo from "../assets/LipitradersLogo.png";
import IndustrialScrapLoading from "../assets/industrialScraploading.png";
import SteelFurnaceOperations from "../assets/steelfurnaceoperations.jpeg";
import PremiumSteelCoils from "../assets/premiumsteelcoils.jpeg";
import HeavyCrane from "../assets/heavycraneoperations.jpeg";
import SortedIron from "../assets/Sortedironstockyard.jpeg";
import MachineryScrapyard from "../assets/machineryscrapyard.jpg";
import IndustrialWasteHandling from "../assets/industrialwastehadling.jpeg";
import MoltenSteelPouring from "../assets/moltensteelpouring.jpg";
import JobImg from "../assets/job.jpeg";

export const COMPANY = {
  name: "LIPI TRADERS",
  tagline: "IRON · SCRAP · STEEL",
  since: 2010,
  founder: "Shivakumar",
  city: "Coimbatore",
  address:
    "214/1P, Anjugam Nagar, Chinnavedampatti, Coimbatore – 641049",
  email: "sivakumar@lipi-traders.com",
  phone: "+91 96555 87877",
  phoneRaw: "+919655587877",
  whatsapp: "919655587877",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.0!2d76.99!3d11.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLipi+Traders+Coimbatore!5e0!3m2!1sen!2sin",
  mapsLink: "https://maps.app.goo.gl/kWF8Bx9N8KMx3joe7",
  logoUrl: Logo,
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Materials", href: "#materials" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export const TRUST_BADGES = [
  { value: "15+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "1000+", label: "Tons Processed" },
];

export const STATS = [
  { value: 15, suffix: "+", label: "Years of Industry Mastery" },
  { value: 500, suffix: "+", label: "Industrial Clients Served" },
  { value: 1000, suffix: "+", label: "Tons of Scrap Processed" },
  { value: 24, suffix: "/7", label: "Pickup & Support" },
];

// Client logos
export const CLIENT_LOGOS = [
  { name: "Tata", src: "https://logo.clearbit.com/tata.com" },
  { name: "JSW Group", src: "https://logo.clearbit.com/jsw.in" },
  {
    name: "Larsen & Toubro",
    src: "https://logo.clearbit.com/larsentoubro.com",
  },
  { name: "Bosch", src: "https://logo.clearbit.com/bosch.com" },
  {
    name: "Ashok Leyland",
    src: "https://logo.clearbit.com/ashokleyland.com",
  },
  { name: "Mahindra", src: "https://logo.clearbit.com/mahindra.com" },
  { name: "Hyundai", src: "https://logo.clearbit.com/hyundai.com" },
  { name: "Reliance", src: "https://logo.clearbit.com/ril.com" },
  { name: "TVS Motor", src: "https://logo.clearbit.com/tvsmotor.com" },
];

export const MATERIALS = [
  {
    title: "Iron Scrap",
    desc: "Heavy melting steel, plate cuttings, structural iron offcuts. Sorted, weighed and graded on arrival.",
    icon: "Anvil",
  },
  {
    title: "Steel Scrap",
    desc: "Carbon and alloy steel — turnings, bushelings, busheling bales, sheet and bar drops.",
    icon: "Hammer",
  },
  {
    title: "Machinery Scrap",
    desc: "Decommissioned plant, motors, gearboxes, and CNC machine bodies bought at fair market rate.",
    icon: "Cog",
  },
  {
    title: "Factory Waste",
    desc: "Production line waste, pressing rejects, punching scrap and bulk industrial drops.",
    icon: "Factory",
  },
  {
    title: "Industrial Metal",
    desc: "Cast iron, MS billets, GI sheets, pipes and structural beams of every grade.",
    icon: "Wrench",
  },
  {
    title: "Heavy Equipment",
    desc: "Cranes, JCB parts, dumper bodies, rail axles, and obsolete heavy-equipment scrap.",
    icon: "Truck",
  },
];

export const WHY_US = [
  {
    title: "Trusted Since 2010",
    desc: "Fifteen years of clean dealings with mills, factories and large industries.",
    icon: "ShieldCheck",
  },
  {
    title: "Best Market Price",
    desc: "Live, transparent pricing benchmarked against LME and Indian scrap indices.",
    icon: "TrendingUp",
  },
  {
    title: "Verified Weighing",
    desc: "Certified weighbridge tickets shared with every transaction — zero ambiguity.",
    icon: "Scale",
  },
  {
    title: "Fast Pickup",
    desc: "Own fleet of trucks, cranes and grabbers. Pickup within 24 hours across Tamil Nadu.",
    icon: "Truck",
  },
  {
    title: "Professional Team",
    desc: "Trained material inspectors and segregators. Safety-first crews.",
    icon: "Users",
  },
  {
    title: "Long-Term Partner",
    desc: "Most of our top 50 clients have stayed with us for 5+ years. We earn it.",
    icon: "Handshake",
  },
];

export const HERO_VISUAL = JobImg;

export const HERO = {
  jobImage: JobImg,
};

// Main gallery images
export const GALLERY_IMAGES = [
  {
    src: IndustrialScrapLoading,
    caption: "Industrial scrap loading",
  },
  {
    src: SteelFurnaceOperations,
    caption: "Steel furnace operations",
  },
  {
    src: PremiumSteelCoils,
    caption: "Premium steel coils",
  },
  {
    src: HeavyCrane,
    caption: "Heavy crane operations",
  },
  {
    src: SortedIron,
    caption: "Sorted iron stockyard",
  },
  {
    src: MachineryScrapyard,
    caption: "Machinery at scrapyard",
  },
  {
    src: IndustrialWasteHandling,
    caption: "Industrial waste handling",
  },
  {
    src: MoltenSteelPouring,
    caption: "Molten steel pouring",
  },
];

// Export YARD_IMAGES so components (Gallery.jsx) can import it
export const YARD_IMAGES = [
  IndustrialScrapLoading,
  SteelFurnaceOperations,
  PremiumSteelCoils,
  HeavyCrane,
  SortedIron,
  MachineryScrapyard,
  IndustrialWasteHandling,
  MoltenSteelPouring,
];

// Services
export const SERVICES = [
  {
    id: 1,
    title: "Industrial Scrap Collection",
    image: IndustrialScrapLoading,
    desc: "Efficient scrap collection and transportation services for industries.",
  },
  {
    id: 2,
    title: "Coils Supply",
    image: PremiumSteelCoils,
    desc: "Premium quality steel coils supplied for industrial requirements.",
  },
  {
    id: 3,
    title: "Steel Processing",
    image: SteelFurnaceOperations,
    desc: "Advanced steel processing and furnace operations with quality assurance.",
  },
  {
    id: 4,
    title: "Heavy Equipment Scrap",
    image: HeavyCrane,
    desc: "Handling and recycling of heavy machinery and industrial equipment.",
  },
  {
    id: 5,
    title: "Iron Stockyard Management",
    image: SortedIron,
    desc: "Well-organized iron stockyard with efficient material segregation.",
  },
  {
    id: 6,
    title: "Machinery Scrap Handling",
    image: MachineryScrapyard,
    desc: "Safe dismantling and processing of machinery scrap materials.",
  },
  {
    id: 7,
    title: "Industrial Waste Handling",
    image: IndustrialWasteHandling,
    desc: "Eco-friendly industrial waste management and recycling solutions.",
  },
  {
    id: 8,
    title: "Molten Steel Operations",
    image: MoltenSteelPouring,
    desc: "Professional molten steel handling and metal recovery operations.",
  },
];