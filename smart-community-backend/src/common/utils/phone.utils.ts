export function normalizePhone(phone: string): string {
  let normalized = phone.replace(/\D/g, '');
  
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(new RegExp(persianDigits[i], 'g'), String(i));
    normalized = normalized.replace(new RegExp(arabicDigits[i], 'g'), String(i));
  }
  
  if (normalized.startsWith('98')) {
    normalized = '0' + normalized.slice(2);
  } else if (normalized.startsWith('+98')) {
    normalized = '0' + normalized.slice(3);
  } else if (!normalized.startsWith('0')) {
    normalized = '0' + normalized;
  }
  
  return normalized;
}

export function isValidIranianPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^09\d{9}$/.test(normalized);
}

export function formatPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.length === 11) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 7)}-${normalized.slice(7)}`;
  }
  return normalized;
}
