import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, FileCheck2, Bell, Image, Loader2 } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
export const CommunicationDashboardView = ({ branchId, academicYearId, showToast, onNavigateSubmenu }) => {
    const [summary, setSummary] = useState(null);
    const [hwMonitoring, setHwMonitoring] = useState([]);
    const [asgnMonitoring, setAsgnMonitoring] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadDashboard = useCallback(async () => {
        setIsLoading(true);
        try {
            const [sumData, hwData, asgnData] = await Promise.all([
                communicationService.getDashboardSummary(branchId, academicYearId),
                communicationService.getHomeworkMonitoring(branchId, academicYearId),
                communicationService.getAssignmentMonitoring(branchId, academicYearId)
            ]);
            setSummary(sumData);
            setHwMonitoring(hwData.data || []);
            setAsgnMonitoring(asgnData.data || []);
        }
        catch (err) {
            showToast(err.message || 'Failed to load communication analytics', 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, showToast]);
    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);
    if (isLoading) {
        return (<div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-7 h-7 text-cyan-700 animate-spin"/>
        <p className="text-xs font-semibold text-slate-600">Loading branch communication metrics...</p>
      </div>);
    }
    return (<div className="space-y-6">
      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Homework Metric */}
        <div onClick={() => onNavigateSubmenu('homework')} className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5"/>
            </span>
            <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              Postings
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{summary?.homework?.total || 0}</h3>
            <p className="text-xs font-semibold text-slate-500">Total Homework Postings</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Published: {summary?.homework?.published || 0}</span>
            <span>Draft: {summary?.homework?.draft || 0}</span>
          </div>
        </div>

        {/* Assignment Metric */}
        <div onClick={() => onNavigateSubmenu('assignment')} className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5"/>
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Evaluated
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{summary?.assignment?.total || 0}</h3>
            <p className="text-xs font-semibold text-slate-500">Active Assignments</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Online: {summary?.assignment?.online || 0}</span>
            <span>Offline: {summary?.assignment?.offline || 0}</span>
          </div>
        </div>

        {/* Announcement Metric */}
        <div onClick={() => onNavigateSubmenu('announcement')} className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5"/>
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {summary?.announcement?.scheduled || 0} Scheduled
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{summary?.announcement?.total || 0}</h3>
            <p className="text-xs font-semibold text-slate-500">Broadcast Announcements</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Published: {summary?.announcement?.published || 0}</span>
            <span>Scheduled: {summary?.announcement?.scheduled || 0}</span>
          </div>
        </div>

        {/* Gallery Metric */}
        <div onClick={() => onNavigateSubmenu('gallery')} className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-rose-50 text-rose-700 group-hover:scale-105 transition-transform">
              <Image className="w-5 h-5"/>
            </span>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              {summary?.gallery?.scheduled || 0} Scheduled
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{summary?.gallery?.total_albums || 0}</h3>
            <p className="text-xs font-semibold text-slate-500">Photo & Video Archives</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Published: {summary?.gallery?.published || 0}</span>
            <span>Scheduled: {summary?.gallery?.scheduled || 0}</span>
          </div>
        </div>
      </div>

      {/* Monitoring Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homework Monitoring Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-cyan-700"/>
              <h3 className="text-sm font-bold text-slate-900">Homework Subject Coverage</h3>
            </div>
            <span className="text-[11px] text-slate-400">Class-wise audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Class & Section</th>
                  <th className="py-2.5 px-3">Homework Given</th>
                  <th className="py-2.5 px-3">Active Subjects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hwMonitoring.length === 0 ? (<tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 text-xs">
                      No homework posted yet for this branch
                    </td>
                  </tr>) : (hwMonitoring.map((row, idx) => (<tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {row.class_name} • {row.section_name}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800">
                          {row.homework_count} Tasks
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-[200px]">
                        {row.subjects_covered}
                      </td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Submission Monitoring */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-purple-700"/>
              <h3 className="text-sm font-bold text-slate-900">Assignment Completion Health</h3>
            </div>
            <span className="text-[11px] text-slate-400">Student submissions</span>
          </div>

          <div className="space-y-3">
            {asgnMonitoring.length === 0 ? (<div className="py-8 text-center text-slate-400 text-xs">
                No assignments created yet for this branch
              </div>) : (asgnMonitoring.map((asgn) => {
            const total = asgn.total_targeted_students || 1;
            const submitted = asgn.submitted_count || 0;
            const reviewed = asgn.reviewed_count || 0;
            const percent = Math.min(Math.round((submitted / total) * 100), 100);
            return (<div key={asgn.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{asgn.title}</span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          ({asgn.class_name} • {asgn.section_name})
                        </span>
                      </div>
                      <span className="font-bold text-purple-700">{percent}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${percent}%` }}/>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Submitted: {submitted}/{total}</span>
                      <span>Reviewed: {reviewed}</span>
                      <span className="font-semibold text-rose-600">Due: {asgn.due_date}</span>
                    </div>
                  </div>);
        }))}
          </div>
        </div>
      </div>
    </div>);
};
