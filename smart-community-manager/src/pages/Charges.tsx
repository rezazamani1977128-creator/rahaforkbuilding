import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Calendar,
  Calculator,
  Send,
  Save,
  Eye,
  Copy,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { mockCharges, mockUnits, expenseCategories } from '@/data/mockData';
import { persianMonths, toPersianNumber, formatPrice } from '@/lib/persian';
import { ExpensePieChart } from '@/components/charges/ExpensePieChart';
import { LivePreviewPanel } from '@/components/charges/LivePreviewPanel';
import { ExpenseItemCard } from '@/components/charges/ExpenseItemCard';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { ChargeDetailsDialog } from '@/components/charges/ChargeDetailsDialog';

interface ChargeItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  divisionMethod: 'equal' | 'area' | 'coefficient' | 'residents' | 'custom';
}

// Expense templates for quick add
const expenseTemplates = [
  { title: 'قبض برق مشاعات', category: 'utilities', divisionMethod: 'equal' as const },
  { title: 'قبض گاز مشاعات', category: 'utilities', divisionMethod: 'equal' as const },
  { title: 'قبض آب مشاعات', category: 'utilities', divisionMethod: 'equal' as const },
  { title: 'نظافت راهرو و لابی', category: 'cleaning', divisionMethod: 'equal' as const },
  { title: 'سرویس آسانسور', category: 'maintenance', divisionMethod: 'equal' as const },
  { title: 'بیمه ساختمان', category: 'insurance', divisionMethod: 'area' as const },
  { title: 'صندوق ذخیره', category: 'reserve', divisionMethod: 'equal' as const },
  { title: 'نگهبانی', category: 'security', divisionMethod: 'equal' as const },
];

