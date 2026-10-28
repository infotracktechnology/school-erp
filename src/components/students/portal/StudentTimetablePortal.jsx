import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, AlertCircle, RefreshCw, 
  MapPin, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { timetableService } from '../../../services/timetableService';

export const StudentTimetablePortal = ({ student, academicYearId, branchId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timetableData, setTimetableData] = useState(null);

  const classId = student?.class_id;
  const sectionId = student?.section_id;

  const loadTimetable = async () => {
    if (!classId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await timetableService.getWeeklyTimetable({
        branch_id: branchId || student?.branch_id || 1,
        academic_year_id: academicYearId || 2,
        class_id: classId,
        section_id: sectionId || 'all'
      });

      if (res.success && res.data) {
        setTimetableData(res.data);
      } else {
        throw new Error(res.message || 'Failed to load timetable');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to fetch your class timetable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, [classId, sectionId, academicYearId, branchId]);

  const structure = timetableData?.structure;
  const periods = timetableData?.periods || [];
  const slots = timetableData?.slots || [];
  const workingDays = structure?.working_days || [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  // Today's day name (e.g. "Monday")
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <h3 className="text-sm font-bold text-slate-800">Loading your class timetable...</h3>
        <p className="text-xs text-slate-400">Fetching bell schedule for {student?.class_name || 'Class'} {student?.section_name ? `(${student.section_name})` : ''}</p>
      </div>
    );
  }

  if (error || !structure) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Timetable Published Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The timetable schedule for <strong>{student?.class_name || 'your class'} {student?.section_name ? `(${student.section_name})` : ''}</strong> is being prepared by the administration.
        </p>
        <button
          onClick={loadTimetable}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Check Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Class Timetable</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {student?.class_name || 'Class'} {student?.section_name ? `• Section ${student.section_name}` : ''}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bell Schedule: <strong>{structure.name}</strong> ({periods.length} Periods • {workingDays.length} Working Days)
          </p>
        </div>

        <button
          onClick={loadTimetable}
          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Interactive Timetable Grid Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Weekly Schedule Matrix</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            Today is <strong>{todayName}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                <th className="py-3 px-4 w-32 border-r border-slate-200">Day</th>
                {periods.map(p => {
                  const isBreak = p.period_type === 'break';
                  const isAssembly = p.period_type === 'assembly';
                  return (
                    <th 
                      key={p.id}
                      className={`py-2 px-3 text-center border-r border-slate-200 min-w-[130px] ${
                        isBreak 
                          ? 'bg-amber-50/70 text-amber-900' 
                          : isAssembly 
                            ? 'bg-blue-50/70 text-blue-900' 
                            : ''
                      }`}
                    >
                      <div className="font-extrabold">{p.period_name}</div>
                      <div className="text-[9px] font-normal text-slate-500">{p.start_time} - {p.end_time}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workingDays.map(day => {
                const isToday = day.toLowerCase() === todayName.toLowerCase();

                return (
                  <tr 
                    key={day} 
                    className={`transition-colors ${
                      isToday ? 'bg-indigo-50/30' : 'hover:bg-slate-50/40'
                    }`}
                  >
                    {/* Day Column */}
                    <td className={`py-3.5 px-4 font-bold border-r border-slate-200 ${
                      isToday ? 'text-indigo-900 bg-indigo-50/50' : 'text-slate-800 bg-slate-50/40'
                    }`}>
                      <div className="flex items-center space-x-1.5">
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                        <span>{day}</span>
                      </div>
                    </td>

                    {/* Periods Columns */}
                    {periods.map(period => {
                      const isBreak = period.period_type === 'break';
                      const isAssembly = period.period_type === 'assembly';

                      if (isBreak || isAssembly) {
                        return (
                          <td 
                            key={period.id} 
                            className="py-3 px-2 text-center border-r border-slate-100 bg-slate-50/50"
                          >
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              {isBreak ? '☕ Recess' : '🔔 Assembly'}
                            </span>
                          </td>
                        );
                      }

                      // Teaching Period: Find assigned slot
                      const slot = slots.find(s => s.period_id === period.id && s.day_of_week === day);

                      return (
                        <td 
                          key={period.id} 
                          className="py-2.5 px-2 text-center border-r border-slate-100"
                        >
                          {slot?.subject_name ? (
                            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xs text-center space-y-1">
                              <div className="font-extrabold text-xs text-white leading-tight">
                                {slot.subject_name}
                              </div>
                              {slot.room_name && (
                                <div className="text-[9px] text-slate-300 font-mono flex items-center justify-center space-x-1">
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>{slot.room_name}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[10px] font-medium">
                              Free Period
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
