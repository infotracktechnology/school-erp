import React from 'react';
import { Building2, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
export const BranchPerformanceTable = ({ branches, onViewBranch, onDrillDown }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Excellent':
                return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"/>
            Optimal
          </span>);
            case 'Good':
                return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"/>
            Normal
          </span>);
            case 'Attention Required':
                return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400"/>
            Action Req.
          </span>);
        }
    };
    return (<div id="branch-performance-table-container" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Building2 className="w-5 h-5"/>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Branch Performance & Process Completion
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300">
                {branches.length} Branches Tracked
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Holistic comparative scorecard assessing process adherence, student engagement, assessments, and financial health.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="py-3 px-5 font-semibold">Branch Name</th>
              <th className="py-3 px-4 font-semibold text-right">Students</th>
              <th className="py-3 px-4 font-semibold text-right">Attendance</th>
              <th className="py-3 px-4 font-semibold text-right">Exams</th>
              <th className="py-3 px-4 font-semibold text-right">Grade Book</th>
              <th className="py-3 px-4 font-semibold text-right">Fee Recovery</th>
              <th className="py-3 px-4 font-semibold text-right">Admissions</th>
              <th className="py-3 px-4 font-semibold text-center">Overall Health</th>
              <th className="py-3 px-5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {branches.map((b) => (<tr key={b.branch_id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      {b.branch_code}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-xs">
                        {b.branch_name}
                      </div>
                      <div className="text-[11px] text-gray-500">{b.city}</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-gray-100">
                  {b.students?.toLocaleString()}
                </td>

                <td className="py-4 px-4 text-right">
                  <button onClick={() => onDrillDown('attendance', b.branch_id)} className="group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
                    <span className={b.attendance_percentage < 92 ? 'text-rose-600 dark:text-rose-400' : ''}>
                      {b.attendance_percentage}%
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600"/>
                  </button>
                </td>

                <td className="py-4 px-4 text-right">
                  <button onClick={() => onDrillDown('examination', b.branch_id)} className="group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
                    <span className={b.exams_completion_percentage < 80 ? 'text-rose-600 dark:text-rose-400' : ''}>
                      {b.exams_completion_percentage}%
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600"/>
                  </button>
                </td>

                <td className="py-4 px-4 text-right">
                  <button onClick={() => onDrillDown('gradebook', b.branch_id)} className="group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
                    <span className={b.gradebook_completion_percentage < 75 ? 'text-rose-600 dark:text-rose-400 font-extrabold' : ''}>
                      {b.gradebook_completion_percentage}%
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600"/>
                  </button>
                </td>

                <td className="py-4 px-4 text-right">
                  <button onClick={() => onDrillDown('fees', b.branch_id)} className="group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
                    <span className={b.fee_collection_percentage < 85 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {b.fee_collection_percentage}%
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600"/>
                  </button>
                </td>

                <td className="py-4 px-4 text-right font-medium text-gray-700 dark:text-gray-300">
                  {b.admissions_percentage}%
                </td>

                <td className="py-4 px-4 text-center">
                  {getStatusBadge(b.overall_status)}
                </td>

                <td className="py-4 px-5 text-right">
                  <button id={`view-branch-btn-${b.branch_id}`} onClick={() => onViewBranch(b.branch_id)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors inline-flex items-center gap-1">
                    View Branch <ChevronRight className="w-3.5 h-3.5"/>
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>);
};
