import React, { createContext, useContext } from 'react';

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

let currentErpMock = {
  currentUser: null,
  logoutUser: () => {},
  userRole: 'super_admin',
  setUserRole: () => {},
  isSuperAdmin: true,
  isPrincipal: false,
  isBranchAdmin: false,
  isStudent: false,
  organization: { id: 1, name: 'EduCampus ERP Test', code: 'TEST' },
  branches: [
    { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN', status: 'Active', city: 'Chennai', state: 'Tamil Nadu' },
    { id: 2, branch_name: 'North Campus', branch_code: 'NORTH', status: 'Active', city: 'Coimbatore', state: 'Tamil Nadu' }
  ],
  accessibleBranches: [
    { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN', status: 'Active', city: 'Chennai', state: 'Tamil Nadu' },
    { id: 2, branch_name: 'North Campus', branch_code: 'NORTH', status: 'Active', city: 'Coimbatore', state: 'Tamil Nadu' }
  ],
  assignedBranch: { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN' },
  assignedBranchId: 1,
  setAssignedBranchId: () => {},
  activeBranch: { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN' },
  activeBranchId: 1,
  setActiveBranchId: () => {},
  isLoadingBranches: false,
  isAllBranches: false,
  academicYears: [{ id: 1, name: '2026-2027', is_active: true }],
  academicYearName: '2026-2027',
  activeAcademicYearId: 1,
  activeAcademicYear: { id: 1, name: '2026-2027', is_active: true },
  academicYearLifecycle: '2026-2027 (Active)',
  isCurrentYear: true,
  isUpcomingYear: false,
  isHistoricalYear: false,
  isReadOnly: false,
  showToast: () => {}
};

export const setMockErpContext = (overrides) => {
  currentErpMock = {
    ...currentErpMock,
    ...overrides
  };
};

export const resetMockErpContext = () => {
  currentErpMock = {
    currentUser: null,
    logoutUser: () => {},
    userRole: 'super_admin',
    setUserRole: () => {},
    isSuperAdmin: true,
    isPrincipal: false,
    isBranchAdmin: false,
    isStudent: false,
    organization: { id: 1, name: 'EduCampus ERP Test', code: 'TEST' },
    branches: [
      { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN', status: 'Active', city: 'Chennai', state: 'Tamil Nadu' },
      { id: 2, branch_name: 'North Campus', branch_code: 'NORTH', status: 'Active', city: 'Coimbatore', state: 'Tamil Nadu' }
    ],
    accessibleBranches: [
      { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN', status: 'Active', city: 'Chennai', state: 'Tamil Nadu' },
      { id: 2, branch_name: 'North Campus', branch_code: 'NORTH', status: 'Active', city: 'Coimbatore', state: 'Tamil Nadu' }
    ],
    assignedBranch: { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN' },
    assignedBranchId: 1,
    setAssignedBranchId: () => {},
    activeBranch: { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN' },
    activeBranchId: 1,
    setActiveBranchId: () => {},
    isLoadingBranches: false,
    isAllBranches: false,
    academicYears: [{ id: 1, name: '2026-2027', is_active: true }],
    academicYearName: '2026-2027',
    activeAcademicYearId: 1,
    activeAcademicYear: { id: 1, name: '2026-2027', is_active: true },
    academicYearLifecycle: '2026-2027 (Active)',
    isCurrentYear: true,
    isUpcomingYear: false,
    isHistoricalYear: false,
    isReadOnly: false,
    showToast: () => {}
  };
};

export const useErp = () => currentErpMock;

export const ErpProvider = ({ children }) => children;
