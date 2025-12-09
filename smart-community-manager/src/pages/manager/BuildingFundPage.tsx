import { useState, useMemo } from 'react';
import { Plus, TrendingUp, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AddContributionModal } from '@/components/fund/AddContributionModal';
import { WithdrawFundModal } from '@/components/fund/WithdrawFundModal';
import { mockFundTransactions, mockFundStats } from '@/data/mockData';
import { formatCurrency, formatPersianDate, toPersianNumber } from '@/lib/utils';

export function BuildingFundPage() {
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'contribution' | 'withdrawal'>('all');

  const filteredTransactions = useMemo(() => {
    return mockFundTransactions
      .filter(tx => filterType === 'all' || tx.type === filterType)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filterType]);

  const goalProgress = (mockFundStats.currentBalance / mockFundStats.goalAmount) * 100;
  const daysToGoal = Math.ceil(
    (mockFundStats.goalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const handleExport = () => {
    const headers = ['تاریخ', 'نوع', 'مبلغ', 'توضیح', 'ثبت کننده'];
    const rows = filteredTransactions.map(tx => [
      formatPersianDate(tx.date),
      tx.type === 'contribution' ? 'واریز' : 'برداشت',
      new Intl.NumberFormat('fa-IR').format(tx.amount),
      tx.description,
      tx.recordedBy,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fund-transactions.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">صندوق ساختمان</h1>
          <p className="text-muted-foreground mt-1">مدیریت صندوق و دارایی‌های ساختمان</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsContributionOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            واریز
          </Button>
          <Button onClick={() => setIsWithdrawOpen(true)} variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            برداشت
          </Button>
        </div>
      </div>

      {/* Large Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">موجودی فعلی</p>
            <div className="text-5xl font-bold mb-2">
              {formatCurrency(mockFundStats.currentBalance, false)}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              رشد {toPersianNumber(mockFundStats.growthPercent)}% نسبت به سال قبل
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">واریز این ماه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(mockFundStats.monthlyContributions, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">برداشت این ماه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(mockFundStats.monthlyWithdrawals, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">صافی این ماه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockFundStats.monthlyContributions - mockFundStats.monthlyWithdrawals, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">تراکنش‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toPersianNumber(filteredTransactions.length)}</div>
            <p className="text-xs text-muted-foreground mt-1">مورد</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Section */}
      <Card>
        <CardHeader>
          <CardTitle>هدف صندوق</CardTitle>
          <CardDescription>موجودی مورد نظر: {formatCurrency(mockFundStats.goalAmount, false)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">پیشرفت</span>
              <span className="text-sm text-muted-foreground">{toPersianNumber(Math.round(goalProgress))}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">موجودی کنونی</p>
              <p className="text-lg font-semibold">{formatCurrency(mockFundStats.currentBalance, false)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">مانده تا هدف</p>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(mockFundStats.goalAmount - mockFundStats.currentBalance, false)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاریخ هدف</p>
              <p className="text-lg font-semibold">{formatPersianDate(mockFundStats.goalDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">روزهای باقی</p>
              <p className="text-lg font-semibold">{toPersianNumber(Math.max(0, daysToGoal))} روز</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fund Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>رشد موجودی (۱۲ ماه گذشته)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockFundStats.lastYearData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>تاریخچه تراکنش‌ها</CardTitle>
            <CardDescription>تمام واریزها و برداشت‌های صندوق</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            دانلود
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filter */}
          <div className="mb-4 flex gap-2">
            <Button
              size="sm"
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              همه
            </Button>
            <Button
              size="sm"
              variant={filterType === 'contribution' ? 'default' : 'outline'}
              onClick={() => setFilterType('contribution')}
            >
              واریز
            </Button>
            <Button
              size="sm"
              variant={filterType === 'withdrawal' ? 'default' : 'outline'}
              onClick={() => setFilterType('withdrawal')}
            >
              برداشت
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">نوع</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                  <TableHead className="text-right">توضیح</TableHead>
                  <TableHead className="text-right">ثبت کننده</TableHead>
                  {filterType === 'contribution' && <TableHead className="text-right">واحد</TableHead>}
                  {filterType === 'withdrawal' && <TableHead className="text-right">مقصد</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-right text-sm">
                      {formatPersianDate(tx.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={tx.type === 'contribution' ? 'default' : 'destructive'}>
                        {tx.type === 'contribution' ? 'واریز' : 'برداشت'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={tx.type === 'contribution' ? 'text-green-600' : 'text-red-600'}>
                        {tx.type === 'contribution' ? '+' : '-'}
                        {formatCurrency(tx.amount, false)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm">{tx.description}</TableCell>
                    <TableCell className="text-right text-sm">{tx.recordedBy}</TableCell>
                    {filterType === 'contribution' && (
                      <TableCell className="text-right text-sm">{tx.unitNumber || '—'}</TableCell>
                    )}
                    {filterType === 'withdrawal' && (
                      <TableCell className="text-right text-sm">{tx.category || '—'}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddContributionModal open={isContributionOpen} onOpenChange={setIsContributionOpen} />
      <WithdrawFundModal open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen} />
    </div>
  );
}
