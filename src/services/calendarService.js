const API_BASE = '/api/calendar';

export const calendarService = {
  // Get all events with optional filters (month, year, event_type, class_id, section_id)
  async getEvents({ branch_id = 1, academic_year_id = 2, event_type, month, year, class_id, section_id }) {
    const params = new URLSearchParams({
      branch_id,
      academic_year_id
    });
    if (event_type && event_type !== 'all') params.append('event_type', event_type);
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    if (class_id && class_id !== 'all') params.append('class_id', class_id);
    if (section_id && section_id !== 'all') params.append('section_id', section_id);

    const res = await fetch(`${API_BASE}/events?${params.toString()}`);
    return res.json();
  },

  // Create event
  async createEvent(payload) {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Update event
  async updateEvent(id, payload) {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Delete event
  async deleteEvent(id) {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Get upcoming agenda events
  async getUpcoming({ branch_id = 1, academic_year_id = 2, class_id, section_id }) {
    const params = new URLSearchParams({ branch_id, academic_year_id });
    if (class_id && class_id !== 'all') params.append('class_id', class_id);
    if (section_id && section_id !== 'all') params.append('section_id', section_id);

    const res = await fetch(`${API_BASE}/upcoming?${params.toString()}`);
    return res.json();
  }
};
