import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  CreditCard,
  Receipt,
  Wrench,
  Megaphone,
  Trophy,
  Flame,
  Star,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockUsers, mockCharges, mockAnnouncements, badges as badgeDefinitions } from '@/data/mockData';
import { persianMonths } from '@/lib/persian';
import { toPersianNumber, formatPrice, getRelativeTime } from '@/lib/persian';

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const currentUser = mockUsers[1]; // Resident user
  const currentCharge = mockCharges[0];
  const chargePerUnit = Math.ceil(currentCharge.totalAmount / 8);

  const daysRemaining = 8;
  const totalDays = 20;
  const progressPercent = ((totalDays - daysRemaining) / totalDays) * 100;

  const userBadges = currentUser.badges.map(
    (badgeId) => badgeDefinitions.find((b) => b.id === badgeId)!
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary ring-offset-2">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">واحد ۱۰۱ • برج آسمان</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser.paymentStreak > 0 && (
              <Badge variant="gold" className="gap-1">
                <Flame className="h-3 w-3" />
                {toPersianNumber(currentUser.paymentStreak)} ماه
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold">سلام، {currentUser.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground">
            وضعیت شارژ و اطلاعات ساختمان خود را مشاهده کنید
          </p>
        </div>

        {/* Current Charge Card */}
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-bl from-primary/5 via-transparent to-transparent animate-scale-in">
          <div className="absolute top-0 left-0 h-full w-1 bg-primary" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="warning" className="gap-1">
                <Clock className="h-3 w-3" />
                {toPersianNumber(daysRemaining)} روز مانده
              </Badge>
              <span className="text-sm text-muted-foreground">
                {persianMonths[currentCharge.month - 1]} {toPersianNumber(currentCharge.year)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-1">مبلغ شارژ این ماه</p>
              <p className="text-4xl font-bold text-primary">
                {formatPrice(chargePerUnit)}
              </p>
            </div>

            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              مهلت پرداخت: {toPersianNumber(20)} {persianMonths[currentCharge.month - 1]}
            </p>

            <Button size="lg" className="w-full gap-2" variant="hero" onClick={() => navigate('/resident/pay')}>
              <CreditCard className="h-5 w-5" />
              پرداخت آنلاین
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="gap-2" onClick={() => navigate('/resident/charges')}>
                <Receipt className="h-4 w-4" />
                جزئیات شارژ
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => navigate('/resident/pay')}>
                <Wallet className="h-4 w-4" />
                کارت به کارت
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gamification Section */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-accent" />
                دستاوردهای من
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                لیگ ساکنین
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
                  <Trophy className="h-6 w-6 text-amber-950" />
                </div>
                <div>
                  <p className="font-bold">ساکن نقره‌ای</p>
                  <p className="text-xs text-muted-foreground">
                    {toPersianNumber(4)} ماه تا طلایی شدن
                  </p>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-accent">
                  <Flame className="h-4 w-4" />
                  <span className="font-bold">{toPersianNumber(currentUser.paymentStreak)}</span>
                </div>
                <p className="text-xs text-muted-foreground">استریک پرداخت</p>
              </div>
            </div>

            {userBadges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {userBadges.map((badge) => (
                  <Badge
                    key={badge.id}
                    variant={badge.id as any}
                    className="gap-1 px-3 py-1"
                  >
                    <span>{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="card-hover cursor-pointer" onClick={() => navigate('/resident/history')}>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">تاریخچه پرداخت</span>
            </CardContent>
          </Card>
          <Card className="card-hover cursor-pointer" onClick={() => navigate('/resident/requests')}>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Wrench className="h-6 w-6 text-warning" />
              </div>
              <span className="text-sm font-medium">درخواست تعمیرات</span>
            </CardContent>
          </Card>
          <Card className="card-hover cursor-pointer" onClick={() => navigate('/resident/messages')}>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <MessageSquare className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-sm font-medium">پیام به مدیر</span>
            </CardContent>
          </Card>
          <Card className="card-hover cursor-pointer" onClick={() => navigate('/community/marketplace')}>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">بازارچه همسایگی</span>
            </CardContent>
          </Card>
        </div>

        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="h-5 w-5 text-primary" />
              اطلاعیه‌ها
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              همه
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAnnouncements.slice(0, 2).map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  announcement.priority === 'high' ? 'bg-destructive' :
                  announcement.priority === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{announcement.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRelativeTime(announcement.createdAt)}
                  </p>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">آمار پرداخت‌های من</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-success/10 p-3">
                <p className="text-2xl font-bold text-success">{toPersianNumber(12)}</p>
                <p className="text-xs text-muted-foreground">پرداخت موفق</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="text-2xl font-bold text-primary">{toPersianNumber(8)}</p>
                <p className="text-xs text-muted-foreground">ماه استریک</p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <p className="text-2xl font-bold text-accent">{toPersianNumber(3)}</p>
                <p className="text-xs text-muted-foreground">جایزه</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">جمع پرداخت‌های امسال</span>
                <span className="font-bold">{formatPrice(5400000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">میانگین زمان پرداخت</span>
                <span className="font-medium text-success">{toPersianNumber(3)} روز زودتر از موعد</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Wallet, label: 'خانه', active: true },
            { icon: Receipt, label: 'پرداخت', active: false },
            { icon: Wrench, label: 'درخواست', active: false },
            { icon: Megaphone, label: 'اعلان', active: false },
            { icon: Star, label: 'پروفایل', active: false },
          ].map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
