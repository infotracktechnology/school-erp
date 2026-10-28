import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Plus, Search, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { getClasses, getSectionsByClass } from '../../services/api';
import { useErp } from '../../context/ErpContext';
export const AttendanceAssignmentView = ({
    branchId,
    academicYearId,
    prefillClassId,
    prefillSectionId,
    autoOpenAdd = false
}) => {
    const { branches, showToast, activeAcademicYear, academicYearName } = useErp();
    const [assignments, setAssignments] = useState([]);
    const [timings, setTimings] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sectionsMap, setSectionsMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('all');
    const [selectedTimingId, setSelectedTimingId] = useState('');
    const [effectiveFrom, setEffectiveFrom] = useState('2026-06-01');
    const [effectiveTo, setEffectiveTo] = useState('');
    const [status, setStatus] = useState('Active');
    const [availableSections, setAvailableSections] = useState([]);
    const [formError, setFormError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const currentBranch = branches.find(b => b.id === branchId);

    const effAyStr = academicYearName || activeAcademicYear?.name || activeAcademicYear?.year_name || '';

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [assignmentRes, timingRes, classRes] = await Promise.allSettled([
                attendanceApi.getAssignments(branchId, academicYearId, effAyStr),
                attendanceApi.getTimings(branchId, academicYearId, effAyStr),
                getClasses(branchId, academicYearId)
            ]);

            if (assignmentRes.status === 'fulfilled') {
                setAssignments(assignmentRes.value || []);
            } else {
                console.error('Assignments load error:', assignmentRes.reason);
                setAssignments([]);
            }

            if (timingRes.status === 'fulfilled') {
                setTimings(timingRes.value || []);
            } else {
                console.error('Timings load error:', timingRes.reason);
                setTimings([]);
            }

            if (classRes.status === 'fulfilled') {
                const cVal = classRes.value;
                setClasses(Array.isArray(cVal) ? cVal : (cVal?.data || []));
            } else {
                console.error('Classes load error:', classRes.reason);
                setClasses([]);
            }
        }
        catch (err) {
            console.error('Failed to load assignments data:', err);
            showToast('error', err.message || 'Could not load attendance assignments');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, showToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // When class changes in modal, load sections
    useEffect(() => {
        if (selectedClassId) {
            getSectionsByClass(Number(selectedClassId), branchId, academicYearId)
                .then(secs => setAvailableSections(secs || []))
                .catch(() => setAvailableSections([]));
        }
        else {
            setAvailableSections([]);
        }
    }, [selectedClassId, branchId, academicYearId]);

    // Auto-open modal when navigated with prefill from Take Attendance
    useEffect(() => {
        if (autoOpenAdd && classes.length > 0 && timings.length > 0) {
            setEditingAssignment(null);
            setSelectedClassId(prefillClassId ? Number(prefillClassId) : (classes[0].id || classes[0].class_id));
            setSelectedSectionId(prefillSectionId && prefillSectionId !== 'all' ? Number(prefillSectionId) : 'all');
            setSelectedTimingId(timings[0].id);
            setEffectiveFrom(new Date().toISOString().split('T')[0]);
            setEffectiveTo('');
            setStatus('Active');
            setFormError(null);
            setIsModalOpen(true);
        }
    }, [autoOpenAdd, prefillClassId, prefillSectionId, classes, timings]);

    const handleOpenAdd = () => {
        setEditingAssignment(null);
        setSelectedClassId(classes.length > 0 ? (classes[0].id || classes[0].class_id) : '');
        setSelectedSectionId('all');
        setSelectedTimingId(timings.length > 0 ? timings[0].id : '');
        setEffectiveFrom(new Date().toISOString().split('T')[0]);
        setEffectiveTo('');
        setStatus('Active');
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (assignment) => {
        setEditingAssignment(assignment);
        setSelectedClassId(assignment.class_id);
        setSelectedSectionId(assignment.section_id || 'all');
        setSelectedTimingId(assignment.attendance_timing_id || assignment.timing_id);
        setEffectiveFrom(assignment.effective_from || new Date().toISOString().split('T')[0]);
        setEffectiveTo(assignment.effective_to || '');
        setStatus(assignment.status || 'Active');
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (assignment) => {
        const newStatus = assignment.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await attendanceApi.toggleAssignmentStatus(assignment.id, newStatus);
            showToast('success', `Assignment marked as ${newStatus}`);
            loadData();
        }
        catch (err) {
            showToast('error', err.message || 'Failed to toggle status');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedClassId) {
            setFormError('Please select a class');
            return;
        }
        if (!selectedTimingId) {
            setFormError('Please select an attendance timing');
            return;
        }
        if (!effectiveFrom) {
            setFormError('Effective From date is required');
            return;
        }
        setIsSaving(true);
        setFormError(null);
        try {
            await attendanceApi.createAssignment({
                branch_id: branchId,
                academic_year_id: academicYearId,
                academic_year: effAyStr,
                class_id: Number(selectedClassId),
                section_id: selectedSectionId === 'all' ? null : Number(selectedSectionId),
                timing_id: Number(selectedTimingId),
                attendance_timing_id: Number(selectedTimingId),
                effective_from: effectiveFrom,
                effective_to: effectiveTo || null,
                status
            });
            showToast('success', 'Attendance timing assigned successfully');
            setIsModalOpen(false);
            loadData();
        }
        catch (err) {
            setFormError(err.message || 'Failed to assign timing');
        }
        finally {
            setIsSaving(false);
        }
    };

    const filteredAssignments = (assignments || []).filter(a => {
        if (!a)
            return false;
        const term = (searchTerm || '').trim().toLowerCase();
        const classNameStr = String(a.class_name || '').toLowerCase();
        const secNameStr = String(a.section_name || '').toLowerCase();
        const timingNameStr = String(a.timing_name || '').toLowerCase();
        const matchesSearch = !term ||
            classNameStr.includes(term) ||
            secNameStr.includes(term) ||
            timingNameStr.includes(term);
        const matchesClass = classFilter === 'all' || String(a.class_id) === classFilter;
        return matchesSearch && matchesClass;
    });
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4"/>
            <span>Attendance Module</span>
            <span>•</span>
            <span>{currentBranch?.branch_name}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Attendance Assignment
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Assign attendance timing to entire classes or specific sections. Section-level assignments automatically take priority over class-level defaults.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button id="refresh-assignments-btn" onClick={loadData} disabled={isLoading} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Refresh list">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
          </button>

          <button id="create-assignment-btn" onClick={handleOpenAdd} className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs">
            <Plus className="w-4 h-4"/>
            <span>Assign Timing</span>
          </button>
        </div>
      </div>

      {/* Priority Rule Info Box */}
      <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"/>
        <div className="text-xs text-blue-900 dark:text-blue-200">
          <span className="font-bold">Timing Resolution Hierarchy: </span>
          When taking roll-call, the system checks for a <strong>Section-Specific Assignment</strong> first. If none exists, it applies the <strong>Class-Wide Assignment</strong>. If neither is assigned, it defaults to the primary branch morning window.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input id="assignment-search-input" type="text" placeholder="Search class, section, or timing..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Class:</span>
          <select id="assignment-class-filter" value={classFilter} onChange={e => setClassFilter(e.target.value)} className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
            <option value="all">All Classes</option>
            {classes.map(c => (<option key={c.id} value={String(c.id)}>{c.class_name || c.name || `Class ${c.id}`}</option>))}
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      {isLoading ? (<div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3"/>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading assignments...</p>
        </div>) : filteredAssignments.length === 0 ? (<div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3"/>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Assignments Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Assign attendance timings to classes or sections to begin taking attendance.
          </p>
          <button onClick={handleOpenAdd} className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold">
            <Plus className="w-3.5 h-3.5"/>
            <span>Create Assignment</span>
          </button>
        </div>) : (<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4 font-bold">Class</th>
                  <th className="py-3 px-4 font-bold">Section Scope</th>
                  <th className="py-3 px-4 font-bold">Timing Name</th>
                  <th className="py-3 px-4 font-bold">Session Windows</th>
                  <th className="py-3 px-4 font-bold">Priority Status</th>
                  <th className="py-3 px-4 font-bold">Effective Period</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredAssignments.map(a => {
                const isSectionSpecific = a.section_id !== null && a.section_id !== undefined;
                const mStart = a.morning_start_time || a.start_time || '08:30';
                const mEnd = a.morning_end_time || '12:30';
                const aStart = a.afternoon_start_time || '13:30';
                const aEnd = a.afternoon_end_time || a.end_time || '16:00';

                return (<tr key={a.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {a.class_name}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {isSectionSpecific ? (<span className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                            Section {a.section_name}
                          </span>) : (<span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            Entire Class (All Sections)
                          </span>)}
                      </td>

                      <td className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                        {a.timing_name}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">
                        <div className="text-xs">
                          <span className="text-amber-700 dark:text-amber-400 font-bold">M:</span> {mStart} - {mEnd}
                        </div>
                        <div className="text-xs">
                          <span className="text-orange-700 dark:text-orange-400 font-bold">A:</span> {aStart} - {aEnd}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {isSectionSpecific ? (<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                            Section Override
                          </span>) : (<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800">
                            Class Default
                          </span>)}
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {a.effective_from} {a.effective_to ? `to ${a.effective_to}` : '(Ongoing)'}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${a.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {a.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => handleToggleStatus(a)} className={`text-xs font-semibold ${a.status === 'Active' ? 'text-rose-600 hover:text-rose-700' : 'text-emerald-600 hover:text-emerald-700'}`}>
                            {a.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <span>•</span>
                          <button onClick={() => handleOpenEdit(a)} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Assign Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingAssignment ? 'Edit Timing Assignment' : 'Assign Attendance Timing'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Branch: <span className="font-bold text-slate-700 dark:text-slate-300">{currentBranch?.branch_name}</span>
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {formError && (<div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0"/>
                <span>{formError}</span>
              </div>)}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class <span className="text-rose-500">*</span>
                </label>
                <select id="assign-class-select" required value={selectedClassId} onChange={e => {
                  setSelectedClassId(Number(e.target.value));
                  setSelectedSectionId('all');
                }} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select Class...</option>
                  {classes.map(c => (<option key={c.id} value={c.id}>{c.class_name || c.name || `Class ${c.id}`}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Assignment Scope
                </label>
                <select id="assign-section-select" value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
                  <option value="all">Option 1: Entire Class (All Sections)</option>
                  {availableSections.map(s => (<option key={s.id} value={s.id}>Option 2: Section {s.section_name || s.name || s.id} Only (Section Override)</option>))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Choosing a specific section creates a high-priority override for students in that section.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attendance Timing <span className="text-rose-500">*</span>
                </label>
                <select id="assign-timing-select" required value={selectedTimingId} onChange={e => setSelectedTimingId(Number(e.target.value))} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select Timing Period...</option>
                  {timings.map(t => {
                    const isSecond = Boolean(t.is_second_session === 1 || t.is_second_session === true);
                    const mS = t.morning_start_time || t.start_time || '08:30';
                    const mE = t.morning_end_time || '12:30';
                    const aS = t.afternoon_start_time || '13:30';
                    const aE = t.afternoon_end_time || t.end_time || '16:00';
                    const s1Label = t.session_1_name || 'Session 1';
                    const s2Label = t.session_2_name || 'Session 2';
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} ({s1Label}: {mS}-{mE}{isSecond ? `, ${s2Label}: ${aS}-${aE}` : ''})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Effective From <span className="text-rose-500">*</span>
                  </label>
                  <input id="assign-from-date" type="date" required value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Effective To (Optional)
                  </label>
                  <input id="assign-to-date" type="date" value={effectiveTo} onChange={e => setEffectiveTo(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select id="assign-status-select" value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button type="submit" id="assign-submit-btn" disabled={isSaving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
