import React from 'react';
import { Eye, Edit3, Power, ArrowUpDown, CheckCircle2, XCircle, Lock, Unlock } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';

export const ClassTable = ({ classes, onView, onEdit, onToggleStatus, isReadOnly = false }) => {
    return (
      <Card className="shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left text-xs sm:text-sm">
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <TableHead className="py-3.5 px-4">Class Code</TableHead>
                <TableHead className="py-3.5 px-4">Class Name</TableHead>
                <TableHead className="py-3.5 px-4">Level / Stream</TableHead>
                <TableHead className="py-3.5 px-4">Short Name</TableHead>
                <TableHead className="py-3.5 px-4">
                  <div className="flex items-center space-x-1">
                    <span>Display Order</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400"/>
                  </div>
                </TableHead>
                <TableHead className="py-3.5 px-4">Assigned Sections</TableHead>
                <TableHead className="py-3.5 px-4">Student Status</TableHead>
                <TableHead className="py-3.5 px-4">Status</TableHead>
                <TableHead className="py-3.5 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-medium text-slate-700">
            {classes.map((cls) => {
            const isActive = cls.status === 'Active';
            return (<tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Class Code */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                    <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200 text-xs font-semibold">
                      {cls.code}
                    </span>
                  </td>

                  {/* Class Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{cls.name}</div>
                  </td>

                  {/* Level / Stream */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-700">
                        {cls.class_type || 'Secondary'}
                      </span>
                      {Boolean(cls.group_required) ? (<span className="inline-flex items-center w-fit px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Stream Required
                        </span>) : (<span className="inline-flex items-center w-fit px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-500 bg-slate-100">
                          Common
                        </span>)}
                    </div>
                  </td>

                  {/* Short Name */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {cls.short_name ? (<span className="font-medium">{cls.short_name}</span>) : (<span className="text-slate-400 italic">—</span>)}
                  </td>

                  {/* Display Order */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                      {cls.display_order}
                    </span>
                  </td>

                  {/* Assigned Sections */}
                  <td className="py-3.5 px-4">
                    {cls.sections ? (<div className="flex flex-wrap items-center gap-1.5">
                        {cls.sections.split(', ').map((sec, idx) => (<span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Sec {sec}
                          </span>))}
                      </div>) : (<span className="text-xs text-slate-400 italic">No sections mapped</span>)}
                  </td>

                  {/* Student Status & Lock */}
                  <td className="py-3.5 px-4">
                    {cls.is_locked ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs" title={`Locked: ${cls.student_count || 0} students assigned to this class for this academic year`}>
                        <Lock className="w-3 h-3 mr-1.5 text-amber-600 shrink-0" />
                        <span>Students Assigned ({cls.student_count || 0})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <Unlock className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />
                        <span>No Students</span>
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {isActive ? (<CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600"/>) : (<XCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>)}
                      {cls.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      <button type="button" onClick={() => onView(cls)} className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="View Class Details">
                        <Eye className="w-4 h-4"/>
                      </button>

                      <button type="button" onClick={() => onEdit(cls)} disabled={isReadOnly} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isReadOnly
                    ? 'text-slate-300 cursor-not-allowed opacity-60'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'}`} title={isReadOnly ? 'Read-only: Historical Academic Year' : 'Edit Class'}>
                        <Edit3 className="w-4 h-4"/>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => onToggleStatus(cls)} 
                        disabled={isReadOnly || cls.is_locked} 
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isReadOnly || cls.is_locked
                            ? 'text-slate-300 cursor-not-allowed opacity-60'
                            : isActive
                              ? 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                              : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'
                        }`} 
                        title={
                          cls.is_locked
                            ? `Class is locked: ${cls.student_count || 0} student(s) assigned in this academic year.`
                            : isReadOnly 
                              ? 'Read-only: Historical Academic Year' 
                              : isActive ? 'Deactivate Class' : 'Activate Class'
                        }
                      >
                        {cls.is_locked ? <Lock className="w-4 h-4 text-amber-600" /> : <Power className="w-4 h-4"/>}
                      </button>
                    </div>
                  </td>
                </tr>);
        })}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
};
