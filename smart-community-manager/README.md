# ساختمان من (My Building) - Apartment Management System

یک سامانه جامع مدیریت ساختمان/آپارتمان با React، TypeScript و Tailwind CSS.

## 🌟 Features

### For Managers
- **Dashboard**: نمای کلی مالی و وضعیت پرداخت‌ها
- **Resident Management**: مدیریت ساکنان
- **Charge Management**: ایجاد شارژ ماهانه با روش‌های متنوع محاسبه
- **Payment Tracking**: پایش و تأیید پرداخت‌ها
- **Expense Management**: ردیابی هزینه‌ها بر اساس دسته‌بندی
- **Building Fund**: مدیریت صندوق ذخیره
- **Reports**: گزارش‌های مالی (درآمد، هزینه، تراز، بدهی)
- **Announcements**: مدیریت اطلاعیه‌ها
- **Voting/Polls**: ایجاد نظرسنجی برای تصمیمات
- **Maintenance Requests**: مدیریت درخواست‌های تعمیرات
- **Document Management**: مدیریت اسناد ساختمان
- **Settings**: پیکربندی ساختمان، پرداخت و اعلان‌ها

### For Residents
- **Personal Dashboard**: مشاهده شارژ، وضعیت پرداخت، streak
- **Payment**: ویزارد چندمرحله‌ای پرداخت با چند روش
- **Payment History**: مشاهده سوابق و دانلود رسید
- **Maintenance Requests**: ثبت و پیگیری درخواست‌ها
- **Announcements**: مشاهده اطلاعیه‌های ساختمان
- **Voting**: مشارکت در نظرسنجی‌ها
- **Building Info**: قوانین و اطلاعات ساختمان
- **Profile**: مدیریت اطلاعات شخصی

### Community Features
- **Marketplace**: خرید/فروش/اشتراک کالا با همسایگان
- **Events**: تقویم رویدادهای ساختمان با RSVP
- **Discussions**: تالار گفتگو / فروم

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context
- **Build Tool**: Vite

## 📁 Project Structure

```text
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn)
│   ├── layout/          # Layout components (Manager, Resident)
│   ├── auth/            # Authentication components
│   ├── residents/       # Resident management components
│   ├── payments/        # Payment components
│   ├── expenses/        # Expense components
│   ├── reports/         # Report components
│   ├── announcements/   # Announcement components
│   ├── voting/          # Voting/poll components
│   ├── maintenance/     # Maintenance request components
│   ├── documents/       # Document management components
│   ├── settings/        # Settings components
│   ├── fund/            # Building fund components
│   ├── marketplace/     # Marketplace components
│   ├── events/          # Events components
│   └── discussions/     # Discussion/forum components
├── pages/
│   ├── auth/            # Authentication pages
│   ├── manager/         # Manager dashboard pages
│   ├── resident/        # Resident portal pages
│   └── community/       # Community feature pages
├── contexts/            # React contexts (Auth, Theme)
├── hooks/               # Custom hooks
├── lib/                 # Utilities and helpers
├── data/                # Mock data
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm یا yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd smart-community-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌐 Localization

کاملاً بومی‌شده برای فارسی با:
- چیدمان RTL
- اعداد فارسی
- تقویم جلالی
- فرمت پول ایرانی (تومان)

## 🎨 Theming

- پشتیبانی از حالت روشن و تاریک
- سوئیچر تم در هدر
- تشخیص خودکار ترجیحات سیستم
- رنگ‌بندی یکپارچه

## 📱 Responsive Design

- رویکرد Mobile-first
- سازگار با همه اندازه صفحات
- کامپوننت‌های موبایل (bottom sheet, pull-to-refresh)
- تعاملات لمسی

## 🔐 Authentication

- ورود با شماره موبایل + OTP
- کنترل دسترسی مبتنی بر نقش (Manager, Board Member, Owner, Tenant)
- مسیرهای محافظت‌شده
- پشتیبانی چندساختمانی

## 📊 Reports Available

1. **Income Report**: تحلیل پرداخت‌ها و روندها
2. **Expense Report**: تفکیک هزینه‌ها بر اساس دسته‌بندی
3. **Balance Sheet**: مقایسه درآمد و هزینه
4. **Debt Report**: تحلیل پرداخت‌های معوق
5. **Unit Report**: خلاصه مالی هر واحد

## 🔜 Future Enhancements

- [ ] اتصال به API بک‌اند
- [ ] اتصال به درگاه SMS واقعی
- [ ] اتصال به درگاه پرداخت واقعی
- [ ] پوش نوتیفیکیشن
- [ ] اپ موبایل (React Native)
- [ ] پشتیبانی چندزبانه

## 📄 License

این پروژه تحت مجوز MIT منتشر شده است.

## 👥 Contributors

- Development Team

---

Built with ❤️ for apartment communities
