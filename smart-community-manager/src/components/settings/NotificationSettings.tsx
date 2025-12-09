import { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockBuildingSettings } from '@/data/mockData';

export function NotificationSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(mockBuildingSettings.notifications);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'موفق',
      description: 'تنظیمات اعلان‌ها با موفقیت ذخیره شد',
    });

    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          تنظیمات اعلان‌ها
        </CardTitle>
        <CardDescription>
          پیکربندی سرویس پیامک و اعلان‌های خودکار
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SMS Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">تنظیمات پیامک</h3>
              <Switch
                checked={settings.sms.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    sms: { ...settings.sms, enabled: checked },
                  })
                }
              />
            </div>

            {settings.sms.enabled && (
              <div className="space-y-4 pr-4 border-r-2">
                <div className="space-y-2">
                  <Label htmlFor="provider">سرویس‌دهنده پیامک</Label>
                  <Select
                    value={settings.sms.provider}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        sms: { ...settings.sms, provider: value },
                      })
                    }
                  >
                    <SelectTrigger id="provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kavenegar">کاوه نگار</SelectItem>
                      <SelectItem value="ghasedak">قاصدک</SelectItem>
                      <SelectItem value="melipayamak">ملی‌پیامک</SelectItem>
                      <SelectItem value="smsir">اس‌ام‌اس.آی‌آر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">کلید API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="••••••••••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderNumber">شماره ارسال‌کننده</Label>
                  <Input
                    id="senderNumber"
                    placeholder="۱۰۰۰۵۵۴۴۳۳۲۲"
                    dir="ltr"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notification Triggers */}
          <div className="space-y-4">
            <h3 className="font-semibold">رویدادهای اعلان</h3>
            <p className="text-sm text-muted-foreground">
              انتخاب کنید کدام رویدادها باعث ارسال اعلان شوند
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="newCharge">ایجاد شارژ جدید</Label>
                  <p className="text-xs text-muted-foreground">
                    وقتی شارژ جدید برای واحد ایجاد می‌شود
                  </p>
                </div>
                <Switch
                  id="newCharge"
                  checked={settings.triggers.newCharge}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      triggers: { ...settings.triggers, newCharge: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentReminder">یادآوری سررسید</Label>
                  <p className="text-xs text-muted-foreground">
                    چند روز قبل از سررسید پرداخت
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.triggers.reminderDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        triggers: {
                          ...settings.triggers,
                          reminderDays: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-20"
                    disabled={!settings.triggers.paymentReminder}
                  />
                  <Switch
                    id="paymentReminder"
                    checked={settings.triggers.paymentReminder}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        triggers: { ...settings.triggers, paymentReminder: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentReceived">تایید پرداخت</Label>
                  <p className="text-xs text-muted-foreground">
                    وقتی پرداخت ثبت و تایید می‌شود
                  </p>
                </div>
                <Switch
                  id="paymentReceived"
                  checked={settings.triggers.paymentReceived}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      triggers: { ...settings.triggers, paymentReceived: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="overdueNotice">اطلاع دیرکرد</Label>
                  <p className="text-xs text-muted-foreground">
                    وقتی پرداخت از سررسید می‌گذرد
                  </p>
                </div>
                <Switch
                  id="overdueNotice"
                  checked={settings.triggers.overdueNotice}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      triggers: { ...settings.triggers, overdueNotice: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="newAnnouncement">اطلاعیه جدید</Label>
                  <p className="text-xs text-muted-foreground">
                    وقتی اطلاعیه جدید منتشر می‌شود
                  </p>
                </div>
                <Switch
                  id="newAnnouncement"
                  checked={settings.triggers.newAnnouncement}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      triggers: { ...settings.triggers, newAnnouncement: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="newRequest">درخواست تعمیرات جدید</Label>
                  <p className="text-xs text-muted-foreground">
                    وقتی درخواست تعمیرات جدید ثبت می‌شود
                  </p>
                </div>
                <Switch
                  id="newRequest"
                  checked={settings.triggers.newRequest}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      triggers: { ...settings.triggers, newRequest: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Message Templates */}
          <div className="space-y-4">
            <h3 className="font-semibold">قالب پیام‌ها</h3>
            <p className="text-sm text-muted-foreground">
              قالب پیام‌های ارسالی را ویرایش کنید (از متغیرهای {'{نام}'}, {'{مبلغ}'}, {'{تاریخ}'} استفاده کنید)
            </p>

            <div className="space-y-2">
              <Label htmlFor="chargeTemplate">قالب شارژ جدید</Label>
              <Textarea
                id="chargeTemplate"
                placeholder="{نام} عزیز، شارژ جدید به مبلغ {مبلغ} تومان برای واحد شما ثبت شد. سررسید: {تاریخ}"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTemplate">قالب تایید پرداخت</Label>
              <Textarea
                id="paymentTemplate"
                placeholder="{نام} عزیز، پرداخت شما به مبلغ {مبلغ} تومان با موفقیت ثبت شد."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 ml-2" />
              {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
