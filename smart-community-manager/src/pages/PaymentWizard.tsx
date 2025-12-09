import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Wallet,
  Building2,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Lock,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toPersianNumber, formatPrice, persianMonths } from '@/lib/persian';
import { mockCharges } from '@/data/mockData';
import { cn } from '@/lib/utils';

type PaymentStep = 'review' | 'method' | 'confirm' | 'processing' | 'success';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'zarinpal',
    name: 'زرین‌پال',
    icon: <CreditCard className="h-6 w-6" />,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    description: 'پرداخت آنلاین با کارت بانکی',
  },
  {
    id: 'idpay',
    name: 'آی‌دی‌پی',
    icon: <Smartphone className="h-6 w-6" />,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    description: 'درگاه پرداخت سریع',
  },
  {
    id: 'mellat',
    name: 'بانک ملت',
    icon: <Building2 className="h-6 w-6" />,
    color: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    description: 'درگاه مستقیم بانک',
  },
  {
    id: 'saman',
    name: 'بانک سامان',
    icon: <Shield className="h-6 w-6" />,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    description: 'پرداخت امن',
  },
  {
    id: 'card_to_card',
    name: 'کارت به کارت',
    icon: <Banknote className="h-6 w-6" />,
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    description: 'انتقال مستقیم به حساب مدیریت',
  },
];

const steps: { key: PaymentStep; label: string }[] = [
  { key: 'review', label: 'بررسی' },
  { key: 'method', label: 'روش پرداخت' },
  { key: 'confirm', label: 'تأیید' },
  { key: 'processing', label: 'پردازش' },
];

export default function PaymentWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<PaymentStep>('review');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [partialPayment, setPartialPayment] = useState(false);
  const [paymentPercent, setPaymentPercent] = useState([100]);

  const charge = mockCharges[0];
  const chargePerUnit = Math.ceil(charge.totalAmount / 8);
  const paymentAmount = Math.round(chargePerUnit * (paymentPercent[0] / 100));

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    const stepOrder: PaymentStep[] = ['review', 'method', 'confirm', 'processing', 'success'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      if (currentStep === 'confirm') {
        setCurrentStep('processing');
        // Simulate payment processing
        setTimeout(() => {
          navigate('/payment/success');
        }, 2000);
      } else {
        setCurrentStep(stepOrder[currentIndex + 1]);
      }
    }
  };

  const handleBack = () => {
    const stepOrder: PaymentStep[] = ['review', 'method', 'confirm'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronRight className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">پرداخت شارژ</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container py-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all',
                index < currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStepIndex
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
              )}>
                {index < currentStepIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  toPersianNumber(index + 1)
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'mx-2 h-0.5 w-8 sm:w-16',
                  index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                )} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((step) => (
            <span key={step.key} className="w-16 text-center">{step.label}</span>
          ))}
        </div>
      </div>

      <main className="container py-4 space-y-4">
        {/* Step 1: Review */}
        {currentStep === 'review' && (
          <div className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">جزئیات شارژ</CardTitle>
                <CardDescription>
                  {persianMonths[charge.month - 1]} {toPersianNumber(charge.year)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Charge breakdown */}
                <div className="space-y-2">
                  {charge.items.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.title}</span>
                      <span>{formatPrice(Math.round(item.amount / 8))}</span>
                    </div>
                  ))}
                  {charge.items.length > 5 && (
                    <Button variant="ghost" size="sm" className="w-full text-primary">
                      مشاهده همه ({toPersianNumber(charge.items.length)} قلم)
                    </Button>
                  )}
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">جمع کل</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(chargePerUnit)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partial Payment Option */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">پرداخت قسطی</span>
                  <Button
                    variant={partialPayment ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPartialPayment(!partialPayment)}
                  >
                    {partialPayment ? 'فعال' : 'غیرفعال'}
                  </Button>
                </div>

                {partialPayment && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between text-sm">
                      <span>درصد پرداخت</span>
                      <Badge variant="secondary">
                        {toPersianNumber(paymentPercent[0])}٪
                      </Badge>
                    </div>
                    <Slider
                      value={paymentPercent}
                      onValueChange={setPaymentPercent}
                      min={25}
                      max={100}
                      step={25}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>۲۵٪</span>
                      <span>۵۰٪</span>
                      <span>۷۵٪</span>
                      <span>۱۰۰٪</span>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3 text-center">
                      <p className="text-sm text-muted-foreground">مبلغ پرداختی</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(paymentAmount)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 'method' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              روش پرداخت مورد نظر خود را انتخاب کنید
            </p>

            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedMethod === method.id
                      ? 'ring-2 ring-primary'
                      : 'hover:bg-muted/50'
                  )}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl border',
                      method.color
                    )}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <div className={cn(
                      'h-5 w-5 rounded-full border-2 transition-all',
                      selectedMethod === method.id
                        ? 'border-primary bg-primary'
                        : 'border-muted'
                    )}>
                      {selectedMethod === method.id && (
                        <Check className="h-full w-full text-primary-foreground p-0.5" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Saved Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">کارت‌های ذخیره شده</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">
                  هنوز کارتی ذخیره نشده است
                </p>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                پرداخت امن
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                SSL
              </Badge>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {currentStep === 'confirm' && (
          <div className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">تأیید نهایی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">شارژ ماه</span>
                    <span>{persianMonths[charge.month - 1]} {toPersianNumber(charge.year)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">روش پرداخت</span>
                    <span>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">واحد</span>
                    <span>۱۰۱ - برج آسمان</span>
                  </div>
                </div>

                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">مبلغ قابل پرداخت</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(paymentAmount)}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  با کلیک روی دکمه پرداخت، به درگاه بانک هدایت می‌شوید
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Processing */}
        {currentStep === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <CreditCard className="absolute inset-0 m-auto h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">در حال پردازش...</p>
            <p className="text-sm text-muted-foreground">لطفاً صبر کنید</p>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      {currentStep !== 'processing' && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur p-4">
          <div className="container flex gap-3">
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ChevronRight className="h-4 w-4" />
                قبلی
              </Button>
            )}
            <Button
              className="flex-1 gap-2"
              onClick={handleNext}
              disabled={currentStep === 'method' && !selectedMethod}
            >
              {currentStep === 'confirm' ? 'پرداخت' : 'ادامه'}
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
