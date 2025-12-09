import { useState } from 'react';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockNotifications } from '@/data/mockData';
import { formatPersianDate, toPersianNumber } from '@/lib/utils';
import { getRelativeTime } from '@/lib/persian';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'charge':
        return '💰';
      case 'payment':
        return '✅';
      case 'announcement':
        return '📢';
      case 'request':
        return '🔧';
      case 'poll':
        return '🗳️';
      case 'event':
        return '📅';
      default:
        return '📬';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">اعلان‌ها</h1>
          <p className="text-muted-foreground mt-1">
            {toPersianNumber(unreadCount)} اعلان خوانده نشده
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="gap-2">
            <Check className="h-4 w-4" />
            علامت زدن همه به عنوان خوانده شده
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3" dir="rtl">
          <TabsTrigger value="all">
            همه ({toPersianNumber(notifications.length)})
          </TabsTrigger>
          <TabsTrigger value="unread">
            خوانده نشده ({toPersianNumber(unreadCount)})
          </TabsTrigger>
          <TabsTrigger value="read">
            خوانده شده ({toPersianNumber(notifications.length - unreadCount)})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {activeTab === 'unread'
                    ? 'اعلان خوانده نشده‌ای وجود ندارد'
                    : 'اعلانی یافت نشد'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`overflow-hidden transition-all ${
                  !notification.isRead ? 'border-r-4 border-r-primary bg-primary/5' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-right flex-1">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge variant="default" className="flex-shrink-0">
                            جدید
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground text-right mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4 ml-1" />
                              خوانده شد
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
