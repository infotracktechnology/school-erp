import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Check, Save, RefreshCw, Users, AlertCircle, Sparkles, Filter, CheckSquare, Square, Layers, Languages, HelpCircle } from 'lucide-react';
import { getClasses, getSectionsByClass, getSectionSubjectMapping, bulkAssignSectionSubjects } from '../../services/api';
import { useErp } from '../../context/ErpContext';

export const SubjectMappingView = ({ branchId, academicYearId }) => {
    const { showToast, isReadOnly } = useErp();

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('all');

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Data from backend
    const [classSubjects, setClassSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // Local assignment state: { [studentId]: Set<subject_code> }
    const [studentSelectionMap, setStudentSelectionMap] = useState({});

    // 1. Load Classes when branch or academic year changes
    useEffect(() => {
        if (!branchId || !academicYearId) return;
        getClasses(branchId, academicYearId, { status: 'Active' })
            .then(res => {
                const list = res?.data || (Array.isArray(res) ? res : []);
                setClasses(list);
                if (list.length > 0 && !selectedClassId) {
                    setSelectedClassId(String(list[0].id));
                }
            })
            .catch(err => {
                console.error('Failed to load classes:', err);
                setClasses([]);
            });
    }, [branchId, academicYearId]);

    // 2. Load Sections when Class changes
    useEffect(() => {
        if (!branchId || !academicYearId || !selectedClassId) {
            setSections([]);
            setSelectedSectionId('all');
            return;
        }
        getSectionsByClass(Number(selectedClassId), branchId, academicYearId)
            .then(res => {
                setSections(res || []);
                setSelectedSectionId('all');
            })
            .catch(err => {
                console.error('Failed to load sections:', err);
                setSections([]);
            });
    }, [selectedClassId, branchId, academicYearId]);

    // 3. Load Mapping Matrix
    const loadMapping = async () => {
        if (!branchId || !academicYearId || !selectedClassId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await getSectionSubjectMapping({
                branch_id: branchId,
                academic_year_id: academicYearId,
                class_id: selectedClassId,
                section_id: selectedSectionId
            });

            setClassSubjects(data?.subjects || []);
            setStudents(data?.students || []);

            // Initialize local selections
            const initMap = {};
            (data?.students || []).forEach(stu => {
                initMap[stu.id] = new Set(stu.enrolled_subject_codes || []);
            });
            setStudentSelectionMap(initMap);
        } catch (err) {
            console.error('Failed to fetch mapping:', err);
            setError(err.message || 'Failed to load subject mapping matrix');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMapping();
    }, [selectedClassId, selectedSectionId, branchId, academicYearId]);

    // Toggle individual checkbox with strict conflict locking
    const handleToggle = (studentId, subjectCode) => {
        if (isReadOnly) return;
        const targetSub = classSubjects.find(s => s.subject_code === subjectCode);
        const currentSet = new Set(studentSelectionMap[studentId] || []);
        const isCurrentlySelected = currentSet.has(subjectCode);

        // If user is selecting a language:
        // Rule A: Check if student already has another language at the SAME level (e.g. Trying to select Tamil 2nd Lang while already having Hindi 2nd Lang)
        // In that case, BLOCK it and tell user to untick the currently enrolled 2nd language first (as requested).
        if (!isCurrentlySelected && targetSub?.is_language && targetSub?.language_level) {
            const sameLevelOther = classSubjects.find(s => 
                s.is_language && 
                s.language_level === targetSub.language_level && 
                s.subject_code !== subjectCode && 
                currentSet.has(s.subject_code)
            );

            if (sameLevelOther) {
                showToast(
                    `Cannot select ${targetSub.subject_name}. Student already has ${sameLevelOther.subject_name}. Please untick ${sameLevelOther.subject_name} first!`,
                    'warning'
                );
                return;
            }
        }

        // Toggle state and handle complementary language adjustments cleanly
        setStudentSelectionMap(prev => {
            const updated = new Set(prev[studentId] || []);
            if (isCurrentlySelected) {
                updated.delete(subjectCode);
            } else {
                updated.add(subjectCode);

                // If adding Tamil (2nd Lang), ensure Tamil (3rd Lang) is removed, and Hindi (3rd Lang) is assigned!
                // If adding Hindi (2nd Lang), ensure Hindi (3rd Lang) is removed, and Tamil (3rd Lang) is assigned!
                if (targetSub?.is_language && targetSub?.language_level === 'Second Language') {
                    const isTamil = targetSub.subject_name.includes('Tamil') || targetSub.language_name === 'Tamil';
                    const isHindi = targetSub.subject_name.includes('Hindi') || targetSub.language_name === 'Hindi';

                    if (isTamil) {
                        // Remove Tamil 3rd Lang if present
                        const tam3 = classSubjects.find(s => s.language_level === 'Third Language' && (s.subject_name.includes('Tamil') || s.language_name === 'Tamil'));
                        if (tam3) updated.delete(tam3.subject_code);
                        // Add Hindi 3rd Lang
                        const hin3 = classSubjects.find(s => s.language_level === 'Third Language' && (s.subject_name.includes('Hindi') || s.language_name === 'Hindi'));
                        if (hin3) updated.add(hin3.subject_code);
                    } else if (isHindi) {
                        // Remove Hindi 3rd Lang if present
                        const hin3 = classSubjects.find(s => s.language_level === 'Third Language' && (s.subject_name.includes('Hindi') || s.language_name === 'Hindi'));
                        if (hin3) updated.delete(hin3.subject_code);
                        // Add Tamil 3rd Lang
                        const tam3 = classSubjects.find(s => s.language_level === 'Third Language' && (s.subject_name.includes('Tamil') || s.language_name === 'Tamil'));
                        if (tam3) updated.add(tam3.subject_code);
                    }
                }

                // If adding 3rd Language directly:
                if (targetSub?.is_language && targetSub?.language_level === 'Third Language') {
                    const isTamil = targetSub.subject_name.includes('Tamil') || targetSub.language_name === 'Tamil';
                    const isHindi = targetSub.subject_name.includes('Hindi') || targetSub.language_name === 'Hindi';

                    if (isTamil) {
                        // Remove Tamil 2nd Lang if present
                        const tam2 = classSubjects.find(s => s.language_level === 'Second Language' && (s.subject_name.includes('Tamil') || s.language_name === 'Tamil'));
                        if (tam2) updated.delete(tam2.subject_code);
                    } else if (isHindi) {
                        // Remove Hindi 2nd Lang if present
                        const hin2 = classSubjects.find(s => s.language_level === 'Second Language' && (s.subject_name.includes('Hindi') || s.language_name === 'Hindi'));
                        if (hin2) updated.delete(hin2.subject_code);
                    }
                }
            }
            return { ...prev, [studentId]: updated };
        });
    };

    // Quick Language Presets: Assign Language combination to all students or filtered
    const handleApplyLanguagePreset = (secondLangName, thirdLangName) => {
        if (isReadOnly) return;
        const secondSub = classSubjects.find(s => s.language_level === 'Second Language' && s.subject_name.includes(secondLangName));
        const thirdSub = classSubjects.find(s => s.language_level === 'Third Language' && s.subject_name.includes(thirdLangName));

        if (!secondSub || !thirdSub) {
            showToast(`Could not find ${secondLangName} (2nd Lang) or ${thirdLangName} (3rd Lang) in this class`, 'error');
            return;
        }

        // Other language codes to clear out
        const allOtherLangs = classSubjects
            .filter(s => s.is_language && s.language_level && s.subject_code !== secondSub.subject_code && s.subject_code !== thirdSub.subject_code)
            .map(s => s.subject_code);

        setStudentSelectionMap(prev => {
            const updated = { ...prev };
            students.forEach(stu => {
                const current = new Set(updated[stu.id] || []);
                // Remove all other 2nd & 3rd languages
                allOtherLangs.forEach(c => current.delete(c));
                // Add selected combination
                current.add(secondSub.subject_code);
                current.add(thirdSub.subject_code);
                updated[stu.id] = current;
            });
            return updated;
        });

        showToast(`Assigned ${secondLangName} (2nd Lang) + ${thirdLangName} (3rd Lang) to all students`, 'success');
    };

    // Auto Assign All Compulsory Subjects to all students
    const handleAutoAssignCommon = () => {
        if (isReadOnly) return;
        const commonCodes = classSubjects
            .filter(s => s.requirement === 'Compulsory' || s.requirement === 'Common')
            .map(s => s.subject_code);

        setStudentSelectionMap(prev => {
            const updated = { ...prev };
            students.forEach(stu => {
                const current = new Set(updated[stu.id] || []);
                commonCodes.forEach(code => current.add(code));
                updated[stu.id] = current;
            });
            return updated;
        });
        showToast('Common/Compulsory subjects selected for all students', 'success');
    };

    // Bulk select an entire column (Subject) for all students
    const handleToggleColumn = (subjectCode) => {
        if (isReadOnly) return;
        const targetSub = classSubjects.find(s => s.subject_code === subjectCode);
        const allHaveIt = students.every(stu => studentSelectionMap[stu.id]?.has(subjectCode));

        setStudentSelectionMap(prev => {
            const updated = { ...prev };
            students.forEach(stu => {
                const current = new Set(updated[stu.id] || []);
                if (allHaveIt) {
                    current.delete(subjectCode);
                } else {
                    current.add(subjectCode);

                    // If turning ON a language column, clear conflicting languages for every student
                    if (targetSub?.is_language && targetSub?.language_level) {
                        const sameLevelOther = classSubjects.filter(s => s.is_language && s.language_level === targetSub.language_level && s.subject_code !== subjectCode);
                        sameLevelOther.forEach(o => current.delete(o.subject_code));

                        // Clear same language at different level
                        const langName = targetSub.language_name || (targetSub.subject_name.includes('Tamil') ? 'Tamil' : (targetSub.subject_name.includes('Hindi') ? 'Hindi' : ''));
                        if (langName) {
                            const sameLangOtherLevel = classSubjects.find(s => s.is_language && s.subject_code !== subjectCode && s.subject_name.includes(langName));
                            if (sameLangOtherLevel) current.delete(sameLangOtherLevel.subject_code);
                        }
                    }
                }
                updated[stu.id] = current;
            });
            return updated;
        });
    };

    // Save All Changes
    const handleSave = async () => {
        if (isReadOnly) return;
        setIsSaving(true);
        try {
            const assignments = students.map(stu => ({
                student_id: stu.id,
                subject_codes: Array.from(studentSelectionMap[stu.id] || [])
            }));

            await bulkAssignSectionSubjects({
                branch_id: branchId,
                academic_year_id: academicYearId,
                class_id: selectedClassId,
                assignments
            });

            showToast('Subject mapping saved and assigned to students successfully!', 'success');
            loadMapping();
        } catch (err) {
            console.error('Failed to save mapping:', err);
            showToast(err.message || 'Failed to save subject assignments', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // View Mode: 'matrix' or 'subject-wise'
    const [viewMode, setViewMode] = useState('matrix');
    // Category Filter for Matrix View: 'all', 'Common', 'Language', 'Optional', 'Core'
    const [activeFilter, setActiveFilter] = useState('all');
    // Selected subject when in 'subject-wise' mode
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');

    // Categorized helper functions
    const getSubjectCategoryBadge = (sub) => {
        const isLang = sub.is_language || sub.subject_type === 'Language' || sub.category_name === 'Language Subject';
        const isCommon = sub.requirement === 'Compulsory' || sub.requirement === 'Common';
        const isOptional = sub.requirement === 'Optional' || sub.requirement === 'Elective';

        if (isLang) {
            const langLevel = sub.language_level ? ` (${sub.language_level})` : '';
            return {
                label: `Language${langLevel}`,
                bg: 'bg-blue-100 text-blue-800 border-blue-200',
                dot: 'bg-blue-500'
            };
        }
        if (sub.category_name === 'Religious Subject' || sub.subject_type === 'Religious') {
            return {
                label: 'Religious',
                bg: 'bg-amber-100 text-amber-800 border-amber-200',
                dot: 'bg-amber-500'
            };
        }
        if (isOptional) {
            return {
                label: 'Optional / Elective',
                bg: 'bg-purple-100 text-purple-800 border-purple-200',
                dot: 'bg-purple-500'
            };
        }
        return {
            label: 'Common / Core',
            bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            dot: 'bg-emerald-500'
        };
    };

    // Categorized Subjects
    const commonSubjects = useMemo(() => 
        classSubjects.filter(s => s.requirement === 'Compulsory' || s.requirement === 'Common'),
        [classSubjects]
    );

    const languageSubjects = useMemo(() => 
        classSubjects.filter(s => s.is_language || s.subject_type === 'Language' || s.category_name === 'Language Subject'),
        [classSubjects]
    );

    const optionalSubjects = useMemo(() => 
        classSubjects.filter(s => s.requirement === 'Optional' || s.requirement === 'Elective'),
        [classSubjects]
    );

    // Filtered subjects for matrix view
    const filteredClassSubjects = useMemo(() => {
        if (activeFilter === 'common') {
            return classSubjects.filter(s => s.requirement === 'Compulsory' || s.requirement === 'Common');
        }
        if (activeFilter === 'language') {
            return classSubjects.filter(s => s.is_language || s.subject_type === 'Language' || s.category_name === 'Language Subject');
        }
        if (activeFilter === 'optional') {
            return classSubjects.filter(s => s.requirement === 'Optional' || s.requirement === 'Elective');
        }
        return classSubjects;
    }, [classSubjects, activeFilter]);

    // Ensure selectedSubjectCode defaults to first subject if empty
    useEffect(() => {
        if (classSubjects.length > 0 && !selectedSubjectCode) {
            setSelectedSubjectCode(classSubjects[0].subject_code);
        }
    }, [classSubjects, selectedSubjectCode]);

    return (
        <div className="space-y-4">
            {/* Header Controls & Filters */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            <BookOpen className="w-4 h-4"/>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            Student Subject Mapping & Elective Assignment
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500">
                        Map compulsory (Common / Core & 1st Language) and assign optional / elective subjects per student or per subject.
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-2.5">
                    {/* Class Selector */}
                    <div>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 cursor-pointer shadow-2xs"
                        >
                            <option value="">Select Class...</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name || c.class_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section Selector */}
                    <div>
                        <select
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 cursor-pointer shadow-2xs"
                        >
                            <option value="all">All Sections</option>
                            {Array.from(new Map((sections || []).map(s => [s.name || s.section_name, s])).values()).map(s => (
                                <option key={s.id} value={s.id}>{s.name || s.section_name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={handleAutoAssignCommon}
                        disabled={isLoading || isReadOnly || classSubjects.length === 0}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                        title="Auto-select all compulsory/common subjects for every student"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600"/>
                        <span>Auto-Assign Common</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading || isSaving || isReadOnly || students.length === 0}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5"/>
                        <span>{isSaving ? 'Saving...' : 'Save Mapping'}</span>
                    </button>
                </div>
            </div>

            {/* View Mode & Filter Bar */}
            <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                {/* Switch between Matrix & Subject-Wise view */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setViewMode('matrix')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                            viewMode === 'matrix' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5"/>
                        <span>Matrix View (All Subjects)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('subject-wise')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                            viewMode === 'subject-wise' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <CheckSquare className="w-3.5 h-3.5"/>
                        <span>Subject-Wise Mapping</span>
                    </button>
                </div>

                {/* Filter Pills for Matrix View */}
                {viewMode === 'matrix' ? (
                    <div className="flex items-center space-x-1.5 text-xs">
                        <span className="text-slate-400 font-medium mr-1 flex items-center">
                            <Filter className="w-3 h-3 mr-1"/> Filter:
                        </span>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('all')}
                            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                activeFilter === 'all'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            All ({classSubjects.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('common')}
                            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                                activeFilter === 'common'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>Common ({commonSubjects.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('language')}
                            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                                activeFilter === 'language'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                            }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span>Language ({languageSubjects.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('optional')}
                            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                                activeFilter === 'optional'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                            }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                            <span>Optional ({optionalSubjects.length})</span>
                        </button>
                    </div>
                ) : (
                    /* Subject Selector for Subject-Wise View */
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-600">Select Subject to Map:</span>
                        <select
                            value={selectedSubjectCode}
                            onChange={(e) => setSelectedSubjectCode(e.target.value)}
                            className="text-xs font-bold rounded-xl border border-purple-300 bg-purple-50/50 text-purple-900 px-3 py-1.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 cursor-pointer shadow-2xs"
                        >
                            {classSubjects.map(sub => {
                                const badge = getSubjectCategoryBadge(sub);
                                return (
                                    <option key={sub.id} value={sub.subject_code}>
                                        {sub.subject_name} [{sub.subject_code}] — {badge.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}
            </div>

            {/* Quick 1-Click Language Combination Presets */}
            {languageSubjects.length >= 2 && (
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                        <Languages className="w-4 h-4 text-blue-700 shrink-0"/>
                        <span className="font-bold text-blue-900">
                            Language Formula Presets (Conflict-Free):
                        </span>
                        <span className="text-slate-500 hidden md:inline">
                            Quick-apply 2nd &amp; 3rd language choices to prevent cross-language duplicates:
                        </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => handleApplyLanguagePreset('Tamil', 'Hindi')}
                            className="px-2.5 py-1 rounded-lg font-bold bg-white text-blue-800 hover:bg-blue-100/80 border border-blue-300 shadow-2xs transition-colors cursor-pointer flex items-center space-x-1"
                            title="Assign Tamil (2nd Lang) and Hindi (3rd Lang) to all students"
                        >
                            <span>Tamil (2nd) + Hindi (3rd)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleApplyLanguagePreset('Hindi', 'Tamil')}
                            className="px-2.5 py-1 rounded-lg font-bold bg-white text-blue-800 hover:bg-blue-100/80 border border-blue-300 shadow-2xs transition-colors cursor-pointer flex items-center space-x-1"
                            title="Assign Hindi (2nd Lang) and Tamil (3rd Lang) to all students"
                        >
                            <span>Hindi (2nd) + Tamil (3rd)</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
                    <span>{error}</span>
                </div>
            )}

            {/* Matrix Mapping Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin"/>
                        <p className="text-xs font-semibold text-slate-500">Loading student subjects matrix...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 space-y-2">
                        <Users className="w-10 h-10 text-slate-300 mx-auto"/>
                        <p className="text-sm font-bold text-slate-700">No active students found in this class/section.</p>
                        <p className="text-xs text-slate-400">Enroll students or switch class/section.</p>
                    </div>
                ) : classSubjects.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 space-y-2">
                        <BookOpen className="w-10 h-10 text-slate-300 mx-auto"/>
                        <p className="text-sm font-bold text-slate-700">No subjects configured for this class yet.</p>
                        <p className="text-xs text-slate-400">Please create or copy subjects in Academic &gt; Subjects.</p>
                    </div>
                ) : viewMode === 'subject-wise' ? (
                    /* DEDICATED SUBJECT-WISE MAPPING VIEW */
                    (() => {
                        const targetSub = classSubjects.find(s => s.subject_code === selectedSubjectCode);
                        if (!targetSub) {
                            return (
                                <div className="text-center py-16 text-slate-500">
                                    <p className="text-sm font-semibold">Please select a subject above to map students.</p>
                                </div>
                            );
                        }
                        const badge = getSubjectCategoryBadge(targetSub);
                        const isCommon = targetSub.requirement === 'Compulsory' || targetSub.requirement === 'Common';
                        const assignedStudentsCount = students.filter(stu => studentSelectionMap[stu.id]?.has(targetSub.subject_code)).length;
                        const allAssigned = students.length > 0 && assignedStudentsCount === students.length;

                        return (
                            <div className="p-4 sm:p-6 space-y-4">
                                {/* Selected Subject Info Card */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-base font-bold text-slate-900">{targetSub.subject_name}</h3>
                                            <span className="font-mono text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {targetSub.subject_code}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                isCommon ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {isCommon ? 'Common (Compulsory)' : 'Optional (Elective)'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {isCommon
                                                ? 'This is a Common compulsory subject. Usually all students in this class should have this subject.'
                                                : 'This is an Optional / Elective subject. Select only students who have chosen this elective/language.'
                                            }
                                        </p>
                                    </div>

                                    {/* Quick Bulk Action for this Subject */}
                                    <div className="flex items-center space-x-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleColumn(targetSub.subject_code)}
                                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs flex items-center space-x-1.5"
                                        >
                                            {allAssigned ? (
                                                <>
                                                    <Square className="w-3.5 h-3.5 text-slate-500"/>
                                                    <span>Deselect All ({students.length})</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckSquare className="w-3.5 h-3.5 text-purple-600"/>
                                                    <span>Select All Students</span>
                                                </>
                                            )}
                                        </button>
                                        <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                                            Assigned: <strong>{assignedStudentsCount}</strong> / {students.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Student List with Checkboxes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {students.map(stu => {
                                        const isAssigned = Boolean(studentSelectionMap[stu.id]?.has(targetSub.subject_code));
                                        
                                        // Detect conflicting language in same level (e.g. If viewing Hindi 2nd Lang, check if student already has Tamil 2nd Lang)
                                        let conflictingLang = null;
                                        if (targetSub.is_language && targetSub.language_level) {
                                            const studentAssignedCodes = studentSelectionMap[stu.id] || new Set();
                                            const otherLevelLang = classSubjects.find(s => 
                                                s.is_language && 
                                                s.language_level === targetSub.language_level && 
                                                s.subject_code !== targetSub.subject_code && 
                                                studentAssignedCodes.has(s.subject_code)
                                            );
                                            if (otherLevelLang) {
                                                conflictingLang = otherLevelLang;
                                            }
                                        }

                                        const isLocked = Boolean(!isAssigned && conflictingLang);

                                        return (
                                            <div
                                                key={stu.id}
                                                onClick={() => handleToggle(stu.id, targetSub.subject_code)}
                                                className={`p-3 rounded-xl border transition-all ${
                                                    isAssigned 
                                                        ? 'bg-purple-50/70 border-purple-300 shadow-2xs cursor-pointer' 
                                                        : isLocked
                                                        ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer'
                                                }`}
                                                title={isLocked ? `Locked: Student already has ${conflictingLang.subject_name}. Go to ${conflictingLang.subject_name} and untick the student first to change!` : ''}
                                            >
                                                <div className="flex items-center space-x-2.5 overflow-hidden">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAssigned}
                                                        disabled={isLocked}
                                                        onChange={() => {}}
                                                        className={`w-4 h-4 rounded shrink-0 ${
                                                            isLocked 
                                                                ? 'cursor-not-allowed opacity-40 text-slate-400' 
                                                                : 'cursor-pointer text-purple-700 focus:ring-purple-700'
                                                        }`}
                                                    />
                                                    <div className="truncate">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{stu.full_name}</p>
                                                        <p className="text-[11px] font-mono text-slate-500">{stu.admission_number}</p>
                                                    </div>
                                                </div>
                                                {isAssigned ? (
                                                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                                        Enrolled
                                                    </span>
                                                ) : isLocked ? (
                                                    <span className="text-[9px] font-bold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded border border-slate-300" title={`Locked: Enrolled in ${conflictingLang.subject_name}`}>
                                                        Locked ({conflictingLang.subject_name.split(' ')[0]})
                                                    </span>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()
                ) : (
                    /* MATRIX VIEW (ALL SUBJECTS / FILTERED) */
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 select-none">
                                <tr>
                                    <th className="py-3 px-4 font-bold sticky left-0 bg-slate-50 z-10 border-r border-slate-200 min-w-[200px]">
                                        Student Name / Adm No
                                    </th>
                                    {filteredClassSubjects.map(sub => {
                                        const badge = getSubjectCategoryBadge(sub);
                                        const isCommon = sub.requirement === 'Compulsory' || sub.requirement === 'Common';
                                        const allChecked = students.every(stu => studentSelectionMap[stu.id]?.has(sub.subject_code));
                                        return (
                                            <th key={sub.id} className="py-3 px-3 font-semibold text-center border-r border-slate-200 min-w-[140px]">
                                                <div className="flex flex-col items-center space-y-1">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="font-bold text-slate-900 truncate max-w-[120px]" title={sub.subject_name}>
                                                            {sub.subject_name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-wrap justify-center">
                                                        <span className="font-mono text-[10px] text-slate-500">[{sub.subject_code}]</span>
                                                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${badge.bg}`}>
                                                            {badge.label}
                                                        </span>
                                                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                                            isCommon ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {isCommon ? 'Common' : 'Optional'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleColumn(sub.subject_code)}
                                                        className="text-[10px] text-slate-400 hover:text-purple-700 underline font-medium pt-0.5 cursor-pointer"
                                                        title="Select or deselect all for this subject"
                                                    >
                                                        {allChecked ? 'Deselect All' : 'Select All'}
                                                    </button>
                                                </div>
                                            </th>
                                        );
                                    })}
                                    <th className="py-3 px-3 font-bold text-center min-w-[90px]">
                                        Total Assigned
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((stu, idx) => {
                                    const assignedCount = studentSelectionMap[stu.id]?.size || 0;
                                    return (
                                        <tr key={stu.id} className={`hover:bg-purple-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                                            {/* Student Info (Sticky Col) */}
                                            <td className="py-2.5 px-4 sticky left-0 bg-white z-10 border-r border-slate-200">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 text-xs">{stu.full_name}</span>
                                                    <span className="font-mono text-[11px] text-slate-500">{stu.admission_number}</span>
                                                </div>
                                            </td>

                                            {/* Subject Checkboxes */}
                                            {filteredClassSubjects.map(sub => {
                                                const isChecked = Boolean(studentSelectionMap[stu.id]?.has(sub.subject_code));
                                                const isCommon = sub.requirement === 'Compulsory' || sub.requirement === 'Common';
                                                
                                                // Check if student has a conflicting language enrolled at same level
                                                let isLocked = false;
                                                let lockReason = '';
                                                if (!isChecked && sub.is_language && sub.language_level) {
                                                    const currentStudentCodes = studentSelectionMap[stu.id] || new Set();
                                                    const otherLang = classSubjects.find(s => 
                                                        s.is_language && 
                                                        s.language_level === sub.language_level && 
                                                        s.subject_code !== sub.subject_code && 
                                                        currentStudentCodes.has(s.subject_code)
                                                    );
                                                    if (otherLang) {
                                                        isLocked = true;
                                                        lockReason = `Locked: Student already has ${otherLang.subject_name}. Untick ${otherLang.subject_name} to change.`;
                                                    }
                                                }

                                                return (
                                                    <td
                                                        key={sub.id}
                                                        onClick={() => handleToggle(stu.id, sub.subject_code)}
                                                        className={`py-2.5 px-3 text-center border-r border-slate-100 transition-colors ${
                                                            isLocked 
                                                                ? 'bg-slate-100/60 cursor-not-allowed opacity-60' 
                                                                : 'cursor-pointer ' + (isChecked ? (isCommon ? 'bg-emerald-50/50' : 'bg-purple-50/60') : 'hover:bg-slate-50')
                                                        }`}
                                                        title={lockReason || (isChecked ? 'Enrolled' : 'Click to enroll')}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                disabled={isLocked}
                                                                onChange={() => {}} // handled by td onClick
                                                                className={`w-4 h-4 rounded ${
                                                                    isLocked 
                                                                        ? 'cursor-not-allowed opacity-40 text-slate-400' 
                                                                        : isCommon 
                                                                        ? 'cursor-pointer text-emerald-700 focus:ring-emerald-700' 
                                                                        : 'cursor-pointer text-purple-700 focus:ring-purple-700'
                                                                }`}
                                                            />
                                                        </div>
                                                    </td>
                                                );
                                            })}

                                            {/* Total Assigned */}
                                            <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    assignedCount === classSubjects.length
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : assignedCount > 0
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {assignedCount} / {classSubjects.length}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer Guide & Status Bar */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                    <div className="flex items-center flex-wrap gap-3">
                        <span className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                            <span className="font-semibold text-emerald-900">Common (Compulsory)</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                            <span className="font-semibold text-blue-900">Language Subject</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                            <span className="font-semibold text-purple-900">Optional / Elective</span>
                        </span>
                    </div>
                    <span>Total Students: <strong>{students.length}</strong> • Class Subjects: <strong>{classSubjects.length}</strong></span>
                </div>
            </div>
        </div>
    );
};
