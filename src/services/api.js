export async function getOrganization() {
    const res = await fetch('/api/organization');
    if (!res.ok) {
        throw new Error('Failed to fetch organization');
    }
    const data = await res.json();
    return { organization: data.organization, stats: data.stats };
}
export async function getBranches(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search)
        params.append('search', filters.search);
    if (filters.branch_type && filters.branch_type !== 'all')
        params.append('branch_type', filters.branch_type);
    if (filters.board && filters.board !== 'all')
        params.append('board', filters.board);
    if (filters.status && filters.status !== 'all')
        params.append('status', filters.status);
    if (filters.state && filters.state !== 'all')
        params.append('state', filters.state);
    const res = await fetch(`/api/branches?${params.toString()}`);
    if (!res.ok) {
        throw new Error('Failed to fetch branches');
    }
    const data = await res.json();
    return data.data || [];
}
export async function getBranchById(id) {
    const res = await fetch(`/api/branches/${id}`);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch branch #${id}`);
    }
    const data = await res.json();
    return data.data;
}
export async function createBranch(formData) {
    const res = await fetch('/api/branches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to create branch');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateBranch(id, formData) {
    const res = await fetch(`/api/branches/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to update branch');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateBranchStatus(id, status) {
    const res = await fetch(`/api/branches/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update branch status');
    }
    return data.data;
}
// -------------------------------------------------------------
// Academic Year API Service (Multi-Branch Isolated)
// -------------------------------------------------------------
export async function getAcademicYears(branchId, filters = {}) {
    const params = new URLSearchParams();
    params.append('branch_id', String(branchId));
    if (filters.search)
        params.append('search', filters.search);
    if (filters.status && filters.status !== 'all')
        params.append('status', filters.status);
    if (filters.is_current && filters.is_current !== 'all')
        params.append('is_current', filters.is_current);
    if (filters.is_enabled && filters.is_enabled !== 'all')
        params.append('is_enabled', filters.is_enabled);
    const res = await fetch(`/api/academic-years?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Unable to load academic years.');
    }
    return {
        data: data.data || [],
        count: data.count,
        enabled_count: data.enabled_count,
        branch: data.branch,
        current_academic_year: data.current_academic_year || null
    };
}
export async function getAcademicYearById(id) {
    const res = await fetch(`/api/academic-years/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || `Unable to load academic year #${id}`);
    }
    return data.data;
}
export async function createAcademicYear(formData) {
    const res = await fetch('/api/academic-years', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to create academic year');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateAcademicYear(id, formData) {
    const res = await fetch(`/api/academic-years/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to update academic year');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateAcademicYearStatus(id, status) {
    const res = await fetch(`/api/academic-years/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update academic year status');
    }
    return data.data;
}
export async function setAcademicYearAsCurrent(id) {
    const res = await fetch(`/api/academic-years/${id}/set-current`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to set as current academic year');
    }
    return {
        data: data.data,
        previous_current: data.previous_current || null
    };
}
export async function setAcademicYearAsNext(id) {
    const res = await fetch(`/api/academic-years/${id}/set-next`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to set as next academic year for promotion');
    }
    return data.data;
}
export async function getNextAcademicYear(branchId, currentAcademicYearId) {
    const params = new URLSearchParams();
    if (branchId) params.append('branch_id', String(branchId));
    if (currentAcademicYearId) params.append('current_academic_year_id', String(currentAcademicYearId));
    const res = await fetch(`/api/academic-years/next-year/info?${params.toString()}`);
    const data = await res.json();
    return data;
}
export async function toggleAcademicYearEnabled(id, isEnabled) {
    const res = await fetch(`/api/academic-years/${id}/toggle-enabled`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_enabled: isEnabled })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update academic year selection status');
    }
    return {
        data: data.data,
        message: data.message,
        enabled_count: data.enabled_count
    };
}
export async function getAcademicYearAuditLogs(branchId) {
    const url = branchId ? `/api/academic-years-audit/logs?branch_id=${branchId}` : '/api/academic-years-audit/logs';
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch audit logs');
    }
    return data.data || [];
}
// -------------------------------------------------------------
// Classes API Service (Multi-Branch & Academic Year Scoped)
// -------------------------------------------------------------
export async function getClasses(branchId, academicYearId, filters = {}) {
    const params = new URLSearchParams();
    if (branchId) params.append('branch_id', String(branchId));
    if (academicYearId) params.append('academic_year_id', String(academicYearId));
    if (filters.include_all) params.append('include_all', 'true');
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    const res = await fetch(`/api/classes?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Unable to load classes.');
    }
    return {
        data: data.data || [],
        count: data.count || 0,
        branch: data.branch,
        academic_year: data.academic_year
    };
}
export async function getAcademicYearClasses(branchId, academicYearId, filters = {}) {
    return getClasses(branchId, academicYearId, { ...filters, include_all: true });
}
export async function toggleAcademicYearClass({ branch_id, academic_year_id, class_id, is_enabled }) {
    const res = await fetch('/api/classes/academic-year-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch_id, academic_year_id, class_id, is_enabled })
    });
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.message || 'Failed to update class status for this academic year');
        err.is_locked = data.is_locked;
        err.student_count = data.student_count;
        throw err;
    }
    return data;
}
export async function bulkToggleAcademicYearClasses({ branch_id, academic_year_id, class_ids, is_enabled }) {
    const res = await fetch('/api/classes/academic-year-bulk-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch_id, academic_year_id, class_ids, is_enabled })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update classes for this academic year');
    }
    return data;
}
export async function getClassById(id) {
    const res = await fetch(`/api/classes/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || `Unable to load class #${id}`);
    }
    return data.data;
}
export async function createClass(formData) {
    const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to create class');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateClass(id, formData) {
    const res = await fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to update class');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateClassStatus(id, status) {
    const res = await fetch(`/api/classes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update class status');
    }
    return data.data;
}
// -------------------------------------------------------------
// Sections API Service (Multi-Branch & Academic Year Scoped)
// -------------------------------------------------------------
export async function getSections(branchId, academicYearId, filters = {}) {
    const params = new URLSearchParams();
    params.append('branch_id', String(branchId));
    if (academicYearId) {
        params.append('academic_year_id', String(academicYearId));
    }
    if (filters.search)
        params.append('search', filters.search);
    if (filters.status && filters.status !== 'all')
        params.append('status', filters.status);
    const res = await fetch(`/api/sections?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Unable to load sections.');
    }
    return {
        data: data.data || [],
        count: data.count || 0,
        branch: data.branch,
        academic_year: data.academic_year
    };
}
export async function getSectionById(id) {
    const res = await fetch(`/api/sections/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || `Unable to load section #${id}`);
    }
    return data.data;
}
export async function createSection(formData) {
    const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to create section');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateSection(id, formData) {
    const res = await fetch(`/api/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to update section');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateSectionStatus(id, status) {
    const res = await fetch(`/api/sections/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update section status');
    }
    return data.data;
}
// -------------------------------------------------------------
// Class & Section Mapping API Service
// -------------------------------------------------------------
export async function getClassSectionMatrix(branchId, academicYearId, filters = {}) {
    const params = new URLSearchParams();
    params.append('branch_id', String(branchId));
    if (academicYearId) {
        params.append('academic_year_id', String(academicYearId));
    }
    if (filters.search)
        params.append('search', filters.search);
    if (filters.status && filters.status !== 'all')
        params.append('status', filters.status);
    const res = await fetch(`/api/class-sections?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Unable to load class and section mappings.');
    }
    return {
        data: data.data,
        branch: data.branch,
        academic_year: data.academic_year
    };
}
export async function saveClassSectionMatrix(branchId, academicYearId, updates) {
    const res = await fetch('/api/class-sections/save-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            branch_id: branchId,
            academic_year_id: academicYearId,
            updates
        })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to save matrix changes.');
    }
    return data.data;
}
export async function saveClassMappings(branchId, academicYearId, classId, sectionIds) {
    const res = await fetch(`/api/class-sections/classes/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            branch_id: branchId,
            academic_year_id: academicYearId,
            section_ids: sectionIds
        })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update class mappings.');
    }
    return data.data;
}
export async function getSectionsByClass(classId, branchId, academicYearId) {
    try {
        const secRes = await getSections(branchId, academicYearId);
        if (secRes && Array.isArray(secRes.data) && secRes.data.length > 0) {
            const matched = secRes.data.filter((s) => Number(s.class_id) === Number(classId));
            if (matched.length > 0) {
                return matched.map((s) => ({
                    ...s,
                    id: s.id,
                    name: s.section_name || s.name,
                    section_name: s.section_name || s.name
                }));
            }
        }

        const res = await getClassSectionMatrix(branchId, academicYearId);
        if (res && res.data) {
            const summaryItem = (res.data.summary || []).find((s) => s.class_id === classId);
            if (summaryItem && Array.isArray(summaryItem.section_ids) && summaryItem.section_ids.length > 0) {
                const secIdSet = new Set(summaryItem.section_ids);
                return (res.data.sections || []).filter((sec) => secIdSet.has(sec.id));
            }
            const mappedSectionIds = (res.data.mappings || [])
                .filter((m) => m.class_id === classId && m.status === 'Active')
                .map((m) => m.section_id);
            if (mappedSectionIds.length > 0) {
                const set = new Set(mappedSectionIds);
                return (res.data.sections || []).filter((sec) => set.has(sec.id));
            }
            return (res.data.sections || []).filter((sec) => sec.status === 'Active');
        }
        return [];
    }
    catch (err) {
        console.error('Failed to get sections by class:', err);
        return [];
    }
}
// -------------------------------------------------------------
// Subjects API Service
// -------------------------------------------------------------
export async function getSubjects(branchId, academicYearId, filters = {}) {
    const params = new URLSearchParams();
    params.append('branch_id', String(branchId));
    if (academicYearId) {
        params.append('academic_year_id', String(academicYearId));
    }
    if (filters.search)
        params.append('search', filters.search);
    if (filters.subject_type && filters.subject_type !== 'all')
        params.append('subject_type', filters.subject_type);
    if (filters.status && filters.status !== 'all')
        params.append('status', filters.status);
    const res = await fetch(`/api/subjects?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch subjects');
    }
    return {
        data: data.data || [],
        branch: data.branch,
        academic_year: data.academic_year
    };
}
export async function getSubjectById(id) {
    const res = await fetch(`/api/subjects/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || `Failed to fetch subject #${id}`);
    }
    return data.data;
}
export async function createSubject(formData) {
    const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to create subject');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateSubject(id, formData) {
    const res = await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to update subject');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateSubjectStatus(id, status) {
    const res = await fetch(`/api/subjects/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update subject status');
    }
}
export async function deleteSubject(id) {
    const res = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to delete subject');
    }
}
export async function getClassSubjects(branchId, academicYearId, classId) {
    const params = new URLSearchParams();
    params.append('branch_id', String(branchId));
    if (academicYearId)
        params.append('academic_year_id', String(academicYearId));
    if (classId)
        params.append('class_id', String(classId));
    const res = await fetch(`/api/class-subjects?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch class subjects');
    }
    return data.data || [];
}
export async function assignSubjectsToClass(branchId, academicYearId, classId, subjectIds) {
    const res = await fetch('/api/class-subjects/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            branch_id: branchId,
            academic_year_id: academicYearId,
            class_id: classId,
            subject_ids: subjectIds
        })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to map subjects to class');
    }
}
// -------------------------------------------------------------
// Students / SIS Service Exports
// -------------------------------------------------------------
export * from './studentApi';
export async function getSuperAdminDashboardData(branchId, academicYearName, userRole = 'super_admin', assignedBranchId = 1) {
    const params = new URLSearchParams();
    if (branchId !== undefined && branchId !== null) {
        params.append('branch_id', String(branchId));
    }
    if (academicYearName) {
        params.append('academic_year_name', academicYearName);
    }
    const res = await fetch(`/api/dashboard/super-admin?${params.toString()}`, {
        headers: {
            'x-user-role': userRole,
            'x-assigned-branch-id': String(assignedBranchId)
        }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch Super Admin dashboard metrics');
    }
    return data.data;
}
export async function getDashboardDrillDown(params) {
    const q = new URLSearchParams();
    q.append('type', params.type);
    if (params.level)
        q.append('level', params.level);
    if (params.branch_id !== undefined && params.branch_id !== null)
        q.append('branch_id', String(params.branch_id));
    if (params.academic_year_name)
        q.append('academic_year_name', params.academic_year_name);
    if (params.class_id)
        q.append('class_id', String(params.class_id));
    if (params.section_id)
        q.append('section_id', String(params.section_id));
    if (params.gender)
        q.append('gender', params.gender);
    if (params.search)
        q.append('search', params.search);
    if (params.page)
        q.append('page', String(params.page));
    if (params.limit)
        q.append('limit', String(params.limit));
    const res = await fetch(`/api/dashboard/drill-down?${q.toString()}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch drill-down metrics');
    }
    return data;
}
// -------------------------------------------------------------
// Class-Wise & Group-Wise Subjects API Service
// -------------------------------------------------------------
export async function getClassSubjectsList(filters) {
    const params = new URLSearchParams();
    params.append('branch_id', String(filters.branch_id));
    if (filters.academic_year_id)
        params.append('academic_year_id', String(filters.academic_year_id));
    if (filters.board && filters.board !== 'all')
        params.append('board', filters.board);
    if (filters.class_id && filters.class_id !== 'all')
        params.append('class_id', String(filters.class_id));
    if (filters.group_id && filters.group_id !== 'all')
        params.append('group_id', String(filters.group_id));
    if (filters.category_name && filters.category_name !== 'all')
        params.append('category_name', filters.category_name);
    if (filters.subject_type && filters.subject_type !== 'all')
        params.append('subject_type', filters.subject_type);
    if (filters.status && filters.status !== 'all')
        params.append('status', filters.status);
    if (filters.search)
        params.append('search', filters.search);
    const res = await fetch(`/api/class-subjects?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch class subjects');
    }
    return data.data || [];
}
export async function createClassSubject(formData) {
    const res = await fetch('/api/class-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to create class subject');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateClassSubject(id, formData) {
    const res = await fetch(`/api/class-subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'Failed to update class subject');
        error.errors = data.errors;
        throw error;
    }
    return data.data;
}
export async function updateClassSubjectStatus(id, status) {
    const res = await fetch(`/api/class-subjects/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update subject status');
    }
}
export async function deleteClassSubject(id, force = false) {
    const res = await fetch(`/api/class-subjects/${id}${force ? '?force=true' : ''}`, {
        method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to delete subject mapping');
    }
    return data;
}
export async function copyClassSubjects(payload) {
    const res = await fetch('/api/class-subjects/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to copy subjects');
    }
    return data;
}
// -------------------------------------------------------------
// Academic Groups / Streams API Service
// -------------------------------------------------------------
export async function getAcademicGroupsList(params = {}) {
    const q = new URLSearchParams();
    if (params.branch_id && params.branch_id !== 'all' && params.branch_id !== 'undefined')
        q.append('branch_id', String(params.branch_id));
    if (params.academic_year_id && params.academic_year_id !== 'all' && params.academic_year_id !== 'undefined')
        q.append('academic_year_id', String(params.academic_year_id));
    if (params.class_id && params.class_id !== 'all')
        q.append('class_id', String(params.class_id));
    if (params.board && params.board !== 'all')
        q.append('board', params.board);
    if (params.status && params.status !== 'all')
        q.append('status', params.status);
    if (params.search)
        q.append('search', params.search);
    const res = await fetch(`/api/academic-groups?${q.toString()}`);
    if (!res.ok) {
        throw new Error('Failed to fetch academic groups');
    }
    const data = await res.json();
    return data.data || [];
}
export const getAcademicGroups = getAcademicGroupsList;
export async function createAcademicGroup(payload) {
    const res = await fetch('/api/academic-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to create academic group');
    }
    return data.data;
}
export async function updateAcademicGroup(id, payload) {
    const res = await fetch(`/api/academic-groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update academic group');
    }
}
export async function updateAcademicGroupStatus(id, status) {
    const res = await fetch(`/api/academic-groups/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update group status');
    }
}
export async function deleteAcademicGroup(id) {
    const res = await fetch(`/api/academic-groups/${id}`, {
        method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to delete academic group');
    }
}
// -------------------------------------------------------------
// Subject Categories API Service
// -------------------------------------------------------------
export async function getSubjectCategoriesList() {
    const res = await fetch('/api/subject-categories');
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch subject categories');
    }
    return data.data || [];
}
export async function createSubjectCategory(payload) {
    const res = await fetch('/api/subject-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to create category');
    }
    return data.data;
}
export async function updateSubjectCategoryStatus(id, status) {
    const res = await fetch(`/api/subject-categories/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update category status');
    }
}
export async function getMasterSubjectsList(search) {
    const url = search ? `/api/subjects/master?search=${encodeURIComponent(search)}` : '/api/subjects/master';
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch master subjects');
    }
    return data.data || [];
}

export async function getStudentSubjects(studentId) {
    const res = await fetch(`/api/students/${studentId}/subjects`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch student subjects');
    }
    return data.data || [];
}

export async function updateStudentSubjects(studentId, payload) {
    const res = await fetch(`/api/students/${studentId}/subjects`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update student subjects');
    }
    return data.data || [];
}

export async function getSectionSubjectMapping({ branch_id, academic_year_id, class_id, section_id }) {
    const params = new URLSearchParams();
    if (branch_id) params.append('branch_id', branch_id);
    if (academic_year_id) params.append('academic_year_id', academic_year_id);
    if (class_id) params.append('class_id', class_id);
    if (section_id && section_id !== 'all') params.append('section_id', section_id);

    const res = await fetch(`/api/students/section-subject-mapping?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to load section subject mapping');
    }
    return data.data;
}

export async function bulkAssignSectionSubjects(payload) {
    const res = await fetch('/api/students/bulk-assign-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to bulk assign subjects');
    }
    return data;
}


