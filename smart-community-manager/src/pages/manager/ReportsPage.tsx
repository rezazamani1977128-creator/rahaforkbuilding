import { useState } from 'react';
import { Download, FileText, Share2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IncomeReport } from '@/components/reports/IncomeReport';
import { ExpenseReport } from '@/components/reports/ExpenseReport';
import { BalanceSheet } from '@/components/reports/BalanceSheet';
import { DebtReport } from '@/components/reports/DebtReport';
import { UnitReport } from '@/components/reports/UnitReport';
import { formatPersianDate } from '@/lib/utils';

type DateRange = 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear' | 'custom';

function getDateRange(range: DateRange): { startDate: Date; endDate: Date } {
  const today = new Date();
  const endDate = today;
  let startDate: Date;

  switch (range) {
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate.setMonth(today.getMonth());
      endDate.setDate(0);
      break;
    case 'last3Months':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 3);
      break;
    case 'last6Months':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 6);
      break;
    case 'thisYear':
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    case 'custom':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      break;
    default:
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
  }

  return { startDate, endDate };
}

export function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('thisMonth');
  const [activeTab, setActiveTab] = useState('income');

  const dates = getDateRange(dateRange);

  const handleExportPDF = () => {
    alert('PDF export will be implemented with backend');
  };

  const handleExportExcel = () => {
    alert('Excel export will be implemented with backend');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `گزارش مالی - ${formatPersianDate(new Date())}`;
    if (navigator.share) {
      navigator.share({
        title: 'گزارش مالی ساختمان',
        text: text,
      });
    } else {
      alert('بخش‌دهی برای دستگاه شما فعال نیست');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">گزارشات مالی</h1>
          <p className="text-muted-foreground mt-1">تحلیل جامع وضعیت مالی ساختمان</p>
        </div>
      </div>

      {/* Controls Card */}
      <Card>
        <CardHeader>
          <CardTitle>فیلترها و اقدامات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Date Range Selector */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2">بازه زمانی</label>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisMonth">این ماه</SelectItem>
                  <SelectItem value="lastMonth">ماه گذشته</SelectItem>
                  <SelectItem value="last3Months">۳ ماه گذشته</SelectItem>
                  <SelectItem value="last6Months">۶ ماه گذشته</SelectItem>
                  <SelectItem value="thisYear">این سال</SelectItem>
                  <SelectItem value="custom">سفارشی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium mb-1">اقدامات</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportPDF}
                  className="gap-2"
                  title="صادرات به PDF"
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportExcel}
                  className="gap-2"
                  title="صادرات به Excel"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>

            {/* More Actions */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium mb-1">بیشتر</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  className="gap-2"
                  title="چاپ"
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleShare}
                  className="gap-2"
                  title="اشتراک‌گذاری"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Date Range Display */}
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="text-muted-foreground">
              از {formatPersianDate(dates.startDate)} تا {formatPersianDate(dates.endDate)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
            <TabsTrigger value="income" className="rounded-none">گزارش درآمد</TabsTrigger>
            <TabsTrigger value="expense" className="rounded-none">گزارش هزینه</TabsTrigger>
            <TabsTrigger value="balance" className="rounded-none">تراز مالی</TabsTrigger>
            <TabsTrigger value="debt" className="rounded-none">گزارش بدهی</TabsTrigger>
            <TabsTrigger value="unit" className="rounded-none">گزارش واحدها</TabsTrigger>
          </TabsList>

          {/* Income Report */}
          <TabsContent value="income" className="mt-0">
            <CardContent className="pt-6">
              <IncomeReport startDate={dates.startDate} endDate={dates.endDate} />
            </CardContent>
          </TabsContent>

          {/* Expense Report */}
          <TabsContent value="expense" className="mt-0">
            <CardContent className="pt-6">
              <ExpenseReport startDate={dates.startDate} endDate={dates.endDate} />
            </CardContent>
          </TabsContent>

          {/* Balance Sheet */}
          <TabsContent value="balance" className="mt-0">
            <CardContent className="pt-6">
              <BalanceSheet startDate={dates.startDate} endDate={dates.endDate} />
            </CardContent>
          </TabsContent>

          {/* Debt Report */}
          <TabsContent value="debt" className="mt-0">
            <CardContent className="pt-6">
              <DebtReport startDate={dates.startDate} endDate={dates.endDate} />
            </CardContent>
          </TabsContent>

          {/* Unit Report */}
          <TabsContent value="unit" className="mt-0">
            <CardContent className="pt-6">
              <UnitReport startDate={dates.startDate} endDate={dates.endDate} />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
