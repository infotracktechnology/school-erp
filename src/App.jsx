import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErpProvider } from './context/ErpContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import {
  DashboardPage,
  BranchesPage,
  AcademicSettingsPage,
  StudentsPage,
  AttendancePage,
  CommunicationPage,
  ModulePlaceholderPage,
  NotFoundPage,
  LoginPage,
  UserManagementPage,
  StudentPortalPage,
  StudentProfilePage,
  ExaminationPage,
  TimetablePage,
  CalendarPage,
  ModuleShowcaseHub,
  AnecdotesPage,
  StaffPage,
} from './pages';
import { StudentAnecdotesPortal } from './components/students/portal/StudentAnecdotesPortal';
import { HomeroomSampleView } from './components/dashboard/HomeroomSampleView';
import MenuAssignmentPage from './components/settings/MenuAssignmentPage';
export function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((param1, param2 = 'info') => {
    let message = param1;
    let type = param2;
    const knownTypes = ['info', 'success', 'error', 'warning'];
    if (knownTypes.includes(param1) && typeof param2 === 'string') {
      type = param1;
      message = param2;
    }
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, text: String(message || ''), type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ErpProvider showToast={showToast}>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AppLayout
                  toasts={toasts}
                  showToast={showToast}
                  dismissToast={dismissToast}
                />
              }
            >
              {/* Default entry - protected */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Main Application Pages */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Branch Settings - Admin only */}
            <Route 
              path="/branches" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <BranchesPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* Super Admin User Management */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/users" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />

            {/* Menu & Permission Assignment */}
            <Route 
              path="/menu-assignment" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <MenuAssignmentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/menu-assignment" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <MenuAssignmentPage />
                </ProtectedRoute>
              } 
            />

            {/* Academic Settings & Sub-tabs - Super Admin only */}
            <Route 
              path="/academic" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AcademicSettingsPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/academic/:tab" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AcademicSettingsPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* Students SIS & Sub-tabs */}
            <Route 
              path="/students" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal']}>
                  <StudentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/:subTab" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal']}>
                  <StudentsPage />
                </ProtectedRoute>
              } 
            />

            {/* Attendance & Sub-tabs */}
            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin', 'student']}>
                  <AttendancePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attendance/:submenu" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin', 'student']}>
                  <AttendancePage />
                </ProtectedRoute>
              } 
            />

            {/* Communication & Sub-tabs (Admin & Staff) */}
            <Route path="/communication" element={<CommunicationPage />} />
            <Route path="/communication/:submenu" element={<CommunicationPage />} />

            {/* Examination & Assessment System */}
            <Route 
              path="/examination" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <ExaminationPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/examination/:subTab" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <ExaminationPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/examinations" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <ExaminationPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* Timetable Management Module */}
            <Route 
              path="/timetable" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <TimetablePage showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timetable/:subTab" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <TimetablePage showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* Academic Calendar Route for Admin/Staff */}
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <CalendarPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* Anecdotes Module for Admin/Staff */}
            <Route 
              path="/anecdotes" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <AnecdotesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/anecdotes/:subTab" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <AnecdotesPage />
                </ProtectedRoute>
              } 
            />

            {/* Staff Management Module (Teaching & Non-Teaching) */}
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <StaffPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/:subTab" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'principal', 'teacher', 'branch_admin']}>
                  <StaffPage />
                </ProtectedRoute>
              } 
            />

            {/* Student Anecdotes Route */}
            <Route 
              path="/student/anecdotes" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentAnecdotesPortal />
                </ProtectedRoute>
              } 
            />

            {/* Dedicated Student-Only Portal Routes (Homework, Assignment, Announcement, Gallery, Profile) */}
            <Route 
              path="/student/profile" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfilePage showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfilePage showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Navigate to="/student/homework" replace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/:tab" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentPortalPage showToast={showToast} />
                </ProtectedRoute>
              } 
            />

            {/* ERP Modules Showcase & UI Hub */}
            <Route path="/modules" element={<ModuleShowcaseHub />} />
            <Route path="/showcase" element={<ModuleShowcaseHub />} />

            {/* Homeroom Modern UI Sample Preview Route */}
            <Route path="/preview/homeroom" element={<HomeroomSampleView />} />

            {/* Generic ERP Module Fallbacks */}
            <Route path="/:module" element={<ModulePlaceholderPage />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </ErpProvider>
  );
}

export default App;
