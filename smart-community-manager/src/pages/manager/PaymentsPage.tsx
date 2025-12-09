import { useState, useMemo } from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RegisterPaymentModal } from '@/components/payments/RegisterPaymentModal';
import { mockPayments, mockUsers } from '@/data/mockData';
import { formatCurrency, formatPersianDate } from '@/lib/utils';

type PaymentStatus = 'all' | 'completed' | 'pending' | 'failed';

const paymentMethods = {
  online: { label: 'آنلاین', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  card_to_card: { label: 'کارت به کارت', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  cash: { label: 'نقد', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  check: { label: 'چک', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
};

const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusLabels = {
  completed: 'تکمیل شده',
  pending: 'در انتظار تأیید',
  rejected: 'رد شده',
};

export function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus>('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payments = useMemo(() => {
    return mockPayments
      .filter(payment => {
        const user = mockUsers.find(u => u.id === payment.userId);
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          user?.name.toLowerCase().includes(searchLower) ||
          user?.phone.includes(searchQuery) ||
          payment.id.includes(searchQuery);

        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;

        return matchesSearch && matchesStatus && matchesMethod;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, filterStatus, filterMethod]);

  const stats = useMemo(() => {
    const completed = mockPayments.filter(p => p.status === 'verified').reduce((sum, p) => sum + p.amount, 0);
    const pending = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const rejected = mockPayments.filter(p => p.status === 'rejected').reduce((sum, p) => sum + p.amount, 0);

    return {
      completed,
      pending,
      rejected,
      total: completed + pending + rejected,
    };
  }, []);

  const handleExport = () => {
    const headers = ['کد تراکنش', 'ساکن', 'مبلغ', 'روش پرداخت', 'وضعیت', 'تاریخ'];
    const rows = payments.map(p => {
      const user = mockUsers.find(u => u.id === p.userId);
      return [
        p.id,
        user?.name || '-',
        new Intl.NumberFormat('fa-IR').format(p.amount),
        paymentMethods[p.method as keyof typeof paymentMethods].label,
        statusLabels[p.status as keyof typeof statusLabels],
        formatPersianDate(p.createdAt),
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">پرداخت‌ها</h1>
          <p className="text-muted-foreground mt-1">مدیریت پرداخت‌های شارژ ساختمان</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          ثبت پرداخت
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کل پرداخت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total, false)}</div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">تکمیل شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.completed, false)}</div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">در انتظار تأیید</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending, false)}</div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">رد شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.rejected, false)}</div>
            <p className="text-xs text-muted-foreground mt-1">تومان</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            جستجو و فیلترها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="جستجو بر اساس نام، تلفن یا کد تراکنش..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rtl"
            />

            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as PaymentStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="completed">تکمیل شده</SelectItem>
                <SelectItem value="pending">در انتظار تأیید</SelectItem>
                <SelectItem value="rejected">رد شده</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMethod} onValueChange={(v) => setFilterMethod(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه روش‌ها</SelectItem>
                <SelectItem value="online">آنلاین</SelectItem>
                <SelectItem value="card_to_card">کارت به کارت</SelectItem>
                <SelectItem value="cash">نقد</SelectItem>
                <SelectItem value="check">چک</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              دانلود
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right">کد تراکنش</TableHead>
              <TableHead className="text-right">ساکن</TableHead>
              <TableHead className="text-right">مبلغ</TableHead>
              <TableHead className="text-right">روش پرداخت</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => {
              const user = mockUsers.find(u => u.id === payment.userId);
              return (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(payment.amount, false)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={paymentMethods[payment.method as keyof typeof paymentMethods].color}>
                      {paymentMethods[payment.method as keyof typeof paymentMethods].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={statusColors[payment.status as keyof typeof statusColors]}>
                      {statusLabels[payment.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatPersianDate(payment.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <RegisterPaymentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
