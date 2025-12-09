// Mock data for the apartment management app

export interface Building {
  id: string;
  name: string;
  address: string;
  units: number;
  floors: number;
  managerId: string;
  createdAt: Date;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'manager' | 'board_member' | 'owner' | 'tenant';
  avatar?: string;
  unitId?: string;
  buildingId: string;
  createdAt: Date;
  paymentStreak: number;
  badges: string[];
}

export interface Unit {
  id: string;
  number: string;
  floor: number;
  area: number;
  coefficient: number;
  buildingId: string;
  ownerId: string;
  tenantId?: string;
  balance: number;
  status: 'paid' | 'pending' | 'overdue';
  parkingSpots: number;
  residentsCount: number;
}

export interface Charge {
  id: string;
  buildingId: string;
  month: number;
  year: number;
  totalAmount: number;
  dueDate: Date;
  createdAt: Date;
  items: ChargeItem[];
  collectionRate: number;
}

export interface ChargeItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  divisionMethod: 'equal' | 'area' | 'coefficient' | 'residents' | 'custom';
}

export interface Payment {
  id: string;
  unitId: string;
  userId: string;
  amount: number;
  method: 'online' | 'card_to_card' | 'cash' | 'check';
  status: 'pending' | 'verified' | 'rejected';
  receiptImage?: string;
  createdAt: Date;
  verifiedAt?: Date;
  chargeId: string;
}

export interface Expense {
  id: string;
  buildingId: string;
  title: string;
  amount: number;
  category: string;
  vendor?: string;
  description?: string;
  receiptImage?: string;
  createdAt: Date;
  approvedBy?: string;
}

export interface Announcement {
  id: string;
  buildingId: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isPinned: boolean;
  createdAt: Date;
  authorId: string;
}

export interface MaintenanceRequest {
  id: string;
  buildingId: string;
  unitId: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  images?: string[];
  createdAt: Date;
  completedAt?: Date;
}

export interface Poll {
  id: string;
  buildingId: string;
  question: string;
  options: PollOption[];
  deadline: Date;
  isAnonymous: boolean;
  quorum: number;
  createdAt: Date;
  authorId: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'payment' | 'announcement' | 'request' | 'system';
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'محمد احمدی',
    phone: '09123456789',
    email: 'mohammad@example.com',
    role: 'manager',
    buildingId: 'b1',
    createdAt: new Date('2023-01-01'),
    paymentStreak: 12,
    badges: ['gold', 'punctual', 'community'],
  },
  {
    id: 'u2',
    name: 'علی رضایی',
    phone: '09129876543',
    role: 'owner',
    unitId: 'unit1',
    buildingId: 'b1',
    createdAt: new Date('2023-02-15'),
    paymentStreak: 8,
    badges: ['silver', 'punctual'],
  },
  {
    id: 'u3',
    name: 'فاطمه محمدی',
    phone: '09121234567',
    role: 'owner',
    unitId: 'unit2',
    buildingId: 'b1',
    createdAt: new Date('2023-03-10'),
    paymentStreak: 6,
    badges: ['bronze'],
  },
  {
    id: 'u4',
    name: 'حسین کریمی',
    phone: '09127654321',
    role: 'tenant',
    unitId: 'unit3',
    buildingId: 'b1',
    createdAt: new Date('2023-04-20'),
    paymentStreak: 3,
    badges: [],
  },
  {
    id: 'u5',
    name: 'زهرا حسینی',
    phone: '09128765432',
    role: 'board_member',
    unitId: 'unit4',
    buildingId: 'b1',
    createdAt: new Date('2023-01-05'),
    paymentStreak: 11,
    badges: ['gold', 'punctual', 'helper'],
  },
  {
    id: 'u6',
    name: 'امیر نوروزی',
    phone: '09126543210',
    role: 'owner',
    unitId: 'unit5',
    buildingId: 'b1',
    createdAt: new Date('2023-05-01'),
    paymentStreak: 0,
    badges: [],
  },
  {
    id: 'u7',
    name: 'مریم صادقی',
    phone: '09123210987',
    role: 'owner',
    unitId: 'unit6',
    buildingId: 'b1',
    createdAt: new Date('2023-06-15'),
    paymentStreak: 4,
    badges: ['bronze'],
  },
  {
    id: 'u8',
    name: 'رضا موسوی',
    phone: '09124567890',
    role: 'tenant',
    unitId: 'unit7',
    buildingId: 'b1',
    createdAt: new Date('2023-07-20'),
    paymentStreak: 2,
    badges: [],
  },
];

// Mock Buildings
export const mockBuildings: Building[] = [
  {
    id: 'b1',
    name: 'برج آسمان',
    address: 'تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲',
    units: 24,
    floors: 8,
    managerId: 'u1',
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'b2',
    name: 'مجتمع گلستان',
    address: 'تهران، سعادت‌آباد، میدان کاج',
    units: 16,
    floors: 4,
    managerId: 'u1',
    createdAt: new Date('2022-06-01'),
  },
  {
    id: 'b3',
    name: 'آپارتمان نسیم',
    address: 'تهران، پونک، خیابان سردار جنگل',
    units: 12,
    floors: 4,
    managerId: 'u1',
    createdAt: new Date('2023-01-01'),
  },
];

