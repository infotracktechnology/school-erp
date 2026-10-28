import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getBranches, getAcademicYears, toggleAcademicYearEnabled as apiToggleYearEnabled } from '../services/api';

export const ALL_BRANCHES_META = {
    id: 0,
    organization_id: 1,
    branch_name: 'All Branches',
    branch_code: 'ALL',
    short_name: 'All Campuses',
    branch_type: 'Campus',
    status: 'Active',
    address_line_1: 'Organization-Wide Consolidated Overview',
    country: 'India',
    state: 'Tamil Nadu',
    district: 'Coimbatore & Chennai',
    city: 'Multi-City',
    pincode: '641001',
    board: 'CBSE',
    branch_head_name: 'Central Management',
    branch_head_designation: 'Director',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

const ErpContext = createContext(null);

export const useErp = () => {
    const context = useContext(ErpContext);
    if (!context) {
        throw new Error('useErp must be used within an ErpProvider');
    }
    return context;
};

export const ErpProvider = ({ children, showToast = () => {} }) => {
    // -------------------------------------------------------------
    // 1. User Roles & Authentication State
    //    - Super Admin: Full multi-branch access
    //    - Principal: Scoped strictly to assigned branch
    //    - Student: Scoped strictly to Student Portal & personal details
    // -------------------------------------------------------------
    let initialUser = null;
    try {
      const savedUserJson = localStorage.getItem('school_erp_user');
      if (savedUserJson && savedUserJson !== 'undefined') {
        initialUser = JSON.parse(savedUserJson);
      }
    } catch (e) {
      console.warn('Failed to parse saved user:', e);
      localStorage.removeItem('school_erp_user');
    }
    const [currentUser, setCurrentUser] = useState(initialUser);

    const savedRole = currentUser?.role || localStorage.getItem('school_erp_user_role') || '';
    const initialRole = (savedRole === 'principle' || savedRole === 'branch_admin') ? 'principal' : savedRole;
    const [userRole, setUserRoleState] = useState(initialRole);

    const savedAssignedBranch = currentUser?.branch_id || localStorage.getItem('school_erp_assigned_branch_id');
    const [assignedBranchId, setAssignedBranchIdState] = useState(savedAssignedBranch ? parseInt(savedAssignedBranch, 10) : 1);

    const isSuperAdmin = userRole === 'super_admin';
    const isPrincipal = userRole === 'principal' || userRole === 'principle' || userRole === 'branch_admin';
    const isBranchAdmin = isPrincipal; // Backwards-compatible alias
    const isStudent = userRole === 'student';
    const isAuthenticated = !!currentUser;

    // -------------------------------------------------------------
    // 2. Organization State
    // -------------------------------------------------------------
    const [organization, setOrganization] = useState({
        id: 1,
        name: 'Vidya Mandir Educational Trust',
        code: 'VMIS',
        contact_email: 'admin@vidyamandir.edu.in',
        website: 'https://vidyamandir.edu.in',
        total_branches: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    // -------------------------------------------------------------
    // 3. Branches State & Role-Based Branch Scoping
    // -------------------------------------------------------------
    const [branches, setBranches] = useState([]);
    const [activeBranchId, setActiveBranchIdState] = useState(() => {
        if (initialRole === 'principal') {
            return savedAssignedBranch ? parseInt(savedAssignedBranch, 10) : 1;
        }
        const saved = localStorage.getItem('school_erp_active_branch_id');
        return saved === 'all' || !saved ? 'all' : parseInt(saved, 10);
    });
    const [isLoadingBranches, setIsLoadingBranches] = useState(true);

    // Filtered accessible branches list based on user role
    const accessibleBranches = useMemo(() => {
        if (isSuperAdmin) {
            return branches;
        }
        // Principal only sees their assigned branch
        const filtered = branches.filter(b => Number(b.id) === Number(assignedBranchId));
        return filtered.length > 0 ? filtered : (branches.slice(0, 1));
    }, [isSuperAdmin, branches, assignedBranchId]);

    // Currently assigned branch object
    const assignedBranch = useMemo(() => {
        return branches.find(b => Number(b.id) === Number(assignedBranchId)) || branches[0] || ALL_BRANCHES_META;
    }, [branches, assignedBranchId]);

    // Active Branch Object & Scoping
    // Only super_admin can ever view "All Branches"
    const effectiveActiveBranchId = useMemo(() => {
        if (!isSuperAdmin) {
            return assignedBranchId ? Number(assignedBranchId) : (accessibleBranches[0]?.id || 1);
        }
        return activeBranchId;
    }, [isSuperAdmin, assignedBranchId, accessibleBranches, activeBranchId]);

    const isAllBranches = isSuperAdmin && effectiveActiveBranchId === 'all';
    const activeBranch = useMemo(() => {
        if (!isSuperAdmin) {
            return assignedBranch;
        }
        if (effectiveActiveBranchId === 'all') {
            return {
                ...ALL_BRANCHES_META,
                total_branches: branches.length
            };
        }
        return branches.find(b => Number(b.id) === Number(effectiveActiveBranchId)) || branches[0] || ALL_BRANCHES_META;
    }, [isSuperAdmin, assignedBranch, effectiveActiveBranchId, branches]);

    // Authentication Login handler
    const loginUser = useCallback(async (username, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Login failed. Please check your credentials.');
        }

        const user = data.user;
        setCurrentUser(user);
        setUserRoleState(user.role);
        localStorage.setItem('school_erp_user', JSON.stringify(user));
        localStorage.setItem('school_erp_user_role', user.role);

        if (user.branch_id) {
            setAssignedBranchIdState(Number(user.branch_id));
            localStorage.setItem('school_erp_assigned_branch_id', String(user.branch_id));
            if (user.role === 'principal' || user.role === 'student') {
                setActiveBranchIdState(Number(user.branch_id));
                localStorage.setItem('school_erp_active_branch_id', String(user.branch_id));
            }
        } else if (user.role === 'super_admin') {
            setActiveBranchIdState('all');
            localStorage.setItem('school_erp_active_branch_id', 'all');
        }

        if (data.token) {
            localStorage.setItem('school_erp_token', data.token);
        }

        showToast(data.message || `Welcome, ${user.name}!`, 'success');
        return user;
    }, [showToast]);

    // Logout handler
    const logoutUser = useCallback(() => {
        setCurrentUser(null);
        setUserRoleState('');
        localStorage.removeItem('school_erp_user');
        localStorage.removeItem('school_erp_user_role');
        localStorage.removeItem('school_erp_token');
        localStorage.removeItem('school_erp_active_branch_id');
        localStorage.removeItem('school_erp_assigned_branch_id');
        showToast('You have been logged out safely.', 'info');
    }, [showToast]);

    // Role Switching with strict access control
    const setUserRole = useCallback((newRole, targetBranchId) => {
        const normalizedRole = (newRole === 'principle' || newRole === 'branch_admin') ? 'principal' : newRole;
        setUserRoleState(normalizedRole);
        localStorage.setItem('school_erp_user_role', normalizedRole);

        const effBranchId = targetBranchId ? Number(targetBranchId) : assignedBranchId;
        if (targetBranchId) {
            setAssignedBranchIdState(effBranchId);
            localStorage.setItem('school_erp_assigned_branch_id', String(effBranchId));
        }

        if (normalizedRole === 'principal') {
            setActiveBranchIdState(effBranchId);
            localStorage.setItem('school_erp_active_branch_id', String(effBranchId));
            const bObj = branches.find(b => Number(b.id) === effBranchId);
            showToast(`Role switched to Principal. Scoped strictly to ${bObj?.branch_name || 'assigned branch'}.`, 'info');
        } else if (normalizedRole === 'super_admin') {
            showToast('Role switched to Super Admin with multi-branch organization-wide access.', 'success');
        }
    }, [assignedBranchId, branches, showToast]);

    const setAssignedBranchId = useCallback((id) => {
        const numId = Number(id);
        setAssignedBranchIdState(numId);
        localStorage.setItem('school_erp_assigned_branch_id', String(numId));
        if (isPrincipal) {
            setActiveBranchIdState(numId);
            localStorage.setItem('school_erp_active_branch_id', String(numId));
        }
    }, [isPrincipal]);

    // Branch change handler with role validation
    const setActiveBranchId = useCallback((newBranchId) => {
        if (isPrincipal) {
            if (newBranchId === 'all' || Number(newBranchId) !== Number(assignedBranchId)) {
                showToast(`Principal access is restricted to assigned branch (${assignedBranch?.branch_name || 'Assigned'}).`, 'warning');
                return;
            }
        }

        if (newBranchId === 'all') {
            setActiveBranchIdState('all');
            localStorage.setItem('school_erp_active_branch_id', 'all');
            showToast('Switched to Organization Overview (All Branches)', 'info');
            return;
        }

        const numId = Number(newBranchId);
        setActiveBranchIdState(numId);
        localStorage.setItem('school_erp_active_branch_id', String(numId));
        const branchObj = branches.find(b => b.id === numId);
        if (branchObj) {
            showToast(`Switched active branch to ${branchObj.branch_name}`, 'info');
        }
    }, [isPrincipal, assignedBranchId, assignedBranch, branches, showToast]);

    // Load Branches on initialization
    const fetchInitialBranches = useCallback(async () => {
        setIsLoadingBranches(true);
        try {
            const data = await getBranches();
            setBranches(data);

            if (!isSuperAdmin) {
                const targetId = assignedBranchId ? Number(assignedBranchId) : (data[0]?.id || 1);
                setActiveBranchIdState(targetId);
                localStorage.setItem('school_erp_active_branch_id', String(targetId));
            } else {
                const savedBranchId = localStorage.getItem('school_erp_active_branch_id');
                if (savedBranchId === 'all' || !savedBranchId) {
                    setActiveBranchIdState('all');
                } else {
                    const parsed = parseInt(savedBranchId, 10);
                    const match = data.find(b => b.id === parsed);
                    setActiveBranchIdState(match ? match.id : 'all');
                }
            }
        } catch (err) {
            console.error('Failed to load branches:', err);
            showToast('Unable to load school branches', 'error');
        } finally {
            setIsLoadingBranches(false);
        }
    }, [userRole, assignedBranchId, showToast]);

    useEffect(() => {
        fetchInitialBranches();
    }, [fetchInitialBranches]);

    // -------------------------------------------------------------
    // 4. Global Academic Year Life Cycle (ERP Core Context)
    //    - ERP operations revolve around the academic year lifecycle:
    //      Upcoming -> Active / Current -> Closed / Historical
    // -------------------------------------------------------------
    const [academicYears, setAcademicYears] = useState([]);
    const [activeAcademicYearId, setActiveAcademicYearIdState] = useState(null);
    const [isLoadingYears, setIsLoadingYears] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [pendingTargetYearId, setPendingTargetYearId] = useState(null);
    const [adminOverrideActive, setAdminOverrideActive] = useState(false);

    // Fetch Academic Years globally
    const fetchGlobalAcademicYears = useCallback(async () => {
        setIsLoadingYears(true);
        try {
            const res = await getAcademicYears('all');
            const allYears = res.data || [];
            
            // Normalize & sort years by start_date ascending
            const sortedYears = [...allYears].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            setAcademicYears(sortedYears);

            const selectableYears = sortedYears.filter(ay => ay.is_enabled !== false);
            const savedYearIdStr = localStorage.getItem('school_erp_global_academic_year_id');
            const savedYearId = savedYearIdStr ? parseInt(savedYearIdStr, 10) : null;

            const validSavedYear = selectableYears.find(ay => ay.id === savedYearId);
            const currentYear = selectableYears.find(ay => ay.is_current || ay.is_active || ay.status === 'Active') 
                             || sortedYears.find(ay => ay.is_current || ay.is_active || ay.status === 'Active');
            const firstEnabled = selectableYears[0] || sortedYears[0] || null;

            const targetYear = validSavedYear || currentYear || firstEnabled;
            if (targetYear) {
                setActiveAcademicYearIdState(targetYear.id);
                localStorage.setItem('school_erp_global_academic_year_id', String(targetYear.id));
            } else {
                setActiveAcademicYearIdState(null);
            }
        } catch (err) {
            console.error('Failed to load global academic years:', err);
            showToast('Failed to load global academic years', 'error');
        } finally {
            setIsLoadingYears(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchGlobalAcademicYears();
    }, [fetchGlobalAcademicYears]);

    // Active Academic Year object & Life Cycle attributes
    const activeAcademicYear = useMemo(() => {
        return academicYears.find(ay => ay.id === activeAcademicYearId) || academicYears[0] || null;
    }, [academicYears, activeAcademicYearId]);

    const isCurrentYear = useMemo(() => {
        if (!activeAcademicYear) return false;
        return Boolean(activeAcademicYear.is_current || activeAcademicYear.is_active || activeAcademicYear.status === 'Active');
    }, [activeAcademicYear]);

    const isUpcomingYear = useMemo(() => {
        if (!activeAcademicYear) return false;
        return (activeAcademicYear.status || '').trim().toLowerCase() === 'upcoming';
    }, [activeAcademicYear]);

    const isHistoricalYear = useMemo(() => {
        if (!activeAcademicYear) return false;
        if (isCurrentYear || isUpcomingYear) return false;
        const s = (activeAcademicYear.status || '').trim().toLowerCase();
        return s === 'closed' || s === 'historical' || s === 'archived';
    }, [activeAcademicYear, isCurrentYear, isUpcomingYear]);

    const academicYearLifecycle = useMemo(() => {
        if (isCurrentYear) return 'Active / Current';
        if (isUpcomingYear) return 'Upcoming';
        if (isHistoricalYear) return 'Closed / Historical';
        return activeAcademicYear?.status || 'Active';
    }, [isCurrentYear, isUpcomingYear, isHistoricalYear, activeAcademicYear]);

    const academicYearName = useMemo(() => {
        return activeAcademicYear?.year_name || activeAcademicYear?.name || '2025-2026';
    }, [activeAcademicYear]);

    // Read-only mode for historical years without override
    const isReadOnly = useMemo(() => {
        if (!isHistoricalYear) return false;
        return !adminOverrideActive;
    }, [isHistoricalYear, adminOverrideActive]);

    const canManageHistoricalData = isSuperAdmin;

    // Enabled selectable academic years
    const enabledAcademicYears = useMemo(() => {
        const filtered = academicYears.filter(ay => ay.is_enabled !== false);
        return filtered.length > 0 ? filtered : academicYears;
    }, [academicYears]);

    // Direct Academic Year change
    const applyAcademicYearChange = useCallback((yearId) => {
        const numId = Number(yearId);
        const target = academicYears.find(ay => Number(ay.id) === numId);
        if (!target) {
            console.warn(`Target academic year with ID ${numId} not found.`);
            return;
        }
        setActiveAcademicYearIdState(numId);
        localStorage.setItem('school_erp_global_academic_year_id', String(numId));
        setAdminOverrideActive(false);
        setHasUnsavedChanges(false);

        const s = target.status || (target.is_current ? 'Active' : 'Upcoming');
        showToast(`Switched global academic context to ${target.name || target.year_name} (${s})`, 'success');
    }, [academicYears, showToast]);

    // Safe Academic Year change request (with unsaved changes check)
    const requestAcademicYearChange = useCallback((targetYearId) => {
        const numId = Number(targetYearId);
        if (numId === activeAcademicYearId) return;
        if (hasUnsavedChanges) {
            setPendingTargetYearId(numId);
        } else {
            applyAcademicYearChange(numId);
        }
    }, [activeAcademicYearId, hasUnsavedChanges, applyAcademicYearChange]);

    const confirmPendingYearChange = useCallback(() => {
        if (pendingTargetYearId !== null) {
            applyAcademicYearChange(pendingTargetYearId);
            setPendingTargetYearId(null);
        }
    }, [pendingTargetYearId, applyAcademicYearChange]);

    const cancelPendingYearChange = useCallback(() => {
        setPendingTargetYearId(null);
    }, []);

    // Toggle Academic Year enabled state
    const toggleYearEnabled = useCallback(async (ay, isEnabled) => {
        try {
            const res = await apiToggleYearEnabled(ay.id, isEnabled);
            showToast(res.message, 'success');
            await fetchGlobalAcademicYears();
            return { success: true, message: res.message };
        } catch (err) {
            showToast(err.message || 'Failed to update academic year selection status', 'error');
            return { success: false, message: err.message };
        }
    }, [fetchGlobalAcademicYears, showToast]);

    // Context Value
    const contextValue = useMemo(() => ({
        // Roles & Permissions & Auth
        currentUser,
        isAuthenticated,
        isStudent,
        loginUser,
        logoutUser,
        userRole,
        setUserRole,
        assignedBranchId,
        setAssignedBranchId,
        assignedBranch,
        isSuperAdmin,
        isPrincipal,
        isBranchAdmin,
        canManageHistoricalData,

        // Organizations & Branches
        organization,
        branches: isSuperAdmin ? branches : accessibleBranches,
        accessibleBranches,
        allBranches: branches,
        setBranches,
        refreshBranches: fetchInitialBranches,
        activeBranchId: effectiveActiveBranchId,
        activeBranch,
        setActiveBranchId,
        isLoadingBranches,
        isAllBranches,

        // Global Academic Year Life Cycle
        academicYears,
        enabledAcademicYears,
        activeAcademicYearId,
        activeAcademicYear,
        academicYearName,
        setActiveAcademicYearId: applyAcademicYearChange,
        isLoadingYears,
        requestAcademicYearChange,
        isCurrentYear,
        isUpcomingYear,
        isHistoricalYear,
        academicYearLifecycle,
        isReadOnly,
        adminOverrideActive,
        setAdminOverrideActive,
        refreshAcademicYears: fetchGlobalAcademicYears,
        toggleYearEnabled,

        // UI & Form State
        hasUnsavedChanges,
        setHasUnsavedChanges,
        pendingTargetYearId,
        confirmPendingYearChange,
        cancelPendingYearChange,
        showToast
    }), [
        currentUser,
        isAuthenticated,
        isStudent,
        loginUser,
        logoutUser,
        userRole,
        setUserRole,
        assignedBranchId,
        setAssignedBranchId,
        assignedBranch,
        isSuperAdmin,
        isPrincipal,
        isBranchAdmin,
        canManageHistoricalData,
        organization,
        branches,
        accessibleBranches,
        setBranches,
        fetchInitialBranches,
        effectiveActiveBranchId,
        activeBranch,
        setActiveBranchId,
        isLoadingBranches,
        isAllBranches,
        academicYears,
        enabledAcademicYears,
        activeAcademicYearId,
        activeAcademicYear,
        academicYearName,
        applyAcademicYearChange,
        isLoadingYears,
        requestAcademicYearChange,
        isCurrentYear,
        isUpcomingYear,
        isHistoricalYear,
        academicYearLifecycle,
        isReadOnly,
        adminOverrideActive,
        fetchGlobalAcademicYears,
        toggleYearEnabled,
        hasUnsavedChanges,
        pendingTargetYearId,
        confirmPendingYearChange,
        cancelPendingYearChange,
        showToast
    ]);

    return (
        <ErpContext.Provider value={contextValue}>
            {children}
        </ErpContext.Provider>
    );
};
