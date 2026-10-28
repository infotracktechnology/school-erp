import React from 'react';
import { AlertTriangle } from 'lucide-react';
export const DisableCurrentYearModal = ({ isOpen, onClose, onConfirm, academicYear, isSubmitting = false }) => {
    if (!isOpen || !academicYear)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div id="disable-current-year-modal" className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5"/>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Disable Active Academic Year?
            </h3>
            <p className="text-xs font-semibold text-amber-800 mt-0.5">
              {academicYear.name} ({academicYear.start_date.slice(0, 4)} – {academicYear.end_date.slice(0, 4)})
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium space-y-1.5">
          <p className="font-bold text-amber-950">
            This Academic Year is currently active. Disabling it will remove it from the Academic Year selector. Do you want to continue?
          </p>
          <p className="text-[11px] text-amber-800">
            Disabling will automatically switch your active context to another enabled academic year. All underlying student, class, examination, and fee records remain 100% safe and intact.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button type="button" id="cancel-disable-year-button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
            Cancel
          </button>
          <button type="button" id="confirm-disable-year-button" onClick={onConfirm} disabled={isSubmitting} className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center space-x-1.5">
            {isSubmitting ? (<span>Updating...</span>) : (<span>Continue</span>)}
          </button>
        </div>
      </div>
    </div>);
};
