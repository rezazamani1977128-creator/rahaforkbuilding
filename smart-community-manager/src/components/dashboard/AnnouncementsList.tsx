import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { mockAnnouncements } from '@/data/mockData';
import { getRelativeTime } from '@/lib/persian';
import { Pin, ArrowLeft, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    label: 'فوری',
    variant: 'destructive' as const,
  },
  medium: {
    icon: AlertCircle,
    label: 'مهم',
    variant: 'warning' as const,
  },
  low: {
    icon: Info,
    label: 'عادی',
    variant: 'secondary' as const,
  },
};

export function AnnouncementsList() {
  const announcements = mockAnnouncements.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">اطلاعیه‌های اخیر</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
          <Link to="/manager/announcements">
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {announcements.map((announcement) => {
          const priority = priorityConfig[announcement.priority];
          const PriorityIcon = priority.icon;

          return (
            <div
              key={announcement.id}
              className="group rounded-lg border p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1.5 ${
                    announcement.priority === 'high' ? 'bg-destructive/10' :
                    announcement.priority === 'medium' ? 'bg-warning/10' : 'bg-muted'
                  }`}>
                    <PriorityIcon className={`h-4 w-4 ${
                      announcement.priority === 'high' ? 'text-destructive' :
                      announcement.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{announcement.title}</h4>
                      {announcement.isPinned && (
                        <Pin className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge variant={priority.variant} className="text-[10px]">
                        {priority.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {getRelativeTime(announcement.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
