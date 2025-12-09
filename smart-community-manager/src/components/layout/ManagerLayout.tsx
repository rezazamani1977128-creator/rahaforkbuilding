import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Receipt,
  Home,
  FileText,
  Megaphone,
  Vote,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDemo } from '@/contexts/DemoContext';
import { cn } from '@/lib/utils';

const managerMenuItems = [
  { icon: LayoutDashboard, label: 'داشبورد', path: '/manager/dashboard' },
  { icon: Users, label: 'ساکنین', path: '/manager/residents' },
  { icon: Home, label: 'واحدها', path: '/manager/units' },
  { icon: DollarSign, label: 'شارژ', path: '/manager/charges' },
  { icon: Receipt, label: 'پرداخت‌ها', path: '/manager/payments' },
  { icon: FileText, label: 'هزینه‌ها', path: '/manager/expenses' },
  { icon: Home, label: 'صندوق', path: '/manager/fund' },
  { icon: FileText, label: 'گزارشات', path: '/manager/reports' },
  { icon: Megaphone, label: 'اطلاعیه‌ها', path: '/manager/announcements' },
  { icon: Vote, label: 'رأی‌گیری', path: '/manager/polls' },
  { icon: Wrench, label: 'درخواست‌ها', path: '/manager/requests' },
  { icon: FileText, label: 'اسناد', path: '/manager/documents' },
];

const secondaryItems = [
  { icon: HelpCircle, label: 'راهنما', path: '/manager/help' },
  { icon: Settings, label: 'تنظیمات', path: '/manager/settings' },
];

export function ManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, currentBuilding, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isDemoMode } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'کاربر';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'border-r bg-card transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b flex items-center justify-between rtl">
            {sidebarOpen && <h1 className="font-bold text-lg">مدیریت ساختمان</h1>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {managerMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors rtl',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}

            {/* Divider */}
            {sidebarOpen && <div className="my-4 border-t" />}

            {/* Secondary Items */}
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors rtl',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full gap-2 rtl"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {sidebarOpen && <span className="text-xs">{theme === 'dark' ? 'روشن' : 'تاریک'}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full gap-2 rtl text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span className="text-xs">خروج</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4 flex items-center justify-between rtl">
          <div className="flex items-center gap-4 rtl flex-1">
            <h2 className="text-xl font-semibold">{currentBuilding?.name}</h2>
            <span className="text-sm text-muted-foreground">{displayName}</span>
            {isDemoMode && (
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                <Sparkles className="h-3 w-3 ml-1" />
                حالت دمو
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
