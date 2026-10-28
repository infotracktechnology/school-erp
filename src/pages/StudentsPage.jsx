import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentsWorkspace } from '../components/students/StudentsWorkspace';

export const StudentsPage = () => {
  const { subTab } = useParams();
  const navigate = useNavigate();

  const currentSubTab = subTab || 'details';

  const handleSubTabChange = (newSubTab, queryParams = '') => {
    navigate(`/students/${newSubTab}${queryParams}`);
  };

  return (
    <StudentsWorkspace
      initialSubTab={currentSubTab}
      onSubTabChange={handleSubTabChange}
    />
  );
};

export default StudentsPage;