// Mock Units
export const mockUnits: Unit[] = [
  { id: 'unit1', number: '۱۰۱', floor: 1, area: 85, coefficient: 1.0, buildingId: 'b1', ownerId: 'u2', balance: 0, status: 'paid', parkingSpots: 1, residentsCount: 3 },
  { id: 'unit2', number: '۱۰۲', floor: 1, area: 120, coefficient: 1.2, buildingId: 'b1', ownerId: 'u3', balance: -450000, status: 'pending', parkingSpots: 2, residentsCount: 4 },
  { id: 'unit3', number: '۲۰۱', floor: 2, area: 95, coefficient: 1.1, buildingId: 'b1', ownerId: 'u4', tenantId: 'u4', balance: -900000, status: 'overdue', parkingSpots: 1, residentsCount: 2 },
  { id: 'unit4', number: '۲۰۲', floor: 2, area: 110, coefficient: 1.15, buildingId: 'b1', ownerId: 'u5', balance: 0, status: 'paid', parkingSpots: 1, residentsCount: 4 },
  { id: 'unit5', number: '۳۰۱', floor: 3, area: 85, coefficient: 1.0, buildingId: 'b1', ownerId: 'u6', balance: -1350000, status: 'overdue', parkingSpots: 1, residentsCount: 2 },
  { id: 'unit6', number: '۳۰۲', floor: 3, area: 130, coefficient: 1.3, buildingId: 'b1', ownerId: 'u7', balance: -450000, status: 'pending', parkingSpots: 2, residentsCount: 5 },
  { id: 'unit7', number: '۴۰۱', floor: 4, area: 100, coefficient: 1.1, buildingId: 'b1', ownerId: 'u8', tenantId: 'u8', balance: 0, status: 'paid', parkingSpots: 1, residentsCount: 3 },
  { id: 'unit8', number: '۴۰۲', floor: 4, area: 115, coefficient: 1.2, buildingId: 'b1', ownerId: 'u2', balance: 0, status: 'paid', parkingSpots: 2, residentsCount: 4 },
];

// Mock Charges
export const mockCharges: Charge[] = [
  {
    id: 'c1',
    buildingId: 'b1',
    month: 9,
    year: 1402,
    totalAmount: 3600000,
    dueDate: new Date('2023-12-20'),
    createdAt: new Date('2023-12-01'),
    collectionRate: 75,
    items: [
      { id: 'ci1', title: 'نظافت راهرو و لابی', amount: 800000, category: 'cleaning', divisionMethod: 'equal' },
      { id: 'ci2', title: 'قبض برق مشاعات', amount: 450000, category: 'utilities', divisionMethod: 'equal' },
      { id: 'ci3', title: 'قبض گاز مشاعات', amount: 350000, category: 'utilities', divisionMethod: 'equal' },
      { id: 'ci4', title: 'قبض آب مشاعات', amount: 200000, category: 'utilities', divisionMethod: 'equal' },
      { id: 'ci5', title: 'سرویس آسانسور', amount: 600000, category: 'maintenance', divisionMethod: 'equal' },
      { id: 'ci6', title: 'بیمه ساختمان', amount: 400000, category: 'insurance', divisionMethod: 'area' },
      { id: 'ci7', title: 'صندوق ذخیره', amount: 500000, category: 'reserve', divisionMethod: 'equal' },
      { id: 'ci8', title: 'نگهبانی', amount: 300000, category: 'security', divisionMethod: 'equal' },
    ],
  },
];

// Mock Payments - Expanded with 50+ transactions
export const mockPayments: Payment[] = Array.from({ length: 50 }, (_, i) => {
  const units = mockUnits;
  const unit = units[i % units.length];
  const users = mockUsers.filter(u => u.unitId);
  const user = users[i % users.length];
  const methods: Payment['method'][] = ['online', 'card_to_card', 'cash', 'check'];
  const statuses: Payment['status'][] = ['pending', 'verified', 'rejected'];
  
  return {
    id: `p${i + 1}`,
    unitId: unit.id,
    userId: user.id,
    amount: 1500000 + Math.floor(Math.random() * 2000000),
    method: methods[Math.floor(Math.random() * methods.length)],
    status: statuses[Math.floor(Math.random() * 10) < 7 ? 1 : Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
    verifiedAt: Math.random() > 0.3 ? new Date() : undefined,
    chargeId: 'c1',
  };
});

// Mock Expenses - Expanded with 30+ items
const expenseTitles: Record<string, string[]> = {
  utilities: ['قبض برق مشاعات', 'قبض آب مشاعات', 'قبض گاز'],
  maintenance: ['تعمیر پمپ آب', 'رنگ‌آمیزی راهرو', 'تعمیر درب پارکینگ', 'تعمیر موتورخانه'],
  cleaning: ['خدمات نظافت ماهانه', 'شستشوی نما', 'ضدعفونی راهروهای مشترک'],
  security: ['حقوق نگهبان', 'تعمیر دوربین', 'سرویس درب ورودی'],
  supplies: ['خرید لامپ LED', 'خرید مسلح کن', 'خرید بادام‌زمینی'],
  insurance: ['بیمه آتش‌سوزی', 'بیمه مسئولیت', 'بیمه آسانسور'],
  reserve: ['صندوق ذخیره', 'صندوق فوری'],
  other: ['متفرقه', 'جشن', 'هدیه'],
};

export const mockExpenses: Expense[] = Array.from({ length: 30 }, (_, i) => {
  const categories = Object.keys(expenseTitles) as Array<keyof typeof expenseTitles>;
  const category = categories[i % categories.length];
  const titles = expenseTitles[category];
  
  return {
    id: `e${i + 1}`,
    buildingId: 'b1',
    title: titles[Math.floor(Math.random() * titles.length)],
    amount: 500000 + Math.floor(Math.random() * 10000000),
    category,
    vendor: Math.random() > 0.5 ? `شرکت ${['تأسیسات', 'پاکیزه', 'آسانسور', 'امنیت'][i % 4]}` : undefined,
    description: Math.random() > 0.7 ? 'توضیحات تکمیلی هزینه' : undefined,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
  };
});

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    buildingId: 'b1',
    title: 'قطعی آب جهت تعمیرات',
    content: 'ساکنین محترم، به اطلاع می‌رساند روز پنجشنبه از ساعت ۱۰ صبح تا ۲ بعدازظهر به دلیل تعمیرات لوله‌کشی، آب قطع خواهد بود. لطفاً ذخیره لازم را انجام دهید.',
    priority: 'high',
    isPinned: true,
    createdAt: new Date('2023-12-12'),
    authorId: 'u1',
  },
  {
    id: 'a2',
    buildingId: 'b1',
    title: 'جلسه هیئت مدیره',
    content: 'جلسه ماهانه هیئت مدیره روز شنبه ساعت ۶ عصر در لابی برگزار می‌شود. حضور اعضا الزامی است.',
    priority: 'medium',
    isPinned: false,
    createdAt: new Date('2023-12-10'),
    authorId: 'u1',
  },
  {
    id: 'a3',
    buildingId: 'b1',
    title: 'نکات ایمنی زمستان',
    content: 'با توجه به فرارسیدن فصل سرما، لطفاً از بستن شیرهای آب بالکن و پوشش لوله‌ها اطمینان حاصل فرمایید.',
    priority: 'low',
    isPinned: false,
    createdAt: new Date('2023-12-08'),
    authorId: 'u5',
  },
];

