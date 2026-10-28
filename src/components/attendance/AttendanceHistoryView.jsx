import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  History,
  Calendar,
  Edit3,
  Eye,
  RefreshCw,
  X,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  TrendingUp,
  Filter,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { getClasses, getSectionsByClass, getSections } from '../../services/api';
import { useErp } from '../../context/ErpContext';

export const AttendanceHistoryView = ({ branchId, academicYearId }) => {
  const { branches, academicYears, showToast, userRole } = useErp();
  const currentBranch = branches.find(b => b.id === branchId);
  const currentAy = academicYears.find(ay => ay.id === academicYearId);
  const ayParam = currentAy?.academic_year || currentAy?.year_name || undefined;

  const [historyList, setHistoryList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filters (Defaults to Current Date)
  const [filterDate, setFilterDate] = useState(todayStr);
  const [filterClassId, setFilterClassId] = useState('all');
  const [filterSectionId, setFilterSectionId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail & Edit Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('records');
  const [modalStudentSearch, setModalStudentSearch] = useState('');

  // Single record edit modal inside detail modal
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('Present');
  const [editReason, setEditReason] = useState('');
  const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);

  // Load Classes
  useEffect(() => {
    if (!branchId || !academicYearId) return;
    getClasses(branchId, academicYearId)
      .then(res => setClasses(Array.isArray(res) ? res : (res?.data || [])))
      .catch(err => console.error('Failed to load classes:', err));
  }, [branchId, academicYearId]);

  // Load Sections when class filter changes
  useEffect(() => {
    if (!branchId || !academicYearId) return;
    if (filterClassId !== 'all') {
      getSectionsByClass(Number(filterClassId), branchId, academicYearId)
        .then(secs => setSections(secs || []))
        .catch(() => setSections([]));
    } else {
      getSections(branchId, academicYearId)
        .then(res => {
          const data = Array.isArray(res) ? res : (res?.data || []);
          setSections(data);
        })
        .catch(() => setSections([]));
    }
  }, [filterClassId, branchId, academicYearId]);

  // Available sections: unique by name when 'all' classes selected
  const availableSections = useMemo(() => {
    if (filterClassId === 'all') {
      const unique = new Map();
      (sections || []).forEach(s => {
        if (s && s.name && !unique.has(s.name)) {
          unique.set(s.name, { id: s.name, name: s.name });
        }
      });
      return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
    }
    return sections || [];
  }, [filterClassId, sections]);

  // Load History
  const loadHistory = useCallback(async () => {
    if (!branchId || !academicYearId) return;
    setIsLoading(true);
    try {
      const isNumericSec = filterSectionId !== 'all' && !isNaN(Number(filterSectionId));
      const secParam = filterSectionId !== 'all' ? (isNumericSec ? Number(filterSectionId) : filterSectionId) : undefined;
      const data = await attendanceApi.getHistory(
        branchId,
        academicYearId,
        filterDate || undefined,
        filterClassId !== 'all' ? Number(filterClassId) : undefined,
        secParam,
        ayParam
      );
      setHistoryList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load history:', err);
      showToast('error', err.message || 'Could not load attendance history');
      setHistoryList([]);
    } finally {
      setIsLoading(false);
    }
  }, [branchId, academicYearId, filterDate, filterClassId, filterSectionId, ayParam, showToast]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Open Session Detail Modal
  const handleOpenDetails = async (session) => {
    setSelectedSession(session);
    setActiveTab('records');
    setIsLoadingDetails(true);
    setEditingRecord(null);
    setModalStudentSearch('');
    try {
      const details = await attendanceApi.getRecordDetails(
        branchId,
        academicYearId,
        session.class_id,
        session.section_id,
        session.attendance_date,
        session.attendance_timing_id || undefined,
        ayParam
      );
      setSessionDetails(details);
    } catch (err) {
      console.error('Failed to load session details:', err);
      showToast('error', err.message || 'Failed to fetch session record details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Start Editing Single Record
  const handleStartEditRecord = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setEditReason('');
  };

  // Save Single Record Edit with Mandatory Audit Reason
  const handleSaveRecordEdit = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    if (!editReason.trim()) {
      showToast('error', 'A mandatory reason is required to modify recorded attendance.');
      return;
    }
    setIsUpdatingRecord(true);
    try {
      await attendanceApi.updateSingleRecord({
        record_id: editingRecord.record_id || editingRecord.id,
        new_status: newStatus,
        reason: editReason.trim(),
        changed_by: `${userRole === 'super_admin' ? 'Super Admin' : 'Authorized Faculty'}`
      });
      showToast('success', 'Attendance record updated and audit logged');
      setEditingRecord(null);
      setEditReason('');

      // Refresh details and history
      if (selectedSession) {
        const refreshed = await attendanceApi.getRecordDetails(
          branchId,
          academicYearId,
          selectedSession.class_id,
          selectedSession.section_id,
          selectedSession.attendance_date,
          selectedSession.attendance_timing_id,
          ayParam
        );
        setSessionDetails(refreshed);
      }
      loadHistory();
    } catch (err) {
      showToast('error', err.message || 'Failed to update record');
    } finally {
      setIsUpdatingRecord(false);
    }
  };

  // Computed Summary KPIs
  const stats = useMemo(() => {
    const totalSessions = historyList.length;
    const totalRecords = historyList.reduce((acc, h) => acc + (Number(h.total_students) || 0), 0);
    const totalPresent = historyList.reduce((acc, h) => acc + (Number(h.present_count) || 0), 0);
    const totalAbsent = historyList.reduce((acc, h) => acc + (Number(h.absent_count) || 0), 0);
    const avgPercentage = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
    const lowAttendanceSessions = historyList.filter(h => (Number(h.attendance_percentage) || 0) < 85).length;

    return { totalSessions, totalRecords, totalPresent, totalAbsent, avgPercentage, lowAttendanceSessions };
  }, [historyList]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return historyList;
    const q = searchQuery.toLowerCase();
    return historyList.filter(h =>
      (h.class_name && h.class_name.toLowerCase().includes(q)) ||
      (h.section_name && h.section_name.toLowerCase().includes(q)) ||
      (h.submitted_by && h.submitted_by.toLowerCase().includes(q)) ||
      (h.timing_name && h.timing_name.toLowerCase().includes(q)) ||
      (h.attendance_date && h.attendance_date.includes(q))
    );
  }, [historyList, searchQuery]);

  // Filtered Modal Records
  const modalRecords = useMemo(() => {
    const records = sessionDetails?.records || [];
    if (!modalStudentSearch.trim()) return records;
    const q = modalStudentSearch.toLowerCase();
    return records.filter(r =>
      (r.first_name && r.first_name.toLowerCase().includes(q)) ||
      (r.last_name && r.last_name.toLowerCase().includes(q)) ||
      (r.admission_number && r.admission_number.toLowerCase().includes(q)) ||
      String(r.roll_number || '').includes(q)
    );
  }, [sessionDetails?.records, modalStudentSearch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const isAnyFilterActive = (filterDate && filterDate !== todayStr) || filterClassId !== 'all' || filterSectionId !== 'all' || searchQuery;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Attendance History & Live Audit Trail</span>
              <span>•</span>
              <span className="text-emerald-200">{currentBranch?.branch_name}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Attendance Records & Session Logs
            </h2>
            <p className="text-xs text-emerald-100/90 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Browse recorded roll-calls across all classes and sections. Inspect student-level statuses, make verified updates with mandatory audit reasons, and track institutional attendance trends.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadHistory}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold transition-all"
              title="Refresh History"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-black/15 backdrop-blur-sm p-3 rounded-xl">
            <div className="text-[11px] font-medium text-emerald-200">Total Recorded Sessions</div>
            <div className="text-xl font-black mt-0.5">{stats.totalSessions}</div>
          </div>
          <div className="bg-black/15 backdrop-blur-sm p-3 rounded-xl">
            <div className="text-[11px] font-medium text-emerald-200">Students Evaluated</div>
            <div className="text-xl font-black mt-0.5">{stats.totalRecords}</div>
          </div>
          <div className="bg-black/15 backdrop-blur-sm p-3 rounded-xl">
            <div className="text-[11px] font-medium text-emerald-200">Overall Attendance Rate</div>
            <div className="text-xl font-black mt-0.5 flex items-center gap-1.5">
              <span>{stats.avgPercentage}%</span>
              <TrendingUp className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
          <div className="bg-black/15 backdrop-blur-sm p-3 rounded-xl">
            <div className="text-[11px] font-medium text-emerald-200">Attention Needed (&lt;85%)</div>
            <div className="text-xl font-black mt-0.5 text-amber-300">{stats.lowAttendanceSessions} <span className="text-xs font-normal text-white/70">sessions</span></div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search class, section, teacher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Date Filter & Quick Presets */}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            {filterDate === todayStr ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Today
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setFilterDate(todayStr)}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                title="Filter by Today"
              >
                Today
              </button>
            )}
            {filterDate && (
              <button
                type="button"
                onClick={() => setFilterDate('')}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Show All Dates"
              >
                All Dates
              </button>
            )}
          </div>

          {/* Class Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500 font-medium">Class:</span>
            <select
              value={filterClassId}
              onChange={e => {
                setFilterClassId(e.target.value);
                setFilterSectionId('all');
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={String(c.id)}>
                  {c.name || c.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          {availableSections.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 font-medium">Section:</span>
              <select
                value={filterSectionId}
                onChange={e => setFilterSectionId(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Sections</option>
                {availableSections.map(s => (
                  <option key={s.id} value={String(s.id)}>
                    Section {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {isAnyFilterActive && (
          <button
            onClick={() => {
              setFilterDate(todayStr);
              setFilterClassId('all');
              setFilterSectionId('all');
              setSearchQuery('');
            }}
            className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-bold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors inline-flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset to Today</span>
          </button>
        )}
      </div>

      {/* History Table */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-800 p-16 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Loading Attendance History...</p>
          <p className="text-xs text-slate-400 mt-1">Fetching session logs and verified roll-calls from database</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center shadow-xs">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {filterDate === todayStr ? 'No Attendance Sessions Recorded Today' : 'No Attendance Sessions Found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {filterDate === todayStr
              ? 'No attendance sessions have been taken yet for today. You can select another date above, or click below to view all past history.'
              : isAnyFilterActive
              ? 'No attendance records match your current filter criteria. Try adjusting date or class filters.'
              : 'No attendance sessions have been recorded yet for this branch.'}
          </p>
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Show All Past Attendance Dates</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Attendance Date</th>
                  <th className="py-3.5 px-4 font-bold">Class & Section</th>
                  <th className="py-3.5 px-4 font-bold">Timing Window</th>
                  <th className="py-3.5 px-4 font-bold text-center">Total</th>
                  <th className="py-3.5 px-4 font-bold text-center text-emerald-600 dark:text-emerald-400">Present</th>
                  <th className="py-3.5 px-4 font-bold text-center text-rose-600 dark:text-rose-400">Absent</th>
                  <th className="py-3.5 px-4 font-bold text-center text-amber-600 dark:text-amber-400">Leave</th>
                  <th className="py-3.5 px-4 font-bold text-center text-indigo-600 dark:text-indigo-400">Late</th>
                  <th className="py-3.5 px-4 font-bold text-center">Rate</th>
                  <th className="py-3.5 px-4 font-bold">Submitted By</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHistory.map((item, idx) => {
                  const total = Number(item.total_students) || 0;
                  const present = Number(item.present_count) || 0;
                  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

                  return (
                    <tr
                      key={`${item.attendance_date}-${item.class_id}-${item.section_id}-${idx}`}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{item.attendance_date}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {formatDate(item.attendance_date)}
                        </div>
                      </td>

                      {/* Class & Section */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold text-xs border border-emerald-200/60 dark:border-emerald-800/60">
                          <span>{item.class_name || 'Class'}</span>
                          <span className="text-emerald-400">•</span>
                          <span>Sec {item.section_name || 'A'}</span>
                        </span>
                      </td>

                      {/* Timing Window */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.timing_name || 'Regular Schedule'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.start_time || '08:30'} - {item.end_time || '12:30'}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-black text-slate-900 dark:text-white text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                          {total}
                        </span>
                      </td>

                      {/* Present */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{item.present_count}</span>
                        </span>
                      </td>

                      {/* Absent */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black ${
                          Number(item.absent_count) > 0
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                        }`}>
                          <XCircle className="w-3 h-3" />
                          <span>{item.absent_count}</span>
                        </span>
                      </td>

                      {/* Leave */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          Number(item.leave_count) > 0
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'text-slate-400'
                        }`}>
                          {item.leave_count}
                        </span>
                      </td>

                      {/* Late */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          Number(item.late_count) > 0
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'text-slate-400'
                        }`}>
                          {item.late_count}
                        </span>
                      </td>

                      {/* Attendance % */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                            pct >= 85
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : pct >= 70
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {pct}%
                          </span>
                          <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Submitted By */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.submitted_by || 'Staff'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.submitted_at
                            ? new Date(item.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleOpenDetails(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold transition-all border border-emerald-200/80 dark:border-emerald-800/80 active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Session Details & Audit History Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedSession.class_name} - Section {selectedSession.section_name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {selectedSession.timing_name || 'Regular Timing'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Session Date:{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedSession.attendance_date} ({formatDate(selectedSession.attendance_date)})
                  </span>{' '}
                  • Timing Window:{' '}
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">
                    {selectedSession.start_time} - {selectedSession.end_time}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Stats Bar */}
            {sessionDetails?.summary && (
              <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-center text-xs shrink-0">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    {sessionDetails.summary.total}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-600 block text-[10px] uppercase font-bold">Present</span>
                  <span className="font-black text-emerald-600 text-sm">{sessionDetails.summary.present}</span>
                </div>
                <div>
                  <span className="text-rose-600 block text-[10px] uppercase font-bold">Absent</span>
                  <span className="font-black text-rose-600 text-sm">{sessionDetails.summary.absent}</span>
                </div>
                <div>
                  <span className="text-amber-600 block text-[10px] uppercase font-bold">Leave</span>
                  <span className="font-black text-amber-600 text-sm">{sessionDetails.summary.leave}</span>
                </div>
                <div>
                  <span className="text-indigo-600 block text-[10px] uppercase font-bold">Late</span>
                  <span className="font-black text-indigo-600 text-sm">{sessionDetails.summary.late}</span>
                </div>
              </div>
            )}

            {/* Modal Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-2 shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('records')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'records'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Student Records ({sessionDetails?.records?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('audits')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'audits'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Audit Trail ({sessionDetails?.audits?.length || 0})</span>
                </button>
              </div>

              {activeTab === 'records' && (
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student or roll no..."
                    value={modalStudentSearch}
                    onChange={e => setModalStudentSearch(e.target.value)}
                    className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Tab 1: Records View */}
            {activeTab === 'records' && (
              <div className="overflow-y-auto flex-1 space-y-4">
                {isLoadingDetails ? (
                  <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Loading session records...</p>
                  </div>
                ) : modalRecords.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400">
                    No student records found matching search.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 sticky top-0 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3 font-bold">Roll</th>
                        <th className="py-2.5 px-3 font-bold">Student Name</th>
                        <th className="py-2.5 px-3 font-bold">Admission No</th>
                        <th className="py-2.5 px-3 font-bold text-center">Status</th>
                        <th className="py-2.5 px-3 font-bold">Remarks</th>
                        <th className="py-2.5 px-3 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {modalRecords.map(rec => {
                        const recId = rec.record_id || rec.id;
                        const isEditingThis = (editingRecord?.record_id || editingRecord?.id) === recId;
                        return (
                          <tr
                            key={recId}
                            className={`transition-colors ${
                              isEditingThis
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/40'
                                : 'hover:bg-slate-50/50 dark:hover:bg-slate-750'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 font-bold">
                              {rec.roll_number || '-'}
                            </td>

                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                              {rec.first_name} {rec.last_name}
                            </td>

                            <td className="py-2.5 px-3 font-mono text-slate-500">
                              {rec.admission_number || '-'}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                                  rec.status === 'Present'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : rec.status === 'Absent'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                    : rec.status === 'Leave'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                              {rec.custom_remark ? (
                                <span>
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {rec.remarks}:
                                  </span>{' '}
                                  <span className="italic">{rec.custom_remark}</span>
                                </span>
                              ) : (
                                rec.remarks || '-'
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleStartEditRecord(rec)}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Change Status</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {/* Edit Single Record Sub-Form */}
                {editingRecord && (
                  <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl space-y-3 mt-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Modify Status for: {editingRecord.first_name} {editingRecord.last_name} (
                          {editingRecord.admission_number})
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingRecord(null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleSaveRecordEdit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            New Status <span className="text-rose-500">*</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            {['Present', 'Absent', 'Leave', 'Late'].map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setNewStatus(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  newStatus === s
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Mandatory Reason for Change <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Student reported late with parent note"
                            value={editReason}
                            onChange={e => setEditReason(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingRecord(null)}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdatingRecord}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-all shadow-xs"
                        >
                          {isUpdatingRecord ? 'Logging & Saving...' : 'Save & Record Audit Log'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Audit Logs View */}
            {activeTab === 'audits' && (
              <div className="overflow-y-auto flex-1 space-y-3">
                {!sessionDetails?.audits || sessionDetails.audits.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400">
                    <ShieldAlert className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    No status corrections or audit logs recorded for this session yet.
                  </div>
                ) : (
                  sessionDetails.audits.map(a => (
                    <div
                      key={a.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {a.first_name} {a.last_name} ({a.admission_number || 'Student'})
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(a.changed_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {a.previous_status}
                        </span>
                        <span className="text-slate-400">➔</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {a.new_status}
                        </span>
                        <span className="text-slate-400 text-xs">
                          • Changed by: <strong className="text-slate-700 dark:text-slate-200">{a.changed_by}</strong>
                        </span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700 text-xs">
                        <span className="text-slate-400 font-bold uppercase text-[10px] block mb-0.5">Audit Reason:</span>
                        {a.reason}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistoryView;