export default function Charges() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(1402);
  const [items, setItems] = useState<ChargeItem[]>([
    { id: '1', title: '', amount: 0, category: 'cleaning', divisionMethod: 'equal' },
  ]);
  const [sendNotification, setSendNotification] = useState(true);
  const [dueDate, setDueDate] = useState('');
  const [lateFee, setLateFee] = useState(5);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const perUnitAmount = Math.ceil(totalAmount / mockUnits.length);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        title: '',
        amount: 0,
        category: 'other',
        divisionMethod: 'equal',
      },
    ]);
  };

  const addFromTemplate = (template: typeof expenseTemplates[0]) => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        title: template.title,
        amount: 0,
        category: template.category,
        divisionMethod: template.divisionMethod,
      },
    ]);
    setShowTemplates(false);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ChargeItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const copyFromPreviousMonth = () => {
    const previousCharge = mockCharges[0];
    if (previousCharge) {
      setItems(
        previousCharge.items.map((item, index) => ({
          id: `copied-${index}`,
          title: item.title,
          amount: item.amount,
          category: item.category,
          divisionMethod: item.divisionMethod,
        }))
      );
    }
  };

  const recentCharge = mockCharges[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت شارژ ماهانه</h1>
          <p className="text-muted-foreground">
            صدور و پیگیری شارژ ماهانه ساختمان
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyFromPreviousMonth} className="gap-2">
            <Copy className="h-4 w-4" />
            کپی از ماه قبل
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            ورود از اکسل
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        {/* Create Charge Form */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                صدور شارژ جدید
              </CardTitle>
              <CardDescription>
                اقلام هزینه را وارد کنید و شارژ ماهانه را صادر نمایید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Month/Year Selector */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label dir="rtl" className="block text-right">ماه</Label>
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(v) => setSelectedMonth(parseInt(v))}
                  >
                    <SelectTrigger>
                      <div className="flex items-center justify-center w-full">
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {persianMonths.map((month, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label dir="rtl" className="block text-right">سال</Label>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(v) => setSelectedYear(parseInt(v))}
                  >
                    <SelectTrigger dir="rtl" className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="1402">{toPersianNumber(1402)}</SelectItem>
                      <SelectItem value="1403">{toPersianNumber(1403)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expense Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label dir="rtl" className="block text-right">اقلام هزینه</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="gap-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      قالب‌ها
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItem}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      افزودن
                    </Button>
                  </div>
                </div>

                {/* Templates */}
                {showTemplates && (
                  <Card className="p-3 bg-muted/30 animate-scale-in">
                    <p className="text-xs text-muted-foreground mb-2" dir="rtl">انتخاب قالب آماده:</p>
                    <div className="flex flex-wrap gap-2">
                      {expenseTemplates.map((template, index) => (
                        <Button
                          key={index}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => addFromTemplate(template)}
                        >
                          {template.title}
                        </Button>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Expense Item Cards */}
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <ExpenseItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      totalAmount={totalAmount}
                      canDelete={items.length > 1}
                      onUpdate={updateItem}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label dir="rtl" className="block text-right">مهلت پرداخت</Label>
                  <JalaliDatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="انتخاب تاریخ"
                  />
                </div>
                <div className="space-y-2">
                  <Label dir="rtl" className="block text-right">جریمه تأخیر (درصد)</Label>
                  <Input
                    type="number"
                    value={lateFee}
                    onChange={(e) => setLateFee(parseInt(e.target.value) || 0)}
                    min={0}
                    max={20}
                    dir="ltr"
                    className="text-right"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4" dir="rtl">
                <div className="flex items-center gap-2">
                  <span className="text-sm">ارسال اعلان به ساکنین</span>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </div>
                <Switch
                  checked={sendNotification}
                  onCheckedChange={setSendNotification}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button className="flex-1 gap-2" variant="hero" dir="rtl">
                  صدور شارژ
                  <Receipt className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="gap-2" dir="rtl">
                  پیش‌نمایش
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="gap-2" dir="rtl">
                  ذخیره پیش‌نویس
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Summary */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <ExpensePieChart items={items} />

          {/* Calculation Summary */}
          <Card variant="primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base" dir="rtl">
                خلاصه محاسبات
                <Calculator className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">مجموع هزینه‌ها</span>
                  <span className="font-medium">
                    <AnimatedNumber value={totalAmount} formatter={formatPrice} />
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تعداد اقلام</span>
                  <span className="font-medium">{toPersianNumber(items.filter(i => i.amount > 0).length)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تعداد واحدها</span>
                  <span className="font-medium">{toPersianNumber(mockUnits.length)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">شارژ هر واحد (میانگین)</span>
                    <span className="text-xl font-bold text-primary">
                      <AnimatedNumber value={perUnitAmount} formatter={formatPrice} />
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Charge */}
          {recentCharge && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base" dir="rtl">آخرین شارژ صادر شده</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" dir="rtl">
                <div className="flex items-center justify-between">
                  <Badge variant="paid">فعال</Badge>
                  <span className="text-sm text-muted-foreground">
                    {persianMonths[recentCharge.month - 1]} {toPersianNumber(recentCharge.year)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-primary">
                      {toPersianNumber(recentCharge.collectionRate)}٪
                    </span>
                    <span>درصد وصول</span>
                  </div>
                  <Progress value={recentCharge.collectionRate} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{formatPrice(recentCharge.totalAmount)}</span>
                  <span className="text-muted-foreground">مبلغ کل</span>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  dir="rtl"
                  onClick={() => setShowDetailsDialog(true)}
                >
                  مشاهده جزئیات
                  <Eye className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Live Preview Panel */}
        <div className="hidden xl:block">
          <LivePreviewPanel items={items} totalAmount={totalAmount} />
        </div>
      </div>

      {/* Mobile Live Preview */}
      <div className="xl:hidden">
        <Tabs defaultValue="preview">
          <TabsList className="w-full" dir="rtl">
            <TabsTrigger value="stats" className="flex-1">آمار کلی</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">پیش‌نمایش واحدها</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <LivePreviewPanel items={items} totalAmount={totalAmount} />
          </TabsContent>
          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base" dir="rtl">آمار کلی شارژ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" dir="rtl">
                <div className="flex items-center justify-between rounded-lg bg-success/10 p-3">
                  <span className="font-bold text-success">
                    {formatPrice(28500000)}
                  </span>
                  <span className="text-sm">وصول شده امسال</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-warning/10 p-3">
                  <span className="font-bold text-warning">
                    {formatPrice(3150000)}
                  </span>
                  <span className="text-sm">در انتظار پرداخت</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-destructive/10 p-3">
                  <span className="font-bold text-destructive">
                    {formatPrice(2250000)}
                  </span>
                  <span className="text-sm">معوقات</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

            {/* Charge Details Dialog */}
            <ChargeDetailsDialog
              charge={recentCharge}
              open={showDetailsDialog}
              onOpenChange={setShowDetailsDialog}
            />
      </div>
    </div>
  );
}
