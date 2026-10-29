import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useErp } from '../context/ErpContext';
import { OperationalDashboard } from '../components/dashboard/OperationalDashboard';
import { SuperAdminDashboard } from '../components/dashboard/SuperAdminDashboard';
import { StudentDashboardView } from '../components/students/StudentDashboardView';

/**
 * DashboardPage - Main Role-Scoping Router for Dashboard Module (Feature 28)
 * Scopes views by userRole: Super Admin, Principal, or Student.
 * Renders metric widgets (students, staff, attendance stats, and cards).
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { 
    accessibleBranches, 
    branches, 
    activeBranchId, 
    isStudent, 
    isSuperAdmin, 
    isPrincipal, 
    userRole,
    isAllBranches
  } = useErp();

  // 1. Student Portal Dashboard
  if (isStudent || userRole === 'student') {
    return <StudentDashboardView />;
  }

  const branchesToUse = accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : branches;
  const effectiveBranchId = activeBranchId || (branchesToUse.length > 0 ? branchesToUse[0].id : null);

  const handleNavigateToSettings = (sub) => {
    if (sub === 'branch-settings') {
      navigate('/branches');
    } else if (sub === 'academic-settings') {
      navigate('/academic');
    } else {
      navigate(`/${sub}`);
    }
  };

  const handleNavigateToStudents = () => {
    navigate('/students/details');
  };

  // 2. Super Admin Organization-Wide Monitoring Dashboard
  if (isSuperAdmin || userRole === 'super_admin' || isAllBranches) {
    return (
      <SuperAdminDashboard
        onNavigateToStudents={handleNavigateToStudents}
        onNavigateToSettings={handleNavigateToSettings}
      />
    );
  }

  // 3. Operational Campus Dashboard (Principal & Teachers)
  return (
    <OperationalDashboard
      branches={branchesToUse}
      activeBranchId={effectiveBranchId}
      onNavigateToSettings={handleNavigateToSettings}
      onNavigateToStudents={handleNavigateToStudents}
    />
  );
};

export default DashboardPage;
