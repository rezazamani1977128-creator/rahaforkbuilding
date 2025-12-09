import { FileText, FileSpreadsheet, Image as ImageIcon, Calendar, User, Download, Share2, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BuildingDocument } from '@/data/mockData';
import { toPersianNumber, formatPersianDate } from '@/lib/persian';

const fileTypeIcons = {
  pdf: { icon: FileText, color: 'text-red-500' },
  doc: { icon: FileText, color: 'text-blue-500' },
  docx: { icon: FileText, color: 'text-blue-500' },
  xls: { icon: FileSpreadsheet, color: 'text-green-500' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500' },
  jpg: { icon: ImageIcon, color: 'text-purple-500' },
  png: { icon: ImageIcon, color: 'text-purple-500' },
};

const categoryLabels = {
  rules: 'قوانین',
  minutes: 'صورتجلسه',
  contracts: 'قرارداد',
  insurance: 'بیمه',
  permits: 'مجوز',
  reports: 'گزارش',
  other: 'سایر',
};

const accessLevelLabels = {
  all: 'همه',
  managers: 'مدیران',
  board: 'هیئت مدیره',
};

const accessLevelColors = {
  all: 'bg-green-500/10 text-green-500',
  managers: 'bg-orange-500/10 text-orange-500',
  board: 'bg-blue-500/10 text-blue-500',
};

interface DocumentCardProps {
  document: BuildingDocument;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

export function DocumentCard({ document, viewMode, onClick }: DocumentCardProps) {
  const fileTypeConfig = fileTypeIcons[document.type];
  const Icon = fileTypeConfig.icon;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return toPersianNumber(Math.round(bytes / Math.pow(k, i) * 100) / 100) + ' ' + sizes[i];
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulated download
    console.log('Downloading:', document.name);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulated share
    console.log('Sharing:', document.name);
  };

  if (viewMode === 'list') {
    return (
      <Card
        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-4" dir="rtl">
          <div className={`p-3 rounded-lg bg-muted ${fileTypeConfig.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{document.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span>{categoryLabels[document.category]}</span>
              <span>•</span>
              <span>{formatBytes(document.size)}</span>
              <span>•</span>
              <span>{formatPersianDate(document.uploadedAt)}</span>
            </div>
          </div>

          <Badge className={accessLevelColors[document.accessLevel]}>
            {accessLevelLabels[document.accessLevel]}
          </Badge>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>ویرایش</DropdownMenuItem>
                <DropdownMenuItem>تغییر دسترسی</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">حذف</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
      dir="rtl"
    >
      <div className="space-y-3">
        {/* File Icon */}
        <div className={`w-full aspect-video rounded-lg bg-muted flex items-center justify-center ${fileTypeConfig.color}`}>
          <Icon className="h-16 w-16" />
        </div>

        {/* Document Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2 leading-snug flex-1">
              {document.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>ویرایش</DropdownMenuItem>
                <DropdownMenuItem>تغییر دسترسی</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">حذف</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {categoryLabels[document.category]}
            </Badge>
            <Badge className={`text-xs ${accessLevelColors[document.accessLevel]}`}>
              {accessLevelLabels[document.accessLevel]}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatPersianDate(document.uploadedAt)}</span>
            </div>
            <span>{formatBytes(document.size)}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{document.uploadedBy}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
            <Download className="h-3 w-3 ml-1" />
            دانلود
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
            <Share2 className="h-3 w-3 ml-1" />
            اشتراک
          </Button>
        </div>
      </div>
    </Card>
  );
}
