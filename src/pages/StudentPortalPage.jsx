import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, FileCheck2, Bell, Image as ImageIcon, CalendarCheck,
  Loader2, ArrowLeft, RefreshCw, User, Sparkles, AlertCircle, Calendar
} from 'lucide-react';
import { useErp } from '../context/ErpContext';
import { communicationService } from '../services/communicationService';
import { StudentHomeworkPortal } from '../components/students/portal/StudentHomeworkPortal';
import { StudentAssignmentPortal } from '../components/students/portal/StudentAssignmentPortal';
import { StudentAnnouncementPortal } from '../components/students/portal/StudentAnnouncementPortal';
import { StudentGalleryPortal } from '../components/students/portal/StudentGalleryPortal';
import { StudentAttendancePortal } from '../components/students/portal/StudentAttendancePortal';
import { StudentTimetablePortal } from '../components/students/portal/StudentTimetablePortal';
import { StudentCalendarPortal } from '../components/students/portal/StudentCalendarPortal';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const StudentPortalPage = ({ showToast }) => {
  const { tab = 'homework' } = useParams();
  const navigate = useNavigate();
  const { currentUser, activeAcademicYearId } = useErp();

  const [feedData, setFeedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const student = currentUser?.student || {};
  const studentId = student.id;

  const loadStudentFeed = useCallback(async () => {
    if (!studentId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await communicationService.getStudentPortalFeed(studentId, activeAcademicYearId);
      setFeedData(data);
    } catch (err) {
      console.error('Failed to load student portal feed:', err);
      setError(err.message || 'Failed to load your student feed');
      showToast?.(err.message || 'Failed to load your feed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [studentId, activeAcademicYearId, showToast]);

  useEffect(() => {
    loadStudentFeed();
  }, [loadStudentFeed]);

  const activeTab = tab.toLowerCase();

  const tabsConfig = [
    {
      id: 'calendar',
      label: 'Academic Calendar',
      icon: Calendar,
      count: 'Events',
      activeColor: 'bg-rose-600 text-white',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: Calendar,
      count: 'Weekly',
      activeColor: 'bg-indigo-600 text-white',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck,
      count: 'Report',
      activeColor: 'bg-emerald-600 text-white',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: BookOpen,
      count: feedData?.homework?.length || 0,
      activeColor: 'bg-cyan-600 text-white',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    {
      id: 'assignment',
      label: 'Assignments',
      icon: FileCheck2,
      count: feedData?.assignments?.length || 0,
      activeColor: 'bg-purple-600 text-white',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'announcement',
      label: 'Announcements',
      icon: Bell,
      count: feedData?.announcements?.length || 0,
      activeColor: 'bg-amber-600 text-white',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'gallery',
      label: 'Gallery & Events',
      icon: ImageIcon,
      count: feedData?.albums?.length || 0,
      activeColor: 'bg-rose-600 text-white',
      badgeColor: 'bg-rose-100 text-rose-800'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner with Student Information & Tab Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-2xl text-white shadow-inner">
              {student.first_name ? student.first_name[0] : (currentUser?.name ? currentUser.name[0] : 'S')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                  Student Portal
                </span>
                <span className="text-xs text-slate-300">
                  {currentUser?.branch_name || 'Campus'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {student.first_name ? `${student.first_name} ${student.last_name || ''}` : currentUser?.name}
              </h1>
              <p className="text-xs text-indigo-200 mt-0.5 flex flex-wrap items-center gap-x-2">
                <span>Admission No: <strong className="text-white">{student.admission_number || student.admission_no || 'N/A'}</strong></span>
                <span>•</span>
                <span>Class: <strong className="text-white">{student.class_name || 'Enrolled'} {student.section_name ? `(${student.section_name})` : ''}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={loadStudentFeed}
              disabled={isLoading}
              title="Refresh Portal Data"
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          {tabsConfig.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => navigate(`/student/${t.id}`)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shadow-xs ${
                  isActive
                    ? t.activeColor + ' shadow-md scale-102 font-extrabold'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'timetable' ? (
        <StudentTimetablePortal
          student={feedData?.student || student}
          academicYearId={activeAcademicYearId}
          branchId={currentUser?.branch_id}
        />
      ) : activeTab === 'attendance' ? (
        <StudentAttendancePortal
          student={feedData?.student || student}
          academicYearId={activeAcademicYearId}
          branchId={currentUser?.branch_id}
        />
      ) : isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-slate-700">Loading your student feed...</p>
          <p className="text-[11px] text-slate-400">Fetching homework, assignments, and announcements</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-xs space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Unable to load feed</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            onClick={loadStudentFeed}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div>
          {activeTab === 'calendar' && (
            <ErrorBoundary>
              <StudentCalendarPortal
                student={feedData?.student || student}
                academicYearId={activeAcademicYearId}
                branchId={currentUser?.branch_id}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'timetable' && (
            <StudentTimetablePortal
              student={feedData?.student || student}
              academicYearId={activeAcademicYearId}
              branchId={currentUser?.branch_id}
            />
          )}

          {activeTab === 'attendance' && (
            <StudentAttendancePortal
              student={feedData?.student || student}
              academicYearId={activeAcademicYearId}
            />
          )}

          {activeTab === 'homework' && (
            <StudentHomeworkPortal
              homework={feedData?.homework || []}
              student={feedData?.student || student}
              assignedSubjects={feedData?.assigned_subjects || []}
              onRefresh={loadStudentFeed}
            />
          )}

          {activeTab === 'assignment' && (
            <StudentAssignmentPortal
              assignments={feedData?.assignments || []}
              student={feedData?.student || student}
              onRefresh={loadStudentFeed}
              showToast={showToast}
            />
          )}

          {activeTab === 'announcement' && (
            <StudentAnnouncementPortal
              announcements={feedData?.announcements || []}
              student={feedData?.student || student}
            />
          )}

          {activeTab === 'gallery' && (
            <StudentGalleryPortal
              albums={feedData?.albums || []}
              student={feedData?.student || student}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPortalPage;
