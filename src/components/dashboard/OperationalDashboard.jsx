import React from 'react';
import { 
  UserCheck, 
  CalendarCheck, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Clock, 
  Building2, 
  Bell, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { useErp } from '../../context/ErpContext';
import { ClassModuleFeeds } from './ClassModuleFeeds';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const OperationalDashboard = ({ 
  branches = [], 
  activeBranchId, 
  onNavigateToSettings, 
  onNavigateToStudents 
}) => {
  const navigate = useNavigate();
  const { isAllBranches, userRole, assignedBranch, activeAcademicYear } = useErp();

  // Super Admin view fallback
  if (userRole === 'super_admin' || isAllBranches) {
    return (
      <SuperAdminDashboard 
        onNavigateToStudents={onNavigateToStudents} 
        onNavigateToSettings={onNavigateToSettings}
      />
    );
  }

  const currentBranch = assignedBranch || branches.find(b => Number(b.id) === Number(activeBranchId)) || branches[0];
  const currentDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Top Campus Operational Banner ── */}
      <Card className="border-border bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white overflow-hidden relative shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-40 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sky-200">
              <span>Operational School Workspace</span>
              <span>•</span>
              <Badge variant="emerald" className="font-mono text-[11px] font-bold">
                {currentBranch?.branch_code || 'MAIN'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Daily Campus Operations & Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              Real-time daily operations, attendance metrics, upcoming academic periods, and campus notices for {currentBranch?.branch_name || 'Green Park Main Campus'}.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/preview/homeroom')}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1.5" />
              <span>Preview Modern UI</span>
            </Button>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-2 text-right">
              <span className="block text-[11px] text-sky-200 uppercase font-semibold">Today's Date</span>
              <span className="text-sm font-bold font-mono text-white">
                {currentDateStr}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Operational Stat Metric Cards (Homeroom & Vibrant Modern Aesthetic) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Student Attendance */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center border border-emerald-100">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <Badge variant="emerald" className="font-extrabold text-xs">
              94.8% Present
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-black text-foreground tracking-tight">1,248</div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Students Marked Present Today
            </p>
          </CardContent>
          <CardFooter className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>68 Absent / Leave</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +1.2% vs yesterday
            </span>
          </CardFooter>
        </Card>

        {/* Metric 2: Staff on Duty */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 flex items-center justify-center border border-sky-100">
              <UserCheck className="w-5 h-5" />
            </div>
            <Badge variant="default" className="font-extrabold text-xs">
              98% Staff Duty
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-black text-foreground tracking-tight">86 / 88</div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Teaching & Admin Faculty
            </p>
          </CardContent>
          <CardFooter className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>2 Faculty on Leave</span>
            <span className="text-sky-600 font-bold">Substitutes Assigned</span>
          </CardFooter>
        </Card>

        {/* Metric 3: Classes In Session */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex items-center justify-center border border-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="font-extrabold text-xs bg-indigo-100 text-indigo-800">
              Period 4 Active
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-black text-foreground tracking-tight">36</div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Live Classrooms & Labs
            </p>
          </CardContent>
          <CardFooter className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>All Timetables Active</span>
            <span className="text-indigo-600 font-bold">0 Schedule Conflicts</span>
          </CardFooter>
        </Card>

        {/* Metric 4: Daily Fee Collections */}
        <Card className="hover:shadow-md transition-shadow border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center border border-amber-100">
              <CreditCard className="w-5 h-5" />
            </div>
            <Badge variant="outline" className="font-extrabold text-xs text-amber-700 border-amber-300 bg-amber-50">
              Today
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-black text-foreground tracking-tight">₹ 1,45,200</div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Daily Receipts Collected
            </p>
          </CardContent>
          <CardFooter className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>24 Transactions</span>
            <span className="text-emerald-600 font-bold">100% Reconciled</span>
          </CardFooter>
        </Card>
      </div>

      {/* ── Quick Daily Operations (Fast Access Action Buttons) ── */}
      <Card className="border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold text-foreground">Quick Daily Operations</CardTitle>
            <CardDescription className="text-xs">Direct access to frequent administrative workflows</CardDescription>
          </div>
          <Badge variant="outline" className="text-[11px] font-bold">Fast Access</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Button
              variant="outline"
              onClick={() => navigate('/attendance/take_attendance')}
              className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all text-center rounded-2xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-foreground">Mark Attendance</span>
                <span className="text-[10px] text-muted-foreground">Class rosters</span>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/examination/marks_entry')}
              className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all text-center rounded-2xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-foreground">Exam Marks</span>
                <span className="text-[10px] text-muted-foreground">Enter grades</span>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/communication/homework')}
              className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-center rounded-2xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-foreground">Assign Homework</span>
                <span className="text-[10px] text-muted-foreground">Class tasks</span>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/communication/announcements')}
              className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-all text-center rounded-2xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-foreground">Send Notice</span>
                <span className="text-[10px] text-muted-foreground">Broadcast alert</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Operational Schedules & Notices Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule Progress & Module Feeds */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timetable Status Card */}
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-extrabold text-foreground">Today's Class Schedule Progress</CardTitle>
                  <CardDescription className="text-[11px]">Current Academic Day Progression</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-sky-700 bg-sky-50 border-sky-200 text-xs font-semibold">
                Bell Schedule: Regular
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
                  <div>
                    <span className="text-xs font-black text-foreground">Period 4 (11:15 AM - 12:00 PM)</span>
                    <p className="text-[11px] text-sky-700 dark:text-sky-300 font-semibold">Mathematics & Science Practical Labs</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs font-bold">
                  LIVE NOW
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div>
                    <span className="text-xs font-bold text-foreground">Lunch Break (12:00 PM - 12:45 PM)</span>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Primary & Secondary Dining Halls</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-amber-800 bg-white dark:bg-slate-900 border-amber-300 font-bold">
                  Upcoming
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div>
                    <span className="text-xs font-bold text-foreground">Period 5 (12:45 PM - 01:30 PM)</span>
                    <p className="text-[11px] text-muted-foreground">Social Studies & Language Arts</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">Scheduled</span>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Feeds Across All Classes and Modules */}
          <ClassModuleFeeds 
            branchId={currentBranch?.id} 
            academicYearId={activeAcademicYear?.id || 2}
            title="Class Activities & Academic Feeds"
            subtitle={`Live roll-call entries, homework & syllabus circulars for ${currentBranch?.branch_name || 'campus'}`}
          />
        </div>

        {/* Right 1 Col: Operational Notices & Quick Navigation */}
        <div className="space-y-6">
          {/* Important Campus Notices */}
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Bell className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-extrabold text-foreground">Campus Announcements</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground font-extrabold">Parent-Teacher Meeting</span>
                  <Badge variant="outline" className="text-[10px] text-amber-800 border-amber-300 bg-white dark:bg-slate-900">
                    This Saturday
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Scheduled for Grades 9 to 12. Slot allotment notices sent to parent portals.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground font-extrabold">Mid-Term Exam Timetable</span>
                  <Badge variant="outline" className="text-[10px] text-indigo-800 border-indigo-300 bg-white dark:bg-slate-900">
                    Oct 12
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Exam schedules generated and locked for CBSE syllabus subjects.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick System Navigation Link to Settings */}
          <Card className="border-border bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="pb-2 flex flex-row items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <Building2 className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-extrabold text-foreground">Campus Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-xs leading-relaxed">
                To configure campus branches or manage academic year cycles, navigate to <strong>Settings</strong> in the main sidebar.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToSettings('branch-settings')}
                  className="w-full justify-between text-xs font-bold hover:border-sky-500 hover:text-sky-600"
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>Branch Settings</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToSettings('academic-settings')}
                  className="w-full justify-between text-xs font-bold hover:border-emerald-500 hover:text-emerald-600"
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Academic Settings</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OperationalDashboard;
