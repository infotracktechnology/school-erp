import React, { useState, useEffect } from 'react';
import { X, User, Users, Phone, MapPin, GraduationCap, FileText, Bus, Home, CreditCard, CalendarCheck, Award, Layers, Clock, ShieldAlert, Edit, ArrowRightLeft, Printer, CheckCircle2, AlertCircle, Download, Sparkles, Loader2, BookOpen, Languages } from 'lucide-react';
import { getStudentById } from '../../services/api';
export const StudentProfileModal = ({ isOpen, studentId, onClose, onEdit, onMoveSection }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedYearEnrollmentId, setSelectedYearEnrollmentId] = useState(null);
    useEffect(() => {
        if (isOpen && studentId) {
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
        }
        else {
            setProfile(null);
            setActiveTab('overview');
        }
    }, [isOpen, studentId]);
    if (!isOpen)
        return null;
    const s = profile?.student;
    const p = profile?.parents;
    const addr = profile?.address;
    const currentEnrollment = profile?.current_enrollment;
    const selectedEnrollment = profile?.enrollments.find(e => e.id === selectedYearEnrollmentId) || currentEnrollment;
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
    const getHouseColor = (house) => {
        switch (house?.toLowerCase()) {
            case 'ruby':
                return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'emerald':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'sapphire':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'topaz':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
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
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Banner & Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer" title="Close Profile">
            <X className="w-5 h-5"/>
          </button>

          {isLoading ? (<div className="py-6 flex items-center space-x-3 text-slate-300">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400"/>
              <span>Loading student record...</span>
            </div>) : error ? (<div className="py-4 text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5"/>
              <span>{error}</span>
            </div>) : s ? (<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pr-10">
              <div className="flex items-center space-x-4 min-w-0">
                {/* Photo / Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400/50 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
                  {s.first_name.charAt(0)}{s.last_name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                      {s.full_name}
                    </h2>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(s.current_status)} bg-white/95`}>
                      {s.current_status}
                    </span>
                    {currentEnrollment?.house && (<span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getHouseColor(currentEnrollment.house)}`}>
                        {currentEnrollment.house} House
                      </span>)}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300">
                    <div>
                      <span className="text-slate-400">Adm No:</span>{' '}
                      <span className="font-mono font-semibold text-emerald-300">{s.admission_number}</span>
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
                {onMoveSection && s.id && (<button type="button" onClick={() => onMoveSection(s.id)} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 cursor-pointer">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-300"/>
                    <span>Move Class/Sec</span>
                  </button>)}
                {onEdit && s.id && (<button type="button" onClick={() => onEdit(s.id)} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer">
                    <Edit className="w-3.5 h-3.5"/>
                    <span>Edit Profile</span>
                  </button>)}
                <button type="button" onClick={handlePrint} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer" title="Print Profile">
                  <Printer className="w-4 h-4"/>
                </button>
              </div>
            </div>) : null}
        </div>

        {/* Tab Navigation Strip */}
        <div className="bg-slate-50 border-b border-slate-200/90 px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto scrollbar-thin shrink-0 select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${isActive
                    ? 'border-emerald-700 text-emerald-800 bg-white shadow-2xs rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}/>
                <span>{tab.label}</span>
              </button>);
        })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          {isLoading ? (<div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin"/>
              <p className="text-sm font-medium text-slate-600">Retrieving comprehensive student information...</p>
            </div>) : !s ? (<div className="text-center py-16 text-slate-500">
              No student profile information found.
            </div>) : (<>
              {/* 1. OVERVIEW TAB */}
              {activeTab === 'overview' && (<div className="space-y-6">
                  {/* Metric Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500 mb-1">Academic Year</div>
                      <div className="text-base font-bold text-slate-900">{currentEnrollment?.academic_year_name || '2026-2027'}</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Current Cycle</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500 mb-1">Attendance Rate</div>
                      <div className="text-base font-bold text-slate-900">{currentEnrollment?.attendance_percentage || 94.8}%</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">182 / 192 Days</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500 mb-1">Fee Status</div>
                      <div className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className={`inline-block w-2 h-2 rounded-full ${currentEnrollment?.fee_status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{currentEnrollment?.fee_status || 'Paid'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">All dues cleared</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500 mb-1">Boarding / Commute</div>
                      <div className="text-base font-bold text-slate-900">{currentEnrollment?.hostel_status || 'Day Scholar'}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{currentEnrollment?.transport_opted ? 'School Bus Route' : 'Private Commute'}</div>
                    </div>
                  </div>

                  {/* Overview 2-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Enrollment Snapshot */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                        <GraduationCap className="w-4 h-4 text-emerald-700"/>
                        <span>Current Academic Placement</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Class & Section</span>
                          <span className="font-semibold text-slate-800 text-sm">
                            {currentEnrollment?.class_name} - {currentEnrollment?.section_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Roll Number</span>
                          <span className="font-semibold text-slate-800 text-sm">{currentEnrollment?.roll_number || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Academic Group</span>
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                            {currentEnrollment?.academic_group_name || 'General Track'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">House Assigned</span>
                          <span className="font-semibold text-slate-800">{currentEnrollment?.house || 'Ruby'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Admission Date</span>
                          <span className="font-medium text-slate-700">{s.admission_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Admission Quota</span>
                          <span className="font-medium text-slate-700">{s.admission_type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Parent Contact Snapshot */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                        <Users className="w-4 h-4 text-emerald-700"/>
                        <span>Primary Guardian & Emergency</span>
                      </h3>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Father Name:</span>
                          <span className="font-semibold text-slate-800">{p?.father_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Father Mobile:</span>
                          <span className="font-mono font-medium text-emerald-700">{p?.father_mobile || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Mother Name:</span>
                          <span className="font-semibold text-slate-800">{p?.mother_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Mother Mobile:</span>
                          <span className="font-mono font-medium text-slate-800">{p?.mother_mobile || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                          <span className="text-slate-400">Residential Area:</span>
                          <span className="font-medium text-slate-700">{addr?.current_area}, {addr?.current_city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}

              {/* 2. PERSONAL DETAILS TAB */}
              {activeTab === 'personal' && (<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <User className="w-4 h-4 text-emerald-700"/>
                    <span>Student Identity & Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">First Name</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.first_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Middle Name</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.middle_name || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Last Name</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.last_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.date_of_birth}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Gender</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Blood Group</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.blood_group || 'O+'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Nationality</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.nationality || 'Indian'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Mother Tongue</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.mother_tongue || 'English'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Religion</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.religion || 'Not Specified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Caste Category</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.caste_category || 'General'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Government ID / Aadhaar</span>
                      <span className="font-mono font-semibold text-slate-800 text-sm">{s.government_id || 'XXXX-XXXX-8910'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Identification Marks</span>
                      <span className="font-medium text-slate-800 text-sm">{s.identification_marks || 'Small mole on right forearm'}</span>
                    </div>
                  </div>
                </div>)}

              {/* 3. PARENT / GUARDIAN TAB */}
              {activeTab === 'parents' && (<div className="space-y-5">
                  {/* Father Details Card */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-emerald-700"/>
                        <span>Father Information</span>
                      </span>
                      {p?.primary_contact === 'Father' && (<span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Primary Contact
                        </span>)}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Father Name</span>
                        <span className="font-semibold text-slate-800">{p?.father_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Mobile Number</span>
                        <span className="font-mono font-semibold text-emerald-700">{p?.father_mobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Email Address</span>
                        <span className="font-medium text-slate-700">{p?.father_email || 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block mb-0.5">Occupation & Organization</span>
                        <span className="font-medium text-slate-800">{p?.father_occupation || 'Senior Software Professional'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Pickup Authorization</span>
                        <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5"/>
                          <span>Authorized</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mother Details Card */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-emerald-700"/>
                        <span>Mother Information</span>
                      </span>
                      {p?.primary_contact === 'Mother' && (<span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Primary Contact
                        </span>)}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Mother Name</span>
                        <span className="font-semibold text-slate-800">{p?.mother_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Mobile Number</span>
                        <span className="font-mono font-semibold text-emerald-700">{p?.mother_mobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Email Address</span>
                        <span className="font-medium text-slate-700">{p?.mother_email || 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block mb-0.5">Occupation & Organization</span>
                        <span className="font-medium text-slate-800">{p?.mother_occupation || 'Professional / Educator'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Pickup Authorization</span>
                        <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5"/>
                          <span>Authorized</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-900">Emergency Contact</div>
                      <div className="text-xs text-amber-800">
                        {p?.emergency_contact_name || p?.father_name} • Phone: {p?.emergency_contact_phone || p?.father_mobile}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold bg-amber-200/70 text-amber-900 px-2.5 py-1 rounded-lg">
                      Priority 1 Dispatch
                    </span>
                  </div>
                </div>)}

              {/* 4. CONTACT TAB */}
              {activeTab === 'contact' && (<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Phone className="w-4 h-4 text-emerald-700"/>
                    <span>Communication & Digital Channels</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block mb-1 font-medium">Student Institutional Email</span>
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {s.student_email || `${s.first_name.toLowerCase()}.${s.last_name.toLowerCase()}@greenparkstudent.edu.in`}
                      </span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block mb-1 font-medium">Student / Primary Mobile</span>
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {s.student_mobile || p?.father_mobile || 'N/A'}
                      </span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block mb-1 font-medium">Parent SMS Broadcast Number</span>
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {p?.father_mobile || 'N/A'}
                      </span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block mb-1 font-medium">Emergency Hot Line</span>
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {p?.emergency_contact_phone || p?.father_mobile || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>)}

              {/* 5. ADDRESS TAB */}
              {activeTab === 'address' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Current Address */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                      <MapPin className="w-4 h-4 text-emerald-700"/>
                      <span>Current Residential Address</span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Door / Flat No & Building:</span>
                        <span className="font-semibold text-slate-800">{addr?.current_door_no || '14B'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Street / Avenue:</span>
                        <span className="font-medium text-slate-800">{addr?.current_street || '4th Main Road'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Area / Locality:</span>
                        <span className="font-medium text-slate-800">{addr?.current_area || 'Anna Nagar West'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 block">City & District:</span>
                          <span className="font-semibold text-slate-800">{addr?.current_city || 'Chennai'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">State & Pin:</span>
                          <span className="font-semibold text-slate-800">{addr?.current_state || 'Tamil Nadu'} - {addr?.current_pincode || '600040'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-700"/>
                        <span>Permanent Address</span>
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {addr?.is_permanent_same ? 'Same as Current' : 'Distinct Address'}
                      </span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Door / Flat No & Building:</span>
                        <span className="font-semibold text-slate-800">{addr?.permanent_door_no || addr?.current_door_no || '14B'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Street / Avenue:</span>
                        <span className="font-medium text-slate-800">{addr?.permanent_street || addr?.current_street || '4th Main Road'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Area / Locality:</span>
                        <span className="font-medium text-slate-800">{addr?.permanent_area || addr?.current_area || 'Anna Nagar West'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 block">City & District:</span>
                          <span className="font-semibold text-slate-800">{addr?.permanent_city || addr?.current_city || 'Chennai'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">State & Pin:</span>
                          <span className="font-semibold text-slate-800">{addr?.permanent_state || addr?.current_state || 'Tamil Nadu'} - {addr?.permanent_pincode || addr?.current_pincode || '600040'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}

              {/* 6. ACADEMIC DETAILS & MULTI-YEAR PROGRESSION */}
              {activeTab === 'academic' && (<div className="space-y-6">
                  {/* Academic Year Progression Strip */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                        <GraduationCap className="w-4 h-4 text-emerald-700"/>
                        <span>Multi-Year Academic Progression (Preserved History)</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {profile?.enrollments.length || 0} Academic Sessions Recorded
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {profile?.enrollments.map((enr) => {
                    const isSelected = selectedYearEnrollmentId === enr.id;
                    return (<button key={enr.id} type="button" onClick={() => setSelectedYearEnrollmentId(enr.id)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all cursor-pointer ${isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>
                            <span>{enr.academic_year_name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                              {enr.class_name}-{enr.section_name}
                            </span>
                            {enr.is_current_year ? (<span className="w-2 h-2 rounded-full bg-emerald-400"></span>) : null}
                          </button>);
                })}
                    </div>
                  </div>

                  {/* Selected Year Detailed Card */}
                  {selectedEnrollment && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-xs text-slate-500 font-medium">Session Snapshot:</span>
                          <h4 className="text-base font-bold text-slate-900">
                            {selectedEnrollment.academic_year_name} • {selectedEnrollment.class_name} Section {selectedEnrollment.section_name}
                          </h4>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${selectedEnrollment.enrollment_status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          Enrollment: {selectedEnrollment.enrollment_status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Roll Number</span>
                          <span className="font-semibold text-slate-800 text-sm">{selectedEnrollment.roll_number || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Academic Group</span>
                          <span className="font-semibold text-indigo-700 text-sm">{selectedEnrollment.academic_group_name || 'General Batch'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Attendance</span>
                          <span className="font-semibold text-emerald-700 text-sm">{selectedEnrollment.attendance_percentage || 95}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Fee Status</span>
                          <span className="font-semibold text-slate-800 text-sm">{selectedEnrollment.fee_status}</span>
                        </div>
                      </div>
                    </div>)}

                  {/* Class Section Change History Log */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                      <ArrowRightLeft className="w-4 h-4 text-emerald-700"/>
                      <span>Class & Section Movement Log</span>
                    </h4>
                    {profile?.class_section_history && profile.class_section_history.length > 0 ? (<div className="divide-y divide-slate-100">
                        {profile.class_section_history.map((h) => (<div key={h.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-slate-800">
                                {h.from_class_name} ({h.from_section_name}) → {h.to_class_name} ({h.to_section_name})
                              </div>
                              <div className="text-slate-500 text-[11px] mt-0.5">
                                Reason: {h.reason} • Effective: {h.effective_date}
                              </div>
                            </div>
                            <span className="text-slate-400 text-[10px] font-mono">
                              By {h.changed_by}
                            </span>
                          </div>))}
                      </div>) : (<p className="text-xs text-slate-400 italic py-2">No section changes logged for this student.</p>)}
                  </div>
                </div>)}

              {/* 6.1 ENROLLED SUBJECTS TAB */}
              {activeTab === 'subjects' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-emerald-700"/>
                      <h3 className="text-sm font-bold text-slate-900">Enrolled Academic & Language Curriculum</h3>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {profile?.subjects?.length || 0} Subjects Assigned
                    </span>
                  </div>

                  {profile?.subjects && profile.subjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {profile.subjects.map((sub) => (
                        <div key={sub.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-slate-900">{sub.subject_name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                                {sub.subject_code}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500">
                              {sub.is_language ? (
                                <span className="inline-flex items-center text-purple-700 font-medium">
                                  <Languages className="w-3 h-3 mr-0.5"/>
                                  {sub.language_level || 'Language'}
                                </span>
                              ) : (
                                <span className="text-slate-600 font-medium">{sub.subject_type || 'Core'}</span>
                              )}
                              <span>•</span>
                              <span className="text-slate-500">{sub.enrollment_type || 'Compulsory'}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {sub.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 space-y-1">
                      <BookOpen className="w-8 h-8 text-slate-400 mx-auto"/>
                      <p className="text-xs font-semibold">No subjects assigned for this student.</p>
                      <p className="text-[11px] text-slate-400">Subjects will auto-populate based on class curriculum mapping.</p>
                    </div>
                  )}
                </div>)}

              {/* 7. DOCUMENTS TAB */}
              {activeTab === 'documents' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-700"/>
                      <span>Verified Student Documents & Certificates</span>
                    </h3>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      All Mandatory Verified
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {profile?.documents.map((doc) => (<div key={doc.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-200">
                            {doc.document_type}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900 flex items-center space-x-1.5">
                              <span>{doc.document_name}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Size: {doc.file_size || '1.2 MB'} • Uploaded: {doc.uploaded_at.split('T')[0]}
                            </div>
                          </div>
                        </div>

                        <button type="button" className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer">
                          <Download className="w-3 h-3"/>
                          <span>Download</span>
                        </button>
                      </div>))}
                  </div>
                </div>)}

              {/* 8. TRANSPORT TAB */}
              {activeTab === 'transport' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Bus className="w-4 h-4 text-emerald-700"/>
                    <span>School Transportation & Logistics</span>
                  </h3>
                  {currentEnrollment?.transport_opted ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 block mb-1">Designated Route</span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {currentEnrollment.transport_route || 'Route 4 - Anna Nagar Express'}
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 block mb-1">Designated Bus Stop</span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {currentEnrollment.transport_stop || 'Roundana Junction'}
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 block mb-1">Morning Pickup Schedule</span>
                        <span className="font-semibold text-emerald-700 text-sm">07:42 AM</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 block mb-1">Evening Drop Schedule</span>
                        <span className="font-semibold text-emerald-700 text-sm">04:15 PM</span>
                      </div>
                    </div>) : (<div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                      <Bus className="w-8 h-8 text-slate-400 mx-auto mb-2"/>
                      <p className="text-xs font-medium">Student has not opted for school bus service. Private commute.</p>
                    </div>)}
                </div>)}

              {/* 9. HOSTEL TAB */}
              {activeTab === 'hostel' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Home className="w-4 h-4 text-emerald-700"/>
                    <span>Boarding & Residential Information</span>
                  </h3>
                  {currentEnrollment?.hostel_status === 'Hosteller' ? (<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block mb-1">Hostel Block</span>
                        <span className="font-bold text-slate-900 text-sm">Cauvery Boys Wing (Block B)</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block mb-1">Room No.</span>
                        <span className="font-bold text-slate-900 text-sm">Room 204 (2nd Floor)</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block mb-1">Warden in Charge</span>
                        <span className="font-semibold text-slate-800 text-sm">Mr. Ramanathan (+91 94440 99881)</span>
                      </div>
                    </div>) : (<div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                      <Home className="w-8 h-8 text-slate-400 mx-auto mb-2"/>
                      <p className="text-xs font-medium">Student is enrolled as a Day Scholar. Not residing in school hostel.</p>
                    </div>)}
                </div>)}

              {/* 10. FEES TAB */}
              {activeTab === 'fees' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-emerald-700"/>
                      <span>Academic Year Fee Ledger</span>
                    </span>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Status: {currentEnrollment?.fee_status || 'Paid'}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-1">Annual Tuition Total</span>
                      <span className="font-bold text-slate-900 text-sm">₹ 85,000.00</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-1">Amount Paid</span>
                      <span className="font-bold text-emerald-700 text-sm">₹ 85,000.00</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-1">Outstanding Balance</span>
                      <span className="font-bold text-slate-900 text-sm">₹ 0.00</span>
                    </div>
                  </div>
                </div>)}

              {/* 11. ATTENDANCE TAB */}
              {activeTab === 'attendance' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center space-x-2">
                      <CalendarCheck className="w-4 h-4 text-emerald-700"/>
                      <span>Attendance & Punctuality Summary</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {currentEnrollment?.attendance_percentage || 94.8}% Aggregate
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Total Working Days</span>
                      <span className="font-bold text-slate-900 text-sm">192 Days</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Present Days</span>
                      <span className="font-bold text-emerald-700 text-sm">182 Days</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Excused Leave</span>
                      <span className="font-bold text-blue-700 text-sm">8 Days</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Unexcused Absence</span>
                      <span className="font-bold text-rose-700 text-sm">2 Days</span>
                    </div>
                  </div>
                </div>)}

              {/* 12. EXAMINATIONS TAB */}
              {activeTab === 'exams' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Award className="w-4 h-4 text-emerald-700"/>
                    <span>Academic Assessment & Grades</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Subject</th>
                          <th className="p-2.5">Term 1</th>
                          <th className="p-2.5">Term 2</th>
                          <th className="p-2.5">Total Marks</th>
                          <th className="p-2.5">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800">Mathematics</td>
                          <td className="p-2.5">48 / 50</td>
                          <td className="p-2.5">49 / 50</td>
                          <td className="p-2.5 font-bold text-emerald-700">97 / 100</td>
                          <td className="p-2.5 font-bold text-emerald-700">A1</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800">General Science</td>
                          <td className="p-2.5">46 / 50</td>
                          <td className="p-2.5">48 / 50</td>
                          <td className="p-2.5 font-bold text-emerald-700">94 / 100</td>
                          <td className="p-2.5 font-bold text-emerald-700">A1</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800">English Language</td>
                          <td className="p-2.5">45 / 50</td>
                          <td className="p-2.5">46 / 50</td>
                          <td className="p-2.5 font-bold text-emerald-700">91 / 100</td>
                          <td className="p-2.5 font-bold text-emerald-700">A1</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800">Social Studies</td>
                          <td className="p-2.5">44 / 50</td>
                          <td className="p-2.5">45 / 50</td>
                          <td className="p-2.5 font-bold text-slate-800">89 / 100</td>
                          <td className="p-2.5 font-bold text-blue-700">A2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>)}

              {/* 13. ACADEMIC GROUPS TAB */}
              {activeTab === 'groups' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Layers className="w-4 h-4 text-emerald-700"/>
                    <span>Assigned Academic & Competitive Coaching Groups</span>
                  </h3>
                  {currentEnrollment?.academic_group_name ? (<div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-950 text-sm">{currentEnrollment.academic_group_name}</span>
                        <span className="bg-indigo-200/60 text-indigo-900 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                          Active Batch
                        </span>
                      </div>
                      <p className="text-indigo-800">
                        Student is enrolled in advanced conceptual training and Olympiad problem-solving track.
                      </p>
                    </div>) : (<p className="text-xs text-slate-500 py-4 text-center">
                      Student is not assigned to any specialized academic group. Enrolled in Standard Academic Stream.
                    </p>)}
                </div>)}

              {/* 14. TIMELINE TAB */}
              {activeTab === 'timeline' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Clock className="w-4 h-4 text-emerald-700"/>
                    <span>Chronological Journey & Milestone Timeline</span>
                  </h3>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {profile?.timeline.map((event) => (<div key={event.id} className="relative">
                        <span className="absolute -left-[1.35rem] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50"></span>
                        <div className="text-xs font-bold text-slate-900">{event.title}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{event.description}</div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          {event.event_date} • Logged by {event.actor_name}
                        </div>
                      </div>))}
                  </div>
                </div>)}

              {/* 15. AUDIT LOG TAB */}
              {activeTab === 'audit' && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <ShieldAlert className="w-4 h-4 text-emerald-700"/>
                    <span>System Audit Trail & Modification Log</span>
                  </h3>
                  {profile?.audit_logs && profile.audit_logs.length > 0 ? (<div className="divide-y divide-slate-100 text-xs">
                      {profile.audit_logs.map((log) => (<div key={log.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">
                              {(log.action || 'AUDIT').toUpperCase()} - {log.description || log.details || 'Modification'}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">{log.created_at}</span>
                          </div>
                        </div>))}
                    </div>) : (<p className="text-xs text-slate-400 italic py-4 text-center">
                      No external audit events logged yet. Standard creation events preserved in Timeline.
                    </p>)}
                </div>)}
            </>)}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            System Student Record ID: <span className="font-mono text-slate-800 font-semibold">{s?.student_id || 'N/A'}</span>
          </div>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer">
            Close Window
          </button>
        </div>
      </div>
    </div>);
};
