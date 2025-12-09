import { useEffect, useState } from 'react';
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
import { expenseCategories, type Expense } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useUpdateExpense } from '@/hooks/useExpenses';

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
}

export function EditExpenseModal({ open, onOpenChange, expense }: EditExpenseModalProps) {
  const { toast } = useToast();
  const updateExpense = useUpdateExpense();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    vendor: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: String(expense.amount),
        category: expense.category,
        vendor: expense.vendor || '',
        description: expense.description || '',
      });
    }
  }, [expense]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!expense) return;
    if (!formData.title || !formData.amount || !formData.category) {
      toast({ title: 'فیلد الزامی', description: 'تمام فیلدهای ستاره‌دار را پر کنید.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    updateExpense.mutate(
      {
        id: expense.id,
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        vendor: formData.vendor || undefined,
        description: formData.description || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: 'به‌روزرسانی شد', description: 'هزینه با موفقیت ویرایش شد.' });
          onOpenChange(false);
        },
        onError: (err: any) =>
          toast({
            title: 'خطا در ویرایش',
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
          <DialogTitle>ویرایش هزینه</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !formData.title || !formData.amount || !formData.category}>
              {isLoading ? 'درحال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
