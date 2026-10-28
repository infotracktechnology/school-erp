import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
export const DeactivateBranchModal = ({ branch, isOpen, onClose, onConfirm, isLoading = false }) => {
    if (!isOpen || !branch)
        return null;
    const isCurrentlyActive = branch.status === 'Active';
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 sm:p-7 text-center animate-scale-up">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isCurrentlyActive
            ? 'bg-amber-50 text-amber-600 border border-amber-200 ring-4 ring-amber-50'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-4 ring-emerald-50'}`}>
          {isCurrentlyActive ? (<AlertTriangle className="w-7 h-7"/>) : (<CheckCircle2 className="w-7 h-7"/>)}
        </div>

        {/* Modal Title */}
        <h2 className="text-xl font-bold text-slate-900">
          {isCurrentlyActive ? 'Deactivate Branch?' : 'Activate Branch?'}
        </h2>

        {/* Content matching the exact prompt specification */}
        {isCurrentlyActive ? (<div className="mt-3 space-y-3">
            <p className="text-sm text-slate-600">
              Are you sure you want to deactivate{' '}
              <strong className="text-slate-900 block mt-1 text-base">{branch.branch_name}</strong>?
            </p>
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed text-left">
              Users will not be able to create new operational records for this branch while it is inactive. Historical data is preserved.
            </div>
          </div>) : (<div className="mt-3 space-y-3">
            <p className="text-sm text-slate-600">
              Are you sure you want to reactivate{' '}
              <strong className="text-slate-900 block mt-1 text-base">{branch.branch_name}</strong>?
            </p>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 leading-relaxed text-left">
              This branch will immediately resume operational status for scheduling, enrollments, and transactions.
            </div>
          </div>)}

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer">
            Cancel
          </button>

          <button type="button" id="confirm-deactivate-btn" onClick={onConfirm} disabled={isLoading} className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer ${isCurrentlyActive
            ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
            : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900'}`}>
            {isLoading ? (<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>) : (<span>{isCurrentlyActive ? 'Deactivate' : 'Activate'}</span>)}
          </button>
        </div>
      </div>
    </div>);
};
