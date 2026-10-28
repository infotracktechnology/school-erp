import React from 'react';
import { Sparkles, Star, LayoutDashboard, Users, User, UserCheck, CalendarCheck, BookOpen, Award, CreditCard, MessageSquare, Briefcase, Bus, Bookmark, BarChart3, Settings, Building2, Calendar, Layers, GitMerge, ChevronDown, ChevronRight, ShieldCheck, Shield, Key, X, Edit, ArrowRightLeft, TrendingUp, UserX, Clock, CheckSquare, History, FileCheck2, Bell, Image, Sliders, FileSpreadsheet, FileText } from 'lucide-react';
export const Sidebar = ({ activeNav, onSelectNav, isSettingsExpanded, onToggleSettingsExpand, activeAcademicSubTab = 'academic-year', onSelectAcademicSubTab, isAcademicExpanded = true, onToggleAcademicExpand, activeStudentSubTab = 'details', onSelectStudentSubTab, isStudentsExpanded = true, onToggleStudentsExpand, activeAttendanceSubTab = 'take_attendance', onSelectAttendanceSubTab, isAttendanceExpanded = true, onToggleAttendanceExpand, activeCommunicationSubTab = 'homework', onSelectCommunicationSubTab, isCommunicationExpanded = true, onToggleCommunicationExpand, activeExaminationSubTab = 'setup', onSelectExaminationSubTab, isExaminationExpanded = true, onToggleExaminationExpand, activeAnecdoteSubTab = 'logs', onSelectAnecdoteSubTab, isAnecdotesExpanded = true, onToggleAnecdotesExpand, activeStaffSubTab = 'directory', onSelectStaffSubTab, isStaffExpanded = true, onToggleStaffExpand, userPermissions = { canViewBranchSettings: true, canViewAcademicSettings: true }, userRole = '', isStudent = false, branchCount = 0, isMobileOpen = false, onCloseMobile }) => {
    const { canViewBranchSettings = true, canViewAcademicSettings = true } = userPermissions;
    const isSuperAdminUser = userRole === 'super_admin';
    const hasAnySettingsPermission = isSuperAdminUser && (canViewBranchSettings || canViewAcademicSettings);
    const isSettingsActive = activeNav === 'branch-settings' || activeNav === 'academic-settings' || activeNav === 'users' || activeNav === 'menu-assignment';
    const isStudentsActive = activeNav === 'students';
    const isAttendanceActive = activeNav === 'attendance';
    const isCommunicationActive = activeNav === 'communication';
    const isExaminationActive = activeNav === 'examination';
    const isAnecdotesActive = activeNav === 'anecdotes';
    const isStaffActive = activeNav === 'staff';

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
    ];
    const rawMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50', activeBg: 'bg-indigo-700 text-white' },
        { id: 'modules', label: 'Modules Showcase', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50', activeBg: 'bg-gradient-to-r from-amber-600 to-indigo-700 text-white' },
        { id: 'anecdotes', label: 'Anecdotes', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-700 text-white' },
        { id: 'students', label: 'Students', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50', activeBg: 'bg-sky-700 text-white' },
        { id: 'staff', label: 'Staff', icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50', activeBg: 'bg-teal-700 text-white' },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', activeBg: 'bg-emerald-700 text-white' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', activeBg: 'bg-rose-700 text-white' },
        { id: 'timetable', label: 'Timetable', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', activeBg: 'bg-blue-700 text-white' },
        { id: 'academics', label: 'Academics', icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50', activeBg: 'bg-violet-700 text-white' },
        { id: 'examination', label: 'Examination', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-700 text-white' },
        { id: 'finance', label: 'Finance', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50', activeBg: 'bg-amber-700 text-white' },
        { id: 'communication', label: 'Communication', icon: MessageSquare, color: 'text-cyan-600', bg: 'bg-cyan-50', activeBg: 'bg-cyan-700 text-white' },
        { id: 'hr', label: 'HR', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50', activeBg: 'bg-rose-700 text-white' },
        { id: 'transport', label: 'Transport', icon: Bus, color: 'text-orange-600', bg: 'bg-orange-50', activeBg: 'bg-orange-700 text-white' },
        { id: 'library', label: 'Library', icon: Bookmark, color: 'text-emerald-700', bg: 'bg-emerald-50', activeBg: 'bg-emerald-800 text-white' },
        { id: 'reports', label: 'Reports', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50', activeBg: 'bg-indigo-700 text-white' },
    ];

    // For students: individual distinct first-class menu items (no accordion submenu)
    const studentMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50', activeBg: 'bg-indigo-700 text-white' },
        { id: 'anecdotes', label: 'My Merits & Remarks', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-700 text-white' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', activeBg: 'bg-rose-700 text-white' },
        { id: 'timetable', label: 'Timetable', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', activeBg: 'bg-blue-700 text-white' },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', activeBg: 'bg-emerald-700 text-white' },
        { id: 'homework', label: 'Homework', icon: BookOpen, color: 'text-cyan-600', bg: 'bg-cyan-50', activeBg: 'bg-cyan-700 text-white' },
        { id: 'assignment', label: 'Assignment', icon: FileCheck2, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-700 text-white' },
        { id: 'announcement', label: 'Announcement', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50', activeBg: 'bg-amber-700 text-white' },
        { id: 'gallery', label: 'Gallery', icon: Image, color: 'text-rose-600', bg: 'bg-rose-50', activeBg: 'bg-rose-700 text-white' },
        { id: 'profile', label: 'My Profile', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50', activeBg: 'bg-emerald-700 text-white' },
    ];

    const menuItems = isStudent ? studentMenuItems : rawMenuItems;

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
        onToggleSettingsExpand();
        if (!isSettingsActive) {
            if (canViewBranchSettings) {
                onSelectNav('branch-settings');
            }
            else if (canViewAcademicSettings) {
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
        { id: 'academic-year', label: 'Academic Year', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', activeClass: 'bg-indigo-700 text-white shadow-xs' },
        { id: 'classes', label: 'Classes', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50', activeClass: 'bg-emerald-700 text-white shadow-xs' },
        { id: 'sections', label: 'Sections', icon: Bookmark, color: 'text-amber-600', bg: 'bg-amber-50', activeClass: 'bg-amber-700 text-white shadow-xs' },
        { id: 'class-section', label: 'Class & Section', icon: GitMerge, color: 'text-violet-600', bg: 'bg-violet-50', activeClass: 'bg-violet-700 text-white shadow-xs' },
        { id: 'subjects', label: 'Subjects', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50', activeClass: 'bg-teal-700 text-white shadow-xs' },
    ];
    const sidebarContent = (<div className="flex flex-col h-full bg-white border-r border-slate-200/90 w-64 select-none">
      {/* Mobile Close Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Navigation Menu</span>
        <button type="button" onClick={onCloseMobile} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer">
          <X className="w-5 h-5"/>
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        <div className="px-3 pb-2 pt-1 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Modules
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
            12 Active
          </span>
        </div>

        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            // Expandable Anecdotes Module for staff/admin
            if (item.id === 'anecdotes' && !isStudent) {
                return (
                  <div key="anecdotes" className="space-y-1">
                    <button
                      type="button"
                      onClick={handleAnecdotesClick}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${
                        isAnecdotesActive
                          ? 'bg-purple-700 text-white shadow-xs font-bold'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isAnecdotesActive
                              ? 'bg-white/20 text-white'
                              : `${item.bg} ${item.color} group-hover:scale-105`
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">Anecdotes</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {isAnecdotesExpanded ? (
                          <ChevronDown className={`w-4 h-4 transition-transform ${isAnecdotesActive ? 'text-white' : 'text-slate-400'}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 transition-transform ${isAnecdotesActive ? 'text-white' : 'text-slate-400'}`} />
                        )}
                      </div>
                    </button>

                    {/* Submodules List under Anecdotes */}
                    {isAnecdotesExpanded && (
                      <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-purple-200">
                        {anecdoteSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = isAnecdotesActive && (activeAnecdoteSubTab === sub.id || (!activeAnecdoteSubTab && sub.id === 'logs'));
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleAnecdoteSubTabClick(sub.id)}
                              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isSubActive
                                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
                              }`}
                            >
                              <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
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
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${
                        isStaffActive
                          ? 'bg-teal-700 text-white shadow-xs font-bold'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isStaffActive
                              ? 'bg-white/20 text-white'
                              : `${item.bg} ${item.color} group-hover:scale-105`
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">Staff</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {isStaffExpanded ? (
                          <ChevronDown className={`w-4 h-4 transition-transform ${isStaffActive ? 'text-white' : 'text-slate-400'}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 transition-transform ${isStaffActive ? 'text-white' : 'text-slate-400'}`} />
                        )}
                      </div>
                    </button>

                    {/* Submodules List under Staff */}
                    {isStaffExpanded && (
                      <div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-teal-200">
                        {staffSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = isStaffActive && (activeStaffSubTab === sub.id || (!activeStaffSubTab && sub.id === 'directory'));
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleStaffSubTabClick(sub.id)}
                              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isSubActive
                                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-teal-50/60'
                              }`}
                            >
                              <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
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
                return (<div key="students" className="space-y-1">
                <button type="button" onClick={handleStudentsClick} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${isStudentsActive
                        ? `${item.activeBg} shadow-xs font-bold`
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isStudentsActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color} group-hover:scale-105`}`}>
                      <Icon className="w-4 h-4"/>
                    </div>
                    <span className="truncate">Students</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isStudentsExpanded ? (<ChevronDown className={`w-4 h-4 transition-transform ${isStudentsActive ? 'text-white' : 'text-slate-400'}`}/>) : (<ChevronRight className={`w-4 h-4 transition-transform ${isStudentsActive ? 'text-white' : 'text-slate-400'}`}/>)}
                  </div>
                </button>

                {/* Submodules List under Students */}
                {isStudentsExpanded && (<div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-slate-200">
                    {studentSubItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive = isStudentsActive && activeStudentSubTab === sub.id;
                            return (<button key={sub.id} type="button" onClick={() => handleStudentSubTabClick(sub.id)} className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSubActive
                                    ? 'bg-sky-700 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/60'}`}>
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`}/>
                          <span className="truncate">{sub.label}</span>
                        </button>);
                        })}
                  </div>)}
              </div>);
            }
            // Expandable Attendance Module for staff/admin, direct link for students
            if (item.id === 'attendance' && !isStudent) {
                return (<div key={item.id} className="space-y-0.5">
                <button type="button" onClick={handleAttendanceClick} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${isAttendanceActive
                        ? 'bg-emerald-700 text-white shadow-xs font-bold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isAttendanceActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color} group-hover:scale-105`}`}>
                      <Icon className="w-4 h-4"/>
                    </div>
                    <span className="truncate">Attendance</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isAttendanceExpanded ? (<ChevronDown className={`w-4 h-4 transition-transform ${isAttendanceActive ? 'text-white' : 'text-slate-400'}`}/>) : (<ChevronRight className={`w-4 h-4 transition-transform ${isAttendanceActive ? 'text-white' : 'text-slate-400'}`}/>)}
                  </div>
                </button>

                {/* Submodules List under Attendance */}
                {isAttendanceExpanded && (<div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-slate-200">
                    {attendanceSubItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive = isAttendanceActive && activeAttendanceSubTab === sub.id;
                            return (<button key={sub.id} type="button" onClick={() => handleAttendanceSubTabClick(sub.id)} className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSubActive
                                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'}`}>
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`}/>
                          <span className="truncate">{sub.label}</span>
                        </button>);
                        })}
                  </div>)}
              </div>);
            }
            // Expandable Communication Module with 4 Submenus (Homework, Assignment, Announcement, Gallery)
            if (item.id === 'communication') {
                return (<div key={item.id} className="space-y-0.5">
                <button type="button" id="nav-communication-main" onClick={handleCommunicationClick} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${isCommunicationActive
                        ? 'bg-cyan-700 text-white shadow-xs font-bold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isCommunicationActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color} group-hover:scale-105`}`}>
                      <Icon className="w-4 h-4"/>
                    </div>
                    <span className="truncate">Communication</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isCommunicationExpanded ? (<ChevronDown className={`w-4 h-4 transition-transform ${isCommunicationActive ? 'text-white' : 'text-slate-400'}`}/>) : (<ChevronRight className={`w-4 h-4 transition-transform ${isCommunicationActive ? 'text-white' : 'text-slate-400'}`}/>)}
                  </div>
                </button>

                {/* Submodules List under Communication: Homework, Assignment, Announcement, Gallery */}
                {isCommunicationExpanded && (<div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-slate-200">
                    {communicationSubItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive = isCommunicationActive && activeCommunicationSubTab === sub.id;
                            return (<button key={sub.id} id={`nav-communication-sub-${sub.id}`} type="button" onClick={() => handleCommunicationSubTabClick(sub.id)} className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSubActive
                                    ? 'bg-cyan-700 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-cyan-50/60'}`}>
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`}/>
                          <span className="truncate">{sub.label}</span>
                        </button>);
                        })}
                  </div>)}
              </div>);
            }
            // Expandable Examination Module with 4 Submenus
            if (item.id === 'examination') {
                return (<div key={item.id} className="space-y-0.5">
                <button type="button" id="nav-examination-main" onClick={handleExaminationClick} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${isExaminationActive
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isExaminationActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color} group-hover:scale-105`}`}>
                      <Icon className="w-4 h-4"/>
                    </div>
                    <span className="truncate">Examination</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isExaminationExpanded ? (<ChevronDown className={`w-4 h-4 transition-transform ${isExaminationActive ? 'text-white' : 'text-slate-400'}`}/>) : (<ChevronRight className={`w-4 h-4 transition-transform ${isExaminationActive ? 'text-white' : 'text-slate-400'}`}/>)}
                  </div>
                </button>

                {/* Submodules List under Examination: Setup Wizard, Marks Entry, Results, Report Card */}
                {isExaminationExpanded && (<div className="relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-slate-200">
                    {examinationSubItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive = isExaminationActive && activeExaminationSubTab === sub.id;
                            return (<button key={sub.id} id={`nav-examination-sub-${sub.id}`} type="button" onClick={() => handleExaminationSubTabClick(sub.id)} className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSubActive
                                    ? 'bg-purple-700 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'}`}>
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`}/>
                          <span className="truncate">{sub.label}</span>
                        </button>);
                        })}
                  </div>)}
              </div>);
            }
            return (<button key={item.id} type="button" onClick={() => handleMainMenuClick(item.id)} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${isActive
                    ? `${item.activeBg} shadow-xs font-bold`
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color} group-hover:scale-105`}`}>
                  <Icon className="w-4 h-4"/>
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {isActive && (<span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1"></span>)}
            </button>);
        })}

        {/* Divider before Settings */}
        {hasAnySettingsPermission && (<div className="pt-3 pb-1 px-3">
            <div className="border-t border-slate-200/80 my-1"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              System Configuration
            </span>
          </div>)}

        {/* Expandable / Collapsible Settings Menu */}
        {hasAnySettingsPermission && (<div className="space-y-1">
            {/* Top-Level Settings Button */}
            <button type="button" onClick={handleSettingsClick} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isSettingsActive
                ? 'bg-slate-100/90 text-slate-900 border border-slate-300 font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSettingsActive ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
                  <Settings className="w-4 h-4"/>
                </div>
                <span>Settings</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {isSettingsExpanded ? (<ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200"/>) : (<ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-200"/>)}
              </div>
            </button>

            {/* Collapsible Sub-items */}
            {isSettingsExpanded && (<div className="relative pl-2 ml-3.5 pt-1 pb-1 space-y-1 border-l-2 border-slate-200">
                {/* 1. User Management (Super Admin Only) */}
                {canViewBranchSettings && (
                  <button
                    type="button"
                    onClick={() => handleSubItemClick('users')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeNav === 'users'
                        ? 'bg-indigo-700 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-indigo-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${activeNav === 'users' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        <Shield className="w-3 h-3"/>
                      </div>
                      <span>User Management</span>
                    </div>
                  </button>
                )}

                {/* 1.5. Menu Assignment (Access Control for Teaching & Non-Teaching) */}
                {canViewBranchSettings && (
                  <button
                    type="button"
                    onClick={() => handleSubItemClick('menu-assignment')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeNav === 'menu-assignment'
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${activeNav === 'menu-assignment' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                        <Key className="w-3 h-3"/>
                      </div>
                      <span>Menu Assignment</span>
                    </div>
                  </button>
                )}

                {/* 2. Branch Settings */}
                {canViewBranchSettings && (<button type="button" onClick={() => handleSubItemClick('branch-settings')} className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeNav === 'branch-settings'
                        ? 'bg-sky-700 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/50'}`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${activeNav === 'branch-settings' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'}`}>
                        <Building2 className="w-3 h-3"/>
                      </div>
                      <span>Branch Settings</span>
                    </div>
                    {branchCount > 0 && (<span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeNav === 'branch-settings' ? 'bg-sky-900/60 text-white' : 'bg-sky-100 text-sky-800'}`}>
                        {branchCount}
                      </span>)}
                  </button>)}

                {/* 3. Academic Settings */}
                {canViewAcademicSettings && (<div className="space-y-1">
                    <button type="button" onClick={() => {
                        handleSubItemClick('academic-settings');
                        if (onToggleAcademicExpand)
                            onToggleAcademicExpand();
                    }} className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeNav === 'academic-settings'
                        ? 'bg-violet-50 text-violet-900 font-bold border border-violet-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-violet-50/40'}`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${activeNav === 'academic-settings' ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700'}`}>
                          <Calendar className="w-3 h-3"/>
                        </div>
                        <span>Academic Settings</span>
                      </div>
                      {isAcademicExpanded ? (<ChevronDown className="w-3.5 h-3.5 text-violet-500"/>) : (<ChevronRight className="w-3.5 h-3.5 text-slate-400"/>)}
                    </button>

                    {/* Academic Settings Sub-Navigation: Academic Year, Classes, Sections, Class & Section */}
                    {isAcademicExpanded && (<div className="pl-2 ml-2.5 pt-0.5 pb-0.5 space-y-0.5 border-l-2 border-violet-200">
                        {academicSubItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = activeNav === 'academic-settings' && activeAcademicSubTab === subItem.id;
                            return (<button key={subItem.id} type="button" onClick={() => handleAcademicSubTabClick(subItem.id)} className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${isSubActive
                                    ? subItem.activeClass
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                              <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${isSubActive ? 'bg-white/20 text-white' : `${subItem.bg} ${subItem.color}`}`}>
                                <SubIcon className="w-2.5 h-2.5"/>
                              </div>
                              <span className="truncate">{subItem.label}</span>
                            </button>);
                        })}
                      </div>)}
                  </div>)}
              </div>)}
          </div>)}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-slate-200/90 bg-slate-50/70">
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0"/>
          <span className="truncate">Multi-Branch ERP v2.4</span>
        </div>
      </div>
    </div>);
    return (<>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (<div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile}></div>
        </div>)}
    </>);
};
