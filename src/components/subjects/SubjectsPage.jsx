import React, { useState, useEffect, useMemo } from 'react';
import { Plus, BookOpen, Search, Filter, RefreshCw, AlertCircle, CheckCircle2, XCircle, Eye, Edit2, Trash2, Layers, Copy, FolderTree } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { getClassSubjectsList, createClassSubject, updateClassSubject, updateClassSubjectStatus, deleteClassSubject, getClasses, getAcademicGroupsList, getSubjectCategoriesList } from '../../services/api';
import { useErp } from '../../context/ErpContext';
import { AcademicBranchYearSelector } from '../academic/AcademicBranchYearSelector';
import { ClassSubjectFormModal } from './ClassSubjectFormModal';
import { ClassSubjectViewModal } from './ClassSubjectViewModal';
import { CopySubjectModal } from './CopySubjectModal';
import { AcademicGroupsTab } from './AcademicGroupsTab';
import { SubjectCategoriesTab } from './SubjectCategoriesTab';
const BOARDS = ['All Boards', 'CBSE', 'ICSE', 'State Board', 'Cambridge', 'IB'];
export const SubjectsPage = ({ branches, activeBranchId, onActiveBranchChange, academicYears, activeAcademicYearId, onActiveAcademicYearChange, showToast }) => {
    const { isReadOnly } = useErp();
    // Primary Navigation Sub-tabs: 'curriculum' | 'groups' | 'categories'
    const [activeTab, setActiveTab] = useState('curriculum');
    // Core Data
    const [classSubjects, setClassSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [academicGroups, setAcademicGroups] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Filters Bar
    const [selectedBoard, setSelectedBoard] = useState('All Boards');
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [selectedGroupId, setSelectedGroupId] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRequirement, setSelectedRequirement] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    // Modals State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingSubject, setViewingSubject] = useState(null);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    // Safe Deactivate / Delete Modal
    const [deletingSubject, setDeletingSubject] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // Scopes
    const selectedBranch = useMemo(() => {
        return (branches || []).find((b) => b.id === activeBranchId) || (branches || [])[0] || null;
    }, [branches, activeBranchId]);
    const selectedAcademicYear = useMemo(() => {
        if (!selectedBranch)
            return null;
        return (academicYears || []).find((ay) => ay.id === activeAcademicYearId) ||
            (academicYears || []).find((ay) => ay.is_current) ||
            (academicYears || [])[0] ||
            null;
    }, [academicYears, activeAcademicYearId, selectedBranch]);
    // Selected Class details for dynamic stream dropdown
    const currentSelectedClass = useMemo(() => {
        if (selectedClassId === 'all')
            return null;
        return classes.find((c) => String(c.id) === selectedClassId) || null;
    }, [classes, selectedClassId]);
    // Groups available for the selected class
    const classSpecificGroups = useMemo(() => {
        if (!currentSelectedClass)
            return academicGroups;
        return academicGroups.filter((g) => !g.class_id || g.class_id === currentSelectedClass.id);
    }, [academicGroups, currentSelectedClass]);
    // Main Fetcher
    const fetchData = async () => {
        if (!selectedBranch || !selectedAcademicYear)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const [subsData, clsRes, grpData, catData] = await Promise.all([
                getClassSubjectsList({
                    branch_id: selectedBranch.id,
                    academic_year_id: selectedAcademicYear.id,
                    board: selectedBoard !== 'All Boards' ? selectedBoard : undefined,
                    class_id: selectedClassId !== 'all' ? Number(selectedClassId) : undefined,
                    group_id: selectedGroupId !== 'all' ? (selectedGroupId === 'none' ? undefined : Number(selectedGroupId)) : undefined,
                    category_name: selectedCategory !== 'all' ? selectedCategory : undefined,
                    status: selectedStatus !== 'all' ? selectedStatus : undefined,
                    search: searchTerm.trim() || undefined
                }),
                getClasses(selectedBranch.id, selectedAcademicYear.id, { status: 'Active' }),
                getAcademicGroupsList({
                    branch_id: selectedBranch.id,
                    academic_year_id: selectedAcademicYear.id
                }),
                getSubjectCategoriesList()
            ]);
            setClassSubjects(subsData);
            setClasses(clsRes.data);
            setAcademicGroups(grpData);
            setCategories(catData);
        }
        catch (err) {
            console.error('Failed to load subject workspace:', err);
            setError(err.message || 'Unable to load subjects for the selected scope.');
            showToast(err.message || 'Failed to load curriculum', 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [
        selectedBranch?.id,
        selectedAcademicYear?.id,
        selectedBoard,
        selectedClassId,
        selectedGroupId,
        selectedCategory,
        selectedStatus,
        searchTerm
    ]);
    // Filtered subjects in-memory for requirement or quick matches
    const filteredClassSubjects = useMemo(() => {
        return classSubjects.filter((item) => {
            if (selectedRequirement !== 'all' && item.requirement !== selectedRequirement)
                return false;
            return true;
        });
    }, [classSubjects, selectedRequirement]);
    // Quick stats
    const stats = useMemo(() => {
        const total = filteredClassSubjects.length;
        const compulsory = filteredClassSubjects.filter((s) => s.requirement === 'Compulsory').length;
        const elective = filteredClassSubjects.filter((s) => s.requirement === 'Elective').length;
        const optional = filteredClassSubjects.filter((s) => s.requirement === 'Optional').length;
        const practical = filteredClassSubjects.filter((s) => Boolean(s.practical_applicable)).length;
        const languages = filteredClassSubjects.filter((s) => Boolean(s.is_language)).length;
        const examApplicable = filteredClassSubjects.filter((s) => Boolean(s.exam_applicable)).length;
        return { total, compulsory, elective, optional, practical, languages, examApplicable };
    }, [filteredClassSubjects]);
    // Handlers
    const handleOpenCreate = () => {
        setEditingSubject(null);
        setIsFormModalOpen(true);
    };
    const handleOpenEdit = (subject) => {
        setEditingSubject(subject);
        setIsFormModalOpen(true);
    };
    const handleOpenView = (subject) => {
        setViewingSubject(subject);
        setIsViewModalOpen(true);
    };
    const handleFormSubmit = async (formData) => {
        try {
            if (editingSubject) {
                await updateClassSubject(editingSubject.id, formData);
                showToast(`Subject "${formData.subject_name}" updated successfully.`, 'success');
            }
            else {
                await createClassSubject(formData);
                showToast(`Subject "${formData.subject_name}" created & assigned successfully.`, 'success');
            }
            setIsFormModalOpen(false);
            fetchData();
        }
        catch (err) {
            showToast(err.message || 'Failed to save subject configuration', 'error');
            throw err;
        }
    };
    const handleToggleStatus = async (subject) => {
        const nextStatus = subject.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await updateClassSubjectStatus(subject.id, nextStatus);
            showToast(`Subject "${subject.subject_name}" status set to ${nextStatus}.`, 'success');
            fetchData();
        }
        catch (err) {
            showToast(err.message || 'Failed to update subject status', 'error');
        }
    };
    const handleDeleteSubject = async () => {
        if (!deletingSubject)
            return;
        setIsDeleting(true);
        try {
            const res = await deleteClassSubject(deletingSubject.id);
            showToast(res.message, 'success');
            setDeletingSubject(null);
            fetchData();
        }
        catch (err) {
            showToast(err.message || 'Cannot physically delete subject. Deactivate instead.', 'error');
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (<div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Class-Wise Subject & Group Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Hierarchical Master
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Board → Class → Group / Stream → Subjects → Evaluation Rules
          </p>
        </div>

        {/* Global Selectors */}
        <AcademicBranchYearSelector branches={branches} activeBranchId={activeBranchId} onBranchChange={onActiveBranchChange} academicYears={academicYears} activeAcademicYearId={activeAcademicYearId} onAcademicYearChange={onActiveAcademicYearChange}/>
      </div>

      {/* 2. Top-Level Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-1">
        <div className="flex space-x-2">
          <button type="button" onClick={() => setActiveTab('curriculum')} className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'curriculum'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
            <BookOpen className="w-4 h-4"/>
            <span>Class-Wise Subjects</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'curriculum' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'}`}>
              {classSubjects.length}
            </span>
          </button>

          <button type="button" onClick={() => setActiveTab('groups')} className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'groups'
            ? 'bg-purple-700 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
            <Layers className="w-4 h-4"/>
            <span>Groups / Streams Master</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'groups' ? 'bg-purple-800 text-purple-100' : 'bg-slate-200 text-slate-700'}`}>
              {academicGroups.length}
            </span>
          </button>

          <button type="button" onClick={() => setActiveTab('categories')} className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'categories'
            ? 'bg-slate-800 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
            <FolderTree className="w-4 h-4"/>
            <span>Subject Categories</span>
          </button>
        </div>

        {activeTab === 'curriculum' && (<div className="flex items-center space-x-2.5">
            <button type="button" onClick={() => setIsCopyModalOpen(true)} disabled={isReadOnly} className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50">
              <Copy className="w-3.5 h-3.5 text-blue-600"/>
              <span>Copy Subjects Across Classes</span>
            </button>

            <button type="button" onClick={handleOpenCreate} disabled={isReadOnly} className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50">
              <Plus className="w-4 h-4"/>
              <span>Create Subject</span>
            </button>
          </div>)}
      </div>

      {/* 3. TAB VIEWS */}
      {activeTab === 'groups' ? (<AcademicGroupsTab groups={academicGroups} classes={classes} branchId={selectedBranch?.id || 1} academicYearId={selectedAcademicYear?.id || 1} branchName={selectedBranch?.branch_name || ''} academicYearName={selectedAcademicYear?.name || ''} onRefresh={fetchData} showToast={showToast} isReadOnly={isReadOnly}/>) : activeTab === 'categories' ? (<SubjectCategoriesTab categories={categories} onRefresh={fetchData} showToast={showToast} isReadOnly={isReadOnly}/>) : (
        /* MAIN CURRICULUM VIEW */
        <div className="space-y-4">
          {/* Quick KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Configured
              </span>
              <div className="text-xl font-black text-slate-900 mt-1 flex items-baseline justify-between">
                <span>{stats.total}</span>
                <span className="text-[10px] text-slate-400 font-medium">Subjects</span>
              </div>
            </Card>

            <Card className="p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Compulsory
              </span>
              <div className="text-xl font-black text-emerald-800 mt-1 flex items-baseline justify-between">
                <span>{stats.compulsory}</span>
                <span className="text-[10px] text-emerald-600 font-medium">Core</span>
              </div>
            </Card>

            <Card className="p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                Elective & Opt.
              </span>
              <div className="text-xl font-black text-purple-700 mt-1 flex items-baseline justify-between">
                <span>{stats.elective + stats.optional}</span>
                <span className="text-[10px] text-purple-500 font-medium">{stats.elective} Electives</span>
              </div>
            </Card>

            <Card className="p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                Practicals / Labs
              </span>
              <div className="text-xl font-black text-blue-700 mt-1 flex items-baseline justify-between">
                <span>{stats.practical}</span>
                <span className="text-[10px] text-blue-500 font-medium">Lab Modules</span>
              </div>
            </Card>

            <Card className="p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                Languages
              </span>
              <div className="text-xl font-black text-amber-700 mt-1 flex items-baseline justify-between">
                <span>{stats.languages}</span>
                <span className="text-[10px] text-amber-500 font-medium">Tracks</span>
              </div>
            </Card>

            <Card className="p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Exam Applicable
              </span>
              <div className="text-xl font-black text-slate-800 mt-1 flex items-baseline justify-between">
                <span>{stats.examApplicable}</span>
                <span className="text-[10px] text-slate-500 font-medium">Evaluated</span>
              </div>
            </Card>
          </div>

          {/* HIERARCHICAL FILTER BAR (Board -> Class -> Stream -> Category -> Search) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-emerald-700"/>
                <span>Hierarchical Curriculum Filters</span>
              </div>
              {(selectedBoard !== 'All Boards' || selectedClassId !== 'all' || selectedGroupId !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (<button type="button" onClick={() => {
                    setSelectedBoard('All Boards');
                    setSelectedClassId('all');
                    setSelectedGroupId('all');
                    setSelectedCategory('all');
                    setSelectedRequirement('all');
                    setSelectedStatus('all');
                    setSearchTerm('');
                }} className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
                  Reset Filters
                </button>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              {/* Board Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Board</label>
                <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} className="w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer">
                  {BOARDS.map((b) => (<option key={b} value={b}>{b}</option>))}
                </select>
              </div>

              {/* Class Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Class</label>
                <select value={selectedClassId} onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedGroupId('all');
            }} className="w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer">
                  <option value="all">All Classes</option>
                  {classes.map((c) => (<option key={c.id} value={String(c.id)}>
                      {c.name} {c.group_required ? '★' : ''}
                    </option>))}
                </select>
              </div>

              {/* Group / Stream Selector (Dynamic) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Group / Stream {currentSelectedClass?.group_required && <span className="text-purple-600 font-bold">(Req)</span>}
                </label>
                <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)} className={`w-full font-semibold rounded-lg border px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer ${currentSelectedClass?.group_required ? 'border-purple-300 text-purple-950 bg-purple-50/40' : 'border-slate-200'}`}>
                  <option value="all">All Streams / Common</option>
                  <option value="none">Common Curriculum Only</option>
                  {classSpecificGroups.map((g) => (<option key={g.id} value={String(g.id)}>
                      {g.name} ({g.code})
                    </option>))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer">
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                </select>
              </div>

              {/* Requirement Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Requirement</label>
                <select value={selectedRequirement} onChange={(e) => setSelectedRequirement(e.target.value)} className="w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer">
                  <option value="all">All Requirements</option>
                  <option value="Compulsory">Compulsory</option>
                  <option value="Elective">Elective</option>
                  <option value="Optional">Optional</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="relative pt-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by subject name or subject code across this scope..." className="w-full pl-8 pr-3 py-2 text-xs font-medium rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"/>
            </div>
          </div>

          {/* MAIN CLASS-WISE SUBJECTS TABLE */}
          {isLoading ? (<div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto mb-3"/>
              <p className="text-sm font-bold text-slate-700">Loading class-wise subjects...</p>
            </div>) : filteredClassSubjects.length === 0 ? (<div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <BookOpen className="w-7 h-7"/>
              </div>
              <h3 className="text-base font-bold text-slate-900">No subjects configured</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6 font-medium">
                No subjects matched the selected Board, Class, or Stream filter. Create your first subject or copy curriculum from another class.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button type="button" onClick={() => setIsCopyModalOpen(true)} disabled={isReadOnly} className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  <Copy className="w-4 h-4"/>
                  <span>Copy From Class</span>
                </button>
                <button type="button" onClick={handleOpenCreate} disabled={isReadOnly} className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer">
                  <Plus className="w-4 h-4"/>
                  <span>Create Subject</span>
                </button>
              </div>
            </div>) : (<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Class & Stream</th>
                      <th className="py-3 px-4">Category / Type</th>
                      <th className="py-3 px-4">Requirement</th>
                      <th className="py-3 px-4 text-center">Periods / Wk</th>
                      <th className="py-3 px-4">Applicability Badges</th>
                      <th className="py-3 px-4 text-center">Assessment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredClassSubjects.map((sub) => {
                    const isActive = sub.status === 'Active';
                    return (<tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Subject Name & Code */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900">{sub.subject_name}</span>
                              {Boolean(sub.is_language) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  {sub.language_name || 'Lang'}
                                </span>)}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                              {sub.subject_code} {sub.short_name ? `• ${sub.short_name}` : ''}
                            </div>
                          </td>

                          {/* Class & Stream Scope */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-slate-900 flex items-center space-x-1">
                                <span>{sub.class_name}</span>
                                <span className="text-[10px] text-slate-400">({sub.board})</span>
                              </span>
                              {sub.group_name ? (<span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                  {sub.group_name}
                                </span>) : (<span className="text-[11px] text-slate-400 italic">
                                  Common Curriculum
                                </span>)}
                            </div>
                          </td>

                          {/* Category / Type */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{sub.category_name}</div>
                            <div className="text-[11px] text-slate-500">{sub.subject_type}</div>
                          </td>

                          {/* Requirement */}
                          <td className="py-3 px-4">
                            {sub.requirement === 'Compulsory' ? (<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Compulsory
                              </span>) : sub.requirement === 'Elective' ? (<div className="flex flex-col">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 w-fit">
                                  Elective
                                </span>
                                {sub.elective_group_name && (<span className="text-[10px] text-slate-500 mt-0.5">
                                    {sub.elective_group_name}
                                  </span>)}
                              </div>) : (<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                Optional
                              </span>)}
                          </td>

                          {/* Periods */}
                          <td className="py-3 px-4 text-center">
                            <div className="font-bold text-slate-900">{sub.weekly_periods} Periods</div>
                            <div className="text-[10px] text-slate-500">
                              {sub.theory_periods} Th {Boolean(sub.practical_applicable) ? `+ ${sub.practical_periods} Lab` : ''}
                            </div>
                          </td>

                          {/* Applicability Badges (8 downstream rules) */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap items-center gap-1 max-w-xs">
                              {Boolean(sub.exam_applicable) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200" title="Exam Applicable">
                                  Exam
                                </span>)}
                              {Boolean(sub.timetable_applicable) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200" title="Timetable Scheduled">
                                  Timetable
                                </span>)}
                              {Boolean(sub.attendance_applicable) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Subject Attendance">
                                  Attnd
                                </span>)}
                              {Boolean(sub.gradebook_applicable) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="Grade Book Entry">
                                  Marks
                                </span>)}
                              {Boolean(sub.reportcard_applicable) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200" title="Report Card Printed">
                                  Report
                                </span>)}
                              {Boolean(sub.homework_applicable) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700" title="Homework Applicable">
                                  HW
                                </span>)}
                              {Boolean(sub.promotion_applicable) && (<span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200" title="Promotion Applicable">
                                  Promote
                                </span>)}
                            </div>
                          </td>

                          {/* Assessment */}
                          <td className="py-3 px-4 text-center">
                            <div className="font-semibold text-slate-900">
                              {sub.pass_marks} / {sub.max_marks}
                            </div>
                            <div className="text-[10px] text-slate-500">{sub.credits} Credits</div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <button type="button" onClick={() => handleToggleStatus(sub)} disabled={isReadOnly} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}>
                              {isActive ? (<CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/>) : (<XCircle className="w-3 h-3 mr-1 text-slate-400"/>)}
                              {sub.status}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button type="button" onClick={() => handleOpenView(sub)} className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer" title="View Configuration">
                                <Eye className="w-3.5 h-3.5"/>
                              </button>
                              <button type="button" onClick={() => handleOpenEdit(sub)} disabled={isReadOnly} className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer" title="Edit Subject Configuration">
                                <Edit2 className="w-3.5 h-3.5"/>
                              </button>
                              <button type="button" onClick={() => setDeletingSubject(sub)} disabled={isReadOnly} className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Deactivate / Delete">
                                <Trash2 className="w-3.5 h-3.5"/>
                              </button>
                            </div>
                          </td>
                        </tr>);
                })}
                  </tbody>
                </table>
              </div>
            </div>)}
        </div>)}

      {/* 4. MODALS */}
      {/* Create / Edit Modal */}
      <ClassSubjectFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSubmit={handleFormSubmit} initialData={editingSubject} classes={classes} academicGroups={academicGroups} categories={categories} branchId={selectedBranch ? selectedBranch.id : 1} academicYearId={selectedAcademicYear ? selectedAcademicYear.id : 1} defaultBoard={selectedBoard !== 'All Boards' ? selectedBoard : 'CBSE'} defaultClassId={selectedClassId !== 'all' ? Number(selectedClassId) : null} defaultGroupId={selectedGroupId !== 'all' && selectedGroupId !== 'none' ? Number(selectedGroupId) : null}/>

      {/* View Modal */}
      <ClassSubjectViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} subject={viewingSubject} branchName={selectedBranch?.branch_name} academicYearName={selectedAcademicYear?.name}/>

      {/* Copy Subjects Modal */}
      <CopySubjectModal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} onSuccess={(msg) => {
            showToast(msg, 'success');
            fetchData();
        }} classes={classes} academicGroups={academicGroups} branchId={selectedBranch ? selectedBranch.id : 1} academicYearId={selectedAcademicYear ? selectedAcademicYear.id : 1} defaultSourceClassId={selectedClassId !== 'all' ? Number(selectedClassId) : undefined} defaultSourceGroupId={selectedGroupId !== 'all' && selectedGroupId !== 'none' ? Number(selectedGroupId) : undefined}/>

      {/* Safe Deactivate / Delete Confirmation Dialog */}
      {deletingSubject && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6"/>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Subject Lifecycle Safeguard
              </h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to deactivate or remove <strong>{deletingSubject.subject_name}</strong> ({deletingSubject.subject_code}) for <strong>{deletingSubject.class_name}</strong>?
              </p>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center space-x-1">
                  <span>Academic Audit Safeguard:</span>
                </div>
                <div>
                  To protect past grade books, report cards, timetables, and student attendance logs, subjects that have historical academic records cannot be physically purged.
                </div>
                <div className="pt-1 font-semibold text-amber-800">
                  Recommended Action: Set as <strong>Inactive</strong> to hide from future period planning and marks entry while preserving past reports.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button type="button" onClick={() => setDeletingSubject(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-200 rounded-xl">
                Cancel
              </button>
              <button type="button" onClick={async () => {
                await handleToggleStatus(deletingSubject);
                setDeletingSubject(null);
            }} className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl">
                Set as Inactive
              </button>
              <button type="button" onClick={handleDeleteSubject} disabled={isDeleting} className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
