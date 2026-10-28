import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, AlertCircle, Building2, Check } from 'lucide-react';
import { getAcademicYears, createAcademicYear, updateAcademicYear, updateAcademicYearStatus, setAcademicYearAsCurrent, setAcademicYearAsNext } from '../../services/api';
import { useErp } from '../../context/ErpContext';
import { AcademicYearStats } from './AcademicYearStats';
import { AcademicYearFilterBar } from './AcademicYearFilterBar';
import { AcademicYearTable } from './AcademicYearTable';
import { AcademicYearEmptyState } from './AcademicYearEmptyState';
import { AcademicYearFormModal } from './AcademicYearFormModal';
import { ChangeCurrentYearModal } from './ChangeCurrentYearModal';
import { AcademicYearDetailsModal } from './AcademicYearDetailsModal';
import { ChangeAcademicYearStatusModal } from './ChangeAcademicYearStatusModal';
import { DisableCurrentYearModal } from './DisableCurrentYearModal';
import { AcademicYearClassesModal } from './AcademicYearClassesModal';
export const AcademicYearPage = ({ branches, activeBranchId, onActiveBranchChange, showToast }) => {
    const { activeAcademicYearId, toggleYearEnabled: globalToggleYearEnabled, refreshAcademicYears: globalRefreshYears } = useErp();
    // Academic years state
    const [academicYears, setAcademicYears] = useState([]);
    const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Filters state
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        is_current: 'all',
        is_enabled: 'all'
    });
    // Modal States
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingYear, setViewingYear] = useState(null);
    const [isChangeCurrentModalOpen, setIsChangeCurrentModalOpen] = useState(false);
    const [targetCurrentYear, setTargetCurrentYear] = useState(null);
    const [isUpdatingCurrent, setIsUpdatingCurrent] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusTargetYear, setStatusTargetYear] = useState(null);
    // Disable confirmation modal for active academic year
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [yearToDisable, setYearToDisable] = useState(null);
    const [isSubmittingDisable, setIsSubmittingDisable] = useState(false);
    // Class Configuration Modal
    const [isClassesModalOpen, setIsClassesModalOpen] = useState(false);
    const [classesModalYear, setClassesModalYear] = useState(null);
    const handleOpenClassesModal = (ay) => {
        setClassesModalYear(ay);
        setIsClassesModalOpen(true);
    };
    // Active branch resolution
    const selectedBranch = useMemo(() => {
        return branches.find(b => b.id === activeBranchId) || branches[0] || null;
    }, [branches, activeBranchId]);
    // Load academic years whenever selected branch or filters change
    const fetchYears = async () => {
        if (!selectedBranch)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await getAcademicYears(selectedBranch.id, filters);
            setAcademicYears(res.data);
            setCurrentAcademicYear(res.current_academic_year);
        }
        catch (err) {
            console.error('Failed to load academic years:', err);
            setError(err.message || 'Unable to load academic years for this branch.');
            showToast(err.message || 'Failed to load academic years', 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (selectedBranch) {
            fetchYears();
        }
    }, [selectedBranch?.id, filters.search, filters.status, filters.is_current, filters.is_enabled]);
    // Handler for adding new academic year
    const handleOpenAddModal = () => {
        setEditingYear(null);
        setIsFormModalOpen(true);
    };
    // Handler for editing an academic year
    const handleOpenEditModal = (ay) => {
        setEditingYear(ay);
        setIsFormModalOpen(true);
    };
    // Handler for submitting add or edit form
    const handleFormSubmit = async (formData) => {
        if (editingYear) {
            // Update
            const updated = await updateAcademicYear(editingYear.id, formData);
            showToast(`Academic Year "${updated.name}" updated successfully.`, 'success');
        }
        else {
            // Create
            const created = await createAcademicYear(formData);
            showToast(`Academic Year "${created.name}" created successfully for ${selectedBranch?.branch_name}.`, 'success');
        }
        await fetchYears();
        await globalRefreshYears();
    };
    // Handler for viewing details
    const handleViewDetails = (ay) => {
        setViewingYear(ay);
        setIsDetailsModalOpen(true);
    };
    // Handler for setting an academic year as current
    const handleInitiateSetCurrent = (ay) => {
        if (ay.is_current)
            return;
        setTargetCurrentYear(ay);
        setIsChangeCurrentModalOpen(true);
    };
    const handleConfirmSetCurrent = async () => {
        if (!targetCurrentYear)
            return;
        setIsUpdatingCurrent(true);
        try {
            const res = await setAcademicYearAsCurrent(targetCurrentYear.id);
            showToast(`Academic Year "${res.data.name}" is now the Current Academic Year for ${selectedBranch?.branch_name}.`, 'success');
            setIsChangeCurrentModalOpen(false);
            setTargetCurrentYear(null);
            await fetchYears();
            await globalRefreshYears();
        }
        catch (err) {
            showToast(err.message || 'Failed to set current academic year.', 'error');
        }
        finally {
            setIsUpdatingCurrent(false);
        }
    };
    // Handler for changing status
    const handleInitiateChangeStatus = (ay) => {
        setStatusTargetYear(ay);
        setIsStatusModalOpen(true);
    };
    const handleConfirmStatusChange = async (newStatus) => {
        if (!statusTargetYear)
            return;
        try {
            const updated = await updateAcademicYearStatus(statusTargetYear.id, newStatus);
            showToast(`Academic Year "${updated.name}" status updated to ${newStatus}.`, 'success');
            await fetchYears();
            await globalRefreshYears();
        }
        catch (err) {
            showToast(err.message || 'Failed to change status.', 'error');
            throw err;
        }
    };
    // Handler for designating Next Academic Year for Student Promotion
    const handleInitiateSetNext = async (ay) => {
        try {
            await setAcademicYearAsNext(ay.id);
            showToast(`Academic Year "${ay.name}" is now designated as Next Academic Year for Student Promotion.`, 'success');
            await fetchYears();
            await globalRefreshYears();
        }
        catch (err) {
            showToast(err.message || 'Failed to set next academic year.', 'error');
        }
    };
    // Handler for Enable/Disable Toggle
    const handleToggleEnabled = async (ay, newState) => {
        // 1. Business Rule: At least one Academic Year must remain enabled for selection
        if (!newState) {
            const currentEnabledCount = academicYears.filter(y => y.is_enabled !== false).length;
            if (currentEnabledCount <= 1) {
                showToast('At least one Academic Year must remain enabled for selection.', 'error');
                return;
            }
            // 2. Business Rule: If disabling currently active/selected year, show prompt
            if (ay.id === activeAcademicYearId || ay.is_current) {
                setYearToDisable(ay);
                setIsDisableModalOpen(true);
                return;
            }
        }
        // Direct toggle
        const result = await globalToggleYearEnabled(ay, newState);
        if (result.success) {
            await fetchYears();
        }
    };
    // Confirm disabling active year
    const handleConfirmDisableActiveYear = async () => {
        if (!yearToDisable)
            return;
        setIsSubmittingDisable(true);
        try {
            const result = await globalToggleYearEnabled(yearToDisable, false);
            if (result.success) {
                setIsDisableModalOpen(false);
                setYearToDisable(null);
                await fetchYears();
            }
        }
        finally {
            setIsSubmittingDisable(false);
        }
    };
    const hasFilters = Boolean(filters.search) ||
        filters.status !== 'all' ||
        filters.is_current !== 'all' ||
        (Boolean(filters.is_enabled) && filters.is_enabled !== 'all');
    return (<div className="space-y-6">
      {/* 1. Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Academic Year Management
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Academic Settings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Configure academic cycles, session timelines, active status, and enable/disable visibility in the global switcher for <strong className="text-slate-800">{selectedBranch?.branch_name}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button type="button" onClick={fetchYears} disabled={isLoading} className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shadow-2xs cursor-pointer" title="Refresh academic years">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
          </button>

          <button type="button" onClick={handleOpenAddModal} disabled={!selectedBranch} className="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4"/>
            <span>+ Add Academic Year</span>
          </button>
        </div>
      </div>

      {/* Campus Branch Switcher Bar */}
      <div className="bg-emerald-950/5 border border-emerald-200/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-4.5 h-4.5"/>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">Campus Branch Scope:</span>
              <span className="text-xs font-black text-emerald-800">{selectedBranch?.branch_name}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click any campus branch below to view, configure, and switch scoped academic years.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {branches.map((b) => {
            const isSelected = b.id === selectedBranch?.id;
            return (<button key={b.id} type="button" onClick={() => onActiveBranchChange(b.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${isSelected
                    ? 'bg-emerald-700 text-white shadow-xs border border-emerald-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 shadow-2xs'}`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-200"/>}
                <span>{b.branch_name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-emerald-800/90 text-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                  {b.branch_code}
                </span>
              </button>);
        })}
        </div>
      </div>

      {/* 2. Error Alert if any */}
      {error && (<div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
          <span>{error}</span>
        </div>)}

      {/* 3. Stats KPI Cards */}
      {selectedBranch && (<AcademicYearStats academicYears={academicYears} currentAcademicYear={currentAcademicYear}/>)}

      {/* 4. Filter Bar */}
      {selectedBranch && academicYears.length > 0 && (<AcademicYearFilterBar filters={filters} onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} onReset={() => setFilters({ search: '', status: 'all', is_current: 'all', is_enabled: 'all' })} totalCount={academicYears.length} filteredCount={academicYears.length}/>)}

      {/* 5. Content Section (Table vs Empty State) */}
      {academicYears.length === 0 && !isLoading ? (<AcademicYearEmptyState onAddClick={handleOpenAddModal} branch={selectedBranch} hasFilters={hasFilters} onClearFilters={() => setFilters({ search: '', status: 'all', is_current: 'all', is_enabled: 'all' })}/>) : (<AcademicYearTable academicYears={academicYears} onView={handleViewDetails} onEdit={handleOpenEditModal} onConfigureClasses={handleOpenClassesModal} onSetCurrent={handleInitiateSetCurrent} onSetNext={handleInitiateSetNext} onChangeStatus={handleInitiateChangeStatus} onToggleEnabled={handleToggleEnabled} isLoading={isLoading}/>)}

      {/* 6. Modals */}

      {/* Class Configuration for Academic Year Modal */}
      {selectedBranch && (<AcademicYearClassesModal isOpen={isClassesModalOpen} onClose={() => {
                setIsClassesModalOpen(false);
                setClassesModalYear(null);
            }} academicYear={classesModalYear} branch={selectedBranch} showToast={showToast} onClassesUpdated={fetchYears}/>)}

      {/* Add / Edit Form Modal */}
      {selectedBranch && (<AcademicYearFormModal isOpen={isFormModalOpen} onClose={() => {
                setIsFormModalOpen(false);
                setEditingYear(null);
            }} onSubmit={handleFormSubmit} selectedBranch={selectedBranch} initialData={editingYear} existingAcademicYears={academicYears} currentAcademicYear={currentAcademicYear}/>)}

      {/* Change Current Year Confirmation Modal */}
      <ChangeCurrentYearModal isOpen={isChangeCurrentModalOpen} onClose={() => {
            setIsChangeCurrentModalOpen(false);
            setTargetCurrentYear(null);
        }} onConfirm={handleConfirmSetCurrent} targetYear={targetCurrentYear} currentYear={currentAcademicYear} isSubmitting={isUpdatingCurrent}/>

      {/* View Academic Year Details Modal */}
      <AcademicYearDetailsModal isOpen={isDetailsModalOpen} onClose={() => {
            setIsDetailsModalOpen(false);
            setViewingYear(null);
        }} academicYear={viewingYear} onEdit={(ay) => {
            setIsDetailsModalOpen(false);
            handleOpenEditModal(ay);
        }}/>

      {/* Change Academic Year Status Modal */}
      <ChangeAcademicYearStatusModal isOpen={isStatusModalOpen} onClose={() => {
            setIsStatusModalOpen(false);
            setStatusTargetYear(null);
        }} onConfirm={handleConfirmStatusChange} academicYear={statusTargetYear}/>

      {/* Disable Currently Active Academic Year Modal */}
      <DisableCurrentYearModal isOpen={isDisableModalOpen} onClose={() => {
            setIsDisableModalOpen(false);
            setYearToDisable(null);
        }} onConfirm={handleConfirmDisableActiveYear} academicYear={yearToDisable} isSubmitting={isSubmittingDisable}/>
    </div>);
};
