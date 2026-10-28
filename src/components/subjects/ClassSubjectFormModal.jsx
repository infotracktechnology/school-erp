import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle, Save, GraduationCap, Sparkles, Sliders, FileText, Clock, Award, ChevronDown, ChevronUp, Zap, Check } from 'lucide-react';
import { getMasterSubjectsList } from '../../services/api';
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'Cambridge', 'IB', 'Matriculation'];
// 4 Simple Main Subject Categories
const MAIN_CATEGORIES = [
    'Language Subject',
    'Core Subject',
    'Religious Subject',
    'Other Subject'
];
const SUBJECT_TYPES = [
    'Academic',
    'Non-Academic',
    'Vocational',
    'Co-Curricular',
    'Language',
    'Value Education'
];
// Simplified Requirement: Common (Compulsory) or Optional (Elective)
const REQUIREMENTS = ['Common (Compulsory)', 'Optional (Elective)'];
const LANGUAGE_LEVELS = ['1st Language', '2nd Language', '3rd Language', 'Optional Language'];

// Quick 1-Click Standard Subject Presets
const QUICK_PRESETS = [
    { name: 'English', code: 'ENG', category: 'Language Subject', isLang: true, langName: 'English', langLvl: '1st Language', req: 'Common (Compulsory)' },
    { name: 'Tamil', code: 'TAM', category: 'Language Subject', isLang: true, langName: 'Tamil', langLvl: '2nd Language', req: 'Common (Compulsory)' },
    { name: 'Hindi', code: 'HIN', category: 'Language Subject', isLang: true, langName: 'Hindi', langLvl: '3rd Language', req: 'Optional (Elective)' },
    { name: 'Mathematics', code: 'MATH', category: 'Core Subject', isLang: false, req: 'Common (Compulsory)' },
    { name: 'General Science', code: 'SCI', category: 'Core Subject', isLang: false, req: 'Common (Compulsory)', practical: true },
    { name: 'Social Science', code: 'SOC', category: 'Core Subject', isLang: false, req: 'Common (Compulsory)' },
    { name: 'Moral Science / Value Ed.', code: 'REL', category: 'Religious Subject', isLang: false, req: 'Common (Compulsory)' },
    { name: 'Computer Science', code: 'CS', category: 'Other Subject', isLang: false, req: 'Optional (Elective)', practical: true },
    { name: 'Physical Education', code: 'PET', category: 'Other Subject', isLang: false, req: 'Common (Compulsory)', subType: 'Non-Academic', maxMarks: 50 }
];

