import React, { useState, useEffect } from 'react';
import { CalendarCheck, CheckSquare, Clock, History, BarChart3, Layers, Building2, Calendar, ShieldCheck } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { TakeAttendanceView } from './TakeAttendanceView';
import { AttendanceTimingView } from './AttendanceTimingView';
import { AttendanceAssignmentView } from './AttendanceAssignmentView';
import { AttendanceHistoryView } from './AttendanceHistoryView';
import { AttendanceReportsView } from './AttendanceReportsView';

export const AttendanceWorkspace = ({ initialSubmenu = 'take_attendance', onSubmenuChange }) => {
    const { branches, activeBranchId, setActiveBranchId, activeAcademicYearId, activeAcademicYear, academicYears, setActiveAcademicYearId, isSuperAdmin } = useErp();
    const [activeSubmenu, setActiveSubmenu] = useState(initialSubmenu);

    // Sync initial submenu if changed from parent
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

    // Determine valid numeric branchId and academicYearId
    const realBranches = branches.filter(b => b.id > 0);
    const effectiveBranchId = typeof activeBranchId === 'number' && activeBranchId > 0
        ? activeBranchId
        : realBranches.length > 0 ? realBranches[0].id : 1;
    const currentBranch = branches.find(b => b.id === effectiveBranchId) || realBranches[0];
    const effectiveAcademicYearId = activeAcademicYearId || (academicYears.length > 0 ? academicYears[0].id : 1);

    const [prefillMapping, setPrefillMapping] = useState(null);

    const handleNavigateToMapping = (navData) => {
        setPrefillMapping(navData);
        handleSubmenuSelect('assignments');
    };

    // 5 Streamlined Attendance Submenus in operational setup & execution sequence:
    // 1. Attendance Time (Morning & Afternoon Sessions setup)
    // 2. Class & Section Timing Mapping (Prerequisite timing mapping)
    // 3. Take Attendance (Daily roll-call execution)
    // 4. Attendance History (Audited session records)
    // 5. Attendance Reports (Analytics)
    const submenus = [
        {
            id: 'timings',
            label: '1. Attendance Time',
            icon: Clock,
            description: 'Configure morning & afternoon session windows'
        },
        {
            id: 'assignments',
            label: '2. Class & Section Timing Mapping',
            icon: Layers,
            description: 'Map attendance timings to classes and sections'
        },
        {
            id: 'take_attendance',
            label: '3. Take Attendance',
            icon: CheckSquare,
            description: 'Daily roll-call & single-click status marking'
        },
        {
            id: 'history',
            label: '4. Attendance History',
            icon: History,
            description: 'Session records & verified audit trail'
        },
        {
            id: 'reports',
            label: '5. Attendance Reports',
            icon: BarChart3,
            description: 'Daily, monthly, class & student analytics'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Branch & Academic Year Context Card (Mandatory Hierarchy) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                            <CalendarCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                <span>Branch-Wise Operational Hierarchy</span>
                            </div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Attendance Management
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Simple, fast attendance for daily school use. Scoped strictly to the selected Branch and Academic Year.
                            </p>
                        </div>
                    </div>

                    {/* Context Selector Controls */}
                    <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {/* Branch Context Selector */}
                        <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Branch:</span>
                            {isSuperAdmin ? (
                                <select
                                    id="attendance-branch-context-select"
                                    value={effectiveBranchId}
                                    onChange={e => setActiveBranchId(Number(e.target.value))}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                >
                                    {realBranches.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.branch_name} ({b.branch_code})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {currentBranch?.branch_name || 'Assigned Branch'} ({currentBranch?.branch_code || ''})
                                </span>
                            )}
                        </div>

                        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

                        {/* Academic Year Selector */}
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Academic Year:</span>
                            <select
                                id="attendance-ay-context-select"
                                value={effectiveAcademicYearId}
                                onChange={e => setActiveAcademicYearId(Number(e.target.value))}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                            >
                                {academicYears.map(ay => (
                                    <option key={ay.id} value={ay.id}>
                                        {ay.name} {ay.is_default ? '(Default)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Informational Context Banner */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-xs gap-2 text-slate-500">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>
                            Active Operational Isolation: <strong className="text-slate-900 dark:text-white">{currentBranch?.branch_name}</strong> + <strong className="text-slate-900 dark:text-white">{activeAcademicYear?.name || '2026-2027'}</strong>
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px]">
                        <span>City: {currentBranch?.city || 'Chennai'}</span>
                        <span>•</span>
                        <span>Board: {currentBranch?.board || 'CBSE'}</span>
                    </div>
                </div>
            </div>

            {/* Dynamic Submenu Views (Controlled exclusively via Sidebar Sub-menu) */}
            <div>
                {activeSubmenu === 'take_attendance' && (
                    <TakeAttendanceView
                        branchId={effectiveBranchId}
                        academicYearId={effectiveAcademicYearId}
                        onNavigateToMapping={handleNavigateToMapping}
                    />
                )}

                {activeSubmenu === 'timings' && (
                    <AttendanceTimingView branchId={effectiveBranchId} academicYearId={effectiveAcademicYearId} />
                )}

                {activeSubmenu === 'assignments' && (
                    <AttendanceAssignmentView
                        branchId={effectiveBranchId}
                        academicYearId={effectiveAcademicYearId}
                        prefillClassId={prefillMapping?.classId}
                        prefillSectionId={prefillMapping?.sectionId}
                        autoOpenAdd={Boolean(prefillMapping)}
                    />
                )}

                {activeSubmenu === 'history' && (
                    <AttendanceHistoryView branchId={effectiveBranchId} academicYearId={effectiveAcademicYearId} />
                )}

                {activeSubmenu === 'reports' && (
                    <AttendanceReportsView branchId={effectiveBranchId} academicYearId={effectiveAcademicYearId} />
                )}
            </div>
        </div>
    );
};
