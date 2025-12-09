import { HelpCircle, BookOpen, MessageCircle, Phone, Mail, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function HelpPage() {
  const faqs = [
    {
      question: 'چگونه شارژ جدید صادر کنم؟',
      answer: 'از منوی سمت راست، به بخش "شارژ جدید" بروید. فرم را با اطلاعات مورد نیاز پر کنید و روی دکمه "صدور شارژ" کلیک کنید.',
    },
    {
      question: 'چگونه پرداخت ساکنین را تأیید کنم؟',
      answer: 'در صفحه "پرداخت‌ها"، پرداخت‌های در انتظار تأیید را مشاهده کنید. روی هر پرداخت کلیک کرده و رسید را بررسی کنید، سپس تأیید یا رد کنید.',
    },
    {
      question: 'چگونه اطلاعیه جدید منتشر کنم؟',
      answer: 'از صفحه "اطلاعیه‌ها"، روی دکمه "اطلاعیه جدید" کلیک کنید. عنوان، محتوا و اولویت را مشخص کنید و اطلاعیه را منتشر کنید.',
    },
    {
      question: 'چگونه واحد جدید اضافه کنم؟',
      answer: 'در صفحه "واحدها"، روی "افزودن واحد" کلیک کنید. اطلاعات واحد شامل شماره، طبقه، متراژ و ضریب را وارد کنید.',
    },
    {
      question: 'چگونه می‌توانم گزارش مالی تهیه کنم؟',
      answer: 'به بخش "گزارشات" بروید و نوع گزارش مورد نظر (مالی، واحدها، پرداخت‌ها) را انتخاب کنید. سپس روی "دانلود گزارش" کلیک کنید.',
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'تماس تلفنی',
      value: '۰۲۱-۱۲۳۴۵۶۷۸',
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      icon: Mail,
      title: 'ایمیل',
      value: 'support@building-app.com',
      color: 'text-green-500 bg-green-500/10',
    },
    {
      icon: MessageCircle,
      title: 'پشتیبانی آنلاین',
      value: 'چت زنده',
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];

  const resources = [
    {
      icon: BookOpen,
      title: 'راهنمای کامل',
      description: 'مستندات جامع استفاده از سیستم',
    },
    {
      icon: FileText,
      title: 'آموزش ویدئویی',
      description: 'ویدئوهای آموزشی گام به گام',
    },
    {
      icon: HelpCircle,
      title: 'سؤالات متداول',
      description: 'پاسخ سؤالات رایج کاربران',
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">راهنما و پشتیبانی</h1>
        <p className="text-muted-foreground mt-1">
          پاسخ سؤالات خود را پیدا کنید یا با پشتیبانی تماس بگیرید
        </p>
      </div>

      {/* Quick Help */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-semibold mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>سؤالات متداول</CardTitle>
          <CardDescription>
            پاسخ سؤالات رایج در استفاده از سیستم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-right text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>ارتباط با پشتیبانی</CardTitle>
          <CardDescription>
            در صورت نیاز به کمک بیشتر، از طریق روش‌های زیر با ما تماس بگیرید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className={`p-2 rounded-lg ${method.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-muted-foreground">{method.title}</p>
                    <p className="font-semibold">{method.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex gap-3">
            <Button className="flex-1">
              <MessageCircle className="ml-2 h-4 w-4" />
              شروع چت آنلاین
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="ml-2 h-4 w-4" />
              ارسال ایمیل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات سیستم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm" dir="rtl">
            <div className="flex justify-between">
              <span className="text-muted-foreground">نسخه سیستم:</span>
              <span className="font-medium">۱.۰.۰</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">آخرین به‌روزرسانی:</span>
              <span className="font-medium">۱۴۰۴/۰۹/۱۹</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">وضعیت سرویس:</span>
              <span className="font-medium text-green-600">فعال</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
