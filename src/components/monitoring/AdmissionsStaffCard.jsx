import React from 'react';
import { UserCheck, Building2, ArrowUpRight } from 'lucide-react';
export const AdmissionsStaffCard = ({ studentData, admissionsData, staffData, onDrillDown }) => {
    if (!studentData || !admissionsData || !staffData)
        return null;
    return (<div id="admissions-staff-card" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Admissions Pipeline & Student Strength */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl">
                <UserCheck className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Admissions Pipeline & Conversion
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Funnel conversion metrics from lead enquiries to admitted enrollments.
                </p>
              </div>
            </div>

            <button onClick={() => onDrillDown('admissions')} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700">
              Admissions Drill-Down <ArrowUpRight className="w-3.5 h-3.5"/>
            </button>
          </div>

          {/* Stat Badges */}
          <div className="p-6 grid grid-cols-3 gap-3">
            <div className="bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase">Enquiries</span>
              <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">{admissionsData.total_enquiries?.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500">Inbound Leads</div>
            </div>

            <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">Admitted</span>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{admissionsData.admissions_completed?.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-600 font-medium">{admissionsData.conversion_rate}% Conversion</div>
            </div>

            <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Pending</span>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{admissionsData.pending_admissions}</div>
              <div className="text-[10px] text-amber-600">Pending Fees / Docs</div>
            </div>
          </div>

          {/* Admissions Branch Breakdown */}
          <div className="px-6 pb-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Branch</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Enquiries</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Selected</th>
                    <th className="py-2.5 px-3 font-semibold text-right text-emerald-600">Admitted</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Conversion %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {admissionsData.branches.map((b) => (<tr key={b.branch_id} onClick={() => onDrillDown('admissions', b.branch_id)} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-gray-900 dark:text-white">
                        {b.branch_name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">{b.enquiry}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{b.selected}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">{b.admission}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white">
                        {b.conversion_rate}%
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Staff & HR Operations */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl">
                <Building2 className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Staff Strength & Attendance Monitoring
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Teaching and non-teaching workforce distribution and daily biometric attendance.
                </p>
              </div>
            </div>

            <button onClick={() => onDrillDown('staff')} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700">
              Staff Drill-Down <ArrowUpRight className="w-3.5 h-3.5"/>
            </button>
          </div>

          {/* Stat Badges */}
          <div className="p-6 grid grid-cols-3 gap-3">
            <div className="bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase">Total Staff</span>
              <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">{staffData.total_staff}</div>
              <div className="text-[10px] text-gray-500">{staffData.teaching_staff} Teaching • {staffData.non_teaching_staff} Non-Tch</div>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Present</span>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{staffData.present}</div>
              <div className="text-[10px] text-emerald-600 font-medium">{Math.round((staffData.present / staffData.total_staff) * 100)}% Present Today</div>
            </div>

            <div className="bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">Absent / Leave</span>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">{staffData.absent + staffData.leave}</div>
              <div className="text-[10px] text-rose-600">{staffData.absent} Absent • {staffData.leave} Leave</div>
            </div>
          </div>

          {/* Staff Branch Comparison */}
          <div className="px-6 pb-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Branch</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Total Staff</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Teaching</th>
                    <th className="py-2.5 px-3 font-semibold text-right text-emerald-600">Present</th>
                    <th className="py-2.5 px-4 font-semibold text-right text-rose-600">Absent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {staffData.branches.map((b) => (<tr key={b.branch_id} onClick={() => onDrillDown('staff', b.branch_id)} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-gray-900 dark:text-white">
                        {b.branch_name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">{b.total_staff}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{b.teaching}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">{b.present}</td>
                      <td className="py-2.5 px-4 text-right font-medium text-rose-600">{b.absent}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
