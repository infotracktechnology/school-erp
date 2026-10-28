import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, BookOpen, 
  Award, ShieldCheck, Heart, AlertCircle, Loader2, 
  ArrowLeft, CheckCircle2, Building2, Layers, Copy, Check
} from 'lucide-react';
import { useErp } from '../context/ErpContext';
import { useNavigate } from 'react-router-dom';

export const StudentProfilePage = ({ showToast }) => {
  const { currentUser } = useErp();
  const navigate = useNavigate();
  const studentBasic = currentUser?.student || {};

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAdm, setCopiedAdm] = useState(false);

  useEffect(() => {
    if (!studentBasic.id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/students/${studentBasic.id}`)
      .then(res => res.json())
      .then(res => {
        if (!isMounted) return;
        if (res.success && (res.data || res.student)) {
          setProfileData(res);
        } else {
          setProfileData(null);
        }
      })
      .catch(err => {
        console.error('Failed to load profile:', err);
        showToast?.('Failed to load complete profile data', 'error');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [studentBasic.id, showToast]);

  const student = profileData?.student || profileData?.data || studentBasic;
  const parents = profileData?.parents || {};
  const address = profileData?.address || {};
  const enrollment = profileData?.current_enrollment || {};
  const subjects = profileData?.subjects || [];

  const copyAdmissionNo = () => {
    const adm = student.admission_number || student.admission_no;
    if (adm) {
      navigator.clipboard.writeText(adm);
      setCopiedAdm(true);
      setTimeout(() => setCopiedAdm(false), 2000);
      showToast?.('Admission number copied to clipboard', 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-3 max-w-5xl mx-auto my-8">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-bold text-slate-800">Loading student profile record...</p>
        <p className="text-xs text-slate-400">Fetching personal, academic and parent details</p>
      </div>
    );
  }

  const fullName = student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || currentUser?.name || 'Student';
  const initial = student.first_name ? student.first_name[0] : (currentUser?.name ? currentUser.name[0] : 'S');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white shadow-inner font-black text-3xl shrink-0 uppercase">
              {initial}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{student.current_status || student.status || 'Active Enrolled'}</span>
                </span>
                <span className="text-xs text-indigo-200">
                  {currentUser?.branch_name || 'Main Campus'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-indigo-200 pt-0.5">
                <div className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <span className="text-slate-300">Admission No:</span>
                  <strong className="text-white">{student.admission_number || student.admission_no || 'N/A'}</strong>
                  <button 
                    onClick={copyAdmissionNo}
                    title="Copy Admission Number"
                    className="ml-1 text-indigo-300 hover:text-white cursor-pointer"
                  >
                    {copiedAdm ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <span>•</span>

                <div className="bg-white/10 px-2.5 py-1 rounded-lg">
                  <span className="text-slate-300">Class: </span>
                  <strong className="text-white">{enrollment.class_name || student.class_name || 'N/A'} {enrollment.section_name || student.section_name ? `(${enrollment.section_name || student.section_name})` : ''}</strong>
                </div>

                {student.roll_number && (
                  <>
                    <span>•</span>
                    <div className="bg-white/10 px-2.5 py-1 rounded-lg">
                      <span className="text-slate-300">Roll No: </span>
                      <strong className="text-white">{student.roll_number}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Academic & Personal Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Academic & Enrollment Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Academic & Enrollment Record</h3>
                <p className="text-xs text-slate-500">Official student registration and class placement details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Enrolled Class</span>
                <span className="text-sm font-bold text-slate-800">
                  {enrollment.class_name || student.class_name || 'Standard'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Assigned Section</span>
                <span className="text-sm font-bold text-slate-800">
                  Section {enrollment.section_name || student.section_name || 'A'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Class Roll Number</span>
                <span className="text-sm font-bold text-indigo-700">
                  {student.roll_number || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Campus / Branch</span>
                <span className="text-sm font-bold text-slate-800">
                  {currentUser?.branch_name || 'Main Campus'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Residential Status</span>
                <span className="text-sm font-bold text-slate-800">
                  {student.hostel_status || student.residential_type || 'Day Scholar'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">School Transport</span>
                <span className="text-sm font-bold text-slate-800">
                  {student.transport_opted ? 'Opted (School Bus)' : 'Not Opted (Own Arrangement)'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Personal & Identification Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal & Identity Information</h3>
                <p className="text-xs text-slate-500">Student bio and identification records</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Legal Name</span>
                <span className="text-sm font-bold text-slate-800">{fullName}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Gender</span>
                <span className="text-sm font-bold text-slate-800">{student.gender || 'Female'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Blood Group</span>
                <span className="text-sm font-bold text-rose-700 flex items-center space-x-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{student.blood_group || 'O+'}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Date of Birth</span>
                <span className="text-sm font-bold text-slate-800">{student.date_of_birth || student.dob || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Registered Student Phone</span>
                <span className="text-sm font-bold text-slate-800">{student.student_mobile || parents.father_mobile || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Student Portal Email</span>
                <span className="text-sm font-bold text-slate-800 truncate block">{currentUser?.email || 'student@school.edu'}</span>
              </div>
            </div>
          </div>

          {/* 3. Enrolled Subjects & Course Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Enrolled Subjects & Curriculum</h3>
                  <p className="text-xs text-slate-500">Active subjects mapped to your academic record ({subjects.length})</p>
                </div>
              </div>
            </div>

            {subjects.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No enrolled subjects registered for this academic year.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {subjects.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/70 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sub.subject_name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                        Code: {sub.subject_code || 'N/A'} • {sub.subject_type || 'Academic'}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      sub.enrollment_type === 'Compulsory'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {sub.enrollment_type || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Family & Contact Details */}
        <div className="space-y-6">
          {/* Parent / Guardian Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Parent / Guardian</h3>
                <p className="text-xs text-slate-500">Official emergency and family contacts</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Father's Name</span>
                <span className="text-sm font-bold text-slate-800">{parents.father_name || 'N/A'}</span>
                {parents.father_mobile && (
                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 pt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{parents.father_mobile}</span>
                  </div>
                )}
                {parents.father_email && (
                  <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{parents.father_email}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Mother's Name</span>
                <span className="text-sm font-bold text-slate-800">{parents.mother_name || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Primary Contact Phone</span>
                <span className="text-sm font-bold text-indigo-700 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{parents.father_mobile || student.student_mobile || 'N/A'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Residential Address Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Residential Address</h3>
                <p className="text-xs text-slate-500">Official registered correspondence location</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Permanent / Current Home</span>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
                {address.current_address || address.address || student.address || 'Address registered on file at administrative campus.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
