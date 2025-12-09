import { useState } from 'react';
import { X, Upload } from 'lucide-react';
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

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateListingModal({ open, onOpenChange }: CreateListingModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('1month');
  const [showPhone, setShowPhone] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!category) newErrors.category = 'انتخاب دسته‌بندی الزامی است';
    if (!title || title.length < 3) newErrors.title = 'عنوان باید حداقل ۳ کاراکتر باشد';
    if (!description || description.length < 20) {
      newErrors.description = 'توضیحات باید حداقل ۲۰ کاراکتر باشد';
    }
    if (category === 'sale' && (!price || Number(price) <= 0)) {
      newErrors.price = 'قیمت باید بیشتر از صفر باشد';
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
      description: 'آگهی شما با موفقیت ثبت شد',
    });

    // Reset form
    setCategory('');
    setTitle('');
    setDescription('');
    setPrice('');
    setPhotos([]);
    setShowPhone(true);
    setErrors({});
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast({
        title: 'خطا',
        description: 'حداکثر ۵ تصویر مجاز است',
        variant: 'destructive',
      });
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ثبت آگهی جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">دسته‌بندی *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">فروشی</SelectItem>
                <SelectItem value="free">رایگان</SelectItem>
                <SelectItem value="services">خدمات</SelectItem>
                <SelectItem value="lending">امانت</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: مبل راحتی ۷ نفره"
              maxLength={50}
              className={errors.title ? 'border-destructive' : ''}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {errors.title ? (
                <span className="text-destructive">{errors.title}</span>
              ) : (
                <span />
              )}
              <span>{title.length}/۵۰</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کامل درباره آگهی خود بنویسید..."
              rows={4}
              maxLength={500}
              className={errors.description ? 'border-destructive' : ''}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {errors.description ? (
                <span className="text-destructive">{errors.description}</span>
              ) : (
                <span />
              )}
              <span>{description.length}/۵۰۰</span>
            </div>
          </div>

          {/* Price (only for sale category) */}
          {category === 'sale' && (
            <div className="space-y-2">
              <Label htmlFor="price">قیمت (تومان) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="۱۵۰۰۰۰۰۰"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>
          )}

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>تصاویر (حداکثر ۵ عدد)</Label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 left-1 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {photos.length < 5 && (
                <Label
                  htmlFor="photo-upload"
                  className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </Label>
              )}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">مدت نمایش آگهی</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">۱ هفته</SelectItem>
                <SelectItem value="2weeks">۲ هفته</SelectItem>
                <SelectItem value="1month">۱ ماه</SelectItem>
                <SelectItem value="until_sold">تا فروش/تکمیل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Preferences */}
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium">تنظیمات تماس</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-phone" className="cursor-pointer">
                نمایش شماره تماس
              </Label>
              <Switch
                id="show-phone"
                checked={showPhone}
                onCheckedChange={setShowPhone}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              در صورت غیرفعال بودن، تنها از طریق پیام داخل برنامه قابل تماس خواهید بود
            </p>
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
              {isSubmitting ? 'در حال ثبت...' : 'ثبت آگهی'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
