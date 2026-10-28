import React, { useState, useEffect } from 'react';
import { X, Layers, Check, AlertCircle, Lock } from 'lucide-react';

export const ClassSectionEditModal = ({ isOpen, onClose, targetClassSummary, availableSections, onSave, branchName, academicYearName }) => {
    const [selectedSectionIds, setSelectedSectionIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const lockedSectionIds = targetClassSummary?.locked_section_ids || [];

    useEffect(() => {
        if (targetClassSummary) {
            setSelectedSectionIds([...targetClassSummary.section_ids]);
        }
        else {
            setSelectedSectionIds([]);
        }
        setError(null);
    }, [targetClassSummary, isOpen]);

    if (!isOpen || !targetClassSummary)
        return null;

    const toggleSection = (id) => {
        // If section is locked (has students), prevent deselection
        if (lockedSectionIds.includes(id) && selectedSectionIds.includes(id)) {
            return;
        }
        setSelectedSectionIds((prev) => prev.includes(id) ? prev.filter((secId) => secId !== id) : [...prev, id]);
    };

    const handleSelectAll = () => {
        setSelectedSectionIds(availableSections.map((s) => s.id));
    };

    const handleClearAll = () => {
        // Keep locked sections selected
        setSelectedSectionIds(lockedSectionIds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await onSave(targetClassSummary.class_id, selectedSectionIds);
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to update sections for class.');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-5 h-5"/>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Map Sections for {targetClassSummary.class_name}
                </h3>
                {targetClassSummary.is_locked && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Lock className="w-2.5 h-2.5 mr-0.5 text-amber-700" />
                    {targetClassSummary.student_count} Students
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {branchName} • {academicYearName}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Error */}
        {error && (<div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
            <span>{error}</span>
          </div>)}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Available Active Sections ({availableSections.length})
            </label>
            <div className="flex items-center space-x-2">
              <button type="button" onClick={handleSelectAll} className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 cursor-pointer">
                Select All
              </button>
              <button 
                type="button" 
                onClick={handleClearAll} 
                disabled={selectedSectionIds.length === 0 || (lockedSectionIds.length > 0 && selectedSectionIds.every(id => lockedSectionIds.includes(id)))}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={lockedSectionIds.length > 0 ? "Clears all unlocked sections. Locked sections with students will remain." : "Clear all sections"}
              >
                Clear Unlocked
              </button>
            </div>
          </div>

          {availableSections.length === 0 ? (<div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              No active sections exist for this branch & academic year.
            </div>) : (<div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
              {availableSections.map((sec) => {
                const isSelected = selectedSectionIds.includes(sec.id);
                const studentCount = (targetClassSummary.section_students && (targetClassSummary.section_students[sec.id] || targetClassSummary.section_students[sec.name])) || 0;
                const isSectionLocked = isSelected && studentCount > 0;

                return (<button 
                    key={sec.id} 
                    type="button" 
                    onClick={() => toggleSection(sec.id)} 
                    disabled={isSectionLocked}
                    title={isSectionLocked ? `Locked: ${studentCount} student(s) enrolled in this section. Cannot be unmapped.` : undefined}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSectionLocked
                        ? 'bg-amber-50/70 border-amber-300 text-slate-800 cursor-not-allowed shadow-2xs'
                        : isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs cursor-pointer'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold flex items-center space-x-1.5">
                        <span>Section {sec.name}</span>
                        {isSectionLocked && <Lock className="w-3 h-3 text-amber-600" />}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{sec.code}</div>
                      {isSectionLocked && (
                        <div className="text-[10px] font-bold text-amber-800 mt-1">
                          {studentCount} student(s) enrolled
                        </div>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected
                        ? isSectionLocked
                          ? 'bg-emerald-800 border-emerald-900 text-white'
                          : 'bg-emerald-700 border-emerald-800 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]"/>}
                    </div>
                  </button>);
            })}
            </div>)}

          {/* Selection summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Allocated Count:</span>
            <span className="font-bold text-slate-900">
              {selectedSectionIds.length} {selectedSectionIds.length === 1 ? 'Section' : 'Sections'}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || availableSections.length === 0} className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Saving...' : 'Save Mappings'}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
