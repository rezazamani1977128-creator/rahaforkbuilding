import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

const contactMethods = [
  {
    icon: Phone,
    title: 'تماس تلفنی',
    detail: '۰۲۱-۹۱۰۰-۱۲۳۴',
    note: 'شنبه تا چهارشنبه، ۹ تا ۱۸',
  },
  {
    icon: Mail,
    title: 'ایمیل',
    detail: 'support@smartbuilding.ir',
    note: 'پاسخ در کمتر از ۲۴ ساعت',
  },
  {
    icon: MessageSquare,
    title: 'پیام فوری',
    detail: 'تلگرام و واتساپ: ۰۹۱۲۱۲۳۴۵۶۷',
    note: '۷ روز هفته در دسترس',
  },
  {
    icon: MapPin,
    title: 'آدرس دفتر',
    detail: 'تهران، خیابان ولیعصر، خیابان طالقانی، پلاک ۱۵',
    note: 'امکان مراجعه با هماهنگی قبلی',
  },
];

export function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">با ما در تماس باشید</h1>
          <p className="text-muted-foreground text-lg">
            هر سوالی درباره محصول، پشتیبانی یا همکاری دارید از یکی از روش‌های زیر با ما ارتباط بگیرید.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate('/pricing')}>
              مشاهده پلن‌ها و قیمت
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              گفتگوی فوری با پشتیبانی
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((method) => (
            <Card key={method.title}>
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <method.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-lg">{method.title}</div>
                  <div>{method.detail}</div>
                  <div className="text-sm text-muted-foreground">{method.note}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <Card>
            <CardHeader>
              <CardTitle>پیام بگذارید</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="نام و نام خانوادگی" />
              <Input type="email" placeholder="ایمیل" />
              <Input placeholder="شماره تماس" />
              <Textarea placeholder="پیام شما" rows={4} />
              <Button className="w-full">ارسال پیام</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ساعات پاسخ‌گویی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                شنبه تا چهارشنبه: ۹ تا ۱۸
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                پنجشنبه: ۹ تا ۱۴
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                پشتیبانی اضطراری: ۲۴ ساعته
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default ContactPage;
