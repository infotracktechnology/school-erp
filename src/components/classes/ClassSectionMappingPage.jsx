import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Grid, List, Save, RefreshCw, AlertCircle, Search, Filter } from 'lucide-react';
import { getClassSectionMatrix, saveClassSectionMatrix, saveClassMappings, toggleAcademicYearClass } from '../../services/api';
import { useErp } from '../../context/ErpContext';
import { AcademicBranchYearSelector } from '../academic/AcademicBranchYearSelector';
import { ClassSectionMatrix } from './ClassSectionMatrix';
import { ClassSectionSummaryTable } from './ClassSectionSummaryTable';
import { ClassSectionEditModal } from './ClassSectionEditModal';
export const ClassSectionMappingPage = ({ branches, activeBranchId, onActiveBranchChange, academicYears, activeAcademicYearId, onActiveAcademicYearChange, showToast }) => {
    const { isReadOnly, setHasUnsavedChanges } = useErp();
    const [matrixData, setMatrixData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    // View Mode: 'matrix' vs 'summary'
    const [viewMode, setViewMode] = useState('matrix');
    // Interactive matrix state: class_id -> section_ids[]
    const [currentMatrixState, setCurrentMatrixState] = useState({});
    const [initialMatrixState, setInitialMatrixState] = useState({});
    // Single Class Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [targetClassSummary, setTargetClassSummary] = useState(null);
    // Filters
    const [filters, setFilters] = useState({
        search: '',
        status: 'all'
    });
    // Scope Resolution
    const selectedBranch = useMemo(() => {
        return (branches || []).find((b) => b.id === activeBranchId) || (branches || [])[0] || null;
    }, [branches, activeBranchId]);
    const selectedAcademicYear = useMemo(() => {
        if (!selectedBranch)
            return null;
        return (academicYears || []).find((ay) => ay.id === activeAcademicYearId) ||
            (academicYears || []).find((ay) => ay.is_current) ||
            (academicYears || [])[0] ||
            null;
    }, [academicYears, activeAcademicYearId, selectedBranch]);
    // Load matrix data
    const fetchMatrix = async () => {
        if (!selectedBranch || !selectedAcademicYear)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await getClassSectionMatrix(selectedBranch.id, selectedAcademicYear.id, filters);
            setMatrixData(res.data);
            // Build state map
            const stateMap = {};
            if (res.data && res.data.summary) {
                for (const item of res.data.summary) {
                    stateMap[item.class_id] = [...item.section_ids];
                }
            }
            setCurrentMatrixState(stateMap);
            setInitialMatrixState(JSON.parse(JSON.stringify(stateMap)));
        }
        catch (err) {
            console.error('Failed to load matrix data:', err);
            setError(err.message || 'Unable to load class and section mappings.');
            showToast(err.message || 'Failed to load mappings', 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (selectedBranch && selectedAcademicYear) {
            fetchMatrix();
        }
    }, [selectedBranch?.id, selectedAcademicYear?.id, filters.search, filters.status]);
    // Check dirty/modified state
    const isDirty = useMemo(() => {
        const classIds = Object.keys(currentMatrixState).map(Number);
        for (const cid of classIds) {
            const curr = (currentMatrixState[cid] || []).slice().sort();
            const init = (initialMatrixState[cid] || []).slice().sort();
            if (curr.length !== init.length)
                return true;
            for (let i = 0; i < curr.length; i++) {
                if (curr[i] !== init[i])
                    return true;
            }
        }
        return false;
    }, [currentMatrixState, initialMatrixState]);
    // Synchronize unsaved changes status with ErpContext for global switcher modal
    useEffect(() => {
        setHasUnsavedChanges(isDirty);
        return () => {
            setHasUnsavedChanges(false);
        };
    }, [isDirty, setHasUnsavedChanges]);
    // Toggle single cell
    const handleToggleCell = (classId, sectionId) => {
        if (isReadOnly)
            return;
        
        // Guard: If student is enrolled, disable unmapping
        const cls = matrixData?.classes?.find((c) => c.id === classId) || matrixData?.summary?.find((s) => s.class_id === classId);
        const studentCount = (cls?.section_students && cls?.section_students[sectionId]) || 0;
        const isCurrentlyMapped = (currentMatrixState[classId] || []).includes(sectionId);

        if (isCurrentlyMapped && studentCount > 0) {
            showToast(`Cannot unmap Section: ${studentCount} student(s) are currently enrolled in this section. Section is locked.`, 'error');
            return;
        }

        setCurrentMatrixState((prev) => {
            const existing = prev[classId] || [];
            const updated = existing.includes(sectionId)
                ? existing.filter((id) => id !== sectionId)
                : [...existing, sectionId];
            return {
                ...prev,
                [classId]: updated
            };
        });
    };
    // Select all for row
    const handleSelectAllForRow = (classId) => {
        if (isReadOnly || !matrixData)
            return;
        const allSecIds = matrixData.sections.map((s) => s.id);
        setCurrentMatrixState((prev) => ({
            ...prev,
            [classId]: allSecIds
        }));
    };
    // Clear row (preserves sections with enrolled students)
    const handleClearRow = (classId) => {
        if (isReadOnly)
            return;
        const cls = matrixData?.classes?.find((c) => c.id === classId) || matrixData?.summary?.find((s) => s.class_id === classId);
        const lockedIds = cls?.locked_section_ids || [];

        setCurrentMatrixState((prev) => ({
            ...prev,
            [classId]: lockedIds
        }));

        if (lockedIds.length > 0) {
            showToast(`Preserved ${lockedIds.length} section(s) with enrolled students.`, 'info');
        }
    };
    // Discard changes
    const handleDiscardChanges = () => {
        setCurrentMatrixState(JSON.parse(JSON.stringify(initialMatrixState)));
        showToast('Unsaved mapping changes have been discarded.', 'info');
    };
    // Save changes
    const handleSaveAll = async () => {
        if (!selectedBranch || !selectedAcademicYear)
            return;
        setIsSaving(true);
        try {
            const updates = Object.keys(currentMatrixState).map((classIdStr) => {
                const cid = Number(classIdStr);
                return {
                    class_id: cid,
                    section_ids: currentMatrixState[cid] || []
                };
            });
            await saveClassSectionMatrix(selectedBranch.id, selectedAcademicYear.id, updates);
            showToast('Class and section mappings saved successfully!', 'success');
            await fetchMatrix();
        }
        catch (err) {
            showToast(err.message || 'Failed to save mapping changes', 'error');
        }
        finally {
            setIsSaving(false);
        }
    };
    // Single Class Edit Modal
    const handleOpenEditModal = (summaryRow) => {
        setTargetClassSummary(summaryRow);
        setIsEditModalOpen(true);
    };
    // Toggle class enable/disable
    const handleToggleEnable = async (classId, currentEnabled) => {
        if (!selectedBranch || !selectedAcademicYear) return;
        try {
            await toggleAcademicYearClass({
                branch_id: selectedBranch.id,
                academic_year_id: selectedAcademicYear.id,
                class_id: classId,
                is_enabled: !currentEnabled,
            });
            showToast('Class enable status updated.', 'success');
            await fetchMatrix();
        } catch (err) {
            if (err.is_locked) {
                showToast(`Cannot disable class: ${err.student_count} student(s) assigned.`, 'error');
            } else {
                showToast(err.message || 'Failed to update class status', 'error');
            }
        }
    };
    const handleSaveSingleClass = async (classId, sectionIds) => {
        if (!selectedBranch || !selectedAcademicYear)
            return;
        await saveClassMappings(selectedBranch.id, selectedAcademicYear.id, classId, sectionIds);
        showToast('Class sections updated successfully.', 'success');
        await fetchMatrix();
    };
    // KPI calculations
    const stats = useMemo(() => {
        if (!matrixData)
            return { totalClasses: 0, totalSections: 0, totalLinks: 0, unassigned: 0 };
        const totalClasses = matrixData.classes?.length || 0;
        const totalSections = matrixData.sections?.length || 0;
        let totalLinks = 0;
        let unassigned = 0;
        for (const cidStr of Object.keys(currentMatrixState)) {
            const cid = Number(cidStr);
            const secIds = currentMatrixState[cid] || [];
            totalLinks += secIds.length;
            if (secIds.length === 0)
                unassigned += 1;
        }
        return { totalClasses, totalSections, totalLinks, unassigned };
    }, [matrixData, currentMatrixState]);
    return (<div className="space-y-6">
      {/* 1. Branch & Academic Year Scoped Selector */}
      <AcademicBranchYearSelector branches={branches} selectedBranchId={selectedBranch ? selectedBranch.id : null} onSelectBranch={onActiveBranchChange} academicYears={academicYears} selectedAcademicYearId={selectedAcademicYear ? selectedAcademicYear.id : null} onSelectAcademicYear={onActiveAcademicYearChange} isLoading={isLoading} moduleName="Class & Section Mapping"/>

      {/* 2. Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Class & Section Mapping
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Academic Settings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Map and associate active section divisions to academic classes for{' '}
            <strong className="text-slate-800">{selectedBranch?.branch_name}</strong> in{' '}
            <strong className="text-slate-800">{selectedAcademicYear?.name}</strong>.
          </p>
        </div>

        {/* View Toggle & Save Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Matrix vs Summary Toggle */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button type="button" onClick={() => setViewMode('matrix')} className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${viewMode === 'matrix'
            ? 'bg-white text-emerald-900 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
              <Grid className="w-3.5 h-3.5"/>
              <span>Matrix Grid</span>
            </button>
            <button type="button" onClick={() => setViewMode('summary')} className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${viewMode === 'summary'
            ? 'bg-white text-emerald-900 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
              <List className="w-3.5 h-3.5"/>
              <span>Summary Table</span>
            </button>
          </div>

          <button type="button" onClick={fetchMatrix} disabled={isLoading} className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shadow-2xs cursor-pointer" title="Refresh matrix">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
          </button>

          {/* Bulk Save Button */}
          <button type="button" onClick={handleSaveAll} disabled={isSaving || !isDirty || isReadOnly} className={`inline-flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-xs ${isReadOnly
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
            : isDirty
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md ring-2 ring-emerald-700/20 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`} title={isReadOnly ? 'Read-only: Historical Academic Year' : undefined}>
            <Save className="w-4 h-4"/>
            <span>{isSaving ? 'Saving Changes...' : 'Save Mapping Changes'}</span>
          </button>
        </div>
      </div>

      {/* 3. Dirty Unsaved Notification Banner */}
      {isDirty && (<div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-fade-in">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0"/>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                You have unsaved changes in the section allocation matrix
              </h4>
              <p className="text-[11px] text-amber-700 font-medium">
                Remember to click "Save Mapping Changes" to persist these assignments to the database.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button type="button" onClick={handleDiscardChanges} className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              Discard Changes
            </button>
            <button type="button" onClick={handleSaveAll} disabled={isSaving} className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-2xs cursor-pointer">
              {isSaving ? 'Saving...' : 'Save Changes Now'}
            </button>
          </div>
        </div>)}

      {/* Error display */}
      {error && (<div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
          <span>{error}</span>
        </div>)}

      {/* 4. KPI Statistics Cards with Color Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Total Classes</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalClasses}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Classes in scope</div>
        </div>

        <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Active Sections</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{stats.totalSections}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Available section letters</div>
        </div>

        <div className="bg-white border border-violet-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">Total Class-Section Links</span>
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
          </div>
          <div className="text-2xl font-black text-violet-800 mt-1">{stats.totalLinks}</div>
          <div className="text-[11px] text-violet-700 font-semibold mt-0.5">Classrooms created</div>
        </div>

        <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Unassigned Classes</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className={`text-2xl font-black mt-1 ${stats.unassigned > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
            {stats.unassigned}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Classes with 0 sections</div>
        </div>
      </div>

      {/* 5. Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input type="text" placeholder="Filter classes by name..." value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"/>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500"/>
            <span className="text-xs font-bold text-slate-600">Class Status:</span>
          </div>
          <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} className="text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer">
            <option value="all">All Classes</option>
            <option value="Active">Active Classes Only</option>
            <option value="Inactive">Inactive Classes Only</option>
          </select>

          {(filters.search || filters.status !== 'all') && (<button type="button" onClick={() => setFilters({ search: '', status: 'all' })} className="text-xs text-slate-600 hover:text-red-700 font-bold px-2 py-1 rounded-md hover:bg-slate-100 transition-colors">
              Reset
            </button>)}
        </div>
      </div>

      {/* 6. Main View Section */}
      {isLoading ? (<div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto mb-3"/>
          <p className="text-sm font-bold text-slate-700">Loading mapping matrix...</p>
        </div>) : matrixData && (matrixData.classes?.length || 0) > 0 && (matrixData.sections?.length || 0) > 0 ? (viewMode === 'matrix' ? (<ClassSectionMatrix classes={matrixData.classes} sections={matrixData.sections} matrixState={currentMatrixState} onToggleCell={handleToggleCell} onSelectAllForRow={handleSelectAllForRow} onClearRow={handleClearRow} initialMatrixState={initialMatrixState} onToggleEnable={handleToggleEnable} isReadOnly={isReadOnly}/>) : (<ClassSectionSummaryTable summary={matrixData.summary || []} onEditClassMapping={handleOpenEditModal} onToggleEnable={handleToggleEnable} isReadOnly={isReadOnly}/>)) : (<div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <Layers className="w-7 h-7"/>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {!(matrixData?.classes?.length)
                ? 'No classes available to map'
                : !(matrixData?.sections?.length)
                    ? 'No sections available to map'
                    : 'No mapping data found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6 font-medium">
            {!(matrixData?.classes?.length)
                ? 'Please create classes under "Classes" first before mapping sections.'
                : !(matrixData?.sections?.length)
                    ? 'Please create sections under "Sections" first before mapping to classes.'
                    : 'Try clearing your search or status filters.'}
          </p>
        </div>)}

      {/* Edit Modal */}
      {matrixData && (<ClassSectionEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} targetClassSummary={targetClassSummary} availableSections={matrixData.sections || []} onSave={handleSaveSingleClass} branchName={selectedBranch ? selectedBranch.branch_name : ''} academicYearName={selectedAcademicYear ? selectedAcademicYear.name : ''}/>)}
    </div>);
};
