const API_BASE = '/api/communication';
export const communicationService = {
    // --- Homework ---
    async getHomework(params) {
        const query = new URLSearchParams();
        query.set('branch_id', String(params.branch_id));
        query.set('academic_year_id', String(params.academic_year_id));
        if (params.class_id)
            query.set('class_id', String(params.class_id));
        if (params.section_id)
            query.set('section_id', String(params.section_id));
        if (params.status)
            query.set('status', params.status);
        if (params.subject)
            query.set('subject', params.subject);
        if (params.search)
            query.set('search', params.search);
        const res = await fetch(`${API_BASE}/homework?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch homework');
        const data = await res.json();
        return data.data || [];
    },
    async createHomework(payload) {
        const res = await fetch(`${API_BASE}/homework`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to create homework');
        const data = await res.json();
        return data.data;
    },
    async updateHomework(id, payload) {
        const res = await fetch(`${API_BASE}/homework/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update homework');
        const data = await res.json();
        return data.data;
    },
    async deleteHomework(id) {
        const res = await fetch(`${API_BASE}/homework/${id}`, { method: 'DELETE' });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to delete homework');
    },
    async uploadAttachment(filename, base64Data) {
        const res = await fetch(`${API_BASE}/upload-attachment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, base64Data })
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to upload file');
        return await res.json();
    },
    // --- Assignments ---
    async getAssignments(params) {
        const query = new URLSearchParams();
        query.set('branch_id', String(params.branch_id));
        query.set('academic_year_id', String(params.academic_year_id));
        if (params.class_id)
            query.set('class_id', String(params.class_id));
        if (params.section_id)
            query.set('section_id', String(params.section_id));
        if (params.submission_type)
            query.set('submission_type', params.submission_type);
        if (params.status)
            query.set('status', params.status);
        if (params.search)
            query.set('search', params.search);
        const res = await fetch(`${API_BASE}/assignments?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch assignments');
        const data = await res.json();
        return data.data || [];
    },
    async getAssignmentDetails(id) {
        const res = await fetch(`${API_BASE}/assignments/${id}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch assignment details');
        return await res.json();
    },
    async createAssignment(payload) {
        const res = await fetch(`${API_BASE}/assignments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to create assignment');
        const data = await res.json();
        return data.data;
    },
    async updateAssignment(id, payload) {
        const res = await fetch(`${API_BASE}/assignments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update assignment');
        const data = await res.json();
        return data.data;
    },
    async deleteAssignment(id) {
        const res = await fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to delete assignment');
    },
    async submitAssignmentWork(assignmentId, payload) {
        const res = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to submit assignment');
    },
    async reviewAssignment(assignmentId, studentId, payload) {
        const res = await fetch(`${API_BASE}/assignments/${assignmentId}/review/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to review assignment');
    },
    async markOfflineCompletion(assignmentId, studentId, payload) {
        const res = await fetch(`${API_BASE}/assignments/${assignmentId}/offline-verify/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to mark offline completion');
    },
    // --- Announcements ---
    async getAnnouncements(params) {
        const query = new URLSearchParams();
        query.set('branch_id', String(params.branch_id));
        query.set('academic_year_id', String(params.academic_year_id));
        if (params.user_type)
            query.set('user_type', params.user_type);
        if (params.priority)
            query.set('priority', params.priority);
        if (params.status)
            query.set('status', params.status);
        if (params.search)
            query.set('search', params.search);
        const res = await fetch(`${API_BASE}/announcements?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch announcements');
        const data = await res.json();
        return data.data || [];
    },
    async createAnnouncement(payload) {
        const res = await fetch(`${API_BASE}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to create announcement');
        const data = await res.json();
        return data.data;
    },
    async updateAnnouncement(id, payload) {
        const res = await fetch(`${API_BASE}/announcements/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update announcement');
        const data = await res.json();
        return data.data;
    },
    async deleteAnnouncement(id) {
        const res = await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to delete announcement');
    },
    // --- Gallery ---
    async getAlbums(params) {
        const query = new URLSearchParams();
        query.set('branch_id', String(params.branch_id));
        query.set('academic_year_id', String(params.academic_year_id));
        if (params.status)
            query.set('status', params.status);
        if (params.search)
            query.set('search', params.search);
        const res = await fetch(`${API_BASE}/gallery?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch gallery albums');
        const data = await res.json();
        return data.data || [];
    },
    async getAlbumDetails(id) {
        const res = await fetch(`${API_BASE}/gallery/${id}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch gallery album details');
        return await res.json();
    },
    async createAlbum(payload) {
        const res = await fetch(`${API_BASE}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to create gallery album');
        const data = await res.json();
        return data.data;
    },
    async updateAlbum(id, payload) {
        const res = await fetch(`${API_BASE}/gallery/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update gallery album');
        const data = await res.json();
        return data.data;
    },
    async deleteAlbum(id) {
        const res = await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to delete gallery album');
    },
    async addMediaToAlbum(albumId, media) {
        const res = await fetch(`${API_BASE}/gallery/${albumId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ media })
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to add media');
        const data = await res.json();
        return data.data;
    },
    async updateMediaItem(mediaId, payload) {
        const res = await fetch(`${API_BASE}/gallery/media/${mediaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update media item');
        const data = await res.json();
        return data;
    },
    async deleteMediaItem(mediaId) {
        const res = await fetch(`${API_BASE}/gallery/media/${mediaId}`, { method: 'DELETE' });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to delete media item');
    },
    // --- Dashboard & Monitoring ---
    async getDashboardSummary(branch_id, academic_year_id) {
        const res = await fetch(`${API_BASE}/dashboard/summary?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch dashboard summary');
        return await res.json();
    },
    async getHomeworkMonitoring(branch_id, academic_year_id, date) {
        const query = new URLSearchParams({ branch_id: String(branch_id), academic_year_id: String(academic_year_id) });
        if (date)
            query.set('date', date);
        const res = await fetch(`${API_BASE}/dashboard/homework-monitoring?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch homework monitoring');
        return await res.json();
    },
    async getAssignmentMonitoring(branch_id, academic_year_id) {
        const res = await fetch(`${API_BASE}/dashboard/assignment-monitoring?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch assignment monitoring');
        return await res.json();
    },
    // --- History & Audit ---
    async getAuditHistory(params) {
        const query = new URLSearchParams({
            branch_id: String(params.branch_id),
            academic_year_id: String(params.academic_year_id),
            limit: String(params.limit || 100)
        });
        if (params.module)
            query.set('module', params.module);
        const res = await fetch(`${API_BASE}/history?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch audit history');
        const data = await res.json();
        return data.data || [];
    },
    async getAuditLogs(params) {
        const query = new URLSearchParams({
            branch_id: String(params.branch_id),
            academic_year_id: String(params.academic_year_id),
            limit: String(params.limit || 100)
        });
        if (params.module_name)
            query.set('activity_type', params.module_name);
        const res = await fetch(`${API_BASE}/history?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch audit history');
        const data = await res.json();
        return { logs: data.data || [] };
    },
    // --- Student / Parent Portal Feed ---
    async getStudentPortalFeed(student_id, academic_year_id) {
        const res = await fetch(`${API_BASE}/portal/student-feed?student_id=${student_id}&academic_year_id=${academic_year_id}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch student portal feed');
        return await res.json();
    },
    // --- Multi-Module Feeds for All Classes ---
    async getClassModuleFeeds(params = {}) {
        const query = new URLSearchParams();
        if (params.branch_id) query.set('branch_id', String(params.branch_id));
        if (params.academic_year_id) query.set('academic_year_id', String(params.academic_year_id));
        if (params.class_id && params.class_id !== 'all') query.set('class_id', String(params.class_id));
        if (params.module && params.module !== 'all') query.set('module', params.module);

        const res = await fetch(`${API_BASE}/feeds?${query.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch class module feeds');
        const data = await res.json();
        return data.data || [];
    }
};
