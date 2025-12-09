import { useState } from 'react';
import { ThumbsUp, Share2, Flag, Edit, Trash2, User, Send, Reply } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Discussion, DiscussionReply } from '@/data/mockData';

interface DiscussionThreadProps {
  discussion: Discussion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function DiscussionThread({ discussion, open, onOpenChange }: DiscussionThreadProps) {
  const { toast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest');
  const [likedPost, setLikedPost] = useState(false);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());

  const isAuthor = false; // TODO: Check if current user is author

  const sortedReplies = [...discussion.replies].sort((a, b) => {
    if (sortOrder === 'oldest') {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // Group replies by parent
  const topLevelReplies = sortedReplies.filter(r => !r.parentReplyId);
  const nestedReplies = (parentId: string) =>
    sortedReplies.filter(r => r.parentReplyId === parentId);

  const handleLikePost = () => {
    setLikedPost(!likedPost);
    toast({
      description: likedPost ? 'لایک برداشته شد' : 'بحث را لایک کردید',
    });
  };

  const handleLikeReply = (replyId: string) => {
    const newLiked = new Set(likedReplies);
    if (newLiked.has(replyId)) {
      newLiked.delete(replyId);
    } else {
      newLiked.add(replyId);
    }
    setLikedReplies(newLiked);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;

    toast({
      title: 'موفق',
      description: 'پاسخ شما ثبت شد',
    });

    setReplyText('');
    setReplyingTo(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: discussion.title,
        text: discussion.content,
      });
    }
  };

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

  const ReplyComponent = ({ reply, isNested = false }: { reply: DiscussionReply; isNested?: boolean }) => {
    const nested = nestedReplies(reply.id);

    return (
      <div className={`space-y-3 ${isNested ? 'mr-8' : ''}`}>
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{reply.authorName}</span>
              <span className="text-muted-foreground">
                واحد {toPersianNumber(reply.authorUnit)}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{getRelativeTime(reply.createdAt)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => handleLikeReply(reply.id)}
              >
                <ThumbsUp className={`ml-1 h-3 w-3 ${likedReplies.has(reply.id) ? 'fill-current' : ''}`} />
                {toPersianNumber(reply.likes.length + (likedReplies.has(reply.id) ? 1 : 0))}
              </Button>
              {!isNested && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setReplyingTo(reply.id)}
                >
                  <Reply className="ml-1 h-3 w-3" />
                  پاسخ
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                <Flag className="ml-1 h-3 w-3" />
                گزارش
              </Button>
            </div>
          </div>
        </div>
        
        {/* Nested replies */}
        {nested.length > 0 && (
          <div className="space-y-3">
            {nested.map(nestedReply => (
              <ReplyComponent key={nestedReply.id} reply={nestedReply} isNested />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="flex-1">{discussion.title}</DialogTitle>
            <Badge className={categoryColors[discussion.category]}>
              {categoryLabels[discussion.category]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Post */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{discussion.authorName}</span>
                  <span className="text-muted-foreground">
                    واحد {toPersianNumber(discussion.authorUnit)}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {formatPersianDate(discussion.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{discussion.content}</p>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLikePost}
                  >
                    <ThumbsUp className={`ml-2 h-4 w-4 ${likedPost ? 'fill-current' : ''}`} />
                    {toPersianNumber(discussion.likes.length + (likedPost ? 1 : 0))}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="ml-2 h-4 w-4" />
                    اشتراک‌گذاری
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="ml-2 h-4 w-4" />
                    گزارش
                  </Button>
                  {isAuthor && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Edit className="ml-2 h-4 w-4" />
                        ویرایش
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Replies Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {toPersianNumber(discussion.replies.length)} پاسخ
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'oldest' ? 'newest' : 'oldest')}
              >
                {sortOrder === 'oldest' ? 'قدیمی‌ترین' : 'جدیدترین'}
              </Button>
            </div>

            <div className="space-y-4">
              {topLevelReplies.map(reply => (
                <ReplyComponent key={reply.id} reply={reply} />
              ))}
            </div>
          </div>

          {/* Reply Input */}
          <div className="space-y-3 pt-4 border-t">
            {replyingTo && (
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">در حال پاسخ...</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  انصراف
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="پاسخ خود را بنویسید..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {toPersianNumber(replyText.length)} کاراکتر
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim()}
                  >
                    <Send className="ml-2 h-4 w-4" />
                    ارسال پاسخ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
