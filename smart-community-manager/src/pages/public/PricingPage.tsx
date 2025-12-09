import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Building2,
  Check,
  ArrowRight,
  Shield,
  Headphones,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { toPersianNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'basic',
    name: 'پایه',
    description: 'مناسب برای ساختمان‌های کوچک',
    monthlyPrice: 99000,
    yearlyPrice: 990000, // 2 months free
    features: [
      { text: 'تا ۱۰ واحد', included: true },
      { text: 'مدیریت شارژ و هزینه', included: true },
      { text: 'پرداخت آنلاین', included: true },
      { text: 'گزارشات پایه', included: true },
      { text: 'اطلاعیه به ساکنین', included: true },
      { text: 'پشتیبانی ایمیل', included: true },
      { text: 'صندوق ساختمان', included: false },
      { text: 'گزارشات پیشرفته', included: false },
      { text: 'اطلاعیه SMS', included: false },
    ],
    color: 'border-gray-200',
    popular: false,
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    description: 'محبوب‌ترین انتخاب',
    monthlyPrice: 199000,
    yearlyPrice: 1990000,
    features: [
      { text: 'تا ۵۰ واحد', included: true },
      { text: 'تمام امکانات پایه', included: true },
      { text: 'صندوق ساختمان', included: true },
      { text: 'گزارشات پیشرفته', included: true },
      { text: 'اطلاعیه SMS', included: true },
      { text: 'نظرسنجی و رأی‌گیری', included: true },
      { text: 'مدیریت اسناد', included: true },
      { text: 'پشتیبانی تلفنی', included: true },
      { text: 'چند ساختمان', included: false },
    ],
    color: 'border-primary',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    description: 'برای مجتمع‌های بزرگ',
    monthlyPrice: 399000,
    yearlyPrice: 3990000,
    features: [
      { text: 'واحدهای نامحدود', included: true },
      { text: 'تمام امکانات حرفه‌ای', included: true },
      { text: 'مدیریت چند ساختمان', included: true },
      { text: 'API اختصاصی', included: true },
      { text: 'برندینگ سفارشی', included: true },
      { text: 'گزارشات سفارشی', included: true },
      { text: 'پشتیبانی ۲۴/۷', included: true },
      { text: 'مدیر حساب اختصاصی', included: true },
      { text: 'آموزش اختصاصی', included: true },
    ],
    color: 'border-purple-500',
    popular: false,
  },
];

export function PricingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isYearly, setIsYearly] = useState(false);
  const selectedPlan = searchParams.get('plan');

  const formatPrice = (price: number) => {
    return toPersianNumber(price.toLocaleString());
  };

  const handleSelectPlan = (planId: string) => {
    navigate(`/register?plan=${planId}&billing=${isYearly ? 'yearly' : 'monthly'}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ساختمان من</span>
          </Link>

          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">پلن مناسب خود را انتخاب کنید</h1>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          ۱۴ روز استفاده رایگان از تمام امکانات. بدون نیاز به کارت بانکی.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label htmlFor="billing" className={cn(!isYearly && 'font-bold')}>
            ماهانه
          </Label>
          <Switch
            id="billing"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label htmlFor="billing" className={cn(isYearly && 'font-bold')}>
            سالانه
            <Badge variant="secondary" className="mr-2">
              ۲ ماه رایگان
            </Badge>
          </Label>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  'relative transition-all hover:shadow-xl',
                  plan.color,
                  plan.popular && 'border-2 scale-105 shadow-lg',
                  selectedPlan === plan.id && 'ring-2 ring-primary'
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4">
                    <Sparkles className="h-3 w-3 ml-1" />
                    محبوب‌ترین
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {formatPrice(isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice)}
                    </span>
                    <span className="text-muted-foreground mr-2">تومان / ماه</span>
                    {isYearly && (
                      <div className="text-sm text-muted-foreground">
                        ({formatPrice(plan.yearlyPrice)} تومان سالانه)
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 text-right">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={cn(
                          'flex items-center gap-2',
                          !feature.included && 'text-muted-foreground'
                        )}
                      >
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0',
                            feature.included ? 'text-green-500' : 'text-muted-foreground/50'
                          )}
                        />
                        <span className={cn(!feature.included && 'line-through')}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    شروع رایگان
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 bg-muted/50 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">ضمانت بازگشت وجه</h3>
              <p className="text-sm text-muted-foreground">
                تا ۳۰ روز پس از خرید
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">پرداخت امن</h3>
              <p className="text-sm text-muted-foreground">
                با درگاه‌های معتبر بانکی
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">پشتیبانی</h3>
              <p className="text-sm text-muted-foreground">
                تیم پشتیبانی همیشه در کنار شماست
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {toPersianNumber(new Date().getFullYear())} ساختمان من - تمامی حقوق محفوظ است
        </div>
      </footer>
    </div>
  );
}
