import React from 'react';
import { Star, CheckCircle2, X } from 'lucide-react';
export const ChangeCurrentYearModal = ({ isOpen, onClose, onConfirm, targetYear, currentYear, isSubmitting = false }) => {
    if (!isOpen || !targetYear)
        return null;
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Star className="w-6 h-6 fill-amber-500 text-amber-600"/>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Change Current Academic Year?
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Branch: {targetYear.branch_name || 'Current Campus'}
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-4">
          {currentYear ? (<div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>
                <strong className="text-slate-900">{currentYear.name}</strong> is currently the active academic year for this branch.
              </p>
              <p className="text-slate-600">
                Do you want to make <strong className="text-emerald-800">{targetYear.name}</strong> the current academic year?
              </p>
            </div>) : (<div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <p>
                Do you want to make <strong className="text-emerald-800">{targetYear.name}</strong> the current active academic year for this branch?
              </p>
            </div>)}

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
            <span>This will immediately update the active academic session context for future school operations.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-4 flex items-center justify-end space-x-3">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isSubmitting} className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60">
            {isSubmitting ? (<span>Updating...</span>) : (<>
                <Star className="w-4 h-4"/>
                <span>Confirm</span>
              </>)}
          </button>
        </div>
      </div>
    </div>);
};
