import React, { useState } from 'react';
import { BarChart3, Users, CalendarCheck, CreditCard, GraduationCap, BookOpen } from 'lucide-react';
export const VisualComparisonsSection = ({ comparisons, onBranchSelect }) => {
    const [activeTab, setActiveTab] = useState('attendance');
    if (!comparisons)
        return null;
    const formatINR = (val) => {
        if (val >= 10000000)
            return `₹ ${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000)
            return `₹ ${(val / 100000).toFixed(2)} L`;
        return `₹ ${val.toLocaleString('en-IN')}`;
    };
    const tabs = [
        { id: 'attendance', label: 'Attendance %', icon: CalendarCheck },
        { id: 'students', label: 'Student Strength', icon: Users },
        { id: 'fees', label: 'Fee Recovery', icon: CreditCard },
        { id: 'exams', label: 'Exam Completion', icon: GraduationCap },
        { id: 'gradebook', label: 'Grade Book Entry', icon: BookOpen }
    ];
    return (<div id="visual-comparisons-section" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4 bg-gray-50/50 dark:bg-gray-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <BarChart3 className="w-5 h-5"/>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Branch Benchmark & Visual Comparison
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Comparative ranking analytics across branches for operational parity.
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (<button key={tab.id} id={`visual-tab-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${active
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                <Icon className="w-3.5 h-3.5"/>
                {tab.label}
              </button>);
        })}
        </div>
      </div>

      {/* Bar Visualizations */}
      <div className="p-6">
        {/* ATTENDANCE BARS */}
        {activeTab === 'attendance' && (<div className="space-y-4">
            {comparisons.attendance.map((item, idx) => {
                const pct = item.value;
                return (<div key={item.branch_id} onClick={() => onBranchSelect && onBranchSelect(item.branch_id)} className="group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.branch_name}</span>
                      <span className="text-[11px] text-gray-400">({item.subtext})</span>
                    </div>
                    <span className={`font-bold ${pct < 92 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${pct >= 94
                        ? 'bg-emerald-500'
                        : pct >= 92
                            ? 'bg-blue-500'
                            : 'bg-rose-500'}`} style={{ width: `${pct}%` }}/>
                  </div>
                </div>);
            })}
          </div>)}

        {/* STUDENT STRENGTH BARS */}
        {activeTab === 'students' && (<div className="space-y-4">
            {comparisons.students.map((item, idx) => {
                const max = Math.max(...comparisons.students.map(s => s.value));
                const barWidth = max > 0 ? (item.value / max) * 100 : 0;
                return (<div key={item.branch_id} onClick={() => onBranchSelect && onBranchSelect(item.branch_id)} className="group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.branch_name}</span>
                      <span className="text-[11px] text-gray-400">({item.subtext})</span>
                    </div>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">
                      {item.value.toLocaleString()} students ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${barWidth}%` }}/>
                  </div>
                </div>);
            })}
          </div>)}

        {/* FEES BARS */}
        {activeTab === 'fees' && (<div className="space-y-4">
            {comparisons.fees.map((item, idx) => {
                const rate = item.collection_rate;
                return (<div key={item.branch_id} onClick={() => onBranchSelect && onBranchSelect(item.branch_id)} className="group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.branch_name}</span>
                      <span className="text-[11px] text-gray-400">
                        (Collected: {formatINR(item.collected)} • Pending: {formatINR(item.pending)})
                      </span>
                    </div>
                    <span className={`font-bold ${rate < 85 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {rate}% Recovered
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${rate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${rate}%` }}/>
                  </div>
                </div>);
            })}
          </div>)}

        {/* EXAM COMPLETION BARS */}
        {activeTab === 'exams' && comparisons.exams && (<div className="space-y-4">
            {comparisons.exams.map((item, idx) => {
                const val = item.value;
                return (<div key={item.branch_id} onClick={() => onBranchSelect && onBranchSelect(item.branch_id)} className="group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.branch_name}</span>
                    </div>
                    <span className={`font-bold ${val < 80 ? 'text-rose-600' : 'text-purple-600'}`}>
                      {val}% Finished
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${val}%` }}/>
                  </div>
                </div>);
            })}
          </div>)}

        {/* GRADE BOOK COMPLETION BARS */}
        {activeTab === 'gradebook' && comparisons.gradebook && (<div className="space-y-4">
            {comparisons.gradebook.map((item, idx) => {
                const val = item.value;
                return (<div key={item.branch_id} onClick={() => onBranchSelect && onBranchSelect(item.branch_id)} className="group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.branch_name}</span>
                    </div>
                    <span className={`font-bold ${val < 75 ? 'text-rose-600' : 'text-indigo-600'}`}>
                      {val}% Marks Entered
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${val < 75 ? 'bg-rose-500' : 'bg-indigo-600'}`} style={{ width: `${val}%` }}/>
                  </div>
                </div>);
            })}
          </div>)}
      </div>
    </div>);
};
