import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { expenseCategories } from '@/data/mockData';
import { toPersianNumber, formatPriceShort } from '@/lib/persian';

interface ChargeItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  divisionMethod: string;
}

interface ExpensePieChartProps {
  items: ChargeItem[];
}

const COLORS = [
  'hsl(158, 64%, 52%)', // primary
  'hsl(217, 91%, 60%)', // secondary
  'hsl(38, 92%, 50%)',  // accent
  'hsl(142, 71%, 45%)', // success
  'hsl(25, 95%, 53%)',  // warning
  'hsl(0, 84%, 60%)',   // destructive
  'hsl(280, 65%, 60%)', // purple
  'hsl(190, 80%, 50%)', // cyan
];

export function ExpensePieChart({ items }: ExpensePieChartProps) {
  const categoryData = items.reduce((acc, item) => {
    if (item.amount <= 0) return acc;
    const existing = acc.find(d => d.category === item.category);
    if (existing) {
      existing.value += item.amount;
    } else {
      const cat = expenseCategories.find(c => c.id === item.category);
      acc.push({
        category: item.category,
        name: cat?.name || item.category,
        value: item.amount,
      });
    }
    return acc;
  }, [] as { category: string; name: string; value: number }[]);

  const totalAmount = categoryData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalAmount) * 100).toFixed(1);
      return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatPriceShort(data.value)}
          </p>
          <p className="text-xs text-primary">
            {toPersianNumber(percentage)}٪
          </p>
        </div>
      );
    }
    return null;
  };

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base" dir="rtl">توزیع هزینه‌ها</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-muted-foreground" dir="rtl">
            برای مشاهده نمودار، اقلام هزینه را وارد کنید
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base" dir="rtl">توزیع هزینه‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {categoryData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-primary/10 p-3" dir="rtl">
            <p className="text-xs text-muted-foreground">مجموع هزینه‌ها</p>
            <p className="text-lg font-bold text-primary" dir="ltr">
              {formatPriceShort(totalAmount)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryData.map((item, index) => (
              <div key={item.category} className="flex items-center gap-1.5 text-xs" dir="rtl">
                <span className="text-muted-foreground">{item.name}</span>
                <span 
                  className="h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
