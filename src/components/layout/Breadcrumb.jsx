import React from 'react';
import { ChevronRight, Settings, Building2, Calendar, LayoutDashboard, Sparkles, GraduationCap, Layers, Bookmark, GitMerge, Users, Edit, ArrowRightLeft, TrendingUp, UserX, ShieldCheck } from 'lucide-react';
import { CalendarCheck, Clock, CheckSquare, History, BarChart3, MessageSquare, BookOpen, FileCheck2, Bell, Image, UserCheck } from 'lucide-react';
export const Breadcrumb = ({ activeNav, onNavigate, branchName, academicSubTab, studentSubTab, attendanceSubTab, communicationSubTab }) => {
    if (activeNav === 'dashboard') {
        return (<nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium py-2.5">
        <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700"/>
          <span>Dashboard</span>
        </div>
      </nav>);
    }
    const isSettingsModule = activeNav === 'branch-settings' || activeNav === 'academic-settings';
    const isStudentsModule = activeNav === 'students';
    const isAttendanceModule = activeNav === 'attendance';
    const isCommunicationModule = activeNav === 'communication';
    const formatModuleName = (id) => {
        return id.charAt(0).toUpperCase() + id.slice(1);
    };
    const getCommunicationSubTabConfig = (tab) => {
        switch (tab) {
            case 'assignment':
                return { label: 'Assignment', icon: FileCheck2 };
            case 'announcement':
                return { label: 'Announcement', icon: Bell };
            case 'gallery':
                return { label: 'Gallery', icon: Image };
            case 'dashboard':
                return { label: 'Monitoring & Stats', icon: BarChart3 };
            case 'portal':
                return { label: 'Student Portal Feed', icon: UserCheck };
            case 'audit':
                return { label: 'Audit Trail', icon: History };
            case 'homework':
            default:
                return { label: 'Homework', icon: BookOpen };
        }
    };
    const getAttendanceSubTabConfig = (tab) => {
        switch (tab) {
            case 'timings':
                return { label: 'Attendance Time', icon: Clock };
            case 'history':
                return { label: 'Attendance History', icon: History };
            case 'reports':
                return { label: 'Attendance Reports', icon: BarChart3 };
            case 'remarks':
                return { label: 'Remarks Settings', icon: MessageSquare };
            case 'take_attendance':
            default:
                return { label: 'Take Attendance', icon: CheckSquare };
        }
    };
    const getStudentSubTabConfig = (tab) => {
        switch (tab) {
            case 'update':
                return { label: 'Student Update', icon: Edit };
            case 'class-section-changes':
                return { label: 'Class & Section Changes', icon: ArrowRightLeft };
            case 'promotion':
                return { label: 'Student Promotion', icon: TrendingUp };
            case 'academic-groups':
                return { label: 'Academic Groups', icon: Layers };
            case 'inactive':
                return { label: 'Inactive Students / TC', icon: UserX };
            case 'approvals':
                return { label: 'Student Approvals', icon: ShieldCheck };
            case 'details':
            default:
                return { label: 'Student Details', icon: Users };
        }
    };
    const getAcademicSubTabConfig = (tab) => {
        switch (tab) {
            case 'classes':
                return { label: 'Classes', icon: Layers };
            case 'sections':
                return { label: 'Sections', icon: Bookmark };
            case 'class-section':
                return { label: 'Class & Section', icon: GitMerge };
            case 'subjects':
                return { label: 'Subjects', icon: BookOpen };
            case 'academic-year':
            default:
                return { label: 'Academic Year', icon: Calendar };
        }
    };
    const academicConfig = getAcademicSubTabConfig(academicSubTab);
    const AcademicIcon = academicConfig.icon;
    const studentConfig = getStudentSubTabConfig(studentSubTab);
    const StudentIcon = studentConfig.icon;
    return (<nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium py-2.5 flex-wrap">
      {/* Root Dashboard */}
      <button type="button" onClick={() => onNavigate('dashboard')} className="flex items-center space-x-1.5 text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer">
        <LayoutDashboard className="w-3.5 h-3.5"/>
        <span>Dashboard</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0"/>

      {isSettingsModule ? (<>
          {/* Settings Section */}
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <Settings className="w-3.5 h-3.5 text-emerald-700"/>
            <span>Settings</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0"/>

          {activeNav === 'branch-settings' ? (<div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
              <Building2 className="w-3.5 h-3.5 text-emerald-700"/>
              <span>Branch Settings</span>
            </div>) : (<>
              <button type="button" onClick={() => onNavigate('academic-settings')} className="flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700"/>
                <span>Academic Settings</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                <AcademicIcon className="w-3.5 h-3.5 text-emerald-700"/>
                <span>{academicConfig.label}</span>
              </div>
            </>)}

          {branchName && (<>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0"/>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {branchName}
              </span>
            </>)}
        </>) : isStudentsModule ? (<>
          <button type="button" onClick={() => onNavigate('students')} className="flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer">
            <Users className="w-3.5 h-3.5 text-emerald-700"/>
            <span>Students (SIS)</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
          <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
            <StudentIcon className="w-3.5 h-3.5 text-emerald-700"/>
            <span>{studentConfig.label}</span>
          </div>
        </>) : isAttendanceModule ? (<>
          <button type="button" onClick={() => onNavigate('attendance')} className="flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-700"/>
            <span>Attendance</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
          {(() => {
                const attConfig = getAttendanceSubTabConfig(attendanceSubTab);
                const AttIcon = attConfig.icon;
                return (<div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                <AttIcon className="w-3.5 h-3.5 text-emerald-700"/>
                <span>{attConfig.label}</span>
              </div>);
            })()}
        </>) : isCommunicationModule ? (<>
          <button type="button" onClick={() => onNavigate('communication')} className="flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700"/>
            <span>Communication</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
          {(() => {
                const commConfig = getCommunicationSubTabConfig(communicationSubTab);
                const CommIcon = commConfig.icon;
                return (<div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                <CommIcon className="w-3.5 h-3.5 text-emerald-700"/>
                <span>{commConfig.label}</span>
              </div>);
            })()}
        </>) : (<div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700"/>
          <span>{formatModuleName(activeNav)}</span>
        </div>)}
    </nav>);
};
