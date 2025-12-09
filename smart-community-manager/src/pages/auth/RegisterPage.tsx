import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, User, Phone, Mail, MapPin, Key, Loader2, CheckCircle2 } from 'lucide-react';

type RegistrationType = 'new-building' | 'join-building';

interface FormData {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  buildingName: string;
  buildingAddress: string;
  inviteCode: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [registrationType, setRegistrationType] = useState<RegistrationType>('new-building');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    buildingName: '',
    buildingAddress: '',
    inviteCode: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const validateStep1 = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.phone.match(/^09\d{9}$/)) {
      errors.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود';
    }
    if (formData.firstName.length < 2) {
      errors.firstName = 'نام باید حداقل ۲ حرف باشد';
    }
    if (formData.lastName.length < 2) {
      errors.lastName = 'نام خانوادگی باید حداقل ۲ حرف باشد';
    }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'ایمیل نامعتبر است';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: FormErrors = {};
    
    if (registrationType === 'new-building') {
      if (formData.buildingName.length < 2) {
        errors.buildingName = 'نام ساختمان را وارد کنید';
      }
      if (formData.buildingAddress.length < 5) {
        errors.buildingAddress = 'آدرس ساختمان را وارد کنید';
      }
    } else {
      if (formData.inviteCode.length < 6) {
        errors.inviteCode = 'کد دعوت نامعتبر است';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    clearError();
  };

  const handleNextStep = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setOtpSent(true);
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setFormErrors({ otp: 'کد تأیید باید ۶ رقم باشد' });
      return;
    }

    try {
      await register({
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        buildingName: formData.buildingName || undefined,
        buildingAddress: formData.buildingAddress || undefined,
        isNewBuilding: registrationType === 'new-building',
        inviteCode: formData.inviteCode || undefined,
      });
      navigate('/select-building');
    } catch (err) {
      // Error handled by context
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">نام</Label>
          <div className="relative">
            <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              placeholder="علی"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="pr-10"
            />
          </div>
          {formErrors.firstName && (
            <p className="text-sm text-destructive">{formErrors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">نام خانوادگی</Label>
          <Input
            id="lastName"
            placeholder="محمدی"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
          {formErrors.lastName && (
            <p className="text-sm text-destructive">{formErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">شماره موبایل</Label>
        <div className="relative">
          <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="pr-10 text-left"
            dir="ltr"
          />
        </div>
        {formErrors.phone && (
          <p className="text-sm text-destructive">{formErrors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">ایمیل (اختیاری)</Label>
        <div className="relative">
          <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pr-10 text-left"
            dir="ltr"
          />
        </div>
        {formErrors.email && (
          <p className="text-sm text-destructive">{formErrors.email}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Tabs value={registrationType} onValueChange={(v) => setRegistrationType(v as RegistrationType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-building">ثبت ساختمان جدید</TabsTrigger>
          <TabsTrigger value="join-building">پیوستن به ساختمان</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-building" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="buildingName">نام ساختمان</Label>
            <div className="relative">
              <Building2 className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="buildingName"
                placeholder="برج آسمان"
                value={formData.buildingName}
                onChange={(e) => handleInputChange('buildingName', e.target.value)}
                className="pr-10"
              />
            </div>
            {formErrors.buildingName && (
              <p className="text-sm text-destructive">{formErrors.buildingName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingAddress">آدرس ساختمان</Label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="buildingAddress"
                placeholder="تهران، خیابان ولیعصر، پلاک ۱۲۳"
                value={formData.buildingAddress}
                onChange={(e) => handleInputChange('buildingAddress', e.target.value)}
                className="pr-10"
              />
            </div>
            {formErrors.buildingAddress && (
              <p className="text-sm text-destructive">{formErrors.buildingAddress}</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="join-building" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">کد دعوت</Label>
            <div className="relative">
              <Key className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="inviteCode"
                placeholder="ABC123"
                value={formData.inviteCode}
                onChange={(e) => handleInputChange('inviteCode', e.target.value.toUpperCase())}
                className="pr-10 text-left tracking-widest font-mono"
                dir="ltr"
                maxLength={8}
              />
            </div>
            {formErrors.inviteCode && (
              <p className="text-sm text-destructive">{formErrors.inviteCode}</p>
            )}
            <p className="text-sm text-muted-foreground">
              کد دعوت را از مدیر ساختمان دریافت کنید
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium">کد تأیید ارسال شد</h3>
        <p className="text-sm text-muted-foreground">
          کد ۶ رقمی به شماره {formData.phone} ارسال شد
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">کد تأیید</Label>
        <Input
          id="otp"
          type="text"
          placeholder="۱۲۳۴۵۶"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtp(value);
            if (formErrors.otp) {
              setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.otp;
                return newErrors;
              });
            }
          }}
          className="text-center text-2xl tracking-[0.5em] font-mono"
          dir="ltr"
          maxLength={6}
        />
        {formErrors.otp && (
          <p className="text-sm text-destructive text-center">{formErrors.otp}</p>
        )}
      </div>

      <Button variant="link" className="w-full" disabled={isLoading}>
        ارسال مجدد کد
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">ساختمان من</CardTitle>
          <CardDescription>
            {step === 1 && 'اطلاعات خود را وارد کنید'}
            {step === 2 && 'ساختمان خود را انتخاب کنید'}
            {step === 3 && 'شماره خود را تأیید کنید'}
          </CardDescription>
          
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-3 w-full">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                disabled={isLoading}
                className="flex-1"
              >
                قبلی
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={isLoading}
                className="flex-1"
              >
                بعدی
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || otp.length !== 6}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ثبت‌نام...
                  </>
                ) : (
                  'تکمیل ثبت‌نام'
                )}
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link to="/login" className="text-primary hover:underline">
              وارد شوید
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
