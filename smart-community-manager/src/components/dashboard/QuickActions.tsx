import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Receipt,
  UserPlus,
  Megaphone,
  PiggyBank,
  FileText,
  Building2,
} from 'lucide-react';

const actions = [
  {
    title: 'صدور شارژ جدید',
    icon: Receipt,
    href: '/manager/charges/new',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    title: 'افزودن ساکن',
    icon: UserPlus,
    href: '/manager/residents',
    color: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
  },
  {
    title: 'اطلاعیه جدید',
    icon: Megaphone,
    href: '/manager/announcements',
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
  },
  {
    title: 'واریز به صندوق',
    icon: PiggyBank,
    href: '/manager/fund',
    color: 'bg-success/10 text-success hover:bg-success/20',
  },
  {
    title: 'گزارش‌گیری',
    icon: FileText,
    href: '/manager/reports',
    color: 'bg-accent/10 text-accent hover:bg-accent/20',
  },
  {
    title: 'مدیریت واحدها',
    icon: Building2,
    href: '/manager/units',
    color: 'bg-muted text-muted-foreground hover:bg-muted/80',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">دسترسی سریع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              variant="ghost"
              asChild
              className={`h-auto flex-col gap-2 p-4 ${action.color}`}
            >
              <Link to={action.href}>
                <action.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{action.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
