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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <Card className="rounded-xl shadow-xs border border-slate-200/80 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Teaching Workload & Distribution</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly periods, Class Teacher roles, and subject assignments across all teaching staff.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-sky-50 text-sky-700 font-semibold px-3 py-1.5 rounded-lg border border-sky-100">
            <GraduationCap className="w-4 h-4" />
            <span>{workloadData.length} Teachers on Duty</span>
          </div>
        </div>
      </Card>

      {/* Grid of Workload Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-600 border-t-transparent"></div>
          <p className="mt-2 text-xs text-slate-500">Calculating workload matrix...</p>
        </div>
      ) : workloadData.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          No teaching workload data available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workloadData.map(teacher => {
            const periods = parseInt(teacher.total_weekly_periods || 0, 10);
            const isFullLoad = periods >= 24;
            const isModerate = periods >= 12 && periods < 24;

            return (
              <Card
                key={teacher.id}
                className="rounded-xl shadow-xs border border-slate-200/80 p-5 hover:border-sky-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-700 font-bold flex items-center justify-center text-xs border border-sky-200">
                      {teacher.first_name?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {teacher.first_name} {teacher.last_name || ''}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {teacher.staff_code} • {teacher.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isFullLoad 
                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                      : isModerate 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {periods} Periods/wk
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Weekly Capacity (Max 30)</span>
                    <span className="font-semibold text-slate-800">{Math.round((periods / 30) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        isFullLoad ? 'bg-rose-500' : isModerate ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (periods / 30) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Role tags */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px]">
                  {teacher.is_class_teacher > 0 && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-0.5 font-semibold">
                      🛡️ Class Teacher
                    </Badge>
                  )}
                  {teacher.is_asst_class_teacher > 0 && (
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 px-2 py-0.5 font-semibold">
                      👥 Asst Class Teacher
                    </Badge>
                  )}
                  {teacher.is_coordinator > 0 && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-2 py-0.5 font-semibold">
                      ✨ Class Coordinator
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 px-2 py-0.5 font-semibold">
                    📚 {teacher.subjects_count} Subject(s) Assigned
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
