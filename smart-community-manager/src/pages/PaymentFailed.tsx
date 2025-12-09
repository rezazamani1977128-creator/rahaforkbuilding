import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, CreditCard, MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toPersianNumber } from '@/lib/persian';

export default function PaymentFailed() {
  const errorCode = 'ERR_۱۲۳۴';

  return (
    <div className="min-h-screen bg-gradient-to-b from-destructive/5 via-background to-background pb-20">
      <div className="container py-8 space-y-6">
        {/* Error Animation */}
        <div className="flex flex-col items-center text-center py-8 animate-fade-in">
          <div className="relative mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-destructive mb-2">
            پرداخت ناموفق
          </h1>
          <p className="text-muted-foreground max-w-xs">
            متأسفانه پرداخت شما با مشکل مواجه شد. لطفاً دوباره تلاش کنید
          </p>
        </div>

        {/* Error Details */}
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">کد خطا</p>
            <p className="font-mono text-lg font-bold">{errorCode}</p>
            <p className="text-xs text-muted-foreground">
              در صورت کسر مبلغ از حساب، حداکثر تا ۷۲ ساعت به حساب شما بازگردانده می‌شود
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button size="lg" className="w-full gap-2">
            <RefreshCw className="h-5 w-5" />
            تلاش مجدد
          </Button>
          <Button variant="outline" size="lg" className="w-full gap-2">
            <CreditCard className="h-5 w-5" />
            استفاده از روش دیگر
          </Button>
          <Button variant="ghost" size="lg" className="w-full gap-2">
            <MessageCircle className="h-5 w-5" />
            تماس با پشتیبانی
          </Button>
        </div>

        {/* Back to Dashboard */}
        <Button variant="link" asChild className="w-full">
          <Link to="/resident" className="gap-1">
            <ChevronRight className="h-4 w-4" />
            بازگشت به داشبورد
          </Link>
        </Button>
      </div>
    </div>
  );
}