// Mock Maintenance Requests
export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr1',
    buildingId: 'b1',
    unitId: 'unit2',
    userId: 'u3',
    title: 'نشتی آب سرویس بهداشتی',
    description: 'از سقف سرویس بهداشتی آب چکه می‌کند. احتمالاً از واحد بالایی است.',
    category: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2023-12-11'),
  },
  {
    id: 'mr2',
    buildingId: 'b1',
    unitId: 'unit5',
    userId: 'u6',
    title: 'خرابی چراغ راهرو طبقه سوم',
    description: 'چراغ راهرو طبقه سوم سوخته و نیاز به تعویض دارد.',
    category: 'electrical',
    priority: 'low',
    status: 'new',
    createdAt: new Date('2023-12-12'),
  },
  {
    id: 'mr3',
    buildingId: 'b1',
    unitId: 'unit3',
    userId: 'u4',
    title: 'صدای غیرعادی آسانسور',
    description: 'آسانسور هنگام حرکت صدای ناهنجار می‌دهد. لطفاً بررسی شود.',
    category: 'elevator',
    priority: 'medium',
    status: 'new',
    createdAt: new Date('2023-12-10'),
  },
  {
    id: 'mr4',
    buildingId: 'b1',
    unitId: 'unit1',
    userId: 'u2',
    title: 'تعمیر قفل درب پارکینگ',
    description: 'قفل درب پارکینگ خراب شده و به سختی باز می‌شود.',
    category: 'general',
    priority: 'medium',
    status: 'completed',
    createdAt: new Date('2023-12-05'),
    completedAt: new Date('2023-12-07'),
  },
];

// Mock Polls
export const mockPolls: Poll[] = [
  {
    id: 'poll1',
    buildingId: 'b1',
    question: 'آیا موافق نصب دوربین مداربسته در پارکینگ هستید؟',
    options: [
      { id: 'o1', text: 'بله، کاملاً موافقم', votes: 5 },
      { id: 'o2', text: 'موافقم با شرط تقسیم هزینه', votes: 3 },
      { id: 'o3', text: 'مخالفم', votes: 1 },
    ],
    deadline: new Date('2023-12-20'),
    isAnonymous: true,
    quorum: 6,
    createdAt: new Date('2023-12-08'),
    authorId: 'u1',
  },
  {
    id: 'poll2',
    buildingId: 'b1',
    question: 'کدام روز برای جلسه عمومی مناسب‌تر است؟',
    options: [
      { id: 'o4', text: 'جمعه ساعت ۱۰ صبح', votes: 4 },
      { id: 'o5', text: 'پنجشنبه ساعت ۶ عصر', votes: 6 },
      { id: 'o6', text: 'شنبه ساعت ۵ عصر', votes: 2 },
    ],
    deadline: new Date('2023-12-15'),
    isAnonymous: false,
    quorum: 5,
    createdAt: new Date('2023-12-05'),
    authorId: 'u5',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'پرداخت جدید', message: 'واحد ۱۰۱ شارژ آذرماه را پرداخت کرد', type: 'payment', isRead: false, createdAt: new Date('2023-12-12T10:30:00'), link: '/payments' },
  { id: 'n2', userId: 'u1', title: 'درخواست تعمیرات', message: 'درخواست جدید از واحد ۱۰۲ ثبت شد', type: 'request', isRead: false, createdAt: new Date('2023-12-11T15:45:00'), link: '/requests' },
  { id: 'n3', userId: 'u1', title: 'یادآوری', message: '۳ واحد هنوز شارژ این ماه را پرداخت نکرده‌اند', type: 'system', isRead: true, createdAt: new Date('2023-12-10T09:00:00') },
  { id: 'n4', userId: 'u2', title: 'شارژ ماهانه', message: 'صورتحساب شارژ آذرماه صادر شد', type: 'payment', isRead: false, createdAt: new Date('2023-12-01T08:00:00'), link: '/my-charges' },
];

