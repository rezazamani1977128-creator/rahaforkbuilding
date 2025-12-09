import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice, getRelativeTime } from '@/lib/persian';
import { mockPayments, mockUsers, mockUnits } from '@/data/mockData';
import { ArrowLeft, CreditCard, Banknote, Smartphone } from 'lucide-react';

const paymentMethodIcons = {
  online: Smartphone,
  card_to_card: CreditCard,
  cash: Banknote,
  check: CreditCard,
};

const paymentMethodLabels = {
  online: 'آنلاین',
  card_to_card: 'کارت به کارت',
  cash: 'نقدی',
  check: 'چک',
};

const statusLabels = {
  pending: 'در انتظار',
  verified: 'تأیید شده',
  rejected: 'رد شده',
};

const statusVariants = {
  pending: 'pending' as const,
  verified: 'paid' as const,
  rejected: 'overdue' as const,
};

export function RecentPayments() {
  const recentPayments = mockPayments.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">آخرین پرداخت‌ها</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
          <Link to="/manager/payments">
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentPayments.map((payment) => {
          const user = mockUsers.find((u) => u.id === payment.userId);
          const unit = mockUnits.find((u) => u.id === payment.unitId);
          const MethodIcon = paymentMethodIcons[payment.method];

          return (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user?.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>واحد {unit?.number}</span>
                    <span>•</span>
                    <MethodIcon className="h-3 w-3" />
                    <span>{paymentMethodLabels[payment.method]}</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{formatPrice(payment.amount)}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[payment.status]} className="text-[10px]">
                    {statusLabels[payment.status]}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {getRelativeTime(payment.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
