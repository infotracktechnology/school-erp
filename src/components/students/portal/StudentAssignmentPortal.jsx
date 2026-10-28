import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileCheck2, Clock, Award, CheckCircle2,
  Search, FileText, Image as ImageIcon, ExternalLink, Send, 
  Upload, X, Loader2, CheckCheck, CalendarDays
} from 'lucide-react';
import { communicationService } from '../../../services/communicationService';

// ─── Date Helpers ────────────────────────────────────────────────────────────
const getMonthKey = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
const getDayKey = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Generate every day of a given YYYY-MM
const getAllDaysInMonth = (monthKey) => {
  if (!monthKey) return [];
  const [year, month] = monthKey.split('-').map(Number);
  const daysCount = new Date(year, month, 0).getDate();
  const list = [];
  for (let day = 1; day <= daysCount; day++) {
    list.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  return list;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayKey = getDayKey(new Date().toISOString());
const currentMonthKey = getMonthKey(new Date().toISOString());

// ─── Component ───────────────────────────────────────────────────────────────
export const StudentAssignmentPortal = ({ assignments = [], student, onRefresh, showToast }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedDay, setSelectedDay]     = useState('all');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const [activeSubmitModal, setActiveSubmitModal] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  const subjects = useMemo(() =>
    Array.from(new Set(assignments.map(a => a.subject_name).filter(Boolean))),
    [assignments]
  );

  // ALL days of the selected month (1 to 28/30/31)
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth(selectedMonth);
  }, [selectedMonth]);

  const dayCounts = useMemo(() => {
    const counts = {};
    assignments.forEach(a => {
      const dk = getDayKey(a.created_at);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [assignments]);

  useEffect(() => {
    setSelectedDay('all');
  }, [selectedMonth]);

  const filteredList = useMemo(() => {
    return assignments.filter(asgn => {
      if (getMonthKey(asgn.created_at) !== selectedMonth) return false;
      if (selectedDay !== 'all' && getDayKey(asgn.created_at) !== selectedDay) return false;

      const status = (asgn.submission_status || 'Pending').toLowerCase();
      if (filterStatus === 'pending' && status !== 'pending' && status !== 'not submitted') return false;
      if (filterStatus === 'submitted' && status !== 'submitted') return false;
      if (filterStatus === 'reviewed' && status !== 'reviewed' && status !== 'completed') return false;

      if (selectedSubject !== 'all' && asgn.subject_name !== selectedSubject) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!asgn.title?.toLowerCase().includes(q) &&
            !asgn.subject_name?.toLowerCase().includes(q) &&
            !asgn.description?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [assignments, selectedMonth, selectedDay, filterStatus, selectedSubject, searchTerm]);

  const pendingCount  = assignments.filter(a => (a.submission_status || 'Pending').toLowerCase() === 'pending').length;
  const submittedCount = assignments.filter(a => (a.submission_status || '').toLowerCase() === 'submitted').length;
  const reviewedCount  = assignments.filter(a => ['reviewed', 'completed'].includes((a.submission_status || '').toLowerCase())).length;

  const handleOpenSubmit = (asgn) => { setActiveSubmitModal(asgn); setSubmissionText(''); setSubmissionFile(null); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { showToast?.('File size exceeds 15MB limit', 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => setSubmissionFile({ name: file.name, base64: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!activeSubmitModal || !student?.id) return;
    if (!submissionText.trim() && !submissionFile) {
      showToast?.('Please write an answer or upload your file to submit', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (submissionFile) {
        const uploadRes = await communicationService.uploadAttachment(submissionFile.name, submissionFile.base64);
        fileUrl = uploadRes.url;
      }
      await communicationService.submitAssignmentWork(activeSubmitModal.id, {
        student_id: student.id,
        submission_text: submissionText,
        submission_file_url: fileUrl
      });
      showToast?.('Assignment submitted successfully!', 'success');
      setActiveSubmitModal(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast?.(err.message || 'Failed to submit assignment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Assignments', val: assignments.length, color: 'purple', Icon: FileCheck2 },
          { label: 'Pending Submission', val: pendingCount, color: 'amber', Icon: Clock },
          { label: 'Submitted', val: submittedCount, color: 'blue', Icon: CheckCheck },
          { label: 'Reviewed & Graded', val: reviewedCount, color: 'emerald', Icon: Award },
        ].map(({ label, val, color, Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold text-${color}-600`}>{label}</p>
              <p className={`text-2xl font-black text-${color}-700 mt-1`}>{val}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Month Input + All Days Horizontal Tabs ──────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Browse by Date</span>
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => { setSelectedMonth(e.target.value); setSelectedDay('all'); }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
              selectedDay === 'all' 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Days</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === 'all' ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
              {assignments.filter(a => getMonthKey(a.created_at) === selectedMonth).length}
            </span>
          </button>

          {allDaysInMonth.map(dk => {
            const d = new Date(dk + 'T00:00:00');
            const count = dayCounts[dk] || 0;
            const isActive = selectedDay === dk;
            const isToday = dk === todayKey;

            return (
              <button 
                key={dk} 
                onClick={() => setSelectedDay(dk)}
                className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 min-w-[46px] border ${
                  isActive 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                    : isToday
                      ? 'bg-purple-50/50 text-purple-900 border-purple-300 font-extrabold'
                      : count > 0
                        ? 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                        : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600'
                }`}
              >
                <span className="text-[9px] font-semibold opacity-75">{WEEKDAYS[d.getDay()]}</span>
                <span className="text-sm font-black leading-tight">{d.getDate()}</span>
                {count > 0 ? (
                  <span className={`text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-800'}`}>
                    {count}
                  </span>
                ) : (
                  <span className="text-[9px] mt-0.5 opacity-30">•</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search + Filter ───────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { val: 'all', label: `All (${assignments.length})`, active: 'bg-slate-900' },
            { val: 'pending', label: `Pending (${pendingCount})`, active: 'bg-amber-600' },
            { val: 'submitted', label: `Submitted (${submittedCount})`, active: 'bg-blue-600' },
            { val: 'reviewed', label: `Graded (${reviewedCount})`, active: 'bg-emerald-600' },
          ].map(({ val, label, active }) => (
            <button key={val} onClick={() => setFilterStatus(val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === val ? `${active} text-white shadow-xs` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {subjects.length > 0 && (
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="all">All Subjects</option>
              {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          )}
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search assignments..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          </div>
        </div>
      </div>

      {/* ── Assignment List ───────────────────────────────────────────── */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Assignments Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedDay !== 'all'
              ? `No assignments given on ${new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`
              : searchTerm || filterStatus !== 'all' || selectedSubject !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'No assignments assigned for this month.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map(asgn => {
            const status = asgn.submission_status || 'Pending';
            const isPending  = status.toLowerCase() === 'pending';
            const isSubmitted = status.toLowerCase() === 'submitted';
            const isReviewed  = ['reviewed', 'completed'].includes(status.toLowerCase());
            const atts = asgn.attachments;
            return (
              <div key={asgn.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 transition-all p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-purple-50 text-purple-800 tracking-wider">{asgn.subject_name || 'Subject'}</span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">{asgn.submission_type || 'Online'} Submission</span>
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <Clock className="w-3 h-3" /><span>Due: {asgn.due_date || 'N/A'}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">Max Marks: {asgn.max_marks || 100}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{asgn.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{asgn.description}</p>
                  {atts && (atts.doc?.url || atts.image?.url) && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {atts.doc?.url && (
                        <a href={atts.doc.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg">
                          <FileText className="w-3.5 h-3.5" /><span>Question Paper</span><ExternalLink className="w-3 h-3 text-blue-500" />
                        </a>
                      )}
                      {atts.image?.url && (
                        <a href={atts.image.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg">
                          <ImageIcon className="w-3.5 h-3.5" /><span>Reference Image</span><ExternalLink className="w-3 h-3 text-purple-500" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Card */}
                <div className="w-full lg:w-72 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      isReviewed ? 'bg-emerald-100 text-emerald-800' : isSubmitted ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>{status}</span>
                  </div>
                  {asgn.marks_obtained !== null && asgn.marks_obtained !== undefined ? (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Score Secured</p>
                      <p className="text-lg font-black text-emerald-700">
                        {asgn.marks_obtained} <span className="text-xs font-semibold text-slate-400">/ {asgn.max_marks || 100}</span>
                      </p>
                      {asgn.grade && <span className="inline-block text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">Grade {asgn.grade}</span>}
                      {asgn.remarks && <p className="text-[11px] text-slate-600 italic pt-1 border-t border-slate-100">"{asgn.remarks}"</p>}
                    </div>
                  ) : isSubmitted ? (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-800">Submitted Online</p>
                      <p className="text-[10px] text-slate-500">Awaiting teacher evaluation.</p>
                      {asgn.submission_file_url && (
                        <a href={asgn.submission_file_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 hover:underline pt-1">
                          <FileText className="w-3 h-3" /><span>View My Submitted File</span>
                        </a>
                      )}
                    </div>
                  ) : null}
                  <div>
                    {asgn.submission_type === 'Physical' ? (
                      <div className="text-center text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded-xl border border-amber-200/50">
                        Physical submission required. Submit your notebook or sheet in class.
                      </div>
                    ) : (
                      <button type="button" onClick={() => handleOpenSubmit(asgn)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xs active:scale-95 ${
                          isPending ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isPending ? 'Submit Work' : 'Resubmit Work'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Submit Modal ──────────────────────────────────────────────── */}
      {activeSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {activeSubmitModal.subject_name || 'Subject'}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">Submit Assignment</h3>
                <p className="text-xs text-slate-500 truncate max-w-sm">{activeSubmitModal.title}</p>
              </div>
              <button type="button" onClick={() => setActiveSubmitModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitWork} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type Your Answer / Comments (Optional):</label>
                <textarea rows={4} value={submissionText} onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Enter your notes, written answers or project links here..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload Answer Document or Image (Optional):</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-4 text-center cursor-pointer relative bg-slate-50/50 hover:bg-purple-50/20 transition-all">
                  <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-700">{submissionFile ? submissionFile.name : 'Click to browse files or drag & drop'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, Word, Images, Zip (Max 15MB)</p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setActiveSubmitModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting...</span></> : <><Send className="w-4 h-4" /><span>Submit Assignment</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentPortal;
