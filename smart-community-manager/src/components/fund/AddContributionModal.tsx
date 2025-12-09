import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockUnits } from '@/data/mockData';

interface AddContributionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContributionModal({ open, onOpenChange }: AddContributionModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    source: 'manual', // manual or resident
    unitId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.description) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      onOpenChange(false);
      // Reset form
      setFormData({
        amount: '',
        source: 'manual',
        unitId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>واریز به صندوق</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ (تومان) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="5000000"
              dir="ltr"
              className="text-left"
            />
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label htmlFor="source">منبع</Label>
            <Select value={formData.source} onValueChange={(v) => handleChange('source', v)}>
              <SelectTrigger id="source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">ورودی دستی</SelectItem>
                <SelectItem value="resident">از سوی ساکن</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Unit Selection (if from resident) */}
          {formData.source === 'resident' && (
            <div className="space-y-2">
              <Label htmlFor="unit">واحد</Label>
              <Select value={formData.unitId} onValueChange={(v) => handleChange('unitId', v)}>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="انتخاب واحد" />
                </SelectTrigger>
                <SelectContent>
                  {mockUnits.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>
                      واحد {unit.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیح *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="مثال: کمک ساکنین برای تعمیرات"
              className="rtl resize-none"
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">تاریخ</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              dir="ltr"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !formData.amount || !formData.description}>
              {isLoading ? 'درحال ثبت...' : 'ثبت واریز'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
