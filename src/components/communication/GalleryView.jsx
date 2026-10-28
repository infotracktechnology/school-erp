import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
    Image as ImageIcon, Plus, Search, Trash2, Edit2, Eye, Camera, Film, X, Loader2, 
    ChevronLeft, ChevronRight, Download, Users, Layers, CheckCircle2, CheckSquare, 
    Square, Calendar, Paperclip, UploadCloud, Link as LinkIcon
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { getAcademicGroups } from '../../services/api';

export const GalleryView = ({ branchId, academicYearId, classes = [], sections = [], showToast }) => {
    const [albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Active Album Mode (Viewing an album's photos & videos)
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [albumMedia, setAlbumMedia] = useState([]);
    const [isLoadingMedia, setIsLoadingMedia] = useState(false);

    // Lightbox modal state
    const [lightboxIndex, setLightboxIndex] = useState(null);

    // Create/Edit Album Modal
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [isSubmittingAlbum, setIsSubmittingAlbum] = useState(false);

    // Add Media Modal (Manual Photo/Video link into open album)
    const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
    const [newMediaType, setNewMediaType] = useState('Photo');
    const [newMediaUrl, setNewMediaUrl] = useState('');
    const [newMediaTitle, setNewMediaTitle] = useState('');
    const [newMediaCaption, setNewMediaCaption] = useState('');
    const [isSubmittingMedia, setIsSubmittingMedia] = useState(false);

    // Album Form State
    const [formAlbumName, setFormAlbumName] = useState('');
    const [formEventName, setFormEventName] = useState('');
    const [formEventDate, setFormEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [formDescription, setFormDescription] = useState('');
    const [formStatus, setFormStatus] = useState('Published');

    // Audience / Visibility Scope (Identical to AnnouncementView)
    const [formVisibility, setFormVisibility] = useState('All');
    const [formClassId, setFormClassId] = useState('');
    const [formSectionId, setFormSectionId] = useState('');

    // Academic Groups
    const [academicGroupsList, setAcademicGroupsList] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [formGroupId, setFormGroupId] = useState('');
    const [formGroupName, setFormGroupName] = useState('');

    // Multi-Select for Individual Students: Classes, Sections, Students
    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState([]);
    const [studentsPool, setStudentsPool] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [isLoadingStudentsPool, setIsLoadingStudentsPool] = useState(false);
    const [studentSearchText, setStudentSearchText] = useState('');

    // Gender & Residential
    const [formGender, setFormGender] = useState('');
    const [formResidential, setFormResidential] = useState('');

    // Schedule Checkbox & start_at
    const [isScheduled, setIsScheduled] = useState(false);
    const [formStartAt, setFormStartAt] = useState('');

    // Attachments Toggle (Cover Image + Multiple Links + Direct Media Photos)
    const [hasAttachments, setHasAttachments] = useState(false);
    const [imageFileObj, setImageFileObj] = useState(null); // { name, url, size }
    const [uploadingImage, setUploadingImage] = useState(false);
    const [linksList, setLinksList] = useState([]); // [{ id, url, title }]
    const imageInputRef = useRef(null);

    // Direct Album Media Uploads in Create/Edit Modal
    const [modalMediaList, setModalMediaList] = useState([]); // Array of { id, media_url, title, caption, isNew, isExisting }
    const [uploadingMediaBatch, setUploadingMediaBatch] = useState(false);
    const batchMediaInputRef = useRef(null);

    // Edit Media Item Modal (when browsing media inside album)
    const [isEditMediaModalOpen, setIsEditMediaModalOpen] = useState(false);
    const [editingMediaItem, setEditingMediaItem] = useState(null);
    const [editMediaTitle, setEditMediaTitle] = useState('');
    const [editMediaCaption, setEditMediaCaption] = useState('');
    const [editMediaUrl, setEditMediaUrl] = useState('');
    const [isUpdatingMediaItem, setIsUpdatingMediaItem] = useState(false);
    const editMediaFileRef = useRef(null);
    const [uploadingEditFile, setUploadingEditFile] = useState(false);

    // 1. Fetch Academic Groups
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
        if (formVisibility === 'Academic Group') {
            fetchGroups();
        }
    }, [formVisibility, fetchGroups]);

    // 2. Available Sections for Multi-Select based on selectedClassIds
    const availableSectionsMulti = useMemo(() => {
        if (!selectedClassIds || selectedClassIds.length === 0) return [];
        const classIdSet = new Set(selectedClassIds.map(Number));
        return (sections || []).filter(s => classIdSet.has(Number(s.class_id)));
    }, [selectedClassIds, sections]);

    // 3. Fetch Students pool when selectedClassIds or selectedSectionIds change in Multi-Select mode
    useEffect(() => {
        if (formVisibility === 'Individual' && selectedClassIds.length > 0) {
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
                if (selectedSectionIds.length > 0) {
                    const secSet = new Set(selectedSectionIds.map(Number));
                    combined = combined.filter(st => secSet.has(Number(st.section_id || st.current_section_id)));
                }
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
    }, [formVisibility, selectedClassIds, selectedSectionIds, branchId]);

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

    // 4. Fetch Albums
    const fetchAlbums = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await communicationService.getAlbums({
                branch_id: branchId,
                academic_year_id: academicYearId,
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
                search: searchQuery.trim() || undefined
            });
            setAlbums(data);
        }
        catch (err) {
            showToast(err.message || 'Failed to fetch gallery albums', 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, selectedStatus, searchQuery, showToast]);

    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums]);

    // Open Album Media Viewer
    const handleOpenAlbumDetails = async (album) => {
        setActiveAlbum(album);
        setIsLoadingMedia(true);
        try {
            const data = await communicationService.getAlbumDetails(album.id);
            setAlbumMedia(data.media || []);
        }
        catch (err) {
            showToast(err.message || 'Failed to load album media', 'error');
        }
        finally {
            setIsLoadingMedia(false);
        }
    };

    // Helper: Reset modal state for new album
    const handleOpenCreateAlbum = () => {
        setEditingAlbum(null);
        setFormAlbumName('');
        setFormEventName('');
        setFormEventDate(new Date().toISOString().split('T')[0]);
        setFormDescription('');
        setFormStatus('Published');

        setFormVisibility('All');
        setFormClassId('');
        setFormSectionId('');
        setFormGroupId('');
        setFormGroupName('');
        setSelectedClassIds([]);
        setSelectedSectionIds([]);
        setSelectedStudentIds([]);
        setStudentsPool([]);
        setStudentSearchText('');
        setFormGender('');
        setFormResidential('');

        setIsScheduled(false);
        setFormStartAt('');

        setHasAttachments(false);
        setImageFileObj(null);
        setLinksList([]);
        setModalMediaList([]);

        setIsAlbumModalOpen(true);
    };

    // Helper: Open Edit Modal
    const handleOpenEditAlbum = async (alb) => {
        setEditingAlbum(alb);
        setFormAlbumName(alb.album_name || '');
        setFormEventName(alb.event_name || '');
        setFormEventDate(alb.event_date || new Date().toISOString().split('T')[0]);
        setFormDescription(alb.description || '');
        setFormStatus(alb.status || 'Published');

        setFormVisibility(alb.visibility || 'All');
        setFormClassId(alb.target_class_id ? String(alb.target_class_id) : '');
        setFormSectionId(alb.target_section_id ? String(alb.target_section_id) : '');
        setFormGroupId(alb.target_group_id ? String(alb.target_group_id) : '');
        setFormGroupName(alb.target_group_name || '');

        // Parse student ids if multi
        if (alb.target_student_ids) {
            try {
                const ids = JSON.parse(alb.target_student_ids);
                setSelectedStudentIds(Array.isArray(ids) ? ids : []);
            } catch (e) {
                setSelectedStudentIds(alb.target_student_id ? [alb.target_student_id] : []);
            }
        } else if (alb.target_student_id) {
            setSelectedStudentIds([alb.target_student_id]);
        } else {
            setSelectedStudentIds([]);
        }

        // Parse class ids
        if (alb.target_class_ids) {
            try {
                const cIds = JSON.parse(alb.target_class_ids);
                setSelectedClassIds(Array.isArray(cIds) ? cIds : []);
            } catch (e) {
                setSelectedClassIds(alb.target_class_id ? [alb.target_class_id] : []);
            }
        } else if (alb.target_class_id) {
            setSelectedClassIds([alb.target_class_id]);
        } else {
            setSelectedClassIds([]);
        }

        // Parse section ids
        if (alb.target_section_ids) {
            try {
                const sIds = JSON.parse(alb.target_section_ids);
                setSelectedSectionIds(Array.isArray(sIds) ? sIds : []);
            } catch (e) {
                setSelectedSectionIds(alb.target_section_id ? [alb.target_section_id] : []);
            }
        } else if (alb.target_section_id) {
            setSelectedSectionIds([alb.target_section_id]);
        } else {
            setSelectedSectionIds([]);
        }

        setFormGender(alb.target_gender || '');
        setFormResidential(alb.target_residential_type || '');

        const scheduled = Boolean(alb.is_scheduled || alb.status === 'Scheduled');
        setIsScheduled(scheduled);
        setFormStartAt(alb.start_at ? alb.start_at.slice(0, 16) : '');

        // Parse attachments
        let atts = alb.attachments;
        if (typeof atts === 'string') {
            try { atts = JSON.parse(atts); } catch(e) { atts = null; }
        }
        if (atts && (atts.image || (atts.links && atts.links.length > 0))) {
            setHasAttachments(true);
            setImageFileObj(atts.image || null);
            setLinksList(Array.isArray(atts.links) ? atts.links : []);
        } else if (alb.cover_image_url) {
            setHasAttachments(true);
            setImageFileObj({ name: 'Cover Image', url: alb.cover_image_url });
            setLinksList([]);
        } else {
            setHasAttachments(false);
            setImageFileObj(null);
            setLinksList([]);
        }

        // Load existing media for this album so user can see & manage them right here in the modal!
        try {
            const details = await communicationService.getAlbumDetails(alb.id);
            const existingMedia = (details.media || []).map(m => ({
                id: m.id,
                media_url: m.media_url,
                title: m.title || '',
                caption: m.caption || '',
                isExisting: true
            }));
            setModalMediaList(existingMedia);
        } catch (e) {
            setModalMediaList([]);
        }

        setIsAlbumModalOpen(true);
    };

    // File upload for Image (File only)
    const handleImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        setUploadingImage(true);
        reader.onload = async () => {
            try {
                const base64Data = reader.result;
                const res = await communicationService.uploadAttachment(file.name, base64Data);
                if (res.success && res.url) {
                    setImageFileObj({
                        name: file.name,
                        url: res.url,
                        size: (file.size / 1024).toFixed(1) + ' KB'
                    });
                    // Also auto-add to modalMediaList so it is saved as an album photo
                    setModalMediaList(prev => {
                        if (prev.some(m => m.media_url === res.url)) return prev;
                        return [
                            {
                                id: 'cover_' + Date.now(),
                                media_url: res.url,
                                title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
                                caption: 'Cover Photo',
                                isNew: true
                            },
                            ...prev
                        ];
                    });
                    showToast('Cover photo updated and added to album', 'success');
                } else {
                    showToast('Failed to upload image file', 'error');
                }
            } catch (err) {
                showToast(err.message || 'Image upload failed', 'error');
            } finally {
                setUploadingImage(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Batch Upload for Multiple Media Photos directly in Create/Edit Album Modal
    const handleBatchMediaUpload = async (files) => {
        if (!files || files.length === 0) return;
        setUploadingMediaBatch(true);
        const filesArray = Array.from(files);
        let successCount = 0;

        for (const file of filesArray) {
            try {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const res = await communicationService.uploadAttachment(file.name, base64);
                if (res.success && res.url) {
                    const cleanTitle = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    setModalMediaList(prev => {
                        const next = [
                            ...prev,
                            {
                                id: 'temp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                                media_url: res.url,
                                title: cleanTitle,
                                caption: '',
                                isNew: true
                            }
                        ];
                        return next;
                    });

                    // Automatically set first uploaded photo as Cover photo if cover is not chosen yet!
                    setImageFileObj(curr => {
                        if (!curr) {
                            setHasAttachments(true);
                            return {
                                name: cleanTitle,
                                url: res.url,
                                size: (file.size / 1024).toFixed(1) + ' KB'
                            };
                        }
                        return curr;
                    });

                    successCount++;
                }
            } catch (err) {
                console.error('Failed to upload photo file:', file.name, err);
            }
        }

        setUploadingMediaBatch(false);
        if (successCount > 0) {
            showToast(`${successCount} photo(s) uploaded successfully`, 'success');
        } else {
            showToast('Failed to upload photos', 'error');
        }
    };

    const handleRemoveModalMediaItem = (item) => {
        if (item.isExisting) {
            // Delete from database directly if it's already an existing media item
            if (window.confirm('Delete this photo from the album?')) {
                communicationService.deleteMediaItem(item.id)
                    .then(() => {
                        setModalMediaList(prev => prev.filter(m => m.id !== item.id));
                        showToast('Photo removed from album', 'success');
                        fetchAlbums();
                    })
                    .catch(err => showToast(err.message || 'Failed to delete photo', 'error'));
            }
        } else {
            setModalMediaList(prev => prev.filter(m => m.id !== item.id));
        }
    };

    const handleSetAsCoverPhoto = (mediaUrl, title) => {
        setImageFileObj({
            name: title || 'Cover Photo',
            url: mediaUrl,
            size: ''
        });
        setHasAttachments(true);
        showToast('Selected photo set as album cover', 'success');
    };

    // Open Edit Media Modal (inside open album)
    const handleOpenEditMediaModal = (m) => {
        setEditingMediaItem(m);
        setEditMediaTitle(m.title || '');
        setEditMediaCaption(m.caption || '');
        setEditMediaUrl(m.media_url || '');
        setIsEditMediaModalOpen(true);
    };

    // Replace image file in Edit Media Modal
    const handleReplaceMediaFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        setUploadingEditFile(true);
        reader.onload = async () => {
            try {
                const base64Data = reader.result;
                const res = await communicationService.uploadAttachment(file.name, base64Data);
                if (res.success && res.url) {
                    setEditMediaUrl(res.url);
                    showToast('Picture uploaded and replaced', 'success');
                } else {
                    showToast('Failed to replace picture', 'error');
                }
            } catch (err) {
                showToast(err.message || 'Upload failed', 'error');
            } finally {
                setUploadingEditFile(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Save Updated Media Item
    const handleSaveMediaItem = async (e) => {
        e.preventDefault();
        if (!editingMediaItem || !editMediaUrl.trim()) {
            showToast('Please provide a picture or URL', 'error');
            return;
        }

        setIsUpdatingMediaItem(true);
        try {
            await communicationService.updateMediaItem(editingMediaItem.id, {
                title: editMediaTitle.trim(),
                caption: editMediaCaption.trim(),
                media_url: editMediaUrl.trim()
            });
            showToast('Photo updated successfully', 'success');
            setIsEditMediaModalOpen(false);

            if (activeAlbum) {
                const refreshed = await communicationService.getAlbumDetails(activeAlbum.id);
                setAlbumMedia(refreshed.media || []);
            }
            fetchAlbums();
        } catch (err) {
            showToast(err.message || 'Failed to update photo', 'error');
        } finally {
            setIsUpdatingMediaItem(false);
        }
    };

    // Multiple Links Helpers
    const handleAddLink = () => {
        setLinksList(prev => [...prev, { id: Date.now(), url: '', title: '' }]);
    };

    const handleUpdateLink = (id, field, value) => {
        setLinksList(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const handleRemoveLink = (id) => {
        setLinksList(prev => prev.filter(l => l.id !== id));
    };

    // Multi-Select helpers
    const toggleClassSelection = (cId) => {
        setSelectedClassIds(prev => {
            const next = prev.includes(cId) ? prev.filter(id => id !== cId) : [...prev, cId];
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

    // Save Album Handler
    const handleSaveAlbum = async (e) => {
        e.preventDefault();
        if (!formAlbumName.trim() || !formEventName.trim()) {
            showToast('Please enter album name and event name', 'error');
            return;
        }

        if (formVisibility === 'Class' && !formClassId) {
            showToast('Please select a target class', 'error');
            return;
        }
        if (formVisibility === 'Section' && (!formClassId || !formSectionId)) {
            showToast('Please select target class and section', 'error');
            return;
        }
        if (formVisibility === 'Academic Group' && !formGroupId) {
            showToast('Please select an academic group', 'error');
            return;
        }
        if (formVisibility === 'Individual' && selectedStudentIds.length === 0) {
            showToast('Please select at least one student for Individual scope', 'error');
            return;
        }
        if (formVisibility === 'Gender' && !formGender) {
            showToast('Please select target gender', 'error');
            return;
        }
        if (formVisibility === 'Residential' && !formResidential) {
            showToast('Please select residential category', 'error');
            return;
        }

        if (isScheduled && !formStartAt) {
            showToast('Please select schedule release date and time', 'error');
            return;
        }

        setIsSubmittingAlbum(true);
        try {
            const finalStatus = isScheduled ? 'Scheduled' : formStatus;

            // Student summary
            let studentNameSummary = null;
            if (formVisibility === 'Individual') {
                if (selectedStudentIds.length === 1) {
                    const st = studentsPool.find(s => s.id === selectedStudentIds[0]);
                    studentNameSummary = st ? `${st.first_name || ''} ${st.last_name || ''}`.trim() : `Student #${selectedStudentIds[0]}`;
                } else {
                    studentNameSummary = `${selectedStudentIds.length} Selected Students`;
                }
            }

            // Attachments payload: image file + multiple links
            let attachmentsPayload = null;
            const validLinks = linksList.filter(l => l.url.trim().length > 0);
            if (hasAttachments && (imageFileObj || validLinks.length > 0)) {
                attachmentsPayload = {
                    image: imageFileObj || null,
                    links: validLinks
                };
            }

            const coverUrl = imageFileObj?.url 
                || (modalMediaList.length > 0 ? modalMediaList[0].media_url : null) 
                || editingAlbum?.cover_image_url 
                || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80';

            const payload = {
                organization_id: 1,
                branch_id: branchId,
                academic_year_id: academicYearId,
                album_name: formAlbumName.trim(),
                event_name: formEventName.trim(),
                event_date: formEventDate,
                description: formDescription.trim(),
                cover_image_url: coverUrl,
                visibility: formVisibility,
                target_class_id: formVisibility === 'Class' && formClassId ? Number(formClassId) : (selectedClassIds[0] || null),
                target_section_id: formVisibility === 'Section' && formSectionId ? Number(formSectionId) : (selectedSectionIds[0] || null),
                target_group_id: formVisibility === 'Academic Group' && formGroupId ? Number(formGroupId) : null,
                target_group_name: formVisibility === 'Academic Group' ? formGroupName : null,
                target_student_id: formVisibility === 'Individual' && selectedStudentIds.length === 1 ? selectedStudentIds[0] : null,
                target_student_name: studentNameSummary,
                target_student_ids: formVisibility === 'Individual' ? JSON.stringify(selectedStudentIds) : null,
                target_class_ids: ['Individual', 'Gender', 'Residential'].includes(formVisibility) && selectedClassIds.length > 0 ? JSON.stringify(selectedClassIds) : null,
                target_section_ids: ['Individual', 'Gender', 'Residential'].includes(formVisibility) && selectedSectionIds.length > 0 ? JSON.stringify(selectedSectionIds) : null,
                target_gender: formVisibility === 'Gender' ? formGender : null,
                target_residential_type: formVisibility === 'Residential' ? formResidential : null,
                is_scheduled: isScheduled ? 1 : 0,
                start_at: isScheduled && formStartAt ? formStartAt : null,
                attachments: attachmentsPayload,
                status: finalStatus
            };

            // Combine all new media: modalMediaList + cover photo (if not already included) + links
            let combinedMediaList = [...modalMediaList.filter(m => m.isNew)];
            if (imageFileObj?.url && !modalMediaList.some(m => m.media_url === imageFileObj.url)) {
                combinedMediaList.unshift({
                    media_url: imageFileObj.url,
                    title: imageFileObj.name || formEventName || formAlbumName || 'Cover Photo',
                    caption: formDescription || '',
                    isNew: true
                });
            }

            for (const link of validLinks) {
                if (link.url && !combinedMediaList.some(m => m.media_url === link.url)) {
                    combinedMediaList.push({
                        media_url: link.url,
                        title: link.title || 'Media Link',
                        caption: link.title || '',
                        isNew: true
                    });
                }
            }

            const newMediaToUpload = combinedMediaList.map((m, idx) => ({
                media_type: (m.media_url && (m.media_url.includes('youtube') || m.media_url.includes('vimeo') || m.media_url.endsWith('.mp4'))) ? 'Video' : 'Photo',
                media_url: m.media_url,
                title: m.title || undefined,
                caption: m.caption || undefined,
                display_order: idx + 1
            }));

            if (editingAlbum) {
                payload.new_media = newMediaToUpload;
                await communicationService.updateAlbum(editingAlbum.id, payload);
                showToast('Gallery album updated successfully', 'success');
            } else {
                payload.initial_media = newMediaToUpload;
                await communicationService.createAlbum(payload);
                showToast('Gallery album created successfully with uploaded photos', 'success');
            }
            setIsAlbumModalOpen(false);
            fetchAlbums();
            if (activeAlbum && editingAlbum && activeAlbum.id === editingAlbum.id) {
                const refreshed = await communicationService.getAlbumDetails(activeAlbum.id);
                setAlbumMedia(refreshed.media || []);
            }
        }
        catch (err) {
            showToast(err.message || 'Failed to save album', 'error');
        }
        finally {
            setIsSubmittingAlbum(false);
        }
    };

    const handleDeleteAlbum = async (id) => {
        if (!window.confirm('Are you sure you want to delete this album and all uploaded media?'))
            return;
        try {
            await communicationService.deleteAlbum(id);
            showToast('Album deleted successfully', 'success');
            if (activeAlbum && activeAlbum.id === id) {
                setActiveAlbum(null);
            }
            fetchAlbums();
        }
        catch (err) {
            showToast(err.message || 'Failed to delete album', 'error');
        }
    };

    const handleAddMedia = async (e) => {
        e.preventDefault();
        if (!activeAlbum || !newMediaUrl.trim()) {
            showToast('Please enter media file URL', 'error');
            return;
        }
        setIsSubmittingMedia(true);
        try {
            await communicationService.addMediaToAlbum(activeAlbum.id, [
                {
                    media_type: newMediaType,
                    media_url: newMediaUrl.trim(),
                    title: newMediaTitle.trim() || undefined,
                    caption: newMediaCaption.trim() || undefined,
                    display_order: albumMedia.length + 1
                }
            ]);
            showToast('Media added to album', 'success');
            setNewMediaUrl('');
            setNewMediaTitle('');
            setNewMediaCaption('');
            setIsAddMediaModalOpen(false);
            const refreshed = await communicationService.getAlbumDetails(activeAlbum.id);
            setAlbumMedia(refreshed.media || []);
            fetchAlbums();
        }
        catch (err) {
            showToast(err.message || 'Failed to add media item', 'error');
        }
        finally {
            setIsSubmittingMedia(false);
        }
    };

    const handleDeleteMediaItem = async (mediaId) => {
        if (!window.confirm('Delete this photo/video from album?'))
            return;
        try {
            await communicationService.deleteMediaItem(mediaId);
            showToast('Media removed', 'success');
            if (activeAlbum) {
                const refreshed = await communicationService.getAlbumDetails(activeAlbum.id);
                setAlbumMedia(refreshed.media || []);
            }
            fetchAlbums();
        }
        catch (err) {
            showToast(err.message || 'Failed to delete media', 'error');
        }
    };

    return (
        <div className="space-y-5">
            {/* If Active Album is opened, render album viewer */}
            {activeAlbum ? (
                <div className="space-y-4">
                    {/* Back button & Album Title */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center space-x-3">
                            <button 
                                type="button" 
                                onClick={() => setActiveAlbum(null)} 
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5"/>
                            </button>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 uppercase">
                                        {activeAlbum.visibility} Visibility
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">Event: {activeAlbum.event_name}</span>
                                </div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                                    {activeAlbum.album_name}
                                </h2>
                                <p className="text-xs text-slate-500">{activeAlbum.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <button 
                                type="button" 
                                onClick={() => setIsAddMediaModalOpen(true)} 
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 transition-colors shadow-xs cursor-pointer"
                            >
                                <Plus className="w-4 h-4"/>
                                <span>Add Photos / Videos</span>
                            </button>
                        </div>
                    </div>

                    {/* Media Grid */}
                    {isLoadingMedia ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2">
                            <Loader2 className="w-7 h-7 text-rose-700 animate-spin mx-auto"/>
                            <p className="text-xs text-slate-500">Loading album photographs and videos...</p>
                        </div>
                    ) : albumMedia.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mx-auto">
                                <Camera className="w-6 h-6"/>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">Album is Empty</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Upload celebration photos, award ceremony clips, or sports day pictures for this album.
                            </p>
                            <button 
                                type="button" 
                                onClick={() => setIsAddMediaModalOpen(true)} 
                                className="px-4 py-2 rounded-xl bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 transition-colors cursor-pointer"
                            >
                                Upload First Photo
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {albumMedia.map((m, idx) => (
                                <div key={m.id} className="group relative bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col">
                                    <div onClick={() => setLightboxIndex(idx)} className="relative aspect-4/3 bg-slate-900 cursor-pointer overflow-hidden">
                                        <img 
                                            src={m.media_url} 
                                            alt={m.title || 'Album Photo'} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {m.media_type === 'Video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <Film className="w-8 h-8 text-white drop-shadow-md"/>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                                            <span className="text-white text-xs font-semibold flex items-center space-x-1">
                                                <Eye className="w-3.5 h-3.5"/>
                                                <span>Click to expand</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-2.5 flex items-center justify-between text-xs">
                                        <div className="truncate pr-2">
                                            <p className="font-bold text-slate-800 truncate">{m.title || 'School Memory'}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{m.caption || activeAlbum.event_name}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 shrink-0">
                                            <button 
                                                type="button" 
                                                onClick={() => handleOpenEditMediaModal(m)} 
                                                title="Edit Picture & Details" 
                                                className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                                            >
                                                <Edit2 className="w-3.5 h-3.5"/>
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteMediaItem(m.id)} 
                                                title="Delete Photo" 
                                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Albums Overview Mode */
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center space-x-2">
                            <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
                                <ImageIcon className="w-5 h-5"/>
                            </span>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900">Event & Activity Gallery</h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Branch-wise media archives, annual day captures, sports meets, and targeted event albums
                                </p>
                            </div>
                        </div>
                        <button 
                            id="btn-create-new-album" 
                            type="button" 
                            onClick={handleOpenCreateAlbum} 
                            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                            <Plus className="w-4 h-4"/>
                            <span>Create New Album</span>
                        </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400"/>
                            <input 
                                type="text" 
                                placeholder="Search event album name..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)} 
                                className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Published">Published</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Album Grid */}
                    {isLoading ? (
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="w-7 h-7 text-rose-700 animate-spin"/>
                            <p className="text-xs font-semibold text-slate-600">Loading albums...</p>
                        </div>
                    ) : albums.length === 0 ? (
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                                <ImageIcon className="w-6 h-6"/>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">No Albums Created Yet</h3>
                            <p className="text-xs text-slate-500 max-w-sm">
                                Create a digital album to share event photographs with parents and students in this branch.
                            </p>
                            <button 
                                type="button" 
                                onClick={handleOpenCreateAlbum} 
                                className="px-4 py-2 rounded-xl bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 transition-colors shadow-xs cursor-pointer"
                            >
                                Create First Album
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {albums.map((alb) => {
                                let scopeDisplay = alb.visibility || 'All';
                                if (alb.visibility === 'Individual') {
                                    scopeDisplay = alb.target_student_name || 'Individual Student';
                                } else if (alb.visibility === 'Academic Group') {
                                    scopeDisplay = `Group: ${alb.target_group_name || 'Academic Group'}`;
                                } else if (alb.visibility === 'Class') {
                                    scopeDisplay = alb.class_name ? `Class ${alb.class_name}` : 'Specific Class';
                                } else if (alb.visibility === 'Section') {
                                    scopeDisplay = `${alb.class_name || 'Class'} • Sec ${alb.section_name || 'Section'}`;
                                } else if (alb.visibility === 'Gender') {
                                    const g = alb.target_gender === 'Male' ? 'Boys' : alb.target_gender === 'Female' ? 'Girls' : (alb.target_gender || 'Gender');
                                    let clsCnt = '';
                                    if (alb.target_class_ids) {
                                        try {
                                            const c = JSON.parse(alb.target_class_ids);
                                            if (c.length) clsCnt = ` (${c.length} Cls)`;
                                        } catch(e) {}
                                    }
                                    scopeDisplay = `Gender: ${g}${clsCnt}`;
                                } else if (alb.visibility === 'Residential') {
                                    const r = alb.target_residential_type || 'Residential';
                                    let clsCnt = '';
                                    if (alb.target_class_ids) {
                                        try {
                                            const c = JSON.parse(alb.target_class_ids);
                                            if (c.length) clsCnt = ` (${c.length} Cls)`;
                                        } catch(e) {}
                                    }
                                    scopeDisplay = `Residential: ${r}${clsCnt}`;
                                }

                                // Attachments check
                                let atts = alb.attachments;
                                if (typeof atts === 'string') {
                                    try { atts = JSON.parse(atts); } catch(e) { atts = null; }
                                }
                                const hasLinks = atts?.links && atts.links.length > 0;
                                const isAlbScheduled = alb.is_scheduled || alb.status === 'Scheduled';

                                return (
                                    <div 
                                        key={alb.id} 
                                        className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                                    >
                                        <div onClick={() => handleOpenAlbumDetails(alb)} className="relative aspect-16/9 bg-slate-100 overflow-hidden cursor-pointer">
                                            <img 
                                                src={alb.cover_image_url || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80'} 
                                                alt={alb.album_name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1">
                                                <Camera className="w-3 h-3"/>
                                                <span>{alb.media_count || 0} Media</span>
                                            </div>

                                            {isAlbScheduled ? (
                                                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-indigo-600/90 text-white text-[10px] font-bold tracking-wide uppercase">
                                                    Scheduled
                                                </div>
                                            ) : null}

                                            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold">
                                                {alb.event_date}
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] text-rose-700 font-bold tracking-wide uppercase">
                                                    <span>{alb.event_name}</span>
                                                    <span className="text-slate-500 font-medium normal-case bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                                                        {scopeDisplay}
                                                    </span>
                                                </div>
                                                <h3 
                                                    onClick={() => handleOpenAlbumDetails(alb)} 
                                                    className="text-sm font-bold text-slate-900 mt-1 hover:text-rose-700 cursor-pointer line-clamp-1"
                                                >
                                                    {alb.album_name}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {alb.description || 'No description provided for this album.'}
                                                </p>
                                            </div>

                                            {/* External Attached Links preview */}
                                            {hasLinks && (
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {atts.links.map((lnk, lIdx) => (
                                                        <a 
                                                            key={lnk.id || lIdx}
                                                            href={lnk.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                                                        >
                                                            <LinkIcon className="w-3 h-3" />
                                                            <span className="truncate max-w-[110px]">{lnk.title || 'Attached Link'}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleOpenAlbumDetails(alb)} 
                                                    className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center space-x-1 cursor-pointer"
                                                >
                                                    <span>Open Album</span>
                                                    <ChevronRight className="w-3.5 h-3.5"/>
                                                </button>

                                                <div className="flex items-center space-x-1">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleOpenEditAlbum(alb)} 
                                                        title="Edit Album Information" 
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5"/>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleDeleteAlbum(alb.id)} 
                                                        title="Delete Album" 
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Lightbox Modal */}
            {lightboxIndex !== null && albumMedia[lightboxIndex] && (
                <div className="fixed inset-0 z-70 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-white text-xs px-4 py-2">
                        <div>
                            <span className="font-bold">
                                {albumMedia[lightboxIndex].title || activeAlbum?.album_name}
                            </span>
                            <span className="text-slate-400 ml-2">
                                ({lightboxIndex + 1} of {albumMedia.length})
                            </span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <a 
                                href={albumMedia[lightboxIndex].media_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                download 
                                className="p-2 rounded-full hover:bg-white/20 transition-colors" 
                                title="Download original image"
                            >
                                <Download className="w-5 h-5 text-white"/>
                            </a>
                            <button 
                                type="button" 
                                onClick={() => setLightboxIndex(null)} 
                                className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5 text-white"/>
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 flex items-center justify-center p-2 min-h-0">
                        {lightboxIndex > 0 && (
                            <button 
                                type="button" 
                                onClick={() => setLightboxIndex((prev) => (prev !== null ? prev - 1 : null))} 
                                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer transition-all"
                            >
                                <ChevronLeft className="w-6 h-6"/>
                            </button>
                        )}

                        <img 
                            src={albumMedia[lightboxIndex].media_url} 
                            alt={albumMedia[lightboxIndex].title || 'Expanded media'} 
                            className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                        />

                        {lightboxIndex < albumMedia.length - 1 && (
                            <button 
                                type="button" 
                                onClick={() => setLightboxIndex((prev) => (prev !== null ? prev + 1 : null))} 
                                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer transition-all"
                            >
                                <ChevronRight className="w-6 h-6"/>
                            </button>
                        )}
                    </div>

                    <div className="text-center text-xs text-slate-300 py-2">
                        {albumMedia[lightboxIndex].caption || activeAlbum?.event_name}
                    </div>
                </div>
            )}

            {/* Add Media Modal */}
            {isAddMediaModalOpen && activeAlbum && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-2 rounded-xl bg-rose-100 text-rose-800">
                                    <Camera className="w-5 h-5"/>
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Add Media to Album</h3>
                                    <p className="text-[11px] text-slate-500">{activeAlbum.album_name}</p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsAddMediaModalOpen(false)} 
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>

                        <form onSubmit={handleAddMedia} className="p-5 space-y-4 text-xs">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Media Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setNewMediaType('Photo')} 
                                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                                            newMediaType === 'Photo'
                                                ? 'border-rose-500 bg-rose-50 text-rose-800'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Camera className="w-4 h-4"/>
                                        <span>Photograph</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setNewMediaType('Video')} 
                                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                                            newMediaType === 'Video'
                                                ? 'border-rose-500 bg-rose-50 text-rose-800'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Film className="w-4 h-4"/>
                                        <span>Video Link</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Image or Video URL <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="url" 
                                    required 
                                    placeholder="https://images.unsplash.com/... or video link" 
                                    value={newMediaUrl} 
                                    onChange={(e) => setNewMediaUrl(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Tag</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 100m Dash Sprint Finals" 
                                    value={newMediaTitle} 
                                    onChange={(e) => setNewMediaTitle(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Caption / Notes</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Under-14 athletic contenders crossing the finish line" 
                                    value={newMediaCaption} 
                                    onChange={(e) => setNewMediaCaption(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddMediaModalOpen(false)} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmittingMedia} 
                                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-rose-700 text-white hover:bg-rose-800 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                                >
                                    {isSubmittingMedia ? 'Saving...' : 'Add to Album'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create / Edit Album Modal */}
            {isAlbumModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-2 rounded-xl bg-rose-100 text-rose-800">
                                    <ImageIcon className="w-5 h-5"/>
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {editingAlbum ? 'Edit Gallery Album' : 'Create New Event Album'}
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Targeted media album for celebrations, sports meets, and student activities
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsAlbumModalOpen(false)} 
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>

                        <form onSubmit={handleSaveAlbum} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Album Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. Annual Sports Day 2026" 
                                        value={formAlbumName} 
                                        onChange={(e) => setFormAlbumName(e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Event Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. Inter-House Athletics Meet" 
                                        value={formEventName} 
                                        onChange={(e) => setFormEventName(e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={formEventDate} 
                                        onChange={(e) => setFormEventDate(e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Visibility / Audience Scope <span className="text-rose-500">*</span>
                                    </label>
                                    <select 
                                        value={formVisibility} 
                                        onChange={(e) => setFormVisibility(e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                    >
                                        <option value="All">All Students & Parents in Branch</option>
                                        <option value="Class">Class-wise</option>
                                        <option value="Section">Section-wise</option>
                                        <option value="Academic Group">Academic Group</option>
                                        <option value="Individual">Individual Student (Multi-Select)</option>
                                        <option value="Gender">Gender-wise (Boys / Girls)</option>
                                        <option value="Residential">Residential (Day Scholar / Hostel)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Conditional: Academic Group */}
                            {formVisibility === 'Academic Group' && (
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
                            {formVisibility === 'Class' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Select Target Class <span className="text-rose-500">*</span>
                                    </label>
                                    <select 
                                        value={formClassId} 
                                        onChange={(e) => setFormClassId(e.target.value)} 
                                        required
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                            {formVisibility === 'Section' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Target Class <span className="text-rose-500">*</span>
                                        </label>
                                        <select 
                                            value={formClassId} 
                                            onChange={(e) => {
                                                setFormClassId(e.target.value);
                                                setFormSectionId('');
                                            }} 
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
                            {formVisibility === 'Individual' && (
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

                                    {/* 3. Students Search & Multi-Select Checklist */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <div className="relative flex-1">
                                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Search student name or admission #..." 
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

                            {/* Conditional: Gender-wise Scope with Class & Section Filters */}
                            {formVisibility === 'Gender' && (
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
                                                    className="text-[10px] text-sky-600 font-semibold hover:underline cursor-pointer"
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
                                                        className="text-[10px] text-sky-600 font-semibold hover:underline cursor-pointer"
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

                            {/* Conditional: Residential Category with Class & Section Filters */}
                            {formVisibility === 'Residential' && (
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
                                                    className="text-[10px] text-emerald-600 font-semibold hover:underline cursor-pointer"
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
                                                        className="text-[10px] text-emerald-600 font-semibold hover:underline cursor-pointer"
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

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                                <textarea 
                                    rows={3} 
                                    placeholder="Brief note about the event, chief guests, highlights..." 
                                    value={formDescription} 
                                    onChange={(e) => setFormDescription(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
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
                                        className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer" 
                                    />
                                    <span className="text-xs font-bold text-slate-800">
                                        Schedule this Album for Future Publishing
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
                                            className="w-full sm:w-72 px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" 
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            Students and parents will only see this album after this date & time.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Attachments Toggle: Image (File only) + Multiple Links */}
                            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Paperclip className="w-4 h-4 text-rose-700" />
                                        <span className="text-xs font-bold text-slate-800">Album Cover & External Links</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={hasAttachments} 
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setHasAttachments(checked);
                                                if (!checked) {
                                                    setImageFileObj(null);
                                                    setLinksList([]);
                                                }
                                            }} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                                    </label>
                                </div>

                                {hasAttachments && (
                                    <div className="space-y-3 pt-2">
                                        {/* 1. Image File Upload (File only, No URL input) */}
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                                                    <ImageIcon className="w-4 h-4 text-purple-600" />
                                                    <span>Album Cover Image (File upload only)</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, JPEG, WEBP</span>
                                            </div>

                                            <input 
                                                type="file" 
                                                ref={imageInputRef} 
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files[0])} 
                                                className="hidden" 
                                            />

                                            {imageFileObj ? (
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/70 border border-purple-200/60 text-xs">
                                                    <div className="flex items-center space-x-2 truncate">
                                                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                                                        <span className="font-semibold text-purple-900 truncate max-w-[200px]">{imageFileObj.name}</span>
                                                        {imageFileObj.size && <span className="text-[10px] text-purple-500">({imageFileObj.size})</span>}
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
                                                    className="w-full py-2.5 px-3 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-700 hover:border-rose-400 bg-slate-50/50 hover:bg-rose-50/40 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                                >
                                                    {uploadingImage ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                                            <span>Uploading image file...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>Choose Image File from Computer</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* 2. Direct Album Media Uploads (Multiple Photos - No need to go inside later) */}
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                                                    <Camera className="w-4 h-4 text-rose-600" />
                                                    <span>Album Photos & Media (Upload directly - Multi-select)</span>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    disabled={uploadingMediaBatch}
                                                    onClick={() => batchMediaInputRef.current?.click()} 
                                                    className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    {uploadingMediaBatch ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            <span>Uploading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="w-3.5 h-3.5" />
                                                            <span>Upload Photos</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <input 
                                                type="file" 
                                                ref={batchMediaInputRef} 
                                                accept="image/*" 
                                                multiple 
                                                onChange={(e) => {
                                                    handleBatchMediaUpload(e.target.files);
                                                    if (batchMediaInputRef.current) batchMediaInputRef.current.value = '';
                                                }} 
                                                className="hidden" 
                                            />

                                            {modalMediaList.length === 0 ? (
                                                <div 
                                                    onClick={() => batchMediaInputRef.current?.click()} 
                                                    className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50/50 hover:bg-rose-50/40 hover:border-rose-400 cursor-pointer transition-all"
                                                >
                                                    <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                                    <p className="text-xs font-semibold text-slate-600">Select one or multiple photos to upload into this album</p>
                                                    <p className="text-[10px] text-slate-400">You don't have to open the album later to add pictures!</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-0.5">
                                                        <span>{modalMediaList.length} photos in this album:</span>
                                                        <span className="text-[10px] text-slate-400">Click photo to set as cover</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                                                        {modalMediaList.map((item, mIdx) => (
                                                            <div key={item.id || mIdx} className="group relative bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                                                                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                                                                    <img 
                                                                        src={item.media_url} 
                                                                        alt={item.title || 'Photo'} 
                                                                        className="w-full h-full object-cover" 
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                                                                        <button 
                                                                            type="button" 
                                                                            onClick={() => handleSetAsCoverPhoto(item.media_url, item.title)} 
                                                                            title="Make Cover Photo"
                                                                            className="px-1.5 py-1 rounded bg-white text-slate-800 text-[10px] font-bold hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                                                                        >
                                                                            Set Cover
                                                                        </button>
                                                                        <button 
                                                                            type="button" 
                                                                            onClick={() => handleRemoveModalMediaItem(item)} 
                                                                            title="Delete photo"
                                                                            className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="p-1.5 flex items-center justify-between text-[10px]">
                                                                    <span className="font-semibold text-slate-700 truncate max-w-[90px]">{item.title || `Photo #${mIdx + 1}`}</span>
                                                                    {item.isNew && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">New</span>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. Multiple Links (Add / Remove dynamic list) */}
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                                                    <LinkIcon className="w-4 h-4 text-emerald-600" />
                                                    <span>Web & Resource Links (Multiple Links)</span>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={handleAddLink} 
                                                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Add Link</span>
                                                </button>
                                            </div>

                                            {linksList.length === 0 ? (
                                                <p className="text-[11px] text-slate-400 italic py-1">
                                                    No external links added. Click "+ Add Link" to attach Google Drive, YouTube, or event page URLs.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {linksList.map((item, idx) => (
                                                        <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Link Title (e.g. Full Album Drive)" 
                                                                value={item.title} 
                                                                onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)} 
                                                                className="w-1/3 px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-emerald-500" 
                                                            />
                                                            <input 
                                                                type="url" 
                                                                required 
                                                                placeholder="https://drive.google.com/... or https://youtu.be/..." 
                                                                value={item.url} 
                                                                onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)} 
                                                                className="flex-1 px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-emerald-500" 
                                                            />
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleRemoveLink(item.id)} 
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                                                title="Remove link"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAlbumModalOpen(false)} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmittingAlbum} 
                                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-rose-700 text-white hover:bg-rose-800 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                                >
                                    {isSubmittingAlbum ? 'Saving...' : editingAlbum ? 'Update Album' : 'Create Album'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Photo / Media Modal (Inside Open Album) */}
            {isEditMediaModalOpen && editingMediaItem && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                                    <Edit2 className="w-4 h-4"/>
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Update Photo & Details</h3>
                                    <p className="text-[11px] text-slate-500">Replace photo, change title, or edit notes</p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsEditMediaModalOpen(false)} 
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>

                        <form onSubmit={handleSaveMediaItem} className="p-5 space-y-4 text-xs">
                            {/* Current / Replaced Image Preview */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Picture Preview</label>
                                <div className="relative aspect-16/9 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                                    <img 
                                        src={editMediaUrl} 
                                        alt={editMediaTitle || 'Media'} 
                                        className="w-full h-full object-cover" 
                                    />
                                    {uploadingEditFile && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white space-x-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="font-semibold text-xs">Uploading new picture...</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <input 
                                        type="file" 
                                        ref={editMediaFileRef} 
                                        accept="image/*" 
                                        onChange={(e) => handleReplaceMediaFile(e.target.files[0])} 
                                        className="hidden" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => editMediaFileRef.current?.click()} 
                                        disabled={uploadingEditFile}
                                        className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        <UploadCloud className="w-3.5 h-3.5" />
                                        <span>Replace Picture from Computer</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Image URL
                                </label>
                                <input 
                                    type="url" 
                                    required 
                                    value={editMediaUrl} 
                                    onChange={(e) => setEditMediaUrl(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Caption Tag</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Prize Distribution" 
                                    value={editMediaTitle} 
                                    onChange={(e) => setEditMediaTitle(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Description</label>
                                <textarea 
                                    rows={2} 
                                    placeholder="e.g. Winner receiving the trophy from Chief Guest" 
                                    value={editMediaCaption} 
                                    onChange={(e) => setEditMediaCaption(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" 
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditMediaModalOpen(false)} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isUpdatingMediaItem || uploadingEditFile} 
                                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                                >
                                    {isUpdatingMediaItem ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryView;
