import { useState, useMemo } from 'react';
import { Plus, BarChart3, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockPolls } from '@/data/mockData';
import { formatPersianDate, toPersianNumber } from '@/lib/utils';
import { CreatePollModal } from '@/components/voting/CreatePollModal';
import { PollResultsModal } from '@/components/voting/PollResultsModal';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters?: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  deadline: Date;
  isAnonymous: boolean;
  createdBy: string;
  createdAt: Date;
  status: 'active' | 'closed' | 'draft';
}

export function VotingPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [polls, setPolls] = useState<Poll[]>(() =>
    mockPolls.map((p) => ({
      ...p,
      status: p.deadline < new Date() ? 'closed' : 'active',
      createdBy: 'مدیر ساختمان',
    }))
  );

  const activePolls = useMemo(() => polls.filter(p => p.status === 'active'), [polls]);
  const closedPolls = useMemo(() => polls.filter(p => p.status === 'closed'), [polls]);
  const draftPolls = useMemo(() => polls.filter(p => p.status === 'draft'), [polls]);

  const getPollsForTab = () => {
    switch (activeTab) {
      case 'active':
        return activePolls;
      case 'closed':
        return closedPolls;
      case 'draft':
        return draftPolls;
      default:
        return [];
    }
  };

  const handleCreatePoll = (data: any) => {
    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      question: data.question,
      options: data.options.map((opt: string, idx: number) => ({
        id: `opt-${idx}`,
        text: opt,
        votes: 0,
      })),
      deadline: new Date(data.deadline),
      isAnonymous: data.isAnonymous,
      createdBy: 'مدیر ساختمان',
      createdAt: new Date(),
      status: data.isDraft ? 'draft' : 'active',
    };
    setPolls(prev => [newPoll, ...prev]);
    setCreateModalOpen(false);
  };

  const handleClosePoll = (pollId: string) => {
    setPolls(prev =>
      prev.map(p =>
        p.id === pollId ? { ...p, status: 'closed' } : p
      )
    );
  };

  const handleDeletePoll = (pollId: string) => {
    setPolls(prev => prev.filter(p => p.id !== pollId));
  };

  const calculateTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = new Date(deadline).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${toPersianNumber(days)} روز`;
    }
    return `${toPersianNumber(hours)} ساعت`;
  };

  const getTotalVotes = (poll: Poll) => {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const getPollCard = (poll: Poll) => (
    <Card key={poll.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="pt-6" dir="rtl">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 text-right">
              <h3 className="font-semibold text-lg mb-2">{poll.question}</h3>
              <div className="flex items-center gap-2 flex-wrap justify-start">
                <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                  {poll.status === 'active' ? 'فعال' : poll.status === 'closed' ? 'بسته شده' : 'پیش‌نویس'}
                </Badge>
                {poll.isAnonymous && (
                  <Badge variant="outline">ناشناس</Badge>
                )}
              </div>
            </div>
            {poll.status === 'active' && (
              <div className="text-left text-sm">
                <p className="font-semibold text-blue-600">{calculateTimeRemaining(poll.deadline)}</p>
                <p className="text-xs text-muted-foreground">باقی مانده</p>
              </div>
            )}
          </div>

          {/* Options with bar visualization */}
          <div className="space-y-3">
            {poll.options.map(option => {
              const totalVotes = getTotalVotes(poll);
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-right flex-1">{option.text}</span>
                    <span className="font-semibold text-left">
                      {toPersianNumber(option.votes)} رای ({toPersianNumber(percentage.toFixed(1))}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden" dir="ltr">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
            <span className="text-right">
              {toPersianNumber(getTotalVotes(poll))} رای از 24 نفر
            </span>
            <span className="text-left">{formatPersianDate(new Date(poll.createdAt))}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPoll(poll);
                setResultsModalOpen(true);
              }}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              نتایج
            </Button>
            {poll.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleClosePoll(poll.id)}
              >
                بستن رأی‌گیری
              </Button>
            )}
            {poll.status === 'draft' && (
              <Button variant="outline" size="sm">
                انتشار
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeletePoll(poll.id)}
            >
              حذف
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">رأی‌گیری</h1>
          <p className="text-muted-foreground mt-1">
            {toPersianNumber(polls.length)} رأی‌گیری در سیستم
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          رأی‌گیری جدید
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3" dir="rtl">
          <TabsTrigger value="active">
            فعال ({toPersianNumber(activePolls.length)})
          </TabsTrigger>
          <TabsTrigger value="closed">
            بسته شده ({toPersianNumber(closedPolls.length)})
          </TabsTrigger>
          <TabsTrigger value="draft">
            پیش‌نویس ({toPersianNumber(draftPolls.length)})
          </TabsTrigger>
        </TabsList>

        {['active', 'closed', 'draft'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
            {getPollsForTab().length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">رأی‌گیری‌ای یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {getPollsForTab().map(getPollCard)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modals */}
      <CreatePollModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreatePoll}
      />

      {selectedPoll && (
        <PollResultsModal
          open={resultsModalOpen}
          onOpenChange={setResultsModalOpen}
          poll={selectedPoll}
        />
      )}
    </div>
  );
}
