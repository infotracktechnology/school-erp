import React, { useState, useEffect } from 'react';
import { X, BookOpen, Layers, AlertCircle, Save } from 'lucide-react';
export const SubjectFormModal = ({ isOpen, onClose, onSubmit, subject, branchId, academicYearId, classes = [], branchName = 'Branch', academicYearName = 'Academic Year' }) => {
    const isEditing = Boolean(subject);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [shortName, setShortName] = useState('');
    const [subjectType, setSubjectType] = useState('Theory');
    const [passMarks, setPassMarks] = useState(35);
    const [maxMarks, setMaxMarks] = useState(100);
    const [credits, setCredits] = useState(1.0);
    const [displayOrder, setDisplayOrder] = useState(1);
    const [status, setStatus] = useState('Active');
    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (subject) {
            setName(subject.name || '');
            setCode(subject.code || '');
            setShortName(subject.short_name || '');
            setSubjectType(subject.subject_type || 'Theory');
            setPassMarks(subject.pass_marks ?? 35);
            setMaxMarks(subject.max_marks ?? 100);
            setCredits(subject.credits ?? 1.0);
            setDisplayOrder(subject.display_order ?? 1);
            setStatus(subject.status || 'Active');
            setSelectedClassIds(subject.assigned_class_ids || []);
        }
        else {
            setName('');
            setCode('');
            setShortName('');
            setSubjectType('Theory');
            setPassMarks(35);
            setMaxMarks(100);
            setCredits(1.0);
            setDisplayOrder(classes.length > 0 ? 1 : 1);
            setStatus('Active');
            setSelectedClassIds([]);
        }
        setErrors({});
    }, [subject, isOpen, classes.length]);
    if (!isOpen)
        return null;
    const validate = () => {
        const errs = {};
        if (!name.trim())
            errs.name = 'Subject Name is required';
        if (!code.trim())
            errs.code = 'Subject Code is required';
        if (isNaN(passMarks) || passMarks < 0)
            errs.pass_marks = 'Pass marks must be >= 0';
        if (isNaN(maxMarks) || maxMarks <= 0)
            errs.max_marks = 'Maximum marks must be > 0';
        if (passMarks > maxMarks)
            errs.pass_marks = 'Pass marks cannot exceed maximum marks';
        if (isNaN(credits) || credits < 0)
            errs.credits = 'Credits must be >= 0';
        if (isNaN(displayOrder) || displayOrder < 0)
            errs.display_order = 'Display Order must be >= 0';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                code: code.trim().toUpperCase(),
                short_name: shortName.trim(),
                subject_type: subjectType,
                pass_marks: Number(passMarks),
                max_marks: Number(maxMarks),
                credits: Number(credits),
                display_order: Number(displayOrder),
                status,
                branch_id: branchId,
                academic_year_id: academicYearId,
                class_ids: selectedClassIds
            });
            onClose();
        }
        catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
            else {
                setErrors({ general: err.message || 'Failed to save subject' });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const toggleClassSelection = (cId) => {
        setSelectedClassIds((prev) => prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]);
    };
    const selectAllClasses = () => {
        if (selectedClassIds.length === classes.length) {
            setSelectedClassIds([]);
        }
        else {
            setSelectedClassIds(classes.map((c) => c.id));
        }
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <p className="text-xs text-slate-500">
                {branchName} • {academicYearName}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.general && (<div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{errors.general}</span>
            </div>)}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder="e.g. English Communicative" value={name} onChange={(e) => setName(e.target.value)} className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 ${errors.name
            ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
            : 'border-slate-300 focus:border-teal-500 focus:ring-teal-200'}`}/>
              {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Code <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder="e.g. ENG101" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm uppercase focus:outline-hidden focus:ring-2 ${errors.code
            ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
            : 'border-slate-300 focus:border-teal-500 focus:ring-teal-200'}`}/>
              {errors.code && <p className="text-xs text-red-600 mt-1 font-medium">{errors.code}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Name
              </label>
              <input type="text" placeholder="e.g. ENG" value={shortName} onChange={(e) => setShortName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-200"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Type
              </label>
              <select value={subjectType} onChange={(e) => setSubjectType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
                <option value="Language">Language</option>
                <option value="Elective">Elective</option>
                <option value="Co-Curricular">Co-Curricular</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Academic Grading Rules */}
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Grading & Evaluation Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pass Marks <span className="text-red-500">*</span>
                </label>
                <input type="number" min="0" max={maxMarks} value={passMarks} onChange={(e) => setPassMarks(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-teal-500"/>
                {errors.pass_marks && <p className="text-[10px] text-red-600 mt-0.5">{errors.pass_marks}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Max Marks <span className="text-red-500">*</span>
                </label>
                <input type="number" min="1" value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-teal-500"/>
                {errors.max_marks && <p className="text-[10px] text-red-600 mt-0.5">{errors.max_marks}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Credits / Weightage
                </label>
                <input type="number" step="0.5" min="0" value={credits} onChange={(e) => setCredits(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-teal-500"/>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Display Order
                </label>
                <input type="number" min="1" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-teal-500"/>
              </div>
            </div>
          </div>

          {/* Class Allocations Checkboxes */}
          {classes.length > 0 && (<div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600"/>
                  <span>Assign to Classes</span>
                  <span className="text-slate-400 font-normal">({selectedClassIds.length} selected)</span>
                </label>
                <button type="button" onClick={selectAllClasses} className="text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer">
                  {selectedClassIds.length === classes.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-2">
                {classes.map((cls) => {
                const isChecked = selectedClassIds.includes(cls.id);
                return (<label key={cls.id} className={`flex items-center space-x-2 p-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${isChecked
                        ? 'bg-teal-50 border-teal-300 text-teal-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
                      <input type="checkbox" checked={isChecked} onChange={() => toggleClassSelection(cls.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"/>
                      <span className="truncate">{cls.name}</span>
                    </label>);
            })}
              </div>
            </div>)}

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer">
              <Save className="w-4 h-4"/>
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Subject' : 'Create Subject'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
};
