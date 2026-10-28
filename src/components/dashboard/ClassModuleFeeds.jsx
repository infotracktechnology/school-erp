import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  CalendarCheck, 
  BookOpen, 
  GraduationCap, 
  Bell, 
  FileText, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { useErp } from '../../context/ErpContext';
import { useNavigate } from 'react-router-dom';

export const ClassModuleFeeds = ({ 
  branchId, 
  academicYearId,
  selectedClassId = 'all',
  title = "Live Class & Module Feeds",
  subtitle = "Real-time updates, roll-calls, exam grades & announcements across all classes",
  compact = false
}) => {
  const navigate = useNavigate();
  const { classes } = useErp();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [activeModule, setActiveModule] = useState('all');
  const [classFilter, setClassFilter] = useState(selectedClassId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const modulesList = [
    { key: 'all', label: 'All Feeds', icon: Layers, countColor: 'bg-slate-100 text-slate-700' },
    { key: 'attendance', label: 'Attendance', icon: CalendarCheck, countColor: 'bg-emerald-100 text-emerald-800' },
    { key: 'homework', label: 'Homework', icon: BookOpen, countColor: 'bg-indigo-100 text-indigo-800' },
    { key: 'examinations', label: 'Examinations', icon: GraduationCap, countColor: 'bg-purple-100 text-purple-800' },
    { key: 'announcements', label: 'Notices', icon: Bell, countColor: 'bg-amber-100 text-amber-800' },
    { key: 'assignments', label: 'Assignments', icon: FileText, countColor: 'bg-sky-100 text-sky-800' }
  ];

  const fetchFeeds = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await communicationService.getClassModuleFeeds({
        branch_id: branchId || 'all',
        academic_year_id: academicYearId || 'all',
        class_id: classFilter !== 'all' ? classFilter : undefined,
        module: activeModule !== 'all' ? activeModule : undefined
      });
      setFeeds(data || []);
    } catch (err) {
      console.error('Failed to fetch class module feeds:', err);
      setError(err.message || 'Unable to load real-time feeds');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [branchId, academicYearId, classFilter, activeModule]);

  // Client-side text search filter
  const filteredFeeds = useMemo(() => {
    if (!searchQuery.trim()) return feeds;
    const q = searchQuery.toLowerCase();
    return feeds.filter(f => 
      (f.title && f.title.toLowerCase().includes(q)) ||
      (f.description && f.description.toLowerCase().includes(q)) ||
      (f.class_name && f.class_name.toLowerCase().includes(q)) ||
      (f.module && f.module.toLowerCase().includes(q))
    );
  }, [feeds, searchQuery]);

  const getModuleBadge = (mod) => {
    switch (mod) {
      case 'Attendance':
        return {
          icon: CalendarCheck,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'Homework':
        return {
          icon: BookOpen,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500'
        };
      case 'Examinations':
        return {
          icon: GraduationCap,
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'Announcements':
        return {
          icon: Bell,
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'Assignments':
        return {
          icon: FileText,
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500'
        };
      default:
        return {
          icon: Activity,
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400'
        };
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'Just now';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return ts;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#ece7f0] shadow-sm overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-[#ece7f0] bg-gradient-to-b from-[#faf7f2]/50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-[#4f46e5]/20 shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-[#1e1b3a] tracking-tight">
                  {title}
                </h3>
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eeedff] text-[#4f46e5] border border-[#d8d5ff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4f46e5] animate-pulse"></span>
                  <span>{filteredFeeds.length} Updates</span>
                </span>
              </div>
              <p className="text-xs text-[#625e7d] mt-0.5 font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Quick controls: Class filter + Refresh */}
          <div className="flex items-center space-x-2.5">
            {/* Class Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by Class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="text-xs font-semibold bg-white border border-[#ece7f0] rounded-xl px-3 py-2 text-[#1e1b3a] hover:border-[#4f46e5]/40 focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]/20 pr-8 cursor-pointer shadow-2xs"
              >
                <option value="all">🎓 All Classes</option>
                {classes && classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.class_name || `Class ${c.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchFeeds(true)}
              disabled={isRefreshing || loading}
              title="Refresh Feeds"
              className="p-2 text-[#625e7d] hover:text-[#4f46e5] hover:bg-[#eeedff] rounded-xl border border-[#ece7f0] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#4f46e5]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Module Category Filter Pills & Search */}
        <div className="mt-4 pt-4 border-t border-[#ece7f0]/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {modulesList.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setActiveModule(m.key)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1e1b3a] text-white shadow-xs'
                      : 'bg-[#f5f2fa] text-[#625e7d] hover:bg-[#eeedff] hover:text-[#4f46e5]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#625e7d]'}`} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#625e7d]" />
            <input
              type="text"
              placeholder="Search feed activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#faf7f2] border border-[#ece7f0] rounded-xl text-[#1e1b3a] placeholder-[#625e7d] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]/20"
            />
          </div>
        </div>
      </div>

      {/* Feeds List Body */}
      <div className={`divide-y divide-slate-100 overflow-y-auto ${compact ? 'max-h-[380px]' : 'max-h-[520px]'}`}>
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">Loading module activities...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 text-xs font-medium">
            {error}
          </div>
        ) : filteredFeeds.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-700">No activity feeds found</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Try selecting "All Classes" or clear your module search filter.
            </p>
          </div>
        ) : (
          filteredFeeds.map((item) => {
            const badge = getModuleBadge(item.module);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={item.id}
                onClick={() => item.link && navigate(item.link)}
                className="p-4 sm:p-4.5 hover:bg-slate-50/80 transition-colors group cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  {/* Module Icon Capsule */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${badge.bg}`}>
                    <BadgeIcon className="w-4 h-4" />
                  </div>

                  {/* Content details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </span>
                      {item.class_name && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.class_name} {item.section_name && item.section_name !== 'All' ? `• Sec ${item.section_name}` : ''}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.badge_color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        item.badge_color === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        item.badge_color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        item.badge_color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        item.badge_color === 'sky' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                        'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium pt-0.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </span>
                      {item.due_date && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-medium">Due: {item.due_date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Arrow / Action button */}
                <div className="shrink-0 flex items-center pt-1 text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer summary */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Displaying latest activities across curriculum & campus life</span>
        <button
          onClick={() => navigate('/communication/overview')}
          className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center space-x-1 cursor-pointer"
        >
          <span>Communication Hub</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
