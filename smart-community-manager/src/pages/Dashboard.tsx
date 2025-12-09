import { Wallet, Clock, AlertTriangle, PiggyBank } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { CollectionProgress } from '@/components/dashboard/CollectionProgress';
import { RecentPayments } from '@/components/dashboard/RecentPayments';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { BuildingHealthScore } from '@/components/dashboard/BuildingHealthScore';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AnnouncementsList } from '@/components/dashboard/AnnouncementsList';
import { TodaysTasks } from '@/components/dashboard/TodaysTasks';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { OccupancyWidget } from '@/components/dashboard/OccupancyWidget';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { ManagerFAB } from '@/components/ui/floating-action-button';
import { mockStats, mockUsers } from '@/data/mockData';

export default function Dashboard() {
  const currentUser = mockUsers[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">
          سلام، {currentUser.name} 👋
        </h1>
        <p className="text-muted-foreground">
          خوش آمدید! اینجا می‌توانید وضعیت ساختمان را مشاهده کنید.
        </p>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <StatCard
          title="وصول شده این ماه"
          value={mockStats.collectedThisMonth}
          icon={<Wallet className="h-6 w-6" />}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="در انتظار پرداخت"
          value={mockStats.pendingPayments}
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />
        <StatCard
          title="معوقات"
          value={mockStats.overdueAmount}
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="موجودی صندوق"
          value={mockStats.fundBalance}
          icon={<PiggyBank className="h-6 w-6" />}
          variant="primary"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts & Lists */}
        <div className="space-y-6 lg:col-span-2">
          <IncomeExpenseChart />
          <div className="grid gap-6 md:grid-cols-2">
            <TodaysTasks />
            <ActivityFeed />
          </div>
          <RecentPayments />
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
          <CollectionProgress
            collectionRate={mockStats.collectionRate}
            totalUnits={mockStats.totalUnits}
            paidUnits={mockStats.paidUnits}
            pendingUnits={mockStats.pendingUnits}
            overdueUnits={mockStats.overdueUnits}
          />
          <OccupancyWidget />
          <BuildingHealthScore score={mockStats.buildingHealthScore} />
          <QuickActions />
        </div>
      </div>

      {/* Announcements */}
      <AnnouncementsList />

      {/* Mobile FAB */}
      <ManagerFAB />
    </div>
  );
}
