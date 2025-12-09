import { 
  Droplets, 
  Zap, 
  Wind, 
  Shield, 
  Sparkles, 
  Home,
  Wrench,
  MoreHorizontal 
} from 'lucide-react';
import { toPersianNumber } from '@/lib/persian';
import { Progress } from '@/components/ui/progress';

interface ChargeItem {
  title: string;
  amount: number;
  category: string;
}

interface ChargeBreakdownProps {
  items: ChargeItem[];
  total: number;
}

const categoryIcons: Record<string, { icon: typeof Home; color: string; label: string }> = {
  monthly: { icon: Home, color: 'text-primary', label: 'شارژ پایه' },
  elevator: { icon: Wind, color: 'text-blue-500', label: 'آسانسور' },
  cleaning: { icon: Sparkles, color: 'text-green-500', label: 'نظافت' },
  utilities: { icon: Zap, color: 'text-orange-500', label: 'قبوض' },
  security: { icon: Shield, color: 'text-purple-500', label: 'نگهبانی' },
  plumbing: { icon: Droplets, color: 'text-cyan-500', label: 'تاسیسات' },
  maintenance: { icon: Wrench, color: 'text-yellow-500', label: 'تعمیرات' },
  other: { icon: MoreHorizontal, color: 'text-gray-500', label: 'سایر' },
};

export function ChargeBreakdown({ items, total }: ChargeBreakdownProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const percentage = (item.amount / total) * 100;
        const categoryInfo = categoryIcons[item.category] || categoryIcons.other;
        const Icon = categoryInfo.icon;

        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center ${categoryInfo.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryInfo.label} • {toPersianNumber(percentage.toFixed(1))}٪
                  </p>
                </div>
              </div>
              <p className="font-semibold">
                {toPersianNumber(item.amount.toLocaleString())} تومان
              </p>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}

      <div className="pt-4 border-t flex items-center justify-between">
        <p className="font-bold">مجموع</p>
        <p className="text-xl font-bold">
          {toPersianNumber(total.toLocaleString())} تومان
        </p>
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">نحوه تقسیم هزینه‌ها</h4>
        <p className="text-xs text-muted-foreground">
          هزینه‌های این ماه بر اساس متراژ واحد و تعداد ساکنین محاسبه شده است.
          برای اطلاعات بیشتر با مدیریت ساختمان تماس بگیرید.
        </p>
      </div>
    </div>
  );
}
