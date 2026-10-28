import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight,
  AlertCircle, Sparkles, MapPin, CheckCircle2, Award, BookOpen,
  CalendarDays, Flag, RefreshCw, Paperclip, Image, Link, FileText, ExternalLink, X
} from 'lucide-react';
import { calendarService } from '../../../services/calendarService';

const TYPE_CONFIG = {
  public_holiday: { label: 'Public Holiday', bg: 'bg-red-50 text-red-700 border-red-200', pill: 'bg-red-600 text-white', icon: Flag },
  school_holiday: { label: 'School Vacation', bg: 'bg-orange-50 text-orange-700 border-orange-200', pill: 'bg-orange-600 text-white', icon: CalendarDays },
  school_event: { label: 'School Event', bg: 'bg-blue-50 text-blue-700 border-blue-200', pill: 'bg-blue-600 text-white', icon: Sparkles },
  exam: { label: 'Exam / Assessment', bg: 'bg-purple-50 text-purple-700 border-purple-200', pill: 'bg-purple-600 text-white', icon: BookOpen },
  academic_milestone: { label: 'Milestone', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', pill: 'bg-emerald-600 text-white', icon: Award }
};

export const StudentCalendarPortal = ({ student, academicYearId, branchId }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const classId = student?.class_id;
  const sectionId = student?.section_id;

  // Load events
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const [eventsRes, upRes] = await Promise.all([
        calendarService.getEvents({
          branch_id: branchId || student?.branch_id || 1,
          academic_year_id: academicYearId || 2,
          class_id: classId,
          section_id: sectionId,
          month,
          year
        }),
        calendarService.getUpcoming({
          branch_id: branchId || student?.branch_id || 1,
          academic_year_id: academicYearId || 2,
          class_id: classId,
          section_id: sectionId
        })
      ]);

      if (eventsRes.success && Array.isArray(eventsRes.data)) {
        setEvents(eventsRes.data);
      }
      if (upRes.success && Array.isArray(upRes.data)) {
        setUpcomingEvents(upRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [branchId, student, academicYearId, classId, currentDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed (9 for October)

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Helper to format date safely YYYY-MM-DD
    const formatDate = (y, m, d) => {
      const dateObj = new Date(y, m, d);
      const dy = dateObj.getFullYear();
      const dm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      return `${dy}-${dm}-${dd}`;
    };

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        dayNumber: dayNum,
        isCurrentMonth: false,
        dateString: formatDate(year, month - 1, dayNum)
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: true,
        dateString: formatDate(year, month, i)
      });
    }

    // Next month padding (complete the 7-column row)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateString: formatDate(year, month + 1, i)
      });
    }

    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const getEventsForDay = (dateString) => {
    return events.filter(e => dateString >= e.start_date && dateString <= e.end_date);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-7 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-rose-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-32 w-64 h-64 bg-radial from-indigo-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-400/30 px-3 py-1 rounded-full mb-2 backdrop-blur-md">
              <CalendarIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>Campus Calendar & Holidays</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              School Calendar ({monthName})
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-xl">
              Published public holidays, exam schedules, and celebrations for <strong className="text-white">{student?.class_name || 'Class'} {student?.section_name ? `(${student.section_name})` : ''}</strong>.
            </p>
          </div>

          {/* Month Stepper Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-inner">
              <button
                type="button"
                onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-95"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-white px-4 min-w-[130px] text-center tracking-tight">
                {monthName}
              </span>
              <button
                type="button"
                onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-95"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={loadData}
              title="Refresh"
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl transition-all cursor-pointer active:scale-95 shadow-inner"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Upcoming Quick Agenda Cards ── */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 px-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming Events & Holidays
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {upcomingEvents.slice(0, 4).map(ev => {
              const cfg = TYPE_CONFIG[ev.event_type] || TYPE_CONFIG.school_event;
              const Icon = cfg.icon;

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.bg}`}>
                      {cfg.label}
                    </span>
                    {ev.school_closed && (
                      <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        Closed
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {ev.description || 'No additional details.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                    <span>
                      {ev.start_date ? new Date(ev.start_date.replace(/-/g, '/')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                      {ev.end_date && ev.end_date !== ev.start_date && ` - ${new Date(ev.end_date.replace(/-/g, '/')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Monthly Interactive Matrix ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 py-3">
          <span className="text-red-600">Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {calendarDays.map((cd, idx) => {
            const dayEvents = getEventsForDay(cd.dateString);
            const isToday = cd.dateString === new Date().toISOString().split('T')[0];

            return (
              <div
                key={idx}
                className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors ${
                  cd.isCurrentMonth
                    ? (isToday ? 'bg-indigo-50/40' : 'bg-white hover:bg-slate-50/60')
                    : 'bg-slate-50/40 opacity-40'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : (cd.isCurrentMonth ? 'text-slate-800' : 'text-slate-400')
                  }`}>
                    {cd.dayNumber}
                  </span>
                </div>

                {/* Day Events */}
                <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[75px]">
                  {dayEvents.map(ev => {
                    const cfg = TYPE_CONFIG[ev.event_type] || TYPE_CONFIG.school_event;
                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        style={{ borderLeftColor: ev.color_code || '#6366f1' }}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold border-l-2 bg-slate-50 text-slate-800 truncate shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate mr-1">{ev.title}</span>
                        {ev.school_closed && (
                          <span className="text-[8px] font-black uppercase text-red-600 bg-red-100 px-1 rounded shrink-0">
                            Closed
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Event Detail Modal ── */}
      {selectedEvent && (
        <div 
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  TYPE_CONFIG[selectedEvent.event_type]?.bg || 'bg-slate-100 text-slate-700'
                }`}>
                  {TYPE_CONFIG[selectedEvent.event_type]?.label || 'Event'}
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1.5">{selectedEvent.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                {selectedEvent.school_closed && (
                  <span className="text-[10px] font-bold uppercase text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg shrink-0">
                    School Closed
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-semibold">
                  Date: {selectedEvent.start_date ? new Date(selectedEvent.start_date.replace(/-/g, '/')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  {selectedEvent.end_date && selectedEvent.end_date !== selectedEvent.start_date && (
                    ` to ${new Date(selectedEvent.end_date.replace(/-/g, '/')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  )}
                </span>
              </div>
              {selectedEvent.description && (
                <p className="text-slate-600 pt-1 border-t border-slate-200/60">
                  {selectedEvent.description}
                </p>
              )}

              {/* Attachments & Resource Links */}
              {selectedEvent.attachments?.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                    <Paperclip className="w-3 h-3 text-slate-500" />
                    <span>Attached Resources & Circulars ({selectedEvent.attachments.length})</span>
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedEvent.attachments.map(att => {
                      const isImg = att.type === 'image';
                      const isLink = att.type === 'link';
                      return (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                            <div className="p-1 rounded bg-slate-100 text-slate-600 shrink-0">
                              {isImg ? <Image className="w-3.5 h-3.5 text-blue-600" /> : (
                                isLink ? <Link className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-purple-600" />
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                              {att.name || att.url}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
