import { useState } from 'react';
import { Database, Download, Upload, AlertTriangle, Calendar, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatPersianDate } from '@/lib/persian';

const backupHistory = [
  {
    id: '1',
    date: new Date('2024-12-01'),
    size: '2.5 MB',
    type: 'خودکار',
  },
  {
    id: '2',
    date: new Date('2024-11-15'),
    size: '2.3 MB',
    type: 'دستی',
  },
  {
    id: '3',
    date: new Date('2024-11-01'),
    size: '2.1 MB',
    type: 'خودکار',
  },
];

export function BackupSettings() {
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleCreateBackup = async () => {
    setCreating(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'موفق',
      description: 'فایل پشتیبان با موفقیت ایجاد شد',
    });

    setCreating(false);
  };

  const handleDownloadBackup = (id: string) => {
    toast({
      title: 'در حال دانلود',
      description: 'دانلود فایل پشتیبان آغاز شد',
    });
    console.log('Downloading backup:', id);
  };

  const handleRestore = async () => {
    setRestoring(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'موفق',
      description: 'بازیابی اطلاعات با موفقیت انجام شد',
    });

    setRestoring(false);
  };

  const lastBackup = backupHistory[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          پشتیبان‌گیری و بازیابی
        </CardTitle>
        <CardDescription>
          مدیریت فایل‌های پشتیبان و بازیابی اطلاعات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Last Backup Info */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">آخرین پشتیبان‌گیری</p>
              <p className="text-sm text-muted-foreground">
                {formatPersianDate(lastBackup.date)} - {lastBackup.size}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadBackup(lastBackup.id)}
          >
            <Download className="h-4 w-4 ml-2" />
            دانلود
          </Button>
        </div>

        {/* Create Backup */}
        <div className="space-y-4">
          <h3 className="font-semibold">ایجاد پشتیبان جدید</h3>
          <p className="text-sm text-muted-foreground">
            یک کپی امن از تمام اطلاعات ساختمان ایجاد کنید
          </p>

          <div className="flex gap-2">
            <Button onClick={handleCreateBackup} disabled={creating}>
              <Save className="h-4 w-4 ml-2" />
              {creating ? 'در حال ایجاد پشتیبان...' : 'ایجاد پشتیبان'}
            </Button>
            <Button variant="outline" disabled={creating}>
              <Download className="h-4 w-4 ml-2" />
              دانلود به صورت JSON
            </Button>
            <Button variant="outline" disabled={creating}>
              <Download className="h-4 w-4 ml-2" />
              دانلود به صورت Excel
            </Button>
          </div>
        </div>

        {/* Backup History */}
        <div className="space-y-4">
          <h3 className="font-semibold">تاریخچه پشتیبان‌گیری</h3>
          
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">حجم</TableHead>
                  <TableHead className="text-right">نوع</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupHistory.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>{formatPersianDate(backup.date)}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadBackup(backup.id)}
                        >
                          <Download className="h-4 w-4 ml-1" />
                          دانلود
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Upload className="h-4 w-4 ml-1" />
                              بازیابی
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <div className="flex items-center gap-2 text-orange-500 mb-2">
                                <AlertTriangle className="h-6 w-6" />
                                <AlertDialogTitle>هشدار</AlertDialogTitle>
                              </div>
                              <AlertDialogDescription className="text-right">
                                با بازیابی این پشتیبان، تمام اطلاعات فعلی با اطلاعات این
                                پشتیبان جایگزین خواهند شد. این عملیات قابل بازگشت نیست.
                                <br />
                                <br />
                                آیا مطمئن هستید؟
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>انصراف</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleRestore}
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                {restoring ? 'در حال بازیابی...' : 'بله، بازیابی کن'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Restore from File */}
        <div className="space-y-4">
          <h3 className="font-semibold">بازیابی از فایل</h3>
          <p className="text-sm text-muted-foreground">
            فایل پشتیبان را از رایانه خود انتخاب کنید
          </p>

          <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg">
            <input
              type="file"
              id="restore-file"
              accept=".json,.zip"
              className="hidden"
            />
            <Button variant="outline" asChild>
              <label htmlFor="restore-file" className="cursor-pointer">
                <Upload className="h-4 w-4 ml-2" />
                انتخاب فایل پشتیبان
              </label>
            </Button>
            <p className="text-sm text-muted-foreground">
              فرمت‌های مجاز: JSON, ZIP
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-orange-500">
            <p className="font-medium mb-1">نکات مهم:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>قبل از هر بازیابی، حتماً یک پشتیبان جدید ایجاد کنید</li>
              <li>عملیات بازیابی ممکن است چند دقیقه طول بکشد</li>
              <li>در حین بازیابی، دسترسی سایر کاربران قطع خواهد شد</li>
              <li>پس از بازیابی، تمام کاربران باید مجدداً وارد شوند</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
