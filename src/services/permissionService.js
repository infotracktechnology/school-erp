const API_BASE = '/api/permissions';

export const permissionService = {
  // Master Roles CRUD
  async getMasterRoles() {
    const res = await fetch(`${API_BASE}/roles`);
    if (!res.ok) throw new Error('Failed to fetch roles');
    return await res.json();
  },

  async createRole(payload) {
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create role');
    return data;
  },

  async updateRole(id, payload) {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update role');
    return data;
  },

  async deleteRole(id) {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete role');
    return data;
  },

  // Get all system menus
  async getSystemMenus() {
    const res = await fetch(`${API_BASE}/menus`);
    if (!res.ok) throw new Error('Failed to fetch system menus');
    return await res.json();
  },

  // Get Role defaults
  async getRoleDefaults(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set('branch_id', String(params.branch_id));
    if (params.role_id) query.set('role_id', String(params.role_id));
    if (params.target_type) query.set('target_type', params.target_type);

    const res = await fetch(`${API_BASE}/role-defaults?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch role defaults');
    return await res.json();
  },

  // Save Category defaults
  async saveRoleDefaults(payload) {
    const res = await fetch(`${API_BASE}/role-defaults`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to save role defaults');
    return await res.json();
  },

  // Get specific staff member's permissions & effective status
  async getStaffPermissions(staffId) {
    const res = await fetch(`${API_BASE}/staff/${staffId}`);
    if (!res.ok) throw new Error('Failed to fetch staff permissions');
    return await res.json();
  },

  // Save specific staff member overrides
  async saveStaffPermissions(staffId, payload) {
    const res = await fetch(`${API_BASE}/staff/${staffId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to save staff permissions');
    return await res.json();
  }
};

export default permissionService;
