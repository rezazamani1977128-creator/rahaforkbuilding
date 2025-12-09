import { Download, Share2, Printer, X, Calendar, User, HardDrive, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { BuildingDocument } from '@/data/mockData';
import { formatPersianDate, toPersianNumber } from '@/lib/persian';

const categoryLabels = {
  rules: 'قوانین و مقررات',
  minutes: 'صورتجلسه',
  contracts: 'قرارداد',
  insurance: 'بیمه‌نامه',
  permits: 'مجوز',
  reports: 'گزارش',
  other: 'سایر',
};

const accessLevelLabels = {
  all: 'همه ساکنین',
  managers: 'مدیران و هیئت مدیره',
  board: 'فقط هیئت مدیره',
};

interface DocumentPreviewModalProps {
  document: BuildingDocument;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentPreviewModal({
  document,
  open,
  onOpenChange,
}: DocumentPreviewModalProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return toPersianNumber(Math.round(bytes / Math.pow(k, i) * 100) / 100) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    console.log('Downloading:', document.name);
    // Simulate download
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.name,
          text: document.description || document.name,
          url: document.url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(document.url);
      console.log('Link copied to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isPDF = document.type === 'pdf';
  const isImage = document.type === 'jpg' || document.type === 'png';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{document.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{categoryLabels[document.category]}</Badge>
                <Badge>{accessLevelLabels[document.accessLevel]}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          {/* Preview Area */}
          <div className="flex-1 bg-muted rounded-lg overflow-auto">
            {isPDF ? (
              <iframe
                src={document.url}
                className="w-full h-full min-h-[600px]"
                title={document.name}
              />
            ) : isImage ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={document.url}
                  alt={document.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8 text-center">
                <div>
                  <p className="text-muted-foreground mb-4">
                    پیش‌نمایش این فایل در مرورگر امکان‌پذیر نیست
                  </p>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 ml-2" />
                    دانلود فایل
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="w-80 space-y-4 overflow-y-auto flex-shrink-0">
            <div className="space-y-3">
              <h3 className="font-semibold">اطلاعات سند</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">تاریخ آپلود:</span>
                  <span className="font-medium">
                    {formatPersianDate(document.uploadedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">آپلود شده توسط:</span>
                  <span className="font-medium">{document.uploadedBy}</span>
                </div>

                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">حجم فایل:</span>
                  <span className="font-medium">{formatBytes(document.size)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">سطح دسترسی:</span>
                  <span className="font-medium">
                    {accessLevelLabels[document.accessLevel]}
                  </span>
                </div>

                {document.expiresAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">تاریخ انقضا:</span>
                    <span className="font-medium">
                      {formatPersianDate(document.expiresAt)}
                    </span>
                  </div>
                )}
              </div>

              {document.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">توضیحات</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {document.description}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <Button className="w-full" onClick={handleDownload}>
                  <Download className="h-4 w-4 ml-2" />
                  دانلود فایل
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="h-4 w-4 ml-2" />
                  اشتراک‌گذاری
                </Button>
                <Button variant="outline" className="w-full" onClick={handlePrint}>
                  <Printer className="h-4 w-4 ml-2" />
                  چاپ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
