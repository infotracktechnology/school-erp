import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowUpDown, ArrowRightLeft, CheckSquare, Square, ChevronLeft, ChevronRight, RefreshCw, X, Users, GraduationCap, Search, RotateCcw, Download, Plus } from 'lucide-react';
import { getStudents, getClasses, getSections, getAcademicGroups, getBranches } from '../../services/api';
import { useErp } from '../../context/ErpContext';

export const StudentDetailsList = ({ branchId, academicYearId, isHistoricalYear, onViewStudent, onEditStudent, onMoveSection, onInactivateStudent, onOpenRegisterModal, onBulkMoveSection, onBulkAssignGroup, onBranchChange }) => {
    const { branches: contextBranches, accessibleBranches, isSuperAdmin, isPrincipal, assignedBranchId } = useErp();
    // State
    const [students, setStudents] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Filter States
    const [selectedBranchId, setSelectedBranchId] = useState(() => isPrincipal ? assignedBranchId : branchId);
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [selectedSectionId, setSelectedSectionId] = useState('all');
    const [selectedGroupId, setSelectedGroupId] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedFeeStatus, setSelectedFeeStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    // Lookup Options
    const branchesList = accessibleBranches || contextBranches || [];
    const [classesList, setClassesList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [academicGroupsList, setAcademicGroupsList] = useState([]);
    // Sync selectedBranchId when branchId prop or role changes
    useEffect(() => {
        if (isPrincipal) {
            setSelectedBranchId(assignedBranchId);
        } else {
            setSelectedBranchId(branchId);
        }
    }, [branchId, isPrincipal, assignedBranchId]);
    // Pagination & Sorting
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [sortBy, setSortBy] = useState('first_name');
    const [sortOrder, setSortOrder] = useState('asc');
    // Selection
    const [selectedIds, setSelectedIds] = useState([]);
    // Load Lookup Options (Classes, Sections, Academic Groups)
    useEffect(() => {
        let isMounted = true;
        const effectiveBranch = selectedBranchId;
        Promise.allSettled([
            getClasses(effectiveBranch, academicYearId),
            getSections(effectiveBranch, academicYearId),
            getAcademicGroups({
                branch_id: effectiveBranch === 'all' ? undefined : Number(effectiveBranch),
                academic_year_id: academicYearId
            })
        ]).then(([clsRes, secRes, grpRes]) => {
            if (!isMounted)
                return;
            if (clsRes.status === 'fulfilled' && clsRes.value?.data) {
                const seenKeys = new Set();
                const uniqueClasses = clsRes.value.data.filter((c) => {
                    const key = (c.name || c.class_name || '').trim().toLowerCase();
                    if (!key || seenKeys.has(key)) return false;
                    seenKeys.add(key);
                    return true;
                });
                setClassesList(uniqueClasses);
            }
            else {
                setClassesList([]);
            }
            if (secRes.status === 'fulfilled' && secRes.value?.data) {
                setSectionsList(secRes.value.data);
            }
            else {
                setSectionsList([]);
            }
            if (grpRes.status === 'fulfilled' && grpRes.value) {
                setAcademicGroupsList(grpRes.value);
            }
            else {
                setAcademicGroupsList([]);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [selectedBranchId, academicYearId]);
    // Available sections based on selected class
    const availableSections = useMemo(() => {
        if (selectedClassId === 'all') {
            const seen = new Set();
            return sectionsList.filter(s => {
                const val = s.name || s.section_name;
                if (!val || seen.has(val.toUpperCase()))
                    return false;
                seen.add(val.toUpperCase());
                return true;
            }).map(s => ({
                id: s.id,
                name: s.name || s.section_name,
                value: s.name || s.section_name
            }));
        }
        return sectionsList
            .filter(s => String(s.class_id) === String(selectedClassId))
            .map(s => ({
            id: s.id,
            name: s.name || s.section_name,
            value: String(s.id)
        }));
    }, [sectionsList, selectedClassId]);
    // Count active filters
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedClassId !== 'all')
            count++;
        if (selectedSectionId !== 'all')
            count++;
        if (selectedGroupId !== 'all')
            count++;
        if (selectedStatus !== 'all')
            count++;
        if (selectedGender !== 'all')
            count++;
        if (selectedFeeStatus !== 'all')
            count++;
        if (searchQuery.trim())
            count++;
        return count;
    }, [selectedClassId, selectedSectionId, selectedGroupId, selectedStatus, selectedGender, selectedFeeStatus, searchQuery]);
    // Fetch Students with Filters & Server-Side Pagination
    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                branch_id: selectedBranchId === 'all' ? undefined : selectedBranchId,
                academic_year_id: academicYearId,
                class_id: selectedClassId === 'all' ? undefined : selectedClassId,
                section_id: selectedSectionId === 'all' ? undefined : selectedSectionId,
                academic_group_id: selectedGroupId === 'all' ? undefined : selectedGroupId,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                gender: selectedGender === 'all' ? undefined : selectedGender,
                fee_status: selectedFeeStatus === 'all' ? undefined : selectedFeeStatus,
                search: searchQuery.trim() || undefined,
                sort_by: sortBy,
                sort_order: sortOrder,
                page: currentPage,
                page_size: pageSize
            };
            const res = await getStudents(params);
            const studentData = res.data || res.students || [];
            const total = res.total ?? res.pagination?.total ?? studentData.length;
            const pages = res.total_pages ?? res.pagination?.total_pages ?? Math.ceil(total / pageSize);
            setStudents(studentData);
            setTotalRecords(total);
            setTotalPages(Math.max(pages, 1));
            setSelectedIds([]);
        }
        catch (err) {
            console.error('Failed to load students:', err);
            setError(err.message || 'Unable to fetch student records.');
            setStudents([]);
            setTotalRecords(0);
        }
        finally {
            setIsLoading(false);
        }
    }, [selectedBranchId, academicYearId, selectedClassId, selectedSectionId, selectedGroupId, selectedStatus, selectedGender, selectedFeeStatus, searchQuery, sortBy, sortOrder, currentPage, pageSize]);
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);
    // Filter Handlers
    const handleBranchChange = (newBranchId) => {
        setSelectedBranchId(newBranchId);
        setSelectedClassId('all');
        setSelectedSectionId('all');
        setSelectedGroupId('all');
        setCurrentPage(1);
        if (onBranchChange) {
            onBranchChange(newBranchId);
        }
    };
    const handleClassChange = (classId) => {
        setSelectedClassId(classId);
        setSelectedSectionId('all');
        setCurrentPage(1);
    };
    const handleSectionChange = (sectionId) => {
        setSelectedSectionId(sectionId);
        setCurrentPage(1);
    };
    const handleGroupChange = (groupId) => {
        setSelectedGroupId(groupId);
        setCurrentPage(1);
    };
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };
    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
        setCurrentPage(1);
    };
    const handleFeeStatusChange = (feeStatus) => {
        setSelectedFeeStatus(feeStatus);
        setCurrentPage(1);
    };
    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };
    const handleClearFilters = () => {
        setSelectedClassId('all');
        setSelectedSectionId('all');
        setSelectedGroupId('all');
        setSelectedStatus('all');
        setSelectedGender('all');
        setSelectedFeeStatus('all');
        setSearchQuery('');
        setCurrentPage(1);
    };
    // Export to CSV
    const handleExportCSV = () => {
        if (students.length === 0)
            return;
        const headers = [
            'Admission No',
            'Full Name',
            'Class',
            'Section',
            'Roll No',
            'Gender',
            'Blood Group',
            'Father Name',
            'Father Mobile',
            'Mother Name',
            'Academic Group',
            'Status'
        ];
        const rows = students.map(s => [
            s.admission_number || '',
            `"${s.full_name || ''}"`,
            s.class_name || '',
            s.section_name || '',
            s.roll_number || '',
            s.gender || '',
            s.blood_group || '',
            `"${s.father_name || ''}"`,
            s.father_mobile || '',
            `"${s.mother_name || ''}"`,
            `"${s.academic_group_name || 'General'}"`,
            s.current_status || 'Active'
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Student_Directory_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // Selection handlers
    const handleSelectAll = () => {
        if (selectedIds.length === students.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(students.map(s => s.id));
        }
    };
    const handleToggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        }
        else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Inactive':
                return 'bg-slate-100 text-slate-700 border-slate-300';
            case 'Transferred':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'TC Issued':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Withdrawn':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const visibleColumns = {
        admission_number: true,
        student_name: true,
        class_section: true,
        roll_number: true,
        academic_group: true,
        parent_info: true,
        transport: true,
        status: true
    };

    return (<div className="space-y-4">
      {error && (<div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
            <X className="w-4 h-4"/>
          </button>
        </div>)}

      {/* Student Directory Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
        {/* Top Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Branch Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Branch {isPrincipal && <span className="text-[10px] text-teal-600 font-normal">(Assigned)</span>}
            </label>
            {isSuperAdmin ? (
              <select
                value={selectedBranchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full border rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors bg-slate-50 border-slate-200 cursor-pointer"
              >
                <option value="all">All Branches</option>
                {branchesList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name} {b.branch_code ? `(${b.branch_code})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full border border-emerald-200 bg-emerald-50 rounded-lg px-2.5 py-1.5 font-bold text-emerald-800 text-[11px] truncate">
                {branchesList[0]?.branch_name || 'Assigned Branch'} {branchesList[0]?.branch_code ? `(${branchesList[0].branch_code})` : ''}
              </div>
            )}
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Class</label>
            <select value={selectedClassId} onChange={(e) => handleClassChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer transition-colors">
              <option value="all">All Classes</option>
              {classesList.map((c) => (<option key={c.id} value={c.id}>
                  {c.name}
                </option>))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section</label>
            <select value={selectedSectionId} onChange={(e) => handleSectionChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer transition-colors">
              <option value="all">All Sections</option>
              {availableSections.map((s) => (<option key={s.value} value={s.value}>
                  {s.name}
                </option>))}
            </select>
          </div>

          {/* Academic Group Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Academic Group</label>
            <select value={selectedGroupId} onChange={(e) => handleGroupChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer transition-colors">
              <option value="all">All Groups</option>
              {academicGroupsList.map((g) => (<option key={g.id} value={g.id}>
                  {g.name}
                </option>))}
            </select>
          </div>

          {/* Student Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => handleStatusChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer transition-colors">
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Transferred">Transferred</option>
              <option value="TC Issued">TC Issued</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gender</label>
            <select value={selectedGender} onChange={(e) => handleGenderChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer transition-colors">
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Search, Action Buttons & Active Filter Tags */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
            <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Search by student name, admission no, roll no, mobile..." className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-slate-400 transition-colors"/>
            {searchQuery && (<button type="button" onClick={() => handleSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-3.5 h-3.5"/>
              </button>)}
          </div>

          {/* Utility Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
            {activeFiltersCount > 0 && (<button type="button" onClick={handleClearFilters} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer" title="Reset all filters">
                <RotateCcw className="w-3.5 h-3.5"/>
                <span>Reset ({activeFiltersCount})</span>
              </button>)}

            <button type="button" onClick={() => fetchStudents()} disabled={isLoading} className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer" title="Refresh directory list">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`}/>
              <span>Refresh</span>
            </button>

            <button type="button" onClick={handleExportCSV} disabled={students.length === 0} className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer" title="Export filtered records to CSV">
              <Download className="w-3.5 h-3.5"/>
              <span>Export</span>
            </button>

            {onOpenRegisterModal && !isHistoricalYear && (<button type="button" onClick={onOpenRegisterModal} className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5"/>
                <span>Enroll Student</span>
              </button>)}
          </div>
        </div>
      </div>

      {/* Bulk Action Sticky Bar (When items selected) */}
      {selectedIds.length > 0 && (<div className="bg-slate-900 text-white p-3 px-4 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3 text-xs">
            <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-md">
              {selectedIds.length} Selected
            </span>
            <span className="text-slate-300">Choose a bulk operation:</span>
          </div>

          <div className="flex items-center space-x-2">
            {onBulkMoveSection && (<button type="button" onClick={() => onBulkMoveSection(selectedIds)} className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-white/20">
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400"/>
                <span>Bulk Move Section</span>
              </button>)}

            {onBulkAssignGroup && (<button type="button" onClick={() => onBulkAssignGroup(selectedIds)} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                <Users className="w-3.5 h-3.5"/>
                <span>Assign Academic Group</span>
              </button>)}

            <button type="button" onClick={() => setSelectedIds([])} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer" title="Clear Selection">
              <X className="w-4 h-4"/>
            </button>
          </div>
        </div>)}

      {/* Main High-Density Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button type="button" onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    {selectedIds.length === students.length && students.length > 0 ? (<CheckSquare className="w-4 h-4 text-emerald-600"/>) : (<Square className="w-4 h-4"/>)}
                  </button>
                </th>

                {visibleColumns.admission_number && (<th className="p-3 cursor-pointer" onClick={() => handleSort('admission_number')}>
                    <div className="flex items-center space-x-1">
                      <span>Admission No</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400"/>
                    </div>
                  </th>)}

                {visibleColumns.student_name && (<th className="p-3 cursor-pointer" onClick={() => handleSort('first_name')}>
                    <div className="flex items-center space-x-1">
                      <span>Student Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400"/>
                    </div>
                  </th>)}

                {visibleColumns.class_section && (<th className="p-3 cursor-pointer" onClick={() => handleSort('class_id')}>
                    <div className="flex items-center space-x-1">
                      <span>Class & Sec</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400"/>
                    </div>
                  </th>)}

                {visibleColumns.roll_number && (<th className="p-3 text-center">Roll No</th>)}

                {visibleColumns.academic_group && (<th className="p-3">Academic Group</th>)}

                {visibleColumns.parent_info && (<th className="p-3">Primary Guardian</th>)}

                {visibleColumns.transport && (<th className="p-3">Commute / Route</th>)}

                {visibleColumns.status && (<th className="p-3 text-center">Status</th>)}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (<tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600"/>
                    <span>Loading student records...</span>
                  </td>
                </tr>) : students.length === 0 ? (<tr>
                  <td colSpan={10} className="p-12 text-center text-slate-500">
                    <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2"/>
                    <p className="font-semibold text-slate-700">No student records found</p>
                    <p className="text-slate-400 text-[11px] mt-1">Try adjusting search query or active filter selections.</p>
                    {activeFiltersCount > 0 && (<button type="button" onClick={handleClearFilters} className="mt-3 inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer">
                        <RotateCcw className="w-3.5 h-3.5"/>
                        <span>Clear All Filters</span>
                      </button>)}
                  </td>
                </tr>) : (students.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            return (<tr key={student.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <button type="button" onClick={() => handleToggleSelect(student.id)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                          {isSelected ? (<CheckSquare className="w-4 h-4 text-emerald-600"/>) : (<Square className="w-4 h-4"/>)}
                        </button>
                      </td>

                      {/* Admission No */}
                      {visibleColumns.admission_number && (<td className="p-3">
                          <button type="button" onClick={() => onViewStudent(student.id)} className="font-mono font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer">
                            {student.admission_number}
                          </button>
                        </td>)}

                      {/* Student Name with Photo/Avatar */}
                      {visibleColumns.student_name && (<td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {student.first_name ? student.first_name.charAt(0) : 'S'}{student.last_name ? student.last_name.charAt(0) : ''}
                            </div>
                            <div>
                              <button type="button" onClick={() => onViewStudent(student.id)} className="font-bold text-slate-900 hover:text-emerald-700 transition-colors text-left block cursor-pointer">
                                {student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || '—'}
                              </button>
                              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                                <span>{student.gender}</span>
                                {student.blood_group && <span>• {student.blood_group}</span>}
                              </div>
                            </div>
                          </div>
                        </td>)}

                      {/* Class & Section */}
                      {visibleColumns.class_section && (<td className="p-3">
                          <div className="font-semibold text-slate-800">
                            {student.class_name || 'Class ' + student.class_id}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>Section {student.section_name || student.section_id}</span>
                            {selectedBranchId === 'all' && student.branch_name && (<span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium text-[10px] border border-slate-200">
                                {student.branch_code || student.branch_name}
                              </span>)}
                          </div>
                        </td>)}

                      {/* Roll Number */}
                      {visibleColumns.roll_number && (<td className="p-3 text-center font-mono font-semibold text-slate-700">
                          {student.roll_number || '—'}
                        </td>)}

                      {/* Academic Group */}
                      {visibleColumns.academic_group && (<td className="p-3">
                          {student.academic_group_name ? (<span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-semibold text-[11px]">
                              {student.academic_group_name}
                            </span>) : (<span className="text-slate-400 text-[11px] italic">General Track</span>)}
                        </td>)}

                      {/* Primary Guardian */}
                      {visibleColumns.parent_info && (<td className="p-3">
                          <div className="font-medium text-slate-800">{student.father_name || 'N/A'}</div>
                          <div className="text-[11px] font-mono text-slate-400">{student.father_mobile || '—'}</div>
                        </td>)}

                      {/* Commute / Transport */}
                      {visibleColumns.transport && (<td className="p-3">
                          <div className="text-slate-700 font-medium">
                            {student.hostel_status}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {student.transport_opted ? student.transport_route || 'School Bus' : 'Private'}
                          </div>
                        </td>)}

                      {/* Status Badge */}
                      {visibleColumns.status && (<td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-semibold ${getStatusBadge(student.current_status)}`}>
                            {student.current_status}
                          </span>
                        </td>)}
                    </tr>);
        }))}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span>Showing</span>
            <select value={pageSize} onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
        }} className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold focus:ring-2 focus:ring-emerald-600">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>of <strong className="text-slate-900 font-bold">{totalRecords}</strong> students enrolled</span>
          </div>

          <div className="flex items-center space-x-1.5 self-end sm:self-center">
            <span className="mr-2">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <button type="button" disabled={currentPage <= 1 || isLoading} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4"/>
            </button>

            <button type="button" disabled={currentPage >= totalPages || isLoading} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
    </div>);
};

export default StudentDetailsList;
