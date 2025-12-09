import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toPersianNumber } from '@/lib/persian';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface CollectionProgressProps {
  collectionRate: number;
  totalUnits: number;
  paidUnits: number;
  pendingUnits: number;
  overdueUnits: number;
}

export function CollectionProgress({
  collectionRate,
  totalUnits,
  paidUnits,
  pendingUnits,
  overdueUnits,
}: CollectionProgressProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">وضعیت وصول شارژ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">درصد وصول</span>
            <span className="font-bold text-primary">{toPersianNumber(collectionRate)}٪</span>
          </div>
          <Progress value={collectionRate} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-success/10 p-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-lg font-bold text-success">{toPersianNumber(paidUnits)}</span>
            <span className="text-xs text-muted-foreground">پرداخت شده</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-warning/10 p-3">
            <Clock className="h-5 w-5 text-warning" />
            <span className="text-lg font-bold text-warning">{toPersianNumber(pendingUnits)}</span>
            <span className="text-xs text-muted-foreground">در انتظار</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-destructive/10 p-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-lg font-bold text-destructive">{toPersianNumber(overdueUnits)}</span>
            <span className="text-xs text-muted-foreground">معوق</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
