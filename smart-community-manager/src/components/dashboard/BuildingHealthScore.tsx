import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toPersianNumber } from '@/lib/persian';
import { cn } from '@/lib/utils';

interface BuildingHealthScoreProps {
  score: number;
}

export function BuildingHealthScore({ score }: BuildingHealthScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'عالی';
    if (score >= 60) return 'متوسط';
    return 'نیاز به بهبود';
  };

  const getScoreGradient = () => {
    if (score >= 80) return 'from-success to-success/60';
    if (score >= 60) return 'from-warning to-warning/60';
    return 'from-destructive to-destructive/60';
  };

  // Calculate the stroke dasharray for the circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">سلامت ساختمان</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="160" height="160" className="-rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={score >= 80 ? 'hsl(var(--success))' : score >= 60 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'} />
                  <stop offset="100%" stopColor={score >= 80 ? 'hsl(var(--success) / 0.6)' : score >= 60 ? 'hsl(var(--warning) / 0.6)' : 'hsl(var(--destructive) / 0.6)'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-4xl font-bold', getScoreColor())}>
                {toPersianNumber(score)}
              </span>
              <span className="text-sm text-muted-foreground">{getScoreLabel()}</span>
            </div>
          </div>

          <div className="mt-4 w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">وصول شارژ</span>
              <span className="font-medium text-success">{toPersianNumber(85)}٪</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">رضایت ساکنین</span>
              <span className="font-medium text-primary">{toPersianNumber(72)}٪</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">نگهداری</span>
              <span className="font-medium text-warning">{toPersianNumber(65)}٪</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
