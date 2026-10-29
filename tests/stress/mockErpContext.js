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

let currentContext = {};

export function setMockErpContext(ctx) {
  currentContext = ctx;
}

export function useErp() {
  return currentContext;
}

export function ErpProvider({ children }) {
  return children;
}
