const API_BASE = '/api/staff';

export const staffService = {
  // Get staff list with filters and academic allocations
  async getStaffList(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set('branch_id', String(params.branch_id));
    if (params.staff_type && params.staff_type !== 'All') query.set('staff_type', params.staff_type);
    if (params.department && params.department !== 'All') query.set('department', params.department);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch staff');
    }
    return await res.json();
  },

  // Create new staff member
  async createStaff(payload) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create staff');
    }
    return await res.json();
  },

  // Update staff details
  async updateStaff(id, payload) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update staff');
    }
    return await res.json();
  },

  // Delete staff member
  async deleteStaff(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete staff');
    }
    return await res.json();
  },

  // Get allocations (Class Teacher, Assistant Class Teacher, Coordinator, Subject Teacher)
  async getAllocations(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set('branch_id', String(params.branch_id));
    if (params.class_id) query.set('class_id', String(params.class_id));
    if (params.section_id) query.set('section_id', String(params.section_id));
    if (params.allocation_type) query.set('allocation_type', params.allocation_type);

    const res = await fetch(`${API_BASE}/allocations?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch allocations');
    }
    return await res.json();
  },

  // Assign or update academic allocation
  async saveAllocation(payload) {
    const res = await fetch(`${API_BASE}/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save allocation');
    }
    return await res.json();
  },

  // Delete an allocation
  async deleteAllocation(id) {
    const res = await fetch(`${API_BASE}/allocations/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete allocation');
    }
    return await res.json();
  },

  // Get teaching workload overview
  async getWorkloadSummary(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set('branch_id', String(params.branch_id));

    const res = await fetch(`${API_BASE}/workload?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch workload');
    }
    return await res.json();
  },

  // Update credentials for single staff
  async updateCredentials(id, payload) {
    const res = await fetch(`${API_BASE}/${id}/credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to update credentials');
    return data;
  },

  // Bulk update credentials for selected staff
  async bulkUpdateCredentials(payload) {
    const res = await fetch(`${API_BASE}/bulk-credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to bulk update credentials');
    return data;
  }
};

export default staffService;
