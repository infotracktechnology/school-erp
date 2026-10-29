import React from 'react';
import { Edit3, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';

export const ClassSectionSummaryTable = ({ summary, onEditClassMapping, onToggleEnable, isReadOnly = false }) => {
    return (
      <Card className="shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left text-xs sm:text-sm">
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <TableHead className="py-3.5 px-4">Class</TableHead>
                <TableHead className="py-3.5 px-4">Short Name</TableHead>
                <TableHead className="py-3.5 px-4">Display Order</TableHead>
                <TableHead className="py-3.5 px-4">Assigned Sections</TableHead>
                <TableHead className="py-3.5 px-4">Student Status</TableHead>
                <TableHead className="py-3.5 px-4">Total Sections</TableHead>
                <TableHead className="py-3.5 px-4">Enabled</TableHead>
                <TableHead className="py-3.5 px-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-medium text-slate-700">
              {summary.map((row) => {
              const isActive = row.class_status === 'Active';
              return (
                <TableRow key={row.class_id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Class */}
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>{row.class_name}</span>
                      {row.is_locked && (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300" title={`${row.student_count} students assigned`}>
                          <Lock className="w-2.5 h-2.5 mr-0.5 text-amber-700 shrink-0" />
                          {row.student_count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-800">{row.class_code}</span>
                  </TableCell>

                  {/* Short Name */}
                  <TableCell className="py-3.5 px-4 text-slate-600 font-medium">
                    {row.short_name || <span className="text-slate-400 italic">—</span>}
                  </TableCell>

                  {/* Display Order */}
                  <TableCell className="py-3.5 px-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                      {row.display_order}
                    </span>
                  </TableCell>

                  {/* Assigned Sections */}
                  <TableCell className="py-3.5 px-4">
                    {row.total_sections > 0 ? (<div className="flex flex-wrap items-center gap-1.5 max-w-md">
                        {row.sections_list.split(', ').map((sec, idx) => {
                          const trimmedSec = sec.trim();
                          const count = (row.section_students && row.section_students[trimmedSec]) || 0;
                          return (<Badge key={idx} variant="outline" className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span>Section {trimmedSec}</span>
                              {count > 0 && (
                                <span className="ml-1 inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-1 rounded border border-amber-300 shadow-2xs" title={`Locked: ${count} student(s) enrolled`}>
                                  <Lock className="w-2.5 h-2.5 mr-0.5 text-amber-700" />
                                  {count}
                                </span>
                              )}
                            </Badge>);
                        })}
                      </div>) : (<Badge variant="outline" className="text-xs text-amber-700 bg-amber-50 border border-amber-200 font-semibold">
                        No sections mapped
                      </Badge>)}
                  </TableCell>

                  {/* Student Status */}
                  <TableCell className="py-3.5 px-4">
                    {row.is_locked ? (
                      <Badge className="bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs font-bold" title={`Class has ${row.student_count} student(s) enrolled`}>
                        <Lock className="w-3 h-3 mr-1 text-amber-700 shrink-0"/>
                        <span>Students Assigned ({row.student_count})</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 font-medium">
                        No Students
                      </Badge>
                    )}
                  </TableCell>

                  {/* Total Sections */}
                  <TableCell className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{row.total_sections}</span>
                  </TableCell>

                  {/* Enabled Toggle */}
                  <TableCell className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={!!row.is_enabled}
                      disabled={row.is_locked || isReadOnly}
                      onChange={() => onToggleEnable && onToggleEnable(row.class_id, row.is_enabled)}
                      className="h-4 w-4 accent-emerald-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      title={row.is_locked ? `Locked: ${row.student_count} student(s) assigned` : isReadOnly ? 'Read-only mode' : (row.is_enabled ? 'Click to disable class' : 'Click to enable class')}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5 px-4">
                    <Badge className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}>
                      {isActive ? (<CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600"/>) : (<XCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>)}
                      {row.class_status}
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="py-3.5 px-4 text-right">
                    <Button type="button" size="sm" variant="outline" onClick={() => onEditClassMapping(row)} disabled={isReadOnly} className={`inline-flex items-center space-x-1 text-xs font-bold ${isReadOnly
                    ? 'text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed opacity-60'
                    : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 shadow-2xs'}`} title={isReadOnly ? 'Read-only: Historical Academic Year' : 'Edit Mappings'}>
                      <Edit3 className="w-3.5 h-3.5 mr-1"/>
                      <span>Edit Mappings</span>
                    </Button>
                  </TableCell>
                </TableRow>);
        })}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
};
