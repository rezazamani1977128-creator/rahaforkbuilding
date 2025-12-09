import { useState } from 'react';
import { 
  Droplets, 
  Zap, 
  Wind, 
  Building, 
  Car, 
  Phone, 
  ArrowUpDown,
  MoreHorizontal,
  Upload,
  X
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

interface SubmitRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const categories = [
  { value: 'plumbing', label: 'لوله‌کشی', icon: Droplets },
  { value: 'electrical', label: 'برق', icon: Zap },
  { value: 'elevator', label: 'آسانسور', icon: ArrowUpDown },
  { value: 'hvac', label: 'تهویه', icon: Wind },
  { value: 'common_areas', label: 'مشاعات', icon: Building },
  { value: 'parking', label: 'پارکینگ', icon: Car },
  { value: 'intercom', label: 'آیفون', icon: Phone },
  { value: 'other', label: 'سایر', icon: MoreHorizontal },
];

const priorities = [
  { value: 'urgent', label: 'اضطراری', description: 'نیاز به توجه فوری' },
  { value: 'high', label: 'بالا', description: 'ظرف ۲۴ ساعت' },
  { value: 'medium', label: 'متوسط', description: 'ظرف یک هفته' },
  { value: 'low', label: 'پایین', description: 'در زمان مناسب' },
];

const locations = [
  { value: 'unit', label: 'داخل واحد' },
  { value: 'hallway', label: 'راهرو' },
  { value: 'parking', label: 'پارکینگ' },
  { value: 'lobby', label: 'لابی' },
  { value: 'rooftop', label: 'پشت‌بام' },
  { value: 'yard', label: 'حیاط' },
];

export function SubmitRequestModal({ open, onOpenChange, onSubmit }: SubmitRequestModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: 'medium',
    location: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'انتخاب دسته‌بندی الزامی است';
    }
    if (formData.title.length < 5) {
      newErrors.title = 'عنوان باید حداقل ۵ کاراکتر باشد';
    }
    if (formData.description.length < 20) {
      newErrors.description = 'توضیحات باید حداقل ۲۰ کاراکتر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > 5) {
      toast({
        title: 'خطا',
        description: 'حداکثر ۵ عکس می‌توانید آپلود کنید',
        variant: 'destructive',
      });
      return;
    }

    setPhotos([...photos, ...files.slice(0, 5 - photos.length)]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Call onSubmit with form data
    if (onSubmit) {
      onSubmit(formData);
    }

    toast({
      title: 'موفق',
      description: 'درخواست شما با موفقیت ثبت شد',
    });

    // Reset form
    setFormData({
      category: '',
      title: '',
      description: '',
      priority: 'medium',
      location: '',
    });
    setPhotos([]);
    setErrors({});
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ثبت درخواست جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              دسته‌بندی <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="انتخاب کنید..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              عنوان <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="مثال: نشتی آب سرویس بهداشتی"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              توضیحات <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="لطفاً مشکل را به تفصیل شرح دهید..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? 'border-destructive' : ''}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>حداقل ۲۰ کاراکتر</span>
              <span>{formData.description.length} کاراکتر</span>
            </div>
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">اولویت</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div>
                      <div className="font-medium">{priority.label}</div>
                      <div className="text-xs text-muted-foreground">{priority.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">مکان (اختیاری)</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData({ ...formData, location: value })}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="انتخاب کنید..." />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>عکس‌ها (اختیاری - حداکثر ۵ عکس)</Label>
            <div className="space-y-3">
              {photos.length < 5 && (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      کلیک کنید یا عکس را بکشید
                    </span>
                  </Label>
                </div>
              )}

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 left-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
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
              {isSubmitting ? 'در حال ثبت...' : 'ثبت درخواست'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
