import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, CheckCircle2, Info } from 'lucide-react';
export const AcademicYearFormModal = ({ isOpen, onClose, onSubmit, selectedBranch, initialData, existingAcademicYears, currentAcademicYear }) => {
    const isEdit = Boolean(initialData);
    const [formData, setFormData] = useState({
        name: '',
        short_name: '',
        start_date: '',
        end_date: '',
        status: 'Upcoming',
        is_current: false,
        is_next: false,
        is_enabled: true,
        branch_id: selectedBranch.id
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);
    // Initialize form state when opening or when initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    short_name: initialData.short_name || '',
                    start_date: initialData.start_date,
                    end_date: initialData.end_date,
                    status: initialData.status,
                    is_current: Boolean(initialData.is_current),
                    is_next: Boolean(initialData.is_next),
                    is_enabled: initialData.is_enabled !== false && initialData.is_enabled !== 0,
                    branch_id: initialData.branch_id
                });
            }
            else {
                // Default new form
                setFormData({
                    name: '',
                    short_name: '',
                    start_date: '',
                    end_date: '',
                    status: 'Upcoming',
                    is_current: false,
                    is_next: false,
                    is_enabled: true,
                    branch_id: selectedBranch.id
                });
            }
            setErrors({});
            setServerError(null);
        }
    }, [isOpen, initialData, selectedBranch.id]);
    if (!isOpen)
        return null;
    // Auto-generate short name when user inputs academic year name like "2026-2027" -> "26-27"
    const handleNameChange = (value) => {
        setFormData(prev => {
            let short = prev.short_name;
            // Auto-suggest short name if short name was empty or matched previous auto-pattern
            if (value.includes('-')) {
                const parts = value.split('-');
                if (parts.length === 2 && parts[0].trim().length === 4 && parts[1].trim().length === 4) {
                    short = `${parts[0].trim().slice(2)}-${parts[1].trim().slice(2)}`;
                }
            }
            return { ...prev, name: value, short_name: short };
        });
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    };
    // Live validation
    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Academic Year Name is required (e.g. 2026-2027)';
        }
        if (!formData.start_date) {
            newErrors.start_date = 'Start Date is required';
        }
        if (!formData.end_date) {
            newErrors.end_date = 'End Date is required';
        }
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            if (end <= start) {
                newErrors.end_date = 'End Date must be greater than Start Date';
            }
        }
        // Duplicate name check within selected branch
        const trimmedName = formData.name.trim().toLowerCase();
        const duplicate = existingAcademicYears.find(ay => ay.name.trim().toLowerCase() === trimmedName && (!isEdit || ay.id !== initialData?.id));
        if (duplicate) {
            newErrors.name = 'An academic year with this name already exists for this branch.';
        }
        // Date overlap check within selected branch
        if (formData.start_date && formData.end_date && !newErrors.start_date && !newErrors.end_date) {
            const overlap = existingAcademicYears.find(ay => {
                if (isEdit && ay.id === initialData?.id)
                    return false;
                // Overlap condition: start_date <= newEnd AND end_date >= newStart
                return ay.start_date <= formData.end_date && ay.end_date >= formData.start_date;
            });
            if (overlap) {
                newErrors.date_overlap = `The selected dates overlap with "${overlap.name}" (${overlap.start_date} to ${overlap.end_date}).`;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) {
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                branch_id: selectedBranch.id
            });
            onClose();
        }
        catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
            setServerError(err.message || 'Failed to save academic year. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Check if current toggle will replace another active year
    const willReplaceCurrent = formData.is_current &&
        currentAcademicYear &&
        (!isEdit || currentAcademicYear.id !== initialData?.id);
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs">
              <Calendar className="w-5 h-5"/>
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEdit ? 'Edit Academic Year' : 'Add New Academic Year'}
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                {selectedBranch.branch_name} ({selectedBranch.branch_code})
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Server Error Alert */}
          {serverError && (<div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5"/>
              <span>{serverError}</span>
            </div>)}

          {/* Date Overlap Error Alert */}
          {errors.date_overlap && (<div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
              <div>
                <p className="font-bold text-amber-900">Date Range Overlap Detected</p>
                <p className="text-amber-800 mt-0.5">{errors.date_overlap}</p>
              </div>
            </div>)}

          {/* Branch Context (Read-Only) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Organization & Branch Isolation
              </span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {selectedBranch.branch_name}
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              {selectedBranch.branch_code}
            </span>
          </div>

          {/* Academic Year Name & Short Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Academic Year Name <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder="e.g. 2026-2027" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className={`w-full px-3.5 py-2 text-sm rounded-lg border font-medium ${errors.name
            ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-300'
            : 'border-slate-300 bg-white text-slate-800 focus:border-emerald-700 focus:ring-emerald-700/20'} focus:outline-hidden focus:ring-2 transition-colors`}/>
              {errors.name ? (<p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>) : (<p className="text-[11px] text-slate-400 mt-1">
                  Format typically: YYYY-YYYY (e.g. 2026-2027)
                </p>)}
            </div>

            {/* Short Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Name
              </label>
              <input type="text" placeholder="e.g. 26-27" value={formData.short_name} onChange={(e) => setFormData(prev => ({ ...prev, short_name: e.target.value }))} className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden transition-colors font-mono"/>
              <p className="text-[11px] text-slate-400 mt-1">For compact reports</p>
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input type="date" value={formData.start_date} onChange={(e) => {
            setFormData(prev => ({ ...prev, start_date: e.target.value }));
            if (errors.start_date)
                setErrors(prev => ({ ...prev, start_date: '' }));
        }} className={`w-full px-3.5 py-2 text-sm rounded-lg border font-medium ${errors.start_date
            ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-300'
            : 'border-slate-300 bg-white text-slate-800 focus:border-emerald-700 focus:ring-emerald-700/20'} focus:outline-hidden focus:ring-2 transition-colors`}/>
              {errors.start_date && (<p className="text-xs text-red-600 mt-1 font-medium">{errors.start_date}</p>)}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input type="date" value={formData.end_date} onChange={(e) => {
            setFormData(prev => ({ ...prev, end_date: e.target.value }));
            if (errors.end_date)
                setErrors(prev => ({ ...prev, end_date: '' }));
        }} className={`w-full px-3.5 py-2 text-sm rounded-lg border font-medium ${errors.end_date
            ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-300'
            : 'border-slate-300 bg-white text-slate-800 focus:border-emerald-700 focus:ring-emerald-700/20'} focus:outline-hidden focus:ring-2 transition-colors`}/>
              {errors.end_date && (<p className="text-xs text-red-600 mt-1 font-medium">{errors.end_date}</p>)}
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden transition-colors">
              <option value="Upcoming">Upcoming (Academic cycle has not started)</option>
              <option value="Active">Active (Academic cycle currently in progress)</option>
              <option value="Closed">Closed (Concluded session preserved for history)</option>
            </select>
          </div>

          {/* Current Academic Year Toggle */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input type="checkbox" checked={formData.is_current} onChange={(e) => {
                const checked = e.target.checked;
                setFormData(prev => ({
                  ...prev,
                  is_current: checked,
                  is_enabled: checked ? true : prev.is_enabled,
                  is_next: checked ? false : prev.is_next
                }));
              }} className="mt-1 w-4 h-4 text-emerald-700 border-slate-300 rounded focus:ring-emerald-600 focus:ring-offset-0 cursor-pointer"/>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">
                    Set as Current / Default Academic Year
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Single Active Rule
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Only one academic year can be marked as the current operational session for this branch.
                </p>

                {willReplaceCurrent && (<div className="mt-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
                    <span>
                      <strong>Notice:</strong> &quot;{currentAcademicYear.name}&quot; is currently the active session for this branch. Enabling this will make this year the current active session upon saving.
                    </span>
                  </div>)}
              </div>
            </label>
          </div>

          {/* Next Academic Year for Student Promotion */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input type="checkbox" checked={formData.is_next} onChange={(e) => {
                const checked = e.target.checked;
                setFormData(prev => ({
                  ...prev,
                  is_next: checked,
                  is_enabled: checked ? true : prev.is_enabled,
                  is_current: checked ? false : prev.is_current
                }));
              }} className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"/>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">
                    Set as Next Academic Year (Promotion Target)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Next Year / Enabled
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically designates this session as the target academic year during annual student promotion for this branch.
                </p>
              </div>
            </label>
          </div>

          {/* Branch-wise Enabled/Disabled Switch */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input type="checkbox" checked={formData.is_enabled} onChange={(e) => {
                const checked = e.target.checked;
                setFormData(prev => ({
                  ...prev,
                  is_enabled: checked,
                  is_current: !checked ? false : prev.is_current,
                  is_next: !checked ? false : prev.is_next
                }));
              }} className="mt-1 w-4 h-4 text-emerald-700 border-slate-300 rounded focus:ring-emerald-600 focus:ring-offset-0 cursor-pointer"/>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">
                    Enable Academic Year for this Branch
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${formData.is_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {formData.is_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  When enabled, this academic year is accessible for transactions, student promotions, and active operations in this branch.
                </p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isSubmitting ? (<span>Saving...</span>) : (<>
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>{isEdit ? 'Update Academic Year' : 'Create Academic Year'}</span>
                </>)}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
