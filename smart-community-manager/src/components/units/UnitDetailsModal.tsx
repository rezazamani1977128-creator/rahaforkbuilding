import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Home, Building2 } from 'lucide-react';

interface Unit {
  id: string;
  number: string;
  floor: number;
  area: number;
  status: 'occupied' | 'vacant';
  resident?: {
    name: string;
    type: 'owner' | 'tenant';
  };
  parking?: string;
  storage?: string;
}

interface UnitDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: Unit | null;
}

export function UnitDetailsModal({ open, onOpenChange, unit }: UnitDetailsModalProps) {
  if (!unit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>جزئیات واحد {unit.number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6" dir="rtl">
          {/* Unit Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold mb-1">وضعیت واحد</h3>
              <p className="text-sm text-muted-foreground">
                {unit.status === 'occupied' ? 'این واحد اشغال شده است' : 'این واحد خالی است'}
              </p>
            </div>
            <Badge
              variant={unit.status === 'occupied' ? 'default' : 'secondary'}
              className={
                unit.status === 'occupied'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-orange-500/10 text-orange-500'
              }
            >
              {unit.status === 'occupied' ? 'اشغال' : 'خالی'}
            </Badge>
          </div>

          {/* Unit Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">شماره واحد</p>
              <p className="text-lg font-semibold">واحد {unit.number}</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">طبقه</p>
              <p className="text-lg font-semibold">{unit.floor}</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">متراژ</p>
              <p className="text-lg font-semibold">{unit.area} متر</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">ضریب</p>
              <p className="text-lg font-semibold">۱</p>
            </div>
          </div>

          {/* Resident Information */}
          {unit.resident ? (
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold">اطلاعات ساکن</h4>
              </div>
              <div className="space-y-2 mr-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نام:</span>
                  <span className="font-medium">{unit.resident.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نوع:</span>
                  <Badge variant="outline" className="text-xs">
                    {unit.resident.type === 'owner' ? 'مالک' : 'مستاجر'}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-orange-500/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-orange-500" />
                <p className="text-sm">این واحد فاقد ساکن است</p>
              </div>
            </div>
          )}

          {/* Amenities */}
          {(unit.parking || unit.storage) && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4" />
                <h4 className="font-semibold">امکانات جانبی</h4>
              </div>
              <div className="space-y-2 mr-6">
                {unit.parking && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">پارکینگ:</span>
                    <span className="font-medium">{unit.parking}</span>
                  </div>
                )}
                {unit.storage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">انباری:</span>
                    <span className="font-medium">{unit.storage}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              بستن
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
