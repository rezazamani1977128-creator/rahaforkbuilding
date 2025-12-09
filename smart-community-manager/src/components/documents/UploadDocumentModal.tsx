import { useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDocumentModal({ open, onOpenChange }: UploadDocumentModalProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState('all');
  const [expiryDate, setExpiryDate] = useState('');

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'فرمت فایل پشتیبانی نمی‌شود';
    }
    if (file.size > maxSize) {
      return 'حجم فایل نباید بیشتر از ۱۰ مگابایت باشد';
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'خطا در انتخاب فایل',
          description: `${file.name}: ${error}`,
        });
      } else {
        validFiles.push(file);
      }
    }

    setFiles((prev) => [...prev, ...validFiles]);
    
    // Auto-fill name from first file
    if (validFiles.length > 0 && !name) {
      setName(validFiles[0].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'لطفا حداقل یک فایل انتخاب کنید',
      });
      return;
    }

    if (!category) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'لطفا دسته‌بندی را انتخاب کنید',
      });
      return;
    }

    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'لطفا نام سند را وارد کنید',
      });
      return;
    }

    setUploading(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'موفق',
      description: `${files.length} فایل با موفقیت آپلود شد`,
    });

    setUploading(false);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFiles([]);
    setCategory('');
    setName('');
    setDescription('');
    setAccessLevel('all');
    setExpiryDate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>آپلود سند جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              فایل‌ها را اینجا بکشید و رها کنید
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              یا روی دکمه زیر کلیک کنید
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
              onChange={handleFileInput}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                انتخاب فایل
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              فرمت‌های مجاز: PDF, Word, Excel, JPG, PNG - حداکثر حجم: ۱۰MB
            </p>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>فایل‌های انتخاب شده</Label>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Document Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="category">دسته‌بندی *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rules">قوانین و مقررات</SelectItem>
                  <SelectItem value="minutes">صورتجلسات</SelectItem>
                  <SelectItem value="contracts">قراردادها</SelectItem>
                  <SelectItem value="insurance">بیمه‌نامه‌ها</SelectItem>
                  <SelectItem value="permits">مجوزها</SelectItem>
                  <SelectItem value="reports">گزارشات</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">نام سند *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام سند را وارد کنید"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات اضافی..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessLevel">سطح دسترسی</Label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger id="accessLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه ساکنین</SelectItem>
                  <SelectItem value="managers">مدیران و هیئت مدیره</SelectItem>
                  <SelectItem value="board">فقط هیئت مدیره</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">تاریخ انقضا (اختیاری)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-500">
              <p className="font-medium mb-1">نکته مهم:</p>
              <p>
                اسناد آپلود شده بر اساس سطح دسترسی انتخابی برای ساکنین قابل مشاهده
                خواهد بود. در صورت نیاز می‌توانید بعداً سطح دسترسی را تغییر دهید.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading ? 'در حال آپلود...' : 'آپلود سند'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
