import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Search, Plus, Loader2, X } from 'lucide-react';
import { getStudentApprovals, approveStudentRequest, rejectStudentRequest, createStudentApproval, getStudents } from '../../services/api';
export const StudentApprovalsView = ({ branchId, academicYearId }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [approvals, setApprovals] = useState([]);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
    const [requestTypeFilter, setRequestTypeFilter] = useState(searchParams.get('type') || 'all');
    const [studentIdFilter, setStudentIdFilter] = useState(searchParams.get('student_id') || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Review Modal State
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    // New Request Modal State
    const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
    const [candidateSearch, setCandidateSearch] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [newRequestForm, setNewRequestForm] = useState({
        request_type: 'Date of Birth Change',
        current_value: '',
        requested_value: '',
        reason: '',
        remarks: ''
    });
    // Feedback states
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    // Load approvals
    const loadApprovals = () => {
        if (!branchId)
            return;
        setIsLoading(true);
        getStudentApprovals({
            branch_id: branchId,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            request_type: requestTypeFilter !== 'all' ? requestTypeFilter : undefined,
            student_id: studentIdFilter ? studentIdFilter : undefined,
            search: searchTerm.trim() ? searchTerm.trim() : undefined
        })
            .then(res => setApprovals(res || []))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        const pStatus = searchParams.get('status');
        const pType = searchParams.get('type');
        const pStudentId = searchParams.get('student_id');
        if (pStatus) setStatusFilter(pStatus);
        if (pType) setRequestTypeFilter(pType);
        if (pStudentId) setStudentIdFilter(pStudentId);
    }, [searchParams]);

    useEffect(() => {
        loadApprovals();
    }, [branchId, statusFilter, requestTypeFilter, studentIdFilter, searchTerm]);
    // Search candidate students for new request
    useEffect(() => {
        if (candidateSearch.trim().length > 1 && branchId) {
            getStudents({
                branch_id: branchId,
                academic_year_id: academicYearId,
                search: candidateSearch.trim(),
                page_size: 10
            })
                .then(res => setCandidates(res.data || []))
                .catch(console.error);
        }
        else {
            setCandidates([]);
        }
    }, [candidateSearch, branchId, academicYearId]);
    // Handle Approve
    const handleApprove = async () => {
        if (!selectedApproval)
            return;
        setIsProcessingAction(true);
        setErrorMessage(null);
        try {
            await approveStudentRequest(selectedApproval.id);
            setSuccessMessage(`Request #${selectedApproval.id} approved for Student ID #${selectedApproval.student_id} (${selectedApproval.student_name}). Student record updated to "${selectedApproval.requested_value}".`);
            setSelectedApproval(null);
            loadApprovals();
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to approve request.');
        }
        finally {
            setIsProcessingAction(false);
        }
    };
    // Handle Reject
    const handleReject = async () => {
        if (!selectedApproval)
            return;
        if (!rejectionReason.trim()) {
            setErrorMessage('Please provide a mandatory justification for rejecting this request.');
            return;
        }
        setIsProcessingAction(true);
        setErrorMessage(null);
        try {
            await rejectStudentRequest(selectedApproval.id, rejectionReason.trim());
            setSuccessMessage(`Request #${selectedApproval.id} has been rejected.`);
            setSelectedApproval(null);
            setIsRejecting(false);
            setRejectionReason('');
            loadApprovals();
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to reject request.');
        }
        finally {
            setIsProcessingAction(false);
        }
    };
    // Handle Create New Request
    const handleCreateRequest = async (e) => {
        e.preventDefault();
        if (!selectedCandidate) {
            setErrorMessage('Please select a student.');
            return;
        }
        if (!newRequestForm.requested_value.trim() || !newRequestForm.reason.trim()) {
            setErrorMessage('Requested value and reason are mandatory.');
            return;
        }
        setIsProcessingAction(true);
        setErrorMessage(null);
        try {
            await createStudentApproval({
                branch_id: branchId,
                academic_year_id: academicYearId,
                student_id: selectedCandidate.id,
                request_type: newRequestForm.request_type,
                current_value: newRequestForm.current_value,
                requested_value: newRequestForm.requested_value,
                reason: newRequestForm.reason,
                remarks: newRequestForm.remarks,
                requested_by: 'Staff Administrator'
            });
            setSuccessMessage('Approval request submitted to Academic Directorate.');
            setIsNewRequestModalOpen(false);
            setSelectedCandidate(null);
            setCandidateSearch('');
            setNewRequestForm({
                request_type: 'Date of Birth Change',
                current_value: '',
                requested_value: '',
                reason: '',
                remarks: ''
            });
            loadApprovals();
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to submit approval request.');
        }
        finally {
            setIsProcessingAction(false);
        }
    };
    const getStatusPill = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'Approved':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'Rejected':
                return 'bg-rose-50 text-rose-800 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };
    return (<div className="space-y-5">
      {/* Top Action & Summary */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700"/>
            <span>Administrative Approvals & Modifications Workflow</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Two-tier governance for student status changes, inactivations, and sensitive profile corrections.
          </p>
        </div>

        <button type="button" onClick={() => setIsNewRequestModalOpen(true)} className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto">
          <Plus className="w-4 h-4"/>
          <span>New Approval Request</span>
        </button>
      </div>

      {/* Student ID Tracking Alert */}
      {studentIdFilter && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
            <span>
              Tracking approval status for <strong>Student ID #{studentIdFilter}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setStudentIdFilter('');
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('student_id');
              setSearchParams(newParams);
            }}
            className="px-2.5 py-1 bg-white border border-blue-300 hover:bg-blue-100 rounded-lg text-blue-800 font-semibold cursor-pointer"
          >
            Show All Approvals
          </button>
        </div>
      )}

      {/* Messages */}
      {successMessage && (<div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4"/>
          </button>
        </div>)}

      {errorMessage && (<div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0"/>
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-800">
            <X className="w-4 h-4"/>
          </button>
        </div>)}

      {/* Filters Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* Search input for Student ID / Name / Adm No */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Student ID, Adm No, or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-600">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold outline-none focus:ring-2 focus:ring-emerald-600">
            <option value="all">All Approval Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-600">Type:</span>
          <select value={requestTypeFilter} onChange={(e) => setRequestTypeFilter(e.target.value)} className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold outline-none focus:ring-2 focus:ring-emerald-600">
            <option value="all">All Change Types</option>
            <option value="Student Inactivation / TC">Student Inactivation / TC</option>
            <option value="Student Reactivation">Student Reactivation</option>
            <option value="Date of Birth Change">Date of Birth Change</option>
            <option value="Student Legal Name Change">Legal Name Change</option>
            <option value="Parent Name Correction">Parent Name Correction</option>
            <option value="Category / Quota Change">Category / Quota Change</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-3">Req ID</th>
                <th className="p-3">Pupil / Student ID</th>
                <th className="p-3">Modification Type</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Submitted Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (<tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600"/>
                    <span>Loading approval requests...</span>
                  </td>
                </tr>) : approvals.length === 0 ? (<tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    No approval requests found matching active criteria.
                  </td>
                </tr>) : (approvals.map((req) => (<tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-semibold text-slate-500">#{req.id}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                          ID: #{req.student_id}
                        </span>
                        <span className="font-bold text-slate-900">{req.student_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Adm: {req.admission_number} • {req.class_name || 'N/A'}-{req.section_name || 'N/A'}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{req.request_type}</td>
                    <td className="p-3 text-slate-600">{req.requested_by}</td>
                    <td className="p-3 font-mono text-slate-500">{req.created_at ? req.created_at.split('T')[0] : 'Today'}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getStatusPill(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button type="button" onClick={() => {
                setSelectedApproval(req);
                setIsRejecting(false);
                setRejectionReason('');
            }} className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg transition-colors cursor-pointer">
                        Inspect Diff
                      </button>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVIEW & DIFF MODAL */}
      {selectedApproval && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400"/>
                  <span>Review Approval Request #{selectedApproval.id}</span>
                </h3>
                <span className="text-xs text-slate-300">{selectedApproval.request_type}</span>
              </div>
              <button onClick={() => setSelectedApproval(null)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Student Overview */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs border border-emerald-300">
                      Student ID: #{selectedApproval.student_id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{selectedApproval.student_name}</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px] mt-1">
                    Adm No: {selectedApproval.admission_number} • Class: {selectedApproval.class_name || 'N/A'}-{selectedApproval.section_name || 'N/A'}
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getStatusPill(selectedApproval.status)}`}>
                  {selectedApproval.status}
                </span>
              </div>

              {/* Side-by-Side Diff View */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Existing Value</span>
                  <div className="text-sm font-semibold text-slate-800 break-words">
                    {selectedApproval.current_value || 'None'}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Proposed Value</span>
                  <div className="text-sm font-bold text-emerald-900 break-words">
                    {selectedApproval.requested_value || 'None'}
                  </div>
                </div>
              </div>

              {/* Reason & Justification */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Official Justification / Parent Request:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {selectedApproval.reason}
                </p>
              </div>

              {/* Remarks */}
              {selectedApproval.remarks && (<div className="space-y-1">
                  <span className="font-bold text-slate-700 block">Administrative Notes:</span>
                  <p className="text-slate-600 italic">{selectedApproval.remarks}</p>
                </div>)}

              {/* If Rejected already, show rejection note */}
              {selectedApproval.status === 'Rejected' && selectedApproval.rejection_reason && (<div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                  <strong>Rejection Note:</strong> {selectedApproval.rejection_reason}
                </div>)}

              {/* Rejection Prompt */}
              {isRejecting && selectedApproval.status === 'Pending' && (<div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <label className="font-bold text-rose-900 block">Mandatory Reason for Rejection:</label>
                  <textarea rows={2} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="State reason why requested change cannot be approved..." className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-xs" required/>
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsRejecting(false)} className="px-3 py-1 border border-rose-300 text-rose-700 rounded-lg">
                      Cancel
                    </button>
                    <button type="button" onClick={handleReject} disabled={isProcessingAction} className="px-4 py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg">
                      {isProcessingAction ? 'Submitting...' : 'Confirm Rejection'}
                    </button>
                  </div>
                </div>)}

              {/* Actions for Pending Requests */}
              {selectedApproval.status === 'Pending' && !isRejecting && (<div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button type="button" onClick={() => setIsRejecting(true)} className="flex items-center space-x-1.5 px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-xl transition-colors cursor-pointer">
                    <XCircle className="w-4 h-4"/>
                    <span>Reject Request</span>
                  </button>

                  <button type="button" onClick={handleApprove} disabled={isProcessingAction} className="flex items-center space-x-1.5 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer">
                    {isProcessingAction ? (<>
                        <Loader2 className="w-4 h-4 animate-spin"/>
                        <span>Applying change...</span>
                      </>) : (<>
                        <CheckCircle2 className="w-4 h-4"/>
                        <span>Approve & Apply Modification</span>
                      </>)}
                  </button>
                </div>)}
            </div>
          </div>
        </div>)}

      {/* NEW APPROVAL REQUEST MODAL */}
      {isNewRequestModalOpen && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-400"/>
                <span>Submit Approval Request</span>
              </h3>
              <button onClick={() => setIsNewRequestModalOpen(false)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-4 text-xs">
              {/* Select Pupil */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Student *</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input type="text" placeholder="Search pupil by name or admission no..." value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg"/>
                </div>

                {candidates.length > 0 && (<div className="mt-1 border border-slate-200 rounded-lg max-h-40 overflow-y-auto divide-y divide-slate-100 shadow-sm">
                    {candidates.map(c => (<button key={c.id} type="button" onClick={() => {
                        setSelectedCandidate(c);
                        setCandidateSearch('');
                        setCandidates([]);
                        if (newRequestForm.request_type === 'Date of Birth Change') {
                            setNewRequestForm(prev => ({ ...prev, current_value: c.date_of_birth }));
                        }
                        else if (newRequestForm.request_type === 'Student Legal Name Change') {
                            setNewRequestForm(prev => ({ ...prev, current_value: c.full_name }));
                        }
                    }} className="w-full text-left p-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="font-bold text-slate-900 block">{c.full_name}</span>
                          <span className="text-[10px] text-slate-400">{c.admission_number}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">Select</span>
                      </button>))}
                  </div>)}

                {selectedCandidate && (<div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{selectedCandidate.full_name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{selectedCandidate.admission_number}</div>
                    </div>
                    <button type="button" onClick={() => setSelectedCandidate(null)} className="text-rose-600 hover:text-rose-800 font-semibold">
                      Change
                    </button>
                  </div>)}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Request Type *</label>
                <select value={newRequestForm.request_type} onChange={(e) => {
                  const val = e.target.value;
                  let currentVal = selectedCandidate ? selectedCandidate.current_status : '';
                  if (val === 'Date of Birth Change') currentVal = selectedCandidate?.date_of_birth || '';
                  else if (val === 'Student Legal Name Change') currentVal = selectedCandidate?.full_name || '';
                  setNewRequestForm(prev => ({ ...prev, request_type: val, current_value: currentVal }));
                }} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="Student Inactivation / TC">Student Inactivation / TC</option>
                  <option value="Student Reactivation">Student Reactivation</option>
                  <option value="Date of Birth Change">Date of Birth Change</option>
                  <option value="Student Legal Name Change">Student Legal Name Change</option>
                  <option value="Parent Name Correction">Parent Name Correction</option>
                  <option value="Category / Quota Change">Category / Quota Change</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Registered Value</label>
                <input type="text" value={newRequestForm.current_value} onChange={(e) => setNewRequestForm(prev => ({ ...prev, current_value: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="Existing value in system"/>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Requested Correction / Value *</label>
                <input type="text" value={newRequestForm.requested_value} onChange={(e) => setNewRequestForm(prev => ({ ...prev, requested_value: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="Proposed new value" required/>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Justification / Supporting Proof *</label>
                <textarea rows={2} value={newRequestForm.reason} onChange={(e) => setNewRequestForm(prev => ({ ...prev, reason: e.target.value }))} placeholder="e.g. Birth certificate gazette publication enclosed" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required/>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsNewRequestModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold cursor-pointer">
                  Cancel
                </button>

                <button type="submit" disabled={isProcessingAction || !selectedCandidate} className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors cursor-pointer">
                  {isProcessingAction ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
