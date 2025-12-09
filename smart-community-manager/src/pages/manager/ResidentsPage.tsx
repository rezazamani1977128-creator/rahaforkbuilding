import { useState, useMemo } from 'react';
import { Plus, Download, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResidentTable } from '@/components/residents/ResidentTable';
import { ResidentModal } from '@/components/residents/ResidentModal';
import { mockUsers, mockUnits } from '@/data/mockData';
import type { User } from '@/data/mockData';

type FilterRole = 'all' | 'owner' | 'tenant';
type FilterStatus = 'all' | 'paid' | 'pending' | 'overdue';

export function ResidentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<User | null>(null);

  // Get residents with their unit info
  const residents = useMemo(() => {
    return mockUsers
      .filter(u => u.role !== 'manager')
      .map(user => ({
        ...user,
        unit: mockUnits.find(u => u.id === user.unitId),
      }))
      .filter(resident => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          resident.name.toLowerCase().includes(searchLower) ||
          resident.phone.includes(searchQuery) ||
          resident.unit?.number.includes(searchQuery);

        // Role filter
        const matchesRole =
          filterRole === 'all' || resident.role === filterRole;

        // Status filter
        const matchesStatus =
          filterStatus === 'all' || resident.unit?.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
      });
  }, [searchQuery, filterRole, filterStatus]);

  const handleAddResident = () => {
    setEditingResident(null);
    setIsModalOpen(true);
  };

  const handleEditResident = (resident: User) => {
    setEditingResident(resident);
    setIsModalOpen(true);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedResidents(residents.map(r => r.id));
    } else {
      setSelectedResidents([]);
    }
  };

  const handleSelectResident = (residentId: string) => {
    setSelectedResidents(prev =>
      prev.includes(residentId)
        ? prev.filter(id => id !== residentId)
        : [...prev, residentId]
    );
  };

  const handleExport = () => {
    // Export to CSV
    const headers = ['نام', 'تلفن', 'واحد', 'نقش', 'وضعیت'];
    const rows = residents.map(r => [
      r.name,
      r.phone,
      r.unit?.number || '-',
      r.role === 'owner' ? 'مالک' : 'مستاجر',
      r.unit?.status === 'paid' ? 'پرداخت شده' : r.unit?.status === 'pending' ? 'در انتظار' : 'معوقه',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'residents.csv';
    a.click();
  };

  const handleDeleteSelected = () => {
    // Handle bulk delete
    if (window.confirm(`آیا می‌خواهید ${selectedResidents.length} ساکن حذف شوند؟`)) {
      setSelectedResidents([]);
      // Call API to delete
    }
  };

  const handleSendMessage = () => {
    // Handle bulk message
    console.log('Send message to:', selectedResidents);
  };

  const handleViewProfile = (resident: User) => {
    console.log('View profile:', resident.id);
    // Could open a modal with resident details
    alert(`پروفایل ${resident.name}\n\nتلفن: ${resident.phone}\nواحد: ${residents.find(r => r.id === resident.id)?.unit?.number || '-'}`);
  };

  const handleDownloadAssets = (resident: User) => {
    console.log('Download assets for:', resident.id);
    // Create a simple text file with resident info
    const content = `اطلاعات ساکن: ${resident.name}\nتلفن: ${resident.phone}\nایمیل: ${resident.email || '-'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resident.name}.txt`;
    a.click();
  };

  const handleDeleteResident = (resident: User) => {
    if (window.confirm(`آیا می‌خواهید ساکن ${resident.name} حذف شوند؟`)) {
      console.log('Delete resident:', resident.id);
      alert(`ساکن ${resident.name} حذف شد`);
      // Call API to delete
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ساکنین</h1>
          <p className="text-muted-foreground mt-1">مدیریت ساکنین و واحدهای ساختمان</p>
        </div>
        <Button onClick={handleAddResident} className="gap-2">
          <Plus className="h-4 w-4" />
          افزودن ساکن
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">کل ساکنین</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">نفر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مالکین</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {residents.filter(r => r.role === 'owner').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">مالک</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مستاجران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {residents.filter(r => r.role === 'tenant').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">مستاجر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">معوقه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {residents.filter(r => r.unit?.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">واحد</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>جستجو و فیلترها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="جستجو بر اساس نام، تلفن یا واحد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rtl"
            />

            <Select value={filterRole} onValueChange={(v) => setFilterRole(v as FilterRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه</SelectItem>
                <SelectItem value="owner">مالکین</SelectItem>
                <SelectItem value="tenant">مستاجران</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="paid">پرداخت شده</SelectItem>
                <SelectItem value="pending">در انتظار</SelectItem>
                <SelectItem value="overdue">معوقه</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFilterRole('all');
                setFilterStatus('all');
              }}
            >
              پاک‌کردن فیلترها
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedResidents.length > 0 && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {selectedResidents.length} ساکن انتخاب شده
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={handleSendMessage}
                >
                  <MessageSquare className="h-4 w-4" />
                  ارسال پیام
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-2"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <ResidentTable
        residents={residents}
        selectedResidents={selectedResidents}
        onSelectAll={handleSelectAll}
        onSelectResident={handleSelectResident}
        onEditResident={handleEditResident}
        onExport={handleExport}
        onViewProfile={handleViewProfile}
        onDownloadAssets={handleDownloadAssets}
        onDeleteResident={handleDeleteResident}
      />

      {/* Modal */}
      <ResidentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        resident={editingResident}
      />
    </div>
  );
}
