import { useState } from 'react';
import { Building, Plus, Grid3x3, List, Users, Home, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddUnitModal } from '@/components/units/AddUnitModal';
import { EditUnitModal } from '@/components/units/EditUnitModal';
import { UnitDetailsModal } from '@/components/units/UnitDetailsModal';

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

const mockUnits: Unit[] = [
  {
    id: '1',
    number: '101',
    floor: 1,
    area: 120,
    status: 'occupied',
    resident: { name: 'علی رضایی', type: 'owner' },
    parking: 'P1',
    storage: 'S1',
  },
  {
    id: '2',
    number: '102',
    floor: 1,
    area: 120,
    status: 'occupied',
    resident: { name: 'سارا احمدی', type: 'tenant' },
    parking: 'P2',
  },
  {
    id: '3',
    number: '201',
    floor: 2,
    area: 115,
    status: 'occupied',
    resident: { name: 'محمد حسینی', type: 'owner' },
    parking: 'P3',
    storage: 'S2',
  },
  {
    id: '4',
    number: '202',
    floor: 2,
    area: 115,
    status: 'vacant',
  },
  {
    id: '5',
    number: '301',
    floor: 3,
    area: 110,
    status: 'occupied',
    resident: { name: 'زهرا کریمی', type: 'owner' },
    parking: 'P5',
  },
  {
    id: '6',
    number: '302',
    floor: 3,
    area: 110,
    status: 'occupied',
    resident: { name: 'رضا نوری', type: 'tenant' },
    parking: 'P6',
    storage: 'S3',
  },
];

export function UnitsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'floor'>('floor');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [detailsUnit, setDetailsUnit] = useState<Unit | null>(null);

  const filteredUnits = mockUnits.filter((unit) => {
    const matchesFloor = filterFloor === 'all' || unit.floor.toString() === filterFloor;
    const matchesStatus = filterStatus === 'all' || unit.status === filterStatus;
    const matchesSearch =
      unit.number.includes(searchQuery) ||
      unit.resident?.name.includes(searchQuery);

    return matchesFloor && matchesStatus && matchesSearch;
  });

  const totalUnits = mockUnits.length;
  const occupiedUnits = mockUnits.filter((u) => u.status === 'occupied').length;
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);

  const floors = Array.from(new Set(mockUnits.map((u) => u.floor))).sort((a, b) => b - a);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت واحدها</h1>
          <p className="text-muted-foreground mt-1">
            اطلاعات واحدها و ساکنین
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          افزودن واحد
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Building className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">کل واحدها</p>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Home className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">واحد اشغال</p>
              <p className="text-2xl font-bold">{occupiedUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Home className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">واحد خالی</p>
              <p className="text-2xl font-bold">{vacantUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">نرخ اشغال</p>
              <p className="text-2xl font-bold">{occupancyRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو در واحدها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        <Select value={filterFloor} onValueChange={setFilterFloor}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="طبقه" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه طبقات</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor.toString()}>
                طبقه {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="occupied">اشغال</SelectItem>
            <SelectItem value="vacant">خالی</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'floor' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('floor')}
          >
            <Building className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Units Display */}
      {viewMode === 'floor' ? (
        <div className="space-y-6">
          {floors.map((floor) => {
            const floorUnits = filteredUnits.filter((u) => u.floor === floor);
            if (floorUnits.length === 0) return null;

            return (
              <div key={floor}>
                <h2 className="text-lg font-semibold mb-3">طبقه {floor}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {floorUnits.map((unit) => (
                    <UnitCard 
                      key={unit.id} 
                      unit={unit}
                      onEdit={setEditingUnit}
                      onDetails={setDetailsUnit}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <UnitCard 
              key={unit.id} 
              unit={unit}
              onEdit={setEditingUnit}
              onDetails={setDetailsUnit}
            />
          ))}
        </div>
      )}

      {filteredUnits.length === 0 && (
        <Card className="p-12 text-center">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">واحدی یافت نشد</h3>
          <p className="text-muted-foreground">
            با فیلترهای انتخابی واحدی وجود ندارد
          </p>
        </Card>
      )}

      <AddUnitModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <EditUnitModal 
        open={editingUnit !== null} 
        onOpenChange={(open) => !open && setEditingUnit(null)}
        unit={editingUnit}
      />
      <UnitDetailsModal
        open={detailsUnit !== null}
        onOpenChange={(open) => !open && setDetailsUnit(null)}
        unit={detailsUnit}
      />
    </div>
  );
}

function UnitCard({ 
  unit, 
  onEdit, 
  onDetails 
}: { 
  unit: Unit;
  onEdit: (unit: Unit) => void;
  onDetails: (unit: Unit) => void;
}) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" dir="rtl">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">واحد {unit.number}</h3>
            <p className="text-sm text-muted-foreground">
              {unit.area} متر مربع
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

        {unit.resident ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{unit.resident.name}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {unit.resident.type === 'owner' ? 'مالک' : 'مستاجر'}
            </Badge>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-2">
            بدون ساکن
          </div>
        )}

        <div className="pt-2 border-t space-y-1 text-sm">
          {unit.parking && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">پارکینگ:</span>
              <span className="font-medium">{unit.parking}</span>
            </div>
          )}
          {unit.storage && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">انباری:</span>
              <span className="font-medium">{unit.storage}</span>
            </div>
          )}
          {!unit.parking && !unit.storage && (
            <span className="text-muted-foreground text-xs">
              بدون امکانات جانبی
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(unit)}
          >
            ویرایش
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onDetails(unit)}
          >
            جزئیات
          </Button>
        </div>
      </div>
    </Card>
  );
}
