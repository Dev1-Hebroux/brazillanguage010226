/**
 * Centralized external links and contact info.
 * Update these values when real links are available.
 */

// WhatsApp — set the real number here (international format, no + or spaces)
// Example: "5561999999999" for a Brasília number
export const WHATSAPP_NUMBER = "";

export function whatsappLink(message?: string) {
  const base = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}`
    : "https://wa.me/";
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
}

// Social media
export const SOCIAL_LINKS = {
  instagram: "", // e.g., "https://instagram.com/horizontecafe"
  whatsappGroup: "", // e.g., WhatsApp group invite link
};

// Legal pages — set to real URLs when created
export const LEGAL_LINKS = {
  privacy: "",
  terms: "",
};
