import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toPersianNumber, formatPrice } from '@/lib/persian';
import {
  Building2,
  Shield,
  CreditCard,
  Users,
  BarChart3,
  Bell,
  CheckCircle2,
  Star,
  ArrowLeft,
  Smartphone,
  Moon,
  Sun,
  Menu,
  X,
  Trophy,
  Zap,
  Heart,
  Globe,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const features = [
  {
    icon: CreditCard,
    title: 'مدیریت شارژ آسان',
    description: 'صدور و پیگیری شارژ ماهانه با چند کلیک ساده',
  },
  {
    icon: Users,
    title: 'مدیریت ساکنین',
    description: 'ثبت اطلاعات ساکنین و مالکین با دسترسی‌های متفاوت',
  },
  {
    icon: BarChart3,
    title: 'گزارشات هوشمند',
    description: 'نمودارها و گزارش‌های دقیق مالی و عملکردی',
  },
  {
    icon: Bell,
    title: 'اطلاع‌رسانی خودکار',
    description: 'یادآوری پرداخت و اعلان‌های ساختمان',
  },
  {
    icon: Trophy,
    title: 'لیگ ساکنین',
    description: 'گیمیفیکیشن و انگیزه‌بخشی برای پرداخت به‌موقع',
  },
  {
    icon: Shield,
    title: 'امنیت بالا',
    description: 'رمزنگاری اطلاعات و احراز هویت دو مرحله‌ای',
  },
];

const plans = [
  {
    name: 'رایگان',
    price: 0,
    description: 'برای ساختمان‌های کوچک',
    features: [
      'حداکثر ۸ واحد',
      'مدیریت شارژ ماهانه',
      'اطلاعیه ساختمان',
      'گزارش پایه',
    ],
    cta: 'شروع رایگان',
    popular: false,
  },
  {
    name: 'حرفه‌ای',
    price: 149000,
    description: 'برای ساختمان‌های متوسط',
    features: [
      'حداکثر ۳۰ واحد',
      'تمام امکانات رایگان',
      'درگاه پرداخت آنلاین',
      'رأی‌گیری و نظرسنجی',
      'گزارشات پیشرفته',
      'پشتیبانی تلفنی',
    ],
    cta: 'شروع ۱۴ روزه رایگان',
    popular: true,
  },
  {
    name: 'سازمانی',
    price: 399000,
    description: 'برای مجتمع‌های بزرگ',
    features: [
      'واحدهای نامحدود',
      'تمام امکانات حرفه‌ای',
      'چند ساختمان همزمان',
      'API اختصاصی',
      'مدیر حساب اختصاصی',
      'پشتیبانی ۲۴/۷',
    ],
    cta: 'تماس با فروش',
    popular: false,
  },
];

const testimonials = [
  {
    name: 'مهندس احمدی',
    role: 'مدیر برج آسمان',
    content: 'از زمانی که از ساختمان من استفاده می‌کنم، وصول شارژ از ۶۰٪ به ۹۵٪ رسیده. واقعاً عالیه!',
    rating: 5,
  },
  {
    name: 'خانم رضایی',
    role: 'مدیر مجتمع گلستان',
    content: 'رابط کاربری ساده و فارسی بودنش خیلی کمک کرده. ساکنین هم راحت باهاش کار می‌کنن.',
    rating: 5,
  },
  {
    name: 'آقای کریمی',
    role: 'مدیر آپارتمان نسیم',
    content: 'گزارشات مالی و نمودارها خیلی کمک می‌کنه. دیگه نیازی به اکسل ندارم.',
    rating: 4,
  },
];

const faqs = [
  {
    question: 'آیا نیاز به نصب نرم‌افزار دارم؟',
    answer: 'خیر، ساختمان من یک اپلیکیشن تحت وب است و از طریق مرورگر در هر دستگاهی قابل دسترسی است.',
  },
  {
    question: 'آیا اطلاعات مالی من امن است؟',
    answer: 'بله، تمام اطلاعات با استانداردهای امنیتی بانکی رمزنگاری می‌شوند و سرورها در ایران مستقر هستند.',
  },
  {
    question: 'آیا امکان پرداخت آنلاین شارژ وجود دارد؟',
    answer: 'بله، در پلن حرفه‌ای و سازمانی، درگاه پرداخت آنلاین فعال است و ساکنین می‌توانند مستقیماً از طریق اپ پرداخت کنند.',
  },
  {
    question: 'آیا می‌توانم چند ساختمان را مدیریت کنم؟',
    answer: 'بله، در پلن سازمانی امکان مدیریت چندین ساختمان با یک حساب کاربری وجود دارد.',
  },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ساختمان من</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              امکانات
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              قیمت‌ها
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              نظرات
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              سؤالات متداول
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link to="/login">ورود</Link>
            </Button>
            <Button asChild className="hidden md:inline-flex">
              <Link to="/login">ثبت‌نام رایگان</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background md:hidden">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ساختمان من</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4 p-6">
              <a href="#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                امکانات
              </a>
              <a href="#pricing" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                قیمت‌ها
              </a>
              <a href="#testimonials" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                نظرات
              </a>
              <a href="#faq" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                سؤالات متداول
              </a>
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">ورود</Link>
                </Button>
                <Button asChild>
                  <Link to="/login">ثبت‌نام رایگان</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 gap-1">
              <Zap className="h-3 w-3" />
              جدید! لیگ ساکنین فعال شد
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl animate-fade-in-up">
              مدیریت ساختمان را{' '}
              <span className="gradient-text">هوشمند</span>{' '}
              کنید
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              با ساختمان من، شارژ ماهانه را آسان وصول کنید، با ساکنین ارتباط برقرار کنید و ساختمان خود را حرفه‌ای مدیریت نمایید.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Button size="xl" variant="hero" asChild>
                <Link to="/login" className="gap-2">
                  شروع رایگان
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="heroOutline" asChild>
                <Link to="/dashboard">مشاهده دمو</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              بدون نیاز به کارت اعتباری • راه‌اندازی در ۵ دقیقه
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute right-[10%] top-[20%] hidden animate-float lg:block" style={{ animationDelay: '0s' }}>
          <div className="rounded-2xl bg-card p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">پرداخت موفق</p>
                <p className="text-xs text-muted-foreground">واحد ۱۰۱</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[10%] top-[40%] hidden animate-float lg:block" style={{ animationDelay: '1s' }}>
          <div className="rounded-2xl bg-card p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">ساکن طلایی</p>
                <p className="text-xs text-muted-foreground">۱۲ ماه پرداخت به‌موقع</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">امکانات</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              همه چیز برای مدیریت حرفه‌ای ساختمان
            </h2>
            <p className="text-muted-foreground">
              ابزارهای کاربردی که کار مدیریت ساختمان را ساده و لذت‌بخش می‌کنند
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" className="group">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">قیمت‌گذاری</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              پلن مناسب خود را انتخاب کنید
            </h2>
            <p className="text-muted-foreground">
              قیمت‌های شفاف و منصفانه، بدون هزینه پنهان
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Card
                key={index}
                variant={plan.popular ? 'primary' : 'default'}
                className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4">
                    <Badge>محبوب‌ترین</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? 'رایگان' : formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground"> / ماهانه</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                    asChild
                  >
                    <Link to="/login">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">نظرات مشتریان</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              مدیران ساختمان چه می‌گویند؟
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="elevated">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-accent text-accent'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">سؤالات متداول</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              پاسخ سؤالات شما
            </h2>
          </div>

          <div className="mx-auto max-w-2xl space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                variant="outline"
                className="cursor-pointer transition-all hover:bg-muted/50"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                    <ArrowLeft
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
                {expandedFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-20 text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              همین الان شروع کنید
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              بیش از ۵۰۰ ساختمان در سراسر ایران از ساختمان من استفاده می‌کنند
            </p>
            <Button size="xl" variant="secondary" asChild>
              <Link to="/login" className="gap-2">
                ثبت‌نام رایگان
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ساختمان من</span>
              </div>
              <p className="text-sm text-muted-foreground">
                سامانه جامع مدیریت ساختمان، وصول شارژ و ارتباط با ساکنین
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">محصول</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">امکانات</a></li>
                <li><a href="#pricing" className="hover:text-foreground">قیمت‌ها</a></li>
                <li><Link to="/dashboard" className="hover:text-foreground">دمو</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">شرکت</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">درباره ما</a></li>
                <li><a href="#" className="hover:text-foreground">وبلاگ</a></li>
                <li><a href="#" className="hover:text-foreground">تماس با ما</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">پشتیبانی</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">راهنما</a></li>
                <li><a href="#faq" className="hover:text-foreground">سؤالات متداول</a></li>
                <li><a href="#" className="hover:text-foreground">تیکت پشتیبانی</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {toPersianNumber(1403)} ساختمان من. تمام حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                حریم خصوصی
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                قوانین استفاده
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
