import React from 'react';
import { StudentReferenceMatrixTable } from './update/StudentReferenceMatrixTable';

export const StudentUpdateView = ({
  branchId,
  academicYearId,
  initialStudentId = null,
  onViewProfile,
  onDone,
  onBack,
}) => {
  return (
    <StudentReferenceMatrixTable
      branchId={branchId}
      academicYearId={academicYearId}
      initialStudentId={initialStudentId}
      onViewProfile={onViewProfile}
      onRefresh={onDone}
      onBack={onBack}
    />
  );
};

export default StudentUpdateView;
