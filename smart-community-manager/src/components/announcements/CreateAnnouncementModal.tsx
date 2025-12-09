import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function CreateAnnouncementModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateAnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: ['all'],
    isPinned: false,
    sendNotification: true,
    scheduleForLater: false,
    scheduledDate: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit(formData);
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      targetAudience: ['all'],
      isPinned: false,
      sendNotification: true,
      scheduleForLater: false,
      scheduledDate: '',
    });
    setIsLoading(false);
  };

  const isValid = formData.title.trim() && formData.content.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>اطلاعیه جدید</DialogTitle>
          <DialogDescription>
            یک اطلاعیه جدید برای ساکنین ایجاد کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان</Label>
            <Input
              id="title"
              placeholder="عنوان اطلاعیه را وارد کنید..."
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">محتوا</Label>
            <Textarea
              id="content"
              placeholder="متن اطلاعیه را وارد کنید..."
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">اولویت</Label>
              <Select value={formData.priority} onValueChange={priority => setFormData({ ...formData, priority })}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">عادی</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">مهم</SelectItem>
                  <SelectItem value="urgent">فوری</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pin toggle */}
            <div className="flex items-end gap-3">
              <Checkbox
                id="pin"
                checked={formData.isPinned}
                onCheckedChange={isPinned => setFormData({ ...formData, isPinned: isPinned as boolean })}
              />
              <Label htmlFor="pin" className="mb-0 cursor-pointer">
                سنجاق به بالا
              </Label>
            </div>
          </div>

          {/* Target Audience */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">مخاطبین</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="aud-all"
                  checked={formData.targetAudience.includes('all')}
                  onCheckedChange={checked => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        targetAudience: ['all'],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        targetAudience: formData.targetAudience.filter(a => a !== 'all'),
                      });
                    }
                  }}
                />
                <Label htmlFor="aud-all" className="mb-0 cursor-pointer">
                  همه ساکنین
                </Label>
              </div>

              {formData.targetAudience.includes('all') ? null : (
                <>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="aud-owners"
                      checked={formData.targetAudience.includes('owners')}
                      onCheckedChange={checked => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            targetAudience: [...formData.targetAudience, 'owners'],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetAudience: formData.targetAudience.filter(a => a !== 'owners'),
                          });
                        }
                      }}
                    />
                    <Label htmlFor="aud-owners" className="mb-0 cursor-pointer">
                      مالکین
                    </Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="aud-tenants"
                      checked={formData.targetAudience.includes('tenants')}
                      onCheckedChange={checked => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            targetAudience: [...formData.targetAudience, 'tenants'],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetAudience: formData.targetAudience.filter(a => a !== 'tenants'),
                          });
                        }
                      }}
                    />
                    <Label htmlFor="aud-tenants" className="mb-0 cursor-pointer">
                      مستاجرین
                    </Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notification */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="notify"
              checked={formData.sendNotification}
              onCheckedChange={sendNotification => setFormData({ ...formData, sendNotification: sendNotification as boolean })}
            />
            <Label htmlFor="notify" className="mb-0 cursor-pointer">
              ارسال اطلاع‌رسانی به ساکنین
            </Label>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="schedule"
              checked={formData.scheduleForLater}
              onCheckedChange={scheduleForLater => setFormData({ ...formData, scheduleForLater: scheduleForLater as boolean })}
            />
            <Label htmlFor="schedule" className="mb-0 cursor-pointer">
              برنامه‌ریزی برای بعد
            </Label>
          </div>

          {formData.scheduleForLater && (
            <div className="space-y-2">
              <Label htmlFor="date">تاریخ و زمان</Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
          )}

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
              {isLoading ? 'در حال ارسال...' : 'ایجاد اطلاعیه'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
