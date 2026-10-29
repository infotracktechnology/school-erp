import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, AlertCircle, Search, FileText, 
  Image as ImageIcon, Link as LinkIcon, Video, ExternalLink, 
  Info, Eye, X, CalendarDays
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

export const StudentAnnouncementPortal = ({ announcements = [], student }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedDay, setSelectedDay]     = useState('all');
  const [filterPriority, setFilterPriority] = useState('all'); // all | urgent | notice
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedNoticeModal, setSelectedNoticeModal] = useState(null);

  // ALL days of the selected month
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth(selectedMonth);
  }, [selectedMonth]);

  const dayCounts = useMemo(() => {
    const counts = {};
    announcements.forEach(ann => {
      const dk = getDayKey(ann.created_at || ann.publish_date);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [announcements]);

  useEffect(() => {
    setSelectedDay('all');
  }, [selectedMonth]);

  const filteredList = useMemo(() => {
    return announcements.filter(ann => {
      const dateVal = ann.created_at || ann.publish_date;
      if (getMonthKey(dateVal) !== selectedMonth) return false;
      if (selectedDay !== 'all' && getDayKey(dateVal) !== selectedDay) return false;

      const priority = (ann.priority || '').toLowerCase();
      if (filterPriority === 'urgent' && priority !== 'urgent' && priority !== 'high') return false;
      if (filterPriority === 'notice' && (priority === 'urgent' || priority === 'high')) return false;

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = ann.title?.toLowerCase().includes(query);
        const matchesMsg = ann.message?.toLowerCase().includes(query);
        const matchesAudience = ann.target_audience?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMsg && !matchesAudience) return false;
      }

      return true;
    });
  }, [announcements, selectedMonth, selectedDay, filterPriority, searchTerm]);

  const urgentCount = announcements.filter(a => ['urgent', 'high'].includes((a.priority || '').toLowerCase())).length;

  return (
    <div className="space-y-5">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Official Circulars</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{announcements.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-destructive">Urgent Notices</p>
            <p className="text-2xl font-black text-destructive mt-1">{urgentCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">Targeted For</p>
            <p className="text-sm font-black text-slate-800 mt-1 truncate max-w-[180px]">
              {student?.class_name ? `Class ${student.class_name}` : 'My Campus'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Month Input + All Days Horizontal Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Browse by Date</span>
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => { setSelectedMonth(e.target.value); setSelectedDay('all'); }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
              selectedDay === 'all' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Days</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === 'all' ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
              {announcements.filter(a => getMonthKey(a.created_at || a.publish_date) === selectedMonth).length}
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
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                    : isToday
                      ? 'bg-amber-50/50 text-amber-900 border-amber-300 font-extrabold'
                      : count > 0
                        ? 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                        : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600'
                }`}
              >
                <span className="text-[9px] font-semibold opacity-75">{WEEKDAYS[d.getDay()]}</span>
                <span className="text-sm font-black leading-tight">{d.getDate()}</span>
                {count > 0 ? (
                  <span className={`text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'}`}>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterPriority === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Notices ({announcements.length})
          </button>
          <button
            onClick={() => setFilterPriority('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterPriority === 'urgent'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Urgent ({urgentCount})
          </button>
          <button
            onClick={() => setFilterPriority('notice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterPriority === 'notice'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Regular Circulars ({announcements.length - urgentCount})
          </button>
        </div>

        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      {/* Announcements List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Announcements Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedDay !== 'all'
              ? `No announcements published on ${new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`
              : searchTerm || filterPriority !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'No announcements published for this month.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((ann) => {
            const isUrgent = ['urgent', 'high'].includes((ann.priority || '').toLowerCase());
            const atts = ann.attachments;

            return (
              <Card
                key={ann.id}
                className={`transition-all p-5 shadow-xs flex flex-col justify-between space-y-3.5 ${
                  isUrgent 
                    ? 'border-destructive/40 bg-gradient-to-r from-destructive/5 via-background to-background' 
                    : 'hover:border-primary/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={isUrgent ? 'destructive' : 'secondary'} className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                        {ann.target_audience === 'All' ? 'Campus Notice' : ann.target_audience || 'Circular'}
                      </Badge>
                      {isUrgent && (
                        <span className="flex items-center space-x-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          <span>URGENT</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                      <span>Published: {ann.publish_date || (ann.created_at ? new Date(ann.created_at).toLocaleDateString('en-IN') : 'Recent')}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{ann.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {ann.message}
                  </p>
                </div>

                {/* Attachments & Modal Trigger */}
                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {atts?.doc?.url && (
                      <a
                        href={atts.doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Official Notice PDF</span>
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                      </a>
                    )}
                    {atts?.image?.url && (
                      <a
                        href={atts.image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Circular Flyer</span>
                        <ExternalLink className="w-3 h-3 text-purple-500" />
                      </a>
                    )}
                    {atts?.link && (
                      <a
                        href={atts.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Reference Link</span>
                        <ExternalLink className="w-3 h-3 text-emerald-500" />
                      </a>
                    )}
                    {atts?.video && (
                      <a
                        href={atts.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Watch Video</span>
                        <ExternalLink className="w-3 h-3 text-rose-500" />
                      </a>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setSelectedNoticeModal(ann)}
                    className="h-8 text-xs font-bold ml-auto cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>Read Full Circular</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full Notice Modal */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-amber-100 text-amber-900">
                  {selectedNoticeModal.target_audience === 'All' ? 'Campus Circular' : selectedNoticeModal.target_audience}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-snug">{selectedNoticeModal.title}</h3>
                <p className="text-xs text-slate-400">Date: {selectedNoticeModal.publish_date || 'Today'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNoticeModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0 ml-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {selectedNoticeModal.message}
            </div>

            {selectedNoticeModal.attachments && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700">Official Attachments:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNoticeModal.attachments.doc?.url && (
                    <a
                      href={selectedNoticeModal.attachments.doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download PDF Document</span>
                    </a>
                  )}
                  {selectedNoticeModal.attachments.image?.url && (
                    <a
                      href={selectedNoticeModal.attachments.image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Open Image</span>
                    </a>
                  )}
                  {selectedNoticeModal.attachments.link && (
                    <a
                      href={selectedNoticeModal.attachments.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Open External Link</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNoticeModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncementPortal;
