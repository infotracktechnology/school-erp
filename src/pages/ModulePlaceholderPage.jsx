import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModulePlaceholder } from '../components/common/ModulePlaceholder';

export const ModulePlaceholderPage = () => {
  const { module } = useParams();
  const navigate = useNavigate();

  const formattedName = module
    ? module.charAt(0).toUpperCase() + module.slice(1).replace(/-/g, ' ')
    : 'Module';

  return (
    <ModulePlaceholder
      moduleName={formattedName}
      onNavigateHome={() => navigate('/dashboard')}
    />
  );
};

export default ModulePlaceholderPage;
