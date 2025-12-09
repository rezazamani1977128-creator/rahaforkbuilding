import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CreateDiscussionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDiscussionModal({ open, onOpenChange }: CreateDiscussionModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title || title.length < 5) {
      newErrors.title = 'عنوان باید حداقل ۵ کاراکتر باشد';
    }
    if (!category) {
      newErrors.category = 'انتخاب دسته‌بندی الزامی است';
    }
    if (!content || content.length < 20) {
      newErrors.content = 'محتوا باید حداقل ۲۰ کاراکتر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'موفق',
      description: 'بحث شما با موفقیت ایجاد شد',
    });

    // Reset form
    setTitle('');
    setCategory('');
    setContent('');
    setAnonymous(false);
    setErrors({});
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>شروع بحث جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="موضوع بحث خود را وارد کنید"
              maxLength={100}
              className={errors.title ? 'border-destructive' : ''}
            />
            <div className="flex justify-between text-xs">
              {errors.title ? (
                <span className="text-destructive">{errors.title}</span>
              ) : (
                <span className="text-muted-foreground">حداقل ۵ کاراکتر</span>
              )}
              <span className="text-muted-foreground">{title.length}/۱۰۰</span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">دسته‌بندی *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">عمومی</SelectItem>
                <SelectItem value="suggestions">پیشنهادات</SelectItem>
                <SelectItem value="questions">سوالات</SelectItem>
                <SelectItem value="offtopic">گفتگوی آزاد</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">محتوای بحث *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="توضیحات کامل درباره موضوع بحث خود بنویسید..."
              rows={8}
              maxLength={2000}
              className={errors.content ? 'border-destructive' : ''}
            />
            <div className="flex justify-between text-xs">
              {errors.content ? (
                <span className="text-destructive">{errors.content}</span>
              ) : (
                <span className="text-muted-foreground">حداقل ۲۰ کاراکتر</span>
              )}
              <span className="text-muted-foreground">{content.length}/۲۰۰۰</span>
            </div>
          </div>

          {/* Anonymous */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="anonymous" className="cursor-pointer font-medium">
                ارسال ناشناس
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                نام شما نمایش داده نخواهد شد
              </p>
            </div>
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ارسال...' : 'ایجاد بحث'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