// Statistics
export const mockStats = {
  collectedThisMonth: 1800000,
  pendingPayments: 900000,
  overdueAmount: 2250000,
  fundBalance: 15600000,
  collectionRate: 75,
  totalUnits: 8,
  paidUnits: 4,
  pendingUnits: 2,
  overdueUnits: 2,
  buildingHealthScore: 78,
  monthlyIncome: [
    { month: 'فروردین', income: 3200000, expense: 2800000 },
    { month: 'اردیبهشت', income: 3400000, expense: 3100000 },
    { month: 'خرداد', income: 3100000, expense: 2900000 },
    { month: 'تیر', income: 3600000, expense: 3200000 },
    { month: 'مرداد', income: 3500000, expense: 3400000 },
    { month: 'شهریور', income: 3800000, expense: 3100000 },
    { month: 'مهر', income: 3400000, expense: 3300000 },
    { month: 'آبان', income: 3600000, expense: 3500000 },
    { month: 'آذر', income: 2700000, expense: 5200000 },
  ],
};

// Expense categories
export const expenseCategories = [
  { id: 'cleaning', name: 'نظافت', icon: 'Sparkles', color: '#10B981' },
  { id: 'utilities', name: 'قبوض', icon: 'Zap', color: '#F59E0B' },
  { id: 'maintenance', name: 'تعمیرات', icon: 'Wrench', color: '#3B82F6' },
  { id: 'security', name: 'نگهبانی', icon: 'Shield', color: '#8B5CF6' },
  { id: 'supplies', name: 'لوازم', icon: 'Package', color: '#EC4899' },
  { id: 'insurance', name: 'بیمه', icon: 'FileCheck', color: '#06B6D4' },
  { id: 'reserve', name: 'صندوق ذخیره', icon: 'PiggyBank', color: '#84CC16' },
  { id: 'other', name: 'سایر', icon: 'MoreHorizontal', color: '#6B7280' },
];

// Badge definitions
export const badges = [
  { id: 'gold', name: 'ساکن طلایی', icon: '🥇', description: 'پرداخت به موقع ۱۲ ماه متوالی', color: '#FFD700' },
  { id: 'silver', name: 'ساکن نقره‌ای', icon: '🥈', description: 'پرداخت به موقع ۶ ماه متوالی', color: '#C0C0C0' },
  { id: 'bronze', name: 'ساکن برنزی', icon: '🥉', description: 'پرداخت به موقع ۳ ماه متوالی', color: '#CD7F32' },
  { id: 'punctual', name: 'خوش حساب', icon: '⏰', description: 'همیشه قبل از موعد پرداخت می‌کند', color: '#10B981' },
  { id: 'community', name: 'همسایه فعال', icon: '🤝', description: 'مشارکت در فعالیت‌های اجتماعی', color: '#3B82F6' },
  { id: 'helper', name: 'یاریگر', icon: '💪', description: 'کمک به حل مشکلات ساختمان', color: '#8B5CF6' },
];

// Fund Transaction Types
export interface FundTransaction {
  id: string;
  type: 'contribution' | 'withdrawal';
  amount: number;
  description: string;
  category?: 'maintenance' | 'emergency' | 'equipment' | 'other';
  date: Date;
  recordedBy: string;
  unitNumber?: string;
  approvedBy?: string;
}

// Fund Transactions
export const mockFundTransactions: FundTransaction[] = Array.from({ length: 25 }, (_, i) => {
  const isContribution = Math.random() > 0.3;
  const monthsAgo = Math.floor(i / 2);
  
  return {
    id: `fund-tx-${i + 1}`,
    type: isContribution ? 'contribution' : 'withdrawal',
    amount: isContribution 
      ? 500000 + Math.floor(Math.random() * 2000000)
      : 200000 + Math.floor(Math.random() * 1000000),
    description: isContribution
      ? ['واریز شارژ اضافه', 'کمک هزینه ساکنین', 'سود سپرده', 'درآمد پارکینگ مهمان'][i % 4]
      : ['تعمیرات آسانسور', 'خرید تجهیزات', 'هزینه اضطراری', 'رنگ‌آمیزی'][i % 4],
    category: isContribution ? undefined : (['maintenance', 'equipment', 'emergency', 'other'][i % 4] as any),
    date: new Date(Date.now() - monthsAgo * 30 * 24 * 60 * 60 * 1000 - Math.random() * 15 * 24 * 60 * 60 * 1000),
    recordedBy: 'مدیر ساختمان',
    unitNumber: isContribution && Math.random() > 0.5 ? `${Math.floor(Math.random() * 6) + 1}0${Math.floor(Math.random() * 4) + 1}` : undefined,
    approvedBy: !isContribution ? 'هیئت مدیره' : undefined,
  };
});

// Fund Statistics
export const mockFundStats = {
  currentBalance: 28500000,
  monthlyContributions: 5200000,
  monthlyWithdrawals: 2100000,
  growthPercent: 12.5,
  goalAmount: 50000000,
  goalDate: new Date('2024-12-31'),
  lastYearData: [
    { month: 'فروردین', balance: 18000000 },
    { month: 'اردیبهشت', balance: 19500000 },
    { month: 'خرداد', balance: 21000000 },
    { month: 'تیر', balance: 22800000 },
    { month: 'مرداد', balance: 24200000 },
    { month: 'شهریور', balance: 25100000 },
    { month: 'مهر', balance: 26500000 },
    { month: 'آبان', balance: 27200000 },
    { month: 'آذر', balance: 28500000 },
  ],
};

// Debt data for debt report
export const mockDebtData = mockUnits
  .filter(u => u.balance < 0)
  .map(u => ({
    ...u,
    oldestUnpaidDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
    lastPaymentDate: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
  }));

