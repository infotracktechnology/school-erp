import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Plus, Search, Filter, BookOpen, Star, AlertCircle, 
  Smile, UserCheck, Calendar, Eye, EyeOff, Trash2, Edit2, 
  CheckCircle2, RefreshCw, X, ChevronRight, Award, MessageSquare,
  Users, Layers, BarChart3
} from 'lucide-react';
import { useErp } from '../context/ErpContext';
import { useParams, useNavigate } from 'react-router-dom';
import { anecdoteService } from '../services/anecdoteService';
import { getStudents } from '../services/api';
import { AnecdotesReportsView } from '../components/anecdotes/AnecdotesReportsView';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Academic', label: 'Academic Excellence' },
  { value: 'Behavioral', label: 'Behavior & Conduct' },
  { value: 'Social-Emotional', label: 'Social & Emotional' },
  { value: 'Sports', label: 'Sports & Athletics' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Extracurricular', label: 'Arts & Extracurricular' },
  { value: 'General', label: 'General Observation' },
];

const SENTIMENTS = [
  { value: 'all', label: 'All Sentiments' },
  { value: 'Positive', label: 'Positive / Praise', color: 'emerald', icon: Star },
  { value: 'Neutral', label: 'Neutral Observation', color: 'blue', icon: MessageSquare },
  { value: 'Needs Improvement', label: 'Needs Guidance', color: 'amber', icon: AlertCircle },
];

