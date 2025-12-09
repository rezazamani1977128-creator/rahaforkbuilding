import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockNotifications } from '@/data/mockData';
import { getRelativeTime } from '@/lib/persian';
import { Trash2, CheckCircle2 } from 'lucide-react';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filterRead === 'unread') return !notif.isRead;
    if (filterRead === 'read') return notif.isRead;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">اعلان‌ها</h1>
        <p className="text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} اعلان جدید دارید`
            : 'تمام اعلان‌ها خوانده شده‌اند'}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filterRead === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterRead('all')}
        >
          همه ({notifications.length})
        </Button>
        <Button
          variant={filterRead === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilterRead('unread')}
        >
          خوانده‌نشده ({unreadCount})
        </Button>
        <Button
          variant={filterRead === 'read' ? 'default' : 'outline'}
          onClick={() => setFilterRead('read')}
        >
          خوانده‌شده ({notifications.length - unreadCount})
        </Button>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            onClick={markAllAsRead}
            className="mr-auto"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            همه را به‌عنوان خوانده‌شده علامت‌گذاری کن
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <CardContent className="flex items-start gap-4 p-4">
                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="h-3 w-3 rounded-full bg-primary mt-2 flex-shrink-0" />
                )}
                {notification.isRead && (
                  <div className="h-3 w-3 rounded-full bg-muted mt-2 flex-shrink-0" />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-base">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </div>

                    {/* Badge */}
                    <div className="flex-shrink-0">
                      <Badge variant={!notification.isRead ? 'default' : 'secondary'}>
                        {!notification.isRead ? 'جدید' : 'خوانده‌شده'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      title="علامت‌گذاری به‌عنوان خوانده‌شده"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground text-lg">هیچ اعلانی موجود نیست</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
