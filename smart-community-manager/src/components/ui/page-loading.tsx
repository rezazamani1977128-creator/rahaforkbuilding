import { Loader2 } from 'lucide-react';

export function PageLoading({ message = 'در حال بارگذاری...' }: { message?: string }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center" dir="rtl">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function FullPageLoading({ message = 'در حال بارگذاری...' }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      dir="rtl"
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}

export function InlineLoading({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`animate-spin text-primary ${sizes[size]}`} />
    </div>
  );
}
