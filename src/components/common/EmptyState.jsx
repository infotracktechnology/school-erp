import React from 'react';
import { Building2, Plus, SearchX } from 'lucide-react';
export const EmptyState = ({ isSearchFiltered = false, onAddBranch, onClearFilters }) => {
    if (isSearchFiltered) {
        return (<div className="bg-white border border-slate-200/80 rounded-xl p-10 sm:p-14 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <SearchX className="w-8 h-8"/>
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Branches Match Your Filters</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
          We couldn't find any branches matching your current search and filter criteria. Try adjusting your keywords or clearing the active filters.
        </p>
        <div className="flex items-center justify-center space-x-3">
          {onClearFilters && (<button type="button" onClick={onClearFilters} className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer">
              Clear All Filters
            </button>)}
          <button type="button" onClick={onAddBranch} className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer">
            <Plus className="w-4 h-4"/>
            <span>+ Add Branch</span>
          </button>
        </div>
      </div>);
    }
    return (<div className="bg-white border border-slate-200/80 rounded-2xl p-12 sm:p-16 text-center shadow-xs" id="empty-state-container">
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-5 border border-emerald-100 ring-8 ring-emerald-50/50">
        <Building2 className="w-10 h-10"/>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
        No Branches Found
      </h2>

      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 mb-8 leading-relaxed">
        Create your first school branch to get started.
      </p>

      <button type="button" id="empty-state-add-branch-btn" onClick={onAddBranch} className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer">
        <Plus className="w-4 h-4"/>
        <span>+ Add Branch</span>
      </button>
    </div>);
};
