import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Flame,
  Star,
  Medal,
  Lock,
  CheckCircle2,
  ChevronRight,
  Crown,
  Target,
  Zap,
  Heart,
  Users,
  Calendar,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toPersianNumber, formatPrice } from '@/lib/persian';
import { cn } from '@/lib/utils';

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  category: 'payment' | 'community' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const allBadges: BadgeItem[] = [
  // Payment badges
  { id: 'streak_1', name: 'شروع خوب', icon: '🎯', description: 'اولین پرداخت به موقع', unlocked: true, category: 'payment', rarity: 'common' },
  { id: 'streak_3', name: 'ساکن برنزی', icon: '🥉', description: '۳ ماه پرداخت متوالی', unlocked: true, category: 'payment', rarity: 'common' },
  { id: 'streak_6', name: 'ساکن نقره‌ای', icon: '🥈', description: '۶ ماه پرداخت متوالی', unlocked: true, category: 'payment', rarity: 'rare' },
  { id: 'streak_12', name: 'ساکن طلایی', icon: '🥇', description: '۱۲ ماه پرداخت متوالی', unlocked: false, progress: 75, category: 'payment', rarity: 'epic' },
  { id: 'early_bird', name: 'پیشقدم', icon: '🐦', description: 'پرداخت قبل از موعد', unlocked: true, category: 'payment', rarity: 'common' },
  { id: 'lightning', name: 'برق‌آسا', icon: '⚡', description: 'پرداخت در ۲۴ ساعت اول', unlocked: false, category: 'payment', rarity: 'rare' },
  { id: 'perfect_year', name: 'سال بی‌نقص', icon: '✨', description: 'یک سال کامل بدون تأخیر', unlocked: false, category: 'payment', rarity: 'legendary' },

  // Community badges
  { id: 'neighbor', name: 'همسایه خوب', icon: '🤝', description: 'کمک به همسایه', unlocked: true, category: 'community', rarity: 'common' },
  { id: 'voter', name: 'رأی‌دهنده', icon: '🗳️', description: 'شرکت در رأی‌گیری', unlocked: true, category: 'community', rarity: 'common' },
  { id: 'event_host', name: 'میزبان', icon: '🎉', description: 'برگزاری رویداد', unlocked: false, category: 'community', rarity: 'rare' },
  { id: 'helper', name: 'یاریگر', icon: '💪', description: 'کمک در ۵ درخواست', unlocked: false, progress: 60, category: 'community', rarity: 'rare' },
  { id: 'welcomer', name: 'خوشامدگو', icon: '👋', description: 'خوشامدگویی به همسایه جدید', unlocked: false, category: 'community', rarity: 'common' },

  // Special badges
  { id: 'early_adopter', name: 'پیشگام', icon: '🚀', description: 'از اولین کاربران', unlocked: true, category: 'special', rarity: 'epic' },
  { id: 'feedback', name: 'نقاد', icon: '💬', description: 'ارسال بازخورد', unlocked: false, category: 'special', rarity: 'common' },
  { id: 'vip', name: 'VIP', icon: '👑', description: 'ساکن ممتاز', unlocked: false, category: 'special', rarity: 'legendary' },
];

const rarityColors = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  epic: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  legendary: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950',
};

export default function BadgesPage() {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const unlockedCount = allBadges.filter(b => b.unlocked).length;
  const totalCount = allBadges.length;

  const paymentBadges = allBadges.filter(b => b.category === 'payment');
  const communityBadges = allBadges.filter(b => b.category === 'community');
  const specialBadges = allBadges.filter(b => b.category === 'special');

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
          <h1 className="text-lg font-semibold">نشان‌ها و دستاوردها</h1>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats Overview */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-l from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">نشان‌های کسب شده</p>
                <p className="text-3xl font-bold">
                  {toPersianNumber(unlockedCount)} از {toPersianNumber(totalCount)}
                </p>
              </div>
              <Trophy className="h-12 w-12 opacity-80" />
            </div>
            <Progress 
              value={(unlockedCount / totalCount) * 100} 
              className="mt-4 h-2 bg-primary-foreground/20"
            />
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="payment">پرداخت</TabsTrigger>
            <TabsTrigger value="community">جامعه</TabsTrigger>
            <TabsTrigger value="special">ویژه</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <BadgeGrid badges={allBadges} onSelect={setSelectedBadge} />
          </TabsContent>
          <TabsContent value="payment" className="mt-4">
            <BadgeGrid badges={paymentBadges} onSelect={setSelectedBadge} />
          </TabsContent>
          <TabsContent value="community" className="mt-4">
            <BadgeGrid badges={communityBadges} onSelect={setSelectedBadge} />
          </TabsContent>
          <TabsContent value="special" className="mt-4">
            <BadgeGrid badges={specialBadges} onSelect={setSelectedBadge} />
          </TabsContent>
        </Tabs>

        {/* Recently Earned */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">اخیراً کسب شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allBadges.filter(b => b.unlocked).slice(0, 5).map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 min-w-[80px]"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[10px] text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function BadgeGrid({ 
  badges, 
  onSelect 
}: { 
  badges: BadgeItem[]; 
  onSelect: (badge: BadgeItem) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {badges.map((badge) => (
        <Card
          key={badge.id}
          className={cn(
            'cursor-pointer transition-all relative overflow-hidden',
            badge.unlocked 
              ? 'hover:shadow-lg hover:-translate-y-1' 
              : 'opacity-60 grayscale'
          )}
          onClick={() => onSelect(badge)}
        >
          <CardContent className="p-4 text-center">
            <div className="relative">
              <span className="text-3xl block mb-2">{badge.icon}</span>
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-xs font-medium truncate">{badge.name}</p>
            {badge.progress !== undefined && !badge.unlocked && (
              <div className="mt-2">
                <Progress value={badge.progress} className="h-1" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {toPersianNumber(badge.progress)}٪
                </p>
              </div>
            )}
            {badge.unlocked && (
              <CheckCircle2 className="absolute top-2 left-2 h-4 w-4 text-success" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
