import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
export const UnsavedChangesModal = () => {
    const { pendingTargetYearId, academicYears, confirmPendingYearChange, cancelPendingYearChange } = useErp();
    if (pendingTargetYearId === null) {
        return null;
    }
    const targetYear = academicYears.find(ay => ay.id === pendingTargetYearId);
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div id="unsaved-changes-modal" className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5"/>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Unsaved Changes Warning
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Switching to {targetYear?.name || 'Academic Year'}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-600 leading-relaxed font-medium">
          You have unsaved changes. Changing the Academic Year may clear the current form. Do you want to continue?
        </p>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button type="button" id="cancel-switch-academic-year-button" onClick={cancelPendingYearChange} className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" id="confirm-switch-academic-year-button" onClick={confirmPendingYearChange} className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-xs">
            Continue
          </button>
        </div>
      </div>
    </div>);
};
