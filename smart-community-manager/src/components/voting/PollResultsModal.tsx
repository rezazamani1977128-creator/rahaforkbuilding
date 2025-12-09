import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Download } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { toPersianNumber } from '@/lib/utils';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isAnonymous: boolean;
  status: 'active' | 'closed' | 'draft';
}

interface PollResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poll: Poll;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function PollResultsModal({
  open,
  onOpenChange,
  poll,
}: PollResultsModalProps) {
  const getTotalVotes = () => {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const totalVotes = getTotalVotes();

  const chartData = poll.options.map(opt => ({
    name: opt.text,
    votes: opt.votes,
    percentage: totalVotes > 0 ? ((opt.votes / totalVotes) * 100) : 0,
  }));

  const CustomTooltip = (props: TooltipProps<number, string>) => {
    if (props.active && props.payload && props.payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-semibold">{props.payload[0].name}</p>
          <p className="text-sm">
            {toPersianNumber(props.payload[0].value)} رای
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{poll.question}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {poll.isAnonymous && (
              <Badge variant="outline">ناشناس</Badge>
            )}
            <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
              {poll.status === 'active' ? 'فعال' : 'بسته شده'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {toPersianNumber(totalVotes)}
                </p>
                <p className="text-muted-foreground">مجموع رأی</p>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>توزیع رأی‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              {totalVotes > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${toPersianNumber(percentage.toFixed(1))}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="votes"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  هنوز رأی دریافت نشده است
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>مقایسه رأی‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              {totalVotes > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="votes" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  هنوز رأی دریافت نشده است
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تفصیل رأی‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-semibold">
                        {toPersianNumber(item.votes)} رای ({toPersianNumber(item.percentage.toFixed(1))}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t pt-6">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              دانلود نتایج
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              اشتراک
            </Button>
            <Button onClick={() => onOpenChange(false)}>بستن</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
