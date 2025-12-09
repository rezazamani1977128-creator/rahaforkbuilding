import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getRelativeTime, formatPrice } from '@/lib/persian';
import {
  Activity,
  CreditCard,
  Megaphone,
  Wrench,
  UserPlus,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'payment' | 'announcement' | 'request' | 'resident' | 'charge' | 'completed';
  title: string;
  description: string;
  user?: string;
  timestamp: Date;
  amount?: number;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'payment',
    title: 'پرداخت جدید',
    description: 'شارژ آذرماه پرداخت شد',
    user: 'علی رضایی',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    amount: 450000,
  },
  {
    id: '2',
    type: 'request',
    title: 'درخواست تعمیرات',
    description: 'نشتی آب سرویس بهداشتی',
    user: 'فاطمه محمدی',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    type: 'announcement',
    title: 'اطلاعیه جدید',
    description: 'قطعی آب جهت تعمیرات',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '4',
    type: 'completed',
    title: 'تعمیرات انجام شد',
    description: 'تعمیر قفل درب پارکینگ',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '5',
    type: 'payment',
    title: 'پرداخت جدید',
    description: 'شارژ آذرماه پرداخت شد',
    user: 'زهرا حسینی',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    amount: 450000,
  },
];

const activityIcons = {
  payment: CreditCard,
  announcement: Megaphone,
  request: Wrench,
  resident: UserPlus,
  charge: Receipt,
  completed: CheckCircle2,
};

const activityColors = {
  payment: 'bg-success/10 text-success',
  announcement: 'bg-warning/10 text-warning',
  request: 'bg-secondary/10 text-secondary',
  resident: 'bg-primary/10 text-primary',
  charge: 'bg-accent/10 text-accent',
  completed: 'bg-success/10 text-success',
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-5 w-5 text-primary" />
          فعالیت‌های اخیر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute right-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {mockActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activityColors[activity.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                        {activity.user && (
                          <div className="mt-1 flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-[8px] bg-muted">
                                {activity.user.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {activity.user}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-[10px] text-muted-foreground">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                        {activity.amount && (
                          <p className="text-xs font-medium text-success">
                            +{formatPrice(activity.amount)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
