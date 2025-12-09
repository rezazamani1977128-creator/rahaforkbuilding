import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Wrench,
  Megaphone,
  TrendingUp,
  Clock,
  AlertCircle,
  Flame,
  ChevronLeft,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockAnnouncements, mockPolls, mockMaintenanceRequests } from '@/data/mockData';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';

export function ResidentDashboard() {
  const navigate = useNavigate();
  const [userName] = useState('علی محمدی');
  const [unitNumber] = useState('201');

  // Mock current charge data
  const currentCharge = {
    amount: 2500000,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: 'pending' as const,
    month: 'آذر',
    year: 1403,
  };

  // Payment streak data
  const paymentStreak = {
    currentStreak: 5,
    nextRewardAt: 6,
    pointsEarned: 250,
  };

  // Calculate days until due
  const daysUntilDue = Math.ceil((currentCharge.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Get status color and text
  const getStatusDisplay = () => {
    if (daysUntilDue < 0) {
      return { color: 'text-destructive bg-destructive/10', text: 'معوق' };
    } else if (daysUntilDue <= 3) {
      return { color: 'text-orange-500 bg-orange-500/10', text: 'فوری' };
    } else {
      return { color: 'text-primary bg-primary/10', text: 'در انتظار پرداخت' };
    }
  };

  const statusDisplay = getStatusDisplay();

  // Recent announcements (last 3)
  const recentAnnouncements = mockAnnouncements.slice(0, 3);

  // Active polls that user hasn't voted on
  const activePolls = mockPolls.filter(p => p.deadline > new Date()).slice(0, 2);

  // Recent requests
  const myRecentRequests = mockMaintenanceRequests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          سلام، {userName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          واحد {toPersianNumber(unitNumber)} - {formatPersianDate(new Date())}
        </p>
      </div>

      {/* Current Charge Card - PROMINENT */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">شارژ {currentCharge.month} {toPersianNumber(currentCharge.year)}</CardTitle>
              <CardDescription className="text-base mt-1">
                سررسید: {formatPersianDate(currentCharge.dueDate)}
              </CardDescription>
            </div>
            <Badge className={statusDisplay.color}>
              {statusDisplay.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {toPersianNumber(currentCharge.amount.toLocaleString())}
            </span>
            <span className="text-xl text-muted-foreground">تومان</span>
          </div>

          {daysUntilDue > 0 ? (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {toPersianNumber(daysUntilDue)} روز تا سررسید
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {toPersianNumber(Math.abs(daysUntilDue))} روز از سررسید گذشته است
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button size="lg" className="w-full" onClick={() => navigate('/resident/pay')}>
              <CreditCard className="ml-2 h-5 w-5" />
              پرداخت آنلاین
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/resident/charges')}>
              جزئیات شارژ
              <ChevronLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Streak Card */}
      <Card className="border-orange-500/50 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {toPersianNumber(paymentStreak.currentStreak)} ماه
                </h3>
                <p className="text-sm text-muted-foreground">پرداخت به موقع!</p>
                <p className="text-xs text-orange-500 mt-1">
                  {toPersianNumber(paymentStreak.pointsEarned)} امتیاز کسب کرده‌اید 🎉
                </p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-2">
                تا پاداش بعدی:
              </p>
              <Progress 
                value={(paymentStreak.currentStreak / paymentStreak.nextRewardAt) * 100} 
                className="w-32 h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {toPersianNumber(paymentStreak.currentStreak)}/{toPersianNumber(paymentStreak.nextRewardAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/resident/pay')}>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">پرداخت شارژ</h3>
            <p className="text-sm text-muted-foreground">پرداخت سریع و آسان</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/resident/requests')}>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold">ثبت درخواست</h3>
            <p className="text-sm text-muted-foreground">درخواست تعمیرات</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/resident/announcements')}>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold">اطلاعیه‌ها</h3>
            <p className="text-sm text-muted-foreground">مشاهده اطلاعیه‌ها</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              اطلاعیه‌های اخیر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate('/resident/announcements')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {announcement.content}
                    </p>
                  </div>
                  {announcement.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      مهم
                    </Badge>
                  )}
                  {announcement.priority === 'medium' && (
                    <Badge variant="secondary" className="text-xs">
                      متوسط
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatPersianDate(announcement.createdAt)}
                </p>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => navigate('/resident/announcements')}
            >
              مشاهده همه
              <ChevronLeft className="mr-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Active Polls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              رأی‌گیری‌های فعال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePolls.length > 0 ? (
              <>
                {activePolls.map((poll) => (
                  <div 
                    key={poll.id} 
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/resident/voting')}
                  >
                    <h4 className="font-medium text-sm">{poll.question}</h4>
                    <p className="text-xs text-muted-foreground mt-2">
                      مهلت: {formatPersianDate(poll.deadline)}
                    </p>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/resident/voting')}
                >
                  مشاهده همه
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">رأی‌گیری فعالی وجود ندارد</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              درخواست‌های من
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myRecentRequests.length > 0 ? (
              <>
                {myRecentRequests.map((request) => {
                  const statusColors: Record<string, string> = {
                    new: 'bg-blue-500/10 text-blue-500',
                    in_progress: 'bg-orange-500/10 text-orange-500',
                    completed: 'bg-green-500/10 text-green-500',
                    cancelled: 'bg-gray-500/10 text-gray-500',
                  };

                  const statusLabels: Record<string, string> = {
                    new: 'جدید',
                    in_progress: 'در حال انجام',
                    completed: 'انجام شده',
                    cancelled: 'لغو شده',
                  };

                  return (
                    <div 
                      key={request.id} 
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate('/resident/requests')}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">{request.title}</h4>
                        <Badge className={statusColors[request.status]}>
                          {statusLabels[request.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatPersianDate(request.createdAt)}
                      </p>
                    </div>
                  );
                })}
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/resident/requests')}
                >
                  مشاهده همه
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">درخواستی ثبت نشده است</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Building Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              تماس سریع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">مدیر ساختمان</h4>
                <p className="text-xs text-muted-foreground">احمد رضایی</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href="tel:09121234567">{toPersianNumber('0912 123 4567')}</a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" className="flex-col h-auto py-2" asChild>
                <a href="tel:125">
                  <span className="text-lg font-bold">{toPersianNumber('125')}</span>
                  <span className="text-xs">آتش‌نشانی</span>
                </a>
              </Button>
              <Button size="sm" variant="outline" className="flex-col h-auto py-2" asChild>
                <a href="tel:110">
                  <span className="text-lg font-bold">{toPersianNumber('110')}</span>
                  <span className="text-xs">پلیس</span>
                </a>
              </Button>
              <Button size="sm" variant="outline" className="flex-col h-auto py-2" asChild>
                <a href="tel:115">
                  <span className="text-lg font-bold">{toPersianNumber('115')}</span>
                  <span className="text-xs">اورژانس</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
