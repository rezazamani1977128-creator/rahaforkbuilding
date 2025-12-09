import { useMemo } from 'react';
import { AlertTriangle, Clock, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockDebtData, mockStats, mockUnits } from '@/data/mockData';
import { formatCurrency, formatPersianDate, toPersianNumber } from '@/lib/utils';

interface DebtReportProps {
  startDate: Date;
  endDate: Date;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#7C3AED'];

export function DebtReport({ startDate, endDate }: DebtReportProps) {
  const reportData = useMemo(() => {
    const debtors = mockDebtData.filter(d => d.balance > 0);

    const totalDebt = debtors.reduce((sum, d) => sum + d.balance, 0);
    const avgDebt = debtors.length > 0 ? totalDebt / debtors.length : 0;

    // Aging analysis
    const today = new Date();
    const aging = {
      current: debtors.filter(d => {
        const days = Math.floor(
          (today.getTime() - new Date(d.oldestUnpaidDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return days <= 30;
      }).reduce((sum, d) => sum + d.balance, 0),
      thirtyToSixty: debtors.filter(d => {
        const days = Math.floor(
          (today.getTime() - new Date(d.oldestUnpaidDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return days > 30 && days <= 60;
      }).reduce((sum, d) => sum + d.balance, 0),
      sixtyToNinety: debtors.filter(d => {
        const days = Math.floor(
          (today.getTime() - new Date(d.oldestUnpaidDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return days > 60 && days <= 90;
      }).reduce((sum, d) => sum + d.balance, 0),
      overNinety: debtors.filter(d => {
        const days = Math.floor(
          (today.getTime() - new Date(d.oldestUnpaidDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return days > 90;
      }).reduce((sum, d) => sum + d.balance, 0),
    };

    const debtorsList = debtors
      .map(d => {
        const days = Math.floor(
          (today.getTime() - new Date(d.oldestUnpaidDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return { ...d, daysOverdue: days };
      })
      .sort((a, b) => b.balance - a.balance);

    // Top debtors
    const topDebtors = debtorsList.slice(0, 10);

    // Debt trend (mock data based on history)
    const debtTrend = [
      { month: 'مهر', debt: 3200000 },
      { month: 'آبان', debt: 3100000 },
      { month: 'آذر', debt: 3050000 },
      { month: 'دی', debt: 3300000 },
      { month: 'بهمن', debt: 3150000 },
      { month: 'اسفند', debt: 2900000 },
      { month: 'فروردین', debt: 2800000 },
      { month: 'اردیبهشت', debt: 2750000 },
      { month: 'خرداد', debt: totalDebt },
    ];

    return {
      totalDebt,
      debtorCount: debtors.length,
      avgDebt,
      aging,
      debtorsList,
      topDebtors,
      debtTrend,
    };
  }, [startDate, endDate]);

  const agingData = [
    { name: '0-30 روز', value: reportData.aging.current, count: reportData.debtorsList.filter(d => d.daysOverdue <= 30).length },
    { name: '30-60 روز', value: reportData.aging.thirtyToSixty, count: reportData.debtorsList.filter(d => d.daysOverdue > 30 && d.daysOverdue <= 60).length },
    { name: '60-90 روز', value: reportData.aging.sixtyToNinety, count: reportData.debtorsList.filter(d => d.daysOverdue > 60 && d.daysOverdue <= 90).length },
    { name: '+90 روز', value: reportData.aging.overNinety, count: reportData.debtorsList.filter(d => d.daysOverdue > 90).length },
  ].filter(a => a.value > 0);

  const getAgingBadgeColor = (days: number) => {
    if (days <= 30) return 'bg-green-100 text-green-800';
    if (days <= 60) return 'bg-yellow-100 text-yellow-800';
    if (days <= 90) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getAgingLabel = (days: number) => {
    if (days <= 30) return 'جاری';
    if (days <= 60) return '30-60 روز';
    if (days <= 90) return '60-90 روز';
    return '+90 روز';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              کل بدهی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(reportData.totalDebt, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">تعداد بدهکاران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toPersianNumber(reportData.debtorCount)}</div>
            <p className="text-xs text-muted-foreground mt-1">واحد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین بدهی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.avgDebt, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              بیشترین تاخیر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {toPersianNumber(Math.max(0, ...reportData.debtorsList.map(d => d.daysOverdue)))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">روز</p>
          </CardContent>
        </Card>
      </div>

      {/* Aging Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>تفکیک بدهی بر اساس سن</CardTitle>
          </CardHeader>
          <CardContent>
            {agingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={agingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value as number, false)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {agingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debt Trend */}
        <Card>
          <CardHeader>
            <CardTitle>روند بدهی</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.debtTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
                <Line
                  type="monotone"
                  dataKey="debt"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Aging Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">جاری</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(reportData.aging.current, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(reportData.debtorsList.filter(d => d.daysOverdue <= 30).length)} واحد
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">30-60 روز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(reportData.aging.thirtyToSixty, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(reportData.debtorsList.filter(d => d.daysOverdue > 30 && d.daysOverdue <= 60).length)} واحد
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">60-90 روز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(reportData.aging.sixtyToNinety, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(reportData.debtorsList.filter(d => d.daysOverdue > 60 && d.daysOverdue <= 90).length)} واحد
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">بیشتر از 90 روز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(reportData.aging.overNinety, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(reportData.debtorsList.filter(d => d.daysOverdue > 90).length)} واحد
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Debtors */}
      <Card>
        <CardHeader>
          <CardTitle>بدهکاران برتر</CardTitle>
          <CardDescription>۱۰ بدهی بزرگ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">رتبه</TableHead>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">واحد</TableHead>
                  <TableHead className="text-right">بدهی</TableHead>
                  <TableHead className="text-right">تاخیر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.topDebtors.map((debtor, index) => (
                  <TableRow key={debtor.id}>
                    <TableCell className="text-right font-semibold">
                      {toPersianNumber(index + 1)}
                    </TableCell>
                    <TableCell className="text-right">{debtor.name}</TableCell>
                    <TableCell className="text-right">{debtor.unitNumber}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-red-600">
                      {formatCurrency(debtor.balance, false)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAgingBadgeColor(debtor.daysOverdue)}`}>
                        {getAgingLabel(debtor.daysOverdue)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">اقدامات جمعی</CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            اطلاع‌رسانی و یادآوری خودکار
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="outline">
            ارسال یادآوری به بدهکاران (30-60 روز)
          </Button>
          <Button className="w-full" variant="outline">
            ارسال هشدار به بدهکاران (60+ روز)
          </Button>
          <Button className="w-full" variant="destructive">
            ارسال اخطار نهایی
          </Button>
        </CardContent>
      </Card>

      {/* All Debtors */}
      <Card>
        <CardHeader>
          <CardTitle>تمام بدهکاران</CardTitle>
          <CardDescription>لیست کامل و مرتب شده</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">واحد</TableHead>
                  <TableHead className="text-right">بدهی</TableHead>
                  <TableHead className="text-right">تاخیر</TableHead>
                  <TableHead className="text-right">آخرین پرداخت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.debtorsList.map((debtor) => (
                  <TableRow key={debtor.id}>
                    <TableCell className="text-right">{debtor.name}</TableCell>
                    <TableCell className="text-right font-mono">{debtor.unitNumber}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-red-600">
                      {formatCurrency(debtor.balance, false)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAgingBadgeColor(debtor.daysOverdue)}`}>
                        {getAgingLabel(debtor.daysOverdue)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatPersianDate(new Date(debtor.lastPaymentDate))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
