import { Phone, MapPin, Building2, CheckCircle2, X, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toPersianNumber } from '@/lib/persian';

export function BuildingInfoPage() {
  // Mock building data - in production, fetch from API
  const buildingInfo = {
    name: 'برج آسمان',
    address: 'تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲',
    totalUnits: 24,
    floors: 6,
    parkingSpots: 30,
    yearBuilt: 1395,
    manager: {
      name: 'آقای رضایی',
      phone: '09121234567',
      availableHours: '۸ صبح تا ۸ شب',
      whatsapp: '09121234567',
      telegram: '@manager_building',
    },
    facilities: {
      parking: true,
      storage: true,
      elevator: true,
      communityRoom: true,
      gym: false,
      pool: false,
      garden: true,
      security: true,
    },
    rules: [
      { title: 'ساعات سکوت', content: 'از ساعت ۲۲ تا ۸ صبح رعایت سکوت الزامی است. لطفاً در این ساعات از ایجاد سروصدا و استفاده از وسایل پرسروصدا خودداری کنید.' },
      { title: 'قوانین پارکینگ', content: 'هر واحد دارای یک پارکینگ اختصاصی است. پارک خودرو در محل دیگران یا مسیر عبور ممنوع است. خودروهای مهمان باید در پارکینگ مهمان قرار گیرند.' },
      { title: 'حیوانات خانگی', content: 'نگهداری حیوانات خانگی با رعایت بهداشت و آرامش همسایگان مجاز است. استفاده از قلاده و پوشک در مشاعات الزامی است.' },
      { title: 'مهمان‌ها', content: 'حضور مهمان در ساعات شبانه نیازمند اطلاع به نگهبانی است. مهمان‌ها باید همراه ساکن وارد ساختمان شوند.' },
      { title: 'بازسازی واحد', content: 'هرگونه بازسازی و تغییرات ساختاری نیاز به هماهنگی قبلی با مدیریت دارد. ساعات مجاز بازسازی: ۹ صبح تا ۶ عصر روزهای غیرتعطیل.' },
      { title: 'دفع زباله', content: 'زباله‌ها را در ساعات ۲۰ تا ۲۲ در مخزن طبقه همکف قرار دهید. جداسازی زباله‌های خشک و تر الزامی است.' },
    ],
  };

  const emergencyContacts = [
    { name: 'آتش‌نشانی', number: '125', color: 'bg-red-500/10 text-red-500 border-red-500/50' },
    { name: 'پلیس', number: '110', color: 'bg-blue-500/10 text-blue-500 border-blue-500/50' },
    { name: 'اورژانس', number: '115', color: 'bg-green-500/10 text-green-500 border-green-500/50' },
    { name: 'اورژانس گاز', number: '194', color: 'bg-orange-500/10 text-orange-500 border-orange-500/50' },
    { name: 'برق', number: '121', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' },
    { name: 'نگهبانی ساختمان', number: '09129876543', color: 'bg-purple-500/10 text-purple-500 border-purple-500/50' },
  ];

  const facilityList = [
    { name: 'پارکینگ', available: buildingInfo.facilities.parking },
    { name: 'انباری', available: buildingInfo.facilities.storage },
    { name: 'آسانسور', available: buildingInfo.facilities.elevator },
    { name: 'سالن اجتماعات', available: buildingInfo.facilities.communityRoom },
    { name: 'باشگاه ورزشی', available: buildingInfo.facilities.gym },
    { name: 'استخر', available: buildingInfo.facilities.pool },
    { name: 'فضای سبز', available: buildingInfo.facilities.garden },
    { name: 'سیستم امنیتی', available: buildingInfo.facilities.security },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">اطلاعات ساختمان</h1>
        <p className="text-muted-foreground mt-1">
          جزئیات و مشخصات ساختمان
        </p>
      </div>

      {/* Building Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{buildingInfo.name}</h2>
              <div className="flex items-start gap-2 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{buildingInfo.address}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">تعداد واحد</p>
                  <p className="text-lg font-semibold">{toPersianNumber(buildingInfo.totalUnits)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">طبقات</p>
                  <p className="text-lg font-semibold">{toPersianNumber(buildingInfo.floors)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">پارکینگ</p>
                  <p className="text-lg font-semibold">{toPersianNumber(buildingInfo.parkingSpots)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">سال ساخت</p>
                  <p className="text-lg font-semibold">{toPersianNumber(buildingInfo.yearBuilt)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Contact Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            تماس با مدیریت
          </CardTitle>
          <CardDescription>
            برای هماهنگی و پیگیری امور با مدیر ساختمان در تماس باشید
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">{buildingInfo.manager.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ساعات پاسخگویی: {buildingInfo.manager.availableHours}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href={`tel:${buildingInfo.manager.phone}`}>
                  <Phone className="ml-2 h-4 w-4" />
                  {toPersianNumber(buildingInfo.manager.phone)}
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild>
              <a href={`https://wa.me/${buildingInfo.manager.whatsapp}`} target="_blank" rel="noopener noreferrer">
                واتساپ
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`https://t.me/${buildingInfo.manager.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                تلگرام
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Grid */}
      <Card>
        <CardHeader>
          <CardTitle>تماس‌های اضطراری</CardTitle>
          <CardDescription>
            شماره‌های ضروری در شرایط اضطراری
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {emergencyContacts.map((contact) => (
              <Button
                key={contact.number}
                variant="outline"
                size="lg"
                className={`h-auto py-4 ${contact.color} border-2`}
                asChild
              >
                <a href={`tel:${contact.number}`}>
                  <div className="flex flex-col items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-lg font-bold">{toPersianNumber(contact.number)}</div>
                    </div>
                  </div>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Building Rules */}
      <Card>
        <CardHeader>
          <CardTitle>قوانین و مقررات ساختمان</CardTitle>
          <CardDescription>
            لطفاً قوانین را مطالعه و رعایت فرمایید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {buildingInfo.rules.map((rule, index) => (
              <AccordionItem key={index} value={`rule-${index}`}>
                <AccordionTrigger className="text-right">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent className="text-right text-muted-foreground">
                  {rule.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Facilities List */}
      <Card>
        <CardHeader>
          <CardTitle>امکانات ساختمان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {facilityList.map((facility) => (
              <div
                key={facility.name}
                className={`p-3 border rounded-lg flex items-center gap-2 ${
                  facility.available
                    ? 'bg-green-500/5 border-green-500/50'
                    : 'bg-gray-500/5 border-gray-500/30 opacity-60'
                }`}
              >
                {facility.available ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{facility.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>اسناد و مدارک</CardTitle>
          <CardDescription>
            دانلود اسناد مهم ساختمان
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            <span>آیین‌نامه ساختمان</span>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span>دستورالعمل اضطراری</span>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span>نقشه ساختمان</span>
            <Download className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
