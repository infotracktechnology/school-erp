import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunicationWorkspace } from '../components/communication/CommunicationWorkspace';

export const CommunicationPage = () => {
  const { submenu } = useParams();
  const navigate = useNavigate();

  const currentSubmenu = submenu || 'homework';

  const handleSubmenuChange = (newSubmenu) => {
    navigate(`/communication/${newSubmenu}`);
  };

  return (
    <CommunicationWorkspace
      initialSubmenu={currentSubmenu}
      onSubmenuChange={handleSubmenuChange}
    />
  );
};

export default CommunicationPage;
