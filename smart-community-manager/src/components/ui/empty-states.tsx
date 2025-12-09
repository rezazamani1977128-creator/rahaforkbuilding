import { ReactNode } from 'react';
import {
  FileText,
  Users,
  CreditCard,
  Bell,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Wrench,
  Vote,
  FolderOpen,
  Search,
  AlertCircle,
  Inbox,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
  children,
}: EmptyStateProps) {
  const sizes = {
    sm: { icon: 'h-10 w-10', container: 'py-8', title: 'text-base', desc: 'text-sm' },
    md: { icon: 'h-12 w-12', container: 'py-12', title: 'text-lg', desc: 'text-sm' },
    lg: { icon: 'h-16 w-16', container: 'py-16', title: 'text-xl', desc: 'text-base' },
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        sizes[size].container,
        className
      )}
      dir="rtl"
    >
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className={cn('text-muted-foreground', sizes[size].icon)} />
      </div>
      <h3 className={cn('font-medium mb-1', sizes[size].title)}>{title}</h3>
      {description && (
        <p className={cn('text-muted-foreground max-w-sm mb-4', sizes[size].desc)}>
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="mb-2"
        >
          {action.label}
        </Button>
      )}
      {secondaryAction && (
        <Button onClick={secondaryAction.onClick} variant="ghost" size="sm">
          {secondaryAction.label}
        </Button>
      )}
      {children}
    </div>
  );
}

// Pre-configured empty states for common scenarios

export function NoPaymentsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={CreditCard}
      title="پرداختی ثبت نشده"
      description="هنوز پرداختی برای این دوره ثبت نشده است."
      action={onAction ? { label: 'ثبت پرداخت', onClick: onAction } : undefined}
    />
  );
}

export function NoResidentsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="ساکنی یافت نشد"
      description="هنوز ساکنی به این ساختمان اضافه نشده است."
      action={onAction ? { label: 'افزودن ساکن', onClick: onAction } : undefined}
    />
  );
}

export function NoChargesEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="شارژی ثبت نشده"
      description="برای این ماه شارژی ایجاد نشده است."
      action={onAction ? { label: 'ایجاد شارژ', onClick: onAction } : undefined}
    />
  );
}

export function NoAnnouncementsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Bell}
      title="اطلاعیه‌ای وجود ندارد"
      description="هنوز اطلاعیه‌ای منتشر نشده است."
      action={onAction ? { label: 'ایجاد اطلاعیه', onClick: onAction } : undefined}
    />
  );
}

export function NoRequestsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Wrench}
      title="درخواستی ثبت نشده"
      description="هنوز درخواست تعمیراتی ثبت نشده است."
      action={onAction ? { label: 'ثبت درخواست', onClick: onAction } : undefined}
    />
  );
}

export function NoPollsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Vote}
      title="نظرسنجی فعالی نیست"
      description="در حال حاضر نظرسنجی فعالی وجود ندارد."
      action={onAction ? { label: 'ایجاد نظرسنجی', onClick: onAction } : undefined}
    />
  );
}

export function NoEventsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="رویدادی ثبت نشده"
      description="هنوز رویدادی برنامه‌ریزی نشده است."
      action={onAction ? { label: 'ایجاد رویداد', onClick: onAction } : undefined}
    />
  );
}

export function NoListingsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="آگهی‌ای یافت نشد"
      description="هنوز آگهی‌ای در بازارچه ثبت نشده است."
      action={onAction ? { label: 'ثبت آگهی', onClick: onAction } : undefined}
    />
  );
}

export function NoDiscussionsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={MessageSquare}
      title="بحثی شروع نشده"
      description="هنوز موضوعی برای بحث ایجاد نشده است."
      action={onAction ? { label: 'شروع بحث', onClick: onAction } : undefined}
    />
  );
}

export function NoDocumentsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="سندی یافت نشد"
      description="هنوز سندی در این پوشه آپلود نشده است."
      action={onAction ? { label: 'آپلود سند', onClick: onAction } : undefined}
    />
  );
}

export function NoSearchResultsEmpty({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      title="نتیجه‌ای یافت نشد"
      description={
        query ? `جستجوی "${query}" نتیجه‌ای نداشت.` : 'جستجوی شما نتیجه‌ای نداشت.'
      }
      action={
        onClear
          ? { label: 'پاک کردن جستجو', onClick: onClear, variant: 'outline' }
          : undefined
      }
    />
  );
}

export function ErrorEmpty({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="خطایی رخ داده است"
      description="متأسفانه در بارگذاری اطلاعات مشکلی پیش آمده است."
      action={onRetry ? { label: 'تلاش مجدد', onClick: onRetry } : undefined}
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={Bell}
      title="اعلانی ندارید"
      description="اعلان‌های جدید اینجا نمایش داده می‌شوند."
      size="sm"
    />
  );
}

export function NothingFoundEmpty() {
  return (
    <EmptyState
      icon={Inbox}
      title="چیزی یافت نشد"
      description="متأسفانه با معیارهای تعیین شده چیزی یافت نشد."
      size="sm"
    />
  );
}
