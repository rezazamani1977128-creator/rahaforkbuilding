import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List, Droplets, Zap, ArrowUpDown, Wind, Building, Car, Phone, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { mockMaintenanceRequests } from '@/data/mockData';
import { formatPersianDate, toPersianNumber } from '@/lib/utils';
import { SubmitRequestModal } from '@/components/resident/SubmitRequestModal';

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  reporterUnit: string;
  reporterName: string;
  createdAt: Date;
  assignedTo?: string;
  images?: string[];
  notes?: string[];
}

const categoryConfig = {
  plumbing: { label: 'لوله‌کشی', icon: Droplets, color: 'bg-blue-100 text-blue-700' },
  electrical: { label: 'برق', icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
  elevator: { label: 'آسانسور', icon: ArrowUpDown, color: 'bg-purple-100 text-purple-700' },
  hvac: { label: 'تهویه', icon: Wind, color: 'bg-cyan-100 text-cyan-700' },
  common_areas: { label: 'مشاعات', icon: Building, color: 'bg-green-100 text-green-700' },
  parking: { label: 'پارکینگ', icon: Car, color: 'bg-orange-100 text-orange-700' },
  intercom: { label: 'آیفون', icon: Phone, color: 'bg-pink-100 text-pink-700' },
  other: { label: 'سایر', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-700' },
};

const priorityConfig = {
  urgent: { label: 'اضطراری', color: 'bg-red-100 text-red-800' },
  high: { label: 'بالا', color: 'bg-orange-100 text-orange-800' },
  medium: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'پایین', color: 'bg-green-100 text-green-800' },
};

const statusConfig = {
  'new': { label: 'جدید', color: 'bg-blue-100 text-blue-800' },
  'in-progress': { label: 'در حال انجام', color: 'bg-purple-100 text-purple-800' },
  'completed': { label: 'انجام شده', color: 'bg-green-100 text-green-800' },
  'cancelled': { label: 'لغو شده', color: 'bg-gray-100 text-gray-800' },
};

export function MaintenancePage() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(() =>
    mockMaintenanceRequests.map((req) => ({
      ...req,
      reporterUnit: req.unitId || '---',
      reporterName: 'ساکن',
      status: req.status === 'in_progress' ? 'in-progress' : req.status,
    }))
  );

  const handleCreateRequest = (data: any) => {
    const newRequest: MaintenanceRequest = {
      id: `req-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'new',
      reporterUnit: 'مدیر',
      reporterName: 'مدیر ساختمان',
      createdAt: new Date(),
      assignedTo: undefined,
      images: [],
      notes: [],
    };
    setRequests(prev => [newRequest, ...prev]);
    setCreateModalOpen(false);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requests, searchQuery]);

  const getStatsByStatus = (status: MaintenanceRequest['status']) => {
    return requests.filter(r => r.status === status).length;
  };

  const getStatsByMonth = () => {
    const now = new Date();
    const thisMonth = requests.filter(r => {
      const date = new Date(r.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    return {
      total: thisMonth.length,
      completed: thisMonth.filter(r => r.status === 'completed').length,
      inProgress: thisMonth.filter(r => r.status === 'in-progress').length,
    };
  };

  const monthlyStats = getStatsByMonth();

  const RequestCard = ({ request }: { request: MaintenanceRequest }) => {
    const category = categoryConfig[request.category as keyof typeof categoryConfig];
    const CategoryIcon = category?.icon;

    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4 rtl">
            {/* Category Icon */}
            <div className={`p-2 rounded-lg flex-shrink-0 ${category?.color}`}>
              {CategoryIcon && <CategoryIcon className="h-5 w-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{request.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {request.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Badge className={priorityConfig[request.priority].color}>
                  {priorityConfig[request.priority].label}
                </Badge>
                <Badge variant="outline">
                  {statusConfig[request.status].label}
                </Badge>
                {request.images && request.images.length > 0 && (
                  <Badge variant="secondary">📷 {toPersianNumber(request.images.length)}</Badge>
                )}
              </div>

              <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
                <span>واحد {request.reporterUnit}</span>
                <span>{formatPersianDate(new Date(request.createdAt))}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const KanbanColumn = ({ status, title }: { status: MaintenanceRequest['status']; title: string }) => {
    const columnRequests = filteredRequests.filter(r => r.status === status);

    return (
      <div className="bg-muted rounded-lg p-4 min-h-[600px] space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="secondary">{toPersianNumber(columnRequests.length)}</Badge>
        </div>

        <div className="space-y-3">
          {columnRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4 gap-2">
          <Plus className="h-4 w-4" />
          افزودن درخواست
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">درخواست‌های نگهداری</h1>
          <p className="text-muted-foreground mt-1">
            {toPersianNumber(requests.length)} درخواست در سیستم
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          درخواست جدید
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">کل درخواست‌ها</p>
            <p className="text-3xl font-bold mt-1">{toPersianNumber(requests.length)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">جدید</p>
            <p className="text-3xl font-bold mt-1 text-blue-600">
              {toPersianNumber(getStatsByStatus('new'))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">در حال انجام</p>
            <p className="text-3xl font-bold mt-1 text-purple-600">
              {toPersianNumber(getStatsByStatus('in-progress'))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">انجام شده این ماه</p>
            <p className="text-3xl font-bold mt-1 text-green-600">
              {toPersianNumber(monthlyStats.completed)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          لیست
        </Button>
        <Button
          variant={viewMode === 'kanban' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('kanban')}
          className="gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          کانبن
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در درخواست‌ها..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* View */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">درخواستی یافت نشد</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <KanbanColumn status="new" title="جدید" />
          <KanbanColumn status="in-progress" title="در حال انجام" />
          <KanbanColumn status="completed" title="انجام شده" />
          <KanbanColumn status="cancelled" title="لغو شده" />
        </div>
      )}

      {/* Create Request Modal */}
      <SubmitRequestModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateRequest}
      />
    </div>
  );
}
