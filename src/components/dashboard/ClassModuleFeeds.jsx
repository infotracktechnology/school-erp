import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  CalendarCheck, 
  BookOpen, 
  GraduationCap, 
  Bell, 
  FileText, 
  RefreshCw, 
  Search,
  Sparkles,
  ChevronRight,
  Clock,
  Layers
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { useErp } from '../../context/ErpContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    { key: 'all', label: 'All Feeds', icon: Layers },
    { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { key: 'homework', label: 'Homework', icon: BookOpen },
    { key: 'examinations', label: 'Examinations', icon: GraduationCap },
    { key: 'announcements', label: 'Notices', icon: Bell },
    { key: 'assignments', label: 'Assignments', icon: FileText }
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
          badgeVariant: 'emerald'
        };
      case 'Homework':
        return {
          icon: BookOpen,
          badgeVariant: 'default'
        };
      case 'Examinations':
        return {
          icon: GraduationCap,
          badgeVariant: 'secondary'
        };
      case 'Announcements':
        return {
          icon: Bell,
          badgeVariant: 'outline'
        };
      case 'Assignments':
        return {
          icon: FileText,
          badgeVariant: 'secondary'
        };
      default:
        return {
          icon: Activity,
          badgeVariant: 'outline'
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
    <Card className="border-border overflow-hidden">
      {/* Header Bar */}
      <CardHeader className="p-5 sm:p-6 border-b border-border bg-gradient-to-b from-muted/30 to-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base sm:text-lg font-black text-foreground tracking-tight">
                  {title}
                </CardTitle>
                <Badge variant="emerald" className="gap-1 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{filteredFeeds.length} Updates</span>
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                {subtitle}
              </CardDescription>
            </div>
          </div>

          {/* Quick controls: Class filter + Refresh */}
          <div className="flex items-center space-x-2.5">
            <select
              aria-label="Filter by Class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs font-semibold bg-background border border-input rounded-xl px-3 py-2 text-foreground hover:border-primary/40 focus:outline-hidden focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="all">🎓 All Classes</option>
              {classes && classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name || `Class ${c.id}`}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchFeeds(true)}
              disabled={isRefreshing || loading}
              title="Refresh Feeds"
              className="h-8 w-8"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Module Category Filter Pills & Search */}
        <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {modulesList.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.key;
              return (
                <Button
                  key={m.key}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setActiveModule(m.key)}
                  className="text-xs font-bold gap-1.5 rounded-xl h-8"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Search box using shadcn Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search feed activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      {/* Feeds List Body */}
      <CardContent className={`p-0 divide-y divide-border overflow-y-auto ${compact ? 'max-h-[380px]' : 'max-h-[520px]'}`}>
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
            <p className="text-xs font-semibold text-muted-foreground">Loading module activities...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 text-xs font-medium">
            {error}
          </div>
        ) : filteredFeeds.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-foreground">No activity feeds found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try selecting "All Classes" or clear your module search filter for an empty feed overview.
            </p>
          </div>
        ) : (
          filteredFeeds.map((item, idx) => {
            const badgeInfo = getModuleBadge(item.module);
            const Icon = badgeInfo.icon;
            return (
              <div 
                key={item.id || idx}
                onClick={() => item.link && navigate(item.link)}
                className="p-4 sm:p-4.5 hover:bg-muted/40 transition-colors flex items-start justify-between gap-4 group cursor-pointer"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={badgeInfo.badgeVariant} className="text-[10px] font-bold">
                        {item.module || 'Activity'}
                      </Badge>
                      {item.class_name && (
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {item.class_name} {item.section_name && item.section_name !== 'All' ? `(${item.section_name})` : ''}
                        </span>
                      )}
                      <span className="text-muted-foreground text-[10px]">•</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(item.created_at || item.timestamp || item.date)}
                      </span>
                      {item.due_date && (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          Due: {item.due_date}
                        </Badge>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {item.description || item.message || item.details}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2 pt-1">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {item.author || item.teacher_name || 'Staff'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>

      {/* Footer summary */}
      <CardFooter className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>Displaying latest activities across curriculum & campus life</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/communication/overview')}
          className="text-primary hover:text-primary/80 font-semibold inline-flex items-center space-x-1 p-0 h-auto"
        >
          <span>Communication Hub</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassModuleFeeds;
