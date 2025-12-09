import { Link } from 'react-router-dom';
import {
  Target,
  ChevronRight,
  Clock,
  Users,
  Flame,
  Trophy,
  Check,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toPersianNumber } from '@/lib/persian';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  goal: number;
  reward: number;
  participants: number;
  endsIn: string;
  completed?: boolean;
}

const activeChallenges: Challenge[] = [
  {
    id: '1',
    title: 'پرداخت زودتر از موعد',
    description: 'شارژ این ماه را قبل از روز ۵ام پرداخت کنید',
    icon: <Clock className="h-6 w-6" />,
    progress: 0,
    goal: 1,
    reward: 100,
    participants: 12,
    endsIn: '۵ روز',
  },
  {
    id: '2',
    title: 'استریک ۳ ماهه',
    description: 'سه ماه متوالی به موقع پرداخت کنید',
    icon: <Flame className="h-6 w-6" />,
    progress: 2,
    goal: 3,
    reward: 200,
    participants: 8,
    endsIn: '۲۸ روز',
  },
  {
    id: '3',
    title: 'رأی‌دهنده فعال',
    description: 'در ۳ رأی‌گیری شرکت کنید',
    icon: <Users className="h-6 w-6" />,
    progress: 1,
    goal: 3,
    reward: 75,
    participants: 15,
    endsIn: '۱۴ روز',
  },
];

const completedChallenges: Challenge[] = [
  {
    id: '4',
    title: 'اولین پرداخت',
    description: 'اولین شارژ خود را پرداخت کنید',
    icon: <Check className="h-6 w-6" />,
    progress: 1,
    goal: 1,
    reward: 50,
    participants: 24,
    endsIn: '',
    completed: true,
  },
];

export default function Challenges() {
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
          <h1 className="text-lg font-semibold">چالش‌ها</h1>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <CardContent className="p-4">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{toPersianNumber(3)}</p>
              <p className="text-xs text-muted-foreground">فعال</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">{toPersianNumber(5)}</p>
              <p className="text-xs text-muted-foreground">تکمیل شده</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Star className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{toPersianNumber(425)}</p>
              <p className="text-xs text-muted-foreground">امتیاز کسب شده</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Challenges */}
        <div>
          <h2 className="text-lg font-semibold mb-4">چالش‌های فعال</h2>
          <div className="space-y-3">
            {activeChallenges.map((challenge) => {
              const progressPercent = (challenge.progress / challenge.goal) * 100;
              return (
                <Card key={challenge.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        {challenge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{challenge.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {challenge.description}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            <Clock className="h-3 w-3 ml-1" />
                            {challenge.endsIn}
                          </Badge>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              پیشرفت: {toPersianNumber(challenge.progress)}/{toPersianNumber(challenge.goal)}
                            </span>
                            <span className="font-medium">
                              {toPersianNumber(Math.round(progressPercent))}٪
                            </span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {toPersianNumber(challenge.participants)} شرکت‌کننده
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Star className="h-3 w-3 text-accent" />
                            +{toPersianNumber(challenge.reward)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Completed Challenges */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-5 w-5 text-success" />
              تکمیل شده
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center gap-3 rounded-lg bg-success/10 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Check className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{challenge.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
                <Badge variant="success" className="gap-1">
                  +{toPersianNumber(challenge.reward)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
