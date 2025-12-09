import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toPersianNumber } from '@/lib/persian';
import {
  AlertTriangle,
  Clock,
  Wrench,
  FileText,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';

interface Task {
  id: string;
  type: 'overdue' | 'pending' | 'maintenance' | 'contract';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  count?: number;
}

const mockTasks: Task[] = [
  {
    id: '1',
    type: 'overdue',
    title: 'پرداخت‌های معوق',
    description: '۳ واحد بیش از ۱۵ روز معوق دارند',
    priority: 'high',
    count: 3,
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'درخواست تعمیرات',
    description: '۲ درخواست جدید در انتظار رسیدگی',
    priority: 'medium',
    count: 2,
  },
  {
    id: '3',
    type: 'pending',
    title: 'مهلت پرداخت',
    description: 'فردا مهلت پرداخت شارژ آذر به پایان می‌رسد',
    priority: 'high',
  },
  {
    id: '4',
    type: 'contract',
    title: 'قرارداد نظافت',
    description: 'قرارداد شرکت نظافتی تا ۱۰ روز دیگر منقضی می‌شود',
    priority: 'medium',
  },
];

const taskIcons = {
  overdue: AlertTriangle,
  pending: Clock,
  maintenance: Wrench,
  contract: FileText,
};

const priorityColors = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-muted text-muted-foreground border-muted',
};

export function TodaysTasks() {
  const completedTasks = 2;
  const totalTasks = mockTasks.length + completedTasks;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            کارهای امروز
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {toPersianNumber(completedTasks)}/{toPersianNumber(totalTasks)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tasks list */}
        <div className="space-y-2">
          {mockTasks.map((task) => {
            const Icon = taskIcons[task.type];
            return (
              <div
                key={task.id}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer ${priorityColors[task.priority]}`}
              >
                <div className="shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    {task.count && (
                      <Badge variant="secondary" className="text-[10px]">
                        {toPersianNumber(task.count)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {task.description}
                  </p>
                </div>
                <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            );
          })}
        </div>

        <Button variant="ghost" className="w-full text-primary" asChild>
          <Link to="/manager/dashboard">
            مشاهده همه کارها
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
