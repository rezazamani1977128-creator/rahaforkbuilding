import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockUnits, mockUsers } from '@/data/mockData';
import { toPersianNumber, formatPrice } from '@/lib/persian';
import { Building2, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';

interface ChargeItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  divisionMethod: 'equal' | 'area' | 'coefficient' | 'residents' | 'custom';
}

interface LivePreviewPanelProps {
  items: ChargeItem[];
  totalAmount: number;
}

export function LivePreviewPanel({ items, totalAmount }: LivePreviewPanelProps) {
  const unitCalculations = useMemo(() => {
    const totalArea = mockUnits.reduce((sum, u) => sum + u.area, 0);
    const totalCoeff = mockUnits.reduce((sum, u) => sum + u.coefficient, 0);
    const totalResidents = mockUnits.reduce((sum, u) => sum + u.residentsCount, 0);

    return mockUnits.map(unit => {
      let unitTotal = 0;

      items.forEach(item => {
        if (item.amount <= 0) return;
        
        switch (item.divisionMethod) {
          case 'equal':
            unitTotal += item.amount / mockUnits.length;
            break;
          case 'area':
            unitTotal += (item.amount * unit.area) / totalArea;
            break;
          case 'coefficient':
            unitTotal += (item.amount * unit.coefficient) / totalCoeff;
            break;
          case 'residents':
            unitTotal += (item.amount * unit.residentsCount) / totalResidents;
            break;
          default:
            unitTotal += item.amount / mockUnits.length;
        }
      });

      const owner = mockUsers.find(u => u.id === unit.ownerId);
      return {
        ...unit,
        calculatedAmount: Math.ceil(unitTotal),
        ownerName: owner?.name || 'نامشخص',
      };
    });
  }, [items]);

  const averageAmount = totalAmount / mockUnits.length;
  const maxAmount = Math.max(...unitCalculations.map(u => u.calculatedAmount));
  const minAmount = Math.min(...unitCalculations.map(u => u.calculatedAmount));
  const hasVariation = maxAmount !== minAmount && totalAmount > 0;

  return (
    <Card className="sticky top-20 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base" dir="rtl">
            پیش‌نمایش زنده
            <Building2 className="h-5 w-5 text-primary" />
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {toPersianNumber(mockUnits.length)} واحد
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/50 p-3 text-center transition-all duration-300" dir="rtl">
            <p className="text-xs text-muted-foreground">مجموع</p>
          <p className="text-lg font-bold text-primary">
              <AnimatedNumber value={totalAmount} formatter={(v) => formatPrice(v).replace(' تومان', '')} />
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center transition-all duration-300" dir="rtl">
            <p className="text-xs text-muted-foreground">میانگین</p>
            <p className="text-lg font-bold">
              <AnimatedNumber value={Math.ceil(averageAmount)} formatter={(v) => formatPrice(v).replace(' تومان', '')} />
            </p>
          </div>
        </div>

        {hasVariation && (
          <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-2 text-xs" dir="rtl">
            <span className="text-muted-foreground">
              بازه شارژ: از {formatPrice(minAmount)} تا {formatPrice(maxAmount)}
            </span>
            <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          </div>
        )}

        {/* Units List */}
        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-2">
            {unitCalculations.map((unit, index) => {
              const diff = unit.calculatedAmount - averageAmount;
              const isHigh = diff > averageAmount * 0.1;
              const isLow = diff < -averageAmount * 0.1;

              return (
                <div
                  key={unit.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-all duration-300 hover:bg-muted/50"
                  dir="rtl"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in-up 0.3s ease-out forwards'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium" dir="rtl">{unit.ownerName}</p>
                      <p className="text-xs text-muted-foreground" dir="rtl">
                        ضریب {toPersianNumber(unit.coefficient)} • {toPersianNumber(unit.area)} متر
                      </p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
                      {unit.number}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm transition-all duration-300 ${
                      isHigh ? 'text-destructive' : isLow ? 'text-success' : ''
                    }`}>
                      {formatPrice(unit.calculatedAmount)}
                    </p>
                    {hasVariation && (
                      <div className="flex items-center justify-start gap-1 text-xs">
                        {isHigh ? (
                          <>
                            <span className="text-destructive">بالاتر</span>
                            <TrendingUp className="h-3 w-3 text-destructive" />
                          </>
                        ) : isLow ? (
                          <>
                            <span className="text-success">پایین‌تر</span>
                            <TrendingDown className="h-3 w-3 text-success" />
                          </>
                        ) : (
                          <>
                            <span className="text-muted-foreground">معمولی</span>
                            <Minus className="h-3 w-3 text-muted-foreground" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
