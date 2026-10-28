import React from 'react';
import { Building, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
export const BranchStats = ({ stats }) => {
    if (!stats)
        return null;
    const boardNames = Object.keys(stats.boardsCount || {});
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Branches */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Campuses</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {stats.total}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all locations</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
          <Building className="w-6 h-6"/>
        </div>
      </div>

      {/* Active Campuses */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Active Operations</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            {stats.active}
          </p>
          <p className="text-[11px] text-emerald-600/90 mt-0.5">Fully operational</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
          <CheckCircle2 className="w-6 h-6"/>
        </div>
      </div>

      {/* Inactive Campuses */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inactive Campuses</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-700 mt-1">
            {stats.inactive}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Archived / Paused</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50/80 text-amber-700 flex items-center justify-center border border-amber-100">
          <AlertCircle className="w-6 h-6"/>
        </div>
      </div>

      {/* Boards Representation */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Affiliated Boards</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {boardNames.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[130px]">
            {boardNames.slice(0, 3).join(', ') || 'None'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
          <BookOpen className="w-6 h-6"/>
        </div>
      </div>
    </div>);
};
