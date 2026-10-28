import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { 
  Users, UserCheck, CalendarCheck, Calendar, Clock, BookOpen, 
  Award, CreditCard, MessageSquare, Briefcase, Bus, Bookmark, 
  BarChart3, Sparkles, ArrowRight, CheckCircle2, ChevronRight,
  TrendingUp, ShieldCheck, FileCheck2, Bell, Image as ImageIcon,
  DollarSign, Receipt, HelpCircle, Layers, Star, Settings, Palette
} from 'lucide-react';

const MODULE_DESIGNS = [
  {
    id: 'calendar',
    title: 'Academic Calendar & Milestones',
    category: 'Academics & Events',
    status: 'Live & Active',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Interactive monthly matrix with public holidays, term exams, class-section scoping, document attachments, and instant student portal sync.',
    route: '/calendar',
    previewTheme: 'from-rose-500 to-indigo-600',
    features: ['Single / Multi-day events', 'Class & Section Scoping', 'School Closed Badge', 'Document / Link Attachments'],
    stats: { primary: '7 Events', secondary: 'Live Sync' },
    previewElements: [
      { label: 'Diwali Holiday', tag: 'Public Holiday', color: 'bg-red-500 text-white' },
      { label: 'Term 1 Mid-Term', tag: 'Exam', color: 'bg-purple-500 text-white' },
      { label: 'Sports Meet', tag: 'Event', color: 'bg-blue-500 text-white' }
    ]
  },
  {
    id: 'timetable',
    title: 'Timetable & Class Schedule',
    category: 'Academics',
    status: 'Live & Active',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Class-wise, section-wise, and teacher-wise timetable allocation matrices with periods, breaks, and room allocations.',
    route: '/timetable',
    previewTheme: 'from-blue-600 to-cyan-500',
    features: ['Period Slot Master', 'Weekly Grid Matrix', 'Teacher Substitution', 'Student View Portal'],
    stats: { primary: '8 Periods/Day', secondary: 'Class 1-10' },
    previewElements: [
      { label: '09:00 - 09:45', tag: 'Mathematics', color: 'bg-blue-600 text-white' },
      { label: '09:45 - 10:30', tag: 'English Lit', color: 'bg-indigo-600 text-white' },
      { label: '10:30 - 10:45', tag: 'Morning Break', color: 'bg-amber-500 text-white' }
    ]
  },
  {
    id: 'attendance',
    title: 'Daily Attendance & Reports',
    category: 'Student Operations',
    status: 'Live & Active',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Fast class-section morning attendance register, attendance timing masters, percentage summaries, and individual student reports.',
    route: '/attendance',
    previewTheme: 'from-emerald-600 to-teal-500',
    features: ['Quick Mark (P/A/L/OD)', 'Timing Windows', 'Automated Percentage', 'Monthly Reports'],
    stats: { primary: '94.8% Present', secondary: 'Today' },
    previewElements: [
      { label: 'Class 1-A Register', tag: '25/25 Marked', color: 'bg-emerald-600 text-white' },
      { label: 'Attendance Audit', tag: 'Logged', color: 'bg-teal-600 text-white' }
    ]
  },
  {
    id: 'students',
    title: 'Student Information System (SIS)',
    category: 'Core Management',
    status: 'Live & Active',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    description: '360° student profiles, bulk update spreadsheet matrix, parent contact mapping, roll number generations, and student promotion cycles.',
    route: '/students',
    previewTheme: 'from-sky-600 to-indigo-600',
    features: ['Multi-Branch Enrolment', 'Spreadsheet Matrix Update', 'Class Promotion', 'TC / Inactive Archive'],
    stats: { primary: '500+ Enrolled', secondary: 'Active' },
    previewElements: [
      { label: 'Pranav Iyer', tag: 'Class 1-A', color: 'bg-sky-600 text-white' },
      { label: 'Ishita Sharma', tag: 'Class 1-A', color: 'bg-indigo-600 text-white' }
    ]
  },
  {
    id: 'staff',
    title: 'Staff & Faculty Management',
    category: 'Human Capital',
    status: 'Concept Ready',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Teacher profiles, subject allocation matrices, classroom assignees, qualifications, department structures, and contact directory.',
    route: '/staff',
    previewTheme: 'from-teal-600 to-emerald-600',
    features: ['Faculty Directory', 'Class Teacher Mapping', 'Workload Distribution', 'Biometric / Leave Sync'],
    stats: { primary: '42 Teachers', secondary: '100% Assigned' },
    previewElements: [
      { label: 'Dr. Ramesh Kumar', tag: 'Mathematics HOD', color: 'bg-teal-600 text-white' },
      { label: 'Ms. Priya Sundaram', tag: 'English Faculty', color: 'bg-emerald-600 text-white' }
    ]
  },
  {
    id: 'examination',
    title: 'Examinations, Grades & Report Cards',
    category: 'Assessments',
    status: 'In Progress',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Term structure configuration, exam scheduling, marks entry registers, grading scales, GPA algorithms, and printable report cards.',
    route: '/examination',
    previewTheme: 'from-purple-600 to-pink-600',
    features: ['Term 1 & Term 2 Setup', 'Grading Scales (A-F)', 'CBSE / State Board Rules', 'Marksheet PDF Export'],
    stats: { primary: '3 Terms', secondary: 'Grading V2' },
    previewElements: [
      { label: 'Mid-Term Assessment', tag: 'Scheduled', color: 'bg-purple-600 text-white' },
      { label: 'Annual Examination', tag: 'Structure Done', color: 'bg-pink-600 text-white' }
    ]
  },
  {
    id: 'finance',
    title: 'Fees, Invoicing & Collections',
    category: 'Finance & Accounts',
    status: 'Design Preview',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Fee heads setup (Tuition, Bus, Lab), student fee challan generation, online & counter payment collections, dues tracking, and receipts.',
    route: '/finance',
    previewTheme: 'from-amber-600 to-orange-500',
    features: ['Fee Category Matrix', 'Online Payment Gateway', 'Defaulters List & SMS', 'Instant PDF Receipt'],
    stats: { primary: '₹ 14.2 Lakhs', secondary: 'Collected' },
    previewElements: [
      { label: 'Term 1 Tuition Fee', tag: 'Paid', color: 'bg-amber-600 text-white' },
      { label: 'Transport Fee Q2', tag: 'Pending', color: 'bg-orange-500 text-white' }
    ]
  },
  {
    id: 'communication',
    title: 'Parent-School Communication Hub',
    category: 'Engagement',
    status: 'Live & Active',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'Daily homework assignments, teacher notices, circulars with attachments, photo albums gallery, and automated SMS alerts.',
    route: '/communication',
    previewTheme: 'from-cyan-600 to-blue-600',
    features: ['Homework Broadcast', 'Circulars & PDF Attachments', 'Photo Albums', 'Audit Trail'],
    stats: { primary: '100% Reached', secondary: 'Instant Push' },
    previewElements: [
      { label: 'Daily Science Homework', tag: 'Published', color: 'bg-cyan-600 text-white' },
      { label: 'Annual Day Circular', tag: 'Campus Wide', color: 'bg-blue-600 text-white' }
    ]
  },
  {
    id: 'transport',
    title: 'Fleet & Student Transportation',
    category: 'Logistics',
    status: 'Design Preview',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Bus route optimization, vehicle details, driver assignments, stop pick-up timings, student seat mapping, and live GPS tracking.',
    route: '/transport',
    previewTheme: 'from-orange-500 to-red-500',
    features: ['Route & Stops Builder', 'Bus Pass Generation', 'Driver Contact Directory', 'Live GPS Tracking'],
    stats: { primary: '12 Buses', secondary: '24 Routes' },
    previewElements: [
      { label: 'Route 4 - Gandhipuram', tag: 'On Schedule', color: 'bg-orange-600 text-white' },
      { label: 'Vehicle TN-38-AX-1029', tag: 'Active', color: 'bg-red-500 text-white' }
    ]
  },
  {
    id: 'library',
    title: 'Library & Book Circulation',
    category: 'Resource Centre',
    status: 'Design Preview',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Accession registers, barcode scanner checkout/checkin, book search catalog, fine calculations for overdue returns, and inventory.',
    route: '/library',
    previewTheme: 'from-emerald-700 to-teal-800',
    features: ['Barcode Book Scanning', 'Issue / Return Register', 'Overdue Fine Engine', 'Digital Catalog (OPAC)'],
    stats: { primary: '4,500 Books', secondary: '180 Issued' },
    previewElements: [
      { label: 'Wings of Fire', tag: 'Issued to Class 10', color: 'bg-emerald-700 text-white' },
      { label: 'Britannica Vol 3', tag: 'Available', color: 'bg-teal-700 text-white' }
    ]
  },
  {
    id: 'reports',
    title: 'Executive Analytics & MIS Reports',
    category: 'Administration',
    status: 'Live & Active',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Consolidated attendance graphs, student demographics, fee collection trends, teacher workload distribution, and excel export.',
    route: '/reports',
    previewTheme: 'from-indigo-600 to-slate-800',
    features: ['Interactive Trend Charts', 'Class Comparison Matrix', 'Export to Excel / CSV / PDF', 'Branch Comparisons'],
    stats: { primary: '15+ Reports', secondary: 'Instant Export' },
    previewElements: [
      { label: 'Monthly Attendance Trend', tag: 'Chart View', color: 'bg-indigo-600 text-white' },
      { label: 'Strength by Gender', tag: 'Demographics', color: 'bg-slate-700 text-white' }
    ]
  },
  {
    id: 'student-portal',
    title: 'Modern Student & Parent Portal (Homeroom)',
    category: 'Self-Service',
    status: 'Live & Active',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Friendly, warm student mobile-first hub with attendance ring, class schedule, homework submissions, circulars, and calendar.',
    route: '/student/calendar',
    previewTheme: 'from-slate-900 via-indigo-950 to-slate-900',
    features: ['Attendance Ring (94%)', 'Daily Homework Feed', 'Interactive Calendar', 'Digital Assignment Upload'],
    stats: { primary: 'Class 1 (A)', secondary: 'Personalized' },
    previewElements: [
      { label: 'Good Morning, Pranav 👋', tag: 'Homeroom Hub', color: 'bg-indigo-600 text-white' },
      { label: 'Math HW Due Tomorrow', tag: 'Action Required', color: 'bg-rose-600 text-white' }
    ]
  }
];

