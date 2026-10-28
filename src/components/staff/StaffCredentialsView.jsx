import React, { useState } from 'react';
import {
  Key,
  Shield,
  Phone,
  Calendar,
  Lock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  CheckSquare,
  Square,
  GraduationCap,
  Building,
  Mail,
  RefreshCw,
  Save
} from 'lucide-react';
import staffService from '../../services/staffService';
import StaffCredentialsModal from './StaffCredentialsModal';

export default function StaffCredentialsView({
  staffList = [],
  loading = false,
  onRefresh
}) {
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [staffTypeFilter, setStaffTypeFilter] = useState('All');

  // Formula state
  const [passwordPattern, setPasswordPattern] = useState('mobile'); // 'mobile', 'dob', 'default', 'custom'
  const [customPassword, setCustomPassword] = useState('');
  const [usernamePattern, setUsernamePattern] = useState('keep'); // 'keep', 'email', 'code', 'mobile'

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Single Staff Modal
  const [selectedStaffForModal, setSelectedStaffForModal] = useState(null);

  // Departments list for filter
  const departments = ['All', ...new Set(staffList.map(s => s.department).filter(Boolean))];

  // Filtered staff
  const filteredStaff = staffList.filter(s => {
    const matchesSearch = !searchQuery.trim() || 
      `${s.first_name} ${s.last_name || ''} ${s.staff_code} ${s.mobile} ${s.email || ''} ${s.designation}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchesType = staffTypeFilter === 'All' || s.staff_type === staffTypeFilter;
    return matchesSearch && matchesDept && matchesType;
  });

  const filteredIds = filteredStaff.map(s => s.id);
  const isAllSelected = filteredIds.length > 0 && filteredIds.every(id => selectedStaffIds.includes(id));

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedStaffIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedStaffIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleToggleStaff = (id) => {
    setSelectedStaffIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    setSelectedStaffIds(filteredIds);
  };

  const handleClearSelection = () => {
    setSelectedStaffIds([]);
  };

  // Helper to format DOB to DDMMYYYY
  const formatDob = (dobString) => {
    if (!dobString) return null;
    const d = new Date(dobString);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  // Bulk Apply Handler
  const handleBulkApply = async () => {
    if (selectedStaffIds.length === 0) {
      setErrorMessage('Please select at least one staff member.');
      return;
    }
    if (passwordPattern === 'custom' && !customPassword.trim()) {
      setErrorMessage('Please enter a custom password.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    try {
      setSaving(true);
      const res = await staffService.bulkUpdateCredentials({
        staff_ids: selectedStaffIds,
        password_pattern: passwordPattern,
        custom_password: customPassword.trim(),
        username_pattern: usernamePattern
      });
      setSuccessMessage(res.message || 'Credentials updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
      if (onRefresh) onRefresh();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                Staff Sub-Menu
              </span>
              <span className="text-xs text-slate-400">Security & Access Management</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Bulk Reset Staff ERP Credentials</h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Configure or batch-reset login passwords and usernames for staff using smart column formulas (Mobile Phone, Date of Birth DDMMYYYY, or Default Password).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-xl font-bold">
              {staffList.length} Total Staff Accounts
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="font-bold text-red-500">✕</button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="font-bold text-emerald-600">✕</button>
        </div>
      )}

      {/* Formula Control Dashboard */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Step 1: Choose Credential Reset Formula</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Select the password and username pattern to apply across your selected staff.
            </p>
          </div>
          
          <button
            onClick={handleBulkApply}
            disabled={saving || selectedStaffIds.length === 0}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Key className="w-4 h-4" />
            {saving ? 'Resetting Credentials...' : `Reset Credentials for ${selectedStaffIds.length} Selected`}
          </button>
        </div>

        {/* Password Patterns */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Password Pattern:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div
              onClick={() => setPasswordPattern('mobile')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                passwordPattern === 'mobile'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Phone className="w-4 h-4 text-sky-600" />
                <span>Mobile Phone</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Each staff's password is set to their own mobile number
              </p>
            </div>

            <div
              onClick={() => setPasswordPattern('dob')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                passwordPattern === 'dob'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>DOB (DDMMYYYY)</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Formatted birthdate (e.g., 15081992 for Aug 15, 1992)
              </p>
            </div>

            <div
              onClick={() => setPasswordPattern('default')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                passwordPattern === 'default'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Default Password</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Resets password to standard <strong>School@123</strong>
              </p>
            </div>

            <div
              onClick={() => setPasswordPattern('custom')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                passwordPattern === 'custom'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Custom Password</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Specify a common new password for all selected
              </p>
            </div>
          </div>

          {passwordPattern === 'custom' && (
            <div className="pt-2 max-w-sm">
              <input
                type="text"
                placeholder="Enter custom password..."
                value={customPassword}
                onChange={e => setCustomPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Username Patterns */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Username Mapping:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="view_user_pattern"
                checked={usernamePattern === 'keep'}
                onChange={() => setUsernamePattern('keep')}
                className="text-indigo-600"
              />
              <span className="font-semibold text-gray-800">Keep Current Username</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="view_user_pattern"
                checked={usernamePattern === 'email'}
                onChange={() => setUsernamePattern('email')}
                className="text-indigo-600"
              />
              <span className="font-semibold text-gray-800">Staff Email ID</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="view_user_pattern"
                checked={usernamePattern === 'code'}
                onChange={() => setUsernamePattern('code')}
                className="text-indigo-600"
              />
              <span className="font-semibold text-gray-800">Staff Code</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="view_user_pattern"
                checked={usernamePattern === 'mobile'}
                onChange={() => setUsernamePattern('mobile')}
                className="text-indigo-600"
              />
              <span className="font-semibold text-gray-800">Mobile Phone</span>
            </label>
          </div>
        </div>
      </div>

      {/* Step 2: Staff Selection Table */}
      <div className="space-y-4">
        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
            >
              {departments.map(d => (
                <option key={d} value={d}>Dept: {d}</option>
              ))}
            </select>

            {/* Staff Type */}
            <select
              value={staffTypeFilter}
              onChange={e => setStaffTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
            >
              <option value="All">All Types</option>
              <option value="Teaching">Teaching Only</option>
              <option value="Non-Teaching">Non-Teaching Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAllFiltered}
              className="px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
            >
              Select All Filtered ({filteredStaff.length})
            </button>
            {selectedStaffIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                Clear ({selectedStaffIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              <p className="mt-2 text-xs text-gray-500">Loading staff records...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400">
              No staff members found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleAll}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Phone / Mobile</th>
                    <th className="py-3 px-4">DOB & Formula Preview</th>
                    <th className="py-3 px-4">Current Login Username</th>
                    <th className="py-3 px-4">Master Role</th>
                    <th className="py-3 px-4 text-right">Individual Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStaff.map(staff => {
                    const dobCode = formatDob(staff.date_of_birth);
                    const isSelected = selectedStaffIds.includes(staff.id);
                    return (
                      <tr key={staff.id} className={`hover:bg-indigo-50/30 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleStaff(staff.id)}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                              {staff.first_name?.[0]}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {staff.first_name} {staff.last_name || ''}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {staff.staff_code} • {staff.department}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-gray-700">
                          {staff.mobile || <span className="text-gray-300 italic">Not available</span>}
                        </td>
                        <td className="py-3 px-4">
                          {dobCode ? (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                              <Calendar className="w-3 h-3 text-amber-600" />
                              {dobCode} ({staff.date_of_birth ? new Date(staff.date_of_birth).toISOString().slice(0, 10) : ''})
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-300 italic">No DOB set</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-gray-800">
                          {staff.login_username || staff.email || `${staff.staff_code}@school.edu`}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            <Shield className="w-3 h-3 text-indigo-600" />
                            {staff.role_name || 'Staff Member'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedStaffForModal(staff)}
                            className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                          >
                            Edit Credentials
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Individual Modal */}
      {selectedStaffForModal && (
        <StaffCredentialsModal
          isOpen={Boolean(selectedStaffForModal)}
          onClose={() => setSelectedStaffForModal(null)}
          staff={selectedStaffForModal}
          roles={[]}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
