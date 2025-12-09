import { useNavigate, useLocation } from 'react-router-dom';
import { 
  XCircle, 
  RotateCcw, 
  CreditCard, 
  Phone,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toPersianNumber } from '@/lib/persian';

export function PaymentFailurePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get error details from navigation state
  const errorDetails = location.state || {
    errorCode: 'E001',
    errorMessage: 'تراکنش ناموفق بود',
    amount: 2500000,
  };

  const commonIssues = [
    {
      question: 'چرا پرداخت من ناموفق بود؟',
      answer: 'دلایل مختلفی می‌تواند باعث عدم موفقیت پرداخت شود: موجودی ناکافی، مشکل در اتصال به بانک، اشتباه در وارد کردن اطلاعات کارت، یا محدودیت‌های امنیتی بانک.',
    },
    {
      question: 'آیا پولی از حسابم کسر شد؟',
      answer: 'در صورت ناموفق بودن تراکنش، هیچ مبلغی از حساب شما کسر نمی‌شود. اگر مبلغی کسر شده، ظرف ۷۲ ساعت به حساب شما برگشت داده خواهد شد.',
    },
    {
      question: 'چگونه می‌توانم دوباره تلاش کنم؟',
      answer: 'می‌توانید با کلیک روی دکمه "تلاش مجدد" دوباره اقدام به پرداخت کنید. همچنین می‌توانید از روش پرداخت دیگری استفاده کنید.',
    },
    {
      question: 'با چه کسی تماس بگیرم؟',
      answer: 'در صورت تکرار مشکل، می‌توانید با پشتیبانی بانک خود یا مدیریت ساختمان تماس بگیرید.',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Error Card */}
      <Card className="border-destructive/50 bg-gradient-to-br from-destructive/5 to-destructive/10">
        <CardContent className="pt-6 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="h-16 w-16 text-destructive" strokeWidth={2} />
            </div>
          </div>

          {/* Error Message */}
          <div>
            <h1 className="text-3xl font-bold text-destructive">
              پرداخت ناموفق 😔
            </h1>
            <p className="text-muted-foreground mt-2">
              متأسفانه پرداخت شما با خطا مواجه شد
            </p>
          </div>

          {/* Error Details */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>جزئیات خطا</AlertTitle>
            <AlertDescription className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span>کد خطا:</span>
                <span className="font-mono">{errorDetails.errorCode}</span>
              </div>
              <div className="text-right">
                {errorDetails.errorMessage}
              </div>
            </AlertDescription>
          </Alert>

          {/* Payment Amount */}
          <div className="bg-background rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">مبلغ</span>
              <span className="text-xl font-bold">
                {toPersianNumber(errorDetails.amount.toLocaleString())} تومان
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              هیچ مبلغی از حساب شما کسر نشده است
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={() => navigate('/resident/pay')}>
              <RotateCcw className="ml-2 h-5 w-5" />
              تلاش مجدد
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/resident/pay', { state: { changeMethod: true } })}
            >
              <CreditCard className="ml-2 h-5 w-5" />
              استفاده از روش پرداخت دیگر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>سؤالات متداول</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {commonIssues.map((issue, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right">
                  {issue.question}
                </AccordionTrigger>
                <AccordionContent className="text-right text-muted-foreground">
                  {issue.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            تماس با پشتیبانی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            در صورت تکرار مشکل، می‌توانید با پشتیبانی تماس بگیرید
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" asChild>
              <a href="tel:09121234567">
                <Phone className="ml-2 h-4 w-4" />
                تماس با مدیر
              </a>
            </Button>
            <Button variant="outline" onClick={() => navigate('/resident/building')}>
              اطلاعات تماس
              <ChevronLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Return to Dashboard */}
      <Button 
        variant="ghost" 
        className="w-full"
        onClick={() => navigate('/resident/dashboard')}
      >
        بازگشت به داشبورد
        <ChevronLeft className="mr-2 h-4 w-4" />
      </Button>
    </div>
  );
}
