import React from 'react';
import { UserCheck, CalendarCheck, BookOpen, GraduationCap, CreditCard, Clock, Building2, Bell, ArrowRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { useErp } from '../../context/ErpContext';
import { ClassModuleFeeds } from './ClassModuleFeeds';
import { useNavigate } from 'react-router-dom';
export const OperationalDashboard = ({ branches, activeBranchId, onNavigateToSettings, onNavigateToStudents }) => {
    const navigate = useNavigate();
    const { isAllBranches, userRole, assignedBranch, activeAcademicYear } = useErp();
    // Super Admin view (all branches or single branch overview)
    if (userRole === 'super_admin' || isAllBranches) {
        return (<SuperAdminDashboard onNavigateToStudents={onNavigateToStudents} onNavigateToSettings={onNavigateToSettings}/>);
    }
    const currentBranch = assignedBranch || branches.find(b => Number(b.id) === Number(activeBranchId)) || branches[0];
    return (<div className="space-y-6 animate-in fade-in duration-200">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Operational School Workspace</span>
            <span>•</span>
            <span className="bg-emerald-700/80 px-2 py-0.5 rounded text-white font-mono text-[11px]">
              {currentBranch?.branch_code || 'MAIN'}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Daily Campus Operations & Overview
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1 max-w-2xl">
            Real-time daily operations, attendance metrics, upcoming academic periods, and campus notices for {currentBranch?.branch_name || 'Green Park Main Campus'}.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => navigate('/preview/homeroom')}
            className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Preview Modern UI ("Homeroom")</span>
          </button>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-2.5 text-right">
            <span className="block text-[11px] text-emerald-200 uppercase font-semibold">Today's Date</span>
            <span className="text-sm font-bold font-mono text-white">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Operational Metrics Cards (Homeroom Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Student Attendance - Indigo/Emerald */}
        <div className="bg-white p-5 rounded-3xl border border-[#ece7f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e4f5eb] text-[#177245] flex items-center justify-center border border-[#bfe7cd]">
              <CalendarCheck className="w-5 h-5"/>
            </div>
            <span className="text-xs font-black text-[#177245] bg-[#e4f5eb] px-2.5 py-0.5 rounded-full border border-[#bfe7cd]">
              94.8% Present
            </span>
          </div>
          <span className="text-2xl font-black text-[#1e1b3a] tracking-tight">1,248</span>
          <p className="text-xs text-[#625e7d] font-medium mt-0.5">Students Marked Present Today</p>
          <div className="mt-3 pt-2.5 border-t border-[#ece7f0] flex items-center justify-between text-[11px] text-[#625e7d]">
            <span>68 Absent / Leave</span>
            <span className="text-[#177245] font-bold">+1.2% vs yesterday</span>
          </div>
        </div>

        {/* Staff on Duty - Teal */}
        <div className="bg-white p-5 rounded-3xl border border-[#ece7f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#dff4f1] text-[#0f766e] flex items-center justify-center border border-[#aee4dc]">
              <UserCheck className="w-5 h-5"/>
            </div>
            <span className="text-xs font-black text-[#0f766e] bg-[#dff4f1] px-2.5 py-0.5 rounded-full border border-[#aee4dc]">
              98% Staff Duty
            </span>
          </div>
          <span className="text-2xl font-black text-[#1e1b3a] tracking-tight">86 / 88</span>
          <p className="text-xs text-[#625e7d] font-medium mt-0.5">Teaching & Admin Faculty</p>
          <div className="mt-3 pt-2.5 border-t border-[#ece7f0] flex items-center justify-between text-[11px] text-[#625e7d]">
            <span>2 Faculty on Leave</span>
            <span className="text-[#0f766e] font-bold">Substitutes Assigned</span>
          </div>
        </div>

        {/* Classes In Session - Indigo */}
        <div className="bg-white p-5 rounded-3xl border border-[#ece7f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eeedff] text-[#4f46e5] flex items-center justify-center border border-[#d8d5ff]">
              <BookOpen className="w-5 h-5"/>
            </div>
            <span className="text-xs font-black text-[#4f46e5] bg-[#eeedff] px-2.5 py-0.5 rounded-full border border-[#d8d5ff]">
              Period 4 Active
            </span>
          </div>
          <span className="text-2xl font-black text-[#1e1b3a] tracking-tight">36</span>
          <p className="text-xs text-[#625e7d] font-medium mt-0.5">Live Classrooms & Labs</p>
          <div className="mt-3 pt-2.5 border-t border-[#ece7f0] flex items-center justify-between text-[11px] text-[#625e7d]">
            <span>All Timetables Active</span>
            <span className="text-[#4f46e5] font-bold">0 Schedule Conflicts</span>
          </div>
        </div>

        {/* Daily Fee Collections - Coral/Amber */}
        <div className="bg-white p-5 rounded-3xl border border-[#ece7f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fff0eb] text-[#ff7a5c] flex items-center justify-center border border-[#ffd5cc]">
              <CreditCard className="w-5 h-5"/>
            </div>
            <span className="text-xs font-black text-[#b1361b] bg-[#fff0eb] px-2.5 py-0.5 rounded-full border border-[#ffd5cc]">
              Today
            </span>
          </div>
          <span className="text-2xl font-black text-[#1e1b3a] tracking-tight">₹ 1,45,200</span>
          <p className="text-xs text-[#625e7d] font-medium mt-0.5">Daily Receipts Collected</p>
          <div className="mt-3 pt-2.5 border-t border-[#ece7f0] flex items-center justify-between text-[11px] text-[#625e7d]">
            <span>24 Transactions</span>
            <span className="text-[#177245] font-bold">100% Reconciled</span>
          </div>
        </div>
      </div>

      {/* Operational Schedules & Notices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operational Highlights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timetable Status (Homeroom Timeline Style) */}
          <div className="bg-white rounded-3xl border border-[#ece7f0] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#eeedff] text-[#4f46e5] flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4"/>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1e1b3a]">Today's Class Schedule Progress</h3>
                  <p className="text-[11px] text-[#625e7d]">Current Academic Day Progression</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4f46e5] bg-[#eeedff] border border-[#d8d5ff] px-3 py-1 rounded-full">
                Bell Schedule: Regular
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#f5f2fa] border border-[#d8d5ff] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] animate-pulse"></span>
                  <div>
                    <span className="text-xs font-black text-[#1e1b3a]">Period 4 (11:15 AM - 12:00 PM)</span>
                    <p className="text-[11px] text-[#4f46e5] font-semibold">Mathematics & Science Practical Labs</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-white bg-[#4f46e5] px-2.5 py-0.5 rounded-full shadow-2xs">
                  LIVE NOW
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fff0eb] border border-[#ffd5cc] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a5c]"></span>
                  <div>
                    <span className="text-xs font-bold text-[#1e1b3a]">Lunch Break (12:00 PM - 12:45 PM)</span>
                    <p className="text-[11px] text-[#b1361b] font-medium">Primary & Secondary Dining Halls</p>
                  </div>
                </div>
                <span className="text-xs text-[#b1361b] font-bold bg-white px-2 py-0.5 rounded-md border border-[#ffd5cc]">
                  Upcoming
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <div>
                    <span className="text-xs font-bold text-[#1e1b3a]">Period 5 (12:45 PM - 01:30 PM)</span>
                    <p className="text-[11px] text-[#625e7d]">Social Studies & Language Arts</p>
                  </div>
                </div>
                <span className="text-xs text-[#625e7d] font-medium">Scheduled</span>
              </div>
            </div>
          </div>

          {/* Quick Operational Shortcuts (Homeroom Soft Rounded Style) */}
          <div className="bg-white rounded-3xl border border-[#ece7f0] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-[#1e1b3a]">Quick Daily Operations</h3>
              <span className="text-[11px] text-[#625e7d] font-bold uppercase tracking-wider">Fast Access</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div 
                onClick={() => navigate('/attendance/take_attendance')}
                className="p-3.5 rounded-2xl border border-[#ece7f0] hover:border-[#177245] bg-[#faf7f2] hover:bg-[#e4f5eb]/60 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#e4f5eb] text-[#177245] mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-4 h-4"/>
                </div>
                <span className="block text-xs font-bold text-[#1e1b3a]">Mark Attendance</span>
                <span className="text-[10px] text-[#625e7d]">Class rosters</span>
              </div>

              <div 
                onClick={() => navigate('/examination/marks_entry')}
                className="p-3.5 rounded-2xl border border-[#ece7f0] hover:border-[#4f46e5] bg-[#faf7f2] hover:bg-[#eeedff]/60 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#eeedff] text-[#4f46e5] mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4"/>
                </div>
                <span className="block text-xs font-bold text-[#1e1b3a]">Exam Marks</span>
                <span className="text-[10px] text-[#625e7d]">Enter grades</span>
              </div>

              <div 
                onClick={() => navigate('/communication/homework')}
                className="p-3.5 rounded-2xl border border-[#ece7f0] hover:border-[#ff7a5c] bg-[#faf7f2] hover:bg-[#fff0eb]/60 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#fff0eb] text-[#ff7a5c] mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4"/>
                </div>
                <span className="block text-xs font-bold text-[#1e1b3a]">Assign Homework</span>
                <span className="text-[10px] text-[#625e7d]">Class tasks</span>
              </div>

              <div 
                onClick={() => navigate('/communication/announcements')}
                className="p-3.5 rounded-2xl border border-[#ece7f0] hover:border-[#4f46e5] bg-[#faf7f2] hover:bg-[#eeedff]/60 transition-all text-center group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#eeedff] text-[#4f46e5] mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-4 h-4"/>
                </div>
                <span className="block text-xs font-bold text-[#1e1b3a]">Send Notice</span>
                <span className="text-[10px] text-[#625e7d]">Broadcast alert</span>
              </div>
            </div>
          </div>

          {/* Real-time Feeds Across All Classes and Modules */}
          <ClassModuleFeeds 
            branchId={currentBranch?.id} 
            academicYearId={activeAcademicYear?.id || 2}
            title="Class Activities & Academic Feeds"
            subtitle={`Live roll-call entries, homework & syllabus circulars for ${currentBranch?.branch_name || 'campus'}`}
          />
        </div>

        {/* Right 1 Col: Operational Notices & System Notice */}
        <div className="space-y-6">
          {/* Important Notices */}
          <div className="bg-white rounded-3xl border border-[#ece7f0] p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-[#1e1b3a] font-black text-sm mb-4">
              <div className="p-1.5 rounded-xl bg-[#fff0eb] text-[#ff7a5c]">
                <Bell className="w-4 h-4"/>
              </div>
              <span>Campus Announcements</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#fff0eb] border border-[#ffd5cc] text-xs text-[#b1361b] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1e1b3a] font-extrabold">Parent-Teacher Meeting</span>
                  <span className="text-[10px] font-bold text-[#b1361b] bg-white px-2 py-0.5 rounded-full border border-[#ffd5cc]">This Saturday</span>
                </div>
                <p className="text-[#625e7d] text-[11px] leading-relaxed">
                  Scheduled for Grades 9 to 12. Slot allotment notices sent to parent portals.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#eeedff] border border-[#d8d5ff] text-xs text-[#4f46e5] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1e1b3a] font-extrabold">Mid-Term Exam Timetable</span>
                  <span className="text-[10px] font-bold text-[#4f46e5] bg-white px-2 py-0.5 rounded-full border border-[#d8d5ff]">Oct 12</span>
                </div>
                <p className="text-[#625e7d] text-[11px] leading-relaxed">
                  Exam schedules generated and locked for CBSE syllabus subjects.
                </p>
              </div>
            </div>
          </div>

          {/* Quick System Navigation Link to Settings */}
          <div className="bg-gradient-to-br from-white to-[#f5f2fa] rounded-3xl border border-[#ece7f0] p-6 text-xs text-[#1e1b3a] space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-[#1e1b3a] font-black text-sm">
              <div className="p-1.5 rounded-xl bg-[#eeedff] text-[#4f46e5]">
                <Building2 className="w-4 h-4"/>
              </div>
              <span>Campus Configuration</span>
            </div>
            <p className="text-[#625e7d] text-xs leading-relaxed">
              To configure campus branches or manage academic year cycles, navigate to <strong>Settings</strong> in the main sidebar.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button 
                type="button" 
                onClick={() => onNavigateToSettings('branch-settings')} 
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-[#ece7f0] hover:border-[#4f46e5] text-[#1e1b3a] text-xs font-bold transition-all hover:text-[#4f46e5] hover:bg-[#eeedff]/40 cursor-pointer shadow-2xs"
              >
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#4f46e5]"></span>
                  <span>Branch Settings</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#4f46e5]"/>
              </button>
              <button 
                type="button" 
                onClick={() => onNavigateToSettings('academic-settings')} 
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-[#ece7f0] hover:border-[#4f46e5] text-[#1e1b3a] text-xs font-bold transition-all hover:text-[#4f46e5] hover:bg-[#eeedff]/40 cursor-pointer shadow-2xs"
              >
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff7a5c]"></span>
                  <span>Academic Settings</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff7a5c]"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
