import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Share2, Edit2, Trash2, Heart } from 'lucide-react';
import { formatPersianDate, toPersianNumber } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  createdBy: string;
  createdAt: Date;
  isPinned: boolean;
  readBy: string[];
  totalResidents: number;
}

interface AnnouncementDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement;
  onDelete: () => void;
}

const priorityLabels = {
  urgent: 'فوری',
  high: 'مهم',
  medium: 'متوسط',
  low: 'عادی',
};

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
};

export function AnnouncementDetailModal({
  open,
  onOpenChange,
  announcement,
  onDelete,
}: AnnouncementDetailModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMarkedImportant, setIsMarkedImportant] = useState(false);

  const readPercentage = Math.round(
    (announcement.readBy.length / announcement.totalResidents) * 100
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 rtl">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{announcement.title}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={priorityColors[announcement.priority]}>
                  {priorityLabels[announcement.priority]}
                </Badge>
                {announcement.isPinned && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:text-yellow-400">
                    سنجاق شده
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-1">نویسنده</p>
                <p className="font-semibold">{announcement.createdBy}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-1">تاریخ</p>
                <p className="font-semibold">{formatPersianDate(new Date(announcement.createdAt))}</p>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">محتوا</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-justify leading-relaxed">
                {announcement.content}
              </p>
            </CardContent>
          </Card>

          {/* Read Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">آمار خوانش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2">
                  {toPersianNumber(announcement.readBy.length)} از{' '}
                  {toPersianNumber(announcement.totalResidents)} نفر خواندند
                </p>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${readPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {toPersianNumber(readPercentage)}% نرخ خوانش
                </p>
              </div>

              {/* Readers List */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between rtl">
                    <span>مشاهده لیست خوانندگان</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {announcement.readBy.length > 0 ? (
                      announcement.readBy.map((userId, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-muted rounded-lg text-sm rtl"
                        >
                          <p className="font-medium">واحد {toPersianNumber(idx + 1)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">هیچ کسی هنوز نخوانده است</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-between border-t pt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMarkedImportant(!isMarkedImportant)}
                className={isMarkedImportant ? 'text-red-600' : ''}
              >
                <Heart
                  className="h-4 w-4 mr-2"
                  fill={isMarkedImportant ? 'currentColor' : 'none'}
                />
                علاقه
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                اشتراک
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete();
                  onOpenChange(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button onClick={() => onOpenChange(false)}>بستن</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
