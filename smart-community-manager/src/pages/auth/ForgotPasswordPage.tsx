import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, ArrowRight, Loader2, CheckCircle2, KeyRound } from 'lucide-react';

type Step = 'phone' | 'otp' | 'success';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSendOTP = async () => {
    if (!phone.match(/^09\d{9}$/)) {
      setPhoneError('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود');
      return;
    }
    
    setPhoneError('');
    clearError();
    
    try {
      await resetPassword(phone);
      setStep('otp');
    } catch (err) {
      // Error handled by context
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    
    // In real app, verify OTP and allow password reset
    // For mock, just show success
    setStep('success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">بازیابی رمز عبور</CardTitle>
          <CardDescription>
            {step === 'phone' && 'شماره موبایل خود را وارد کنید'}
            {step === 'otp' && 'کد تأیید ارسال شده را وارد کنید'}
            {step === 'success' && 'رمز عبور شما بازیابی شد'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError('');
                      clearError();
                    }}
                    className="pr-10 text-left"
                    dir="ltr"
                  />
                </div>
                {phoneError && (
                  <p className="text-sm text-destructive">{phoneError}</p>
                )}
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                کد ۶ رقمی به شماره {phone} ارسال شد
              </p>
              <div className="space-y-2">
                <Label htmlFor="otp">کد تأیید</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="۱۲۳۴۵۶"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  dir="ltr"
                  maxLength={6}
                />
              </div>
              <Button variant="link" className="w-full" onClick={handleSendOTP}>
                ارسال مجدد کد
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-muted-foreground">
                لینک بازیابی رمز عبور به شماره شما ارسال شد.
                <br />
                لطفاً پیامک خود را بررسی کنید.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {step === 'phone' && (
            <Button
              onClick={handleSendOTP}
              disabled={isLoading || !phone}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                'ارسال کد تأیید'
              )}
            </Button>
          )}

          {step === 'otp' && (
            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال تأیید...
                </>
              ) : (
                'تأیید کد'
              )}
            </Button>
          )}

          {step === 'success' && (
            <Button onClick={() => navigate('/login')} className="w-full">
              بازگشت به صفحه ورود
            </Button>
          )}

          <Button variant="ghost" onClick={() => navigate('/login')} className="w-full gap-2">
            <ArrowRight className="h-4 w-4" />
            بازگشت به ورود
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
