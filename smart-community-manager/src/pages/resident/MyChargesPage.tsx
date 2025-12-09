import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ChevronDown, CreditCard, Receipt as ReceiptIcon } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChargeBreakdown } from '@/components/resident/ChargeBreakdown';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';

interface ChargeItem {
  title: string;
  amount: number;
  category: string;
}

interface Charge {
  id: string;
  month: string;
  year: number;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: Date;
  items: ChargeItem[];
}

export function MyChargesPage() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('1403');

  // Mock data - in production, fetch from API
  const currentCharge: Charge = {
    id: 'charge-1',
    month: 'آذر',
    year: 1403,
    amount: 2500000,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'pending',
    items: [
      { title: 'شارژ ماهانه پایه', amount: 1500000, category: 'monthly' },
      { title: 'نگهداری و تعمیرات آسانسور', amount: 300000, category: 'elevator' },
      { title: 'نظافت و سرایداری', amount: 400000, category: 'cleaning' },
      { title: 'برق و آب مشاعات', amount: 200000, category: 'utilities' },
      { title: 'نگهبانی', amount: 100000, category: 'security' },
    ],
  };

  const previousCharges: Charge[] = [
    {
      id: 'charge-2',
      month: 'آبان',
      year: 1403,
      amount: 2400000,
      dueDate: new Date(2023, 10, 5),
      status: 'paid',
      paymentDate: new Date(2023, 10, 3),
      items: [],
    },
    {
      id: 'charge-3',
      month: 'مهر',
      year: 1403,
      amount: 2300000,
      dueDate: new Date(2023, 9, 5),
      status: 'paid',
      paymentDate: new Date(2023, 9, 4),
      items: [],
    },
    {
      id: 'charge-4',
      month: 'شهریور',
      year: 1403,
      amount: 2200000,
      dueDate: new Date(2023, 8, 5),
      status: 'paid',
      paymentDate: new Date(2023, 8, 2),
      items: [],
    },
    {
      id: 'charge-5',
      month: 'مرداد',
      year: 1403,
      amount: 2100000,
      dueDate: new Date(2023, 7, 5),
      status: 'paid',
      paymentDate: new Date(2023, 7, 4),
      items: [],
    },
  ];

  const getStatusColor = (status: Charge['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-primary/10 text-primary';
      case 'overdue':
        return 'bg-destructive/10 text-destructive';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: Charge['status']) => {
    switch (status) {
      case 'paid':
        return 'پرداخت شده';
      case 'pending':
        return 'در انتظار پرداخت';
      case 'overdue':
        return 'معوق';
      default:
        return '';
    }
  };

  const totalPaidThisYear = previousCharges
    .filter(c => c.status === 'paid' && c.year.toString() === selectedYear)
    .reduce((sum, c) => sum + c.amount, 0);

  const outstandingBalance = currentCharge.status === 'pending' ? currentCharge.amount : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">شارژ من</h1>
        <p className="text-muted-foreground mt-1">
          مشاهده و پرداخت شارژ ماهانه
        </p>
      </div>

      {/* Current Month Charge - LARGE CARD */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                شارژ {currentCharge.month} {toPersianNumber(currentCharge.year)}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                سررسید: {formatPersianDate(currentCharge.dueDate)}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(currentCharge.status)}>
              {getStatusLabel(currentCharge.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {toPersianNumber(currentCharge.amount.toLocaleString())}
            </span>
            <span className="text-xl text-muted-foreground">تومان</span>
          </div>

          {currentCharge.status === 'pending' && (
            <Button size="lg" className="w-full" onClick={() => navigate('/resident/pay')}>
              <CreditCard className="ml-2 h-5 w-5" />
              پرداخت آنلاین
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Charge Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>جزئیات شارژ</CardTitle>
          <CardDescription>
            شکست هزینه‌های این ماه
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChargeBreakdown items={currentCharge.items} total={currentCharge.amount} />
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مجموع پرداختی امسال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {toPersianNumber(totalPaidThisYear.toLocaleString())} تومان
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              بدهی فعلی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {toPersianNumber(outstandingBalance.toLocaleString())} تومان
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Previous Months */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>تاریخچه شارژ</CardTitle>
              <CardDescription>ماه‌های قبل</CardDescription>
            </div>
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
              <Button variant="outline" size="sm">
                <Download className="ml-2 h-4 w-4" />
                دانلود
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {previousCharges.map((charge) => (
              <div
                key={charge.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ReceiptIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {charge.month} {toPersianNumber(charge.year)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {charge.status === 'paid' && charge.paymentDate
                        ? `پرداخت شده در ${formatPersianDate(charge.paymentDate)}`
                        : `سررسید: ${formatPersianDate(charge.dueDate)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="font-semibold">
                      {toPersianNumber(charge.amount.toLocaleString())}
                    </p>
                    <Badge className={getStatusColor(charge.status)}>
                      {getStatusLabel(charge.status)}
                    </Badge>
                  </div>
                  {charge.status === 'paid' && (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Annual Statement */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">گزارش سالانه</h3>
              <p className="text-sm text-muted-foreground mt-1">
                دانلود صورتحساب کامل سال {toPersianNumber(selectedYear)}
              </p>
            </div>
            <Button variant="outline">
              <Download className="ml-2 h-4 w-4" />
              دانلود PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
