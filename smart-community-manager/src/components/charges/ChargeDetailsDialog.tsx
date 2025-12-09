import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Send,
  Eye,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Charge, mockUnits, mockPayments, mockUsers, expenseCategories } from '@/data/mockData';
import { persianMonths, toPersianNumber, formatPrice } from '@/lib/persian';
import { useToast } from '@/hooks/use-toast';
import { useChargeActions } from '@/hooks/useCharges';

interface ChargeDetailsDialogProps {
  charge: Charge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChargeDetailsDialog({
  charge,
  open,
  onOpenChange,
}: ChargeDetailsDialogProps) {
  const { toast } = useToast();
  const { downloadReport, sendReminders, fetchPayments } = useChargeActions(charge?.id);
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const [showPaymentsDialog, setShowPaymentsDialog] = useState(false);

  if (!charge) return null;

  // Calculate statistics
  const unitCount = mockUnits.length;
  const perUnitAmount = Math.ceil(charge.totalAmount / unitCount);
  const payments = mockPayments.filter((p) => p.chargeId === charge.id);
  const paidCount = payments.filter((p) => p.status === 'verified').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const overdueCount = unitCount - paidCount - pendingCount;
  const collectedAmount = payments
    .filter((p) => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const cat = expenseCategories.find((c) => c.id === category);
    if (!cat) return Receipt;
    const iconMap: Record<string, any> = {
      cleaning: Receipt,
      utilities: Receipt,
      maintenance: Receipt,
      security: Receipt,
      supplies: Receipt,
      insurance: Receipt,
      reserve: Receipt,
      other: Receipt,
    };
    return iconMap[category] || Receipt;
  };

  const getCategoryColor = (category: string) => {
    const cat = expenseCategories.find((c) => c.id === category);
    return cat?.color || '#6B7280';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Receipt className="h-6 w-6 text-primary" />
            جزئیات شارژ {persianMonths[charge.month - 1]} {toPersianNumber(charge.year)}
          </DialogTitle>
          <DialogDescription dir="rtl">
            اطلاعات کامل شارژ صادر شده و وضعیت پرداخت واحدها
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 p-1">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4" dir="rtl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">مجموع شارژ</p>
                      <p className="text-lg font-bold">
                        {formatPrice(charge.totalAmount)}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4" dir="rtl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">وصول شده</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(collectedAmount)}
                      </p>
                    </div>
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4" dir="rtl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">درصد وصولی</p>
                      <p className="text-lg font-bold text-blue-600">
                        {toPersianNumber(charge.collectionRate)}٪
                      </p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4" dir="rtl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">هر واحد</p>
                      <p className="text-lg font-bold">
                        {formatPrice(perUnitAmount)}
                      </p>
                    </div>
                    <div className="rounded-full bg-purple-100 p-3">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collection Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base" dir="rtl">
                  وضعیت وصولی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" dir="rtl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {toPersianNumber(charge.collectionRate)}٪ وصول شده
                    </span>
                    <span className="text-muted-foreground">
                      {toPersianNumber(paidCount)} از {toPersianNumber(unitCount)} واحد
                    </span>
                  </div>
                  <Progress value={charge.collectionRate} className="h-3" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">پرداخت شده</p>
                      <p className="text-lg font-bold text-green-600">
                        {toPersianNumber(paidCount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">در انتظار</p>
                      <p className="text-lg font-bold text-yellow-600">
                        {toPersianNumber(pendingCount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">معوقه</p>
                      <p className="text-lg font-bold text-red-600">
                        {toPersianNumber(overdueCount)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">اقلام هزینه</TabsTrigger>
                <TabsTrigger value="units">وضعیت واحدها</TabsTrigger>
                <TabsTrigger value="info">اطلاعات شارژ</TabsTrigger>
              </TabsList>

              {/* Expense Items Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base" dir="rtl">
                      اقلام هزینه ({toPersianNumber(charge.items.length)} مورد)
                    </CardTitle>
                  </CardHeader>
                  <CardContent dir="rtl">
                    <div className="space-y-3">
                      {charge.items.map((item) => {
                        const Icon = getCategoryIcon(item.category);
                        const category = expenseCategories.find(
                          (c) => c.id === item.category
                        );

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="rounded-full p-2"
                                style={{
                                  backgroundColor: `${getCategoryColor(item.category)}20`,
                                }}
                              >
                                <Icon
                                  className="h-5 w-5"
                                  style={{ color: getCategoryColor(item.category) }}
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium">{item.title}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {category?.name || item.category}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {item.divisionMethod === 'equal' && 'تساوی'}
                                    {item.divisionMethod === 'area' && 'متراژ'}
                                    {item.divisionMethod === 'coefficient' && 'ضریب'}
                                    {item.divisionMethod === 'residents' && 'سرانه'}
                                    {item.divisionMethod === 'custom' && 'سفارشی'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="text-lg font-bold">
                                {formatPrice(item.amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {toPersianNumber(
                                  ((item.amount / charge.totalAmount) * 100).toFixed(1)
                                )}
                                ٪ از کل
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <Separator />

                      <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
                        <span className="text-lg font-bold">مجموع کل</span>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(charge.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Units Status Tab */}
              <TabsContent value="units" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base" dir="rtl">
                      وضعیت پرداخت واحدها
                    </CardTitle>
                  </CardHeader>
                  <CardContent dir="rtl">
                    <div className="space-y-2">
                      {mockUnits.map((unit) => {
                        const payment = payments.find((p) => p.unitId === unit.id);
                        const owner = mockUsers.find((u) => u.id === unit.ownerId);
                        const isPaid = payment?.status === 'verified';
                        const isPending = payment?.status === 'pending';
                        const isOverdue = !payment || payment.status === 'rejected';

                        return (
                          <div
                            key={unit.id}
                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-muted px-3 py-2 font-mono font-bold">
                                {unit.number}
                              </div>
                              <div>
                                <p className="font-medium">{owner?.name || 'نامشخص'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {toPersianNumber(unit.area)} متر • ضریب{' '}
                                  {toPersianNumber(unit.coefficient)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <p className="font-bold">
                                  {formatPrice(perUnitAmount)}
                                </p>
                                {payment && (
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(payment.createdAt).toLocaleDateString(
                                      'fa-IR'
                                    )}
                                  </p>
                                )}
                              </div>
                              {isPaid && (
                                <Badge className="bg-green-600">پرداخت شده</Badge>
                              )}
                              {isPending && (
                                <Badge className="bg-yellow-600">در انتظار</Badge>
                              )}
                              {isOverdue && (
                                <Badge variant="destructive">معوقه</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Charge Info Tab */}
              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base" dir="rtl">
                      اطلاعات شارژ
                    </CardTitle>
                  </CardHeader>
                  <CardContent dir="rtl">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">دوره شارژ</span>
                          </div>
                          <p className="text-lg font-medium">
                            {persianMonths[charge.month - 1]} {toPersianNumber(charge.year)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">مهلت پرداخت</span>
                          </div>
                          <p className="text-lg font-medium">
                            {new Date(charge.dueDate).toLocaleDateString('fa-IR')}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">تاریخ صدور</span>
                          </div>
                          <p className="text-lg font-medium">
                            {new Date(charge.createdAt).toLocaleDateString('fa-IR')}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">تعداد واحدها</span>
                          </div>
                          <p className="text-lg font-medium">
                            {toPersianNumber(unitCount)} واحد
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          توزیع شارژ بر اساس
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(
                            new Set(charge.items.map((i) => i.divisionMethod))
                          ).map((method) => (
                            <Badge key={method} variant="outline">
                              {method === 'equal' && 'تقسیم مساوی'}
                              {method === 'area' && 'بر اساس متراژ'}
                              {method === 'coefficient' && 'بر اساس ضریب'}
                              {method === 'residents' && 'بر اساس تعداد ساکنین'}
                              {method === 'custom' && 'سفارشی'}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <div className="space-y-1">
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                              نکته مهم
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              این شارژ برای {toPersianNumber(unitCount)} واحد صادر شده است.
                              هر واحد باید مبلغ {formatPrice(perUnitAmount)} را پرداخت نماید.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center gap-3" dir="rtl">
              <Button
                className="flex-1 gap-2"
                onClick={() =>
                  downloadReport.mutate(undefined, {
                    onSuccess: () =>
                      toast({
                        title: 'دانلود گزارش',
                        description: 'گزارش PDF شارژ آماده و دانلود شد.',
                      }),
                    onError: (err: any) =>
                      toast({
                        title: 'خطا در دانلود',
                        description: err?.message || 'مشکلی رخ داد.',
                        variant: 'destructive',
                      }),
                  })
                }
                disabled={downloadReport.isPending || !charge?.id}
              >
                <Download className="h-4 w-4" />
                دانلود گزارش
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() =>
                  sendReminders.mutate(undefined, {
                    onSuccess: () =>
                      toast({
                        title: 'یادآوری ارسال شد',
                        description: 'برای تمام واحدهای معوقه پیام یادآوری ارسال شد.',
                      }),
                    onError: (err: any) =>
                      toast({
                        title: 'خطا در ارسال',
                        description: err?.message || 'مشکلی رخ داد.',
                        variant: 'destructive',
                      }),
                  })
                }
                disabled={sendReminders.isPending || !charge?.id}
              >
                <Send className="h-4 w-4" />
                ارسال یادآوری
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() =>
                  fetchPayments.mutate(undefined, {
                    onSuccess: (data) => {
                      setPaymentsData(data || []);
                      setShowPaymentsDialog(true);
                      toast({
                        title: 'پرداخت‌ها دریافت شد',
                        description: `${toPersianNumber((data || []).length)} پرداخت یافت شد.`,
                      });
                    },
                    onError: (err: any) =>
                      toast({
                        title: 'خطا در دریافت پرداخت‌ها',
                        description: err?.message || 'مشکلی رخ داد.',
                        variant: 'destructive',
                      }),
                  })
                }
                disabled={fetchPayments.isPending || !charge?.id}
              >
                <Eye className="h-4 w-4" />
                مشاهده پرداخت‌ها
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Payments List Dialog */}
      <Dialog open={showPaymentsDialog} onOpenChange={setShowPaymentsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]" dir="rtl">
          <DialogHeader>
            <DialogTitle>لیست پرداخت‌ها</DialogTitle>
            <DialogDescription dir="rtl">
              {toPersianNumber(paymentsData.length)} پرداخت برای شارژ {persianMonths[charge.month - 1]} {toPersianNumber(charge.year)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="space-y-3 p-1">
              {paymentsData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  هیچ پرداختی یافت نشد
                </div>
              ) : (
                paymentsData.map((payment: any) => {
                  const unit = mockUnits.find((u) => u.id === payment.unitId);
                  const user = mockUsers.find((u) => u.id === payment.userId);
                  return (
                    <Card key={payment.id}>
                      <CardContent className="p-4" dir="rtl">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{unit?.number || '—'}</span>
                              <span className="text-muted-foreground">•</span>
                              <span>{user?.name || 'نامشخص'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{formatPrice(payment.amount)}</span>
                              <span>•</span>
                              <span>
                                {payment.method === 'online' && 'آنلاین'}
                                {payment.method === 'card_to_card' && 'کارت به کارت'}
                                {payment.method === 'cash' && 'نقدی'}
                                {payment.method === 'check' && 'چک'}
                              </span>
                              <span>•</span>
                              <span>{new Date(payment.createdAt).toLocaleDateString('fa-IR')}</span>
                            </div>
                          </div>
                          <Badge
                            className={
                              payment.status === 'verified'
                                ? 'bg-green-600'
                                : payment.status === 'pending'
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }
                          >
                            {payment.status === 'verified' && 'تأیید شده'}
                            {payment.status === 'pending' && 'در انتظار'}
                            {payment.status === 'rejected' && 'رد شده'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
