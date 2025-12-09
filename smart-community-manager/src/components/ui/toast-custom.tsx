import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  type: ToastType;
  title: string;
  description?: string;
  onClose?: () => void;
}

const icons: Record<ToastType, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success:
    'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error:
    'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning:
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
};

export function CustomToast({
  type,
  title,
  description,
  onClose,
}: CustomToastProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-up',
        styles[type]
      )}
      dir="rtl"
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', iconStyles[type])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm opacity-80 mt-1">{description}</p>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Helper functions to show toasts
export const showSuccessToast = (title: string, description?: string) => {
  console.log('Success:', title, description);
};

export const showErrorToast = (title: string, description?: string) => {
  console.log('Error:', title, description);
};

export const showWarningToast = (title: string, description?: string) => {
  console.log('Warning:', title, description);
};

export const showInfoToast = (title: string, description?: string) => {
  console.log('Info:', title, description);
};
