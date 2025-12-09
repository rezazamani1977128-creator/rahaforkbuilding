import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2, Download } from 'lucide-react';
import type { User } from '@/data/mockData';

interface ResidentWithUnit extends User {
  unit?: any;
}

interface ResidentTableProps {
  residents: ResidentWithUnit[];
  selectedResidents: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectResident: (residentId: string) => void;
  onEditResident: (resident: User) => void;
  onExport: () => void;
  onViewProfile?: (resident: User) => void;
  onDownloadAssets?: (resident: User) => void;
  onDeleteResident?: (resident: User) => void;
}

const statusColors = {
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusLabels = {
  paid: 'پرداخت شده',
  pending: 'در انتظار',
  overdue: 'معوقه',
};

const roleLabels = {
  owner: 'مالک',
  tenant: 'مستاجر',
};

export function ResidentTable({
  residents,
  selectedResidents,
  onSelectAll,
  onSelectResident,
  onEditResident,
  onExport,
  onViewProfile,
  onDownloadAssets,
  onDeleteResident,
}: ResidentTableProps) {
  const isAllSelected =
    residents.length > 0 && selectedResidents.length === residents.length;
  const isSomeSelected = selectedResidents.length > 0 && !isAllSelected;
  const selectAllState = isSomeSelected ? 'indeterminate' : isAllSelected;

  if (residents.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">ساکنی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectAllState}
                onCheckedChange={(checked) => onSelectAll(checked === true)}
              />
            </TableHead>
            <TableHead className="text-right">نام</TableHead>
            <TableHead className="text-right">تلفن</TableHead>
            <TableHead className="text-right">واحد</TableHead>
            <TableHead className="text-right">نقش</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
            <TableHead className="text-right">باقی‌مانده</TableHead>
            <TableHead className="w-12 text-center">اقدام</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => {
            const isSelected = selectedResidents.includes(resident.id);
            const status = resident.unit?.status || 'paid';
            const balance = resident.unit?.balance || 0;

            return (
              <TableRow
                key={resident.id}
                className={isSelected ? 'bg-blue-50 dark:bg-blue-950' : ''}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelectResident(resident.id)}
                  />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center gap-3 rtl">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {resident.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{resident.name}</p>
                      {resident.email && (
                        <p className="text-xs text-muted-foreground">
                          {resident.email}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right font-mono text-sm">
                  {resident.phone}
                </TableCell>

                <TableCell className="text-right">
                  {resident.unit?.number ? (
                    <Badge variant="outline">{resident.unit.number}</Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className={
                      resident.role === 'owner'
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200'
                    }
                  >
                    {roleLabels[resident.role as keyof typeof roleLabels]}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Badge className={statusColors[status as keyof typeof statusColors]}>
                    {statusLabels[status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>

                <TableCell className="text-right font-mono">
                  <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                    {new Intl.NumberFormat('fa-IR').format(Math.abs(balance))}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => onEditResident(resident)}>
                        <Edit className="h-4 w-4 mr-2" />
                        ویرایش
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewProfile?.(resident)}>
                        <Eye className="h-4 w-4 mr-2" />
                        مشاهده پروفایل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownloadAssets?.(resident)}>
                        <Download className="h-4 w-4 mr-2" />
                        دانلود مستندات
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDeleteResident?.(resident)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
