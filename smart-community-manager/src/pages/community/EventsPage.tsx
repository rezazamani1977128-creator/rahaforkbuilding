import { useState } from 'react';
import { Plus, LayoutGrid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarView } from '../../components/events/CalendarView';
import { EventCard } from '../../components/events/EventCard';
import { CreateEventModal } from '../../components/events/CreateEventModal';
import { EventDetailModal } from '../../components/events/EventDetailModal';
import { mockEvents } from '@/data/mockData';
import type { BuildingEvent } from '@/data/mockData';

export function EventsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [filterType, setFilterType] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BuildingEvent | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = mockEvents
    .filter(event => event.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const pastEvents = mockEvents
    .filter(event => event.date < now)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Filter events
  const filterEvents = (events: BuildingEvent[]) => {
    if (filterType === 'all') return events;
    return events.filter(event => event.type === filterType);
  };

  const filteredUpcoming = filterEvents(upcomingEvents);
  const filteredPast = filterEvents(pastEvents);

  const handleEventClick = (event: BuildingEvent) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">رویدادهای ساختمان</h1>
          <p className="text-muted-foreground mt-1">
            مشاهده و شرکت در رویدادهای مشترک
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          ایجاد رویداد
        </Button>
      </div>

      {/* View Toggle & Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('calendar')}
          >
            <LayoutGrid className="ml-2 h-4 w-4" />
            تقویم
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="ml-2 h-4 w-4" />
            لیست
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه رویدادها</SelectItem>
              <SelectItem value="meeting">جلسات</SelectItem>
              <SelectItem value="celebration">جشن‌ها</SelectItem>
              <SelectItem value="maintenance">تعمیرات</SelectItem>
              <SelectItem value="community">اجتماعی</SelectItem>
              <SelectItem value="other">سایر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar or List View */}
      {view === 'calendar' ? (
        <CalendarView
          events={filteredUpcoming}
          onEventClick={handleEventClick}
        />
      ) : (
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2" dir="rtl">
            <TabsTrigger value="upcoming">
              پیش‌رو ({filteredUpcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              گذشته ({filteredPast.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4" dir="rtl">
            {filteredUpcoming.length > 0 ? (
              <div className="grid gap-4">
                {filteredUpcoming.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">رویداد پیش‌رویی وجود ندارد</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <Plus className="ml-2 h-4 w-4" />
                  ایجاد اولین رویداد
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4" dir="rtl">
            {filteredPast.length > 0 ? (
              <div className="grid gap-4">
                {filteredPast.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                    isPast
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">رویداد گذشته‌ای وجود ندارد</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Modals */}
      <CreateEventModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      )}
    </div>
  );
}
