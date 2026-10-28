import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, History, CheckCircle2, AlertCircle, Loader2, ArrowRight, Search, Settings, ExternalLink, Building2 } from 'lucide-react';
import { getClasses, getSections, getAcademicYears, getStudents, promoteStudents, getPromotionHistory, getAcademicGroups, getBranches, getNextAcademicYear, getAcademicYearClasses } from '../../services/api';
import { useErp } from '../../context/ErpContext';

export const StudentPromotionWizard = ({ branchId, currentAcademicYearId, onDone }) => {
    const navigate = useNavigate();
    const { isSuperAdmin, isPrincipal, assignedBranchId, assignedBranch, accessibleBranches } = useErp();
    const [activeTab, setActiveTab] = useState('wizard');
    const [step, setStep] = useState(1);

    // Branch state
    const [branchesList, setBranchesList] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(() => {
        if (!isSuperAdmin && assignedBranchId) return Number(assignedBranchId);
        return branchId || 1;
    });

    // Reference lists
    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [groups, setGroups] = useState([]);

    // Step 1: Source
    const [sourceYearId, setSourceYearId] = useState(currentAcademicYearId);
    const [sourceClassId, setSourceClassId] = useState(0);
    const [sourceSectionId, setSourceSectionId] = useState(0);

    // Next Academic Year Identification & Validation
    const [nextYearInfo, setNextYearInfo] = useState(null);
    const [isCheckingNextYear, setIsCheckingNextYear] = useState(false);
    const [blockedPromotionError, setBlockedPromotionError] = useState(null);

    // Step 2: Students & Eligibility
    const [eligibleStudents, setEligibleStudents] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    // Step 3: Target Placement
    const [targetYearId, setTargetYearId] = useState(0);
    const [targetClassId, setTargetClassId] = useState(0);
    const [targetSectionId, setTargetSectionId] = useState(0);

    // Target Academic Year Classes & Enablement Validation
    const [targetClasses, setTargetClasses] = useState([]);
    const [targetClassBlockedError, setTargetClassBlockedError] = useState(null);

    // Step 4: Submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Promotion History
    const [historyRecords, setHistoryRecords] = useState([]);
    const [historySearch, setHistorySearch] = useState('');
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Load Branches on mount
    useEffect(() => {
        if (!isSuperAdmin) {
            const currentList = accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : (assignedBranch ? [assignedBranch] : []);
            setBranchesList(currentList);
            setSelectedBranchId(assignedBranchId ? Number(assignedBranchId) : (currentList[0]?.id || 1));
            return;
        }
        getBranches().then(res => {
            const list = Array.isArray(res) ? res : (res?.data || []);
            setBranchesList(list);
            if (branchId) {
                setSelectedBranchId(branchId);
            } else if (list.length > 0) {
                setSelectedBranchId(list[0].id);
            }
        }).catch(console.error);
    }, [branchId, isSuperAdmin, accessibleBranches, assignedBranch, assignedBranchId]);

    // Load Reference Data for selected branch
    useEffect(() => {
        if (selectedBranchId) {
            getAcademicYears(selectedBranchId).then(res => {
                const yearsList = res?.data || [];
                setAcademicYears(yearsList);
                if (!sourceYearId || !yearsList.some(y => Number(y.id) === Number(sourceYearId))) {
                    const currentYear = yearsList.find(y => y.is_current === 1 || y.is_active === 1);
                    if (currentYear) {
                        setSourceYearId(currentYear.id);
                    } else if (yearsList.length > 0) {
                        setSourceYearId(yearsList[0].id);
                    }
                }
            }).catch(console.error);
            getSections(selectedBranchId, sourceYearId).then(res => setSections(res?.data || [])).catch(console.error);
            getAcademicGroups({ branch_id: selectedBranchId, academic_year_id: sourceYearId }).then(res => setGroups(res || [])).catch(console.error);
        }
    }, [selectedBranchId, sourceYearId]);

    useEffect(() => {
        if (selectedBranchId) {
            getClasses(selectedBranchId, sourceYearId).then(res => setClasses(res?.data || [])).catch(console.error);
        }
    }, [selectedBranchId, sourceYearId]);

    // Check Next Academic Year for selected branch and source academic year
    useEffect(() => {
        let isMounted = true;
        async function checkNext() {
            if (!selectedBranchId || !sourceYearId) return;
            setIsCheckingNextYear(true);
            try {
                const nextRes = await getNextAcademicYear(selectedBranchId, sourceYearId);
                if (!isMounted) return;
                if (nextRes && nextRes.success && nextRes.data) {
                    setNextYearInfo(nextRes.data);
                    if (!nextRes.is_enabled) {
                        const yearName = nextRes.data.name || nextRes.data.year_name || 'subsequent year';
                        setBlockedPromotionError(`The next academic year (${yearName}) is not enabled for this branch. Please enable the academic year in Academic Year Settings before proceeding with promotion.`);
                        setTargetYearId(0);
                    } else {
                        setBlockedPromotionError(null);
                        setTargetYearId(nextRes.data.id);
                    }
                } else {
                    const errorMsg = nextRes?.message || 'No subsequent academic year configured for this branch. Please enable the academic year in Academic Year Settings before proceeding with promotion.';
                    setBlockedPromotionError(errorMsg);
                    setNextYearInfo(null);
                    setTargetYearId(0);
                }
            } catch (err) {
                console.error('Error checking next academic year:', err);
            } finally {
                if (isMounted) setIsCheckingNextYear(false);
            }
        }
        checkNext();
        return () => { isMounted = false; };
    }, [selectedBranchId, sourceYearId]);

    // Fetch classes configured for target academic year and branch
    useEffect(() => {
        if (!selectedBranchId || !targetYearId) {
            setTargetClasses([]);
            return;
        }
        getAcademicYearClasses(selectedBranchId, targetYearId).then(res => {
            setTargetClasses(res?.data || []);
        }).catch(err => {
            console.error('Failed to load target academic year classes:', err);
        });
    }, [selectedBranchId, targetYearId]);

    // Validate target class enablement in target academic year
    useEffect(() => {
        if (!targetYearId || !targetClassId || targetClasses.length === 0) {
            setTargetClassBlockedError(null);
            return;
        }

        const targetCls = targetClasses.find(c => Number(c.id) === Number(targetClassId));
        if (targetCls && targetCls.is_enabled === false) {
            const targetYearName = nextYearInfo?.name || academicYears.find(y => Number(y.id) === Number(targetYearId))?.name || 'the upcoming academic year';
            setTargetClassBlockedError(`Target Class (${targetCls.name}) is disabled for ${targetYearName} in this branch. Please enable the class in Academic Year Settings before proceeding with promotion.`);
        } else {
            setTargetClassBlockedError(null);
        }
    }, [targetClasses, targetYearId, targetClassId, nextYearInfo, academicYears]);

    // Handle branch change from dropdown
    const handleBranchChange = (newBranchId) => {
        setSelectedBranchId(newBranchId);
        setSourceClassId(0);
        setSourceSectionId(0);
        setTargetClassId(0);
        setTargetSectionId(0);
        setEligibleStudents([]);
        setTargetClassBlockedError(null);
        setStep(1);
    };

    // Helper to auto-fill target placement based on source selections
    const autoFillTargetPlacement = (currYearId, currClassId, currSecId) => {
        const destYearId = (nextYearInfo && nextYearInfo.is_enabled) ? nextYearInfo.id : targetYearId;
        if (destYearId) {
            setTargetYearId(destYearId);
        }

        // 2. Auto-fill target class to next class in sequence (e.g., Class 6 -> Class 7)
        if (classes.length > 0 && currClassId) {
            const sourceClass = classes.find(c => Number(c.id) === Number(currClassId));
            let nextClass = null;
            if (sourceClass) {
                if (sourceClass.numeric_value !== undefined && sourceClass.numeric_value !== null) {
                    nextClass = classes.find(c => Number(c.numeric_value) === Number(sourceClass.numeric_value) + 1);
                }
                if (!nextClass) {
                    const classIdx = classes.findIndex(c => Number(c.id) === Number(currClassId));
                    if (classIdx !== -1 && classIdx < classes.length - 1) {
                        nextClass = classes[classIdx + 1];
                    }
                }
            }
            if (nextClass) {
                setTargetClassId(nextClass.id);
                // 3. Auto-fill target section to matching section in next class and matching target year
                const sourceSec = sections.find(s => Number(s.id) === Number(currSecId));
                let targetSecs = sections.filter(s => Number(s.class_id) === Number(nextClass.id));
                if (destYearId) {
                    const yearTargetSecs = targetSecs.filter(s => Number(s.academic_year_id) === Number(destYearId));
                    if (yearTargetSecs.length > 0) targetSecs = yearTargetSecs;
                }
                if (sourceSec && targetSecs.length > 0) {
                    const matchingSec = targetSecs.find(s => (s.name || s.section_name || '').trim().toLowerCase() === (sourceSec.name || sourceSec.section_name || '').trim().toLowerCase());
                    setTargetSectionId(matchingSec ? matchingSec.id : targetSecs[0].id);
                } else if (targetSecs.length > 0) {
                    setTargetSectionId(targetSecs[0].id);
                }
            }
        }
    };

    // Helper to get unique sections for a class (deduplicate by section name and filter by academic year)
    const getSectionsForClass = (classId, yearId) => {
        if (!classId) return [];
        let classSecs = sections.filter(s => Number(s.class_id) === Number(classId));
        if (yearId) {
            const yearSecs = classSecs.filter(s => Number(s.academic_year_id) === Number(yearId));
            if (yearSecs.length > 0) classSecs = yearSecs;
        }
        const seen = new Set();
        return classSecs.filter(s => {
            const key = (s.name || s.section_name || '').trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    // Load Source Students when Source Class & Section are picked in Step 1
    const loadEligibleStudents = async () => {
        if (!sourceYearId || !sourceClassId || !sourceSectionId) {
            setErrorMessage('Please select Current Academic Year, Branch, Class, and Section.');
            return;
        }
        if (blockedPromotionError) {
            setErrorMessage(blockedPromotionError);
            return;
        }
        setIsLoadingStudents(true);
        setErrorMessage(null);
        try {
            const res = await getStudents({
                branch_id: selectedBranchId,
                academic_year_id: sourceYearId,
                class_id: sourceClassId,
                section_id: sourceSectionId,
                page_size: 200
            });
            const formatted = (res.data || []).map(s => ({
                ...s,
                selected: true,
                result: 'Passed',
                promotion_status: 'Promoted',
                target_group_id: s.academic_group_id || undefined,
                remarks: ''
            }));
            setEligibleStudents(formatted);
            // Auto fill target placement for next step
            autoFillTargetPlacement(sourceYearId, sourceClassId, sourceSectionId);
            setStep(2);
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to fetch enrolled students.');
        }
        finally {
            setIsLoadingStudents(false);
        }
    };
    // Load Promotion History
    useEffect(() => {
        if (activeTab === 'history' && branchId) {
            setIsLoadingHistory(true);
            getPromotionHistory({ branch_id: branchId, search: historySearch })
                .then(res => setHistoryRecords(res || []))
                .catch(console.error)
                .finally(() => setIsLoadingHistory(false));
        }
    }, [activeTab, selectedBranchId, historySearch]);
    // Execute Promotion
    const handleConfirmPromotion = async () => {
        const selectedStudents = eligibleStudents.filter(s => s.selected);
        if (selectedStudents.length === 0) {
            setErrorMessage('No students selected for promotion.');
            return;
        }
        if (!targetYearId || !targetClassId || !targetSectionId) {
            setErrorMessage('Target Academic Year, Class, and Section are required.');
            return;
        }
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await promoteStudents({
                branch_id: selectedBranchId,
                from_academic_year_id: sourceYearId,
                to_academic_year_id: targetYearId,
                promotions: selectedStudents.map(s => ({
                    student_id: s.id,
                    from_class_id: s.class_id,
                    from_section_id: s.section_id,
                    to_class_id: s.promotion_status === 'Promoted' ? targetClassId : s.class_id,
                    to_section_id: s.promotion_status === 'Promoted' ? targetSectionId : s.section_id,
                    result: s.result,
                    promotion_status: s.promotion_status,
                    academic_group_id: s.target_group_id,
                    remarks: s.remarks
                }))
            });
            setSuccessMessage(`Successfully processed promotion for ${selectedStudents.length} students into target academic year.`);
            setStep(1);
            setEligibleStudents([]);
            if (onDone)
                onDone();
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to complete student promotion.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const safeEligible = eligibleStudents || [];
    const selectedCount = safeEligible.filter(s => s.selected).length;
    const promotedCount = safeEligible.filter(s => s.selected && s.promotion_status === 'Promoted').length;
    const detainedCount = safeEligible.filter(s => s.selected && s.promotion_status === 'Detained').length;
    return (<div className="space-y-5">
      {/* Tab Switcher */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs inline-flex space-x-1 text-xs font-semibold">
        <button type="button" onClick={() => setActiveTab('wizard')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'wizard' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}>
          <TrendingUp className="w-3.5 h-3.5"/>
          <span>Annual Promotion Wizard</span>
        </button>

        <button type="button" onClick={() => setActiveTab('history')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'history' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}>
          <History className="w-3.5 h-3.5"/>
          <span>Promotion History Batches</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (<div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
          <span>{successMessage}</span>
        </div>)}

      {errorMessage && (<div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0"/>
          <span>{errorMessage}</span>
        </div>)}

      {activeTab === 'wizard' && (<div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          {/* Step Indicator Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            {[
                { num: 1, label: 'Select Source' },
                { num: 2, label: 'Eligibility & Results' },
                { num: 3, label: 'Target Placement' },
                { num: 4, label: 'Summary & Confirm' },
            ].map((sItem) => (<div key={sItem.num} className="flex items-center space-x-2 text-xs">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step === sItem.num
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-50'
                    : step > sItem.num
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'}`}>
                  {step > sItem.num ? '✓' : sItem.num}
                </div>
                <span className={`font-semibold hidden sm:inline ${step === sItem.num ? 'text-slate-900' : 'text-slate-400'}`}>
                  {sItem.label}
                </span>
              </div>))}
          </div>

          {/* STEP 1: SOURCE SELECTION */}
          {step === 1 && (<div className="space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-slate-900">Step 1: Choose Academic Session, Branch & Class</h3>
              <p className="text-xs text-slate-500">
                Configure source academic year, campus branch, class, and section. The system will automatically resolve the eligible promotion target session.
              </p>

              <div className="space-y-3.5 text-xs pt-2">
                {/* 1. Current Academic Year */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    1. Current Academic Year *
                  </label>
                  <select 
                    value={sourceYearId} 
                    onChange={(e) => setSourceYearId(Number(e.target.value))} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {academicYears.map(y => (
                      <option key={y.id} value={y.id}>
                        {y.name} {y.is_current ? '(Current / Default)' : y.is_next ? '(Next Year / Enabled)' : `(${y.status || 'Enabled'})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Campus Branch */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    2. Campus Branch *
                  </label>
                  {isSuperAdmin ? (
                    <select 
                      value={selectedBranchId} 
                      onChange={(e) => handleBranchChange(Number(e.target.value))} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      {branchesList.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.branch_name} ({b.branch_code})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 border border-emerald-200 bg-emerald-50 rounded-lg font-bold text-emerald-800 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>{assignedBranch?.branch_name || 'Assigned Branch'} ({assignedBranch?.branch_code || ''})</span>
                    </div>
                  )}
                </div>

                {/* 3. Source Class */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    3. Source Class *
                  </label>
                  <select 
                    value={sourceClassId} 
                    onChange={(e) => {
                      const newCId = Number(e.target.value);
                      setSourceClassId(newCId);
                      const availSecs = getSectionsForClass(newCId, sourceYearId);
                      const firstSecId = availSecs.length > 0 ? availSecs[0].id : 0;
                      setSourceSectionId(firstSecId);
                      if (newCId > 0) {
                        autoFillTargetPlacement(sourceYearId, newCId, firstSecId);
                      } else {
                        setTargetClassId(0);
                        setTargetSectionId(0);
                        setTargetClassBlockedError(null);
                      }
                    }} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="0">Choose Class</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Source Section */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    4. Source Section *
                  </label>
                  <select 
                    value={sourceSectionId} 
                    onChange={(e) => {
                      const newSecId = Number(e.target.value);
                      setSourceSectionId(newSecId);
                      if (sourceClassId > 0) {
                        autoFillTargetPlacement(sourceYearId, sourceClassId, newSecId);
                      }
                    }} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="0">Choose Section</option>
                    {getSectionsForClass(sourceClassId, sourceYearId).map(s => (
                      <option key={s.id} value={s.id}>Section {s.name || s.section_name}</option>
                    ))}
                  </select>
                </div>

                {/* Automatic Next Academic Year Resolution Status / Blocking Banner */}
                {isCheckingNextYear ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Checking branch academic year settings...</span>
                  </div>
                ) : blockedPromotionError ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5 shadow-2xs">
                    <div className="flex items-start space-x-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 text-sm">Promotion Blocked</h4>
                        <p className="mt-1 font-medium text-amber-800 leading-relaxed">
                          {blockedPromotionError}
                        </p>
                      </div>
                    </div>
                    <div className="pt-1 pl-7">
                      <button
                        type="button"
                        onClick={() => navigate('/academic/academic-year')}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Open Academic Year Settings</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ) : targetClassBlockedError ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5 shadow-2xs">
                    <div className="flex items-start space-x-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 text-sm">Target Class Disabled</h4>
                        <p className="mt-1 font-medium text-amber-800 leading-relaxed">
                          {targetClassBlockedError}
                        </p>
                      </div>
                    </div>
                    <div className="pt-1 pl-7">
                      <button
                        type="button"
                        onClick={() => navigate('/academic/academic-year')}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Open Academic Year Settings</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ) : nextYearInfo && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-900">Next Academic Year Identified: </span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                        {nextYearInfo.name}
                      </span>
                      <span className="ml-1.5 text-emerald-700 font-medium">
                        (Next Year / Enabled for this branch. Promoted students will move to this session automatically.)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="button" 
                  onClick={loadEligibleStudents} 
                  disabled={isLoadingStudents || isCheckingNextYear || Boolean(blockedPromotionError) || Boolean(targetClassBlockedError) || !sourceClassId || !sourceSectionId} 
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
                  title={
                    blockedPromotionError 
                      ? 'Promotion blocked: Enable next academic year in settings first' 
                      : targetClassBlockedError 
                        ? 'Promotion blocked: Target class is disabled in academic year settings' 
                        : ''
                  }
                >
                  {isLoadingStudents ? (<>
                      <Loader2 className="w-4 h-4 animate-spin"/>
                      <span>Loading students...</span>
                    </>) : (<>
                      <span>Next: Review Students</span>
                      <ArrowRight className="w-4 h-4"/>
                    </>)}
                </button>
              </div>
            </div>)}

          {/* STEP 2: ELIGIBILITY & RESULTS */}
          {step === 2 && (<div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 2: Annual Examination Results & Promotion Eligibility</h3>
                  <p className="text-xs text-slate-500">
                    Verify academic results and set status (Promoted vs Detained) per individual student.
                  </p>
                </div>

                <div className="text-xs text-slate-600 font-semibold">
                  {selectedCount} of {eligibleStudents.length} Selected
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider sticky top-0">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input type="checkbox" checked={eligibleStudents.length > 0 && eligibleStudents.every(s => s.selected)} onChange={(e) => {
                    const checked = e.target.checked;
                    setEligibleStudents(prev => prev.map(s => ({ ...s, selected: checked })));
                }} className="rounded text-emerald-600 focus:ring-emerald-500"/>
                        </th>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Admission No</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Section</th>
                        <th className="p-3">Result</th>
                        <th className="p-3">Promotion Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {eligibleStudents.map((s, idx) => (<tr key={s.id} className={s.selected ? 'bg-white' : 'bg-slate-50 opacity-60'}>
                          <td className="p-3 text-center">
                            <input type="checkbox" checked={s.selected} onChange={(e) => {
                        const checked = e.target.checked;
                        setEligibleStudents(prev => prev.map((item, i) => i === idx ? { ...item, selected: checked } : item));
                    }} className="rounded text-emerald-600 focus:ring-emerald-500"/>
                          </td>
                          <td className="p-3 font-mono font-semibold">{s.roll_number || '—'}</td>
                          <td className="p-3 font-bold text-slate-800">{s.full_name}</td>
                          <td className="p-3 font-mono text-emerald-700">{s.admission_number}</td>
                          <td className="p-3 font-medium text-slate-700">{s.class_name || (classes.find(c => Number(c.id) === Number(s.class_id))?.name) || `Class ${s.class_id}`}</td>
                          <td className="p-3 font-medium text-slate-700">{s.section_name ? `Section ${s.section_name}` : (sections.find(sec => Number(sec.id) === Number(s.section_id))?.name ? `Section ${sections.find(sec => Number(sec.id) === Number(s.section_id))?.name}` : `Section ${s.section_id}`)}</td>
                          <td className="p-3">
                            <select value={s.result} onChange={(e) => {
                        const val = e.target.value;
                        setEligibleStudents(prev => prev.map((item, i) => i === idx ? {
                            ...item,
                            result: val,
                            promotion_status: val === 'Failed' ? 'Detained' : 'Promoted'
                        } : item));
                    }} className="px-2 py-1 border border-slate-300 rounded-lg text-xs">
                              <option value="Passed">Passed</option>
                              <option value="Distinction">Distinction</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select value={s.promotion_status} onChange={(e) => {
                        const val = e.target.value;
                        setEligibleStudents(prev => prev.map((item, i) => i === idx ? { ...item, promotion_status: val } : item));
                    }} className={`px-2 py-1 border rounded-lg text-xs font-semibold ${s.promotion_status === 'Promoted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
                              <option value="Promoted">Promote to Next Class</option>
                              <option value="Detained">Detain (Repeat Class)</option>
                              <option value="Not Promoted">Not Promoted</option>
                            </select>
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  Back
                </button>

                <button type="button" onClick={() => setStep(3)} disabled={selectedCount === 0} className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer">
                  <span>Next: Choose Target Placement</span>
                  <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </div>)}

          {/* STEP 3: TARGET PLACEMENT */}
          {step === 3 && (<div className="space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-slate-900">Step 3: Define Target Academic Placement</h3>
              <p className="text-xs text-slate-500">
                The target academic year and destination class have been automatically determined based on your branch academic year settings.
              </p>

              <div className="space-y-3.5 text-xs pt-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Target Academic Year *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${nextYearInfo?.name || academicYears.find(y => Number(y.id) === Number(targetYearId))?.name || '2027-2028'} (Next Year / Enabled — Auto-Identified)`}
                    className="w-full px-3.5 py-2 border border-emerald-300 bg-emerald-50/50 text-emerald-950 font-bold rounded-lg cursor-default focus:outline-hidden"
                  />
                  <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Automatically identified from branch settings. Manual selection not required.</span>
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Class *</label>
                  <select value={targetClassId} onChange={(e) => {
                    const nextCId = Number(e.target.value);
                    setTargetClassId(nextCId);
                    const availSecs = getSectionsForClass(nextCId, targetYearId);
                    if (availSecs.length > 0) {
                      setTargetSectionId(availSecs[0].id);
                    } else {
                      setTargetSectionId(0);
                    }
                  }} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-600 bg-white">
                    <option value="0">Select Destination Class</option>
                    {(targetClasses.length > 0 ? targetClasses : classes).map(c => {
                      const isDisabled = c.is_enabled === false;
                      return (
                        <option key={c.id} value={c.id} disabled={isDisabled}>
                          {c.name} {isDisabled ? '(Disabled in Target Year)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Section *</label>
                  <select value={targetSectionId} onChange={(e) => setTargetSectionId(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-600 bg-white">
                    <option value="0">Select Destination Section</option>
                    {getSectionsForClass(targetClassId, targetYearId).map(s => (<option key={s.id} value={s.id}>Section {s.name || s.section_name}</option>))}
                  </select>
                </div>

                {/* Target Class Blocked Error Banner */}
                {targetClassBlockedError && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5 shadow-2xs mt-2">
                    <div className="flex items-start space-x-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 text-sm">Target Class Disabled</h4>
                        <p className="mt-1 font-medium text-amber-800 leading-relaxed">
                          {targetClassBlockedError}
                        </p>
                      </div>
                    </div>
                    <div className="pt-1 pl-7">
                      <button
                        type="button"
                        onClick={() => navigate('/academic/academic-year')}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Open Academic Year Settings</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button type="button" onClick={() => setStep(2)} className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  Back
                </button>

                <button 
                  type="button" 
                  onClick={() => setStep(4)} 
                  disabled={!targetYearId || !targetClassId || !targetSectionId || Boolean(targetClassBlockedError)} 
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
                  title={targetClassBlockedError ? 'Promotion blocked: Target class is disabled' : ''}
                >
                  <span>Review Summary</span>
                  <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </div>)}

          {/* STEP 4: SUMMARY & CONFIRMATION */}
          {step === 4 && (<div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900">Step 4: Promotion Batch Summary & Final Confirmation</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 font-semibold block">Total to Promote</span>
                  <span className="text-2xl font-bold text-emerald-900">{promotedCount} Students</span>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-amber-800 font-semibold block">Detained (Repeat Class)</span>
                  <span className="text-2xl font-bold text-amber-900">{detainedCount} Students</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-semibold block">Destination Session</span>
                  <span className="text-lg font-bold text-slate-900">
                    {academicYears.find(y => y.id === targetYearId)?.name}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900">Important Data Integrity Notice:</div>
                <p>
                  Confirming will create new enrollment records in the target academic year. 
                  Previous session enrollments and marks are permanently preserved and accessible anytime via the Academic Year Switcher.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setStep(3)} className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  Back
                </button>

                <button type="button" onClick={handleConfirmPromotion} disabled={isSubmitting} className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs cursor-pointer">
                  {isSubmitting ? (<>
                      <Loader2 className="w-4 h-4 animate-spin"/>
                      <span>Promoting Students...</span>
                    </>) : (<>
                      <CheckCircle2 className="w-4 h-4"/>
                      <span>Confirm & Execute Promotion</span>
                    </>)}
                </button>
              </div>
            </div>)}
        </div>)}

      {/* PROMOTION HISTORY TAB */}
      {activeTab === 'history' && (<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Permanent Promotion History</h3>
              <p className="text-xs text-slate-500">Historical records of all promotions across academic sessions.</p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
              <input type="text" placeholder="Search history by pupil name..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"/>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">From Session</th>
                  <th className="p-3">To Session</th>
                  <th className="p-3">From Class</th>
                  <th className="p-3">To Class</th>
                  <th className="p-3">Decision</th>
                  <th className="p-3">Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingHistory ? (<tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-emerald-600"/>
                      <span>Loading promotion records...</span>
                    </td>
                  </tr>) : historyRecords.length === 0 ? (<tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No promotion history records found.
                    </td>
                  </tr>) : (historyRecords.map(item => (<tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono text-slate-600">{item.promoted_date}</td>
                      <td className="p-3 font-bold text-slate-900">{item.student_name}</td>
                      <td className="p-3 text-slate-600">{item.from_year_name}</td>
                      <td className="p-3 font-bold text-emerald-800">{item.to_year_name}</td>
                      <td className="p-3">{item.from_class_name} ({item.from_section_name})</td>
                      <td className="p-3 font-semibold text-slate-800">{item.to_class_name} ({item.to_section_name})</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.promotion_status === 'Promoted'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'}`}>
                          {item.promotion_status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{item.promoted_by}</td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
        </div>)}
    </div>);
};
