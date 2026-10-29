import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function startOfDay(val) {
  const d = parseDate(val);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
}

function endOfDay(val) {
  const d = parseDate(val);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
}

function isSameDay(date1, date2) {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Calendar({
  className,
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  events = [],
  minDate,
  maxDate,
  disabled,
  ...props
}) {
  const parsedControlled = parseDate(controlledMonth);
  const parsedSelected = parseDate(selected);

  const initialMonth = React.useMemo(() => {
    if (parsedControlled) return parsedControlled;
    if (parsedSelected) return parsedSelected;
    return new Date();
  }, []);

  const [currentMonth, setCurrentMonth] = React.useState(initialMonth);

  const activeMonth = parsedControlled || currentMonth;

  const year = activeMonth.getFullYear();
  const monthIndex = activeMonth.getMonth();

  const handlePrevMonth = () => {
    const newMonth = new Date(year, monthIndex - 1, 1);
    if (!controlledMonth) {
      setCurrentMonth(newMonth);
    }
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(year, monthIndex + 1, 1);
    if (!controlledMonth) {
      setCurrentMonth(newMonth);
    }
    onMonthChange?.(newMonth);
  };

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const calendarDays = React.useMemo(() => {
    const days = [];

    // Previous month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const date = new Date(year, monthIndex - 1, dayNum);
      days.push({
        date,
        dayNum,
        isCurrentMonth: false,
        isPrev: true,
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const date = new Date(year, monthIndex, dayNum);
      days.push({
        date,
        dayNum,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill either 35 or 42 cells
    const targetLength = days.length > 35 ? 42 : 35;
    let nextMonthDay = 1;
    while (days.length < targetLength) {
      const date = new Date(year, monthIndex + 1, nextMonthDay);
      days.push({
        date,
        dayNum: nextMonthDay,
        isCurrentMonth: false,
        isNext: true,
      });
      nextMonthDay++;
    }

    return days;
  }, [year, monthIndex, daysInMonth, firstDayOfWeek, daysInPrevMonth]);

  const today = new Date();
  const safeEvents = Array.isArray(events) ? events : [];
  const minTime = startOfDay(minDate);
  const maxTime = endOfDay(maxDate);

  return (
    <div
      className={cn(
        "p-3 bg-card text-card-foreground border border-border rounded-xl shadow-xs w-fit select-none",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 pt-1 px-1">
        <h2 className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[monthIndex]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            )}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            )}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-[0.8rem] font-medium text-muted-foreground h-8 flex items-center justify-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item, idx) => {
          const isSelected = isSameDay(item.date, selected);
          const isToday = isSameDay(item.date, today);

          let isDisabled = Boolean(disabled);
          const itemTime = item.date.getTime();
          if (minTime !== null && itemTime < minTime) {
            isDisabled = true;
          }
          if (maxTime !== null && itemTime > maxTime) {
            isDisabled = true;
          }

          const dayEvents = safeEvents.filter(
            (ev) => ev && ev.date && isSameDay(ev.date, item.date)
          );
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onSelect?.(item.date);
                }
              }}
              className={cn(
                "h-8 w-8 text-center text-sm p-0 font-normal relative rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer",
                !item.isCurrentMonth && "text-muted-foreground/40",
                item.isCurrentMonth && !isSelected && "hover:bg-accent/10 hover:text-accent-foreground",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
                isToday && !isSelected && "border border-primary text-primary font-semibold",
                isDisabled && "opacity-30 cursor-not-allowed pointer-events-none"
              )}
            >
              <span>{item.dayNum}</span>
              {hasEvents && (
                <span
                  className={cn(
                    "absolute bottom-1 h-1 w-1 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-accent"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };
