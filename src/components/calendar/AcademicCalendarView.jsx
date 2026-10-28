import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight,
  Filter, Trash2, Edit, AlertCircle, CheckCircle2, Flag,
  GraduationCap, Sparkles, Building2, BookOpen, Layers, X,
  Paperclip, Image, Link, FileText, UploadCloud, ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useErp } from '../../context/ErpContext';
import { calendarService } from '../../services/calendarService';

const EVENT_TYPES = [
  { id: 'all', label: 'All Types', color: 'bg-zinc-100 text-zinc-800' },
  { id: 'public_holiday', label: 'Public Holiday', badgeColor: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  { id: 'school_holiday', label: 'School Vacation', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  { id: 'school_event', label: 'School Event', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  { id: 'exam', label: 'Examination', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  { id: 'academic_milestone', label: 'Milestone / Term', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
];

export const AcademicCalendarView = ({ showToast }) => {
  const { branches, selectedBranchId, activeAcademicYearId, isSuperAdmin, assignedBranchId } = useErp();
  const effBranch = (!isSuperAdmin && assignedBranchId) ? String(assignedBranchId) : String(selectedBranchId || '1');

  const [branchId, setBranchId] = useState(effBranch);
  const [academicYearId, setAcademicYearId] = useState(String(activeAcademicYearId || '2'));

  // Calendar Date State (Current viewing Month & Year)
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'school_event',
    start_date: '',
    end_date: '',
    is_holiday: false,
    school_closed: false,
    applicable_to: 'all',
    applicable_classes: [],
    applicable_sections: [],
    attachments: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);

  // 1. Load Classes and Sections for Audience selection
  useEffect(() => {
    // Classes loader with fallback
    fetch(`/api/classes?branch_id=${branchId}&status=Active`)
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setClassesList(res.data);
        } else {
          return fetch(`/api/classes?status=Active`).then(r => r.json()).then(r2 => {
            if (r2.success && Array.isArray(r2.data)) setClassesList(r2.data);
          });
        }
      })
      .catch(() => setClassesList([]));

    // Sections loader with fallback
    fetch(`/api/sections?branch_id=${branchId}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSectionsList(res.data);
        } else {
          return fetch(`/api/sections`).then(r => r.json()).then(r2 => {
            if (r2.success && Array.isArray(r2.data)) setSectionsList(r2.data);
          });
        }
      })
      .catch(() => setSectionsList([]));
  }, [branchId, academicYearId]);

  // 2. Load Events for Month
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await calendarService.getEvents({
        branch_id: branchId,
        academic_year_id: academicYearId,
        event_type: selectedTypeFilter,
        class_id: selectedClassFilter,
        section_id: selectedSectionFilter,
        month,
        year
      });
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      if (showToast) showToast('Failed to load calendar events', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [branchId, academicYearId, selectedTypeFilter, selectedClassFilter, selectedSectionFilter, currentDate, showToast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Calendar Grid Calculations
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    const formatDate = (y, m, d) => {
      const dateObj = new Date(y, m, d);
      const dy = dateObj.getFullYear();
      const dm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      return `${dy}-${dm}-${dd}`;
    };

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        dayNumber: dayNum,
        isCurrentMonth: false,
        dateString: formatDate(year, month - 1, dayNum)
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: true,
        dateString: formatDate(year, month, i)
      });
    }

    // Next month padding (up to 35 or 42 cells)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateString: formatDate(year, month + 1, i)
      });
    }

    return days;
  }, [currentDate]);

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Open Add Modal
  const handleOpenAddModal = (dateStr) => {
    const d = dateStr || new Date().toISOString().split('T')[0];
    setEditingEventId(null);
    setFormData({
      title: '',
      description: '',
      event_type: 'school_event',
      start_date: d,
      end_date: d,
      is_holiday: false,
      school_closed: false,
      applicable_to: 'all',
      applicable_classes: [],
      applicable_sections: [],
      attachments: []
    });
    setShowAddLinkForm(false);
    setNewLinkUrl('');
    setNewLinkTitle('');
    setIsEventModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (ev) => {
    setEditingEventId(ev.id);
    setFormData({
      title: ev.title,
      description: ev.description || '',
      event_type: ev.event_type,
      start_date: ev.start_date,
      end_date: ev.end_date,
      is_holiday: ev.is_holiday,
      school_closed: ev.school_closed,
      applicable_to: ev.applicable_to,
      applicable_classes: ev.applicable_classes || [],
      applicable_sections: ev.applicable_sections || [],
      attachments: Array.isArray(ev.attachments) ? ev.attachments : []
    });
    setShowAddLinkForm(false);
    setNewLinkUrl('');
    setNewLinkTitle('');
    setIsEventModalOpen(true);
  };

  // File upload handler (Images, PDFs, Docs)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      if (showToast) showToast('File size must be under 10MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await fetch('/api/communication/upload-attachment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              base64Data
            })
          });
          const data = await res.json();
          if (data.success && data.url) {
            const isImg = file.type.startsWith('image/');
            const newAtt = {
              id: Date.now(),
              name: file.name,
              url: data.url,
              type: isImg ? 'image' : 'document',
              size: file.size
            };
            setFormData(prev => ({
              ...prev,
              attachments: [...(prev.attachments || []), newAtt]
            }));
            if (showToast) showToast('File attached successfully', 'success');
          } else {
            throw new Error(data.message || 'Upload failed');
          }
        } catch (uploadErr) {
          if (showToast) showToast('File upload failed', 'error');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
      if (showToast) showToast('Error reading file', 'error');
    }
  };

  // Add Link Handler
  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    let url = newLinkUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    const newAtt = {
      id: Date.now(),
      name: newLinkTitle.trim() || url,
      url,
      type: 'link'
    };
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAtt]
    }));
    setNewLinkUrl('');
    setNewLinkTitle('');
    setShowAddLinkForm(false);
  };

  // Remove Attachment Handler
  const handleRemoveAttachment = (attId) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(a => a.id !== attId)
    }));
  };

  // Save Event Handler
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.start_date) {
      if (showToast) showToast('Title and Start Date are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        ...formData
      };

      if (editingEventId) {
        await calendarService.updateEvent(editingEventId, payload);
        if (showToast) showToast('Event updated successfully!', 'success');
      } else {
        await calendarService.createEvent(payload);
        if (showToast) showToast('Event created and published!', 'success');
      }
      setIsEventModalOpen(false);
      loadEvents();
    } catch (err) {
      if (showToast) showToast('Failed to save event', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Event Handler
  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      await calendarService.deleteEvent(id);
      if (showToast) showToast('Event deleted', 'info');
      loadEvents();
    } catch (err) {
      if (showToast) showToast('Failed to delete event', 'error');
    }
  };

  // Match events to day
  const getEventsForDay = (dateString) => {
    return events.filter(e => {
      return dateString >= e.start_date && dateString <= e.end_date;
    });
  };

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Modern Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-24 w-64 h-64 bg-radial from-rose-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Academic Schedules & Campus Events</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Academic Calendar & Planner
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
              Centrally manage holidays, vacation breaks, exam dates, and celebrations with instant live synchronization to Student & Staff portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event / Holiday</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center font-black">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-300 block font-medium">Holidays</span>
              <span className="text-lg font-black text-white">
                {events.filter(e => e.is_holiday || e.event_type === 'public_holiday' || e.event_type === 'school_holiday').length}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-300 block font-medium">Exams</span>
              <span className="text-lg font-black text-white">
                {events.filter(e => e.event_type === 'exam').length}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-300 block font-medium">Events</span>
              <span className="text-lg font-black text-white">
                {events.filter(e => e.event_type === 'school_event').length}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-300 block font-medium">Total Events</span>
              <span className="text-lg font-black text-white">{events.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Control Bar: Campus, Month Stepper & Filter Badges ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Campus & Month Stepper */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-2">
              <select
                disabled={!isSuperAdmin && !!assignedBranchId}
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs outline-none transition-colors cursor-pointer"
              >
                {branches?.map(b => (
                  <option key={b.id} value={b.id}>{b.branch_name}</option>
                ))}
              </select>
            </div>

            {/* Stepper Pill */}
            <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/90 shadow-inner">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer shadow-2xs"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-slate-900 px-4 min-w-[140px] text-center tracking-tight">
                {monthName}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer shadow-2xs"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleToday}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer active:scale-95"
            >
              Today
            </button>
          </div>

          {/* Right: Event Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {EVENT_TYPES.map(t => {
              const isSel = selectedTypeFilter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTypeFilter(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isSel
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15 scale-105'
                      : 'bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.dot && <span className={`w-2 h-2 rounded-full ${t.dot}`} />}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Audience Scope Filter Bar */}
        <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-bold text-slate-600 flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target Audience:</span>
            </span>

            {/* Class Dropdown */}
            <select
              value={selectedClassFilter}
              onChange={(e) => {
                setSelectedClassFilter(e.target.value);
                setSelectedSectionFilter('all');
              }}
              className="h-8.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 px-3 py-1 text-xs font-bold text-slate-800 shadow-2xs outline-none focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="all">🏫 Whole Campus (All Classes)</option>
              {classesList.map(c => (
                <option key={c.id} value={c.id}>
                  {c.class_name || c.name}
                </option>
              ))}
            </select>

            {/* Section Dropdown */}
            {selectedClassFilter !== 'all' && (
              <select
                value={selectedSectionFilter}
                onChange={(e) => setSelectedSectionFilter(e.target.value)}
                className="h-8.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-900 shadow-2xs outline-none focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="all">All Sections of Class</option>
                {(sectionsList || [])
                  .filter(s => String(s.class_id) === String(selectedClassFilter))
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      Section {s.section_name || s.name}
                    </option>
                  ))}
              </select>
            )}

            {(selectedClassFilter !== 'all' || selectedSectionFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedClassFilter('all');
                  setSelectedSectionFilter('all');
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1"
              >
                Reset Filter ✕
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            Showing <strong className="text-slate-900 font-extrabold">{events.length}</strong> event(s) in {monthName}
          </div>
        </div>
      </div>

      {/* ── Monthly Calendar Matrix ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Day Names Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 text-center text-[11px] font-black uppercase tracking-wider text-slate-600 py-3">
          <span className="text-rose-600">Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {calendarDays.map((cd, idx) => {
            const dayEvents = getEventsForDay(cd.dateString);
            const isToday = cd.dateString === new Date().toISOString().split('T')[0];

            return (
              <div
                key={idx}
                onClick={() => cd.isCurrentMonth && handleOpenAddModal(cd.dateString)}
                className={`min-h-[120px] p-2 flex flex-col justify-between transition-all group ${
                  cd.isCurrentMonth
                    ? (isToday 
                        ? 'bg-indigo-50/40 hover:bg-indigo-50/70 ring-1 ring-inset ring-indigo-200 cursor-pointer' 
                        : 'bg-white hover:bg-slate-50/80 cursor-pointer')
                    : 'bg-slate-50/50 opacity-35 cursor-default'
                }`}
              >
                {/* Top Day Number Row */}
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black transition-transform ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                      : (cd.isCurrentMonth ? 'text-slate-800 group-hover:text-indigo-600' : 'text-slate-400')
                  }`}>
                    {cd.dayNumber}
                  </span>

                  {cd.isCurrentMonth && (
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md transition-all shadow-2xs">
                      + Event
                    </span>
                  )}
                </div>

                {/* Day Events Pills */}
                <div className="space-y-1.5 mt-1.5 flex-1 overflow-y-auto max-h-[85px] pr-0.5">
                  {dayEvents.map(ev => {
                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(ev);
                        }}
                        style={{ borderLeftColor: ev.color_code || '#6366f1' }}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold border-l-3 bg-white hover:bg-slate-50 shadow-2xs border border-slate-200/60 text-slate-800 truncate hover:scale-[1.02] hover:shadow-xs transition-all flex items-center justify-between gap-1 cursor-pointer"
                      >
                        <span className="truncate">{ev.title}</span>
                        <div className="flex items-center space-x-1 shrink-0">
                          {ev.attachments?.length > 0 && (
                            <Paperclip className="w-2.5 h-2.5 text-slate-400" />
                          )}
                          {ev.school_closed && (
                            <span className="text-[8px] uppercase font-black text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                              Closed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Add / Edit Event Dialog Modal ── */}
      {isEventModalOpen && (
        <div 
          onClick={() => setIsEventModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-zinc-200 flex flex-col max-h-[92vh] overflow-hidden my-auto"
          >
            {/* Modal Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white shrink-0">
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  {editingEventId ? 'Edit Calendar Event' : 'Add New Event or Holiday'}
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Published events and holidays will be reflected immediately in Student & Staff portals.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsEventModalOpen(false)} 
                className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="flex flex-col flex-1 overflow-hidden">
              {/* Modal Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Title */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Event / Holiday Title <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Diwali Holiday, Term 1 Exams, Annual Day"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Event Type & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Category Type</label>
                  <select
                    value={formData.event_type}
                    onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs outline-none"
                  >
                    <option value="public_holiday">Public Holiday</option>
                    <option value="school_holiday">School Vacation</option>
                    <option value="school_event">School Event / Celebration</option>
                    <option value="exam">Examination / Assessment</option>
                    <option value="academic_milestone">Academic Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">School Status</label>
                  <label className="flex items-center space-x-2 h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.school_closed || formData.event_type === 'public_holiday' || formData.event_type === 'school_holiday'}
                      onChange={e => setFormData({ ...formData, school_closed: e.target.checked })}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-900"
                    />
                    <span className="font-semibold text-zinc-800">School Closed</span>
                  </label>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={e => setFormData({ ...formData, start_date: e.target.value, end_date: formData.end_date || e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">End Date</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Target Audience Scope */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Applicable Classes & Sections</label>
                <div className="flex items-center space-x-4 mb-2">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="applicable_to"
                      value="all"
                      checked={formData.applicable_to === 'all'}
                      onChange={() => setFormData({ ...formData, applicable_to: 'all', applicable_classes: [], applicable_sections: [] })}
                    />
                    <span className="font-semibold text-zinc-800">All School / Whole Campus</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="applicable_to"
                      value="specific_classes"
                      checked={formData.applicable_to === 'specific_classes'}
                      onChange={() => setFormData({ ...formData, applicable_to: 'specific_classes' })}
                    />
                    <span className="font-semibold text-zinc-800">Specific Classes & Sections</span>
                  </label>
                </div>

                {formData.applicable_to === 'specific_classes' && (
                  <div className="space-y-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50/70">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-zinc-700">1. Select Classes:</span>
                        <span className="text-[11px] text-zinc-500">
                          {formData.applicable_classes.length === 0 ? 'None selected' : `${formData.applicable_classes.length} selected`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                        {classesList.map(c => {
                          const clsId = Number(c.id);
                          const isSel = formData.applicable_classes?.includes(clsId);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const currentClasses = Array.isArray(formData.applicable_classes) ? formData.applicable_classes : [];
                                const currentSections = Array.isArray(formData.applicable_sections) ? formData.applicable_sections : [];
                                const newClasses = isSel 
                                  ? currentClasses.filter(id => id !== clsId)
                                  : [...currentClasses, clsId];
                                
                                // Clean up sections if class is unselected
                                const newSections = isSel
                                  ? currentSections.filter(secId => {
                                      const secObj = (sectionsList || []).find(s => s && Number(s.id) === Number(secId));
                                      return secObj && Number(secObj.class_id) !== clsId;
                                    })
                                  : currentSections;

                                setFormData(prev => ({
                                  ...prev,
                                  applicable_classes: newClasses,
                                  applicable_sections: newSections
                                }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                                isSel
                                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                              }`}
                            >
                              {c.name || c.class_name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section Selector for Selected Classes */}
                    {formData.applicable_classes.length > 0 && (
                      <div className="pt-2 border-t border-zinc-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-zinc-700">2. Filter by Section (Optional):</span>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            {formData.applicable_sections.length === 0 ? 'All Sections included' : `${formData.applicable_sections.length} specific sections`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                          {(sectionsList || [])
                            .filter(sec => sec && formData.applicable_classes?.includes(Number(sec.class_id)))
                            .map(sec => {
                              const parentClass = (classesList || []).find(c => c && Number(c.id) === Number(sec.class_id));
                              const label = `${parentClass?.class_name || parentClass?.name || 'Class'} - Sec ${sec.name || sec.section_name || ''}`;
                              const secId = Number(sec.id);
                              const currentSections = Array.isArray(formData.applicable_sections) ? formData.applicable_sections : [];
                              const isSel = currentSections.includes(secId);
                              return (
                                <button
                                  key={sec.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData(prev => {
                                      const prevSections = Array.isArray(prev.applicable_sections) ? prev.applicable_sections : [];
                                      return {
                                        ...prev,
                                        applicable_sections: isSel
                                          ? prevSections.filter(id => id !== secId)
                                          : [...prevSections, secId]
                                      };
                                    });
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer border transition-all flex items-center space-x-1 ${
                                    isSel
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-indigo-50 hover:text-indigo-600'
                                  }`}
                                >
                                  <span>{label}</span>
                                </button>
                              );
                            })}
                        </div>
                        {formData.applicable_sections.length > 0 && (
                          <div className="mt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, applicable_sections: [] }))}
                              className="text-[10px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                            >
                              Reset to all sections of selected classes
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Details / Description</label>
                <textarea
                  rows={2}
                  placeholder="Additional event details, timing, or holiday notice..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-zinc-200 p-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              {/* Attachments & Resource Links */}
              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-zinc-700 flex items-center space-x-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Attachments, Documents & Links</span>
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <label className="px-2 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer flex items-center space-x-1 transition-colors">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        disabled={isUploading}
                        onChange={handleFileUpload}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowAddLinkForm(!showAddLinkForm)}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                {/* Inline Add Link Form */}
                {showAddLinkForm && (
                  <div className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 space-y-2 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="Link Title (e.g. Circular PDF / Meeting Link)"
                        value={newLinkTitle}
                        onChange={e => setNewLinkTitle(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                      <Input
                        placeholder="URL (e.g. https://meet.google.com/...)"
                        value={newLinkUrl}
                        onChange={e => setNewLinkUrl(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setShowAddLinkForm(false)}
                        className="px-2.5 py-1 text-[11px] text-zinc-600 hover:text-zinc-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddLink}
                        className="h-7 text-[11px]"
                      >
                        Add Web Link
                      </Button>
                    </div>
                  </div>
                )}

                {/* Attachments List */}
                {formData.attachments?.length > 0 ? (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {formData.attachments.map(att => {
                      const isImg = att.type === 'image';
                      const isLink = att.type === 'link';
                      return (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-colors"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                            <div className="p-1 rounded bg-zinc-100 text-zinc-600 shrink-0">
                              {isImg ? <Image className="w-3.5 h-3.5 text-blue-600" /> : (
                                isLink ? <Link className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-purple-600" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-zinc-800 hover:text-indigo-600 hover:underline truncate block"
                              >
                                {att.name || att.url}
                              </a>
                              <span className="text-[10px] text-zinc-400 uppercase font-mono">
                                {att.type}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-zinc-400 hover:text-zinc-700"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Remove attachment"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 italic">No images, documents or links attached yet.</p>
                )}
              </div>
            </div>

            {/* Modal Sticky Actions Footer */}
            <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between shrink-0">
              {editingEventId ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEvent(editingEventId, formData.title)}
                >
                  Delete Event
                </Button>
              ) : <div />}

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEventModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold"
                >
                  {isSaving ? 'Saving...' : (editingEventId ? 'Update Event' : 'Publish Event')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};