// Phase 5 - Resident Portal Mock Data
export const mockCurrentUser = {
  id: '7',
  firstName: 'علی',
  lastName: 'محمدی',
  phone: '09121234567',
  phoneVerified: true,
  email: 'ali.mohammadi@example.com',
  nationalId: '0123456789',
  avatar: undefined,
  unitInfo: {
    number: '۱۲',
    floor: 3,
    area: 120,
    parkingSpots: 1,
    storageUnit: true,
    memberSince: new Date('2022-03-15'),
  },
  vehicles: [
    { id: '1', plate: 'ایران ۱۲ ۳۴۵ الف ۶۷', color: 'مشکی', model: 'پژو ۲۰۶' },
  ],
  emergencyContact: {
    name: 'فاطمه احمدی',
    relationship: 'همسر',
    phone: '09129876543',
  },
  notifications: {
    sms: true,
    email: true,
    push: true,
    paymentReminders: true,
    announcements: true,
    weeklySummary: false,
  },
};

export const mockMyCharges = [
  {
    id: 'c1',
    month: 'آذر',
    year: '۱۴۰۳',
    monthNum: 9,
    yearNum: 1403,
    amount: 4500000,
    dueDate: new Date('2024-12-20'),
    status: 'pending' as const,
    paidDate: null,
    items: [
      { id: '1', title: 'شارژ ماهانه', category: 'monthly', amount: 2500000, percentage: 55.6 },
      { id: '2', title: 'آسانسور', category: 'elevator', amount: 500000, percentage: 11.1 },
      { id: '3', title: 'نظافت', category: 'cleaning', amount: 700000, percentage: 15.6 },
      { id: '4', title: 'آب و برق', category: 'utilities', amount: 600000, percentage: 13.3 },
      { id: '5', title: 'نگهبانی', category: 'security', amount: 200000, percentage: 4.4 },
    ],
  },
  {
    id: 'c2',
    month: 'آبان',
    year: '۱۴۰۳',
    monthNum: 8,
    yearNum: 1403,
    amount: 4200000,
    dueDate: new Date('2024-11-20'),
    status: 'paid' as const,
    paidDate: new Date('2024-11-18'),
    items: [
      { id: '1', title: 'شارژ ماهانه', category: 'monthly', amount: 2500000, percentage: 59.5 },
      { id: '2', title: 'آسانسور', category: 'elevator', amount: 500000, percentage: 11.9 },
      { id: '3', title: 'نظافت', category: 'cleaning', amount: 700000, percentage: 16.7 },
      { id: '4', title: 'آب و برق', category: 'utilities', amount: 500000, percentage: 11.9 },
    ],
  },
  {
    id: 'c3',
    month: 'مهر',
    year: '۱۴۰۳',
    monthNum: 7,
    yearNum: 1403,
    amount: 4300000,
    dueDate: new Date('2024-10-20'),
    status: 'paid' as const,
    paidDate: new Date('2024-10-19'),
    items: [],
  },
  {
    id: 'c4',
    month: 'شهریور',
    year: '۱۴۰۳',
    monthNum: 6,
    yearNum: 1403,
    amount: 4100000,
    dueDate: new Date('2024-09-20'),
    status: 'paid' as const,
    paidDate: new Date('2024-09-17'),
    items: [],
  },
  {
    id: 'c5',
    month: 'مرداد',
    year: '۱۴۰۳',
    monthNum: 5,
    yearNum: 1403,
    amount: 4000000,
    dueDate: new Date('2024-08-20'),
    status: 'paid' as const,
    paidDate: new Date('2024-08-15'),
    items: [],
  },
];

export const mockBuildingInfo = {
  name: 'برج آسمان',
  address: 'تهران، ونک، خیابان ملاصدرا، پلاک ۱۲۳',
  units: 24,
  floors: 6,
  parkingSpots: 30,
  yearBuilt: '۱۳۹۵',
  manager: {
    name: 'حسین رضایی',
    phone: '۰۹۱۲۱۲۳۴۵۶۷',
    availableHours: 'روزهای کاری ۹-۱۷',
  },
  emergencyContacts: [
    { name: 'آتش‌نشانی', number: '۱۲۵', color: 'border-red-500 bg-red-500/5' },
    { name: 'پلیس', number: '۱۱۰', color: 'border-blue-500 bg-blue-500/5' },
    { name: 'اورژانس', number: '۱۱۵', color: 'border-green-500 bg-green-500/5' },
    { name: 'گاز', number: '۱۹۴', color: 'border-orange-500 bg-orange-500/5' },
    { name: 'برق', number: '۱۲۱', color: 'border-yellow-500 bg-yellow-500/5' },
    { name: 'نگهبانی ساختمان', number: '۰۹۱۲۹۸۷۶۵۴۳', color: 'border-purple-500 bg-purple-500/5' },
  ],
  rules: [
    {
      id: 'r1',
      title: 'ساعات آرامش',
      content: 'از ساعت ۱۴ تا ۱۶ و ۲۲ تا ۷ صبح، ساکنین موظف به رعایت آرامش هستند.',
    },
    {
      id: 'r2',
      title: 'پارکینگ',
      content: 'هر واحد مجاز به استفاده از یک پارکینگ است. پارک در فضای مشترک ممنوع است.',
    },
    {
      id: 'r3',
      title: 'حیوانات خانگی',
      content: 'نگهداری حیوانات خانگی با رعایت بهداشت و آرامش همسایگان مجاز است.',
    },
    {
      id: 'r4',
      title: 'مهمانان',
      content: 'ورود مهمانان با هماهنگی نگهبانی و مسئولیت صاحب واحد امکان‌پذیر است.',
    },
    {
      id: 'r5',
      title: 'تعمیرات',
      content: 'انجام تعمیرات اساسی نیاز به هماهنگی با مدیریت ساختمان دارد.',
    },
    {
      id: 'r6',
      title: 'دفع زباله',
      content: 'زباله‌ها باید در ساعات ۸-۱۰ صبح در مکان مشخص شده قرار گیرند.',
    },
  ],
  facilities: [
    { name: 'پارکینگ', available: true },
    { name: 'انباری', available: true },
    { name: 'آسانسور', available: true },
    { name: 'سالن اجتماعات', available: true },
    { name: 'باشگاه', available: false },
    { name: 'استخر', available: false },
    { name: 'فضای سبز', available: true },
    { name: 'نگهبانی ۲۴ ساعته', available: true },
  ],
  documents: [
    { id: 'd1', title: 'آیین‌نامه ساختمان', filename: 'regulations.pdf' },
    { id: 'd2', title: 'دستورالعمل اضطراری', filename: 'emergency.pdf' },
    { id: 'd3', title: 'نقشه ساختمان', filename: 'map.pdf' },
  ],
};

