import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  CreditCard,
  PiggyBank,
  FileText,
  Megaphone,
  Vote,
  Wrench,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: 'داشبورد', icon: LayoutDashboard, href: '/manager/dashboard' },
  { title: 'واحدها', icon: Building2, href: '/manager/units' },
  { title: 'ساکنین', icon: Users, href: '/manager/residents' },
  { title: 'شارژ ماهانه', icon: Receipt, href: '/manager/charges' },
  { title: 'پرداخت‌ها', icon: CreditCard, href: '/manager/payments', badge: '۲' },
  { title: 'هزینه‌ها', icon: BarChart3, href: '/manager/expenses' },
  { title: 'صندوق ساختمان', icon: PiggyBank, href: '/manager/fund' },
];

const communityNavItems: NavItem[] = [
  { title: 'اطلاعیه‌ها', icon: Megaphone, href: '/manager/announcements' },
  { title: 'رأی‌گیری', icon: Vote, href: '/manager/polls' },
  { title: 'درخواست تعمیرات', icon: Wrench, href: '/manager/requests', badge: '۳' },
  { title: 'اسناد', icon: FolderOpen, href: '/manager/documents' },
];

const bottomNavItems: NavItem[] = [
  { title: 'گزارشات', icon: FileText, href: '/manager/reports' },
  { title: 'تنظیمات', icon: Settings, href: '/manager/settings' },
  { title: 'راهنما', icon: HelpCircle, href: '/manager/help' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    const content = (
      <NavLink
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          isCollapsed && 'justify-center px-2'
        )}
        onClick={() => window.innerWidth < 768 && onClose()}
        dir="rtl"
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-right">{item.title}</span>
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2" dir="rtl">
            {item.title}
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full flex-col border-l bg-sidebar transition-all duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:z-30',
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64'
        )}
        dir="rtl"
      >
        {/* Logo for mobile */}
        <div className="flex h-16 items-center justify-between border-b px-4 md:hidden" dir="rtl">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ساختمان من</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {/* Main Section */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground text-right">
                  مدیریت
                </p>
              )}
              {mainNavItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>

            {/* Community Section */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground text-right">
                  جامعه
                </p>
              )}
              {communityNavItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>

            {/* Bottom Section */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground text-right">
                  سیستم
                </p>
              )}
              {bottomNavItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>
          </nav>
        </ScrollArea>

        {/* Collapse Button */}
        <div className="hidden border-t p-3 md:block">
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            className={cn('w-full', !isCollapsed && 'justify-start gap-2')}
            onClick={() => setIsCollapsed(!isCollapsed)}
            dir="rtl"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>جمع کردن</span>
              </>
            )}
          </Button>
        </div>

        {/* Logout Button */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            className={cn(
              'w-full text-destructive hover:bg-destructive/10 hover:text-destructive',
              !isCollapsed && 'justify-start gap-2'
            )}
            onClick={handleLogout}
            dir="rtl"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>خروج</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
