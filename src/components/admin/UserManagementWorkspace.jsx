import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, UserPlus, Shield, Building2, Key, Search, RefreshCw, 
  CheckCircle2, XCircle, MoreVertical, Edit2, Trash2, Eye, EyeOff,
  AlertCircle, ShieldCheck, Mail, Calendar, Check, Sparkles, Filter
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { useErp } from '../../context/ErpContext';

export const UserManagementWorkspace = () => {
  const { branches, showToast, isSuperAdmin, effectiveActiveBranchId, activeBranchId, assignedBranchId } = useErp();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Default to active selected branch if specific branch is active, else '' (all)
  const defaultBranch = (!isSuperAdmin || (effectiveActiveBranchId && effectiveActiveBranchId !== 'all'))
    ? String(effectiveActiveBranchId || assignedBranchId || '1')
    : '';

  const [branchFilter, setBranchFilter] = useState(defaultBranch);

  // Sync branchFilter when top-bar active branch switches
  useEffect(() => {
    if (!isSuperAdmin) {
      setBranchFilter(String(assignedBranchId || '1'));
    } else if (effectiveActiveBranchId && effectiveActiveBranchId !== 'all') {
      setBranchFilter(String(effectiveActiveBranchId));
    }
  }, [effectiveActiveBranchId, assignedBranchId, isSuperAdmin]);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states for Create User
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '2', // Default: Branch Admin / Principal
    branch_id: defaultBranch || '1',
    status: 'Active'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Reset Password
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('role_id', roleFilter);
      if (branchFilter) params.append('branch_id', branchFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data || []);
        setStats(json.stats || {});
      } else {
        showToast(json.message || 'Failed to fetch users', 'error');
      }
    } catch (err) {
      showToast('Error connecting to users service', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, branchFilter, searchTerm, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Create User
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showToast('Please fill all required fields.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'User created successfully!', 'success');
        setIsCreateModalOpen(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          role_id: '2',
          branch_id: '1',
          status: 'Active'
        });
        fetchUsers();
      } else {
        showToast(data.message || 'Failed to create user', 'error');
      }
    } catch (err) {
      showToast('Error creating user account', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      showToast('Password must be at least 4 characters long.', 'warning');
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Password reset successfully for ${selectedUser.name}!`, 'success');
        setIsResetPasswordModalOpen(false);
        setNewPassword('');
        setSelectedUser(null);
      } else {
        showToast(data.message || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showToast('Error resetting password', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`User marked as ${newStatus}`, 'success');
        fetchUsers();
      } else {
        showToast(data.message || 'Failed to update user status', 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  // Auto-generate strong secure password helper
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Administrative User Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create and manage Super Admins, Campus Principals, and Accountants with role grade hierarchy.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs flex items-center justify-center space-x-2 shrink-0"
        >
          <UserPlus className="w-4 h-4 mr-1.5" />
          <span>Create New User</span>
        </Button>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Administrative Users</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.total || users.length}</span>
        </Card>
        <Card className="p-4 shadow-xs">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">Super Admins</span>
          <span className="text-2xl font-extrabold text-indigo-700 mt-1 block">{stats.super_admins || 0}</span>
        </Card>
        <Card className="p-4 shadow-xs">
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider block">Campus Principals</span>
          <span className="text-2xl font-extrabold text-teal-700 mt-1 block">{stats.branch_admins || 0}</span>
        </Card>
        <Card className="p-4 shadow-xs">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block">Accountants</span>
          <span className="text-2xl font-extrabold text-amber-700 mt-1 block">{stats.accountants || 0}</span>
        </Card>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="1">Super Admin (id: 1)</option>
            <option value="2">Branch Admin / Principal (id: 2)</option>
            <option value="6">Accountant (id: 6)</option>
          </select>

          {/* Branch Filter */}
          {isSuperAdmin ? (
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">All Campuses</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.branch_name}</option>
              ))}
            </select>
          ) : (
            <div className="text-xs bg-indigo-50/80 text-indigo-700 border border-indigo-200 rounded-lg px-3 py-2 font-bold flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{branches.find(b => Number(b.id) === Number(assignedBranchId))?.branch_name || 'My Campus'}</span>
            </div>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="Reload List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left border-collapse">
            <TableHeader className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <TableRow>
                <TableHead className="py-3.5 px-4">User Details</TableHead>
                <TableHead className="py-3.5 px-4">Role / Grade</TableHead>
                <TableHead className="py-3.5 px-4">Assigned Campus</TableHead>
                <TableHead className="py-3.5 px-4">Status</TableHead>
                <TableHead className="py-3.5 px-4">Created Date</TableHead>
                <TableHead className="py-3.5 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Loading users directory...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No users found matching your filters</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search criteria or create a new user.</p>
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const isSA = u.role_id === 1;
                  const isPR = u.role_id === 2;
                  const isACC = u.role_id === 6;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                            isSA 
                              ? 'bg-gradient-to-tr from-indigo-600 to-purple-600' 
                              : isPR 
                              ? 'bg-gradient-to-tr from-teal-600 to-emerald-600' 
                              : 'bg-gradient-to-tr from-amber-500 to-orange-600'
                          }`}>
                            {u.name ? u.name[0] : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{u.email}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isSA 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                            : isPR 
                            ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {u.role_name || (isSA ? 'Super Admin' : isPR ? 'Branch Admin / Principal' : 'Accountant')}
                        </span>
                      </td>

                      {/* Campus */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {isSA ? (
                          <span className="text-indigo-600 font-bold text-[11px] bg-indigo-50/60 px-2 py-0.5 rounded-md">
                            All Campuses
                          </span>
                        ) : (
                          u.branch_name || 'Assigned Branch'
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            u.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          <span>{u.status || 'Active'}</span>
                        </button>
                      </td>

                      {/* Created date */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setIsResetPasswordModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* CREATE NEW USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create Administrative User</h3>
                  <p className="text-xs text-slate-500">Create an authorized admin account with grade level.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. rajesh@campuseye.com"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Password with Auto-generate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                    placeholder="Enter or generate password"
                    required
                    className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Role / Grade <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData(p => ({ ...p, role_id: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
                >
                  <option value="2">🏛️ Principal / Branch Admin (Campus Scope)</option>
                  <option value="1">👑 Super Admin (Full Enterprise Scope)</option>
                  <option value="6">💼 Accountant / Billing Admin</option>
                </select>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {formData.role_id === '1' 
                    ? 'Super Admin receives full management rights across all school campuses.'
                    : 'Principals and Accountants are scoped strictly to their assigned campus.'}
                </span>
              </div>

              {/* Campus Scope (conditional) */}
              {formData.role_id !== '1' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Campus <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.branch_id}
                    onChange={(e) => setFormData(p => ({ ...p, branch_id: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.branch_name} ({b.branch_code || 'BR'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-700 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Super Admin is automatically assigned organization-wide access (All Campuses).</span>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-4">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500">For user: <strong className="text-slate-800">{selectedUser.name}</strong></p>
              </div>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                  required
                  autoFocus
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPasswordModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isResetting ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementWorkspace;
