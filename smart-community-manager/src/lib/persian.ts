// Persian numeral conversion utilities
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toPersianNumber(num: number | string): string {
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

export function toEnglishNumber(str: string): string {
  return str.replace(/[۰-۹]/g, (digit) => {
    return String(persianDigits.indexOf(digit));
  });
}

export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} تومان`;
}

export function formatPriceShort(amount: number): string {
  if (amount >= 1000000000) {
    return `${toPersianNumber((amount / 1000000000).toFixed(1))} میلیارد`;
  }
  if (amount >= 1000000) {
    return `${toPersianNumber((amount / 1000000).toFixed(1))} میلیون`;
  }
  if (amount >= 1000) {
    return `${toPersianNumber((amount / 1000).toFixed(0))} هزار`;
  }
  return toPersianNumber(amount);
}

// Persian month names
export const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

// Persian weekday names
export const persianWeekdays = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

export function formatPersianDate(date: Date): string {
  // Simple date formatting - in production, use a proper Persian calendar library
  const day = toPersianNumber(date.getDate());
  const month = persianMonths[date.getMonth()];
  const year = toPersianNumber(date.getFullYear());
  return `${day} ${month} ${year}`;
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'همین الان';
  if (diffMins < 60) return `${toPersianNumber(diffMins)} دقیقه پیش`;
  if (diffHours < 24) return `${toPersianNumber(diffHours)} ساعت پیش`;
  if (diffDays < 7) return `${toPersianNumber(diffDays)} روز پیش`;
  if (diffDays < 30) return `${toPersianNumber(Math.floor(diffDays / 7))} هفته پیش`;
  return formatPersianDate(date);
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

export function isValidIranianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^09\d{9}$/.test(cleaned);
}
