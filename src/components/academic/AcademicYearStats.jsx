import React from 'react';
import { Calendar, Clock, Archive, Eye } from 'lucide-react';
export const AcademicYearStats = ({ academicYears, currentAcademicYear }) => {
    const safeYears = academicYears || [];
    const total = safeYears.length;
    const enabledCount = safeYears.filter(y => y.is_enabled !== false).length;
    const activeCount = safeYears.filter(y => y.status === 'Active').length;
    const upcomingCount = safeYears.filter(y => y.status === 'Upcoming').length;
    const closedCount = safeYears.filter(y => y.status === 'Closed').length;
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      {/* 1. Current Active Academic Year Card - Emerald */}
      <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-4 shadow-xs relative overflow-hidden bg-gradient-to-br from-emerald-50/60 via-white to-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            Current Session
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white uppercase tracking-wide">
            Active
          </span>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-xl font-black text-slate-900 tracking-tight truncate">
            {currentAcademicYear ? currentAcademicYear.name : 'None Set'}
          </span>
          {currentAcademicYear?.short_name && (<span className="text-xs font-semibold text-slate-500 font-mono shrink-0">
              ({currentAcademicYear.short_name})
            </span>)}
        </div>
        <p className="text-xs text-slate-600 mt-1 flex items-center space-x-1 truncate">
          <Calendar className="w-3.5 h-3.5 text-emerald-700 inline shrink-0"/>
          <span className="truncate">
            {currentAcademicYear
            ? `${currentAcademicYear.start_date.slice(0, 4)} – ${currentAcademicYear.end_date.slice(0, 4)}`
            : 'Designate an active year'}
          </span>
        </p>
      </div>

      {/* 2. Global Selector Enabled - Teal */}
      <div className="bg-white border border-teal-200/90 rounded-xl p-4 shadow-xs bg-gradient-to-br from-teal-50/30 to-white">
        <div className="flex items-center justify-between text-teal-700">
          <span className="text-xs font-bold uppercase tracking-wider">In Global Selector</span>
          <div className="w-6 h-6 rounded-md bg-teal-100/80 flex items-center justify-center text-teal-700">
            <Eye className="w-3.5 h-3.5"/>
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{enabledCount}</span>
          <span className="text-xs font-medium text-teal-700">of {total} active</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Selectable in top header
        </p>
      </div>

      {/* 3. Total Registered Cycles - Indigo */}
      <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-indigo-700">
          <span className="text-xs font-bold uppercase tracking-wider">Total Cycles</span>
          <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-indigo-600"/>
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{total}</span>
          <span className="text-xs font-medium text-slate-500">records</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Branch academic history
        </p>
      </div>

      {/* 4. Upcoming Cycles - Amber */}
      <div className="bg-white border border-amber-200/80 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-amber-700">
          <span className="text-xs font-bold uppercase tracking-wider">Upcoming</span>
          <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-amber-600"/>
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{upcomingCount}</span>
          <span className="text-xs font-medium text-amber-700">upcoming</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Future academic sessions
        </p>
      </div>

      {/* 5. Closed / Archived History - Slate */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-xs font-bold uppercase tracking-wider">Closed History</span>
          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
            <Archive className="w-3.5 h-3.5 text-slate-500"/>
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{closedCount}</span>
          <span className="text-xs font-medium text-slate-500">archived</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Preserved historical records
        </p>
      </div>
    </div>);
};
