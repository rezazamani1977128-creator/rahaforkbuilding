import { useState } from 'react';
import { CreditCard, Save, CheckCircle } from 'lucide-react';
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

export function PaymentSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(mockBuildingSettings.payments);
  const [testing, setTesting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'موفق',
      description: 'تنظیمات پرداخت با موفقیت ذخیره شد',
    });

    setSaving(false);
  };

  const handleTestConnection = async () => {
    setTesting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'موفق',
      description: 'اتصال به درگاه پرداخت برقرار شد',
    });

    setTesting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          روش‌های پرداخت
        </CardTitle>
        <CardDescription>
          پیکربندی درگاه‌های پرداخت و روش‌های دریافت وجه
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Online Payment Gateway */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">درگاه پرداخت آنلاین</h3>
              <Switch
                checked={settings.online.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    online: { ...settings.online, enabled: checked },
                  })
                }
              />
            </div>

            {settings.online.enabled && (
              <div className="space-y-4 pr-4 border-r-2">
                <div className="space-y-2">
                  <Label htmlFor="gateway">درگاه پرداخت</Label>
                  <Select
                    value={settings.online.gateway}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        online: { ...settings.online, gateway: value },
                      })
                    }
                  >
                    <SelectTrigger id="gateway">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zarinpal">زرین‌پال</SelectItem>
                      <SelectItem value="idpay">آیدی‌پی</SelectItem>
                      <SelectItem value="nextpay">نکست‌پی</SelectItem>
                      <SelectItem value="zibal">زیبال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchantId">شناسه پذیرنده (Merchant ID)</Label>
                  <Input
                    id="merchantId"
                    value={settings.online.merchantId}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        online: { ...settings.online, merchantId: e.target.value },
                      })
                    }
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">کلید API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="••••••••••••••••"
                  />
                  <p className="text-xs text-muted-foreground">
                    کلید API را از پنل درگاه پرداخت دریافت کنید
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing}
                >
                  <CheckCircle className="h-4 w-4 ml-2" />
                  {testing ? 'در حال بررسی...' : 'تست اتصال'}
                </Button>
              </div>
            )}
          </div>

          {/* Card to Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">کارت به کارت</h3>
              <Switch
                checked={settings.cardToCard.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    cardToCard: { ...settings.cardToCard, enabled: checked },
                  })
                }
              />
            </div>

            {settings.cardToCard.enabled && (
              <div className="space-y-4 pr-4 border-r-2">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">شماره کارت</Label>
                  <Input
                    id="cardNumber"
                    value={settings.cardToCard.cardNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cardToCard: {
                          ...settings.cardToCard,
                          cardNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="۶۰۳۷-۹۹۷۷-۱۲۳۴-۵۶۷۸"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holderName">نام صاحب حساب</Label>
                  <Input
                    id="holderName"
                    value={settings.cardToCard.holderName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cardToCard: {
                          ...settings.cardToCard,
                          holderName: e.target.value,
                        },
                      })
                    }
                    placeholder="علی رضایی"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">نام بانک</Label>
                  <Input
                    id="bankName"
                    value={settings.cardToCard.bankName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cardToCard: {
                          ...settings.cardToCard,
                          bankName: e.target.value,
                        },
                      })
                    }
                    placeholder="ملی"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cash Payment */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="cash">پرداخت نقدی</Label>
              <p className="text-sm text-muted-foreground">
                امکان ثبت پرداخت نقدی توسط مدیر
              </p>
            </div>
            <Switch
              id="cash"
              checked={settings.cash}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, cash: checked })
              }
            />
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
