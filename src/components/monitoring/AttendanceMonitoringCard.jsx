import React from 'react';
import { CalendarCheck, ArrowUpRight } from 'lucide-react';
export const AttendanceMonitoringCard = ({ data, onDrillDown }) => {
    if (!data)
        return null;
    const totalStudents = data.total_students || 0;
    const presentCount = data.present || 0;
    const absentCount = data.absent || 0;
    const leaveCount = data.leave || 0;
    const presentPct = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
    const absentPct = totalStudents > 0 ? ((absentCount / totalStudents) * 100).toFixed(1) : '0.0';
    const leavePct = totalStudents > 0 ? ((leaveCount / totalStudents) * 100).toFixed(1) : '0.0';
    const branches = Array.isArray(data.branches) ? data.branches : [];
    return (<div id="attendance-monitoring-card" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CalendarCheck className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Attendance Monitoring & Daily Operations
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                  {data.overall_percentage ?? 0}% Overall
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Daily student attendance tracking with branch-wise distribution and live roll-call statistics.
              </p>
            </div>
          </div>

          <button id="attendance-full-drilldown-btn" onClick={() => onDrillDown()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs">
            Hierarchical Drill-Down
            <ArrowUpRight className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* 4 Stat Badges */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Present Today
            </span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {presentCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
              {presentPct}% of total strength
            </div>
          </div>

          <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              Absent Today
            </span>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {absentCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
              {absentPct}% of total strength
            </div>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              On Approved Leave
            </span>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {leaveCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
              {leavePct}% leaves verified
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Total Enrolled
            </span>
            <div className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
              {totalStudents.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500">
              Active in academic year
            </div>
          </div>
        </div>

        {/* Branch breakdown table */}
        <div className="px-6 pb-6">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Branch Name</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Students</th>
                  <th className="py-2.5 px-3 font-semibold text-right text-emerald-600">Present</th>
                  <th className="py-2.5 px-3 font-semibold text-right text-rose-600">Absent</th>
                  <th className="py-2.5 px-3 font-semibold text-right text-amber-600">Leave</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Attendance %</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {branches.map((b, idx) => (<tr key={`att-b-${b.branch_id}-${idx}`} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-gray-900 dark:text-white">
                      {b.branch_name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium">{(b.total_students ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-medium">{(b.present ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-rose-600 font-medium">{(b.absent ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-amber-600 font-medium">{(b.leave ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white">
                      <span className={(b.attendance_percentage ?? 0) < 92 ? 'text-rose-600 dark:text-rose-400' : ''}>
                        {b.attendance_percentage ?? 0}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button onClick={() => onDrillDown(b.branch_id)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center gap-0.5">
                        Drill Down <ArrowUpRight className="w-3 h-3"/>
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);
};
