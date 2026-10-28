const API_BASE = '/api/timetable';

export const timetableService = {
  // Structures
  async getStructures(branch_id = 1, academic_year_id = 2) {
    const res = await fetch(`${API_BASE}/structures?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
    return res.json();
  },
  async createStructure(payload) {
    const res = await fetch(`${API_BASE}/structures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async deleteStructure(id) {
    const res = await fetch(`${API_BASE}/structures/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Class Mapping
  async saveClassMappings(payload) {
    const res = await fetch(`${API_BASE}/mappings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async unassignClass(payload) {
    const res = await fetch(`${API_BASE}/mappings/unassign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Class Subject Mappings (Teacher & Weekly Periods)
  async getClassSubjectMappings({ branch_id = 1, academic_year_id = 2, class_id, section_id }) {
    const params = new URLSearchParams({
      branch_id,
      academic_year_id,
      class_id,
      section_id: section_id || 'all'
    });
    const res = await fetch(`${API_BASE}/subject-mappings?${params.toString()}`);
    return res.json();
  },
  async saveClassSubjectMappings(payload) {
    const res = await fetch(`${API_BASE}/subject-mappings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Weekly Grid & Slots
  async getWeeklyTimetable({ branch_id = 1, academic_year_id = 2, class_id, section_id }) {
    const params = new URLSearchParams({
      branch_id,
      academic_year_id,
      class_id,
      section_id: section_id || 'all'
    });
    const res = await fetch(`${API_BASE}/weekly?${params.toString()}`);
    return res.json();
  },
  async saveSlot(payload) {
    const res = await fetch(`${API_BASE}/slot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async clearSlot(payload) {
    const res = await fetch(`${API_BASE}/slot/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
