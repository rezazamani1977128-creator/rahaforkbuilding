import { Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { BuildingInfoSettings } from '@/components/settings/BuildingInfoSettings';
import { ChargeSettings } from '@/components/settings/ChargeSettings';
import { PaymentSettings } from '@/components/settings/PaymentSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { PermissionsSettings } from '../../components/settings/PermissionsSettings';
import { BackupSettings } from '../../components/settings/BackupSettings';

export function SettingsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">تنظیمات</h1>
        <p className="text-muted-foreground mt-1">
          مدیریت تنظیمات ساختمان و سیستم
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="building" className="space-y-4" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7" dir="rtl">
          <TabsTrigger value="building">اطلاعات ساختمان</TabsTrigger>
          <TabsTrigger value="charges">تنظیمات شارژ</TabsTrigger>
          <TabsTrigger value="payments">روش‌های پرداخت</TabsTrigger>
          <TabsTrigger value="notifications">اعلان‌ها</TabsTrigger>
          <TabsTrigger value="permissions">دسترسی‌ها</TabsTrigger>
          <TabsTrigger value="backup">پشتیبان‌گیری</TabsTrigger>
          <TabsTrigger value="about">درباره</TabsTrigger>
        </TabsList>

        <TabsContent value="building">
          <BuildingInfoSettings />
        </TabsContent>

        <TabsContent value="charges">
          <ChargeSettings />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsSettings />
        </TabsContent>

        <TabsContent value="backup">
          <BackupSettings />
        </TabsContent>

        <TabsContent value="about">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <SettingsIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">سامانه مدیریت هوشمند ساختمان</h2>
                  <p className="text-muted-foreground">نسخه ۱.۰.۰</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">اطلاعات ساختمان</h3>
                  <p className="text-sm text-muted-foreground">
                    تاریخ ثبت: ۱۵ فروردین ۱۴۰۳
                  </p>
                  <p className="text-sm text-muted-foreground">
                    وضعیت اشتراک: فعال
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">پشتیبانی</h3>
                  <p className="text-sm text-muted-foreground">
                    ایمیل: support@buildingmanager.ir
                  </p>
                  <p className="text-sm text-muted-foreground">
                    تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">قوانین و مقررات</h3>
                  <a href="#" className="text-sm text-primary hover:underline block">
                    شرایط استفاده از خدمات
                  </a>
                  <a href="#" className="text-sm text-primary hover:underline block">
                    حریم خصوصی
                  </a>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">درباره سازنده</h3>
                  <p className="text-sm text-muted-foreground">
                    ساخته شده با ❤️ برای مدیریت بهتر ساختمان‌ها
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
