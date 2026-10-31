import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Star,
  Users,
  User,
  UserCheck,
  CalendarCheck,
  BookOpen,
  Award,
  CreditCard,
  MessageSquare,
  Briefcase,
  Bus,
  Bookmark,
  BarChart3,
  Settings,
  Building2,
  Calendar,
  Layers,
  GitMerge,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Shield,
  Key,
  X,
  Edit,
  ArrowRightLeft,
  TrendingUp,
  UserX,
  Clock,
  CheckSquare,
  History,
  FileCheck2,
  Bell,
  Image,
  Sliders,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export const NAVIGATION_GROUPS = [
  {
    id: 'overview',
    label: 'Overview & Hub',
    modules: ['dashboard', 'modules'],
  },
  {
    id: 'students',
    label: 'Student Information (SIS)',
    modules: ['students', 'attendance'],
  },
  {
    id: 'academics',
    label: 'Academics & Schedule',
    modules: ['academics', 'timetable', 'calendar'],
  },
  {
    id: 'assessment',
    label: 'Assessment & Conduct',
    modules: ['examination', 'anecdotes'],
  },
  {
    id: 'communication',
    label: 'Communication & Media',
    modules: ['communication'],
  },
  {
    id: 'faculty',
    label: 'Staff & Administration',
    modules: ['staff', 'hr'],
  },
  {
    id: 'operations',
    label: 'Campus Operations',
    modules: ['finance', 'transport', 'library', 'reports'],
  },
];

