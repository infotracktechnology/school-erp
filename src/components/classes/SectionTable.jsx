import React from 'react';
import { Eye, Edit3, Power, CheckCircle2, XCircle } from 'lucide-react';
export const SectionTable = ({ sections, onView, onEdit, onToggleStatus, isReadOnly = false }) => {
    return (<div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Section Code</th>
              <th className="py-3.5 px-4">Section Name</th>
              <th className="py-3.5 px-4">Short Name</th>
              <th className="py-3.5 px-4">Mapped Classes</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {sections.map((sec) => {
            const isActive = sec.status === 'Active';
            return (<tr key={sec.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Section Code */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                    <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold">
                      {sec.code}
                    </span>
                  </td>

                  {/* Section Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                        {sec.name}
                      </span>
                      <span>Section {sec.name}</span>
                    </div>
                  </td>

                  {/* Short Name */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {sec.short_name ? (<span className="font-medium">{sec.short_name}</span>) : (<span className="text-slate-400 italic">—</span>)}
                  </td>

                  {/* Mapped Classes */}
                  <td className="py-3.5 px-4">
                    {sec.classes ? (<div className="flex flex-wrap items-center gap-1.5 max-w-md">
                        {sec.classes.split(', ').map((cls, idx) => (<span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {cls}
                          </span>))}
                      </div>) : (<span className="text-xs text-slate-400 italic">Not mapped to any class yet</span>)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {isActive ? (<CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600"/>) : (<XCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>)}
                      {sec.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
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
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </div>);
};
