import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowRightLeft, 
  CheckSquare, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  X, 
  Users, 
  GraduationCap, 
  Search, 
  RotateCcw, 
  Download, 
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  UserX
} from 'lucide-react';
import { getStudents, getClasses, getSections, getAcademicGroups, getBranches } from '../../services/api';
import { useErp } from '../../context/ErpContext';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

export const StudentDetailsList = ({ 
  branchId, 
  academicYearId, 
  isHistoricalYear, 
  onViewStudent, 
  onEditStudent, 
  onMoveSection, 
  onInactivateStudent, 
  onOpenRegisterModal, 
  onBulkMoveSection, 
  onBulkAssignGroup, 
  onBranchChange 
}) => {
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
  const [sortBy, setSortBy] = useState('admission_number');
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
      if (!isMounted) return;

      if (clsRes.status === 'fulfilled' && clsRes.value?.data) {
        const seenKeys = new Set();
        const uniqueClasses = clsRes.value.data.filter((c) => {
          const key = (c.name || c.class_name || '').trim().toLowerCase();
          if (!key || seenKeys.has(key)) return false;
          seenKeys.add(key);
          return true;
        });
        setClassesList(uniqueClasses);
      } else {
        setClassesList([]);
      }

      if (secRes.status === 'fulfilled' && secRes.value?.data) {
        setSectionsList(secRes.value.data);
      } else {
        setSectionsList([]);
      }

      if (grpRes.status === 'fulfilled' && grpRes.value) {
        setAcademicGroupsList(grpRes.value);
      } else {
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
        if (!val || seen.has(val.toUpperCase())) return false;
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
    if (selectedClassId !== 'all') count++;
    if (selectedSectionId !== 'all') count++;
    if (selectedGroupId !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedGender !== 'all') count++;
    if (selectedFeeStatus !== 'all') count++;
    if (searchQuery.trim()) count++;
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
    } catch (err) {
      console.error('Failed to load students:', err);
      setError(err.message || 'Unable to fetch student records.');
      setStudents([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedBranchId, academicYearId, selectedClassId, selectedSectionId,
    selectedGroupId, selectedStatus, selectedGender, selectedFeeStatus,
    searchQuery, sortBy, sortOrder, currentPage, pageSize
  ]);

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
    if (students.length === 0) return;
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
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="emerald" className="font-semibold text-xs">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary" className="font-semibold text-xs">Inactive</Badge>;
      case 'Transferred':
        return <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200 font-semibold text-xs">Transferred</Badge>;
      case 'TC Issued':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 font-semibold text-xs">TC Issued</Badge>;
      case 'Withdrawn':
        return <Badge variant="destructive" className="font-semibold text-xs">Withdrawn</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold text-xs">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Student Directory Filter Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 space-y-3">
          {/* Top Filters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* Branch Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Branch {isPrincipal && <span className="text-[10px] text-emerald-600 font-normal">(Assigned)</span>}
              </label>
              {isSuperAdmin ? (
                <select
                  value={selectedBranchId}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="w-full border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground bg-background focus:ring-2 focus:ring-ring focus:border-input transition-colors cursor-pointer"
                >
                  <option value="all">All Branches</option>
                  {branchesList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branch_name} {b.branch_code ? `(${b.branch_code})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-2.5 py-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-[11px] truncate">
                  {branchesList[0]?.branch_name || 'Assigned Branch'} {branchesList[0]?.branch_code ? `(${branchesList[0].branch_code})` : ''}
                </div>
              )}
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Class</label>
              <select 
                value={selectedClassId} 
                onChange={(e) => handleClassChange(e.target.value)} 
                className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors"
              >
                <option value="all">All Classes</option>
                {classesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Section</label>
              <select 
                value={selectedSectionId} 
                onChange={(e) => handleSectionChange(e.target.value)} 
                className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors"
              >
                <option value="all">All Sections</option>
                {availableSections.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Group Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Academic Group</label>
              <select 
                value={selectedGroupId} 
                onChange={(e) => handleGroupChange(e.target.value)} 
                className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors"
              >
                <option value="all">All Groups</option>
                {academicGroupsList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Status Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Status</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => handleStatusChange(e.target.value)} 
                className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors"
              >
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
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Gender</label>
              <select 
                value={selectedGender} 
                onChange={(e) => handleGenderChange(e.target.value)} 
                className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Search, Action Buttons & Active Filter Tags */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-border/60">
            {/* Quick Search with shadcn Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => handleSearchChange(e.target.value)} 
                placeholder="Search by student name, admission no, roll no, mobile..." 
                className="pl-8.5 pr-8 h-9 text-xs"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => handleSearchChange('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Utility Action Buttons */}
            <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
              {activeFiltersCount > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters} 
                  className="text-xs font-semibold" 
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  <span>Reset ({activeFiltersCount})</span>
                </Button>
              )}

              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fetchStudents()} 
                disabled={isLoading} 
                className="text-xs font-semibold" 
                title="Refresh directory list"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin text-primary' : ''}`} />
                <span>Refresh</span>
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV} 
                disabled={students.length === 0} 
                className="text-xs font-semibold" 
                title="Export filtered records to CSV"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Export</span>
              </Button>

              {onOpenRegisterModal && !isHistoricalYear && (
                <Button 
                  type="button" 
                  variant="emerald" 
                  size="sm" 
                  onClick={onOpenRegisterModal} 
                  className="text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Enroll Student</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Sticky Bar (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3 px-4 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3 text-xs">
            <Badge variant="emerald" className="font-bold">
              {selectedIds.length} Selected
            </Badge>
            <span className="text-slate-300">Choose a bulk operation:</span>
          </div>

          <div className="flex items-center space-x-2">
            {onBulkMoveSection && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => onBulkMoveSection(selectedIds)} 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span>Bulk Move Section</span>
              </Button>
            )}

            {onBulkAssignGroup && (
              <Button 
                type="button" 
                variant="emerald" 
                size="sm" 
                onClick={() => onBulkAssignGroup(selectedIds)} 
                className="text-xs font-semibold"
              >
                <Users className="w-3.5 h-3.5 mr-1" />
                <span>Assign Academic Group</span>
              </Button>
            )}

            <button 
              type="button" 
              onClick={() => setSelectedIds([])} 
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer" 
              title="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main High-Density Table with shadcn primitives */}
      <Card className="border-border shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40 select-none">
            <TableRow>
              <TableHead className="p-3 w-10 text-center">
                <button type="button" onClick={handleSelectAll} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  {selectedIds.length === students.length && students.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-primary" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </TableHead>

              <TableHead className="p-3 cursor-pointer" onClick={() => handleSort('admission_number')}>
                <div className="flex items-center space-x-1">
                  <span>Admission No</span>
                  <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                </div>
              </TableHead>

              <TableHead className="p-3 cursor-pointer" onClick={() => handleSort('first_name')}>
                <div className="flex items-center space-x-1">
                  <span>Student Name</span>
                  <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                </div>
              </TableHead>

              <TableHead className="p-3 cursor-pointer" onClick={() => handleSort('class_id')}>
                <div className="flex items-center space-x-1">
                  <span>Class & Sec</span>
                  <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                </div>
              </TableHead>

              <TableHead className="p-3 text-center">Roll No</TableHead>

              <TableHead className="p-3">Academic Group</TableHead>

              <TableHead className="p-3">Primary Guardian</TableHead>

              <TableHead className="p-3">Commute / Route</TableHead>

              <TableHead className="p-3 text-center">Status</TableHead>

              <TableHead className="p-3 w-12 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="p-12 text-center text-muted-foreground">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                  <span>Loading student records...</span>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="p-12 text-center text-muted-foreground">
                  <GraduationCap className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">No student records found</p>
                  <p className="text-muted-foreground text-[11px] mt-1">Try adjusting search query or active filter selections.</p>
                  {activeFiltersCount > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearFilters} 
                      className="mt-3 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      <span>Clear All Filters</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                const initials = `${student.first_name ? student.first_name.charAt(0) : 'S'}${student.last_name ? student.last_name.charAt(0) : ''}`;

                return (
                  <TableRow 
                    key={student.id} 
                    className={`hover:bg-muted/40 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                  >
                    {/* Checkbox */}
                    <TableCell className="p-3 text-center">
                      <button type="button" onClick={() => handleToggleSelect(student.id)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>

                    {/* Admission No */}
                    <TableCell className="p-3">
                      <button 
                        type="button" 
                        onClick={() => onViewStudent(student.id)} 
                        className="font-mono font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {student.admission_number}
                      </button>
                    </TableCell>

                    {/* Student Name with Avatar */}
                    <TableCell className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8 rounded-lg shrink-0">
                          <AvatarImage src={student.photo_url} alt={student.full_name} />
                          <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <button 
                            type="button" 
                            onClick={() => onViewStudent(student.id)} 
                            className="font-bold text-foreground hover:text-primary transition-colors text-left block cursor-pointer"
                          >
                            {student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || '—'}
                          </button>
                          <div className="text-[11px] text-muted-foreground flex items-center space-x-1.5">
                            <span>{student.gender}</span>
                            {student.blood_group && <span>• {student.blood_group}</span>}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Class & Section */}
                    <TableCell className="p-3">
                      <div className="font-semibold text-foreground">
                        {student.class_name || 'Class ' + student.class_id}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span>Section {student.section_name || student.section_id}</span>
                        {selectedBranchId === 'all' && student.branch_name && (
                          <Badge variant="outline" className="text-[10px] font-medium py-0">
                            {student.branch_code || student.branch_name}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Roll Number */}
                    <TableCell className="p-3 text-center font-mono font-semibold text-foreground">
                      {student.roll_number || '—'}
                    </TableCell>

                    {/* Academic Group */}
                    <TableCell className="p-3">
                      {student.academic_group_name ? (
                        <Badge variant="secondary" className="font-semibold text-[11px]">
                          {student.academic_group_name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[11px] italic">General Track</span>
                      )}
                    </TableCell>

                    {/* Primary Guardian */}
                    <TableCell className="p-3">
                      <div className="font-medium text-foreground">{student.father_name || 'N/A'}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">{student.father_mobile || '—'}</div>
                    </TableCell>

                    {/* Commute / Transport */}
                    <TableCell className="p-3">
                      <div className="text-foreground font-medium">
                        {student.hostel_status}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {student.transport_opted ? student.transport_route || 'School Bus' : 'Private'}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="p-3 text-center">
                      {getStatusBadge(student.current_status)}
                    </TableCell>

                    {/* Action Dropdown Menu */}
                    <TableCell className="p-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewStudent(student.id)}>
                            <Eye className="w-4 h-4 mr-2 text-primary" />
                            View 360 Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditStudent(student.id)}>
                            <Edit className="w-4 h-4 mr-2 text-emerald-600" />
                            Edit Student
                          </DropdownMenuItem>
                          {onMoveSection && (
                            <DropdownMenuItem onClick={() => onMoveSection(student.id)}>
                              <ArrowRightLeft className="w-4 h-4 mr-2 text-sky-600" />
                              Move Section
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {onInactivateStudent && (
                            <DropdownMenuItem onClick={() => onInactivateStudent(student.id)} className="text-destructive">
                              <UserX className="w-4 h-4 mr-2" />
                              Inactivate / TC
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Server-Side Pagination Bar */}
        <div className="bg-muted/30 border-t border-border p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span>Showing</span>
            <select 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }} 
              className="bg-background border border-input rounded-lg px-2 py-1 text-xs font-semibold focus:ring-2 focus:ring-ring text-foreground cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>of <strong className="text-foreground font-bold">{totalRecords}</strong> students enrolled</span>
          </div>

          <div className="flex items-center space-x-1.5 self-end sm:self-center">
            <span className="mr-2">
              Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
            </span>

            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage <= 1 || isLoading} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage >= totalPages || isLoading} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDetailsList;
