import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  History,
  Wrench,
  Megaphone,
  Vote,
  Building2,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDemo } from '@/contexts/DemoContext';
import { cn } from '@/lib/utils';
import { toPersianNumber } from '@/lib/persian';

const residentMenuItems = [
  { icon: LayoutDashboard, label: 'داشبورد', path: '/resident/dashboard' },
  { icon: Receipt, label: 'شارژ من', path: '/resident/charges' },
  { icon: CreditCard, label: 'پرداخت', path: '/resident/pay' },
  { icon: History, label: 'تاریخچه پرداخت', path: '/resident/history' },
  { icon: Wrench, label: 'درخواست‌های من', path: '/resident/requests' },
  { icon: Megaphone, label: 'اطلاعیه‌ها', path: '/resident/announcements' },
  { icon: Vote, label: 'رأی‌گیری', path: '/resident/voting' },
  { icon: Building2, label: 'اطلاعات ساختمان', path: '/resident/building' },
  { icon: User, label: 'پروفایل', path: '/resident/profile' },
];

const communityMenuItems = [
  { icon: ShoppingBag, label: 'بازارچه', path: '/community/marketplace' },
  { icon: Calendar, label: 'رویدادها', path: '/community/events' },
  { icon: MessageSquare, label: 'گفتگو', path: '/community/discussions' },
];

export function ResidentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, currentBuilding, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isDemoMode } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'کاربر';
  const unitNumber = '101';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Mock current charge amount - in production, fetch from API
  const currentChargeAmount = 2500000;
  const hasUnreadNotifications = true;

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden lg:block border-l bg-card transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">پنل ساکن</h1>
                <p className="text-xs text-muted-foreground">
                  {currentBuilding?.name || 'ساختمان'}
                </p>
              </div>
            )}
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
          <nav className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Main Menu */}
            <div className="space-y-2">
              {residentMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
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
            </div>

            {/* Community Section */}
            {sidebarOpen && (
              <div className="pt-2 border-t">
                <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">
                  انجمن همسایگان
                </p>
              </div>
            )}
            <div className="space-y-2">
              {communityMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
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
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start gap-2"
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
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
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
        <header className="border-b bg-card">
          <div className="flex items-center justify-between h-16 px-4 gap-4">
            {/* Left: Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Center: Building name & charge amount */}
            <div className="flex-1 flex items-center gap-4">
              <div className="hidden md:block">
                <h2 className="font-semibold text-sm">
                  {currentBuilding?.name || 'ساختمان'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  واحد {toPersianNumber(unitNumber)}
                </p>
              </div>
              <div className="mr-auto flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                <Receipt className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  شارژ فعلی: {toPersianNumber(currentChargeAmount.toLocaleString())} تومان
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Demo Badge */}
              {isDemoMode && (
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                  <Sparkles className="h-3 w-3 ml-1" />
                  دمو
                </Badge>
              )}
              
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => navigate('/resident/notifications')}
              >
                <Bell className="h-5 w-5" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
                )}
              </Button>

              {/* Theme toggle - desktop only */}
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden md:flex">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* User avatar */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate('/resident/profile')}
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:inline text-sm">
                  {displayName}
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-card z-50 lg:hidden shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h1 className="font-bold text-lg">پنل ساکن</h1>
                  <p className="text-xs text-muted-foreground">
                    {currentBuilding?.name || 'ساختمان'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Main Menu */}
                <div className="space-y-2">
                  {residentMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Community Section */}
                <div className="pt-2 border-t">
                  <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">
                    انجمن همسایگان
                  </p>
                  <div className="space-y-2">
                    {communityMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted'
                          )}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="border-t p-3 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start gap-2"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="text-xs">{theme === 'dark' ? 'روشن' : 'تاریک'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-xs">خروج</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
