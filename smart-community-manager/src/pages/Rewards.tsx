import { Link } from 'react-router-dom';
import {
  Gift,
  ChevronRight,
  Star,
  Check,
  Clock,
  Sparkles,
  Percent,
  Car,
  Users,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toPersianNumber, formatPrice } from '@/lib/persian';
import { cn } from '@/lib/utils';

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  available: boolean;
  claimed?: boolean;
  expiresIn?: string;
}

const rewards: Reward[] = [
  {
    id: '1',
    name: 'تخفیف ۱۰٪ شارژ',
    description: 'تخفیف روی شارژ ماه آینده',
    icon: <Percent className="h-6 w-6" />,
    points: 500,
    available: true,
  },
  {
    id: '2',
    name: 'پارکینگ اولویت‌دار',
    description: 'پارکینگ ممتاز به مدت یک ماه',
    icon: <Car className="h-6 w-6" />,
    points: 1000,
    available: true,
  },
  {
    id: '3',
    name: 'کارت مهمان',
    description: '۵ کارت ورود مهمان رایگان',
    icon: <Users className="h-6 w-6" />,
    points: 300,
    available: true,
  },
  {
    id: '4',
    name: 'نشان طلایی',
    description: 'نمایش نشان در تابلو ساختمان',
    icon: <Award className="h-6 w-6" />,
    points: 2000,
    available: false,
  },
  {
    id: '5',
    name: 'اعتبار ویژه',
    description: 'اعتبار ۱۰۰,۰۰۰ تومانی',
    icon: <Sparkles className="h-6 w-6" />,
    points: 1500,
    available: false,
  },
];

const claimedRewards = [
  { id: 'c1', name: 'تخفیف ۵٪ شارژ', claimedAt: 'آبان ۱۴۰۲', expiresAt: 'دی ۱۴۰۲' },
];

export default function Rewards() {
  const userPoints = 850;
  const nextMilestone = 1000;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/resident">
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">جوایز و پاداش‌ها</h1>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Points Balance */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-l from-accent to-accent/80 p-6 text-accent-foreground">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-80">امتیاز شما</p>
                <p className="text-4xl font-bold">
                  {toPersianNumber(userPoints)}
                </p>
              </div>
              <Star className="h-12 w-12 opacity-80" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>تا {toPersianNumber(nextMilestone)} امتیاز</span>
                <span>{toPersianNumber(nextMilestone - userPoints)} امتیاز مانده</span>
              </div>
              <Progress 
                value={(userPoints / nextMilestone) * 100} 
                className="h-2 bg-accent-foreground/20"
              />
            </div>
          </div>
        </Card>

        {/* Available Rewards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">جوایز قابل دریافت</h2>
          <div className="grid gap-3">
            {rewards.map((reward) => {
              const canClaim = reward.available && userPoints >= reward.points;
              return (
                <Card
                  key={reward.id}
                  className={cn(
                    'transition-all',
                    !reward.available && 'opacity-60'
                  )}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-xl',
                      canClaim ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      {reward.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {reward.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-accent" />
                        <span className="text-xs font-medium">
                          {toPersianNumber(reward.points)} امتیاز
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={!canClaim}
                      variant={canClaim ? 'default' : 'outline'}
                    >
                      {canClaim ? 'دریافت' : 'قفل'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Claimed Rewards */}
        {claimedRewards.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                جوایز دریافت شده
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {claimedRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">
                        دریافت شده در {reward.claimedAt}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    تا {reward.expiresAt}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* How to Earn Points */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">چگونه امتیاز کسب کنیم؟</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>پرداخت به موقع شارژ</span>
              <Badge variant="secondary">+{toPersianNumber(50)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>پرداخت قبل از موعد</span>
              <Badge variant="secondary">+{toPersianNumber(25)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>شرکت در رأی‌گیری</span>
              <Badge variant="secondary">+{toPersianNumber(10)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>دعوت از همسایه جدید</span>
              <Badge variant="secondary">+{toPersianNumber(100)}</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
