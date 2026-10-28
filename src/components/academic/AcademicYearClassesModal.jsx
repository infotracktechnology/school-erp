import React, { useState, useEffect, useMemo } from 'react';
import { X, Layers, Lock, Unlock, Search, CheckCircle2, AlertCircle, RefreshCw, ShieldAlert, Check, EyeOff } from 'lucide-react';
import { getAcademicYearClasses, toggleAcademicYearClass, bulkToggleAcademicYearClasses } from '../../services/api';

export const AcademicYearClassesModal = ({
  isOpen,
  onClose,
  academicYear,
  branch,
  showToast,
  onClassesUpdated
}) => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingId, setIsTogglingId] = useState(null);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'enabled' | 'disabled' | 'locked'

  const branchId = branch?.id || academicYear?.branch_id;
  const academicYearId = academicYear?.id;

  const loadClasses = async () => {
    if (!branchId || !academicYearId) return;
    setIsLoading(true);
    try {
      const res = await getAcademicYearClasses(branchId, academicYearId);
      setClasses(res.data || []);
    } catch (err) {
      console.error('Failed to load academic year classes:', err);
      if (showToast) {
        showToast(err.message || 'Failed to load class configuration for this academic year.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && branchId && academicYearId) {
      loadClasses();
    }
  }, [isOpen, branchId, academicYearId]);

  if (!isOpen || !academicYear) return null;

  // KPI calculations
  const totalClasses = classes.length;
  const enabledCount = classes.filter((c) => c.is_enabled).length;
  const disabledCount = classes.filter((c) => !c.is_enabled).length;
  const lockedCount = classes.filter((c) => c.is_locked).length;

  // Filtered classes
  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      String(c.display_order || '').includes(search);

    if (!matchesSearch) return false;

    if (activeFilter === 'enabled') return c.is_enabled;
    if (activeFilter === 'disabled') return !c.is_enabled;
    if (activeFilter === 'locked') return c.is_locked;
    return true;
  });

  // Single Class Toggle
  const handleToggle = async (cls) => {
    if (cls.is_locked && cls.is_enabled) {
      if (showToast) {
        showToast(
          `Cannot disable ${cls.name}: ${cls.student_count} student(s) are assigned to this class for ${academicYear.name}. Class is locked.`,
          'error'
        );
      }
      return;
    }

    const targetState = !cls.is_enabled;
    setIsTogglingId(cls.id);
    try {
      await toggleAcademicYearClass({
        branch_id: branchId,
        academic_year_id: academicYearId,
        class_id: cls.id,
        is_enabled: targetState
      });

      setClasses((prev) =>
        prev.map((item) =>
          item.id === cls.id ? { ...item, is_enabled: targetState, status: targetState ? 'Active' : 'Inactive' } : item
        )
      );

      if (showToast) {
        showToast(
          `${cls.name} has been ${targetState ? 'enabled' : 'disabled'} for ${academicYear.name}.`,
          'success'
        );
      }
      if (onClassesUpdated) onClassesUpdated();
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to update class status.', 'error');
      }
    } finally {
      setIsTogglingId(null);
    }
  };

  // Bulk action: enable or disable all unlocked
  const handleBulkToggle = async (targetEnabled) => {
    const targetClasses = classes.filter((c) => !c.is_locked && c.is_enabled !== targetEnabled);
    if (targetClasses.length === 0) {
      if (showToast) {
        showToast(`No unlocked classes available to ${targetEnabled ? 'enable' : 'disable'}.`, 'info');
      }
      return;
    }

    setIsBulkSubmitting(true);
    try {
      const res = await bulkToggleAcademicYearClasses({
        branch_id: branchId,
        academic_year_id: academicYearId,
        class_ids: targetClasses.map((c) => c.id),
        is_enabled: targetEnabled
      });

      await loadClasses();
      if (showToast) {
        showToast(res.message || `Classes updated successfully.`, 'success');
      }
      if (onClassesUpdated) onClassesUpdated();
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to bulk update classes.', 'error');
      }
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">Class Configuration Settings</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-700/80 text-emerald-100 border border-emerald-600">
                  {academicYear.name}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                {branch?.branch_name || 'Campus Branch'} ({branch?.branch_code || 'Main'}) • Enable or disable classes for this academic year
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Informational Guidance Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-3">
            <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">
                Class Availability & Automated Data Locking Rule
              </p>
              <p className="text-slate-600 leading-relaxed">
                Only enabled classes will appear in transaction forms, attendance registers, and promotion targets for this session. 
                Classes with currently enrolled students are automatically <strong>Locked</strong> to prevent accidental record orphanages.
              </p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Classes
              </span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {totalClasses}
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Enabled Classes
              </span>
              <span className="text-xl font-black text-emerald-900 mt-1 block">
                {enabledCount}
              </span>
            </div>

            <div className="p-3.5 bg-slate-100/70 rounded-xl border border-slate-300">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Disabled Classes
              </span>
              <span className="text-xl font-black text-slate-700 mt-1 block">
                {disabledCount}
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Locked (Assigned)
              </span>
              <span className="text-xl font-black text-amber-900 mt-1 block">
                {lockedCount}
              </span>
            </div>
          </div>

          {/* Search, Filter Bar & Bulk Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter classes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 w-44 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Filter Tabs */}
              <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'enabled', label: 'Enabled' },
                  { key: 'disabled', label: 'Disabled' },
                  { key: 'locked', label: 'Locked' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                      activeFilter === tab.key
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleBulkToggle(true)}
                disabled={isBulkSubmitting || isLoading}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enable All Unlocked</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkToggle(false)}
                disabled={isBulkSubmitting || isLoading}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Disable All Unlocked</span>
              </button>
            </div>
          </div>

          {/* Class Configuration Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50/90 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">
                      Class Name
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-center">
                      Numeric Order
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Student Status
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-center">
                      Availability Status
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right">
                      Enable / Disable
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-600 mb-2" />
                        <span>Loading class configuration...</span>
                      </td>
                    </tr>
                  ) : filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No classes match the chosen filter.
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((cls) => {
                      const isLocked = Boolean(cls.is_locked);
                      const isEnabled = Boolean(cls.is_enabled);
                      const isToggling = isTogglingId === cls.id;

                      return (
                        <tr
                          key={cls.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isLocked ? 'bg-amber-50/20' : !isEnabled ? 'bg-slate-50/40 opacity-75' : ''
                          }`}
                        >
                          {/* Class Name */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center space-x-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isLocked
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : isEnabled
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {cls.display_order || cls.numeric_value || 'C'}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 text-sm block">
                                  {cls.name}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Code: {cls.code || `CLS-${cls.numeric_value || cls.id}`}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Numeric Order */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-center">
                            <span className="font-mono font-bold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {cls.display_order || cls.numeric_value || cls.id}
                            </span>
                          </td>

                          {/* Student Status (Locked Rule) */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {isLocked ? (
                              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Students Assigned</span>
                                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 font-bold">
                                  {cls.student_count}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200">
                                <Unlock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>No Students</span>
                              </div>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-center">
                            {isLocked ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                                Locked
                              </span>
                            ) : isEnabled ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                Enabled
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                Disabled
                              </span>
                            )}
                          </td>

                          {/* Enable/Disable Toggle Switch */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-right">
                            <div className="inline-flex items-center justify-end space-x-2">
                              {isLocked ? (
                                <div
                                  className="inline-flex items-center space-x-1 text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold cursor-not-allowed border border-slate-200"
                                  title="Locked: Students are assigned to this class in this academic year and it cannot be disabled."
                                >
                                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                                  <span className="text-amber-800 font-bold">Locked</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggle(cls)}
                                  disabled={isToggling}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 ${
                                    isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                                  }`}
                                  role="switch"
                                  aria-checked={isEnabled}
                                  title={
                                    isEnabled
                                      ? 'Enabled for this session. Click to disable.'
                                      : 'Disabled for this session. Click to enable.'
                                  }
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Configuring branch-wise class availability for <strong className="text-slate-800">{academicYear.name}</strong>.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-300 shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
