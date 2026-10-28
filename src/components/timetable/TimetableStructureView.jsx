import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Clock, Calendar, Save, RefreshCw, 
  Check, Coffee, BookOpen, Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { useErp } from '../../context/ErpContext';
import { timetableService } from '../../services/timetableService';

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_PERIODS = [
  { period_name: 'Assembly / Zero Hour', period_type: 'assembly', start_time: '08:45', end_time: '09:00' },
  { period_name: 'Period 1', period_type: 'teaching', start_time: '09:00', end_time: '09:45' },
  { period_name: 'Period 2', period_type: 'teaching', start_time: '09:45', end_time: '10:30' },
  { period_name: 'Morning Short Break', period_type: 'break', start_time: '10:30', end_time: '10:45' },
  { period_name: 'Period 3', period_type: 'teaching', start_time: '10:45', end_time: '11:30' },
  { period_name: 'Period 4', period_type: 'teaching', start_time: '11:30', end_time: '12:15' },
  { period_name: 'Lunch Break', period_type: 'break', start_time: '12:15', end_time: '13:00' },
  { period_name: 'Period 5', period_type: 'teaching', start_time: '13:00', end_time: '13:45' },
  { period_name: 'Period 6', period_type: 'teaching', start_time: '13:45', end_time: '14:30' },
  { period_name: 'Period 7', period_type: 'teaching', start_time: '14:30', end_time: '15:15' },
  { period_name: 'Period 8', period_type: 'teaching', start_time: '15:15', end_time: '16:00' }
];

