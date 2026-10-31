import React from 'react';
import { Eye, Edit3, Power, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';

export const SectionTable = ({ sections = [], onView, onEdit, onToggleStatus, isReadOnly = false }) => {
    const displaySections = React.useMemo(() => {
      const map = new Map();
      (sections || []).forEach((sec) => {
        const key = (sec.section_name || sec.name || '').trim();
        if (!key) {
          map.set(`sec-${sec.id}`, sec);
          return;
        }
        if (!map.has(key)) {
          map.set(key, {
            ...sec,
            code: sec.code || `SEC-${key}`,
            mappedClasses: sec.classes 
              ? sec.classes.split(', ').map(c => c.trim()) 
              : (sec.class_name ? [sec.class_name] : [])
          });
        } else {
          const existing = map.get(key);
          const newClasses = sec.classes 
            ? sec.classes.split(', ').map(c => c.trim()) 
            : (sec.class_name ? [sec.class_name] : []);
          for (const cls of newClasses) {
            if (cls && !existing.mappedClasses.includes(cls)) {
              existing.mappedClasses.push(cls);
            }
          }
        }
      });

      return Array.from(map.values()).map(sec => ({
        ...sec,
        classes: sec.mappedClasses && sec.mappedClasses.length > 0 ? sec.mappedClasses.join(', ') : (sec.classes || '')
      }));
    }, [sections]);

    return (
      <Card className="shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left text-xs sm:text-sm">
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <TableHead className="py-3.5 px-4">Section Code</TableHead>
                <TableHead className="py-3.5 px-4">Section Name</TableHead>
                <TableHead className="py-3.5 px-4">Short Name</TableHead>
                <TableHead className="py-3.5 px-4">Mapped Classes</TableHead>
                <TableHead className="py-3.5 px-4">Status</TableHead>
                <TableHead className="py-3.5 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-medium text-slate-700">
              {displaySections.map((sec) => {
              const isActive = sec.status === 'Active';
              return (
                <TableRow key={sec.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Section Code */}
                  <TableCell className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                    <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold">
                      {sec.code}
                    </span>
                  </TableCell>

                  {/* Section Name */}
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                        {sec.name}
                      </span>
                      <span>Section {sec.name}</span>
                    </div>
                  </TableCell>

                  {/* Short Name */}
                  <TableCell className="py-3.5 px-4 text-slate-600">
                    {sec.short_name ? (<span className="font-medium">{sec.short_name}</span>) : (<span className="text-slate-400 italic">—</span>)}
                  </TableCell>

                  {/* Mapped Classes */}
                  <TableCell className="py-3.5 px-4">
                    {sec.classes ? (<div className="flex flex-wrap items-center gap-1.5 max-w-md">
                        {sec.classes.split(', ').map((cls, idx) => (<Badge key={idx} variant="outline" className="text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {cls}
                          </Badge>))}
                      </div>) : (<span className="text-xs text-slate-400 italic">Not mapped to any class yet</span>)}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5 px-4">
                    <Badge className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}>
                      {isActive ? (<CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600"/>) : (<XCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>)}
                      {sec.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      <button type="button" onClick={() => onView(sec)} className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="View Section Details">
                        <Eye className="w-4 h-4"/>
                      </button>

                      <button type="button" onClick={() => onEdit(sec)} disabled={isReadOnly} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isReadOnly
                    ? 'text-slate-300 cursor-not-allowed opacity-60'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'}`} title={isReadOnly ? 'Read-only: Historical Academic Year' : 'Edit Section'}>
                        <Edit3 className="w-4 h-4"/>
                      </button>

                      <button type="button" onClick={() => onToggleStatus(sec)} disabled={isReadOnly} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isReadOnly
                    ? 'text-slate-300 cursor-not-allowed opacity-60'
                    : isActive
                        ? 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                        : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'}`} title={isReadOnly ? 'Read-only: Historical Academic Year' : isActive ? 'Deactivate Section' : 'Activate Section'}>
                        <Power className="w-4 h-4"/>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>);
        })}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
};
