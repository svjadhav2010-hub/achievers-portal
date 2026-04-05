// lib/utils.ts (or create this file)
export function getWhatsAppLink(phone: string, message?: string): string {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Add country code if not present (assuming India +91)
  const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  
  // Encode message if provided
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  
  return `https://wa.me/${phoneWithCode}${encodedMessage}`;
}