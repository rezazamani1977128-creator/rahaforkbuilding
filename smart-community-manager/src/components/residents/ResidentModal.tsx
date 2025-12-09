import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUnits } from '@/data/mockData';
import type { User } from '@/data/mockData';

interface ResidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident?: User | null;
}

export function ResidentModal({ open, onOpenChange, resident }: ResidentModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    unitId: '',
    role: 'owner' as const,
    nationalId: '',
    vehiclePlate: '',
    vehiclePlate2: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Update form data when resident changes or modal opens
  useEffect(() => {
    if (resident) {
      setFormData({
        firstName: resident.name?.split(' ')[0] || '',
        lastName: resident.name?.split(' ')[1] || '',
        phone: resident.phone || '',
        email: resident.email || '',
        unitId: resident.unitId || '',
        role: resident.role === 'tenant' ? 'tenant' : 'owner',
        nationalId: '',
        vehiclePlate: '',
        vehiclePlate2: '',
      });
    } else {
      // Reset form for new resident
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        unitId: '',
        role: 'owner',
        nationalId: '',
        vehiclePlate: '',
        vehiclePlate2: '',
      });
    }
  }, [resident, open]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onOpenChange(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        unitId: '',
        role: 'owner',
        nationalId: '',
        vehiclePlate: '',
        vehiclePlate2: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resident ? 'ویرایش ساکن' : 'افزودن ساکن جدید'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">اطلاعات شخصی</TabsTrigger>
            <TabsTrigger value="unit">واحد</TabsTrigger>
            <TabsTrigger value="additional">اطلاعات تکمیلی</TabsTrigger>
          </TabsList>

          {/* Tab 1: Personal Information */}
          <TabsContent value="personal" className="space-y-4 mt-4" dir="rtl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">نام خانوادگی *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="نام خانوادگی"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">نام *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="نام"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">تلفن *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="09xxxxxxxxx"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="ایمیل"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalId">کد ملی</Label>
              <Input
                id="nationalId"
                value={formData.nationalId}
                onChange={(e) => handleChange('nationalId', e.target.value)}
                placeholder="کد ملی"
                dir="ltr"
              />
            </div>
          </TabsContent>

          {/* Tab 2: Unit */}
          <TabsContent value="unit" className="space-y-4 mt-4" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="unit">واحد *</Label>
              <Select value={formData.unitId} onValueChange={(v) => handleChange('unitId', v)}>
                <SelectTrigger id="unit" dir="rtl">
                  <SelectValue placeholder="انتخاب واحد" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {mockUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      واحد {unit.number} (طبقه {unit.floor})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">نقش ساکن *</Label>
              <Select value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                <SelectTrigger id="role" dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="owner">مالک</SelectItem>
                  <SelectItem value="tenant">مستاجر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Tab 3: Additional Information */}
          <TabsContent value="additional" className="space-y-4 mt-4" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate">شماره پلاک اول</Label>
              <Input
                id="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={(e) => handleChange('vehiclePlate', e.target.value)}
                placeholder="مثال: 456ب123 - 12"
                dir="ltr"
                style={{ textAlign: 'right' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiclePlate2">شماره پلاک دوم</Label>
              <Input
                id="vehiclePlate2"
                value={formData.vehiclePlate2}
                onChange={(e) => handleChange('vehiclePlate2', e.target.value)}
                placeholder="مثال: 456ب124 - 12"
                dir="ltr"
                style={{ textAlign: 'right' }}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-sm text-blue-900 dark:text-blue-200">
              <p className="font-medium mb-2">نکات مهم:</p>
              <ul className="list-disc list-inside space-y-1 text-right">
                <li>اطلاعات شخصی و واحد الزامی است</li>
                <li>شماره پلاک برای نگهبانی و پارکینگ استفاده می‌شود</li>
                <li>می‌توانید تا دو شماره پلاک ثبت کنید</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" dir="rtl">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'در حال ذخیره...' : resident ? 'به‌روزرسانی' : 'افزودن'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
