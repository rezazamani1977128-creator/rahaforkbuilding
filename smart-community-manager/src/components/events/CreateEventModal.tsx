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

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [requireRSVP, setRequireRSVP] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);
  const [repeat, setRepeat] = useState('none');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title || title.length < 3) newErrors.title = 'عنوان باید حداقل ۳ کاراکتر باشد';
    if (!type) newErrors.type = 'انتخاب نوع رویداد الزامی است';
    if (!date) newErrors.date = 'تاریخ رویداد الزامی است';
    if (!startTime) newErrors.startTime = 'زمان شروع الزامی است';
    if (!location) newErrors.location = 'مکان برگزاری الزامی است';
    if (!description || description.length < 10) {
      newErrors.description = 'توضیحات باید حداقل ۱۰ کاراکتر باشد';
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
      description: 'رویداد با موفقیت ایجاد شد',
    });

    // Reset form
    setTitle('');
    setType('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setDescription('');
    setMaxAttendees('');
    setRequireRSVP(true);
    setSendNotification(true);
    setRepeat('none');
    setErrors({});
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ایجاد رویداد جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان رویداد *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: جلسه مجمع عمومی"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">نوع رویداد *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className={errors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">جلسه</SelectItem>
                <SelectItem value="celebration">جشن</SelectItem>
                <SelectItem value="maintenance">تعمیرات</SelectItem>
                <SelectItem value="community">اجتماعی</SelectItem>
                <SelectItem value="other">سایر</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">تاریخ *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={errors.date ? 'border-destructive' : ''}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">زمان شروع *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={errors.startTime ? 'border-destructive' : ''}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">زمان پایان</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">مکان برگزاری *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مثلاً: لابی ساختمان یا مجازی"
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کامل درباره رویداد..."
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Max Attendees */}
          <div className="space-y-2">
            <Label htmlFor="maxAttendees">حداکثر شرکت‌کننده (اختیاری)</Label>
            <Input
              id="maxAttendees"
              type="number"
              value={maxAttendees}
              onChange={(e) => setMaxAttendees(e.target.value)}
              placeholder="نامحدود"
            />
          </div>

          {/* Repeat */}
          <div className="space-y-2">
            <Label htmlFor="repeat">تکرار</Label>
            <Select value={repeat} onValueChange={setRepeat}>
              <SelectTrigger id="repeat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون تکرار</SelectItem>
                <SelectItem value="weekly">هفتگی</SelectItem>
                <SelectItem value="monthly">ماهانه</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Settings */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-rsvp" className="cursor-pointer">
                نیاز به تایید شرکت
              </Label>
              <Switch
                id="require-rsvp"
                checked={requireRSVP}
                onCheckedChange={setRequireRSVP}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="send-notification" className="cursor-pointer">
                ارسال اعلان به همه ساکنین
              </Label>
              <Switch
                id="send-notification"
                checked={sendNotification}
                onCheckedChange={setSendNotification}
              />
            </div>
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
              {isSubmitting ? 'در حال ایجاد...' : 'ایجاد رویداد'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
