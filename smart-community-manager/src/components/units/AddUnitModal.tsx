import { useState } from 'react';
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
import { mockUsers } from '@/data/mockData';

interface AddUnitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUnitModal({ open, onOpenChange }: AddUnitModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    floor: '',
    area: '',
    coefficient: '1',
    ownerId: '',
    parkingSpots: '1',
  });

  const [isLoading, setIsLoading] = useState(false);

  console.log('AddUnitModal rendering with open:', open);
  console.log('mockUsers available:', mockUsers && mockUsers.length > 0);

  const handleChange = (field: string, value: string) => {
    console.log('handleChange:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    if (!formData.number || !formData.floor || !formData.area || !formData.ownerId) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Reset form
      setFormData({
        number: '',
        floor: '',
        area: '',
        coefficient: '1',
        ownerId: '',
        parkingSpots: '1',
      });
      
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>افزودن واحد جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Unit Number */}
          <div className="space-y-2">
            <Label htmlFor="number">شماره واحد *</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => handleChange('number', e.target.value)}
              placeholder="مثال: ۱۰۱"
              className="rtl"
            />
          </div>

          {/* Floor and Area */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">طبقه *</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) => handleChange('floor', e.target.value)}
                placeholder="0"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">متراژ *</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="85"
                dir="ltr"
              />
            </div>
          </div>

          {/* Coefficient and Owner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coefficient">ضریب</Label>
              <Input
                id="coefficient"
                type="number"
                step="0.1"
                value={formData.coefficient}
                onChange={(e) => handleChange('coefficient', e.target.value)}
                placeholder="1.0"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">مالک *</Label>
              {mockUsers && mockUsers.length > 0 ? (
                <Select value={formData.ownerId} onValueChange={(v) => handleChange('ownerId', v)}>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder="انتخاب مالک" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-red-500">مالکان بارگذاری نشدند</div>
              )}
            </div>
          </div>

          {/* Parking Spots */}
          <div className="space-y-2">
            <Label htmlFor="parkingSpots">جای پارک</Label>
            <Input
              id="parkingSpots"
              type="number"
              value={formData.parkingSpots}
              onChange={(e) => handleChange('parkingSpots', e.target.value)}
              placeholder="1"
              dir="ltr"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Cancel clicked');
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !formData.number || !formData.floor || !formData.area || !formData.ownerId}
            >
              {isLoading ? 'درحال ذخیره...' : 'افزودن واحد'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
