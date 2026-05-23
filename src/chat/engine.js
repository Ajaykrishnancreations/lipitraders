// LIPI TRADERS — conversational sales-executive chat engine
// State machine: IDLE → ASK_NAME → ASK_CONTACT → ASK_TYPE → ASK_QUANTITY → ASK_LOCATION → COMPLETED
// Languages: en, ta, hi, tanglish

// ======= LANGUAGE DETECTION =======
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[?!.,;:'"()\[\]{}\-_/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const detectLang = (text) => {
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  const t = norm(text);
  const tang = [
    "enna","iruka","irukka","iruku","irukku","irukha","ille","illa","epdi","eppadi",
    "panringa","panreenga","panneenga","panunga","pannunga","panna","pannu",
    "venum","vendum","venam","vanga","vangureenga","edukur","edukureenga","edukuringala","edukreengla",
    "anupunga","kudupeenga","kudunga","unga","enga","engaa","neenga","naanga","naan",
    "vanakkam","nandri","kada","oru","sollu","sollunga","ku","inniku","inruraikku","inraikku",
    "ah","aa","nu","la","da","da","thaan","thaane","irukunga"
  ];
  let h = 0;
  for (const w of tang) if (new RegExp("\\b" + w + "\\b").test(t)) h++;
  if (h >= 1) return "tanglish";
  return "en";
};
const respKey = (l) => (l === "ta" ? "ta" : l === "hi" ? "hi" : l === "tanglish" ? "tanglish" : "en");

