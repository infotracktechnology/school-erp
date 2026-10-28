import React, { useState } from 'react';
import { Eye, Edit, Settings, Power, MapPin, Calendar, User } from 'lucide-react';
export const BranchTable = ({ branches, onView, onEdit, onSettings, onToggleStatus }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const formatDate = (dateStr) => {
        if (!dateStr)
            return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
        catch {
            return dateStr;
        }
    };
    const getBoardBadgeClass = (board) => {
        switch (board) {
            case 'CBSE':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'ICSE':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Cambridge':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'IB':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'State Board':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };
    const getBranchTypeBadgeClass = (type) => {
        switch (type) {
            case 'Main Branch':
                return 'bg-emerald-100/90 text-emerald-800 font-bold border-emerald-300';
            case 'Campus':
            case 'Senior Campus':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'Junior Campus':
                return 'bg-teal-50 text-teal-800 border-teal-200';
            case 'Coaching Centre':
                return 'bg-orange-50 text-orange-800 border-orange-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };
    return (<div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse" id="branches-data-table">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Branch Code</th>
              <th className="py-3.5 px-4">Branch Name</th>
              <th className="py-3.5 px-4">Branch Type</th>
              <th className="py-3.5 px-4">Board</th>
              <th className="py-3.5 px-4">City</th>
              <th className="py-3.5 px-4">Branch Head</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Created Date</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {branches.map((branch) => {
            const isInactive = branch.status === 'Inactive';
            return (<tr key={branch.id} id={`branch-row-${branch.id}`} className={`hover:bg-slate-50/70 transition-colors group ${isInactive ? 'bg-slate-50/40 opacity-80' : ''}`}>
                  {/* Branch Code */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200/80 group-hover:border-emerald-300 group-hover:bg-emerald-50/50 transition-colors">
                        {branch.branch_code}
                      </span>
                    </div>
                  </td>

                  {/* Branch Name & Logo */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3 min-w-[200px]">
                      {branch.logo ? (<img src={branch.logo} alt={branch.branch_name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-white" referrerPolicy="no-referrer"/>) : (<div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {branch.branch_name.slice(0, 2).toUpperCase()}
                        </div>)}
                      <div>
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{branch.branch_name}</span>
                        </div>
                        {branch.short_name && (<div className="text-[11px] text-slate-500 font-medium">
                            Alias: {branch.short_name}
                          </div>)}
                      </div>
                    </div>
                  </td>

                  {/* Branch Type */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border ${getBranchTypeBadgeClass(branch.branch_type)}`}>
                      {branch.branch_type}
                    </span>
                  </td>

                  {/* Board */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBoardBadgeClass(branch.board)}`}>
                      {branch.board}
                    </span>
                  </td>

                  {/* City & State */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
                      <span>{branch.city}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-4">{branch.state}</div>
                  </td>

                  {/* Branch Head */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {branch.branch_head_name ? (<div>
                        <div className="font-semibold text-slate-800 flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
                          <span>{branch.branch_head_name}</span>
                        </div>
                        {branch.branch_head_designation && (<div className="text-[11px] text-slate-500 pl-4">
                            {branch.branch_head_designation}
                          </div>)}
                      </div>) : (<span className="text-xs text-slate-400 italic">Not Assigned</span>)}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {branch.status === 'Active' ? (<span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Active</span>
                      </span>) : (<span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>Inactive</span>
                      </span>)}
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
                      <span>{formatDate(branch.created_at)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {/* View Action */}
                      <button type="button" id={`btn-view-branch-${branch.id}`} onClick={() => onView(branch)} className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" title="View Branch Profile">
                        <Eye className="w-4 h-4"/>
                      </button>

                      {/* Edit Action */}
                      <button type="button" id={`btn-edit-branch-${branch.id}`} onClick={() => onEdit(branch)} className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Edit Branch">
                        <Edit className="w-4 h-4"/>
                      </button>

                      {/* Settings Action */}
                      <button type="button" id={`btn-settings-branch-${branch.id}`} onClick={() => onSettings(branch)} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Branch Settings">
                        <Settings className="w-4 h-4"/>
                      </button>

                      {/* Activate / Deactivate Toggle */}
                      <button type="button" id={`btn-toggle-status-${branch.id}`} onClick={() => onToggleStatus(branch)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${branch.status === 'Active'
                    ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                    : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'}`} title={branch.status === 'Active' ? 'Deactivate Branch' : 'Activate Branch'}>
                        <Power className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Summary */}
      <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong className="text-slate-700">{branches.length}</strong> {branches.length === 1 ? 'branch' : 'branches'}
        </span>
        <span className="text-[11px] text-slate-400">
          Data isolated under Organization ID #1
        </span>
      </div>
    </div>);
};
