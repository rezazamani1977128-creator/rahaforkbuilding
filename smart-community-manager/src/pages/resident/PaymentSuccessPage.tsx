import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  Printer, 
  Home,
  Flame,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  // Get payment details from navigation state
  const paymentDetails = location.state || {
    amount: 2500000,
    method: 'zarinpal',
    transactionId: 'TXN123456789',
    month: 'آذر',
    year: 1403,
  };

  const paymentStreak = 6; // In production, fetch from API
  const pointsEarned = 50;

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const methodNames: Record<string, string> = {
    zarinpal: 'زرین‌پال',
    idpay: 'آی‌دی‌پی',
    mellat: 'بانک ملت',
    saman: 'بانک سامان',
    'card-transfer': 'کارت به کارت',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Confetti Animation */}
      {showConfetti && (
        <style>{`
          @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: #f0f;
            animation: confetti-fall 3s linear;
            z-index: 9999;
          }
        `}</style>
      )}
      {showConfetti && Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#f0f', '#0ff', '#ff0', '#0f0', '#f00'][Math.floor(Math.random() * 5)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Success Card */}
      <Card className="border-green-500/50 bg-gradient-to-br from-green-500/5 to-green-500/10">
        <CardContent className="pt-6 text-center space-y-6">
          {/* Animated Checkmark */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="h-16 w-16 text-green-500" strokeWidth={2} />
              </div>
              <style>{`
                @keyframes check-scale {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                }
                .animate-pulse {
                  animation: check-scale 2s ease-in-out infinite;
                }
              `}</style>
            </div>
          </div>

          {/* Success Message */}
          <div>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-500">
              پرداخت موفق! 🎉
            </h1>
            <p className="text-muted-foreground mt-2">
              پرداخت شما با موفقیت انجام شد
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-background rounded-lg p-6 space-y-4 text-right">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">مبلغ پرداختی</span>
              <span className="text-2xl font-bold">
                {toPersianNumber(paymentDetails.amount.toLocaleString())} تومان
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">شماره تراکنش</span>
              <span className="font-mono text-sm">{paymentDetails.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">تاریخ و زمان</span>
              <span>{formatPersianDate(new Date())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">روش پرداخت</span>
              <span>{methodNames[paymentDetails.method] || paymentDetails.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">بابت</span>
              <span>
                شارژ {paymentDetails.month} {toPersianNumber(paymentDetails.year)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg">
              <Download className="ml-2 h-5 w-5" />
              دانلود رسید
            </Button>
            <Button variant="outline" size="lg">
              <Printer className="ml-2 h-5 w-5" />
              چاپ
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              واتساپ
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              تلگرام
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Streak Celebration */}
      <Card className="border-orange-500/50 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">
                رکورد پرداخت به موقع: {toPersianNumber(paymentStreak)} ماه! 🔥
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {toPersianNumber(pointsEarned)} امتیاز دریافت کردید
              </p>
            </div>
            <Trophy className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      {/* Receipt Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">رسید پرداخت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">ساختمان هوشمند</div>
            <div className="text-xs text-muted-foreground">
              سیستم مدیریت ساختمان
            </div>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>پرداخت‌کننده:</span>
              <span className="font-medium">علی محمدی</span>
            </div>
            <div className="flex justify-between">
              <span>واحد:</span>
              <span className="font-medium">{toPersianNumber('201')}</span>
            </div>
            <div className="flex justify-between">
              <span>شماره تراکنش:</span>
              <span className="font-mono text-xs">{paymentDetails.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span>مبلغ:</span>
              <span className="font-bold">{toPersianNumber(paymentDetails.amount.toLocaleString())} تومان</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              QR Code
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Button */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => navigate('/resident/history')}>
          تاریخچه پرداخت‌ها
        </Button>
        <Button className="flex-1" onClick={() => navigate('/resident/dashboard')}>
          <Home className="ml-2 h-5 w-5" />
          بازگشت به داشبورد
        </Button>
      </div>
    </div>
  );
}
