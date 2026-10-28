export const attendanceApi = {
    // Remarks Master
    async getRemarks(status) {
        const params = new URLSearchParams();
        if (status)
            params.append('status', status);
        const res = await fetch(`/api/attendance/remarks?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch remarks');
        const data = await res.json();
        return data.remarks;
    },
    async createRemark(payload) {
        const res = await fetch('/api/attendance/remarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to create remark');
        return await res.json();
    },
    async updateRemark(id, payload) {
        const res = await fetch(`/api/attendance/remarks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update remark');
        return await res.json();
    },
    async toggleRemarkStatus(id, status) {
        const res = await fetch(`/api/attendance/remarks/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update remark status');
    },
    async deleteRemark(id) {
        const res = await fetch(`/api/attendance/remarks/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to delete remark');
    },
    // Check Existing Attendance
    async checkExisting(branchId, ayId, classId, sectionId, date, sectionName) {
        const params = new URLSearchParams({
            branch_id: String(branchId),
            academic_year_id: String(ayId),
            class_id: String(classId),
            section_id: String(sectionId),
            date
        });
        if (sectionName)
            params.append('section_name', String(sectionName));
        const res = await fetch(`/api/attendance/check-existing?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to check existing attendance');
        return await res.json();
    },
    // Timings
    async getTimings(branchId, ayId, academicYear) {
        const params = new URLSearchParams();
        if (branchId)
            params.append('branch_id', String(branchId));
        if (ayId)
            params.append('academic_year_id', String(ayId));
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/timings?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch timings');
        const data = await res.json();
        return data.timings || data.data || [];
    },
    async createTiming(timing) {
        const res = await fetch('/api/attendance/timings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(timing)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to create timing');
        const data = await res.json();
        return data.timing || data.data;
    },
    async updateTiming(id, timing) {
        const res = await fetch(`/api/attendance/timings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(timing)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update timing');
        const data = await res.json();
        return data.timing || data.data;
    },
    async toggleTimingStatus(id, status) {
        const res = await fetch(`/api/attendance/timings/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update timing status');
    },
    // Assignments
    async getAssignments(branchId, ayId, academicYear) {
        const params = new URLSearchParams();
        if (branchId)
            params.append('branch_id', String(branchId));
        if (ayId)
            params.append('academic_year_id', String(ayId));
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/assignments?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch assignments');
        const data = await res.json();
        return data.assignments || data.data || [];
    },
    async createAssignment(assignment) {
        const res = await fetch('/api/attendance/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assignment)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to assign timing');
        const data = await res.json();
        return data.assignment;
    },
    async toggleAssignmentStatus(id, status) {
        const res = await fetch(`/api/attendance/assignments/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update assignment status');
    },
    async resolveTiming(branchId, ayId, classId, sectionId, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branchId),
            academic_year_id: String(ayId),
            class_id: String(classId)
        });
        if (sectionId && sectionId !== 'all')
            params.append('section_id', String(sectionId));
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/resolve-timing?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to resolve timing');
        const data = await res.json();
        return data;
    },
    // Taking Attendance
    async getStudentsToMark(branchId, ayId, classId, sectionId, date, timingId, sectionName, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branchId),
            academic_year_id: String(ayId),
            class_id: String(classId),
            section_id: String(sectionId),
            date
        });
        if (timingId)
            params.append('timing_id', String(timingId));
        if (sectionName)
            params.append('section_name', String(sectionName));
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/students-to-mark?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to load students');
        const data = await res.json();
        const students = Array.isArray(data.students) ? data.students : (data.data || []);
        students.has_timing_mapping = Boolean(data.has_timing_mapping);
        students.timing = data.timing || null;
        return students;
    },
    async submitAttendance(payload) {
        const res = await fetch('/api/attendance/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to submit attendance');
        return await res.json();
    },
    // History
    async getHistory(branchId, ayId, date, classId, sectionId, academicYear) {
        const params = new URLSearchParams();
        params.append('branch_id', String(branchId));
        if (ayId)
            params.append('academic_year_id', String(ayId));
        if (academicYear)
            params.append('academic_year', String(academicYear));
        if (date)
            params.append('date', date);
        if (classId)
            params.append('class_id', String(classId));
        if (sectionId)
            params.append('section_id', String(sectionId));
        const res = await fetch(`/api/attendance/history?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch attendance history');
        const data = await res.json();
        return data.history || data.data || [];
    },
    async getRecordDetails(branchId, ayId, classId, sectionId, date, timingId, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branchId),
            class_id: String(classId),
            section_id: String(sectionId),
            date
        });
        if (ayId)
            params.append('academic_year_id', String(ayId));
        if (academicYear)
            params.append('academic_year', String(academicYear));
        if (timingId)
            params.append('timing_id', String(timingId));
        const res = await fetch(`/api/attendance/record-details?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch session record details');
        return await res.json();
    },
    async getMonthlyReport(branchId, ayId, classId, sectionId, month) {
        const params = new URLSearchParams({
            branch_id: String(branchId),
            academic_year_id: String(ayId),
            class_id: String(classId),
            section_id: String(sectionId)
        });
        if (month)
            params.append('month', month);
        const res = await fetch(`/api/attendance/reports/monthly?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch monthly report');
        return await res.json();
    },
    async getStudentIndividualReport(branchId, ayId, studentId, dateFrom, dateTo, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branchId),
            academic_year_id: String(ayId),
            student_id: String(studentId)
        });
        if (dateFrom)
            params.append('date_from', dateFrom);
        if (dateTo)
            params.append('date_to', dateTo);
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/reports/student-individual?${params.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch individual student report');
        return await res.json();
    },
    async updateSingleRecord(payload) {
        const res = await fetch('/api/attendance/update-single', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to update attendance record');
    },
    // Absent Report & Notifications
    async getAbsentReport(params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                searchParams.append(k, String(v));
            }
        });
        const res = await fetch(`/api/attendance/absent-report?${searchParams.toString()}`);
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to fetch absent report');
        const data = await res.json();
        return data.absentees;
    },
    async sendNotifications(branch_id, academic_year_id, notifications) {
        const res = await fetch('/api/attendance/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ branch_id, academic_year_id, notifications })
        });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to dispatch absent notifications');
        return await res.json();
    },
    async retryNotification(id) {
        const res = await fetch(`/api/attendance/notifications/retry/${id}`, { method: 'POST' });
        if (!res.ok)
            throw new Error((await res.json()).error || 'Failed to retry notification');
    },
    // Reports
    async getDailyReport(branch_id, academic_year_id, date, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        if (date)
            params.append('date', date);
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/reports/daily?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch daily report');
        return await res.json();
    },
    async getClassWiseReport(branch_id, academic_year_id, date_from, date_to, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        if (date_from)
            params.append('date_from', date_from);
        if (date_to)
            params.append('date_to', date_to);
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/reports/class-wise?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch class-wise report');
        const data = await res.json();
        return data.classes;
    },
    async getSectionWiseReport(branch_id, academic_year_id, class_id, date_from, date_to, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id),
            class_id: String(class_id)
        });
        if (date_from)
            params.append('date_from', date_from);
        if (date_to)
            params.append('date_to', date_to);
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/reports/section-wise?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch section-wise report');
        const data = await res.json();
        return data.sections;
    },
    async getGenderWiseReport(branch_id, academic_year_id, class_id, section_id, academicYear) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        if (class_id)
            params.append('class_id', String(class_id));
        if (section_id)
            params.append('section_id', String(section_id));
        if (academicYear)
            params.append('academic_year', String(academicYear));
        const res = await fetch(`/api/attendance/reports/gender-wise?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch gender-wise report');
        const data = await res.json();
        return data.gender_breakdown;
    },
    async getStudentWiseReport(branch_id, academic_year_id, class_id, section_id, gender, academicYear, date_from, date_to) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        if (class_id)
            params.append('class_id', String(class_id));
        if (section_id)
            params.append('section_id', String(section_id));
        if (gender && gender !== 'all')
            params.append('gender', gender);
        if (academicYear)
            params.append('academic_year', String(academicYear));
        if (date_from)
            params.append('date_from', date_from);
        if (date_to)
            params.append('date_to', date_to);
        const res = await fetch(`/api/attendance/reports/student-wise?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch student-wise report');
        const data = await res.json();
        return data.students;
    },
    async getLowAttendanceReport(branch_id, academic_year_id, threshold = 75.0) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id),
            threshold: String(threshold)
        });
        const res = await fetch(`/api/attendance/reports/low-attendance?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch low attendance report');
        const data = await res.json();
        return data.low_attendance_students;
    },
    async getConsecutiveAbsentReport(branch_id, academic_year_id, min_days = 3, class_id, section_id) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id),
            min_days: String(min_days)
        });
        if (class_id)
            params.append('class_id', String(class_id));
        if (section_id)
            params.append('section_id', String(section_id));
        const res = await fetch(`/api/attendance/reports/consecutive-absent?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch consecutive absent report');
        const data = await res.json();
        return data.consecutive_absent_students;
    },
    async getConsecutiveLeaveReport(branch_id, academic_year_id, min_days = 2, class_id, section_id) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id),
            min_days: String(min_days)
        });
        if (class_id)
            params.append('class_id', String(class_id));
        if (section_id)
            params.append('section_id', String(section_id));
        const res = await fetch(`/api/attendance/reports/consecutive-leave?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch consecutive leave report');
        const data = await res.json();
        return data.consecutive_leave_students;
    },
    async getConsecutiveLateReport(branch_id, academic_year_id, min_days = 2, class_id, section_id) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id),
            min_days: String(min_days)
        });
        if (class_id)
            params.append('class_id', String(class_id));
        if (section_id)
            params.append('section_id', String(section_id));
        const res = await fetch(`/api/attendance/reports/consecutive-late?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch consecutive late report');
        const data = await res.json();
        return data.consecutive_late_students;
    },
    async getFrequentAbsenceReport(branch_id, academic_year_id, date_from, date_to, class_id, section_id, sort_by) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        if (date_from)
            params.append('date_from', date_from);
        if (date_to)
            params.append('date_to', date_to);
        if (class_id)
            params.append('class_id', String(class_id));
        if (section_id)
            params.append('section_id', String(section_id));
        if (sort_by)
            params.append('sort_by', sort_by);
        const res = await fetch(`/api/attendance/reports/frequent-absence?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch frequent absence report');
        const data = await res.json();
        return data.frequent_absence_students;
    },
    async getLateStudentsReport(branch_id, academic_year_id, date_from, date_to, class_id, section_id) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        if (date_from)
            params.append('date_from', date_from);
        if (date_to)
            params.append('date_to', date_to);
        if (class_id)
            params.append('class_id', String(class_id));
        if (section_id)
            params.append('section_id', String(section_id));
        const res = await fetch(`/api/attendance/reports/late-students?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch late students report');
        const data = await res.json();
        return data.late_students;
    },
    async getCompletionStats(branch_id, academic_year_id, date) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        if (date)
            params.append('date', date);
        const res = await fetch(`/api/attendance/reports/completion?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch attendance completion stats');
        const data = await res.json();
        return data.completion_stats;
    },
    // Student Profile Summary
    async getStudentSummary(studentId, academic_year_id) {
        const params = new URLSearchParams();
        if (academic_year_id)
            params.append('academic_year_id', String(academic_year_id));
        const res = await fetch(`/api/attendance/student-summary/${studentId}?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch student attendance summary');
        return await res.json();
    },
    // Settings
    async getSettings(branch_id, academic_year_id) {
        const params = new URLSearchParams({
            branch_id: String(branch_id),
            academic_year_id: String(academic_year_id)
        });
        const res = await fetch(`/api/attendance/settings?${params.toString()}`);
        if (!res.ok)
            throw new Error('Failed to fetch attendance settings');
        const data = await res.json();
        return data.settings;
    },
    async updateSettings(settings) {
        const res = await fetch('/api/attendance/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (!res.ok)
            throw new Error('Failed to save attendance settings');
        const data = await res.json();
        return data.settings;
    }
};
