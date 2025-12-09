import { useState } from 'react';
import {
  FileText,
  FolderOpen,
  Upload,
  Grid3x3,
  List,
  Search,
  Filter,
  Download,
  HardDrive,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { UploadDocumentModal } from '@/components/documents/UploadDocumentModal';
import { DocumentPreviewModal } from '@/components/documents/DocumentPreviewModal';
import { mockDocuments } from '@/data/mockData';
import type { BuildingDocument } from '@/data/mockData';

const documentCategories = [
  { id: 'all', label: 'همه اسناد', icon: FolderOpen },
  { id: 'rules', label: 'قوانین و مقررات', icon: FileText },
  { id: 'minutes', label: 'صورتجلسات', icon: FileText },
  { id: 'contracts', label: 'قراردادها', icon: FileText },
  { id: 'insurance', label: 'بیمه‌نامه‌ها', icon: FileText },
  { id: 'permits', label: 'مجوزها', icon: FileText },
  { id: 'reports', label: 'گزارشات', icon: FileText },
  { id: 'other', label: 'سایر', icon: FolderOpen },
];

export function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<BuildingDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Filter documents
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    
    return matchesCategory && matchesSearch && matchesType;
  });

  // Calculate storage usage (mock)
  const totalStorage = 10 * 1024 * 1024 * 1024; // 10GB
  const usedStorage = mockDocuments.reduce((sum, doc) => sum + doc.size, 0);
  const usagePercentage = (usedStorage / totalStorage) * 100;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const currentCategory = documentCategories.find(cat => cat.id === selectedCategory);

  const handleDocumentClick = (doc: BuildingDocument) => {
    setSelectedDocument(doc);
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مستندات ساختمان</h1>
          <p className="text-muted-foreground mt-1">
            مدیریت اسناد و مدارک ساختمان
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="h-4 w-4 ml-2" />
          آپلود سند
        </Button>
      </div>

      {/* Storage Usage */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">فضای ذخیره‌سازی</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatBytes(usedStorage)} از {formatBytes(totalStorage)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </Card>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{currentCategory?.label || 'همه اسناد'}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو در اسناد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="نوع فایل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه فایل‌ها</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="doc">Word</SelectItem>
            <SelectItem value="docx">Word (docx)</SelectItem>
            <SelectItem value="xls">Excel</SelectItem>
            <SelectItem value="xlsx">Excel (xlsx)</SelectItem>
            <SelectItem value="jpg">تصویر (JPG)</SelectItem>
            <SelectItem value="png">تصویر (PNG)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {documentCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            <category.icon className="h-4 w-4 ml-2" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-2'
        }>
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              viewMode={viewMode}
              onClick={() => handleDocumentClick(doc)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">سندی یافت نشد</h3>
          <p className="text-muted-foreground mb-4">
            در این دسته‌بندی سندی وجود ندارد
          </p>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="h-4 w-4 ml-2" />
            آپلود اولین سند
          </Button>
        </Card>
      )}

      {/* Modals */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
      
      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
        />
      )}
    </div>
  );
}
