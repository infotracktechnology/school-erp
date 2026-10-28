import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Users, UserCheck, CreditCard, CalendarCheck, ArrowUpRight, Shield, Globe, RefreshCw, AlertCircle, Lock, BookOpen } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { getSuperAdminDashboardData } from '../../services/api';
import { DrillDownModal } from '../monitoring/DrillDownModal';
import { ProcessMatrixSection } from '../monitoring/ProcessMatrixSection';
import { NeedsAttentionSection } from '../monitoring/NeedsAttentionSection';
import { BranchPerformanceTable } from '../monitoring/BranchPerformanceTable';
import { AttendanceMonitoringCard } from '../monitoring/AttendanceMonitoringCard';
import { ExamGradeBookCard } from '../monitoring/ExamGradeBookCard';
import { FeesFinanceCard } from '../monitoring/FeesFinanceCard';
import { AdmissionsStaffCard } from '../monitoring/AdmissionsStaffCard';
import { VisualComparisonsSection } from '../monitoring/VisualComparisonsSection';
import { ClassModuleFeeds } from './ClassModuleFeeds';
export const SuperAdminDashboard = ({ onNavigateToStudents, onNavigateToSettings }) => {
    const { branches, activeBranchId, setActiveBranchId, activeAcademicYear, isAllBranches, userRole, setUserRole, assignedBranchId, isHistoricalYear, showToast } = useErp();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    // Drill-Down Modal state
    const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
    const [drillDownType, setDrillDownType] = useState('attendance');
    const [drillDownBranchId, setDrillDownBranchId] = useState('all');
    const loadMetrics = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) {
            setIsRefreshing(true);
        }
        else {
            setIsLoading(true);
        }
        setFetchError(null);
        try {
            const yearName = activeAcademicYear?.name || '2026-2027';
            const data = await getSuperAdminDashboardData(activeBranchId || 'all', yearName, userRole, assignedBranchId);
            setDashboardData(data);
        }
        catch (err) {
            console.error('Failed to load dashboard metrics:', err);
            setFetchError(err.message || 'Unable to load consolidated dashboard data.');
        }
        finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [activeBranchId, activeAcademicYear, userRole, assignedBranchId]);
    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);
    // Handler to open drill-down modal from any section
    const handleOpenDrillDown = (type, branchId) => {
        setDrillDownType(type);
        setDrillDownBranchId(branchId !== undefined ? branchId : (activeBranchId || 'all'));
        setIsDrillDownOpen(true);
    };
    // Handler for Needs Attention alert actions
    const handleAlertAction = (target) => {
        setDrillDownType(target.type);
        setDrillDownBranchId(target.branch_id);
        setIsDrillDownOpen(true);
    };
    // Format currency
    const formatINR = (val) => {
        if (val >= 10000000)
            return `₹ ${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000)
            return `₹ ${(val / 100000).toFixed(2)} L`;
        return `₹ ${val.toLocaleString('en-IN')}`;
    };
    const currentYearName = activeAcademicYear?.name || '2026–2027';
    const cards = dashboardData?.cards;
    return (<div id="super-admin-overall-monitoring-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Organization Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-teal-500/0 rounded-full blur-3xl pointer-events-none"/>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                <Shield className="w-3.5 h-3.5"/>
                <span>{userRole === 'super_admin' ? 'SUPER ADMIN DASHBOARD' : 'BRANCH ADMIN DASHBOARD'}</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 text-xs font-medium">
                Organization: <strong className="text-white font-semibold">{dashboardData?.organization?.name || 'Green Park Coaching Centre'}</strong>
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center space-x-1 bg-slate-800 text-emerald-300 px-2 py-0.5 rounded text-xs font-mono font-medium border border-slate-700">
                <span>Academic Year: {currentYearName}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              {isAllBranches ? (<>
                  <Globe className="w-7 h-7 text-indigo-400"/>
                  <span>Overall Branch Monitoring Dashboard</span>
                </>) : (<>
                  <Building2 className="w-7 h-7 text-teal-400"/>
                  <span>
                    {branches.find(b => b.id === activeBranchId)?.branch_name || 'Campus'} Branch Monitoring
                  </span>
                </>)}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              {isAllBranches ? (<>
                  Centralized multi-branch control center monitoring academic process completion, attendance benchmarks, examination status, fee recoveries, and staff health across all <strong>{branches.length} branches</strong>.
                </>) : (<>
                  Focused operational monitoring for <strong>{branches.find(b => b.id === activeBranchId)?.branch_name}</strong>. Drill down to inspect classes, sections, exams, and individual student performance.
                </>)}
            </p>
          </div>

          {/* Controls: Role Simulator & Refresh */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2.5 shrink-0">
            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 rounded-xl p-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Role:</span>
              <button type="button" id="role-super-admin-btn" onClick={() => setUserRole('super_admin')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${userRole === 'super_admin'
            ? 'bg-indigo-600 text-white shadow-2xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                Super Admin
              </button>
              <button type="button" id="role-branch-admin-btn" onClick={() => setUserRole('branch_admin')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${userRole === 'branch_admin'
            ? 'bg-teal-600 text-white shadow-2xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                Branch Admin
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button type="button" id="refresh-dashboard-btn" onClick={() => loadMetrics(true)} disabled={isRefreshing} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer" title="Refresh dashboard aggregation">
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`}/>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
              </button>

              {isAllBranches ? (<span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-2.5 py-1 rounded-lg">
                  Scope: ALL ({branches.length} Branches)
                </span>) : (<button type="button" id="switch-back-to-all-branches" onClick={() => setActiveBranchId('all')} className="text-[11px] font-bold text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1">
                  <Globe className="w-3 h-3"/>
                  <span>Return to All Branches</span>
                </button>)}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Read-Only Notice (if applicable) */}
      {isHistoricalYear && (<div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0"/>
            <span>
              <strong>Historical Academic Session ({currentYearName}):</strong> Monitoring metrics reflect locked historical archives.
            </span>
          </div>
          <span className="text-[11px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
            Archived Audit Record
          </span>
        </div>)}

      {/* Error state */}
      {fetchError && (<div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0"/>
            <span>{fetchError}</span>
          </div>
          <button type="button" onClick={() => loadMetrics()} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700">
            Retry
          </button>
        </div>)}

      {/* Section 13: Needs Attention & Actionable Alerts */}
      <NeedsAttentionSection items={dashboardData?.needs_attention} onActionClick={handleAlertAction}/>

      {/* Section 1: Consolidated KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Active Campuses */}
        <div className="bg-white dark:bg-gray-900 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              {isAllBranches ? 'Total Campuses' : 'Campus Scope'}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Building2 className="w-4 h-4"/>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {isAllBranches ? `${cards?.total_branches || branches.length} Campuses` : 'Single Branch'}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {isAllBranches ? `${cards?.active_branches || branches.length} Active in Academic Year` : branches.find(b => b.id === activeBranchId)?.branch_name}
            </div>
          </div>
        </div>

        {/* Card 2: Student Strength */}
        <div onClick={() => handleOpenDrillDown('students')} className="bg-white dark:bg-gray-900 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-400 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Student Strength
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 group-hover:bg-indigo-100">
              <Users className="w-4 h-4"/>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
              <span>{(cards?.total_students || 4850).toLocaleString()}</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600"/>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {(cards?.active_students || 4792).toLocaleString()} Active • {cards?.inactive_students || 58} Inactive
            </div>
          </div>
        </div>

        {/* Card 3: Attendance Benchmark */}
        <div onClick={() => handleOpenDrillDown('attendance')} className="bg-white dark:bg-gray-900 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Avg Attendance
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:bg-emerald-100">
              <CalendarCheck className="w-4 h-4"/>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
              <span>{cards?.overall_attendance_percentage || cards?.today_attendance_percentage || 92.5}%</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600"/>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Daily Target: 94.0% Benchmark
            </div>
          </div>
        </div>

        {/* Card 4: Fee Recovery Rate */}
        <div onClick={() => handleOpenDrillDown('fees')} className="bg-white dark:bg-gray-900 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Fee Recovery
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 group-hover:bg-amber-100">
              <CreditCard className="w-4 h-4"/>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
              <span>{cards?.fee_recovery_rate || 89}%</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600"/>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Collected: {formatINR(cards?.fee_collection || 89240000)}
            </div>
          </div>
        </div>

        {/* Card 5: Staff Strength */}
        <div onClick={() => handleOpenDrillDown('staff')} className="bg-white dark:bg-gray-900 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-teal-400 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Total Staff
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400 group-hover:bg-teal-100">
              <UserCheck className="w-4 h-4"/>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
              <span>{cards?.total_staff || 420}</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600"/>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Ratio: 1 : {cards?.student_staff_ratio || 12} (Students/Staff)
            </div>
          </div>
        </div>

        {/* Card 6: Classes & Sections */}
        <div onClick={() => onNavigateToSettings && onNavigateToSettings('academic-settings')} className="bg-white dark:bg-gray-900 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-purple-400 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Classes & Sections
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 group-hover:bg-purple-100">
              <BookOpen className="w-4 h-4"/>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
              <span>{cards?.total_classes || 140} Classes</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600"/>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {cards?.total_sections || 310} Assigned Sections
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Branch Performance / Process Status Scorecard */}
      {dashboardData?.branch_performance && (<BranchPerformanceTable branches={dashboardData.branch_performance} onViewBranch={(bId) => setActiveBranchId(bId)} onDrillDown={(type, bId) => handleOpenDrillDown(type, bId)}/>)}

      {/* Real-time Class & Module Feeds Across Modules */}
      <ClassModuleFeeds 
        branchId={activeBranchId} 
        academicYearId={activeAcademicYear?.id || 2} 
        title="Live Academic & Module Feeds (All Classes)"
        subtitle="Live roll-call completion, homework submissions, published examination grades & campus alerts"
      />

      {/* Section 3: Attendance Summary & Breakdown */}
      <AttendanceMonitoringCard data={dashboardData?.attendance_summary} onDrillDown={(bId) => handleOpenDrillDown('attendance', bId)}/>

      {/* Section 4 & 5: Examination & Grade Book Monitoring */}
      <ExamGradeBookCard examData={dashboardData?.examination_summary} gradeBookData={dashboardData?.gradebook_summary} onDrillDown={(type, bId) => handleOpenDrillDown(type, bId)}/>

      {/* Section 8: Fees / Finance Monitoring */}
      <FeesFinanceCard data={dashboardData?.fees_summary} onDrillDown={(bId) => handleOpenDrillDown('fees', bId)}/>

      {/* Section 7 & 9: Admissions Pipeline & Staff / HR Monitoring */}
      <AdmissionsStaffCard studentData={dashboardData?.student_summary} admissionsData={dashboardData?.admissions_summary} staffData={dashboardData?.staff_summary} onDrillDown={(type, bId) => handleOpenDrillDown(type, bId)}/>

      {/* Section 10: Process Completion Status Matrix */}
      <ProcessMatrixSection data={dashboardData?.process_completion} branches={branches} onProcessClick={(proc, bId) => {
            if (proc.toLowerCase().includes('attendance'))
                handleOpenDrillDown('attendance', bId);
            else if (proc.toLowerCase().includes('exam'))
                handleOpenDrillDown('examination', bId);
            else if (proc.toLowerCase().includes('grade'))
                handleOpenDrillDown('gradebook', bId);
            else if (proc.toLowerCase().includes('fee'))
                handleOpenDrillDown('fees', bId);
            else if (proc.toLowerCase().includes('staff'))
                handleOpenDrillDown('staff', bId);
            else
                handleOpenDrillDown('students', bId);
        }}/>

      {/* Section 12: Visual Comparison Bar Charts */}
      <VisualComparisonsSection comparisons={dashboardData?.comparisons} onBranchSelect={(bId) => setActiveBranchId(bId)}/>

      {/* Section 14: Progressive Drill-Down Modal */}
      <DrillDownModal isOpen={isDrillDownOpen} onClose={() => setIsDrillDownOpen(false)} initialType={drillDownType} initialBranchId={drillDownBranchId} academicYearName={currentYearName} onSelectBranch={(bId) => setActiveBranchId(bId)}/>
    </div>);
};
