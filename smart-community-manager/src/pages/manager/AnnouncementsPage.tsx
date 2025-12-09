import { useState, useMemo } from 'react';
import { Plus, Search, Pin, PinOff, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockAnnouncements } from '@/data/mockData';
import { formatPersianDate, toPersianNumber } from '@/lib/utils';
import { CreateAnnouncementModal } from '@/components/announcements/CreateAnnouncementModal';
import { AnnouncementDetailModal } from '@/components/announcements/AnnouncementDetailModal';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  targetAudience: string[];
  createdBy: string;
  createdAt: Date;
  isPinned: boolean;
  readBy: string[];
  totalResidents: number;
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

export function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    mockAnnouncements.map((a) => ({
      ...a,
      priority: (a.priority as Announcement['priority']) ?? 'medium',
      targetAudience: [],
      createdBy: 'مدیر ساختمان',
      isPinned: a.isPinned ?? false,
      readBy: [],
      totalResidents: 24,
    }))
  );

  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements;

    // Apply filter
    if (activeTab === 'pinned') {
      filtered = filtered.filter(a => a.isPinned);
    } else if (activeTab === 'urgent') {
      filtered = filtered.filter(a => a.priority === 'urgent');
    } else if (activeTab === 'unread') {
      filtered = filtered.filter(a => a.readBy.length < a.totalResidents);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query)
      );
    }

    // Sort pinned first, then by date
    return filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [announcements, activeTab, searchQuery]);

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a =>
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      )
    );
  };

  const handleCreateAnnouncement = (data: any) => {
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      content: data.content,
      priority: data.priority,
      targetAudience: data.targetAudience,
      createdBy: 'مدیر ساختمان',
      createdAt: new Date(),
      isPinned: data.isPinned,
      readBy: [],
      totalResidents: 24,
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setCreateModalOpen(false);
  };

  const readPercentage = (announcement: Announcement) => {
    return Math.round((announcement.readBy.length / announcement.totalResidents) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">اطلاعیه‌ها</h1>
          <p className="text-muted-foreground mt-1">
            {toPersianNumber(announcements.length)} اطلاعیه در سیستم
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          اطلاعیه جدید
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative" dir="rtl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در عنوان یا محتوا..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div dir="rtl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4" dir="rtl">
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="pinned">
              سنجاق شده ({announcements.filter(a => a.isPinned).length})
            </TabsTrigger>
            <TabsTrigger value="urgent">فوری</TabsTrigger>
            <TabsTrigger value="unread">
              خوانده نشده ({announcements.filter(a => a.readBy.length < a.totalResidents).length})
            </TabsTrigger>
          </TabsList>

          {['all', 'pinned', 'urgent', 'unread'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
              {filteredAnnouncements.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground">اطلاعیه‌ای یافت نشد</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredAnnouncements.map(announcement => (
                    <Card key={announcement.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-row-reverse" dir="rtl">
                        {/* Priority colored right border */}
                        <div
                          className={`w-1 ${
                            announcement.priority === 'urgent'
                              ? 'bg-red-500'
                              : announcement.priority === 'high'
                                ? 'bg-orange-500'
                                : announcement.priority === 'medium'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                          }`}
                        />

                        <CardContent className="flex-1 py-4 px-6 flex items-start justify-between gap-4">
                          {/* Content */}
                          <div
                            className="flex-1 cursor-pointer text-right"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setDetailModalOpen(true);
                            }}
                          >
                            <div className="flex items-center gap-3 mb-2 justify-start">
                              {announcement.isPinned && (
                                <Pin className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                              )}
                              <h3 className="font-semibold text-lg">{announcement.title}</h3>
                              <Badge className={priorityColors[announcement.priority]}>
                                {priorityLabels[announcement.priority]}
                              </Badge>
                            </div>

                            <p className="text-muted-foreground line-clamp-2 mb-3 text-right">
                              {announcement.content}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap justify-start">
                              <span>{formatPersianDate(new Date(announcement.createdAt))}</span>
                              <span>
                                {toPersianNumber(announcement.readBy.length)} از{' '}
                                {toPersianNumber(announcement.totalResidents)} خواندند
                              </span>
                              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${readPercentage(announcement)}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePin(announcement.id)}
                              title={announcement.isPinned ? 'لغو سنجاق' : 'سنجاق کردن'}
                            >
                              {announcement.isPinned ? (
                                <PinOff className="h-4 w-4" />
                              ) : (
                                <Pin className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" title="ویرایش">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(announcement.id)}
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Modals */}
      <CreateAnnouncementModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateAnnouncement}
      />

      {selectedAnnouncement && (
        <AnnouncementDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          announcement={selectedAnnouncement}
          onDelete={() => {
            handleDelete(selectedAnnouncement.id);
            setDetailModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
