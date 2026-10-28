import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useErp } from '../context/ErpContext';
import { getBranches, getOrganization, updateBranchStatus } from '../services/api';
import { BranchManagementHeader } from '../components/branches/BranchManagementHeader';
import { BranchStats } from '../components/branches/BranchStats';
import { BranchFilterBar } from '../components/branches/BranchFilterBar';
import { BranchTable } from '../components/branches/BranchTable';
import { BranchFormModal } from '../components/branches/BranchFormModal';
import { BranchCreatedSuccessModal } from '../components/branches/BranchCreatedSuccessModal';
import { BranchProfileModal } from '../components/branches/BranchProfileModal';
import { DeactivateBranchModal } from '../components/branches/DeactivateBranchModal';
import { BranchSettingsModal } from '../components/branches/BranchSettingsModal';
import { EmptyState } from '../components/common/EmptyState';

export const BranchesPage = ({ showToast }) => {
  const { branches: contextBranches, refreshBranches, isSuperAdmin, isPrincipal, assignedBranchId, assignedBranch } = useErp();
  const [branches, setBranches] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    branch_type: 'all',
    board: 'all',
    status: 'all',
    state: 'all'
  });

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [newlyCreatedBranch, setNewlyCreatedBranch] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [branchToToggleStatus, setBranchToToggleStatus] = useState(null);
  const [isStatusToggling, setIsStatusToggling] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [branchForSettings, setBranchForSettings] = useState(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const [orgRes, branchList] = await Promise.all([
        getOrganization(),
        getBranches(filters)
      ]);
      setStats(orgRes.stats);
      setBranches(branchList);
    } catch (err) {
      console.error('Error loading branches:', err);
      if (showToast) showToast(err.message || 'Error loading branches', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Principal only sees their assigned branch
      if (isPrincipal && Number(branch.id) !== Number(assignedBranchId)) {
        return false;
      }
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = branch.branch_name.toLowerCase().includes(query);
        const matchesCode = branch.branch_code.toLowerCase().includes(query);
        const matchesCity = branch.city.toLowerCase().includes(query);
        const matchesHead = (branch.branch_head_name || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesCity && !matchesHead) {
          return false;
        }
      }
      if (filters.branch_type !== 'all' && branch.branch_type !== filters.branch_type) return false;
      if (filters.board !== 'all' && branch.board !== filters.board) return false;
      if (filters.status !== 'all' && branch.status !== filters.status) return false;
      if (filters.state !== 'all' && branch.state !== filters.state) return false;
      return true;
    });
  }, [branches, filters]);

  const handleOpenAddBranch = () => {
    setBranchToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditBranch = (branch) => {
    setBranchToEdit(branch);
    setIsAddEditOpen(true);
  };

  const handleOpenViewBranch = (branch) => {
    setSelectedBranch(branch);
    setIsViewOpen(true);
  };

  const handleOpenSettings = (branch) => {
    setBranchForSettings(branch);
    setIsSettingsModalOpen(true);
  };

  const handleToggleStatusClick = (branch) => {
    setBranchToToggleStatus(branch);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!branchToToggleStatus) return;
    const newStatus = branchToToggleStatus.status === 'Active' ? 'Inactive' : 'Active';
    setIsStatusToggling(true);
    try {
      await updateBranchStatus(branchToToggleStatus.id, newStatus);
      if (showToast) {
        showToast(
          `Branch "${branchToToggleStatus.branch_name}" ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`,
          'success'
        );
      }
      setBranches((prev) =>
        prev.map((b) => (b.id === branchToToggleStatus.id ? { ...b, status: newStatus } : b))
      );
      if (refreshBranches) refreshBranches();
      getOrganization().then((res) => setStats(res.stats));
      setIsDeactivateModalOpen(false);
      setBranchToToggleStatus(null);
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update branch status', 'error');
    } finally {
      setIsStatusToggling(false);
    }
  };

  const handleFormSuccess = (savedBranch, isEditMode) => {
    setIsAddEditOpen(false);
    if (isEditMode) {
      if (showToast) showToast(`Branch "${savedBranch.branch_name}" updated successfully`, 'success');
      setBranches((prev) => prev.map((b) => (b.id === savedBranch.id ? savedBranch : b)));
    } else {
      setBranches((prev) => [savedBranch, ...prev]);
      setNewlyCreatedBranch(savedBranch);
      setIsSuccessModalOpen(true);
    }
    if (refreshBranches) refreshBranches();
    getOrganization().then((res) => setStats(res.stats));
  };

  return (
    <div className="space-y-6">
      <BranchManagementHeader
        onAddBranch={isSuperAdmin ? handleOpenAddBranch : undefined}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        totalCount={filteredBranches.length}
      />

      {isPrincipal && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-teal-900">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <div>
              <span className="font-bold">Principal Scoped View:</span> Showing only your assigned campus (
              <span className="font-semibold text-teal-800">{assignedBranch?.branch_name || 'Assigned Branch'}</span>
              ). Organization-level branch creation & management is reserved for Super Admin.
            </div>
          </div>
        </div>
      )}

      <BranchStats stats={stats} />

      <BranchFilterBar
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onClearFilters={() =>
          setFilters({ search: '', branch_type: 'all', board: 'all', status: 'all', state: 'all' })
        }
        totalFilteredCount={filteredBranches.length}
      />

      {isLoading ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Loading school branches...</p>
          <p className="text-xs text-slate-400">Communicating with centralized database</p>
        </div>
      ) : branches.length === 0 ? (
        <EmptyState onAddBranch={handleOpenAddBranch} />
      ) : filteredBranches.length === 0 ? (
        <EmptyState
          isSearchFiltered={true}
          onAddBranch={handleOpenAddBranch}
          onClearFilters={() =>
            setFilters({ search: '', branch_type: 'all', board: 'all', status: 'all', state: 'all' })
          }
        />
      ) : (
        <BranchTable
          branches={filteredBranches}
          onView={handleOpenViewBranch}
          onEdit={handleOpenEditBranch}
          onSettings={handleOpenSettings}
          onToggleStatus={handleToggleStatusClick}
        />
      )}

      {/* Modals */}
      <BranchFormModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        branchToEdit={branchToEdit}
        onSuccess={handleFormSuccess}
      />

      <BranchProfileModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        branch={selectedBranch}
        onEdit={handleOpenEditBranch}
      />

      <BranchCreatedSuccessModal
        isOpen={isSuccessModalOpen}
        branch={newlyCreatedBranch}
        onClose={() => setIsSuccessModalOpen(false)}
        onContinueSetup={(branch) => {
          setIsSuccessModalOpen(false);
          setBranchForSettings(branch);
          setIsSettingsModalOpen(true);
        }}
      />

      <DeactivateBranchModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        branch={branchToToggleStatus}
        onConfirm={handleConfirmToggleStatus}
        isLoading={isStatusToggling}
      />

      <BranchSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        branch={branchForSettings}
      />
    </div>
  );
};

export default BranchesPage;
