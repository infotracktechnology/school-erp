import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
    FileCheck2, Plus, Search, Calendar, Clock, Paperclip, Trash2, Edit2, 
    ExternalLink, X, Send, Loader2, Users, Award, UploadCloud, CheckSquare,
    FileText, Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { getClassSubjects } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export const AssignmentView = ({ branchId, academicYearId, classes, sections, showToast }) => {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [selectedSectionId, setSelectedSectionId] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals & Drawers
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [isSubmissionsDrawerOpen, setIsSubmissionsDrawerOpen] = useState(false);
    const [activeAssignmentForReview, setActiveAssignmentForReview] = useState(null);
    const [submissionsList, setSubmissionsList] = useState([]);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Review / Grading Modal
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [selectedStudentForReview, setSelectedStudentForReview] = useState(null);
    const [reviewMarks, setReviewMarks] = useState('0');
    const [reviewGrade, setReviewGrade] = useState('A');
    const [reviewRemarks, setReviewRemarks] = useState('');
    const [reviewFeedback, setReviewFeedback] = useState('');

    // Create/Edit Form State
    const [formClassId, setFormClassId] = useState(0);
    const [formSectionId, setFormSectionId] = useState('all');

    // Dynamic Class Subjects
    const [classSubjectsList, setClassSubjectsList] = useState([]);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [formSubjectId, setFormSubjectId] = useState('');
    const [formSubject, setFormSubject] = useState('');

    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formSubmissionType, setFormSubmissionType] = useState('Online Submission');
    const [formMaxMarks, setFormMaxMarks] = useState(50);
    const [formAssignedDate, setFormAssignedDate] = useState(new Date().toISOString().split('T')[0]);
    const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [formDueDate, setFormDueDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split('T')[0];
    });
    const [formAllowResubmission, setFormAllowResubmission] = useState(true);
    const [formAllowLateSubmission, setFormAllowLateSubmission] = useState(true);
    const [formAttachmentRequired, setFormAttachmentRequired] = useState(true);

    // Schedule Checkbox & start_at
    const [isScheduled, setIsScheduled] = useState(false);
    const [formStartAt, setFormStartAt] = useState('');

    // Attachments Toggle & Files Only (Doc & Image)
    const [hasAttachments, setHasAttachments] = useState(false);
    const [docFileObj, setDocFileObj] = useState(null); // { name, url, size }
    const [imageFileObj, setImageFileObj] = useState(null); // { name, url, size }
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const docInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const availableSections = sections.filter((s) => s.class_id === (editingAssignment ? editingAssignment.class_id : formClassId));

    const filterAvailableSections = useMemo(() => {
        if (selectedClassId === 'all') {
            const unique = new Map();
            (sections || []).forEach(s => {
                if (s && s.name && !unique.has(s.name)) {
                    unique.set(s.name, { id: s.name, name: s.name });
                }
            });
            return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
        }
        return (sections || []).filter(s => s.class_id === Number(selectedClassId));
    }, [selectedClassId, sections]);

    const fetchAssignments = useCallback(async () => {
        setIsLoading(true);
        try {
            const isNumericSec = selectedSectionId !== 'all' && !isNaN(Number(selectedSectionId));
            const data = await communicationService.getAssignments({
                branch_id: branchId,
                academic_year_id: academicYearId,
                class_id: selectedClassId !== 'all' ? Number(selectedClassId) : undefined,
                section_id: selectedSectionId !== 'all' ? (isNumericSec ? Number(selectedSectionId) : selectedSectionId) : undefined,
                submission_type: selectedType !== 'all' ? selectedType : undefined,
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
                search: searchQuery.trim() || undefined
            });
            setAssignments(data);
        }
        catch (err) {
            showToast(err.message || 'Failed to fetch assignments', 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, selectedClassId, selectedSectionId, selectedType, selectedStatus, searchQuery, showToast]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    // Fetch subjects dynamically whenever formClassId changes
    const fetchSubjectsForClass = useCallback(async (targetClassId) => {
        if (!targetClassId) {
            setClassSubjectsList([]);
            return;
        }
        setIsLoadingSubjects(true);
        try {
            const subs = await getClassSubjects(branchId, academicYearId, targetClassId);
            setClassSubjectsList(subs || []);
            if (subs && subs.length > 0) {
                setFormSubjectId(prev => {
                    const found = subs.find(s => String(s.subject_id) === String(prev));
                    if (found) {
                        setFormSubject(found.subject_name);
                        return prev;
                    }
                    setFormSubject(subs[0].subject_name);
                    return subs[0].subject_id;
                });
            } else {
                setFormSubjectId('');
                setFormSubject('');
            }
        } catch (err) {
            console.error('Failed to load class subjects:', err);
            setClassSubjectsList([]);
        } finally {
            setIsLoadingSubjects(false);
        }
    }, [branchId, academicYearId]);

    useEffect(() => {
        if (isCreateModalOpen && formClassId) {
            fetchSubjectsForClass(formClassId);
        }
    }, [isCreateModalOpen, formClassId, fetchSubjectsForClass]);

    const handleOpenCreate = () => {
        setEditingAssignment(null);
        const defaultClassId = classes[0]?.id || 0;
        setFormClassId(defaultClassId);
        setFormSectionId('all');
        setFormSubjectId('');
        setFormSubject('');
        setFormTitle('');
        setFormDescription('');
        setFormSubmissionType('Online Submission');
        setFormMaxMarks(50);
        setFormAssignedDate(new Date().toISOString().split('T')[0]);
        setFormStartDate(new Date().toISOString().split('T')[0]);
        const d = new Date();
        d.setDate(d.getDate() + 7);
        setFormDueDate(d.toISOString().split('T')[0]);
        setFormAllowResubmission(true);
        setFormAllowLateSubmission(true);
        setFormAttachmentRequired(true);

        setIsScheduled(false);
        setFormStartAt('');
        setHasAttachments(false);
        setDocFileObj(null);
        setImageFileObj(null);

        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (asgn) => {
        setEditingAssignment(asgn);
        setFormClassId(asgn.class_id);
        setFormSectionId(asgn.section_id ? String(asgn.section_id) : 'all');
        setFormSubjectId(asgn.subject_id ? String(asgn.subject_id) : '');
        setFormSubject(asgn.subject_name || '');
        setFormTitle(asgn.title || '');
        setFormDescription(asgn.description || asgn.instructions || '');
        setFormSubmissionType(asgn.submission_type || 'Online Submission');
        setFormMaxMarks(asgn.max_marks || 50);
        setFormAssignedDate(asgn.assigned_date ? asgn.assigned_date.split('T')[0] : new Date().toISOString().split('T')[0]);
        setFormStartDate(asgn.start_date ? asgn.start_date.split('T')[0] : (asgn.assigned_date ? asgn.assigned_date.split('T')[0] : new Date().toISOString().split('T')[0]));
        setFormDueDate(asgn.due_date ? asgn.due_date.split('T')[0] : '');
        setFormAllowResubmission(asgn.allow_resubmission === 1);
        setFormAllowLateSubmission(asgn.allow_late_submission === 1);
        setFormAttachmentRequired(asgn.attachment_required === 1);

        const scheduled = Boolean(asgn.is_scheduled || asgn.status === 'Scheduled');
        setIsScheduled(scheduled);
        setFormStartAt(asgn.start_at ? asgn.start_at.slice(0, 16) : '');

        // Parse attachments
        let atts = asgn.attachments;
        if (typeof atts === 'string') {
            try { atts = JSON.parse(atts); } catch (e) { atts = null; }
        }
        if (atts && (atts.doc || atts.image)) {
            setHasAttachments(true);
            setDocFileObj(atts.doc || null);
            setImageFileObj(atts.image || null);
        } else if (asgn.attachment_url) {
            setHasAttachments(true);
            const isImg = asgn.attachment_url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
            if (isImg) {
                setImageFileObj({ name: asgn.attachment_name || 'Attached Image', url: asgn.attachment_url });
                setDocFileObj(null);
            } else {
                setDocFileObj({ name: asgn.attachment_name || 'Attached Document', url: asgn.attachment_url });
                setImageFileObj(null);
            }
        } else {
            setHasAttachments(false);
            setDocFileObj(null);
            setImageFileObj(null);
        }

        setIsCreateModalOpen(true);
    };

    // File Upload Handler (reads base64 & calls backend upload)
    const handleFileUpload = async (file, type) => {
        if (!file) return;
        const reader = new FileReader();
        const setUploading = type === 'doc' ? setUploadingDoc : setUploadingImage;
        const setFileObj = type === 'doc' ? setDocFileObj : setImageFileObj;

        setUploading(true);
        reader.onload = async () => {
            try {
                const base64Data = reader.result;
                const res = await communicationService.uploadAttachment(file.name, base64Data);
                if (res.success && res.url) {
                    setFileObj({
                        name: file.name,
                        url: res.url,
                        size: (file.size / 1024).toFixed(1) + ' KB'
                    });
                    showToast(`${type === 'doc' ? 'Document' : 'Image'} uploaded successfully`, 'success');
                } else {
                    showToast('Failed to upload file', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast(err.message || 'Error uploading file', 'error');
            } finally {
                setUploading(false);
            }
        };
        reader.onerror = () => {
            setUploading(false);
            showToast('Unable to read file', 'error');
        };
        reader.readAsDataURL(file);
    };

    const handleSaveAssignment = async (e) => {
        e.preventDefault();
        if (!formTitle.trim()) {
            showToast('Please enter an assignment title', 'error');
            return;
        }
        if (!formClassId) {
            showToast('Please select target class', 'error');
            return;
        }
        if (!formSubject) {
            showToast('Please select a subject from the list', 'error');
            return;
        }
        if (isScheduled && !formStartAt) {
            showToast('Please select a schedule start date and time', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const finalStatus = isScheduled ? 'Scheduled' : 'Published';

            let attachmentsPayload = null;
            if (hasAttachments && (docFileObj || imageFileObj)) {
                attachmentsPayload = {
                    doc: docFileObj || null,
                    image: imageFileObj || null
                };
            }

            const payload = {
                organization_id: 1,
                branch_id: branchId,
                academic_year_id: academicYearId,
                class_id: formClassId,
                section_id: formSectionId !== 'all' ? Number(formSectionId) : null,
                subject_id: formSubjectId ? Number(formSubjectId) : null,
                subject_name: formSubject,
                teacher_name: editingAssignment?.teacher_name || 'Staff In-Charge',
                title: formTitle.trim(),
                description: formDescription.trim(),
                instructions: '',
                submission_type: formSubmissionType,
                max_marks: Number(formMaxMarks),
                assigned_date: formAssignedDate,
                start_date: formStartDate,
                due_date: formDueDate,
                allow_resubmission: formAllowResubmission ? 1 : 0,
                allow_late_submission: formAllowLateSubmission ? 1 : 0,
                attachment_required: formAttachmentRequired ? 1 : 0,
                is_scheduled: isScheduled ? 1 : 0,
                start_at: isScheduled && formStartAt ? formStartAt : null,
                status: finalStatus,
                attachments: attachmentsPayload
            };

            if (editingAssignment) {
                await communicationService.updateAssignment(editingAssignment.id, payload);
                showToast('Assignment updated successfully', 'success');
            }
            else {
                await communicationService.createAssignment(payload);
                showToast('Assignment published successfully', 'success');
            }
            setIsCreateModalOpen(false);
            fetchAssignments();
        }
        catch (err) {
            showToast(err.message || 'Failed to save assignment', 'error');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this assignment and all submissions?'))
            return;
        try {
            await communicationService.deleteAssignment(id);
            showToast('Assignment deleted successfully', 'success');
            fetchAssignments();
        }
        catch (err) {
            showToast(err.message || 'Failed to delete assignment', 'error');
        }
    };

    const handleOpenSubmissions = async (asgn) => {
        setActiveAssignmentForReview(asgn);
        setIsSubmissionsDrawerOpen(true);
        setIsLoadingSubmissions(true);
        try {
            const data = await communicationService.getAssignmentDetails(asgn.id);
            setSubmissionsList(data.submissions || []);
        }
        catch (err) {
            showToast(err.message || 'Failed to load submissions', 'error');
        }
        finally {
            setIsLoadingSubmissions(false);
        }
    };

    const handleOpenGradeModal = (sub) => {
        setSelectedStudentForReview(sub);
        setReviewMarks(sub.marks_obtained !== null && sub.marks_obtained !== undefined ? String(sub.marks_obtained) : '45');
        setReviewGrade(sub.grade || 'A');
        setReviewRemarks(sub.remarks || 'Satisfactory work completed as per instructions.');
        setReviewFeedback(sub.feedback || 'Well presented.');
        setIsGradeModalOpen(true);
    };

    const handleSaveReview = async (e) => {
        e.preventDefault();
        if (!activeAssignmentForReview || !selectedStudentForReview)
            return;
        try {
            if (activeAssignmentForReview.submission_type === 'Online Submission') {
                await communicationService.reviewAssignment(activeAssignmentForReview.id, selectedStudentForReview.student_id, {
                    marks_obtained: Number(reviewMarks),
                    grade: reviewGrade,
                    remarks: reviewRemarks,
                    feedback: reviewFeedback,
                    status: 'Reviewed',
                    reviewed_by: 'Teacher / Staff'
                });
            }
            else {
                await communicationService.markOfflineCompletion(activeAssignmentForReview.id, selectedStudentForReview.student_id, {
                    offline_verified_by: 'Teacher / Staff',
                    offline_completion_date: new Date().toISOString().split('T')[0],
                    marks_obtained: Number(reviewMarks),
                    grade: reviewGrade,
                    remarks: reviewRemarks
                });
            }
            showToast(`Submission review saved for ${selectedStudentForReview.student_name}`, 'success');
            setIsGradeModalOpen(false);
            const refreshed = await communicationService.getAssignmentDetails(activeAssignmentForReview.id);
            setSubmissionsList(refreshed.submissions || []);
            fetchAssignments();
        }
        catch (err) {
            showToast(err.message || 'Failed to save review', 'error');
        }
    };

    return (
        <div className="space-y-5">
            {/* Top Banner */}
            <Card className="p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                        <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                            <FileCheck2 className="w-5 h-5"/>
                        </span>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">Assignment Management</h2>
                            <p className="text-xs text-muted-foreground font-medium">
                                Create and manage branch-wise academic assignments with online submissions and offline classroom completion tracking
                            </p>
                        </div>
                    </div>
                    <Button 
                        id="btn-post-new-assignment" 
                        type="button" 
                        onClick={handleOpenCreate} 
                        className="w-full sm:w-auto shadow-xs active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-1.5"/>
                        <span>Create New Assignment</span>
                    </Button>
                </div>
            </Card>

            {/* Filter Bar */}
            <Card className="p-4 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground z-10"/>
                        <Input 
                            type="text" 
                            placeholder="Search assignment title or subject..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="pl-9 h-9 text-xs"
                        />
                    </div>

                    {/* Class Filter */}
                    <div>
                        <select 
                            value={selectedClassId} 
                            onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                setSelectedSectionId('all');
                            }} 
                            className="w-full h-9 px-3 text-xs rounded-md border border-input bg-transparent font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="all">All Classes</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section Filter */}
                    <div>
                        <select 
                            value={selectedSectionId} 
                            onChange={(e) => setSelectedSectionId(e.target.value)} 
                            className="w-full h-9 px-3 text-xs rounded-md border border-input bg-transparent font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="all">All Sections</option>
                            {filterAvailableSections.map((s) => (
                                <option key={s.id} value={String(s.id)}>
                                    Section {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submission Mode Filter */}
                    <div>
                        <select 
                            value={selectedType} 
                            onChange={(e) => setSelectedType(e.target.value)} 
                            className="w-full h-9 px-3 text-xs rounded-md border border-input bg-transparent font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="all">All Submission Types</option>
                            <option value="Online Submission">Online Submission</option>
                            <option value="Offline Work">Offline Work</option>
                        </select>
                    </div>

                    {/* Clear Filter */}
                    <div>
                        <Button 
                            variant="outline"
                            size="sm"
                            type="button" 
                            onClick={() => {
                                setSelectedClassId('all');
                                setSelectedSectionId('all');
                                setSelectedType('all');
                                setSelectedStatus('all');
                                setSearchQuery('');
                            }} 
                            className="w-full h-9 text-xs"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Assignment List */}
            {isLoading ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-7 h-7 text-purple-700 animate-spin"/>
                    <p className="text-xs font-semibold text-slate-600">Loading branch assignments...</p>
                </div>
            ) : assignments.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <FileCheck2 className="w-6 h-6"/>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Assignments Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                        Create an online or offline assignment for students in this branch.
                    </p>
                    <button 
                        type="button" 
                        onClick={handleOpenCreate} 
                        className="px-4 py-2 rounded-xl bg-purple-700 text-white font-semibold text-xs hover:bg-purple-800 transition-colors shadow-xs"
                    >
                        Create First Assignment
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignments.map((asgn) => {
                        const isOnline = asgn.submission_type === 'Online Submission';
                        const totalStudents = asgn.total_targeted_students || 0;
                        const submittedCount = asgn.submitted_count || 0;
                        const submissionPercent = totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;
                        
                        // Parse attachments safely
                        let atts = asgn.attachments;
                        if (typeof atts === 'string') {
                            try { atts = JSON.parse(atts); } catch(e) { atts = null; }
                        }
                        const hasDoc = atts?.doc?.url;
                        const hasImg = atts?.image?.url;
                        const singleAttUrl = asgn.attachment_url;

                        return (
                            <Card key={asgn.id} className="hover:border-primary/50 hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3">
                                <div>
                                    {/* Top Badges */}
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <Badge variant="secondary" className="font-semibold text-[11px] gap-1 px-2.5 py-0.5">
                                            <span>{asgn.class_name || `Class ${asgn.class_id}`}</span>
                                            <span className="text-muted-foreground">•</span>
                                            <span>{asgn.section_name ? `Sec ${asgn.section_name}` : 'All Sections'}</span>
                                        </Badge>

                                        <div className="flex items-center space-x-1.5">
                                            {asgn.is_scheduled ? (
                                                <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wide">
                                                    Scheduled
                                                </Badge>
                                            ) : null}

                                            <Badge variant={isOnline ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold tracking-wide gap-1">
                                                {isOnline ? <UploadCloud className="w-3 h-3"/> : <CheckSquare className="w-3 h-3"/>}
                                                <span>{asgn.submission_type}</span>
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-primary tracking-wide uppercase">
                                            {asgn.subject_name}
                                        </span>
                                        <span className="text-[11px] font-bold text-muted-foreground">
                                            Max: {asgn.max_marks || 50} pts
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2 leading-snug">
                                        {asgn.title}
                                    </h3>

                                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                                        {asgn.description || 'No description provided.'}
                                    </p>

                                    {/* Submission Progress Bar */}
                                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                                            <span>
                                                {isOnline ? 'Online Submissions' : 'Offline Verified'}:
                                            </span>
                                            <span className="font-bold text-slate-800">
                                                {submittedCount} / {totalStudents} ({submissionPercent}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${submissionPercent >= 80 ? 'bg-emerald-500' : submissionPercent >= 40 ? 'bg-primary' : 'bg-amber-500'}`} 
                                                style={{ width: `${Math.min(submissionPercent, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Details & Action */}
                                <div className="pt-2 border-t border-border space-y-2">
                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70"/>
                                            <span>Start: {asgn.start_date || asgn.assigned_date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 font-semibold text-destructive">
                                            <Clock className="w-3.5 h-3.5"/>
                                            <span>Due: {asgn.due_date}</span>
                                        </div>
                                    </div>

                                    {/* Scheduled Notice */}
                                    {asgn.is_scheduled && asgn.start_at && (
                                        <div className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-md font-medium">
                                            Scheduled for: {new Date(asgn.start_at).toLocaleString()}
                                        </div>
                                    )}

                                    {/* Attachments Pills (Doc & Image) */}
                                    {(hasDoc || hasImg || singleAttUrl) && (
                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {hasDoc && (
                                                <a 
                                                    href={atts.doc.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    <span className="truncate max-w-[120px]">{atts.doc.name || 'Document'}</span>
                                                </a>
                                            )}
                                            {hasImg && (
                                                <a 
                                                    href={atts.image.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md hover:bg-purple-100 transition-colors"
                                                >
                                                    <ImageIcon className="w-3 h-3" />
                                                    <span className="truncate max-w-[120px]">{atts.image.name || 'Image'}</span>
                                                </a>
                                            )}
                                            {!hasDoc && !hasImg && singleAttUrl && (
                                                <a 
                                                    href={singleAttUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md hover:bg-primary/20 transition-colors"
                                                >
                                                    <Paperclip className="w-3 h-3" />
                                                    <span className="truncate max-w-[120px]">{asgn.attachment_name || 'Attachment'}</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Review Submissions Button */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <Button 
                                            variant="secondary"
                                            size="sm"
                                            type="button" 
                                            onClick={() => handleOpenSubmissions(asgn)} 
                                            className="flex-1 h-8 text-xs font-semibold"
                                        >
                                            <Users className="w-3.5 h-3.5 mr-1.5"/>
                                            <span>Review Submissions ({submittedCount})</span>
                                        </Button>

                                        <div className="flex items-center space-x-1">
                                            <button 
                                                type="button" 
                                                onClick={() => handleOpenEdit(asgn)} 
                                                title="Edit Assignment" 
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4"/>
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDelete(asgn.id)} 
                                                title="Delete Assignment" 
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Submissions Review Drawer */}
            {isSubmissionsDrawerOpen && activeAssignmentForReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
                        {/* Drawer Header */}
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                                        {activeAssignmentForReview.submission_type}
                                    </span>
                                    <span className="text-xs font-bold text-slate-600">
                                        {activeAssignmentForReview.class_name} • {activeAssignmentForReview.section_name ? `Sec ${activeAssignmentForReview.section_name}` : 'All Sections'}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                                    {activeAssignmentForReview.title}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Total Students: {submissionsList.length} • Max Marks: {activeAssignmentForReview.max_marks || 50}
                                </p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsSubmissionsDrawerOpen(false)} 
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>

                        {/* Submissions Table */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoadingSubmissions ? (
                                <div className="py-16 text-center space-y-2">
                                    <Loader2 className="w-7 h-7 text-purple-700 animate-spin mx-auto"/>
                                    <p className="text-xs text-slate-500">Loading student roster and submission status...</p>
                                </div>
                            ) : submissionsList.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 text-xs">
                                    No active students enrolled in this class/section.
                                </div>
                            ) : (
                                <div className="rounded-xl border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="py-3 px-3">Roll & Student</TableHead>
                                                <TableHead className="py-3 px-3">Section</TableHead>
                                                <TableHead className="py-3 px-3">Status</TableHead>
                                                <TableHead className="py-3 px-3">Work / Evidence</TableHead>
                                                <TableHead className="py-3 px-3">Grade & Marks</TableHead>
                                                <TableHead className="py-3 px-3 text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {submissionsList.map((sub) => {
                                                const isSubmitted = sub.submission_status === 'Submitted' || sub.submission_status === 'Late Submitted';
                                                const isReviewed = sub.submission_status === 'Reviewed' || sub.submission_status === 'Completed';
                                                return (
                                                    <TableRow key={sub.student_id}>
                                                        <TableCell className="py-3 px-3">
                                                            <div className="font-bold text-slate-800">{sub.student_name}</div>
                                                            <div className="text-[11px] text-muted-foreground">
                                                                {sub.admission_number} {sub.roll_number ? `• Roll #${sub.roll_number}` : ''}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-3 text-muted-foreground font-medium">
                                                            Section {sub.section_name}
                                                        </TableCell>
                                                        <TableCell className="py-3 px-3">
                                                            <Badge variant={isReviewed ? 'emerald' : isSubmitted ? 'default' : 'secondary'} className="text-[10px] font-bold">
                                                                {sub.submission_status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-3">
                                                            {sub.submission_file_url ? (
                                                                <a href={sub.submission_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-primary font-semibold hover:underline">
                                                                    <Paperclip className="w-3 h-3"/>
                                                                    <span className="truncate max-w-[120px]">
                                                                        {sub.submission_file_name || 'Uploaded File'}
                                                                    </span>
                                                                    <ExternalLink className="w-2.5 h-2.5"/>
                                                                </a>
                                                            ) : sub.offline_completion_date ? (
                                                                <span className="text-emerald-700 font-medium text-[11px]">
                                                                    Verified {sub.offline_completion_date}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground text-[11px] italic">Not submitted</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-3 px-3">
                                                            {sub.marks_obtained !== null && sub.marks_obtained !== undefined ? (
                                                                <div className="flex items-center space-x-1.5">
                                                                    <span className="font-bold text-slate-800">
                                                                        {sub.marks_obtained}/{activeAssignmentForReview.max_marks || 50}
                                                                    </span>
                                                                    {sub.grade && (
                                                                        <Badge variant="outline" className="text-[10px] font-bold">
                                                                            {sub.grade}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground text-[11px]">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-3 px-3 text-right">
                                                            <Button 
                                                                variant={isReviewed ? 'outline' : 'default'}
                                                                size="sm"
                                                                type="button" 
                                                                onClick={() => handleOpenGradeModal(sub)} 
                                                                className="h-7 text-xs font-semibold"
                                                            >
                                                                {isReviewed ? 'Edit Grade' : activeAssignmentForReview.submission_type === 'Online Submission' ? 'Review & Grade' : 'Mark Completed'}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>

                        {/* Drawer Footer */}
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                            <span>Auto-saved to Centralized ERP Database</span>
                            <button 
                                type="button" 
                                onClick={() => setIsSubmissionsDrawerOpen(false)} 
                                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review & Grade Modal */}
            {isGradeModalOpen && selectedStudentForReview && activeAssignmentForReview && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                                    <Award className="w-5 h-5"/>
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Grade Submission: {selectedStudentForReview.student_name}
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        {selectedStudentForReview.admission_number} • {activeAssignmentForReview.title}
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsGradeModalOpen(false)} 
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>

                        <form onSubmit={handleSaveReview} className="p-5 space-y-4 text-xs">
                            {/* Submission evidence */}
                            {selectedStudentForReview.submission_file_url && (
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Paperclip className="w-4 h-4 text-purple-700"/>
                                        <div>
                                            <span className="font-bold text-slate-800 block">
                                                {selectedStudentForReview.submission_file_name || 'Student Uploaded Work'}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                Notes: {selectedStudentForReview.submission_notes || 'None provided'}
                                            </span>
                                        </div>
                                    </div>
                                    <a 
                                        href={selectedStudentForReview.submission_file_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="px-2.5 py-1 bg-purple-700 text-white rounded-lg text-xs font-semibold hover:bg-purple-800"
                                    >
                                        Open
                                    </a>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {/* Marks */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Marks Obtained (Max: {activeAssignmentForReview.max_marks || 50})
                                    </label>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max={activeAssignmentForReview.max_marks || 100} 
                                        required 
                                        value={reviewMarks} 
                                        onChange={(e) => setReviewMarks(e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    />
                                </div>

                                {/* Grade */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Letter Grade</label>
                                    <select 
                                        value={reviewGrade} 
                                        onChange={(e) => setReviewGrade(e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    >
                                        <option value="A+">A+ (Outstanding)</option>
                                        <option value="A">A (Excellent)</option>
                                        <option value="B+">B+ (Very Good)</option>
                                        <option value="B">B (Good)</option>
                                        <option value="C">C (Satisfactory)</option>
                                        <option value="Needs Improvement">Needs Improvement</option>
                                    </select>
                                </div>
                            </div>

                            {/* Remarks */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Remarks (Report)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Accurate working, neat presentation..." 
                                    value={reviewRemarks} 
                                    onChange={(e) => setReviewRemarks(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            </div>

                            {/* Student Feedback */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Constructive Feedback for Student</label>
                                <textarea 
                                    rows={2} 
                                    placeholder="e.g. Excellent logic flow; next time consider writing unit tests for your project..." 
                                    value={reviewFeedback} 
                                    onChange={(e) => setReviewFeedback(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsGradeModalOpen(false)} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-xs"
                                >
                                    Save Evaluation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create / Edit Assignment Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                                    <FileCheck2 className="w-5 h-5"/>
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {editingAssignment ? 'Edit Academic Assignment' : 'Create New Academic Assignment'}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        Supports online file uploads or offline classroom verification
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsCreateModalOpen(false)} 
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>

                        <form onSubmit={handleSaveAssignment} className="p-5 overflow-y-auto space-y-4 flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Target Class */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Target Class <span className="text-rose-500">*</span>
                                    </label>
                                    <select 
                                        value={formClassId} 
                                        onChange={(e) => {
                                            const newClassId = Number(e.target.value);
                                            setFormClassId(newClassId);
                                            fetchSubjectsForClass(newClassId);
                                        }} 
                                        required 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    >
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Target Section */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Section</label>
                                    <select 
                                        value={formSectionId} 
                                        onChange={(e) => setFormSectionId(e.target.value)} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    >
                                        <option value="all">All Sections in Class</option>
                                        {availableSections.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                Section {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dynamic Subject Selection (Pre-listed from Class) */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                                        <span>Subject <span className="text-rose-500">*</span></span>
                                        {isLoadingSubjects && <span className="text-[10px] text-purple-600 font-normal">Loading...</span>}
                                    </label>
                                    <select 
                                        value={formSubjectId} 
                                        onChange={(e) => {
                                            const subId = e.target.value;
                                            setFormSubjectId(subId);
                                            const found = classSubjectsList.find(s => String(s.subject_id) === String(subId));
                                            if (found) {
                                                setFormSubject(found.subject_name);
                                            }
                                        }} 
                                        required 
                                        disabled={isLoadingSubjects}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:bg-slate-100"
                                    >
                                        {classSubjectsList.length === 0 ? (
                                            <option value="">No mapped subjects found</option>
                                        ) : (
                                            classSubjectsList.map((cs) => (
                                                <option key={cs.subject_id || cs.id} value={cs.subject_id}>
                                                    {cs.subject_name} {cs.subject_code ? `(${cs.subject_code})` : ''}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Submission Mode */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Submission Mode <span className="text-rose-500">*</span>
                                    </label>
                                    <select 
                                        value={formSubmissionType} 
                                        onChange={(e) => setFormSubmissionType(e.target.value)} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    >
                                        <option value="Online Submission">Online Submission (Student Uploads File)</option>
                                        <option value="Offline Work">Offline Work (Classroom / Lab Verification)</option>
                                    </select>
                                </div>

                                {/* Max Marks */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Marks / Points</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={formMaxMarks} 
                                        onChange={(e) => setFormMaxMarks(Number(e.target.value))} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Assignment Title <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Scratch Coding Interactive Quiz Game" 
                                    value={formTitle} 
                                    onChange={(e) => setFormTitle(e.target.value)} 
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                                <textarea 
                                    rows={3} 
                                    placeholder="Provide complete rubric, learning objectives, and grading criteria..." 
                                    value={formDescription} 
                                    onChange={(e) => setFormDescription(e.target.value)} 
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Assigned Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={formAssignedDate} 
                                        onChange={(e) => setFormAssignedDate(e.target.value)} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={formStartDate} 
                                        onChange={(e) => setFormStartDate(e.target.value)} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    />
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Due Date <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={formDueDate} 
                                        onChange={(e) => setFormDueDate(e.target.value)} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Schedule Checkbox & Conditional start_at */}
                            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={isScheduled} 
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setIsScheduled(checked);
                                            if (checked) {
                                                if (!formStartAt) {
                                                    const now = new Date();
                                                    now.setHours(now.getHours() + 1);
                                                    setFormStartAt(now.toISOString().slice(0, 16));
                                                }
                                            } else {
                                                setFormStartAt('');
                                            }
                                        }}
                                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" 
                                    />
                                    <span className="text-xs font-bold text-slate-800">
                                        Schedule this Assignment for Future Publishing
                                    </span>
                                </label>

                                {isScheduled && (
                                    <div className="pl-6 pt-1">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Publish Schedule Date & Time <span className="text-rose-500">*</span>
                                        </label>
                                        <input 
                                            type="datetime-local" 
                                            required={isScheduled}
                                            value={formStartAt} 
                                            onChange={(e) => setFormStartAt(e.target.value)} 
                                            className="w-full sm:w-72 px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            Students will only see and access this assignment after this date & time.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Attachments Toggle & Files Only (Doc & Image) */}
                            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Paperclip className="w-4 h-4 text-purple-700" />
                                        <span className="text-xs font-bold text-slate-800">Add Attachments (Doc & Image Files Only)</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={hasAttachments} 
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setHasAttachments(checked);
                                                if (!checked) {
                                                    setDocFileObj(null);
                                                    setImageFileObj(null);
                                                }
                                            }} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>

                                {hasAttachments && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {/* Doc File Upload Input */}
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                    <span>Doc (Document file)</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">PDF, DOC, DOCX, TXT</span>
                                            </div>

                                            <input 
                                                type="file" 
                                                ref={docInputRef} 
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={(e) => handleFileUpload(e.target.files[0], 'doc')} 
                                                className="hidden" 
                                            />

                                            {docFileObj ? (
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs">
                                                    <div className="flex items-center space-x-2 truncate">
                                                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                                        <span className="font-semibold text-blue-900 truncate max-w-[150px]">{docFileObj.name}</span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setDocFileObj(null);
                                                            if (docInputRef.current) docInputRef.current.value = '';
                                                        }} 
                                                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    type="button" 
                                                    disabled={uploadingDoc}
                                                    onClick={() => docInputRef.current?.click()} 
                                                    className="w-full py-2 px-3 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-purple-700 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/40 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                                >
                                                    {uploadingDoc ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                                                            <span>Uploading doc...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>Choose Document</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Image File Upload Input */}
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                                                    <ImageIcon className="w-4 h-4 text-purple-600" />
                                                    <span>Image (Image file)</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, JPEG, WEBP</span>
                                            </div>

                                            <input 
                                                type="file" 
                                                ref={imageInputRef} 
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e.target.files[0], 'image')} 
                                                className="hidden" 
                                            />

                                            {imageFileObj ? (
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/70 border border-purple-200/60 text-xs">
                                                    <div className="flex items-center space-x-2 truncate">
                                                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                                                        <span className="font-semibold text-purple-900 truncate max-w-[150px]">{imageFileObj.name}</span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setImageFileObj(null);
                                                            if (imageInputRef.current) imageInputRef.current.value = '';
                                                        }} 
                                                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    type="button" 
                                                    disabled={uploadingImage}
                                                    onClick={() => imageInputRef.current?.click()} 
                                                    className="w-full py-2 px-3 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-purple-700 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/40 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                                >
                                                    {uploadingImage ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                                                            <span>Uploading image...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>Choose Image</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Checkbox Options */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 text-xs">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formAllowResubmission} 
                                        onChange={(e) => setFormAllowResubmission(e.target.checked)} 
                                        className="rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="font-medium text-slate-700">Allow Resubmissions</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formAllowLateSubmission} 
                                        onChange={(e) => setFormAllowLateSubmission(e.target.checked)} 
                                        className="rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="font-medium text-slate-700">Allow Late Submissions</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formAttachmentRequired} 
                                        onChange={(e) => setFormAttachmentRequired(e.target.checked)} 
                                        className="rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="font-medium text-slate-700">Attachment Mandatory</span>
                                </label>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreateModalOpen(false)} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || uploadingDoc || uploadingImage} 
                                    className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                    ) : (
                                        <Send className="w-4 h-4"/>
                                    )}
                                    <span>
                                        {editingAssignment 
                                            ? 'Update Assignment' 
                                            : isScheduled 
                                                ? 'Schedule Assignment' 
                                                : 'Publish Assignment'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
