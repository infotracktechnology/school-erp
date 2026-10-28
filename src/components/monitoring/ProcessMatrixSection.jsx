import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, HelpCircle, Layers, Filter } from 'lucide-react';
export const ProcessMatrixSection = ({ data, branches, onProcessClick }) => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');
    if (!data || !data.process_list)
        return null;
    const getStatusBadge = (status, pct) => {
        switch (status) {
            case 'Completed':
                return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"/>
            100%
          </span>);
            case 'In Progress':
                return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400"/>
            {pct || 65}%
          </span>);
            case 'Pending':
                return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400"/>
            {pct || 0}% Action
          </span>);
            default:
                return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            <HelpCircle className="w-3 h-3 text-gray-400"/>
            Not Started
          </span>);
        }
    };
    const safeBranches = branches || [];
    const filteredBranches = selectedBranchFilter === 'all'
        ? safeBranches
        : safeBranches.filter(b => String(b.id) === selectedBranchFilter);
    return (<div id="process-matrix-section" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4 bg-gray-50/50 dark:bg-gray-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Layers className="w-5 h-5"/>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Process Completion Status Matrix
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300">
                13 Core Processes × {safeBranches.length} Branches
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cross-branch operational readiness across academics, attendance, examinations, fee collection, and administrative workflows.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5"/>
            <span>Branch:</span>
            <select id="process-matrix-branch-filter" value={selectedBranchFilter} onChange={(e) => setSelectedBranchFilter(e.target.value)} className="px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <option value="all">All Branches ({branches.length})</option>
              {branches.map(b => (<option key={b.id} value={String(b.id)}>{b.branch_name}</option>))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
            </span>
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> In Progress
            </span>
            <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Pending
            </span>
          </div>
        </div>
      </div>

      {/* Process Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="py-3 px-5 font-semibold sticky left-0 bg-gray-50/90 dark:bg-gray-800/90 z-10 w-64">
                ERP Process Name
              </th>
              {filteredBranches.map(b => (<th key={b.id} className="py-3 px-4 font-semibold text-center min-w-[140px]">
                  <div className="font-bold text-gray-900 dark:text-white">{b.branch_name}</div>
                  <div className="text-[10px] text-gray-400 font-normal">{b.branch_code}</div>
                </th>))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {data.process_list.map((processName, idx) => {
            const rowData = data.matrix[processName] || {};
            return (<tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-900 z-10 border-r border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span>{processName}</span>
                    </div>
                  </td>
                  {filteredBranches.map(b => {
                    const item = rowData[b.id];
                    return (<td key={b.id} className="py-3 px-4 text-center cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors" onClick={() => onProcessClick && onProcessClick(processName, b.id)} title={item?.details || `${processName} - ${item?.status || 'Not Started'}`}>
                        <div className="flex flex-col items-center gap-1">
                          {getStatusBadge(item?.status, item?.pct)}
                          {item?.details && (<span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                              {item.details}
                            </span>)}
                        </div>
                      </td>);
                })}
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </div>);
};
