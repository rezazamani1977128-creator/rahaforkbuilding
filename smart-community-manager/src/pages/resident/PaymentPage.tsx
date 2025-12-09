import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Shield,
  Lock,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toPersianNumber } from '@/lib/persian';
import { cn } from '@/lib/utils';

type PaymentStep = 1 | 2 | 3;

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'zarinpal', name: 'زرین‌پال', logo: '💳', description: 'پرداخت آنلاین سریع و امن' },
  { id: 'idpay', name: 'آی‌دی‌پی', logo: '🔷', description: 'درگاه پرداخت اینترنتی' },
  { id: 'mellat', name: 'بانک ملت', logo: '🏦', description: 'درگاه بانک ملت' },
  { id: 'saman', name: 'بانک سامان', logo: '🏧', description: 'درگاه بانک سامان' },
  { id: 'card-transfer', name: 'کارت به کارت', logo: '💵', description: 'انتقال وجه از طریق کارت بانکی' },
];

export function PaymentPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<PaymentStep>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [payPartial, setPayPartial] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock charge data
  const currentCharge = {
    month: 'آذر',
    year: 1403,
    amount: 2500000,
  };

  const previousOutstanding = 0;
  const totalToPay = payPartial && customAmount 
    ? parseInt(customAmount.replace(/,/g, ''))
    : currentCharge.amount + previousOutstanding;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as PaymentStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as PaymentStep);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to success page
    navigate('/resident/pay/success', {
      state: {
        amount: totalToPay,
        method: selectedPaymentMethod,
        transactionId: `TXN${Date.now()}`,
        month: currentCharge.month,
        year: currentCharge.year,
      }
    });
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">پرداخت شارژ</h1>
        <p className="text-muted-foreground mt-1">
          مرحله {toPersianNumber(currentStep)} از {toPersianNumber(3)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>
            بررسی شارژ
          </span>
          <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>
            انتخاب روش پرداخت
          </span>
          <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>
            تایید و پرداخت
          </span>
        </div>
      </div>

      {/* Step 1: Review Charges */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>بررسی شارژ</CardTitle>
            <CardDescription>
              مبالغ قابل پرداخت را بررسی کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Charge */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    شارژ {currentCharge.month} {toPersianNumber(currentCharge.year)}
                  </h3>
                  <p className="text-sm text-muted-foreground">شارژ ماه جاری</p>
                </div>
                <p className="text-xl font-bold">
                  {toPersianNumber(currentCharge.amount.toLocaleString())} تومان
                </p>
              </div>
            </div>

            {/* Outstanding Balance */}
            {previousOutstanding > 0 && (
              <div className="p-4 border border-orange-500/50 bg-orange-500/5 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">بدهی قبلی</h3>
                    <p className="text-sm text-muted-foreground">ماه‌های گذشته</p>
                  </div>
                  <p className="text-xl font-bold text-orange-500">
                    {toPersianNumber(previousOutstanding.toLocaleString())} تومان
                  </p>
                </div>
              </div>
            )}

            {/* Partial Payment Option */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="partial" 
                  checked={payPartial}
                  onCheckedChange={(checked) => setPayPartial(checked as boolean)}
                />
                <Label htmlFor="partial" className="cursor-pointer">
                  پرداخت مبلغ دلخواه (پرداخت جزئی)
                </Label>
              </div>
              
              {payPartial && (
                <div className="space-y-2 pr-6">
                  <Label htmlFor="custom-amount">مبلغ (تومان)</Label>
                  <Input
                    id="custom-amount"
                    type="text"
                    placeholder={toPersianNumber('1000000')}
                    value={customAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(value)) {
                        setCustomAmount(value ? parseInt(value).toLocaleString() : '');
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-4 border-t flex items-center justify-between">
              <h3 className="text-lg font-bold">مجموع قابل پرداخت</h3>
              <p className="text-2xl font-bold text-primary">
                {toPersianNumber(totalToPay.toLocaleString())} تومان
              </p>
            </div>

            {/* Security Badge */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                تمامی پرداخت‌ها از طریق درگاه‌های معتبر بانکی و با استانداردهای امنیتی بالا انجام می‌شود.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/resident/charges')}
              >
                انصراف
              </Button>
              <Button
                className="flex-1"
                onClick={handleNext}
                disabled={payPartial && (!customAmount || parseInt(customAmount.replace(/,/g, '')) === 0)}
              >
                ادامه
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Payment Method */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>انتخاب روش پرداخت</CardTitle>
            <CardDescription>
              یکی از روش‌های پرداخت را انتخاب کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <div className="grid gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      'flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all',
                      selectedPaymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="text-3xl">{method.logo}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </RadioGroup>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>تراکنش امن</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>رمزنگاری SSL</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span>تأیید شده توسط بانک‌ها</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                <ChevronRight className="ml-2 h-4 w-4" />
                قبلی
              </Button>
              <Button
                className="flex-1"
                onClick={handleNext}
                disabled={!selectedPaymentMethod}
              >
                ادامه
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirm & Pay */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>تایید و پرداخت</CardTitle>
            <CardDescription>
              اطلاعات پرداخت را بررسی و تایید کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">شارژ</span>
                <span className="font-medium">
                  {currentCharge.month} {toPersianNumber(currentCharge.year)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">روش پرداخت</span>
                <span className="font-medium">
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <span className="font-semibold">مبلغ قابل پرداخت</span>
                <span className="text-xl font-bold text-primary">
                  {toPersianNumber(totalToPay.toLocaleString())} تومان
                </span>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                قوانین و مقررات پرداخت را مطالعه کرده و می‌پذیرم.
                پرداخت من غیرقابل بازگشت است.
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
                disabled={isProcessing}
              >
                <ChevronRight className="ml-2 h-4 w-4" />
                قبلی
              </Button>
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={!agreedToTerms || isProcessing}
              >
                {isProcessing ? (
                  <>در حال انتقال به درگاه...</>
                ) : (
                  <>
                    <CreditCard className="ml-2 h-5 w-5" />
                    پرداخت
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
