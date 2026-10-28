import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  UserX, 
  UserCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Eye, 
  Download, 
  RefreshCw, 
  RotateCcw, 
  Plus, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  ArrowRight
} from 'lucide-react';
import { 
  getStudents, 
  getClasses, 
  getSections, 
  getAcademicGroups, 
  getBranches,
  createStudentApproval,
  getStudentApprovals
} from '../../services/api';
import { useErp } from '../../context/ErpContext';

export const InactiveStudentsView = ({ branchId, academicYearId, onViewStudent, onRefresh, onNavigateTab }) => {
    const { branches: contextBranches, showToast, isSuperAdmin, assignedBranchId, accessibleBranches, assignedBranch } = useErp();
    const [activeTab, setActiveTab] = useState('list');

    // Filter States (Matching user screenshot)
    const [selectedBranchId, setSelectedBranchId] = useState(() => {
        if (!isSuperAdmin && assignedBranchId) return Number(assignedBranchId);
        return branchId || 'all';
    });
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [selectedSectionId, setSelectedSectionId] = useState('all');
    const [selectedGroupId, setSelectedGroupId] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedGender, setSelectedGender] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Lookup Options
    const [branchesList, setBranchesList] = useState(() => {
        if (!isSuperAdmin) {
            return accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : (assignedBranch ? [assignedBranch] : []);
        }
        return contextBranches || [];
    });
    const [classesList, setClassesList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [academicGroupsList, setAcademicGroupsList] = useState([]);

    // Students list and loading states
    const [inactiveStudents, setInactiveStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Checkbox Selection
    const [selectedIds, setSelectedIds] = useState([]);

    // Single & Bulk Inactivation Modals
    const [isSingleInactivateModalOpen, setIsSingleInactivateModalOpen] = useState(false);
    const [isBulkInactivateModalOpen, setIsBulkInactivateModalOpen] = useState(false);
    const [pendingApprovalsMap, setPendingApprovalsMap] = useState({});
    const [bulkInactivateForm, setBulkInactivateForm] = useState({
        status: 'Inactive',
        reason: 'Parent requested withdrawal / academic discontinuation',
        remarks: ''
    });

    // Inactivation Modal / Form
    const [activeCandidateSearch, setActiveCandidateSearch] = useState('');
    const [activeCandidates, setActiveCandidates] = useState([]);
    const [selectedStudentToInactivate, setSelectedStudentToInactivate] = useState(null);
    const [inactivateForm, setInactivateForm] = useState({
        status: 'TC Issued',
        effective_date: new Date().toISOString().split('T')[0],
        reason: 'Parent relocation / Transfer certificate requested',
        remarks: '',
        tc_number: `TC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        tc_date: new Date().toISOString().split('T')[0]
    });

    // Reactivate Modal
    const [selectedStudentToReactivate, setSelectedStudentToReactivate] = useState(null);
    const [reactivateForm, setReactivateForm] = useState({
        effective_date: new Date().toISOString().split('T')[0],
        reason: 'Re-admission upon parent return',
        remarks: ''
    });

    // Status History
    const [historyList, setHistoryList] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Feedback states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Sync branches from context
    useEffect(() => {
        if (!isSuperAdmin) {
            setBranchesList(accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : (assignedBranch ? [assignedBranch] : []));
            setSelectedBranchId(assignedBranchId ? Number(assignedBranchId) : (accessibleBranches[0]?.id || 1));
            return;
        }
        if (contextBranches && contextBranches.length > 0) {
            setBranchesList(contextBranches);
        } else {
            getBranches().then(res => {
                if (Array.isArray(res)) setBranchesList(res);
            }).catch(err => console.warn('Could not fetch branches:', err));
        }
    }, [contextBranches, isSuperAdmin, accessibleBranches, assignedBranch, assignedBranchId]);

    // Sync selectedBranchId when branchId prop changes
    useEffect(() => {
        if (!isSuperAdmin && assignedBranchId) {
            setSelectedBranchId(Number(assignedBranchId));
        } else if (branchId) {
            setSelectedBranchId(branchId);
        }
    }, [branchId, isSuperAdmin, assignedBranchId]);

    // Load Classes, Sections, and Academic Groups for filters
    useEffect(() => {
        let isMounted = true;
        const effectiveBranch = selectedBranchId === 'all' ? undefined : selectedBranchId;

        Promise.allSettled([
            getClasses(effectiveBranch, academicYearId),
            getSections(effectiveBranch, academicYearId),
            getAcademicGroups({
                branch_id: effectiveBranch ? Number(effectiveBranch) : undefined,
                academic_year_id: academicYearId
            })
        ]).then(([clsRes, secRes, grpRes]) => {
            if (!isMounted) return;
            setClassesList(clsRes.status === 'fulfilled' && clsRes.value?.data ? clsRes.value.data : []);
            setSectionsList(secRes.status === 'fulfilled' && secRes.value?.data ? secRes.value.data : []);
            setAcademicGroupsList(grpRes.status === 'fulfilled' && grpRes.value ? grpRes.value : []);
        }).catch(console.warn);

        return () => {
            isMounted = false;
        };
    }, [selectedBranchId, academicYearId]);

    // Available sections based on selected class
    const availableSections = useMemo(() => {
        if (!Array.isArray(sectionsList)) return [];
        if (selectedClassId && selectedClassId !== 'all') {
            return sectionsList
                .filter(s => String(s.class_id) === String(selectedClassId))
                .map(s => {
                    const name = s.name || s.section_name || `Section ${s.id}`;
                    return { id: s.id, value: String(s.id), name: `Section ${name}` };
                });
        }
        const seen = new Set();
        const list = [];
        sectionsList.forEach(s => {
            const name = (s.name || s.section_name || '').trim();
            if (name && !seen.has(name.toUpperCase())) {
                seen.add(name.toUpperCase());
                list.push({ id: name, value: name, name: `Section ${name}` });
            }
        });
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }, [sectionsList, selectedClassId]);

    // Active filter count
    const activeFiltersCount = useMemo(() => {
        return [
            selectedBranchId !== 'all' && selectedBranchId !== branchId,
            selectedClassId !== 'all',
            selectedSectionId !== 'all',
            selectedGroupId !== 'all',
            selectedStatus !== 'all',
            selectedGender !== 'all',
            searchQuery.trim().length > 0
        ].filter(Boolean).length;
    }, [selectedBranchId, branchId, selectedClassId, selectedSectionId, selectedGroupId, selectedStatus, selectedGender, searchQuery]);

    // Clear filters
    const handleClearFilters = () => {
        setSelectedBranchId(branchId || 'all');
        setSelectedClassId('all');
        setSelectedSectionId('all');
        setSelectedGroupId('all');
        setSelectedStatus('all');
        setSelectedGender('all');
        setSearchQuery('');
        setSelectedIds([]);
    };

    // Load inactive students
    const loadInactiveStudents = useCallback(() => {
        const effectiveBranch = selectedBranchId === 'all' ? undefined : selectedBranchId;
        setIsLoading(true);
        const isSecNum = !isNaN(Number(selectedSectionId)) && selectedSectionId !== 'all';

        getStudents({
            branch_id: effectiveBranch,
            academic_year_id: academicYearId,
            class_id: selectedClassId !== 'all' ? selectedClassId : undefined,
            section_id: isSecNum ? Number(selectedSectionId) : (selectedSectionId !== 'all' ? selectedSectionId : undefined),
            section_name: (!isSecNum && selectedSectionId !== 'all') ? selectedSectionId : undefined,
            academic_group_id: selectedGroupId !== 'all' ? selectedGroupId : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            gender: selectedGender !== 'all' ? selectedGender : undefined,
            search: searchQuery.trim() || undefined,
            page_size: 200
        })
            .then(res => {
                const data = res.data || [];
                setInactiveStudents(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [selectedBranchId, academicYearId, selectedClassId, selectedSectionId, selectedGroupId, selectedStatus, selectedGender, searchQuery]);

    useEffect(() => {
        loadInactiveStudents();
    }, [loadInactiveStudents]);
    // Load pending approval requests to track follow
    const loadPendingApprovals = useCallback(() => {
        const effectiveBranch = selectedBranchId !== 'all' ? selectedBranchId : (branchId || 1);
        getStudentApprovals({
            branch_id: effectiveBranch,
            status: 'Pending'
        }).then(res => {
            if (Array.isArray(res)) {
                const map = {};
                res.forEach(item => {
                    if (item.student_id) {
                        map[item.student_id] = item;
                    }
                });
                setPendingApprovalsMap(map);
            }
        }).catch(console.warn);
    }, [selectedBranchId, branchId]);

    useEffect(() => {
        loadPendingApprovals();
    }, [loadPendingApprovals]);

    // Search active candidates to inactivate by Student ID, admission no, or name
    useEffect(() => {
        const query = activeCandidateSearch.trim();
        const effectiveBranch = selectedBranchId !== 'all' ? selectedBranchId : (branchId || 1);
        if (query.length > 0) {
            getStudents({
                branch_id: effectiveBranch,
                academic_year_id: academicYearId,
                status: 'Active',
                search: query,
                page_size: 15
            })
                .then(res => setActiveCandidates(res.data || []))
                .catch(console.error);
        }
        else {
            setActiveCandidates([]);
        }
    }, [branchId, selectedBranchId, academicYearId, activeCandidateSearch]);
    // Load History
    const loadHistory = () => {
        if (!branchId)
            return;
        setIsLoadingHistory(true);
        fetch(`/api/students-status-history?branch_id=${branchId}`)
            .then(res => res.json())
            .then(data => setHistoryList(data.data || []))
            .catch(console.error)
            .finally(() => setIsLoadingHistory(false));
    };
    useEffect(() => {
        if (activeTab === 'history') {
            loadHistory();
        }
    }, [activeTab, branchId]);
    // Export CSV
    const handleExportCSV = () => {
        if (inactiveStudents.length === 0) return;
        const headers = ['Admission No', 'Student Name', 'Class', 'Section', 'Status', 'Guardian', 'Mobile'];
        const rows = inactiveStudents.map(s => [
            `"${s.admission_number || ''}"`,
            `"${s.full_name || ''}"`,
            `"${s.class_name || ''}"`,
            `"${s.section_name || ''}"`,
            `"${s.current_status || ''}"`,
            `"${s.father_name || ''}"`,
            `"${s.father_mobile || ''}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `Inactive_Students_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Checkbox handlers
    const handleSelectAll = () => {
        if (selectedIds.length === inactiveStudents.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(inactiveStudents.map(s => s.id));
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    // SUBMIT INACTIVATION VIA APPROVAL WORKFLOW (Routes to /students/approvals)
    const handleInactivateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudentToInactivate) {
            setErrorMessage('Please select a student to mark as inactive.');
            return;
        }
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const studentId = selectedStudentToInactivate.student_id || selectedStudentToInactivate.id;
            const studentName = selectedStudentToInactivate.full_name;
            const effectiveBranch = branchId || selectedStudentToInactivate.branch_id || 1;

            const res = await createStudentApproval({
                branch_id: effectiveBranch,
                academic_year_id: academicYearId || 4,
                student_id: selectedStudentToInactivate.id,
                request_type: 'Student Inactivation / TC',
                current_value: selectedStudentToInactivate.current_status || 'Active',
                requested_value: inactivateForm.status,
                reason: inactivateForm.reason,
                remarks: `${inactivateForm.remarks || ''}${inactivateForm.status === 'TC Issued' ? ` [TC No: ${inactivateForm.tc_number}, Date: ${inactivateForm.tc_date}]` : ''}`,
                requested_by: 'Staff Administrator'
            });

            const reqId = res?.data?.id;
            setIsSingleInactivateModalOpen(false);
            setSelectedStudentToInactivate(null);
            setActiveCandidateSearch('');
            setActiveTab('list');

            if (showToast) {
                showToast(`Inactivation request ${reqId ? `#${reqId} ` : ''}for Student ID #${studentId} (${studentName}) routed to Student Approvals!`, 'success');
            }

            setSuccessMessage({
                text: `Inactivation approval request ${reqId ? `#${reqId} ` : ''}submitted for Student ID #${studentId} (${studentName}). Target status: "${inactivateForm.status}".`,
                studentId: selectedStudentToInactivate.id,
                reqId: reqId
            });

            loadInactiveStudents();
            loadPendingApprovals();
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to submit inactivation approval request.');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    // SUBMIT BULK INACTIVATION VIA APPROVAL WORKFLOW
    const handleBulkInactivateSubmit = async (e) => {
        e.preventDefault();
        if (selectedIds.length === 0) return;
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const selectedStudentsList = inactiveStudents.filter(s => selectedIds.includes(s.id));
            for (const s of selectedStudentsList) {
                await createStudentApproval({
                    branch_id: branchId || s.branch_id || 1,
                    academic_year_id: academicYearId || 4,
                    student_id: s.id,
                    request_type: 'Student Inactivation / TC',
                    current_value: s.current_status || 'Active',
                    requested_value: bulkInactivateForm.status,
                    reason: bulkInactivateForm.reason,
                    remarks: bulkInactivateForm.remarks || '',
                    requested_by: 'Staff Administrator (Bulk Action)'
                });
            }

            const count = selectedIds.length;
            setSelectedIds([]);
            setIsBulkInactivateModalOpen(false);

            if (showToast) {
                showToast(`${count} student inactivation requests routed to Student Approvals`, 'success');
            }

            setSuccessMessage({
                text: `${count} student inactivation request(s) submitted to Student Approvals for admin sign-off.`,
                isBulk: true
            });

            loadInactiveStudents();
            loadPendingApprovals();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to submit bulk inactivation approval requests.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // SUBMIT REACTIVATION VIA APPROVAL WORKFLOW (Routes to /students/approvals)
    const handleReactivateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudentToReactivate)
            return;
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const studentId = selectedStudentToReactivate.student_id || selectedStudentToReactivate.id;
            const studentName = selectedStudentToReactivate.full_name;

            const res = await createStudentApproval({
                branch_id: branchId || selectedStudentToReactivate.branch_id || 1,
                academic_year_id: academicYearId || 4,
                student_id: selectedStudentToReactivate.id,
                request_type: 'Student Reactivation',
                current_value: selectedStudentToReactivate.current_status || 'Inactive',
                requested_value: 'Active',
                reason: reactivateForm.reason,
                remarks: reactivateForm.remarks || '',
                requested_by: 'Staff Administrator'
            });

            const reqId = res?.data?.id;
            setSelectedStudentToReactivate(null);

            if (showToast) {
                showToast(`Reactivation request ${reqId ? `#${reqId} ` : ''}for Student ID #${studentId} (${studentName}) routed to Student Approvals!`, 'success');
            }

            setSuccessMessage({
                text: `Reactivation approval request ${reqId ? `#${reqId} ` : ''}submitted for Student ID #${studentId} (${studentName}).`,
                studentId: selectedStudentToReactivate.id,
                reqId: reqId
            });

            loadInactiveStudents();
            loadPendingApprovals();
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to submit reactivation approval request.');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (<div className="space-y-4">
      {/* Top Header & Sub-navigation */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <UserX className="w-5 h-5 text-rose-600"/>
            <span>Inactive Students & Transfer Certificates (TC)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserve archived student records for transferred, withdrawn, or TC-issued students with full reactivation capabilities.
          </p>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-semibold self-start sm:self-auto">
          <button type="button" onClick={() => { setActiveTab('list'); setSuccessMessage(null); }} className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>
            Inactive Roster ({inactiveStudents.length})
          </button>

          <button type="button" onClick={() => { setActiveTab('inactivate'); setSuccessMessage(null); }} className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'inactivate' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>
            Issue TC / Inactivate
          </button>

          <button type="button" onClick={() => { setActiveTab('history'); setSuccessMessage(null); }} className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>
            Audit Log
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (<div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/>
            <span className="font-semibold">{typeof successMessage === 'object' ? successMessage.text : successMessage}</span>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => {
                const query = typeof successMessage === 'object' && successMessage.studentId 
                  ? `?student_id=${successMessage.studentId}` 
                  : '';
                onNavigateTab('approvals', query);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0 shadow-2xs transition-colors"
            >
              <span>Check Follow in Approvals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>)}

      {errorMessage && (<div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0"/>
          <span>{errorMessage}</span>
        </div>)}

      {/* 1. INACTIVE ROSTER TAB */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Top Filter Bar Matching Attached Image */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-4">
            {/* Top row: Branch, Class, Section, Academic Group, Status, Gender */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Branch {!isSuperAdmin && <span className="text-[10px] text-teal-600 font-normal">(Assigned)</span>}
                </label>
                {isSuperAdmin ? (
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    <option value="all">All Branches</option>
                    {branchesList.map(b => (
                      <option key={b.id} value={b.id}>{b.name || b.branch_name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full text-xs px-2.5 py-2 border border-emerald-200 bg-emerald-50 rounded-lg font-bold text-emerald-800 truncate">
                    {branchesList[0]?.branch_name || branchesList[0]?.name || 'Assigned Branch'}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedSectionId('all');
                  }}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="all">All Classes</option>
                  {classesList.map(c => (
                    <option key={c.id} value={c.id}>{c.name || c.class_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Section</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="all">All Sections</option>
                  {availableSections.map(s => (
                    <option key={s.id || s.value} value={s.value || s.id}>{s.name || s.section_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Academic Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="all">All Groups</option>
                  {academicGroupsList.map(g => (
                    <option key={g.id} value={g.id}>{g.name || g.group_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none font-semibold text-rose-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Transferred">Transferred</option>
                  <option value="TC Issued">TC Issued</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Left School">Left School</option>
                  <option value="Active">Active (To Inactivate)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Gender</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Bottom row: Search, Refresh, Export, Action button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, admission no, roll no, mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-slate-50/50 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={loadInactiveStudents}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Reload list"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={inactiveStudents.length === 0}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Export records to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedIds.length > 0) {
                      setIsBulkInactivateModalOpen(true);
                    } else {
                      setSelectedStudentToInactivate(null);
                      setActiveCandidateSearch('');
                      setIsSingleInactivateModalOpen(true);
                    }
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>
                    {selectedIds.length > 0
                      ? `Inactivate Selected (${selectedIds.length})`
                      : 'Inactivate Student'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Selection Notice Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 px-4 flex items-center justify-between text-xs animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-rose-900 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                <span>{selectedIds.length} student(s) selected</span>
                <span className="text-rose-600/70 font-normal">| Submit to approvals for inactivation / TC</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={() => setIsBulkInactivateModalOpen(true)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Inactivate & Send to Approvals</span>
                </button>
              </div>
            </div>
          )}

          {/* Records Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={inactiveStudents.length > 0 && selectedIds.length === inactiveStudents.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        title="Select All"
                      />
                    </th>
                    <th className="p-3">Admission No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class & Section</th>
                    <th className="p-3">Guardian</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                        <span>Loading student records...</span>
                      </td>
                    </tr>
                  ) : inactiveStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        No student records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    inactiveStudents.map((s) => {
                      const isSelected = selectedIds.includes(s.id);
                      const isStudentActive = s.current_status === 'Active';
                      const pendingApproval = pendingApprovalsMap[s.id];
                      
                      // Inactivation pending is only relevant if the student is currently Active
                      const hasPendingInactivation = isStudentActive && pendingApproval && (
                        pendingApproval.request_type === 'Student Inactivation / TC' || 
                        pendingApproval.request_type === 'Status Change'
                      );
                      // Reactivation pending is only relevant if the student is currently Inactive / TC Issued / etc.
                      const hasPendingReactivation = !isStudentActive && pendingApproval && (
                        pendingApproval.request_type === 'Student Reactivation'
                      );
                      const hasRelevantPendingApproval = hasPendingInactivation || hasPendingReactivation;

                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-rose-50/40' : ''
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(s.id)}
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-mono font-semibold text-slate-700">
                            {s.admission_number || 'N/A'}
                          </td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => onViewStudent(s.id)}
                              className="font-bold text-slate-900 hover:text-emerald-700 text-left block cursor-pointer"
                            >
                              {s.full_name}
                            </button>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {s.student_id || s.id}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800">
                              {s.class_name || 'N/A'}
                            </span>{' '}
                            - {s.section_name || 'N/A'}
                          </td>
                          <td className="p-3">
                            <div className="text-slate-700">{s.father_name || s.guardian_name || 'N/A'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {s.father_mobile || s.emergency_contact || ''}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                  isStudentActive
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}
                              >
                                {s.current_status || 'Inactive'}
                              </span>

                              {hasRelevantPendingApproval && (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                                  <span>{hasPendingReactivation ? 'Reactivation Pending' : 'Approval Pending'}</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => onViewStudent(s.id)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="View Student Profile"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {hasRelevantPendingApproval ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onNavigateTab) {
                                      onNavigateTab('approvals', `?student_id=${s.id}`);
                                    }
                                  }}
                                  className="flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                  title={`Check Follow Approval Request #${pendingApproval?.id} for Student ID #${s.id}`}
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Check Follow</span>
                                </button>
                              ) : isStudentActive ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedStudentToInactivate(s);
                                    setIsSingleInactivateModalOpen(true);
                                  }}
                                  className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                  title="Inactivate student via Approval Workflow"
                                >
                                  <UserX className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Inactivate</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudentToReactivate(s)}
                                  className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                                  title="Submit Reactivation for Approval"
                                >
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Reactivate</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Summary */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {inactiveStudents.length} student record(s)</span>
              <span>Approval requests will route directly to <strong className="text-slate-700">/students/approvals</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 2. INACTIVATE / ISSUE TC TAB */}
      {activeTab === 'inactivate' && (<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Issue Transfer Certificate or Inactivate Student</h3>
            <p className="text-xs text-slate-500">
              The student will be safely archived without deleting any historical grades, fee records, or attendances.
            </p>
          </div>

          <form onSubmit={handleInactivateSubmit} className="space-y-5 text-xs max-w-2xl">
            {/* Step 1: Select Active Pupil */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Select Active Student *</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <input type="text" placeholder="Type name or admission number of pupil..." value={activeCandidateSearch} onChange={(e) => setActiveCandidateSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"/>
              </div>

              {/* Candidate Dropdown */}
              {activeCandidates.length > 0 && (<div className="mt-1 border border-slate-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-100 shadow-sm">
                  {activeCandidates.map(c => (<button key={c.id} type="button" onClick={() => {
                        setSelectedStudentToInactivate(c);
                        setActiveCandidates([]);
                        setActiveCandidateSearch('');
                    }} className="w-full text-left p-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer">
                      <div>
                        <div className="font-bold text-slate-900">{c.full_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.admission_number} • {c.class_name}-{c.section_name}</div>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">Select</span>
                    </button>))}
                </div>)}

              {selectedStudentToInactivate && (<div className="mt-2 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-950 block">{selectedStudentToInactivate.full_name}</span>
                    <span className="text-emerald-800 font-mono text-[11px]">
                      {selectedStudentToInactivate.admission_number} • {selectedStudentToInactivate.class_name}-{selectedStudentToInactivate.section_name}
                    </span>
                  </div>
                  <button type="button" onClick={() => setSelectedStudentToInactivate(null)} className="text-rose-600 hover:text-rose-800 font-semibold">
                    Change
                  </button>
                </div>)}
            </div>

            {/* Inactivation Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Archived Status *</label>
                <select value={inactivateForm.status} onChange={(e) => setInactivateForm(prev => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600">
                  <option value="TC Issued">TC Issued</option>
                  <option value="Transferred">Transferred to another school</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Left School">Left School</option>
                  <option value="Completed">Course Completed</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Effective Date *</label>
                <input type="date" value={inactivateForm.effective_date} onChange={(e) => setInactivateForm(prev => ({ ...prev, effective_date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required/>
              </div>

              {inactivateForm.status === 'TC Issued' && (<>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">TC Serial Number *</label>
                    <input type="text" value={inactivateForm.tc_number} onChange={(e) => setInactivateForm(prev => ({ ...prev, tc_number: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 font-mono" required/>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">TC Date of Issue *</label>
                    <input type="date" value={inactivateForm.tc_date} onChange={(e) => setInactivateForm(prev => ({ ...prev, tc_date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required/>
                  </div>
                </>)}

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Reason for Inactivation / TC *</label>
                <input type="text" value={inactivateForm.reason} onChange={(e) => setInactivateForm(prev => ({ ...prev, reason: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required/>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Administrative Remarks / Notes</label>
                <textarea rows={2} value={inactivateForm.remarks} onChange={(e) => setInactivateForm(prev => ({ ...prev, remarks: e.target.value }))} placeholder="Record fee clearance, library clearance, or conduct notes..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"/>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={isSubmitting || !selectedStudentToInactivate} className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs cursor-pointer">
                {isSubmitting ? (<>
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    <span>Processing Archive...</span>
                  </>) : (<>
                    <UserX className="w-4 h-4"/>
                    <span>Confirm Inactivation / TC</span>
                  </>)}
              </button>
            </div>
          </form>
        </div>)}

      {/* 3. STATUS HISTORY TAB */}
      {activeTab === 'history' && (<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900">Student Status Modification History</h3>
            <p className="text-xs text-slate-500">Every pupil inactivation and reactivation event is recorded here.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Previous Status</th>
                  <th className="p-3">New Status</th>
                  <th className="p-3">Reason / TC Details</th>
                  <th className="p-3">Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingHistory ? (<tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">Loading audit history...</td>
                  </tr>) : historyList.length === 0 ? (<tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">No status modification logs found.</td>
                  </tr>) : (historyList.map(h => (<tr key={h.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono text-slate-600">{h.effective_date}</td>
                      <td className="p-3 font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] ${h.action_type === 'Reactivated' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                          {h.action_type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-800">#{h.student_id}</td>
                      <td className="p-3 text-slate-500">{h.previous_status}</td>
                      <td className="p-3 font-semibold text-slate-900">{h.new_status}</td>
                      <td className="p-3 text-slate-700">
                        <div>{h.reason}</div>
                        {h.tc_number && (<div className="text-[11px] text-emerald-700 font-mono">TC No: {h.tc_number} ({h.tc_date})</div>)}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{h.performed_by}</td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* REACTIVATION MODAL */}
      {selectedStudentToReactivate && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 px-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400"/>
                <span>Reactivate Student Record</span>
              </h3>
              <button onClick={() => setSelectedStudentToReactivate(null)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <form onSubmit={handleReactivateSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm">{selectedStudentToReactivate.full_name}</div>
                <div className="text-slate-500 text-[11px] font-mono">
                  {selectedStudentToReactivate.admission_number} • Currently: {selectedStudentToReactivate.current_status}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reactivation Date *</label>
                <input type="date" value={reactivateForm.effective_date} onChange={(e) => setReactivateForm(prev => ({ ...prev, effective_date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required/>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Justification Reason *</label>
                <input type="text" value={reactivateForm.reason} onChange={(e) => setReactivateForm(prev => ({ ...prev, reason: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required/>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Remarks</label>
                <textarea rows={2} value={reactivateForm.remarks} onChange={(e) => setReactivateForm(prev => ({ ...prev, remarks: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"/>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setSelectedStudentToReactivate(null)} className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors cursor-pointer">
                  {isSubmitting ? 'Reactivating...' : 'Restore to Active'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* SINGLE INACTIVATION APPROVAL MODAL */}
      {isSingleInactivateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 px-5 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserX className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold">
                  {selectedStudentToInactivate
                    ? `Inactivate Student - ID #${selectedStudentToInactivate.student_id || selectedStudentToInactivate.id}`
                    : 'Inactivate Student by ID'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSingleInactivateModalOpen(false);
                  setSelectedStudentToInactivate(null);
                  setActiveCandidateSearch('');
                }}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInactivateSubmit} className="p-5 space-y-4 text-xs">
              {/* If no student selected yet, show Student ID / Name search input */}
              {!selectedStudentToInactivate ? (
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Enter or Search Student ID / Admission No *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter Student ID (e.g. 7), Admission No, or Name..."
                      value={activeCandidateSearch}
                      onChange={(e) => setActiveCandidateSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>

                  {activeCandidates.length > 0 && (
                    <div className="mt-1 border border-slate-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-100 shadow-sm bg-white">
                      {activeCandidates.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedStudentToInactivate(c);
                            setActiveCandidates([]);
                            setActiveCandidateSearch('');
                          }}
                          className="w-full text-left p-2.5 hover:bg-rose-50/50 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                                ID: #{c.student_id || c.id}
                              </span>
                              <span className="font-bold text-slate-900">{c.full_name}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Adm: {c.admission_number} • {c.class_name || 'N/A'}-{c.section_name || 'N/A'}
                            </div>
                          </div>
                          <span className="text-[11px] bg-rose-100 text-rose-800 px-2 py-1 rounded font-bold">
                            Select
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Student Selected Card */
                <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-rose-900 font-bold bg-rose-100 px-2 py-0.5 rounded text-xs border border-rose-300">
                        Student ID: #{selectedStudentToInactivate.student_id || selectedStudentToInactivate.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedStudentToInactivate.full_name}
                      </span>
                    </div>
                    <div className="text-slate-600 font-mono text-[11px] mt-1">
                      Admission No: <strong>{selectedStudentToInactivate.admission_number || 'N/A'}</strong> • Class: {selectedStudentToInactivate.class_name || 'N/A'}-{selectedStudentToInactivate.section_name || 'N/A'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudentToInactivate(null)}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer ml-2 shrink-0"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Approval Workflow Notice */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  This inactivation request will create a traceable approval item linked to <strong className="font-semibold">Student ID #{selectedStudentToInactivate ? (selectedStudentToInactivate.student_id || selectedStudentToInactivate.id) : '...'}</strong> in <span className="font-mono font-bold">/students/approvals</span>.
                </span>
              </div>

              {/* Inactivation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Inactive Status *</label>
                  <select
                    value={inactivateForm.status}
                    onChange={(e) => setInactivateForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  >
                    <option value="TC Issued">TC Issued</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Withdrawn">Withdrawn</option>
                    <option value="Left School">Left School</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Effective Date *</label>
                  <input
                    type="date"
                    value={inactivateForm.effective_date}
                    onChange={(e) => setInactivateForm((prev) => ({ ...prev, effective_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>

                {inactivateForm.status === 'TC Issued' && (
                  <>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">TC Number *</label>
                      <input
                        type="text"
                        value={inactivateForm.tc_number}
                        onChange={(e) => setInactivateForm((prev) => ({ ...prev, tc_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">TC Date of Issue *</label>
                      <input
                        type="date"
                        value={inactivateForm.tc_date}
                        onChange={(e) => setInactivateForm((prev) => ({ ...prev, tc_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Reason for Inactivation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Parent requested transfer, relocation to another state"
                    value={inactivateForm.reason}
                    onChange={(e) => setInactivateForm((prev) => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Administrative Remarks</label>
                  <textarea
                    rows={2}
                    placeholder="Record fee clearance, library clearance, or conduct notes..."
                    value={inactivateForm.remarks}
                    onChange={(e) => setInactivateForm((prev) => ({ ...prev, remarks: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsSingleInactivateModalOpen(false);
                    setSelectedStudentToInactivate(null);
                    setActiveCandidateSearch('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedStudentToInactivate}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5" />
                      <span>Submit for Approval</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK INACTIVATION APPROVAL MODAL */}
      {isBulkInactivateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 px-5 bg-rose-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <UserX className="w-4 h-4 text-rose-400" />
                <span>Bulk Inactivate ({selectedIds.length} Students)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBulkInactivateModalOpen(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkInactivateSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-rose-900">
                <div className="font-bold flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Approval Workflow Routing</span>
                </div>
                <p className="mt-1 text-[11px] text-rose-800">
                  Submitting will create <strong>{selectedIds.length} individual approval request(s)</strong> in{' '}
                  <span className="font-mono font-bold">/students/approvals</span>. The status will not be updated until an administrator signs off on each request.
                </p>
              </div>

              {/* Selected Students Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 max-h-36 overflow-y-auto">
                <span className="font-semibold text-slate-700 block text-[11px]">
                  Selected Students to Inactivate ({selectedIds.length}):
                </span>
                {inactiveStudents.filter(s => selectedIds.includes(s.id)).map(s => (
                  <div key={s.id} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-200/60 last:border-b-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-rose-800 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 text-[10px]">
                        ID: #{s.student_id || s.id}
                      </span>
                      <span className="font-bold text-slate-900">{s.full_name}</span>
                    </div>
                    <span className="font-mono text-slate-500 text-[10px]">
                      Adm: {s.admission_number} • {s.class_name || 'N/A'}-{s.section_name || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Status *</label>
                <select
                  value={bulkInactivateForm.status}
                  onChange={(e) => setBulkInactivateForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Inactive">Inactive</option>
                  <option value="TC Issued">TC Issued</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Left School">Left School</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Inactivation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Annual batch migration, academic year withdrawal, transfer"
                  value={bulkInactivateForm.reason}
                  onChange={(e) => setBulkInactivateForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Administrative Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes or references for the approval team..."
                  value={bulkInactivateForm.remarks}
                  onChange={(e) => setBulkInactivateForm(prev => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBulkInactivateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5" />
                      <span>Submit for Admin Approval</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>);
};
