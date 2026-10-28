import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, Trash2, Calendar, Check, Save, 
  RefreshCw, CheckSquare, Sparkles, Building2, BookOpen
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { useErp } from '../../context/ErpContext';
import { examTermService } from '../../services/examTermService';

const DEFAULT_TERMS = [
  { is_selected: true, term_name: 'TERM-I', from_date: '2026-10-23', to_date: '2026-10-23', weightage_percent: 100, display_name: 'TERM-I' },
  { is_selected: true, term_name: 'TERM-II', from_date: '2026-10-23', to_date: '2026-10-23', weightage_percent: 100, display_name: 'TERM-II' },
  { is_selected: true, term_name: 'TERM-III', from_date: '2026-10-23', to_date: '2026-10-23', weightage_percent: 100, display_name: 'TERM-III' },
  { is_selected: true, term_name: 'Consolidated Report', from_date: '2026-10-23', to_date: '2026-10-23', weightage_percent: 100, display_name: 'Consolidated Report' }
];

export const TermStructureSetupView = ({ showToast }) => {
  const { branches, selectedBranchId, activeAcademicYearId, academicYears, isSuperAdmin, assignedBranchId } = useErp();
  const effBranch = (!isSuperAdmin && assignedBranchId) ? String(assignedBranchId) : String(selectedBranchId || '1');

  // Form State
  const [branchId, setBranchId] = useState(effBranch);
  const [academicYearId, setAcademicYearId] = useState(String(activeAcademicYearId || '2'));
  const [boardType, setBoardType] = useState('CBSE');
  const [structureName, setStructureName] = useState('CBSE Primary 3-Term Pattern 2026');

  // Classes lookup
  const [classesList, setClassesList] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [terms, setTerms] = useState(DEFAULT_TERMS);

  // Existing structures list
  const [existingStructures, setExistingStructures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Load Classes for Selected Branch
  useEffect(() => {
    fetch(`/api/classes?branch_id=${branchId}&academic_year_id=${academicYearId}&status=Active`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setClassesList(res.data);
          // By default, select all classes
          setSelectedClassIds(res.data.map(c => Number(c.id)));
        } else {
          setClassesList([]);
          setSelectedClassIds([]);
        }
      })
      .catch(console.error);
  }, [branchId, academicYearId]);

  // 2. Load Existing Structures
  const loadStructures = async () => {
    setIsLoading(true);
    try {
      const res = await examTermService.getTermStructures(branchId, academicYearId);
      if (res.success && res.data) {
        setExistingStructures(res.data);
      } else {
        setExistingStructures([]);
      }
    } catch (err) {
      if (showToast) showToast('Error loading term structures', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStructures();
  }, [branchId, academicYearId]);

  // Class Selection Handlers
  const handleToggleSelectAllClasses = (checked) => {
    if (checked) {
      setSelectedClassIds(classesList.map(c => Number(c.id)));
    } else {
      setSelectedClassIds([]);
    }
  };

  const handleToggleClass = (classId) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
    );
  };

  // Term Table Row Handlers
  const handleTermFieldChange = (index, field, value) => {
    setTerms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddTermRow = () => {
    const nextIdx = terms.length + 1;
    setTerms(prev => [
      ...prev,
      {
        is_selected: true,
        term_name: `TERM-${nextIdx}`,
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        weightage_percent: 100,
        display_name: `TERM-${nextIdx}`
      }
    ]);
  };

  const handleRemoveTermRow = (index) => {
    if (terms.length <= 1) return;
    setTerms(prev => prev.filter((_, idx) => idx !== index));
  };

  // Save Term Structure
  const handleSave = async (e) => {
    e.preventDefault();
    if (!structureName.trim()) {
      if (showToast) showToast('Please enter a structure name', 'error');
      return;
    }
    if (selectedClassIds.length === 0) {
      if (showToast) showToast('Please select at least one applicable class', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const selectedClasses = classesList
        .filter(c => selectedClassIds.includes(Number(c.id)))
        .map(c => ({ class_id: c.id, class_name: c.name || c.class_name }));

      const payload = {
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        structure_name: structureName.trim(),
        board_type: boardType,
        classes: selectedClasses,
        terms
      };

      const res = await examTermService.createTermStructure(payload);
      if (res.success) {
        if (showToast) showToast(res.message || 'Term structure saved successfully!', 'success');
        loadStructures();
      } else {
        throw new Error(res.message || 'Failed to save');
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStructure = async (id) => {
    if (!window.confirm('Are you sure you want to delete this term structure?')) return;
    try {
      const res = await examTermService.deleteTermStructure(id);
      if (res.success) {
        if (showToast) showToast('Structure deleted successfully', 'success');
        loadStructures();
      }
    } catch (err) {
      if (showToast) showToast('Failed to delete structure', 'error');
    }
  };

  const isAllClassesSelected = classesList.length > 0 && selectedClassIds.length === classesList.length;

  return (
    <div className="space-y-6">
      {/* ── 1. Header Banner (shadcn-themed minimal clean layout) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 mb-1">
            <Layers className="w-3.5 h-3.5 text-zinc-700" />
            <span>Step 1: Academic Structure Definition</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Term & Academic Structure</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure examination board affiliation, applicable grades, evaluation terms, dates, and consolidated report card weightage.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="py-1 px-3 bg-zinc-50 text-zinc-700 font-medium">
            Session: {academicYears.find(y => String(y.id) === String(academicYearId))?.year_name || '2025-2026'}
          </Badge>
        </div>
      </div>

      {/* ── 2. Term Creation Form Card ── */}
      <Card>
        <CardHeader className="pb-4 border-b border-zinc-100">
          <CardTitle className="text-base">Create Term Structure</CardTitle>
          <CardDescription className="text-xs">
            Specify the board, map classes, and schedule dates with individual weights for final tabulation.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Row 1: Branch, Board, Structure Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Campus / Branch <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Board Affiliation <span className="text-red-500">*</span>
                </label>
                <select
                  value={boardType}
                  onChange={e => setBoardType(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                  <option value="State Board">State Board</option>
                  <option value="ICSE">ICSE</option>
                  <option value="Cambridge">Cambridge International (IGCSE)</option>
                  <option value="Other">Other Curriculum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Structure Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. CBSE Primary 3-Term Pattern"
                  value={structureName}
                  onChange={e => setStructureName(e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: Applicable Classes (Select All Checkbox + Pills) */}
            <div className="space-y-2.5 p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="select-all-classes"
                    checked={isAllClassesSelected}
                    onChange={e => handleToggleSelectAllClasses(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                  />
                  <label htmlFor="select-all-classes" className="text-xs font-bold text-zinc-800 cursor-pointer">
                    Applicable Classes (Select All)
                  </label>
                </div>
                <span className="text-[11px] font-medium text-zinc-500">
                  {selectedClassIds.length} of {classesList.length} classes selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 pt-1">
                {classesList.map(c => {
                  const isChecked = selectedClassIds.includes(Number(c.id));
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs' 
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleClass(Number(c.id))}
                        className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 cursor-pointer hidden"
                      />
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                        isChecked ? 'bg-white text-zinc-950 font-bold border-white' : 'border-zinc-300 bg-white'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className="truncate">{c.name || c.class_name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Term Definition Table (Exactly as in screenshot) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Term Schedule & Weightage Table</h4>
                  <p className="text-[11px] text-zinc-500">
                    Define the duration and individual percentage contribution for each term.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTermRow}
                  className="space-x-1.5 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Term</span>
                </Button>
              </div>

              <div className="rounded-xl border border-zinc-200/80 overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-zinc-50/80">
                    <TableRow>
                      <TableHead className="w-12 text-center"></TableHead>
                      <TableHead className="w-40 font-bold text-zinc-900">Term</TableHead>
                      <TableHead className="min-w-[320px] font-bold text-zinc-900">Term Dates</TableHead>
                      <TableHead className="w-32 text-center font-bold text-zinc-900">Weightage</TableHead>
                      <TableHead className="w-56 font-bold text-zinc-900">Display Name</TableHead>
                      <TableHead className="w-12 text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {terms.map((row, idx) => (
                      <TableRow key={idx}>
                        {/* Checkbox */}
                        <TableCell className="text-center py-2.5">
                          <input
                            type="checkbox"
                            checked={row.is_selected}
                            onChange={e => handleTermFieldChange(idx, 'is_selected', e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                          />
                        </TableCell>

                        {/* Term Name */}
                        <TableCell className="font-bold text-zinc-800 text-xs py-2.5">
                          {row.term_name}
                        </TableCell>

                        {/* Term Dates: From Date [To] To Date */}
                        <TableCell className="py-2.5">
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              value={row.from_date || ''}
                              onChange={e => handleTermFieldChange(idx, 'from_date', e.target.value)}
                              className="h-8 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-800 font-medium shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none"
                            />
                            <span className="text-xs font-bold text-zinc-500 uppercase px-1">To</span>
                            <input
                              type="date"
                              value={row.to_date || ''}
                              onChange={e => handleTermFieldChange(idx, 'to_date', e.target.value)}
                              className="h-8 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-800 font-medium shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none"
                            />
                          </div>
                        </TableCell>

                        {/* Weightage */}
                        <TableCell className="py-2.5 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.weightage_percent}
                            onChange={e => handleTermFieldChange(idx, 'weightage_percent', e.target.value)}
                            className="h-8 w-20 text-center rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-bold text-zinc-900 shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none"
                          />
                        </TableCell>

                        {/* Display Name */}
                        <TableCell className="py-2.5">
                          <input
                            type="text"
                            value={row.display_name}
                            onChange={e => handleTermFieldChange(idx, 'display_name', e.target.value)}
                            className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none"
                          />
                        </TableCell>

                        {/* Remove Action */}
                        <TableCell className="py-2.5 text-center">
                          {terms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTermRow(idx)}
                              className="p-1 text-zinc-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title="Delete Term"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStructureName('');
                  setTerms(DEFAULT_TERMS);
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="space-x-1.5"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Saving Structure...' : 'Save Term Structure'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── 3. Active Term Structures Ledger Card ── */}
      <Card>
        <CardHeader className="pb-3 border-b border-zinc-100">
          <CardTitle className="text-base">Existing Term Structures</CardTitle>
          <CardDescription className="text-xs">
            Review active structures and their term definitions configured for this campus.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="p-10 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-500 font-medium">Loading saved structures...</p>
            </div>
          ) : existingStructures.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-zinc-200 rounded-xl space-y-2">
              <Layers className="w-8 h-8 text-zinc-300 mx-auto" />
              <h4 className="text-sm font-semibold text-zinc-700">No Term Structures Defined</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Fill out the form above to establish your school’s academic terms and evaluation periods.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {existingStructures.map(st => (
                <div key={st.id} className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-zinc-950">{st.structure_name}</span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-2 font-bold">{st.board_type}</Badge>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Created: {new Date(st.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteStructure(st.id)}
                      className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                      title="Delete Structure"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Classes Covered */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Applicable Classes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {st.classes?.map(c => (
                        <span key={c.class_id} className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-medium border border-zinc-200">
                          {c.class_name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Terms List */}
                  <div className="border-t border-zinc-100 pt-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Configured Terms:</span>
                    <div className="space-y-1">
                      {st.terms?.map(t => (
                        <div key={t.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-zinc-50 border border-zinc-100">
                          <span className="font-semibold text-zinc-800">{t.display_name}</span>
                          <div className="flex items-center space-x-2 text-[11px] text-zinc-500">
                            <span>{t.from_date || 'N/A'} - {t.to_date || 'N/A'}</span>
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold">
                              Weightage: {t.weightage_percent}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
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
