import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Filter, Download, MoreHorizontal } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { EditExpenseModal } from '@/components/expenses/EditExpenseModal';
  import { expenseCategories, type Expense } from '@/data/mockData';
  import {
    useExpenses,
    useDeleteExpense,
    useDownloadExpenseReceipt,
  } from '@/hooks/useExpenses';
import { formatCurrency, formatPersianDate } from '@/lib/utils';

export function ExpensesPage() {
  const { toast } = useToast();
    const { data: expenses = [], isFetching } = useExpenses();
    const deleteExpense = useDeleteExpense();
    const downloadReceipt = useDownloadExpenseReceipt();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const handleEdit = (expenseId: string) => {
    const exp = expenses.find(e => e.id === expenseId);
    if (exp) {
      setSelectedExpense(exp);
      setIsEditOpen(true);
    }
  };

  const handleDelete = (expenseId: string) => {
      deleteExpense.mutate(expenseId, {
        onSuccess: () =>
          toast({
            title: 'حذف شد',
            description: 'هزینه با موفقیت حذف شد.',
            variant: 'destructive',
          }),
        onError: (err: any) =>
          toast({
            title: 'خطا در حذف',
            description: err?.message || 'مشکلی رخ داد.',
            variant: 'destructive',
          }),
      });
  };

  const handleDownload = (expenseId: string) => {
      downloadReceipt.mutate(expenseId, {
        onError: (err: any) =>
          toast({
            title: 'خطا در دانلود',
            description: err?.message || 'مشکلی رخ داد.',
            variant: 'destructive',
          }),
      });
  };

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          expense.title.toLowerCase().includes(searchLower) ||
          expense.vendor?.toLowerCase().includes(searchLower);

        const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, filterCategory, expenses]);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenseCategories.map(cat => ({
      name: cat.name,
      amount: expenses
        .filter(e => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0),
      color: cat.color,
    }));

    return { total, byCategory };
  }, [expenses]);

  const handleExport = () => {
    const headers = ['عنوان', 'دسته‌بندی', 'مبلغ', 'تاریخ', 'فروشنده'];
    const rows = filteredExpenses.map(e => [
      e.title,
      expenseCategories.find(c => c.id === e.category)?.name || '-',
      new Intl.NumberFormat('fa-IR').format(e.amount),
      formatPersianDate(e.createdAt),
      e.vendor || '-',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">هزینه‌ها</h1>
          <p className="text-muted-foreground mt-1">مدیریت و پیگیری هزینه‌های ساختمان</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          افزودن هزینه
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کل هزینه‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.total, false)}</div>
            <p className="text-xs text-muted-foreground mt-1">{filteredExpenses.length} مورد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">توزیع دسته‌بندی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.byCategory.slice(0, 3).map((cat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm">{cat.name}</span>
                  <span className="font-mono text-sm">{formatCurrency(cat.amount, false)}</span>
                </div>
              ))}
            </div>
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
              placeholder="جستجو بر اساس عنوان یا فروشنده..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rtl"
            />

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌ها</SelectItem>
                {expenseCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
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

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                کارت
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                جدول
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={() => handleEdit(expense.id)}
              onDelete={() => handleDelete(expense.id)}
              onDownload={() => handleDownload(expense.id)}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-right">عنوان</th>
                <th className="px-4 py-3 text-right">دسته</th>
                <th className="px-4 py-3 text-right">مبلغ</th>
                <th className="px-4 py-3 text-right">فروشنده</th>
                <th className="px-4 py-3 text-right">تاریخ</th>
                <th className="px-4 py-3 text-center">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => {
                const category = expenseCategories.find(c => c.id === expense.category);
                return (
                  <tr key={expense.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-right">
                      <p className="font-medium">{expense.title}</p>
                      {expense.description && (
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        style={{ backgroundColor: category?.color || '#ccc' }}
                        className="text-white"
                      >
                        {category?.name}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(expense.amount, false)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {expense.vendor || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {formatPersianDate(expense.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleEdit(expense.id)}>ویرایش</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(expense.id)}>دانلود رسید</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(expense.id)}>حذف</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AddExpenseModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <EditExpenseModal open={isEditOpen} onOpenChange={setIsEditOpen} expense={selectedExpense} />
    </div>
  );
}
