import { useState } from 'react';
import { Plus, Filter, Wrench, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubmitRequestModal } from '@/components/resident/SubmitRequestModal';
import { mockMaintenanceRequests } from '@/data/mockData';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';
import { 
  Droplets, 
  Zap, 
  Wind, 
  Building, 
  Car, 
  Phone, 
  ArrowUpDown,
  MoreHorizontal 
} from 'lucide-react';

const categoryIcons: Record<string, typeof Wrench> = {
  plumbing: Droplets,
  electrical: Zap,
  elevator: ArrowUpDown,
  hvac: Wind,
  common_areas: Building,
  parking: Car,
  intercom: Phone,
  other: MoreHorizontal,
};

const categoryLabels: Record<string, string> = {
  plumbing: 'لوله‌کشی',
  electrical: 'برق',
  elevator: 'آسانسور',
  hvac: 'تهویه',
  common_areas: 'مشاعات',
  parking: 'پارکینگ',
  intercom: 'آیفون',
  other: 'سایر',
};

const categoryColors: Record<string, string> = {
  plumbing: 'text-cyan-500 bg-cyan-500/10',
  electrical: 'text-orange-500 bg-orange-500/10',
  elevator: 'text-blue-500 bg-blue-500/10',
  hvac: 'text-green-500 bg-green-500/10',
  common_areas: 'text-purple-500 bg-purple-500/10',
  parking: 'text-yellow-500 bg-yellow-500/10',
  intercom: 'text-pink-500 bg-pink-500/10',
  other: 'text-gray-500 bg-gray-500/10',
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-500',
  in_progress: 'bg-orange-500/10 text-orange-500',
  completed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-gray-500/10 text-gray-500',
};

const statusLabels: Record<string, string> = {
  new: 'جدید',
  in_progress: 'در حال انجام',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};

const priorityLabels: Record<string, string> = {
  urgent: 'اضطراری',
  high: 'بالا',
  medium: 'متوسط',
  low: 'پایین',
};