// ======= CONTACT / NAME EXTRACTION =======
const PHONE_RE = /(?:\+?91[\s-]?)?[6-9]\d{9}/g;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const WHATSAPP_RE = /whatsapp[:\s-]*((?:\+?91[\s-]?)?[6-9]\d{9})/gi;
const NAME_RE =
  /(?:my\s+name\s+is|naan(?:um)?|this\s+is|myself|i\s+am|i'?m|en\s+per(?:u)?|என்\s+பெயர்|நான்|मेरा\s+नाम|मैं|main)\s+([A-Za-z\u0B80-\u0BFF\u0900-\u097F][A-Za-z\u0B80-\u0BFF\u0900-\u097F\s]{0,30}?)(?=[.,!?\n]|\s+\d|\s*$)/i;
const cleanNum = (s) => (s || "").replace(/[\s-]/g, "");

export const extractContacts = (text) => {
  if (!text) return { phone: "", whatsapp: "", email: "", name: "" };
  const phones = text.match(PHONE_RE) || [];
  const emails = text.match(EMAIL_RE) || [];
  const wa = [...text.matchAll(WHATSAPP_RE)].map((m) => m[1]);
  const nm = text.match(NAME_RE);
  return {
    phone: cleanNum(phones[0] || ""),
    whatsapp: cleanNum(wa[0] || phones[0] || ""),
    email: emails[0] || "",
    name: nm ? nm[1].trim() : "",
  };
};

// Best-effort name extraction in ASK_NAME state
const extractFreeName = (text) => {
  const nm = text.match(NAME_RE);
  if (nm) return nm[1].trim();
  // strip common fillers
  const stripped = text
    .replace(/^(hi|hello|hey|hai|namaste|vanakkam|sir|madam|mr|ms|its|it'?s)\s+/i, "")
    .replace(/[^A-Za-z\u0B80-\u0BFF\u0900-\u097F\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!stripped) return "";
  const words = stripped.split(" ").filter((w) => w.length > 1);
  return words.slice(0, 3).join(" ");
};

// ======= INTENT DETECTION (Buy / Sell / FAQ) =======
const BUYER_PATTERNS = [
  /\b(i\s+(?:want|need|require|am\s+looking|would\s+like)\b|need\b|want\b|require\b|looking\s+for|purchase|buy(?:ing)?\b|supply|send\s+me|do\s+you\s+have|available\s*\??|in\s+stock|can\s+i\s+buy)\b/i,
  /\b(venum|vendum|venam|kavanama|kuduppingala|kudunga)\b/i,
  /\biron\s+(material|venum|venam|piece|item)\b|\bsteel\s+venum\b|\bms\s+(scrap\s+)?(venum|need|want)\b/i,
  /चाहिए|खरीद/i,
];
const SELLER_PATTERNS = [
  /\b(i\s+(?:want|wish|need|would\s+like|have|got)\s+to\s+sell|sell|selling|sale\b|i\s+have|i\s+got|we\s+have|got\s+(scrap|iron|steel)|old\s+(iron|machinery|scrap))\b/i,
  /\b(edukureenga|edukureengala|edukreenga|edukreengla|edukuringala|edukurenga|edukuvenga|vangureenga|vangureengala|kollureenga)\b/i,
  /\b(scrap|iron|steel|machinery|factory\s+waste)\s+(iruku|irukku|irukunga|iruka\?)/i,
  /बेचना|बेच/i,
  /விற்க|விற்பன/i,
];

const FAQ_PATTERNS = [
  { id: "pricing", re: [
    /\b(rate|price|cost|how\s*much|per\s*kg|kg\s*rate|today.{0,6}rate|quotation|quote|market\s*rate)\b/i,
    /விலை|ரேட்/i,
    /रेट|कीमत|दाम/i,
    /\b(rate\s*enna|enna\s*rate|kg\s*rate|inniku\s*rate)\b/i,
  ]},
  { id: "gst", re: [/\bgst\b/i, /\bbill(ing)?\b/i, /\binvoice\b/i, /जी\s*एस\s*टी/i, /\b(gst\s*iruka|gst\s*irukka|gst\s*irka)\b/i] },
  { id: "transport", re: [
    /\b(pickup|pick\s*up|delivery|transport|lorry|truck|vehicle)\b/i,
    /பிக்கப்|லாரி/i,
    /पिकअप|डिलीवरी/i,
    /\b(pickup\s*iruka|lorry\s*anupu|anupunga)\b/i,
  ]},
  { id: "address", re: [
    /\b(address|location|where|office|shop|directions|map)\b/i,
    /முகவரி|எங்கே|எங்க/i,
    /पता|कहाँ/i,
    /\b(office\s*enga|kada\s*enga|enga\s*iruka)\b/i,
  ]},
  { id: "contact", re: [
    /\b(contact|phone\s*number|whatsapp|wa\s*number|sivakumar|founder|owner)\b/i,
    /தொடர்பு|தொலைபேசி/i,
    /फ़ोन|नंबर|संपर्क/i,
  ]},
  { id: "hours", re: [
    /\b(time|hours|open|opening|close|working\s*hour)\b/i,
    /நேரம்|திற/i,
    /समय|खुलने/i,
    /\b(eppo\s*open|time\s*enna)\b/i,
  ]},
  { id: "materials", re: [
    /\b(what\s*materials|materials|items|types\s*of|what\s*scrap|categories)\b/i,
    /என்ன\s*பொருள்|என்ன\s*வகை/i,
    /किस\s*तरह/i,
    /\b(enna\s*item|enna\s*scrap|enna\s*ellam)\b/i,
  ]},
  { id: "greeting", re: [/^(hi|hello|hey|hai|hii|helo)\b/i, /வணக்கம்/i, /नमस्ते/i, /vanakkam/i] },
  { id: "thanks", re: [/\b(thanks|thank you|thx|ty|tnq)\b/i, /நன்றி/i, /धन्यवाद/i, /\bnandri\b/i] },
];

const matches = (patterns, text) => {
  const t = norm(text);
  return patterns.some((p) => p.test(text) || p.test(t));
};

export const detectIntent = (text) => {
  // Buy/Sell first
  const isBuy = matches(BUYER_PATTERNS, text);
  const isSell = matches(SELLER_PATTERNS, text);
  if (isBuy && !isSell) return { type: "buy" };
  if (isSell && !isBuy) return { type: "sell" };
  // FAQ
  for (const f of FAQ_PATTERNS) {
    if (matches(f.re, text)) return { type: "faq", faq: f.id };
  }
  if (isBuy && isSell) return { type: "ambiguous" };
  return { type: "unknown" };
};

// ======= STATIC RESPONSES (4 langs) =======
const R = {
  greeting_open: {
    en: "Hi 👋 Welcome to LIPI TRADERS.\nHow can I help you today — do you want to **buy** scrap, **sell** scrap, or ask something else?",
    ta: "வணக்கம் 👋 LIPI TRADERS-க்கு வரவேற்கிறோம்.\nஎப்படி உதவலாம் — scrap **வாங்க** வேண்டுமா, **விற்க** வேண்டுமா, அல்லது வேறு கேள்வி இருக்கா?",
    hi: "नमस्ते 👋 LIPI TRADERS में आपका स्वागत है।\nमैं कैसे मदद करूँ — scrap **खरीदना** है, **बेचना** है या कुछ और पूछना है?",
    tanglish: "Hi 👋 LIPI TRADERS ku வரவேற்கிறோம்.\nEpdi help pannalam — scrap **vanga** venuma, **sell** panna venuma, illa vera question iruka?",
  },
  step_name_buy: {
    en: "Yes ✅ We have iron and metal scrap materials available.\n\nPlease tell me your name.",
    ta: "ஆம் ✅ எங்களிடம் iron மற்றும் metal scrap materials கிடைக்கும்.\n\nதயவுசெய்து உங்கள் பெயரைச் சொல்லுங்கள்.",
    hi: "हाँ ✅ हमारे पास iron और metal scrap materials उपलब्ध हैं।\n\nकृपया अपना नाम बताइए।",
    tanglish: "Yes ✅ Enga kitta iron and metal scrap materials available iruku.\n\nPlease unga name sollunga.",
  },
  step_name_sell: {
    en: "Sure ✅ We buy all types of scrap materials.\n\nPlease tell me your name.",
    ta: "நிச்சயமாக ✅ அனைத்து வகையான scrap materials-ஐயும் வாங்குகிறோம்.\n\nதயவுசெய்து உங்கள் பெயரைச் சொல்லுங்கள்.",
    hi: "बिल्कुल ✅ हम सभी प्रकार के scrap materials खरीदते हैं।\n\nकृपया अपना नाम बताइए।",
    tanglish: "Sure ✅ Ella type scrap materials-um vaanguvom.\n\nPlease unga name sollunga.",
  },
  step_contact: {
    en: "Nice to meet you {name} 😊\n\nPlease share:\n• Phone number\n• WhatsApp number\n• OR Email ID",
    ta: "சந்தித்ததில் மகிழ்ச்சி {name} 😊\n\nதயவுசெய்து பகிரவும்:\n• Phone number\n• WhatsApp number\n• அல்லது Email ID",
    hi: "आपसे मिलकर खुशी हुई {name} 😊\n\nकृपया share करें:\n• Phone number\n• WhatsApp number\n• या Email ID",
    tanglish: "Nice to meet you {name} 😊\n\nPlease share pannunga:\n• Phone number\n• WhatsApp number\n• Illa Email ID",
  },
  step_type_buy: {
    en: "Thank you {name} ✅\n\nWhat type of scrap material are you looking for?\n• MS Scrap\n• Iron Scrap\n• Steel Scrap\n• Machinery Scrap\n• Factory Scrap",
    ta: "நன்றி {name} ✅\n\nஎன்ன வகையான scrap material தேவை?\n• MS Scrap\n• Iron Scrap\n• Steel Scrap\n• Machinery Scrap\n• Factory Scrap",
    hi: "धन्यवाद {name} ✅\n\nआपको कौन सा scrap material चाहिए?\n• MS Scrap\n• Iron Scrap\n• Steel Scrap\n• Machinery Scrap\n• Factory Scrap",
    tanglish: "Thank you {name} ✅\n\nEnna type scrap material venum?\n• MS Scrap\n• Iron Scrap\n• Steel Scrap\n• Machinery Scrap\n• Factory Scrap",
  },
  step_type_sell: {
    en: "Thank you {name} ✅\n\nWhat type of scrap do you want to sell?\n• Iron Scrap\n• Factory Scrap\n• Old Machinery\n• Steel Scrap\n• Metal Waste",
    ta: "நன்றி {name} ✅\n\nஎன்ன வகையான scrap-ஐ விற்க விரும்புகிறீர்கள்?\n• Iron Scrap\n• Factory Scrap\n• Old Machinery\n• Steel Scrap\n• Metal Waste",
    hi: "धन्यवाद {name} ✅\n\nआप कौन सा scrap बेचना चाहते हैं?\n• Iron Scrap\n• Factory Scrap\n• Old Machinery\n• Steel Scrap\n• Metal Waste",
    tanglish: "Thank you {name} ✅\n\nEnna type scrap sell panna venum?\n• Iron Scrap\n• Factory Scrap\n• Old Machinery\n• Steel Scrap\n• Metal Waste",
  },
  step_quantity_buy: {
    en: "Got it 👍\n\nHow much quantity do you need? (kg / ton / bulk quantity)",
    ta: "புரிந்தது 👍\n\nஎவ்வளவு quantity தேவை? (kg / ton / bulk)",
    hi: "ठीक है 👍\n\nआपको कितनी मात्रा चाहिए? (kg / ton / bulk)",
    tanglish: "Got it 👍\n\nEvvalavu quantity venum? (kg / ton / bulk)",
  },
  step_quantity_sell: {
    en: "Got it 👍\n\nApproximately how much quantity do you have? (kg / ton)",
    ta: "புரிந்தது 👍\n\nஉங்களிடம் தோராயமாக எவ்வளவு quantity இருக்கிறது? (kg / ton)",
    hi: "ठीक है 👍\n\nलगभग कितनी मात्रा है आपके पास? (kg / ton)",
    tanglish: "Got it 👍\n\nUnga kitta approx evvalavu quantity iruku? (kg / ton)",
  },
  step_location_buy: {
    en: "Okay 👍\n\nPlease share your delivery location or city.",
    ta: "சரி 👍\n\nஉங்கள் delivery இடம் அல்லது நகரத்தைப் பகிரவும்.",
    hi: "ठीक है 👍\n\nकृपया अपनी delivery location या city बताइए।",
    tanglish: "Okay 👍\n\nUnga delivery location illa city sollunga.",
  },
  step_location_sell: {
    en: "Okay 👍\n\nPlease share your pickup location / city.",
    ta: "சரி 👍\n\nஉங்கள் pickup இடம் / நகரத்தைப் பகிரவும்.",
    hi: "ठीक है 👍\n\nकृपया अपनी pickup location / city बताइए।",
    tanglish: "Okay 👍\n\nUnga pickup location / city sollunga.",
  },
  done_buy: {
    en: "Perfect ✅\n\nOur team will check availability and contact you shortly.\n\nIf urgent, please contact directly:\n📞 Sivakumar (Founder)\n📱 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
    ta: "சிறப்பு ✅\n\nஎங்கள் குழு கிடைக்கும் நிலையைச் சரிபார்த்து உங்களை விரைவில் தொடர்பு கொள்ளும்.\n\nஅவசரம் என்றால் நேரடியாகத் தொடர்பு கொள்ளவும்:\n📞 சிவகுமார் (நிறுவனர்)\n📱 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
    hi: "बहुत बढ़िया ✅\n\nहमारी टीम availability चेक करके आपसे जल्द संपर्क करेगी।\n\nज़रूरी हो तो सीधे संपर्क करें:\n📞 शिवकुमार (संस्थापक)\n📱 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
    tanglish: "Perfect ✅\n\nEnga team availability check panni udane contact pannuvanga.\n\nUrgent na direct ah contact pannunga:\n📞 Sivakumar (Founder)\n📱 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
  },
  done_sell: {
    en: "Thank you {name} ✅\n\nOur team will contact you shortly for pricing and pickup details.\n\nDirect contact:\n📞 +91 96555 87877",
    ta: "நன்றி {name} ✅\n\nஎங்கள் குழு pricing மற்றும் pickup details-ஐப் பகிர விரைவில் உங்களைத் தொடர்பு கொள்ளும்.\n\nநேரடி தொடர்பு:\n📞 +91 96555 87877",
    hi: "धन्यवाद {name} ✅\n\nहमारी टीम pricing और pickup के लिए जल्द संपर्क करेगी।\n\nसीधा संपर्क:\n📞 +91 96555 87877",
    tanglish: "Thank you {name} ✅\n\nEnga team pricing and pickup details ku udane contact pannuvanga.\n\nDirect contact:\n📞 +91 96555 87877",
  },
  reask_name: {
    en: "Could you please tell me your name to continue?",
    ta: "தொடர உங்கள் பெயரை சொல்ல முடியுமா?",
    hi: "आगे बढ़ने के लिए कृपया अपना नाम बताइए?",
    tanglish: "Unga name konjam sollunga, continue pannuvom?",
  },
  reask_contact: {
    en: "I need a phone, WhatsApp number or email to forward your request to Sivakumar. Please share any one 😊",
    ta: "உங்கள் கோரிக்கையை சிவகுமாருக்கு அனுப்ப ஒரு phone, WhatsApp number அல்லது email தேவை. ஏதேனும் ஒன்றைப் பகிரவும் 😊",
    hi: "आपकी request शिवकुमार जी तक भेजने के लिए phone, WhatsApp या email चाहिए। कोई एक share कीजिए 😊",
    tanglish: "Unga request Sivakumar sir ku anupa oru phone, WhatsApp illa email venum. Edhuvachum onnu share pannunga 😊",
  },
  reask_type: { en: "Which scrap material exactly — Iron, MS, Steel, Machinery or Factory waste?",
    ta: "எந்த scrap material — Iron, MS, Steel, Machinery அல்லது Factory waste?",
    hi: "कौन सा scrap — Iron, MS, Steel, Machinery या Factory waste?",
    tanglish: "Enna scrap exactly — Iron, MS, Steel, Machinery illa Factory waste?",
  },
  reask_quantity: { en: "Roughly what quantity? (e.g. 500 kg, 2 tons, bulk)",
    ta: "தோராயமாக எவ்வளவு quantity? (e.g. 500 kg, 2 tons, bulk)",
    hi: "लगभग कितनी मात्रा? (e.g. 500 kg, 2 tons, bulk)",
    tanglish: "Roughly evvalavu quantity? (e.g. 500 kg, 2 tons, bulk)",
  },
  reask_location: { en: "Which city or area should we pick up / deliver to?",
    ta: "எந்த நகரம் / பகுதியிலிருந்து pickup / delivery வேண்டும்?",
    hi: "किस city / area में pickup / delivery चाहिए?",
    tanglish: "Enna city / area la pickup / delivery venum?",
  },
  ambiguous: { en: "Got it 👍 Do you want to **buy** scrap from us or **sell** scrap to us?",
    ta: "புரிந்தது 👍 எங்களிடம் scrap **வாங்க** வேண்டுமா அல்லது எங்களுக்கு scrap **விற்க** வேண்டுமா?",
    hi: "ठीक है 👍 क्या आप हमसे scrap **खरीदना** चाहते हैं या हमें scrap **बेचना** चाहते हैं?",
    tanglish: "Got it 👍 Enga kitta scrap **vanga** venuma illa enga ku scrap **sell** panna venuma?",
  },
  // FAQ short answers used during flow detours
  faq: {
    pricing: {
      en: "Scrap rates change daily with market & material grade. Share your phone/WhatsApp and our team will send today's exact rate.",
      ta: "Scrap விலை சந்தை & தரத்துக்கேற்ப தினமும் மாறும். Phone/WhatsApp பகிர்ந்தால் இன்றைய ரேட்டை எங்கள் குழு அனுப்பும்.",
      hi: "Scrap के रेट रोज़ बदलते हैं (बाज़ार और ग्रेड के अनुसार)। Phone/WhatsApp share करें, हमारी टीम आज का रेट भेज देगी।",
      tanglish: "Rate market and grade based ah daily change aagum. Phone/WhatsApp share pannina today rate enga team anupp uvanga.",
    },
    gst: {
      en: "We offer both GST and non-GST billing ✅",
      ta: "GST மற்றும் non-GST பில்லிங் இரண்டுமே உண்டு ✅",
      hi: "GST और non-GST दोनों billing उपलब्ध है ✅",
      tanglish: "GST and non-GST rendum option iruku ✅",
    },
    transport: {
      en: "Yes — pickup with our trucks/cranes available across Tamil Nadu, usually within 24 hours 🚛",
      ta: "ஆம் — எங்கள் டிரக்/கிரேன் கொண்டு தமிழ்நாடு முழுவதும் pickup உண்டு, பொதுவாக 24 மணி நேரத்தில் 🚛",
      hi: "हाँ — हमारे truck/crane से तमिलनाडु भर में pickup, आम तौर पर 24 घंटे में 🚛",
      tanglish: "Aamaa — namma truck/crane vechi Tamil Nadu full ah pickup, usually 24 hours kulla 🚛",
    },
    address: {
      en: "📍 LIPI TRADERS, 214/1P, Anjugam Nagar, Chinnavedampatti, Coimbatore – 641049",
      ta: "📍 LIPI TRADERS, 214/1P, அஞ்சுகம் நகர், சின்னவேடம்பட்டி, கோயம்புத்தூர் – 641049",
      hi: "📍 LIPI TRADERS, 214/1P, अंजुगम नगर, चिन्नवेदम्पट्टी, कोयंबटूर – 641049",
      tanglish: "📍 LIPI TRADERS, 214/1P, Anjugam Nagar, Chinnavedampatti, Coimbatore – 641049",
    },
    contact: {
      en: "📞 Sivakumar (Founder): +91 96555 87877\n💬 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
      ta: "📞 சிவகுமார் (நிறுவனர்): +91 96555 87877\n💬 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
      hi: "📞 शिवकुमार (संस्थापक): +91 96555 87877\n💬 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
      tanglish: "📞 Sivakumar sir: +91 96555 87877\n💬 WhatsApp: +91 96555 87877\n📧 sivakumar@lipi-traders.com",
    },
    hours: {
      en: "🕘 Mon–Sat, 9 AM – 7 PM. Sundays by appointment.",
      ta: "🕘 திங்கள்–சனி, காலை 9 – மாலை 7. ஞாயிறு appointment.",
      hi: "🕘 सोम–शनि, सुबह 9 – शाम 7. रविवार appointment से.",
      tanglish: "🕘 Monday–Saturday, காலை 9 – மாலை 7. Sunday appointment.",
    },
    materials: {
      en: "We handle: Iron · Steel/MS · Machinery · Factory Waste · Industrial Metal · Heavy Equipment · Cast Iron · GI Sheets.",
      ta: "நாங்கள் கையாள்வது: Iron · Steel/MS · Machinery · Factory Waste · Industrial Metal · Heavy Equipment · Cast Iron · GI Sheets.",
      hi: "हम संभालते हैं: Iron · Steel/MS · Machinery · Factory Waste · Industrial Metal · Heavy Equipment · Cast Iron · GI Sheets.",
      tanglish: "Namma handle pannuvathu: Iron · Steel/MS · Machinery · Factory Waste · Industrial Metal · Heavy Equipment · Cast Iron · GI Sheets.",
    },
    greeting: {
      en: "Hi 👋 How can I help — do you want to **buy** or **sell** scrap?",
      ta: "வணக்கம் 👋 எப்படி உதவலாம் — scrap **வாங்க** வேண்டுமா, **விற்க** வேண்டுமா?",
      hi: "नमस्ते 👋 कैसे मदद करूँ — scrap **खरीदना** है या **बेचना** है?",
      tanglish: "Hi 👋 Epdi help pannalam — scrap **vanga** venuma illa **sell** panna venuma?",
    },
    thanks: {
      en: "You're welcome! 🙏 For urgent help: +91 96555 87877.",
      ta: "வரவேற்கிறேன்! 🙏 அவசரத்துக்கு: +91 96555 87877.",
      hi: "स्वागत है! 🙏 ज़रूरी हो तो: +91 96555 87877.",
      tanglish: "Nandri! 🙏 Urgent na: +91 96555 87877.",
    },
  },
  unknown: {
    en: "I'll help you with that 😊\n\nPlease share your phone or WhatsApp number — our team will contact you shortly.",
    ta: "அதற்கு உதவுகிறேன் 😊\n\nதயவுசெய்து உங்கள் phone அல்லது WhatsApp number பகிரவும் — எங்கள் குழு விரைவில் தொடர்பு கொள்ளும்.",
    hi: "मैं उसमें मदद करूँगा 😊\n\nकृपया phone या WhatsApp number share करें — हमारी टीम जल्द संपर्क करेगी।",
    tanglish: "Adhuku help pannuren 😊\n\nUnga phone illa WhatsApp number share pannunga — enga team udane contact pannuvanga.",
  },
};

const fmt = (tpl, vars = {}) =>
  Object.keys(vars).reduce((s, k) => s.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k] || ""), tpl);

// ======= QUICK CHIPS =======
export const STARTER_CHIPS = {
  en: [
    { label: "🛒 Buy Scrap", text: "I want to buy scrap" },
    { label: "💰 Sell Scrap", text: "I want to sell scrap" },
    { label: "📈 Scrap Rate", text: "What is today's scrap rate?" },
    { label: "🚚 Pickup", text: "Do you offer pickup?" },
    { label: "🧾 GST", text: "Do you provide GST bill?" },
    { label: "📍 Location", text: "Where is your office?" },
    { label: "📞 Contact", text: "Share Sivakumar's contact" },
  ],
  ta: [
    { label: "🛒 வாங்க", text: "எனக்கு scrap வேண்டும்" },
    { label: "💰 விற்க", text: "எனக்கு scrap விற்க வேண்டும்" },
    { label: "📈 விலை", text: "இன்றைய scrap விலை என்ன?" },
    { label: "🚚 பிக்கப்", text: "பிக்கப் இருக்கா?" },
    { label: "🧾 GST", text: "GST பில் கொடுப்பீங்களா?" },
    { label: "📍 முகவரி", text: "உங்க office எங்கே?" },
    { label: "📞 தொடர்பு", text: "சிவகுமார் number கொடுங்க" },
  ],
  hi: [
    { label: "🛒 खरीदें", text: "मुझे scrap खरीदना है" },
    { label: "💰 बेचें", text: "मुझे scrap बेचना है" },
    { label: "📈 रेट", text: "आज का scrap रेट क्या है?" },
    { label: "🚚 पिकअप", text: "क्या pickup मिलता है?" },
    { label: "🧾 GST", text: "क्या GST बिल देते हैं?" },
    { label: "📍 पता", text: "आपका office कहाँ है?" },
    { label: "📞 संपर्क", text: "शिवकुमार जी का नंबर दें" },
  ],
  tanglish: [
    { label: "🛒 Vanga", text: "Enaku scrap vanga venum" },
    { label: "💰 Sell", text: "Enaku scrap sell panna venum" },
    { label: "📈 Rate", text: "Inniku scrap rate enna?" },
    { label: "🚚 Pickup", text: "Pickup iruka?" },
    { label: "🧾 GST", text: "GST bill kudupeengala?" },
    { label: "📍 Address", text: "Unga office enga iruku?" },
    { label: "📞 Contact", text: "Sivakumar sir number kudunga" },
  ],
};

// Step-specific chips
export const STEP_CHIPS = {
  ASK_TYPE: ["MS Scrap", "Iron Scrap", "Steel Scrap", "Machinery", "Factory Waste"],
  ASK_QUANTITY: ["500 kg", "1 ton", "5 tons", "10+ tons", "Bulk"],
};

// ======= SESSION =======
export const initSession = (siteLang = "en") => ({
  state: "IDLE",
  intent: "", // "buy" | "sell"
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  scrapType: "",
  quantity: "",
  location: "",
  language: respKey(siteLang),
  conversation: [], // {role, text}[]
  saveStatus: null, // null | "partial" | "complete"
});

const FLOW_STATES = new Set(["ASK_NAME","ASK_CONTACT","ASK_TYPE","ASK_QUANTITY","ASK_LOCATION"]);

const merge = (s, p) => ({ ...s, ...p });

const formatFullConversation = (conv) =>
  conv.map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`).join("\n");

const buildLead = (s) => ({
  name: s.name,
  phone: s.phone,
  whatsapp: s.whatsapp || s.phone,
  email: s.email,
  intent: s.intent || "general",
  scrapType: s.scrapType,
  quantity: s.quantity,
  location: s.location,
  language: s.language,
  fullConversation: formatFullConversation(s.conversation),
  message: [s.intent, s.scrapType, s.quantity, s.location].filter(Boolean).join(" · "),
});

// ======= MAIN: processInput =======
/**
 * @param {string} userText
 * @param {object} session
 * @returns {{ reply: string, session: object, save: null|"partial"|"complete", lead: object|null, chips: string[] }}
 */
export const processInput = (userText, session) => {
  const text = (userText || "").trim();
  if (!text) return { reply: "", session, save: null, lead: null, chips: [] };

  const lang = detectLang(text);
  const rk = respKey(lang);
  const s = merge(session, { language: rk });
  // append user turn
  s.conversation = [...(s.conversation || []), { role: "user", text }];

  const contacts = extractContacts(text);
  const intent = detectIntent(text);

  let reply = "";
  let save = null;
  let chips = [];

  // --- Allow user to restart by stating new buy/sell while completed ---
  if (s.state === "COMPLETED" && (intent.type === "buy" || intent.type === "sell")) {
    // start a fresh flow but keep prior name/contact
    const fresh = initSession(rk);
    fresh.name = s.name; fresh.phone = s.phone; fresh.whatsapp = s.whatsapp; fresh.email = s.email;
    fresh.conversation = s.conversation;
    return processInput(text, fresh);
  }

  switch (s.state) {
    case "IDLE": {
      if (intent.type === "buy") {
        s.intent = "buy";
        s.state = "ASK_NAME";
        reply = R.step_name_buy[rk];
      } else if (intent.type === "sell") {
        s.intent = "sell";
        s.state = "ASK_NAME";
        reply = R.step_name_sell[rk];
      } else if (intent.type === "ambiguous") {
        reply = R.ambiguous[rk];
      } else if (intent.type === "faq") {
        reply = (R.faq[intent.faq] || R.faq.greeting)[rk];
        // For high-value FAQs, nudge into the flow
        if (intent.faq === "pricing" || intent.faq === "transport") {
          reply += "\n\n" + R.ambiguous[rk];
        }
      } else {
        // Unknown / general
        reply = R.unknown[rk];
      }
      break;
    }

    case "ASK_NAME": {
      // Detour: if FAQ pattern matches, answer it AND re-ask
      if (intent.type === "faq") {
        reply = (R.faq[intent.faq] || R.faq.greeting)[rk] + "\n\n" + R.reask_name[rk];
        break;
      }
      const candidate = contacts.name || extractFreeName(text);
      if (candidate && candidate.length >= 2 && candidate.length <= 40) {
        s.name = candidate;
        s.state = "ASK_CONTACT";
        // If they already shared a contact in the same line, jump ahead
        if (contacts.phone || contacts.email) {
          s.phone = contacts.phone || s.phone;
          s.whatsapp = contacts.whatsapp || s.phone || s.whatsapp;
          s.email = contacts.email || s.email;
          s.state = "ASK_TYPE";
          save = "partial";
          reply = fmt(s.intent === "sell" ? R.step_type_sell[rk] : R.step_type_buy[rk], { name: s.name });
          chips = STEP_CHIPS.ASK_TYPE;
        } else {
          reply = fmt(R.step_contact[rk], { name: s.name });
        }
      } else {
        reply = R.reask_name[rk];
      }
      break;
    }

    case "ASK_CONTACT": {
      if (intent.type === "faq") {
        reply = (R.faq[intent.faq] || R.faq.greeting)[rk] + "\n\n" + R.reask_contact[rk];
        break;
      }
      if (contacts.phone || contacts.email) {
        s.phone = contacts.phone || s.phone;
        s.whatsapp = contacts.whatsapp || s.phone || s.whatsapp;
        s.email = contacts.email || s.email;
        s.state = "ASK_TYPE";
        save = "partial"; // capture lead even if they bail after this
        reply = fmt(s.intent === "sell" ? R.step_type_sell[rk] : R.step_type_buy[rk], { name: s.name });
        chips = STEP_CHIPS.ASK_TYPE;
      } else {
        reply = R.reask_contact[rk];
      }
      break;
    }

    case "ASK_TYPE": {
      if (intent.type === "faq" && !looksLikeScrapType(text)) {
        reply = (R.faq[intent.faq] || R.faq.greeting)[rk] + "\n\n" + R.reask_type[rk];
        chips = STEP_CHIPS.ASK_TYPE;
        break;
      }
      s.scrapType = cleanShort(text);
      s.state = "ASK_QUANTITY";
      reply = s.intent === "sell" ? R.step_quantity_sell[rk] : R.step_quantity_buy[rk];
      chips = STEP_CHIPS.ASK_QUANTITY;
      break;
    }

    case "ASK_QUANTITY": {
      if (intent.type === "faq" && !looksLikeQuantity(text)) {
        reply = (R.faq[intent.faq] || R.faq.greeting)[rk] + "\n\n" + R.reask_quantity[rk];
        chips = STEP_CHIPS.ASK_QUANTITY;
        break;
      }
      s.quantity = cleanShort(text);
      s.state = "ASK_LOCATION";
      reply = s.intent === "sell" ? R.step_location_sell[rk] : R.step_location_buy[rk];
      break;
    }

    case "ASK_LOCATION": {
      if (intent.type === "faq" && !looksLikeLocation(text)) {
        reply = (R.faq[intent.faq] || R.faq.greeting)[rk] + "\n\n" + R.reask_location[rk];
        break;
      }
      s.location = cleanShort(text);
      s.state = "COMPLETED";
      save = "complete";
      reply = fmt(s.intent === "sell" ? R.done_sell[rk] : R.done_buy[rk], { name: s.name });
      break;
    }

    case "COMPLETED":
    default: {
      // After completion → answer FAQ / nudge
      if (intent.type === "faq") {
        reply = (R.faq[intent.faq] || R.faq.greeting)[rk];
      } else if (contacts.phone || contacts.email) {
        // Additional contact info — update and confirm
        s.phone = contacts.phone || s.phone;
        s.whatsapp = contacts.whatsapp || s.phone || s.whatsapp;
        s.email = contacts.email || s.email;
        reply = R.faq.thanks[rk];
      } else {
        reply = R.unknown[rk];
      }
      break;
    }
  }

  // Append bot turn to conversation
  s.conversation = [...s.conversation, { role: "bot", text: reply }];
  s.saveStatus = save || s.saveStatus;

  const lead = save ? buildLead(s) : null;
  return { reply, session: s, save, lead, chips };
};

// Heuristics so FAQ words inside scrapType/quantity/location aren't misinterpreted
const SCRAP_WORDS = /\b(iron|steel|ms|machinery|factory|metal|brass|copper|aluminium|cast|gi|sheet|plate|pipe|wire|coil|rod|bar)\b/i;
const QTY_WORDS = /\b(kg|kgs|ton|tons|tonne|tonnes|quintal|bulk|small|large|truckload)\b|\d/i;
const looksLikeScrapType = (t) => SCRAP_WORDS.test(t);
const looksLikeQuantity = (t) => QTY_WORDS.test(t);
const looksLikeLocation = (t) => /\b(coimbatore|chennai|madurai|salem|tirupur|erode|trichy|bangalore|hyderabad|hosur|pollachi|near|district|city|town|nagar|tamil\s*nadu|kerala|karnataka)\b/i.test(t) || t.length >= 3;

const cleanShort = (t) => t.replace(/\s+/g, " ").trim().slice(0, 120);

// ======= BACKWARDS-COMPAT (used by older code paths) =======
export const QUICK_CHIPS = STARTER_CHIPS;
export const BOT_INTRO = {
  en: R.greeting_open.en,
  ta: R.greeting_open.ta,
  hi: R.greeting_open.hi,
  tanglish: R.greeting_open.tanglish,
};
export const WELCOME_BUBBLE = {
  en: "Hi! 👋 How can I help you today?",
  ta: "வணக்கம்! 👋 எப்படி உதவ முடியும்?",
  hi: "नमस्ते! 👋 मैं कैसे मदद करूँ?",
};