export const TimetableStructureView = ({ showToast, onStructureCreated }) => {
  const { branches, selectedBranchId, activeAcademicYearId, academicYears, isSuperAdmin, assignedBranchId } = useErp();
  const effBranch = (!isSuperAdmin && assignedBranchId) ? String(assignedBranchId) : String(selectedBranchId || '1');

  const [branchId, setBranchId] = useState(effBranch);
  const [academicYearId, setAcademicYearId] = useState(String(activeAcademicYearId || '2'));

  // Form State
  const [structureName, setStructureName] = useState('General School Shift (8 Periods)');
  const [selectedDays, setSelectedDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  const [periods, setPeriods] = useState(DEFAULT_PERIODS);

  const [existingStructures, setExistingStructures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadStructures = async () => {
    setIsLoading(true);
    try {
      const res = await timetableService.getStructures(branchId, academicYearId);
      if (res.success && res.data) {
        setExistingStructures(res.data);
      }
    } catch (err) {
      if (showToast) showToast('Failed to load timetable structures', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStructures();
  }, [branchId, academicYearId]);

  const handleToggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handlePeriodChange = (index, field, value) => {
    setPeriods(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddPeriod = (type = 'teaching') => {
    const teachingCount = periods.filter(p => p.period_type === 'teaching').length;
    setPeriods(prev => [
      ...prev,
      {
        period_name: type === 'break' ? 'Break' : `Period ${teachingCount + 1}`,
        period_type: type,
        start_time: '09:00',
        end_time: '09:45'
      }
    ]);
  };

  const handleRemovePeriod = (index) => {
    setPeriods(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!structureName.trim()) {
      if (showToast) showToast('Please enter a structure name', 'error');
      return;
    }
    if (selectedDays.length === 0) {
      if (showToast) showToast('Please select at least one working day', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        name: structureName.trim(),
        working_days: selectedDays,
        periods
      };

      const res = await timetableService.createStructure(payload);
      if (res.success) {
        if (showToast) showToast('Timetable structure saved successfully!', 'success');
        loadStructures();
        if (onStructureCreated) onStructureCreated();
      } else {
        throw new Error(res.message || 'Failed to save');
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this structure? All periods and mappings will be removed.')) return;
    try {
      const res = await timetableService.deleteStructure(id);
      if (res.success) {
        if (showToast) showToast('Structure deleted successfully', 'success');
        loadStructures();
      }
    } catch (err) {
      if (showToast) showToast('Failed to delete structure', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-zinc-700" />
            <span>Step 1: Timing & Periods Definition</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Timetable Structure Setup</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure working days, period timings, lunch breaks, and school bell schedules.
          </p>
        </div>
      </div>

      {/* Setup Form Card */}
      <Card>
        <CardHeader className="pb-4 border-b border-zinc-100">
          <CardTitle className="text-base">Create Timetable Structure</CardTitle>
          <CardDescription className="text-xs">
            Set up daily bell timings and periods that can be assigned to different class groups.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Campus / Branch</label>
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

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Structure Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Standard 8-Period Shift (Grade 1 to 10)"
                  value={structureName}
                  onChange={e => setStructureName(e.target.value)}
                />
              </div>
            </div>

            {/* Working Days Checkboxes */}
            <div className="space-y-2 p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
              <label className="block text-xs font-bold text-zinc-800">Working Days of the Week</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {WEEKDAYS.map(day => {
                  const isChecked = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs' 
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : ''}{day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Periods & Breaks Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Bell Schedule & Periods</h4>
                  <p className="text-[11px] text-zinc-500">Arrange period timings, assemblies, and recess intervals.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddPeriod('break')}
                    className="space-x-1.5 text-xs font-semibold"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>+ Add Break</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddPeriod('teaching')}
                    className="space-x-1.5 text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Period</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200/80 overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-zinc-50/80">
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="w-56 font-bold text-zinc-900">Period / Break Name</TableHead>
                      <TableHead className="w-36 font-bold text-zinc-900">Type</TableHead>
                      <TableHead className="w-36 font-bold text-zinc-900">Start Time</TableHead>
                      <TableHead className="w-36 font-bold text-zinc-900">End Time</TableHead>
                      <TableHead className="w-16 text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periods.map((p, idx) => {
                      const isBreak = p.period_type === 'break';
                      const isAssembly = p.period_type === 'assembly';
                      return (
                        <TableRow key={idx} className={isBreak ? 'bg-amber-50/30' : isAssembly ? 'bg-blue-50/30' : ''}>
                          <TableCell className="text-center font-mono text-xs text-zinc-400 py-2.5">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <input
                              type="text"
                              value={p.period_name}
                              onChange={e => handlePeriodChange(idx, 'period_name', e.target.value)}
                              className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none"
                            />
                          </TableCell>
                          <TableCell className="py-2.5">
                            <select
                              value={p.period_type}
                              onChange={e => handlePeriodChange(idx, 'period_type', e.target.value)}
                              className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none"
                            >
                              <option value="teaching">Teaching Period</option>
                              <option value="break">Recess / Break</option>
                              <option value="assembly">Assembly / Roll Call</option>
                            </select>
                          </TableCell>
                          <TableCell className="py-2.5">
                            <input
                              type="time"
                              value={p.start_time}
                              onChange={e => handlePeriodChange(idx, 'start_time', e.target.value)}
                              className="h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 shadow-2xs outline-none"
                            />
                          </TableCell>
                          <TableCell className="py-2.5">
                            <input
                              type="time"
                              value={p.end_time}
                              onChange={e => handlePeriodChange(idx, 'end_time', e.target.value)}
                              className="h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 shadow-2xs outline-none"
                            />
                          </TableCell>
                          <TableCell className="text-center py-2.5">
                            <button
                              type="button"
                              onClick={() => handleRemovePeriod(idx)}
                              className="p-1 text-zinc-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title="Delete Period"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100">
              <Button type="submit" disabled={isSaving} className="space-x-1.5">
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Saving Structure...' : 'Save Timetable Structure'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Structures Grid */}
      <Card>
        <CardHeader className="pb-3 border-b border-zinc-100">
          <CardTitle className="text-base">Configured Timetable Structures</CardTitle>
          <CardDescription className="text-xs">Active bell schedules and shift patterns defined for this branch.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="p-10 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-500 font-medium">Loading timetable structures...</p>
            </div>
          ) : existingStructures.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-zinc-200 rounded-xl space-y-2">
              <Clock className="w-8 h-8 text-zinc-300 mx-auto" />
              <h4 className="text-sm font-semibold text-zinc-700">No Timetable Structures Configured</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Fill the form above to establish school bell schedules and periods.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {existingStructures.map(st => (
                <div key={st.id} className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-sm text-zinc-950">{st.name}</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {st.working_days?.join(', ') || 'Mon - Sat'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(st.id)}
                      className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                      title="Delete Structure"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary of periods */}
                  <div className="flex items-center space-x-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                    <span>Total Periods: <strong>{st.periods?.length || 0}</strong></span>
                    <span>•</span>
                    <span>Mapped Classes: <strong>{st.classes?.length || 0}</strong></span>
                  </div>

                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {st.periods?.map((p, i) => (
                      <div key={p.id || i} className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-zinc-50">
                        <span className="font-semibold text-zinc-700">{p.period_name}</span>
                        <span className="text-zinc-400">{p.start_time} - {p.end_time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
