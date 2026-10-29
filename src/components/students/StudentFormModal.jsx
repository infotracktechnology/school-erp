import React, { useState, useEffect } from 'react';
import { User, Users, MapPin, GraduationCap, Bus, Save, Loader2, AlertCircle } from 'lucide-react';
import { createStudent, updateStudent, getStudentById, getClasses, getSections, getAcademicGroups } from '../../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * StudentFormModal - Multi-step admission wizard using shadcn Dialog & Tabs (Feature 30)
 * Validates required fields: first_name, last_name, admission_number/admission_no, class_id, section_id.
 */
export const StudentFormModal = ({ isOpen, studentId, branchId, academicYearId, onClose, onSuccess }) => {
  const isEdit = Boolean(studentId);
  const [activeSection, setActiveSection] = useState('academic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Reference lookups
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [groups, setGroups] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    // Student Identity
    student_id: '',
    admission_number: '',
    admission_no: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '2015-05-15',
    gender: 'Male',
    blood_group: 'O+',
    nationality: 'Indian',
    mother_tongue: 'English',
    religion: 'General',
    caste_category: 'General',
    government_id: '',
    admission_date: new Date().toISOString().split('T')[0],
    admission_type: 'Regular',
    current_status: 'Active',
    // Placement
    class_id: 0,
    section_id: 0,
    roll_number: 1,
    academic_group_id: 0,
    house: 'Ruby',
    hostel_status: 'Day Scholar',
    transport_opted: 0,
    transport_route: '',
    transport_stop: '',
    fee_status: 'Paid',
    // Parents
    father_name: '',
    father_mobile: '',
    father_email: '',
    father_occupation: '',
    mother_name: '',
    mother_mobile: '',
    mother_email: '',
    mother_occupation: '',
    primary_contact: 'Father',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    // Address
    current_door_no: '',
    current_street: '',
    current_area: '',
    current_city: 'Chennai',
    current_district: 'Chennai',
    current_state: 'Tamil Nadu',
    current_pincode: '600001',
    is_permanent_same: 1,
    permanent_door_no: '',
    permanent_street: '',
    permanent_area: '',
    permanent_city: 'Chennai',
    permanent_district: 'Chennai',
    permanent_state: 'Tamil Nadu',
    permanent_pincode: '600001'
  });

  // Load lookup lists
  useEffect(() => {
    if (isOpen && branchId && academicYearId) {
      getClasses(branchId, academicYearId)
        .then(res => setClasses(res?.data || []))
        .catch(console.error);
      getSections(branchId, academicYearId)
        .then(res => setSections(res?.data || []))
        .catch(console.error);
      getAcademicGroups({ branch_id: branchId, academic_year_id: academicYearId })
        .then(res => setGroups(res || []))
        .catch(console.error);
    }
  }, [isOpen, branchId, academicYearId]);

  // Load existing student for edit
  useEffect(() => {
    if (isOpen && studentId) {
      setIsLoadingProfile(true);
      setErrorMessage(null);
      getStudentById(studentId)
        .then((res) => {
          const s = res.student;
          const p = res.parents || {};
          const a = res.address || {};
          const enr = res.current_enrollment;
          setFormData({
            student_id: s.student_id || '',
            admission_number: s.admission_number || '',
            admission_no: s.admission_number || '',
            first_name: s.first_name || '',
            middle_name: s.middle_name || '',
            last_name: s.last_name || '',
            date_of_birth: s.date_of_birth || '2015-05-15',
            gender: s.gender || 'Male',
            blood_group: s.blood_group || 'O+',
            nationality: s.nationality || 'Indian',
            mother_tongue: s.mother_tongue || 'English',
            religion: s.religion || 'General',
            caste_category: s.caste_category || 'General',
            government_id: s.government_id || '',
            admission_date: s.admission_date || '',
            admission_type: s.admission_type || 'Regular',
            current_status: s.current_status || 'Active',
            class_id: enr?.class_id || s.class_id || 0,
            section_id: enr?.section_id || s.section_id || 0,
            roll_number: enr?.roll_number || s.roll_number || 1,
            academic_group_id: enr?.academic_group_id || s.academic_group_id || 0,
            house: enr?.house || s.house || 'Ruby',
            hostel_status: enr?.hostel_status || s.hostel_status || 'Day Scholar',
            transport_opted: enr?.transport_opted ?? (s.transport_opted ? 1 : 0),
            transport_route: enr?.transport_route || s.transport_route || '',
            transport_stop: enr?.transport_stop || s.transport_stop || '',
            fee_status: enr?.fee_status || s.fee_status || 'Paid',
            father_name: p.father_name || '',
            father_mobile: p.father_mobile || '',
            father_email: p.father_email || '',
            father_occupation: p.father_occupation || '',
            mother_name: p.mother_name || '',
            mother_mobile: p.mother_mobile || '',
            mother_email: p.mother_email || '',
            mother_occupation: p.mother_occupation || '',
            primary_contact: p.primary_contact || 'Father',
            emergency_contact_name: p.emergency_contact_name || '',
            emergency_contact_phone: p.emergency_contact_phone || '',
            current_door_no: a.current_door_no || '',
            current_street: a.current_street || '',
            current_area: a.current_area || '',
            current_city: a.current_city || 'Chennai',
            current_district: a.current_district || 'Chennai',
            current_state: a.current_state || 'Tamil Nadu',
            current_pincode: a.current_pincode || '600001',
            is_permanent_same: a.is_permanent_same ? 1 : 0,
            permanent_door_no: a.permanent_door_no || '',
            permanent_street: a.permanent_street || '',
            permanent_area: a.permanent_area || '',
            permanent_city: a.permanent_city || 'Chennai',
            permanent_district: a.permanent_district || 'Chennai',
            permanent_state: a.permanent_state || 'Tamil Nadu',
            permanent_pincode: a.permanent_pincode || '600001'
          });
        })
        .catch((err) => {
          setErrorMessage(err.message || 'Failed to load student details');
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    } else if (isOpen && !studentId) {
      // Auto-generate admission number preview
      const rand = Math.floor(1000 + Math.random() * 9000);
      const generatedAdmNo = `ADM-2026-${rand}`;
      setFormData(prev => ({
        ...prev,
        admission_number: generatedAdmNo,
        admission_no: generatedAdmNo,
        class_id: classes[0]?.id || 0,
        section_id: sections[0]?.id || 0
      }));
    }
  }, [isOpen, studentId, classes, sections]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = e.target.checked;
      setFormData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        ...(name === 'admission_number' ? { admission_no: value } : {})
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setErrorMessage('First and Last names are mandatory required fields.');
      setActiveSection('personal');
      return;
    }
    const admNo = formData.admission_number || formData.admission_no || '';
    if (!admNo.trim()) {
      setErrorMessage('Admission Number (admission_no) is mandatory required field.');
      setActiveSection('academic');
      return;
    }
    if (!formData.class_id || !formData.section_id) {
      setErrorMessage('Please assign a Class and Section for enrollment.');
      setActiveSection('academic');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        admission_number: admNo.trim(),
        admission_no: admNo.trim(),
        branch_id: branchId,
        academic_year_id: academicYearId,
        class_id: Number(formData.class_id),
        section_id: Number(formData.section_id),
        roll_number: Number(formData.roll_number) || 1,
        academic_group_id: formData.academic_group_id ? Number(formData.academic_group_id) : undefined,
        transport_opted: Number(formData.transport_opted) || 0
      };

      if (isEdit && studentId) {
        await updateStudent(studentId, payload);
      } else {
        await createStudent(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Operation failed. Please verify input fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden sm:rounded-2xl">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 px-6 shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <User className="w-5 h-5 text-emerald-400" />
            <span>{isEdit ? 'Update Student Record' : 'Enroll New Student'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-300 mt-0.5">
            {isEdit 
              ? 'Modify student profile, academic enrollment and parent details' 
              : 'Register a new pupil into the active academic session'}
          </DialogDescription>
        </DialogHeader>

        {/* Section Navigation Tabs (Multi-step wizard) */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="flex-1 flex flex-col min-h-0">
          <div className="bg-muted/40 border-b border-border px-6 py-2 shrink-0 select-none overflow-x-auto">
            <TabsList className="h-auto p-1 bg-muted/80 gap-1 flex flex-wrap">
              <TabsTrigger value="academic" className="text-xs py-1.5 px-3">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                <span>1. Academic Placement</span>
              </TabsTrigger>
              <TabsTrigger value="personal" className="text-xs py-1.5 px-3">
                <User className="w-3.5 h-3.5 mr-1.5" />
                <span>2. Personal Identity</span>
              </TabsTrigger>
              <TabsTrigger value="parents" className="text-xs py-1.5 px-3">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                <span>3. Parent / Guardian</span>
              </TabsTrigger>
              <TabsTrigger value="address" className="text-xs py-1.5 px-3">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                <span>4. Residential Address</span>
              </TabsTrigger>
              <TabsTrigger value="facilities" className="text-xs py-1.5 px-3">
                <Bus className="w-3.5 h-3.5 mr-1.5" />
                <span>5. Facilities & Commute</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isLoadingProfile ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-7 h-7 text-emerald-700 animate-spin" />
                  <p className="text-xs text-muted-foreground font-medium">Fetching student profile...</p>
                </div>
              ) : (
                <>
                  {/* STEP 1: ACADEMIC PLACEMENT */}
                  <TabsContent value="academic" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                      Academic Placement & Enrollment Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-foreground block mb-1">Admission Number *</label>
                        <Input 
                          type="text" 
                          name="admission_number" 
                          value={formData.admission_number} 
                          onChange={handleChange} 
                          className="font-mono h-9" 
                          placeholder="ADM-2026-001" 
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Class *</label>
                        <select 
                          name="class_id" 
                          value={formData.class_id} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer" 
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Section *</label>
                        <select 
                          name="section_id" 
                          value={formData.section_id} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer" 
                          required
                        >
                          <option value="">Select Section</option>
                          {sections.map(s => (
                            <option key={s.id} value={s.id}>Section {s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Roll Number</label>
                        <Input 
                          type="number" 
                          name="roll_number" 
                          value={formData.roll_number} 
                          onChange={handleChange} 
                          className="h-9" 
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Admission Type</label>
                        <select 
                          name="admission_type" 
                          value={formData.admission_type} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Transfer">Transfer</option>
                          <option value="Scholarship">Scholarship</option>
                          <option value="Management">Management Quota</option>
                          <option value="Sports Quota">Sports Quota</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Admission Date</label>
                        <Input 
                          type="date" 
                          name="admission_date" 
                          value={formData.admission_date} 
                          onChange={handleChange} 
                          className="h-9"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Academic Group (Optional)</label>
                        <select 
                          name="academic_group_id" 
                          value={formData.academic_group_id} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="0">None (General Stream)</option>
                          {groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name} ({g.code})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Assigned House</label>
                        <select 
                          name="house" 
                          value={formData.house} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="Ruby">Ruby House (Red)</option>
                          <option value="Emerald">Emerald House (Green)</option>
                          <option value="Sapphire">Sapphire House (Blue)</option>
                          <option value="Topaz">Topaz House (Yellow)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Student Status</label>
                        <select 
                          name="current_status" 
                          value={formData.current_status} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring font-semibold cursor-pointer"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Transferred">Transferred</option>
                          <option value="TC Issued">TC Issued</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* STEP 2: PERSONAL IDENTITY */}
                  <TabsContent value="personal" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                      Personal Identity & Background
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-foreground block mb-1">First Name *</label>
                        <Input 
                          type="text" 
                          name="first_name" 
                          value={formData.first_name} 
                          onChange={handleChange} 
                          className="h-9" 
                          placeholder="e.g. Aarav" 
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Middle Name</label>
                        <Input 
                          type="text" 
                          name="middle_name" 
                          value={formData.middle_name} 
                          onChange={handleChange} 
                          className="h-9" 
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Last Name *</label>
                        <Input 
                          type="text" 
                          name="last_name" 
                          value={formData.last_name} 
                          onChange={handleChange} 
                          className="h-9" 
                          placeholder="e.g. Sharma" 
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Date of Birth</label>
                        <Input 
                          type="date" 
                          name="date_of_birth" 
                          value={formData.date_of_birth} 
                          onChange={handleChange} 
                          className="h-9"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Gender</label>
                        <select 
                          name="gender" 
                          value={formData.gender} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Blood Group</label>
                        <select 
                          name="blood_group" 
                          value={formData.blood_group} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Nationality</label>
                        <Input 
                          type="text" 
                          name="nationality" 
                          value={formData.nationality} 
                          onChange={handleChange} 
                          className="h-9"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Mother Tongue</label>
                        <Input 
                          type="text" 
                          name="mother_tongue" 
                          value={formData.mother_tongue} 
                          onChange={handleChange} 
                          className="h-9"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Government ID (Aadhaar / National ID)</label>
                        <Input 
                          type="text" 
                          name="government_id" 
                          value={formData.government_id} 
                          onChange={handleChange} 
                          className="font-mono h-9" 
                          placeholder="12-digit UID"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* STEP 3: PARENTS & GUARDIANS */}
                  <TabsContent value="parents" className="mt-0 space-y-5">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                      Parent & Guardian Information
                    </h3>

                    {/* Father Info */}
                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                      <h4 className="text-xs font-bold text-foreground">Father Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Father Name</label>
                          <Input type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="h-9 bg-background" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Mobile Number</label>
                          <Input type="tel" name="father_mobile" value={formData.father_mobile} onChange={handleChange} className="h-9 bg-background font-mono" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Email</label>
                          <Input type="email" name="father_email" value={formData.father_email} onChange={handleChange} className="h-9 bg-background" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Occupation</label>
                          <Input type="text" name="father_occupation" value={formData.father_occupation} onChange={handleChange} className="h-9 bg-background" />
                        </div>
                      </div>
                    </div>

                    {/* Mother Info */}
                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                      <h4 className="text-xs font-bold text-foreground">Mother Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Mother Name</label>
                          <Input type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} className="h-9 bg-background" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Mobile Number</label>
                          <Input type="tel" name="mother_mobile" value={formData.mother_mobile} onChange={handleChange} className="h-9 bg-background font-mono" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Email</label>
                          <Input type="email" name="mother_email" value={formData.mother_email} onChange={handleChange} className="h-9 bg-background" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Occupation</label>
                          <Input type="text" name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} className="h-9 bg-background" />
                        </div>
                      </div>
                    </div>

                    {/* Contact Preferences */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-foreground block mb-1">Primary SMS Contact</label>
                        <select 
                          name="primary_contact" 
                          value={formData.primary_contact} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Emergency Contact Person</label>
                        <Input 
                          type="text" 
                          name="emergency_contact_name" 
                          value={formData.emergency_contact_name} 
                          onChange={handleChange} 
                          className="h-9" 
                          placeholder="Contact person name"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">Emergency Contact Phone</label>
                        <Input 
                          type="tel" 
                          name="emergency_contact_phone" 
                          value={formData.emergency_contact_phone} 
                          onChange={handleChange} 
                          className="h-9 font-mono" 
                          placeholder="Emergency phone number"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* STEP 4: ADDRESS */}
                  <TabsContent value="address" className="mt-0 space-y-5">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                      Address Information
                    </h3>

                    {/* Current Address */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-foreground">Current Residential Address</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Door / Flat No</label>
                          <Input type="text" name="current_door_no" value={formData.current_door_no} onChange={handleChange} className="h-9" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="font-semibold text-muted-foreground block mb-1">Street / Landmark</label>
                          <Input type="text" name="current_street" value={formData.current_street} onChange={handleChange} className="h-9" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">Area / Locality</label>
                          <Input type="text" name="current_area" value={formData.current_area} onChange={handleChange} className="h-9" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">City</label>
                          <Input type="text" name="current_city" value={formData.current_city} onChange={handleChange} className="h-9" />
                        </div>
                        <div>
                          <label className="font-semibold text-muted-foreground block mb-1">PIN Code</label>
                          <Input type="text" name="current_pincode" value={formData.current_pincode} onChange={handleChange} className="h-9 font-mono" />
                        </div>
                      </div>
                    </div>

                    {/* Permanent Address Toggle */}
                    <div className="pt-2">
                      <label className="flex items-center space-x-2 text-xs font-semibold text-foreground cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="is_permanent_same" 
                          checked={Boolean(formData.is_permanent_same)} 
                          onChange={handleChange} 
                          className="rounded-md border-input text-primary focus:ring-ring h-4 w-4"
                        />
                        <span>Permanent Address is identical to Current Address</span>
                      </label>
                    </div>
                  </TabsContent>

                  {/* STEP 5: FACILITIES & COMMUTE */}
                  <TabsContent value="facilities" className="mt-0 space-y-5">
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                      Facilities, Boarding & Commute
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-foreground block mb-1">Boarding Status</label>
                        <select 
                          name="hostel_status" 
                          value={formData.hostel_status} 
                          onChange={handleChange} 
                          className="w-full h-9 px-3 py-1.5 bg-background border border-input rounded-md text-foreground text-xs focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="Day Scholar">Day Scholar (Non-Resident)</option>
                          <option value="Hosteller">Hosteller (Campus Resident)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 pt-2 border-t border-border">
                        <label className="flex items-center space-x-2 text-xs font-semibold text-foreground cursor-pointer mb-3">
                          <input 
                            type="checkbox" 
                            name="transport_opted" 
                            checked={Boolean(formData.transport_opted)} 
                            onChange={handleChange} 
                            className="rounded-md border-input text-primary focus:ring-ring h-4 w-4"
                          />
                          <span>Opt for Institution Transportation / Bus Service</span>
                        </label>

                        {Boolean(formData.transport_opted) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-muted/30 rounded-xl border border-border">
                            <div>
                              <label className="font-semibold text-muted-foreground block mb-1">Bus Route</label>
                              <Input 
                                type="text" 
                                name="transport_route" 
                                value={formData.transport_route} 
                                onChange={handleChange} 
                                className="h-9 bg-background" 
                                placeholder="e.g. Route 4 - Anna Nagar Express"
                              />
                            </div>
                            <div>
                              <label className="font-semibold text-muted-foreground block mb-1">Bus Stop Point</label>
                              <Input 
                                type="text" 
                                name="transport_stop" 
                                value={formData.transport_stop} 
                                onChange={handleChange} 
                                className="h-9 bg-background" 
                                placeholder="e.g. Roundana Junction"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <DialogFooter className="bg-muted/30 p-4 px-6 border-t border-border flex items-center justify-between sm:justify-between">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>

              <Button type="submit" variant="emerald" disabled={isSubmitting} className="font-bold">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Saving record...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <span>{isEdit ? 'Save Changes' : 'Register Student'}</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFormModal;
