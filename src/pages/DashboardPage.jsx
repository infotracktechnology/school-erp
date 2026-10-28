import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useErp } from '../context/ErpContext';
import { OperationalDashboard } from '../components/dashboard/OperationalDashboard';
import { StudentDashboardView } from '../components/students/StudentDashboardView';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { accessibleBranches, branches, activeBranchId, isStudent } = useErp();

  if (isStudent) {
    return <StudentDashboardView />;
  }

  const branchesToUse = accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : branches;

  return (
    <OperationalDashboard
      branches={branchesToUse}
      activeBranchId={activeBranchId || (branchesToUse.length > 0 ? branchesToUse[0].id : null)}
      onNavigateToSettings={(sub) => {
        if (sub === 'branch-settings') {
          navigate('/branches');
        } else if (sub === 'academic-settings') {
          navigate('/academic');
        } else {
          navigate(`/${sub}`);
        }
      }}
      onNavigateToStudents={() => {
        navigate('/students/details');
      }}
    />
  );
};

export default DashboardPage;
