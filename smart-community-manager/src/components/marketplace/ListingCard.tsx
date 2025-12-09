import { Tag, Gift, Briefcase, HandHeart, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toPersianNumber } from '@/lib/persian';
import type { MarketplaceListing } from '@/data/mockData';

interface ListingCardProps {
  listing: MarketplaceListing;
  onClick: () => void;
}

const categoryIcons = {
  sale: Tag,
  free: Gift,
  services: Briefcase,
  lending: HandHeart,
};

const categoryLabels = {
  sale: 'فروشی',
  free: 'رایگان',
  services: 'خدمات',
  lending: 'امانت',
};

const categoryColors = {
  sale: 'bg-blue-500/10 text-blue-500',
  free: 'bg-green-500/10 text-green-500',
  services: 'bg-purple-500/10 text-purple-500',
  lending: 'bg-orange-500/10 text-orange-500',
};

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const Icon = categoryIcons[listing.category];
  
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
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
      dir="rtl"
    >
      {/* Image */}
      <div className="relative aspect-video bg-muted">
        {listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="h-12 w-12 text-muted-foreground opacity-30" />
          </div>
        )}
        {/* Category Badge */}
        <Badge className={`absolute top-2 right-2 ${categoryColors[listing.category]}`}>
          <Icon className="mr-1 h-3 w-3" />
          {categoryLabels[listing.category]}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
          {listing.title}
        </h3>

        {/* Price */}
        <div className="text-lg font-bold">
          {listing.category === 'sale' && listing.price ? (
            <>
              {toPersianNumber(listing.price.toLocaleString())}
              <span className="text-sm font-normal text-muted-foreground mr-1">تومان</span>
            </>
          ) : (
            <span className="text-green-500">رایگان</span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-2 border-t" dir="rtl">
          <span className="text-xs text-muted-foreground">
            {getRelativeTime(listing.createdAt)}
          </span>
          <div className="flex items-center gap-2">
            <div className="text-sm text-left">
              <span className="font-medium">{toPersianNumber(listing.sellerUnit)}</span>
              {' '}
              <span className="text-muted-foreground">واحد</span>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
