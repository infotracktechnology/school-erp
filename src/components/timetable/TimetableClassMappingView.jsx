import React, { useState, useEffect } from 'react';
import { 
  Layers, CheckSquare, Save, RefreshCw, 
  Building2, CheckCircle2, Clock, Check,
  Sparkles, Lock, Unlock, X, AlertTriangle, School
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useErp } from '../../context/ErpContext';
import { timetableService } from '../../services/timetableService';

export const TimetableClassMappingView = ({ showToast }) => {
  const { branches, selectedBranchId, activeAcademicYearId, isSuperAdmin, assignedBranchId } = useErp();
  const effBranch = (!isSuperAdmin && assignedBranchId) ? String(assignedBranchId) : String(selectedBranchId || '1');

  const [branchId, setBranchId] = useState(effBranch);
  const [academicYearId, setAcademicYearId] = useState(String(activeAcademicYearId || '2'));

  const [structures, setStructures] = useState([]);
  const [selectedStructureId, setSelectedStructureId] = useState('');
  const [classesList, setClassesList] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [unassigningId, setUnassigningId] = useState(null);

  // 1. Load Timetable Structures
  const loadStructures = async () => {
    try {
      const res = await timetableService.getStructures(branchId, academicYearId);
      if (res.success && Array.isArray(res.data)) {
        setStructures(res.data);
        if (res.data.length > 0 && !selectedStructureId) {
          setSelectedStructureId(String(res.data[0].id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStructures();
  }, [branchId, academicYearId]);

  // 2. Load Classes for Branch
  useEffect(() => {
    fetch(`/api/classes?branch_id=${branchId}&academic_year_id=${academicYearId}&status=Active`)
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setClassesList(res.data);
        }
      })
      .catch(() => setClassesList([]));
  }, [branchId, academicYearId]);

  // 3. Handle single class toggle (only for unmapped/available classes)
  const handleToggleClass = (classId) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
    );
  };

  // Find if a class is already mapped/frozen in ANY structure
  const getMappedInfoForClass = (classId) => {
    for (const st of structures) {
      if (Array.isArray(st.classes)) {
        const found = st.classes.find(c => Number(c.class_id) === Number(classId));
        if (found) {
          return { structureId: st.id, structureName: st.name };
        }
      }
    }
    return null;
  };

  // Available (unmapped) classes
  const availableClasses = classesList.filter(c => !getMappedInfoForClass(Number(c.id)));

  // Select all available classes
  const handleToggleSelectAllAvailable = (checked) => {
    if (checked) {
      setSelectedClassIds(availableClasses.map(c => Number(c.id)));
    } else {
      setSelectedClassIds([]);
    }
  };

  // Save Mapping (Appends newly selected classes to current structure)
  const handleSaveMapping = async () => {
    if (!selectedStructureId) {
      if (showToast) showToast('Please select a timetable structure', 'error');
      return;
    }
    if (selectedClassIds.length === 0) {
      if (showToast) showToast('Please select at least one class to map', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const current = structures.find(s => String(s.id) === String(selectedStructureId));
      const alreadyMappedIds = (current?.classes || []).map(c => Number(c.class_id));
      const combinedIds = Array.from(new Set([...alreadyMappedIds, ...selectedClassIds]));

      const mappings = combinedIds.map(cId => ({ class_id: cId }));
      const res = await timetableService.saveClassMappings({
        structure_id: Number(selectedStructureId),
        mappings
      });

      if (res.success) {
        if (showToast) showToast('Classes mapped and frozen successfully!', 'success');
        setSelectedClassIds([]);
        await loadStructures();
      } else {
        throw new Error(res.message || 'Failed to save mapping');
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to save mapping', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Unassign / Unlock a class from a structure
  const handleUnassignClass = async (structureId, classId, className) => {
    if (!window.confirm(`Are you sure you want to unassign "${className}" from this timetable schedule? It can then be reassigned to any schedule.`)) {
      return;
    }

    setUnassigningId(classId);
    try {
      const res = await timetableService.unassignClass({
        structure_id: structureId,
        class_id: classId
      });

      if (res.success) {
        if (showToast) showToast(`"${className}" unassigned successfully!`, 'info');
        await loadStructures();
      } else {
        throw new Error(res.message || 'Failed to unassign class');
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to unassign class', 'error');
    } finally {
      setUnassigningId(null);
    }
  };

  const currentStructure = structures.find(s => String(s.id) === String(selectedStructureId));
  const isAllAvailableSelected = availableClasses.length > 0 && availableClasses.every(c => selectedClassIds.includes(Number(c.id)));

  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 mb-1">
            <Layers className="w-3.5 h-3.5 text-zinc-700" />
            <span>Step 2: Class Timetable & Shift Assignment</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Class & Schedule Association</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Assign classes to a bell schedule structure. Once mapped, classes are locked/frozen to prevent accidental changes, with full unassign capability.
          </p>
        </div>
      </div>

      {/* ── Section 1: Map Available Classes ── */}
      <Card>
        <CardHeader className="pb-4 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Select & Map New Classes</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Choose a bell schedule structure and pick available classes to freeze into this schedule.
              </CardDescription>
            </div>

            <Button
              type="button"
              onClick={handleSaveMapping}
              disabled={isSaving || !selectedStructureId || selectedClassIds.length === 0}
              className="space-x-1.5 h-9 font-semibold"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Map & Lock Selected ({selectedClassIds.length})</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Top Filters: Campus & Structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Campus / Branch</label>
              <select
                disabled={!isSuperAdmin && !!assignedBranchId}
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm shadow-2xs outline-none"
              >
                {branches?.map(b => (
                  <option key={b.id} value={b.id}>{b.branch_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Target Timetable Structure</label>
              <select
                value={selectedStructureId}
                onChange={e => setSelectedStructureId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm font-bold text-zinc-900 shadow-2xs outline-none focus:ring-1 focus:ring-zinc-900"
              >
                {structures.length === 0 ? (
                  <option value="">No structures found (Create one in Step 1)</option>
                ) : (
                  structures.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.periods?.length || 0} Periods)
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Quick Structure Info Banner */}
          {currentStructure && (
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-zinc-600" />
                <span className="font-semibold text-zinc-800">Assigning To:</span>
                <span className="font-bold text-zinc-950">{currentStructure.name}</span>
                <Badge variant="outline" className="bg-white text-zinc-700 text-[10px]">
                  {currentStructure.periods?.length || 0} Total Periods
                </Badge>
              </div>
              <div className="text-zinc-500 font-medium">
                Working Days: <strong>{currentStructure.working_days?.join(', ') || 'Mon-Sat'}</strong>
              </div>
            </div>
          )}

          {/* Batch Class Selection Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="select-all-map"
                  disabled={availableClasses.length === 0}
                  checked={isAllAvailableSelected}
                  onChange={e => handleToggleSelectAllAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 cursor-pointer disabled:opacity-40"
                />
                <label htmlFor="select-all-map" className="text-xs font-bold text-zinc-900 cursor-pointer select-none">
                  Select Available Classes to Map
                </label>
              </div>

              <div className="text-xs font-medium text-zinc-500">
                <span className="text-emerald-700 font-bold">{availableClasses.length}</span> available for mapping • <span className="font-bold text-zinc-900">{classesList.length - availableClasses.length}</span> already frozen
              </div>
            </div>

            {classesList.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                No active classes found for this branch.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
                {classesList.map(c => {
                  const mappedInfo = getMappedInfoForClass(Number(c.id));
                  const isFrozen = !!mappedInfo;
                  const isChecked = selectedClassIds.includes(Number(c.id));

                  if (isFrozen) {
                    return (
                      <div
                        key={c.id}
                        title={`Locked in "${mappedInfo.structureName}". Unassign below to change.`}
                        className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-100/80 text-zinc-400 text-xs font-medium cursor-not-allowed select-none opacity-85"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{c.name || c.class_name}</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-200/80 px-1.5 py-0.5 rounded">
                          Frozen
                        </span>
                      </div>
                    );
                  }

                  return (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' 
                          : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <span className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] shrink-0 ${
                          isChecked ? 'bg-white text-zinc-950 font-bold border-white' : 'border-zinc-300 bg-white'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span className="truncate">{c.name || c.class_name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleClass(Number(c.id))}
                        className="hidden"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Section 2: Active Timetable Mappings with Instant Unassign Option ── */}
      <Card>
        <CardHeader className="pb-3 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Currently Active & Frozen Timetable Mappings</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Classes mapped here are locked in their respective timetable schedules. Click <strong>Unassign (✕)</strong> to free any class for timing changes.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-semibold text-xs py-1 px-3 bg-zinc-50 shrink-0">
              {structures.reduce((acc, s) => acc + (s.classes?.length || 0), 0)} Mapped Classes
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          {structures.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              No structures created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {structures.map((st) => {
                const mappedClasses = st.classes || [];

                return (
                  <div 
                    key={st.id} 
                    className="p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                          <School className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900">{st.name}</h4>
                          <p className="text-[11px] text-zinc-500">
                            {st.periods?.length || 0} Periods • {st.working_days?.length || 6} Working Days
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className="bg-zinc-900 text-white text-[11px] px-2.5 py-0.5">
                          {mappedClasses.length} {mappedClasses.length === 1 ? 'Class' : 'Classes'} Linked
                        </Badge>
                      </div>
                    </div>

                    {/* Mapped Classes Badges with Unassign Button */}
                    <div className="pt-3">
                      {mappedClasses.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic">No classes locked into this schedule yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2.5">
                          {mappedClasses.map((cls) => (
                            <div
                              key={cls.id}
                              className="group inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-xs font-semibold shadow-2xs hover:bg-zinc-100 transition-all"
                            >
                              <Lock className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{cls.class_name || `Class ${cls.class_id}`}</span>

                              {/* Unassign button */}
                              <button
                                type="button"
                                disabled={unassigningId === cls.class_id}
                                onClick={() => handleUnassignClass(st.id, cls.class_id, cls.class_name || `Class ${cls.class_id}`)}
                                title="Unassign this class to change schedule or timings"
                                className="ml-1 p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                {unassigningId === cls.class_id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin text-red-500" />
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
