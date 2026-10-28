import React, { useState, useEffect } from 'react';
import { X, Copy, AlertCircle, BookOpen } from 'lucide-react';
import { getClassSubjectsList, copyClassSubjects } from '../../services/api';
export const CopySubjectModal = ({ isOpen, onClose, onSuccess, classes, academicGroups, branchId, academicYearId, defaultSourceClassId, defaultSourceGroupId }) => {
    const [board, setBoard] = useState('CBSE');
    const [sourceClassId, setSourceClassId] = useState(defaultSourceClassId || (classes[0]?.id ?? ''));
    const [sourceGroupId, setSourceGroupId] = useState(defaultSourceGroupId || '');
    const [targetClassId, setTargetClassId] = useState('');
    const [targetGroupId, setTargetGroupId] = useState('');
    // Source subjects for preview & selective copying
    const [sourceSubjects, setSourceSubjects] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [isLoadingSource, setIsLoadingSource] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const sourceClass = classes.find((c) => c.id === Number(sourceClassId));
    const targetClass = classes.find((c) => c.id === Number(targetClassId));
    const isSourceGroupRequired = Boolean(sourceClass?.group_required);
    const isTargetGroupRequired = Boolean(targetClass?.group_required);
    const sourceGroups = academicGroups.filter((g) => !g.class_id || g.class_id === Number(sourceClassId));
    const targetGroups = academicGroups.filter((g) => !g.class_id || g.class_id === Number(targetClassId));
    // Fetch subjects from source whenever source class or group changes
    useEffect(() => {
        if (!isOpen || !sourceClassId)
            return;
        let isMounted = true;
        setIsLoadingSource(true);
        setError(null);
        getClassSubjectsList({
            branch_id: branchId,
            academic_year_id: academicYearId,
            class_id: Number(sourceClassId),
            group_id: sourceGroupId ? Number(sourceGroupId) : undefined,
            status: 'Active'
        })
            .then((items) => {
            if (isMounted) {
                setSourceSubjects(items);
                setSelectedSubjectIds(items.map((s) => s.id));
                setIsLoadingSource(false);
            }
        })
            .catch((err) => {
            if (isMounted) {
                setError(err.message || 'Failed to load source subjects');
                setIsLoadingSource(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [isOpen, sourceClassId, sourceGroupId, branchId, academicYearId]);
    if (!isOpen)
        return null;
    const toggleSelectAll = () => {
        if (selectedSubjectIds.length === sourceSubjects.length) {
            setSelectedSubjectIds([]);
        }
        else {
            setSelectedSubjectIds(sourceSubjects.map((s) => s.id));
        }
    };
    const toggleSubject = (id) => {
        setSelectedSubjectIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    };
    const handleCopy = async () => {
        if (!sourceClassId) {
            setError('Please choose a Source Class.');
            return;
        }
        if (!targetClassId) {
            setError('Please choose a Target Class.');
            return;
        }
        if (sourceClassId === targetClassId && (!sourceGroupId || sourceGroupId === targetGroupId)) {
            setError('Source and Target classes & streams cannot be identical.');
            return;
        }
        if (isTargetGroupRequired && !targetGroupId) {
            setError(`Target class "${targetClass?.name}" requires a Group / Stream selection.`);
            return;
        }
        if (selectedSubjectIds.length === 0) {
            setError('Please select at least one subject to copy.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = {
                branch_id: branchId,
                academic_year_id: academicYearId,
                board,
                source_class_id: Number(sourceClassId),
                source_group_id: sourceGroupId ? Number(sourceGroupId) : null,
                target_class_id: Number(targetClassId),
                target_group_id: targetGroupId ? Number(targetGroupId) : null,
                selected_ids: selectedSubjectIds
            };
            const res = await copyClassSubjects(payload);
            onSuccess(res.message);
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to copy subjects.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Copy className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Copy Subjects Across Classes / Groups
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Replicate an entire curriculum or selected subjects to another class/stream
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (<div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
              <span>{error}</span>
            </div>)}

          {/* Source & Target Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SOURCE BOX */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Source (Copy From)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Source Class <span className="text-red-500">*</span>
                </label>
                <select value={sourceClassId} onChange={(e) => {
            setSourceClassId(e.target.value ? Number(e.target.value) : '');
            setSourceGroupId('');
        }} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer">
                  <option value="">Select Class...</option>
                  {classes.map((c) => (<option key={c.id} value={c.id}>
                      {c.name} {c.group_required ? ' (Stream Req.)' : ''}
                    </option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Source Group / Stream {isSourceGroupRequired && <span className="text-red-500">*</span>}
                </label>
                <select value={sourceGroupId} onChange={(e) => setSourceGroupId(e.target.value ? Number(e.target.value) : '')} disabled={!sourceClassId} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer disabled:opacity-50">
                  <option value="">{isSourceGroupRequired ? 'Select Stream...' : 'All Streams / Common'}</option>
                  {sourceGroups.map((g) => (<option key={g.id} value={g.id}>
                      {g.name} ({g.code})
                    </option>))}
                </select>
              </div>
            </div>

            {/* TARGET BOX */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Target (Paste To)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Class <span className="text-red-500">*</span>
                </label>
                <select value={targetClassId} onChange={(e) => {
            setTargetClassId(e.target.value ? Number(e.target.value) : '');
            setTargetGroupId('');
        }} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer">
                  <option value="">Select Target Class...</option>
                  {classes.map((c) => (<option key={c.id} value={c.id}>
                      {c.name} {c.group_required ? ' (Stream Req.)' : ''}
                    </option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Group / Stream {isTargetGroupRequired && <span className="text-red-500">*</span>}
                </label>
                <select value={targetGroupId} onChange={(e) => setTargetGroupId(e.target.value ? Number(e.target.value) : '')} disabled={!targetClassId} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer disabled:opacity-50">
                  <option value="">{isTargetGroupRequired ? 'Select Mandatory Stream...' : 'None / Common'}</option>
                  {targetGroups.map((g) => (<option key={g.id} value={g.id}>
                      {g.name} ({g.code})
                    </option>))}
                </select>
              </div>
            </div>
          </div>

          {/* SOURCE SUBJECTS SELECTION LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-700"/>
                <span>Select Subjects to Replicate ({selectedSubjectIds.length}/{sourceSubjects.length})</span>
              </div>
              {sourceSubjects.length > 0 && (<button type="button" onClick={toggleSelectAll} className="text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer">
                  {selectedSubjectIds.length === sourceSubjects.length ? 'Deselect All' : 'Select All'}
                </button>)}
            </div>

            {isLoadingSource ? (<div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <div className="animate-spin w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full mx-auto mb-2"/>
                <span className="text-xs text-slate-500">Loading source subjects...</span>
              </div>) : sourceSubjects.length === 0 ? (<div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                No active subjects found in the selected source class/group.
              </div>) : (<div className="divide-y divide-slate-100 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                {sourceSubjects.map((sub) => {
                const isChecked = selectedSubjectIds.includes(sub.id);
                return (<label key={sub.id} className={`flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${isChecked ? 'bg-emerald-50/40' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" checked={isChecked} onChange={() => toggleSubject(sub.id)} className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300"/>
                        <div>
                          <div className="font-bold text-slate-900">{sub.subject_name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {sub.subject_code} • {sub.category_name} • {sub.requirement}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {sub.weekly_periods} Periods/wk
                      </span>
                    </label>);
            })}
              </div>)}
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            Note: Subject codes and configurations will be copied cleanly. Any subject already existing in the target class with the identical code will be safely preserved without overwriting.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={handleCopy} disabled={isSubmitting || selectedSubjectIds.length === 0} className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5">
            <Copy className="w-4 h-4"/>
            <span>{isSubmitting ? 'Copying...' : `Copy ${selectedSubjectIds.length} Subjects`}</span>
          </button>
        </div>
      </div>
    </div>);
};
