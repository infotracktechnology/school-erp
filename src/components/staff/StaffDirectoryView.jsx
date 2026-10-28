import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  MoreVertical,
  Download,
  Building,
  ShieldCheck,
  Clock,
  Sparkles,
  Key,
  Lock,
  Shield,
  CheckSquare
} from 'lucide-react';
import StaffCredentialsModal from './StaffCredentialsModal';
import BulkCredentialsModal from './BulkCredentialsModal';

export default function StaffDirectoryView({
  staffList,
  loading,
  staffTypeFilter,
  setStaffTypeFilter,
  selectedDepartment,
  setSelectedDepartment,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteStaff,
  onRefresh
}) {
  const [selectedStaffForView, setSelectedStaffForView] = useState(null);

  // Multi-Select Checkboxes State
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedStaffForCredentials, setSelectedStaffForCredentials] = useState(null);
  const [roles, setRoles] = useState([]);

  // Fetch Roles on mount
  useEffect(() => {
    fetch('/api/permissions/roles')
      .then(r => r.json())
      .then(d => {
        const filtered = (d.data || []).filter(r => r.name !== 'Student' && r.name !== 'Parent');
        setRoles(filtered);
      })
      .catch(err => console.error(err));
  }, []);

  const allIds = staffList.map(s => s.id);
  const isAllSelected = allIds.length > 0 && allIds.every(id => selectedStaffIds.includes(id));

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds([...allIds]);
    }
  };

  const handleToggleStaff = (id) => {
    setSelectedStaffIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedStaffIds([]);
  };

  // Departments list for dropdown
  const departments = ['All', ...new Set(staffList.map(s => s.department).filter(Boolean))];

  return (
    <div className="space-y-5">
      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Segmented Teaching / Non-Teaching Filter Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-full lg:w-auto">
            <button
              onClick={() => setStaffTypeFilter('All')}
              className={`flex-1 lg:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                staffTypeFilter === 'All'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Staff ({staffList.length})
            </button>
            <button
              onClick={() => setStaffTypeFilter('Teaching')}
              className={`flex-1 lg:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                staffTypeFilter === 'Teaching'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Teaching Staff
            </button>
            <button
              onClick={() => setStaffTypeFilter('Non-Teaching')}
              className={`flex-1 lg:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                staffTypeFilter === 'Non-Teaching'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Non-Teaching Staff
            </button>
          </div>

          {/* Search Box & Department Select */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, code, phone, role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium"
            >
              <option value="All">All Departments</option>
              {departments.filter(d => d !== 'All').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedStaffIds.length > 0 && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              {selectedStaffIds.length} Staff Selected
            </span>
            <span className="text-xs text-slate-300">
              Apply bulk password mapping or role assignments across selected staff.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Key className="w-3.5 h-3.5" />
              Bulk Reset Credentials
            </button>
            <button
              onClick={handleClearSelection}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold text-xs rounded-lg transition cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Staff Table / Cards View */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-xs text-gray-500">Loading staff records...</p>
          </div>
        ) : staffList.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No staff members found</p>
            <p className="text-xs text-gray-400 mt-1">Try changing filters or add a new staff member</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleAll}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Type & Department</th>
                  <th className="py-3 px-4">ERP Login & Role</th>
                  <th className="py-3 px-4">Academic Responsibilities</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {staffList.map((staff) => (
                  <tr key={staff.id} className={`hover:bg-indigo-50/30 transition-colors ${selectedStaffIds.includes(staff.id) ? 'bg-indigo-50/40' : ''}`}>
                    {/* Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStaffIds.includes(staff.id)}
                        onChange={() => handleToggleStaff(staff.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Staff Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-xs ${
                          staff.staff_type === 'Teaching' 
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {staff.first_name?.[0] || 'S'}
                          {staff.last_name?.[0] || ''}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {staff.first_name} {staff.last_name || ''}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 font-medium">
                              {staff.staff_code}
                            </span>
                            <span>•</span>
                            <span>{staff.qualification || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Department */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          staff.staff_type === 'Teaching'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {staff.staff_type === 'Teaching' ? <GraduationCap className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                          {staff.staff_type}
                        </span>
                        <div className="text-gray-900 font-medium mt-1">{staff.designation}</div>
                        <div className="text-[11px] text-gray-500">{staff.department}</div>
                      </div>
                    </td>

                    {/* ERP Login & Role */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-200/80 rounded px-2 py-0.5 w-fit">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[170px]">{staff.login_username || staff.email || `${staff.staff_code}@school.edu`}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            <Shield className="w-3 h-3 text-indigo-600" />
                            {staff.role_name || 'Staff Member'}
                          </span>
                          <button
                            onClick={() => setSelectedStaffForCredentials(staff)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 transition cursor-pointer"
                            title="Manage Username & Password"
                          >
                            <Key className="w-3 h-3 text-amber-600" />
                            Credentials
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Academic Responsibilities Badges */}
                    <td className="py-3.5 px-4 max-w-[260px]">
                      {staff.staff_type === 'Teaching' ? (
                        <div className="flex flex-wrap gap-1.5">
                          {/* Class Teacher Badge */}
                          {staff.class_teacher_for && staff.class_teacher_for.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Class Teacher: {staff.class_teacher_for.join(', ')}
                            </span>
                          )}

                          {/* Assistant Class Teacher Badge */}
                          {staff.asst_class_teacher_for && staff.asst_class_teacher_for.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold">
                              <Users className="w-3 h-3 text-teal-600" />
                              Asst: {staff.asst_class_teacher_for.join(', ')}
                            </span>
                          )}

                          {/* Class Coordinator Badge */}
                          {staff.coordinator_for && staff.coordinator_for.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              Coordinator: {staff.coordinator_for.join(', ')}
                            </span>
                          )}

                          {/* Subjects Handled */}
                          {staff.subjects_taught && staff.subjects_taught.length > 0 && (
                            <div className="w-full text-[11px] text-gray-600 flex items-center gap-1 mt-0.5">
                              <BookOpen className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{staff.subjects_taught.join(' • ')}</span>
                            </div>
                          )}

                          {/* No assignments */}
                          {(!staff.class_teacher_for?.length && !staff.asst_class_teacher_for?.length && !staff.coordinator_for?.length && !staff.subjects_taught?.length) && (
                            <span className="text-[11px] text-gray-400 italic">No classes assigned yet</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span>Administrative / Support Duty</span>
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{staff.mobile}</span>
                        </div>
                        {staff.email && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[150px]">{staff.email}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        staff.status === 'Active'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : staff.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {staff.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStaffForView(staff)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onOpenEditModal(staff)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff 360 Dossier Modal */}
      {selectedStaffForView && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  selectedStaffForView.staff_type === 'Teaching' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedStaffForView.first_name?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {selectedStaffForView.first_name} {selectedStaffForView.last_name || ''}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">{selectedStaffForView.staff_code} • {selectedStaffForView.designation}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaffForView(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Department</span>
                  <span className="font-semibold text-gray-800">{selectedStaffForView.department}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Staff Type</span>
                  <span className="font-semibold text-gray-800">{selectedStaffForView.staff_type}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Employment</span>
                  <span className="font-semibold text-gray-800">{selectedStaffForView.employment_type} ({selectedStaffForView.status})</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Experience</span>
                  <span className="font-semibold text-gray-800">{selectedStaffForView.experience_years} Years</span>
                </div>
              </div>

              {/* Roles */}
              {selectedStaffForView.staff_type === 'Teaching' && (
                <div className="space-y-1.5 border border-indigo-100 bg-indigo-50/30 p-3 rounded-xl">
                  <h4 className="font-bold text-indigo-900 text-[11px] uppercase tracking-wider">Academic Allocations</h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">Class Teacher:</span> {selectedStaffForView.class_teacher_for?.join(', ') || 'None'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Assistant Class Teacher:</span> {selectedStaffForView.asst_class_teacher_for?.join(', ') || 'None'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Class Coordinator:</span> {selectedStaffForView.coordinator_for?.join(', ') || 'None'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Subjects:</span> {selectedStaffForView.subjects_taught?.join(', ') || 'None'}
                  </p>
                </div>
              )}

              {/* Contact Details */}
              <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-1">Contact & Joining</h4>
                <p className="text-gray-600">📞 Phone: <span className="font-medium text-gray-900">{selectedStaffForView.mobile}</span></p>
                <p className="text-gray-600">✉️ Email: <span className="font-medium text-gray-900">{selectedStaffForView.email || 'N/A'}</span></p>
                <p className="text-gray-600">📅 Date of Joining: <span className="font-medium text-gray-900">{selectedStaffForView.date_of_joining}</span></p>
                <p className="text-gray-600">🎓 Qualification: <span className="font-medium text-gray-900">{selectedStaffForView.qualification || 'N/A'}</span></p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedStaffForView(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Single Credentials Modal */}
      <StaffCredentialsModal
        isOpen={Boolean(selectedStaffForCredentials)}
        onClose={() => setSelectedStaffForCredentials(null)}
        staff={selectedStaffForCredentials}
        roles={roles}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />

      {/* Bulk Credentials Modal */}
      <BulkCredentialsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedStaffIds={selectedStaffIds}
        roles={roles}
        onSuccess={() => {
          setSelectedStaffIds([]);
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
}
