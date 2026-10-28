import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart3, Calendar, Download, RefreshCw, AlertTriangle, CheckCircle2, TrendingDown, Search, Printer, FileSpreadsheet, Clock, UserX, CalendarX2, UserCheck, Phone, Eye } from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { getClasses, getSectionsByClass, getSections } from '../../services/api';
import { useErp } from '../../context/ErpContext';
export const AttendanceReportsView = ({ branchId, academicYearId }) => {
    const { branches, academicYears, showToast } = useErp();
    const currentBranch = branches.find(b => b.id === branchId);
    const currentAy = academicYears.find(ay => ay.id === academicYearId);
    const [activeReport, setActiveReport] = useState('daily');
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const firstDay = useMemo(() => `${today.slice(0, 8)}01`, [today]);
    // Common and Specific Filters
    const [date, setDate] = useState(today);
    const [dateFrom, setDateFrom] = useState(firstDay);
    const [dateTo, setDateTo] = useState(today);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    // Consecutive Min Days Threshold
    const [consecutiveDays, setConsecutiveDays] = useState(3);
    const [consecutiveLeaveDays, setConsecutiveLeaveDays] = useState(2);
    const [consecutiveLateDays, setConsecutiveLateDays] = useState(2);
    // Frequent Absence Sorting
    const [frequentSortBy, setFrequentSortBy] = useState('highest_absence');
    // Low Attendance Threshold
    const [lowAttendanceThreshold, setLowAttendanceThreshold] = useState(75);
    // Student Attendance Individual selection
    const [studentsList, setStudentsList] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [studentIndividualReport, setStudentIndividualReport] = useState(null);
    // Report Data States
    const [dailyData, setDailyData] = useState(null);
    const [studentWiseData, setStudentWiseData] = useState([]);
    const [consecutiveAbsentData, setConsecutiveAbsentData] = useState([]);
    const [consecutiveLeaveData, setConsecutiveLeaveData] = useState([]);
    const [consecutiveLateData, setConsecutiveLateData] = useState([]);
    const [frequentAbsenceData, setFrequentAbsenceData] = useState([]);
    const [lateStudentsData, setLateStudentsData] = useState([]);
    const [lowAttendanceData, setLowAttendanceData] = useState([]);
    // 1. Load Classes on Branch / AY change
    useEffect(() => {
        if (!branchId || !academicYearId)
            return;
        getClasses(branchId, academicYearId)
            .then(res => {
            const cls = Array.isArray(res) ? res : (res?.data || []);
            setClasses(cls);
        })
            .catch(err => {
            console.error('Failed to fetch classes for reports:', err);
            setClasses([]);
        });
    }, [branchId, academicYearId]);
    // 2. Load Sections when Class changes
    useEffect(() => {
        if (!branchId || !academicYearId) {
            setSections([]);
            setSelectedSectionId('');
            return;
        }
        if (selectedClassId) {
            getSectionsByClass(Number(selectedClassId), branchId, academicYearId)
                .then(secs => {
                setSections(secs || []);
                setSelectedSectionId('');
            })
                .catch(err => {
                console.error('Failed to fetch sections for class:', err);
                setSections([]);
                setSelectedSectionId('');
            });
        }
        else {
            getSections(branchId, academicYearId)
                .then(res => {
                const secs = Array.isArray(res) ? res : (res?.data || []);
                setSections(secs || []);
                setSelectedSectionId('');
            })
                .catch(err => {
                console.error('Failed to fetch all sections:', err);
                setSections([]);
                setSelectedSectionId('');
            });
        }
    }, [selectedClassId, branchId, academicYearId]);

    // Available sections: deduplicated by name when All Classes selected
    const availableSections = useMemo(() => {
        if (!selectedClassId) {
            const unique = new Map();
            (sections || []).forEach(s => {
                if (s && s.name && !unique.has(s.name)) {
                    unique.set(s.name, { id: s.name, name: s.name });
                }
            });
            return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
        }
        return sections || [];
    }, [selectedClassId, sections]);
    // 3. Load Students for Class & Section (for Student Attendance Report)
    useEffect(() => {
        if (activeReport !== 'student_attendance')
            return;
        if (!branchId || !academicYearId || !selectedClassId || !selectedSectionId) {
            setStudentsList([]);
            return;
        }
        attendanceApi.getStudentsToMark(branchId, academicYearId, Number(selectedClassId), Number(selectedSectionId), date)
            .then(res => {
            const list = Array.isArray(res) ? res : [];
            setStudentsList(list);
            if (list.length > 0 && !selectedStudentId) {
                setSelectedStudentId(list[0].student_id);
            }
        })
            .catch(err => {
            console.error('Failed to load students for selection:', err);
            setStudentsList([]);
        });
    }, [activeReport, branchId, academicYearId, selectedClassId, selectedSectionId, date, selectedStudentId]);
    // 4. Primary Data Fetcher for Active Report
    const loadReportData = useCallback(async () => {
        if (!branchId || !academicYearId)
            return;
        setIsLoading(true);
        try {
            const isNumericSec = selectedSectionId && !isNaN(Number(selectedSectionId));
            const secParam = selectedSectionId ? (isNumericSec ? Number(selectedSectionId) : selectedSectionId) : undefined;
            const clsParam = selectedClassId ? Number(selectedClassId) : undefined;

            const ayParam = currentAy?.academic_year || currentAy?.year_name || undefined;

            if (activeReport === 'daily') {
                const res = await attendanceApi.getDailyReport(branchId, academicYearId, date, ayParam);
                setDailyData(res);
            }
            else if (activeReport === 'student_attendance') {
                if (selectedStudentId) {
                    const indRes = await attendanceApi.getStudentIndividualReport(branchId, academicYearId, selectedStudentId, dateFrom, dateTo, ayParam);
                    setStudentIndividualReport(indRes);
                }
                // Also fetch general roster overview
                const res = await attendanceApi.getStudentWiseReport(branchId, academicYearId, clsParam, secParam, undefined, ayParam, dateFrom, dateTo);
                setStudentWiseData(res || []);
            }
            else if (activeReport === 'consecutive_absent') {
                const res = await attendanceApi.getConsecutiveAbsentReport(branchId, academicYearId, consecutiveDays, clsParam, secParam);
                setConsecutiveAbsentData(res || []);
            }
            else if (activeReport === 'consecutive_leave') {
                const res = await attendanceApi.getConsecutiveLeaveReport(branchId, academicYearId, consecutiveLeaveDays, clsParam, secParam);
                setConsecutiveLeaveData(res || []);
            }
            else if (activeReport === 'consecutive_late') {
                const res = await attendanceApi.getConsecutiveLateReport(branchId, academicYearId, consecutiveLateDays, clsParam, secParam);
                setConsecutiveLateData(res || []);
            }
            else if (activeReport === 'frequent_absence') {
                const res = await attendanceApi.getFrequentAbsenceReport(branchId, academicYearId, dateFrom, dateTo, clsParam, secParam, frequentSortBy);
                setFrequentAbsenceData(res || []);
            }
            else if (activeReport === 'late_students') {
                const res = await attendanceApi.getLateStudentsReport(branchId, academicYearId, dateFrom, dateTo, clsParam, secParam);
                setLateStudentsData(res || []);
            }
            else if (activeReport === 'low_attendance') {
                const res = await attendanceApi.getLowAttendanceReport(branchId, academicYearId, lowAttendanceThreshold);
                setLowAttendanceData(res || []);
            }
        }
        catch (err) {
            console.error('Failed to load report data:', err);
            showToast('error', err.message || 'Could not load report data');
        }
        finally {
            setIsLoading(false);
        }
    }, [
        activeReport,
        branchId,
        academicYearId,
        date,
        dateFrom,
        dateTo,
        selectedClassId,
        selectedSectionId,
        selectedStudentId,
        consecutiveDays,
        consecutiveLeaveDays,
        consecutiveLateDays,
        frequentSortBy,
        lowAttendanceThreshold,
        currentAy,
        showToast
    ]);
    useEffect(() => {
        loadReportData();
    }, [loadReportData]);
    // Export to CSV and Excel
    const handleExport = (format) => {
        let headers = [];
        let rows = [];
        let title = activeReport;
        if (activeReport === 'daily') {
            title = `Day_Wise_Attendance_${date}`;
            headers = ['Class', 'Section', 'Total Students', 'Present', 'Absent', 'Leave', 'Late', 'Attendance %'];
            rows = (dailyData?.classes || []).map((c) => [
                `"${c.class_name}"`,
                `"${c.section_name}"`,
                c.total_enrolled,
                c.present_count,
                c.absent_count,
                c.leave_count,
                c.late_count,
                `${c.attendance_percentage}%`
            ]);
        }
        else if (activeReport === 'student_attendance') {
            if (selectedStudentId && studentIndividualReport) {
                title = `Student_${studentIndividualReport.student.admission_number}_Attendance`;
                headers = ['Date', 'Status', 'Remarks', 'Marked By'];
                rows = (studentIndividualReport.records || []).map((r) => [
                    r.attendance_date,
                    r.status,
                    `"${r.remarks || r.custom_remark || '-'}"`,
                    `"${r.submitted_by || 'Staff'}"`
                ]);
            }
            else {
                title = `Student_Attendance_Roster`;
                headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Present Days', 'Absent Days', 'Attendance %'];
                rows = studentWiseData.map(s => [
                    s.roll_number || '',
                    s.admission_number,
                    `"${s.first_name} ${s.last_name}"`,
                    s.class_name,
                    s.section_name,
                    s.present_days,
                    s.absent_days,
                    `${s.attendance_percentage}%`
                ]);
            }
        }
        else if (activeReport === 'consecutive_absent') {
            title = `Consecutive_Absent_Report_${consecutiveDays}Days`;
            headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Absent From', 'Absent To', 'Consecutive Days'];
            rows = consecutiveAbsentData.map(s => [
                s.roll_number || '',
                s.admission_number,
                `"${s.student_name}"`,
                s.class_name,
                s.section_name,
                s.from_date,
                s.to_date,
                s.consecutive_days
            ]);
        }
        else if (activeReport === 'consecutive_leave') {
            title = `Consecutive_Leave_Report_${consecutiveLeaveDays}Days`;
            headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Leave From', 'Leave To', 'Consecutive Days'];
            rows = consecutiveLeaveData.map(s => [
                s.roll_number || '',
                s.admission_number,
                `"${s.student_name}"`,
                s.class_name,
                s.section_name,
                s.from_date,
                s.to_date,
                s.consecutive_days
            ]);
        }
        else if (activeReport === 'consecutive_late') {
            title = `Consecutive_Late_Report_${consecutiveLateDays}Days`;
            headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Late From', 'Late To', 'Consecutive Days'];
            rows = consecutiveLateData.map(s => [
                s.roll_number || '',
                s.admission_number,
                `"${s.student_name}"`,
                s.class_name,
                s.section_name,
                s.from_date,
                s.to_date,
                s.consecutive_days
            ]);
        }
        else if (activeReport === 'frequent_absence') {
            title = `Frequent_Absence_Report`;
            headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Working Days', 'Absent Days', 'Attendance %'];
            rows = frequentAbsenceData.map(s => [
                s.roll_number || '',
                s.admission_number,
                `"${s.student_name}"`,
                s.class_name,
                s.section_name,
                s.working_days,
                s.absent_days,
                `${s.attendance_percentage}%`
            ]);
        }
        else if (activeReport === 'late_students') {
            title = `Late_Student_Report`;
            headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Working Days', 'Late Occurrences', 'Latest Late Date', 'Overall %'];
            rows = lateStudentsData.map(s => [
                s.roll_number || '',
                s.admission_number,
                `"${s.student_name}"`,
                s.class_name,
                s.section_name,
                s.working_days,
                s.late_days,
                s.latest_late_date || '-',
                `${s.attendance_percentage}%`
            ]);
        }
        else if (activeReport === 'low_attendance') {
            title = `Low_Attendance_Below_${lowAttendanceThreshold}Pct`;
            headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Parent Name', 'Parent Contact', 'Absent Days', 'Attendance %'];
            rows = lowAttendanceData.map(s => [
                s.roll_number || '',
                s.admission_number,
                `"${s.first_name} ${s.last_name}"`,
                s.class_name,
                s.section_name,
                `"${s.parent_name || s.father_name || '-'}"`,
                s.father_mobile || s.parent_contact || '-',
                s.absent_days,
                `${s.attendance_percentage}%`
            ]);
        }
        if (rows.length === 0) {
            showToast('info', 'No records to export for this selection.');
            return;
        }
        const csvContent = (format === 'excel' ? '\uFEFF' : '') + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title}_${format === 'excel' ? 'excel.csv' : 'export.csv'}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('success', `${title} exported successfully.`);
    };
    // Print Handler
    const handlePrint = () => {
        window.print();
    };
    // Exactly 8 Reports as requested
    const reportTabs = [
        { id: 'daily', label: '1. Day-wise Attendance', icon: Calendar, shortDesc: 'Class & section daily roll-call' },
        { id: 'student_attendance', label: '2. Student Attendance Report', icon: UserCheck, shortDesc: 'Student date-wise ledger' },
        { id: 'consecutive_absent', label: '3. Consecutive Absent Report', icon: UserX, shortDesc: 'Continuous absences threshold' },
        { id: 'consecutive_leave', label: '4. Consecutive Leave Report', icon: CalendarX2, shortDesc: 'Long multi-day leaves' },
        { id: 'consecutive_late', label: '5. Consecutive Late Report', icon: Clock, shortDesc: 'Repeated successive late arrivals' },
        { id: 'frequent_absence', label: '6. Frequent Absence Report', icon: AlertTriangle, shortDesc: 'Chronic absenteeism patterns' },
        { id: 'late_students', label: '7. Late Student Report', icon: Clock, shortDesc: 'Students with tardiness records' },
        { id: 'low_attendance', label: '8. Low Attendance Report', icon: TrendingDown, shortDesc: 'Below threshold notification' }
    ];
    return (<div className="space-y-6">
      {/* 1. Header & Branch Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4"/>
            <span>Attendance Reports Engine</span>
            <span>•</span>
            <span className="font-bold">{currentBranch?.branch_name}</span>
            <span>•</span>
            <span>{currentAy?.year_name || 'Active Year'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Comprehensive Attendance Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time daily roll-call analytics, student ledgers, consecutive absence tracking, and low-attendance compliance.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-2">
          <button onClick={loadReportData} disabled={isLoading} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Refresh Report Data">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
          </button>

          <button onClick={() => handleExport('csv')} className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors shadow-2xs" title="Export CSV">
            <Download className="w-3.5 h-3.5"/>
            <span>CSV</span>
          </button>

          <button onClick={() => handleExport('excel')} className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs" title="Export formatted for Excel">
            <FileSpreadsheet className="w-3.5 h-3.5"/>
            <span>Excel</span>
          </button>

          <button onClick={handlePrint} className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs" title="Print printable sheet">
            <Printer className="w-3.5 h-3.5"/>
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 8 Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {reportTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeReport === tab.id;
            return (<button key={tab.id} onClick={() => {
                    setActiveReport(tab.id);
                    setSearchQuery('');
                }} className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all cursor-pointer ${isActive
                    ? 'bg-emerald-700 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/80 dark:hover:bg-slate-800 font-medium'}`}>
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`}/>
              <span className="text-[11px] leading-tight font-bold line-clamp-2">{tab.label}</span>
            </button>);
        })}
      </div>

      {/* 3. Filter Bar (Contextually adapted to Active Report) */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Day-Wise Filter: Date Picker */}
          {activeReport === 'daily' && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Date:</span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"/>
            </div>)}

          {/* Student Attendance & Consecutive & Frequent: Class & Section Selector */}
          {activeReport !== 'daily' && (<>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Class:</span>
                <select value={selectedClassId} onChange={e => { setSelectedClassId(e.target.value ? Number(e.target.value) : ''); setSelectedSectionId(''); }} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold">
                  <option value="">All Classes</option>
                  {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>

              {availableSections.length > 0 && (<div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Section:</span>
                  <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold">
                    <option value="">All Sections</option>
                    {availableSections.map(s => (<option key={s.id} value={String(s.id)}>{s.name}</option>))}
                  </select>
                </div>)}
            </>)}

          {/* Date Range for Student Attendance, Frequent Absence, Late Students */}
          {(activeReport === 'student_attendance' || activeReport === 'frequent_absence' || activeReport === 'late_students') && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">From:</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"/>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">To:</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"/>
            </div>)}

          {/* Student Selector when on Student Attendance Report */}
          {activeReport === 'student_attendance' && studentsList.length > 0 && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Select Student:</span>
              <select value={selectedStudentId || ''} onChange={e => setSelectedStudentId(Number(e.target.value))} className="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-slate-900 text-emerald-950 dark:text-emerald-300 font-bold">
                {studentsList.map(st => (<option key={st.student_id} value={st.student_id}>
                    {st.roll_number ? `[Roll ${st.roll_number}] ` : ''}{st.first_name} {st.last_name} ({st.admission_number})
                  </option>))}
              </select>
            </div>)}

          {/* Consecutive Absent Threshold */}
          {activeReport === 'consecutive_absent' && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Min Consecutive Days:</span>
              <select value={consecutiveDays} onChange={e => setConsecutiveDays(Number(e.target.value))} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold">
                <option value={2}>2+ Days</option>
                <option value={3}>3+ Days (Standard)</option>
                <option value={4}>4+ Days</option>
                <option value={5}>5+ Days</option>
                <option value={7}>7+ Days (Critical)</option>
              </select>
            </div>)}

          {/* Consecutive Leave Threshold */}
          {activeReport === 'consecutive_leave' && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Min Leave Days:</span>
              <select value={consecutiveLeaveDays} onChange={e => setConsecutiveLeaveDays(Number(e.target.value))} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold">
                <option value={2}>2+ Days</option>
                <option value={3}>3+ Days</option>
                <option value={4}>4+ Days</option>
                <option value={5}>5+ Days</option>
              </select>
            </div>)}

          {/* Consecutive Late Threshold */}
          {activeReport === 'consecutive_late' && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Min Late Days:</span>
              <select value={consecutiveLateDays} onChange={e => setConsecutiveLateDays(Number(e.target.value))} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold">
                <option value={2}>2+ Days</option>
                <option value={3}>3+ Days</option>
                <option value={4}>4+ Days</option>
                <option value={5}>5+ Days</option>
              </select>
            </div>)}

          {/* Frequent Absence Sort Order */}
          {activeReport === 'frequent_absence' && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Sort By:</span>
              <select value={frequentSortBy} onChange={e => setFrequentSortBy(e.target.value)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold">
                <option value="highest_absence">Highest Absences First</option>
                <option value="lowest_attendance">Lowest Attendance % First</option>
              </select>
            </div>)}

          {/* Low Attendance Threshold */}
          {activeReport === 'low_attendance' && (<div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Threshold:</span>
              <div className="relative">
                <input type="number" min={1} max={100} value={lowAttendanceThreshold} onChange={e => setLowAttendanceThreshold(Number(e.target.value))} className="text-xs w-20 px-2.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 font-black"/>
                <span className="absolute right-2 top-1.5 text-xs text-rose-600 font-bold">%</span>
              </div>
            </div>)}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"/>
          <input type="text" placeholder="Search student or roll no..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"/>
        </div>
      </div>

      {/* 4. SUMMARY CARDS (Tailored to active report) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activeReport === 'daily' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Enrolled Students</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{dailyData?.total_students || 0}</p>
              <span className="text-[11px] text-slate-400 font-medium">Branch active count</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Present Today</span>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{dailyData?.present_count || 0}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">{dailyData?.attendance_percentage || 0}% overall</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-800/40">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">Absent Today</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{dailyData?.absent_count || 0}</p>
              <span className="text-[11px] text-rose-600 font-semibold">Immediate attention</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Leave & Late</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">{(dailyData?.leave_count || 0) + (dailyData?.late_count || 0)}</p>
              <span className="text-[11px] text-amber-600 font-semibold">{dailyData?.leave_count || 0} Leave • {dailyData?.late_count || 0} Late</span>
            </div>
          </>)}

        {activeReport === 'student_attendance' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Working Days</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {studentIndividualReport?.summary?.total_days || studentWiseData.length}
              </p>
              <span className="text-[11px] text-slate-400 font-medium">In selected date range</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Present</span>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {studentIndividualReport?.summary?.present ?? '-'}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">
                {studentIndividualReport?.summary?.attendance_percentage ?? 0}% rate
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-800/40">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">Absent Days</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">
                {studentIndividualReport?.summary?.absent ?? '-'}
              </p>
              <span className="text-[11px] text-rose-600 font-semibold">Total absences logged</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Leave / Late</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                {(studentIndividualReport?.summary?.leave || 0) + (studentIndividualReport?.summary?.late || 0)}
              </p>
              <span className="text-[11px] text-amber-600 font-semibold">
                {studentIndividualReport?.summary?.leave || 0} Leave • {studentIndividualReport?.summary?.late || 0} Late
              </span>
            </div>
          </>)}

        {activeReport === 'consecutive_absent' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-800/40">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">Flagged Students</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{consecutiveAbsentData.length}</p>
              <span className="text-[11px] text-rose-600 font-medium">Exceeding {consecutiveDays}+ days</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Streak Threshold</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{consecutiveDays} Days</p>
              <span className="text-[11px] text-slate-400 font-medium">Minimum consecutive absence</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Max Absence Streak</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                {consecutiveAbsentData.length > 0 ? Math.max(...consecutiveAbsentData.map(s => s.consecutive_days)) : 0} Days
              </p>
              <span className="text-[11px] text-amber-600 font-semibold">Highest continuous absence</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Follow-up Required</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{consecutiveAbsentData.length}</p>
              <span className="text-[11px] text-slate-400 font-medium">Parent call recommended</span>
            </div>
          </>)}

        {activeReport === 'consecutive_leave' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Students on Leave</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">{consecutiveLeaveData.length}</p>
              <span className="text-[11px] text-amber-600 font-medium">Continuous leave streaks</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Leave Threshold</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{consecutiveLeaveDays} Days</p>
              <span className="text-[11px] text-slate-400 font-medium">Filter threshold</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Max Leave Streak</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {consecutiveLeaveData.length > 0 ? Math.max(...consecutiveLeaveData.map(s => s.consecutive_days)) : 0} Days
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Longest leave reported</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Medical / Casual</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{consecutiveLeaveData.length}</p>
              <span className="text-[11px] text-slate-400 font-medium">With authorized reasons</span>
            </div>
          </>)}

        {activeReport === 'consecutive_late' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-orange-200 dark:border-orange-800/40">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase">Late Streak Students</span>
              <p className="text-2xl font-black text-orange-700 dark:text-orange-400 mt-1">{consecutiveLateData.length}</p>
              <span className="text-[11px] text-orange-600 font-medium">Successive late roll-calls</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Late Threshold</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{consecutiveLateDays} Days</p>
              <span className="text-[11px] text-slate-400 font-medium">Consecutive threshold</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Max Late Streak</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {consecutiveLateData.length > 0 ? Math.max(...consecutiveLateData.map(s => s.consecutive_days)) : 0} Days
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Highest consecutive streak</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Transport / Commute</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{consecutiveLateData.length}</p>
              <span className="text-[11px] text-slate-400 font-medium">Transit verification needed</span>
            </div>
          </>)}

        {activeReport === 'frequent_absence' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-800/40">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">Frequent Absentees</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{frequentAbsenceData.length}</p>
              <span className="text-[11px] text-rose-600 font-medium">Identified in date range</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Average Absences</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {frequentAbsenceData.length > 0
                ? (frequentAbsenceData.reduce((acc, s) => acc + s.absent_days, 0) / frequentAbsenceData.length).toFixed(1)
                : 0} Days
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Per flagged student</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Highest Absence</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                {frequentAbsenceData.length > 0 ? Math.max(...frequentAbsenceData.map(s => s.absent_days)) : 0} Days
              </p>
              <span className="text-[11px] text-amber-600 font-medium">Peak absentee record</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Counseling Candidates</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {frequentAbsenceData.filter(s => s.absent_days >= 3).length}
              </p>
              <span className="text-[11px] text-slate-400 font-medium">3+ absences recorded</span>
            </div>
          </>)}

        {activeReport === 'late_students' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-orange-200 dark:border-orange-800/40">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase">Late Arrivals</span>
              <p className="text-2xl font-black text-orange-700 dark:text-orange-400 mt-1">{lateStudentsData.length}</p>
              <span className="text-[11px] text-orange-600 font-medium">Unique students marked late</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Late Incidents</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {lateStudentsData.reduce((acc, s) => acc + (s.late_days || 0), 0)}
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Total tardiness events</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Max Late Days</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {lateStudentsData.length > 0 ? Math.max(...lateStudentsData.map(s => s.late_days || 0)) : 0}
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Highest count per student</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Morning Punctuality</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {lateStudentsData.length > 0 ? `${(100 - (lateStudentsData.length * 2.5)).toFixed(0)}%` : '100%'}
              </p>
              <span className="text-[11px] text-slate-400 font-medium">On-time adherence estimate</span>
            </div>
          </>)}

        {activeReport === 'low_attendance' && (<>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-800/40">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">Below Threshold</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{lowAttendanceData.length}</p>
              <span className="text-[11px] text-rose-600 font-medium">Under {lowAttendanceThreshold}% attendance</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Regulatory Cutoff</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{lowAttendanceThreshold}%</p>
              <span className="text-[11px] text-slate-400 font-medium">Statutory exam minimum</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Lowest Rate</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                {lowAttendanceData.length > 0 ? `${Math.min(...lowAttendanceData.map(s => s.attendance_percentage))}%` : 'N/A'}
              </p>
              <span className="text-[11px] text-amber-600 font-medium">Minimum student rate</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Parent Notices</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{lowAttendanceData.length}</p>
              <span className="text-[11px] text-slate-400 font-medium">Automated alert alerts</span>
            </div>
          </>)}
      </div>

      {/* 5. DATA TABLES (Clean, high-contrast, responsive format for each report) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
        {isLoading ? (<div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 mx-auto text-emerald-600 animate-spin mb-3"/>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Loading attendance report records...</p>
            <p className="text-xs text-slate-400 mt-1">Querying branch database records</p>
          </div>) : (<>
            {/* REPORT 1: DAY-WISE ATTENDANCE */}
            {activeReport === 'daily' && (<div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Class</th>
                      <th className="px-4 py-3">Section</th>
                      <th className="px-4 py-3 text-center">Total Students</th>
                      <th className="px-4 py-3 text-center text-emerald-700 dark:text-emerald-400">Present</th>
                      <th className="px-4 py-3 text-center text-rose-700 dark:text-rose-400">Absent</th>
                      <th className="px-4 py-3 text-center text-amber-700 dark:text-amber-400">Leave</th>
                      <th className="px-4 py-3 text-center text-orange-700 dark:text-orange-400">Late</th>
                      <th className="px-4 py-3 text-center">Attendance %</th>
                      <th className="px-4 py-3 text-right">Session Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(dailyData?.classes || []).length === 0 ? (<tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                          No class attendance records found for {date}.
                        </td>
                      </tr>) : ((dailyData?.classes || [])
                    .filter((c) => !searchQuery || c.class_name.toLowerCase().includes(searchQuery.toLowerCase()) || c.section_name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((c, idx) => (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{c.class_name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{c.section_name}</td>
                            <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">{c.total_enrolled}</td>
                            <td className="px-4 py-3 text-center font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">{c.present_count}</td>
                            <td className="px-4 py-3 text-center font-black text-rose-700 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20">{c.absent_count}</td>
                            <td className="px-4 py-3 text-center font-semibold text-amber-700 dark:text-amber-400">{c.leave_count}</td>
                            <td className="px-4 py-3 text-center font-semibold text-orange-700 dark:text-orange-400">{c.late_count}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="inline-flex items-center space-x-1.5">
                                <span className={`font-black ${c.attendance_percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {c.attendance_percentage}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {c.is_completed ? (<span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3"/>
                                  <span>Completed</span>
                                </span>) : (<span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  <span>Pending</span>
                                </span>)}
                            </td>
                          </tr>)))}
                  </tbody>
                </table>
              </div>)}

            {/* REPORT 2: STUDENT ATTENDANCE REPORT */}
            {activeReport === 'student_attendance' && (<div>
                {/* If a single student is selected, show their individual date-wise ledger */}
                {selectedStudentId && studentIndividualReport ? (<div>
                    <div className="p-4 bg-emerald-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {studentIndividualReport.student.first_name?.[0]}{studentIndividualReport.student.last_name?.[0]}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {studentIndividualReport.student.first_name} {studentIndividualReport.student.last_name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Admission No: <span className="font-semibold">{studentIndividualReport.student.admission_number}</span> • 
                            Class: <span className="font-semibold">{studentIndividualReport.student.class_name} - {studentIndividualReport.student.section_name}</span> • 
                            Roll: <span className="font-semibold">{studentIndividualReport.student.roll_number || 'N/A'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-emerald-700 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                          Overall Attendance: {studentIndividualReport.summary?.attendance_percentage || 0}%
                        </span>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Day</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3">Remarks / Reason</th>
                          <th className="px-4 py-3 text-right">Marked By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(studentIndividualReport.records || []).length === 0 ? (<tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                              No attendance dates recorded for this student in the selected range.
                            </td>
                          </tr>) : ((studentIndividualReport.records || []).map((r, idx) => {
                        const d = new Date(r.attendance_date);
                        const dayName = isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { weekday: 'short' });
                        return (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{r.attendance_date}</td>
                                <td className="px-4 py-3 text-slate-500 font-medium">{dayName}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-black ${r.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : r.status === 'Absent'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                                    : r.status === 'Leave'
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300'}`}>
                                    {r.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 italic">
                                  {r.remarks || r.custom_remark || '-'}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500 font-medium">
                                  {r.submitted_by || 'Class Teacher'}
                                </td>
                              </tr>);
                    }))}
                      </tbody>
                    </table>
                  </div>) : (
                /* Class roster view */
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Roll No</th>
                        <th className="px-4 py-3">Admission No</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Class & Section</th>
                        <th className="px-4 py-3 text-center">Present</th>
                        <th className="px-4 py-3 text-center">Absent</th>
                        <th className="px-4 py-3 text-center">Attendance %</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {studentWiseData.length === 0 ? (<tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                            Select a Class and Section to load student attendance records.
                          </td>
                        </tr>) : (studentWiseData
                        .filter(s => !searchQuery || `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) || s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((s, idx) => (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-500">{s.roll_number || '-'}</td>
                              <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{s.admission_number}</td>
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                {s.first_name} {s.last_name}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.class_name} - {s.section_name}</td>
                              <td className="px-4 py-3 text-center font-bold text-emerald-700 dark:text-emerald-400">{s.present_days}</td>
                              <td className="px-4 py-3 text-center font-bold text-rose-700 dark:text-rose-400">{s.absent_days}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`font-black ${s.attendance_percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {s.attendance_percentage}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={() => setSelectedStudentId(s.student_id)} className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors">
                                  <Eye className="w-3 h-3"/>
                                  <span>View Ledger</span>
                                </button>
                              </td>
                            </tr>)))}
                    </tbody>
                  </table>)}
              </div>)}

            {/* REPORT 3: CONSECUTIVE ABSENT REPORT */}
            {activeReport === 'consecutive_absent' && (<div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class & Section</th>
                      <th className="px-4 py-3">Absent From</th>
                      <th className="px-4 py-3">Absent To</th>
                      <th className="px-4 py-3 text-center text-rose-700">Consecutive Days</th>
                      <th className="px-4 py-3 text-right">Alert Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {consecutiveAbsentData.length === 0 ? (<tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                          No students found with {consecutiveDays} or more consecutive absent days.
                        </td>
                      </tr>) : (consecutiveAbsentData
                    .filter(s => !searchQuery || s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s, idx) => (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-500">{s.roll_number || '-'}</td>
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{s.admission_number}</td>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.student_name}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.class_name} - {s.section_name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.from_date}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.to_date}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-200">
                                {s.consecutive_days} Days Streak
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-[11px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                Critical Absence
                              </span>
                            </td>
                          </tr>)))}
                  </tbody>
                </table>
              </div>)}

            {/* REPORT 4: CONSECUTIVE LEAVE REPORT */}
            {activeReport === 'consecutive_leave' && (<div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class & Section</th>
                      <th className="px-4 py-3">Leave From</th>
                      <th className="px-4 py-3">Leave To</th>
                      <th className="px-4 py-3 text-center text-amber-700">Consecutive Days</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {consecutiveLeaveData.length === 0 ? (<tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                          No students found on {consecutiveLeaveDays} or more consecutive leave days.
                        </td>
                      </tr>) : (consecutiveLeaveData
                    .filter(s => !searchQuery || s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s, idx) => (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-500">{s.roll_number || '-'}</td>
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{s.admission_number}</td>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.student_name}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.class_name} - {s.section_name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.from_date}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.to_date}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200">
                                {s.consecutive_days} Days Streak
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Approved Leave
                              </span>
                            </td>
                          </tr>)))}
                  </tbody>
                </table>
              </div>)}

            {/* REPORT 5: CONSECUTIVE LATE REPORT */}
            {activeReport === 'consecutive_late' && (<div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class & Section</th>
                      <th className="px-4 py-3">Late From</th>
                      <th className="px-4 py-3">Late To</th>
                      <th className="px-4 py-3 text-center text-orange-700">Consecutive Late Days</th>
                      <th className="px-4 py-3 text-right">Discipline Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {consecutiveLateData.length === 0 ? (<tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                          No students found with {consecutiveLateDays} or more consecutive late roll-calls.
                        </td>
                      </tr>) : (consecutiveLateData
                    .filter(s => !searchQuery || s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s, idx) => (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-500">{s.roll_number || '-'}</td>
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{s.admission_number}</td>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.student_name}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.class_name} - {s.section_name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.from_date}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.to_date}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-900 border border-orange-200">
                                {s.consecutive_days} Days Streak
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-[11px] font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                Successive Tardiness
                              </span>
                            </td>
                          </tr>)))}
                  </tbody>
                </table>
              </div>)}

            {/* REPORT 6: FREQUENT ABSENCE REPORT */}
            {activeReport === 'frequent_absence' && (<div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class & Section</th>
                      <th className="px-4 py-3 text-center">Working Days</th>
                      <th className="px-4 py-3 text-center text-rose-700">Days Absent</th>
                      <th className="px-4 py-3 text-center">Attendance %</th>
                      <th className="px-4 py-3 text-right">Pattern Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {frequentAbsenceData.length === 0 ? (<tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                          No frequent absenteeism patterns detected in this date range.
                        </td>
                      </tr>) : (frequentAbsenceData
                    .filter(s => !searchQuery || s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s, idx) => (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-500">{s.roll_number || '-'}</td>
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{s.admission_number}</td>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.student_name}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.class_name} - {s.section_name}</td>
                            <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">{s.working_days}</td>
                            <td className="px-4 py-3 text-center font-black text-rose-700 bg-rose-50/50">{s.absent_days}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-black ${s.attendance_percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {s.attendance_percentage}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold uppercase ${s.absent_days >= 4
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                                {s.absent_days >= 4 ? 'Chronic Absentee' : 'Frequent Absent'}
                              </span>
                            </td>
                          </tr>)))}
                  </tbody>
                </table>
              </div>)}

            {/* REPORT 7: LATE STUDENT REPORT */}
            {activeReport === 'late_students' && (<div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class & Section</th>
                      <th className="px-4 py-3 text-center">Working Days</th>
                      <th className="px-4 py-3 text-center text-orange-700">Late Days Count</th>
                      <th className="px-4 py-3">Latest Late Date</th>
                      <th className="px-4 py-3 text-right">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {lateStudentsData.length === 0 ? (<tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                          No late arrivals found in this date range.
                        </td>
                      </tr>) : (lateStudentsData
                    .filter(s => !searchQuery || s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s, idx) => (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-500">{s.roll_number || '-'}</td>
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{s.admission_number}</td>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.student_name}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.class_name} - {s.section_name}</td>
                            <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">{s.working_days}</td>
                            <td className="px-4 py-3 text-center font-black text-orange-700 bg-orange-50/50">{s.late_days}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.latest_late_date || '-'}</td>
                            <td className="px-4 py-3 text-right font-black text-slate-800 dark:text-slate-200">
                              {s.attendance_percentage}%
                            </td>
                          </tr>)))}
                  </tbody>
                </table>
              </div>)}

            {/* REPORT 8: LOW ATTENDANCE REPORT */}
            {activeReport === 'low_attendance' && (<div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class & Section</th>
                      <th className="px-4 py-3">Parent Name & Contact</th>
                      <th className="px-4 py-3 text-center">Absent Days</th>
                      <th className="px-4 py-3 text-center text-rose-700">Attendance %</th>
                      <th className="px-4 py-3 text-right">Deficit to {lowAttendanceThreshold}%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {lowAttendanceData.length === 0 ? (<tr>
                        <td colSpan={8} className="p-8 text-center text-emerald-600 font-bold">
                          Excellent! No students are below the {lowAttendanceThreshold}% attendance threshold.
                        </td>
                      </tr>) : (lowAttendanceData
                    .filter(s => !searchQuery || `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) || s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s, idx) => {
                    const deficit = (lowAttendanceThreshold - s.attendance_percentage).toFixed(1);
                    return (<tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-500">{s.roll_number || '-'}</td>
                              <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{s.admission_number}</td>
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                {s.first_name} {s.last_name}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.class_name} - {s.section_name}</td>
                              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                <div className="font-semibold">{s.parent_name || s.father_name || 'Parent'}</div>
                                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                                  <Phone className="w-2.5 h-2.5"/>
                                  <span>{s.father_mobile || s.parent_contact || '-'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center font-bold text-rose-700">{s.absent_days}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                                  {s.attendance_percentage}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-black text-rose-700">
                                  -{deficit}%
                                </span>
                              </td>
                            </tr>);
                }))}
                  </tbody>
                </table>
              </div>)}
          </>)}
      </div>
    </div>);
};
