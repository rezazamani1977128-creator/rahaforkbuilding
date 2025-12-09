import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockPayments, mockUnits, mockStats } from '@/data/mockData';
import { formatCurrency, formatPersianDate, toPersianNumber } from '@/lib/utils';

interface IncomeReportProps {
  startDate: Date;
  endDate: Date;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function IncomeReport({ startDate, endDate }: IncomeReportProps) {
  const reportData = useMemo(() => {
    const filtered = mockPayments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate >= startDate && paymentDate <= endDate && p.status === 'verified';
    });

    const total = filtered.reduce((sum, p) => sum + p.amount, 0);
    
    // By payment method
    const byMethod = {
      online: filtered.filter(p => p.method === 'online').reduce((sum, p) => sum + p.amount, 0),
      card_to_card: filtered.filter(p => p.method === 'card_to_card').reduce((sum, p) => sum + p.amount, 0),
      cash: filtered.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),
      check: filtered.filter(p => p.method === 'check').reduce((sum, p) => sum + p.amount, 0),
    };

    // Monthly trend
    const monthlyData: Record<string, number> = {};
    mockStats.monthlyIncome.forEach(m => {
      monthlyData[m.month] = m.income;
    });

    // Top paying units
    const unitPayments: Record<string, { amount: number; name: string }> = {};
    filtered.forEach(p => {
      if (!unitPayments[p.unitId]) {
        const unit = mockUnits.find(u => u.id === p.unitId);
        unitPayments[p.unitId] = { amount: 0, name: unit?.number || 'نامشخص' };
      }
      unitPayments[p.unitId].amount += p.amount;
    });

    const topUnits = Object.entries(unitPayments)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    const collectionRate = filtered.length > 0 ? 85 : 0;

    return {
      total,
      byMethod,
      monthlyData: Object.entries(monthlyData).map(([month, income]) => ({ month, income })),
      topUnits,
      collectionRate,
      count: filtered.length,
    };
  }, [startDate, endDate]);

  const methodData = [
    { name: 'آنلاین', value: reportData.byMethod.online },
    { name: 'کارت به کارت', value: reportData.byMethod.card_to_card },
    { name: 'نقد', value: reportData.byMethod.cash },
    { name: 'چک', value: reportData.byMethod.check },
  ].filter(m => m.value > 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              کل درآمد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.total, false)}</div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">تعداد پرداخت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toPersianNumber(reportData.count)}</div>
            <p className="text-xs text-muted-foreground mt-1">مورد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین پرداخت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.count > 0 ? formatCurrency(reportData.total / reportData.count, false) : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">نرخ جمع‌آوری</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{toPersianNumber(reportData.collectionRate)}%</div>
            <p className="text-xs text-muted-foreground mt-1">واحدها</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method Breakdown Pie */}
        <Card>
          <CardHeader>
            <CardTitle>درآمد بر اساس روش</CardTitle>
          </CardHeader>
          <CardContent>
            {methodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value, false)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {methodData.map((entry, index) => (
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

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>روند درآمد ماهانه</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Paying Units */}
      <Card>
        <CardHeader>
          <CardTitle>بیشترین پرداخت‌کنندگان</CardTitle>
          <CardDescription>۱۰ واحد برتر</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">رتبه</TableHead>
                  <TableHead className="text-right">واحد</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                  <TableHead className="text-right">درصد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.topUnits.map((unit, index) => (
                  <TableRow key={unit.id}>
                    <TableCell className="text-right font-semibold">
                      {toPersianNumber(index + 1)}
                    </TableCell>
                    <TableCell className="text-right">{unit.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(unit.amount, false)}
                    </TableCell>
                    <TableCell className="text-right">
                      {toPersianNumber(((unit.amount / reportData.total) * 100).toFixed(1))}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Method Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">آنلاین</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(reportData.byMethod.online, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(((reportData.byMethod.online / reportData.total) * 100 || 0).toFixed(1))}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کارت به کارت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(reportData.byMethod.card_to_card, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(((reportData.byMethod.card_to_card / reportData.total) * 100 || 0).toFixed(1))}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">نقد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-yellow-600">
              {formatCurrency(reportData.byMethod.cash, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(((reportData.byMethod.cash / reportData.total) * 100 || 0).toFixed(1))}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">چک</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(reportData.byMethod.check, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(((reportData.byMethod.check / reportData.total) * 100 || 0).toFixed(1))}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