// Phase 6 - Community Features Mock Data

// Marketplace
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: 'sale' | 'free' | 'services' | 'lending';
  price?: number;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerUnit: string;
  contactPhone?: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'sold' | 'expired';
}

export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: 'listing-1',
    title: 'مبل راحتی ۷ نفره',
    description: 'مبل راحتی ۷ نفره در حد نو، به علت تغییر دکور فروشی. قابل مذاکره.',
    category: 'sale',
    price: 15000000,
    images: [],
    sellerId: 'user-1',
    sellerName: 'علی محمدی',
    sellerUnit: '۲۰۱',
    contactPhone: '۰۹۱۲۱۲۳۴۵۶۷',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'listing-2',
    title: 'کتاب‌های کودک',
    description: 'مجموعه ۲۰ جلدی کتاب‌های داستان کودک، در حد نو. رایگان برای همسایگان عزیز.',
    category: 'free',
    images: [],
    sellerId: 'user-2',
    sellerName: 'فاطمه رضایی',
    sellerUnit: '۳۰۲',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'listing-3',
    title: 'تدریس خصوصی ریاضی',
    description: 'تدریس ریاضی دبیرستان توسط کارشناس ارشد ریاضی. تخفیف ویژه برای همسایگان.',
    category: 'services',
    price: 500000,
    images: [],
    sellerId: 'user-3',
    sellerName: 'رضا احمدی',
    sellerUnit: '۴۰۱',
    contactPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'listing-4',
    title: 'دریل و ابزار',
    description: 'دریل برقی و مجموعه ابزار برای امانت. در صورت نیاز با من تماس بگیرید.',
    category: 'lending',
    images: [],
    sellerId: 'user-4',
    sellerName: 'حسین کریمی',
    sellerUnit: '۱۰۵',
    contactPhone: '۰۹۱۲۸۷۶۵۴۳۲',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'listing-5',
    title: 'یخچال ساید بای ساید',
    description: 'یخچال دوقلو LG، ۳ سال استفاده، سالم و تمیز. قیمت: ۲۵ میلیون تومان',
    category: 'sale',
    price: 25000000,
    images: [],
    sellerId: 'user-5',
    sellerName: 'مریم حسینی',
    sellerUnit: '۳۰۴',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'listing-6',
    title: 'لباس و اسباب‌بازی کودک',
    description: 'لباس و اسباب‌بازی کودک ۲ تا ۵ سال، تمیز و سالم. رایگان.',
    category: 'free',
    images: [],
    sellerId: 'user-6',
    sellerName: 'سارا موسوی',
    sellerUnit: '۲۰۳',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
];

// Events
export interface BuildingEvent {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'celebration' | 'maintenance' | 'community' | 'other';
  date: Date;
  startTime: string;
  endTime?: string;
  location: string;
  organizerId: string;
  organizerName: string;
  maxAttendees?: number;
  attendees: { userId: string; status: 'going' | 'maybe' | 'not_going' }[];
  createdAt: Date;
}