export const AnecdotesPage = () => {
  const { subTab } = useParams();
  const navigate = useNavigate();

  const { 
    branches, 
    activeBranchId, 
    setActiveBranchId,
    activeAcademicYear, 
    isSuperAdmin,
    showToast 
  } = useErp();

  // Branch selector state: super admin can choose specific branch or 'all'
  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    return activeBranchId ? String(activeBranchId) : '1';
  });

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [anecdotes, setAnecdotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync viewMode with URL subTab ('logs' or 'reports')
  const viewMode = subTab === 'reports' ? 'reports' : 'logs';

  const handleSwitchTab = (tab) => {
    navigate(`/anecdotes/${tab}`);
  };

  // Filters
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedSectionId, setSelectedSectionId] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [studentsList, setStudentsList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [formData, setFormData] = useState({
    branch_id: selectedBranchId !== 'all' ? selectedBranchId : '1',
    student_id: '',
    class_id: '',
    section_id: '',
    incident_date: new Date().toISOString().split('T')[0],
    category: 'Academic',
    sentiment: 'Positive',
    title: '',
    observation_text: '',
    is_visible_to_parent: true,
  });

  const branchIdToFetch = selectedBranchId !== 'all' ? selectedBranchId : (branches?.[0]?.id || 1);
  const academicYearIdToUse = activeAcademicYear?.id || 2;

  // Load Classes and Sections dynamically whenever selected Branch changes
  useEffect(() => {
    fetch(`/api/classes?branch_id=${branchIdToFetch}&status=Active`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.classes || []);
        setClasses(list);
      })
      .catch(err => console.error('Failed to load classes:', err));

    fetch(`/api/sections?branch_id=${branchIdToFetch}`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.sections || []);
        setSections(list);
      })
      .catch(err => console.error('Failed to load sections:', err));
  }, [branchIdToFetch]);

  // Load Anecdotes
  const loadAnecdotes = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setLoading(true);

    try {
      const data = await anecdoteService.getAnecdotes({
        branch_id: selectedBranchId !== 'all' ? selectedBranchId : undefined,
        academic_year_id: academicYearIdToUse,
        class_id: selectedClassId !== 'all' ? selectedClassId : undefined,
        section_id: selectedSectionId !== 'all' ? selectedSectionId : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sentiment: selectedSentiment !== 'all' ? selectedSentiment : undefined,
        search: searchQuery.trim() || undefined,
      });
      setAnecdotes(data);
    } catch (err) {
      console.error('Failed to load anecdotes:', err);
      showToast(err.message || 'Failed to load anecdotes', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnecdotes();
  }, [
    selectedBranchId, 
    academicYearIdToUse, 
    selectedClassId, 
    selectedSectionId, 
    selectedCategory, 
    selectedSentiment
  ]);

  // Filter sections based on selected class in filters or form
  const availableSections = useMemo(() => {
    if (selectedClassId === 'all') return sections;
    return sections.filter(s => String(s.class_id) === String(selectedClassId));
  }, [sections, selectedClassId]);

  const formAvailableSections = useMemo(() => {
    if (!formData.class_id) return sections;
    return sections.filter(s => String(s.class_id) === String(formData.class_id));
  }, [sections, formData.class_id]);

  // Load students when modal opens or class changes in modal
  useEffect(() => {
    if (!isModalOpen) return;
    setLoadingStudents(true);
    getStudents({
      branch_id: formData.branch_id || branchIdToFetch,
      academic_year_id: academicYearIdToUse,
      class_id: formData.class_id || undefined,
      section_id: formData.section_id || undefined,
      status: 'Active'
    })
      .then(res => {
        const list = res.data || res.students || [];
        setStudentsList(list);
      })
      .catch(err => console.error('Failed to load students for modal:', err))
      .finally(() => setLoadingStudents(false));
  }, [isModalOpen, formData.branch_id, formData.class_id, formData.section_id, branchIdToFetch, academicYearIdToUse]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      branch_id: selectedBranchId !== 'all' ? selectedBranchId : (branches[0]?.id || '1'),
      student_id: '',
      class_id: selectedClassId !== 'all' ? selectedClassId : (classes[0]?.id || ''),
      section_id: selectedSectionId !== 'all' ? selectedSectionId : '',
      incident_date: new Date().toISOString().split('T')[0],
      category: 'Academic',
      sentiment: 'Positive',
      title: '',
      observation_text: '',
      is_visible_to_parent: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setEditingId(item.id);
    setFormData({
      branch_id: item.branch_id,
      student_id: item.student_id,
      class_id: item.class_id,
      section_id: item.section_id,
      incident_date: item.incident_date,
      category: item.category,
      sentiment: item.sentiment,
      title: item.title,
      observation_text: item.observation_text,
      is_visible_to_parent: item.is_visible_to_parent,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id || !formData.title.trim() || !formData.observation_text.trim()) {
      showToast('Please select a student and provide a title and observation notes.', 'error');
      return;
    }

    try {
      if (modalMode === 'create') {
        await anecdoteService.createAnecdote({
          ...formData,
          branch_id: formData.branch_id || branchIdToFetch,
          academic_year_id: academicYearIdToUse,
        });
        showToast('Student observation recorded successfully!', 'success');
      } else {
        await anecdoteService.updateAnecdote(editingId, formData);
        showToast('Anecdote updated successfully!', 'success');
      }
      setIsModalOpen(false);
      loadAnecdotes();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this anecdotal record?')) return;
    try {
      await anecdoteService.deleteAnecdote(id);
      showToast('Anecdote deleted successfully', 'success');
      loadAnecdotes();
    } catch (err) {
      showToast(err.message || 'Failed to delete record', 'error');
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = anecdotes.length;
    const positive = anecdotes.filter(a => a.sentiment === 'Positive').length;
    const neutral = anecdotes.filter(a => a.sentiment === 'Neutral').length;
    const needsGuidance = anecdotes.filter(a => a.sentiment === 'Needs Improvement').length;
    return { total, positive, neutral, needsGuidance };
  }, [anecdotes]);

  const getSentimentPill = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            <span>Praise / Positive</span>
          </span>
        );
      case 'Needs Improvement':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Needs Guidance</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <MessageSquare className="w-3 h-3 text-sky-600" />
            <span>General Note</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Modern Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-purple-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Holistic Assessment & Observations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Anecdotal Records & Student Praise Log
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 max-w-2xl font-medium leading-relaxed">
              Capture teachers' observations, classroom participation, talents, conduct, and positive remarks. Share achievements directly with parents.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => loadAnecdotes(true)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-5 py-3 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer hover:shadow-lg transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-indigo-700" />
              <span>Record New Anecdote</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="block text-[11px] font-semibold text-purple-200 uppercase">Total Logged</span>
            <span className="text-2xl font-black">{metrics.total}</span>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-xs rounded-2xl p-3 border border-emerald-400/30">
            <span className="block text-[11px] font-semibold text-emerald-200 uppercase flex items-center space-x-1">
              <Star className="w-3 h-3 fill-emerald-300" />
              <span>Praise & Merits</span>
            </span>
            <span className="text-2xl font-black text-emerald-100">{metrics.positive}</span>
          </div>
          <div className="bg-sky-500/20 backdrop-blur-xs rounded-2xl p-3 border border-sky-400/30">
            <span className="block text-[11px] font-semibold text-sky-200 uppercase">Neutral Observations</span>
            <span className="text-2xl font-black text-sky-100">{metrics.neutral}</span>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-xs rounded-2xl p-3 border border-amber-400/30">
            <span className="block text-[11px] font-semibold text-amber-200 uppercase">Needs Guidance</span>
            <span className="text-2xl font-black text-amber-100">{metrics.needsGuidance}</span>
          </div>
        </div>
      </div>

      {/* RENDER VIEW 1: OBSERVATION CARDS OR VIEW 2: REPORTS (Controlled by Sidebar Sub-Menu) */}
      {viewMode === 'reports' ? (
        <AnecdotesReportsView
          branchId={selectedBranchId !== 'all' ? selectedBranchId : '1'}
          academicYearId={academicYearIdToUse}
          classes={classes}
          sections={sections}
          branches={branches}
          onSwitchBranch={(bId) => setSelectedBranchId(bId)}
        />
      ) : (
        <>
          {/* Filter Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Branch Filter (Accessible for Admin / Staff) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Branch / Campus
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => {
                const bId = e.target.value;
                setSelectedBranchId(bId);
                setSelectedClassId('all');
                setSelectedSectionId('all');
              }}
              className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {isSuperAdmin && <option value="all">🏢 All Branches</option>}
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.branch_name} ({b.branch_code || 'BR'})
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSectionId('all');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.class_name}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Sections</option>
              {availableSections.map(s => (
                <option key={s.id} value={s.id}>{s.section_name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sentiment</label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {SENTIMENTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Student, title, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadAnecdotes(); }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Anecdotes List / Cards */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading student anecdotal records...</p>
        </div>
      ) : anecdotes.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No Anecdotal Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Start recognizing students' classroom achievements, leadership qualities, and behavioral observations.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center space-x-2 shadow-sm hover:bg-purple-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Observation</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anecdotes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Category highlight bar */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  item.sentiment === 'Positive' 
                    ? 'bg-emerald-500' 
                    : item.sentiment === 'Needs Improvement' 
                    ? 'bg-amber-500' 
                    : 'bg-indigo-500'
                }`}
              />

              <div>
                {/* Header: Student badge + Sentiment badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {item.student_name ? item.student_name.charAt(0).toUpperCase() : 'S'}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {item.student_name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {item.class_name || 'Class'} - {item.section_name || 'Sec'} {item.admission_number ? `• Adm: ${item.admission_number}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {getSentimentPill(item.sentiment)}
                  </div>
                </div>

                {/* Anecdote Title & Category */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.incident_date}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Observation Text */}
                <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-normal bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  "{item.observation_text}"
                </p>
              </div>

              {/* Footer Meta & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                  {item.is_visible_to_parent ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold" title="Visible on Student Portal">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Parent Visible</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-slate-400 font-medium" title="Confidential Staff Only">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Staff Only</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* Quick-Add / Edit Anecdote Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{modalMode === 'create' ? 'Record Student Anecdote' : 'Edit Anecdotal Observation'}</span>
                </h3>
                <p className="text-xs text-purple-100 font-medium mt-0.5">
                  Capture observational records, achievements, or behavioral feedback.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Branch Selector (in modal for Super Admin) */}
              {branches.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branch / Campus <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.branch_id}
                    onChange={(e) => {
                      const bId = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        branch_id: bId, 
                        class_id: '', 
                        section_id: '', 
                        student_id: '' 
                      }));
                      // Reload classes for this selected branch
                      fetch(`/api/classes?branch_id=${bId}&status=Active`)
                        .then(r => r.json())
                        .then(d => setClasses(Array.isArray(d) ? d : (d.data || d.classes || [])));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.branch_name} ({b.branch_code || 'BR'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Class & Section Selector to locate student */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, class_id: e.target.value, section_id: '', student_id: '' }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.class_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={formData.section_id}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, section_id: e.target.value, student_id: '' }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Sections</option>
                    {formAvailableSections.map(s => (
                      <option key={s.id} value={s.id}>{s.section_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Student <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.student_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">{loadingStudents ? 'Loading students...' : '-- Select Student --'}</option>
                  {studentsList.map(st => {
                    const name = `${st.first_name || ''} ${st.last_name || ''}`.trim() || `Student #${st.id}`;
                    return (
                      <option key={st.id} value={st.id}>
                        {name} {st.admission_number ? `(${st.admission_number})` : ''} - Roll #{st.roll_number || 'N/A'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Date, Category & Sentiment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Observation Date</label>
                  <input
                    type="date"
                    required
                    value={formData.incident_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, incident_date: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sentiment Rating</label>
                  <select
                    value={formData.sentiment}
                    onChange={(e) => setFormData(prev => ({ ...prev, sentiment: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Positive">Positive / Praise</option>
                    <option value="Neutral">Neutral Observation</option>
                    <option value="Needs Improvement">Needs Guidance</option>
                  </select>
                </div>
              </div>

              {/* Title / Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title / Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent Science Fair Presentation or Helped Clean Art Lab"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Observation Detail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observation Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the student's specific achievement, conduct, participation, or constructive feedback..."
                  value={formData.observation_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, observation_text: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
                />
              </div>

              {/* Parent Visibility Checkbox */}
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Share with Parents & Student</h5>
                    <p className="text-[11px] text-slate-500">
                      When checked, this praise or note is visible in the Student Portal.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_visible_to_parent}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_visible_to_parent: e.target.checked }))}
                  className="w-5 h-5 rounded-lg text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 shadow-sm cursor-pointer transition-all"
                >
                  {modalMode === 'create' ? 'Save Observation' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdotesPage;
