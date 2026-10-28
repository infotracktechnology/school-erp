import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, FileCheck2, Bell, Image, BarChart3, UserCheck, History, Building2, Calendar, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { HomeworkView } from './HomeworkView';
import { AssignmentView } from './AssignmentView';
import { AnnouncementView } from './AnnouncementView';
import { GalleryView } from './GalleryView';
import { CommunicationDashboardView } from './CommunicationDashboardView';
import { StudentPortalPreview } from './StudentPortalPreview';
import { CommunicationAuditHistory } from './CommunicationAuditHistory';
import { getBranches, getAcademicYears, getSections } from '../../services/api';
import { useErp } from '../../context/ErpContext';
export const CommunicationWorkspace = ({ initialSubmenu = 'homework', onSubmenuChange }) => {
    const { activeBranchId, activeAcademicYearId, branches: contextBranches, academicYears: contextYears, isSuperAdmin, assignedBranchId, assignedBranch, accessibleBranches } = useErp();
    // Navigation Submenu State
    const [activeSubmenu, setActiveSubmenu] = useState(initialSubmenu);
    // Synchronize when prop changes
    useEffect(() => {
        if (initialSubmenu) {
            setActiveSubmenu(initialSubmenu);
        }
    }, [initialSubmenu]);
    const handleSubmenuSelect = (submenu) => {
        setActiveSubmenu(submenu);
        if (onSubmenuChange) {
            onSubmenuChange(submenu);
        }
    };
    // Branch & Academic Year Scoping State
    const [branches, setBranches] = useState(() => {
        if (!isSuperAdmin) {
            return accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : (assignedBranch ? [assignedBranch] : []);
        }
        return contextBranches || [];
    });
    const [selectedBranchId, setSelectedBranchId] = useState(() => {
        if (!isSuperAdmin && assignedBranchId) return Number(assignedBranchId);
        return activeBranchId && activeBranchId !== 'all' ? Number(activeBranchId) : 1;
    });
    const [academicYears, setAcademicYears] = useState(contextYears || []);
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(activeAcademicYearId ? Number(activeAcademicYearId) : 1);
    // Dynamic Class & Section Scoping
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [isLoadingContext, setIsLoadingContext] = useState(true);

    // Sync from global ErpContext
    useEffect(() => {
        if (!isSuperAdmin) {
            const effId = assignedBranchId ? Number(assignedBranchId) : (accessibleBranches[0]?.id || 1);
            setSelectedBranchId(effId);
            setBranches(accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : (assignedBranch ? [assignedBranch] : []));
            return;
        }
        if (activeBranchId && activeBranchId !== 'all') {
            setSelectedBranchId(Number(activeBranchId));
        }
        if (contextBranches && contextBranches.length > 0) {
            setBranches(contextBranches);
        }
    }, [activeBranchId, isSuperAdmin, assignedBranchId, accessibleBranches, assignedBranch, contextBranches]);

    useEffect(() => {
        if (activeAcademicYearId) {
            setSelectedAcademicYearId(Number(activeAcademicYearId));
        }
    }, [activeAcademicYearId]);
    // Toast Notification System
    const [toast, setToast] = useState(null);
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    }, []);
    // 1. Fetch Branches on Mount (Super Admin only)
    useEffect(() => {
        if (!isSuperAdmin) return;
        const fetchBranchList = async () => {
            try {
                const branchList = await getBranches();
                setBranches(branchList);
                if (branchList.length > 0 && !selectedBranchId) {
                    const defaultBranch = branchList.find((b) => b.branch_type === 'Main Branch') || branchList[0];
                    setSelectedBranchId(defaultBranch.id);
                }
            }
            catch (err) {
                showToast('Unable to load branch records', 'error');
            }
        };
        fetchBranchList();
    }, [isSuperAdmin, selectedBranchId, showToast]);
    // 2. Fetch Academic Years whenever selectedBranchId changes
    useEffect(() => {
        if (!selectedBranchId)
            return;
        const fetchYears = async () => {
            setIsLoadingContext(true);
            try {
                const res = await getAcademicYears(selectedBranchId);
                setAcademicYears(res.data);
                let effectiveYearId = null;
                if (res.data.length > 0) {
                    const currentYear = res.data.find((y) => y.is_current) || res.data[0];
                    setSelectedAcademicYearId(currentYear.id);
                    effectiveYearId = currentYear.id;
                }
                // Fetch sections and classes for this branch and academic year
                const secRes = await getSections(selectedBranchId, effectiveYearId);
                const rawSections = secRes.data || [];
                setSections(rawSections.map((s) => ({
                    id: s.id,
                    class_id: s.class_id,
                    name: s.section_name || s.name || 'A'
                })));
                // Fetch classes (only enabled classes)
                const classUrl = effectiveYearId 
                    ? `/api/classes?branch_id=${selectedBranchId}&academic_year_id=${effectiveYearId}`
                    : `/api/classes?branch_id=${selectedBranchId}`;
                const classRes = await fetch(classUrl);
                if (classRes.ok) {
                    const cData = await classRes.json();
                    setClasses((cData.data || []).map((c) => ({
                        id: c.id,
                        name: c.class_name || c.name
                    })));
                }
            }
            catch (err) {
                showToast('Error syncing branch academic structure', 'error');
            }
            finally {
                setIsLoadingContext(false);
            }
        };
        fetchYears();
    }, [selectedBranchId, showToast]);
    // Submenu configuration
    const submenus = [
        {
            id: 'homework',
            label: 'Homework',
            badge: 'Daily Tasks',
            icon: BookOpen,
            activeColor: 'text-cyan-700 bg-cyan-50 border-cyan-500',
            tagline: 'Notebook work & daily subject exercises'
        },
        {
            id: 'assignment',
            label: 'Assignment',
            badge: 'Graded',
            icon: FileCheck2,
            activeColor: 'text-purple-700 bg-purple-50 border-purple-500',
            tagline: 'Projects, online submissions & evaluations'
        },
        {
            id: 'announcement',
            label: 'Announcement',
            badge: 'Broadcast',
            icon: Bell,
            activeColor: 'text-amber-700 bg-amber-50 border-amber-500',
            tagline: 'Circulars, emergency notices & SMS/WhatsApp alerts'
        },
        {
            id: 'gallery',
            label: 'Gallery',
            badge: 'Media',
            icon: Image,
            activeColor: 'text-rose-700 bg-rose-50 border-rose-500',
            tagline: 'Events, sports meets & annual day captures'
        },
        {
            id: 'dashboard',
            label: 'Monitoring & Stats',
            badge: 'Overview',
            icon: BarChart3,
            activeColor: 'text-blue-700 bg-blue-50 border-blue-500',
            tagline: 'Branch communication coverage & health'
        },
        {
            id: 'portal',
            label: 'Student / Parent Feed',
            badge: 'Live Preview',
            icon: UserCheck,
            activeColor: 'text-indigo-700 bg-indigo-50 border-indigo-500',
            tagline: 'Simulate mobile app feed per student'
        },
        {
            id: 'audit',
            label: 'Audit Trail',
            badge: 'Security',
            icon: History,
            activeColor: 'text-slate-800 bg-slate-100 border-slate-600',
            tagline: 'Real-time record of all actions'
        }
    ];
    const currentBranch = branches.find((b) => b.id === selectedBranchId);
    const currentAcademicYear = academicYears.find((y) => y.id === selectedAcademicYearId);
    return (<div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast popup */}
      {toast && (<div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl text-xs font-bold border transition-all animate-in slide-in-from-bottom-5 ${toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                    ? 'bg-rose-900 text-white border-rose-700'
                    : 'bg-slate-900 text-white border-slate-700'}`}>
          {toast.type === 'success' ? (<CheckCircle2 className="w-4 h-4 text-emerald-300"/>) : (<AlertCircle className="w-4 h-4 text-rose-300"/>)}
          <span>{toast.message}</span>
        </div>)}

      {/* Persistent Branch & Academic Year Scoping Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800">
                Multi-Branch Isolated
              </span>
              <span className="text-xs text-slate-400 font-medium">Communication Management</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              School Communication Workspace
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              All communications, assignments, homework, and media are branch-isolated and tied to the selected academic year.
            </p>
          </div>

          {/* Context Selector: Branch + Academic Year */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200/80">
            {/* Branch Selector */}
            <div className="flex items-center space-x-1.5 flex-1 sm:flex-initial">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0"/>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Branch {!isSuperAdmin && '(Assigned)'}</span>
                {isSuperAdmin ? (
                  <select id="select-communication-branch" value={selectedBranchId} onChange={(e) => setSelectedBranchId(Number(e.target.value))} className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-4">
                    {branches.map((b) => (<option key={b.id} value={b.id}>
                        {b.branch_name} {b.branch_type === 'Main Branch' ? '(Main)' : ''}
                      </option>))}
                  </select>
                ) : (
                  <span className="text-xs font-bold text-emerald-800">
                    {currentBranch?.branch_name || assignedBranch?.branch_name || 'Assigned Branch'}
                  </span>
                )}
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"/>

            {/* Academic Year Selector */}
            <div className="flex items-center space-x-1.5 flex-1 sm:flex-initial">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0"/>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Academic Year</span>
                <select id="select-communication-academic-year" value={selectedAcademicYearId} onChange={(e) => setSelectedAcademicYearId(Number(e.target.value))} className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-4">
                  {academicYears.map((y) => (<option key={y.id} value={y.id}>
                      {y.year_name} {y.is_current ? '(Current)' : ''}
                    </option>))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Context State */}
      {isLoadingContext ? (<div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-700 animate-spin"/>
          <p className="text-xs font-semibold text-slate-700">Syncing branch communication scope...</p>
        </div>) : (
        /* Submenu Content Display (Strictly shows only the active submenu) */
        <div className="transition-all">
          {activeSubmenu === 'homework' && (<HomeworkView branchId={selectedBranchId} academicYearId={selectedAcademicYearId} classes={classes} sections={sections} showToast={showToast}/>)}

          {activeSubmenu === 'assignment' && (<AssignmentView branchId={selectedBranchId} academicYearId={selectedAcademicYearId} classes={classes} sections={sections} showToast={showToast}/>)}

          {activeSubmenu === 'announcement' && (<AnnouncementView branchId={selectedBranchId} academicYearId={selectedAcademicYearId} classes={classes} sections={sections} showToast={showToast}/>)}

          {activeSubmenu === 'gallery' && (<GalleryView branchId={selectedBranchId} academicYearId={selectedAcademicYearId} classes={classes} sections={sections} showToast={showToast}/>)}

          {activeSubmenu === 'dashboard' && (<CommunicationDashboardView branchId={selectedBranchId} academicYearId={selectedAcademicYearId} showToast={showToast} onNavigateSubmenu={(sub) => handleSubmenuSelect(sub)}/>)}

          {activeSubmenu === 'portal' && (<StudentPortalPreview branchId={selectedBranchId} academicYearId={selectedAcademicYearId} classes={classes} sections={sections} showToast={showToast}/>)}

          {activeSubmenu === 'audit' && (<CommunicationAuditHistory branchId={selectedBranchId} academicYearId={selectedAcademicYearId} showToast={showToast}/>)}
        </div>)}
    </div>);
};
