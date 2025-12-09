import { useState } from 'react';
import { User, Upload, Save, Trash2, Shield, Bell, Car as CarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';

export function ProfilePage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Mock user data - in production, fetch from API
  const [userData, setUserData] = useState({
    firstName: 'علی',
    lastName: 'محمدی',
    phone: '09123456789',
    email: 'ali@example.com',
    nationalId: '0012345678',
  });

  const unitInfo = {
    number: '201',
    floor: 2,
    area: 95,
    parkingSpot: 'P12',
    storage: 'S5',
    memberSince: new Date('2023-01-15'),
  };

  const [vehicles, setVehicles] = useState([
    { id: 1, plate: '۱۲ب۳۴۵ - ۶۷', color: 'سفید', model: 'پژو پارس' },
  ]);

  const [emergencyContact, setEmergencyContact] = useState({
    name: 'فاطمه محمدی',
    relationship: 'همسر',
    phone: '09121234567',
  });

  const [notifications, setNotifications] = useState({
    sms: true,
    email: false,
    push: true,
    paymentReminders: true,
    announcements: true,
    weeklySummary: false,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'موفق',
      description: 'تغییرات با موفقیت ذخیره شد',
    });
    setIsSaving(false);
  };

  const addVehicle = () => {
    if (vehicles.length < 2) {
      setVehicles([...vehicles, { id: Date.now(), plate: '', color: '', model: '' }]);
    }
  };

  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">پروفایل و تنظیمات</h1>
        <p className="text-muted-foreground mt-1">
          مدیریت اطلاعات شخصی و تنظیمات حساب کاربری
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6" dir="rtl">
          <TabsTrigger value="personal">اطلاعات شخصی</TabsTrigger>
          <TabsTrigger value="unit">اطلاعات واحد</TabsTrigger>
          <TabsTrigger value="vehicles">خودرو</TabsTrigger>
          <TabsTrigger value="emergency">تماس اضطراری</TabsTrigger>
          <TabsTrigger value="notifications">اعلان‌ها</TabsTrigger>
          <TabsTrigger value="security">امنیت</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات شخصی</CardTitle>
              <CardDescription>
                ویرایش اطلاعات شخصی خود
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6 flex-row-reverse" dir="rtl">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm">
                    <Upload className="ml-2 h-4 w-4" />
                    تغییر تصویر
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    فرمت JPG، PNG یا GIF - حداکثر ۲ مگابایت
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  />
                </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">شماره موبایل</Label>
                  <div className="flex gap-2 flex-row-reverse" dir="rtl">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 flex-shrink-0">
                      تأیید شده ✓
                    </Badge>
                    <Input
                      id="phone"
                      value={userData.phone}
                      disabled
                      className="flex-1"
                    />
                  </div>
                </div>              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId">کد ملی (اختیاری)</Label>
                <Input
                  id="nationalId"
                  value={userData.nationalId}
                  onChange={(e) => setUserData({ ...userData, nationalId: e.target.value })}
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="ml-2 h-4 w-4" />
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unit Information */}
        <TabsContent value="unit" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات واحد</CardTitle>
              <CardDescription>
                مشخصات واحد مسکونی شما
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">شماره واحد</p>
                  <p className="text-2xl font-bold mt-1">{toPersianNumber(unitInfo.number)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">طبقه</p>
                  <p className="text-2xl font-bold mt-1">{toPersianNumber(unitInfo.floor)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">متراژ</p>
                  <p className="text-2xl font-bold mt-1">{toPersianNumber(unitInfo.area)} متر</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">پارکینگ</p>
                  <p className="text-2xl font-bold mt-1">{unitInfo.parkingSpot}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">انباری</p>
                  <p className="text-2xl font-bold mt-1">{unitInfo.storage}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">عضویت از</p>
                  <p className="text-lg font-bold mt-1">{formatPersianDate(unitInfo.memberSince)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicles */}
        <TabsContent value="vehicles" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse">
                <CarIcon className="h-5 w-5" />
                خودروها
              </CardTitle>
              <CardDescription>
                مدیریت اطلاعات خودروهای خود (حداکثر ۲ خودرو)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="p-4 border rounded-lg space-y-4" dir="rtl">
                  <div className="flex items-center justify-between flex-row-reverse">
                    {vehicles.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVehicle(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                    <h3 className="font-semibold">خودرو {toPersianNumber(index + 1)}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>پلاک</Label>
                      <Input
                        value={vehicle.plate}
                        onChange={(e) => {
                          const newVehicles = [...vehicles];
                          newVehicles[index].plate = e.target.value;
                          setVehicles(newVehicles);
                        }}
                        placeholder="۱۲ب۳۴۵ - ۶۷"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>رنگ</Label>
                      <Select
                        value={vehicle.color}
                        onValueChange={(value) => {
                          const newVehicles = [...vehicles];
                          newVehicles[index].color = value;
                          setVehicles(newVehicles);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="سفید">سفید</SelectItem>
                          <SelectItem value="مشکی">مشکی</SelectItem>
                          <SelectItem value="نقره‌ای">نقره‌ای</SelectItem>
                          <SelectItem value="آبی">آبی</SelectItem>
                          <SelectItem value="قرمز">قرمز</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>مدل</Label>
                      <Input
                        value={vehicle.model}
                        onChange={(e) => {
                          const newVehicles = [...vehicles];
                          newVehicles[index].model = e.target.value;
                          setVehicles(newVehicles);
                        }}
                        placeholder="پژو پارس"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {vehicles.length < 2 && (
                <Button variant="outline" onClick={addVehicle} className="w-full">
                  افزودن خودرو
                </Button>
              )}
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="ml-2 h-4 w-4" />
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contact */}
        <TabsContent value="emergency" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle>تماس اضطراری</CardTitle>
              <CardDescription>
                مشخص کردن فرد قابل تماس در شرایط اضطراری
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">نام و نام خانوادگی</Label>
                <Input
                  id="emergencyName"
                  value={emergencyContact.name}
                  onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">نسبت</Label>
                <Select
                  value={emergencyContact.relationship}
                  onValueChange={(value) => setEmergencyContact({ ...emergencyContact, relationship: value })}
                >
                  <SelectTrigger id="emergencyRelationship">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="همسر">همسر</SelectItem>
                    <SelectItem value="والدین">والدین</SelectItem>
                    <SelectItem value="فرزند">فرزند</SelectItem>
                    <SelectItem value="خواهر/برادر">خواهر/برادر</SelectItem>
                    <SelectItem value="دوست">دوست</SelectItem>
                    <SelectItem value="سایر">سایر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">شماره تماس</Label>
                <Input
                  id="emergencyPhone"
                  value={emergencyContact.phone}
                  onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="ml-2 h-4 w-4" />
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse">
                <Bell className="h-5 w-5" />
                تنظیمات اعلان‌ها
              </CardTitle>
              <CardDescription>
                انتخاب نوع اعلان‌هایی که می‌خواهید دریافت کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between flex-row-reverse" dir="rtl">
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
                <div className="text-right">
                  <p className="font-medium">پیامک (SMS)</p>
                  <p className="text-sm text-muted-foreground">دریافت اعلان‌ها از طریق پیامک</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between flex-row-reverse" dir="rtl">
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
                <div className="text-right">
                  <p className="font-medium">ایمیل</p>
                  <p className="text-sm text-muted-foreground">دریافت اعلان‌ها از طریق ایمیل</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between flex-row-reverse" dir="rtl">
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
                <div className="text-right">
                  <p className="font-medium">اعلان‌های پوش</p>
                  <p className="text-sm text-muted-foreground">نمایش اعلان‌ها در مرورگر</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between flex-row-reverse" dir="rtl">
                <Switch
                  checked={notifications.paymentReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, paymentReminders: checked })}
                />
                <div className="text-right">
                  <p className="font-medium">یادآوری پرداخت</p>
                  <p className="text-sm text-muted-foreground">یادآوری سررسید شارژ ماهانه</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between flex-row-reverse" dir="rtl">
                <Switch
                  checked={notifications.announcements}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, announcements: checked })}
                />
                <div className="text-right">
                  <p className="font-medium">اطلاعیه‌ها</p>
                  <p className="text-sm text-muted-foreground">دریافت اطلاعیه‌های ساختمان</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between flex-row-reverse" dir="rtl">
                <Switch
                  checked={notifications.weeklySummary}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklySummary: checked })}
                />
                <div className="text-right">
                  <p className="font-medium">خلاصه هفتگی</p>
                  <p className="text-sm text-muted-foreground">دریافت گزارش هفتگی فعالیت‌ها</p>
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="ml-2 h-4 w-4" />
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse">
                <Shield className="h-5 w-5" />
                امنیت حساب
              </CardTitle>
              <CardDescription>
                مدیریت امنیت و دسترسی به حساب کاربری
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">رمز عبور</h3>
                <Button variant="outline">تغییر رمز عبور</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">احراز هویت دو مرحله‌ای</p>
                  <p className="text-sm text-muted-foreground">امنیت بیشتر با کد تأیید</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">نشست‌های فعال</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  دستگاه‌هایی که با حساب شما وارد شده‌اند
                </p>
                <Button variant="outline" className="w-full">
                  خروج از همه دستگاه‌ها
                </Button>
              </div>
              <Separator />
              <Alert variant="destructive">
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-semibold">منطقه خطرناک</p>
                    <p className="text-sm">حذف حساب کاربری غیرقابل بازگشت است.</p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف حساب کاربری
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
