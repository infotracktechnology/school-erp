import React, { useState, useEffect, useCallback } from 'react';
import { 
    BookOpen, FileCheck2, Bell, Image as ImageIcon, Paperclip, ExternalLink, 
    Loader2, UserCheck, FileText, Video, Link as LinkIcon, Camera, Download,
    CheckCircle2, Clock, Calendar, AlertCircle
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';

export const StudentPortalPreview = ({ branchId, academicYearId, classes = [], sections = [], showToast }) => {
    const [studentsList, setStudentsList] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [portalData, setPortalData] = useState(null);
    const [isLoadingFeed, setIsLoadingFeed] = useState(false);
    const [activeTab, setActiveTab] = useState('homework');

    // 1. Fetch real active students for branch & academic year
    useEffect(() => {
        if (!branchId) return;
        let isMounted = true;
        setIsLoadingStudents(true);
        const params = new URLSearchParams();
        params.append('branch_id', String(branchId));
        if (academicYearId) params.append('academic_year_id', String(academicYearId));
        params.append('status', 'Active');
        params.append('page_size', '100');

        fetch(`/api/students?${params.toString()}`)
            .then(r => r.json())
            .then(res => {
                if (!isMounted) return;
                const data = res.data || [];
                setStudentsList(data);
                if (data.length > 0) {
                    setStudentId(data[0].id);
                } else {
                    setStudentId('');
                    setPortalData(null);
                }
            })
            .catch(err => {
                if (isMounted) console.error('Failed to load students:', err);
            })
            .finally(() => {
                if (isMounted) setIsLoadingStudents(false);
            });

        return () => { isMounted = false; };
    }, [branchId, academicYearId]);

    // 2. Fetch Personalized Student Feed
    const loadFeed = useCallback(async (sId) => {
        if (!sId) return;
        setIsLoadingFeed(true);
        try {
            const data = await communicationService.getStudentPortalFeed(sId, academicYearId);
            setPortalData(data);
        } catch (err) {
            showToast?.(err.message || 'Failed to load student communication feed', 'error');
        } finally {
            setIsLoadingFeed(false);
        }
    }, [academicYearId, showToast]);

    useEffect(() => {
        if (studentId) {
            loadFeed(studentId);
        }
    }, [studentId, loadFeed]);

    return (
        <div className="space-y-5">
            {/* Simulation Header Banner */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                        <UserCheck className="w-5 h-5"/>
                    </span>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            Student & Parent Portal Feed Preview
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Live simulation of what students and parents experience on their mobile app or web portal
                        </p>
                    </div>
                </div>

                {/* Real Database Student Selector */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-600 shrink-0">Simulate Student:</span>
                    {isLoadingStudents ? (
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-600"/>
                            <span>Loading students...</span>
                        </div>
                    ) : (
                        <select 
                            value={studentId} 
                            onChange={(e) => setStudentId(Number(e.target.value))} 
                            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                        >
                            {studentsList.length === 0 ? (
                                <option value="">No enrolled students in this branch</option>
                            ) : (
                                studentsList.map((st) => {
                                    const fullName = `${st.first_name || ''} ${st.last_name || ''}`.trim() || st.name || `Student #${st.id}`;
                                    const admNo = st.admission_number || st.admission_no || `#${st.id}`;
                                    const clsName = st.class_name ? `Cls ${st.class_name}` : '';
                                    const secName = st.section_name ? `Sec ${st.section_name}` : '';
                                    return (
                                        <option key={st.id} value={st.id}>
                                            {fullName} ({admNo}) {clsName} {secName}
                                        </option>
                                    );
                                })
                            )}
                        </select>
                    )}
                </div>
            </div>

            {isLoadingFeed ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-700 animate-spin"/>
                    <p className="text-xs font-semibold text-slate-600">Retrieving personalized student feed...</p>
                </div>
            ) : !portalData?.student ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs text-xs text-slate-500">
                    Please select a student from the dropdown above to view their personalized feed.
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Student Profile Ribbon */}
                    <div className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-base text-white uppercase">
                                {portalData.student.first_name?.[0] || 'S'}
                                {portalData.student.last_name?.[0] || ''}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-base font-bold text-white">
                                        {portalData.student.first_name} {portalData.student.last_name || ''}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-indigo-100">
                                        {portalData.student.admission_number || portalData.student.admission_no}
                                    </span>
                                </div>
                                <p className="text-xs text-indigo-200 mt-0.5 font-medium">
                                    {portalData.student.class_name ? `Class ${portalData.student.class_name}` : 'Enrolled'} 
                                    {portalData.student.section_name ? ` • Section ${portalData.student.section_name}` : ''} 
                                    {portalData.student.branch_name ? ` • ${portalData.student.branch_name}` : ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200">
                            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                                <span className="text-[10px] text-indigo-300 block">Gender:</span>
                                <span className="font-bold text-white">{portalData.student.gender || 'Not Specified'}</span>
                            </div>
                            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                                <span className="text-[10px] text-indigo-300 block">Residential Category:</span>
                                <span className="font-bold text-white">{portalData.student.residential_type || 'Day Scholar'}</span>
                            </div>
                            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                                <span className="text-[10px] text-indigo-300 block">Parent / Guardian:</span>
                                <span className="font-bold text-white">{portalData.student.parent_name || 'Parent'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Portal Sub-tabs */}
                    <div className="flex items-center space-x-2 border-b border-slate-200 bg-white px-4 pt-2 rounded-t-2xl overflow-x-auto">
                        <button 
                            type="button" 
                            onClick={() => setActiveTab('homework')} 
                            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                                activeTab === 'homework'
                                    ? 'border-cyan-600 text-cyan-800 font-extrabold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <BookOpen className="w-3.5 h-3.5"/>
                            <span>Homework ({portalData.homework?.length || 0})</span>
                        </button>

                        <button 
                            type="button" 
                            onClick={() => setActiveTab('assignments')} 
                            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                                activeTab === 'assignments'
                                    ? 'border-purple-600 text-purple-800 font-extrabold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <FileCheck2 className="w-3.5 h-3.5"/>
                            <span>Assignments ({portalData.assignments?.length || 0})</span>
                        </button>

                        <button 
                            type="button" 
                            onClick={() => setActiveTab('announcements')} 
                            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                                activeTab === 'announcements'
                                    ? 'border-amber-600 text-amber-800 font-extrabold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Bell className="w-3.5 h-3.5"/>
                            <span>Announcements ({portalData.announcements?.length || 0})</span>
                        </button>

                        <button 
                            type="button" 
                            onClick={() => setActiveTab('gallery')} 
                            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                                activeTab === 'gallery'
                                    ? 'border-rose-600 text-rose-800 font-extrabold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <ImageIcon className="w-3.5 h-3.5"/>
                            <span>Event Albums ({portalData.albums?.length || 0})</span>
                        </button>
                    </div>

                    {/* Active Tab Content */}
                    <div className="bg-white p-5 rounded-b-2xl border border-slate-200/80 shadow-xs">
                        {/* 1. HOMEWORK TAB */}
                        {activeTab === 'homework' && (
                            <div className="space-y-4">
                                <div className="text-xs text-slate-500 italic">
                                    Homework is assigned by subject teachers for home practice and notebook completion.
                                </div>
                                {portalData.homework.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-8 text-center">No homework assigned for this student's class & section.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {portalData.homework.map((hw) => {
                                            const atts = hw.attachments;
                                            return (
                                                <div key={hw.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 flex flex-col justify-between">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-[11px] font-bold text-cyan-800 uppercase">
                                                            <span>{hw.subject_name || 'General Subject'}</span>
                                                            <span className="text-rose-600 font-semibold lowercase">due {hw.due_date}</span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{hw.title}</h4>
                                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{hw.description}</p>
                                                        {hw.instructions && (
                                                            <div className="p-2 rounded-lg bg-amber-50 text-amber-900 text-[11px] leading-relaxed">
                                                                <span className="font-bold">Instructions: </span>{hw.instructions}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Attachments Pills */}
                                                    {atts && (
                                                        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                                                            {atts.doc?.url && (
                                                                <a 
                                                                    href={atts.doc.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100"
                                                                >
                                                                    <FileText className="w-3 h-3" />
                                                                    <span className="truncate max-w-[120px]">{atts.doc.name || 'Worksheet Doc'}</span>
                                                                </a>
                                                            )}
                                                            {atts.image?.url && (
                                                                <a 
                                                                    href={atts.image.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-md hover:bg-purple-100"
                                                                >
                                                                    <ImageIcon className="w-3 h-3" />
                                                                    <span>Diagram / Image</span>
                                                                </a>
                                                            )}
                                                            {atts.link && (
                                                                <a 
                                                                    href={atts.link} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md hover:bg-emerald-100"
                                                                >
                                                                    <LinkIcon className="w-3 h-3" />
                                                                    <span>Web Reference</span>
                                                                </a>
                                                            )}
                                                            {atts.video && (
                                                                <a 
                                                                    href={atts.video} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-md hover:bg-rose-100"
                                                                >
                                                                    <Video className="w-3 h-3" />
                                                                    <span>Lecture Video</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. ASSIGNMENTS TAB */}
                        {activeTab === 'assignments' && (
                            <div className="space-y-4">
                                {portalData.assignments.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-8 text-center">No assignments targeted to this student.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {portalData.assignments.map((asgn) => {
                                            const atts = asgn.attachments;
                                            return (
                                                <div key={asgn.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-bold text-purple-800 uppercase text-[10px] bg-purple-50 px-2 py-0.5 rounded">
                                                                {asgn.subject_name || 'Subject'}
                                                            </span>
                                                            <span className="text-slate-400">•</span>
                                                            <span className="text-slate-500 font-medium">{asgn.submission_type} Submission</span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-slate-900">{asgn.title}</h4>
                                                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{asgn.description}</p>
                                                        <div className="text-[11px] text-slate-500 pt-1 flex items-center space-x-3">
                                                            <span className="font-semibold text-rose-600">Due: {asgn.due_date}</span>
                                                            <span>•</span>
                                                            <span>Max Marks: {asgn.max_marks || 50}</span>
                                                        </div>

                                                        {/* Attachments */}
                                                        {atts && (
                                                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                                {atts.doc?.url && (
                                                                    <a href={atts.doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                                        <FileText className="w-3 h-3" />
                                                                        <span>{atts.doc.name || 'Question Paper'}</span>
                                                                    </a>
                                                                )}
                                                                {atts.image?.url && (
                                                                    <a href={atts.image.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                                                        <ImageIcon className="w-3 h-3" />
                                                                        <span>Reference Image</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Student submission feedback box */}
                                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 min-w-[220px] text-right space-y-1.5 shrink-0">
                                                        <div className="flex items-center justify-end space-x-1.5">
                                                            <span className="text-[11px] text-slate-400">My Status:</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                asgn.submission_status === 'Reviewed' || asgn.submission_status === 'Completed'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : asgn.submission_status === 'Submitted'
                                                                        ? 'bg-purple-100 text-purple-800'
                                                                        : 'bg-amber-100 text-amber-800'
                                                            }`}>
                                                                {asgn.submission_status || 'Pending Submission'}
                                                            </span>
                                                        </div>

                                                        {asgn.marks_obtained !== null && asgn.marks_obtained !== undefined && (
                                                            <div className="text-xs font-bold text-slate-900">
                                                                Marks: {asgn.marks_obtained} / {asgn.max_marks || 50} {asgn.grade ? `(${asgn.grade})` : ''}
                                                            </div>
                                                        )}

                                                        {asgn.remarks && (
                                                            <div className="text-[10px] text-slate-500 italic max-w-[220px] bg-slate-50 p-1.5 rounded">
                                                                "{asgn.remarks}"
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. ANNOUNCEMENTS TAB */}
                        {activeTab === 'announcements' && (
                            <div className="space-y-4">
                                {portalData.announcements.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-8 text-center">No active announcements targeted to this student.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {portalData.announcements.map((ann) => {
                                            const atts = ann.attachments;
                                            return (
                                                <div 
                                                    key={ann.id} 
                                                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                                                >
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-amber-100 text-amber-900">
                                                            {ann.target_audience === 'All' ? 'Campus Notice' : ann.target_audience}
                                                        </span>
                                                        <span className="text-slate-400 flex items-center space-x-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{ann.publish_date}</span>
                                                        </span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                                                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                        {ann.message}
                                                    </p>

                                                    {/* Attachments */}
                                                    {atts && (
                                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200">
                                                            {atts.doc?.url && (
                                                                <a href={atts.doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                                    <FileText className="w-3 h-3" />
                                                                    <span>{atts.doc.name || 'Circular PDF'}</span>
                                                                </a>
                                                            )}
                                                            {atts.image?.url && (
                                                                <a href={atts.image.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                                                    <ImageIcon className="w-3 h-3" />
                                                                    <span>Notice Image</span>
                                                                </a>
                                                            )}
                                                            {atts.link && (
                                                                <a href={atts.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                                                    <LinkIcon className="w-3 h-3" />
                                                                    <span>External Link</span>
                                                                </a>
                                                            )}
                                                            {atts.video && (
                                                                <a href={atts.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                                                                    <Video className="w-3 h-3" />
                                                                    <span>Video Link</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. GALLERY TAB */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-4">
                                {portalData.albums.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-8 text-center">No event photo albums available for this student.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {portalData.albums.map((alb) => {
                                            const atts = alb.attachments;
                                            return (
                                                <div key={alb.id} className="rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between bg-white shadow-xs">
                                                    <div>
                                                        <div className="aspect-16/9 bg-slate-100 overflow-hidden relative">
                                                            <img 
                                                                src={alb.cover_image_url || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80'} 
                                                                alt={alb.album_name} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center space-x-1">
                                                                <Camera className="w-3 h-3" />
                                                                <span>{alb.event_date}</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-3.5 space-y-1">
                                                            <span className="text-[10px] text-rose-700 font-bold uppercase block">
                                                                {alb.event_name}
                                                            </span>
                                                            <h4 className="text-xs font-bold text-slate-900">{alb.album_name}</h4>
                                                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{alb.description || 'No description provided.'}</p>
                                                        </div>
                                                    </div>

                                                    {/* External Links */}
                                                    {atts?.links && atts.links.length > 0 && (
                                                        <div className="px-3.5 pb-3 flex flex-wrap gap-1">
                                                            {atts.links.map((lnk, lIdx) => (
                                                                <a 
                                                                    key={lnk.id || lIdx}
                                                                    href={lnk.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100"
                                                                >
                                                                    <LinkIcon className="w-2.5 h-2.5" />
                                                                    <span>{lnk.title || 'Attached Link'}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPortalPreview;
