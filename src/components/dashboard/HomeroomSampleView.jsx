import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  CalendarCheck, 
  BookOpen, 
  GraduationCap, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight,
  User,
  Coffee,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';

export const HomeroomSampleView = ({ studentName = "Maya Okafor", className = "Class 10-A" }) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b3a] p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* ── Top Bar ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-[#ece7f0] shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#4f46e5] flex items-center justify-center text-white shadow-md shadow-[#4f46e5]/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold tracking-tight text-[#1e1b3a]">Homeroom Portal</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#eeedff] text-[#4f46e5]">
                Harbourview Campus
              </span>
            </div>
            <p className="text-xs text-[#625e7d] font-medium">Academic Year 2025–2026 • Autumn Term</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-[#f5f2fa] border border-[#ece7f0] text-xs font-semibold text-[#625e7d]">
            <Clock className="w-3.5 h-3.5 text-[#4f46e5]" />
            <span>Today, 10:25 AM</span>
          </div>

          <div className="flex items-center space-x-2.5 pl-2 border-l border-[#ece7f0]">
            <div className="w-9 h-9 rounded-2xl bg-[#eeedff] text-[#4f46e5] font-black text-xs flex items-center justify-center border border-[#4f46e5]/20">
              MO
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-black text-[#1e1b3a]">{studentName}</span>
              <span className="block text-[11px] text-[#625e7d]">{className}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Grid: Homeroom Hero Greeting + Circular Attendance Ring ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Friendly Warm Greeting Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#ece7f0] shadow-sm relative overflow-hidden flex flex-col justify-between">
          {/* Subtle Decorative Backdrop Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#fff0eb] to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 w-48 h-48 bg-[#eeedff]/60 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#ff7a5c]">
              <span className="w-2 h-2 rounded-full bg-[#ff7a5c] animate-pulse" />
              <span>Thursday, 24 September • Week 4</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b3a]">
                Good morning, Maya 👋
              </h1>
              <p className="text-sm text-[#625e7d] mt-1.5 max-w-xl leading-relaxed">
                You've handed in <strong className="text-[#1e1b3a]">12 assignments on time</strong> in a row! Two more and you unlock the Steady Hand merit badge.
              </p>
            </div>
          </div>

          {/* Quick Glances Row */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 mt-6 border-t border-[#ece7f0]/80">
            {/* Stat 1: Up Next */}
            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#625e7d] flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4f46e5]" />
                <span>Up next</span>
              </span>
              <div className="mt-2">
                <span className="text-base font-extrabold text-[#1e1b3a]">Biology Practical</span>
                <p className="text-[11px] text-[#625e7d]">11:20 AM • Lab S2</p>
              </div>
            </div>

            {/* Stat 2: Tasks Due */}
            <div className="p-4 rounded-2xl bg-[#fff0eb] border border-[#ffd5cc] flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b1361b] flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#ff7a5c]" />
                <span>Due this week</span>
              </span>
              <div className="mt-2">
                <span className="text-base font-extrabold text-[#1e1b3a]">4 Tasks</span>
                <p className="text-[11px] text-[#b1361b] font-medium">1 due before 15:00</p>
              </div>
            </div>

            {/* Stat 3: Merit Points */}
            <div className="p-4 rounded-2xl bg-[#eeedff] border border-[#d8d5ff] flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4f46e5] flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-[#4f46e5]" />
                <span>Merit Points</span>
              </span>
              <div className="mt-2">
                <span className="text-base font-extrabold text-[#1e1b3a]">127 pts</span>
                <div className="w-full bg-white/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div className="bg-[#4f46e5] h-1.5 rounded-full" style={{ width: '84%' }} />
                </div>
                <p className="text-[10px] text-[#625e7d] mt-1">23 more for Silver award</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Homeroom Circular Attendance Ring */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#ece7f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#ece7f0]">
            <div>
              <h2 className="text-base font-black text-[#1e1b3a]">Attendance</h2>
              <p className="text-[11px] text-[#625e7d]">Term Record & Targets</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e4f5eb] text-[#177245] border border-[#bfe7cd]">
              ✓ On Track
            </span>
          </div>

          {/* SVG Circular Ring */}
          <div className="my-5 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
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
                  strokeDasharray="314"
                  strokeDashoffset="314 - (314 * 0.965)"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#1e1b3a] tracking-tight">96.5%</span>
                <span className="text-[10px] font-bold text-[#625e7d] uppercase tracking-wider">This Term</span>
              </div>
            </div>

            {/* Attendance Legends */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs py-1 border-b border-[#ece7f0]/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
                  <span className="text-[#625e7d]">Present</span>
                </div>
                <strong className="text-[#1e1b3a]">82 sessions</strong>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-[#ece7f0]/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a5c]" />
                  <span className="text-[#625e7d]">Late</span>
                </div>
                <strong className="text-[#1e1b3a]">1 session</strong>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-[#625e7d]">Authorised Leave</span>
                </div>
                <strong className="text-[#1e1b3a]">3 sessions</strong>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#625e7d] bg-[#f5f2fa] p-3 rounded-2xl border border-[#ece7f0] text-center">
            🎯 School target: <strong>95%</strong>. You are <strong>1.5%</strong> above standard.
          </p>
        </div>
      </div>

      {/* ── Main Content Grid: Live Lesson Timeline + Tasks & Grades ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Today's Lesson Timeline */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#ece7f0] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ece7f0]">
            <div>
              <h2 className="text-base font-black text-[#1e1b3a]">Today's Timetable</h2>
              <p className="text-[11px] text-[#625e7d]">Thursday • Period Progression</p>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#eeedff] text-[#4f46e5]">
              <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-ping" />
              <span>10:25 AM</span>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#ece7f0]">
            {/* Lesson 1 (Done) */}
            <div className="relative pl-10">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] opacity-80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-[#1e1b3a]">Registration & Form</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Done
                  </span>
                </div>
                <p className="text-[11px] text-[#625e7d] mt-0.5">08:40 – 09:00 • Mrs. Fairweather • Room B12</p>
              </div>
            </div>

            {/* Lesson 2 (Done) */}
            <div className="relative pl-10">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] opacity-80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-[#1e1b3a]">Mathematics</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Done
                  </span>
                </div>
                <p className="text-[11px] text-[#625e7d] mt-0.5">09:00 – 10:00 • Mr. Adeyemi • Room M4</p>
                <p className="text-[11px] text-[#4f46e5] font-semibold mt-1">Quadratics: completing the square</p>
              </div>
            </div>

            {/* Lesson 3 (Now - Active) */}
            <div className="relative pl-10">
              <div className="absolute left-2 top-1 w-4.5 h-4.5 rounded-full bg-[#4f46e5] border-2 border-white shadow-sm ring-4 ring-[#4f46e5]/20 animate-pulse" />
              <div className="p-4 rounded-2xl bg-white border-2 border-[#4f46e5] shadow-md shadow-[#4f46e5]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#4f46e5]" />
                    <h3 className="text-xs font-black text-[#1e1b3a]">English Literature</h3>
                  </div>
                  <span className="text-[10px] font-black text-white bg-[#4f46e5] px-2.5 py-0.5 rounded-full">
                    LIVE NOW
                  </span>
                </div>
                <p className="text-[11px] text-[#625e7d] mt-1">10:00 – 11:00 • Ms. Harlow • Room E7</p>
                <p className="text-xs font-bold text-[#1e1b3a] mt-1.5">Macbeth, Act 1 Scene 3: The Witches' Prophecy</p>
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-[#f5f2fa] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#4f46e5] h-1.5 rounded-full" style={{ width: '42%' }} />
                  </div>
                  <span className="text-[10px] text-[#625e7d] font-semibold block mt-1">35 minutes left</span>
                </div>
              </div>
            </div>

            {/* Recess / Break */}
            <div className="relative pl-10">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white shadow-xs" />
              <div className="p-3 rounded-2xl bg-[#f5f2fa] border border-[#ece7f0] flex items-center justify-between">
                <span className="text-xs font-bold text-[#625e7d] flex items-center space-x-1.5">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Break (20 mins)</span>
                </span>
                <span className="text-[11px] text-[#625e7d]">11:00 – 11:20</span>
              </div>
            </div>

            {/* Lesson 4 (Up next) */}
            <div className="relative pl-10">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#ff7a5c] border-2 border-white shadow-xs" />
              <div className="p-3.5 rounded-2xl bg-white border border-[#ffd5cc] shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-[#1e1b3a]">Biology Practical</h3>
                  <span className="text-[10px] font-bold text-[#b1361b] bg-[#fff0eb] px-2 py-0.5 rounded-md">
                    Up Next
                  </span>
                </div>
                <p className="text-[11px] text-[#625e7d] mt-0.5">11:20 – 12:20 • Dr. Castellanos • Lab S2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Due Tasks + Recent Grades Showcase */}
        <div className="lg:col-span-7 space-y-6">
          {/* Due This Week Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ece7f0] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ece7f0]">
              <div>
                <h2 className="text-base font-black text-[#1e1b3a]">Due This Week</h2>
                <p className="text-[11px] text-[#625e7d]">4 tasks • 70 total points</p>
              </div>
              <button className="text-xs font-bold text-[#4f46e5] hover:underline cursor-pointer">
                All Assignments →
              </button>
            </div>

            <div className="space-y-3">
              {/* Task 1 */}
              <div className="p-4 rounded-2xl border border-[#ece7f0] hover:border-[#ff7a5c]/40 transition-colors bg-white flex items-start justify-between gap-4 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff7a5c]" />
                <div className="pl-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff7a5c]">Spanish</span>
                  <h4 className="text-xs font-extrabold text-[#1e1b3a]">Mi rutina diaria: Vocabulary Quiz Prep</h4>
                  <p className="text-[11px] text-[#625e7d]">Sra. Ruiz • 10 Points</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fff0eb] text-[#b1361b] border border-[#ffd5cc]">
                    Today, 15:00
                  </span>
                  <span className="block text-[11px] text-[#625e7d] mt-1 font-medium">Not started</span>
                </div>
              </div>

              {/* Task 2 */}
              <div className="p-4 rounded-2xl border border-[#ece7f0] hover:border-[#4f46e5]/40 transition-colors bg-white flex items-start justify-between gap-4 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4f46e5]" />
                <div className="pl-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4f46e5]">Mathematics</span>
                  <h4 className="text-xs font-extrabold text-[#1e1b3a]">Quadratics Practice Set 3</h4>
                  <p className="text-[11px] text-[#625e7d]">Mr. Adeyemi • 20 Points</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f5f2fa] text-[#1e1b3a] border border-[#ece7f0]">
                    Fri 25 Sep
                  </span>
                  <div className="w-20 bg-[#f5f2fa] rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-[#4f46e5] h-1.5 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

              {/* Task 3 */}
              <div className="p-4 rounded-2xl border border-[#ece7f0] hover:border-teal-500/40 transition-colors bg-white flex items-start justify-between gap-4 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500" />
                <div className="pl-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Computer Science</span>
                  <h4 className="text-xs font-extrabold text-[#1e1b3a]">Python Loops Challenge</h4>
                  <p className="text-[11px] text-[#625e7d]">Mr. Patel • 25 Points</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f5f2fa] text-[#1e1b3a] border border-[#ece7f0]">
                    Fri 25 Sep
                  </span>
                  <div className="w-20 bg-[#f5f2fa] rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Grades Showcase */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ece7f0] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ece7f0]">
              <div>
                <h2 className="text-base font-black text-[#1e1b3a]">Recent Grades</h2>
                <p className="text-[11px] text-[#625e7d]">Term Average: <strong className="text-emerald-700">85.5%</strong> (+3.5% vs last term)</p>
              </div>
              <button className="text-xs font-bold text-[#4f46e5] hover:underline cursor-pointer">
                Full Report Card →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1e1b3a]">Coastal Sketchbook</h4>
                    <p className="text-[11px] text-[#625e7d]">Art & Design</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#1e1b3a]">94%</span>
                  <span className="block text-[10px] font-bold text-emerald-600">▲ +4%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ece7f0] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center">
                    A-
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1e1b3a]">Inspector Calls Essay</h4>
                    <p className="text-[11px] text-[#625e7d]">English Literature</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#1e1b3a]">88%</span>
                  <span className="block text-[10px] font-bold text-emerald-600">▲ +3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeroomSampleView;
