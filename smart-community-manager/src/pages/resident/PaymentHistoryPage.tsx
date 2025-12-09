import { useState } from 'react';
import { Download, Filter, Receipt, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';

interface Payment {
  id: string;
  date: Date;
  month: string;
  year: number;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
}

export function PaymentHistoryPage() {
  const [selectedYear, setSelectedYear] = useState('1403');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock payment history
  const payments: Payment[] = [
    {
      id: 'pay-1',
      date: new Date(2023, 11, 3),
      month: 'آذر',
      year: 1403,
      amount: 2500000,
      method: 'zarinpal',
      status: 'completed',
      transactionId: 'TXN123456789',
    },
    {
      id: 'pay-2',
      date: new Date(2023, 10, 3),
      month: 'آبان',
      year: 1403,
      amount: 2400000,
      method: 'mellat',
      status: 'completed',
      transactionId: 'TXN123456788',
    },
    {
      id: 'pay-3',
      date: new Date(2023, 9, 4),
      month: 'مهر',
      year: 1403,
      amount: 2300000,
      method: 'zarinpal',
      status: 'completed',
      transactionId: 'TXN123456787',
    },
    {
      id: 'pay-4',
      date: new Date(2023, 8, 2),
      month: 'شهریور',
      year: 1403,
      amount: 2200000,
      method: 'saman',
      status: 'completed',
      transactionId: 'TXN123456786',
    },
    {
      id: 'pay-5',
      date: new Date(2023, 7, 4),
      month: 'مرداد',
      year: 1403,
      amount: 2100000,
      method: 'mellat',
      status: 'completed',
      transactionId: 'TXN123456785',
    },
  ];

  const filteredPayments = payments.filter(p => {
    const yearMatch = p.year.toString() === selectedYear;
    const statusMatch = selectedStatus === 'all' || p.status === selectedStatus;
    return yearMatch && statusMatch;
  });

  const totalPaidThisYear = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const numberOfPayments = filteredPayments.filter(p => p.status === 'completed').length;
  const averagePayment = numberOfPayments > 0 ? totalPaidThisYear / numberOfPayments : 0;
  const onTimeRate = (numberOfPayments / 12) * 100; // Simplified calculation

  const methodNames: Record<string, string> = {
    zarinpal: 'زرین‌پال',
    idpay: 'آی‌دی‌پی',
    mellat: 'بانک ملت',
    saman: 'بانک سامان',
    'card-transfer': 'کارت به کارت',
  };

  const methodIcons: Record<string, string> = {
    zarinpal: '💳',
    idpay: '🔷',
    mellat: '🏦',
    saman: '🏧',
    'card-transfer': '💵',
  };

  const statusColors: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-500',
    pending: 'bg-orange-500/10 text-orange-500',
    failed: 'bg-destructive/10 text-destructive',
  };

  const statusLabels: Record<string, string> = {
    completed: 'موفق',
    pending: 'در انتظار',
    failed: 'ناموفق',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">تاریخچه پرداخت</h1>
          <p className="text-muted-foreground mt-1">
            سوابق پرداخت‌های شما
          </p>
        </div>
        <Button variant="outline">
          <Download className="ml-2 h-4 w-4" />
          دانلود PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              مجموع پرداختی امسال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {toPersianNumber(totalPaidThisYear.toLocaleString())}
            </p>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              تعداد پرداخت‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {toPersianNumber(numberOfPayments)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">پرداخت</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              میانگین پرداخت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {toPersianNumber(Math.round(averagePayment).toLocaleString())}
            </p>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              نرخ پرداخت به موقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {toPersianNumber(Math.round(onTimeRate))}٪
            </p>
            <p className="text-xs text-muted-foreground mt-1">از پرداخت‌ها</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>لیست پرداخت‌ها</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1403">{toPersianNumber('1403')}</SelectItem>
                  <SelectItem value="1402">{toPersianNumber('1402')}</SelectItem>
                  <SelectItem value="1401">{toPersianNumber('1401')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="completed">موفق</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="failed">ناموفق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {methodIcons[payment.method] || '💳'}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        شارژ {payment.month} {toPersianNumber(payment.year)}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {formatPersianDate(payment.date)}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          {methodNames[payment.method]}
                        </p>
                      </div>
                      {payment.transactionId && (
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          {payment.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="font-semibold">
                        {toPersianNumber(payment.amount.toLocaleString())}
                      </p>
                      <p className="text-xs text-muted-foreground">تومان</p>
                    </div>
                    <Badge className={statusColors[payment.status]}>
                      {statusLabels[payment.status]}
                    </Badge>
                    {payment.status === 'completed' && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>پرداختی برای نمایش وجود ندارد</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
