import { Bell, Moon, Search, Sun, Menu, Building2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { SearchModal } from '@/components/search/SearchModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockNotifications, mockBuildings, mockUsers } from '@/data/mockData';
import { toPersianNumber, getRelativeTime } from '@/lib/persian';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentBuilding, buildings, selectBuilding } = useAuth();
  const currentUser = mockUsers[0]; // Manager
  const unreadNotifications = mockNotifications.filter((n) => !n.isRead);
  
  const handleBuildingSelect = (buildingId: string) => {
    selectBuilding(buildingId);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Building Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden text-right md:block">
                  <p className="text-sm font-medium">{currentBuilding.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {toPersianNumber(currentBuilding.units)} واحد
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>ساختمان‌های من</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(buildings.length > 0 ? buildings : mockBuildings).map((building) => (
                <DropdownMenuItem 
                  key={building.id} 
                  className="gap-2 cursor-pointer"
                  onClick={() => handleBuildingSelect(building.id)}
                >
                  <Building2 className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{building.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {toPersianNumber(building.unitsCount || building.units || 0)} واحد
                    </p>
                  </div>
                  {currentBuilding?.id === building.id && (
                    <span className="mr-auto text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-primary">
                + افزودن ساختمان جدید
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {toPersianNumber(unreadNotifications.length)}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                اعلان‌ها
                <Badge variant="secondary" className="text-xs">
                  {toPersianNumber(unreadNotifications.length)} جدید
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {mockNotifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem asChild key={notification.id}>
                    <Link 
                      to="/manager/notifications"
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                        !notification.isRead ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/manager/notifications" className="justify-center text-primary cursor-pointer">
                  مشاهده همه اعلان‌ها
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-right md:block">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">مدیر ساختمان</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/manager/settings">پروفایل من</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/manager/settings">تنظیمات</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/manager/help">راهنما</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                  className="w-full text-left text-destructive cursor-pointer"
                >
                  خروج از حساب
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
  </>
  );
}