export function MyRequestsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState(mockMaintenanceRequests);

  // In production, filter by current user
  const myRequests = requests;

  const handleCreateRequest = (data: any) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      unitId: 'unit-1',
      userId: 'user-1',
      category: data.category,
      title: data.title,
      description: data.description,
      priority: data.priority,
      location: data.location || 'unit',
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
      photos: [],
      assignedTo: null,
      completedAt: null,
      notes: [],
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const stats = {
    total: myRequests.length,
    open: myRequests.filter(r => r.status === 'new').length,
    inProgress: myRequests.filter(r => r.status === 'in_progress').length,
    completed: myRequests.filter(r => r.status === 'completed').length,
  };

  const filteredRequests = myRequests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return request.status === 'new';
    if (activeTab === 'in_progress') return request.status === 'in_progress';
    if (activeTab === 'completed') return request.status === 'completed';
    return true;
  });

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'همین الان';
    if (diffInSeconds < 3600) return `${toPersianNumber(Math.floor(diffInSeconds / 60))} دقیقه پیش`;
    if (diffInSeconds < 86400) return `${toPersianNumber(Math.floor(diffInSeconds / 3600))} ساعت پیش`;
    if (diffInSeconds < 604800) return `${toPersianNumber(Math.floor(diffInSeconds / 86400))} روز پیش`;
    return formatPersianDate(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">درخواست‌های من</h1>
          <p className="text-muted-foreground mt-1">
            مدیریت درخواست‌های تعمیرات و نگهداری
          </p>
        </div>
        <Button size="lg" onClick={() => setCreateModalOpen(true)}>
          <Plus className="ml-2 h-5 w-5" />
          ثبت درخواست جدید
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{toPersianNumber(stats.total)}</p>
                <p className="text-sm text-muted-foreground">مجموع</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{toPersianNumber(stats.open)}</p>
                <p className="text-sm text-muted-foreground">باز</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{toPersianNumber(stats.inProgress)}</p>
                <p className="text-sm text-muted-foreground">در حال انجام</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{toPersianNumber(stats.completed)}</p>
                <p className="text-sm text-muted-foreground">تکمیل شده</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>لیست درخواست‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4" dir="rtl">
              <TabsTrigger value="all">همه ({toPersianNumber(stats.total)})</TabsTrigger>
              <TabsTrigger value="open">باز ({toPersianNumber(stats.open)})</TabsTrigger>
              <TabsTrigger value="in_progress">در حال انجام ({toPersianNumber(stats.inProgress)})</TabsTrigger>
              <TabsTrigger value="completed">تکمیل شده ({toPersianNumber(stats.completed)})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => {
                  const CategoryIcon = categoryIcons[request.category] || Wrench;
                  
                  return (
                    <div
                      key={request.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedRequest(request);
                        setDetailModalOpen(true);
                      }}
                      dir="rtl"
                    >
                      <div className="flex items-start gap-4 flex-row-reverse">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${categoryColors[request.category]}`}>
                          <CategoryIcon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-row-reverse">
                            <Badge className={statusColors[request.status]}>
                              {statusLabels[request.status]}
                            </Badge>
                            <div className="text-right">
                              <h3 className="font-semibold">{request.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {request.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-row-reverse justify-end">
                            <div className="flex items-center gap-1">
                              <span>{getRelativeTime(request.createdAt)}</span>
                              <Clock className="h-3 w-3" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[request.category]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>درخواستی در این دسته وجود ندارد</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Empty State for All */}
      {myRequests.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Wrench className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">هنوز درخواستی ندارید</h3>
            <p className="text-muted-foreground mb-6">
              با کلیک روی دکمه زیر اولین درخواست خود را ثبت کنید
            </p>
            <Button size="lg" onClick={() => setCreateModalOpen(true)}>
              <Plus className="ml-2 h-5 w-5" />
              ثبت درخواست جدید
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Request Modal */}
      <SubmitRequestModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateRequest}
      />

      {/* Request Detail Modal */}
      {selectedRequest && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>جزئیات درخواست</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status and Category */}
              <div className="flex items-center gap-2">
                <Badge className={statusColors[selectedRequest.status]}>
                  {statusLabels[selectedRequest.status]}
                </Badge>
                <Badge variant="outline">
                  {categoryLabels[selectedRequest.category]}
                </Badge>
                <Badge variant="outline">
                  {priorityLabels[selectedRequest.priority]}
                </Badge>
              </div>

              {/* Title and Description */}
              <div>
                <h3 className="text-xl font-bold mb-2">{selectedRequest.title}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Timeline */}
              <div className="border-r-2 pr-4 space-y-4">
                <div className="relative">
                  <div className="absolute -right-[21px] top-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-background" />
                  <div>
                    <p className="font-medium">ثبت درخواست</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPersianDate(selectedRequest.createdAt)}
                    </p>
                  </div>
                </div>
                
                {selectedRequest.status !== 'new' && (
                  <div className="relative">
                    <div className="absolute -right-[21px] top-1 h-4 w-4 rounded-full bg-orange-500 border-2 border-background" />
                    <div>
                      <p className="font-medium">شروع بررسی</p>
                      <p className="text-sm text-muted-foreground">
                        {getRelativeTime(selectedRequest.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedRequest.status === 'completed' && (
                  <div className="relative">
                    <div className="absolute -right-[21px] top-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                    <div>
                      <p className="font-medium">تکمیل شده</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRequest.completedAt ? formatPersianDate(selectedRequest.completedAt) : 'اخیراً'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Manager Notes */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">یادداشت مدیر</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.status === 'new' 
                    ? 'درخواست شما دریافت شد و به زودی بررسی خواهد شد.'
                    : selectedRequest.status === 'in_progress'
                    ? 'درخواست شما در دست بررسی است. به زودی اقدام خواهد شد.'
                    : 'درخواست شما با موفقیت انجام شد.'}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
