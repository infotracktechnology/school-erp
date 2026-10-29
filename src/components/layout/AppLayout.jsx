import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavigationHeader } from './NavigationHeader';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { HistoricalYearBanner } from '../academic/HistoricalYearBanner';
import { ToastContainer } from '../common/Toast';
import { Sheet } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { useErp } from '../../context/ErpContext';
import { getOrganization } from '../../services/api';

export const AppLayout = ({ toasts, showToast, dismissToast }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { branches, activeBranchId, isSuperAdmin, isPrincipal, isStudent, userRole } = useErp();

  const [organization, setOrganization] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const [isAcademicExpanded, setIsAcademicExpanded] = useState(true);
  const [isStudentsExpanded, setIsStudentsExpanded] = useState(true);
  const [isAttendanceExpanded, setIsAttendanceExpanded] = useState(true);
  const [isCommunicationExpanded, setIsCommunicationExpanded] = useState(true);
  const [isExaminationExpanded, setIsExaminationExpanded] = useState(true);
  const [isAnecdotesExpanded, setIsAnecdotesExpanded] = useState(true);

  // Load organization profile
  useEffect(() => {
    getOrganization()
      .then((res) => setOrganization(res.organization))
      .catch((err) => console.warn('Org fetch notice:', err));
  }, []);

  // Derive active navigation item and sub-tabs from pathname
  const pathname = location.pathname;
  let activeNav = 'dashboard';
  let activeAcademicSubTab = 'academic-year';
  let activeStudentSubTab = 'details';
  let activeAttendanceSubTab = 'take_attendance';
  let activeCommunicationSubTab = 'homework';
  let activeExaminationSubTab = 'setup';
  let activeAnecdoteSubTab = 'logs';
  let activeStaffSubTab = 'directory';

  if (pathname.startsWith('/branches')) {
    activeNav = 'branch-settings';
  } else if (pathname.startsWith('/menu-assignment')) {
    activeNav = 'menu-assignment';
  } else if (pathname.startsWith('/academic')) {
    activeNav = 'academic-settings';
    const parts = pathname.split('/');
    if (parts[2]) activeAcademicSubTab = parts[2];
  } else if (pathname.startsWith('/anecdotes')) {
    activeNav = 'anecdotes';
    const parts = pathname.split('/');
    if (parts[2]) activeAnecdoteSubTab = parts[2];
  } else if (pathname.startsWith('/staff')) {
    activeNav = 'staff';
    const parts = pathname.split('/');
    if (parts[2]) activeStaffSubTab = parts[2];
  } else if (pathname.startsWith('/students')) {
    activeNav = 'students';
    const parts = pathname.split('/');
    if (parts[2]) activeStudentSubTab = parts[2];
  } else if (pathname.startsWith('/attendance')) {
    activeNav = 'attendance';
    const parts = pathname.split('/');
    if (parts[2]) activeAttendanceSubTab = parts[2];
  } else if (pathname.startsWith('/communication')) {
    activeNav = 'communication';
    const parts = pathname.split('/');
    if (parts[2]) activeCommunicationSubTab = parts[2];
  } else if (pathname.startsWith('/examination')) {
    activeNav = 'examination';
    const parts = pathname.split('/');
    if (parts[2]) activeExaminationSubTab = parts[2];
  } else if (pathname.startsWith('/student')) {
    const parts = pathname.split('/');
    const studentSub = parts[2] || 'homework';
    activeNav = studentSub;
    activeCommunicationSubTab = studentSub;
  } else if (pathname !== '/' && pathname !== '/dashboard') {
    activeNav = pathname.replace(/^\//, '');
  }

  const handleSelectNav = (navId) => {
    switch (navId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'branch-settings':
        navigate('/branches');
        break;
      case 'menu-assignment':
        navigate('/menu-assignment');
        break;
      case 'academic-settings':
        navigate(`/academic/${activeAcademicSubTab || 'academic-year'}`);
        break;
      case 'academics':
        if (isSuperAdmin) {
          navigate(`/academic/${activeAcademicSubTab || 'academic-year'}`);
        } else {
          navigate('/academics');
        }
        break;
      case 'students':
        navigate(`/students/${activeStudentSubTab || 'details'}`);
        break;
      case 'attendance':
        if (isStudent) {
          navigate('/student/attendance');
        } else {
          navigate(`/attendance/${activeAttendanceSubTab || 'take_attendance'}`);
        }
        break;
      case 'communication':
        if (isStudent) {
          navigate(`/student/${activeCommunicationSubTab || 'homework'}`);
        } else {
          navigate(`/communication/${activeCommunicationSubTab || 'homework'}`);
        }
        break;
      case 'examination':
        navigate(`/examination/${activeExaminationSubTab || 'setup'}`);
        break;
      case 'calendar':
        if (isStudent) {
          navigate('/student/calendar');
        } else {
          navigate('/calendar');
        }
        break;
      case 'anecdotes':
        if (isStudent) {
          navigate('/student/anecdotes');
        } else {
          navigate(`/anecdotes/${activeAnecdoteSubTab || 'logs'}`);
        }
        break;
      case 'staff':
        navigate(`/staff/${activeStaffSubTab || 'directory'}`);
        break;
      case 'modules':
        navigate('/modules');
        break;
      case 'timetable':
        if (isStudent) {
          navigate('/student/timetable');
        } else {
          navigate('/timetable');
        }
        break;
      case 'homework':
        navigate('/student/homework');
        break;
      case 'assignment':
        navigate('/student/assignment');
        break;
      case 'announcement':
        navigate('/student/announcement');
        break;
      case 'gallery':
        navigate('/student/gallery');
        break;
      case 'profile':
        navigate('/student/profile');
        break;
      default:
        navigate(`/${navId}`);
        break;
    }
  };

  // Check if current page is Student Update spreadsheet matrix
  const isStudentUpdatePage =
    pathname === '/students/update' || (activeNav === 'students' && activeStudentSubTab === 'update');

  const safeActiveNav = typeof activeNav === 'string' ? activeNav : 'dashboard';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/20 selection:text-accent-foreground font-sans">
      {/* Top Navbar with Organization context, Branch & Year switchers, User Profile & Mobile Toggle */}
      <NavigationHeader
        organization={organization}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        onNavigateToAcademicYears={() => {
          setIsSettingsExpanded(true);
          setIsAcademicExpanded(true);
          navigate('/academic/academic-year');
        }}
      />

      {/* Historical Academic Year Read-Only Warning Banner */}
      <HistoricalYearBanner />

      {/* Main Layout Container: Sidebar + Content Area */}
      <div className="flex-1 flex w-full relative">
        {/* Left ERP Sidebar (Hidden on Student Update to give full-width spreadsheet) */}
        {/* Mobile drawer is encapsulated via shadcn Sheet inside Sidebar */}
        {!isStudentUpdatePage && (
          <Sidebar
            activeNav={safeActiveNav}
            onSelectNav={handleSelectNav}
            isSettingsExpanded={isSettingsExpanded}
            onToggleSettingsExpand={() => setIsSettingsExpanded((prev) => !prev)}
            activeAcademicSubTab={activeAcademicSubTab}
            onSelectAcademicSubTab={(tab) => {
              navigate(`/academic/${tab}`);
            }}
            isAcademicExpanded={isAcademicExpanded}
            onToggleAcademicExpand={() => setIsAcademicExpanded((prev) => !prev)}
            activeStudentSubTab={activeStudentSubTab}
            onSelectStudentSubTab={(tab) => {
              navigate(`/students/${tab}`);
            }}
            isStudentsExpanded={isStudentsExpanded}
            onToggleStudentsExpand={() => setIsStudentsExpanded((prev) => !prev)}
            activeAttendanceSubTab={activeAttendanceSubTab}
            onSelectAttendanceSubTab={(tab) => {
              navigate(`/attendance/${tab}`);
            }}
            isAttendanceExpanded={isAttendanceExpanded}
            onToggleAttendanceExpand={() => setIsAttendanceExpanded((prev) => !prev)}
            activeCommunicationSubTab={activeCommunicationSubTab}
            onSelectCommunicationSubTab={(tab) => {
              if (isStudent) {
                navigate(`/student/${tab}`);
              } else {
                navigate(`/communication/${tab}`);
              }
            }}
            isCommunicationExpanded={isCommunicationExpanded}
            onToggleCommunicationExpand={() => setIsCommunicationExpanded((prev) => !prev)}
            activeExaminationSubTab={activeExaminationSubTab}
            onSelectExaminationSubTab={(tab) => {
              navigate(`/examination/${tab}`);
            }}
            isExaminationExpanded={isExaminationExpanded}
            onToggleExaminationExpand={() => setIsExaminationExpanded((prev) => !prev)}
            activeAnecdoteSubTab={activeAnecdoteSubTab}
            onSelectAnecdoteSubTab={(tab) => {
              navigate(`/anecdotes/${tab}`);
            }}
            isAnecdotesExpanded={isAnecdotesExpanded}
            onToggleAnecdotesExpand={() => setIsAnecdotesExpanded((prev) => !prev)}
            activeStaffSubTab={activeStaffSubTab}
            onSelectStaffSubTab={(tab) => {
              navigate(`/staff/${tab}`);
            }}
            isStaffExpanded={true}
            onToggleStaffExpand={() => {}}
            userPermissions={{ 
              canViewBranchSettings: isSuperAdmin, 
              canViewAcademicSettings: isSuperAdmin 
            }}
            userRole={userRole}
            isStudent={isStudent}
            branchCount={branches.length}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Right Main Content Body */}
        <main
          className={`flex-1 min-w-0 transition-all duration-200 ${
            isStudentUpdatePage ? 'w-full px-4 sm:px-6 py-4 max-w-none' : 'px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full'
          }`}
        >
          {/* Breadcrumb Hierarchy */}
          <Breadcrumb
            activeNav={safeActiveNav}
            onNavigate={handleSelectNav}
            branchName={
              safeActiveNav === 'academic-settings' && activeBranchId
                ? branches.find((b) => b.id === activeBranchId)?.branch_code
                : undefined
            }
            academicSubTab={activeAcademicSubTab}
            studentSubTab={activeStudentSubTab}
            attendanceSubTab={activeAttendanceSubTab}
            communicationSubTab={activeCommunicationSubTab}
          />

          {/* Routed Page Content */}
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card/60 backdrop-blur-xs py-3.5 text-center text-xs text-muted-foreground font-medium">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">EduCampus ERP</span>
            <span className="text-border">•</span>
            <span>Enterprise Architecture</span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="text-primary font-semibold hidden sm:inline">
              {safeActiveNav === 'branch-settings'
                ? 'Settings → Branch Settings'
                : safeActiveNav === 'academic-settings'
                ? `Settings → Academic Settings → ${activeAcademicSubTab}`
                : safeActiveNav.charAt(0).toUpperCase() + safeActiveNav.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] py-0 px-2 font-mono border-border text-muted-foreground">
              v2.4.0
            </Badge>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-Time Sync
            </span>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts || []} onDismiss={dismissToast} />
    </div>
  );
};

export default AppLayout;
