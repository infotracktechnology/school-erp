import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Layers, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { getClasses, createClass, updateClass, updateClassStatus } from '../../services/api';
import { useErp } from '../../context/ErpContext';
import { AcademicBranchYearSelector } from '../academic/AcademicBranchYearSelector';
import { ClassTable } from './ClassTable';
import { ClassFormModal } from './ClassFormModal';
import { ClassViewModal } from './ClassViewModal';
import { ChangeClassStatusModal } from './ChangeClassStatusModal';
export const ClassesPage = ({ branches, activeBranchId, onActiveBranchChange, academicYears, activeAcademicYearId, onActiveAcademicYearChange, showToast }) => {
    const { isReadOnly } = useErp();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Filters
    const [filters, setFilters] = useState({
        search: '',
        status: 'all'
    });
    // Modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingClass, setViewingClass] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusTargetClass, setStatusTargetClass] = useState(null);
    // Resolution
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
    // Load classes
    const fetchClasses = async () => {
        if (!selectedBranch || !selectedAcademicYear)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await getClasses(selectedBranch.id, selectedAcademicYear.id, filters);
            setClasses(res.data);
        }
        catch (err) {
            console.error('Failed to load classes:', err);
            setError(err.message || 'Unable to load classes for the selected scope.');
            showToast(err.message || 'Failed to load classes', 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (selectedBranch && selectedAcademicYear) {
            fetchClasses();
        }
    }, [selectedBranch?.id, selectedAcademicYear?.id, filters.search, filters.status]);
    // Stats calculation
    const stats = useMemo(() => {
        const safeClasses = classes || [];
        const total = safeClasses.length;
        const active = safeClasses.filter((c) => c.status === 'Active').length;
        const inactive = safeClasses.filter((c) => c.status === 'Inactive').length;
        const mappedCount = safeClasses.filter((c) => (c.section_count || 0) > 0).length;
        return { total, active, inactive, mappedCount };
    }, [classes]);
    // Handlers
    const handleOpenAdd = () => {
        setEditingClass(null);
        setIsFormModalOpen(true);
    };
    const handleOpenEdit = (cls) => {
        setEditingClass(cls);
        setIsFormModalOpen(true);
    };
    const handleOpenView = (cls) => {
        setViewingClass(cls);
        setIsViewModalOpen(true);
    };
    const handleOpenStatusToggle = (cls) => {
        setStatusTargetClass(cls);
        setIsStatusModalOpen(true);
    };
    const handleFormSubmit = async (formData) => {
        if (editingClass) {
            const updated = await updateClass(editingClass.id, formData);
            showToast(`Class "${updated.name}" updated successfully.`, 'success');
        }
        else {
            const created = await createClass(formData);
            showToast(`Class "${created.name}" created successfully.`, 'success');
        }
        await fetchClasses();
    };
    const handleConfirmStatusChange = async (newStatus) => {
        if (!statusTargetClass)
            return;
        try {
            const updated = await updateClassStatus(statusTargetClass.id, newStatus);
            showToast(`Class "${updated.name}" status changed to ${newStatus}.`, 'success');
            await fetchClasses();
        }
        catch (err) {
            showToast(err.message || 'Failed to change class status.', 'error');
            throw err;
        }
    };
    return (<div className="space-y-6">
      {/* 1. Branch & Academic Year Scoped Selector */}
      <AcademicBranchYearSelector branches={branches} selectedBranchId={selectedBranch ? selectedBranch.id : null} onSelectBranch={onActiveBranchChange} academicYears={academicYears} selectedAcademicYearId={selectedAcademicYear ? selectedAcademicYear.id : null} onSelectAcademicYear={onActiveAcademicYearChange} isLoading={isLoading} moduleName="Classes"/>

      {/* 2. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Classes</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Academic Settings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage classes and grades for <strong className="text-slate-800">{selectedBranch?.branch_name}</strong> in Academic Year <strong className="text-slate-800">{selectedAcademicYear?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button type="button" onClick={fetchClasses} disabled={isLoading} className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shadow-2xs cursor-pointer" title="Refresh classes">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
          </button>

          <button type="button" onClick={handleOpenAdd} disabled={!selectedBranch || !selectedAcademicYear || isReadOnly} className="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title={isReadOnly ? 'Historical Academic Year is in Read-Only mode. Enable Admin Override in banner to add classes.' : undefined}>
            <Plus className="w-4 h-4"/>
            <span>+ Add Class</span>
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (<div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
          <span>{error}</span>
        </div>)}

      {/* 3. KPI Statistics Cards with Color Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Total Classes</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Defined for this academic session</div>
        </div>

        <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Active Classes</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{stats.active}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Available for attendance & fees</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inactive Classes</span>
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          </div>
          <div className="text-2xl font-black text-slate-600 mt-1">{stats.inactive}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Archived or disabled</div>
        </div>

        <div className="bg-white border border-violet-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">Sections Configured</span>
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
          </div>
          <div className="text-2xl font-black text-violet-800 mt-1">{stats.mappedCount} / {stats.total}</div>
          <div className="text-[11px] text-violet-700 font-semibold mt-0.5">Classes mapped with sections</div>
        </div>
      </div>

      {/* 4. Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input type="text" placeholder="Search class by name or code..." value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"/>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500"/>
            <span className="text-xs font-bold text-slate-600">Status:</span>
          </div>
          <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} className="text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          {(filters.search || filters.status !== 'all') && (<button type="button" onClick={() => setFilters({ search: '', status: 'all' })} className="text-xs text-slate-600 hover:text-red-700 font-bold px-2 py-1 rounded-md hover:bg-slate-100 transition-colors">
              Reset
            </button>)}
        </div>
      </div>

      {/* 5. Main Table or Empty State */}
      {isLoading ? (<div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto mb-3"/>
          <p className="text-sm font-bold text-slate-700">Loading classes...</p>
        </div>) : classes.length > 0 ? (<ClassTable classes={classes} onView={handleOpenView} onEdit={handleOpenEdit} onToggleStatus={handleOpenStatusToggle} isReadOnly={isReadOnly}/>) : (<div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <Layers className="w-7 h-7"/>
          </div>
          <h3 className="text-base font-bold text-slate-900">No classes found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6 font-medium">
            {filters.search || filters.status !== 'all'
                ? 'No classes match your current search or status filter. Try clearing the filter.'
                : `No classes have been configured yet for ${selectedBranch?.branch_name} in academic year ${selectedAcademicYear?.name}.`}
          </p>
          <button type="button" onClick={handleOpenAdd} disabled={isReadOnly} className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed" title={isReadOnly ? 'Read-only: Historical Academic Year' : undefined}>
            <Plus className="w-4 h-4"/>
            <span>Add First Class</span>
          </button>
        </div>)}

      {/* Modals */}
      <ClassFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSubmit={handleFormSubmit} initialData={editingClass} branchId={selectedBranch ? selectedBranch.id : 0} academicYearId={selectedAcademicYear ? selectedAcademicYear.id : 0} branchName={selectedBranch ? selectedBranch.branch_name : ''} academicYearName={selectedAcademicYear ? selectedAcademicYear.name : ''} existingCount={classes.length}/>

      <ClassViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} classItem={viewingClass} branchName={selectedBranch ? selectedBranch.branch_name : ''} academicYearName={selectedAcademicYear ? selectedAcademicYear.name : ''} onEdit={handleOpenEdit}/>

      <ChangeClassStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} classItem={statusTargetClass} onConfirm={handleConfirmStatusChange}/>
    </div>);
};
