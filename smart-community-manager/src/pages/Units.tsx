import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  MoreVertical,
  Phone,
  User,
  Home,
  Car,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddUnitModal } from '@/components/units/AddUnitModal';
import { mockUnits, mockUsers } from '@/data/mockData';
import { toPersianNumber, formatPrice } from '@/lib/persian';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'paid' | 'pending' | 'overdue';

const statusLabels = {
  paid: 'پرداخت شده',
  pending: 'در انتظار',
  overdue: 'معوق',
};

const statusVariants = {
  paid: 'paid' as const,
  pending: 'pending' as const,
  overdue: 'overdue' as const,
};

export default function Units() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('Units page rendering, isModalOpen:', isModalOpen);

  const filteredUnits = mockUnits.filter((unit) => {
    const owner = mockUsers.find((u) => u.id === unit.ownerId);
    const matchesSearch =
      unit.number.includes(searchQuery) ||
      owner?.name.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت واحدها</h1>
          <p className="text-muted-foreground">
            {toPersianNumber(mockUnits.length)} واحد در این ساختمان
          </p>
        </div>
        <Button 
          onClick={() => {
            console.log('Add Unit button clicked!');
            setIsModalOpen(true);
            console.log('setIsModalOpen(true) called');
          }} 
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن واحد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="جستجوی واحد یا ساکن..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="paid">پرداخت شده</SelectItem>
              <SelectItem value="pending">در انتظار</SelectItem>
              <SelectItem value="overdue">معوق</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Units Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUnits.map((unit) => {
            const owner = mockUsers.find((u) => u.id === unit.ownerId);
            const tenant = unit.tenantId
              ? mockUsers.find((u) => u.id === unit.tenantId)
              : null;
            const resident = tenant || owner;

            return (
              <Card key={unit.id} variant="elevated" className="group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">واحد {unit.number}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          طبقه {toPersianNumber(unit.floor)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>مشاهده جزئیات</DropdownMenuItem>
                        <DropdownMenuItem>ویرایش</DropdownMenuItem>
                        <DropdownMenuItem>تاریخچه پرداخت</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Resident Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {resident?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{resident?.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span dir="ltr">{resident?.phone}</span>
                      </div>
                    </div>
                    {tenant && (
                      <Badge variant="secondary" className="text-[10px]">
                        مستأجر
                      </Badge>
                    )}
                  </div>

                  {/* Unit Details */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <Home className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">متراژ</p>
                      <p className="font-medium text-sm">{toPersianNumber(unit.area)} م</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <Car className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">پارکینگ</p>
                      <p className="font-medium text-sm">{toPersianNumber(unit.parkingSpots)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">نفرات</p>
                      <p className="font-medium text-sm">{toPersianNumber(unit.residentsCount)}</p>
                    </div>
                  </div>

                  {/* Status & Balance */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <Badge variant={statusVariants[unit.status]}>
                      {statusLabels[unit.status]}
                    </Badge>
                    <div className="text-left">
                      {unit.balance < 0 ? (
                        <p className="text-sm font-bold text-destructive">
                          {formatPrice(Math.abs(unit.balance))} بدهکار
                        </p>
                      ) : unit.balance > 0 ? (
                        <p className="text-sm font-bold text-success">
                          {formatPrice(unit.balance)} بستانکار
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-muted-foreground">
                          تسویه
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-right font-medium text-muted-foreground">واحد</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">ساکن</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">متراژ</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">وضعیت</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">مانده</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => {
                  const owner = mockUsers.find((u) => u.id === unit.ownerId);
                  const tenant = unit.tenantId
                    ? mockUsers.find((u) => u.id === unit.tenantId)
                    : null;
                  const resident = tenant || owner;

                  return (
                    <tr key={unit.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">واحد {unit.number}</p>
                            <p className="text-xs text-muted-foreground">
                              طبقه {toPersianNumber(unit.floor)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {resident?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{resident?.name}</p>
                            <p className="text-xs text-muted-foreground" dir="ltr">
                              {resident?.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{toPersianNumber(unit.area)} متر</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusVariants[unit.status]}>
                          {statusLabels[unit.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {unit.balance < 0 ? (
                          <span className="text-sm font-medium text-destructive">
                            {formatPrice(Math.abs(unit.balance))} بدهکار
                          </span>
                        ) : unit.balance > 0 ? (
                          <span className="text-sm font-medium text-success">
                            {formatPrice(unit.balance)} بستانکار
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">تسویه</span>
                        )}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>مشاهده جزئیات</DropdownMenuItem>
                            <DropdownMenuItem>ویرایش</DropdownMenuItem>
                            <DropdownMenuItem>تاریخچه پرداخت</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredUnits.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">واحدی یافت نشد</h3>
          <p className="mt-2 text-muted-foreground">
            با تغییر فیلترها دوباره جستجو کنید
          </p>
        </Card>
      )}
      
      <AddUnitModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
