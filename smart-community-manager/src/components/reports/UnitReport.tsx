import { useMemo, useState } from 'react';
import { Home, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockUnits, mockPayments } from '@/data/mockData';
import { formatCurrency, formatPersianDate, toPersianNumber } from '@/lib/utils';

interface UnitReportProps {
  startDate: Date;
  endDate: Date;
}

export function UnitReport({ startDate, endDate }: UnitReportProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(mockUnits[0]?.id || '');

  const reportData = useMemo(() => {
    const unitPayments = mockPayments.filter(p => {
      const date = new Date(p.createdAt);
      return date >= startDate && date <= endDate && p.status === 'verified';
    });

    // Calculate all units summary
    const unitSummary = mockUnits.map(unit => {
      const unitPaymentTotal = unitPayments
        .filter(p => p.unitId === unit.id)
        .reduce((sum, p) => sum + p.amount, 0);
      
      const unitPaymentCount = unitPayments.filter(p => p.unitId === unit.id).length;
      
      return {
        id: unit.id,
        unitNumber: unit.number,
        residentName: 'مالک واحد',
        totalPayment: unitPaymentTotal,
        paymentCount: unitPaymentCount,
        status: unitPaymentTotal > 0 ? 'پرداخت‌کننده' : 'عدم پرداخت',
      };
    });

    // Selected unit details
    const selectedUnit = unitSummary.find(u => u.id === selectedUnitId);
    const selectedPayments = unitPayments.filter(p => p.unitId === selectedUnitId);
    
    // Monthly trend for selected unit
    const monthlyTrend: Record<string, number> = {};
    selectedPayments.forEach(p => {
      const date = new Date(p.createdAt);
      const month = date.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit' });
      if (!monthlyTrend[month]) monthlyTrend[month] = 0;
      monthlyTrend[month] += p.amount;
    });

    const selectedUnitTrend = Object.entries(monthlyTrend).map(([month, amount]) => ({
      month,
      amount,
    }));

    // Calculation for top paying units
    const topPayingUnits = unitSummary
      .sort((a, b) => b.totalPayment - a.totalPayment)
      .slice(0, 10);

    // Collection rate
    const totalCharges = mockUnits.length * 10000000; // Mock: assume each unit has 10M charge
    const collectionRate = (unitSummary.reduce((sum, u) => sum + u.totalPayment, 0) / totalCharges) * 100;

    return {
      selectedUnit,
      selectedPayments,
      selectedUnitTrend,
      allUnits: unitSummary,
      topPayingUnits,
      collectionRate,
      totalPayments: unitSummary.reduce((sum, u) => sum + u.totalPayment, 0),
      totalUnits: unitSummary.length,
      payingUnits: unitSummary.filter(u => u.totalPayment > 0).length,
      nonPayingUnits: unitSummary.filter(u => u.totalPayment === 0).length,
    };
  }, [startDate, endDate, selectedUnitId]);

  const paymentRate = reportData.totalUnits > 0 
    ? ((reportData.payingUnits / reportData.totalUnits) * 100) 
    : 0;

  const nonPaymentRate = 100 - paymentRate;

  return (
    <div className="space-y-6">
      {/* Unit Selector */}
      <Card>
        <CardHeader>
          <CardTitle>انتخاب واحد</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
            <SelectTrigger>
              <SelectValue placeholder="واحد را انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {mockUnits.map(unit => {
                return (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.number} - مالک واحد
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Selected Unit Summary */}
      {reportData.selectedUnit && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">خلاصه واحد منتخب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">شماره واحد</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {reportData.selectedUnit.unitNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">نام مالک</p>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {reportData.selectedUnit.residentName}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">مجموع پرداخت</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(reportData.selectedUnit.totalPayment, false)}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">تعداد پرداخت</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {toPersianNumber(reportData.selectedUnit.paymentCount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کل واحدها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toPersianNumber(reportData.totalUnits)}</div>
            <p className="text-xs text-muted-foreground mt-1">واحد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              واحدهای پرداخت‌کننده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {toPersianNumber(reportData.payingUnits)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(paymentRate.toFixed(1))}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">واحدهای بدهکار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {toPersianNumber(reportData.nonPayingUnits)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianNumber(nonPaymentRate.toFixed(1))}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مجموع پرداخت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.totalPayments, false)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>
      </div>

      {/* Selected Unit Charts */}
      {reportData.selectedPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>روند پرداخت واحد منتخب</CardTitle>
            <CardDescription>{reportData.selectedUnit?.unitNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.selectedUnitTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Paying Units Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>پرداخت‌کنندگان برتر</CardTitle>
          <CardDescription>۱۰ واحد با بیشترین پرداخت</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.topPayingUnits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unitNumber" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number, false)} />
              <Bar dataKey="totalPayment" fill="#10B981" name="مجموع پرداخت" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* All Units Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>مقایسه تمام واحدها</CardTitle>
          <CardDescription>وضعیت پرداخت و نرخ جمع‌آوری</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">واحد</TableHead>
                  <TableHead className="text-right">مالک</TableHead>
                  <TableHead className="text-right">مجموع پرداخت</TableHead>
                  <TableHead className="text-right">تعداد پرداخت</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.allUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="text-right font-mono">{unit.unitNumber}</TableCell>
                    <TableCell className="text-right">{unit.residentName}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(unit.totalPayment, false)}
                    </TableCell>
                    <TableCell className="text-right">
                      {toPersianNumber(unit.paymentCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${unit.status === 'پرداخت‌کننده' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                        {unit.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Unit Payments History */}
      {reportData.selectedPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تاریخچه پرداخت</CardTitle>
            <CardDescription>{reportData.selectedUnit?.unitNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-right">تاریخ</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">روش</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.selectedPayments
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-right text-sm">
                          {formatPersianDate(new Date(payment.createdAt))}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(payment.amount, false)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {payment.method === 'online' && 'آنلاین'}
                          {payment.method === 'card_to_card' && 'کارت به کارت'}
                          {payment.method === 'cash' && 'نقد'}
                          {payment.method === 'check' && 'چک'}
                        </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          تأیید شده
                        </div>
                      </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
