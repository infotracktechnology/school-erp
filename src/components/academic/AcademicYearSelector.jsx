import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Clock, Settings, Sparkles, Lock, ExternalLink } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
export const AcademicYearSelector = ({ onNavigateToSettings }) => {
    const { activeBranch, enabledAcademicYears, activeAcademicYear, activeAcademicYearId, requestAcademicYearChange, isHistoricalYear, isReadOnly, adminOverrideActive, isLoadingYears } = useErp();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelectYear = (year) => {
        setIsOpen(false);
        requestAcademicYearChange(year.id);
    };
    if (isLoadingYears) {
        return (<div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200 animate-pulse">
        <Calendar className="w-4 h-4 text-slate-400"/>
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
      </div>);
    }
    return (<div className="relative" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button type="button" id="global-academic-year-selector-button" onClick={() => setIsOpen(!isOpen)} className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs ${isHistoricalYear
            ? adminOverrideActive
                ? 'bg-amber-500/10 border-amber-300 text-amber-900 hover:bg-amber-500/15'
                : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/80'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'}`} title={`Academic Year: ${activeAcademicYear?.name || 'Select Year'}`}>
        <div className="flex items-center space-x-1.5">
          {isHistoricalYear ? (<div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5"/>
            </div>) : (<div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5"/>
            </div>)}

          <div className="text-left flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold leading-none">
              Academic Year
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="font-bold text-xs text-slate-900">
                {activeAcademicYear?.name || 'No Year Selected'}
              </span>

              {/* Status Badge */}
              {activeAcademicYear?.is_current ? (<span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center space-x-0.5">
                  <span>Current</span>
                </span>) : activeAcademicYear?.status === 'Upcoming' ? (<span className="px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 flex items-center space-x-0.5">
                  <span>Upcoming</span>
                </span>) : isHistoricalYear ? (<span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center space-x-0.5">
                  <Lock className="w-2.5 h-2.5 inline mr-0.5"/>
                  <span>Historical</span>
                </span>) : null}
            </div>
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (<div id="global-academic-year-dropdown" className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-3.5 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Select Academic Context</span>
              <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                {activeBranch?.branch_name || 'Current Campus'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Switching years loads scoped classes, students, exams and attendance.
            </p>
          </div>

          {/* List of Enabled Academic Years */}
          <div className="max-h-60 overflow-y-auto py-1 px-1.5 space-y-0.5">
            {enabledAcademicYears.length === 0 ? (<div className="px-3 py-4 text-center text-xs text-slate-500">
                No enabled academic years available for this branch.
              </div>) : (enabledAcademicYears.map((ay) => {
                const isSelected = ay.id === activeAcademicYearId;
                const isCurrent = ay.is_current;
                const isUpcoming = ay.status === 'Upcoming';
                const isPast = ay.status === 'Closed' || (!isCurrent && !isUpcoming);
                return (<button key={ay.id} type="button" onClick={() => handleSelectYear(ay)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${isSelected
                        ? 'bg-indigo-50/90 text-indigo-900 font-semibold border border-indigo-200/80 shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700'}`}>
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : isCurrent
                            ? 'bg-emerald-100 text-emerald-700'
                            : isUpcoming
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-500'}`}>
                        {isCurrent ? (<Sparkles className="w-3.5 h-3.5"/>) : isUpcoming ? (<Calendar className="w-3.5 h-3.5"/>) : isPast ? (<Clock className="w-3.5 h-3.5"/>) : (<Calendar className="w-3.5 h-3.5"/>)}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold truncate">{ay.name}</span>
                          {isCurrent && (<span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Current
                            </span>)}
                          {isUpcoming && !isCurrent && (<span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              Upcoming
                            </span>)}
                          {isPast && !isCurrent && !isUpcoming && (<span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              Historical
                            </span>)}
                        </div>
                        <span className="text-[11px] text-slate-600 font-normal">
                          {String(ay.start_date || '').slice(0, 4)} – {String(ay.end_date || '').slice(0, 4)} • {ay.status}
                        </span>
                      </div>
                    </div>

                    {isSelected && (<Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2"/>)}
                  </button>);
            }))}
          </div>

          {/* Quick link to manage academic years */}
          {onNavigateToSettings && (<div className="border-t border-slate-100 pt-1.5 px-1.5 mt-1">
              <button type="button" onClick={() => {
                    setIsOpen(false);
                    onNavigateToSettings();
                }} className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-colors font-medium cursor-pointer">
                <div className="flex items-center space-x-1.5">
                  <Settings className="w-3.5 h-3.5"/>
                  <span>Manage Academic Years</span>
                </div>
                <ExternalLink className="w-3 h-3"/>
              </button>
            </div>)}
        </div>)}
    </div>);
};
