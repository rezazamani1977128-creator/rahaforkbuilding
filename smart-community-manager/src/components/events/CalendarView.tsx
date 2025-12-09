import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toPersianNumber } from '@/lib/persian';
import type { BuildingEvent } from '@/data/mockData';

interface CalendarViewProps {
  events: BuildingEvent[];
  onEventClick: (event: BuildingEvent) => void;
}

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay() === 6 ? 0 : firstDay.getDay() + 1;

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Get events for a specific date
  const getEventsForDate = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handlePrevMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {persianMonths[month]} {toPersianNumber(year)}
        </h2>
        <Button variant="outline" size="sm" onClick={handleNextMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-muted">
          {persianDays.map((day, idx) => (
            <div
              key={idx}
              className="p-2 text-center text-sm font-medium border-l first:border-l-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayEvents = day ? getEventsForDate(day) : [];
            
            return (
              <div
                key={idx}
                className={`min-h-[100px] p-2 border-t border-l first:border-l-0 ${
                  !day ? 'bg-muted/20' : ''
                } ${isToday(day || 0) ? 'bg-primary/5 border-primary' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : ''}`}>
                      {toPersianNumber(day)}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <Button
                          key={event.id}
                          variant="outline"
                          size="sm"
                          className="w-full h-auto p-1 text-xs justify-start"
                          onClick={() => onEventClick(event)}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary ml-1 shrink-0" />
                          <span className="truncate">{event.title}</span>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>رویداد</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-primary" />
          <span>امروز</span>
        </div>
      </div>
    </div>
  );
}
