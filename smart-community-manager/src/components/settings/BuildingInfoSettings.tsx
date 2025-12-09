import { useState } from 'react';
import { Building2, Upload, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockBuildingSettings } from '@/data/mockData';

export function BuildingInfoSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(mockBuildingSettings.building);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'موفق',
      description: 'اطلاعات ساختمان با موفقیت ذخیره شد',
    });

    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          اطلاعات ساختمان
        </CardTitle>
        <CardDescription>
          اطلاعات اصلی و توضیحات ساختمان را مدیریت کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام ساختمان *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="نام ساختمان"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">سال ساخت *</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) })}
                placeholder="۱۴۰۰"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">آدرس کامل *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="آدرس کامل ساختمان"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalUnits">تعداد کل واحدها *</Label>
              <Input
                id="totalUnits"
                type="number"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) })}
                placeholder="۲۴"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floors">تعداد طبقات *</Label>
              <Input
                id="floors"
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) })}
                placeholder="۶"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="توضیحات مختصر درباره ساختمان..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">تصویر ساختمان</Label>
            <div className="flex items-center gap-4">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="photo" className="cursor-pointer">
                  <Upload className="h-4 w-4 ml-2" />
                  آپلود تصویر
                </label>
              </Button>
              <p className="text-sm text-muted-foreground">
                تصویری از نمای ساختمان انتخاب کنید
              </p>
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
