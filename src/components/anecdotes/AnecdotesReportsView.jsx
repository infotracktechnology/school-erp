import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Users, Star, AlertCircle, MessageSquare, 
  Download, Printer, Search, Calendar, ChevronRight, X,
  Building2, BookOpen, Sparkles, TrendingUp, Award, RefreshCw, FileText
} from 'lucide-react';
import { anecdoteService } from '../../services/anecdoteService';
import { useErp } from '../../context/ErpContext';

export const AnecdotesReportsView = ({ 
  branchId, 
  academicYearId, 
  classes = [], 
  sections = [],
  branches = [],
  onSwitchBranch
}) => {
  const { showToast } = useErp();

  // Active Report Sub-view: 'class-matrix' | 'analytics'
  const [activeReportTab, setActiveReportTab] = useState('class-matrix');

  // Filters
  const [selectedBranchId, setSelectedBranchId] = useState(branchId || '1');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'all');
  const [selectedSectionId, setSelectedSectionId] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [summaryData, setSummaryData] = useState(null);
  const [matrixData, setMatrixData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Student Dossier Modal
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState(null);
  const [dossierData, setDossierData] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);

  // Sections filter based on class
  const filteredSections = useMemo(() => {
    if (selectedClassId === 'all') return sections;
    return sections.filter(s => String(s.class_id) === String(selectedClassId));
  }, [sections, selectedClassId]);

  // Load Reports Summary & Matrix
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [sumRes, matRes] = await Promise.all([
        anecdoteService.getReportsSummary({
          branch_id: selectedBranchId,
          academic_year_id: academicYearId,
          class_id: selectedClassId !== 'all' ? selectedClassId : undefined,
          section_id: selectedSectionId !== 'all' ? selectedSectionId : undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        }),
        anecdoteService.getClassMatrixReport({
          branch_id: selectedBranchId,
          academic_year_id: academicYearId,
          class_id: selectedClassId !== 'all' ? selectedClassId : undefined,
          section_id: selectedSectionId !== 'all' ? selectedSectionId : undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        })
      ]);

      setSummaryData(sumRes);
      setMatrixData(matRes);
    } catch (err) {
      console.error('Failed to load reports data:', err);
      showToast('Failed to load report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedBranchId, academicYearId, selectedClassId, selectedSectionId, startDate, endDate]);

  // Open Student Dossier (PTM Printable View)
  const handleOpenDossier = async (studentId) => {
    setSelectedStudentForDossier(studentId);
    setLoadingDossier(true);
    try {
      const data = await anecdoteService.getStudentDossier(studentId);
      setDossierData(data);
    } catch (err) {
      console.error('Failed to load student dossier:', err);
      showToast('Could not load student dossier card', 'error');
    } finally {
      setLoadingDossier(false);
    }
  };

  // Export Matrix to CSV
  const handleExportCSV = () => {
    if (!matrixData.length) return;
    setIsExporting(true);

    const headers = ['Roll No', 'Student Name', 'Admission No', 'Class', 'Section', 'Total Praise', 'Neutral Notes', 'Guidance Remarks', 'Total Anecdotes', 'Last Observation'];
    const rows = matrixData.map(st => [
      st.roll_number || 'N/A',
      `"${st.student_name}"`,
      st.admission_number || '',
      st.class_name || '',
      st.section_name || '',
      st.positive_count || 0,
      st.neutral_count || 0,
      st.guidance_count || 0,
      st.total_anecdotes || 0,
      st.last_observation_date || 'None'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Anecdotes_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    showToast('Report CSV exported successfully!', 'success');
  };

  // Filter matrix by text search
  const filteredMatrix = useMemo(() => {
    if (!searchQuery.trim()) return matrixData;
    const q = searchQuery.toLowerCase();
    return matrixData.filter(st => 
      st.student_name?.toLowerCase().includes(q) ||
      st.admission_number?.toLowerCase().includes(q) ||
      String(st.roll_number).includes(q)
    );
  }, [matrixData, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Controls & Sub-tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle between Matrix & Charts */}
        <div className="flex items-center space-x-2 bg-slate-100/90 p-1.5 rounded-2xl w-fit border border-slate-200/70">
          <button
            type="button"
            onClick={() => setActiveReportTab('class-matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeReportTab === 'class-matrix'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Class Behavioral Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeReportTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Category & Sentiment Analytics</span>
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={fetchReportData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!matrixData.length || isExporting}
            className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Branch Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Branch</label>
            <select
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                if (onSwitchBranch) onSwitchBranch(e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.branch_name} ({b.branch_code || 'BR'})</option>
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
              {filteredSections.map(s => (
                <option key={s.id} value={s.id}>{s.section_name}</option>
              ))}
            </select>
          </div>

          {/* Date Range: Start */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Date Range: End */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: CLASS BEHAVIORAL MATRIX */}
      {activeReportTab === 'class-matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Student Behavioral Recognition Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidated count of praises, observations, and guidance notes per student. Click any student to open their printable dossier.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">Compiling class matrix report...</p>
            </div>
          ) : filteredMatrix.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs font-medium">
              No students found for the selected branch/class filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Roll #</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Admission #</th>
                    <th className="py-3 px-4">Class & Sec</th>
                    <th className="py-3 px-4 text-center">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ⭐ Praise
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                        💬 General
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ⚠️ Guidance
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center font-black">Total</th>
                    <th className="py-3 px-4">Last Remark Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMatrix.map((st) => (
                    <tr 
                      key={st.student_id} 
                      className="hover:bg-purple-50/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDossier(st.student_id)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        {st.roll_number || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {st.student_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {st.admission_number || '—'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {st.class_name || 'Class'} - {st.section_name || 'A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          st.positive_count > 0 ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400'
                        }`}>
                          {st.positive_count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          st.neutral_count > 0 ? 'bg-sky-100 text-sky-800' : 'text-slate-400'
                        }`}>
                          {st.neutral_count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          st.guidance_count > 0 ? 'bg-amber-100 text-amber-800' : 'text-slate-400'
                        }`}>
                          {st.guidance_count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-800">
                        {st.total_anecdotes}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {st.last_observation_date ? (
                          <span className="inline-flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{st.last_observation_date}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No notes</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDossier(st.student_id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px] inline-flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CATEGORY & SENTIMENT ANALYTICS */}
      {activeReportTab === 'analytics' && summaryData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sentiment Distribution</h4>
                  <p className="text-xs text-slate-500">Positive praise vs constructive guidance</p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  {summaryData.total} Total
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {summaryData.sentiments.map((s) => {
                  const pct = summaryData.total > 0 ? Math.round((s.count / summaryData.total) * 100) : 0;
                  const isPos = s.sentiment === 'Positive';
                  const isGuidance = s.sentiment === 'Needs Improvement';
                  const barColor = isPos ? 'bg-emerald-500' : isGuidance ? 'bg-amber-500' : 'bg-sky-500';

                  return (
                    <div key={s.sentiment} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{s.sentiment}</span>
                        <span>{s.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Domain & Category Spread</h4>
                <p className="text-xs text-slate-500">Distribution across Academics, Conduct, Sports & Arts</p>
              </div>

              <div className="space-y-3 pt-2">
                {summaryData.categories.map((c) => {
                  const pct = summaryData.total > 0 ? Math.round((c.count / summaryData.total) * 100) : 0;
                  return (
                    <div key={c.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{c.category}</span>
                        <span className="font-bold">{c.count} notes</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Recognized Students Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Top Recognized Students (Class Stars)</span>
                </h4>
                <p className="text-xs text-slate-500">Students with the highest positive recognitions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {summaryData.top_students?.map((st, i) => (
                <div 
                  key={st.id}
                  onClick={() => handleOpenDossier(st.id)}
                  className="p-4 rounded-2xl bg-gradient-to-b from-purple-50/50 to-white border border-purple-100/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-black text-xs inline-flex items-center justify-center mb-2">
                      #{i + 1}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">{st.student_name}</h5>
                    <p className="text-[10px] text-slate-500 font-medium">{st.class_name} - {st.section_name}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-100/60 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-emerald-500" />
                      <span>{st.positive_count} Praises</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT INDIVIDUAL DOSSIER MODAL (PTM & Print-Ready) */}
      {selectedStudentForDossier && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between print:bg-none print:text-black">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-200 bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
                  Official Anecdotal Record Dossier
                </span>
                <h3 className="text-lg font-black tracking-tight text-white mt-1">
                  {dossierData?.student?.student_name || 'Student Behavioral Dossier'}
                </h3>
                <p className="text-xs text-purple-100 font-medium">
                  {dossierData?.student?.class_name} - {dossierData?.student?.section_name} • Adm No: {dossierData?.student?.admission_number || 'N/A'} • Campus: {dossierData?.student?.branch_name}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors print:hidden"
                  title="Print Dossier"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDossier(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors print:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dossier Content */}
            <div className="p-6 space-y-5">
              {loadingDossier ? (
                <div className="py-16 text-center">
                  <RefreshCw className="w-7 h-7 text-purple-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">Loading student behavioral record...</p>
                </div>
              ) : dossierData ? (
                <>
                  {/* Summary Counters */}
                  <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Total Notes</span>
                      <span className="text-base font-black text-slate-800">{dossierData.summary.total}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-emerald-600">Praises</span>
                      <span className="text-base font-black text-emerald-700">{dossierData.summary.positive}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-sky-600">General</span>
                      <span className="text-base font-black text-sky-700">{dossierData.summary.neutral}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-amber-600">Guidance</span>
                      <span className="text-base font-black text-amber-700">{dossierData.summary.guidance}</span>
                    </div>
                  </div>

                  {/* Chronological Record List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Observations & Feedback History
                    </h4>

                    {dossierData.records.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">
                        No anecdotal records entered for this student yet.
                      </p>
                    ) : (
                      dossierData.records.map((rec) => (
                        <div key={rec.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {rec.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {rec.incident_date}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900">{rec.title}</h5>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            "{rec.observation_text}"
                          </p>
                          {rec.recorded_by_name && (
                            <p className="text-[10px] text-slate-400 italic text-right">
                              Logged by: {rec.recorded_by_name}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : null}

              {/* Close Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end print:hidden">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDossier(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdotesReportsView;
