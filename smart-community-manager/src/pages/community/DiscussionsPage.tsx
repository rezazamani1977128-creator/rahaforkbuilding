import { useState } from 'react';
import { Plus, Search, TrendingUp, Clock, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { CreateDiscussionModal } from '@/components/discussions/CreateDiscussionModal';
import { DiscussionThread } from '../../components/discussions/DiscussionThread';
import { mockDiscussions } from '@/data/mockData';
import type { Discussion } from '@/data/mockData';

export function DiscussionsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [threadOpen, setThreadOpen] = useState(false);

  // Filter and sort discussions
  const filteredDiscussions = mockDiscussions
    .filter(disc => {
      const matchesCategory = activeCategory === 'all' || disc.category === activeCategory;
      const matchesSearch = disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           disc.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortBy === 'popular') {
        return b.likes.length - a.likes.length;
      } else if (sortBy === 'discussed') {
        return b.replies.length - a.replies.length;
      }
      return 0;
    });

  // Separate pinned and regular discussions
  const pinnedDiscussions = filteredDiscussions.filter(d => d.isPinned);
  const regularDiscussions = filteredDiscussions.filter(d => !d.isPinned);

  const handleDiscussionClick = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setThreadOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">گفتگوی همسایگان</h1>
          <p className="text-muted-foreground mt-1">
            مشارکت در بحث‌ها و اشتراک نظرات
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          شروع بحث جدید
        </Button>
      </div>

      {/* Search */}
      <div className="relative" dir="rtl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="جستجو در بحث‌ها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
          <TabsList className="grid w-full grid-cols-5" dir="rtl">
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="general">عمومی</TabsTrigger>
            <TabsTrigger value="suggestions">پیشنهادات</TabsTrigger>
            <TabsTrigger value="questions">سوالات</TabsTrigger>
            <TabsTrigger value="offtopic">گفتگوی آزاد</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                جدیدترین
              </div>
            </SelectItem>
            <SelectItem value="discussed">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                پربحث‌ترین
              </div>
            </SelectItem>
            <SelectItem value="popular">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                محبوب‌ترین
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Discussions List */}
      <div className="space-y-3">
        {/* Pinned Discussions */}
        {pinnedDiscussions.length > 0 && (
          <div className="space-y-3">
            {pinnedDiscussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onClick={() => handleDiscussionClick(discussion)}
              />
            ))}
          </div>
        )}

        {/* Regular Discussions */}
        {regularDiscussions.length > 0 ? (
          <div className="space-y-3">
            {regularDiscussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onClick={() => handleDiscussionClick(discussion)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'بحثی یافت نشد' : 'هنوز بحثی شروع نشده است'}
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus className="ml-2 h-4 w-4" />
                اولین بحث را شروع کنید
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateDiscussionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {selectedDiscussion && (
        <DiscussionThread
          discussion={selectedDiscussion}
          open={threadOpen}
          onOpenChange={setThreadOpen}
        />
      )}
    </div>
  );
}
