import React, { useState, useRef, useEffect } from 'react';
import { School, ShieldCheck, Bell, Menu, ChevronDown, Check, Building2, UserCheck, Shield, LogOut, User } from 'lucide-react';
import { AcademicYearSelector } from '../academic/AcademicYearSelector';
import { useErp } from '../../context/ErpContext';
import { useNavigate } from 'react-router-dom';

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
    isCurrentYear
  } = useErp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Left: Logo & ERP Title */}
          <div className="flex items-center space-x-3 shrink-0">
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
              <img src="/assets/logo.png" alt="EduCampus ERP Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  EduCampus ERP
                </span>
                <span className="hidden xl:inline-block text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {isSuperAdmin ? 'All Branches Access' : 'Assigned Branch Scope'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isSuperAdmin ? 'Centralized Enterprise Management' : `Campus: ${assignedBranch?.branch_name || 'Assigned Branch'}`}
              </p>
            </div>
          </div>

          {/* Center: Global Academic Year Life Cycle Selector (Branch selector removed as requested) */}
          <div className="flex items-center space-x-2 sm:space-x-3 py-1 relative">
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600">
              <span className={`w-2 h-2 rounded-full ${isCurrentYear ? 'bg-emerald-500 animate-pulse' : 'bg-blue-400'}`}></span>
              <span className="font-semibold text-slate-700">Academic Year Cycle:</span>
              <span className="font-bold text-emerald-700">{academicYearLifecycle}</span>
            </div>

            {/* Global Academic Year Selector */}
            <div className="flex items-center relative">
              <AcademicYearSelector onNavigateToSettings={onNavigateToAcademicYears} />
            </div>
          </div>

          {/* Right Actions: Notifications & User Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <div className="hidden 2xl:flex items-center space-x-1.5 text-xs bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-emerald-800">
                {isSuperAdmin ? 'Super Admin Mode' : `Principal (${assignedBranch?.short_name || assignedBranch?.branch_code || 'Assigned'})`}
              </span>
            </div>

            <button
              type="button"
              className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* User Profile & Interactive Role / Logout Header */}
            <div className="flex items-center space-x-2">
              <div 
                onClick={() => {
                  if (isStudent) navigate('/student/profile');
                }}
                className={`flex items-center space-x-2.5 p-1 rounded-xl text-left ${
                  isStudent ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                }`}
                title={isStudent ? 'Click to view My Profile' : undefined}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                    isStudent
                      ? 'bg-gradient-to-tr from-sky-500 to-indigo-600'
                      : isSuperAdmin
                      ? 'bg-gradient-to-tr from-emerald-600 to-indigo-600'
                      : 'bg-gradient-to-tr from-teal-600 to-emerald-700'
                  }`}
                >
                  {isStudent ? 'ST' : isSuperAdmin ? 'SA' : 'PR'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <span>{currentUser?.name || (isSuperAdmin ? 'Super Admin' : isStudent ? 'Student' : 'Principal')}</span>
                    {isSuperAdmin ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isStudent ? (
                      <User className="w-3.5 h-3.5 text-sky-600" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                    {isStudent
                      ? (currentUser?.student?.admission_number ? `Adm: ${currentUser.student.admission_number}` : 'Student Account')
                      : isSuperAdmin
                      ? 'All Branches Access'
                      : assignedBranch?.branch_name || 'Assigned Branch'}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  navigate('/login', { replace: true });
                }}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 text-xs font-semibold"
                title="Sign Out / Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
