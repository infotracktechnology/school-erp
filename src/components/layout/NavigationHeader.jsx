import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ShieldCheck,
  Shield,
  Building2,
  User,
  LogOut,
  Calendar,
  Sparkles,
  Settings,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AcademicYearSelector } from '../academic/AcademicYearSelector';
import { BranchSelector } from '../branches/BranchSelector';
import { useErp } from '../../context/ErpContext';

export const NavigationHeader = ({ organization, onToggleMobileMenu, onNavigateToAcademicYears }) => {
  const navigate = useNavigate();
  const {
    currentUser,
    logoutUser,
    userRole,
    setUserRole,
    isSuperAdmin,
    isPrincipal,
    isStudent,
    assignedBranch,
    assignedBranchId,
    setAssignedBranchId,
    branches,
    activeAcademicYear,
    academicYearLifecycle,
    isCurrentYear,
    isUpcomingYear
  } = useErp();

  // Compute initials for Avatar fallback
  const getUserInitials = () => {
    if (currentUser?.name) {
      const parts = currentUser.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (isStudent) return 'ST';
    if (isSuperAdmin) return 'SA';
    return 'PR';
  };

  const userInitials = getUserInitials();
  const userNameDisplay = currentUser?.name || (isSuperAdmin ? 'Super Admin' : isStudent ? 'Student' : 'Principal');
  const userSubtitle = isStudent
    ? (currentUser?.student?.admission_number ? `Adm: ${currentUser.student.admission_number}` : 'Student Account')
    : isSuperAdmin
    ? 'All Branches Access'
    : assignedBranch?.branch_name || 'Assigned Branch';

  const roleBadgeLabel = isSuperAdmin
    ? 'Super Admin'
    : isStudent
    ? 'Student'
    : isPrincipal
    ? 'Principal'
    : userRole || 'Staff';

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-xs backdrop-blur-md bg-card/95">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Left: Hamburger (Mobile) + School Logo & Brand Typography */}
          <div className="flex items-center space-x-3 shrink-0">
            {onToggleMobileMenu && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleMobileMenu}
                className="md:hidden text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                title="Toggle Menu"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card border border-border p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden ring-1 ring-primary/10">
              <img src="/assets/logo.png" alt="EduCampus ERP Logo" className="w-full h-full object-contain" />
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight">
                  {organization?.name || 'EduCampus ERP'}
                </span>
                <Badge
                  variant={isSuperAdmin ? 'emerald' : 'outline'}
                  className="hidden xl:inline-flex text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5"
                >
                  {isSuperAdmin ? 'All Branches Access' : 'Assigned Branch Scope'}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[180px] sm:max-w-[280px]">
                {isSuperAdmin ? 'Centralized Enterprise Management' : `Campus: ${assignedBranch?.branch_name || 'Assigned Branch'}`}
              </p>
            </div>
          </div>

          {/* Center: Reintegrated Branch Selector + Academic Year Life Cycle Selector */}
          <div className="flex items-center space-x-2 sm:space-x-3 py-1 relative">
            {/* Reintegrated Branch Selector with multi-campus role scoping */}
            <div className="flex items-center">
              <BranchSelector />
            </div>

            {/* Academic Year Cycle Status Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-muted/60 border border-border text-[11px] font-medium text-muted-foreground shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${isCurrentYear ? 'bg-emerald-500 animate-pulse' : isUpcomingYear ? 'bg-sky-500' : 'bg-amber-500'}`}></span>
              <span className="font-semibold text-foreground">Cycle:</span>
              <span className="font-bold text-primary">{academicYearLifecycle}</span>
            </div>

            {/* Global Academic Year Selector */}
            <div className="flex items-center relative">
              <AcademicYearSelector onNavigateToSettings={onNavigateToAcademicYears} />
            </div>
          </div>

          {/* Right Actions: Role Indicator, Quick Actions, Notifications & User Profile Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Role Badge Indicator */}
            <Badge
              variant={isSuperAdmin ? 'emerald' : 'secondary'}
              className="hidden 2xl:inline-flex items-center space-x-1.5 text-xs px-3 py-1 font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                {isSuperAdmin
                  ? 'Super Admin Mode'
                  : isStudent
                  ? 'Student Portal'
                  : `Principal (${assignedBranch?.short_name || assignedBranch?.branch_code || 'Assigned'})`}
              </span>
            </Badge>

            {/* Quick Search Shortcut Trigger */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/modules')}
              className="hidden xl:flex items-center gap-2 text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl border-border bg-card/60 cursor-pointer"
              title="Quick Search / Modules (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs">Quick Search...</span>
              <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground font-mono">
                ⌘K
              </kbd>
            </Button>

            {/* Notification Bell */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isStudent) navigate('/student/announcement');
                else navigate('/communication/announcement');
              }}
              className="relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </Button>

            <div className="h-6 w-px bg-border hidden sm:block"></div>

            {/* User Profile Dropdown Menu using shadcn DropdownMenu & Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2.5 p-1 sm:px-2 rounded-xl text-left hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring cursor-pointer h-auto"
                  title="User Profile & Settings"
                >
                  <Avatar className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-border shadow-xs">
                    <AvatarImage src={currentUser?.avatar_url} alt={userNameDisplay} />
                    <AvatarFallback
                      className={`rounded-xl text-white font-bold text-xs ${
                        isStudent
                          ? 'bg-gradient-to-tr from-sky-500 to-indigo-600'
                          : isSuperAdmin
                          ? 'bg-gradient-to-tr from-emerald-600 to-primary'
                          : 'bg-gradient-to-tr from-teal-600 to-emerald-700'
                      }`}
                    >
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-foreground flex items-center space-x-1">
                      <span className="truncate max-w-[130px]">{userNameDisplay}</span>
                      {isSuperAdmin ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                      ) : isStudent ? (
                        <User className="w-3.5 h-3.5 text-primary shrink-0" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium truncate max-w-[140px]">
                      {userSubtitle}
                    </div>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block ml-0.5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-1.5 rounded-2xl shadow-xl border border-border bg-popover">
                <DropdownMenuLabel className="p-2">
                  <div className="flex items-center space-x-2.5">
                    <Avatar className="w-10 h-10 rounded-xl border border-border shrink-0">
                      <AvatarImage src={currentUser?.avatar_url} alt={userNameDisplay} />
                      <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{userNameDisplay}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{currentUser?.email || userSubtitle}</p>
                      <Badge variant={isSuperAdmin ? 'emerald' : 'outline'} className="mt-1 text-[10px] font-semibold">
                        {roleBadgeLabel}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      if (isStudent) navigate('/student/profile');
                      else navigate('/staff/directory');
                    }}
                    className="rounded-xl text-xs font-medium cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2 text-primary" />
                    <span>{isStudent ? 'My Student Profile' : 'Staff Directory & Profile'}</span>
                  </DropdownMenuItem>

                  {isSuperAdmin && (
                    <DropdownMenuItem
                      onClick={() => navigate('/branches')}
                      className="rounded-xl text-xs font-medium cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 mr-2 text-accent" />
                      <span>Branch Management</span>
                    </DropdownMenuItem>
                  )}

                  {isSuperAdmin && (
                    <DropdownMenuItem
                      onClick={() => navigate('/academic/academic-year')}
                      className="rounded-xl text-xs font-medium cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Academic Settings</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Logout Action */}
                <DropdownMenuItem
                  onClick={() => {
                    logoutUser();
                    navigate('/login', { replace: true });
                  }}
                  className="rounded-xl text-xs font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
