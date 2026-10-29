import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, BookOpen, Save, 
  RefreshCw, X, Plus, AlertTriangle, Check, Layers,
  DoorOpen, Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useErp } from '../../context/ErpContext';
import { timetableService } from '../../services/timetableService';
import { SearchableSubjectSelect } from './SearchableSubjectSelect';

export const TimetableSlotAllocationView = ({ showToast }) => {
  const { branches, selectedBranchId, activeAcademicYearId, academicYears, isSuperAdmin, assignedBranchId } = useErp();
  const effBranch = (!isSuperAdmin && assignedBranchId) ? String(assignedBranchId) : String(selectedBranchId || '1');

  const [branchId, setBranchId] = useState(effBranch);
  const [academicYearId, setAcademicYearId] = useState(String(activeAcademicYearId || '2'));

  const [classesList, setClassesList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');

  // Grid Data
  const [structure, setStructure] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectMappings, setSubjectMappings] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [slots, setSlots] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null); // { period_id, day_of_week, period_name, subject_id, teacher_id, room_name }
  const [isSavingSlot, setIsSavingSlot] = useState(false);

  // 1. Load Classes & Sections
  const [sectionsList, setSectionsList] = useState([]);

  useEffect(() => {
    fetch(`/api/classes?branch_id=${branchId}&academic_year_id=${academicYearId}&status=Active`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setClassesList(res.data);
          if (res.data.length > 0 && !selectedClassId) {
            setSelectedClassId(String(res.data[0].id));
          }
        }
      });
  }, [branchId, academicYearId]);

  // Load Sections for selected Class
  useEffect(() => {
    if (!selectedClassId) return;
    fetch(`/api/sections?class_id=${selectedClassId}&branch_id=${branchId}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSectionsList(res.data);
          // Set first section as default if not currently set or if set to 'all'
          setSelectedSection(prev => {
            const exists = res.data.some(s => String(s.id) === String(prev));
            return exists ? prev : String(res.data[0].id);
          });
        } else {
          setSectionsList([]);
          setSelectedSection('all');
        }
      })
      .catch(() => {
        setSectionsList([]);
        setSelectedSection('all');
      });
  }, [selectedClassId, branchId]);

  // 2. Load Weekly Grid for Selected Class & Section
  const loadGrid = async () => {
    if (!selectedClassId) return;
    setIsLoading(true);
    try {
      const res = await timetableService.getWeeklyTimetable({
        branch_id: branchId,
        academic_year_id: academicYearId,
        class_id: selectedClassId,
        section_id: selectedSection
      });

      if (res.success && res.data) {
        setStructure(res.data.structure);
        setPeriods(res.data.periods || []);
        setSubjects(res.data.subjects || []);
        setSubjectMappings(res.data.subjectMappings || []);
        setTeachers(res.data.teachers || []);
        setSlots(res.data.slots || []);
      }
    } catch (err) {
      if (showToast) showToast('Failed to load weekly timetable', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGrid();
  }, [selectedClassId, selectedSection, branchId, academicYearId]);

  // Open Edit Slot Modal
  const handleOpenEditSlot = (period, day) => {
    if (period.period_type === 'break' || period.period_type === 'assembly') return;

    // Find existing slot
    const existing = slots.find(s => s.period_id === period.id && s.day_of_week === day) || {};
    
    // Default subject if slot is empty
    const defaultSubjectId = existing.subject_id 
      ? String(existing.subject_id) 
      : (subjects[0]?.id ? String(subjects[0].id) : '');

    // Check if there is a mapped teacher or room from Step 2 mapping
    const mapping = subjectMappings.find(m => String(m.subject_id) === String(defaultSubjectId));

    const defaultTeacherId = existing.teacher_id 
      ? String(existing.teacher_id) 
      : (mapping?.teacher_id ? String(mapping.teacher_id) : (teachers[0]?.id ? String(teachers[0].id) : ''));

    const defaultRoom = existing.room_name || mapping?.preferred_room || '';

    setEditingSlot({
      period_id: period.id,
      period_name: period.period_name,
      start_time: period.start_time,
      end_time: period.end_time,
      day_of_week: day,
      subject_id: defaultSubjectId,
      teacher_id: defaultTeacherId,
      room_name: defaultRoom
    });
  };

  // When subject changes in the modal, auto-fill teacher and room from step 2 if not customized
  const handleSubjectChangeInSlot = (newSubId) => {
    const mapping = subjectMappings.find(m => String(m.subject_id) === String(newSubId));
    setEditingSlot(prev => ({
      ...prev,
      subject_id: newSubId,
      teacher_id: mapping?.teacher_id ? String(mapping.teacher_id) : prev.teacher_id,
      room_name: mapping?.preferred_room ? mapping.preferred_room : prev.room_name
    }));
  };

  // Save / Update Slot
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    // Auto-pull teacher_id mapped to this subject if any exists in Step 2 mappings
    const mapping = subjectMappings.find(m => String(m.subject_id) === String(editingSlot.subject_id));
    const teacherIdToSave = editingSlot.teacher_id || mapping?.teacher_id || null;
    const roomToSave = editingSlot.room_name || mapping?.preferred_room || null;

    setIsSavingSlot(true);
    try {
      const res = await timetableService.saveSlot({
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        class_id: Number(selectedClassId),
        section_id: selectedSection === 'all' ? null : selectedSection,
        period_id: editingSlot.period_id,
        day_of_week: editingSlot.day_of_week,
        subject_id: editingSlot.subject_id ? Number(editingSlot.subject_id) : null,
        teacher_id: teacherIdToSave ? Number(teacherIdToSave) : null,
        room_name: roomToSave || null
      });

      if (res.success) {
        if (showToast) showToast('Timetable slot saved successfully!', 'success');
        setEditingSlot(null);
        loadGrid();
      } else {
        throw new Error(res.message || 'Failed to save slot');
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setIsSavingSlot(false);
    }
  };

  // Clear Slot
  const handleClearSlot = async () => {
    if (!editingSlot) return;
    setIsSavingSlot(true);
    try {
      const res = await timetableService.clearSlot({
        class_id: Number(selectedClassId),
        section_id: selectedSection === 'all' ? null : selectedSection,
        period_id: editingSlot.period_id,
        day_of_week: editingSlot.day_of_week
      });
      if (res.success) {
        if (showToast) showToast('Slot cleared', 'info');
        setEditingSlot(null);
        loadGrid();
      }
    } catch (err) {
      if (showToast) showToast('Failed to clear slot', 'error');
    } finally {
      setIsSavingSlot(false);
    }
  };

  // Direct in-cell subject change
  const handleQuickSubjectChange = async (period, day, subjectId) => {
    if (!subjectId) {
      // Clear slot if empty selected
      try {
        const res = await timetableService.clearSlot({
          class_id: Number(selectedClassId),
          section_id: selectedSection === 'all' ? null : selectedSection,
          period_id: period.id,
          day_of_week: day
        });
        if (res.success) {
          if (showToast) showToast('Slot cleared', 'info');
          loadGrid();
        }
      } catch (err) {
        if (showToast) showToast('Failed to clear slot', 'error');
      }
      return;
    }

    const mapping = subjectMappings.find(m => String(m.subject_id) === String(subjectId));
    try {
      const res = await timetableService.saveSlot({
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        class_id: Number(selectedClassId),
        section_id: selectedSection === 'all' ? null : selectedSection,
        period_id: period.id,
        day_of_week: day,
        subject_id: Number(subjectId),
        teacher_id: mapping?.teacher_id || null,
        room_name: mapping?.preferred_room || null
      });

      if (res.success) {
        if (showToast) showToast('Subject mapped successfully!', 'success');
        loadGrid();
      } else {
        if (showToast) showToast(res.message || 'Failed to save slot', 'error');
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  const workingDays = structure?.working_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-zinc-700" />
            <span>Step 3: Subject & Teacher Weekly Allocation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Subject & Teacher Timetable Grid</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Assign subjects and faculty to individual period slots with automated teacher clash & conflict prevention.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Campus / Branch</label>
              <select
                disabled={!isSuperAdmin && !!assignedBranchId}
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
              >
                {branches?.map(b => (
                  <option key={b.id} value={b.id}>{b.branch_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Select Class</label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm font-semibold text-zinc-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
              >
                {classesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name || c.class_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm font-semibold text-zinc-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
              >
                <option value="all">All Sections / Unified</option>
                {sectionsList.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.section_name || sec.name || sec.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <div className="text-[11px] font-medium text-zinc-500 bg-zinc-50 p-2 rounded-lg border border-zinc-200/80">
                <span>Structure: <strong>{structure?.name || 'Not mapped yet'}</strong></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Weekly Matrix Grid */}
      <Card>
        <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Weekly Class Timetable</CardTitle>
            <CardDescription className="text-xs">
              Click any period slot to assign or update the subject, teacher, and room.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadGrid} className="space-x-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
        </CardHeader>

        <CardContent className="pt-4 p-0">
          {isLoading ? (
            <div className="p-16 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-500 font-medium">Loading weekly schedule...</p>
            </div>
          ) : !structure || periods.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <Calendar className="w-10 h-10 text-zinc-300 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-800">No Timetable Structure Mapped</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Please assign a Timetable Structure to this class in <strong>Step 2 (Class Mapping)</strong> first.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[420px] pb-32">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4 w-28 border-r border-zinc-200">Day / Period</th>
                    {periods.map(p => {
                      const isBreak = p.period_type === 'break';
                      const isAssembly = p.period_type === 'assembly';
                      return (
                        <th 
                          key={p.id} 
                          className={`py-2 px-3 text-center border-r border-zinc-200 min-w-[120px] ${
                            isBreak ? 'bg-amber-50/70 text-amber-900' : isAssembly ? 'bg-blue-50/70 text-blue-900' : ''
                          }`}
                        >
                          <div className="font-extrabold">{p.period_name}</div>
                          <div className="text-[9px] font-normal text-zinc-500">{p.start_time} - {p.end_time}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80">
                  {workingDays.map(day => (
                    <tr key={day} className="hover:bg-zinc-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-900 bg-zinc-50/60 border-r border-zinc-200">
                        {day}
                      </td>

                      {periods.map(period => {
                        const isBreak = period.period_type === 'break';
                        const isAssembly = period.period_type === 'assembly';

                        if (isBreak || isAssembly) {
                          return (
                            <td key={period.id} className="py-3 px-2 text-center border-r border-zinc-100 bg-zinc-50/50">
                              <span className="text-[10px] font-bold uppercase text-zinc-400">
                                {isBreak ? '☕ Recess' : '🔔 Assembly'}
                              </span>
                            </td>
                          );
                        }

                        // Teaching Period: Find assigned slot
                        const slot = slots.find(s => s.period_id === period.id && s.day_of_week === day);

                        return (
                          <td 
                            key={period.id} 
                            className="py-1.5 px-1.5 text-center border-r border-zinc-100 min-w-[140px]"
                          >
                            <SearchableSubjectSelect
                              subjects={subjects}
                              value={slot?.subject_id ? String(slot.subject_id) : ''}
                              onChange={(subId) => handleQuickSubjectChange(period, day, subId)}
                              placeholder="+ Select Subject"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Assign / Edit Period Slot */}
      <Dialog open={Boolean(editingSlot)} onOpenChange={(open) => { if (!open) setEditingSlot(null); }}>
        {editingSlot && (
          <DialogContent className="max-w-md p-6 border border-slate-200">
            <DialogHeader className="pb-2 border-b border-slate-100">
              <DialogTitle className="text-sm font-bold text-slate-900">Assign Slot: {editingSlot.period_name}</DialogTitle>
              <p className="text-[11px] text-slate-500">{editingSlot.day_of_week} ({editingSlot.start_time} - {editingSlot.end_time})</p>
            </DialogHeader>

            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
              {/* Subject */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <select
                  required
                  value={editingSlot.subject_id}
                  onChange={e => handleSubjectChangeInSlot(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.subject_name} {s.subject_code ? `(${s.subject_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleClearSlot}
                  disabled={isSavingSlot}
                >
                  Clear Slot
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSlot(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                    disabled={isSavingSlot}
                  >
                    {isSavingSlot ? 'Saving...' : 'Save Slot'}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
