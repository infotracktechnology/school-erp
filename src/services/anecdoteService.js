const API_BASE = '/api/anecdotes';

export const anecdoteService = {
  // Fetch anecdotes with filtering
  async getAnecdotes(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id && params.branch_id !== 'all') query.set('branch_id', String(params.branch_id));
    if (params.academic_year_id && params.academic_year_id !== 'all') query.set('academic_year_id', String(params.academic_year_id));
    if (params.class_id && params.class_id !== 'all') query.set('class_id', String(params.class_id));
    if (params.section_id && params.section_id !== 'all') query.set('section_id', String(params.section_id));
    if (params.student_id) query.set('student_id', String(params.student_id));
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.sentiment && params.sentiment !== 'all') query.set('sentiment', params.sentiment);
    if (params.is_visible_to_parent !== undefined && params.is_visible_to_parent !== 'all') {
      query.set('is_visible_to_parent', String(params.is_visible_to_parent));
    }
    if (params.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch student anecdotes');
    }
    const data = await res.json();
    return data.data || [];
  },

  // Create a new anecdote
  async createAnecdote(payload) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save student anecdote');
    }
    return await res.json();
  },

  // Update an existing anecdote
  async updateAnecdote(id, payload) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update student anecdote');
    }
    return await res.json();
  },

  // Delete an anecdote
  async deleteAnecdote(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete student anecdote');
    }
    return await res.json();
  },

  // Get student timeline (for Student/Parent portal or Profile)
  async getStudentTimeline(studentId, isParentView = false) {
    const res = await fetch(`${API_BASE}/student/${studentId}?is_parent_view=${isParentView}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch student timeline');
    }
    const data = await res.json();
    return data.data || [];
  },

  // --- Reports & Analytics API Calls ---
  async getReportsSummary(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id && params.branch_id !== 'all') query.set('branch_id', String(params.branch_id));
    if (params.academic_year_id && params.academic_year_id !== 'all') query.set('academic_year_id', String(params.academic_year_id));
    if (params.class_id && params.class_id !== 'all') query.set('class_id', String(params.class_id));
    if (params.section_id && params.section_id !== 'all') query.set('section_id', String(params.section_id));
    if (params.start_date) query.set('start_date', params.start_date);
    if (params.end_date) query.set('end_date', params.end_date);

    const res = await fetch(`${API_BASE}/reports/summary?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reports summary');
    const data = await res.json();
    return data.data || {};
  },

  async getClassMatrixReport(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id && params.branch_id !== 'all') query.set('branch_id', String(params.branch_id));
    if (params.academic_year_id && params.academic_year_id !== 'all') query.set('academic_year_id', String(params.academic_year_id));
    if (params.class_id && params.class_id !== 'all') query.set('class_id', String(params.class_id));
    if (params.section_id && params.section_id !== 'all') query.set('section_id', String(params.section_id));
    if (params.start_date) query.set('start_date', params.start_date);
    if (params.end_date) query.set('end_date', params.end_date);

    const res = await fetch(`${API_BASE}/reports/class-matrix?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch class matrix report');
    const data = await res.json();
    return data.data || [];
  },

  async getStudentDossier(studentId) {
    const res = await fetch(`${API_BASE}/reports/student-dossier/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch student dossier');
    const data = await res.json();
    return data.data || null;
  }
};

export default anecdoteService;
