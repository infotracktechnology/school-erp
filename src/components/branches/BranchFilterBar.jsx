import React from 'react';
import { Search, X } from 'lucide-react';
import { BRANCH_TYPES, EDUCATION_BOARDS, INDIAN_STATES_DISTRICTS } from '../../data/indiaData';
export const BranchFilterBar = ({ filters, onFilterChange, onClearFilters, totalFilteredCount }) => {
    const states = Object.keys(INDIAN_STATES_DISTRICTS);
    const activeFiltersCount = [
        filters.search,
        filters.branch_type && filters.branch_type !== 'all' ? filters.branch_type : '',
        filters.board && filters.board !== 'all' ? filters.board : '',
        filters.status && filters.status !== 'all' ? filters.status : '',
        filters.state && filters.state !== 'all' ? filters.state : ''
    ].filter(Boolean).length;
    return (<div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col gap-3.5">
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4"/>
          </div>
          <input type="text" id="branch-search-input" value={filters.search} onChange={(e) => onFilterChange('search', e.target.value)} placeholder="Search by Branch Name, Branch Code (e.g. GPC001), City, or Branch Head..." className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"/>
          {filters.search && (<button type="button" onClick={() => onFilterChange('search', '')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4"/>
            </button>)}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Branch Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Branch Type
            </label>
            <select id="filter-branch-type" value={filters.branch_type} onChange={(e) => onFilterChange('branch_type', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
              <option value="all">All Branch Types</option>
              {BRANCH_TYPES.map((type) => (<option key={type} value={type}>
                  {type}
                </option>))}
            </select>
          </div>

          {/* Education Board Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Education Board
            </label>
            <select id="filter-education-board" value={filters.board} onChange={(e) => onFilterChange('board', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
              <option value="all">All Boards</option>
              {EDUCATION_BOARDS.map((board) => (<option key={board} value={board}>
                  {board}
                </option>))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select id="filter-status" value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              State / Region
            </label>
            <select id="filter-state" value={filters.state} onChange={(e) => onFilterChange('state', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
              <option value="all">All States</option>
              {states.map((st) => (<option key={st} value={st}>
                  {st}
                </option>))}
            </select>
          </div>

          {/* Action / Clear Filters */}
          <div className="flex items-end justify-between sm:justify-start lg:justify-end space-x-2 pt-4 sm:pt-0">
            {activeFiltersCount > 0 && (<button type="button" id="clear-filters-btn" onClick={onClearFilters} className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 active:bg-rose-200 transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5"/>
                <span>Clear Filters ({activeFiltersCount})</span>
              </button>)}
          </div>
        </div>
      </div>
    </div>);
};
