import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { isValidIranianPhone, formatPhoneNumber } from '@/lib/persian';

type Step = 'phone' | 'otp';

export default function Login() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, verifyOTP, isLoading, error, clearError } = useAuth();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidIranianPhone(phone)) {
      toast({
        title: 'خطا',
        description: 'لطفاً شماره موبایل معتبر وارد کنید',
        variant: 'destructive',
      });
      return;
    }

    try {
      await login(phone);
      setStep('otp');
      toast({
        title: 'کد تأیید ارسال شد',
        description: `کد تأیید به ${formatPhoneNumber(phone)} ارسال شد`,
      });
    } catch (err) {
      // Error handled by context
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    
    clearError();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast({
        title: 'خطا',
        description: 'لطفاً کد ۶ رقمی را کامل وارد کنید',
        variant: 'destructive',
      });
      return;
    }

    try {
      await verifyOTP(phone, otpValue);
      toast({
        title: 'ورود موفق',
        description: 'به ساختمان من خوش آمدید!',
      });
      navigate('/select-building');
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
      
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {step === 'phone' ? 'ورود به ساختمان من' : 'تأیید شماره موبایل'}
          </CardTitle>
          <CardDescription>
            {step === 'phone'
              ? 'شماره موبایل خود را وارد کنید'
              : `کد ارسال شده به ${formatPhoneNumber(phone)} را وارد کنید`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pr-10 text-left"
                    dir="ltr"
                    maxLength={11}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    ارسال کد تأیید
                    <ArrowLeft className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>کد تأیید ۶ رقمی</Label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold"
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال بررسی...
                  </>
                ) : (
                  <>
                    تأیید و ورود
                    <ArrowLeft className="h-4 w-4" />
                  </>
                )}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setStep('phone')}
                >
                  تغییر شماره
                </Button>
                <Button type="button" variant="link" className="p-0 h-auto">
                  ارسال مجدد کد
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 space-y-3 text-center text-sm text-muted-foreground">
            <p>
              با ورود به ساختمان من،{' '}
              <a href="#" className="text-primary hover:underline">
                قوانین و مقررات
              </a>{' '}
              را می‌پذیرید.
            </p>
            <div className="flex justify-center gap-2">
              <Link to="/forgot-password" className="text-primary hover:underline">
                فراموشی رمز عبور؟
              </Link>
              <span>|</span>
              <Link to="/register" className="text-primary hover:underline">
                ثبت‌نام
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link
        to="/"
        className="absolute top-4 right-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 flip-rtl" />
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
