import React, { useState, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  Calendar,
  Award,
  Users,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import staffService from '../../services/staffService';

export default function TeachingWorkloadView({ branchId = 1 }) {
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        setLoading(true);
        const res = await staffService.getWorkloadSummary({ branch_id: branchId });
        setWorkloadData(res.data || []);
      } catch (err) {
        console.error('[TeachingWorkloadView Error]:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkload();
  }, [branchId]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Teaching Workload & Distribution</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Weekly periods, Class Teacher roles, and subject assignments across all teaching staff.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg border border-indigo-100">
            <GraduationCap className="w-4 h-4" />
            <span>{workloadData.length} Teachers on Duty</span>
          </div>
        </div>
      </div>

      {/* Grid of Workload Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-xs text-gray-500">Calculating workload matrix...</p>
        </div>
      ) : workloadData.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-xs">
          No teaching workload data available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workloadData.map(teacher => {
            const periods = parseInt(teacher.total_weekly_periods || 0, 10);
            const isFullLoad = periods >= 24;
            const isModerate = periods >= 12 && periods < 24;

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {teacher.first_name?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {teacher.first_name} {teacher.last_name || ''}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {teacher.staff_code} • {teacher.department}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isFullLoad 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : isModerate 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {periods} Periods/wk
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Weekly Capacity (Max 30)</span>
                    <span className="font-semibold text-gray-800">{Math.round((periods / 30) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        isFullLoad ? 'bg-rose-500' : isModerate ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (periods / 30) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Role tags */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5 text-[10px]">
                  {teacher.is_class_teacher > 0 && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      🛡️ Class Teacher
                    </span>
                  )}
                  {teacher.is_asst_class_teacher > 0 && (
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                      👥 Asst Class Teacher
                    </span>
                  )}
                  {teacher.is_coordinator > 0 && (
                    <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-semibold">
                      ✨ Class Coordinator
                    </span>
                  )}
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                    📚 {teacher.subjects_count} Subject(s) Assigned
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
