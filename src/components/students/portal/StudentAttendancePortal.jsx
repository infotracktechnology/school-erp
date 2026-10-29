import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  CalendarCheck, Calendar, CheckCircle2, XCircle, Clock, 
  AlertCircle, ChevronLeft, ChevronRight, RefreshCw,
  Sun, Sunset, CalendarDays, TrendingUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { attendanceApi } from '../../../services/attendanceApi';
import { useErp } from '../../../context/ErpContext';

// Helpers
const getMonthKey = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getDayKey = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const getAllDaysInMonth = (monthKey) => {
  if (!monthKey) return [];
  const [year, month] = monthKey.split('-').map(Number);
  const daysCount = new Date(year, month, 0).getDate();
  const list = [];
  for (let day = 1; day <= daysCount; day++) {
    list.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  return list;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const StudentAttendancePortal = ({ student: propStudent, academicYearId, branchId }) => {
  const { currentUser, activeAcademicYearId } = useErp();
  const effectiveStudent = propStudent || currentUser?.student || {};
  const studentId = effectiveStudent?.id || currentUser?.student_id || currentUser?.id || 1;
  const todayKey = getDayKey(new Date().toISOString());
  const currentMonthKey = getMonthKey(new Date().toISOString());

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [filterStatus, setFilterStatus] = useState('all'); // all | Present | Absent | Leave | Late
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  // Load individual attendance report
  const loadAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const effBranch = branchId || effectiveStudent?.branch_id || currentUser?.branch_id || 1;
      const effAy = academicYearId || activeAcademicYearId || effectiveStudent?.academic_year_id || 2;
      const res = await attendanceApi.getStudentIndividualReport(effBranch, effAy, studentId);
      if (res && (res.success || res.summary || res.records)) {
        setReportData(res);
      } else {
        setReportData({ summary: {}, records: [] });
      }
    } catch (err) {
      console.error('Failed to load student attendance:', err);
      setError(err.message || 'Unable to load attendance records');
    } finally {
      setIsLoading(false);
    }
  }, [studentId, branchId, academicYearId, activeAcademicYearId, effectiveStudent, currentUser]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const summary = reportData?.summary || {
    total_days: 0,
    present: 0,
    absent: 0,
    leave: 0,
    late: 0,
    attendance_percentage: 100
  };

  const records = useMemo(() => {
    return reportData?.records || [];
  }, [reportData]);

  // Date lookup map for attendance records
  const recordsByDate = useMemo(() => {
    const map = {};
    records.forEach(r => {
      const dk = getDayKey(r.attendance_date || r.date);
      if (dk) map[dk] = r;
    });
    return map;
  }, [records]);

  // Today's record and latest recorded day
  const todayRecord = recordsByDate[todayKey];
  const latestRecord = records.length > 0 ? records[0] : null;

  // Month navigation
  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    setSelectedMonth(getMonthKey(prevDate));
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const nextDate = new Date(y, m, 1);
    setSelectedMonth(getMonthKey(nextDate));
  };

  const monthDays = useMemo(() => {
    return getAllDaysInMonth(selectedMonth);
  }, [selectedMonth]);

  const monthTitle = useMemo(() => {
    if (!selectedMonth) return '';
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  // Records filtered for table list
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const dk = getDayKey(r.attendance_date || r.date);
      if (selectedMonth && dk && !dk.startsWith(selectedMonth)) {
        return false;
      }
      if (filterStatus !== 'all') {
        const morning = r.morning_status || r.status;
        const afternoon = r.afternoon_status || r.status;
        if (r.status !== filterStatus && morning !== filterStatus && afternoon !== filterStatus) {
          return false;
        }
      }
      return true;
    });
  }, [records, selectedMonth, filterStatus]);

  // Calendar cells
  const calendarCells = useMemo(() => {
    if (monthDays.length === 0) return [];
    const firstDay = new Date(monthDays[0]);
    const leadingEmpty = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    const cells = [];
    for (let i = 0; i < leadingEmpty; i++) {
      cells.push({ isEmpty: true, key: `empty-${i}` });
    }
    monthDays.forEach(dateStr => {
      const rec = recordsByDate[dateStr];
      const dateObj = new Date(dateStr);
      const isSunday = dateObj.getDay() === 0;
      cells.push({
        isEmpty: false,
        key: dateStr,
        dateStr,
        dayNum: dateObj.getDate(),
        isToday: dateStr === todayKey,
        isSunday,
        record: rec
      });
    });
    return cells;
  }, [monthDays, recordsByDate, todayKey]);

  return (
    <div className="space-y-6">
      {/* ── 1. PROMINENT TODAY'S ATTENDANCE STATUS HERO BANNER ─────────────── */}
      {(() => {
        const effRecord = todayRecord || latestRecord;
        const effMorn = effRecord?.morning_status || effRecord?.status;
        const effAft = effRecord?.afternoon_status || effRecord?.status;
        const isHalfDay = effRecord?.status === 'Half Day' ||
          (effMorn === 'Present' && (effAft === 'Absent' || effAft === 'Leave')) ||
          (effAft === 'Present' && (effMorn === 'Absent' || effMorn === 'Leave'));

        return (
          <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-all ${
            todayRecord?.status === 'Present'
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border-emerald-300'
              : todayRecord && isHalfDay
              ? 'bg-gradient-to-r from-amber-50 via-yellow-50/60 to-white border-amber-300'
              : todayRecord?.status === 'Absent'
              ? 'bg-gradient-to-r from-rose-50 via-red-50/60 to-white border-rose-300'
              : todayRecord?.status === 'Leave'
              ? 'bg-gradient-to-r from-amber-50 via-yellow-50/60 to-white border-amber-300'
              : todayRecord?.status === 'Late'
              ? 'bg-gradient-to-r from-orange-50 via-amber-50/60 to-white border-orange-300'
              : 'bg-gradient-to-r from-slate-50 via-indigo-50/30 to-white border-slate-200'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  todayRecord?.status === 'Present'
                    ? 'bg-emerald-600 text-white'
                    : todayRecord && isHalfDay
                    ? 'bg-amber-600 text-white'
                    : todayRecord?.status === 'Absent'
                    ? 'bg-rose-600 text-white'
                    : todayRecord?.status === 'Leave'
                    ? 'bg-amber-600 text-white'
                    : todayRecord?.status === 'Late'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {todayRecord?.status === 'Present' && <CheckCircle2 className="w-8 h-8" />}
                  {todayRecord && isHalfDay && <AlertCircle className="w-8 h-8" />}
                  {todayRecord && !isHalfDay && todayRecord.status === 'Absent' && <XCircle className="w-8 h-8" />}
                  {todayRecord && !isHalfDay && todayRecord.status === 'Leave' && <AlertCircle className="w-8 h-8" />}
                  {todayRecord && !isHalfDay && todayRecord.status === 'Late' && <Clock className="w-8 h-8" />}
                  {!todayRecord && <CalendarCheck className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Today's Attendance Status
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">•</span>
                    <span className="text-[11px] font-bold text-slate-600">
                      {new Date().toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {todayRecord?.status === 'Present' && <span className="text-emerald-700">PRESENT • Attended School Today</span>}
                      {todayRecord && isHalfDay && (
                        <span className="text-amber-700">
                          HALF DAY • {effMorn === 'Present' ? 'Morning Present & Afternoon Absent' : 'Morning Absent & Afternoon Present'}
                        </span>
                      )}
                      {todayRecord && !isHalfDay && todayRecord.status === 'Absent' && <span className="text-rose-700">ABSENT • Did Not Attend School Today</span>}
                      {todayRecord && !isHalfDay && todayRecord.status === 'Leave' && <span className="text-amber-700">ON LEAVE • Approved Leave</span>}
                      {todayRecord && !isHalfDay && todayRecord.status === 'Late' && <span className="text-orange-700">LATE • Late Check-In Today</span>}
                      {!todayRecord && (
                        <span className="text-slate-700">
                          {latestRecord ? (
                            <>
                              Roll-call Pending for Today (Latest:{' '}
                              <strong className={
                                isHalfDay
                                  ? 'text-amber-700'
                                  : latestRecord.status === 'Present'
                                  ? 'text-emerald-700'
                                  : 'text-rose-700'
                              }>
                                {isHalfDay ? 'Half Day' : latestRecord.status}
                              </strong>{' '}
                              on {latestRecord.attendance_date})
                            </>
                          ) : (
                            'Roll-call Pending for Today'
                          )}
                        </span>
                      )}
                    </h1>
                  </div>

              <p className="text-xs text-slate-500 font-medium">
                Student: <strong className="text-slate-800">{reportData?.student?.first_name || effectiveStudent?.first_name || currentUser?.name} {reportData?.student?.last_name || effectiveStudent?.last_name || ''}</strong> (Adm No: <strong className="text-slate-800">{reportData?.student?.admission_number || effectiveStudent?.admission_number || effectiveStudent?.admission_no || 'N/A'}</strong>)
              </p>
            </div>
          </div>

          {/* Morning & Afternoon Session Split Badges */}
          <div className="flex flex-wrap items-center gap-3 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/90 shadow-2xs self-start lg:self-auto">
            {/* Morning Session */}
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <Sun className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block leading-tight">
                  Morning Session
                </span>
                <span className={`text-xs font-black ${
                  (todayRecord?.morning_status || todayRecord?.status) === 'Present' ? 'text-emerald-700' :
                  (todayRecord?.morning_status || todayRecord?.status) === 'Absent' ? 'text-rose-700' :
                  (todayRecord?.morning_status || todayRecord?.status) === 'Leave' ? 'text-amber-700' :
                  (todayRecord?.morning_status || todayRecord?.status) === 'Late' ? 'text-orange-700' :
                  'text-slate-500'
                }`}>
                  {todayRecord?.morning_status || todayRecord?.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Afternoon Session */}
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <Sunset className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block leading-tight">
                  Afternoon Session
                </span>
                <span className={`text-xs font-black ${
                  (todayRecord?.afternoon_status || todayRecord?.status) === 'Present' ? 'text-emerald-700' :
                  (todayRecord?.afternoon_status || todayRecord?.status) === 'Absent' ? 'text-rose-700' :
                  (todayRecord?.afternoon_status || todayRecord?.status) === 'Leave' ? 'text-amber-700' :
                  (todayRecord?.afternoon_status || todayRecord?.status) === 'Late' ? 'text-orange-700' :
                  'text-slate-500'
                }`}>
                  {todayRecord?.afternoon_status || todayRecord?.status || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })()}

      {/* ── 2. SUMMARY METRICS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Attendance Rate */}
        <Card className="p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Attendance</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {summary.attendance_percentage}%
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Overall Percentage</p>
          </div>
        </Card>

        {/* Total Working Days */}
        <Card className="p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Days</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {summary.total_days}
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">School Working Days</p>
          </div>
        </Card>

        {/* Present Days */}
        <Card className="p-4 shadow-2xs flex flex-col justify-between bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Present</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {summary.present}
            </div>
            <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-semibold mt-0.5">Days Attended</p>
          </div>
        </Card>

        {/* Absent Days */}
        <Card className="p-4 shadow-2xs flex flex-col justify-between bg-destructive/10 border-destructive/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-destructive">Absent</span>
            <div className="w-7 h-7 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-destructive">
              {summary.absent}
            </div>
            <p className="text-[10px] text-destructive/70 font-semibold mt-0.5">Days Not In School</p>
          </div>
        </Card>

        {/* Leave Days */}
        <Card className="p-4 shadow-2xs flex flex-col justify-between bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">Leave</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">
              {summary.leave}
            </div>
            <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 font-semibold mt-0.5">Approved Leaves</p>
          </div>
        </Card>

        {/* Late Days */}
        <Card className="p-4 shadow-2xs flex flex-col justify-between bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-400">Late</span>
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-sky-700 dark:text-sky-400">
              {summary.late}
            </div>
            <p className="text-[10px] text-sky-600/70 dark:text-sky-400/70 font-semibold mt-0.5">Tardy Check-ins</p>
          </div>
        </Card>
      </div>

      {/* ── 3. INTERACTIVE MONTHLY CALENDAR WITH MORNING & AFTERNOON ─────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
        {/* Month Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Attendance Calendar: <span className="text-emerald-700">{monthTitle}</span>
              </h2>
              <p className="text-xs text-slate-500">
                Shows whether student was Present or Absent for Morning and Afternoon sessions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors shadow-2xs"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-700 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 min-w-[120px] text-center">
              {monthTitle}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors shadow-2xs"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedMonth(currentMonthKey)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-colors"
            >
              Current Month
            </button>

            <button
              type="button"
              onClick={loadAttendance}
              disabled={isLoading}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
              title="Refresh Attendance"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">Present (Attended)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="font-semibold text-slate-700">Absent (Not in School)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-700">Leave</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="font-semibold text-slate-700">Late</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-200"></span>
            <span className="font-semibold text-slate-500">Sunday / Holiday</span>
          </div>
        </div>

        {/* Calendar Grid with Morning & Afternoon indicators */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
          <div className="grid grid-cols-7 text-center font-black text-[11px] uppercase tracking-wider text-slate-500 bg-slate-100/80 border-b border-slate-200 py-2.5">
            {WEEKDAYS.map((wd, i) => (
              <div key={wd} className={i === 0 ? 'text-rose-500' : ''}>
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {calendarCells.map((cell) => {
              if (cell.isEmpty) {
                return (
                  <div key={cell.key} className="bg-slate-50/40 min-h-[78px] sm:min-h-[92px] p-2" />
                );
              }

              const hasRecord = Boolean(cell.record);
              const morning = cell.record?.morning_status || cell.record?.status;
              const afternoon = cell.record?.afternoon_status || cell.record?.status;

              return (
                <div
                  key={cell.key}
                  className={`bg-white min-h-[78px] sm:min-h-[92px] p-2 flex flex-col justify-between transition-colors ${
                    cell.isToday ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${
                      cell.isSunday ? 'text-rose-600' : cell.isToday ? 'text-emerald-700 font-extrabold' : 'text-slate-800'
                    }`}>
                      {cell.dayNum}
                    </span>
                    {cell.isToday && (
                      <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="mt-1 space-y-1">
                    {hasRecord ? (
                      <>
                        {/* Morning Pill */}
                        <div className={`px-1 py-0.5 rounded text-[9px] font-extrabold flex items-center justify-between ${
                          morning === 'Present' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          morning === 'Absent' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          morning === 'Leave' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          morning === 'Late' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                          'bg-slate-50 text-slate-700'
                        }`}>
                          <span className="opacity-70">M:</span>
                          <span>{morning}</span>
                        </div>

                        {/* Afternoon Pill */}
                        <div className={`px-1 py-0.5 rounded text-[9px] font-extrabold flex items-center justify-between ${
                          afternoon === 'Present' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          afternoon === 'Absent' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          afternoon === 'Leave' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          afternoon === 'Late' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                          'bg-slate-50 text-slate-700'
                        }`}>
                          <span className="opacity-70">A:</span>
                          <span>{afternoon}</span>
                        </div>
                      </>
                    ) : cell.isSunday ? (
                      <span className="text-[10px] text-slate-400 italic block text-center py-2">Sunday</span>
                    ) : (
                      <span className="text-[10px] text-slate-300 block text-center py-2">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. DETAILED MORNING & AFTERNOON DAILY REGISTER ───────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Daily Attendance Record</h3>
              <p className="text-[11px] text-slate-500">
                Detailed Morning and Afternoon session presence for each school day
              </p>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold bg-slate-100/80 p-1 rounded-xl">
            {['all', 'Present', 'Absent', 'Leave', 'Late'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All Days' : st}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-1">
            <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-1" />
            <p className="font-bold text-slate-700">No Attendance Records Found</p>
            <p>No records matching status "{filterStatus}" in {monthTitle}.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Day</th>
                  <th className="p-3 text-center">Morning Attendance</th>
                  <th className="p-3 text-center">Afternoon Attendance</th>
                  <th className="p-3 text-center">Overall Day Status</th>
                  <th className="p-3">Remarks / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredRecords.map((rec) => {
                  const dObj = new Date(rec.attendance_date || rec.date);
                  const dayName = isNaN(dObj) ? '' : dObj.toLocaleDateString('default', { weekday: 'short' });
                  const morning = rec.morning_status || rec.status;
                  const afternoon = rec.afternoon_status || rec.status;

                  return (
                    <tr key={rec.id || rec.attendance_date} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        {rec.attendance_date || rec.date}
                      </td>
                      <td className="p-3 text-slate-500 font-semibold">
                        {dayName}
                      </td>

                      {/* Morning Session Column */}
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-[11px] font-extrabold ${
                          morning === 'Present' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          morning === 'Absent' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          morning === 'Leave' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          morning === 'Late' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          <Sun className="w-3 h-3 mr-1 inline opacity-80" />
                          <span>{morning === 'Present' ? 'Present' : morning === 'Absent' ? 'Absent' : morning}</span>
                        </span>
                      </td>

                      {/* Afternoon Session Column */}
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-[11px] font-extrabold ${
                          afternoon === 'Present' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          afternoon === 'Absent' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          afternoon === 'Leave' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          afternoon === 'Late' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          <Sunset className="w-3 h-3 mr-1 inline opacity-80" />
                          <span>{afternoon === 'Present' ? 'Present' : afternoon === 'Absent' ? 'Absent' : afternoon}</span>
                        </span>
                      </td>

                      {/* Overall Status */}
                      <td className="p-3 text-center">
                        {(() => {
                          const morn = rec.morning_status || rec.status;
                          const aft = rec.afternoon_status || rec.status;
                          const isHalfDay = rec.status === 'Half Day' || 
                            (morn === 'Present' && (aft === 'Absent' || aft === 'Leave')) ||
                            (aft === 'Present' && (morn === 'Absent' || morn === 'Leave'));

                          if (isHalfDay) {
                            const subText = morn === 'Present' && aft === 'Absent'
                              ? 'Half Day (Morn Present)'
                              : morn === 'Absent' && aft === 'Present'
                              ? 'Half Day (Aft Present)'
                              : 'Half Day';
                            return (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200">
                                {subText}
                              </span>
                            );
                          }

                          if (rec.status === 'Present' || (morn === 'Present' && aft === 'Present')) {
                            return (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
                                Full Day Present
                              </span>
                            );
                          }

                          if (rec.status === 'Absent' || (morn === 'Absent' && aft === 'Absent')) {
                            return (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-700">
                                Full Day Absent
                              </span>
                            );
                          }

                          if (rec.status === 'Leave' || (morn === 'Leave' && aft === 'Leave')) {
                            return (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700">
                                On Leave
                              </span>
                            );
                          }

                          if (rec.status === 'Late' || (morn === 'Late' && aft === 'Late')) {
                            return (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-50 text-orange-700">
                                Late Check-In
                              </span>
                            );
                          }

                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                              {rec.status}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Reason / Remarks */}
                      <td className="p-3 text-slate-600">
                        {rec.custom_remark || rec.remarks || <span className="text-slate-300 italic">None</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendancePortal;
