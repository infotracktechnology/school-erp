import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, Search, ArrowLeft, RefreshCw, AlertTriangle, Users, GraduationCap, CreditCard, CalendarCheck, BookOpen, UserCheck, Building2 } from 'lucide-react';
import { getDashboardDrillDown } from '../../services/api';
export const DrillDownModal = ({ isOpen, onClose, initialType, initialBranchId = 'all', academicYearName = '2026-2027', onSelectBranch }) => {
    const [currentType, setCurrentType] = useState(initialType);
    const [currentLevel, setCurrentLevel] = useState('overall');
    const [selectedBranchId, setSelectedBranchId] = useState(initialBranchId);
    const [selectedClassId, setSelectedClassId] = useState(undefined);
    const [selectedSectionId, setSelectedSectionId] = useState(undefined);
    const [selectedGender, setSelectedGender] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [drillData, setDrillData] = useState(null);
    const [error, setError] = useState(null);
    // Sync with initial props when opened
    useEffect(() => {
        if (isOpen) {
            setCurrentType(initialType);
            setSelectedBranchId(initialBranchId);
            setCurrentLevel(initialBranchId !== 'all' && initialBranchId ? 'branch' : 'overall');
            setSelectedClassId(undefined);
            setSelectedSectionId(undefined);
            setSelectedGender('all');
            setSearchTerm('');
            setPage(1);
        }
    }, [isOpen, initialType, initialBranchId]);
    // Fetch drill-down data
    const fetchData = useCallback(async () => {
        if (!isOpen)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await getDashboardDrillDown({
                type: currentType,
                level: currentLevel,
                branch_id: selectedBranchId,
                academic_year_name: academicYearName,
                class_id: selectedClassId,
                section_id: selectedSectionId,
                gender: selectedGender,
                search: searchTerm,
                page,
                limit: 10
            });
            setDrillData(res);
        }
        catch (err) {
            console.error('Failed to load drill-down data:', err);
            setError(err.message || 'Could not fetch drill-down records.');
        }
        finally {
            setIsLoading(false);
        }
    }, [isOpen, currentType, currentLevel, selectedBranchId, academicYearName, selectedClassId, selectedSectionId, selectedGender, searchTerm, page]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    if (!isOpen)
        return null;
    // Handlers for progressive drill-down navigation
    const handleNavigateStep = (crumb) => {
        setCurrentLevel(crumb.level);
        if (crumb.params) {
            if (crumb.params.branch_id !== undefined)
                setSelectedBranchId(crumb.params.branch_id);
            if (crumb.params.class_id !== undefined)
                setSelectedClassId(crumb.params.class_id);
            else
                setSelectedClassId(undefined);
            if (crumb.params.section_id !== undefined)
                setSelectedSectionId(crumb.params.section_id);
            else
                setSelectedSectionId(undefined);
            if (crumb.params.gender !== undefined)
                setSelectedGender(crumb.params.gender);
            else
                setSelectedGender('all');
        }
        setPage(1);
    };
    const handleRowClick = (row) => {
        if (currentType === 'attendance') {
            if (currentLevel === 'overall') {
                setSelectedBranchId(row.branch_id || row.id);
                setCurrentLevel('branch');
                setPage(1);
            }
            else if (currentLevel === 'branch') {
                setSelectedClassId(row.class_id || row.id);
                setCurrentLevel('class');
                setPage(1);
            }
            else if (currentLevel === 'class') {
                setSelectedSectionId(row.section_id || row.id);
                setCurrentLevel('section');
                setPage(1);
            }
            else if (currentLevel === 'section') {
                setSelectedGender(row.gender);
                setCurrentLevel('student');
                setPage(1);
            }
        }
        else if (currentType === 'examination') {
            if (currentLevel === 'overall') {
                setSelectedBranchId(row.branch_id || row.id);
                setCurrentLevel('branch');
                setPage(1);
            }
            else if (currentLevel === 'branch') {
                setCurrentLevel('class');
                setPage(1);
            }
        }
        else if (currentType === 'students') {
            if (currentLevel === 'overall') {
                setSelectedBranchId(row.branch_id || row.id);
                setCurrentLevel('student');
                setPage(1);
            }
        }
    };
    const formatINR = (val) => {
        if (val >= 10000000)
            return `₹ ${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000)
            return `₹ ${(val / 100000).toFixed(2)} L`;
        return `₹ ${val.toLocaleString('en-IN')}`;
    };
    return (<div id="drilldown-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div id="drilldown-modal-container" className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-xl">
              {currentType === 'attendance' && <CalendarCheck className="w-5 h-5"/>}
              {currentType === 'examination' && <GraduationCap className="w-5 h-5"/>}
              {currentType === 'gradebook' && <BookOpen className="w-5 h-5"/>}
              {currentType === 'students' && <Users className="w-5 h-5"/>}
              {currentType === 'admissions' && <UserCheck className="w-5 h-5"/>}
              {currentType === 'fees' && <CreditCard className="w-5 h-5"/>}
              {currentType === 'staff' && <Building2 className="w-5 h-5"/>}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Multi-Branch Drill-Down Analysis
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {academicYearName}
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Progressive hierarchical investigation across branches, classes, sections, and students.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button id="drilldown-refresh-btn" onClick={() => fetchData()} disabled={isLoading} title="Refresh Data" className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
            </button>
            <button id="drilldown-close-btn" onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Module Type Selector Tabs */}
        <div className="px-6 py-2.5 bg-gray-100/70 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'examination', label: 'Examination', icon: GraduationCap },
            { id: 'gradebook', label: 'Grade Book', icon: BookOpen },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'admissions', label: 'Admissions', icon: UserCheck },
            { id: 'fees', label: 'Fees & Finance', icon: CreditCard },
            { id: 'staff', label: 'Staff & HR', icon: Building2 }
        ].map(tab => {
            const Icon = tab.icon;
            const active = currentType === tab.id;
            return (<button key={tab.id} id={`drilldown-tab-${tab.id}`} onClick={() => {
                    setCurrentType(tab.id);
                    setCurrentLevel('overall');
                    setSelectedBranchId('all');
                    setSelectedClassId(undefined);
                    setSelectedSectionId(undefined);
                    setSelectedGender('all');
                    setPage(1);
                }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
                <Icon className="w-3.5 h-3.5"/>
                {tab.label}
              </button>);
        })}
        </div>

        {/* Breadcrumb Navigation Bar */}
        <div className="px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto py-0.5">
            {drillData?.breadcrumbs?.map((crumb, idx) => {
            const isLast = idx === (drillData.breadcrumbs.length - 1);
            return (<React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0"/>}
                  <button id={`drilldown-crumb-${idx}`} onClick={() => handleNavigateStep(crumb)} disabled={isLast} className={`font-semibold px-2 py-1 rounded transition-colors whitespace-nowrap ${isLast
                    ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {crumb.label}
                  </button>
                </React.Fragment>);
        })}
          </nav>

          {/* Filter & Search controls */}
          <div className="flex items-center gap-2">
            {currentLevel === 'student' && (<div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input id="drilldown-search-input" type="text" placeholder="Search student or roll no..." value={searchTerm} onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
            }} className="pl-8 pr-3 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-44"/>
              </div>)}

            {currentLevel === 'student' && (<select id="drilldown-gender-filter" value={selectedGender} onChange={(e) => {
                setSelectedGender(e.target.value);
                setPage(1);
            }} className="text-xs py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>)}

            {currentLevel !== 'overall' && (<button id="drilldown-back-btn" onClick={() => {
                if (currentLevel === 'student')
                    setCurrentLevel(selectedSectionId ? 'section' : 'branch');
                else if (currentLevel === 'section')
                    setCurrentLevel('class');
                else if (currentLevel === 'class')
                    setCurrentLevel('branch');
                else
                    setCurrentLevel('overall');
                setPage(1);
            }} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5"/>
                Up One Level
              </button>)}
          </div>
        </div>

        {/* Modal Body / Table Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Summary Badge Row */}
          {drillData?.summary && (<div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  Level Scope
                </span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {drillData.summary.title || 'Summary Overview'}
                </h4>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {drillData.summary.total_students !== undefined && (<div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Total Students</div>
                    <div className="font-bold text-gray-900 dark:text-white">{drillData.summary.total_students.toLocaleString()}</div>
                  </div>)}
                {drillData.summary.attendance_percentage !== undefined && (<div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Avg Attendance</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">{drillData.summary.attendance_percentage}%</div>
                  </div>)}
                {drillData.summary.present !== undefined && (<div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Present Today</div>
                    <div className="font-bold text-emerald-600">{drillData.summary.present}</div>
                  </div>)}
                {drillData.summary.absent !== undefined && (<div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Absent</div>
                    <div className="font-bold text-rose-600">{drillData.summary.absent}</div>
                  </div>)}
                {drillData.summary.total_demand !== undefined && (<div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Total Demand</div>
                    <div className="font-bold text-gray-900 dark:text-white">{formatINR(drillData.summary.total_demand)}</div>
                  </div>)}
              </div>
            </div>)}

          {/* Loading Indicator */}
          {isLoading ? (<div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600"/>
              <p className="text-sm font-medium">Aggregating real-time drill-down metrics...</p>
            </div>) : error ? (<div className="py-12 text-center text-rose-600 dark:text-rose-400 space-y-2">
              <AlertTriangle className="w-8 h-8 mx-auto"/>
              <p className="text-sm font-semibold">{error}</p>
            </div>) : !drillData || drillData.data.length === 0 ? (<div className="py-12 text-center text-gray-500 space-y-1">
              <Users className="w-8 h-8 mx-auto text-gray-400"/>
              <p className="text-sm font-medium">No records found for current drill-down filters.</p>
            </div>) : (<div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  {/* DYNAMIC COLUMNS BASED ON TYPE AND LEVEL */}
                  {currentType === 'attendance' && (<tr>
                      {currentLevel === 'overall' && (<>
                          <th className="py-3 px-4 font-semibold">Branch Name</th>
                          <th className="py-3 px-4 font-semibold">City</th>
                          <th className="py-3 px-4 font-semibold text-right">Total Students</th>
                          <th className="py-3 px-4 font-semibold text-right text-emerald-600">Present</th>
                          <th className="py-3 px-4 font-semibold text-right text-rose-600">Absent</th>
                          <th className="py-3 px-4 font-semibold text-right text-amber-600">Leave</th>
                          <th className="py-3 px-4 font-semibold text-right">Attendance %</th>
                          <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </>)}
                      {currentLevel === 'branch' && (<>
                          <th className="py-3 px-4 font-semibold">Class Name</th>
                          <th className="py-3 px-4 font-semibold text-right">Students</th>
                          <th className="py-3 px-4 font-semibold text-right text-emerald-600">Present</th>
                          <th className="py-3 px-4 font-semibold text-right text-rose-600">Absent</th>
                          <th className="py-3 px-4 font-semibold text-right">Attendance %</th>
                          <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </>)}
                      {currentLevel === 'class' && (<>
                          <th className="py-3 px-4 font-semibold">Section</th>
                          <th className="py-3 px-4 font-semibold text-right">Total Students</th>
                          <th className="py-3 px-4 font-semibold text-right text-emerald-600">Present</th>
                          <th className="py-3 px-4 font-semibold text-right text-rose-600">Absent</th>
                          <th className="py-3 px-4 font-semibold text-right">Attendance %</th>
                          <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </>)}
                      {currentLevel === 'section' && (<>
                          <th className="py-3 px-4 font-semibold">Gender</th>
                          <th className="py-3 px-4 font-semibold text-right">Total Students</th>
                          <th className="py-3 px-4 font-semibold text-right text-emerald-600">Present</th>
                          <th className="py-3 px-4 font-semibold text-right text-rose-600">Absent</th>
                          <th className="py-3 px-4 font-semibold text-right">Attendance %</th>
                          <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </>)}
                      {currentLevel === 'student' && (<>
                          <th className="py-3 px-4 font-semibold">Admission No</th>
                          <th className="py-3 px-4 font-semibold">Student Name</th>
                          <th className="py-3 px-4 font-semibold">Gender</th>
                          <th className="py-3 px-4 font-semibold">Class & Sec</th>
                          <th className="py-3 px-4 font-semibold text-right">Attendance %</th>
                          <th className="py-3 px-4 font-semibold text-center">Status Today</th>
                        </>)}
                    </tr>)}

                  {currentType === 'examination' && (<tr>
                      {currentLevel === 'overall' && (<>
                          <th className="py-3 px-4 font-semibold">Branch Name</th>
                          <th className="py-3 px-4 font-semibold text-center">Exams Scheduled</th>
                          <th className="py-3 px-4 font-semibold text-center text-emerald-600">Completed</th>
                          <th className="py-3 px-4 font-semibold text-center text-amber-600">Pending</th>
                          <th className="py-3 px-4 font-semibold text-center">Marks Entered</th>
                          <th className="py-3 px-4 font-semibold text-center">Results</th>
                          <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </>)}
                      {currentLevel === 'branch' && (<>
                          <th className="py-3 px-4 font-semibold">Exam Name</th>
                          <th className="py-3 px-4 font-semibold">Term</th>
                          <th className="py-3 px-4 font-semibold text-center">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Classes Complete</th>
                          <th className="py-3 px-4 font-semibold text-right">Marks Entered %</th>
                          <th className="py-3 px-4 font-semibold text-center">Results</th>
                          <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </>)}
                      {currentLevel === 'class' && (<>
                          <th className="py-3 px-4 font-semibold">Class Name</th>
                          <th className="py-3 px-4 font-semibold text-center">Subjects</th>
                          <th className="py-3 px-4 font-semibold">Marks Status</th>
                          <th className="py-3 px-4 font-semibold text-center">Results Publication</th>
                        </>)}
                    </tr>)}

                  {currentType === 'gradebook' && (<tr>
                      <th className="py-3 px-4 font-semibold">Class & Section</th>
                      <th className="py-3 px-4 font-semibold">Subject</th>
                      <th className="py-3 px-4 font-semibold">Assigned Teacher</th>
                      <th className="py-3 px-4 font-semibold text-center">Status</th>
                      <th className="py-3 px-4 font-semibold text-center">Verified</th>
                      <th className="py-3 px-4 font-semibold">Last Updated</th>
                    </tr>)}

                  {currentType === 'students' && (<tr>
                      <th className="py-3 px-4 font-semibold">Admission No</th>
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Gender</th>
                      <th className="py-3 px-4 font-semibold">Class & Sec</th>
                      <th className="py-3 px-4 font-semibold">Admission Date</th>
                      <th className="py-3 px-4 font-semibold text-center">Status</th>
                      <th className="py-3 px-4 font-semibold text-center">Fee Status</th>
                    </tr>)}

                  {currentType === 'admissions' && (<tr>
                      <th className="py-3 px-4 font-semibold">Grade Level</th>
                      <th className="py-3 px-4 font-semibold text-right">Enquiries</th>
                      <th className="py-3 px-4 font-semibold text-right">Applications</th>
                      <th className="py-3 px-4 font-semibold text-right">Entrance Test</th>
                      <th className="py-3 px-4 font-semibold text-right">Selected</th>
                      <th className="py-3 px-4 font-semibold text-right text-emerald-600">Admitted</th>
                      <th className="py-3 px-4 font-semibold text-right">Pending</th>
                    </tr>)}

                  {currentType === 'fees' && (<tr>
                      <th className="py-3 px-4 font-semibold">Fee Category</th>
                      <th className="py-3 px-4 font-semibold text-right">Demand Amount</th>
                      <th className="py-3 px-4 font-semibold text-right text-emerald-600">Collected</th>
                      <th className="py-3 px-4 font-semibold text-right text-rose-600">Pending Dues</th>
                      <th className="py-3 px-4 font-semibold text-right">Overdue</th>
                      <th className="py-3 px-4 font-semibold text-right">Recovery Rate</th>
                    </tr>)}

                  {currentType === 'staff' && (<tr>
                      <th className="py-3 px-4 font-semibold">Department</th>
                      <th className="py-3 px-4 font-semibold">Department Head</th>
                      <th className="py-3 px-4 font-semibold text-right">Total Staff</th>
                      <th className="py-3 px-4 font-semibold text-right">Teaching</th>
                      <th className="py-3 px-4 font-semibold text-right">Non-Teaching</th>
                      <th className="py-3 px-4 font-semibold text-right text-emerald-600">Present Today</th>
                      <th className="py-3 px-4 font-semibold text-right text-rose-600">Absent</th>
                    </tr>)}
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {drillData.data.map((row, rIdx) => {
                const isClickable = ((currentType === 'attendance' && currentLevel !== 'student') ||
                    (currentType === 'examination' && currentLevel !== 'class') ||
                    (currentType === 'students' && currentLevel === 'overall'));
                return (<tr key={rIdx} onClick={() => isClickable && handleRowClick(row)} className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors ${isClickable ? 'cursor-pointer' : ''}`}>
                        {/* ATTENDANCE BODY ROWS */}
                        {currentType === 'attendance' && currentLevel === 'overall' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600"/>
                              {row.branch_name}
                            </td>
                            <td className="py-3 px-4 text-gray-500">{row.city}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.total_students?.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{row.present?.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right font-medium text-rose-600">{row.absent?.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right font-medium text-amber-600">{row.leave?.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                              {row.attendance_percentage}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto">
                                View Classes <ChevronRight className="w-3.5 h-3.5"/>
                              </button>
                            </td>
                          </>)}

                        {currentType === 'attendance' && currentLevel === 'branch' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                              {row.class_name}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">{row.total_students}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{row.present}</td>
                            <td className="py-3 px-4 text-right font-medium text-rose-600">{row.absent}</td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{row.attendance_percentage}%</td>
                            <td className="py-3 px-4 text-center">
                              <button className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto">
                                View Sections <ChevronRight className="w-3.5 h-3.5"/>
                              </button>
                            </td>
                          </>)}

                        {currentType === 'attendance' && currentLevel === 'class' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                              Section {row.section_name}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">{row.total_students}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{row.present}</td>
                            <td className="py-3 px-4 text-right font-medium text-rose-600">{row.absent}</td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{row.attendance_percentage}%</td>
                            <td className="py-3 px-4 text-center">
                              <button className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto">
                                View Gender Split <ChevronRight className="w-3.5 h-3.5"/>
                              </button>
                            </td>
                          </>)}

                        {currentType === 'attendance' && currentLevel === 'section' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                              {row.gender} Students
                            </td>
                            <td className="py-3 px-4 text-right font-medium">{row.total_students}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{row.present}</td>
                            <td className="py-3 px-4 text-right font-medium text-rose-600">{row.absent}</td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{row.attendance_percentage}%</td>
                            <td className="py-3 px-4 text-center">
                              <button className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto">
                                View Student List <ChevronRight className="w-3.5 h-3.5"/>
                              </button>
                            </td>
                          </>)}

                        {currentType === 'attendance' && currentLevel === 'student' && (<>
                            <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                              {row.admission_number}
                            </td>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                              {row.student_name}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{row.gender}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{row.class_name} - {row.section_name}</td>
                            <td className="py-3 px-4 text-right font-bold">{row.attendance_percentage}%</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : row.status === 'Absent'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                                {row.status}
                              </span>
                            </td>
                          </>)}

                        {/* EXAMINATION BODY ROWS */}
                        {currentType === 'examination' && currentLevel === 'overall' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600"/>
                              {row.branch_name}
                            </td>
                            <td className="py-3 px-4 text-center">{row.exams_scheduled}</td>
                            <td className="py-3 px-4 text-center text-emerald-600 font-semibold">{row.completed}</td>
                            <td className="py-3 px-4 text-center text-amber-600 font-semibold">{row.pending}</td>
                            <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">{row.marks_entered}</td>
                            <td className="py-3 px-4 text-center">{row.results_published}</td>
                            <td className="py-3 px-4 text-center">
                              <button className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto">
                                Inspect Exams <ChevronRight className="w-3.5 h-3.5"/>
                              </button>
                            </td>
                          </>)}

                        {currentType === 'examination' && currentLevel === 'branch' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.exam_name}</td>
                            <td className="py-3 px-4 text-gray-500">{row.term}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-medium">{row.classes_completed} / {row.total_classes}</td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{row.marks_entered_pct}%</td>
                            <td className="py-3 px-4 text-center font-semibold text-blue-600">{row.results_published}</td>
                            <td className="py-3 px-4 text-center">
                              <button className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto">
                                Class View <ChevronRight className="w-3.5 h-3.5"/>
                              </button>
                            </td>
                          </>)}

                        {currentType === 'examination' && currentLevel === 'class' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.class_name}</td>
                            <td className="py-3 px-4 text-center">{row.subjects_count}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${String(row.marks_status || '').includes('Pending') ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'}`}>
                                {row.marks_status || 'Complete'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-semibold">{row.results_status}</td>
                          </>)}

                        {/* GRADEBOOK BODY ROWS */}
                        {currentType === 'gradebook' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.class_name} - {row.section_name}</td>
                            <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-medium">{row.subject_name}</td>
                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{row.teacher_name}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">{row.verified}</td>
                            <td className="py-3 px-4 text-gray-500">{row.updated_at}</td>
                          </>)}

                        {/* STUDENTS BODY ROWS */}
                        {currentType === 'students' && (<>
                            <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">{row.admission_number}</td>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.student_name}</td>
                            <td className="py-3 px-4 text-gray-600">{row.gender}</td>
                            <td className="py-3 px-4 text-gray-600">{row.class_name} - {row.section_name}</td>
                            <td className="py-3 px-4 text-gray-500">{row.admission_date || '2026-06-01'}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                                {row.current_status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                                {row.fee_status}
                              </span>
                            </td>
                          </>)}

                        {/* ADMISSIONS BODY ROWS */}
                        {currentType === 'admissions' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.course_level}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.enquiries}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.applications}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.entrance_tests}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.selected}</td>
                            <td className="py-3 px-4 text-right font-bold text-emerald-600">{row.admitted}</td>
                            <td className="py-3 px-4 text-right font-medium text-amber-600">{row.pending}</td>
                          </>)}

                        {/* FEES BODY ROWS */}
                        {currentType === 'fees' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.fee_type}</td>
                            <td className="py-3 px-4 text-right font-medium">{formatINR(row.demand_amount)}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{formatINR(row.collected_amount)}</td>
                            <td className="py-3 px-4 text-right font-medium text-rose-600">{formatINR(row.pending_amount)}</td>
                            <td className="py-3 px-4 text-right font-medium text-amber-600">{formatINR(row.overdue_amount)}</td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{row.recovery_rate}%</td>
                          </>)}

                        {/* STAFF BODY ROWS */}
                        {currentType === 'staff' && (<>
                            <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.department_name}</td>
                            <td className="py-3 px-4 text-gray-600">{row.department_head}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.total_staff}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.teaching_count}</td>
                            <td className="py-3 px-4 text-right font-medium">{row.non_teaching_count}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{row.present_today}</td>
                            <td className="py-3 px-4 text-right font-medium text-rose-600">{row.absent_today}</td>
                          </>)}
                      </tr>);
            })}
                </tbody>
              </table>
            </div>)}

          {/* Pagination Controls */}
          {drillData && drillData.pagination && drillData.pagination.total_pages > 1 && (<div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <div>
                Showing {(page - 1) * drillData.pagination.limit + 1} to {Math.min(page * drillData.pagination.limit, drillData.pagination.total)} of {drillData.pagination.total} records
              </div>
              <div className="flex items-center gap-1.5">
                <button id="drilldown-prev-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40">
                  Previous
                </button>
                <span className="px-2 font-semibold text-gray-900 dark:text-white">
                  Page {page} of {drillData.pagination.total_pages}
                </span>
                <button id="drilldown-next-page-btn" onClick={() => setPage(p => Math.min(drillData.pagination.total_pages, p + 1))} disabled={page >= drillData.pagination.total_pages} className="px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>)}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Real-time aggregated database records from PostgreSQL/SQLite</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedBranchId !== 'all' && onSelectBranch && (<button id="drilldown-switch-branch-btn" onClick={() => {
                onSelectBranch(Number(selectedBranchId));
                onClose();
            }} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-lg transition-colors">
                Switch ERP Scope to this Branch
              </button>)}
            <button id="drilldown-done-btn" onClick={onClose} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>);
};
