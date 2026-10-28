export async function getStudents(params) {
    const query = new URLSearchParams();
    if (params.branch_id !== undefined && params.branch_id !== 'all' && params.branch_id !== null && params.branch_id !== 'undefined') {
        query.append('branch_id', String(params.branch_id));
    }
    if (params.academic_year_id)
        query.append('academic_year_id', String(params.academic_year_id));
    if (params.class_id)
        query.append('class_id', String(params.class_id));
    if (params.section_id)
        query.append('section_id', String(params.section_id));
    if (params.academic_group_id)
        query.append('academic_group_id', String(params.academic_group_id));
    if (params.status && params.status !== 'all')
        query.append('status', params.status);
    if (params.gender && params.gender !== 'all')
        query.append('gender', params.gender);
    if (params.fee_status && params.fee_status !== 'all')
        query.append('fee_status', params.fee_status);
    if (params.admission_type && params.admission_type !== 'all')
        query.append('admission_type', params.admission_type);
    if (params.hostel_status && params.hostel_status !== 'all')
        query.append('hostel_status', params.hostel_status);
    if (params.transport_opted !== undefined && params.transport_opted !== 'all')
        query.append('transport_opted', String(params.transport_opted));
    if (params.search)
        query.append('search', params.search);
    if (params.page)
        query.append('page', String(params.page));
    if (params.page_size)
        query.append('page_size', String(params.page_size));
    if (params.sort_by)
        query.append('sort_by', params.sort_by);
    if (params.sort_order)
        query.append('sort_order', params.sort_order);
    const res = await fetch(`/api/students?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch students');
    }
    return data;
}
export async function getStudentById(id) {
    const res = await fetch(`/api/students/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch student details');
    }
    return data.data;
}
export async function createStudent(formData) {
    const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to register student');
    }
    return data;
}
export async function updateStudent(id, formData) {
    const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update student');
    }
    return data;
}
export async function bulkUpdateStudents(payload) {
    const res = await fetch('/api/students/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to bulk update students');
    }
    return data;
}
export async function changeClassSection(payload) {
    const res = await fetch('/api/students/class-section-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to transfer student');
    }
    return data;
}
export async function bulkChangeClassSection(payload) {
    const res = await fetch('/api/students/bulk-class-section-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to bulk move students');
    }
    return data;
}
export async function getClassSectionHistory(params) {
    const query = new URLSearchParams();
    query.append('branch_id', String(params.branch_id));
    if (params.academic_year_id)
        query.append('academic_year_id', String(params.academic_year_id));
    if (params.search)
        query.append('search', params.search);
    const res = await fetch(`/api/students-class-section-history?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch history');
    }
    return data.data || [];
}
export async function promoteStudents(payload) {
    const res = await fetch('/api/students/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to promote students');
    }
    return data;
}
export async function getPromotionHistory(params) {
    const query = new URLSearchParams();
    query.append('branch_id', String(params.branch_id));
    if (params.search)
        query.append('search', params.search);
    const res = await fetch(`/api/students-promotions-history?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch promotions history');
    }
    return data.data || [];
}
export async function getAcademicGroups(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id && params.branch_id !== 'all' && params.branch_id !== 'undefined')
        query.append('branch_id', String(params.branch_id));
    if (params.academic_year_id && params.academic_year_id !== 'all' && params.academic_year_id !== 'undefined')
        query.append('academic_year_id', String(params.academic_year_id));
    if (params.status && params.status !== 'all')
        query.append('status', params.status);
    const res = await fetch(`/api/academic-groups?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch academic groups');
    }
    return data.data || [];
}
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
    return data;
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
    return data;
}
export async function toggleAcademicGroupStatus(id, status) {
    const res = await fetch(`/api/academic-groups/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to toggle group status');
    }
    return data;
}
export async function assignStudentsToGroup(groupId, payload) {
    const res = await fetch(`/api/academic-groups/${groupId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to assign students to group');
    }
    return data;
}
export async function removeStudentFromGroup(groupId, payload) {
    const res = await fetch(`/api/academic-groups/${groupId}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to remove student from group');
    }
    return data;
}
export async function inactivateStudent(studentId, payload) {
    const res = await fetch(`/api/students/${studentId}/inactivate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to inactivate student');
    }
    return data;
}
export async function reactivateStudent(studentId, payload) {
    const res = await fetch(`/api/students/${studentId}/reactivate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to reactivate student');
    }
    return data;
}
export async function getStudentApprovals(params) {
    const query = new URLSearchParams();
    query.append('branch_id', String(params.branch_id));
    if (params.status)
        query.append('status', params.status);
    if (params.request_type)
        query.append('request_type', params.request_type);
    if (params.student_id)
        query.append('student_id', String(params.student_id));
    if (params.search)
        query.append('search', params.search);
    const res = await fetch(`/api/student-approvals?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch approvals');
    }
    return data.data || [];
}
export async function createStudentApproval(payload) {
    const res = await fetch('/api/student-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to submit approval request');
    }
    return data;
}
export async function approveStudentRequest(id) {
    const res = await fetch(`/api/student-approvals/${id}/approve`, {
        method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to approve request');
    }
    return data;
}
export async function rejectStudentRequest(id, rejection_reason) {
    const res = await fetch(`/api/student-approvals/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to reject request');
    }
    return data;
}
export async function getStudentReports(params) {
    const query = new URLSearchParams();
    query.append('branch_id', String(params.branch_id));
    if (params.academic_year_id)
        query.append('academic_year_id', String(params.academic_year_id));
    query.append('report_type', params.report_type);
    const res = await fetch(`/api/student-reports?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch report data');
    }
    return data.data;
}
