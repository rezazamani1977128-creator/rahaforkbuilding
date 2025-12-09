import { Users, Calendar, Wrench, Heart, PartyPopper, MapPin, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toPersianNumber } from '@/lib/persian';
import { formatPersianDate } from '@/lib/utils';
import type { BuildingEvent } from '@/data/mockData';

interface EventCardProps {
  event: BuildingEvent;
  onClick: () => void;
  isPast?: boolean;
}

const eventTypes = {
  meeting: { label: 'جلسه', icon: Users, color: 'bg-blue-500' },
  celebration: { label: 'جشن', icon: PartyPopper, color: 'bg-pink-500' },
  maintenance: { label: 'تعمیرات', icon: Wrench, color: 'bg-orange-500' },
  community: { label: 'اجتماعی', icon: Heart, color: 'bg-green-500' },
  other: { label: 'سایر', icon: Calendar, color: 'bg-gray-500' },
};

export function EventCard({ event, onClick, isPast = false }: EventCardProps) {
  const eventType = eventTypes[event.type];
  const Icon = eventType.icon;
  
  const attendingCount = event.attendees.filter(a => a.status === 'going').length;
  const maybeCount = event.attendees.filter(a => a.status === 'maybe').length;

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-shadow ${isPast ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Event Type Icon */}
          <div className={`${eventType.color} text-white p-3 rounded-lg shrink-0`}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Event Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {eventType.label}
                </Badge>
              </div>
              {isPast && (
                <Badge variant="outline" className="text-xs">
                  برگزار شده
                </Badge>
              )}
            </div>

            {/* Date & Time */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatPersianDate(event.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {toPersianNumber(event.startTime)}
                {event.endTime && ` - ${toPersianNumber(event.endTime)}`}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {event.attendees.slice(0, 3).map((_, idx) => (
                    <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {toPersianNumber(attendingCount)} شرکت‌کننده
                  {maybeCount > 0 && ` • ${toPersianNumber(maybeCount)} احتمالی`}
                </span>
              </div>

              {!isPast && (
                <Button size="sm" variant="outline" className="mr-auto">
                  شرکت می‌کنم
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
