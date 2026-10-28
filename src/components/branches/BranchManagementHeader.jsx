import React from 'react';
import { Plus, RefreshCw, Building } from 'lucide-react';
export const BranchManagementHeader = ({ onAddBranch, onRefresh, isRefreshing = false, totalCount }) => {
    return (<div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center border border-emerald-200/60">
              <Building className="w-5 h-5"/>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Branch Management
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Create and manage school branches and campuses
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button type="button" onClick={onRefresh} disabled={isRefreshing} className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50" title="Refresh list">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-700' : 'text-slate-500'}`}/>
            <span className="hidden xs:inline">Refresh</span>
          </button>

          <button type="button" id="add-branch-primary-btn" onClick={onAddBranch} className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all duration-150 cursor-pointer">
            <Plus className="w-4 h-4"/>
            <span>+ Add Branch</span>
          </button>
        </div>
      </div>
    </div>);
};