export const ModuleShowcaseHub = () => {
  return (
    <ErrorBoundary>
      <ModuleShowcaseHubContent />
    </ErrorBoundary>
  );
};

const ModuleShowcaseHubContent = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'Academics', label: 'Academics & Timetable' },
    { id: 'Student Operations', label: 'Student Management' },
    { id: 'Finance & Accounts', label: 'Finance & Logistics' },
    { id: 'Self-Service', label: 'Student Portal' }
  ];

  const filteredModules = MODULE_DESIGNS.filter(m => {
    const matchCat = selectedCategory === 'all' || m.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ── Hero Showcase Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-indigo-500/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-48 w-80 h-80 bg-radial from-rose-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-cyan-300 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive ERP Module Design Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Explore All School ERP Modules & UI Designs
          </h1>
          <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed">
            Choose any module below to inspect its design, layout, workflow, and capabilities. Select the modules you want to customize or launch next!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{MODULE_DESIGNS.length} Enterprise Modules Designed</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-white flex items-center space-x-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Branch & Student Portal Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search module by name or feature..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-600 transition-colors"
          />
        </div>
      </div>

      {/* ── Modules Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((m) => {
          return (
            <div
              key={m.id}
              onClick={() => navigate(m.route)}
              className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
            >
              {/* Card Header Banner Preview */}
              <div className={`p-6 bg-gradient-to-r ${m.previewTheme} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white">
                    {m.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-white">
                    {m.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white relative z-10 leading-snug group-hover:translate-x-1 transition-transform">
                  {m.title}
                </h3>

                {/* Micro Preview Widgets */}
                <div className="mt-4 pt-3 border-t border-white/15 space-y-1.5 relative z-10">
                  {m.previewElements.slice(0, 2).map((el, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      <span className="font-semibold text-white/90 truncate mr-2">{el.label}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${el.color}`}>
                        {el.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Bullet Features */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {m.features.map((f, fi) => (
                      <div key={fi} className="flex items-center space-x-2 text-[11px] font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Metrics</span>
                    <span className="text-xs font-black text-slate-900">{m.stats.primary} • <span className="text-indigo-600 font-bold">{m.stats.secondary}</span></span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(m.route);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer group-hover:scale-105"
                  >
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleShowcaseHub;
