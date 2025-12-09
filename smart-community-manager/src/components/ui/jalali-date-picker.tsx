import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import jalaali from 'jalaali-js';

interface JalaliDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function JalaliDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
}: JalaliDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [showYearMonth, setShowYearMonth] = useState(false);

  // Get current date in Jalali calendar
  const now = new Date();
  const jDate = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const [currentYear, currentMonth] = [jDate.jy, jDate.jm];

  const [displayYear, setDisplayYear] = useState(currentYear);
  const [displayMonth, setDisplayMonth] = useState(currentMonth);

  const jalaliMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  // Get days in month using jalaali library
  const getDaysInMonth = (year: number, month: number): number => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    // Check if leap year
    return jalaali.isLeapJalaaliYear(year) ? 30 : 29;
  };

  // Get first day of month
  const getFirstDayOfMonth = (year: number, month: number): number => {
    const gDate = jalaali.toGregorian(year, month, 1);
    return new Date(gDate.gy, gDate.gm - 1, gDate.gd).getDay();
  };

  const daysInMonth = getDaysInMonth(displayYear, displayMonth);
  const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSelectDay = (day: number) => {
    const formatted = `${displayYear}/${String(displayMonth).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    onChange(formatted);
    setOpen(false);
  };

  const handlePrevMonth = () => {
    if (displayMonth === 1) {
      setDisplayMonth(12);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 12) {
      setDisplayMonth(1);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    return { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
  };

  const selectedDate = parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          className="cursor-pointer"
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" dir="rtl">
        {!showYearMonth ? (
          <div className="space-y-3" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevMonth}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <button
                onClick={() => setShowYearMonth(true)}
                className="text-sm font-semibold hover:bg-accent px-2 py-1 rounded cursor-pointer text-right"
                dir="rtl"
              >
                {jalaliMonths[displayMonth - 1]} {displayYear}
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0.5">
              {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1" dir="rtl">
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-7" />
              ))}
              {days.map((day) => {
                const isSelected =
                  selectedDate &&
                  selectedDate.year === displayYear &&
                  selectedDate.month === displayMonth &&
                  selectedDate.day === day;

                return (
                  <button
                    key={day}
                    onClick={() => handleSelectDay(day)}
                    className={cn(
                      'h-7 rounded-md text-sm font-medium transition-colors hover:bg-accent text-center',
                      isSelected ? 'bg-primary text-primary-foreground font-semibold' : ''
                    )}
                    dir="rtl"
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3" dir="rtl">
            {/* Year selector */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDisplayYear(displayYear - 1)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold w-12 text-center" dir="rtl">
                {displayYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDisplayYear(displayYear + 1)}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-1">
              {jalaliMonths.map((month, idx) => (
                <button
                  key={month}
                  onClick={() => {
                    setDisplayMonth(idx + 1);
                    setShowYearMonth(false);
                  }}
                  className={cn(
                    'py-2 px-1 rounded text-xs font-medium transition-colors hover:bg-accent',
                    displayMonth === idx + 1 ? 'bg-primary text-primary-foreground' : ''
                  )}
                  dir="rtl"
                >
                  {month}
                </button>
              ))}
            </div>

            {/* Back button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowYearMonth(false)}
              className="w-full text-xs"
              dir="rtl"
            >
              بازگشت
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
