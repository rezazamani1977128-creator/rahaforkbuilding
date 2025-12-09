const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toPersianNumber(num: number | string): string {
  return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

export function toEnglishNumber(str: string): string {
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
  }
  return result;
}

export function formatCurrency(amount: number): string {
  return `${toPersianNumber(amount.toLocaleString())} تومان`;
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];
