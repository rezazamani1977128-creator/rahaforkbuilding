import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toPersianNumber } from '@/lib/persian';
import { Building2, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OccupancyWidgetProps {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
}

export function OccupancyWidget({
  totalUnits = 24,
  occupiedUnits = 21,
  vacantUnits = 3,
}: Partial<OccupancyWidgetProps>) {
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);

  // Create grid of units
  const units = Array.from({ length: totalUnits }, (_, i) => ({
    id: i + 1,
    occupied: i < occupiedUnits,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-5 w-5 text-primary" />
          وضعیت اشغال واحدها
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Grid */}
        <div className="grid grid-cols-6 gap-1.5">
          {units.map((unit) => (
            <div
              key={unit.id}
              className={cn(
                'aspect-square rounded-md transition-all duration-300 flex items-center justify-center text-[10px] font-medium',
                unit.occupied
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {toPersianNumber(unit.id)}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-primary/10 p-2">
            <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-primary">
              {toPersianNumber(occupiedUnits)}
            </p>
            <p className="text-[10px] text-muted-foreground">پر</p>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <Home className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">
              {toPersianNumber(vacantUnits)}
            </p>
            <p className="text-[10px] text-muted-foreground">خالی</p>
          </div>
          <div className="rounded-lg bg-success/10 p-2">
            <Building2 className="h-4 w-4 mx-auto mb-1 text-success" />
            <p className="text-lg font-bold text-success">
              {toPersianNumber(occupancyRate)}٪
            </p>
            <p className="text-[10px] text-muted-foreground">اشغال</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-primary/20" />
            <span>پر شده</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-muted" />
            <span>خالی</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
