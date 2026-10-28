const API_BASE = '/api/examinations';

export const examTermService = {
  async getTermStructures(branch_id = 1, academic_year_id = 2) {
    const res = await fetch(`${API_BASE}/term-structures?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
    return res.json();
  },
  async createTermStructure(payload) {
    const res = await fetch(`${API_BASE}/term-structures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async updateTermStructure(id, payload) {
    const res = await fetch(`${API_BASE}/term-structures/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async deleteTermStructure(id) {
    const res = await fetch(`${API_BASE}/term-structures/${id}`, { method: 'DELETE' });
    return res.json();
  }
};
