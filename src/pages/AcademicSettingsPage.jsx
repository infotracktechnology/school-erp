import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useErp } from '../context/ErpContext';
import { AcademicSettingsWorkspace } from '../components/academic/AcademicSettingsWorkspace';

export const AcademicSettingsPage = ({ showToast }) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { branches, activeBranchId, setActiveBranchId } = useErp();

  const currentTab = tab || 'academic-year';

  const handleTabChange = (newTab) => {
    navigate(`/academic/${newTab}`);
  };

  return (
    <AcademicSettingsWorkspace
      branches={branches}
      activeBranchId={activeBranchId || (branches.length > 0 ? branches[0].id : null)}
      onActiveBranchChange={(branchId) => setActiveBranchId(branchId)}
      activeSubTab={currentTab}
      onSubTabChange={handleTabChange}
      showToast={showToast}
    />
  );
};

export default AcademicSettingsPage;
