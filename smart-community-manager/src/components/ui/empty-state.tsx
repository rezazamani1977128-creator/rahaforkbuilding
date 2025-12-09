import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Wallet,
  FileText,
  Building2,
  Megaphone,
  Wrench,
  Bell,
  Search,
  ShoppingBag,
  AlertTriangle,
  Users,
  Receipt,
  MessageSquare,
} from 'lucide-react';

type EmptyStateType =
  | 'no-payments'
  | 'no-charges'
  | 'no-residents'
  | 'no-announcements'
  | 'no-requests'
  | 'no-notifications'
  | 'no-results'
  | 'no-marketplace'
  | 'error'
  | 'no-messages'
  | 'no-units';

interface EmptyStateConfig {
  icon: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
}

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
  'no-payments': {
    icon: <Wallet className="h-12 w-12" />,
    title: 'هنوز پرداختی ثبت نشده',
    description: 'اولین پرداخت خود را انجام دهید',
    actionLabel: 'پرداخت شارژ',
  },
  'no-charges': {
    icon: <Receipt className="h-12 w-12" />,
    title: 'شارژی برای این ماه ثبت نشده',
    description: 'شارژ ماهانه را ایجاد کنید',
    actionLabel: 'ایجاد شارژ جدید',
  },
  'no-residents': {
    icon: <Users className="h-12 w-12" />,
    title: 'هنوز ساکنی اضافه نشده',
    description: 'اطلاعات ساکنین را ثبت کنید',
    actionLabel: 'افزودن ساکن',
  },
  'no-announcements': {
    icon: <Megaphone className="h-12 w-12" />,
    title: 'اطلاعیه‌ای وجود ندارد',
    description: 'اطلاعیه جدید بسازید',
    actionLabel: 'ایجاد اطلاعیه',
  },
  'no-requests': {
    icon: <Wrench className="h-12 w-12" />,
    title: 'درخواستی ثبت نشده',
    description: 'درخواست تعمیرات خود را ثبت کنید',
    actionLabel: 'ثبت درخواست جدید',
  },
  'no-notifications': {
    icon: <Bell className="h-12 w-12" />,
    title: 'اعلانی ندارید',
    description: 'اعلان‌های جدید اینجا نمایش داده می‌شوند',
  },
  'no-results': {
    icon: <Search className="h-12 w-12" />,
    title: 'نتیجه‌ای یافت نشد',
    description: 'عبارت دیگری جستجو کنید',
  },
  'no-marketplace': {
    icon: <ShoppingBag className="h-12 w-12" />,
    title: 'آگهی‌ای ثبت نشده',
    description: 'اولین آگهی خود را ثبت کنید',
    actionLabel: 'ثبت آگهی جدید',
  },
  'error': {
    icon: <AlertTriangle className="h-12 w-12" />,
    title: 'مشکلی پیش آمده',
    description: 'لطفاً دوباره تلاش کنید',
    actionLabel: 'تلاش مجدد',
  },
  'no-messages': {
    icon: <MessageSquare className="h-12 w-12" />,
    title: 'پیامی وجود ندارد',
    description: 'اولین پیام خود را ارسال کنید',
  },
  'no-units': {
    icon: <Building2 className="h-12 w-12" />,
    title: 'واحدی یافت نشد',
    description: 'واحدهای ساختمان را اضافه کنید',
    actionLabel: 'افزودن واحد',
  },
};

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  className?: string;
  customTitle?: string;
  customDescription?: string;
  customActionLabel?: string;
}

export function EmptyState({
  type,
  onAction,
  className,
  customTitle,
  customDescription,
  customActionLabel,
}: EmptyStateProps) {
  const config = emptyStateConfigs[type];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in',
      className
    )}>
      <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
        {config.icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">
        {customTitle || config.title}
      </h3>
      {(customDescription || config.description) && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          {customDescription || config.description}
        </p>
      )}
      {(customActionLabel || config.actionLabel) && onAction && (
        <Button onClick={onAction} className="mt-2">
          {customActionLabel || config.actionLabel}
        </Button>
      )}
    </div>
  );
}
