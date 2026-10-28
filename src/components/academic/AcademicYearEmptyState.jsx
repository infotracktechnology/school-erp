import React from 'react';
import { Calendar, Plus, CalendarPlus } from 'lucide-react';
export const AcademicYearEmptyState = ({ onAddClick, branch, hasFilters = false, onClearFilters }) => {
    if (hasFilters) {
        return (<div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Calendar className="w-7 h-7"/>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          No Matching Academic Years
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
          No academic cycles match your active search and filter criteria for {branch?.branch_name || 'this branch'}.
        </p>
        {onClearFilters && (<button type="button" onClick={onClearFilters} className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer">
            Clear Search & Filters
          </button>)}
      </div>);
    }
    return (<div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center shadow-2xs">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-700 shadow-2xs">
        <CalendarPlus className="w-8 h-8"/>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">
        No Academic Year Found
      </h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
        Create an academic year for {branch ? <strong>{branch.branch_name}</strong> : 'this branch'} to get started. Academic cycles are strictly isolated by branch.
      </p>
      <button type="button" onClick={onAddClick} className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer">
        <Plus className="w-4 h-4"/>
        <span>+ Add Academic Year</span>
      </button>
    </div>);
};
