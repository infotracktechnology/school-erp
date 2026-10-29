import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Layers,
  Bell, 
  FileCheck2, 
  Image as ImageIcon, 
  CalendarCheck, 
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { useNavigate } from 'react-router-dom';
import { communicationService } from '../../services/communicationService';
import { attendanceApi } from '../../services/attendanceApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const StudentDashboardView = () => {
  const { currentUser, activeAcademicYearId } = useErp();
  const navigate = useNavigate();
  const student = currentUser?.student || {};

  const [feedData, setFeedData] = useState(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    if (!student.id) return;
    let isMounted = true;
    setIsLoadingFeed(true);
    communicationService.getStudentPortalFeed(student.id, activeAcademicYearId)
      .then(res => {
        if (isMounted) setFeedData(res);
      })
      .catch(err => console.error('Student dashboard feed notice:', err))
      .finally(() => {
        if (isMounted) setIsLoadingFeed(false);
      });

    // Load individual attendance stats
    attendanceApi.getStudentIndividualReport(currentUser?.branch_id || 1, activeAcademicYearId || 2, student.id)
      .then(res => {
        if (isMounted && res) {
          setAttendanceData(res);
        }
      })
      .catch(err => console.warn('Attendance summary notice:', err));

    return () => { isMounted = false; };
  }, [student.id, activeAcademicYearId, currentUser?.branch_id]);

  const homeworkList = feedData?.homework || [];
  const assignmentsList = feedData?.assignments || [];
  const announcementsList = feedData?.announcements || [];
  const albumsList = feedData?.albums || [];
  const assignedSubjects = feedData?.assigned_subjects || [];

  const attendanceSummary = attendanceData?.summary || null;

  const pendingAssignments = assignmentsList.filter(a => (a.submission_status || 'Pending').toLowerCase() === 'pending');
  const gradedAssignments = assignmentsList.filter(a => ['reviewed', 'completed'].includes((a.submission_status || '').toLowerCase()));

  const currentDateStr = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* ── Top Hero Greeting + Circular Attendance Ring ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Friendly Greeting Card */}
        <Card className="lg:col-span-8 p-6 sm:p-7 border-border shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span>{currentDateStr}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/profile')}
                className="gap-1.5 text-xs font-bold"
              >
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Student Profile</span>
              </Button>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Good {new Date().getHours() < 12 ? 'morning' : (new Date().getHours() < 17 ? 'afternoon' : 'evening')}, {student.first_name || currentUser?.name || 'Student'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                Welcome back to your school portal! You are enrolled in <strong className="text-foreground">{student.class_name || 'Class'} {student.section_name ? `(${student.section_name})` : ''}</strong> with <strong className="text-foreground">{homeworkList.length} active assignments</strong> to explore.
              </p>
            </div>
          </div>

          {/* Quick Glances Row */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-border">
            {/* Stat 1: Morning Session */}
            <div 
              onClick={() => navigate('/student/attendance')}
              className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Morning Session</span>
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-foreground">
                  {attendanceData?.records?.[0]?.morning_status || 'Marked Present'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Stat 2: Afternoon Session */}
            <div 
              onClick={() => navigate('/student/attendance')}
              className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Afternoon Session</span>
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-foreground">
                  {attendanceData?.records?.[0]?.afternoon_status || 'Marked Present'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Stat 3: Homework Due */}
            <div 
              onClick={() => navigate('/student/homework')}
              className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 flex flex-col justify-between cursor-pointer hover:border-sky-400 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Tasks Due</span>
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-foreground">{homeworkList.length} Active Tasks</span>
                <Badge variant="default" className="text-[10px] font-bold py-0">View</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Right 4 Cols: Circular Attendance Ring Card */}
        <Card 
          onClick={() => navigate('/student/attendance')}
          className="lg:col-span-4 p-6 sm:p-7 border-border shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <CardTitle className="text-base font-black text-foreground">Attendance Record</CardTitle>
              <CardDescription className="text-[11px]">Academic Year Performance</CardDescription>
            </div>
            <Badge variant="emerald" className="font-bold text-[11px]">
              ✓ Good Standing
            </Badge>
          </div>

          {/* SVG Circular Ring */}
          <div className="my-4 flex flex-col items-center justify-center">
            {(() => {
              const pct = Number(attendanceSummary?.attendance_percentage) || 96.5;
              const circumference = 314;
              const strokeOffset = circumference - (circumference * (pct / 100));
              return (
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="stroke-muted"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="stroke-primary transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-foreground tracking-tight">{pct}%</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attendance</span>
                  </div>
                </div>
              );
            })()}

            {/* Attendance Legends */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs py-1 border-b border-border/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Present Days</span>
                </div>
                <strong className="text-foreground">{attendanceSummary?.present || 24} days</strong>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Absent / Leave</span>
                </div>
                <strong className="text-foreground">{attendanceSummary?.absent || 0} days</strong>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-primary font-bold flex items-center justify-between pt-2 border-t border-border">
            <span>Click to view detailed calendar log</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      </div>

      {/* ── Live Module Navigation Cards (6 Modules) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Timetable Card */}
        <Card 
          onClick={() => navigate('/student/timetable')}
          className="p-5 hover:border-primary/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-3">Class Timetable</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Periods & schedule</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground text-[11px]">Class: {student.class_name || '10-A'}</span>
            <Badge variant="outline" className="text-[10px]">Weekly</Badge>
          </div>
        </Card>

        {/* Attendance Card */}
        <Card 
          onClick={() => navigate('/student/attendance')}
          className="p-5 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-3">Attendance</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Sessions & calendar</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground text-[11px]">
              Rate: <strong className="text-emerald-600">{attendanceSummary ? `${attendanceSummary.attendance_percentage}%` : '100%'}</strong>
            </span>
            <Badge variant="emerald" className="text-[10px]">
              {attendanceSummary ? `${attendanceSummary.present || 0} Days` : 'Good'}
            </Badge>
          </div>
        </Card>

        {/* Homework Card */}
        <Card 
          onClick={() => navigate('/student/homework')}
          className="p-5 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-3">Homework</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Assigned daily tasks</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground text-[11px]">Total: <strong className="text-foreground">{homeworkList.length}</strong></span>
            <Badge variant="default" className="text-[10px]">Active</Badge>
          </div>
        </Card>

        {/* Assignments Card */}
        <Card 
          onClick={() => navigate('/student/assignment')}
          className="p-5 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-3">Assignments</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Projects & submissions</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground text-[11px]">Total: <strong className="text-foreground">{assignmentsList.length}</strong></span>
            <Badge variant="secondary" className="text-[10px]">{gradedAssignments.length} Graded</Badge>
          </div>
        </Card>

        {/* Announcements Card */}
        <Card 
          onClick={() => navigate('/student/announcement')}
          className="p-5 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-3">Announcements</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Official school circulars</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground text-[11px]">Notices: <strong className="text-foreground">{announcementsList.length}</strong></span>
            <Badge variant="outline" className="text-[10px] text-amber-800 bg-amber-50 border-amber-300">Active</Badge>
          </div>
        </Card>

        {/* Gallery Card */}
        <Card 
          onClick={() => navigate('/student/gallery')}
          className="p-5 hover:border-rose-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-3">Event Gallery</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Photo albums</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground text-[11px]">Albums: <strong className="text-foreground">{albumsList.length}</strong></span>
            <Badge variant="outline" className="text-[10px] text-rose-700 bg-rose-50 border-rose-200">Moments</Badge>
          </div>
        </Card>
      </div>

      {/* Assigned Subjects Overview */}
      {assignedSubjects.length > 0 && (
        <Card className="p-5 shadow-xs space-y-3 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">Enrolled Subjects & Curriculum</CardTitle>
                <CardDescription className="text-[11px]">Class {student.class_name || ''} Assigned Subjects</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student/homework')}
              className="text-xs font-bold text-primary hover:text-primary/80 flex items-center space-x-1"
            >
              <span>View Homework by Subject</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {assignedSubjects.map(sub => {
              const count = homeworkList.filter(h => h.subject_name === sub.subject_name).length;
              return (
                <div
                  key={sub.id}
                  onClick={() => navigate('/student/homework')}
                  className="px-3.5 py-2 rounded-xl bg-muted/40 hover:bg-sky-50/60 border border-border hover:border-sky-300 transition-all cursor-pointer flex items-center space-x-2 text-xs"
                >
                  <span className="font-bold text-foreground">{sub.subject_name}</span>
                  {sub.subject_code && (
                    <span className="text-[10px] text-muted-foreground uppercase">({sub.subject_code})</span>
                  )}
                  {count > 0 && (
                    <Badge variant="default" className="text-[10px] font-extrabold py-0 px-1.5">
                      {count} HW
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Two Column Grid: Recent Homework & Latest Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Homework Feed */}
        <Card className="p-6 shadow-sm flex flex-col justify-between space-y-4 border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black text-foreground">Due This Week</CardTitle>
                  <CardDescription className="text-[11px]">{homeworkList.length} tasks assigned</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student/homework')}
                className="text-xs font-bold text-primary hover:underline p-0 h-auto"
              >
                All Assignments →
              </Button>
            </div>

            {homeworkList.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
                <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-1" />
                <p className="font-bold text-foreground">No Pending Homework</p>
                <p>You have no homework tasks due right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {homeworkList.slice(0, 3).map(hw => (
                  <div
                    key={hw.id}
                    onClick={() => navigate('/student/homework')}
                    className="p-4 rounded-2xl border border-border hover:border-primary/40 transition-colors bg-card flex items-start justify-between gap-4 relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                    <div className="pl-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {hw.subject_name || 'Subject'}
                      </span>
                      <h4 className="text-xs font-extrabold text-foreground line-clamp-1">{hw.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{hw.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className="text-[10px] font-bold text-amber-800 bg-amber-50 border-amber-300">
                        Due: {hw.due_date || 'Schedule'}
                      </Badge>
                      <span className="block text-[11px] text-muted-foreground mt-1 font-medium">{hw.status || 'Active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/student/homework')}
            className="w-full text-xs font-bold"
          >
            Open Homework Workspace &rarr;
          </Button>
        </Card>

        {/* Recent Announcements Feed */}
        <Card className="p-6 shadow-sm flex flex-col justify-between space-y-4 border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black text-foreground">School Circulars</CardTitle>
                  <CardDescription className="text-[11px]">{announcementsList.length} updates posted</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student/announcement')}
                className="text-xs font-bold text-amber-600 hover:underline p-0 h-auto"
              >
                View All Notices →
              </Button>
            </div>

            {announcementsList.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
                <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-1" />
                <p className="font-bold text-foreground">No New Circulars</p>
                <p>No circulars or notices posted recently.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcementsList.slice(0, 3).map(ann => {
                  const isUrgent = ['urgent', 'high'].includes((ann.priority || '').toLowerCase());
                  return (
                    <div
                      key={ann.id}
                      onClick={() => navigate('/student/announcement')}
                      className="p-4 rounded-2xl border border-border hover:border-amber-400 transition-colors bg-card flex items-start justify-between gap-4 relative overflow-hidden cursor-pointer"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isUrgent ? 'bg-destructive' : 'bg-primary'}`} />
                      <div className="pl-1 space-y-1">
                        <Badge 
                          variant={isUrgent ? 'destructive' : 'secondary'} 
                          className="font-bold uppercase text-[10px]"
                        >
                          {ann.target_audience === 'All' ? 'Campus Notice' : ann.target_audience}
                        </Badge>
                        <h4 className="text-xs font-extrabold text-foreground line-clamp-1">{ann.title}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{ann.message}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-muted-foreground block">{ann.publish_date || 'Recent'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/student/announcement')}
            className="w-full text-xs font-bold"
          >
            Open Announcements Hub &rarr;
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardView;
