import { Pin, ThumbsUp, MessageSquare, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toPersianNumber } from '@/lib/persian';
import type { Discussion } from '@/data/mockData';

interface DiscussionCardProps {
  discussion: Discussion;
  onClick: () => void;
}

const categoryLabels = {
  general: 'عمومی',
  suggestions: 'پیشنهاد',
  questions: 'سوال',
  offtopic: 'گفتگوی آزاد',
};

const categoryColors = {
  general: 'bg-blue-500/10 text-blue-500',
  suggestions: 'bg-green-500/10 text-green-500',
  questions: 'bg-orange-500/10 text-orange-500',
  offtopic: 'bg-purple-500/10 text-purple-500',
};

export function DiscussionCard({ discussion, onClick }: DiscussionCardProps) {
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${toPersianNumber(days)} روز پیش`;
    if (hours > 0) return `${toPersianNumber(hours)} ساعت پیش`;
    if (minutes > 0) return `${toPersianNumber(minutes)} دقیقه پیش`;
    return 'چند لحظه پیش';
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-shadow ${
        discussion.isPinned ? 'border-primary/50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {discussion.isPinned && (
                    <Pin className="h-4 w-4 text-primary" />
                  )}
                  <h3 className="font-semibold">{discussion.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {discussion.content}
                </p>
              </div>
              <Badge className={categoryColors[discussion.category]}>
                {categoryLabels[discussion.category]}
              </Badge>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>
                  {discussion.authorName} • واحد {toPersianNumber(discussion.authorUnit)}
                </span>
                <span>{getRelativeTime(discussion.updatedAt)}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{toPersianNumber(discussion.replies.length)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{toPersianNumber(discussion.likes.length)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
