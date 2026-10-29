import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarCheck, Search, AlertCircle, RefreshCw, UserX, Check, Edit3, Eye, Clock, Layers, AlertTriangle } from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { getClasses, getSectionsByClass } from '../../services/api';
import { useErp } from '../../context/ErpContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { AbsentNotificationModal } from './AbsentNotificationModal';

export const TakeAttendanceView = ({ branchId, academicYearId, onNavigateToRemarks, onNavigateToMapping }) => {
    const { branches, academicYears, activeAcademicYear, academicYearName, showToast, userRole, currentUser } = useErp();
    // Core Top Filters (Branch, Academic Year, Date, Class, Section)
    const [selectedBranchId, setSelectedBranchId] = useState(branchId);
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(academicYearId);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');

    // Attendance Timing Mapping State
    const [hasTimingMapping, setHasTimingMapping] = useState(null); // null = unknown, false = unmapped, true = mapped
    const [activeTiming, setActiveTiming] = useState(null);
    const [isLoadingTiming, setIsLoadingTiming] = useState(false);

    // Active Remarks List from Master
    const [standardRemarks, setStandardRemarks] = useState([]);
    // Session Selector Tab ('both' | 'morning' | 'afternoon')
    const [selectedSessionTab, setSelectedSessionTab] = useState('both');
    // Students and Attendance State
    const [students, setStudents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Existing Attendance State & Modes (View Only vs Edit Attendance)
    const [existingRecord, setExistingRecord] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    // Absent Notification Modal
    const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
    const [absentStudentsToNotify, setAbsentStudentsToNotify] = useState([]);
    // Sync props to state
    useEffect(() => {
        setSelectedBranchId(branchId);
    }, [branchId]);
    useEffect(() => {
        setSelectedAcademicYearId(academicYearId);
    }, [academicYearId]);
    // Load Active Remarks Master
    useEffect(() => {
        attendanceApi.getRemarks('Active')
            .then(rems => setStandardRemarks(rems))
            .catch(err => console.error('Failed to load standard remarks:', err));
    }, []);
    // 1. Load Classes for Selected Branch & AY
    useEffect(() => {
        if (!selectedBranchId || !selectedAcademicYearId)
            return;
        getClasses(selectedBranchId, selectedAcademicYearId)
            .then(res => {
            const cls = Array.isArray(res) ? res : (res?.data || []);
            setClasses(cls);
            if (cls.length > 0) {
                setSelectedClassId(cls[0].id);
            }
            else {
                setSelectedClassId('');
                setSections([]);
                setSelectedSectionId('');
            }
        })
            .catch(err => {
            console.error('Failed to load classes:', err);
            setClasses([]);
            setSelectedClassId('');
        });
    }, [selectedBranchId, selectedAcademicYearId]);
    // 2. Load Sections when Class changes
    useEffect(() => {
        if (selectedClassId && selectedBranchId && selectedAcademicYearId) {
            getSectionsByClass(Number(selectedClassId), selectedBranchId, selectedAcademicYearId)
                .then(secs => {
                setSections(secs);
                if (secs.length > 0) {
                    setSelectedSectionId(secs[0].id);
                }
                else {
                    setSelectedSectionId('');
                }
            })
                .catch(err => {
                console.error('Failed to load sections:', err);
                setSections([]);
                setSelectedSectionId('');
            });
        }
        else {
            setSections([]);
            setSelectedSectionId('');
        }
    }, [selectedClassId, selectedBranchId, selectedAcademicYearId]);
    // 3. Load Students & Check Existing Attendance & Timing Mapping
    const loadRoster = useCallback(async () => {
        if (!selectedClassId || !selectedSectionId || !attendanceDate || !selectedBranchId || !selectedAcademicYearId) {
            setStudents([]);
            setAttendanceMap({});
            setExistingRecord(null);
            setIsEditMode(false);
            setHasTimingMapping(null);
            setActiveTiming(null);
            return;
        }
        setIsLoadingStudents(true);
        setIsLoadingTiming(true);
        try {
            // Resolve section name
            const secObj = sections.find(s => String(s.id) === String(selectedSectionId) || String(s.section_id) === String(selectedSectionId));
            const secName = secObj ? (secObj.name || secObj.section_name) : '';
            const effAyStr = academicYearName || activeAcademicYear?.name || activeAcademicYear?.year_name || '';

            // Step A: Check timing schedule assignment (Prerequisite)
            let timingRes = null;
            try {
                timingRes = await attendanceApi.resolveTiming(
                    selectedBranchId,
                    selectedAcademicYearId,
                    Number(selectedClassId),
                    Number(selectedSectionId),
                    effAyStr
                );
            } catch (timingErr) {
                console.error('Failed to resolve timing assignment:', timingErr);
            }

            const timingMapped = Boolean(timingRes?.mapped || timingRes?.has_timing_mapping);
            setHasTimingMapping(timingMapped);
            setActiveTiming(timingRes?.timing || null);

            // Step B: Check if attendance already marked
            const existingCheck = await attendanceApi.checkExisting(
                selectedBranchId,
                selectedAcademicYearId,
                Number(selectedClassId),
                Number(selectedSectionId),
                attendanceDate,
                secName
            );
            setExistingRecord(existingCheck.exists ? existingCheck : null);
            // If already marked, default to View Only mode
            if (existingCheck.exists) {
                setIsEditMode(false);
            }
            else {
                setIsEditMode(true); // new attendance is always editable
            }

            // Step C: Load student roster
            const data = await attendanceApi.getStudentsToMark(
                selectedBranchId,
                selectedAcademicYearId,
                Number(selectedClassId),
                Number(selectedSectionId),
                attendanceDate,
                timingRes?.timing?.id,
                secName,
                effAyStr
            );
            const uniqueStudents = Array.from(new Map(data.map(s => [s.student_id, s])).values());
            setStudents(uniqueStudents);

            // Step D: Initialize attendance mapping with dual session awareness
            const map = {};
            uniqueStudents.forEach(s => {
                const morningStatus = s.marked_morning_status || s.marked_status || 'Present';
                const afternoonStatus = s.marked_afternoon_status || s.marked_status || 'Present';
                const overallStatus = s.marked_status || morningStatus || 'Present';
                const remarkVal = s.marked_remarks || '';
                const customVal = s.marked_custom_remark || '';

                map[s.student_id] = {
                    status: overallStatus,
                    morning_status: morningStatus,
                    afternoon_status: afternoonStatus,
                    remarks: remarkVal || (customVal ? 'Other' : ''),
                    custom_remark: customVal
                };
            });
            setAttendanceMap(map);
        }
        catch (err) {
            console.error('Failed to load students for attendance:', err);
            showToast('Could not load student list: ' + (err.message || ''), 'error');
        }
        finally {
            setIsLoadingStudents(false);
            setIsLoadingTiming(false);
        }
    }, [selectedBranchId, selectedAcademicYearId, selectedClassId, selectedSectionId, attendanceDate, showToast, sections, academicYearName, activeAcademicYear]);
    useEffect(() => {
        loadRoster();
    }, [loadRoster]);

    // Compute overall status helper from morning & afternoon
    const computeOverallStatus = (morn, aft, hasTwoSessions) => {
        if (!hasTwoSessions) return morn;
        if (morn === 'Present' && aft === 'Present') return 'Present';
        if (morn === 'Absent' && aft === 'Absent') return 'Absent';
        if (morn === 'Leave' && aft === 'Leave') return 'Leave';
        if (morn === 'Late' && aft === 'Late') return 'Late';
        // When one session is Absent and the other is Present or Late -> Half Day
        if ((morn === 'Absent' && (aft === 'Present' || aft === 'Late')) ||
            (aft === 'Absent' && (morn === 'Present' || morn === 'Late'))) {
            return 'Half Day';
        }
        // When one session is Leave and the other is Present or Late -> Half Day / Leave
        if ((morn === 'Leave' && (aft === 'Present' || aft === 'Late')) ||
            (aft === 'Leave' && (morn === 'Present' || morn === 'Late'))) {
            return 'Half Day';
        }
        if (morn === 'Late' || aft === 'Late') return 'Late';
        return 'Half Day';
    };

    // One-click: Mark All Present
    const handleMarkAllPresent = (targetSession = 'both') => {
        if (isReadOnly)
            return;
        const hasTwo = Boolean(activeTiming?.is_second_session);
        const updated = { ...attendanceMap };
        students.forEach(s => {
            const current = updated[s.student_id] || {};
            let newMorning = current.morning_status || 'Present';
            let newAfternoon = current.afternoon_status || 'Present';

            if (targetSession === 'both' || !hasTwo) {
                newMorning = 'Present';
                newAfternoon = 'Present';
            } else if (targetSession === 'morning') {
                newMorning = 'Present';
            } else if (targetSession === 'afternoon') {
                newAfternoon = 'Present';
            }

            const overall = computeOverallStatus(newMorning, newAfternoon, hasTwo);
            updated[s.student_id] = {
                ...current,
                morning_status: newMorning,
                afternoon_status: newAfternoon,
                status: overall
            };
        });
        setAttendanceMap(updated);
        const label = targetSession === 'morning' ? (activeTiming?.session_1_name || 'Morning Session') : targetSession === 'afternoon' ? (activeTiming?.session_2_name || 'Afternoon Session') : 'All';
        showToast(`${label} students marked as Present`, 'info');
    };

    // Set individual student status
    const handleSetStatus = (studentId, status, session = 'both') => {
        if (isReadOnly)
            return;
        const hasTwo = Boolean(activeTiming?.is_second_session);
        setAttendanceMap(prev => {
            const curr = prev[studentId] || { morning_status: 'Present', afternoon_status: 'Present', status: 'Present' };
            let newMorning = curr.morning_status || 'Present';
            let newAfternoon = curr.afternoon_status || 'Present';

            if (session === 'morning') {
                newMorning = status;
                if (!hasTwo) newAfternoon = status;
            } else if (session === 'afternoon') {
                newAfternoon = status;
            } else {
                newMorning = status;
                newAfternoon = status;
            }

            const overall = computeOverallStatus(newMorning, newAfternoon, hasTwo);
            return {
                ...prev,
                [studentId]: {
                    ...curr,
                    morning_status: newMorning,
                    afternoon_status: newAfternoon,
                    status: overall
                }
            };
        });
    };
    // Set remark
    const handleSetRemarks = (studentId, remarkName) => {
        if (isReadOnly)
            return;
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks: remarkName,
                custom_remark: remarkName === 'Other' ? prev[studentId]?.custom_remark || '' : ''
            }
        }));
    };
    // Set custom remark
    const handleSetCustomRemark = (studentId, customText) => {
        if (isReadOnly)
            return;
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                custom_remark: customText
            }
        }));
    };
    // Live Counter calculations
    const counts = useMemo(() => {
        let present = 0;
        let absent = 0;
        let leave = 0;
        let late = 0;
        const hasTwo = Boolean(activeTiming?.is_second_session);

        Object.values(attendanceMap).forEach((v) => {
            const st = selectedSessionTab === 'morning'
                ? (v.morning_status || v.status)
                : selectedSessionTab === 'afternoon' && hasTwo
                    ? (v.afternoon_status || v.status)
                    : v.status;

            if (st === 'Present')
                present++;
            else if (st === 'Absent')
                absent++;
            else if (st === 'Leave')
                leave++;
            else if (st === 'Late')
                late++;
        });
        const total = students.length;
        const percentage = total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0;
        return { total, present, absent, leave, late, percentage };
    }, [attendanceMap, students.length, selectedSessionTab, activeTiming?.is_second_session]);
    // Timing Prerequisite & Read-only state check
    const isTimingMissing = hasTimingMapping === false;
    const isReadOnly = (existingRecord?.exists && !isEditMode) || isTimingMissing;

    // Submit Handler
    const handleSubmit = async () => {
        if (!selectedClassId || !selectedSectionId) {
            showToast('Please select Class and Section', 'error');
            return;
        }
        if (isTimingMissing || !activeTiming) {
            showToast('Cannot record attendance: No attendance timing schedule is mapped to this class. Please map timing schedule first.', 'error');
            return;
        }
        if (students.length === 0) {
            showToast('No students enrolled in this section to mark', 'error');
            return;
        }
        if (existingRecord?.exists && !isEditMode) {
            showToast('Please click "Edit Attendance" to modify records.', 'info');
            return;
        }
        setIsSubmitting(true);
        try {
            const staffName = currentUser?.full_name || (userRole === 'super_admin' ? 'Super Admin' : 'Class Teacher');
            const effAyStr = academicYearName || activeAcademicYear?.name || activeAcademicYear?.year_name;
            const records = students.map(s => {
                const item = attendanceMap[s.student_id] || { status: 'Present', morning_status: 'Present', afternoon_status: 'Present', remarks: '', custom_remark: '' };
                return {
                    student_id: s.student_id,
                    status: item.status,
                    morning_status: item.morning_status || item.status,
                    afternoon_status: item.afternoon_status || item.status,
                    remarks: item.remarks === 'Other' ? 'Other' : item.remarks,
                    custom_remark: item.remarks === 'Other' ? item.custom_remark.trim() : ''
                };
            });
            const res = await attendanceApi.submitAttendance({
                branch_id: selectedBranchId,
                academic_year_id: selectedAcademicYearId,
                academic_year: effAyStr,
                class_id: Number(selectedClassId),
                section_id: Number(selectedSectionId),
                timing_id: activeTiming.id,
                attendance_timing_id: activeTiming.id,
                attendance_date: attendanceDate,
                submitted_by: existingRecord?.submitted_by || staffName,
                updated_by: existingRecord?.exists ? staffName : undefined,
                is_edit: existingRecord?.exists,
                records
            });
            showToast(res.message || 'Attendance saved successfully', 'success');
            // Refresh to lock into view mode with updated audit
            await loadRoster();
            // Check if absent notification modal needed
            if (res.absent_students && res.absent_students.length > 0 && !res.auto_notification_sent) {
                setAbsentStudentsToNotify(res.absent_students);
                setIsNotifModalOpen(true);
            }
            else if (res.auto_notification_sent) {
                showToast(`Automated SMS notification sent to ${res.absent_count} absent student parents`, 'info');
            }
        }
        catch (err) {
            console.error('Failed to submit attendance:', err);
            showToast(err.message || 'Could not save attendance', 'error');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Filter student list by search
    const filteredStudents = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term)
            return students;
        return students.filter(s => {
            const fullName = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
            const roll = String(s.roll_number || '').toLowerCase();
            const adm = String(s.admission_number || '').toLowerCase();
            return fullName.includes(term) || roll.includes(term) || adm.includes(term);
        });
    }, [students, searchTerm]);
    // Format date-time for display
    const formatDateTime = (dateStr) => {
        if (!dateStr)
            return '';
        try {
            const d = new Date(dateStr);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        catch {
            return dateStr;
        }
    };

    // Selected class and section helper objects
    const selectedClassObj = classes.find(c => Number(c.id) === Number(selectedClassId));
    const selectedSectionObj = sections.find(s => Number(s.id) === Number(selectedSectionId) || Number(s.section_id) === Number(selectedSectionId));

    return (<div className="space-y-6">
      {/* 1. Primary Top Filter Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Branch */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Branch
              </label>
              <select
                id="attendance-branch-select"
                value={selectedBranchId}
                onChange={(e) => {
                  const newBranchId = Number(e.target.value);
                  setSelectedBranchId(newBranchId);
                  setSelectedClassId('');
                  setSelectedSectionId('');
                }}
                disabled={userRole !== 'super_admin'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-75 cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Academic Year
              </label>
              <select
                id="attendance-ay-select"
                value={selectedAcademicYearId}
                onChange={(e) => {
                  const newAyId = Number(e.target.value);
                  setSelectedAcademicYearId(newAyId);
                  setSelectedClassId('');
                  setSelectedSectionId('');
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name} {ay.is_active ? '(Active)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                id="attendance-date-input"
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full text-xs font-semibold h-9"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Class <span className="text-destructive">*</span>
              </label>
              <select
                id="attendance-class-select"
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(Number(e.target.value));
                  setSelectedSectionId('');
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                {classes.length === 0 && <option value="">No classes found</option>}
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Section <span className="text-destructive">*</span>
              </label>
              <select
                id="attendance-section-select"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(Number(e.target.value))}
                disabled={sections.length === 0}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 cursor-pointer"
              >
                {sections.length === 0 && <option value="">No sections found</option>}
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    Section {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Timing Schedule Prerequisite State Banners */}
      {selectedClassId && selectedSectionId && hasTimingMapping === false && !isLoadingTiming && (
        <Card className="bg-amber-50/60 dark:bg-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  Attendance Timing Schedule Required
                </span>
                <Badge variant="destructive" className="text-[10px] uppercase font-black">
                  Action Needed
                </Badge>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 font-medium leading-relaxed">
                Class <strong>{selectedClassObj?.name || `Class #${selectedClassId}`}</strong> (Section <strong>{selectedSectionObj?.name || 'A'}</strong>) does not have an active attendance timing assigned for <strong>{academicYearName || activeAcademicYear?.name || 'the current academic year'}</strong>.
                You cannot take or record attendance until an attendance timing schedule (session window) is mapped to this class.
              </p>
            </div>
          </div>
          <Button
            type="button"
            id="map-timing-schedule-btn"
            onClick={() => onNavigateToMapping && onNavigateToMapping({ classId: selectedClassId, sectionId: selectedSectionId })}
            variant="destructive"
            className="shrink-0 text-xs font-black cursor-pointer shadow-xs"
          >
            <Layers className="w-4 h-4 mr-1.5" />
            <span>Map Timing Schedule Now →</span>
          </Button>
        </Card>
      )}

      {selectedClassId && selectedSectionId && hasTimingMapping === true && activeTiming && (
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 px-5 py-3 rounded-xl flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex flex-wrap items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Assigned Schedule: <strong>{activeTiming.name}</strong></span>
            <span className="text-emerald-300 dark:text-emerald-700">•</span>
            <span className="font-semibold text-foreground">
              Morning: {activeTiming.morning_start_time || activeTiming.start_time} - {activeTiming.morning_end_time || activeTiming.end_time}
            </span>
            {Boolean(activeTiming.is_second_session) && activeTiming.afternoon_start_time && (
              <>
                <span className="text-emerald-300 dark:text-emerald-700">•</span>
                <span className="font-semibold text-foreground">
                  Afternoon: {activeTiming.afternoon_start_time} - {activeTiming.afternoon_end_time}
                </span>
              </>
            )}
            {activeTiming.grace_period > 0 && (
              <Badge variant="outline" className="text-[10px] bg-background text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700">
                Grace: {activeTiming.grace_period}m
              </Badge>
            )}
          </div>
          <button
            type="button"
            onClick={() => onNavigateToMapping && onNavigateToMapping({ classId: selectedClassId, sectionId: selectedSectionId })}
            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Change Timing Mapping</span>
          </button>
        </div>
      )}

      {/* Existing Attendance Warning Banner */}
      {existingRecord?.exists && (
        <div className={`p-4 rounded-xl border transition-all ${
          isEditMode
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start space-x-3.5">
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isEditMode ? 'text-amber-600' : 'text-indigo-600'}`} />
              <div>
                <div className="text-xs font-black flex items-center space-x-2">
                  <span>Attendance already marked for this class on {attendanceDate}.</span>
                  <Badge variant={isEditMode ? 'destructive' : 'default'} className="text-[10px] font-black uppercase">
                    {isEditMode ? 'Edit Mode Active' : 'View Only Mode'}
                  </Badge>
                </div>
                <p className="text-[11px] mt-1 text-muted-foreground">
                  Marked by <strong>{existingRecord.submitted_by || 'Staff'}</strong> at {formatDateTime(existingRecord.submitted_at)}
                  {existingRecord.updated_by ? ` • Last updated by ${existingRecord.updated_by} at ${formatDateTime(existingRecord.updated_at)}` : ''}.
                  {!isEditMode && ' Controls are locked to prevent accidental changes.'}
                </p>
              </div>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <Button
                type="button"
                id="view-only-mode-btn"
                variant={!isEditMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsEditMode(false)}
                className="text-xs font-bold"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                <span>View Only</span>
              </Button>

              <Button
                type="button"
                id="edit-attendance-mode-btn"
                variant={isEditMode ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setIsEditMode(true)}
                className="text-xs font-bold"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                <span>Edit Attendance</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Live Statistics Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
        <Card className="p-3.5 text-center shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
          <div className="text-xl font-black text-foreground mt-0.5">{counts.total}</div>
        </Card>

        <Card className="p-3.5 text-center shadow-xs bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Present</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{counts.present}</div>
        </Card>

        <Card className="p-3.5 text-center shadow-xs bg-destructive/10 border-destructive/20">
          <span className="text-[11px] font-bold text-destructive uppercase tracking-wider">Absent</span>
          <div className="text-xl font-black text-destructive mt-0.5">{counts.absent}</div>
        </Card>

        <Card className="p-3.5 text-center shadow-xs bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40">
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Leave</span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{counts.leave}</div>
        </Card>

        <Card className="p-3.5 text-center shadow-xs bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/40">
          <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">Late</span>
          <div className="text-xl font-black text-sky-600 dark:text-sky-400 mt-0.5">{counts.late}</div>
        </Card>

        <Card className="p-3.5 text-center shadow-xs bg-primary text-primary-foreground">
          <span className="text-[11px] font-bold opacity-80 uppercase tracking-wider">% Rate</span>
          <div className="text-xl font-black mt-0.5">{counts.percentage}%</div>
        </Card>
      </div>

      {/* 4. Student Roster & Marking Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        {/* Table Action Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-850">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input id="student-search-input" type="text" placeholder="Search student name, roll..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
            </div>

            {/* Session Filter Tabs (Visible when timing has second session or always for session clarity) */}
            {Boolean(activeTiming?.is_second_session) && (
              <div className="flex items-center bg-slate-200/80 dark:bg-slate-750 p-0.5 rounded-lg text-xs font-bold" id="session-selector-tabs">
                <button
                  type="button"
                  id="session-tab-both"
                  onClick={() => setSelectedSessionTab('both')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedSessionTab === 'both'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Both Sessions
                </button>
                <button
                  type="button"
                  id="session-tab-morning"
                  onClick={() => setSelectedSessionTab('morning')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedSessionTab === 'morning'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ☀️ {activeTiming.session_1_name || 'Morning'}
                </button>
                <button
                  type="button"
                  id="session-tab-afternoon"
                  onClick={() => setSelectedSessionTab('afternoon')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedSessionTab === 'afternoon'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🌙 {activeTiming.session_2_name || 'Afternoon'}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {/* Mark All Present Button */}
            <button
              type="button"
              id="mark-all-present-btn"
              onClick={() => handleMarkAllPresent(selectedSessionTab)}
              disabled={isReadOnly || students.length === 0}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={`One click: set all students to Present for ${selectedSessionTab === 'morning' ? 'Morning' : selectedSessionTab === 'afternoon' ? 'Afternoon' : 'All sessions'}`}
            >
              <Check className="w-4 h-4 stroke-[3]"/>
              <span>
                Mark All Present
                {Boolean(activeTiming?.is_second_session) && selectedSessionTab !== 'both' && (
                  <span className="ml-1 opacity-90">({selectedSessionTab === 'morning' ? 'Morning' : 'Afternoon'})</span>
                )}
              </span>
            </button>

            {/* Top Save Button */}
            <button
              type="button"
              id="submit-attendance-top-btn"
              onClick={handleSubmit}
              disabled={isReadOnly || isSubmitting || students.length === 0}
              className={`inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors ${
                isTimingMissing
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 cursor-not-allowed opacity-90'
                  : isReadOnly
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title={isTimingMissing ? 'Map attendance timing schedule first' : undefined}
            >
              <CalendarCheck className="w-4 h-4"/>
              <span>
                {isSubmitting
                  ? 'Saving...'
                  : isTimingMissing
                    ? 'Timing Required to Save'
                    : existingRecord?.exists
                      ? 'Update Attendance'
                      : 'Save Attendance'}
              </span>
            </button>
          </div>
        </div>

        {/* Student Table */}
        {isLoadingStudents ? (<div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3"/>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading students...</p>
          </div>) : filteredStudents.length === 0 ? (<div className="p-12 text-center">
            <UserX className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2"/>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">No enrolled students found</h4>
            <p className="text-xs text-slate-500 mt-0.5">Please check class and section selection.</p>
          </div>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-xs" id="attendance-rollcall-table">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Admission No</th>

                  {/* Dynamic Session Headers according to Attendance Timings */}
                  {Boolean(activeTiming?.is_second_session) && selectedSessionTab === 'both' ? (
                    <>
                      <th className="py-3 px-4 text-center bg-amber-50/50 dark:bg-amber-950/20 border-x border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-center space-x-1">
                          <span>☀️ {activeTiming.session_1_name || 'Morning'}</span>
                          <span className="text-[10px] lowercase font-normal opacity-70">
                            ({activeTiming.morning_start_time || activeTiming.start_time} - {activeTiming.morning_end_time || activeTiming.end_time})
                          </span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-center bg-indigo-50/50 dark:bg-indigo-950/20 border-r border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-center space-x-1">
                          <span>🌙 {activeTiming.session_2_name || 'Afternoon'}</span>
                          <span className="text-[10px] lowercase font-normal opacity-70">
                            ({activeTiming.afternoon_start_time} - {activeTiming.afternoon_end_time})
                          </span>
                        </div>
                      </th>
                    </>
                  ) : Boolean(activeTiming?.is_second_session) && selectedSessionTab === 'morning' ? (
                    <th className="py-3 px-4 text-center bg-amber-50/50 dark:bg-amber-950/20 border-x border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-center space-x-1">
                        <span>☀️ {activeTiming.session_1_name || 'Morning Session'}</span>
                        <span className="text-[10px] lowercase font-normal opacity-70">
                          ({activeTiming.morning_start_time || activeTiming.start_time} - {activeTiming.morning_end_time || activeTiming.end_time})
                        </span>
                      </div>
                    </th>
                  ) : Boolean(activeTiming?.is_second_session) && selectedSessionTab === 'afternoon' ? (
                    <th className="py-3 px-4 text-center bg-indigo-50/50 dark:bg-indigo-950/20 border-x border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-center space-x-1">
                        <span>🌙 {activeTiming.session_2_name || 'Afternoon Session'}</span>
                        <span className="text-[10px] lowercase font-normal opacity-70">
                          ({activeTiming.afternoon_start_time} - {activeTiming.afternoon_end_time})
                        </span>
                      </div>
                    </th>
                  ) : (
                    <th className="py-3 px-4 text-center">Attendance Status</th>
                  )}

                  <th className="py-3 px-4 min-w-[200px]">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st, idx) => {
                const item = attendanceMap[st.student_id] || {};
                const currentStatus = item.status || 'Present';
                const currentMorning = item.morning_status || currentStatus || 'Present';
                const currentAfternoon = item.afternoon_status || currentStatus || 'Present';
                const currentRemark = item.remarks || '';
                const currentCustomRemark = item.custom_remark || '';
                const isOtherSelected = currentRemark === 'Other';
                const hasTwo = Boolean(activeTiming?.is_second_session);

                // Helper to render status button group
                const renderButtonGroup = (targetSession, currentVal, prefix = '') => (
                  <div className="flex items-center justify-center space-x-1.5">
                    {/* Present Button */}
                    <button
                      type="button"
                      id={`${prefix}status-present-${st.student_id}`}
                      onClick={() => handleSetStatus(st.student_id, 'Present', targetSession)}
                      disabled={isReadOnly}
                      className={`min-w-[62px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        currentVal === 'Present'
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600 ring-offset-1 dark:ring-offset-slate-900'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                      } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <span>Present</span>
                    </button>

                    {/* Absent Button */}
                    <button
                      type="button"
                      id={`${prefix}status-absent-${st.student_id}`}
                      onClick={() => handleSetStatus(st.student_id, 'Absent', targetSession)}
                      disabled={isReadOnly}
                      className={`min-w-[62px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        currentVal === 'Absent'
                          ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-600 ring-offset-1 dark:ring-offset-slate-900'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-500 hover:text-rose-700'
                      } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <span>Absent</span>
                    </button>

                    {/* Leave Button */}
                    <button
                      type="button"
                      id={`${prefix}status-leave-${st.student_id}`}
                      onClick={() => handleSetStatus(st.student_id, 'Leave', targetSession)}
                      disabled={isReadOnly}
                      className={`min-w-[58px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        currentVal === 'Leave'
                          ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-slate-900'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:text-amber-700'
                      } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <span>Leave</span>
                    </button>

                    {/* Late Button */}
                    <button
                      type="button"
                      id={`${prefix}status-late-${st.student_id}`}
                      onClick={() => handleSetStatus(st.student_id, 'Late', targetSession)}
                      disabled={isReadOnly}
                      className={`min-w-[54px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        currentVal === 'Late'
                          ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-slate-900'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-700'
                      } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <span>Late</span>
                    </button>
                  </div>
                );

                return (<tr key={st.student_id} className={`transition-colors ${currentStatus === 'Absent'
                        ? 'bg-rose-50/40 dark:bg-rose-950/20'
                        : currentStatus === 'Leave'
                            ? 'bg-amber-50/30 dark:bg-amber-950/20'
                            : currentStatus === 'Late'
                                ? 'bg-blue-50/30 dark:bg-blue-950/20'
                                : 'hover:bg-slate-50/70 dark:hover:bg-slate-750'}`}>
                      {/* Roll Number */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {st.roll_number ?? (idx + 1)}
                      </td>

                      {/* Student Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {st.first_name} {st.last_name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Gender: {st.gender || '—'}
                        </div>
                      </td>

                      {/* Admission Number */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {st.admission_number}
                      </td>

                      {/* Dynamic Session Button Columns */}
                      {hasTwo && selectedSessionTab === 'both' ? (
                        <>
                          <td className="py-3.5 px-3 bg-amber-50/20 dark:bg-amber-950/10 border-x border-slate-200 dark:border-slate-700">
                            {renderButtonGroup('morning', currentMorning, 'morn-')}
                          </td>
                          <td className="py-3.5 px-3 bg-indigo-50/20 dark:bg-indigo-950/10 border-r border-slate-200 dark:border-slate-700">
                            {renderButtonGroup('afternoon', currentAfternoon, 'aft-')}
                          </td>
                        </>
                      ) : hasTwo && selectedSessionTab === 'morning' ? (
                        <td className="py-3.5 px-4 bg-amber-50/20 dark:bg-amber-950/10 border-x border-slate-200 dark:border-slate-700">
                          {renderButtonGroup('morning', currentMorning, 'morn-')}
                        </td>
                      ) : hasTwo && selectedSessionTab === 'afternoon' ? (
                        <td className="py-3.5 px-4 bg-indigo-50/20 dark:bg-indigo-950/10 border-x border-slate-200 dark:border-slate-700">
                          {renderButtonGroup('afternoon', currentAfternoon, 'aft-')}
                        </td>
                      ) : (
                        <td className="py-3.5 px-4">
                          {renderButtonGroup('both', currentStatus)}
                        </td>
                      )}

                      {/* Remarks Dropdown + Custom Remark Input */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <select id={`remark-select-${st.student_id}`} value={currentRemark} onChange={e => handleSetRemarks(st.student_id, e.target.value)} disabled={isReadOnly} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed">
                            <option value="">— Select standard remark —</option>
                            {(Array.isArray(standardRemarks) && standardRemarks.length > 0 ? standardRemarks : [
                              { id: 1, name: 'Medical Leave' },
                              { id: 2, name: 'Family Function' },
                              { id: 3, name: 'Late Arrival with Permission' },
                              { id: 4, name: 'Disciplinary Absence' },
                              { id: 5, name: 'Sports / Inter-school Event' }
                            ])
                              .filter(rem => (rem.name || rem.text) !== 'Other')
                              .map(rem => {
                                const val = rem.name || rem.text || '';
                                return (<option key={rem.id || val} value={val}>{val}</option>);
                              })}
                            <option value="Other">Other (Type custom remark)</option>
                          </select>

                          {/* Custom Remark Input (only when "Other" selected) */}
                          {isOtherSelected && (<input type="text" id={`custom-remark-input-${st.student_id}`} placeholder="Enter custom remark..." value={currentCustomRemark} onChange={e => handleSetCustomRemark(st.student_id, e.target.value)} disabled={isReadOnly} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/30 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 disabled:opacity-75 disabled:cursor-not-allowed animate-fadeIn"/>)}
                        </div>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>
          </div>)}

        {/* Bottom Submission Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Current user: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser?.full_name || (userRole === 'super_admin' ? 'Super Admin' : 'Staff')}</span>
            {existingRecord?.exists && !isEditMode && (<span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                (Click "Edit Attendance" above to make changes)
              </span>)}
          </div>

          <button
            type="button"
            id="submit-attendance-bottom-btn"
            onClick={handleSubmit}
            disabled={isReadOnly || isSubmitting || students.length === 0}
            className={`inline-flex items-center space-x-2 px-8 py-2.5 rounded-lg text-xs font-black shadow-md transition-colors ${
              isTimingMissing
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 cursor-not-allowed opacity-90'
                : isReadOnly
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title={isTimingMissing ? 'Map attendance timing schedule first' : undefined}
          >
            <CalendarCheck className="w-4 h-4"/>
            <span>
              {isSubmitting
                ? 'Saving Attendance...'
                : isTimingMissing
                  ? 'Timing Schedule Required'
                  : existingRecord?.exists
                    ? 'Update Attendance'
                    : 'Save Attendance'}
            </span>
          </button>
        </div>
      </div>

      {/* Absent Notification Modal */}
      {isNotifModalOpen && (<AbsentNotificationModal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} branchId={selectedBranchId} academicYearId={selectedAcademicYearId} attendanceDate={attendanceDate} absentStudents={absentStudentsToNotify} onSuccess={() => {
                setIsNotifModalOpen(false);
                loadRoster();
            }}/>)}
    </div>);
};