export const ClassSubjectFormModal = ({ isOpen, onClose, onSubmit, initialData, classes, academicGroups, categories, branchId, academicYearId, defaultBoard = 'CBSE', defaultClassId, defaultGroupId }) => {
    const isEdit = Boolean(initialData);
    // UI Mode: simple (default) or advanced
    const [showAdvanced, setShowAdvanced] = useState(false);
    // Hierarchy
    const [board, setBoard] = useState(defaultBoard);
    const [classId, setClassId] = useState(defaultClassId || '');
    const [groupId, setGroupId] = useState(defaultGroupId || '');
    // Master quick-suggest
    const [masterSearch, setMasterSearch] = useState('');
    const [masterSuggestions, setMasterSuggestions] = useState([]);
    // Subject Identifiers
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [shortName, setShortName] = useState('');
    const [categoryName, setCategoryName] = useState('General');
    const [subjectType, setSubjectType] = useState('Academic');
    // Language Config
    const [isLanguage, setIsLanguage] = useState(false);
    const [languageName, setLanguageName] = useState('');
    const [languageLevel, setLanguageLevel] = useState('First Language');
    // Requirement & Elective
    const [requirement, setRequirement] = useState('Compulsory');
    const [electiveGroupName, setElectiveGroupName] = useState('');
    const [electiveMinCount, setElectiveMinCount] = useState(1);
    const [electiveMaxCount, setElectiveMaxCount] = useState(1);
    // Periods & Practicals
    const [practicalApplicable, setPracticalApplicable] = useState(false);
    const [theoryPeriods, setTheoryPeriods] = useState(5);
    const [practicalPeriods, setPracticalPeriods] = useState(0);
    const [weeklyPeriods, setWeeklyPeriods] = useState(5);
    // Academic Applicability Flags (8 rules)
    const [examApplicable, setExamApplicable] = useState(true);
    const [gradebookApplicable, setGradebookApplicable] = useState(true);
    const [reportcardApplicable, setReportcardApplicable] = useState(true);
    const [attendanceApplicable, setAttendanceApplicable] = useState(true);
    const [homeworkApplicable, setHomeworkApplicable] = useState(true);
    const [assignmentApplicable, setAssignmentApplicable] = useState(true);
    const [timetableApplicable, setTimetableApplicable] = useState(true);
    const [promotionApplicable, setPromotionApplicable] = useState(true);
    // Assessment & Grading
    const [passMarks, setPassMarks] = useState(35);
    const [maxMarks, setMaxMarks] = useState(100);
    const [credits, setCredits] = useState(4);
    const [displayOrder, setDisplayOrder] = useState(1);
    const [status, setStatus] = useState('Active');
    const [description, setDescription] = useState('');
    // Form State
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Selected Class details
    const selectedClass = classes.find((c) => c.id === Number(classId));
    const isGroupRequired = Boolean(selectedClass?.group_required);
    // Filter groups applicable to this class (or generic groups)
    const applicableGroups = academicGroups.filter((g) => {
        if (!classId)
            return true;
        return !g.class_id || g.class_id === Number(classId);
    });
    // Sync state on initialData or open
    useEffect(() => {
        if (!isOpen)
            return;
        if (initialData) {
            setBoard(initialData.board || defaultBoard);
            setClassId(initialData.class_id || '');
            setGroupId(initialData.group_id || '');
            setSubjectName(initialData.subject_name || '');
            setSubjectCode(initialData.subject_code || '');
            setShortName(initialData.short_name || '');
            setCategoryName(initialData.category_name || 'General');
            setSubjectType(initialData.subject_type || 'Academic');
            setIsLanguage(Boolean(initialData.is_language));
            setLanguageName(initialData.language_name || '');
            setLanguageLevel(initialData.language_level || 'First Language');
            setRequirement(initialData.requirement || 'Compulsory');
            setElectiveGroupName(initialData.elective_group_name || '');
            setElectiveMinCount(initialData.elective_min_count ?? 1);
            setElectiveMaxCount(initialData.elective_max_count ?? 1);
            setPracticalApplicable(Boolean(initialData.practical_applicable));
            setTheoryPeriods(initialData.theory_periods ?? 5);
            setPracticalPeriods(initialData.practical_periods ?? 0);
            setWeeklyPeriods(initialData.weekly_periods ?? 5);
            setExamApplicable(Boolean(initialData.exam_applicable));
            setGradebookApplicable(Boolean(initialData.gradebook_applicable));
            setReportcardApplicable(Boolean(initialData.reportcard_applicable));
            setAttendanceApplicable(Boolean(initialData.attendance_applicable));
            setHomeworkApplicable(Boolean(initialData.homework_applicable));
            setAssignmentApplicable(Boolean(initialData.assignment_applicable));
            setTimetableApplicable(Boolean(initialData.timetable_applicable));
            setPromotionApplicable(Boolean(initialData.promotion_applicable));
            setPassMarks(initialData.pass_marks ?? 35);
            setMaxMarks(initialData.max_marks ?? 100);
            setCredits(initialData.credits ?? 4);
            setDisplayOrder(initialData.display_order ?? 1);
            setStatus(initialData.status || 'Active');
            setDescription(initialData.description || '');
        }
        else {
            setBoard(defaultBoard);
            setClassId(defaultClassId || (classes[0]?.id ?? ''));
            setGroupId(defaultGroupId || '');
            setSubjectName('');
            setSubjectCode('');
            setShortName('');
            setCategoryName(categories[0]?.name || 'General');
            setSubjectType('Academic');
            setIsLanguage(false);
            setLanguageName('');
            setLanguageLevel('First Language');
            setRequirement('Compulsory');
            setElectiveGroupName('');
            setElectiveMinCount(1);
            setElectiveMaxCount(1);
            setPracticalApplicable(false);
            setTheoryPeriods(5);
            setPracticalPeriods(0);
            setWeeklyPeriods(5);
            setExamApplicable(true);
            setGradebookApplicable(true);
            setReportcardApplicable(true);
            setAttendanceApplicable(true);
            setHomeworkApplicable(true);
            setAssignmentApplicable(true);
            setTimetableApplicable(true);
            setPromotionApplicable(true);
            setPassMarks(35);
            setMaxMarks(100);
            setCredits(4);
            setDisplayOrder(1);
            setStatus('Active');
            setDescription('');
        }
        setErrors({});
    }, [isOpen, initialData, defaultBoard, defaultClassId, defaultGroupId, classes, categories]);
    // Keep weekly periods in sync
    useEffect(() => {
        setWeeklyPeriods(Number(theoryPeriods || 0) + Number(practicalPeriods || 0));
    }, [theoryPeriods, practicalPeriods]);
    // Master quick-suggest search
    useEffect(() => {
        if (!masterSearch.trim()) {
            setMasterSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const list = await getMasterSubjectsList(masterSearch.trim());
                setMasterSuggestions(list.slice(0, 5));
            }
            catch (err) {
                setMasterSuggestions([]);
            }
        }, 250);
        return () => clearTimeout(timer);
    }, [masterSearch]);
    const selectMasterSubject = (item) => {
        setSubjectName(item.name);
        setSubjectCode(item.code);
        if (item.short_name)
            setShortName(item.short_name);
        if (item.subject_type)
            setSubjectType(item.subject_type);
        if (item.pass_marks)
            setPassMarks(item.pass_marks);
        if (item.max_marks)
            setMaxMarks(item.max_marks);
        if (item.credits)
            setCredits(item.credits);
        const lower = item.name.toLowerCase();
        if (lower.includes('english') || lower.includes('tamil') || lower.includes('hindi') || lower.includes('french')) {
            setIsLanguage(true);
            setLanguageName(item.name.replace(/core|elective/gi, '').trim());
            setCategoryName('Languages');
        }
        else if (lower.includes('physics') || lower.includes('chemistry') || lower.includes('biology') || lower.includes('science')) {
            setCategoryName('Science');
            setPracticalApplicable(true);
            setPracticalPeriods(2);
            setTheoryPeriods(4);
        }
        else if (lower.includes('math')) {
            setCategoryName('Mathematics');
        }
        else if (lower.includes('commerce') || lower.includes('accountancy') || lower.includes('economics')) {
            setCategoryName('Commerce');
        }
        setMasterSearch('');
        setMasterSuggestions([]);
    };

    const applyQuickPreset = (preset) => {
        setSubjectName(preset.name);
        setShortName(preset.code);
        // Generate a clean subject code based on class name or standard code
        const classNum = selectedClass?.name?.replace(/[^0-9]/g, '') || '';
        const generatedCode = classNum ? `${preset.code}-${classNum}` : `${preset.code}101`;
        setSubjectCode(generatedCode);
        setCategoryName(preset.category);
        setSubjectType(preset.subType || 'Academic');
        setIsLanguage(Boolean(preset.isLang));
        setLanguageName(preset.langName || '');
        setLanguageLevel(preset.langLvl || 'First Language');
        setRequirement(preset.req || 'Compulsory');
        setPracticalApplicable(Boolean(preset.practical));
        if (preset.practical) {
            setTheoryPeriods(4);
            setPracticalPeriods(2);
            setWeeklyPeriods(6);
        } else {
            setTheoryPeriods(5);
            setPracticalPeriods(0);
            setWeeklyPeriods(5);
        }
        setMaxMarks(preset.maxMarks || 100);
        setPassMarks(preset.maxMarks ? Math.round(preset.maxMarks * 0.35) : 35);
        setErrors({});
    };

    if (!isOpen)
        return null;
    const validate = () => {
        const errs = {};
        if (!board)
            errs.board = 'Board selection is required';
        if (!classId)
            errs.class_id = 'Class selection is required';
        if (isGroupRequired && !groupId) {
            errs.group_id = `Group / Stream is mandatory for ${selectedClass?.name || 'this class'}.`;
        }
        if (!subjectName.trim())
            errs.subject_name = 'Subject Name is required';
        if (!subjectCode.trim())
            errs.subject_code = 'Subject Code is required (e.g. ENG-G11)';
        if (isLanguage && !languageName.trim()) {
            errs.language_name = 'Please provide the language name';
        }
        if (Number(passMarks) > Number(maxMarks)) {
            errs.pass_marks = 'Pass marks cannot exceed maximum marks';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                branch_id: branchId,
                academic_year_id: academicYearId,
                board,
                class_id: Number(classId),
                group_id: groupId ? Number(groupId) : null,
                subject_name: subjectName.trim(),
                subject_code: subjectCode.trim().toUpperCase(),
                short_name: shortName.trim(),
                category_name: categoryName || 'General',
                subject_type: subjectType,
                is_language: isLanguage,
                language_name: isLanguage ? languageName.trim() : undefined,
                language_level: isLanguage ? languageLevel : undefined,
                requirement: requirement.includes('Optional') ? 'Optional' : 'Compulsory',
                elective_group_name: requirement.includes('Optional') ? (electiveGroupName.trim() || 'Optional Elective') : undefined,
                elective_min_count: requirement.includes('Optional') ? Number(electiveMinCount) : 1,
                elective_max_count: requirement.includes('Optional') ? Number(electiveMaxCount) : 1,
                practical_applicable: practicalApplicable,
                weekly_periods: Number(weeklyPeriods),
                theory_periods: Number(theoryPeriods),
                practical_periods: Number(practicalPeriods),
                exam_applicable: examApplicable,
                gradebook_applicable: gradebookApplicable,
                reportcard_applicable: reportcardApplicable,
                attendance_applicable: attendanceApplicable,
                homework_applicable: homeworkApplicable,
                assignment_applicable: assignmentApplicable,
                timetable_applicable: timetableApplicable,
                promotion_applicable: promotionApplicable,
                pass_marks: Number(passMarks),
                max_marks: Number(maxMarks),
                credits: Number(credits),
                display_order: Number(displayOrder),
                status,
                description: description.trim() || undefined
            });
            onClose();
        }
        catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
            else {
                setErrors({ general: err.message || 'Failed to save subject configuration' });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? 'Edit Subject Configuration' : 'Create Class-Wise Subject'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {board} • Class-specific curriculum & evaluation rules
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Error Banner */}
          {errors.general && (<div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
              <span>{errors.general}</span>
            </div>)}

          {/* SECTION 1: HIERARCHY SELECTOR (Board -> Class -> Group) */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-emerald-700"/>
                <span>1. Core Academic Hierarchy</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                Board → Class → Group
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Board */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Board <span className="text-red-500">*</span>
                </label>
                <select value={board} onChange={(e) => setBoard(e.target.value)} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer">
                  {BOARDS.map((b) => (<option key={b} value={b}>{b}</option>))}
                </select>
                {errors.board && <p className="text-[11px] text-red-600 mt-1">{errors.board}</p>}
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select value={classId} onChange={(e) => {
            const cid = e.target.value ? Number(e.target.value) : '';
            setClassId(cid);
            // Reset group if class changes
            setGroupId('');
        }} className={`w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer ${errors.class_id ? 'border-red-400 bg-red-50/30' : 'border-slate-300'}`}>
                  <option value="">Select Class...</option>
                  {classes.map((c) => (<option key={c.id} value={c.id}>
                      {c.name} {c.group_required ? ' (Stream Req.)' : ''}
                    </option>))}
                </select>
                {errors.class_id && <p className="text-[11px] text-red-600 mt-1">{errors.class_id}</p>}
              </div>

              {/* Group / Stream */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Group / Stream {isGroupRequired ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
                  </label>
                  {isGroupRequired && (<span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                      Mandatory
                    </span>)}
                </div>
                <select value={groupId} onChange={(e) => setGroupId(e.target.value ? Number(e.target.value) : '')} disabled={!classId} className={`w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer ${errors.group_id ? 'border-red-400 bg-red-50/30' : 'border-slate-300'} ${!classId ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <option value="">{isGroupRequired ? 'Select Mandatory Stream...' : 'None / Common to all streams'}</option>
                  {applicableGroups.map((g) => (<option key={g.id} value={g.id}>
                      {g.name} ({g.code})
                    </option>))}
                </select>
                {errors.group_id && <p className="text-[11px] text-red-600 mt-1">{errors.group_id}</p>}
              </div>
            </div>

            {isGroupRequired && (<p className="text-[11px] text-purple-800 bg-purple-50 p-2 rounded-lg border border-purple-200">
                Notice: <strong>{selectedClass?.name}</strong> is a higher secondary or stream-specialized class. Subjects must be mapped specifically to a Group/Stream (e.g. Science, Commerce, Arts).
              </p>)}
          </div>

          {/* QUICK 1-CLICK SUBJECT PRESET SELECTOR */}
          {!isEdit && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500"/>
                  <span>Quick 1-Click Common Subjects:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Click any subject to auto-fill</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PRESETS.map((p) => {
                  const isCurrent = subjectName.toLowerCase() === p.name.toLowerCase();
                  return (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => applyQuickPreset(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isCurrent
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white hover:bg-emerald-100 text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <span>{p.name}</span>
                      {p.isLang && <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${isCurrent ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>Lang</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: SUBJECT DETAILS & CLASSIFICATION */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Subject Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => {
                    setSubjectName(e.target.value);
                    if (!shortName) {
                      const clean = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
                      setShortName(clean);
                    }
                  }}
                  placeholder="e.g. Mathematics, Tamil, English, Science"
                  className={`w-full text-xs font-semibold rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                    errors.subject_name ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.subject_name && <p className="text-[11px] text-red-600 mt-1">{errors.subject_name}</p>}
              </div>

              {/* Subject Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MATH-10, TAM101"
                  className={`w-full text-xs font-mono font-bold uppercase rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                    errors.subject_code ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.subject_code && <p className="text-[11px] text-red-600 mt-1">{errors.subject_code}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    if (e.target.value === 'Language Subject') {
                      setIsLanguage(true);
                      if (!languageName) setLanguageName(subjectName || 'English');
                    }
                  }}
                  className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer"
                >
                  {MAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {categories
                    .filter((c) => !MAIN_CATEGORIES.includes(c.name))
                    .map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
              </div>

              {/* Requirement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requirement
                </label>
                <select
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer"
                >
                  {REQUIREMENTS.map((req) => (
                    <option key={req} value={req}>{req}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Language Configuration Strip */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLanguage}
                    onChange={(e) => {
                      setIsLanguage(e.target.checked);
                      if (e.target.checked && !languageName) {
                        setLanguageName(subjectName || 'English');
                      }
                    }}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-800">Is this a Language Subject? (e.g. Tamil, English, Hindi)</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Auto-tracks language proficiency</span>
              </div>

              {isLanguage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Language Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={languageName}
                      onChange={(e) => setLanguageName(e.target.value)}
                      placeholder="e.g. English, Tamil, Hindi, French"
                      className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    />
                    {errors.language_name && <p className="text-[11px] text-red-600 mt-1">{errors.language_name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Language Level
                    </label>
                    <select
                      value={languageLevel}
                      onChange={(e) => setLanguageLevel(e.target.value)}
                      className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-1.5 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer"
                    >
                      {LANGUAGE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Elective Config (if selected) */}
            {requirement === 'Elective' && (
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                <label className="block text-xs font-bold text-purple-900">
                  Elective Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={electiveGroupName}
                  onChange={(e) => setElectiveGroupName(e.target.value)}
                  placeholder="e.g. Second Language, Skill Elective"
                  className="w-full text-xs font-semibold rounded-lg border border-purple-300 px-3 py-1.5 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700"
                />
                {errors.elective_group_name && <p className="text-[11px] text-red-600 mt-1">{errors.elective_group_name}</p>}
              </div>
            )}
          </div>

          {/* COLLAPSIBLE ADVANCED SETTINGS (Periods, Marks, 8 Evaluation Rules) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-slate-500"/>
                <span className="text-xs font-bold text-slate-700">
                  Advanced Settings (Periods, Pass Marks, Evaluation Rules)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  - Optional (Defaults already configured)
                </span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold">
                <span>{showAdvanced ? 'Hide' : 'Customize'}</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
              </div>
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-5 bg-white border-t border-slate-200">
                {/* Periods & Practicals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Periods & Practicals:</span>
                    <label className="inline-flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={practicalApplicable}
                        onChange={(e) => setPracticalApplicable(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>Has Lab / Practical</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Theory Periods/Wk</label>
                      <input
                        type="number"
                        min="0"
                        value={theoryPeriods}
                        onChange={(e) => setTheoryPeriods(Number(e.target.value) || 0)}
                        className="w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Practical Periods/Wk</label>
                      <input
                        type="number"
                        min="0"
                        value={practicalPeriods}
                        onChange={(e) => setPracticalPeriods(Number(e.target.value) || 0)}
                        className="w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Total Weekly</label>
                      <div className="w-full text-xs font-bold text-slate-800 rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-100">
                        {weeklyPeriods} Periods
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marks & Credits */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">Grading & Credits:</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Max Marks</label>
                      <input
                        type="number"
                        min="1"
                        value={maxMarks}
                        onChange={(e) => setMaxMarks(Number(e.target.value))}
                        className="w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pass Marks</label>
                      <input
                        type="number"
                        min="0"
                        value={passMarks}
                        onChange={(e) => setPassMarks(Number(e.target.value))}
                        className="w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Credits</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={credits}
                        onChange={(e) => setCredits(Number(e.target.value))}
                        className="w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Downstream Evaluation Rules */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">Participation Flags:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'exam', label: 'Exam', val: examApplicable, set: setExamApplicable },
                      { id: 'gradebook', label: 'Gradebook', val: gradebookApplicable, set: setGradebookApplicable },
                      { id: 'reportcard', label: 'Report Card', val: reportcardApplicable, set: setReportcardApplicable },
                      { id: 'attendance', label: 'Attendance', val: attendanceApplicable, set: setAttendanceApplicable },
                      { id: 'homework', label: 'Homework', val: homeworkApplicable, set: setHomeworkApplicable },
                      { id: 'assignment', label: 'Assignment', val: assignmentApplicable, set: setAssignmentApplicable },
                      { id: 'timetable', label: 'Timetable', val: timetableApplicable, set: setTimetableApplicable },
                      { id: 'promotion', label: 'Promotion', val: promotionApplicable, set: setPromotionApplicable },
                    ].map((flag) => (
                      <label
                        key={flag.id}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer select-none ${
                          flag.val ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <span>{flag.label}</span>
                        <input
                          type="checkbox"
                          checked={flag.val}
                          onChange={(e) => flag.set(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-emerald-700"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Notes / Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Reference notes, textbooks..."
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0">
          <div className="text-xs text-slate-500">
            {isEdit ? 'Changes will reflect across downstream modules.' : 'Configured strictly for this class & stream scope.'}
          </div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5">
              <Save className="w-4 h-4"/>
              <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Subject' : 'Create Subject'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>);
};
