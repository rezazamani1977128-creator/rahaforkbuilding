import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Download,
  Share2,
  Printer,
  Home,
  Receipt,
  Flame,
  Star,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Confetti } from '@/components/ui/confetti';
import { toPersianNumber, formatPrice, persianMonths } from '@/lib/persian';

export default function PaymentSuccess() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [streakAnimated, setStreakAnimated] = useState(false);

  const paymentData = {
    amount: 450000,
    month: 9,
    year: 1402,
    transactionId: '۱۲۳۴۵۶۷۸۹۰',
    dateTime: new Date(),
    buildingName: 'برج آسمان',
    unitNumber: '۱۰۱',
    residentName: 'علی رضایی',
    newStreak: 9,
    pointsEarned: 50,
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    const streakTimer = setTimeout(() => setStreakAnimated(true), 1000);
    return () => {
      clearTimeout(timer);
      clearTimeout(streakTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-success/5 via-background to-background pb-20">
      <Confetti active={showConfetti} />

      <div className="container py-8 space-y-6">
        {/* Success Animation */}
        <div className="flex flex-col items-center text-center py-8 animate-scale-in">
          <div className="relative mb-4">
            <div className="absolute inset-0 animate-ping bg-success/20 rounded-full" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success shadow-lg shadow-success/30">
              <CheckCircle2 className="h-12 w-12 text-success-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-success mb-2">
            پرداخت موفق!
          </h1>
          <p className="text-muted-foreground">
            شارژ {persianMonths[paymentData.month - 1]} با موفقیت پرداخت شد
          </p>
        </div>

        {/* Amount Display */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-l from-success to-success/80 p-6 text-center text-success-foreground">
            <p className="text-sm opacity-80 mb-1">مبلغ پرداختی</p>
            <p className="text-4xl font-bold">
              {formatPrice(paymentData.amount)}
            </p>
          </div>
        </Card>

        {/* Receipt Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center border-b pb-4">
              <Receipt className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h2 className="font-bold">رسید پرداخت</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ساختمان</span>
                <span className="font-medium">{paymentData.buildingName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">واحد</span>
                <span className="font-medium">{paymentData.unitNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">نام پرداخت‌کننده</span>
                <span className="font-medium">{paymentData.residentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">شماره تراکنش</span>
                <span className="font-medium font-mono" dir="ltr">
                  {paymentData.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاریخ و ساعت</span>
                <span className="font-medium">
                  {toPersianNumber(paymentData.dateTime.getHours())}:
                  {toPersianNumber(paymentData.dateTime.getMinutes().toString().padStart(2, '0'))}
                </span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center pt-4">
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">QR Code</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gamification Celebration */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-4">
            {/* Streak Celebration */}
            <div className={`flex items-center justify-center gap-4 transition-all duration-1000 ${
              streakAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg animate-bounce-subtle">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">استریک شما</p>
                  <p className="text-2xl font-bold text-amber-500">
                    {toPersianNumber(paymentData.newStreak)} ماه
                  </p>
                </div>
              </div>
            </div>

            {/* Points Earned */}
            <div className="flex items-center justify-center gap-2 rounded-lg bg-accent/10 p-3">
              <Star className="h-5 w-5 text-accent" />
              <span className="font-medium">
                +{toPersianNumber(paymentData.pointsEarned)} امتیاز کسب کردید!
              </span>
            </div>

            {/* Motivational Message */}
            <p className="text-center text-sm text-muted-foreground">
              عالی بود! تا رسیدن به نشان طلایی {toPersianNumber(3)} ماه دیگر مانده 🎯
            </p>
          </CardContent>
        </Card>

        {/* Share Actions */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">اشتراک‌گذاری رسید</p>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="sm" className="flex-col gap-1 h-auto py-3">
                <Download className="h-4 w-4" />
                <span className="text-[10px]">دانلود</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col gap-1 h-auto py-3 text-green-600">
                <MessageCircle className="h-4 w-4" />
                <span className="text-[10px]">واتساپ</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col gap-1 h-auto py-3 text-blue-500">
                <Share2 className="h-4 w-4" />
                <span className="text-[10px]">تلگرام</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col gap-1 h-auto py-3">
                <Mail className="h-4 w-4" />
                <span className="text-[10px]">ایمیل</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" asChild className="gap-2">
            <Link to="/payment">
              <Receipt className="h-4 w-4" />
              پرداخت بعدی
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link to="/resident">
              <Home className="h-4 w-4" />
              داشبورد
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
