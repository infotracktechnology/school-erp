import React from 'react';
import { Eye, Edit3, Star, Clock, Archive, Calendar, RefreshCw, EyeOff, Check, ArrowRight, Layers, Building } from 'lucide-react';

export const AcademicYearTable = ({ academicYears, onView, onEdit, onConfigureClasses, onSetCurrent, onSetNext, onChangeStatus, onToggleEnabled, isLoading = false }) => {
    // Format date helper (e.g., "01 Jun 2026")
    const formatDate = (dateStr) => {
        if (!dateStr)
            return '-';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            }
            return dateStr;
        }
        catch {
            return dateStr;
        }
    };

    const getBranchDates = (ay) => {
        if (!ay) return [];
        if (Array.isArray(ay.branch_dates)) return ay.branch_dates;
        if (typeof ay.branch_dates === 'string') {
            try {
                const parsed = JSON.parse(ay.branch_dates);
                if (Array.isArray(parsed)) return parsed;
            } catch {
                return [];
            }
        }
        return [];
    };

    const getStatusBadge = (ay) => {
        const isCurrent = Boolean(ay.is_current);
        const isEnabled = ay.is_enabled !== false && ay.is_enabled !== 0;
        const isNext = Boolean(ay.is_next);

        if (isCurrent) {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
                    Current / Default
                </span>
            );
        }
        if (isNext && isEnabled) {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                    <Clock className="w-3 h-3 mr-1 text-blue-600"/>
                    Next Year / Enabled
                </span>
            );
        }
        if (!isEnabled) {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs">
                    <EyeOff className="w-3 h-3 mr-1 text-slate-400"/>
                    Disabled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50/70 text-emerald-700 border border-emerald-200 shadow-2xs">
                <Check className="w-3 h-3 mr-1 text-emerald-600"/>
                Enabled
            </span>
        );
    };

    if (isLoading) {
        return (<div className="bg-white border border-slate-200/90 rounded-xl p-8 shadow-xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (<div key={i} className="h-16 bg-slate-100 rounded-lg"></div>))}
          </div>
        </div>
      </div>);
    }

    return (<div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-4">Academic Year</th>
              <th scope="col" className="px-5 py-4">Campus Timeline (Branch-Wise)</th>
              <th scope="col" className="px-5 py-4">Status</th>
              <th scope="col" className="px-5 py-4">Current Session</th>
              <th scope="col" className="px-5 py-4">Global Selector</th>
              <th scope="col" className="px-5 py-4">Created Date</th>
              <th scope="col" className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {academicYears.map((ay) => {
            const isEnabled = ay.is_enabled !== false;
            const branchDates = getBranchDates(ay);

            return (<tr key={ay.id} className={`hover:bg-slate-50/80 transition-colors ${ay.is_current ? 'bg-emerald-50/30' : !isEnabled ? 'bg-slate-50/40 opacity-80' : ''}`}>
                  {/* Academic Year Name & Short Name */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ${ay.is_current
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-600/30'
                    : isEnabled
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        <Calendar className="w-4 h-4"/>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-base ${isEnabled ? 'text-slate-900' : 'text-slate-600 line-through decoration-slate-300'}`}>
                            {ay.name}
                          </span>
                          {ay.short_name && (<span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                              {ay.short_name}
                            </span>)}
                        </div>
                        <span className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                          {branchDates.length > 0 ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px] border border-indigo-100">
                              <Building className="w-3 h-3 text-indigo-500" />
                              <span>{branchDates.length} Campuses Configured</span>
                            </span>
                          ) : (
                            <span className="text-slate-500">Organization-Wide</span>
                          )}
                          {ay.year_name && (
                            <span className="text-slate-400 text-[11px] font-mono font-medium">({ay.year_name})</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Timeline (Branch-Wise Start - End) */}
                  <td className="px-5 py-4 whitespace-nowrap text-slate-800 font-medium">
                    {branchDates.length > 0 ? (
                      <div className="space-y-1.5 py-1">
                        {branchDates.map((bd, idx) => (
                          <div key={idx} className="flex items-center text-xs space-x-2 bg-slate-50/90 border border-slate-200/90 rounded-md px-2.5 py-1 shadow-2xs">
                            <span className="font-bold text-slate-700 min-w-[70px] truncate text-[11px]" title={bd.branch_name}>
                              {bd.branch_name ? bd.branch_name.split('(')[0].trim() : `Branch ${bd.branch_id}`}:
                            </span>
                            <span className="text-slate-600 font-mono text-[11px] flex items-center space-x-1">
                              <span>{formatDate(bd.start_date)}</span>
                              <span className="text-slate-400">→</span>
                              <span>{formatDate(bd.end_date)}</span>
                            </span>
                            {bd.status && bd.status !== ay.status && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold ml-auto">
                                {bd.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs">
                        <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{formatDate(ay.start_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-500 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>{formatDate(ay.end_date)}</span>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusBadge(ay)}
                  </td>

                  {/* Current Year Badge */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {ay.is_current ? (<span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-700 text-white shadow-2xs">
                        <Star className="w-3 h-3 fill-white text-white"/>
                        <span>Current Active</span>
                      </span>) : (<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-400 bg-slate-100">
                        No
                      </span>)}
                  </td>

                  {/* Global Selector Enable/Disable Toggle */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2.5">
                      <button type="button" onClick={() => onToggleEnabled && onToggleEnabled(ay, !isEnabled)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 ${isEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`} role="switch" aria-checked={isEnabled} title={isEnabled
                    ? 'Enabled: Appears in the Global Academic Year selector. Click to disable.'
                    : 'Disabled: Hidden from the Global Academic Year selector. All data remains safe.'}>
                        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}/>
                      </button>

                      <div>
                        {isEnabled ? (<span className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Check className="w-3 h-3 mr-1 text-emerald-600"/>
                            Selectable
                          </span>) : (<span className="inline-flex items-center text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            <EyeOff className="w-3 h-3 mr-1 text-slate-400"/>
                            Hidden
                          </span>)}
                      </div>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(ay.created_at ? ay.created_at.split('T')[0] : '')}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* View Details */}
                      <button type="button" onClick={() => onView(ay)} className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer" title="View Details">
                        <Eye className="w-4 h-4"/>
                      </button>

                      {/* Edit */}
                      <button type="button" onClick={() => onEdit(ay)} className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer" title="Edit Academic Year">
                        <Edit3 className="w-4 h-4"/>
                      </button>

                      {/* Configure Classes */}
                      <button type="button" onClick={() => onConfigureClasses && onConfigureClasses(ay)} className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors shadow-2xs cursor-pointer" title="Configure and Enable/Disable Classes for this Academic Year">
                        <Layers className="w-3.5 h-3.5 text-indigo-700"/>
                        <span>Classes</span>
                      </button>

                      {/* Set as Current */}
                      {!ay.is_current && isEnabled && (<button type="button" onClick={() => onSetCurrent(ay)} className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors shadow-2xs cursor-pointer" title="Set as Current Academic Year">
                          <Star className="w-3.5 h-3.5 text-emerald-700"/>
                          <span>Set Current</span>
                        </button>)}

                      {/* Set as Next Academic Year for Promotion */}
                      {!ay.is_current && !ay.is_next && isEnabled && onSetNext && (<button type="button" onClick={() => onSetNext(ay)} className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-md transition-colors shadow-2xs cursor-pointer" title="Set as Next Academic Year for Promotion">
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600"/>
                          <span>Set Next</span>
                        </button>)}

                      {/* Change Status */}
                      <button type="button" onClick={() => onChangeStatus(ay)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer" title="Change Status (Upcoming, Active, Closed)">
                        <RefreshCw className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </div>);
};

export default AcademicYearTable;
