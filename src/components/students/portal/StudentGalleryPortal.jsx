import React, { useState, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, Calendar, Camera, Link as LinkIcon, 
  Search, ExternalLink, Sparkles, X, CalendarDays
} from 'lucide-react';

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

export const StudentGalleryPortal = ({ albums = [], student }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedDay, setSelectedDay]     = useState('all');
  const [searchTerm, setSearchTerm]       = useState('');
  const [activeAlbumModal, setActiveAlbumModal] = useState(null);

  // ALL days of the selected month
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth(selectedMonth);
  }, [selectedMonth]);

  const dayCounts = useMemo(() => {
    const counts = {};
    albums.forEach(alb => {
      const dk = getDayKey(alb.created_at || alb.event_date);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [albums]);

  useEffect(() => {
    setSelectedDay('all');
  }, [selectedMonth]);

  const filteredAlbums = useMemo(() => {
    return albums.filter(alb => {
      const dateVal = alb.created_at || alb.event_date;
      if (getMonthKey(dateVal) !== selectedMonth) return false;
      if (selectedDay !== 'all' && getDayKey(dateVal) !== selectedDay) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = alb.album_name?.toLowerCase().includes(q);
        const matchesEvent = alb.event_name?.toLowerCase().includes(q);
        const matchesDesc = alb.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesEvent && !matchesDesc) return false;
      }

      return true;
    });
  }, [albums, selectedMonth, selectedDay, searchTerm]);

  return (
    <div className="space-y-5">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">School Event Albums</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{albums.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-600">Moments & Highlights</p>
            <p className="text-2xl font-black text-purple-700 mt-1">Campus Life</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600">Access Scope</p>
            <p className="text-sm font-black text-slate-800 mt-1">
              {student?.class_name ? `Class ${student.class_name}` : 'Campus Events'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Month Input + All Days Horizontal Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800">Browse by Date</span>
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => { setSelectedMonth(e.target.value); setSelectedDay('all'); }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
              selectedDay === 'all' 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Days</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === 'all' ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
              {albums.filter(a => getMonthKey(a.created_at || a.event_date) === selectedMonth).length}
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
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                    : isToday
                      ? 'bg-rose-50/50 text-rose-900 border-rose-300 font-extrabold'
                      : count > 0
                        ? 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                        : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600'
                }`}
              >
                <span className="text-[9px] font-semibold opacity-75">{WEEKDAYS[d.getDay()]}</span>
                <span className="text-sm font-black leading-tight">{d.getDate()}</span>
                {count > 0 ? (
                  <span className={`text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-800'}`}>
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

      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-slate-900">
          Photo Albums & Activities ({filteredAlbums.length})
        </h3>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search albums or events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Photo Albums Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedDay !== 'all'
              ? `No albums published on ${new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`
              : searchTerm ? 'No albums match your search query.' : 'No photo galleries published for this month.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlbums.map((alb) => {
            const coverImage = alb.cover_image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80';

            return (
              <div
                key={alb.id}
                onClick={() => setActiveAlbumModal(alb)}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
                    <img
                      src={coverImage}
                      alt={alb.album_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      <span>{alb.event_date || 'Event'}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                      {alb.event_name || 'School Function'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {alb.album_name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {alb.description || 'View photos and highlights from this event.'}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-bold">
                  <span>View Photos</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Album Preview Lightbox Modal */}
      {activeAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  {activeAlbumModal.event_name || 'School Event'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{activeAlbumModal.album_name}</h3>
                <p className="text-xs text-slate-400">Date: {activeAlbumModal.event_date || 'N/A'}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAlbumModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0 ml-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Cover / Image */}
            <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200">
              <img
                src={activeAlbumModal.cover_image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80'}
                alt={activeAlbumModal.album_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-700">About this Event:</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                {activeAlbumModal.description || 'No additional event notes.'}
              </p>
            </div>

            {activeAlbumModal.attachments?.links && activeAlbumModal.attachments.links.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700">Related Photo Drives & Links:</p>
                <div className="flex flex-wrap gap-2">
                  {activeAlbumModal.attachments.links.map((lnk, idx) => (
                    <a
                      key={idx}
                      href={lnk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>{lnk.title || 'Open Photo Drive Link'}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveAlbumModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGalleryPortal;
