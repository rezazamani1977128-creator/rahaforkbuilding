import { useNavigate, Link } from 'react-router-dom';
import { useDemo } from '@/contexts/DemoContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  CreditCard,
  BarChart3,
  Users,
  Bell,
  Shield,
  Check,
  ArrowLeft,
  Play,
  Star,
  Sparkles,
  MessageSquare,
  FileText,
  Vote,
  Wrench,
  Moon,
  Sun,
} from 'lucide-react';
import { toPersianNumber } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const features = [
  {
    icon: CreditCard,
    title: 'مدیریت شارژ',
    description: 'محاسبه خودکار شارژ با روش‌های مختلف و پرداخت آنلاین',
  },
  {
    icon: Users,
    title: 'مدیریت ساکنین',
    description: 'ثبت اطلاعات ساکنین، مالکین و مستاجرین',
  },
  {
    icon: BarChart3,
    title: 'گزارشات مالی',
    description: 'گزارش درآمد، هزینه، بدهی و تراز مالی',
  },
  {
    icon: Bell,
    title: 'اطلاع‌رسانی',
    description: 'ارسال اطلاعیه و یادآوری پرداخت به ساکنین',
  },
  {
    icon: Vote,
    title: 'نظرسنجی',
    description: 'برگزاری رأی‌گیری برای تصمیمات ساختمان',
  },
  {
    icon: Wrench,
    title: 'درخواست تعمیرات',
    description: 'ثبت و پیگیری درخواست‌های تعمیراتی',
  },
  {
    icon: FileText,
    title: 'مدیریت اسناد',
    description: 'آرشیو قراردادها، صورتجلسات و مدارک',
  },
  {
    icon: MessageSquare,
    title: 'انجمن ساختمان',
    description: 'گفتگو و تعامل بین ساکنین',
  },
];

const testimonials = [
  {
    name: 'علی محمدی',
    role: 'مدیر ساختمان - برج آسمان',
    content: 'بعد از استفاده از این سیستم، جمع‌آوری شارژ ۳ برابر سریع‌تر شد و دیگر مشکل پیگیری بدهی‌ها را نداریم.',
    rating: 5,
  },
  {
    name: 'فاطمه رضایی',
    role: 'عضو هیئت مدیره - مجتمع گلستان',
    content: 'گزارشات مالی شفاف باعث اعتماد بیشتر ساکنین شده. همه می‌توانند ببینند پولشان کجا خرج می‌شود.',
    rating: 5,
  },
  {
    name: 'محمد حسینی',
    role: 'ساکن - برج پارسیان',
    content: 'پرداخت شارژ با موبایل خیلی راحت شده. دیگر لازم نیست برای پرداخت به دفتر مدیریت بروم.',
    rating: 5,
  },
];

const stats = [
  { value: '۵۰۰+', label: 'ساختمان فعال' },
  { value: '۱۵,۰۰۰+', label: 'ساکن راضی' },
  { value: '۹۸٪', label: 'رضایت مشتری' },
  { value: '۲۴/۷', label: 'پشتیبانی' },
];

const landingPlans = [
  {
    id: 'basic',
    name: 'پایه',
    description: 'برای ساختمان‌های کوچک',
    price: 99000,
    features: ['تا ۱۰ واحد', 'پرداخت آنلاین', 'گزارشات پایه'],
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    description: 'محبوب‌ترین انتخاب',
    price: 199000,
    features: ['تا ۵۰ واحد', 'گزارشات پیشرفته', 'اطلاعیه پیامکی'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    description: 'برای مجتمع‌های بزرگ',
    price: 399000,
    features: ['واحدهای نامحدود', 'مدیریت چند ساختمان', 'پشتیبانی ۲۴/۷'],
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { enterDemoMode } = useDemo();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  console.log('LandingPage rendering', { isAuthenticated, theme });

  const handleTryDemo = () => {
    enterDemoMode();
    navigate('/manager/dashboard');
  };

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const formatPrice = (price: number) => toPersianNumber(price.toLocaleString());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ساختمان من</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">امکانات</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition">نظرات</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">قیمت‌ها</a>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition">تماس</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" onClick={handleLogin}>
              ورود
            </Button>
            <Button onClick={handleTryDemo} className="gap-2">
              <Play className="h-4 w-4" />
              دمو رایگان
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-3 w-3 ml-1" />
            جدیدترین نسخه با امکانات بیشتر
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            مدیریت هوشمند
            <br />
            <span className="text-primary">ساختمان شما</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            با ساختمان من، مدیریت شارژ، هزینه‌ها، ساکنین و تمام امور ساختمان را
            به سادگی و در کمترین زمان انجام دهید.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" onClick={handleTryDemo} className="gap-2 text-lg px-8">
              <Play className="h-5 w-5" />
              تست رایگان - بدون ثبت‌نام
            </Button>
            <Button size="lg" variant="outline" onClick={handleLogin} className="gap-2 text-lg px-8">
              شروع کنید
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">امکانات کامل مدیریت ساختمان</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              تمام ابزارهایی که برای مدیریت حرفه‌ای ساختمان نیاز دارید
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">نظر مشتریان ما</h2>
            <p className="text-muted-foreground">صدها ساختمان به ما اعتماد کرده‌اند</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">پلن‌ها و قیمت‌ها</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              شفاف و ساده؛ هزینه بر اساس تعداد واحدها و امکانات مورد نیاز شما
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {landingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3">
                    محبوب‌ترین
                  </Badge>
                )}
                <CardContent className="pt-8 text-center space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <div>
                    <div className="text-4xl font-bold">{formatPrice(plan.price)}</div>
                    <div className="text-muted-foreground">تومان در ماه</div>
                  </div>

                  <ul className="space-y-2 text-right">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 justify-end">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-2">
                    <Button onClick={() => navigate(`/register?plan=${plan.id}`)} className="w-full">
                      شروع با {plan.name}
                    </Button>
                    <Button variant="outline" onClick={() => navigate(`/pricing?plan=${plan.id}`)} className="w-full">
                      مشاهده جزئیات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">همین حالا امتحان کنید</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            بدون نیاز به ثبت‌نام، نسخه دمو را امتحان کنید و ببینید چطور می‌توانیم
            مدیریت ساختمان شما را متحول کنیم.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleTryDemo}
            className="gap-2 text-lg px-8"
          >
            <Play className="h-5 w-5" />
            ورود به دمو
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">ساختمان من</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">حریم خصوصی</Link>
              <Link to="/terms" className="hover:text-foreground">قوانین استفاده</Link>
              <Link to="/contact" className="hover:text-foreground">تماس با ما</Link>
            </div>

            <div className="text-sm text-muted-foreground">
              © {toPersianNumber(new Date().getFullYear())} تمامی حقوق محفوظ است
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
