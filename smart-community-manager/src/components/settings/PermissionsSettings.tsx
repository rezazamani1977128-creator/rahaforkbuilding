import { useState } from 'react';
import { Shield, Plus, UserPlus, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const boardMembers = [
  { id: '1', name: 'علی رضایی', unit: '۲۰۱', role: 'مدیر', phone: '۰۹۱۲۱۲۳۴۵۶۷' },
  { id: '2', name: 'سارا محمدی', unit: '۳۰۵', role: 'هیئت مدیره', phone: '۰۹۱۲۲۳۴۵۶۷۸' },
];

const permissions = [
  { feature: 'ایجاد شارژ', manager: true, board: false, owner: false, tenant: false },
  { feature: 'مشاهده گزارش‌ها', manager: true, board: true, owner: false, tenant: false },
  { feature: 'تایید پرداخت', manager: true, board: true, owner: false, tenant: false },
  { feature: 'مدیریت اطلاعیه‌ها', manager: true, board: true, owner: false, tenant: false },
  { feature: 'مدیریت تعمیرات', manager: true, board: false, owner: false, tenant: false },
  { feature: 'مشاهده شارژها', manager: true, board: true, owner: true, tenant: true },
  { feature: 'پرداخت آنلاین', manager: true, board: true, owner: true, tenant: true },
  { feature: 'ثبت درخواست تعمیرات', manager: true, board: true, owner: true, tenant: true },
];

export function PermissionsSettings() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !selectedUnit || !selectedRole) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'لطفا تمام فیلدها را پر کنید',
      });
      return;
    }

    setInviting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'موفق',
      description: 'دعوت‌نامه با موفقیت ارسال شد',
    });

    setPhoneNumber('');
    setSelectedUnit('');
    setSelectedRole('');
    setInviting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          دسترسی‌ها و نقش‌ها
        </CardTitle>
        <CardDescription>
          مدیریت اعضای هیئت مدیره و سطوح دسترسی
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Board Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">اعضای هیئت مدیره</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 ml-2" />
              افزودن عضو
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">واحد</TableHead>
                  <TableHead className="text-right">شماره تماس</TableHead>
                  <TableHead className="text-right">نقش</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boardMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.unit}</TableCell>
                    <TableCell dir="ltr" className="text-right">{member.phone}</TableCell>
                    <TableCell>
                      <Badge variant={member.role === 'مدیر' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        حذف
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Separator />

        {/* Permissions Matrix */}
        <div className="space-y-4">
          <h3 className="font-semibold">ماتریس دسترسی‌ها</h3>
          <p className="text-sm text-muted-foreground">
            تعیین سطح دسترسی هر نقش به امکانات سیستم
          </p>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[200px]">امکان</TableHead>
                  <TableHead className="text-center">مدیر</TableHead>
                  <TableHead className="text-center">هیئت مدیره</TableHead>
                  <TableHead className="text-center">مالک</TableHead>
                  <TableHead className="text-center">مستاجر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{permission.feature}</TableCell>
                    <TableCell className="text-center">
                      {permission.manager ? '✓' : '✗'}
                    </TableCell>
                    <TableCell className="text-center">
                      {permission.board ? '✓' : '✗'}
                    </TableCell>
                    <TableCell className="text-center">
                      {permission.owner ? '✓' : '✗'}
                    </TableCell>
                    <TableCell className="text-center">
                      {permission.tenant ? '✓' : '✗'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Separator />

        {/* Invite Resident */}
        <div className="space-y-4">
          <h3 className="font-semibold">دعوت ساکن جدید</h3>
          <p className="text-sm text-muted-foreground">
            ساکن جدید را دعوت کنید تا به سیستم بپیوندد
          </p>

          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">واحد *</Label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="انتخاب واحد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">واحد ۱۰۱</SelectItem>
                    <SelectItem value="102">واحد ۱۰۲</SelectItem>
                    <SelectItem value="201">واحد ۲۰۱</SelectItem>
                    <SelectItem value="202">واحد ۲۰۲</SelectItem>
                    <SelectItem value="301">واحد ۳۰۱</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">نقش *</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="انتخاب نقش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">مالک</SelectItem>
                    <SelectItem value="tenant">مستاجر</SelectItem>
                    <SelectItem value="board">هیئت مدیره</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={inviting}>
              <UserPlus className="h-4 w-4 ml-2" />
              {inviting ? 'در حال ارسال...' : 'ارسال دعوت‌نامه'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
