// Google Apps Script CRM connector
// Posts inquiry + chatbot leads to Google Sheets via the Apps Script web app.
// Uses no-cors fan-and-forget — Apps Script writes the row server-side.

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxQB1lz4IM9N6IF5M5JSxKvzAhvgrG3WbVH-fgOY8gRIxL3XM9FW3qsaSUgGkPkQard/exec";

const postToSheet = async (data) => {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Sheet post failed (non-blocking):", e);
    return false;
  }
};

export const saveInquiry = ({ firstName, lastName, email, phone, message }) =>
  postToSheet({
    type: "inquiry",
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    phone: phone || "",
    message: message || "",
  });

export const saveChatbotLead = ({
  name = "",
  phone = "",
  whatsapp = "",
  email = "",
  message = "",
  language = "",
  intent = "",
  scrapType = "",
  quantity = "",
  location = "",
  fullConversation = "",
  saveStatus = "",
}) => {
  if (!phone && !whatsapp && !email) return false;
  return postToSheet({
    type: "chatbot",
    name,
    phone,
    whatsapp: whatsapp || phone,
    email,
    // Keep "message" populated for backward compatibility (legacy Apps Script).
    message: message || fullConversation,
    language,
    intent,
    scrapType,
    quantity,
    location,
    fullConversation,
    saveStatus,
    sourceUrl: typeof window !== "undefined" ? window.location.href : "",
    browser: typeof navigator !== "undefined" ? navigator.userAgent : "",
    deviceType:
      typeof window !== "undefined" && window.innerWidth < 768
        ? "Mobile"
        : "Desktop",
  });
};
