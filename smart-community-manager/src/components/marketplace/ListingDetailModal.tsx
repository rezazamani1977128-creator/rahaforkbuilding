import { Phone, MessageSquare, Share2, Flag, Edit, Trash2, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';
import type { MarketplaceListing } from '@/data/mockData';

interface ListingDetailModalProps {
  listing: MarketplaceListing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function ListingDetailModal({ listing, open, onOpenChange }: ListingDetailModalProps) {
  const isOwnListing = false; // TODO: Check if current user is the seller

  const handleCall = () => {
    if (listing.contactPhone) {
      window.location.href = `tel:${listing.contactPhone}`;
    }
  };

  const handleWhatsApp = () => {
    if (listing.contactPhone) {
      const phone = listing.contactPhone.replace(/\D/g, '');
      window.open(`https://wa.me/98${phone.substring(1)}`, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="flex-1">{listing.title}</DialogTitle>
            <Badge className={categoryColors[listing.category]}>
              {categoryLabels[listing.category]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {listing.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {listing.images.map((image, index) => (
                <div
                  key={index}
                  className={`${index === 0 ? 'col-span-2' : ''} aspect-video bg-muted rounded-lg overflow-hidden`}
                >
                  <img
                    src={image}
                    alt={`${listing.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">تصویری موجود نیست</p>
            </div>
          )}

          {/* Price */}
          <div>
            {listing.category === 'sale' && listing.price ? (
              <div className="text-3xl font-bold">
                {toPersianNumber(listing.price.toLocaleString())}
                <span className="text-lg font-normal text-muted-foreground mr-2">تومان</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-500">رایگان</div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">توضیحات</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          <Separator />

          {/* Seller Info */}
          <div>
            <h3 className="font-semibold mb-3">فروشنده</h3>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{listing.sellerName}</p>
                <p className="text-sm text-muted-foreground">
                  واحد {toPersianNumber(listing.sellerUnit)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Posted Date */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>تاریخ انتشار: {formatPersianDate(listing.createdAt)}</span>
            <span>انقضا: {formatPersianDate(listing.expiresAt)}</span>
          </div>

          {/* Action Buttons */}
          {isOwnListing ? (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Edit className="ml-2 h-4 w-4" />
                ویرایش
              </Button>
              <Button variant="outline" className="flex-1">
                <Trash2 className="ml-2 h-4 w-4" />
                حذف
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {listing.contactPhone && (
                <>
                  <Button onClick={handleCall} className="w-full">
                    <Phone className="ml-2 h-4 w-4" />
                    تماس
                  </Button>
                  <Button onClick={handleWhatsApp} variant="outline" className="w-full">
                    <MessageSquare className="ml-2 h-4 w-4" />
                    واتساپ
                  </Button>
                </>
              )}
              <Button variant="outline" className="w-full">
                <MessageSquare className="ml-2 h-4 w-4" />
                ارسال پیام
              </Button>
              <Button variant="outline" onClick={handleShare} className="w-full">
                <Share2 className="ml-2 h-4 w-4" />
                اشتراک‌گذاری
              </Button>
              <Button variant="outline" className="col-span-2">
                <Flag className="ml-2 h-4 w-4" />
                گزارش آگهی
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
