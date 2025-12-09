// Application constants

export const APP_NAME = 'ساختمان من';
export const APP_NAME_EN = 'My Building';
export const APP_VERSION = '1.0.0';

// Persian months
export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Days of week (starting from Saturday for Persian calendar)
export const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
export const PERSIAN_WEEKDAYS_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// User roles
export const USER_ROLES = {
  manager: { label: 'مدیر ساختمان', color: 'bg-primary' },
  board_member: { label: 'عضو هیئت مدیره', color: 'bg-blue-500' },
  owner: { label: 'مالک', color: 'bg-green-500' },
  tenant: { label: 'مستاجر', color: 'bg-gray-500' },
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  paid: { label: 'پرداخت شده', color: 'text-green-600', bgColor: 'bg-green-100' },
  pending: { label: 'در انتظار', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  overdue: { label: 'معوق', color: 'text-red-600', bgColor: 'bg-red-100' },
  failed: { label: 'ناموفق', color: 'text-red-600', bgColor: 'bg-red-100' },
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  online: { label: 'آنلاین', icon: 'CreditCard' },
  card_transfer: { label: 'کارت به کارت', icon: 'Smartphone' },
  cash: { label: 'نقدی', icon: 'Banknote' },
  check: { label: 'چک', icon: 'FileText' },
} as const;

// Expense categories
export const EXPENSE_CATEGORIES = {
  utilities: { label: 'آب و برق و گاز', icon: 'Zap', color: 'bg-yellow-500' },
  maintenance: { label: 'تعمیرات', icon: 'Wrench', color: 'bg-orange-500' },
  cleaning: { label: 'نظافت', icon: 'Sparkles', color: 'bg-blue-500' },
  security: { label: 'نگهبانی', icon: 'Shield', color: 'bg-purple-500' },
  elevator: { label: 'آسانسور', icon: 'ArrowUpDown', color: 'bg-indigo-500' },
  insurance: { label: 'بیمه', icon: 'ShieldCheck', color: 'bg-green-500' },
  administrative: { label: 'اداری', icon: 'FileText', color: 'bg-gray-500' },
  other: { label: 'سایر', icon: 'MoreHorizontal', color: 'bg-slate-500' },
} as const;

// Maintenance categories
export const MAINTENANCE_CATEGORIES = {
  plumbing: { label: 'لوله‌کشی', icon: 'Droplets', color: 'bg-blue-500' },
  electrical: { label: 'برق', icon: 'Zap', color: 'bg-yellow-500' },
  elevator: { label: 'آسانسور', icon: 'ArrowUpDown', color: 'bg-purple-500' },
  hvac: { label: 'تهویه', icon: 'Wind', color: 'bg-cyan-500' },
  common_areas: { label: 'مشاعات', icon: 'Building', color: 'bg-green-500' },
  parking: { label: 'پارکینگ', icon: 'Car', color: 'bg-gray-500' },
  intercom: { label: 'آیفون', icon: 'Phone', color: 'bg-orange-500' },
  other: { label: 'سایر', icon: 'MoreHorizontal', color: 'bg-slate-500' },
} as const;

// Priority levels
export const PRIORITY_LEVELS = {
  urgent: { label: 'اضطراری', color: 'bg-red-500', textColor: 'text-red-600' },
  high: { label: 'بالا', color: 'bg-orange-500', textColor: 'text-orange-600' },
  medium: { label: 'متوسط', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  low: { label: 'پایین', color: 'bg-green-500', textColor: 'text-green-600' },
} as const;

// Request statuses
export const REQUEST_STATUS = {
  new: { label: 'جدید', color: 'bg-blue-500' },
  in_progress: { label: 'در حال انجام', color: 'bg-yellow-500' },
  completed: { label: 'انجام شده', color: 'bg-green-500' },
  cancelled: { label: 'لغو شده', color: 'bg-gray-500' },
} as const;

// Announcement priorities
export const ANNOUNCEMENT_PRIORITY = {
  urgent: { label: 'فوری', color: 'bg-red-500', borderColor: 'border-l-red-500' },
  high: { label: 'مهم', color: 'bg-orange-500', borderColor: 'border-l-orange-500' },
  medium: { label: 'متوسط', color: 'bg-yellow-500', borderColor: 'border-l-yellow-500' },
  low: { label: 'عادی', color: 'bg-green-500', borderColor: 'border-l-green-500' },
} as const;

// File types
export const FILE_TYPES = {
  pdf: { label: 'PDF', color: 'bg-red-500', icon: 'FileText' },
  doc: { label: 'Word', color: 'bg-blue-500', icon: 'FileText' },
  docx: { label: 'Word', color: 'bg-blue-500', icon: 'FileText' },
  xls: { label: 'Excel', color: 'bg-green-500', icon: 'FileSpreadsheet' },
  xlsx: { label: 'Excel', color: 'bg-green-500', icon: 'FileSpreadsheet' },
  jpg: { label: 'Image', color: 'bg-purple-500', icon: 'Image' },
  jpeg: { label: 'Image', color: 'bg-purple-500', icon: 'Image' },
  png: { label: 'Image', color: 'bg-purple-500', icon: 'Image' },
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    verifyOtp: '/api/auth/verify-otp',
    resetPassword: '/api/auth/reset-password',
  },
  buildings: {
    list: '/api/buildings',
    get: '/api/buildings/:id',
    create: '/api/buildings',
    update: '/api/buildings/:id',
  },
  residents: {
    list: '/api/residents',
    get: '/api/residents/:id',
    create: '/api/residents',
    update: '/api/residents/:id',
    delete: '/api/residents/:id',
  },
  charges: {
    list: '/api/charges',
    get: '/api/charges/:id',
    create: '/api/charges',
    update: '/api/charges/:id',
  },
  payments: {
    list: '/api/payments',
    get: '/api/payments/:id',
    create: '/api/payments',
    verify: '/api/payments/:id/verify',
  },
  expenses: {
    list: '/api/expenses',
    get: '/api/expenses/:id',
    create: '/api/expenses',
    update: '/api/expenses/:id',
    delete: '/api/expenses/:id',
    downloadReceipt: '/api/expenses/:id/receipt',
  },
  chargeActions: {
    report: '/api/charges/:id/report',
    reminders: '/api/charges/:id/reminders',
    payments: '/api/charges/:id/payments',
  },
  // Add more endpoints as needed
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  authSession: 'auth_session',
  theme: 'theme',
  sidebarCollapsed: 'sidebar_collapsed',
  lastBuilding: 'last_building',
} as const;
