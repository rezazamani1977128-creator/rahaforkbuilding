import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface CreatePollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function CreatePollModal({
  open,
  onOpenChange,
  onSubmit,
}: CreatePollModalProps) {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    deadline: '',
    isAnonymous: true,
    allowMultiple: false,
    isDraft: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit(formData);
    setFormData({
      question: '',
      options: ['', ''],
      deadline: '',
      isAnonymous: true,
      allowMultiple: false,
      isDraft: false,
    });
    setIsLoading(false);
  };

  const filledOptions = formData.options.filter(opt => opt.trim());
  const isValid = formData.question.trim() && filledOptions.length >= 2 && formData.deadline;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>رأی‌گیری جدید</DialogTitle>
          <DialogDescription>
            یک رأی‌گیری جدید برای ساکنین ایجاد کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">سؤال</Label>
            <Input
              id="question"
              placeholder="سؤال رأی‌گیری را وارد کنید..."
              value={formData.question}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
              required
            />
          </div>

          {/* Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">گزینه‌ها</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-end gap-2">
                  <Input
                    placeholder={`گزینه ${index + 1}`}
                    value={option}
                    onChange={e => handleOptionChange(index, e.target.value)}
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddOption}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                افزودن گزینه
              </Button>
            </CardContent>
          </Card>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">مهلت پایان</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          {/* Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">تنظیمات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={isAnonymous => setFormData({ ...formData, isAnonymous: isAnonymous as boolean })}
                />
                <Label htmlFor="anonymous" className="mb-0 cursor-pointer">
                  رأی‌گیری ناشناس
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="multiple"
                  checked={formData.allowMultiple}
                  onCheckedChange={allowMultiple => setFormData({ ...formData, allowMultiple: allowMultiple as boolean })}
                />
                <Label htmlFor="multiple" className="mb-0 cursor-pointer">
                  اجازه انتخاب چندگانه
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="draft"
                  checked={formData.isDraft}
                  onCheckedChange={isDraft => setFormData({ ...formData, isDraft: isDraft as boolean })}
                />
                <Label htmlFor="draft" className="mb-0 cursor-pointer">
                  ذخیره به عنوان پیش‌نویس
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? 'در حال ایجاد...' : 'ایجاد رأی‌گیری'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
