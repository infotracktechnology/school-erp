import React from 'react';
import { X, Calendar, Building2, Star, Clock, Archive, CheckCircle2, Users, BookOpen, Layers, GraduationCap } from 'lucide-react';
export const AcademicYearDetailsModal = ({ isOpen, onClose, academicYear, onEdit }) => {
    if (!isOpen || !academicYear)
        return null;
    const formatDate = (dateStr) => {
        if (!dateStr)
            return '-';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            }
            return dateStr;
        }
        catch {
            return dateStr;
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active':
                return (<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 animate-pulse"></span>
            Active Session
          </span>);
            case 'Upcoming':
                return (<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600"/>
            Upcoming Session
          </span>);
            case 'Closed':
                return (<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Archive className="w-3.5 h-3.5 mr-1.5 text-slate-500"/>
            Closed / Archived
          </span>);
        }
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs shadow-xs">
              <Calendar className="w-6 h-6"/>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-black tracking-tight">{academicYear.name}</h2>
                {academicYear.short_name && (<span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                    {academicYear.short_name}
                  </span>)}
              </div>
              <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                Academic Cycle Information
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Status & Branch Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Branch */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-700"/>
                <span>Branch Campus</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {academicYear.branch_name || 'Green Park Main Campus'}
              </p>
              {academicYear.branch_code && (<span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  Code: {academicYear.branch_code}
                </span>)}
            </div>

            {/* Status */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Cycle Status
              </span>
              <div className="mt-1">
                {getStatusBadge(academicYear.status)}
              </div>
            </div>

            {/* Current Session Indicator */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Current Session
              </span>
              <div className="mt-1">
                {academicYear.is_current ? (<span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-700 text-white shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-white text-white"/>
                    <span>Yes (Active)</span>
                  </span>) : (<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                    No
                  </span>)}
              </div>
            </div>
          </div>

          {/* Date Duration Section */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-700"/>
              <span>Session Duration & Timeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Cycle Start Date</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {formatDate(academicYear.start_date)}
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Cycle End Date</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {formatDate(academicYear.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Section (Classes: 0, Sections: 0, Subjects: 0, Students: 0) */}
          <div className="border border-slate-200 rounded-xl p-4.5 bg-white">
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-emerald-700"/>
                <span>Academic Operational Summary</span>
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">
                Future modules linked
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Classes */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1.5">
                  <GraduationCap className="w-4 h-4"/>
                </div>
                <span className="text-xl font-black text-slate-900">0</span>
                <p className="text-xs text-slate-500 font-medium">Classes</p>
              </div>

              {/* Sections */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1.5">
                  <Layers className="w-4 h-4"/>
                </div>
                <span className="text-xl font-black text-slate-900">0</span>
                <p className="text-xs text-slate-500 font-medium">Sections</p>
              </div>

              {/* Subjects */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1.5">
                  <BookOpen className="w-4 h-4"/>
                </div>
                <span className="text-xl font-black text-slate-900">0</span>
                <p className="text-xs text-slate-500 font-medium">Subjects</p>
              </div>

              {/* Students */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1.5">
                  <Users className="w-4 h-4"/>
                </div>
                <span className="text-xl font-black text-slate-900">0</span>
                <p className="text-xs text-slate-500 font-medium">Students</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0"/>
              <span>Classes, sections, and student rosters will be mapped to this academic year in future modules.</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            System ID #{academicYear.id} • Created {formatDate(academicYear.created_at ? academicYear.created_at.split('T')[0] : '')}
          </span>

          <div className="flex items-center space-x-2.5">
            {onEdit && (<button type="button" onClick={() => {
                onClose();
                onEdit(academicYear);
            }} className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer">
                Edit Academic Year
              </button>)}
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>);
};
