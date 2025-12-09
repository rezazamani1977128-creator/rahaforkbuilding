import { Link } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Flame,
  ChevronRight,
  Crown,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toPersianNumber } from '@/lib/persian';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  name: string;
  unit: string;
  streak: number;
  points: number;
  isCurrentUser: boolean;
  change?: 'up' | 'down' | 'same';
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'زهرا حسینی', unit: '۲۰۲', streak: 24, points: 2400, isCurrentUser: false, change: 'same' },
  { rank: 2, name: 'محمد احمدی', unit: '۱۰۱', streak: 18, points: 1800, isCurrentUser: false, change: 'up' },
  { rank: 3, name: 'فاطمه محمدی', unit: '۱۰۲', streak: 15, points: 1500, isCurrentUser: false, change: 'down' },
  { rank: 4, name: 'علی رضایی', unit: '۳۰۱', streak: 12, points: 1200, isCurrentUser: true, change: 'up' },
  { rank: 5, name: 'مریم صادقی', unit: '۳۰۲', streak: 10, points: 1000, isCurrentUser: false, change: 'same' },
  { rank: 6, name: 'رضا موسوی', unit: '۴۰۱', streak: 8, points: 800, isCurrentUser: false, change: 'down' },
  { rank: 7, name: 'امیر نوروزی', unit: '۴۰۲', streak: 6, points: 600, isCurrentUser: false, change: 'up' },
  { rank: 8, name: 'حسین کریمی', unit: '۲۰۱', streak: 4, points: 400, isCurrentUser: false, change: 'same' },
];

const medalIcons = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function Leaderboard() {
  const currentUser = mockLeaderboard.find(e => e.isCurrentUser);
  const topThree = mockLeaderboard.slice(0, 3);
  const rest = mockLeaderboard.slice(3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/resident">
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">لیگ ساکنین</h1>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Your Position */}
        {currentUser && (
          <Card className="bg-gradient-to-l from-primary/10 to-transparent border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {toPersianNumber(currentUser.rank)}
                  </div>
                  <div>
                    <p className="font-medium">رتبه شما</p>
                    <p className="text-sm text-muted-foreground">
                      {toPersianNumber(currentUser.points)} امتیاز
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  +{toPersianNumber(2)} رتبه
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Filter */}
        <Tabs defaultValue="month">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="month">این ماه</TabsTrigger>
            <TabsTrigger value="year">امسال</TabsTrigger>
            <TabsTrigger value="all">کل</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 py-6">
          {/* 2nd Place */}
          <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Avatar className="h-16 w-16 mb-2 ring-4 ring-gray-300">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                {topThree[1]?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-2xl">🥈</span>
            <p className="text-sm font-medium mt-1">{topThree[1]?.name.split(' ')[0]}</p>
            <p className="text-xs text-muted-foreground">{toPersianNumber(topThree[1]?.points)} امتیاز</p>
            <div className="w-20 h-16 bg-gray-200 rounded-t-lg mt-2" />
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Crown className="h-6 w-6 text-amber-500 mb-1 animate-bounce-subtle" />
            <Avatar className="h-20 w-20 mb-2 ring-4 ring-amber-400">
              <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl">
                {topThree[0]?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-3xl">🥇</span>
            <p className="text-sm font-medium mt-1">{topThree[0]?.name.split(' ')[0]}</p>
            <p className="text-xs text-muted-foreground">{toPersianNumber(topThree[0]?.points)} امتیاز</p>
            <div className="w-20 h-24 bg-amber-200 rounded-t-lg mt-2" />
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Avatar className="h-14 w-14 mb-2 ring-4 ring-amber-600">
              <AvatarFallback className="bg-amber-100 text-amber-800 text-lg">
                {topThree[2]?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xl">🥉</span>
            <p className="text-sm font-medium mt-1">{topThree[2]?.name.split(' ')[0]}</p>
            <p className="text-xs text-muted-foreground">{toPersianNumber(topThree[2]?.points)} امتیاز</p>
            <div className="w-20 h-12 bg-amber-100 rounded-t-lg mt-2" />
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <Card>
          <CardContent className="p-0">
            {rest.map((entry, index) => (
              <div
                key={entry.rank}
                className={cn(
                  'flex items-center gap-4 p-4 border-b last:border-0 transition-colors',
                  entry.isCurrentUser && 'bg-primary/5'
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                  entry.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {toPersianNumber(entry.rank)}
                </div>

                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted">
                    {entry.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {entry.isCurrentUser ? 'شما' : entry.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    واحد {entry.unit}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      {toPersianNumber(entry.streak)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {toPersianNumber(entry.points)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Building Rank */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              رتبه ساختمان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {toPersianNumber(12)}
                </p>
                <p className="text-sm text-muted-foreground">
                  از {toPersianNumber(150)} ساختمان
                </p>
              </div>
              <div className="text-left">
                <Badge variant="success" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{toPersianNumber(5)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  این ماه
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
