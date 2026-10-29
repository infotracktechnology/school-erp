import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Clock, AlertCircle, 
  Search, FileText, Image as ImageIcon, Link as LinkIcon, Video, 
  ExternalLink, Sparkles, CalendarDays
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// ─── Date Helpers ───────────────────────────────────────────────────────────
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
export const StudentHomeworkPortal = ({ homework = [], student, assignedSubjects = [], onRefresh }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedDay, setSelectedDay]     = useState('all');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Curriculum + homework-derived subjects
  const subjects = useMemo(() => {
    const set = new Set();
    assignedSubjects.forEach(s => { if (s.subject_name) set.add(s.subject_name); });
    homework.forEach(h => { if (h.subject_name) set.add(h.subject_name); });
    return Array.from(set);
  }, [assignedSubjects, homework]);

  // ALL days of the selected month (1 to 28/30/31)
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth(selectedMonth);
  }, [selectedMonth]);

  // Map of date -> count for quick lookup
  const dayCounts = useMemo(() => {
    const counts = {};
    homework.forEach(hw => {
      const dk = getDayKey(hw.created_at);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [homework]);

  // Reset selected day to 'all' or today if in selected month
  useEffect(() => {
    if (selectedMonth === currentMonthKey) {
      setSelectedDay('all');
    } else {
      setSelectedDay('all');
    }
  }, [selectedMonth]);

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const filteredList = useMemo(() => {
    return homework.filter(hw => {
      if (getMonthKey(hw.created_at) !== selectedMonth) return false;
      if (selectedDay !== 'all' && getDayKey(hw.created_at) !== selectedDay) return false;
      if (filterStatus === 'pending') {
        const due = hw.due_date ? new Date(hw.due_date) : null;
        if (due && due < today) return false;
      }
      if (selectedSubject !== 'all' && hw.subject_name !== selectedSubject) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!hw.title?.toLowerCase().includes(q) &&
            !hw.subject_name?.toLowerCase().includes(q) &&
            !hw.description?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [homework, selectedMonth, selectedDay, filterStatus, selectedSubject, searchTerm]);

  const thisMonthCount = homework.filter(h => getMonthKey(h.created_at) === currentMonthKey).length;
  const dueThisWeek    = homework.filter(h => {
    if (!h.due_date) return false;
    const d = new Date(h.due_date);
    return d >= today && d <= endOfWeek;
  }).length;

  return (
    <div className="space-y-5">
      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total Assigned</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{homework.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </Card>
        <Card className="p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600">This Month</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{thisMonthCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </Card>
        <Card className="p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-destructive">Due This Week</p>
            <p className="text-2xl font-black text-destructive mt-1">{dueThisWeek}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* ── Month Input + All Days Horizontal Tabs ──────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Browse by Date</span>
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => { setSelectedMonth(e.target.value); setSelectedDay('all'); }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          />
        </div>

        {/* Horizontal All Days Scroll Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
              selectedDay === 'all' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Days</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === 'all' ? 'bg-white/20' : 'bg-slate-200 text-slate-600'}`}>
              {homework.filter(h => getMonthKey(h.created_at) === selectedMonth).length}
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
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs' 
                    : isToday
                      ? 'bg-cyan-50/50 text-cyan-900 border-cyan-300 font-extrabold'
                      : count > 0
                        ? 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                        : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600'
                }`}
              >
                <span className="text-[9px] font-semibold opacity-75">{WEEKDAYS[d.getDay()]}</span>
                <span className="text-sm font-black leading-tight">{d.getDate()}</span>
                {count > 0 ? (
                  <span className={`text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? 'bg-white/25 text-white' : 'bg-cyan-100 text-cyan-800'}`}>
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

      {/* ── Search + Status Filter ────────────────────────────────────── */}
      <Card className="p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'pending'].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? (status === 'pending' ? 'default' : 'secondary') : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="text-xs font-bold capitalize h-8"
            >
              {status === 'all' ? `All (${homework.length})` : 'Pending'}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search homework..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
      </Card>

      {/* ── Subject Pills ─────────────────────────────────────────────── */}
      {subjects.length > 0 && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
            <span>Filter By Subject:</span>
            <span>{subjects.length} Subjects in Curriculum</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
                selectedSubject === 'all' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Subjects</span>
              <span className={`px-1.5 rounded-full text-[10px] ${selectedSubject === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>{homework.length}</span>
            </button>
            {subjects.map(sub => {
              const cnt = homework.filter(h => h.subject_name === sub).length;
              const isSel = selectedSubject === sub;
              return (
                <button key={sub} onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
                    isSel ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}>
                  <span>{sub}</span>
                  <span className={`px-1.5 rounded-full text-[10px] font-bold ${isSel ? 'bg-white/20 text-white' : cnt > 0 ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-200 text-slate-400'}`}>{cnt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Cards ────────────────────────────────────────────────────── */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Homework Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedDay !== 'all'
              ? `No homework assigned on ${new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`
              : searchTerm || filterStatus !== 'all' || selectedSubject !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'No homework assigned for this month.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map(hw => {
            const atts = hw.attachments;
            return (
              <Card key={hw.id}
                className="hover:border-primary/50 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-3">
                  {/* Subject + Due */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                      {hw.subject_name || 'General Subject'}
                    </Badge>
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due: {hw.due_date || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{hw.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 whitespace-pre-wrap leading-relaxed">{hw.description}</p>
                  </div>

                  {/* Teacher Note */}
                  {hw.instructions && (
                    <div className="bg-amber-50/80 border border-amber-200/70 p-3 rounded-xl text-amber-900 text-xs leading-relaxed">
                      <p className="font-bold flex items-center space-x-1 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Teacher's Note / Guidelines:</span>
                      </p>
                      <p className="text-[11px] text-amber-800">{hw.instructions}</p>
                    </div>
                  )}

                  {/* Attachments */}
                  {atts && (atts.doc?.url || atts.image?.url || atts.link || atts.video) && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                      {atts.doc?.url && (
                        <a href={atts.doc.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">
                          <FileText className="w-3.5 h-3.5" /><span className="truncate max-w-[140px]">{atts.doc.name || 'Worksheet PDF'}</span><ExternalLink className="w-3 h-3 text-blue-500" />
                        </a>
                      )}
                      {atts.image?.url && (
                        <a href={atts.image.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors">
                          <ImageIcon className="w-3.5 h-3.5" /><span>Reference Image</span><ExternalLink className="w-3 h-3 text-purple-500" />
                        </a>
                      )}
                      {atts.link && (
                        <a href={atts.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors">
                          <LinkIcon className="w-3.5 h-3.5" /><span>Study Material</span><ExternalLink className="w-3 h-3 text-emerald-500" />
                        </a>
                      )}
                      {atts.video && (
                        <a href={atts.video} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors">
                          <Video className="w-3.5 h-3.5" /><span>Watch Explanation</span><ExternalLink className="w-3 h-3 text-rose-500" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 text-[11px] text-muted-foreground">
                  Assigned: {hw.created_at ? new Date(hw.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentHomeworkPortal;
