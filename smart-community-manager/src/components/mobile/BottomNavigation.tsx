import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Wallet, PlusCircle, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toPersianNumber } from '@/lib/persian';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'خانه', href: '/dashboard' },
  { icon: Wallet, label: 'پرداخت', href: '/payments' },
  { icon: PlusCircle, label: 'درخواست', href: '/requests' },
  { icon: Users, label: 'انجمن', href: '/community' },
  { icon: User, label: 'پروفایل', href: '/profile' },
];

export function BottomNavigation() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-xl transition-transform duration-300 md:hidden',
      !isVisible && 'translate-y-full'
    )}>
      <div className="flex items-center justify-around py-2 px-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5', isActive && 'fill-primary/20')} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {toPersianNumber(item.badge)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
