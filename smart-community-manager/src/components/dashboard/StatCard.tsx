import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toPersianNumber, formatPriceShort } from '@/lib/persian';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: 'currency' | 'number' | 'percent';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  format = 'currency',
  variant = 'default',
  className,
}: StatCardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatPriceShort(value);
      case 'percent':
        return `${toPersianNumber(value)}٪`;
      default:
        return toPersianNumber(value);
    }
  };

  const variantStyles = {
    default: 'bg-card',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
    destructive: 'bg-destructive/5 border-destructive/20',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight animate-count-up">
              {formatValue()}
            </p>
            {trend && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{toPersianNumber(trend.value)}٪ نسبت به ماه قبل</span>
              </div>
            )}
          </div>
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            iconStyles[variant]
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
