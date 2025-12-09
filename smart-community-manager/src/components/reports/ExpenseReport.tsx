import { useMemo } from 'react';
import { TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockExpenses, expenseCategories } from '@/data/mockData';
import { formatCurrency, formatPersianDate, toPersianNumber } from '@/lib/utils';

interface ExpenseReportProps {
  startDate: Date;
  endDate: Date;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function ExpenseReport({ startDate, endDate }: ExpenseReportProps) {
  const reportData = useMemo(() => {
    const filtered = mockExpenses.filter(e => {
      const expenseDate = new Date(e.createdAt);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const total = filtered.reduce((sum, e) => sum + e.amount, 0);

    // By category
    const byCategory: Record<string, number> = {};
    expenseCategories.forEach(cat => {
      byCategory[cat.id] = filtered
        .filter(e => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
    });

    // Category breakdown with count
    const categoryBreakdown = expenseCategories
      .map(cat => ({
        id: cat.id,
        label: cat.name,
        amount: byCategory[cat.id],
        icon: cat.icon,
        count: filtered.filter(e => e.category === cat.id).length,
      }))
      .filter(c => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // Top vendors/descriptions
    const vendors: Record<string, number> = {};
    filtered.forEach(e => {
      if (!vendors[e.vendor]) vendors[e.vendor] = 0;
      vendors[e.vendor] += e.amount;
    });

    const topVendors = Object.entries(vendors)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    // Largest expenses
    const largestExpenses = filtered
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Monthly trend
    const monthlyExpenses: Record<string, number> = {};
    filtered.forEach(e => {
      const expenseDate = new Date(e.createdAt);
      const month = expenseDate.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit' });
      if (!monthlyExpenses[month]) monthlyExpenses[month] = 0;
      monthlyExpenses[month] += e.amount;
    });

    return {
      total,
      count: filtered.length,
      avgExpense: filtered.length > 0 ? total / filtered.length : 0,
      byCategory,
      categoryBreakdown,
      topVendors,
      largestExpenses,
      monthlyTrend: Object.entries(monthlyExpenses).map(([month, expense]) => ({
        month,
        expense,
      })),
    };
  }, [startDate, endDate]);

  const pieData = reportData.categoryBreakdown
    .filter(c => c.amount > 0)
    .map(c => ({
      name: c.label,
      value: c.amount,
    }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              کل هزینه‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.total, false)}</div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">تعداد هزینه‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toPersianNumber(reportData.count)}</div>
            <p className="text-xs text-muted-foreground mt-1">مورد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین هزینه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.avgExpense, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">تعداد دسته‌بندی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toPersianNumber(reportData.categoryBreakdown.length)}</div>
            <p className="text-xs text-muted-foreground mt-1">دسته</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع هزینه‌ها بر اساس دسته</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value as number, false)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
            <CardTitle>روند هزینه‌های ماهانه</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>تفصیل هزینه‌ها به‌ حسب دسته</CardTitle>
          <CardDescription>فهرست کامل دسته‌بندی‌ها</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.categoryBreakdown.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="font-medium">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {toPersianNumber(cat.count)} مورد
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold font-mono">{formatCurrency(cat.amount, false)}</p>
                  <p className="text-xs text-muted-foreground">
                    {toPersianNumber(((cat.amount / reportData.total) * 100).toFixed(1))}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Vendors */}
      <Card>
        <CardHeader>
          <CardTitle>بیشترین تامین‌کنندگان</CardTitle>
          <CardDescription>۸ تامین‌کننده برتر</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">رتبه</TableHead>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                  <TableHead className="text-right">درصد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.topVendors.map((vendor, index) => (
                  <TableRow key={vendor.name}>
                    <TableCell className="text-right font-semibold">
                      {toPersianNumber(index + 1)}
                    </TableCell>
                    <TableCell className="text-right">{vendor.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(vendor.amount, false)}
                    </TableCell>
                    <TableCell className="text-right">
                      {toPersianNumber(((vendor.amount / reportData.total) * 100).toFixed(1))}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Largest Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>بزرگ‌ترین هزینه‌ها</CardTitle>
          <CardDescription>۱۰ بزرگ‌ترین مورد</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">تامین‌کننده</TableHead>
                  <TableHead className="text-right">دسته</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.largestExpenses.map((expense, index) => {
                  const category = expenseCategories.find(c => c.id === expense.category);
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-right text-sm">
                        {formatPersianDate(new Date(expense.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">{expense.title}</TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center gap-1 justify-end">
                          <span>{category?.name}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-red-600">
                        {formatCurrency(expense.amount, false)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
