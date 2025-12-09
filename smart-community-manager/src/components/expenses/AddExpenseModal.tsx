import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCreateExpense } from '@/hooks/useExpenses';
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
import { expenseCategories } from '@/data/mockData';

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const { toast } = useToast();
  const createExpense = useCreateExpense();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    vendor: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.amount || !formData.category) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setIsLoading(true);
    createExpense.mutate(
      {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        vendor: formData.vendor || undefined,
        description: formData.description || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: 'ثبت شد', description: 'هزینه با موفقیت اضافه شد.' });
          onOpenChange(false);
          setFormData({ title: '', amount: '', category: '', vendor: '', description: '' });
        },
        onError: (err: any) =>
          toast({
            title: 'خطا در ثبت',
            description: err?.message || 'مشکلی رخ داد.',
            variant: 'destructive',
          }),
        onSettled: () => setIsLoading(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>افزودن هزینه جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان هزینه *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="مثال: تعمیر موتورخانه"
              className="rtl"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ (تومان) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="1000000"
              dir="ltr"
              className="text-left"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">دسته‌بندی *</Label>
            <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="انتخاب دسته" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vendor */}
          <div className="space-y-2">
            <Label htmlFor="vendor">فروشنده / تامین‌کننده</Label>
            <Input
              id="vendor"
              value={formData.vendor}
              onChange={(e) => handleChange('vendor', e.target.value)}
              placeholder="نام شرکت یا فروشنده"
              className="rtl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="توضیحات اضافی درباره هزینه"
              className="rtl resize-none"
              rows={3}
            />
          </div>

          {/* Receipt Upload Info */}
          <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg text-sm text-amber-900 dark:text-amber-200">
            <p>برای آپلود رسید، می‌توانید پس از ایجاد آن را اضافه کنید.</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !formData.title || !formData.amount || !formData.category}>
              {isLoading ? 'درحال ذخیره...' : 'افزودن هزینه'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
