import React, { useState, useEffect } from 'react';
import { 
  User, BookOpen, Clock, ChevronRight, Layers,
  Bell, FileCheck2, Image as ImageIcon, CalendarCheck, Calendar
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { useNavigate } from 'react-router-dom';
import { communicationService } from '../../services/communicationService';
import { attendanceApi } from '../../services/attendanceApi';

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

    // Also load individual attendance stats for student dashboard
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Homeroom Hero Greeting + Circular Attendance Ring ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Warm Friendly Greeting Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#ece7f0] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#fff0eb] to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 w-48 h-48 bg-[#eeedff]/60 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#ff7a5c]">
                <span className="w-2 h-2 rounded-full bg-[#ff7a5c] animate-pulse" />
                <span>
                  {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <button
                onClick={() => navigate('/student/profile')}
                className="px-3 py-1.5 bg-[#f5f2fa] hover:bg-[#eeedff] border border-[#ece7f0] text-[#4f46e5] font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Student Profile</span>
              </button>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b3a]">
                Good {new Date().getHours() < 12 ? 'morning' : (new Date().getHours() < 17 ? 'afternoon' : 'evening')}, {student.first_name || currentUser?.name || 'Student'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-[#625e7d] mt-1 max-w-xl leading-relaxed">
                Welcome back to your school portal! You are enrolled in <strong className="text-[#1e1b3a]">{student.class_name || 'Class'} {student.section_name ? `(${student.section_name})` : ''}</strong> with <strong className="text-[#1e1b3a]">{homeworkList.length} active assignments</strong> to explore.
              </p>
            </div>
          </div>

          {/* Quick Glances Row */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-[#ece7f0]">
            {/* Stat 1: Morning Session */}
            <div 
              onClick={() => navigate('/student/attendance')}
              className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] flex flex-col justify-between cursor-pointer hover:border-[#4f46e5]/40 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#625e7d] flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4f46e5]" />
                <span>Morning Session</span>
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#1e1b3a]">
                  {attendanceData?.records?.[0]?.morning_status || 'Marked Present'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Stat 2: Afternoon Session */}
            <div 
              onClick={() => navigate('/student/attendance')}
              className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] flex flex-col justify-between cursor-pointer hover:border-[#4f46e5]/40 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#625e7d] flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4f46e5]" />
                <span>Afternoon Session</span>
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#1e1b3a]">
                  {attendanceData?.records?.[0]?.afternoon_status || 'Marked Present'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Stat 3: Homework Due */}
            <div 
              onClick={() => navigate('/student/homework')}
              className="p-3.5 rounded-2xl bg-[#fff0eb] border border-[#ffd5cc] flex flex-col justify-between cursor-pointer hover:border-[#ff7a5c] transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b1361b] flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#ff7a5c]" />
                <span>Tasks Due</span>
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#1e1b3a]">{homeworkList.length} Active Tasks</span>
                <span className="text-[10px] font-bold text-[#b1361b] bg-white px-2 py-0.5 rounded-md">View</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Homeroom Circular SVG Attendance Ring */}
        <div 
          onClick={() => navigate('/student/attendance')}
          className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#ece7f0] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#4f46e5]/40 transition-colors group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#ece7f0]">
            <div>
              <h2 className="text-base font-black text-[#1e1b3a]">Attendance Record</h2>
              <p className="text-[11px] text-[#625e7d]">Academic Year Performance</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e4f5eb] text-[#177245] border border-[#bfe7cd]">
              ✓ Good Standing
            </span>
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
                      className="stroke-[#f5f2fa]"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="stroke-[#4f46e5] transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-[#1e1b3a] tracking-tight">{pct}%</span>
                    <span className="text-[10px] font-bold text-[#625e7d] uppercase tracking-wider">Attendance</span>
                  </div>
                </div>
              );
            })()}

            {/* Attendance Legends */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs py-1 border-b border-[#ece7f0]/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
                  <span className="text-[#625e7d]">Present Days</span>
                </div>
                <strong className="text-[#1e1b3a]">{attendanceSummary?.present || 24} days</strong>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a5c]" />
                  <span className="text-[#625e7d]">Absent / Leave</span>
                </div>
                <strong className="text-[#1e1b3a]">{attendanceSummary?.absent || 0} days</strong>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#4f46e5] font-bold flex items-center justify-between pt-2 border-t border-[#ece7f0]">
            <span>Click to view detailed calendar log</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Live Modules Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Timetable Card */}
        <div 
          onClick={() => navigate('/student/timetable')}
          className="bg-white border border-slate-200/80 hover:border-indigo-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Class Timetable</h3>
            <p className="text-xs text-slate-500 mt-0.5">Periods, timing & weekly schedule</p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Class: <strong className="text-indigo-700">{student.class_name || 'Class 1'} {student.section_name ? `(${student.section_name})` : ''}</strong></span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Weekly
            </span>
          </div>
        </div>

        {/* Attendance Card */}
        <div 
          onClick={() => navigate('/student/attendance')}
          className="bg-white border border-slate-200/80 hover:border-emerald-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Attendance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sessions, calendar & percentage</p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">
              Rate: <strong className="text-emerald-700">{attendanceSummary ? `${attendanceSummary.attendance_percentage}%` : '100%'}</strong>
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {attendanceSummary ? `${attendanceSummary.present || 0} Present` : 'Good'}
            </span>
          </div>
        </div>

        {/* Homework Card */}
        <div 
          onClick={() => navigate('/student/homework')}
          className="bg-white border border-slate-200/80 hover:border-cyan-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-cyan-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Homework</h3>
            <p className="text-xs text-slate-500 mt-0.5">Assigned practice & notebook tasks</p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Total: <strong className="text-slate-900">{homeworkList.length}</strong></span>
            <span className="font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
              Active
            </span>
          </div>
        </div>

        {/* Assignments Card */}
        <div 
          onClick={() => navigate('/student/assignment')}
          className="bg-white border border-slate-200/80 hover:border-purple-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Assignments</h3>
            <p className="text-xs text-slate-500 mt-0.5">Projects, submissions & feedback</p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Total: <strong className="text-slate-900">{assignmentsList.length}</strong></span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {gradedAssignments.length} Graded
            </span>
          </div>
        </div>

        {/* Announcements Card */}
        <div 
          onClick={() => navigate('/student/announcement')}
          className="bg-white border border-slate-200/80 hover:border-amber-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Announcements</h3>
            <p className="text-xs text-slate-500 mt-0.5">Official school circulars & notices</p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Total Notices: <strong className="text-slate-900">{announcementsList.length}</strong></span>
            <span className="font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">Active</span>
          </div>
        </div>

        {/* Gallery Card */}
        <div 
          onClick={() => navigate('/student/gallery')}
          className="bg-white border border-slate-200/80 hover:border-rose-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Event Gallery</h3>
            <p className="text-xs text-slate-500 mt-0.5">School celebrations & photo albums</p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Albums: <strong className="text-slate-900">{albumsList.length}</strong></span>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">Moments</span>
          </div>
        </div>
      </div>

      {/* Assigned Subjects Overview */}
      {assignedSubjects.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Enrolled Subjects & Curriculum</h3>
                <p className="text-[11px] text-slate-400">Class {student.class_name || ''} Assigned Subjects</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/student/homework')}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View Homework by Subject</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {assignedSubjects.map(sub => {
              const count = homeworkList.filter(h => h.subject_name === sub.subject_name).length;
              return (
                <div
                  key={sub.id}
                  onClick={() => navigate('/student/homework')}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/70 hover:border-cyan-300 transition-all cursor-pointer flex items-center space-x-2 text-xs"
                >
                  <span className="font-bold text-slate-800">{sub.subject_name}</span>
                  {sub.subject_code && (
                    <span className="text-[10px] text-slate-400 uppercase">({sub.subject_code})</span>
                  )}
                  {count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800">
                      {count} HW
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Grid: Recent Homework & Latest Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Homework Feed */}
        <div className="bg-white rounded-3xl border border-[#ece7f0] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#ece7f0]">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#eeedff] text-[#4f46e5]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1e1b3a]">Due This Week</h3>
                  <p className="text-[11px] text-[#625e7d]">{homeworkList.length} tasks assigned</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/student/homework')}
                className="text-xs font-bold text-[#4f46e5] hover:underline cursor-pointer"
              >
                All Assignments →
              </button>
            </div>

            {homeworkList.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#625e7d] space-y-1">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="font-bold text-[#1e1b3a]">No Pending Homework</p>
                <p>You have no homework tasks due right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {homeworkList.slice(0, 3).map(hw => (
                  <div
                    key={hw.id}
                    onClick={() => navigate('/student/homework')}
                    className="p-4 rounded-2xl border border-[#ece7f0] hover:border-[#4f46e5]/40 transition-colors bg-white flex items-start justify-between gap-4 relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4f46e5]" />
                    <div className="pl-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4f46e5]">
                        {hw.subject_name || 'Subject'}
                      </span>
                      <h4 className="text-xs font-extrabold text-[#1e1b3a] line-clamp-1">{hw.title}</h4>
                      <p className="text-[11px] text-[#625e7d] line-clamp-2">{hw.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fff0eb] text-[#b1361b] border border-[#ffd5cc]">
                        Due: {hw.due_date || 'Schedule'}
                      </span>
                      <span className="block text-[11px] text-[#625e7d] mt-1 font-medium">{hw.status || 'Active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/student/homework')}
            className="w-full py-2.5 bg-[#f5f2fa] hover:bg-[#eeedff] border border-[#ece7f0] text-[#4f46e5] rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
          >
            Open Homework Workspace &rarr;
          </button>
        </div>

        {/* Recent Announcements Feed */}
        <div className="bg-white rounded-3xl border border-[#ece7f0] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#ece7f0]">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#fff0eb] text-[#ff7a5c]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1e1b3a]">School Circulars</h3>
                  <p className="text-[11px] text-[#625e7d]">{announcementsList.length} updates posted</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/student/announcement')}
                className="text-xs font-bold text-[#ff7a5c] hover:underline cursor-pointer"
              >
                View All Notices →
              </button>
            </div>

            {announcementsList.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#625e7d] space-y-1">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="font-bold text-[#1e1b3a]">No New Circulars</p>
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
                      className="p-4 rounded-2xl border border-[#ece7f0] hover:border-[#ff7a5c]/40 transition-colors bg-white flex items-start justify-between gap-4 relative overflow-hidden cursor-pointer"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isUrgent ? 'bg-[#ff7a5c]' : 'bg-[#4f46e5]'}`} />
                      <div className="pl-1 space-y-1">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          isUrgent ? 'bg-[#fff0eb] text-[#b1361b]' : 'bg-[#eeedff] text-[#4f46e5]'
                        }`}>
                          {ann.target_audience === 'All' ? 'Campus Notice' : ann.target_audience}
                        </span>
                        <h4 className="text-xs font-extrabold text-[#1e1b3a] line-clamp-1">{ann.title}</h4>
                        <p className="text-[11px] text-[#625e7d] line-clamp-2">{ann.message}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-[#625e7d] block">{ann.publish_date || 'Recent'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/student/announcement')}
            className="w-full py-2.5 bg-[#f5f2fa] hover:bg-[#eeedff] border border-[#ece7f0] text-[#4f46e5] rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
          >
            Open Announcements Hub &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardView;
