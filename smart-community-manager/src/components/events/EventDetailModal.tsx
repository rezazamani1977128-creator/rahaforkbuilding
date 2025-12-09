import { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Edit,
  Trash2,
  User,
  CheckCircle,
  HelpCircle,
  XCircle,
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import type { BuildingEvent } from '@/data/mockData';

interface EventDetailModalProps {
  event: BuildingEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventTypes = {
  meeting: { label: 'جلسه', color: 'bg-blue-500/10 text-blue-500' },
  celebration: { label: 'جشن', color: 'bg-pink-500/10 text-pink-500' },
  maintenance: { label: 'تعمیرات', color: 'bg-orange-500/10 text-orange-500' },
  community: { label: 'اجتماعی', color: 'bg-green-500/10 text-green-500' },
  other: { label: 'سایر', color: 'bg-gray-500/10 text-gray-500' },
};

export function EventDetailModal({ event, open, onOpenChange }: EventDetailModalProps) {
  const { toast } = useToast();
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe' | 'not_going' | null>(null);
  
  const isOrganizer = false; // TODO: Check if current user is organizer
  const attendingCount = event.attendees.filter(a => a.status === 'going').length;
  const maybeCount = event.attendees.filter(a => a.status === 'maybe').length;

  const handleRSVP = (status: 'going' | 'maybe' | 'not_going') => {
    setRsvpStatus(status);
    const labels = {
      going: 'شما در این رویداد شرکت خواهید کرد',
      maybe: 'شرکت شما در این رویداد نامشخص است',
      not_going: 'شما در این رویداد شرکت نخواهید کرد',
    };
    toast({
      title: 'ثبت شد',
      description: labels[status],
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `${event.title} - ${formatPersianDate(event.date)}`,
      });
    }
  };

  const handleAddToCalendar = () => {
    toast({
      title: 'افزوده شد',
      description: 'رویداد به تقویم شما اضافه شد',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="flex-1">{event.title}</DialogTitle>
            <Badge className={eventTypes[event.type].color}>
              {eventTypes[event.type].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date, Time, Location */}
          <div className="grid gap-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{formatPersianDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {toPersianNumber(event.startTime)}
                {event.endTime && ` تا ${toPersianNumber(event.endTime)}`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{event.location}</span>
              {event.location !== 'مجازی' && (
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  مشاهده در نقشه
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">توضیحات</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
          </div>

          <Separator />

          {/* Organizer */}
          <div>
            <h3 className="font-semibold mb-3">برگزارکننده</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{event.organizerName}</span>
            </div>
          </div>

          <Separator />

          {/* Attendees */}
          <div>
            <h3 className="font-semibold mb-3">شرکت‌کنندگان</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  {toPersianNumber(attendingCount)} نفر
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">
                  {toPersianNumber(maybeCount)} نفر
                </span>
              </div>
            </div>
            
            {event.maxAttendees && (
              <p className="text-sm text-muted-foreground mb-3">
                ظرفیت: {toPersianNumber(event.maxAttendees)} نفر
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {event.attendees.slice(0, 10).map((attendee, idx) => (
                <Avatar key={idx} className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              ))}
              {event.attendees.length > 10 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{toPersianNumber(event.attendees.length - 10)}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* RSVP Buttons */}
          {!isOrganizer && event.date >= new Date() && (
            <div>
              <h3 className="font-semibold mb-3">وضعیت شرکت شما</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={rsvpStatus === 'going' ? 'default' : 'outline'}
                  onClick={() => handleRSVP('going')}
                  className="w-full"
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  شرکت می‌کنم
                </Button>
                <Button
                  variant={rsvpStatus === 'maybe' ? 'default' : 'outline'}
                  onClick={() => handleRSVP('maybe')}
                  className="w-full"
                >
                  <HelpCircle className="ml-2 h-4 w-4" />
                  شاید
                </Button>
                <Button
                  variant={rsvpStatus === 'not_going' ? 'default' : 'outline'}
                  onClick={() => handleRSVP('not_going')}
                  className="w-full"
                >
                  <XCircle className="ml-2 h-4 w-4" />
                  شرکت نمی‌کنم
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isOrganizer ? (
              <>
                <Button variant="outline" className="flex-1">
                  <Edit className="ml-2 h-4 w-4" />
                  ویرایش
                </Button>
                <Button variant="outline" className="flex-1">
                  <Trash2 className="ml-2 h-4 w-4" />
                  لغو رویداد
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleAddToCalendar} variant="outline" className="flex-1">
                  <Calendar className="ml-2 h-4 w-4" />
                  افزودن به تقویم
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="ml-2 h-4 w-4" />
                  اشتراک‌گذاری
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
