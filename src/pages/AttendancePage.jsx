import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AttendanceWorkspace } from '../components/attendance/AttendanceWorkspace';
import { useErp } from '../context/ErpContext';

export const AttendancePage = () => {
  const { submenu } = useParams();
  const navigate = useNavigate();
  const { isStudent } = useErp();

  if (isStudent) {
    return <Navigate to="/student/attendance" replace />;
  }

  const currentSubmenu = submenu || 'take_attendance';

  const handleSubmenuChange = (newSubmenu) => {
    navigate(`/attendance/${newSubmenu}`);
  };

  return (
    <AttendanceWorkspace
      initialSubmenu={currentSubmenu}
      onSubmenuChange={handleSubmenuChange}
    />
  );
};

export default AttendancePage;
