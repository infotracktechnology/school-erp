import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
    Bell, Plus, Search, Calendar, Clock, Paperclip, Trash2, Edit2, Eye, 
    Send, Loader2, ExternalLink, X, Users, User,
    FileText, Image as ImageIcon, Link as LinkIcon, Video, UploadCloud, CheckCircle2,
    Layers, CheckSquare, Square
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { getAcademicGroups } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const AnnouncementView = ({ branchId, academicYearId, classes, sections, showToast }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [selectedUserType, setSelectedUserType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Academic Groups
    const [academicGroupsList, setAcademicGroupsList] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [formGroupId, setFormGroupId] = useState('');
    const [formGroupName, setFormGroupName] = useState('');

    // Form State
    const [formUserType, setFormUserType] = useState('Both');
    const [formAudience, setFormAudience] = useState('All');
    const [formClassId, setFormClassId] = useState('');
    const [formSectionId, setFormSectionId] = useState('');

    // Multi-Select for Individual Students: Classes, Sections, Students
    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState([]);
    const [studentsPool, setStudentsPool] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [isLoadingStudentsPool, setIsLoadingStudentsPool] = useState(false);
    const [studentSearchText, setStudentSearchText] = useState('');

    const [formGender, setFormGender] = useState('');
    const [formResidential, setFormResidential] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formMessage, setFormMessage] = useState('');

    // Schedule Checkbox & start_at
    const [isScheduled, setIsScheduled] = useState(false);
    const [formStartAt, setFormStartAt] = useState('');

    // Attachments Toggle (4 Inputs: Doc, Image, Link, Video)
    const [hasAttachments, setHasAttachments] = useState(false);
    const [docFileObj, setDocFileObj] = useState(null); // { name, url, size }
    const [imageFileObj, setImageFileObj] = useState(null); // { name, url, size }
    const [linkUrl, setLinkUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const docInputRef = useRef(null);
    const imageInputRef = useRef(null);

    // Fetch Academic Groups
    const fetchGroups = useCallback(async () => {
        if (!branchId) return;
        setIsLoadingGroups(true);
        try {
            const grps = await getAcademicGroups({ branch_id: branchId, academicYearId });
            setAcademicGroupsList(grps || []);
            if (grps && grps.length > 0 && !formGroupId) {
                setFormGroupId(String(grps[0].id));
                setFormGroupName(grps[0].name);
            }
        } catch (err) {
            console.error('Failed to load academic groups:', err);
            setAcademicGroupsList([]);
        } finally {
            setIsLoadingGroups(false);
        }
    }, [branchId, academicYearId, formGroupId]);

    useEffect(() => {
        if (formAudience === 'Academic Group') {
            fetchGroups();
        }
    }, [formAudience, fetchGroups]);

    // Available Sections for Multi-Select based on selectedClassIds
    const availableSectionsMulti = useMemo(() => {
        if (!selectedClassIds || selectedClassIds.length === 0) return [];
        const classIdSet = new Set(selectedClassIds.map(Number));
        return (sections || []).filter(s => classIdSet.has(Number(s.class_id)));
    }, [selectedClassIds, sections]);

    // Fetch Students pool when selectedClassIds or selectedSectionIds change in Multi-Select mode
    useEffect(() => {
        if (formAudience === 'Individual' && selectedClassIds.length > 0) {
            setIsLoadingStudentsPool(true);
            const promises = selectedClassIds.map(cId => {
                const params = new URLSearchParams();
                params.append('branch_id', String(branchId));
                params.append('class_id', String(cId));
                params.append('status', 'Active');
                params.append('page_size', '400');
                return fetch(`/api/students?${params.toString()}`)
                    .then(r => r.json())
                    .then(res => res.data || [])
                    .catch(() => []);
            });

            Promise.all(promises).then(results => {
                let combined = results.flat();
                // Filter by sections if any sections are specifically checked
                if (selectedSectionIds.length > 0) {
                    const secSet = new Set(selectedSectionIds.map(Number));
                    combined = combined.filter(st => secSet.has(Number(st.section_id || st.current_section_id)));
                }
                // Unique by student id
                const map = new Map();
                combined.forEach(st => map.set(st.id, st));
                const list = Array.from(map.values());
                setStudentsPool(list);
            }).finally(() => {
                setIsLoadingStudentsPool(false);
            });
        } else {
            setStudentsPool([]);
            setSelectedStudentIds([]);
        }
    }, [formAudience, selectedClassIds, selectedSectionIds, branchId]);

    // Filtered student pool by search text
    const filteredStudentsPool = useMemo(() => {
        if (!studentSearchText.trim()) return studentsPool;
        const q = studentSearchText.toLowerCase();
        return studentsPool.filter(st => {
            const name = `${st.first_name || ''} ${st.last_name || ''}`.toLowerCase();
            const adm = (st.admission_number || '').toLowerCase();
            const roll = String(st.roll_number || '');
            return name.includes(q) || adm.includes(q) || roll.includes(q);
        });
    }, [studentsPool, studentSearchText]);

    const fetchAnnouncements = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await communicationService.getAnnouncements({
                branch_id: branchId,
                academic_year_id: academicYearId,
                user_type: selectedUserType !== 'all' ? selectedUserType : undefined,
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
                search: searchQuery.trim() || undefined
            });
            setAnnouncements(data);
        }
        catch (err) {
            showToast(err.message || 'Failed to fetch announcements', 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, selectedUserType, selectedStatus, searchQuery, showToast]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleOpenCreate = () => {
        setEditingAnnouncement(null);
        setFormUserType('Both');
        setFormAudience('All');
        setFormClassId('');
        setFormSectionId('');

        // Reset Academic Group
        setFormGroupId('');
        setFormGroupName('');

        // Reset Multi-Select
        setSelectedClassIds([]);
        setSelectedSectionIds([]);
        setStudentsPool([]);
        setSelectedStudentIds([]);
        setStudentSearchText('');

        setFormGender('');
        setFormResidential('');
        setFormTitle('');
        setFormMessage('');

        setIsScheduled(false);
        setFormStartAt('');
        setHasAttachments(false);
        setDocFileObj(null);
        setImageFileObj(null);
        setLinkUrl('');
        setVideoUrl('');

        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingAnnouncement(item);
        setFormUserType(item.user_type || 'Both');
        setFormAudience(item.target_audience || 'All');
        setFormClassId(item.target_class_id ? String(item.target_class_id) : '');
        setFormSectionId(item.target_section_id ? String(item.target_section_id) : '');
        setFormGroupId(item.target_group_id ? String(item.target_group_id) : '');
        setFormGroupName(item.target_group_name || '');

        // Parse student ids if multi
        if (item.target_student_ids) {
            try {
                const ids = JSON.parse(item.target_student_ids);
                setSelectedStudentIds(Array.isArray(ids) ? ids : []);
            } catch (e) {
                setSelectedStudentIds(item.target_student_id ? [item.target_student_id] : []);
            }
        } else if (item.target_student_id) {
            setSelectedStudentIds([item.target_student_id]);
        } else {
            setSelectedStudentIds([]);
        }

        // Parse class ids if multi or single
        if (item.target_class_ids) {
            try {
                const cIds = JSON.parse(item.target_class_ids);
                setSelectedClassIds(Array.isArray(cIds) ? cIds : []);
            } catch (e) {
                setSelectedClassIds(item.target_class_id ? [item.target_class_id] : []);
            }
        } else if (item.target_class_id) {
            setSelectedClassIds([item.target_class_id]);
        } else {
            setSelectedClassIds([]);
        }

        // Parse section ids if multi or single
        if (item.target_section_ids) {
            try {
                const sIds = JSON.parse(item.target_section_ids);
                setSelectedSectionIds(Array.isArray(sIds) ? sIds : []);
            } catch (e) {
                setSelectedSectionIds(item.target_section_id ? [item.target_section_id] : []);
            }
        } else if (item.target_section_id) {
            setSelectedSectionIds([item.target_section_id]);
        } else {
            setSelectedSectionIds([]);
        }

        setFormGender(item.target_gender || '');
        setFormResidential(item.target_residential_type || '');
        setFormTitle(item.title || '');
        setFormMessage(item.message || '');

        const scheduled = Boolean(item.is_scheduled || item.status === 'Scheduled');
        setIsScheduled(scheduled);
        setFormStartAt(item.start_at ? item.start_at.slice(0, 16) : '');

        // Parse attachments
        let atts = item.attachments;
        if (typeof atts === 'string') {
            try { atts = JSON.parse(atts); } catch (e) { atts = null; }
        }
        if (atts && (atts.doc || atts.image || atts.link || atts.video)) {
            setHasAttachments(true);
            setDocFileObj(atts.doc || null);
            setImageFileObj(atts.image || null);
            setLinkUrl(atts.link || '');
            setVideoUrl(atts.video || '');
        } else if (item.attachment_url) {
            setHasAttachments(true);
            const isImg = item.attachment_url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
            if (isImg) {
                setImageFileObj({ name: item.attachment_name || 'Attached Image', url: item.attachment_url });
                setDocFileObj(null);
            } else {
                setDocFileObj({ name: item.attachment_name || 'Attached Document', url: item.attachment_url });
                setImageFileObj(null);
            }
            setLinkUrl('');
            setVideoUrl('');
        } else {
            setHasAttachments(false);
            setDocFileObj(null);
            setImageFileObj(null);
            setLinkUrl('');
            setVideoUrl('');
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

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formTitle.trim() || !formMessage.trim()) {
            showToast('Please enter announcement title and message content', 'error');
            return;
        }
        if (formAudience === 'Individual' && selectedStudentIds.length === 0) {
            showToast('Please select at least one student from the filtered list', 'error');
            return;
        }
        if (formAudience === 'Academic Group' && !formGroupId) {
            showToast('Please select an academic group', 'error');
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
            if (hasAttachments) {
                const trimmedLink = linkUrl.trim();
                const trimmedVideo = videoUrl.trim();
                if (docFileObj || imageFileObj || trimmedLink || trimmedVideo) {
                    attachmentsPayload = {
                        doc: docFileObj || null,
                        image: imageFileObj || null,
                        link: trimmedLink || null,
                        video: trimmedVideo || null
                    };
                }
            }

            // Student names summary for multi-select
            let studentNameSummary = null;
            if (formAudience === 'Individual') {
                if (selectedStudentIds.length === 1) {
                    const st = studentsPool.find(s => s.id === selectedStudentIds[0]);
                    studentNameSummary = st ? `${st.first_name || ''} ${st.last_name || ''}`.trim() : `Student #${selectedStudentIds[0]}`;
                } else {
                    studentNameSummary = `${selectedStudentIds.length} Selected Students`;
                }
            }

            const payload = {
                organization_id: 1,
                branch_id: branchId,
                academic_year_id: academicYearId,
                user_type: formUserType,
                target_audience: formAudience,
                target_class_id: formAudience === 'Class' && formClassId ? Number(formClassId) : (selectedClassIds[0] || null),
                target_section_id: formAudience === 'Section' && formSectionId ? Number(formSectionId) : (selectedSectionIds[0] || null),
                target_group_id: formAudience === 'Academic Group' && formGroupId ? Number(formGroupId) : null,
                target_group_name: formAudience === 'Academic Group' ? formGroupName : null,
                target_student_id: formAudience === 'Individual' && selectedStudentIds.length === 1 ? selectedStudentIds[0] : null,
                target_student_name: studentNameSummary,
                target_student_ids: formAudience === 'Individual' ? JSON.stringify(selectedStudentIds) : null,
                target_class_ids: ['Individual', 'Gender', 'Residential'].includes(formAudience) && selectedClassIds.length > 0 ? JSON.stringify(selectedClassIds) : null,
                target_section_ids: ['Individual', 'Gender', 'Residential'].includes(formAudience) && selectedSectionIds.length > 0 ? JSON.stringify(selectedSectionIds) : null,
                target_gender: formAudience === 'Gender' ? formGender : null,
                target_residential_type: formAudience === 'Residential' ? formResidential : null,
                title: formTitle.trim(),
                message: formMessage.trim(),
                publish_date: new Date().toISOString().split('T')[0],
                priority: 'Normal',
                is_scheduled: isScheduled ? 1 : 0,
                start_at: isScheduled && formStartAt ? formStartAt : null,
                status: finalStatus,
                attachments: attachmentsPayload
            };

            if (editingAnnouncement) {
                await communicationService.updateAnnouncement(editingAnnouncement.id, payload);
                showToast('Announcement updated successfully', 'success');
            }
            else {
                await communicationService.createAnnouncement(payload);
                showToast('Announcement published successfully', 'success');
            }
            setIsCreateModalOpen(false);
            fetchAnnouncements();
        }
        catch (err) {
            showToast(err.message || 'Failed to save announcement', 'error');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?'))
            return;
        try {
            await communicationService.deleteAnnouncement(id);
            showToast('Announcement deleted successfully', 'success');
            fetchAnnouncements();
        }
        catch (err) {
            showToast(err.message || 'Failed to delete announcement', 'error');
        }
    };

    // Helper functions for Multi-Select toggles
    const toggleClassSelection = (cId) => {
        setSelectedClassIds(prev => {
            const next = prev.includes(cId) ? prev.filter(id => id !== cId) : [...prev, cId];
            // Remove any selected sections that don't belong to remaining classes
            setSelectedSectionIds(secPrev => {
                const validClassSet = new Set(next.map(Number));
                return secPrev.filter(sId => {
                    const sec = sections.find(s => s.id === sId);
                    return sec && validClassSet.has(Number(sec.class_id));
                });
            });
            return next;
        });
    };

    const toggleSectionSelection = (sId) => {
        setSelectedSectionIds(prev => prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]);
    };

    const toggleStudentSelection = (stId) => {
        setSelectedStudentIds(prev => prev.includes(stId) ? prev.filter(id => id !== stId) : [...prev, stId]);
    };

    const handleSelectAllStudents = () => {
        if (selectedStudentIds.length === filteredStudentsPool.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(filteredStudentsPool.map(st => st.id));
        }
    };

    return (
        <div className="space-y-5">
            {/* Header Banner */}
            <Card className="p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                        <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                            <Bell className="w-5 h-5"/>
                        </span>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">Announcements & Notices</h2>
                            <p className="text-xs text-muted-foreground font-medium">
                                Broadcast targeted school announcements to classes, academic groups, or multi-selected students
                            </p>
                        </div>
                    </div>
                    <Button 
                        id="btn-post-new-announcement" 
                        type="button" 
                        onClick={handleOpenCreate} 
                        className="w-full sm:w-auto shadow-xs active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-1.5"/>
                        <span>New Announcement</span>
                    </Button>
                </div>
            </Card>

            {/* Filter Bar */}
            <Card className="p-4 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground z-10"/>
                        <Input 
                            type="text" 
                            placeholder="Search announcement..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="pl-9 h-9 text-xs"
                        />
                    </div>

                    {/* User Type */}
                    <div>
                        <select 
                            value={selectedUserType} 
                            onChange={(e) => setSelectedUserType(e.target.value)} 
                            className="w-full h-9 px-3 text-xs rounded-md border border-input bg-transparent font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="all">All User Types</option>
                            <option value="Students">Students Only</option>
                            <option value="Parents">Parents Only</option>
                            <option value="Both">Both (Students & Parents)</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <select 
                            value={selectedStatus} 
                            onChange={(e) => setSelectedStatus(e.target.value)} 
                            className="w-full h-9 px-3 text-xs rounded-md border border-input bg-transparent font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Scheduled">Scheduled</option>
                        </select>
                    </div>

                    <div>
                        <Button 
                            variant="outline"
                            size="sm"
                            type="button" 
                            onClick={() => {
                                setSelectedUserType('all');
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

            {/* Announcements List */}
            {isLoading ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-7 h-7 text-amber-600 animate-spin"/>
                    <p className="text-xs font-semibold text-slate-600">Loading branch announcements...</p>
                </div>
            ) : announcements.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Bell className="w-6 h-6"/>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Announcements Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                        Publish an alert, circular, or general notice for this branch.
                    </p>
                    <button 
                        type="button" 
                        onClick={handleOpenCreate} 
                        className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors shadow-xs"
                    >
                        Post Announcement
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map((item) => {
                        // Parse attachments safely
                        let atts = item.attachments;
                        if (typeof atts === 'string') {
                            try { atts = JSON.parse(atts); } catch(e) { atts = null; }
                        }
                        const hasDoc = atts?.doc?.url;
                        const hasImg = atts?.image?.url;
                        const hasLink = atts?.link;
                        const hasVideo = atts?.video;
                        const singleAttUrl = item.attachment_url;

                        let audienceDisplay = item.target_audience;
                        if (item.target_audience === 'Individual') {
                            audienceDisplay = item.target_student_name || 'Individual Student';
                        } else if (item.target_audience === 'Academic Group') {
                            audienceDisplay = `Group: ${item.target_group_name || 'Academic Group'}`;
                        } else if (item.target_audience === 'Class') {
                            audienceDisplay = item.class_name ? `Class ${item.class_name}` : 'Specific Class';
                        } else if (item.target_audience === 'Section') {
                            audienceDisplay = `${item.class_name || 'Class'} • Sec ${item.section_name || 'Section'}`;
                        } else if (item.target_audience === 'Gender') {
                            const genderLabel = item.target_gender === 'Male' ? 'Boys' : item.target_gender === 'Female' ? 'Girls' : (item.target_gender || 'All Genders');
                            let classSuffix = '';
                            if (item.target_class_ids) {
                                try {
                                    const cIds = JSON.parse(item.target_class_ids);
                                    if (Array.isArray(cIds) && cIds.length > 0) {
                                        classSuffix = ` (${cIds.length} Cls)`;
                                    }
                                } catch(e) {}
                            }
                            audienceDisplay = `Gender: ${genderLabel}${classSuffix}`;
                        } else if (item.target_audience === 'Residential') {
                            const resLabel = item.target_residential_type || 'Residential';
                            let classSuffix = '';
                            if (item.target_class_ids) {
                                try {
                                    const cIds = JSON.parse(item.target_class_ids);
                                    if (Array.isArray(cIds) && cIds.length > 0) {
                                        classSuffix = ` (${cIds.length} Cls)`;
                                    }
                                } catch(e) {}
                            }
                            audienceDisplay = `Residential: ${resLabel}${classSuffix}`;
                        }

                        return (
                            <Card 
                                key={item.id} 
                                className="hover:border-primary/50 transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Target Audience Badge */}
                                        <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] font-semibold">
                                            {item.user_type} • {audienceDisplay}
                                        </Badge>

                                        {/* Priority badge */}
                                        {item.priority && (
                                            <Badge variant={item.priority === 'Urgent' || item.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px] font-bold uppercase">
                                                {item.priority}
                                            </Badge>
                                        )}

                                        {/* Scheduled notice */}
                                        {item.is_scheduled ? (
                                            <Badge variant="default" className="text-[10px] font-bold tracking-wide uppercase">
                                                Scheduled
                                            </Badge>
                                        ) : null}

                                        {/* Status */}
                                        <Badge variant={item.status === 'Published' ? 'emerald' : 'outline'} className="text-[10px] font-bold">
                                            {item.is_scheduled ? 'Scheduled' : item.status}
                                        </Badge>
                                    </div>

                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {item.message}
                                    </p>

                                    {/* Meta & Attachments */}
                                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70"/>
                                            <span>Posted: {item.publish_date}</span>
                                        </div>

                                        {item.is_scheduled && item.start_at && (
                                            <div className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">
                                                Releases: {new Date(item.start_at).toLocaleString()}
                                            </div>
                                        )}

                                        {/* Attachments Pills (Doc, Image, Link, Video) */}
                                        {(hasDoc || hasImg || hasLink || hasVideo || singleAttUrl) && (
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {hasDoc && (
                                                    <a 
                                                        href={atts.doc.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center space-x-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        <span className="truncate max-w-[110px]">{atts.doc.name || 'Document'}</span>
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
                                                        <span className="truncate max-w-[110px]">{atts.image.name || 'Image'}</span>
                                                    </a>
                                                )}
                                                {hasLink && (
                                                    <a 
                                                        href={atts.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <LinkIcon className="w-3 h-3" />
                                                        <span>Link</span>
                                                    </a>
                                                )}
                                                {hasVideo && (
                                                    <a 
                                                        href={atts.video} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center space-x-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md hover:bg-rose-100 transition-colors"
                                                    >
                                                        <Video className="w-3 h-3" />
                                                        <span>Video</span>
                                                    </a>
                                                )}
                                                {!hasDoc && !hasImg && !hasLink && !hasVideo && singleAttUrl && (
                                                    <a 
                                                        href={singleAttUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center space-x-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md hover:bg-primary/20 transition-colors"
                                                    >
                                                        <Paperclip className="w-3 h-3" />
                                                        <span className="truncate max-w-[110px]">{item.attachment_name || 'Attachment'}</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        type="button" 
                                        onClick={() => {
                                            setSelectedAnnouncement(item);
                                            setIsDetailModalOpen(true);
                                        }} 
                                        className="h-8 text-xs font-semibold"
                                    >
                                        <Eye className="w-3.5 h-3.5 mr-1"/>
                                        <span>View Notice</span>
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        <button 
                                            type="button" 
                                            onClick={() => handleOpenEdit(item)} 
                                            title="Edit Announcement" 
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleDelete(item.id)} 
                                            title="Delete Announcement" 
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create / Edit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                                    <Bell className="w-5 h-5"/>
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {editingAnnouncement ? 'Edit Announcement' : 'Compose New Announcement'}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        Branch-level notice with custom targeting
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

                        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Target User Type */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Target User Type <span className="text-rose-500">*</span>
                                    </label>
                                    <select 
                                        value={formUserType} 
                                        onChange={(e) => setFormUserType(e.target.value)} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    >
                                        <option value="Both">Both Students & Parents</option>
                                        <option value="Students">Students Only</option>
                                        <option value="Parents">Parents Only</option>
                                    </select>
                                </div>

                                {/* Target Audience Scope */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Audience Scope <span className="text-rose-500">*</span>
                                    </label>
                                    <select 
                                        value={formAudience} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormAudience(val);
                                            if (val === 'Individual' && selectedClassIds.length === 0 && classes.length > 0) {
                                                setSelectedClassIds([classes[0].id]);
                                            }
                                        }} 
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    >
                                        <option value="All">All Students & Parents in Branch</option>
                                        <option value="Class">Specific Class</option>
                                        <option value="Section">Specific Class & Section</option>
                                        <option value="Academic Group">Academic Group</option>
                                        <option value="Individual">Individual Student (Multi-Select Filter)</option>
                                        <option value="Gender">Gender-wise (Boys / Girls)</option>
                                        <option value="Residential">Residential (Day Scholar / Hostel)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Conditional: Academic Group */}
                            {formAudience === 'Academic Group' && (
                                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-2">
                                    <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
                                        <Layers className="w-4 h-4 text-purple-700" />
                                        <span>Target Academic Group</span>
                                        {isLoadingGroups && <span className="text-[10px] text-purple-600 font-normal">Loading groups...</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Select Academic Group <span className="text-rose-500">*</span>
                                        </label>
                                        <select 
                                            value={formGroupId} 
                                            onChange={(e) => {
                                                const gId = e.target.value;
                                                setFormGroupId(gId);
                                                const found = academicGroupsList.find(g => String(g.id) === String(gId));
                                                if (found) {
                                                    setFormGroupName(found.name);
                                                }
                                            }} 
                                            required
                                            disabled={isLoadingGroups}
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:bg-slate-100"
                                        >
                                            {academicGroupsList.length === 0 ? (
                                                <option value="">No academic groups found for this branch</option>
                                            ) : (
                                                academicGroupsList.map((g) => (
                                                    <option key={g.id} value={g.id}>
                                                        {g.name} ({g.code || 'Group'}) • {g.members_count || 0} students
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Conditional: Class Scope */}
                            {formAudience === 'Class' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Select Target Class <span className="text-rose-500">*</span>
                                    </label>
                                    <select 
                                        value={formClassId} 
                                        onChange={(e) => setFormClassId(e.target.value)} 
                                        required
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    >
                                        <option value="">Select a Class</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Conditional: Section Scope */}
                            {formAudience === 'Section' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Target Class <span className="text-rose-500">*</span>
                                        </label>
                                        <select 
                                            value={formClassId} 
                                            onChange={(e) => setFormClassId(e.target.value)} 
                                            required
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium"
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Target Section <span className="text-rose-500">*</span>
                                        </label>
                                        <select 
                                            value={formSectionId} 
                                            onChange={(e) => setFormSectionId(e.target.value)} 
                                            required
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium"
                                        >
                                            <option value="">Select Section</option>
                                            {sections
                                                .filter((s) => !formClassId || s.class_id === Number(formClassId))
                                                .map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        Section {s.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Conditional: Individual Student Multi-Select Component (Class, Section, Students) */}
                            {formAudience === 'Individual' && (
                                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
                                            <Users className="w-4 h-4 text-blue-600" />
                                            <span>Multi-Select Individual Students</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                                            {selectedStudentIds.length} Selected
                                        </span>
                                    </div>

                                    {/* 1. Multi-Select Classes */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Filter Classes (Multi-Select) <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-lg border border-slate-200 max-h-24 overflow-y-auto">
                                            {classes.map((c) => {
                                                const checked = selectedClassIds.includes(c.id);
                                                return (
                                                    <button 
                                                        key={c.id} 
                                                        type="button" 
                                                        onClick={() => toggleClassSelection(c.id)} 
                                                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                                                            checked 
                                                                ? 'bg-blue-600 text-white shadow-xs' 
                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        <span>{c.name}</span>
                                                        {checked ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. Multi-Select Sections */}
                                    {selectedClassIds.length > 0 && availableSectionsMulti.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-bold text-slate-700">Filter Sections (Optional)</label>
                                                {selectedSectionIds.length > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setSelectedSectionIds([])} 
                                                        className="text-[10px] text-blue-600 font-semibold hover:underline"
                                                    >
                                                        Clear Sections (All)
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-lg border border-slate-200 max-h-24 overflow-y-auto">
                                                {availableSectionsMulti.map((s) => {
                                                    const checked = selectedSectionIds.includes(s.id);
                                                    const parentClass = classes.find(c => c.id === s.class_id);
                                                    return (
                                                        <button 
                                                            key={s.id} 
                                                            type="button" 
                                                            onClick={() => toggleSectionSelection(s.id)} 
                                                            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                                                                checked 
                                                                    ? 'bg-indigo-600 text-white' 
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            <span>{parentClass ? `${parentClass.name}-` : ''}{s.name}</span>
                                                            {checked ? <CheckCircle2 className="w-3 h-3" /> : null}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. Multi-Select Students Pool */}
                                    <div className="space-y-2 pt-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="relative flex-1">
                                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Search student by name, roll, or admission..." 
                                                    value={studentSearchText} 
                                                    onChange={(e) => setStudentSearchText(e.target.value)} 
                                                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                                />
                                            </div>
                                            {filteredStudentsPool.length > 0 && (
                                                <button 
                                                    type="button" 
                                                    onClick={handleSelectAllStudents} 
                                                    className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100/80 hover:bg-blue-200 rounded-lg shrink-0 cursor-pointer flex items-center space-x-1"
                                                >
                                                    {selectedStudentIds.length === filteredStudentsPool.length ? (
                                                        <>
                                                            <CheckSquare className="w-3.5 h-3.5" />
                                                            <span>Deselect All</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Square className="w-3.5 h-3.5" />
                                                            <span>Select All ({filteredStudentsPool.length})</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div className="p-2 bg-white rounded-xl border border-slate-200 max-h-48 overflow-y-auto divide-y divide-slate-100">
                                            {isLoadingStudentsPool ? (
                                                <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                    <span>Loading enrolled students...</span>
                                                </div>
                                            ) : selectedClassIds.length === 0 ? (
                                                <div className="py-6 text-center text-xs text-slate-400">
                                                    Please select at least one class above to view students.
                                                </div>
                                            ) : filteredStudentsPool.length === 0 ? (
                                                <div className="py-6 text-center text-xs text-slate-500">
                                                    No matching students found in the selected classes/sections.
                                                </div>
                                            ) : (
                                                filteredStudentsPool.map((st) => {
                                                    const checked = selectedStudentIds.includes(st.id);
                                                    return (
                                                        <label 
                                                            key={st.id} 
                                                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                                                checked ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-2.5 truncate">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={checked} 
                                                                    onChange={() => toggleStudentSelection(st.id)} 
                                                                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" 
                                                                />
                                                                <div className="truncate">
                                                                    <span className="font-bold text-slate-800 text-xs block truncate">
                                                                        {st.first_name} {st.last_name || ''}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400">
                                                                        {st.admission_number || `#${st.id}`} {st.roll_number ? `• Roll #${st.roll_number}` : ''}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                                                {st.class_name ? `Cls ${st.class_name}` : ''} {st.section_name ? `• Sec ${st.section_name}` : ''}
                                                            </span>
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formAudience === 'Gender' && (
                                <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200/80 space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Target Gender <span className="text-rose-500">*</span>
                                        </label>
                                        <select 
                                            value={formGender} 
                                            onChange={(e) => setFormGender(e.target.value)} 
                                            required
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Boys / Male Students</option>
                                            <option value="Female">Girls / Female Students</option>
                                        </select>
                                    </div>

                                    {/* 1. Multi-Select Classes */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-bold text-slate-700">Filter Classes (Optional / Multiple)</label>
                                            {selectedClassIds.length > 0 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setSelectedClassIds([]);
                                                        setSelectedSectionIds([]);
                                                    }} 
                                                    className="text-[10px] text-sky-600 font-semibold hover:underline"
                                                >
                                                    Clear All Classes
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-lg border border-slate-200 max-h-24 overflow-y-auto">
                                            {classes.map((c) => {
                                                const checked = selectedClassIds.includes(c.id);
                                                return (
                                                    <button 
                                                        key={c.id} 
                                                        type="button" 
                                                        onClick={() => toggleClassSelection(c.id)} 
                                                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                                                            checked 
                                                                ? 'bg-sky-600 text-white shadow-xs' 
                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        <span>{c.name}</span>
                                                        {checked ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. Multi-Select Sections */}
                                    {selectedClassIds.length > 0 && availableSectionsMulti.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-bold text-slate-700">Filter Sections (Optional / Multiple)</label>
                                                {selectedSectionIds.length > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setSelectedSectionIds([])} 
                                                        className="text-[10px] text-sky-600 font-semibold hover:underline"
                                                    >
                                                        Clear Sections (All)
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-lg border border-slate-200 max-h-24 overflow-y-auto">
                                                {availableSectionsMulti.map((s) => {
                                                    const checked = selectedSectionIds.includes(s.id);
                                                    const parentClass = classes.find(c => c.id === s.class_id);
                                                    return (
                                                        <button 
                                                            key={s.id} 
                                                            type="button" 
                                                            onClick={() => toggleSectionSelection(s.id)} 
                                                            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                                                                checked 
                                                                    ? 'bg-indigo-600 text-white' 
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            <span>{parentClass ? `${parentClass.name}-` : ''}{s.name}</span>
                                                            {checked ? <CheckCircle2 className="w-3 h-3" /> : null}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {formAudience === 'Residential' && (
                                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Residential Category <span className="text-rose-500">*</span>
                                        </label>
                                        <select 
                                            value={formResidential} 
                                            onChange={(e) => setFormResidential(e.target.value)} 
                                            required
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        >
                                            <option value="">Select Residential Type</option>
                                            <option value="Day Scholar">Day Scholars Only</option>
                                            <option value="Hosteler">Hostel Residents / Boarders Only</option>
                                        </select>
                                    </div>

                                    {/* 1. Multi-Select Classes */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-bold text-slate-700">Filter Classes (Optional / Multiple)</label>
                                            {selectedClassIds.length > 0 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setSelectedClassIds([]);
                                                        setSelectedSectionIds([]);
                                                    }} 
                                                    className="text-[10px] text-emerald-600 font-semibold hover:underline"
                                                >
                                                    Clear All Classes
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-lg border border-slate-200 max-h-24 overflow-y-auto">
                                            {classes.map((c) => {
                                                const checked = selectedClassIds.includes(c.id);
                                                return (
                                                    <button 
                                                        key={c.id} 
                                                        type="button" 
                                                        onClick={() => toggleClassSelection(c.id)} 
                                                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                                                            checked 
                                                                ? 'bg-emerald-600 text-white shadow-xs' 
                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        <span>{c.name}</span>
                                                        {checked ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. Multi-Select Sections */}
                                    {selectedClassIds.length > 0 && availableSectionsMulti.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-bold text-slate-700">Filter Sections (Optional / Multiple)</label>
                                                {selectedSectionIds.length > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setSelectedSectionIds([])} 
                                                        className="text-[10px] text-emerald-600 font-semibold hover:underline"
                                                    >
                                                        Clear Sections (All)
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-lg border border-slate-200 max-h-24 overflow-y-auto">
                                                {availableSectionsMulti.map((s) => {
                                                    const checked = selectedSectionIds.includes(s.id);
                                                    const parentClass = classes.find(c => c.id === s.class_id);
                                                    return (
                                                        <button 
                                                            key={s.id} 
                                                            type="button" 
                                                            onClick={() => toggleSectionSelection(s.id)} 
                                                            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                                                                checked 
                                                                    ? 'bg-indigo-600 text-white' 
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            <span>{parentClass ? `${parentClass.name}-` : ''}{s.name}</span>
                                                            {checked ? <CheckCircle2 className="w-3 h-3" /> : null}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Announcement Title <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Campus Closure Alert, Annual Science Fair Registration..." 
                                    value={formTitle} 
                                    onChange={(e) => setFormTitle(e.target.value)} 
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                />
                            </div>

                            {/* Message Body */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Message Content <span className="text-rose-500">*</span>
                                </label>
                                <textarea 
                                    rows={4} 
                                    required 
                                    placeholder="Type official notification message clearly..." 
                                    value={formMessage} 
                                    onChange={(e) => setFormMessage(e.target.value)} 
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed"
                                />
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
                                        className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500" 
                                    />
                                    <span className="text-xs font-bold text-slate-800">
                                        Schedule this Announcement for Future Publishing
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
                                            className="w-full sm:w-72 px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" 
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            Students and parents will only receive/see this notice after this date & time.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Attachment Toggle & 4 Distinct Inputs (Doc, Image, Link, Video) */}
                            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Paperclip className="w-4 h-4 text-amber-700" />
                                        <span className="text-xs font-bold text-slate-800">Add Attachments</span>
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
                                                    setLinkUrl('');
                                                    setVideoUrl('');
                                                }
                                            }} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                                    </label>
                                </div>

                                {hasAttachments && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {/* 1. Doc File Upload Input */}
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
                                                    className="w-full py-2 px-3 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-amber-700 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/40 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                                >
                                                    {uploadingDoc ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
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

                                        {/* 2. Image File Upload Input */}
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
                                                    className="w-full py-2 px-3 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-amber-700 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/40 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                                >
                                                    {uploadingImage ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
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

                                        {/* 3. Link (Web / Resource URL) */}
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                                                    <LinkIcon className="w-4 h-4 text-emerald-600" />
                                                    <span>Link (Web / Resource URL)</span>
                                                </div>
                                            </div>
                                            <input 
                                                type="url" 
                                                placeholder="https://example.com/circular" 
                                                value={linkUrl} 
                                                onChange={(e) => setLinkUrl(e.target.value)} 
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" 
                                            />
                                        </div>

                                        {/* 4. Video (Video URL or embed) */}
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                                                    <Video className="w-4 h-4 text-rose-600" />
                                                    <span>Video (Video URL or embed)</span>
                                                </div>
                                            </div>
                                            <input 
                                                type="url" 
                                                placeholder="https://youtube.com/watch?v=..." 
                                                value={videoUrl} 
                                                onChange={(e) => setVideoUrl(e.target.value)} 
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreateModalOpen(false)} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || uploadingDoc || uploadingImage} 
                                    className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                    ) : (
                                        <Send className="w-4 h-4"/>
                                    )}
                                    <span>
                                        {editingAnnouncement 
                                            ? 'Update Announcement' 
                                            : isScheduled 
                                                ? 'Schedule Announcement' 
                                                : 'Publish Announcement'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Notice Detail Modal */}
            {isDetailModalOpen && selectedAnnouncement && (() => {
                let atts = selectedAnnouncement.attachments;
                if (typeof atts === 'string') {
                    try { atts = JSON.parse(atts); } catch(e) { atts = null; }
                }
                const hasDoc = atts?.doc?.url;
                const hasImg = atts?.image?.url;
                const hasLink = atts?.link;
                const hasVideo = atts?.video;
                const singleAttUrl = selectedAnnouncement.attachment_url;

                let audienceDisplay = selectedAnnouncement.target_audience;
                if (selectedAnnouncement.target_audience === 'Individual') {
                    audienceDisplay = selectedAnnouncement.target_student_name || 'Individual Student';
                } else if (selectedAnnouncement.target_audience === 'Academic Group') {
                    audienceDisplay = `Group: ${selectedAnnouncement.target_group_name || 'Academic Group'}`;
                } else if (selectedAnnouncement.target_audience === 'Class') {
                    audienceDisplay = selectedAnnouncement.class_name ? `Class ${selectedAnnouncement.class_name}` : 'Specific Class';
                } else if (selectedAnnouncement.target_audience === 'Section') {
                    audienceDisplay = `${selectedAnnouncement.class_name || 'Class'} • Sec ${selectedAnnouncement.section_name || 'Section'}`;
                } else if (selectedAnnouncement.target_audience === 'Gender') {
                    const genderLabel = selectedAnnouncement.target_gender === 'Male' ? 'Boys' : selectedAnnouncement.target_gender === 'Female' ? 'Girls' : (selectedAnnouncement.target_gender || 'All Genders');
                    let classSuffix = '';
                    if (selectedAnnouncement.target_class_ids) {
                        try {
                            const cIds = JSON.parse(selectedAnnouncement.target_class_ids);
                            if (Array.isArray(cIds) && cIds.length > 0) {
                                classSuffix = ` (${cIds.length} Classes)`;
                            }
                        } catch(e) {}
                    }
                    audienceDisplay = `Gender: ${genderLabel}${classSuffix}`;
                } else if (selectedAnnouncement.target_audience === 'Residential') {
                    const resLabel = selectedAnnouncement.target_residential_type || 'Residential';
                    let classSuffix = '';
                    if (selectedAnnouncement.target_class_ids) {
                        try {
                            const cIds = JSON.parse(selectedAnnouncement.target_class_ids);
                            if (Array.isArray(cIds) && cIds.length > 0) {
                                classSuffix = ` (${cIds.length} Classes)`;
                            }
                        } catch(e) {}
                    }
                    audienceDisplay = `Residential: ${resLabel}${classSuffix}`;
                }

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                        <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                                        <Bell className="w-5 h-5"/>
                                    </span>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                            Announcement Notice
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                                            {selectedAnnouncement.title}
                                        </h3>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setIsDetailModalOpen(false)} 
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4"/>
                                </button>
                            </div>

                            <div className="p-5 space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div>
                                        <span className="text-slate-400 block font-medium">Target Audience:</span>
                                        <span className="font-bold text-slate-800">
                                            {selectedAnnouncement.user_type} • {audienceDisplay}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block font-medium">Published Date:</span>
                                        <span className="font-bold text-slate-800">
                                            {selectedAnnouncement.publish_date}
                                        </span>
                                    </div>
                                    {selectedAnnouncement.is_scheduled && selectedAnnouncement.start_at && (
                                        <div className="col-span-2 bg-indigo-50/80 p-2 rounded-lg border border-indigo-200/50">
                                            <span className="text-indigo-500 font-semibold block text-[10px]">SCHEDULED RELEASE:</span>
                                            <span className="font-bold text-indigo-900">{new Date(selectedAnnouncement.start_at).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-slate-400 block font-medium">Status:</span>
                                        <span className="font-bold text-emerald-700">{selectedAnnouncement.is_scheduled ? 'Scheduled' : selectedAnnouncement.status}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-800 mb-1">Official Circular Notice:</h4>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                                        {selectedAnnouncement.message}
                                    </div>
                                </div>

                                {/* Attachments Section (Doc, Image, Link, Video) */}
                                {(hasDoc || hasImg || hasLink || hasVideo || singleAttUrl) && (
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-800">Attached Materials & Resources:</h4>
                                        <div className="space-y-2">
                                            {hasDoc && (
                                                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="w-4 h-4 text-blue-700" />
                                                        <div>
                                                            <span className="font-bold text-slate-800 block truncate max-w-[250px]">
                                                                {atts.doc.name || 'Document File'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">Click to view/download file</span>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={atts.doc.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="px-3 py-1.5 rounded-lg bg-blue-700 text-white font-semibold text-xs hover:bg-blue-800 transition-colors inline-flex items-center space-x-1"
                                                    >
                                                        <span>View File</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}

                                            {hasImg && (
                                                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <ImageIcon className="w-4 h-4 text-purple-700" />
                                                        <div>
                                                            <span className="font-bold text-slate-800 block truncate max-w-[250px]">
                                                                {atts.image.name || 'Image File'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">Click to view image</span>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={atts.image.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="px-3 py-1.5 rounded-lg bg-purple-700 text-white font-semibold text-xs hover:bg-purple-800 transition-colors inline-flex items-center space-x-1"
                                                    >
                                                        <span>View Image</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}

                                            {hasLink && (
                                                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <LinkIcon className="w-4 h-4 text-emerald-700" />
                                                        <div>
                                                            <span className="font-bold text-slate-800 block truncate max-w-[250px]">
                                                                {atts.link}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">Web / Resource Link</span>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={atts.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors inline-flex items-center space-x-1"
                                                    >
                                                        <span>Open Link</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}

                                            {hasVideo && (
                                                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Video className="w-4 h-4 text-rose-700" />
                                                        <div>
                                                            <span className="font-bold text-slate-800 block truncate max-w-[250px]">
                                                                {atts.video}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">Video Lesson / Embed</span>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={atts.video} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="px-3 py-1.5 rounded-lg bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 transition-colors inline-flex items-center space-x-1"
                                                    >
                                                        <span>Watch Video</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}

                                            {!hasDoc && !hasImg && !hasLink && !hasVideo && singleAttUrl && (
                                                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Paperclip className="w-4 h-4 text-amber-700"/>
                                                        <div>
                                                            <span className="font-bold text-slate-800 block truncate max-w-[250px]">
                                                                {selectedAnnouncement.attachment_name || 'Official Attached Document'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={singleAttUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="px-3 py-1.5 rounded-lg bg-amber-700 text-white font-semibold text-xs hover:bg-amber-800 inline-flex items-center space-x-1"
                                                    >
                                                        <span>Open Attachment</span>
                                                        <ExternalLink className="w-3 h-3"/>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setIsDetailModalOpen(false)} 
                                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};
