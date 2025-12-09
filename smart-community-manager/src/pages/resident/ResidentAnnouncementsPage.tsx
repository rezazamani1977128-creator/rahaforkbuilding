import { useState } from 'react';
import { Megaphone, Filter, Pin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockAnnouncements } from '@/data/mockData';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';

export function ResidentAnnouncementsPage() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState<Set<string>>(new Set());

  const announcements = mockAnnouncements;
  const unreadCount = announcements.filter(a => !readAnnouncements.has(a.id)).length;

  const filteredAnnouncements = announcements
    .filter(a => {
      if (filter === 'unread') return !readAnnouncements.has(a.id);
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    })
    .sort((a, b) => {
      // Pinned items always on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const priorityColors: Record<string, string> = {
    urgent: 'border-r-4 border-r-destructive',
    high: 'border-r-4 border-r-orange-500',
    medium: 'border-r-4 border-r-yellow-500',
    low: 'border-r-4 border-r-green-500',
  };

  const priorityLabels: Record<string, string> = {
    urgent: 'فوری',
    high: 'مهم',
    medium: 'متوسط',
    low: 'عادی',
  };

  const priorityBadgeColors: Record<string, string> = {
    urgent: 'bg-destructive/10 text-destructive',
    high: 'bg-orange-500/10 text-orange-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-green-500/10 text-green-500',
  };

  const handleAnnouncementClick = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setDetailModalOpen(true);
    // Mark as read
    setReadAnnouncements(new Set(readAnnouncements).add(announcement.id));
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'همین الان';
    if (diffInSeconds < 3600) return `${toPersianNumber(Math.floor(diffInSeconds / 60))} دقیقه پیش`;
    if (diffInSeconds < 86400) return `${toPersianNumber(Math.floor(diffInSeconds / 3600))} ساعت پیش`;
    if (diffInSeconds < 604800) return `${toPersianNumber(Math.floor(diffInSeconds / 86400))} روز پیش`;
    return formatPersianDate(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            اطلاعیه‌ها
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {toPersianNumber(unreadCount)} جدید
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            اطلاعیه‌ها و اخبار ساختمان
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="unread">خوانده نشده</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'newest' | 'oldest')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => {
            const isUnread = !readAnnouncements.has(announcement.id);
            
            return (
              <Card
                key={announcement.id}
                className={`cursor-pointer hover:bg-muted/50 transition-colors ${priorityColors[announcement.priority]} ${isUnread ? 'bg-primary/5' : ''}`}
                onClick={() => handleAnnouncementClick(announcement)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {isUnread && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {announcement.isPinned && (
                            <Pin className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        </div>
                        <Badge className={priorityBadgeColors[announcement.priority]}>
                          {priorityLabels[announcement.priority]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>{getRelativeTime(announcement.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">اطلاعیه‌ای برای نمایش وجود ندارد</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedAnnouncement.isPinned && (
                  <Pin className="h-5 w-5 text-primary" />
                )}
                {selectedAnnouncement.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex items-center gap-2">
                <Badge className={priorityBadgeColors[selectedAnnouncement.priority]}>
                  {priorityLabels[selectedAnnouncement.priority]}
                </Badge>
                {selectedAnnouncement.isPinned && (
                  <Badge variant="outline">سنجاق شده</Badge>
                )}
              </div>

              {/* Content */}
              <div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>

              {/* Meta */}
              <div className="pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <span>ارسال شده: {formatPersianDate(selectedAnnouncement.createdAt)}</span>
                <span>توسط: {selectedAnnouncement.authorId === 'u1' ? 'مدیر ساختمان' : 'مدیریت'}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
