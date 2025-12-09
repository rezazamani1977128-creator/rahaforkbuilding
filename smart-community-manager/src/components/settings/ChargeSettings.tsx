import { useState } from 'react';
import { Receipt, Plus, Trash2, Save } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { mockBuildingSettings } from '@/data/mockData';

export function ChargeSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(mockBuildingSettings.charges);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'موفق',
      description: 'تنظیمات شارژ با موفقیت ذخیره شد',
    });

    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          تنظیمات شارژ
        </CardTitle>
        <CardDescription>
          پیکربندی نحوه محاسبه و تقسیم شارژها
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">تنظیمات پایه</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calcMethod">روش محاسبه پیش‌فرض</Label>
                <Select
                  value={settings.defaultCalculationMethod}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultCalculationMethod: value })
                  }
                >
                  <SelectTrigger id="calcMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">تقسیم مساوی</SelectItem>
                    <SelectItem value="area">بر اساس متراژ</SelectItem>
                    <SelectItem value="resident">تعداد ساکن</SelectItem>
                    <SelectItem value="custom">دستی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDay">روز سررسید (روز ماه)</Label>
                <Input
                  id="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  value={settings.defaultDueDay}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultDueDay: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="autoGenerate">ایجاد خودکار شارژ ماهانه</Label>
                <p className="text-sm text-muted-foreground">
                  شارژ ماهانه به صورت خودکار در اول هر ماه ایجاد شود
                </p>
              </div>
              <Switch
                id="autoGenerate"
                checked={settings.autoGenerate}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoGenerate: checked })
                }
              />
            </div>
          </div>

          {/* Late Fee Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">تنظیمات جریمه دیرکرد</h3>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="lateFeeEnabled">فعال‌سازی جریمه دیرکرد</Label>
                <p className="text-sm text-muted-foreground">
                  در صورت تاخیر در پرداخت، جریمه اعمال شود
                </p>
              </div>
              <Switch
                id="lateFeeEnabled"
                checked={settings.lateFee.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    lateFee: { ...settings.lateFee, enabled: checked },
                  })
                }
              />
            </div>

            {settings.lateFee.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-4 border-r-2">
                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">مهلت (روز)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    min="0"
                    value={settings.lateFee.gracePeriod}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lateFee: {
                          ...settings.lateFee,
                          gracePeriod: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    تعداد روز مهلت بدون جریمه
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feeType">نوع جریمه</Label>
                  <Select
                    value={settings.lateFee.type}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        lateFee: { ...settings.lateFee, type: value },
                      })
                    }
                  >
                    <SelectTrigger id="feeType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                      <SelectItem value="percentage">درصد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feeAmount">
                    {settings.lateFee.type === 'fixed' ? 'مبلغ (تومان)' : 'درصد'}
                  </Label>
                  <Input
                    id="feeAmount"
                    type="number"
                    min="0"
                    value={settings.lateFee.amount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lateFee: {
                          ...settings.lateFee,
                          amount: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Charge Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">دسته‌بندی‌های هزینه</h3>
              <Button type="button" variant="outline" size="sm">
                <Plus className="h-4 w-4 ml-2" />
                افزودن دسته
              </Button>
            </div>

            <div className="space-y-2">
              {['آب', 'برق', 'گاز', 'نگهبانی', 'آسانسور'].map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium">{category}</span>
                  <Button type="button" variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
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
