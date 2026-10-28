import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserX, Search, Send, RefreshCw, Download, PhoneCall, CheckCircle2 } from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { getClasses, getSectionsByClass, getSections } from '../../services/api';
import { useErp } from '../../context/ErpContext';
import { AbsentNotificationModal } from './AbsentNotificationModal';
export const AbsentReportView = ({ branchId, academicYearId }) => {
    const { branches, showToast } = useErp();
    const currentBranch = branches.find(b => b.id === branchId);
    const [absentees, setAbsentees] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Filters
    const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
    const [filterClassId, setFilterClassId] = useState('all');
    const [filterSectionId, setFilterSectionId] = useState('all');
    const [filterGender, setFilterGender] = useState('all');
    const [studentSearch, setStudentSearch] = useState('');
    const [notificationStatusFilter, setNotificationStatusFilter] = useState('all');
    // Modal State
    const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
    const [studentsToNotify, setStudentsToNotify] = useState([]);
    // Retrying individual notification
    const [retryingId, setRetryingId] = useState(null);
    // Load Classes
    useEffect(() => {
        getClasses(branchId, academicYearId)
            .then(res => setClasses(Array.isArray(res) ? res : (res?.data || [])))
            .catch(err => console.error(err));
    }, [branchId, academicYearId]);
    // Load Sections
    useEffect(() => {
        if (filterClassId !== 'all') {
            getSectionsByClass(Number(filterClassId), branchId, academicYearId)
                .then(secs => setSections(secs))
                .catch(() => setSections([]));
        }
        else {
            getSections(branchId, academicYearId)
                .then(res => {
                    const data = Array.isArray(res) ? res : (res?.data || []);
                    setSections(data);
                })
                .catch(() => setSections([]));
        }
    }, [filterClassId, branchId, academicYearId]);
    // Compute available sections: deduplicated unique names when 'all' classes is selected
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

    // Fetch Absent Report Data
    const loadAbsentees = useCallback(async () => {
        setIsLoading(true);
        try {
            const isNumericSec = filterSectionId !== 'all' && !isNaN(Number(filterSectionId));
            const data = await attendanceApi.getAbsentReport({
                branch_id: branchId,
                academic_year_id: academicYearId,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                class_id: filterClassId !== 'all' ? Number(filterClassId) : undefined,
                section_id: isNumericSec ? Number(filterSectionId) : undefined,
                section_name: (!isNumericSec && filterSectionId !== 'all') ? filterSectionId : undefined,
                gender: filterGender !== 'all' ? filterGender : undefined,
                student_search: studentSearch || undefined,
                notification_status: notificationStatusFilter !== 'all' ? notificationStatusFilter : undefined
            });
            setAbsentees(data);
        }
        catch (err) {
            console.error('Failed to load absent report:', err);
            showToast('error', err.message || 'Could not load absent report');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, dateFrom, dateTo, filterClassId, filterSectionId, filterGender, studentSearch, notificationStatusFilter, showToast]);
    useEffect(() => {
        loadAbsentees();
    }, [loadAbsentees]);
    // Trigger notification for single student
    const handleNotifySingle = (item) => {
        setStudentsToNotify([{
                student_id: item.student_id,
                attendance_id: item.attendance_id,
                admission_number: item.admission_number,
                first_name: item.first_name,
                last_name: item.last_name,
                class_name: item.class_name,
                section_name: item.section_name,
                parent_name: item.parent_name || item.father_name || item.mother_name,
                father_mobile: item.father_mobile,
                mother_mobile: item.mother_mobile
            }]);
        setIsNotifModalOpen(true);
    };
    // Trigger batch notification for all pending in current view
    const handleNotifyAllPending = () => {
        const pendingList = absentees
            .filter(a => a.notification_status === 'Pending' || a.notification_status === 'Failed')
            .map(item => ({
            student_id: item.student_id,
            attendance_id: item.attendance_id,
            admission_number: item.admission_number,
            first_name: item.first_name,
            last_name: item.last_name,
            class_name: item.class_name,
            section_name: item.section_name,
            parent_name: item.parent_name || item.father_name || item.mother_name,
            father_mobile: item.father_mobile,
            mother_mobile: item.mother_mobile
        }));
        if (pendingList.length === 0) {
            showToast('info', 'No pending or failed notifications found in this view.');
            return;
        }
        setStudentsToNotify(pendingList);
        setIsNotifModalOpen(true);
    };
    // Retry single failed notification
    const handleRetry = async (notificationId) => {
        setRetryingId(notificationId);
        try {
            await attendanceApi.retryNotification(notificationId);
            showToast('success', 'Notification re-sent successfully!');
            loadAbsentees();
        }
        catch (err) {
            showToast('error', err.message || 'Retry failed');
        }
        finally {
            setRetryingId(null);
        }
    };
    // Export CSV
    const handleExportCSV = () => {
        if (absentees.length === 0) {
            showToast('error', 'No data to export');
            return;
        }
        const headers = ['Date', 'Admission No', 'Student Name', 'Roll No', 'Class', 'Section', 'Gender', 'Parent Name', 'Parent Contact', 'Notification Status'];
        const rows = absentees.map(a => [
            a.attendance_date,
            a.admission_number,
            `"${a.first_name} ${a.last_name}"`,
            a.roll_number || '',
            a.class_name,
            a.section_name,
            a.gender,
            `"${a.parent_name || a.father_name || ''}"`,
            a.father_mobile || a.mother_mobile || '',
            a.notification_status
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Absent_Report_${currentBranch?.branch_name}_${dateFrom}_to_${dateTo}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <UserX className="w-4 h-4"/>
            <span>Attendance Module</span>
            <span>•</span>
            <span>{currentBranch?.branch_name}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Absent Student Reports & Parent Alerts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Track student absenteeism patterns, verify parent contact numbers, and manage notification dispatches.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button onClick={handleExportCSV} className="inline-flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors">
            <Download className="w-3.5 h-3.5"/>
            <span>Export CSV</span>
          </button>

          <button onClick={handleNotifyAllPending} className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs">
            <Send className="w-4 h-4"/>
            <span>Notify Pending Parents</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* From Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">From Date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"/>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">To Date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"/>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Class</label>
            <select value={filterClassId} onChange={e => { setFilterClassId(e.target.value); setFilterSectionId('all'); }} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <option value="all">All Classes</option>
              {classes.map(c => (<option key={c.id} value={String(c.id)}>{c.name}</option>))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Section</label>
            <select value={filterSectionId} onChange={e => setFilterSectionId(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <option value="all">All Sections</option>
              {availableSections.map(s => (<option key={s.id} value={String(s.id)}>Section {s.name}</option>))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
            <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Notification Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Alert Status</label>
            <select value={notificationStatusFilter} onChange={e => setNotificationStatusFilter(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <option value="all">All Alert States</option>
              <option value="Pending">Pending Dispatch</option>
              <option value="Sent">Sent Successfully</option>
              <option value="Failed">Failed Delivery</option>
            </select>
          </div>
        </div>

        {/* Student Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input type="text" placeholder="Search absent students by name or admission number..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (<div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3"/>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Searching absenteeism records...</p>
        </div>) : absentees.length === 0 ? (<div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3"/>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Absentees Detected</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            100% attendance recorded or no records match the chosen filter range for this branch.
          </p>
        </div>) : (<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Student Name</th>
                  <th className="py-3 px-4 font-bold">Admission & Roll</th>
                  <th className="py-3 px-4 font-bold">Class & Section</th>
                  <th className="py-3 px-4 font-bold">Gender</th>
                  <th className="py-3 px-4 font-bold">Parent Details</th>
                  <th className="py-3 px-4 font-bold">Notification Status</th>
                  <th className="py-3 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                {absentees.map(a => {
                const parentName = a.parent_name || a.father_name || a.mother_name || 'Parent';
                const parentMobile = a.father_mobile || a.mother_mobile || '+91 98401 23456';
                return (<tr key={`${a.attendance_id}-${a.student_id}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {a.attendance_date}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {a.first_name} {a.last_name}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {a.admission_number} {a.roll_number ? `(Roll ${a.roll_number})` : ''}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {a.class_name} - {a.section_name}
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {a.gender}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{parentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-slate-400"/>
                          {parentMobile}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${a.notification_status === 'Sent'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : a.notification_status === 'Failed'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                          {a.notification_status}
                          {a.notification_channel ? ` (${a.notification_channel})` : ''}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {a.notification_status === 'Sent' ? (<span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5"/>
                            <span>Delivered</span>
                          </span>) : a.notification_status === 'Failed' && a.notification_id ? (<button onClick={() => handleRetry(a.notification_id)} disabled={retryingId === a.notification_id} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-bold">
                            <RefreshCw className={`w-3 h-3 ${retryingId === a.notification_id ? 'animate-spin' : ''}`}/>
                            <span>Retry</span>
                          </button>) : (<button onClick={() => handleNotifySingle(a)} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded text-xs font-bold">
                            <Send className="w-3 h-3"/>
                            <span>Notify</span>
                          </button>)}
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Absent Notification Modal */}
      {isNotifModalOpen && (<AbsentNotificationModal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} branchId={branchId} academicYearId={academicYearId} attendanceDate={dateTo} absentStudents={studentsToNotify} onSuccess={() => {
                setIsNotifModalOpen(false);
                loadAbsentees();
            }}/>)}
    </div>);
};
