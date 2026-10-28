import React from 'react';
import { X, BookOpen, CheckCircle2, XCircle, Clock, Award, Sliders } from 'lucide-react';
export const ClassSubjectViewModal = ({ isOpen, onClose, subject, branchName = 'Branch', academicYearName = 'Academic Year' }) => {
    if (!isOpen || !subject)
        return null;
    const isActive = subject.status === 'Active';
    const applicabilityRules = [
        { label: 'Exam Applicable', val: Boolean(subject.exam_applicable), desc: 'Generates exam schedules' },
        { label: 'Grade Book Entry', val: Boolean(subject.gradebook_applicable), desc: 'Marks entry allowed' },
        { label: 'Report Card Print', val: Boolean(subject.reportcard_applicable), desc: 'Renders on report cards' },
        { label: 'Subject Attendance', val: Boolean(subject.attendance_applicable), desc: 'Tracks subject attendance' },
        { label: 'Homework Creation', val: Boolean(subject.homework_applicable), desc: 'Homework allowed' },
        { label: 'Assignment Tasks', val: Boolean(subject.assignment_applicable), desc: 'Assignment tracking' },
        { label: 'Timetable Scheduling', val: Boolean(subject.timetable_applicable), desc: 'Appears in timetable slots' },
        { label: 'Promotion Evaluation', val: Boolean(subject.promotion_applicable), desc: 'Counts toward promotion' }
    ];
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5"/>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{subject.subject_name}</h3>
                <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {subject.subject_code}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {branchName} • {academicYearName}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Hierarchy Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Configured Academic Scope
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-white font-semibold text-slate-700 text-xs shadow-2xs border border-emerald-200">
                  {subject.board}
                </span>
                <span className="text-slate-400">→</span>
                <span className="font-bold text-slate-900">{subject.class_name}</span>
                {subject.group_name ? (<>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 font-bold text-purple-900 text-xs border border-purple-200">
                      {subject.group_name} ({subject.group_code})
                    </span>
                  </>) : (<span className="text-xs text-slate-500 font-medium">(Common Curriculum)</span>)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${isActive
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                {isActive ? (<CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600"/>) : (<XCircle className="w-3.5 h-3.5 mr-1 text-slate-400"/>)}
                {subject.status}
              </span>
            </div>
          </div>

          {/* Classification & Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Category</span>
              <div className="font-bold text-slate-900 mt-0.5">{subject.category_name}</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Subject Type</span>
              <div className="font-bold text-slate-900 mt-0.5">{subject.subject_type}</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Requirement</span>
              <div className="font-bold text-slate-900 mt-0.5">{subject.requirement}</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Short Code</span>
              <div className="font-bold text-slate-900 mt-0.5">{subject.short_name || '—'}</div>
            </div>
          </div>

          {/* Elective or Language Highlights */}
          {Boolean(subject.is_language) && (<div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-950">Language Subject Configuration:</span>
                <span className="ml-2 font-medium text-blue-800">
                  {subject.language_name} ({subject.language_level || 'First Language'})
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                Language Track
              </span>
            </div>)}

          {subject.requirement === 'Elective' && (<div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-purple-950">Elective Bucket:</span>
                <span className="ml-2 font-medium text-purple-800">
                  {subject.elective_group_name || 'General Elective'} (Min: {subject.elective_min_count}, Max: {subject.elective_max_count})
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">
                Student Choice
              </span>
            </div>)}

          {/* Periods & Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Periods */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-emerald-700"/>
                <span>Weekly Periods</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Theory</span>
                  <span className="font-bold text-slate-900 text-sm">{subject.theory_periods}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Practical</span>
                  <span className="font-bold text-slate-900 text-sm">{subject.practical_periods}</span>
                </div>
                <div className="bg-emerald-100/60 p-2 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 block">Total / Wk</span>
                  <span className="font-bold text-emerald-950 text-sm">{subject.weekly_periods}</span>
                </div>
              </div>
            </div>

            {/* Assessment */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-700"/>
                <span>Evaluation Rules</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Pass Marks</span>
                  <span className="font-bold text-slate-900 text-sm">{subject.pass_marks}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Max Marks</span>
                  <span className="font-bold text-slate-900 text-sm">{subject.max_marks}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Credits</span>
                  <span className="font-bold text-slate-900 text-sm">{subject.credits}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 8 Applicability Rules Grid */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-emerald-700"/>
              <span>Downstream Module Applicability</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {applicabilityRules.map((r, i) => (<div key={i} className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${r.val
                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{r.label}</span>
                    {r.val ? (<CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0"/>) : (<XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0"/>)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">{r.desc}</span>
                </div>))}
            </div>
          </div>

          {subject.description && (<div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Description & Syllabus:</span>
              <p className="text-slate-600 leading-relaxed">{subject.description}</p>
            </div>)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>);
};
