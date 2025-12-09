import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Persian number conversion
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNumber(num: number | string): string {
  return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

export function formatPersianNumber(num: number | string): string {
  return toPersianNumber(num);
}

// Currency formatting (Iranian Rial/Toman)
export function formatCurrency(amount: number, showUnit: boolean = true): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return showUnit ? `${formatted} تومان` : formatted;
}

// Format date to Persian
export function formatPersianDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'امروز';
  if (diffDays === 1) return 'دیروز';
  if (diffDays < 7) return `${toPersianNumber(diffDays)} روز پیش`;
  if (diffDays < 30) return `${toPersianNumber(Math.floor(diffDays / 7))} هفته پیش`;
  return formatPersianDate(date);
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  if (phone.length === 11) {
    return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7)}`;
  }
  return phone;
}
