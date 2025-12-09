import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { expenseCategories } from '@/data/mockData';
import { toPersianNumber, formatPriceShort } from '@/lib/persian';
import {
  Trash2,
  GripVertical,
  Sparkles,
  Zap,
  Wrench,
  Shield,
  Package,
  FileCheck,
  PiggyBank,
  MoreHorizontal,
} from 'lucide-react';

interface ChargeItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  divisionMethod: 'equal' | 'area' | 'coefficient' | 'residents' | 'custom';
}

interface ExpenseItemCardProps {
  item: ChargeItem;
  index: number;
  totalAmount: number;
  canDelete: boolean;
  onUpdate: (id: string, field: keyof ChargeItem, value: any) => void;
  onRemove: (id: string) => void;
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  cleaning: Sparkles,
  utilities: Zap,
  maintenance: Wrench,
  security: Shield,
  supplies: Package,
  insurance: FileCheck,
  reserve: PiggyBank,
  other: MoreHorizontal,
};

const categoryColors: { [key: string]: string } = {
  cleaning: 'bg-primary/10 text-primary border-primary/20',
  utilities: 'bg-warning/10 text-warning border-warning/20',
  maintenance: 'bg-secondary/10 text-secondary border-secondary/20',
  security: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  supplies: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  insurance: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  reserve: 'bg-success/10 text-success border-success/20',
  other: 'bg-muted text-muted-foreground border-border',
};

const divisionMethods = [
  { value: 'equal', label: 'مساوی', badge: '=' },
  { value: 'area', label: 'بر اساس متراژ', badge: '㎡' },
  { value: 'coefficient', label: 'بر اساس ضریب', badge: 'ض' },
  { value: 'residents', label: 'بر اساس تعداد نفرات', badge: '👥' },
  { value: 'custom', label: 'سفارشی', badge: '✎' },
];

export function ExpenseItemCard({
  item,
  index,
  totalAmount,
  canDelete,
  onUpdate,
  onRemove,
}: ExpenseItemCardProps) {
  const CategoryIcon = categoryIcons[item.category] || MoreHorizontal;
  const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
  const divMethod = divisionMethods.find(m => m.value === item.divisionMethod);
  const catColor = categoryColors[item.category] || categoryColors.other;

  return (
    <Card 
      className={`p-4 transition-all duration-300 hover:shadow-md border-r-4 ${catColor.split(' ')[2]}`}
      style={{ animation: `fade-in-up 0.3s ease-out ${index * 100}ms forwards` }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${catColor.split(' ').slice(0, 2).join(' ')}`}>
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium">
              قلم {toPersianNumber(index + 1)}
            </span>
            {item.amount > 0 && (
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5">
                  {toPersianNumber(percentage)}٪
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  {divMethod?.badge}
                </Badge>
              </div>
            )}
          </div>
          {item.amount > 0 && (
            <div className="text-left">
              <p className="text-lg font-bold text-primary">
                {formatPriceShort(item.amount)}
              </p>
            </div>
          )}
          {canDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs" dir="rtl">عنوان هزینه</Label>
            <Input
              placeholder="مثلاً: قبض برق مشاعات"
              value={item.title}
              onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
              className="h-9 text-right"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs" dir="rtl">مبلغ (تومان)</Label>
            <Input
              type="number"
              placeholder="۰"
              value={item.amount || ''}
              onChange={(e) => onUpdate(item.id, 'amount', parseInt(e.target.value) || 0)}
              dir="ltr"
              className="h-9 text-right"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs" dir="rtl">دسته‌بندی</Label>
            <Select
              value={item.category}
              onValueChange={(v) => onUpdate(item.id, 'category', v)}
            >
              <SelectTrigger className="h-9 text-right" dir="rtl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {expenseCategories.map((cat) => {
                  const Icon = categoryIcons[cat.id] || MoreHorizontal;
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        {cat.name}
                        <Icon className="h-4 w-4" />
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs" dir="rtl">نحوه تقسیم</Label>
            <Select
              value={item.divisionMethod}
              onValueChange={(v: any) => onUpdate(item.id, 'divisionMethod', v)}
            >
              <SelectTrigger className="h-9 text-right" dir="rtl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {divisionMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex items-center gap-2">
                      {method.label}
                      <span className="font-mono text-xs">{method.badge}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
