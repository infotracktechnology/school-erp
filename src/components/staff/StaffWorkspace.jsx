import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Building,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  Plus
} from 'lucide-react';
import staffService from '../../services/staffService';
import { useErp } from '../../context/ErpContext';
import { Card } from '@/components/ui/card';
import StaffDirectoryView from './StaffDirectoryView';
import AcademicAllocationsView from './AcademicAllocationsView';
import TeachingWorkloadView from './TeachingWorkloadView';
import StaffCredentialsView from './StaffCredentialsView';
import AddStaffModal from './AddStaffModal';

export default function StaffWorkspace() {
  const { subTab } = useParams();
  const navigate = useNavigate();
  const { activeBranchId, effectiveActiveBranchId } = useErp();

  // Active view matches subTab in url
  // Options: 'directory' (default), 'allocations', 'workload', 'credentials'
  const activeTab = subTab || 'directory';

  const branchId = Number(activeBranchId || effectiveActiveBranchId || 1);
  const [staffList, setStaffList] = useState([]);
  const [stats, setStats] = useState({ total_staff: 0, teaching_staff: 0, non_teaching_staff: 0, active_staff: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [staffTypeFilter, setStaffTypeFilter] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await staffService.getStaffList({
        branch_id: branchId,
        staff_type: staffTypeFilter,
        department: selectedDepartment,
        search: searchQuery
      });
      setStaffList(res.data || []);
      if (res.stats) setStats(res.stats);
    } catch (err) {
      console.error('[StaffWorkspace Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [branchId, staffTypeFilter, selectedDepartment, searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Staff */}
        <Card className="rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total_staff || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        {/* Teaching Staff */}
        <Card className="rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Teaching Staff</p>
            <p className="text-2xl font-black text-sky-700 mt-1">{stats.teaching_staff || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
        </Card>

        {/* Non-Teaching Staff */}
        <Card className="rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Non-Teaching</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{stats.non_teaching_staff || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
        </Card>

        {/* Active Today */}
        <Card className="rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Staff</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.active_staff || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Render Direct Sub-view based on Sidebar URL */}
      {activeTab === 'directory' && (
        <StaffDirectoryView
          staffList={staffList}
          loading={loading}
          staffTypeFilter={staffTypeFilter}
          setStaffTypeFilter={setStaffTypeFilter}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddModal={() => {
            setEditingStaff(null);
            setIsAddModalOpen(true);
          }}
          onOpenEditModal={(staff) => {
            setEditingStaff(staff);
            setIsAddModalOpen(true);
          }}
          onDeleteStaff={async (id) => {
            if (confirm('Are you sure you want to delete this staff member?')) {
              await staffService.deleteStaff(id);
              fetchStaff();
            }
          }}
          onRefresh={fetchStaff}
        />
      )}

      {activeTab === 'allocations' && (
        <AcademicAllocationsView branchId={branchId} academicYearId={2} />
      )}

      {activeTab === 'workload' && (
        <TeachingWorkloadView branchId={branchId} />
      )}

      {activeTab === 'credentials' && (
        <StaffCredentialsView
          staffList={staffList}
          loading={loading}
          onRefresh={fetchStaff}
        />
      )}

      {/* Add / Edit Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchStaff}
        branchId={branchId}
        editStaff={editingStaff}
      />
    </div>
  );
}
