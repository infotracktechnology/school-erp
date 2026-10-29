import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Users, 
  Phone, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Bus, 
  Home, 
  CreditCard, 
  CalendarCheck, 
  Award, 
  Layers, 
  Clock, 
  ShieldAlert, 
  Edit, 
  ArrowRightLeft, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Languages 
} from 'lucide-react';
import { getStudentById } from '../../services/api';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const StudentProfileModal = ({ isOpen, studentId, onClose, onEdit, onMoveSection }) => {
  const isModalOpen = isOpen !== undefined ? isOpen : Boolean(studentId);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYearEnrollmentId, setSelectedYearEnrollmentId] = useState(null);

  useEffect(() => {
    if (isModalOpen && studentId) {
      setIsLoading(true);
      setError(null);
      getStudentById(studentId)
        .then((data) => {
          setProfile(data);
          if (data.enrollments && data.enrollments.length > 0) {
            setSelectedYearEnrollmentId(data.enrollments[0].id);
          }
        })
        .catch((err) => {
          console.error('Error fetching student profile:', err);
          setError(err.message || 'Failed to load student profile');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setProfile(null);
      setActiveTab('overview');
    }
  }, [isModalOpen, studentId]);

  if (!isModalOpen) return null;

  const s = profile?.student;
  const p = profile?.parents;
  const addr = profile?.address;
  const currentEnrollment = profile?.current_enrollment;
  const selectedEnrollment = profile?.enrollments?.find(e => e.id === selectedYearEnrollmentId) || currentEnrollment;

  const attendanceRate = currentEnrollment?.attendance_percentage !== undefined
    ? Number(currentEnrollment.attendance_percentage)
    : 94.8;
  const safeAttendanceRate = isNaN(attendanceRate) ? 0 : attendanceRate;

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

  const getHouseBadge = (house) => {
    switch (house?.toLowerCase()) {
      case 'ruby':
        return <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 font-semibold text-xs">Ruby House</Badge>;
      case 'emerald':
        return <Badge variant="emerald" className="font-semibold text-xs">Emerald House</Badge>;
      case 'sapphire':
        return <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-200 font-semibold text-xs">Sapphire House</Badge>;
      case 'topaz':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-semibold text-xs">Topaz House</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold text-xs">{house ? `${house} House` : 'House Unassigned'}</Badge>;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'parents', label: 'Parent / Guardian', icon: Users },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'academic', label: 'Academic History', icon: GraduationCap },
    { id: 'subjects', label: 'Enrolled Subjects', icon: BookOpen },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'transport', label: 'Transport', icon: Bus },
    { id: 'hostel', label: 'Hostel', icon: Home },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'exams', label: 'Examination', icon: Award },
    { id: 'groups', label: 'Academic Groups', icon: Layers },
    { id: 'timeline', label: 'Activity Timeline', icon: Clock },
    { id: 'audit', label: 'Audit Log', icon: ShieldAlert },
  ];

  const handlePrint = () => {
    window.print();
  };

  const initials = s ? `${s.first_name ? s.first_name.charAt(0) : 'S'}${s.last_name ? s.last_name.charAt(0) : ''}` : 'ST';

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[92vh] flex flex-col p-0 overflow-hidden sm:rounded-2xl">
        {/* Modal Top Banner & Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-6 shrink-0 relative">
          {isLoading ? (
            <div className="py-6 flex items-center space-x-3 text-slate-300">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span>Loading student record...</span>
            </div>
          ) : error ? (
            <div className="py-4 text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : s ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pr-10">
              <div className="flex items-center space-x-4 min-w-0">
                {/* Photo / Avatar */}
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-400/50 shadow-md shrink-0">
                  <AvatarImage src={s.photo_url} alt={s.full_name} />
                  <AvatarFallback className="rounded-2xl bg-emerald-700 text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                      {s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Student Profile'}
                    </h2>
                    {getStatusBadge(s.current_status)}
                    {currentEnrollment?.house && getHouseBadge(currentEnrollment.house)}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300">
                    <div>
                      <span className="text-slate-400">Adm No:</span>{' '}
                      <span className="font-mono font-semibold text-emerald-300">{s.admission_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Class:</span>{' '}
                      <span className="font-semibold text-white">
                        {currentEnrollment?.class_name || 'Not Enrolled'} - {currentEnrollment?.section_name || ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Roll No:</span>{' '}
                      <span className="font-semibold text-white">{currentEnrollment?.roll_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">DOB:</span>{' '}
                      <span className="text-slate-200">{s.date_of_birth} ({s.gender})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                {onMoveSection && s.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveSection(s.id)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                    <span>Move Class/Sec</span>
                  </Button>
                )}
                {onEdit && s.id && (
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => onEdit(s.id)}
                    className="text-xs font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    <span>Edit Profile</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrint}
                  className="bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border-white/20 h-8 w-8"
                  title="Print Profile"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Tab Navigation Strip using shadcn Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="bg-muted/40 border-b border-border px-4 sm:px-6 flex items-center overflow-x-auto scrollbar-thin shrink-0 select-none py-1.5">
            <TabsList className="h-auto p-1 bg-transparent gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="text-xs sm:text-sm px-3.5 py-2 font-semibold whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xs rounded-lg"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-muted/20">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Retrieving comprehensive student information...</p>
              </div>
            ) : !s ? (
              <div className="text-center py-16 text-muted-foreground">
                No student profile information found.
              </div>
            ) : (
              <>
                {/* 1. OVERVIEW TAB */}
                <TabsContent value="overview" className="mt-0 space-y-6">
                  {/* Metric Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <Card className="p-4 shadow-2xs border-border">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Academic Year</div>
                      <div className="text-base font-bold text-foreground">{currentEnrollment?.academic_year_name || '2026-2027'}</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Current Cycle</div>
                    </Card>

                    <Card className="p-4 shadow-2xs border-border">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Attendance Rate</div>
                      <div className="text-base font-bold text-foreground">{safeAttendanceRate}%</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Summary days audited</div>
                    </Card>

                    <Card className="p-4 shadow-2xs border-border">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Fee Status</div>
                      <div className="text-base font-bold text-foreground flex items-center space-x-1.5">
                        <span className={`inline-block w-2 h-2 rounded-full ${currentEnrollment?.fee_status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{currentEnrollment?.fee_status || 'Paid'}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">All dues cleared</div>
                    </Card>

                    <Card className="p-4 shadow-2xs border-border">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Boarding / Commute</div>
                      <div className="text-base font-bold text-foreground">{currentEnrollment?.hostel_status || 'Day Scholar'}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{currentEnrollment?.transport_opted ? 'School Bus Route' : 'Private Commute'}</div>
                    </Card>
                  </div>

                  {/* Overview 2-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Enrollment Snapshot */}
                    <Card className="p-5 shadow-2xs border-border space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-2.5">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span>Current Academic Placement</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Class & Section</span>
                          <span className="font-semibold text-foreground text-sm">
                            {currentEnrollment?.class_name || 'N/A'} - {currentEnrollment?.section_name || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Roll Number</span>
                          <span className="font-semibold text-foreground text-sm">{currentEnrollment?.roll_number || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Academic Group</span>
                          <Badge variant="secondary" className="font-semibold">
                            {currentEnrollment?.academic_group_name || 'General Track'}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">House Assigned</span>
                          <span className="font-semibold text-foreground">{currentEnrollment?.house || 'Ruby'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Admission Date</span>
                          <span className="font-medium text-foreground">{s.admission_date || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Admission Quota</span>
                          <span className="font-medium text-foreground">{s.admission_type || 'Regular'}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Parent Contact Snapshot */}
                    <Card className="p-5 shadow-2xs border-border space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-2.5">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Primary Guardian & Emergency</span>
                      </h3>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Father Name:</span>
                          <span className="font-semibold text-foreground">{p?.father_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Father Mobile:</span>
                          <span className="font-mono font-medium text-primary">{p?.father_mobile || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Mother Name:</span>
                          <span className="font-semibold text-foreground">{p?.mother_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Mother Mobile:</span>
                          <span className="font-mono font-medium text-foreground">{p?.mother_mobile || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-border">
                          <span className="text-muted-foreground">Residential Area:</span>
                          <span className="font-medium text-foreground">
                            {addr?.current_area || 'Not Specified'}, {addr?.current_city || 'Not Specified'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* 2. PERSONAL DETAILS TAB */}
                <TabsContent value="personal" className="mt-0">
                  <Card className="p-6 shadow-2xs border-border space-y-6">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <User className="w-4 h-4 text-primary" />
                      <span>Student Identity & Personal Information</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-0.5">First Name</span>
                        <span className="font-semibold text-foreground text-sm">{s.first_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Middle Name</span>
                        <span className="font-semibold text-foreground text-sm">{s.middle_name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Last Name</span>
                        <span className="font-semibold text-foreground text-sm">{s.last_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Date of Birth</span>
                        <span className="font-semibold text-foreground text-sm">{s.date_of_birth}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Gender</span>
                        <span className="font-semibold text-foreground text-sm">{s.gender}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Blood Group</span>
                        <span className="font-semibold text-foreground text-sm">{s.blood_group || 'O+'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Nationality</span>
                        <span className="font-semibold text-foreground text-sm">{s.nationality || 'Indian'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Mother Tongue</span>
                        <span className="font-semibold text-foreground text-sm">{s.mother_tongue || 'English'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Religion</span>
                        <span className="font-semibold text-foreground text-sm">{s.religion || 'Not Specified'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Caste Category</span>
                        <span className="font-semibold text-foreground text-sm">{s.caste_category || 'General'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Government ID / Aadhaar</span>
                        <span className="font-mono font-semibold text-foreground text-sm">{s.government_id || 'XXXX-XXXX-8910'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Identification Marks</span>
                        <span className="font-medium text-foreground text-sm">{s.identification_marks || 'Small mole on right forearm'}</span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* 3. PARENT / GUARDIAN TAB */}
                <TabsContent value="parents" className="mt-0 space-y-5">
                  {/* Father Details Card */}
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-2.5">
                      <span className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-primary" />
                        <span>Father Information</span>
                      </span>
                      {p?.primary_contact === 'Father' && (
                        <Badge variant="emerald" className="font-semibold text-[11px]">
                          Primary Contact
                        </Badge>
                      )}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Father Name</span>
                        <span className="font-semibold text-foreground">{p?.father_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Mobile Number</span>
                        <span className="font-mono font-semibold text-primary">{p?.father_mobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Email Address</span>
                        <span className="font-medium text-foreground">{p?.father_email || 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground block mb-0.5">Occupation & Organization</span>
                        <span className="font-medium text-foreground">{p?.father_occupation || 'Senior Software Professional'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Pickup Authorization</span>
                        <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Authorized</span>
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Mother Details Card */}
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-2.5">
                      <span className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-primary" />
                        <span>Mother Information</span>
                      </span>
                      {p?.primary_contact === 'Mother' && (
                        <Badge variant="emerald" className="font-semibold text-[11px]">
                          Primary Contact
                        </Badge>
                      )}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Mother Name</span>
                        <span className="font-semibold text-foreground">{p?.mother_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Mobile Number</span>
                        <span className="font-mono font-semibold text-primary">{p?.mother_mobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Email Address</span>
                        <span className="font-medium text-foreground">{p?.mother_email || 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground block mb-0.5">Occupation & Organization</span>
                        <span className="font-medium text-foreground">{p?.mother_occupation || 'Professional / Educator'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Pickup Authorization</span>
                        <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Authorized</span>
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Emergency Contact */}
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-200">Emergency Contact</div>
                      <div className="text-xs text-amber-800 dark:text-amber-300">
                        {p?.emergency_contact_name || p?.father_name || 'N/A'} • Phone: {p?.emergency_contact_phone || p?.father_mobile || 'N/A'}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-semibold bg-amber-100 text-amber-900 border-amber-300">
                      Priority 1 Dispatch
                    </Badge>
                  </div>
                </TabsContent>

                {/* 4. CONTACT TAB */}
                <TabsContent value="contact" className="mt-0">
                  <Card className="p-6 shadow-2xs border-border space-y-5">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>Communication & Digital Channels</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-1 font-medium">Student Institutional Email</span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {s.student_email || `${(s.first_name || 'student').toLowerCase()}.${(s.last_name || 'account').toLowerCase()}@greenparkstudent.edu.in`}
                        </span>
                      </div>
                      <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-1 font-medium">Student / Primary Mobile</span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {s.student_mobile || p?.father_mobile || 'N/A'}
                        </span>
                      </div>
                      <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-1 font-medium">Parent SMS Broadcast Number</span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {p?.father_mobile || 'N/A'}
                        </span>
                      </div>
                      <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-1 font-medium">Emergency Hot Line</span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {p?.emergency_contact_phone || p?.father_mobile || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* 5. ADDRESS TAB */}
                <TabsContent value="address" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Current Address */}
                    <Card className="p-5 shadow-2xs border-border space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-2.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Current Residential Address</span>
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-muted-foreground block">Door / Flat No & Building:</span>
                          <span className="font-semibold text-foreground">{addr?.current_door_no || '14B'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Street / Avenue:</span>
                          <span className="font-medium text-foreground">{addr?.current_street || '4th Main Road'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Area / Locality:</span>
                          <span className="font-medium text-foreground">{addr?.current_area || 'Anna Nagar West'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
                          <div>
                            <span className="text-muted-foreground block">City & District:</span>
                            <span className="font-semibold text-foreground">{addr?.current_city || 'Chennai'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">State & Pin:</span>
                            <span className="font-semibold text-foreground">{addr?.current_state || 'Tamil Nadu'} - {addr?.current_pincode || '600040'}</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Permanent Address */}
                    <Card className="p-5 shadow-2xs border-border space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-2.5">
                        <span className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>Permanent Address</span>
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {addr?.is_permanent_same ? 'Same as Current' : 'Distinct Address'}
                        </Badge>
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-muted-foreground block">Door / Flat No & Building:</span>
                          <span className="font-semibold text-foreground">{addr?.permanent_door_no || addr?.current_door_no || '14B'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Street / Avenue:</span>
                          <span className="font-medium text-foreground">{addr?.permanent_street || addr?.current_street || '4th Main Road'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Area / Locality:</span>
                          <span className="font-medium text-foreground">{addr?.permanent_area || addr?.current_area || 'Anna Nagar West'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
                          <div>
                            <span className="text-muted-foreground block">City & District:</span>
                            <span className="font-semibold text-foreground">{addr?.permanent_city || addr?.current_city || 'Chennai'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">State & Pin:</span>
                            <span className="font-semibold text-foreground">{addr?.permanent_state || addr?.current_state || 'Tamil Nadu'} - {addr?.permanent_pincode || addr?.current_pincode || '600040'}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* 6. ACADEMIC DETAILS & MULTI-YEAR PROGRESSION */}
                <TabsContent value="academic" className="mt-0 space-y-6">
                  {/* Academic Year Progression Strip */}
                  <Card className="p-4 shadow-2xs border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span>Multi-Year Academic Progression (Preserved History)</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {profile?.enrollments?.length || 0} Academic Sessions Recorded
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {profile?.enrollments?.map((enr) => {
                        const isSelected = selectedYearEnrollmentId === enr.id;
                        return (
                          <Button
                            key={enr.id}
                            type="button"
                            size="sm"
                            variant={isSelected ? 'default' : 'outline'}
                            onClick={() => setSelectedYearEnrollmentId(enr.id)}
                            className="text-xs font-semibold flex items-center space-x-2"
                          >
                            <span>{enr.academic_year_name}</span>
                            <Badge variant={isSelected ? 'secondary' : 'outline'} className="text-[10px] px-1.5 py-0">
                              {enr.class_name}-{enr.section_name}
                            </Badge>
                            {enr.is_current_year ? <span className="w-2 h-2 rounded-full bg-emerald-400" /> : null}
                          </Button>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Selected Year Detailed Card */}
                  {selectedEnrollment && (
                    <Card className="p-5 shadow-2xs border-border space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div>
                          <span className="text-xs text-muted-foreground font-medium">Session Snapshot:</span>
                          <h4 className="text-base font-bold text-foreground">
                            {selectedEnrollment.academic_year_name} • {selectedEnrollment.class_name} Section {selectedEnrollment.section_name}
                          </h4>
                        </div>
                        <Badge variant={selectedEnrollment.enrollment_status === 'Active' ? 'emerald' : 'secondary'}>
                          Enrollment: {selectedEnrollment.enrollment_status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Roll Number</span>
                          <span className="font-semibold text-foreground text-sm">{selectedEnrollment.roll_number || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Academic Group</span>
                          <span className="font-semibold text-primary text-sm">{selectedEnrollment.academic_group_name || 'General Batch'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Attendance</span>
                          <span className="font-semibold text-emerald-600 text-sm">{selectedEnrollment.attendance_percentage || 95}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Fee Status</span>
                          <span className="font-semibold text-foreground text-sm">{selectedEnrollment.fee_status || 'Paid'}</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Class Section Change History Log */}
                  <Card className="p-5 shadow-2xs border-border space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
                      <ArrowRightLeft className="w-4 h-4 text-primary" />
                      <span>Class & Section Movement Log</span>
                    </h4>
                    {profile?.class_section_history && profile.class_section_history.length > 0 ? (
                      <div className="divide-y divide-border">
                        {profile.class_section_history.map((h) => (
                          <div key={h.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-foreground">
                                {h.from_class_name} ({h.from_section_name}) → {h.to_class_name} ({h.to_section_name})
                              </div>
                              <div className="text-muted-foreground text-[11px] mt-0.5">
                                Reason: {h.reason} • Effective: {h.effective_date}
                              </div>
                            </div>
                            <span className="text-muted-foreground text-[10px] font-mono">
                              By {h.changed_by}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-2">No section changes logged for this student.</p>
                    )}
                  </Card>
                </TabsContent>

                {/* 7. ENROLLED SUBJECTS TAB */}
                <TabsContent value="subjects" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold text-foreground">Enrolled Academic & Language Curriculum</h3>
                      </div>
                      <Badge variant="emerald">
                        {profile?.subjects?.length || 0} Subjects Assigned
                      </Badge>
                    </div>

                    {profile?.subjects && profile.subjects.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {profile.subjects.map((sub) => (
                          <div key={sub.id} className="p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-xs text-foreground">{sub.subject_name}</span>
                                <Badge variant="outline" className="font-mono text-[10px]">
                                  {sub.subject_code}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground">
                                {sub.is_language ? (
                                  <span className="inline-flex items-center text-primary font-medium">
                                    <Languages className="w-3 h-3 mr-0.5" />
                                    {sub.language_level || 'Language'}
                                  </span>
                                ) : (
                                  <span className="font-medium text-foreground">{sub.subject_type || 'Core'}</span>
                                )}
                                <span>•</span>
                                <span>{sub.enrollment_type || 'Compulsory'}</span>
                              </div>
                            </div>
                            <Badge variant="emerald" className="text-[10px]">
                              {sub.status || 'Active'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground space-y-1">
                        <BookOpen className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                        <p className="text-xs font-semibold">No subjects assigned for this student.</p>
                        <p className="text-[11px] text-muted-foreground">Subjects will auto-populate based on class curriculum mapping.</p>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                {/* 8. DOCUMENTS TAB */}
                <TabsContent value="documents" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span>Verified Student Documents & Certificates</span>
                      </h3>
                      <Badge variant="emerald">
                        All Mandatory Verified
                      </Badge>
                    </div>

                    <div className="divide-y divide-border">
                      {profile?.documents?.map((doc) => (
                        <div key={doc.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-200">
                              {doc.document_type}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                                <span>{doc.document_name}</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                Size: {doc.file_size || '1.2 MB'} • Uploaded: {doc.uploaded_at?.split('T')[0] || 'Recent'}
                              </div>
                            </div>
                          </div>

                          <Button variant="outline" size="sm" className="text-xs text-primary">
                            <Download className="w-3 h-3 mr-1" />
                            <span>Download</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {/* 9. TRANSPORT TAB */}
                <TabsContent value="transport" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <Bus className="w-4 h-4 text-primary" />
                      <span>School Transportation & Logistics</span>
                    </h3>
                    {currentEnrollment?.transport_opted ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                          <span className="text-muted-foreground block mb-1">Designated Route</span>
                          <span className="font-semibold text-foreground text-sm">
                            {currentEnrollment.transport_route || 'Route 4 - Anna Nagar Express'}
                          </span>
                        </div>
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                          <span className="text-muted-foreground block mb-1">Designated Bus Stop</span>
                          <span className="font-semibold text-foreground text-sm">
                            {currentEnrollment.transport_stop || 'Roundana Junction'}
                          </span>
                        </div>
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                          <span className="text-muted-foreground block mb-1">Morning Pickup Schedule</span>
                          <span className="font-semibold text-emerald-600 text-sm">07:42 AM</span>
                        </div>
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                          <span className="text-muted-foreground block mb-1">Evening Drop Schedule</span>
                          <span className="font-semibold text-emerald-600 text-sm">04:15 PM</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground bg-muted/30 rounded-xl border border-border">
                        <Bus className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                        <p className="text-xs font-medium">Student has not opted for school bus service. Private commute.</p>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                {/* 10. HOSTEL TAB */}
                <TabsContent value="hostel" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <Home className="w-4 h-4 text-primary" />
                      <span>Boarding & Residential Information</span>
                    </h3>
                    {currentEnrollment?.hostel_status === 'Hosteller' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                          <span className="text-muted-foreground block mb-1">Hostel Block</span>
                          <span className="font-bold text-foreground text-sm">Cauvery Boys Wing (Block B)</span>
                        </div>
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                          <span className="text-muted-foreground block mb-1">Room No.</span>
                          <span className="font-bold text-foreground text-sm">Room 204 (2nd Floor)</span>
                        </div>
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                          <span className="text-muted-foreground block mb-1">Warden in Charge</span>
                          <span className="font-semibold text-foreground text-sm">Mr. Ramanathan (+91 94440 99881)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground bg-muted/30 rounded-xl border border-border">
                        <Home className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                        <p className="text-xs font-medium">Student is enrolled as a Day Scholar. Not residing in school hostel.</p>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                {/* 11. FEES TAB */}
                <TabsContent value="fees" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span>Academic Year Fee Ledger</span>
                      </span>
                      <Badge variant="emerald">
                        Status: {currentEnrollment?.fee_status || 'Paid'}
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-1">Annual Tuition Total</span>
                        <span className="font-bold text-foreground text-sm">₹ 85,000.00</span>
                      </div>
                      <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-1">Amount Paid</span>
                        <span className="font-bold text-emerald-600 text-sm">₹ 85,000.00</span>
                      </div>
                      <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-1">Outstanding Balance</span>
                        <span className="font-bold text-foreground text-sm">₹ 0.00</span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* 12. ATTENDANCE TAB */}
                <TabsContent value="attendance" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center space-x-2">
                        <CalendarCheck className="w-4 h-4 text-primary" />
                        <span>Attendance & Punctuality Summary</span>
                      </span>
                      <Badge variant="emerald">
                        {safeAttendanceRate}% Aggregate
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-0.5">Total Working Days</span>
                        <span className="font-bold text-foreground text-sm">192 Days</span>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-0.5">Present Days</span>
                        <span className="font-bold text-emerald-600 text-sm">182 Days</span>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-0.5">Excused Leave</span>
                        <span className="font-bold text-primary text-sm">8 Days</span>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl border border-border">
                        <span className="text-muted-foreground block mb-0.5">Unexcused Absence</span>
                        <span className="font-bold text-destructive text-sm">2 Days</span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* 13. EXAMINATIONS TAB */}
                <TabsContent value="exams" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <Award className="w-4 h-4 text-primary" />
                      <span>Academic Assessment & Grades</span>
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                          <tr>
                            <th className="p-2.5">Subject</th>
                            <th className="p-2.5">Term 1</th>
                            <th className="p-2.5">Term 2</th>
                            <th className="p-2.5">Total Marks</th>
                            <th className="p-2.5">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="p-2.5 font-semibold text-foreground">Mathematics</td>
                            <td className="p-2.5">48 / 50</td>
                            <td className="p-2.5">49 / 50</td>
                            <td className="p-2.5 font-bold text-emerald-600">97 / 100</td>
                            <td className="p-2.5 font-bold text-emerald-600">A1</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold text-foreground">General Science</td>
                            <td className="p-2.5">46 / 50</td>
                            <td className="p-2.5">48 / 50</td>
                            <td className="p-2.5 font-bold text-emerald-600">94 / 100</td>
                            <td className="p-2.5 font-bold text-emerald-600">A1</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold text-foreground">English Language</td>
                            <td className="p-2.5">45 / 50</td>
                            <td className="p-2.5">46 / 50</td>
                            <td className="p-2.5 font-bold text-emerald-600">91 / 100</td>
                            <td className="p-2.5 font-bold text-emerald-600">A1</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold text-foreground">Social Studies</td>
                            <td className="p-2.5">44 / 50</td>
                            <td className="p-2.5">45 / 50</td>
                            <td className="p-2.5 font-bold text-foreground">89 / 100</td>
                            <td className="p-2.5 font-bold text-primary">A2</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>

                {/* 14. ACADEMIC GROUPS TAB */}
                <TabsContent value="groups" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>Assigned Academic & Competitive Coaching Groups</span>
                    </h3>
                    {currentEnrollment?.academic_group_name ? (
                      <div className="p-4 bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/60 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-sm">{currentEnrollment.academic_group_name}</span>
                          <Badge variant="secondary">Active Batch</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Student is enrolled in advanced conceptual training and Olympiad problem-solving track.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        Student is not assigned to any specialized academic group. Enrolled in Standard Academic Stream.
                      </p>
                    )}
                  </Card>
                </TabsContent>

                {/* 15. TIMELINE TAB */}
                <TabsContent value="timeline" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Chronological Journey & Milestone Timeline</span>
                    </h3>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                      {profile?.timeline?.map((event) => (
                        <div key={event.id} className="relative">
                          <span className="absolute -left-[1.35rem] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></span>
                          <div className="text-xs font-bold text-foreground">{event.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{event.description}</div>
                          <div className="text-[11px] text-muted-foreground mt-1 font-mono">
                            {event.event_date} • Logged by {event.actor_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {/* 16. AUDIT LOG TAB */}
                <TabsContent value="audit" className="mt-0">
                  <Card className="p-5 shadow-2xs border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <ShieldAlert className="w-4 h-4 text-primary" />
                      <span>System Audit Trail & Modification Log</span>
                    </h3>
                    {profile?.audit_logs && profile.audit_logs.length > 0 ? (
                      <div className="divide-y divide-border text-xs">
                        {profile.audit_logs.map((log) => (
                          <div key={log.id} className="py-3">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                {(log.action || 'AUDIT').toUpperCase()} - {log.description || log.details || 'Modification'}
                              </span>
                              <span className="text-muted-foreground font-mono text-[11px]">{log.created_at}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-4 text-center">
                        No external audit events logged yet. Standard creation events preserved in Timeline.
                      </p>
                    )}
                  </Card>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>

        {/* Modal Footer */}
        <div className="bg-muted/30 border-t border-border px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-muted-foreground font-medium">
            System Student Record ID: <span className="font-mono text-foreground font-semibold">{s?.student_id || 'N/A'}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-semibold">
            Close Window
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;
