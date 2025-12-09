import { useNavigate } from 'react-router-dom';
import { useDemo } from '@/contexts/DemoContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Building2, CreditCard, BarChart3, Shield, Headphones } from 'lucide-react';
import { toPersianNumber } from '@/lib/utils';

const plans = [
  {
    id: 'basic',
    name: 'پایه',
    description: 'برای ساختمان‌های کوچک',
    price: 99000,
    period: 'ماهانه',
    features: [
      'تا ۱۰ واحد',
      'مدیریت شارژ',
      'پرداخت آنلاین',
      'گزارشات پایه',
      'پشتیبانی ایمیل',
    ],
    popular: false,
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    description: 'برای ساختمان‌های متوسط',
    price: 199000,
    period: 'ماهانه',
    features: [
      'تا ۵۰ واحد',
      'تمام امکانات پایه',
      'صندوق ساختمان',
      'گزارشات پیشرفته',
      'اطلاعیه SMS',
      'پشتیبانی تلفنی',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    description: 'برای مجتمع‌های بزرگ',
    price: 399000,
    period: 'ماهانه',
    features: [
      'واحدهای نامحدود',
      'تمام امکانات حرفه‌ای',
      'چند ساختمان',
      'API اختصاصی',
      'برندینگ سفارشی',
      'پشتیبانی ۲۴/۷',
      'مدیر حساب اختصاصی',
    ],
    popular: false,
  },
];

export function UpgradeModal() {
  const { isUpgradeModalOpen, hideUpgradeModal, exitDemoMode } = useDemo();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    hideUpgradeModal();
    exitDemoMode();
    navigate(`/pricing?plan=${planId}`);
  };

  const formatPrice = (price: number) => {
    return toPersianNumber(price.toLocaleString());
  };

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={hideUpgradeModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl">ارتقا به نسخه کامل</DialogTitle>
          <DialogDescription className="text-base">
            از تمام امکانات ساختمان من بهره‌مند شوید
          </DialogDescription>
        </DialogHeader>

        {/* Features highlight */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm">مدیریت آسان</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm">پرداخت آنلاین</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm">گزارشات کامل</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Headphones className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm">پشتیبانی</span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-4 py-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={
                plan.popular 
                  ? 'relative transition-all hover:shadow-lg border-primary shadow-md'
                  : 'relative transition-all hover:shadow-lg'
              }
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  محبوب‌ترین
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                  <span className="text-muted-foreground mr-1">تومان</span>
                  <span className="text-muted-foreground text-sm">/ {plan.period}</span>
                </div>
                
                <ul className="space-y-2 text-sm text-right mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  انتخاب پلن
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 py-4 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>پرداخت امن</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>گارانتی بازگشت وجه</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