export const Sidebar = ({
  activeNav,
  onSelectNav,
  isSettingsExpanded,
  onToggleSettingsExpand,
  activeAcademicSubTab = 'academic-year',
  onSelectAcademicSubTab,
  isAcademicExpanded = true,
  onToggleAcademicExpand,
  activeStudentSubTab = 'details',
  onSelectStudentSubTab,
  isStudentsExpanded = true,
  onToggleStudentsExpand,
  activeAttendanceSubTab = 'take_attendance',
  onSelectAttendanceSubTab,
  isAttendanceExpanded = true,
  onToggleAttendanceExpand,
  activeCommunicationSubTab = 'homework',
  onSelectCommunicationSubTab,
  isCommunicationExpanded = true,
  onToggleCommunicationExpand,
  activeExaminationSubTab = 'setup',
  onSelectExaminationSubTab,
  isExaminationExpanded = true,
  onToggleExaminationExpand,
  activeAnecdoteSubTab = 'logs',
  onSelectAnecdoteSubTab,
  isAnecdotesExpanded = true,
  onToggleAnecdotesExpand,
  activeStaffSubTab = 'directory',
  onSelectStaffSubTab,
  isStaffExpanded = true,
  onToggleStaffExpand,
  userPermissions = { canViewBranchSettings: true, canViewAcademicSettings: true },
  userRole = '',
  isStudent = false,
  branchCount = 0,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { canViewBranchSettings = true, canViewAcademicSettings = true } = userPermissions;
  const isSuperAdminUser = userRole === 'super_admin';
  const hasAnySettingsPermission = isSuperAdminUser && (canViewBranchSettings || canViewAcademicSettings);

  const isSettingsActive =
    activeNav === 'branch-settings' ||
    activeNav === 'academic-settings' ||
    activeNav === 'users' ||
    activeNav === 'menu-assignment';
  const isStudentsActive = activeNav === 'students';
  const isAttendanceActive = activeNav === 'attendance';
  const isCommunicationActive = activeNav === 'communication';
  const isExaminationActive = activeNav === 'examination';
  const isAnecdotesActive = activeNav === 'anecdotes';
  const isStaffActive = activeNav === 'staff';

  // Group accordion state (default all 7 groups expanded)
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const staffSubItems = [
    { id: 'directory', label: '1. Staff Directory', icon: Users },
    { id: 'allocations', label: '2. Academic Allocations', icon: ShieldCheck },
    { id: 'workload', label: '3. Teaching Workload', icon: Clock },
    { id: 'credentials', label: '4. Bulk Reset Credentials', icon: Key },
  ];

  const anecdoteSubItems = [
    { id: 'logs', label: '1. Observations Log', icon: BookOpen },
    { id: 'reports', label: '2. Behavioral Reports', icon: BarChart3 },
  ];

  const examinationSubItems = [
    { id: 'term-structure', label: '1. Term & Academic Structure', icon: Layers },
  ];

  const allCommunicationSubItems = [
    { id: 'homework', label: '1. Homework', icon: BookOpen },
    { id: 'assignment', label: '2. Assignment', icon: FileCheck2 },
    { id: 'announcement', label: '3. Announcement', icon: Bell },
    { id: 'gallery', label: '4. Gallery', icon: Image },
    { id: 'dashboard', label: '5. Monitoring & Stats', icon: BarChart3 },
    { id: 'portal', label: '6. Student Portal Feed', icon: UserCheck },
    { id: 'audit', label: '7. Audit Trail', icon: History },
  ];

  const studentCommunicationSubItems = [
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'assignment', label: 'Assignment', icon: FileCheck2 },
    { id: 'announcement', label: 'Announcement', icon: Bell },
    { id: 'gallery', label: 'Gallery', icon: Image },
  ];

  const communicationSubItems = isStudent ? studentCommunicationSubItems : allCommunicationSubItems;

  const attendanceSubItems = [
    { id: 'take_attendance', label: '1. Take Attendance', icon: CheckSquare },
    { id: 'timings', label: '2. Attendance Time', icon: Clock },
    { id: 'assignments', label: '3. Class & Section Timing Mapping', icon: Layers },
    { id: 'history', label: '4. Attendance History', icon: History },
    { id: 'reports', label: '5. Attendance Reports', icon: BarChart3 },
  ];

  const studentSubItems = [
    { id: 'details', label: 'Student Details', icon: Users },
    { id: 'update', label: 'Student Update', icon: Edit },
    { id: 'class-section-changes', label: 'Class & Section Changes', icon: ArrowRightLeft },
    { id: 'promotion', label: 'Student Promotion', icon: TrendingUp },
    { id: 'academic-groups', label: 'Academic Groups', icon: Layers },
    { id: 'subject-mapping', label: 'Subject Mapping', icon: BookOpen },
    { id: 'inactive', label: 'Inactive Students / TC', icon: UserX },
    { id: 'approvals', label: 'Student Approvals', icon: ShieldCheck },
    { id: 'credentials', label: 'Bulk Reset Credentials', icon: Key },
  ];

  // Master definition of all 16 ERP modules with icons and role permissions
  const rawMenuItems = useMemo(
    () => [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'modules', label: 'Modules Showcase', icon: Sparkles, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'anecdotes', label: 'Anecdotes', icon: Star, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'students', label: 'Students', icon: Users, roles: ['super_admin', 'principal', 'branch_admin'] },
      { id: 'staff', label: 'Staff', icon: UserCheck, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'calendar', label: 'Calendar', icon: Calendar, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'timetable', label: 'Timetable', icon: Clock, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'academics', label: 'Academics', icon: BookOpen, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'examination', label: 'Examination', icon: Award, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'finance', label: 'Finance', icon: CreditCard, roles: ['super_admin', 'principal', 'branch_admin'] },
      { id: 'communication', label: 'Communication', icon: MessageSquare, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'hr', label: 'HR', icon: Briefcase, roles: ['super_admin', 'principal', 'branch_admin'] },
      { id: 'transport', label: 'Transport', icon: Bus, roles: ['super_admin', 'principal', 'branch_admin'] },
      { id: 'library', label: 'Library', icon: Bookmark, roles: ['super_admin', 'principal', 'teacher', 'branch_admin'] },
      { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['super_admin', 'principal', 'branch_admin'] },
    ],
    []
  );

  // Student specific navigation menu
  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'anecdotes', label: 'My Merits & Remarks', icon: Star },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'assignment', label: 'Assignment', icon: FileCheck2 },
    { id: 'announcement', label: 'Announcement', icon: Bell },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  // Helper to check if a module is allowed for the active role
  const isModuleAllowed = (item) => {
    if (isSuperAdminUser) return true;
    if (!item.roles) return true;
    const normalizedRole = userRole === 'principle' ? 'principal' : userRole;
    return item.roles.includes(normalizedRole);
  };

  const handleStudentsClick = () => {
    onSelectNav('students');
    if (onToggleStudentsExpand) {
      onToggleStudentsExpand();
    }
  };

  const handleStudentSubTabClick = (tab) => {
    onSelectNav('students');
    if (onSelectStudentSubTab) {
      onSelectStudentSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleAttendanceClick = () => {
    onSelectNav('attendance');
    if (onToggleAttendanceExpand) {
      onToggleAttendanceExpand();
    }
  };

  const handleAttendanceSubTabClick = (tab) => {
    onSelectNav('attendance');
    if (onSelectAttendanceSubTab) {
      onSelectAttendanceSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleCommunicationClick = () => {
    onSelectNav('communication');
    if (onToggleCommunicationExpand) {
      onToggleCommunicationExpand();
    }
  };

  const handleCommunicationSubTabClick = (tab) => {
    onSelectNav('communication');
    if (onSelectCommunicationSubTab) {
      onSelectCommunicationSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleExaminationClick = () => {
    onSelectNav('examination');
    if (onToggleExaminationExpand) {
      onToggleExaminationExpand();
    }
  };

  const handleAnecdotesClick = () => {
    onSelectNav('anecdotes');
    if (onToggleAnecdotesExpand) {
      onToggleAnecdotesExpand();
    }
  };

  const handleAnecdoteSubTabClick = (tab) => {
    onSelectNav('anecdotes');
    if (onSelectAnecdoteSubTab) {
      onSelectAnecdoteSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleStaffClick = () => {
    onSelectNav('staff');
    if (onToggleStaffExpand) {
      onToggleStaffExpand();
    }
  };

  const handleStaffSubTabClick = (tab) => {
    onSelectNav('staff');
    if (onSelectStaffSubTab) {
      onSelectStaffSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleExaminationSubTabClick = (tab) => {
    onSelectNav('examination');
    if (onSelectExaminationSubTab) {
      onSelectExaminationSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleSettingsClick = () => {
    if (onToggleSettingsExpand) {
      onToggleSettingsExpand();
    }
    if (!isSettingsActive) {
      if (canViewBranchSettings) {
        onSelectNav('branch-settings');
      } else if (canViewAcademicSettings) {
        onSelectNav('academic-settings');
      }
    }
  };

  const handleAcademicSubTabClick = (tab) => {
    onSelectNav('academic-settings');
    if (onSelectAcademicSubTab) {
      onSelectAcademicSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleSubItemClick = (subId) => {
    onSelectNav(subId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleMainMenuClick = (id) => {
    if (id === 'academics') {
      onSelectNav('academic-settings');
      if (onSelectAcademicSubTab) {
        onSelectAcademicSubTab('subjects');
      }
      if (onCloseMobile) {
        onCloseMobile();
      }
      return;
    }
    onSelectNav(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const academicSubItems = [
    { id: 'academic-year', label: 'Academic Year', icon: Calendar, activeClass: 'bg-primary text-primary-foreground shadow-xs' },
    { id: 'classes', label: 'Classes', icon: Layers, activeClass: 'bg-primary text-primary-foreground shadow-xs' },
    { id: 'sections', label: 'Sections', icon: Bookmark, activeClass: 'bg-primary text-primary-foreground shadow-xs' },
    { id: 'class-section', label: 'Class & Section', icon: GitMerge, activeClass: 'bg-primary text-primary-foreground shadow-xs' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, activeClass: 'bg-primary text-primary-foreground shadow-xs' },
  ];

  // Helper to render an individual navigation item
  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = activeNav === item.id;

    // Expandable Anecdotes Module for staff/admin
    if (item.id === 'anecdotes' && !isStudent) {
      return (
        <div key="anecdotes" className="space-y-1">
          <button
            type="button"
            onClick={handleAnecdotesClick}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isAnecdotesActive
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isAnecdotesActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">Anecdotes</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isAnecdotesActive ? "text-white" : "text-slate-400",
                  !isAnecdotesExpanded && "-rotate-90"
                )}
              />
            </div>
          </button>

          {isAnecdotesExpanded && (
            <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30">
              {anecdoteSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive =
                  isAnecdotesActive &&
                  (activeAnecdoteSubTab === sub.id || (!activeAnecdoteSubTab && sub.id === 'logs'));
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleAnecdoteSubTabClick(sub.id)}
                    className={cn(
                      "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      isSubActive
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
                    )}
                  >
                    <SubIcon className={cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400")} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Special treatment for Staff module with submodules
    if (item.id === 'staff') {
      return (
        <div key={item.id} className="space-y-0.5">
          <button
            type="button"
            onClick={handleStaffClick}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isStaffActive
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isStaffActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">Staff</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isStaffActive ? "text-white" : "text-slate-400",
                  !isStaffExpanded && "-rotate-90"
                )}
              />
            </div>
          </button>

          {isStaffExpanded && (
            <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30">
              {staffSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive =
                  isStaffActive && (activeStaffSubTab === sub.id || (!activeStaffSubTab && sub.id === 'directory'));
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleStaffSubTabClick(sub.id)}
                    className={cn(
                      "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      isSubActive
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
                    )}
                  >
                    <SubIcon className={cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400")} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Special treatment for Students module with submodules
    if (item.id === 'students') {
      return (
        <div key="students" className="space-y-1">
          <button
            type="button"
            onClick={handleStudentsClick}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isStudentsActive
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isStudentsActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">Students</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isStudentsActive ? "text-white" : "text-slate-400",
                  !isStudentsExpanded && "-rotate-90"
                )}
              />
            </div>
          </button>

          {isStudentsExpanded && (
            <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30">
              {studentSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isStudentsActive && activeStudentSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleStudentSubTabClick(sub.id)}
                    className={cn(
                      "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      isSubActive
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
                    )}
                  >
                    <SubIcon className={cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400")} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Expandable Attendance Module for staff/admin, direct link for students
    if (item.id === 'attendance' && !isStudent) {
      return (
        <div key={item.id} className="space-y-0.5">
          <button
            type="button"
            onClick={handleAttendanceClick}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isAttendanceActive
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isAttendanceActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600 group-hover:scale-105"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">Attendance</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isAttendanceActive ? "text-white" : "text-slate-400",
                  !isAttendanceExpanded && "-rotate-90"
                )}
              />
            </div>
          </button>

          {isAttendanceExpanded && (
            <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-emerald-300">
              {attendanceSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isAttendanceActive && activeAttendanceSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleAttendanceSubTabClick(sub.id)}
                    className={cn(
                      "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      isSubActive
                        ? "bg-emerald-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60 dark:text-slate-400"
                    )}
                  >
                    <SubIcon className={cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400")} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Expandable Communication Module
    if (item.id === 'communication') {
      return (
        <div key={item.id} className="space-y-0.5">
          <button
            type="button"
            id="nav-communication-main"
            onClick={handleCommunicationClick}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isCommunicationActive
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isCommunicationActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">Communication</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isCommunicationActive ? "text-white" : "text-slate-400",
                  !isCommunicationExpanded && "-rotate-90"
                )}
              />
            </div>
          </button>

          {isCommunicationExpanded && (
            <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30">
              {communicationSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isCommunicationActive && activeCommunicationSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    id={`nav-communication-sub-${sub.id}`}
                    type="button"
                    onClick={() => handleCommunicationSubTabClick(sub.id)}
                    className={cn(
                      "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      isSubActive
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
                    )}
                  >
                    <SubIcon className={cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400")} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Expandable Examination Module
    if (item.id === 'examination') {
      return (
        <div key={item.id} className="space-y-0.5">
          <button
            type="button"
            id="nav-examination-main"
            onClick={handleExaminationClick}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isExaminationActive
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isExaminationActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">Examination</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isExaminationActive ? "text-white" : "text-slate-400",
                  !isExaminationExpanded && "-rotate-90"
                )}
              />
            </div>
          </button>

          {isExaminationExpanded && (
            <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30">
              {examinationSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isExaminationActive && activeExaminationSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    id={`nav-examination-sub-${sub.id}`}
                    type="button"
                    onClick={() => handleExaminationSubTabClick(sub.id)}
                    className={cn(
                      "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      isSubActive
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
                    )}
                  >
                    <SubIcon className={cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400")} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Standard Non-Expandable Module Item
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleMainMenuClick(item.id)}
        className={cn(
          "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
          isActive
            ? "bg-primary text-primary-foreground shadow-xs font-bold"
            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
        )}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
              isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="truncate">{item.label}</span>
        </div>

        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1"></span>}
      </button>
    );
  };

  // Reusable core sidebar navigation content (shared between desktop aside and mobile sheet)
  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 select-none">
      {/* Mobile Close Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Navigation Menu</span>
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-3">
        {/* Student Portal Mode */}
        {isStudent ? (
          <div className="space-y-1">
            <div className="px-3 pb-2 pt-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Student Portal
              </span>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                Active
              </span>
            </div>
            {studentMenuItems.map((item) => renderMenuItem(item))}
          </div>
        ) : (
          /* Staff & Admin 7 Collapsible Navigation Groups */
          NAVIGATION_GROUPS.map((group) => {
            // Filter modules belonging to this group that are permitted for the role
            const groupMenuItems = rawMenuItems.filter(
              (m) => group.modules.includes(m.id) && isModuleAllowed(m)
            );

            // Skip empty group if role has no access to any modules in it
            if (groupMenuItems.length === 0) return null;

            const isCollapsed = Boolean(collapsedGroups[group.id]);
            const hasActiveItem = groupMenuItems.some(
              (m) =>
                activeNav === m.id ||
                (m.id === 'students' && isStudentsActive) ||
                (m.id === 'attendance' && isAttendanceActive) ||
                (m.id === 'communication' && isCommunicationActive) ||
                (m.id === 'examination' && isExaminationActive) ||
                (m.id === 'anecdotes' && isAnecdotesActive) ||
                (m.id === 'staff' && isStaffActive)
            );

            return (
              <div key={group.id} className="space-y-1">
                {/* Collapsible Group Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="w-full px-2.5 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="truncate">{group.label}</span>
                    {hasActiveItem && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground">
                      {groupMenuItems.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground group-hover:text-foreground",
                        isCollapsed && "-rotate-90"
                      )}
                    />
                  </div>
                </button>

                {/* Group Modules Container */}
                {!isCollapsed && (
                  <div className="space-y-1 pl-1">
                    {groupMenuItems.map((item) => renderMenuItem(item))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* System Configuration (SuperAdmin / Permitted Admins) */}
        {hasAnySettingsPermission && !isStudent && (
          <div className="pt-2">
            <div className="border-t border-sidebar-border my-2"></div>
            <div className="space-y-1">
              {/* Settings Header Button */}
              <button
                type="button"
                onClick={handleSettingsClick}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
                  isSettingsActive
                    ? "bg-muted text-foreground border border-border font-bold"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                      isSettingsActive ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="truncate">Settings</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      !isSettingsExpanded && "-rotate-90"
                    )}
                  />
                </div>
              </button>

              {/* Collapsible Settings Sub-items */}
              {isSettingsExpanded && (
                <div className="relative pl-2 ml-3.5 pt-1 pb-1 space-y-1 border-l-2 border-border">
                  {/* 1. User Management (Super Admin Only) */}
                  {canViewBranchSettings && (
                    <button
                      type="button"
                      onClick={() => handleSubItemClick('users')}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        activeNav === 'users'
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                            activeNav === 'users' ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                          )}
                        >
                          <Shield className="w-3 h-3" />
                        </div>
                        <span>User Management</span>
                      </div>
                    </button>
                  )}

                  {/* 2. Menu Assignment */}
                  {canViewBranchSettings && (
                    <button
                      type="button"
                      onClick={() => handleSubItemClick('menu-assignment')}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        activeNav === 'menu-assignment'
                          ? "bg-emerald-600 text-white font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                            activeNav === 'menu-assignment' ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          <Key className="w-3 h-3" />
                        </div>
                        <span>Menu Assignment</span>
                      </div>
                    </button>
                  )}

                  {/* 3. Branch Settings */}
                  {canViewBranchSettings && (
                    <button
                      type="button"
                      onClick={() => handleSubItemClick('branch-settings')}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        activeNav === 'branch-settings'
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                            activeNav === 'branch-settings' ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                          )}
                        >
                          <Building2 className="w-3 h-3" />
                        </div>
                        <span>Branch Settings</span>
                      </div>
                      {branchCount > 0 && (
                        <span
                          className={cn(
                            "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                            activeNav === 'branch-settings'
                              ? "bg-primary-foreground/20 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {branchCount}
                        </span>
                      )}
                    </button>
                  )}

                  {/* 4. Academic Settings */}
                  {canViewAcademicSettings && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleSubItemClick('academic-settings');
                          if (onToggleAcademicExpand) onToggleAcademicExpand();
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          activeNav === 'academic-settings'
                            ? "bg-primary/10 text-primary font-bold border border-primary/20"
                            : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                              activeNav === 'academic-settings'
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            <Calendar className="w-3 h-3" />
                          </div>
                          <span>Academic Settings</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground",
                            !isAcademicExpanded && "-rotate-90"
                          )}
                        />
                      </button>

                      {/* Academic Settings Sub-Navigation */}
                      {isAcademicExpanded && (
                        <div className="pl-2 ml-2.5 pt-0.5 pb-0.5 space-y-0.5 border-l-2 border-primary/30">
                          {academicSubItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive =
                              activeNav === 'academic-settings' && activeAcademicSubTab === subItem.id;
                            return (
                              <button
                                key={subItem.id}
                                type="button"
                                onClick={() => handleAcademicSubTabClick(subItem.id)}
                                className={cn(
                                  "w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer",
                                  isSubActive
                                    ? subItem.activeClass
                                    : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded flex items-center justify-center shrink-0",
                                    isSubActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                                  )}
                                >
                                  <SubIcon className="w-2.5 h-2.5" />
                                </div>
                                <span className="truncate">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar text-muted-foreground">
        <div className="flex items-center space-x-2 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Multi-Branch ERP v2.4</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Responsive Mobile Sheet Drawer */}
      <Sheet
        open={isMobileOpen}
        onOpenChange={(open) => {
          if (!open && onCloseMobile) onCloseMobile();
        }}
      >
        <SheetContent
          side="left"
          className="p-0 w-64 max-w-[85vw] border-r border-sidebar-border bg-sidebar overflow-hidden md:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>School ERP Navigation Menu and Modules</SheetDescription>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