export const mockEvents: BuildingEvent[] = [
  {
    id: 'event-1',
    title: 'جلسه مجمع عمومی سالانه',
    description: 'جلسه سالانه مجمع عمومی برای بررسی گزارش مالی سال گذشته و انتخاب اعضای هیئت مدیره جدید. حضور همه ساکنین ضروری است.',
    type: 'meeting',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    startTime: '18:00',
    endTime: '20:00',
    location: 'لابی ساختمان',
    organizerId: 'manager-1',
    organizerName: 'مدیریت ساختمان',
    attendees: [
      { userId: 'user-1', status: 'going' },
      { userId: 'user-2', status: 'going' },
      { userId: 'user-3', status: 'maybe' },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'event-2',
    title: 'جشن نوروز',
    description: 'جشن پیش از نوروز با همسایگان عزیز. میزان همراه داشته باشید!',
    type: 'celebration',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    startTime: '17:00',
    endTime: '21:00',
    location: 'پشت‌بام ساختمان',
    organizerId: 'user-2',
    organizerName: 'کمیته فرهنگی',
    maxAttendees: 50,
    attendees: [
      { userId: 'user-1', status: 'going' },
      { userId: 'user-3', status: 'going' },
      { userId: 'user-4', status: 'going' },
      { userId: 'user-5', status: 'maybe' },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'event-3',
    title: 'تعمیرات آسانسور',
    description: 'تعمیرات دوره‌ای و سرویس آسانسورها. آسانسور ۲ از ساعت ۹ تا ۱۲ خارج از سرویس خواهد بود.',
    type: 'maintenance',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '12:00',
    location: 'آسانسور شماره ۲',
    organizerId: 'manager-1',
    organizerName: 'مدیریت ساختمان',
    attendees: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'event-4',
    title: 'ورزش صبحگاهی',
    description: 'ورزش گروهی در پارک همسایگی هر شنبه صبح. همراه با مربی حرفه‌ای.',
    type: 'community',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    startTime: '07:00',
    endTime: '08:00',
    location: 'پارک نزدیک ساختمان',
    organizerId: 'user-4',
    organizerName: 'کمیته ورزش',
    attendees: [
      { userId: 'user-1', status: 'going' },
      { userId: 'user-2', status: 'going' },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'event-5',
    title: 'کارگاه آموزشی باغبانی',
    description: 'آموزش نگهداری از گیاهان آپارتمانی و باغچه‌های کوچک. با حضور کارشناس.',
    type: 'community',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    startTime: '16:00',
    endTime: '18:00',
    location: 'فضای سبز ساختمان',
    organizerId: 'user-5',
    organizerName: 'سارا کریمی',
    maxAttendees: 20,
    attendees: [
      { userId: 'user-2', status: 'going' },
      { userId: 'user-3', status: 'going' },
      { userId: 'user-6', status: 'maybe' },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Discussions
export interface Discussion {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'suggestions' | 'questions' | 'offtopic';
  authorId: string;
  authorName: string;
  authorUnit: string;
  isPinned: boolean;
  likes: string[];
  replies: DiscussionReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorUnit: string;
  likes: string[];
  parentReplyId?: string;
  createdAt: Date;
}

export const mockDiscussions: Discussion[] = [
  {
    id: 'disc-1',
    title: 'پیشنهاد نصب شارژر خودروی برقی',
    content: 'با سلام و احترام. با توجه به افزایش خودروهای برقی در کشور، پیشنهاد می‌کنم در پارکینگ ساختمان، شارژر نصب شود. این امکان می‌تواند ارزش ساختمان را افزایش دهد و برای صاحبان خودروهای برقی مفید باشد. نظر دوستان چیست؟',
    category: 'suggestions',
    authorId: 'user-2',
    authorName: 'رضا حسینی',
    authorUnit: '۳۰۲',
    isPinned: true,
    likes: ['user-1', 'user-3', 'user-5', 'user-6'],
    replies: [
      {
        id: 'reply-1',
        content: 'ایده بسیار خوبی است. هزینه‌اش چقدر می‌شود؟',
        authorId: 'user-4',
        authorName: 'سارا کریمی',
        authorUnit: '۴۰۱',
        likes: ['user-2'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'reply-2',
        content: 'من موافقم. خودرو برقی دارم و این خیلی کمک می‌کند.',
        authorId: 'user-1',
        authorName: 'علی محمدی',
        authorUnit: '۲۰۱',
        likes: ['user-2', 'user-4'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'reply-3',
        content: 'بنظرم هزینه‌اش را باید بین علاقه‌مندان تقسیم کنیم، نه همه ساکنین.',
        authorId: 'user-3',
        authorName: 'مهدی رضوی',
        authorUnit: '۱۰۳',
        likes: ['user-5'],
        parentReplyId: 'reply-1',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'disc-2',
    title: 'سروصدای شبانه در طبقه سوم',
    content: 'متاسفانه چند شب است که صدای موسیقی بلند از یکی از واحدهای طبقه سوم تا ساعت ۱۲ شب ادامه دارد. لطفاً ساعات آرامش را رعایت کنید.',
    category: 'general',
    authorId: 'user-6',
    authorName: 'فاطمه موسوی',
    authorUnit: '۳۰۴',
    isPinned: false,
    likes: ['user-1', 'user-4'],
    replies: [
      {
        id: 'reply-4',
        content: 'من هم متوجه شدم. باید به مدیریت اطلاع بدهیم.',
        authorId: 'user-5',
        authorName: 'حسین کریمی',
        authorUnit: '۲۰۵',
        likes: ['user-6'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'disc-3',
    title: 'نحوه استفاده از سالن اجتماعات؟',
    content: 'سلام. می‌خواهم برای جشن تولد فرزندم از سالن استفاده کنم. آیا باید رزرو کنم؟ هزینه دارد؟',
    category: 'questions',
    authorId: 'user-3',
    authorName: 'مهدی رضوی',
    authorUnit: '۱۰۳',
    isPinned: false,
    likes: [],
    replies: [
      {
        id: 'reply-5',
        content: 'بله، باید با مدیریت هماهنگ کنید. معمولاً یک هفته قبل رزرو می‌کنند.',
        authorId: 'user-2',
        authorName: 'رضا حسینی',
        authorUnit: '۳۰۲',
        likes: ['user-3'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'disc-4',
    title: 'توصیه رستوران خوب در منطقه',
    content: 'دوستان کسی رستوران خوب در منطقه می‌شناسه؟ میهمان دارم و دنبال جای خوب می‌گردم.',
    category: 'offtopic',
    authorId: 'user-4',
    authorName: 'سارا کریمی',
    authorUnit: '۴۰۱',
    isPinned: false,
    likes: ['user-1'],
    replies: [
      {
        id: 'reply-6',
        content: 'رستوران سنتی کوچه باغ خیلی خوبه. غذاهای ایرانی عالی دارند.',
        authorId: 'user-1',
        authorName: 'علی محمدی',
        authorUnit: '۲۰۱',
        likes: ['user-4'],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        id: 'reply-7',
        content: 'من پیتزا رومانو رو توصیه می‌کنم. نزدیکه و پیتزاش فوق‌العاده است.',
        authorId: 'user-5',
        authorName: 'حسین کریمی',
        authorUnit: '۲۰۵',
        likes: ['user-4', 'user-1'],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

// Phase 7 - Documents & Settings

export interface BuildingDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'jpg' | 'png';
  category: 'rules' | 'minutes' | 'contracts' | 'insurance' | 'permits' | 'reports' | 'other';
  size: number;
  url: string;
  description?: string;
  accessLevel: 'all' | 'managers' | 'board';
  uploadedBy: string;
  uploadedAt: Date;
  expiresAt?: Date;
}

export const mockDocuments: BuildingDocument[] = [
  {
    id: 'doc-1',
    name: 'آیین‌نامه داخلی ساختمان',
    type: 'pdf',
    category: 'rules',
    size: 2500000,
    url: '/documents/rules.pdf',
    description: 'قوانین و مقررات داخلی ساختمان - ویرایش ۱۴۰۲',
    accessLevel: 'all',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2023-01-15'),
  },
  {
    id: 'doc-2',
    name: 'صورتجلسه مجمع عمومی - خرداد ۱۴۰۳',
    type: 'pdf',
    category: 'minutes',
    size: 1200000,
    url: '/documents/minutes-1403-03.pdf',
    description: 'صورتجلسه مجمع عمومی عادی سالانه',
    accessLevel: 'all',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2024-05-20'),
  },
  {
    id: 'doc-3',
    name: 'قرارداد سرویس آسانسور',
    type: 'pdf',
    category: 'contracts',
    size: 3500000,
    url: '/documents/elevator-contract.pdf',
    description: 'قرارداد سرویس سالانه آسانسور با شرکت تعمیرات آسا',
    accessLevel: 'managers',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2024-01-10'),
    expiresAt: new Date('2025-01-10'),
  },
  {
    id: 'doc-4',
    name: 'بیمه‌نامه آتش‌سوزی',
    type: 'pdf',
    category: 'insurance',
    size: 1800000,
    url: '/documents/fire-insurance.pdf',
    description: 'بیمه‌نامه آتش‌سوزی ساختمان - بیمه ایران',
    accessLevel: 'board',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2024-03-01'),
    expiresAt: new Date('2025-03-01'),
  },
  {
    id: 'doc-5',
    name: 'پروانه ساختمان',
    type: 'pdf',
    category: 'permits',
    size: 4200000,
    url: '/documents/building-permit.pdf',
    description: 'پروانه ساخت و پایان کار ساختمان',
    accessLevel: 'managers',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2023-06-15'),
  },
  {
    id: 'doc-6',
    name: 'گزارش مالی سال ۱۴۰۲',
    type: 'xlsx',
    category: 'reports',
    size: 850000,
    url: '/documents/financial-report-1402.xlsx',
    description: 'گزارش کامل درآمد و هزینه‌های سال ۱۴۰۲',
    accessLevel: 'all',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2023-12-30'),
  },
  {
    id: 'doc-7',
    name: 'صورتجلسه مجمع - دی ۱۴۰۲',
    type: 'pdf',
    category: 'minutes',
    size: 1100000,
    url: '/documents/minutes-1402-10.pdf',
    description: 'صورتجلسه مجمع عمومی فوق‌العاده',
    accessLevel: 'all',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2024-01-05'),
  },
  {
    id: 'doc-8',
    name: 'قرارداد نگهبانی',
    type: 'pdf',
    category: 'contracts',
    size: 2900000,
    url: '/documents/security-contract.pdf',
    description: 'قرارداد خدمات نگهبانی شبانه‌روزی',
    accessLevel: 'managers',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2024-02-01'),
    expiresAt: new Date('2025-02-01'),
  },
  {
    id: 'doc-9',
    name: 'نقشه معماری ساختمان',
    type: 'pdf',
    category: 'other',
    size: 5500000,
    url: '/documents/architecture-plan.pdf',
    description: 'نقشه‌های معماری کامل ساختمان',
    accessLevel: 'managers',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2023-09-10'),
  },
  {
    id: 'doc-10',
    name: 'بیمه مسئولیت',
    type: 'pdf',
    category: 'insurance',
    size: 1600000,
    url: '/documents/liability-insurance.pdf',
    description: 'بیمه‌نامه مسئولیت مدنی ساختمان',
    accessLevel: 'board',
    uploadedBy: 'مدیر ساختمان',
    uploadedAt: new Date('2024-04-15'),
    expiresAt: new Date('2025-04-15'),
  },
];

export const mockBuildingSettings = {
  building: {
    name: 'برج آسمان',
    address: 'تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲',
    totalUnits: 24,
    floors: 6,
    yearBuilt: 1395,
    description: 'مجتمع مسکونی ۲۴ واحدی با امکانات کامل',
  },
  charges: {
    defaultCalculationMethod: 'equal',
    defaultDueDay: 10,
    lateFee: {
      enabled: true,
      gracePeriod: 5,
      type: 'percentage',
      amount: 2,
    },
    autoGenerate: true,
  },
  payments: {
    online: {
      enabled: true,
      gateway: 'zarinpal',
      merchantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    },
    cardToCard: {
      enabled: true,
      cardNumber: '6037-xxxx-xxxx-1234',
      holderName: 'علی رضایی',
      bankName: 'ملی',
    },
    cash: true,
  },
  notifications: {
    sms: {
      enabled: true,
      provider: 'kavenegar',
    },
    triggers: {
      newCharge: true,
      paymentReminder: true,
      reminderDays: 3,
      paymentReceived: true,
      overdueNotice: true,
      newAnnouncement: true,
      newRequest: true,
    },
  },
};
