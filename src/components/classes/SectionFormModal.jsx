import React, { useState, useEffect } from 'react';
import { X, Bookmark, AlertCircle } from 'lucide-react';
export const SectionFormModal = ({ isOpen, onClose, onSubmit, initialData, branchId, academicYearId, branchName, academicYearName }) => {
    const isEdit = Boolean(initialData);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        short_name: '',
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
                status: 'Active',
                branch_id: branchId,
                academic_year_id: academicYearId
            });
        }
        setErrors({});
    }, [initialData, isOpen, branchId, academicYearId]);
    if (!isOpen)
        return null;
    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Section Name is required (e.g. "A", "B", "Alpha")';
        }
        if (!formData.code.trim()) {
            newErrors.code = 'Section Code is required (e.g. "SEC001", "SECA")';
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
                name: formData.name.trim().toUpperCase(),
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
                setErrors({ general: err.message || 'Failed to save section' });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleNameChange = (val) => {
        const trimmedUpper = val.trim().toUpperCase();
        const updated = { ...formData, name: val };
        if (!isEdit && !formData.code && trimmedUpper) {
            updated.code = `SEC-${trimmedUpper}`;
            updated.short_name = trimmedUpper;
        }
        setFormData(updated);
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Bookmark className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? 'Edit Section' : 'Add New Section'}
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

        {/* General Error */}
        {errors.general && (<div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
            <span>{errors.general}</span>
          </div>)}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Section Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Section Name <span className="text-red-500">*</span>
            </label>
            <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. A, B, C, Rose, Lotus" className={`w-full text-sm font-semibold rounded-lg border px-3.5 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-300'}`}/>
            {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Code & Short Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Section Code <span className="text-red-500">*</span>
              </label>
              <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. SEC001, SECA" className={`w-full text-sm font-mono font-semibold uppercase rounded-lg border px-3.5 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${errors.code ? 'border-red-400 bg-red-50/30' : 'border-slate-300'}`}/>
              {errors.code && <p className="text-xs text-red-600 mt-1 font-medium">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Name
              </label>
              <input type="text" value={formData.short_name} onChange={(e) => setFormData({ ...formData, short_name: e.target.value })} placeholder="e.g. A" className="w-full text-sm font-semibold rounded-lg border border-slate-300 px-3.5 py-2.5 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"/>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full text-sm font-semibold rounded-lg border border-slate-300 px-3.5 py-2.5 shadow-2xs bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Section' : 'Save Section'}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
