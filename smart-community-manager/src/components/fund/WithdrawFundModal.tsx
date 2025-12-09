import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockFundStats, mockUsers } from '@/data/mockData';

interface WithdrawFundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const withdrawalCategories = [
  { value: 'maintenance', label: 'تعمیرات' },
  { value: 'emergency', label: 'اضطراری' },
  { value: 'equipment', label: 'تجهیزات' },
  { value: 'other', label: 'سایر' },
];

export function WithdrawFundModal({ open, onOpenChange }: WithdrawFundModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    requiresApproval: false,
    approverId: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isLoading, setIsLoading] = useState(false);

  const boardMembers = mockUsers.filter(u => u.role === 'board_member');
  const maxAmount = mockFundStats.currentBalance;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category || !formData.description) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    const amount = parseInt(formData.amount);
    if (amount > maxAmount) {
      alert('مبلغ درخواستی بیشتر از موجودی صندوق است');
      return;
    }

    if (formData.requiresApproval && !formData.approverId) {
      alert('لطفاً تأیید‌کننده را انتخاب کنید');
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
        category: '',
        description: '',
        requiresApproval: false,
        approverId: '',
        date: new Date().toISOString().split('T')[0],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>برداشت از صندوق</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance Info */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
            <p className="text-muted-foreground">موجودی فعلی:</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {new Intl.NumberFormat('fa-IR').format(maxAmount)} تومان
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ برداشت (تومان) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="2000000"
              dir="ltr"
              className="text-left"
              max={maxAmount}
            />
            {formData.amount && parseInt(formData.amount) > 0 && (
              <p className="text-xs text-muted-foreground">
                موجودی پس از برداشت: {new Intl.NumberFormat('fa-IR').format(maxAmount - parseInt(formData.amount))} تومان
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">مقصد برداشت *</Label>
            <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="انتخاب مقصد" />
              </SelectTrigger>
              <SelectContent>
                {withdrawalCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیح تفصیلی *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="مثال: تعمیرات آسانسور طبقه‌ای - تعویض کابل"
              className="rtl resize-none"
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">تاریخ برداشت</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              dir="ltr"
            />
          </div>

          {/* Requires Approval */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="requiresApproval"
                checked={formData.requiresApproval}
                onCheckedChange={(checked) => handleChange('requiresApproval', checked === true)}
              />
              <Label htmlFor="requiresApproval" className="cursor-pointer font-normal">
                نیاز به تأیید هیئت مدیره
              </Label>
            </div>
          </div>

          {/* Approver Selection */}
          {formData.requiresApproval && (
            <div className="space-y-2">
              <Label htmlFor="approver">تأیید‌کننده</Label>
              <Select value={formData.approverId} onValueChange={(v) => handleChange('approverId', v)}>
                <SelectTrigger id="approver">
                  <SelectValue placeholder="انتخاب تأیید‌کننده" />
                </SelectTrigger>
                <SelectContent>
                  {boardMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg text-sm text-amber-900 dark:text-amber-200">
            <p className="font-medium mb-1">نکات مهم:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>برداشت بیش از موجودی ممکن نیست</li>
              <li>برای مبالغ بزرگ‌تر از ۵ میلیون تومان تأیید الزامی است</li>
              <li>هر برداشت در سوابق ثبت می‌شود</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.amount || !formData.category || !formData.description}
            >
              {isLoading ? 'درحال ثبت...' : 'درخواست برداشت'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
