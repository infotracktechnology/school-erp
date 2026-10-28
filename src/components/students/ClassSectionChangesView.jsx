import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRightLeft,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Shuffle,
  RefreshCw,
  School,
  Split
} from 'lucide-react';
import {
  getClasses,
  getSections,
  getStudents,
  bulkChangeClassSection,
  getClassSectionHistory
} from '../../services/api';

export const ClassSectionChangesView = ({ branchId, academicYearId, onDone }) => {
  // 4 Tabs: 'class_shuffle', 'class_log', 'section_shuffle', 'section_log'
  const [activeSubTab, setActiveSubTab] = useState('class_shuffle');

  // Lookups
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // 1. CLASS SHUFFLE STATE (requires Source Class, Source Section, Target Class, Target Section)
  const [clsSourceClassId, setClsSourceClassId] = useState(0);
  const [clsSourceSectionId, setClsSourceSectionId] = useState(0);
  const [clsTargetClassId, setClsTargetClassId] = useState(0);
  const [clsTargetSectionId, setClsTargetSectionId] = useState(0);
  const [clsStudents, setClsStudents] = useState([]);
  const [clsSelectedIds, setClsSelectedIds] = useState([]);
  const [clsEffectiveDate, setClsEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [clsReason, setClsReason] = useState('Class Shuffle / Academic Realignment');
  const [clsRemarks, setClsRemarks] = useState('');
  const [isLoadingClsStudents, setIsLoadingClsStudents] = useState(false);

  // 2. SECTION SHUFFLE STATE (requires Source Class, Source Section, ONLY Target Section)
  const [secSourceClassId, setSecSourceClassId] = useState(0);
  const [secSourceSectionId, setSecSourceSectionId] = useState(0);
  const [secTargetSectionId, setSecTargetSectionId] = useState(0);
  const [secStudents, setSecStudents] = useState([]);
  const [secSelectedIds, setSecSelectedIds] = useState([]);
  const [secEffectiveDate, setSecEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [secReason, setSecReason] = useState('Section Shuffle / Strength Re-balancing');
  const [secRemarks, setSecRemarks] = useState('');
  const [isLoadingSecStudents, setIsLoadingSecStudents] = useState(false);

  // 3 & 4. TRANSITION LOGS STATE
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load Classes & Sections
  useEffect(() => {
    if (branchId) {
      getClasses(branchId, academicYearId)
        .then(res => setClasses(res?.data || []))
        .catch(console.error);

      // Fetch with academicYearId, fallback to branchId
      getSections(branchId, academicYearId)
        .then(res => {
          if (res?.data && res.data.length > 0) {
            setSections(res.data);
          } else {
            getSections(branchId)
              .then(r2 => setSections(r2?.data || []))
              .catch(console.error);
          }
        })
        .catch(() => {
          getSections(branchId)
            .then(r2 => setSections(r2?.data || []))
            .catch(console.error);
        });
    }
  }, [branchId, academicYearId]);

  // Helper: Deduplicated sections filtered by classId
  const getSectionsForClass = useCallback((classId) => {
    if (!classId) return [];
    const classIdNum = Number(classId);
    const matching = sections.filter(s => Number(s.class_id) === classIdNum);
    const sourceList = matching.length > 0 ? matching : sections;

    const seen = new Set();
    const unique = [];
    for (const s of sourceList) {
      const rawName = s.section_name || s.name || '';
      const normName = String(rawName).trim().toUpperCase();
      if (normName && !seen.has(normName)) {
        seen.add(normName);
        unique.push({
          id: s.id,
          name: normName,
          class_id: s.class_id
        });
      }
    }
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [sections]);

  // Load Students for Class Shuffle
  const reloadClsStudents = useCallback(() => {
    if (branchId && clsSourceClassId && clsSourceSectionId) {
      setIsLoadingClsStudents(true);
      getStudents({
        branch_id: branchId,
        academic_year_id: academicYearId,
        class_id: clsSourceClassId,
        section_id: clsSourceSectionId,
        page_size: 200
      })
        .then(res => {
          setClsStudents(res.data || []);
          setClsSelectedIds([]);
        })
        .catch(console.error)
        .finally(() => setIsLoadingClsStudents(false));
    } else {
      setClsStudents([]);
      setClsSelectedIds([]);
    }
  }, [branchId, academicYearId, clsSourceClassId, clsSourceSectionId]);

  useEffect(() => {
    reloadClsStudents();
  }, [reloadClsStudents]);

  // Load Students for Section Shuffle
  const reloadSecStudents = useCallback(() => {
    if (branchId && secSourceClassId && secSourceSectionId) {
      setIsLoadingSecStudents(true);
      getStudents({
        branch_id: branchId,
        academic_year_id: academicYearId,
        class_id: secSourceClassId,
        section_id: secSourceSectionId,
        page_size: 200
      })
        .then(res => {
          setSecStudents(res.data || []);
          setSecSelectedIds([]);
        })
        .catch(console.error)
        .finally(() => setIsLoadingSecStudents(false));
    } else {
      setSecStudents([]);
      setSecSelectedIds([]);
    }
  }, [branchId, academicYearId, secSourceClassId, secSourceSectionId]);

  useEffect(() => {
    reloadSecStudents();
  }, [reloadSecStudents]);

  // Load Transition History
  const loadHistory = useCallback(() => {
    if (!branchId) return;
    setIsLoadingHistory(true);
    getClassSectionHistory({
      branch_id: branchId,
      academic_year_id: academicYearId,
      search: historySearch.trim() || undefined
    })
      .then(res => setHistoryRecords(res || []))
      .catch(console.error)
      .finally(() => setIsLoadingHistory(false));
  }, [branchId, academicYearId, historySearch]);

  useEffect(() => {
    if (activeSubTab === 'class_log' || activeSubTab === 'section_log') {
      loadHistory();
    }
  }, [activeSubTab, loadHistory]);

  // Handlers for Class Shuffle
  const handleClassShuffleSubmit = async (e) => {
    e.preventDefault();
    if (clsSelectedIds.length === 0) {
      setErrorMessage('Please select at least one student to move.');
      return;
    }
    if (!clsTargetClassId || !clsTargetSectionId) {
      setErrorMessage('Please select both Target Class and Target Section.');
      return;
    }
    if (clsSourceClassId === clsTargetClassId && clsSourceSectionId === clsTargetSectionId) {
      setErrorMessage('Target Class & Section must be different from Source Class & Section.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await bulkChangeClassSection({
        branch_id: branchId,
        academic_year_id: academicYearId,
        student_ids: clsSelectedIds,
        to_class_id: clsTargetClassId,
        to_section_id: clsTargetSectionId,
        effective_date: clsEffectiveDate,
        reason: clsReason,
        remarks: clsRemarks,
        changed_by: 'Super Admin'
      });

      setSuccessMessage(`Successfully migrated ${clsSelectedIds.length} student(s) to Target Class & Section.`);
      setClsSelectedIds([]);
      reloadClsStudents();
      loadHistory();
      if (onDone) onDone();
    } catch (err) {
      setErrorMessage(err.message || 'Class Shuffle failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for Section Shuffle
  const handleSectionShuffleSubmit = async (e) => {
    e.preventDefault();
    if (secSelectedIds.length === 0) {
      setErrorMessage('Please select at least one student to shuffle.');
      return;
    }
    if (!secTargetSectionId) {
      setErrorMessage('Please select a Target Section.');
      return;
    }
    if (secSourceSectionId === secTargetSectionId) {
      setErrorMessage('Target Section cannot be the same as Source Section.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await bulkChangeClassSection({
        branch_id: branchId,
        academic_year_id: academicYearId,
        student_ids: secSelectedIds,
        to_class_id: secSourceClassId, // Same class for section shuffle
        to_section_id: secTargetSectionId,
        effective_date: secEffectiveDate,
        reason: secReason,
        remarks: secRemarks,
        changed_by: 'Super Admin'
      });

      setSuccessMessage(`Successfully shuffled ${secSelectedIds.length} student(s) to the new section.`);
      setSecSelectedIds([]);
      reloadSecStudents();
      loadHistory();
      if (onDone) onDone();
    } catch (err) {
      setErrorMessage(err.message || 'Section Shuffle failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section options for Class Shuffle
  const clsSourceSections = useMemo(() => getSectionsForClass(clsSourceClassId), [clsSourceClassId, getSectionsForClass]);
  const clsTargetSections = useMemo(() => getSectionsForClass(clsTargetClassId), [clsTargetClassId, getSectionsForClass]);

  // Section options for Section Shuffle
  const secSourceSections = useMemo(() => getSectionsForClass(secSourceClassId), [secSourceClassId, getSectionsForClass]);
  // Target section list in Section Shuffle: only sections of the source class EXCLUDING source section, deduplicated!
  const secTargetSections = useMemo(() => {
    if (!secSourceClassId) return [];
    const allSecs = getSectionsForClass(secSourceClassId);
    const chosenSource = allSecs.find(s => Number(s.id) === Number(secSourceSectionId));
    const sourceName = chosenSource?.name;

    return allSecs.filter(s => {
      if (secSourceSectionId && Number(s.id) === Number(secSourceSectionId)) return false;
      if (sourceName && s.name === sourceName) return false;
      return true;
    });
  }, [secSourceClassId, secSourceSectionId, getSectionsForClass]);

  // Filtered History for Tab 2: Class Transition Log
  const classHistoryList = useMemo(() => {
    return historyRecords.filter(h => {
      const isClassDiff = Number(h.from_class_id) !== Number(h.to_class_id);
      const isClassReason = h.reason && h.reason.toLowerCase().includes('class');
      return isClassDiff || isClassReason;
    });
  }, [historyRecords]);

  // Filtered History for Tab 4: Section Transition Log
  const sectionHistoryList = useMemo(() => {
    return historyRecords.filter(h => {
      const isSameClass = Number(h.from_class_id) === Number(h.to_class_id);
      const isSectionReason = h.reason && h.reason.toLowerCase().includes('section');
      return isSameClass || isSectionReason;
    });
  }, [historyRecords]);

  return (
    <div className="space-y-5">
      {/* 4 Dedicated Sub-navigation Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('class_shuffle');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'class_shuffle'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Class Shuffle</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('class_log');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'class_log'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Class Transition Log</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('section_shuffle');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'section_shuffle'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Split className="w-4 h-4" />
          <span>Section Shuffle</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('section_log');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'section_log'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Section Transition Log</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: CLASS SHUFFLE */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'class_shuffle' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <School className="w-4 h-4 text-emerald-700" />
              <span>Class Shuffle</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select students from a source class & section and migrate them to a target class & section.
            </p>
          </div>

          <form onSubmit={handleClassShuffleSubmit} className="space-y-5 text-xs">
            {/* Class Shuffle Selectors (Source Class, Source Section, Target Class, Target Section) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source Class *</label>
                <select
                  value={clsSourceClassId}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setClsSourceClassId(val);
                    setClsSourceSectionId(0);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  <option value="0">Choose Source Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source Section *</label>
                <select
                  value={clsSourceSectionId}
                  onChange={(e) => setClsSourceSectionId(Number(e.target.value))}
                  disabled={!clsSourceClassId}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                  required
                >
                  <option value="0">Choose Source Section</option>
                  {clsSourceSections.map(s => (
                    <option key={s.id} value={s.id}>Section {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Class *</label>
                <select
                  value={clsTargetClassId}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setClsTargetClassId(val);
                    setClsTargetSectionId(0);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  <option value="0">Choose Target Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Section *</label>
                <select
                  value={clsTargetSectionId}
                  onChange={(e) => setClsTargetSectionId(Number(e.target.value))}
                  disabled={!clsTargetClassId}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                  required
                >
                  <option value="0">
                    {!clsTargetClassId ? 'Select Target Class first' : 'Choose Target Section'}
                  </option>
                  {clsTargetSections.map(s => (
                    <option key={s.id} value={s.id}>Section {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-800">
                  Select Students to Move ({clsSelectedIds.length} of {clsStudents.length} selected)
                </div>
                {clsStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (clsSelectedIds.length === clsStudents.length) {
                        setClsSelectedIds([]);
                      } else {
                        setClsSelectedIds(clsStudents.map(s => s.id));
                      }
                    }}
                    className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    {clsSelectedIds.length === clsStudents.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {isLoadingClsStudents ? (
                <div className="p-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  <span>Loading pupils in source class & section...</span>
                </div>
              ) : clsStudents.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  {clsSourceClassId && clsSourceSectionId
                    ? 'No students enrolled in this source section.'
                    : 'Select both Source Class and Source Section to view enrolled students.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                  {clsStudents.map(s => {
                    const isChecked = clsSelectedIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          isChecked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setClsSelectedIds(prev =>
                              prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]
                            );
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{s.full_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Roll #{s.roll_number || 'N/A'} • {s.admission_number}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Effective Date, Reason & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Effective Transfer Date *</label>
                <input
                  type="date"
                  value={clsEffectiveDate}
                  onChange={(e) => setClsEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Class Move *</label>
                <input
                  type="text"
                  value={clsReason}
                  onChange={(e) => setClsReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  placeholder="e.g. Class Shuffle / Academic Realignment"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Administrative Remarks (Optional)</label>
                <input
                  type="text"
                  value={clsRemarks}
                  onChange={(e) => setClsRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  placeholder="Order or memo number..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || clsSelectedIds.length === 0 || !clsTargetClassId || !clsTargetSectionId}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Class Shuffle...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Confirm Class Shuffle ({clsSelectedIds.length})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: CLASS TRANSITION LOG */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'class_log' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <History className="w-4 h-4 text-emerald-700" />
                <span>Class Transition Log</span>
              </h3>
              <p className="text-xs text-slate-500">
                Audit trail for students transferred between different classes.
              </p>
            </div>

            <div className="flex items-center space-x-2 max-w-xs w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search class logs..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={loadHistory}
                title="Refresh log"
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Previous Placement</th>
                  <th className="p-3">New Placement</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingHistory ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-emerald-600" />
                      <span>Loading class transition records...</span>
                    </td>
                  </tr>
                ) : classHistoryList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No class transition records found.
                    </td>
                  </tr>
                ) : (
                  classHistoryList.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono text-slate-600">{h.effective_date}</td>
                      <td className="p-3 font-bold text-slate-900">{h.student_name}</td>
                      <td className="p-3 font-mono text-emerald-700">{h.admission_number}</td>
                      <td className="p-3">
                        <span className="text-slate-600">{h.from_class_name} - Section {h.from_section_name}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-emerald-800">{h.to_class_name} - Section {h.to_section_name}</span>
                      </td>
                      <td className="p-3 text-slate-600">{h.reason}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{h.changed_by}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: SECTION SHUFFLE (ONLY TARGET SECTION) */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'section_shuffle' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Split className="w-4 h-4 text-emerald-700" />
              <span>Section Shuffle</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Re-balance or shuffle students across sections within the same class. (Target Class is locked to Source Class).
            </p>
          </div>

          <form onSubmit={handleSectionShuffleSubmit} className="space-y-5 text-xs">
            {/* Section Shuffle Selectors: Source Class, Source Section, and ONLY Target Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source Class *</label>
                <select
                  value={secSourceClassId}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSecSourceClassId(val);
                    setSecSourceSectionId(0);
                    setSecTargetSectionId(0);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  <option value="0">Choose Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source Section *</label>
                <select
                  value={secSourceSectionId}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSecSourceSectionId(val);
                    if (secTargetSectionId === val) {
                      setSecTargetSectionId(0);
                    }
                  }}
                  disabled={!secSourceClassId}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                  required
                >
                  <option value="0">Choose Source Section</option>
                  {secSourceSections.map(s => (
                    <option key={s.id} value={s.id}>Section {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Target Section *
                  <span className="text-[10px] text-emerald-700 font-normal ml-1">(Same Class)</span>
                </label>
                <select
                  value={secTargetSectionId}
                  onChange={(e) => setSecTargetSectionId(Number(e.target.value))}
                  disabled={!secSourceClassId || !secSourceSectionId || secTargetSections.length === 0}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                  required
                >
                  <option value="0">
                    {!secSourceClassId
                      ? 'Select Class first'
                      : !secSourceSectionId
                      ? 'Select Source Section first'
                      : secTargetSections.length === 0
                      ? 'No other sections available'
                      : 'Choose Target Section'}
                  </option>
                  {secTargetSections.map(s => (
                    <option key={s.id} value={s.id}>Section {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-800">
                  Select Students to Shuffle ({secSelectedIds.length} of {secStudents.length} selected)
                </div>
                {secStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (secSelectedIds.length === secStudents.length) {
                        setSecSelectedIds([]);
                      } else {
                        setSecSelectedIds(secStudents.map(s => s.id));
                      }
                    }}
                    className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    {secSelectedIds.length === secStudents.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {isLoadingSecStudents ? (
                <div className="p-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  <span>Loading pupils in source section...</span>
                </div>
              ) : secStudents.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  {secSourceClassId && secSourceSectionId
                    ? 'No students found in this section.'
                    : 'Select both Class and Source Section to view enrolled students.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                  {secStudents.map(s => {
                    const isChecked = secSelectedIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          isChecked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSecSelectedIds(prev =>
                              prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]
                            );
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{s.full_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Roll #{s.roll_number || 'N/A'} • {s.admission_number}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Effective Date, Reason & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Effective Date *</label>
                <input
                  type="date"
                  value={secEffectiveDate}
                  onChange={(e) => setSecEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Shuffle *</label>
                <input
                  type="text"
                  value={secReason}
                  onChange={(e) => setSecReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  placeholder="e.g. Section Shuffle / Strength Re-balancing"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Administrative Remarks (Optional)</label>
                <input
                  type="text"
                  value={secRemarks}
                  onChange={(e) => setSecRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  placeholder="Optional notes or reference..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || secSelectedIds.length === 0 || !secTargetSectionId}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Section Shuffle...</span>
                  </>
                ) : (
                  <>
                    <Shuffle className="w-4 h-4" />
                    <span>Confirm Section Shuffle ({secSelectedIds.length})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: SECTION TRANSITION LOG */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'section_log' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <History className="w-4 h-4 text-emerald-700" />
                <span>Section Transition Log</span>
              </h3>
              <p className="text-xs text-slate-500">
                Audit trail for students shuffled between sections within the same class.
              </p>
            </div>

            <div className="flex items-center space-x-2 max-w-xs w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search section logs..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={loadHistory}
                title="Refresh log"
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Previous Section</th>
                  <th className="p-3">New Section</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingHistory ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-emerald-600" />
                      <span>Loading section transition records...</span>
                    </td>
                  </tr>
                ) : sectionHistoryList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No section transition records found.
                    </td>
                  </tr>
                ) : (
                  sectionHistoryList.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono text-slate-600">{h.effective_date}</td>
                      <td className="p-3 font-bold text-slate-900">{h.student_name}</td>
                      <td className="p-3 font-mono text-emerald-700">{h.admission_number}</td>
                      <td className="p-3 font-semibold text-slate-800">{h.from_class_name || h.to_class_name}</td>
                      <td className="p-3">
                        <span className="text-slate-600">Section {h.from_section_name}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-emerald-800">Section {h.to_section_name}</span>
                      </td>
                      <td className="p-3 text-slate-600">{h.reason}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{h.changed_by}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClassSectionChangesView;
