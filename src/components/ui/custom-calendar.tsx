import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

interface CustomCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}

export function CustomCalendar({ selected, onSelect, disabled }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-80 p-4">
      {/* Header with Month/Year and Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">{format(currentMonth, 'MMMM')}</h2>
          <p className="text-sm font-semibold text-slate-500">{format(currentMonth, 'yyyy')}</p>
        </div>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-xs font-bold uppercase text-slate-600 py-2">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selected && isSameDay(day, selected);
          const isDisabled = disabled?.(day) || false;

          return (
            <button
              key={idx}
              onClick={() => !isDisabled && onSelect(day)}
              disabled={isDisabled}
              className={`
                h-9 w-9 rounded-lg text-sm font-semibold transition-all
                ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-900'}
                ${isSelected ? 'bg-primary text-white font-bold shadow-lg' : ''}
                ${!isSelected && isCurrentMonth && !isDisabled ? 'hover:bg-slate-100' : ''}
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:cursor-pointer'}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
