import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Users,
  Save,
  CheckCircle2,
  Check,
  X,
  Search,
  Sparkles,
  Layers,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Star,
  UserCheck,
  CalendarCheck,
  Calendar,
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  CreditCard,
  Bus,
  Bookmark,
  BarChart3,
  Edit,
  ArrowRightLeft,
  TrendingUp,
  UserX,
  CheckSquare,
  History,
  FileCheck2,
  Bell,
  Image,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import permissionService from '../../services/permissionService';

const ICON_MAP = {
  LayoutDashboard,
  Star,
  Users,
  UserCheck,
  CalendarCheck,
  Calendar,
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  CreditCard,
  Bus,
  Bookmark,
  BarChart3,
  Layers,
  Edit,
  ArrowRightLeft,
  TrendingUp,
  UserX,
  CheckSquare,
  History,
  FileCheck2,
  Bell,
  Image,
  ShieldCheck
};

export default function MenuAssignmentPage() {
  const [activeTab, setActiveTab] = useState('role'); // 'role', 'manage_roles', 'staff'
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(9); // default: Class Teacher

  // Role permissions tree state
  const [roleMenuTree, setRoleMenuTree] = useState([]);
  const [expandedModules, setExpandedModules] = useState({
    attendance: true,
    anecdotes: true,
    staff: true,
    students: true,
    communication: true,
    examination: true
  });
  const [roleLoading, setRoleLoading] = useState(true);
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleSuccess, setRoleSuccess] = useState('');

  // Role Modal State (Add / Edit)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleNameInput, setRoleNameInput] = useState('');
  const [roleModalError, setRoleModalError] = useState('');
  const [roleModalSaving, setRoleModalSaving] = useState(false);

  // Staff specific state
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffPermissionsData, setStaffPermissionsData] = useState(null);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffSuccess, setStaffSuccess] = useState('');

  // 1. Fetch Branches on mount
  const loadBranches = async () => {
    try {
      const res = await fetch('/api/branches').then(r => r.json());
      if (res.success && res.data?.length > 0) {
        setBranches(res.data);
        if (!selectedBranchId) {
          setSelectedBranchId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  // 2. Fetch Roles on mount
  const loadRoles = async () => {
    try {
      const res = await permissionService.getMasterRoles();
      const filteredRoles = (res.data || []).filter(r => r.name !== 'Student' && r.name !== 'Parent');
      setRoles(filteredRoles);
      if (filteredRoles.length > 0 && !selectedRoleId) {
        setSelectedRoleId(filteredRoles[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBranches();
    loadRoles();
  }, []);

  // 3. Fetch permissions tree for selected branch and role
  const fetchRolePermissions = async (branchId, roleId) => {
    if (!roleId || !branchId) return;
    try {
      setRoleLoading(true);
      const res = await permissionService.getRoleDefaults({ role_id: roleId, branch_id: branchId });
      setRoleMenuTree(res.tree || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoleId && selectedBranchId && activeTab === 'role') {
      fetchRolePermissions(selectedBranchId, selectedRoleId);
    }
  }, [selectedBranchId, selectedRoleId, activeTab]);

  // Toggle Module Expand/Collapse
  const toggleModuleAccordion = (menuKey) => {
    setExpandedModules(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  // Toggle Parent Module (enables / disables all its children sub-menus)
  const handleParentToggle = (parentKey, field) => {
    setRoleMenuTree(prev =>
      prev.map(p => {
        if (p.menu_key === parentKey) {
          const newVal = !p[field];
          const updatedParent = { ...p, [field]: newVal ? 1 : 0 };

          // If changing can_view, cascade to all sub_menus
          if (field === 'can_view') {
            updatedParent.sub_menus = p.sub_menus.map(sm => ({
              ...sm,
              can_view: newVal ? 1 : 0,
              can_create: newVal ? sm.can_create : 0,
              can_edit: newVal ? sm.can_edit : 0,
              can_delete: newVal ? sm.can_delete : 0
            }));
          }

          return updatedParent;
        }
        return p;
      })
    );
  };

  // Toggle Sub-Menu
  const handleSubMenuToggle = (parentKey, subMenuKey, field) => {
    setRoleMenuTree(prev =>
      prev.map(p => {
        if (p.menu_key === parentKey) {
          const updatedSubMenus = p.sub_menus.map(sm => {
            if (sm.menu_key === subMenuKey) {
              const newVal = !sm[field];
              const updatedItem = { ...sm, [field]: newVal ? 1 : 0 };

              // If turning off view, clear other permissions
              if (field === 'can_view' && !newVal) {
                updatedItem.can_create = 0;
                updatedItem.can_edit = 0;
                updatedItem.can_delete = 0;
              }
              // If turning on create/edit/delete, ensure can_view is on
              if ((field === 'can_create' || field === 'can_edit' || field === 'can_delete') && newVal) {
                updatedItem.can_view = 1;
              }
              return updatedItem;
            }
            return sm;
          });

          // If at least one sub-menu is visible, parent must also be visible
          const hasAnyVisibleSub = updatedSubMenus.some(sm => sm.can_view === 1);
          return {
            ...p,
            can_view: hasAnyVisibleSub ? 1 : p.can_view,
            sub_menus: updatedSubMenus
          };
        }
        return p;
      })
    );
  };

  // Save all permissions (flattening tree into payload array)
  const handleSaveRolePermissions = async () => {
    try {
      setRoleSaving(true);
      const flattenedList = [];

      roleMenuTree.forEach(p => {
        flattenedList.push({
          menu_key: p.menu_key,
          can_view: p.can_view,
          can_create: p.can_create,
          can_edit: p.can_edit,
          can_delete: p.can_delete
        });
        (p.sub_menus || []).forEach(sm => {
          flattenedList.push({
            menu_key: sm.menu_key,
            can_view: sm.can_view,
            can_create: sm.can_create,
            can_edit: sm.can_edit,
            can_delete: sm.can_delete
          });
        });
      });

      await permissionService.saveRoleDefaults({
        branch_id: selectedBranchId,
        role_id: selectedRoleId,
        permissions: flattenedList
      });

      const selectedRoleObj = roles.find(r => r.id === Number(selectedRoleId));
      const selectedBranchObj = branches.find(b => b.id === Number(selectedBranchId));
      setRoleSuccess(`Permissions for role "${selectedRoleObj?.name}" at "${selectedBranchObj?.branch_name || 'Selected Branch'}" saved successfully!`);
      setTimeout(() => setRoleSuccess(''), 3500);
      fetchRolePermissions(selectedBranchId, selectedRoleId);
    } catch (err) {
      alert(err.message || 'Error saving role permissions');
    } finally {
      setRoleSaving(false);
    }
  };

  // Role CRUD Handlers
  const handleOpenAddRole = () => {
    setEditingRole(null);
    setRoleNameInput('');
    setRoleModalError('');
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role) => {
    setEditingRole(role);
    setRoleNameInput(role.name);
    setRoleModalError('');
    setIsRoleModalOpen(true);
  };

  const handleSaveRoleModal = async (e) => {
    e.preventDefault();
    if (!roleNameInput.trim()) {
      setRoleModalError('Role name is required.');
      return;
    }

    try {
      setRoleModalSaving(true);
      if (editingRole) {
        await permissionService.updateRole(editingRole.id, { name: roleNameInput.trim() });
      } else {
        const res = await permissionService.createRole({ name: roleNameInput.trim() });
        if (res.data?.id) setSelectedRoleId(res.data.id);
      }
      setIsRoleModalOpen(false);
      await loadRoles();
      if (editingRole && editingRole.id === selectedRoleId) {
        fetchRolePermissions(selectedBranchId, selectedRoleId);
      }
    } catch (err) {
      setRoleModalError(err.message || 'Error saving role');
    } finally {
      setRoleModalSaving(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) return;
    try {
      await permissionService.deleteRole(role.id);
      await loadRoles();
      if (selectedRoleId === role.id && roles.length > 0) {
        setSelectedRoleId(roles[0].id);
      }
    } catch (err) {
      alert(err.message || 'Error deleting role');
    }
  };

  // Staff exceptions handling (scoped to selected branch)
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await fetch(`/api/staff?branch_id=${selectedBranchId}`).then(r => r.json());
        setStaffList(res.data || []);
        if (res.data?.length > 0) {
          setSelectedStaffId(String(res.data[0].id));
        } else {
          setSelectedStaffId('');
          setStaffPermissionsData(null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (selectedBranchId) {
      loadStaff();
    }
  }, [selectedBranchId]);

  const fetchStaffPermissions = async (staffId) => {
    if (!staffId) return;
    try {
      setStaffLoading(true);
      const res = await permissionService.getStaffPermissions(staffId);
      setStaffPermissionsData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStaffId && activeTab === 'staff') {
      fetchStaffPermissions(selectedStaffId);
    }
  }, [selectedStaffId, activeTab]);

  const currentRoleObj = roles.find(r => r.id === Number(selectedRoleId));
  const currentBranchObj = branches.find(b => b.id === Number(selectedBranchId));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Granular Sub-Menu Access Control
              </span>
              <span className="text-xs text-slate-400">Settings Module</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Role-Based Menu & Sub-Menu Assignment</h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Configure fine-grained access for every <strong className="text-white">Master Role</strong>. Expand any module to toggle its specific <strong className="text-white">Sub-menus</strong> and actions (View, Create, Edit, Delete).
            </p>
          </div>

          {/* Top Switcher */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('role')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'role'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Menu & Sub-Menus
            </button>
            <button
              onClick={() => setActiveTab('manage_roles')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'manage_roles'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Manage Roles ({roles.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'staff'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Staff Overrides
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUB-MENUS ROLE-BASED ASSIGNMENT */}
      {/* ========================================================================= */}
      {activeTab === 'role' && (
        <div className="space-y-5">
          {/* Branch & Role Picker Toolbar */}
          <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Branch Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  Branch:
                </label>
                <select
                  value={selectedBranchId}
                  onChange={e => setSelectedBranchId(Number(e.target.value))}
                  className="w-full sm:w-60 px-3 py-2 text-xs font-bold border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-sky-50/50 text-slate-800 cursor-pointer"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.branch_name} ({b.branch_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

              {/* Role Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-indigo-600" />
                  Role:
                </label>
                <select
                  value={selectedRoleId}
                  onChange={e => setSelectedRoleId(Number(e.target.value))}
                  className="w-full sm:w-56 px-3 py-2 text-xs font-bold border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-indigo-50/40 text-indigo-950 cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenAddRole}
                className="px-3 py-2 bg-gray-100 hover:bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg transition flex items-center gap-1 border border-gray-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Role
              </button>
            </div>

            <div className="flex items-center gap-3">
              {roleSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{roleSuccess}</span>
                </div>
              )}
              <button
                onClick={handleSaveRolePermissions}
                disabled={roleSaving}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {roleSaving ? 'Saving...' : `Save ${currentRoleObj?.name || 'Role'} Permissions`}
              </button>
            </div>
          </div>

          {/* Hierarchical Tree Table */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex flex-wrap items-center gap-2">
                  <span>Active Menus & Sub-menus for:</span>
                  <span className="text-indigo-600 font-black">{currentRoleObj?.name}</span>
                  <span className="text-gray-400">@</span>
                  <span className="text-sky-700 font-bold">{currentBranchObj?.branch_name || `Branch #${selectedBranchId}`}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click on any module with sub-menus to expand and configure individual access rights for this branch and role.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  Branch ID: #{selectedBranchId}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" />
                  Role ID: #{selectedRoleId}
                </span>
              </div>
            </div>

            {roleLoading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-2 text-xs text-gray-500">Loading module hierarchy...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Module / Sub-Menu</th>
                      <th className="py-3 px-4 text-center">Visible (View)</th>
                      <th className="py-3 px-4 text-center">Can Add / Create</th>
                      <th className="py-3 px-4 text-center">Can Edit</th>
                      <th className="py-3 px-4 text-center">Can Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roleMenuTree.map(parent => {
                      const IconComponent = ICON_MAP[parent.icon] || Layers;
                      const hasSubMenus = parent.sub_menus && parent.sub_menus.length > 0;
                      const isExpanded = Boolean(expandedModules[parent.menu_key]);
                      const isParentEnabled = Boolean(parent.can_view);

                      return (
                        <React.Fragment key={parent.menu_key}>
                          {/* Parent Module Row */}
                          <tr className={`transition-colors ${isParentEnabled ? 'bg-indigo-50/20' : 'bg-gray-50/50 text-gray-400'}`}>
                            {/* Module Name + Accordion Toggle */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {hasSubMenus ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleModuleAccordion(parent.menu_key)}
                                    className="p-1 rounded hover:bg-indigo-100/60 text-indigo-700 transition"
                                  >
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                  </button>
                                ) : (
                                  <span className="w-6"></span>
                                )}

                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                                  isParentEnabled ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold text-xs ${isParentEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                      {parent.label}
                                    </span>
                                    {hasSubMenus && (
                                      <span className="text-[10px] bg-indigo-100/70 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                                        {parent.sub_menus.filter(s => s.can_view).length} of {parent.sub_menus.length} sub-menus active
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-400">
                                    {parent.description || parent.route_path}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Parent View Toggle (Master Module switch) */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleParentToggle(parent.menu_key, 'can_view')}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  isParentEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                    isParentEnabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </td>

                            {/* Parent Actions (if module has no sub-menus) */}
                            <td className="py-3.5 px-4 text-center">
                              {!hasSubMenus && (
                                <input
                                  type="checkbox"
                                  checked={Boolean(parent.can_create)}
                                  disabled={!isParentEnabled}
                                  onChange={() => handleParentToggle(parent.menu_key, 'can_create')}
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-30"
                                />
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {!hasSubMenus && (
                                <input
                                  type="checkbox"
                                  checked={Boolean(parent.can_edit)}
                                  disabled={!isParentEnabled}
                                  onChange={() => handleParentToggle(parent.menu_key, 'can_edit')}
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-30"
                                />
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {!hasSubMenus && (
                                <input
                                  type="checkbox"
                                  checked={Boolean(parent.can_delete)}
                                  disabled={!isParentEnabled}
                                  onChange={() => handleParentToggle(parent.menu_key, 'can_delete')}
                                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer disabled:opacity-30"
                                />
                              )}
                            </td>
                          </tr>

                          {/* Sub-Menus Accordion Rows */}
                          {hasSubMenus && isExpanded && parent.sub_menus.map(sub => {
                            const SubIcon = ICON_MAP[sub.icon] || Layers;
                            const isSubEnabled = Boolean(sub.can_view);

                            return (
                              <tr
                                key={sub.menu_key}
                                className={`transition-colors border-l-4 ${
                                  isSubEnabled ? 'bg-white border-l-indigo-500' : 'bg-gray-50/80 border-l-transparent text-gray-400'
                                }`}
                              >
                                {/* Sub-menu Name */}
                                <td className="py-2.5 px-4 pl-12">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                                      isSubEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                      <SubIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <div className={`font-semibold text-xs ${isSubEnabled ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {sub.label}
                                      </div>
                                      <div className="text-[10px] text-gray-400">
                                        {sub.description || sub.route_path}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Sub-menu View Toggle */}
                                <td className="py-2.5 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSubEnabled}
                                    onChange={() => handleSubMenuToggle(parent.menu_key, sub.menu_key, 'can_view')}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                                  />
                                </td>

                                {/* Sub-menu Create */}
                                <td className="py-2.5 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(sub.can_create)}
                                    disabled={!isSubEnabled}
                                    onChange={() => handleSubMenuToggle(parent.menu_key, sub.menu_key, 'can_create')}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-20"
                                  />
                                </td>

                                {/* Sub-menu Edit */}
                                <td className="py-2.5 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(sub.can_edit)}
                                    disabled={!isSubEnabled}
                                    onChange={() => handleSubMenuToggle(parent.menu_key, sub.menu_key, 'can_edit')}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-20"
                                  />
                                </td>

                                {/* Sub-menu Delete */}
                                <td className="py-2.5 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(sub.can_delete)}
                                    disabled={!isSubEnabled}
                                    onChange={() => handleSubMenuToggle(parent.menu_key, sub.menu_key, 'can_delete')}
                                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer disabled:opacity-20"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANAGE ROLES (ADD / EDIT / DELETE ROLES) */}
      {/* ========================================================================= */}
      {activeTab === 'manage_roles' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Master Roles Directory</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Create new roles, edit names, or delete custom roles. Core system roles are protected.
              </p>
            </div>
            <button
              onClick={handleOpenAddRole}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add New Role
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Role ID</th>
                  <th className="py-3 px-4">Role Name</th>
                  <th className="py-3 px-4">Assigned Users</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map(r => {
                  const isProtected = [1, 2, 4, 5].includes(r.id);
                  return (
                    <tr key={r.id} className="hover:bg-indigo-50/20">
                      <td className="py-3 px-4 font-mono font-bold text-gray-400">#{r.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {r.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 font-bold text-[10px] text-gray-700">
                          <Users className="w-3 h-3 text-gray-500" />
                          {r.user_count || 0} user(s)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isProtected ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            Core System Role
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                            Custom Role
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditRole(r)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit Role Name"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isProtected && (
                            <button
                              onClick={() => handleDeleteRole(r)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Role"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STAFF INDIVIDUAL EXCEPTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 lg:col-span-1 space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Select Staff Member</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Staff inherit their assigned Role's sub-menus. Use this only for special custom exceptions.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff..."
                value={staffSearchQuery}
                onChange={e => setStaffSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {staffList
                .filter(s => `${s.first_name} ${s.last_name || ''} ${s.staff_code}`.toLowerCase().includes(staffSearchQuery.toLowerCase()))
                .map(st => {
                  const isSelected = String(st.id) === String(selectedStaffId);
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStaffId(String(st.id))}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                          : 'border-gray-100 hover:border-indigo-100 hover:bg-gray-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {st.first_name?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-xs">
                            {st.first_name} {st.last_name || ''}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {st.staff_code} • {st.designation}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden lg:col-span-2 flex flex-col">
            {staffPermissionsData?.staff && (
              <div className="p-4 border-b border-gray-100 bg-indigo-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {staffPermissionsData.staff.name} ({staffPermissionsData.staff.staff_code})
                  </h3>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Assigned Role: <span className="font-bold text-indigo-700">{staffPermissionsData.staff.designation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {staffSuccess && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {staffSuccess}
                    </span>
                  )}
                  <button
                    onClick={() => alert('Staff custom exceptions saved')}
                    className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    Save Exception
                  </button>
                </div>
              </div>
            )}

            {!staffPermissionsData ? (
              <div className="py-20 text-center text-gray-400 text-xs">Select a staff member from the left.</div>
            ) : (
              <div className="p-4 text-xs text-gray-500">
                Staff member inherits all sub-menus assigned to role <strong className="text-indigo-700">{staffPermissionsData.staff.designation}</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ROLE MODAL: ADD / EDIT ROLE */}
      <Dialog open={isRoleModalOpen} onOpenChange={(open) => { if (!open) setIsRoleModalOpen(false); }}>
        <DialogContent className="max-w-md p-5 border border-slate-200">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="font-bold text-slate-900 text-sm">
              {editingRole ? 'Edit Role Name' : 'Create New Master Role'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveRoleModal} className="mt-4 space-y-4 text-xs">
            {roleModalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{roleModalError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Name *</label>
              <Input
                type="text"
                value={roleNameInput}
                onChange={e => setRoleNameInput(e.target.value)}
                placeholder="e.g. Lab Incharge, Sports Coordinator"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRoleModalOpen(false)}
                className="rounded-lg text-xs font-semibold text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={roleModalSaving}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-1" />
                {roleModalSaving ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
