import { useState } from 'react';
import { Vote, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { mockPolls } from '@/data/mockData';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ResidentVotingPage() {
  const { toast } = useToast();
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePolls = mockPolls.filter(p => p.deadline > new Date());
  const closedPolls = mockPolls.filter(p => p.deadline <= new Date());

  const handleVoteClick = (poll: any) => {
    setSelectedPoll(poll);
    setSelectedOptions([]);
    setVoteModalOpen(true);
  };

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) {
      toast({
        title: 'خطا',
        description: 'لطفاً حداقل یک گزینه را انتخاب کنید',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setVotedPolls(new Set(votedPolls).add(selectedPoll.id));
    toast({
      title: 'موفق',
      description: 'رأی شما با موفقیت ثبت شد',
    });
    
    setIsSubmitting(false);
    setVoteModalOpen(false);
  };

  const getTotalVotes = (poll: any) => {
    return poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${toPersianNumber(days)} روز`;
    if (hours > 0) return `${toPersianNumber(hours)} ساعت`;
    return 'کمتر از یک ساعت';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">رأی‌گیری</h1>
        <p className="text-muted-foreground mt-1">
          مشارکت در تصمیم‌گیری‌های ساختمان
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2" dir="rtl">
          <TabsTrigger value="active">
            نظرسنجی‌های فعال ({toPersianNumber(activePolls.length)})
          </TabsTrigger>
          <TabsTrigger value="results">
            نتایج قبلی ({toPersianNumber(closedPolls.length)})
          </TabsTrigger>
        </TabsList>

        {/* Active Polls */}
        <TabsContent value="active" className="space-y-4 mt-6" dir="rtl">
          {activePolls.length > 0 ? (
            activePolls.map((poll) => {
              const hasVoted = votedPolls.has(poll.id);
              const totalVotes = getTotalVotes(poll);

              return (
                <Card key={poll.id} dir="rtl">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-row-reverse">
                      <div className="flex-1 text-right">
                        <CardTitle className="text-lg">{poll.question}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 flex-row-reverse">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            <Clock className="ml-1 h-3 w-3" />
                            {getTimeRemaining(poll.deadline)} باقی مانده
                          </Badge>
                          {poll.isAnonymous && (
                            <Badge variant="outline">ناشناس</Badge>
                          )}
                          {hasVoted && (
                            <Badge className="bg-primary/10 text-primary">
                              <CheckCircle2 className="ml-1 h-3 w-3" />
                              شما رأی دادید
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!hasVoted ? (
                      <Button onClick={() => handleVoteClick(poll)} className="w-full">
                        <Vote className="ml-2 h-4 w-4" />
                        ثبت رأی
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        {poll.options.map((option: any) => {
                          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                          return (
                            <div key={option.id} className="space-y-2">
                              <div className="flex items-center justify-between text-sm flex-row-reverse">
                                <span className="font-semibold">
                                  {toPersianNumber(percentage.toFixed(1))}٪
                                </span>
                                <span>{option.text}</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                        <p className="text-sm text-muted-foreground text-center">
                          مجموع {toPersianNumber(totalVotes)} رأی
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Vote className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">نظرسنجی فعالی وجود ندارد</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Previous Results */}
        <TabsContent value="results" className="space-y-4 mt-6" dir="rtl">
          {closedPolls.length > 0 ? (
            closedPolls.map((poll) => {
              const totalVotes = getTotalVotes(poll);
              const winner = poll.options.reduce((prev: any, current: any) => 
                current.votes > prev.votes ? current : prev
              );

              return (
                <Card key={poll.id} dir="rtl">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-row-reverse">
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                        بسته شده
                      </Badge>
                      <CardTitle className="text-lg text-right">{poll.question}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {poll.options.map((option: any) => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                        const isWinner = option.id === winner.id;
                        
                        return (
                          <div key={option.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm flex-row-reverse">
                              <span className="font-semibold">
                                {toPersianNumber(option.votes)} رأی ({toPersianNumber(percentage.toFixed(1))}٪)
                              </span>
                              <div className="flex items-center gap-2 flex-row-reverse">
                                {isWinner && (
                                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                                    برنده
                                  </Badge>
                                )}
                                <span className={isWinner ? 'font-bold' : ''}>{option.text}</span>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-3 border-t flex items-center justify-between text-sm text-muted-foreground flex-row-reverse">
                      <span>بسته شده: {formatPersianDate(poll.deadline)}</span>
                      <span>مجموع {toPersianNumber(totalVotes)} رأی</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">نتیجه‌ای برای نمایش وجود ندارد</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Vote Modal */}
      {selectedPoll && (
        <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">ثبت رأی</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6" dir="rtl">
              <div className="text-right">
                <h3 className="font-semibold mb-4">{selectedPoll.question}</h3>
                
                {selectedPoll.isAnonymous && (
                  <Badge variant="outline" className="mb-4">
                    رأی‌گیری ناشناس
                  </Badge>
                )}

                {/* Single choice */}
                {!selectedPoll.allowMultiple ? (
                  <RadioGroup
                    value={selectedOptions[0]}
                    onValueChange={(value) => setSelectedOptions([value])}
                  >
                    <div className="space-y-3">
                      {selectedPoll.options.map((option: any) => (
                        <div key={option.id} className="flex items-center gap-2 flex-row-reverse">
                          <Label htmlFor={option.id} className="cursor-pointer flex-1 text-right">
                            {option.text}
                          </Label>
                          <RadioGroupItem value={option.id} id={option.id} />
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  /* Multiple choice */
                  <div className="space-y-3">
                    {selectedPoll.options.map((option: any) => (
                      <div key={option.id} className="flex items-center gap-2 flex-row-reverse">
                        <Label htmlFor={option.id} className="cursor-pointer flex-1 text-right">
                          {option.text}
                        </Label>
                        <Checkbox
                          id={option.id}
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOptions([...selectedOptions, option.id]);
                            } else {
                              setSelectedOptions(selectedOptions.filter(id => id !== option.id));
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setVoteModalOpen(false)}
                  disabled={isSubmitting}
                >
                  انصراف
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitVote}
                  disabled={isSubmitting || selectedOptions.length === 0}
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت رأی'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
