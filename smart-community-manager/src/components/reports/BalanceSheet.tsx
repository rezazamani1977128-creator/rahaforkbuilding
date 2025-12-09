import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockPayments, mockExpenses, mockFundStats, mockStats } from '@/data/mockData';
import { formatCurrency, formatPersianDate, toPersianNumber } from '@/lib/utils';

interface BalanceSheetProps {
  startDate: Date;
  endDate: Date;
}

export function BalanceSheet({ startDate, endDate }: BalanceSheetProps) {
  const reportData = useMemo(() => {
    const incomeFiltered = mockPayments.filter(p => {
      const date = new Date(p.createdAt);
      return date >= startDate && date <= endDate && p.status === 'verified';
    });

    const expenseFiltered = mockExpenses.filter(e => {
      const expenseDate = new Date(e.createdAt);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const totalIncome = incomeFiltered.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = expenseFiltered.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const fundBalance = mockFundStats.currentBalance;

    // Monthly comparison
    const monthlyComparison: Record<string, { income: number; expense: number }> = {};
    mockStats.monthlyIncome.forEach(m => {
      if (!monthlyComparison[m.month]) {
        monthlyComparison[m.month] = { income: 0, expense: 0 };
      }
      monthlyComparison[m.month].income = m.income;
    });

    // Calculate monthly expenses from filtered data
    expenseFiltered.forEach(e => {
      const expenseDate = new Date(e.createdAt);
      const month = expenseDate.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit' });
      if (!monthlyComparison[month]) {
        monthlyComparison[month] = { income: 0, expense: 0 };
      }
      monthlyComparison[month].expense += e.amount;
    });

    const comparisonData = Object.entries(monthlyComparison)
      .map(([month, data]) => ({ month, ...data }))
      .slice(0, 9);

    // Profit/Loss Trend
    const profitTrend = comparisonData.map(d => ({
      month: d.month,
      profit: d.income - d.expense,
    }));

    // Cash flow statement
    const cashFlow = [
      {
        item: 'درآمد از شارژ',
        amount: totalIncome,
        type: 'income',
      },
      {
        item: 'هزینه‌های عملیاتی',
        amount: totalExpenses,
        type: 'expense',
      },
      {
        item: 'خالص (سود/زیان)',
        amount: netBalance,
        type: netBalance >= 0 ? 'income' : 'expense',
      },
      {
        item: 'صندوق ساختمان',
        amount: fundBalance,
        type: 'fund',
      },
    ];

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      fundBalance,
      totalAssets: netBalance + fundBalance,
      profitMargin: totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0,
      expenseRatio: totalIncome > 0 ? ((totalExpenses / totalIncome) * 100) : 0,
      comparisonData,
      profitTrend,
      cashFlow,
    };
  }, [startDate, endDate]);

  const isProfitable = reportData.netBalance >= 0;

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
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(reportData.totalIncome, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              کل هزینه‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(reportData.totalExpenses, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              موازنه نقد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(reportData.netBalance, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isProfitable ? 'سود' : 'زیان'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              صندوق ساختمان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(reportData.fundBalance, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>
      </div>

      {/* Income vs Expense Chart */}
      <Card>
        <CardHeader>
          <CardTitle>مقایسه درآمد و هزینه</CardTitle>
          <CardDescription>روند ماهانه</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
              <Legend />
              <Bar dataKey="income" fill="#10B981" name="درآمد" />
              <Bar dataKey="expense" fill="#EF4444" name="هزینه" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Profit/Loss Trend */}
      <Card>
        <CardHeader>
          <CardTitle>روند سود و زیان</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.profitTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={reportData.netBalance >= 0 ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={{ fill: reportData.netBalance >= 0 ? '#10B981' : '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cash Flow Statement */}
      <Card>
        <CardHeader>
          <CardTitle>صورت جریان نقد</CardTitle>
          <CardDescription>خلاصه مالی</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">مورد</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.cashFlow.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-right font-medium">{item.item}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-mono font-semibold ${
                          item.type === 'income'
                            ? 'text-green-600'
                            : item.type === 'expense'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {item.type === 'expense' && item.amount > 0 ? '-' : '+'}
                        {formatCurrency(Math.abs(item.amount), false)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حاشیه سود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${reportData.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {toPersianNumber(reportData.profitMargin.toFixed(1))}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">از درآمد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">نسبت هزینه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {toPersianNumber(reportData.expenseRatio.toFixed(1))}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">از درآمد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کل داراییْها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(reportData.totalAssets, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
