import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, Search, Edit3, AlertCircle, RefreshCw, X, Sun, Sunset, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { attendanceApi } from '../../services/attendanceApi';
import { useErp } from '../../context/ErpContext';

export const AttendanceTimingView = ({ branchId, academicYearId }) => {
    const { branches, activeAcademicYear, academicYearName, showToast } = useErp();
    const [timings, setTimings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTiming, setEditingTiming] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        session_1_name: 'Morning Session',
        session_2_name: 'Afternoon Session',
        is_second_session: false,
        morning_start_time: '08:30',
        morning_end_time: '12:30',
        afternoon_start_time: '13:30',
        afternoon_end_time: '16:00',
        status: 'Active'
    });
    const [formError, setFormError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const currentBranch = branches.find(b => b.id === branchId);

    const loadTimings = useCallback(async () => {
        setIsLoading(true);
        try {
            const effAyStr = academicYearName || activeAcademicYear?.year_name || '2025-2026';
            const data = await attendanceApi.getTimings(branchId, academicYearId, effAyStr);
            setTimings(data || []);
        }
        catch (err) {
            console.error('Failed to load timings:', err);
            showToast('error', err.message || 'Could not load attendance timings');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, academicYearName, activeAcademicYear, showToast]);

    useEffect(() => {
        loadTimings();
    }, [loadTimings]);

    const handleOpenAdd = () => {
        setEditingTiming(null);
        setFormData({
            name: '',
            session_1_name: 'Morning Session',
            session_2_name: 'Afternoon Session',
            is_second_session: false,
            morning_start_time: '08:30',
            morning_end_time: '12:30',
            afternoon_start_time: '13:30',
            afternoon_end_time: '16:00',
            status: 'Active'
        });
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (timing) => {
        setEditingTiming(timing);
        setFormData({
            name: timing.name || '',
            session_1_name: timing.session_1_name || 'Morning Session',
            session_2_name: timing.session_2_name || 'Afternoon Session',
            is_second_session: Boolean(timing.is_second_session === 1 || timing.is_second_session === true),
            morning_start_time: timing.morning_start_time || timing.start_time || '08:30',
            morning_end_time: timing.morning_end_time || '12:30',
            afternoon_start_time: timing.afternoon_start_time || '13:30',
            afternoon_end_time: timing.afternoon_end_time || timing.end_time || '16:00',
            status: timing.status || 'Active'
        });
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (timing) => {
        const newStatus = timing.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await attendanceApi.toggleTimingStatus(timing.id, newStatus);
            showToast('success', `Timing marked as ${newStatus}`);
            loadTimings();
        }
        catch (err) {
            showToast('error', err.message || 'Failed to toggle status');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setFormError('Timing name is required');
            return;
        }
        if (!formData.session_1_name.trim()) {
            setFormError('Session 1 name is required');
            return;
        }
        if (!formData.morning_start_time || !formData.morning_end_time) {
            setFormError('Session 1 Start time and End time are required');
            return;
        }
        if (formData.morning_start_time >= formData.morning_end_time) {
            setFormError('Session 1 Start time must be earlier than End time');
            return;
        }
        if (formData.is_second_session) {
            if (!formData.session_2_name.trim()) {
                setFormError('Session 2 name is required');
                return;
            }
            if (!formData.afternoon_start_time || !formData.afternoon_end_time) {
                setFormError('Session 2 Start time and End time are required');
                return;
            }
            if (formData.afternoon_start_time >= formData.afternoon_end_time) {
                setFormError('Session 2 Start time must be earlier than End time');
                return;
            }
            if (formData.afternoon_start_time < formData.morning_end_time) {
                setFormError('Session 2 Start time should be after Session 1 End time');
                return;
            }
        }

        setIsSaving(true);
        setFormError(null);
        try {
            const isSecond = Boolean(formData.is_second_session);
            const payload = {
                name: formData.name.trim(),
                session_1_name: formData.session_1_name.trim(),
                session_2_name: isSecond ? formData.session_2_name.trim() : '',
                is_second_session: isSecond ? 1 : 0,
                morning_start_time: formData.morning_start_time,
                morning_end_time: formData.morning_end_time,
                afternoon_start_time: isSecond ? formData.afternoon_start_time : null,
                afternoon_end_time: isSecond ? formData.afternoon_end_time : null,
                start_time: formData.morning_start_time,
                end_time: isSecond ? formData.afternoon_end_time : formData.morning_end_time,
                status: formData.status
            };

            const effAyStr = academicYearName || activeAcademicYear?.year_name || '2025-2026';

            if (editingTiming) {
                await attendanceApi.updateTiming(editingTiming.id, {
                    ...payload,
                    academic_year: effAyStr
                });
                showToast('success', 'Attendance timing updated successfully');
            }
            else {
                await attendanceApi.createTiming({
                    branch_id: branchId,
                    academic_year_id: academicYearId,
                    academic_year: effAyStr,
                    ...payload
                });
                showToast('success', 'Attendance timing created successfully');
            }
            setIsModalOpen(false);
            loadTimings();
        }
        catch (err) {
            setFormError(err.message || 'Failed to save attendance timing');
        }
        finally {
            setIsSaving(false);
        }
    };

    const filteredTimings = (timings || []).filter(t => {
        if (!t) return false;
        const term = (searchTerm || '').trim().toLowerCase();
        const name = String(t.name || '').toLowerCase();
        const matchesSearch = !term || name.includes(term);
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                        <Clock className="w-4 h-4" />
                        <span>Attendance Module</span>
                        <span>•</span>
                        <span>{currentBranch?.branch_name}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        Attendance Timings
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                        Define 2-session (Morning & Afternoon) attendance timing windows configured for this branch.
                    </p>
                </div>

                <div className="flex items-center space-x-2.5">
                    <button
                        id="refresh-timings-btn"
                        onClick={loadTimings}
                        disabled={isLoading}
                        className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        title="Refresh list"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        id="create-timing-btn"
                        onClick={handleOpenAdd}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Attendance Timing</span>
                    </button>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        id="timing-search-input"
                        type="text"
                        placeholder="Search timings by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                        id="timing-status-filter"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Timings</option>
                        <option value="Active">Active Only</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Timing Cards Grid */}
            {isLoading ? (
                <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading branch timings...</p>
                </div>
            ) : filteredTimings.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                    <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">No Attendance Timings Found</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                        {searchTerm ? 'No timings match your search criteria.' : 'Create your first 2-session attendance timing period for this branch.'}
                    </p>
                    <button
                        onClick={handleOpenAdd}
                        className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Timing</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTimings.map(t => {
                        const mStart = t.morning_start_time || t.start_time || '08:30';
                        const mEnd = t.morning_end_time || '12:30';
                        const aStart = t.afternoon_start_time || '13:30';
                        const aEnd = t.afternoon_end_time || t.end_time || '16:00';

                        return (
                            <div
                                key={t.id}
                                id={`timing-card-${t.id}`}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                {t.name}
                                            </h3>
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                Branch: {t.branch_name || currentBranch?.branch_name}
                                            </span>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                            t.status === 'Active'
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </div>

                                    {/* Session Windows Display */}
                                    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 space-y-2.5 border border-slate-100 dark:border-slate-800 mb-3">
                                        {/* Session 1 */}
                                        <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
                                            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                                                <Sun className="w-4 h-4" />
                                                <span>{t.session_1_name || 'Morning Session'}:</span>
                                            </div>
                                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                {mStart} - {mEnd}
                                            </span>
                                        </div>

                                        {/* Session 2 (Conditional) */}
                                        {(Boolean(t.is_second_session === 1 || t.is_second_session === true)) ? (
                                            <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
                                                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold">
                                                    <Sunset className="w-4 h-4" />
                                                    <span>{t.session_2_name || 'Afternoon Session'}:</span>
                                                </div>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {aStart} - {aEnd}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="text-[11px] text-slate-400 italic px-1">
                                                Single session schedule (No 2nd session)
                                            </div>
                                        )}

                                        {t.usage_count !== undefined && (
                                            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                                                <span>Attendance Entries:</span>
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {t.usage_count} records
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                                    <button
                                        onClick={() => handleToggleStatus(t)}
                                        className={`font-semibold transition-colors cursor-pointer ${
                                            t.status === 'Active'
                                                ? 'text-rose-600 hover:text-rose-700'
                                                : 'text-emerald-600 hover:text-emerald-700'
                                        }`}
                                    >
                                        {t.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>

                                    <button
                                        onClick={() => handleOpenEdit(t)}
                                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit Timing</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add / Edit Timing Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
                            {editingTiming ? 'Edit Attendance Timing' : 'Create Attendance Timing'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Scoped to Branch: <span className="font-bold text-slate-700 dark:text-slate-300">{currentBranch?.branch_name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    {formError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{formError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Timing Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Timing Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="timing-name-input"
                                type="text"
                                required
                                placeholder="e.g. Regular Shift, Morning & Afternoon Timing"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        {/* Session 1 */}
                        <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/70 dark:border-amber-900/40 space-y-2.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                                <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <span>Session 1 Details</span>
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Session 1 Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="timing-session-1-name-input"
                                    type="text"
                                    required
                                    placeholder="e.g. Morning Session, Shift 1"
                                    value={formData.session_1_name}
                                    onChange={e => setFormData({ ...formData, session_1_name: e.target.value })}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Start Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="timing-morning-start-input"
                                        type="time"
                                        required
                                        value={formData.morning_start_time}
                                        onChange={e => setFormData({ ...formData, morning_start_time: e.target.value })}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        End Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="timing-morning-end-input"
                                        type="time"
                                        required
                                        value={formData.morning_end_time}
                                        onChange={e => setFormData({ ...formData, morning_end_time: e.target.value })}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Session 2 Checkbox Toggle */}
                        <div className="flex items-center space-x-2.5 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700">
                            <input
                                id="timing-is-second-session-checkbox"
                                type="checkbox"
                                checked={formData.is_second_session}
                                onChange={e => setFormData({ ...formData, is_second_session: e.target.checked })}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 cursor-pointer"
                            />
                            <label htmlFor="timing-is-second-session-checkbox" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                                Enable Second Session (e.g. Afternoon Session)
                            </label>
                        </div>

                        {/* Session 2 (Only shown if is_second_session is checked) */}
                        {formData.is_second_session && (
                            <div className="p-3.5 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl border border-orange-200/70 dark:border-orange-900/40 space-y-2.5 animate-in fade-in">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
                                    <Sunset className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    <span>Session 2 Details</span>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Session 2 Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="timing-session-2-name-input"
                                        type="text"
                                        required={formData.is_second_session}
                                        placeholder="e.g. Afternoon Session, Shift 2"
                                        value={formData.session_2_name}
                                        onChange={e => setFormData({ ...formData, session_2_name: e.target.value })}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Start Time <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            id="timing-afternoon-start-input"
                                            type="time"
                                            required={formData.is_second_session}
                                            value={formData.afternoon_start_time}
                                            onChange={e => setFormData({ ...formData, afternoon_start_time: e.target.value })}
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            End Time <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            id="timing-afternoon-end-input"
                                            type="time"
                                            required={formData.is_second_session}
                                            value={formData.afternoon_end_time}
                                            onChange={e => setFormData({ ...formData, afternoon_end_time: e.target.value })}
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Status
                            </label>
                            <select
                                id="timing-status-select"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                id="timing-submit-btn"
                                disabled={isSaving}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isSaving ? 'Saving...' : editingTiming ? 'Update Timing' : 'Create Timing'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
