import React from 'react';
import { X, Bookmark, CheckCircle2, XCircle } from 'lucide-react';
export const SectionViewModal = ({ isOpen, onClose, sectionItem, branchName, academicYearName, onEdit }) => {
    if (!isOpen || !sectionItem)
        return null;
    const isActive = sectionItem.status === 'Active';
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Bookmark className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Section {sectionItem.name}</h3>
              <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {sectionItem.code}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${isActive
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-slate-200 text-slate-700'}`}>
                  {isActive ? (<CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700"/>) : (<XCircle className="w-3 h-3 mr-1 text-slate-500"/>)}
                  {sectionItem.status}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Short Name</div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                {sectionItem.short_name || '—'}
              </div>
            </div>
          </div>

          {/* Mapped Classes */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Classes With Section {sectionItem.name} ({sectionItem.class_count || 0})
            </div>
            {sectionItem.classes ? (<div className="flex flex-wrap gap-1.5 pt-1">
                {sectionItem.classes.split(', ').map((cls, idx) => (<span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white text-slate-900 border border-slate-300 shadow-2xs">
                    {cls}
                  </span>))}
              </div>) : (<p className="text-xs text-slate-400 italic">Not currently mapped to any classes.</p>)}
          </div>

          {/* Scope context */}
          <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-400">Campus Branch:</span>
              <span className="font-semibold text-slate-700">{branchName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-400">Academic Year:</span>
              <span className="font-semibold text-slate-700">{academicYearName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-400">Record ID:</span>
              <span className="font-mono text-slate-700">#{sectionItem.id}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            Close
          </button>
          <button type="button" onClick={() => {
            onClose();
            onEdit(sectionItem);
        }} className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-2xs">
            Edit Section
          </button>
        </div>
      </div>
    </div>);
};
