import React, { useState, useEffect } from 'react';
import { X, Layers, AlertCircle } from 'lucide-react';
export const ClassFormModal = ({ isOpen, onClose, onSubmit, initialData, branchId, academicYearId, branchName, academicYearName, existingCount }) => {
    const isEdit = Boolean(initialData);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        short_name: '',
        class_type: 'Secondary',
        group_required: false,
        display_order: 1,
        status: 'Active',
        branch_id: branchId,
        academic_year_id: academicYearId
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                short_name: initialData.short_name || '',
                class_type: initialData.class_type || 'Secondary',
                group_required: Boolean(initialData.group_required),
                display_order: initialData.display_order,
                status: initialData.status,
                branch_id: initialData.branch_id,
                academic_year_id: initialData.academic_year_id
            });
        }
        else {
            setFormData({
                name: '',
                code: '',
                short_name: '',
                class_type: 'Secondary',
                group_required: false,
                display_order: existingCount + 1,
                status: 'Active',
                branch_id: branchId,
                academic_year_id: academicYearId
            });
        }
        setErrors({});
    }, [initialData, isOpen, branchId, academicYearId, existingCount]);
    if (!isOpen)
        return null;
    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Class Name is required (e.g. "Grade 1")';
        }
        if (!formData.code.trim()) {
            newErrors.code = 'Class Code is required (e.g. "CLS001")';
        }
        if (formData.display_order === undefined || formData.display_order < 1) {
            newErrors.display_order = 'Display Order must be a positive number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                code: formData.code.trim().toUpperCase(),
                branch_id: branchId,
                academic_year_id: academicYearId
            });
            onClose();
        }
        catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
            else {
                setErrors({ general: err.message || 'Failed to save class' });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Auto-generate code/short-name helper
    const handleNameChange = (nameVal) => {
        const updated = { ...formData, name: nameVal };
        if (!isEdit && !formData.code) {
            // e.g. Grade 1 -> CLS-G1 or standard code
            const clean = nameVal.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            if (clean.length > 0) {
                updated.short_name = nameVal.length <= 4 ? nameVal : clean.slice(0, 4);
            }
        }
        setFormData(updated);
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? 'Edit Class' : 'Add New Class'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {branchName} • {academicYearName}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* General Error Banner */}
        {errors.general && (<div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
            <span>{errors.general}</span>
          </div>)}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Class Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Grade 1, Pre KG, Grade 10" className={`w-full text-sm font-semibold rounded-lg border px-3.5 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-300'}`}/>
            {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Code & Short Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Class Code <span className="text-red-500">*</span>
              </label>
              <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. CLS001, G1" className={`w-full text-sm font-mono font-semibold uppercase rounded-lg border px-3.5 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${errors.code ? 'border-red-400 bg-red-50/30' : 'border-slate-300'}`}/>
              {errors.code && <p className="text-xs text-red-600 mt-1 font-medium">{errors.code}</p>}
              <p className="text-[11px] text-slate-400 mt-1">Unique within this branch & year</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Name
              </label>
              <input type="text" value={formData.short_name} onChange={(e) => setFormData({ ...formData, short_name: e.target.value })} placeholder="e.g. G1, PKG" className="w-full text-sm font-semibold rounded-lg border border-slate-300 px-3.5 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"/>
              <p className="text-[11px] text-slate-400 mt-1">For reports & cards</p>
            </div>
          </div>

          {/* Class Type & Group / Stream Applicable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Class Type / Level <span className="text-red-500">*</span>
              </label>
              <select value={formData.class_type} onChange={(e) => {
            const val = e.target.value;
            setFormData({
                ...formData,
                class_type: val,
                // If Higher Secondary, default group_required to true
                group_required: val === 'Higher Secondary' ? true : formData.group_required
            });
        }} className="w-full text-sm font-semibold rounded-lg border border-slate-300 px-3.5 py-2.5 shadow-2xs bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer">
                <option value="Primary">Primary (Pre-KG to Grade 5)</option>
                <option value="Middle School">Middle School (Grade 6 to 8)</option>
                <option value="Secondary">Secondary (Grade 9 & 10)</option>
                <option value="Higher Secondary">Higher Secondary (Grade 11 & 12)</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Used for curriculum & report card grouping</p>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Group / Stream Applicable
                </label>
                <div className="flex items-center space-x-3 mt-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={Boolean(formData.group_required)} onChange={(e) => setFormData({ ...formData, group_required: e.target.checked })} className="sr-only peer"/>
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ms-3 text-xs font-bold text-slate-800">
                      {formData.group_required ? 'Yes (Stream Required)' : 'No (Common Curriculum)'}
                    </span>
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Mandates stream selection (e.g. Science, Commerce) when creating subjects & enrolling students.
              </p>
            </div>
          </div>

          {/* Display Order & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Order <span className="text-red-500">*</span>
              </label>
              <input type="number" min="1" step="1" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })} className={`w-full text-sm font-semibold rounded-lg border px-3.5 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${errors.display_order ? 'border-red-400 bg-red-50/30' : 'border-slate-300'}`}/>
              {errors.display_order && <p className="text-xs text-red-600 mt-1 font-medium">{errors.display_order}</p>}
              <p className="text-[11px] text-slate-400 mt-1">Controls sorting in reports and menus</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full text-sm font-semibold rounded-lg border border-slate-300 px-3.5 py-2.5 shadow-2xs bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Inactive classes hide from daily ops</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Class' : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
