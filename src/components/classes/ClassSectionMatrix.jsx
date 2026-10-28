import React from 'react';
import { Check, Layers, AlertCircle, Lock } from 'lucide-react';

export const ClassSectionMatrix = ({ classes, sections, matrixState, onToggleCell, onSelectAllForRow, onClearRow, initialMatrixState, onToggleEnable, isReadOnly = false }) => {
    if (classes.length === 0 || sections.length === 0) {
        return (<div className="bg-white border border-slate-200/90 rounded-xl p-10 text-center shadow-xs">
        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2"/>
        <h4 className="text-sm font-bold text-slate-800">Cannot Render Mapping Matrix</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          You need at least one class and one section defined in this branch & academic year to configure section mappings.
        </p>
      </div>);
    }
    return (<div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-800"/>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Interactive Class-Section Allocation Matrix
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">
            ({classes.length} Classes × {sections.length} Sections)
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Check a cell to attach an active section to a class. Sections with enrolled students are locked and cannot be detached.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 min-w-[200px]">Class / Grade</th>
              <th className="py-3 px-3 text-center min-w-[120px]">Row Quick Actions</th>
              {sections.map((sec) => (<th key={sec.id} className="py-3 px-3 text-center min-w-[90px]">
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs mb-0.5">
                      {sec.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal lowercase">{sec.code}</span>
                  </div>
                </th>))}
              <th className="py-3 px-4 text-center min-w-[110px]">Assigned Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {classes.map((cls) => {
            const mappedSecIds = matrixState[cls.id] || [];
            const initialSecIds = initialMatrixState[cls.id] || [];
            const lockedSecIds = cls.locked_section_ids || [];
            const isModified = mappedSecIds.length !== initialSecIds.length ||
                mappedSecIds.some((id) => !initialSecIds.includes(id));
            const allChecked = sections.length > 0 && sections.every((s) => mappedSecIds.includes(s.id));
            const allMappedAreLocked = mappedSecIds.length > 0 && mappedSecIds.every((id) => lockedSecIds.includes(id));
            
            const isDisabled = cls.is_enabled === false;

            return (<tr key={cls.id} className={`transition-colors border-b border-slate-100 ${isDisabled ? 'bg-slate-100/60' : isModified ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/80'}`}>
                  {/* Class Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center border ${isDisabled ? 'bg-slate-200 text-slate-400 border-slate-300' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {cls.display_order}
                      </span>
                      <div className="flex-1">
                        <div className={`font-bold flex items-center space-x-1.5 flex-wrap gap-y-0.5 ${isDisabled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          <span>{cls.name}</span>
                          {!isDisabled && cls.is_locked && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs no-underline" title={`${cls.student_count} student(s) currently enrolled in this class`}>
                              <Lock className="w-2.5 h-2.5 mr-1 text-amber-700 shrink-0" />
                              {cls.student_count} Students
                            </span>
                          )}
                          {isDisabled && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.2 rounded border border-slate-300 no-underline" style={{textDecoration:'none'}}>
                              Disabled
                            </span>
                          )}
                          {!isDisabled && isModified && (<span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-sm border border-amber-200">Modified</span>)}
                        </div>
                        <span className={`text-[11px] font-mono ${isDisabled ? 'text-slate-300' : 'text-slate-400'}`}>{cls.code}</span>
                      </div>
                      {/* Enable/Disable toggle switch */}
                      <button
                        type="button"
                        disabled={cls.is_locked || isReadOnly}
                        onClick={() => onToggleEnable && onToggleEnable(cls.id, cls.is_enabled)}
                        title={cls.is_locked ? `Locked: ${cls.student_count} student(s) assigned` : isReadOnly ? 'Read-only mode' : (isDisabled ? 'Click to enable this class' : 'Click to disable this class')}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none ${cls.is_locked || isReadOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${isDisabled ? 'bg-slate-300 border-slate-400' : 'bg-emerald-600 border-emerald-700'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${isDisabled ? 'translate-x-0.5' : 'translate-x-3.5'}`} />
                      </button>
                    </div>
                  </td>

                  {/* Row Quick Action Buttons — blocked when disabled */}
                  <td className="py-3 px-3 text-center">
                    <div className={`inline-flex items-center space-x-1 p-0.5 rounded-lg border ${isDisabled ? 'bg-slate-100 border-slate-200 opacity-30 pointer-events-none' : 'bg-slate-100 border-slate-200'}`}>
                      <button type="button" onClick={() => onSelectAllForRow(cls.id)} disabled={allChecked || isReadOnly || isDisabled} className="px-2 py-1 text-[11px] font-bold rounded-md text-slate-700 hover:text-emerald-900 hover:bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" title={isReadOnly ? 'Read-only mode' : 'Check all sections for this class'}>
                        All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => onClearRow(cls.id)}
                        disabled={mappedSecIds.length === 0 || allMappedAreLocked || isReadOnly || isDisabled}
                        className="px-2 py-1 text-[11px] font-bold rounded-md text-slate-700 hover:text-red-700 hover:bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title={isReadOnly ? 'Read-only mode' : allMappedAreLocked ? 'Cannot unmap: All mapped sections have enrolled students' : 'Uncheck unlocked sections for this class'}
                      >
                        None
                      </button>
                    </div>
                  </td>

                  {/* Matrix Checkbox Cells — show as blocked when class is disabled */}
                  {sections.map((sec) => {
                    const isChecked = mappedSecIds.includes(sec.id);
                    const wasInitiallyChecked = initialSecIds.includes(sec.id);
                    const cellModified = isChecked !== wasInitiallyChecked;
                    const studentCount = (cls.section_students && (cls.section_students[sec.id] || cls.section_students[sec.name])) || 0;
                    const isCellLocked = isChecked && studentCount > 0;

                    if (isDisabled) {
                      return (
                        <td key={sec.id} className="py-3 px-3 text-center bg-slate-100/60" title="Class is disabled for this academic year">
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 rounded-md bg-slate-200 border border-slate-300 flex items-center justify-center">
                              <span className="w-3 h-0.5 bg-slate-300 rounded" />
                            </div>
                          </div>
                        </td>
                      );
                    }

                    return (<td
                        key={sec.id}
                        onClick={() => {
                          if (!isReadOnly && !isCellLocked) {
                            onToggleCell(cls.id, sec.id);
                          }
                        }}
                        className={`py-3 px-3 text-center transition-colors ${
                          isReadOnly || isCellLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                        } ${cellModified ? 'bg-amber-100/30' : ''} ${isCellLocked ? 'bg-amber-50/50' : ''}`}
                        title={isCellLocked ? `Locked: ${studentCount} student(s) enrolled in Section ${sec.name} of ${cls.name}. Cannot be unmapped.` : undefined}
                      >
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            disabled={isReadOnly || isCellLocked}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isReadOnly && !isCellLocked) {
                                onToggleCell(cls.id, sec.id);
                              }
                            }}
                            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                              isReadOnly || isCellLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                            } ${
                              isChecked
                                ? isCellLocked
                                  ? 'bg-emerald-800 border-emerald-900 text-white shadow-2xs'
                                  : 'bg-emerald-700 border-emerald-800 text-white shadow-2xs'
                                : 'bg-white border-slate-300 hover:border-emerald-600'
                            }`}
                            aria-label={`Toggle Section ${sec.name} for ${cls.name}`}
                          >
                            {isChecked && (
                              isCellLocked ? (
                                <div className="flex items-center justify-center relative">
                                  <Check className="w-3.5 h-3.5 stroke-[3]"/>
                                  <Lock className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1.5" />
                                </div>
                              ) : (
                                <Check className="w-4 h-4 stroke-[3]"/>
                              )
                            )}
                          </button>
                        </div>
                      </td>);
                })}

                  {/* Assigned Section Total Count */}
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${mappedSecIds.length > 0
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      {mappedSecIds.length} {mappedSecIds.length === 1 ? 'Section' : 'Sections'}
                    </span>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </div>);
};
