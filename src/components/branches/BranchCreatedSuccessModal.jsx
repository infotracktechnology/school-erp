import React from 'react';
import { CheckCircle2, List, Settings } from 'lucide-react';
export const BranchCreatedSuccessModal = ({ branch, isOpen, onClose, onContinueSetup }) => {
    if (!isOpen || !branch)
        return null;
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 sm:p-8 text-center animate-scale-up">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9"/>
        </div>

        {/* Header Text */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Branch Created Successfully
        </h2>

        {/* Branch Details Highlight Box */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
          <div className="flex items-center space-x-3">
            {branch.logo ? (<img src={branch.logo} alt={branch.branch_name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-white" referrerPolicy="no-referrer"/>) : (<div className="w-12 h-12 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {branch.branch_name.slice(0, 2).toUpperCase()}
              </div>)}
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                {branch.branch_name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Branch Code: {branch.branch_code}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {branch.city}, {branch.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The branch has been initialized with organizational data isolation. You can now configure operational parameters or return to the branch directory.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" id="btn-continue-branch-setup" onClick={() => onContinueSetup(branch)} className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer">
            <Settings className="w-4 h-4"/>
            <span>Continue Branch Setup</span>
          </button>

          <button type="button" id="btn-back-to-branch-list" onClick={onClose} className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer">
            <List className="w-4 h-4 text-slate-500"/>
            <span>Back to Branch List</span>
          </button>
        </div>
      </div>
    </div>);
};
