import React from 'react';
import { Building2, ChevronDown, Shield, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useErp } from '../../context/ErpContext';

export const AcademicBranchYearSelector = ({ branches, selectedBranchId, onSelectBranch, academicYears, selectedAcademicYearId, onSelectAcademicYear, isLoading = false, moduleName = 'Academic Management' }) => {
    const { isSuperAdmin, assignedBranch } = useErp();
    const safeBranches = branches || [];
    const safeAcademicYears = academicYears || [];
    const selectedBranch = !isSuperAdmin && assignedBranch ? assignedBranch : (safeBranches.find((b) => b.id === selectedBranchId) || safeBranches[0] || null);
    // Academic years are organization-wide entities with branch-wise start/end dates
    const branchScopedYears = safeAcademicYears;
    const selectedYear = branchScopedYears.find((y) => y.id === selectedAcademicYearId) || branchScopedYears.find((y) => y.is_current) || branchScopedYears[0] || null;
    return (
      <Card className="rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left info */}
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Building2 className="w-5 h-5"/>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Scope Filter
                </span>
                <Badge variant="outline" className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border-sky-200">
                  Branch & Year Isolated
                </Badge>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                <span className="text-sky-900 font-bold">{selectedBranch ? selectedBranch.branch_name : 'Select Branch'}</span> 
                <span className="text-slate-400 font-normal mx-2">/</span>
                <span className="text-indigo-800 font-bold">{selectedYear ? selectedYear.name : 'Select Year'}</span>
              </h2>
            </div>
          </div>

        {/* Right Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-[320px] lg:min-w-[480px]">
          {/* Branch Select - Sky Accent */}
          <div>
            <label className="block text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              <span>Campus Branch</span>
            </label>
            {isSuperAdmin ? (
              <div className="relative">
                <select id="scope-branch-select" value={selectedBranchId || ''} onChange={(e) => onSelectBranch(Number(e.target.value))} disabled={isLoading || branches.length === 0} className="w-full appearance-none bg-sky-50/40 hover:bg-sky-50 focus:bg-white text-slate-900 text-sm font-semibold border border-sky-200 rounded-lg pl-3 pr-9 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 transition-colors disabled:opacity-60 cursor-pointer">
                  {branches.map((b) => (<option key={b.id} value={b.id}>
                      {b.branch_name} ({b.branch_code})
                    </option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-sky-600">
                  <ChevronDown className="w-4 h-4"/>
                </div>
              </div>
            ) : (
              <div className="w-full bg-sky-50 text-sky-900 text-sm font-bold border border-sky-200 rounded-lg px-3 py-2 shadow-2xs flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>{selectedBranch?.branch_name || 'Assigned Branch'} ({selectedBranch?.branch_code || ''})</span>
              </div>
            )}
          </div>

          {/* Academic Year Select - Violet Accent */}
          <div>
            <label className="block text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              <span>Academic Year</span>
            </label>
            <div className="relative">
              <select id="scope-ay-select" value={selectedYear ? selectedYear.id : (selectedAcademicYearId || '')} onChange={(e) => onSelectAcademicYear(Number(e.target.value))} disabled={isLoading || branchScopedYears.length === 0} className="w-full appearance-none bg-violet-50/40 hover:bg-violet-50 focus:bg-white text-slate-900 text-sm font-semibold border border-violet-200 rounded-lg pl-3 pr-9 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-colors disabled:opacity-60 cursor-pointer">
                {branchScopedYears.length === 0 ? (<option value="">No Academic Years for this Branch</option>) : (branchScopedYears.map((ay) => (<option key={ay.id} value={ay.id}>
                      {ay.name} {ay.is_current ? '• [CURRENT]' : `• (${ay.status})`}
                    </option>)))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-violet-600">
                <ChevronDown className="w-4 h-4"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0"/>
          <span>
            {moduleName} records isolated to <strong className="text-slate-800">{selectedBranch?.branch_name}</strong> & Academic Year <strong className="text-violet-700">{selectedYear?.name}</strong>.
          </span>
        </div>
        {selectedYear && (<div className="flex items-center space-x-2">
            {selectedYear.is_current && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700"/>
                Active Current Session
              </span>)}
            <span className="text-slate-400 font-medium font-mono text-[11px]">
              {selectedYear.start_date} → {selectedYear.end_date}
            </span>
          </div>)}
      </div>
    </Card>);
};
