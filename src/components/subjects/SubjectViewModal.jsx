import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, XCircle } from 'lucide-react';
export const SubjectViewModal = ({ isOpen, onClose, subject, classes = [], branchName = 'Branch', academicYearName = 'Academic Year', onEdit }) => {
    if (!isOpen || !subject)
        return null;
    const getSubjectTypeBadge = (type) => {
        switch (type) {
            case 'Language':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Practical':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Elective':
                return 'bg-cyan-50 text-cyan-700 border-cyan-200';
            case 'Co-Curricular':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Theory':
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };
    // Find class names matching assigned_class_ids
    const assignedClassNames = (subject.assigned_class_ids || [])
        .map((cid) => classes.find((c) => c.id === cid)?.name)
        .filter(Boolean);
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5"/>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">{subject.name}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getSubjectTypeBadge(subject.subject_type)}`}>
                  {subject.subject_type}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Code: {subject.code} {subject.short_name ? `(${subject.short_name})` : ''}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Pass Marks
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {subject.pass_marks}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Max Marks
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {subject.max_marks}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Credits
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {subject.credits}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Status
              </span>
              <span className="mt-1 inline-flex items-center space-x-1 font-bold text-xs">
                {subject.status === 'Active' ? (<span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1"/> Active
                  </span>) : (<span className="inline-flex items-center text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    <XCircle className="w-3 h-3 mr-1"/> Inactive
                  </span>)}
              </span>
            </div>
          </div>

          {/* Scope Info */}
          <div className="p-4 bg-teal-50/50 border border-teal-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Branch Scope:</span>
              <span className="font-bold text-teal-900">{branchName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Academic Year:</span>
              <span className="font-bold text-teal-900">{academicYearName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Display Ordering:</span>
              <span className="font-bold text-teal-900">Priority #{subject.display_order}</span>
            </div>
          </div>

          {/* Assigned Classes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600"/>
              <span>Assigned Classes ({assignedClassNames.length > 0 ? assignedClassNames.length : (subject.assigned_classes ? subject.assigned_classes.split(',').length : 0)})</span>
            </h4>
            {assignedClassNames.length > 0 ? (<div className="flex flex-wrap gap-2">
                {assignedClassNames.map((name, i) => (<span key={i} className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 shadow-2xs">
                    {name}
                  </span>))}
              </div>) : subject.assigned_classes ? (<div className="flex flex-wrap gap-2">
                {subject.assigned_classes.split(',').map((name, i) => (<span key={i} className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 shadow-2xs">
                    {name.trim()}
                  </span>))}
              </div>) : (<p className="text-xs text-slate-400 italic">No classes currently assigned to this subject.</p>)}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] text-slate-400">
            Created: {subject.created_at ? new Date(subject.created_at).toLocaleDateString() : 'System Default'}
          </div>
          <div className="flex items-center space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer">
              Close
            </button>
            {onEdit && (<button type="button" onClick={() => {
                onClose();
                onEdit(subject);
            }} className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-xs cursor-pointer">
                Edit Subject
              </button>)}
          </div>
        </div>
      </div>
    </div>);
};
