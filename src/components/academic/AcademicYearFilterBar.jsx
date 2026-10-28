import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
export const AcademicYearFilterBar = ({ filters, onFilterChange, onReset, totalCount, filteredCount }) => {
    const hasActiveFilters = Boolean(filters.search) ||
        filters.status !== 'all' ||
        filters.is_current !== 'all' ||
        (Boolean(filters.is_enabled) && filters.is_enabled !== 'all');
    return (<div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4"/>
          </div>
          <input type="text" placeholder="Search academic year (e.g. 2026-2027, 26-27)..." value={filters.search} onChange={(e) => onFilterChange({ search: e.target.value })} className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-colors shadow-2xs"/>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Status filter */}
          <div className="w-full sm:w-auto">
            <select value={filters.status} onChange={(e) => onFilterChange({ status: e.target.value })} className="w-full appearance-none bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-colors cursor-pointer">
              <option value="all">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Upcoming">Status: Upcoming</option>
              <option value="Closed">Status: Closed</option>
            </select>
          </div>

          {/* Current year filter */}
          <div className="w-full sm:w-auto">
            <select value={filters.is_current} onChange={(e) => onFilterChange({ is_current: e.target.value })} className="w-full appearance-none bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-colors cursor-pointer">
              <option value="all">Current: All</option>
              <option value="current">Current Academic Year Only</option>
              <option value="not_current">Non-Current Cycles</option>
            </select>
          </div>

          {/* Selector Enabled filter */}
          <div className="w-full sm:w-auto">
            <select value={filters.is_enabled || 'all'} onChange={(e) => onFilterChange({ is_enabled: e.target.value })} className="w-full appearance-none bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-colors cursor-pointer">
              <option value="all">Selector: All</option>
              <option value="true">In Selector (Enabled)</option>
              <option value="false">Hidden (Disabled)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (<button type="button" onClick={onReset} className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors shadow-2xs cursor-pointer" title="Clear all filters">
              <RotateCcw className="w-3.5 h-3.5"/>
              <span>Reset</span>
            </button>)}

          {/* Records count badge */}
          <div className="text-xs font-medium text-slate-500 whitespace-nowrap pl-1">
            Showing <strong className="text-slate-800">{filteredCount}</strong> of {totalCount}
          </div>
        </div>
      </div>
    </div>);
};
