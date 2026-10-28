import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Hash,
  GraduationCap,
  Calendar,
  Phone,
  Users,
  Home,
  FileCheck,
  MapPin,
  HeartPulse,
  AlertTriangle,
  School,
  FileText,
  Camera,
  Save,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { getStudentById, updateStudent } from '../../../services/api';

const TABS = [
  { id: 'name', number: '1', title: 'Student Name', icon: User },
  { id: 'numbers', number: '2', title: 'Student Numbers / Identification', icon: Hash },
  { id: 'academic', number: '3', title: 'Academic Details', icon: GraduationCap },
  { id: 'basic', number: '4', title: 'Basic Details', icon: Calendar },
  { id: 'contact', number: '5', title: 'Student Contact Details', icon: Phone },
  { id: 'parents', number: '6', title: 'Parent / Guardian Details', icon: Users },
  { id: 'family', number: '7', title: 'Family Details', icon: Home },
  { id: 'admission', number: '8', title: 'Admission Details', icon: FileCheck },
  { id: 'address', number: '9', title: 'Address Details', icon: MapPin },
  { id: 'medical', number: '10', title: 'Medical / Health Details', icon: HeartPulse },
  { id: 'emergency', number: '11', title: 'Emergency Contact', icon: AlertTriangle },
  { id: 'previous_school', number: '12', title: 'Previous School Details', icon: School },
  { id: 'documents', number: '13', title: 'Student Documents', icon: FileText },
  { id: 'photo', number: '14', title: 'Student Photo / Identity', icon: Camera },
];

export const StudentComprehensiveEditModal = ({
  isOpen,
  studentId,
  onClose,
  onSuccess,
  branches = [],
  classes = [],
  sections = [],
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState('name');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    // 1. Student Name
    first_name: '',
    middle_name: '',
    last_name: '',
    display_name: '',
    name_regional: '',

    // 2. Numbers / Identification
    admission_number: '',
    roll_number: '',
    emis_number: '',
    apaar_id: '',
    aadhaar_number: '',
    passport_number: '',
    other_id_number: '',
    student_erp_id: '',

    // 3. Academic Details
    academic_year_id: 3,
    branch_id: 1,
    admission_date: '',
    admission_class_id: '',
    current_class_id: '',
    section_id: '',
    stream: 'General',
    house: 'Ruby',
    medium: 'English',
    board_curriculum: 'CBSE',
    previous_school: '',
    previous_class: '',
    previous_academic_year: '',
    student_status: 'Active',
    current_status: 'Active',
    date_of_leaving: '',
    reason_for_leaving: '',

    // 4. Basic Details
    date_of_birth: '',
    dob: '',
    gender: 'Male',
    blood_group: 'O+',
    nationality: 'Indian',
    mother_tongue: 'Tamil',
    religion: 'Hindu',
    community: 'General',
    caste: '',
    caste_certificate_number: '',
    identification_mark_1: '',
    identification_mark_2: '',
    differently_abled: 'No',
    disability_type: '',
    disability_percentage: '',

    // 5. Student Contact Details
    student_mobile: '',
    alternate_mobile: '',
    student_email: '',
    residential_address: '',
    door_flat_no: '',
    street: '',
    area_village: '',
    city_town: '',
    taluk: '',
    district: '',
    state: 'Tamil Nadu',
    country: 'India',
    pin_code: '',

    // 6. Parent / Guardian Details
    // Father
    father_name: '',
    father_mobile: '',
    father_email: '',
    father_aadhaar: '',
    father_occupation: '',
    father_qualification: '',
    father_annual_income: '',
    father_company: '',
    father_designation: '',
    // Mother
    mother_name: '',
    mother_mobile: '',
    mother_email: '',
    mother_aadhaar: '',
    mother_occupation: '',
    mother_qualification: '',
    mother_annual_income: '',
    mother_company: '',
    mother_designation: '',
    // Guardian
    guardian_name: '',
    guardian_relation: '',
    guardian_mobile: '',
    guardian_email: '',
    guardian_occupation: '',
    guardian_address: '',
    // Parent Settings
    primary_contact: 'Father',
    emergency_contact_pref: 'Father',
    parent_login_access: 'Enabled',
    communication_preference: 'WhatsApp & SMS',

    // 7. Family Details
    family_id: '',
    family_type: 'Nuclear',
    children_count: '2',
    family_annual_income: '',
    sibling_name: '',
    sibling_admission_no: '',
    sibling_class: '',
    sibling_section: '',
    sibling_relationship: '',

    // 8. Admission Details
    enquiry_number: '',
    registration_number: '',
    application_number: '',
    admission_number_detail: '',
    admission_date_detail: '',
    admission_type: 'Regular',
    admission_category: 'General',
    admission_quota: 'General Merit',
    admission_source: 'Direct Application',
    admission_remarks: '',
    approved_by: 'Principal',
    approval_date: '',

    // 9. Address Details
    residential_address_full: '',
    permanent_address_full: '',
    same_as_residential: false,
    perm_door_no: '',
    perm_street: '',
    perm_area: '',
    perm_city: '',
    perm_taluk: '',
    perm_district: '',
    perm_state: 'Tamil Nadu',
    perm_country: 'India',
    perm_pin_code: '',

    // 10. Medical / Health Details
    medical_blood_group: 'O+',
    height: '',
    weight: '',
    medical_condition: '',
    allergies: '',
    chronic_condition: '',
    regular_medication: '',
    emergency_medical_info: '',
    doctor_name: '',
    doctor_contact: '',
    hospital_clinic: '',
    health_insurance: 'No',
    insurance_number: '',

    // 11. Emergency Contact
    emergency_name: '',
    emergency_relation: '',
    emergency_mobile: '',
    emergency_alt_mobile: '',
    emergency_email: '',
    emergency_address: '',
    pickup_person: '',
    emergency_priority: '1 - Primary',

    // 12. Previous School Details
    prev_school_name: '',
    prev_school_address: '',
    prev_board: 'CBSE',
    prev_medium: 'English',
    prev_class_studied: '',
    prev_academic_year: '',
    prev_admission_number: '',
    tc_number: '',
    tc_date: '',
    prev_marks_grade: '',
    reason_for_transfer: '',
    tc_document_name: '',

    // 13. Student Documents
    doc_birth_certificate: 'Submitted',
    doc_aadhaar: 'Submitted',
    doc_community_cert: 'Pending',
    doc_income_cert: 'Not Required',
    doc_transfer_cert: 'Submitted',
    doc_prev_marksheet: 'Submitted',
    doc_passport: 'Optional',
    doc_address_proof: 'Submitted',
    doc_medical_cert: 'Optional',
    doc_disability_cert: 'N/A',
    doc_other: '',

    // 14. Student Photo / Identity
    student_photo: '',
    parent_photo: '',
  });

  // Load student data when modal opens
  useEffect(() => {
    if (isOpen && studentId) {
      setIsLoading(true);
      getStudentById(studentId)
        .then((res) => {
          const s = res.data || res.student || {};
          const p = res.parents || {};
          const a = res.address || {};
          const enr = res.current_enrollment || {};

          setFormData((prev) => ({
            ...prev,
            ...s,
            first_name: s.first_name || '',
            last_name: s.last_name || '',
            middle_name: s.middle_name || '',
            display_name: s.display_name || s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim(),
            name_regional: s.name_regional || '',
            admission_number: s.admission_number || s.admission_no || '',
            roll_number: s.roll_number || '',
            current_class_id: s.class_id || enr.class_id || '',
            section_id: s.section_id || enr.section_id || '',
            class_id: s.class_id || enr.class_id || '',
            branch_id: s.branch_id || 1,
            gender: s.gender || 'Male',
            blood_group: s.blood_group || 'O+',
            date_of_birth: s.date_of_birth || s.dob || '',
            dob: s.date_of_birth || s.dob || '',
            student_mobile: s.student_mobile || s.parent_phone || p.father_mobile || '',
            current_status: s.current_status || s.status || 'Active',
            student_status: s.current_status || s.status || 'Active',
            father_name: p.father_name || s.father_name || '',
            father_mobile: p.father_mobile || s.father_mobile || '',
            father_email: p.father_email || s.father_email || '',
            mother_name: p.mother_name || s.mother_name || '',
            residential_address: a.current_address || s.address || '',
          }));
        })
        .catch((err) => {
          console.error('Failed to load student details:', err);
          if (showToast) showToast('Failed to load student details', 'error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, studentId, showToast]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.first_name?.trim()) {
      if (showToast) showToast('First Name is required', 'error');
      setActiveTab('name');
      return;
    }
    if (!formData.last_name?.trim()) {
      if (showToast) showToast('Last Name is required', 'error');
      setActiveTab('name');
      return;
    }

    setIsSaving(true);
    try {
      await updateStudent(studentId, {
        ...formData,
        class_id: formData.current_class_id ? Number(formData.current_class_id) : undefined,
        section_id: formData.section_id ? Number(formData.section_id) : undefined,
      });
      if (showToast) showToast('Student updated successfully with all details', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      if (showToast) showToast(err.message || 'Failed to update student profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const handlePrevTab = () => {
    if (currentTabIndex > 0) setActiveTab(TABS[currentTabIndex - 1].id);
  };
  const handleNextTab = () => {
    if (currentTabIndex < TABS.length - 1) setActiveTab(TABS[currentTabIndex + 1].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
              {formData.first_name ? `${formData.first_name.charAt(0)}${formData.last_name ? formData.last_name.charAt(0) : ''}` : 'ST'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {formData.first_name || formData.last_name
                    ? `${formData.first_name} ${formData.middle_name ? formData.middle_name + ' ' : ''}${formData.last_name}`
                    : 'Edit Student Profile'}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {formData.admission_number || `ID #${studentId}`}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                  {formData.current_status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive 14-Tab Multi-Section Student Profile Editor
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 shrink-0 overflow-x-auto">
          <div className="flex items-center space-x-1 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.number}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-sm font-semibold text-slate-600">Loading student profile details...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              {/* TAB 1: Student Name */}
              {activeTab === 'name' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">1. Student Name</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                        placeholder="e.g. Aarav"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Middle Name</label>
                      <input
                        type="text"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                        placeholder="e.g. Kumar"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                        placeholder="e.g. Sharma"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student Display Name</label>
                      <input
                        type="text"
                        name="display_name"
                        value={formData.display_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                        placeholder="Full Name as shown on ID Cards"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Name in Regional Language</label>
                      <input
                        type="text"
                        name="name_regional"
                        value={formData.name_regional}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                        placeholder="e.g. ஆரவ் சர்மா / आरव शर्मा"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Student Numbers / Identification */}
              {activeTab === 'numbers' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">2. Student Numbers / Identification</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Number *</label>
                      <input
                        type="text"
                        name="admission_number"
                        value={formData.admission_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold text-slate-800"
                        placeholder="ADM-2025-001"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Roll Number</label>
                      <input
                        type="text"
                        name="roll_number"
                        value={formData.roll_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="e.g. 101"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">EMIS Number</label>
                      <input
                        type="text"
                        name="emis_number"
                        value={formData.emis_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="State EMIS / Unique ID"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">PEN / APAAR ID</label>
                      <input
                        type="text"
                        name="apaar_id"
                        value={formData.apaar_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="12-digit One Nation APAAR ID"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Aadhaar Number</label>
                      <input
                        type="text"
                        name="aadhaar_number"
                        value={formData.aadhaar_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="XXXX-XXXX-XXXX"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Passport Number</label>
                      <input
                        type="text"
                        name="passport_number"
                        value={formData.passport_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Passport Number (if applicable)"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Other Individual Number</label>
                      <input
                        type="text"
                        name="other_id_number"
                        value={formData.other_id_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Birth Cert No / Ration Card No"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student ID / ERP ID</label>
                      <input
                        type="text"
                        name="student_erp_id"
                        value={formData.student_erp_id || studentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono bg-slate-50"
                        placeholder="ERP-STU-001"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Academic Details */}
              {activeTab === 'academic' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">3. Academic Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Academic Year *</label>
                      <input
                        type="text"
                        name="academic_year_id"
                        value={formData.academic_year_id || '2025-2026'}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Branch *</label>
                      <select
                        name="branch_id"
                        value={formData.branch_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.branch_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Date</label>
                      <input
                        type="date"
                        name="admission_date"
                        value={formData.admission_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Class *</label>
                      <select
                        name="admission_class_id"
                        value={formData.admission_class_id || formData.current_class_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="">Select Admission Class</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name || c.class_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Current Class *</label>
                      <select
                        name="current_class_id"
                        value={formData.current_class_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-emerald-900"
                        required
                      >
                        <option value="">Select Current Class</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name || c.class_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Section *</label>
                      <select
                        name="section_id"
                        value={formData.section_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-emerald-900"
                        required
                      >
                        <option value="">Select Section</option>
                        {sections.map((sec) => (
                          <option key={sec.id} value={sec.id}>
                            Section {sec.name || sec.section_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Stream</label>
                      <select
                        name="stream"
                        value={formData.stream}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="General">General</option>
                        <option value="Science (Maths)">Science (Maths)</option>
                        <option value="Science (Biology)">Science (Biology)</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts / Humanities">Arts / Humanities</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">House</label>
                      <select
                        name="house"
                        value={formData.house}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="Ruby">Ruby (Red)</option>
                        <option value="Sapphire">Sapphire (Blue)</option>
                        <option value="Emerald">Emerald (Green)</option>
                        <option value="Topaz">Topaz (Yellow)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Medium</label>
                      <select
                        name="medium"
                        value={formData.medium}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Board / Curriculum</label>
                      <select
                        name="board_curriculum"
                        value={formData.board_curriculum}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB</option>
                        <option value="Cambridge (IGCSE)">Cambridge (IGCSE)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Previous School</label>
                      <input
                        type="text"
                        name="previous_school"
                        value={formData.previous_school}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. St. Joseph Public School"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Previous Class</label>
                      <input
                        type="text"
                        name="previous_class"
                        value={formData.previous_class}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Class 4"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Previous Academic Year</label>
                      <input
                        type="text"
                        name="previous_academic_year"
                        value={formData.previous_academic_year}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 2024-2025"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student Status</label>
                      <select
                        name="current_status"
                        value={formData.current_status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Transferred">Transferred</option>
                        <option value="TC Issued">TC Issued</option>
                        <option value="Withdrawn">Withdrawn</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Date of Leaving</label>
                      <input
                        type="date"
                        name="date_of_leaving"
                        value={formData.date_of_leaving}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Reason for Leaving</label>
                      <input
                        type="text"
                        name="reason_for_leaving"
                        value={formData.reason_for_leaving}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Relocation, Course Completion, etc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Basic Details */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">4. Basic Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth || formData.dob}
                        onChange={(e) => {
                          handleChange(e);
                          setFormData((prev) => ({ ...prev, dob: e.target.value }));
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                      <select
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
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
                      <label className="font-bold text-slate-700 block mb-1">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Indian"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mother Tongue</label>
                      <input
                        type="text"
                        name="mother_tongue"
                        value={formData.mother_tongue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Tamil, English, Hindi"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Religion</label>
                      <input
                        type="text"
                        name="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Hindu, Muslim, Christian, etc."
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Community</label>
                      <select
                        name="community"
                        value={formData.community}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="General">General / OC</option>
                        <option value="BC">BC (Backward Class)</option>
                        <option value="MBC">MBC (Most Backward Class)</option>
                        <option value="SC">SC (Scheduled Caste)</option>
                        <option value="ST">ST (Scheduled Tribe)</option>
                        <option value="Minority">Minority</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Caste</label>
                      <input
                        type="text"
                        name="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Sub-caste name"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Caste Certificate Number</label>
                      <input
                        type="text"
                        name="caste_certificate_number"
                        value={formData.caste_certificate_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Govt Certificate No"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Identification Mark 1</label>
                      <input
                        type="text"
                        name="identification_mark_1"
                        value={formData.identification_mark_1}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Mole on right cheek"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Identification Mark 2</label>
                      <input
                        type="text"
                        name="identification_mark_2"
                        value={formData.identification_mark_2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Scar on left forehead"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Differently Abled — Yes / No</label>
                      <select
                        name="differently_abled"
                        value={formData.differently_abled}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    {formData.differently_abled === 'Yes' && (
                      <>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Disability Type</label>
                          <input
                            type="text"
                            name="disability_type"
                            value={formData.disability_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Visual, Hearing, Locomotor, etc."
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Disability Percentage</label>
                          <input
                            type="text"
                            name="disability_percentage"
                            value={formData.disability_percentage}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="e.g. 40%"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: Student Contact Details */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">5. Student Contact Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                      <input
                        type="text"
                        name="student_mobile"
                        value={formData.student_mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Alternate Mobile Number</label>
                      <input
                        type="text"
                        name="alternate_mobile"
                        value={formData.alternate_mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Secondary contact"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email</label>
                      <input
                        type="email"
                        name="student_email"
                        value={formData.student_email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="student@example.com"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
                      <input
                        type="text"
                        name="residential_address"
                        value={formData.residential_address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Full street address"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Door / Flat Number</label>
                      <input
                        type="text"
                        name="door_flat_no"
                        value={formData.door_flat_no}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Plot / Door No"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Street</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Street Name"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Area / Village</label>
                      <input
                        type="text"
                        name="area_village"
                        value={formData.area_village}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Area / Locality"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">City / Town</label>
                      <input
                        type="text"
                        name="city_town"
                        value={formData.city_town}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Coimbatore"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Taluk</label>
                      <input
                        type="text"
                        name="taluk"
                        value={formData.taluk}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Coimbatore South"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">District</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Coimbatore"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Tamil Nadu"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="India"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                      <input
                        type="text"
                        name="pin_code"
                        value={formData.pin_code}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold"
                        placeholder="641004"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: Parent / Guardian Details */}
              {activeTab === 'parents' && (
                <div className="space-y-6">
                  {/* Father Details */}
                  <div>
                    <div className="border-b border-slate-100 pb-2 mb-3 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Father Details</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Father Name</label>
                        <input
                          type="text"
                          name="father_name"
                          value={formData.father_name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                          placeholder="Father's full name"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                        <input
                          type="text"
                          name="father_mobile"
                          value={formData.father_mobile}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                          placeholder="10-digit mobile"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Email</label>
                        <input
                          type="email"
                          name="father_email"
                          value={formData.father_email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="father@example.com"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Aadhaar Number</label>
                        <input
                          type="text"
                          name="father_aadhaar"
                          value={formData.father_aadhaar}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                          placeholder="12-digit Aadhaar"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Occupation</label>
                        <input
                          type="text"
                          name="father_occupation"
                          value={formData.father_occupation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Qualification</label>
                        <input
                          type="text"
                          name="father_qualification"
                          value={formData.father_qualification}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. B.Tech / M.B.A"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Annual Income</label>
                        <input
                          type="text"
                          name="father_annual_income"
                          value={formData.father_annual_income}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. ₹ 8,50,000"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Organization / Company</label>
                        <input
                          type="text"
                          name="father_company"
                          value={formData.father_company}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Designation</label>
                        <input
                          type="text"
                          name="father_designation"
                          value={formData.father_designation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Job title"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mother Details */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Mother Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Mother Name</label>
                        <input
                          type="text"
                          name="mother_name"
                          value={formData.mother_name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                          placeholder="Mother's full name"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                        <input
                          type="text"
                          name="mother_mobile"
                          value={formData.mother_mobile}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                          placeholder="10-digit mobile"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Email</label>
                        <input
                          type="email"
                          name="mother_email"
                          value={formData.mother_email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="mother@example.com"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Aadhaar Number</label>
                        <input
                          type="text"
                          name="mother_aadhaar"
                          value={formData.mother_aadhaar}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                          placeholder="12-digit Aadhaar"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Occupation</label>
                        <input
                          type="text"
                          name="mother_occupation"
                          value={formData.mother_occupation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. Teacher / Homemaker"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Qualification</label>
                        <input
                          type="text"
                          name="mother_qualification"
                          value={formData.mother_qualification}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. M.Sc / B.Ed"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Annual Income</label>
                        <input
                          type="text"
                          name="mother_annual_income"
                          value={formData.mother_annual_income}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Annual Income"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Organization / Company</label>
                        <input
                          type="text"
                          name="mother_company"
                          value={formData.mother_company}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Designation</label>
                        <input
                          type="text"
                          name="mother_designation"
                          value={formData.mother_designation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Designation"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guardian Details */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Guardian (If Applicable)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Guardian Name</label>
                        <input
                          type="text"
                          name="guardian_name"
                          value={formData.guardian_name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Guardian full name"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                        <input
                          type="text"
                          name="guardian_relation"
                          value={formData.guardian_relation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Uncle / Grandparent / Local Guardian"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                        <input
                          type="text"
                          name="guardian_mobile"
                          value={formData.guardian_mobile}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                          placeholder="Guardian phone"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Email</label>
                        <input
                          type="email"
                          name="guardian_email"
                          value={formData.guardian_email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="guardian@example.com"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Occupation</label>
                        <input
                          type="text"
                          name="guardian_occupation"
                          value={formData.guardian_occupation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Occupation"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Address</label>
                        <input
                          type="text"
                          name="guardian_address"
                          value={formData.guardian_address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Guardian residence address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parent Settings */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Parent Settings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Primary Contact</label>
                        <select
                          name="primary_contact"
                          value={formData.primary_contact}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Emergency Contact</label>
                        <select
                          name="emergency_contact_pref"
                          value={formData.emergency_contact_pref}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Both Parents">Both Parents</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Parent Login Access</label>
                        <select
                          name="parent_login_access"
                          value={formData.parent_login_access}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                        >
                          <option value="Enabled">Enabled</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Communication Preference</label>
                        <select
                          name="communication_preference"
                          value={formData.communication_preference}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                        >
                          <option value="WhatsApp & SMS">WhatsApp & SMS</option>
                          <option value="SMS Only">SMS Only</option>
                          <option value="Email & SMS">Email & SMS</option>
                          <option value="Portal Only">Portal Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: Family Details */}
              {activeTab === 'family' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <Home className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">7. Family Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Family ID</label>
                      <input
                        type="text"
                        name="family_id"
                        value={formData.family_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="e.g. FAM-8823"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Family Type</label>
                      <select
                        name="family_type"
                        value={formData.family_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="Nuclear">Nuclear</option>
                        <option value="Joint">Joint</option>
                        <option value="Single Parent">Single Parent</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Number of Children in Family</label>
                      <input
                        type="number"
                        name="children_count"
                        value={formData.children_count}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Family Annual Income</label>
                      <input
                        type="text"
                        name="family_annual_income"
                        value={formData.family_annual_income}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Total combined income"
                      />
                    </div>
                  </div>

                  {/* Sibling Details */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Sibling Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Sibling Name</label>
                        <input
                          type="text"
                          name="sibling_name"
                          value={formData.sibling_name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Brother / Sister Name"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Sibling Admission Number</label>
                        <input
                          type="text"
                          name="sibling_admission_no"
                          value={formData.sibling_admission_no}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                          placeholder="ADM-2024-XXX"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Sibling Class</label>
                        <input
                          type="text"
                          name="sibling_class"
                          value={formData.sibling_class}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. Class 7"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Sibling Section</label>
                        <input
                          type="text"
                          name="sibling_section"
                          value={formData.sibling_section}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. A"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                        <input
                          type="text"
                          name="sibling_relationship"
                          value={formData.sibling_relationship}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Elder Brother / Younger Sister"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: Admission Details */}
              {activeTab === 'admission' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">8. Admission Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Enquiry Number</label>
                      <input
                        type="text"
                        name="enquiry_number"
                        value={formData.enquiry_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="ENQ-2025-042"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Registration Number</label>
                      <input
                        type="text"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="REG-2025-108"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Application Number</label>
                      <input
                        type="text"
                        name="application_number"
                        value={formData.application_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="APP-2025-559"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Number</label>
                      <input
                        type="text"
                        name="admission_number"
                        value={formData.admission_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold"
                        placeholder="ADM-2025-001"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Date</label>
                      <input
                        type="date"
                        name="admission_date"
                        value={formData.admission_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Type</label>
                      <select
                        name="admission_type"
                        value={formData.admission_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Lateral Entry">Lateral Entry</option>
                        <option value="Management">Management</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Category</label>
                      <select
                        name="admission_category"
                        value={formData.admission_category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="General">General</option>
                        <option value="Merit">Merit Scholarship</option>
                        <option value="Sports Quota">Sports Quota</option>
                        <option value="RTE (Right to Education)">RTE (Right to Education)</option>
                        <option value="Staff Child">Staff Child</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Quota</label>
                      <select
                        name="admission_quota"
                        value={formData.admission_quota}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="General Merit">General Merit</option>
                        <option value="Government Quota">Government Quota</option>
                        <option value="Management Quota">Management Quota</option>
                        <option value="NRI Quota">NRI Quota</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Admission Source</label>
                      <select
                        name="admission_source"
                        value={formData.admission_source}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="Direct Walk-in">Direct Walk-in</option>
                        <option value="School Website">School Website</option>
                        <option value="Parent Referral">Parent Referral</option>
                        <option value="Advertisement / Expo">Advertisement / Expo</option>
                        <option value="Social Media">Social Media</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Approved By</label>
                      <input
                        type="text"
                        name="approved_by"
                        value={formData.approved_by}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Principal / Admissions Officer"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Approval Date</label>
                      <input
                        type="date"
                        name="approval_date"
                        value={formData.approval_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="font-bold text-slate-700 block mb-1">Admission Remarks</label>
                      <textarea
                        rows={2}
                        name="admission_remarks"
                        value={formData.admission_remarks}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="Additional remarks, scholarships, or special conditions..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: Address Details */}
              {activeTab === 'address' && (
                <div className="space-y-6">
                  {/* Residential Address */}
                  <div>
                    <div className="border-b border-slate-100 pb-2 mb-3 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Residential Address</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-3">
                        <label className="font-bold text-slate-700 block mb-1">Full Residential Address</label>
                        <input
                          type="text"
                          name="residential_address_full"
                          value={formData.residential_address_full || formData.residential_address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="House / Flat / Street..."
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Door / Flat Number</label>
                        <input
                          type="text"
                          name="door_flat_no"
                          value={formData.door_flat_no}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Door No"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Street</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Street"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Area</label>
                        <input
                          type="text"
                          name="area_village"
                          value={formData.area_village}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Area / Locality"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Village / Town / City</label>
                        <input
                          type="text"
                          name="city_town"
                          value={formData.city_town}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Taluk</label>
                        <input
                          type="text"
                          name="taluk"
                          value={formData.taluk}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Taluk"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">District</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="District"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                        <input
                          type="text"
                          name="pin_code"
                          value={formData.pin_code}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold"
                          placeholder="PIN Code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Permanent Address</h4>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 cursor-pointer">
                        <input
                          type="checkbox"
                          name="same_as_residential"
                          checked={formData.same_as_residential}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              same_as_residential: isChecked,
                              perm_door_no: isChecked ? prev.door_flat_no : prev.perm_door_no,
                              perm_street: isChecked ? prev.street : prev.perm_street,
                              perm_area: isChecked ? prev.area_village : prev.perm_area,
                              perm_city: isChecked ? prev.city_town : prev.perm_city,
                              perm_taluk: isChecked ? prev.taluk : prev.perm_taluk,
                              perm_district: isChecked ? prev.district : prev.perm_district,
                              perm_state: isChecked ? prev.state : prev.perm_state,
                              perm_country: isChecked ? prev.country : prev.perm_country,
                              perm_pin_code: isChecked ? prev.pin_code : prev.perm_pin_code,
                              permanent_address_full: isChecked ? (prev.residential_address_full || prev.residential_address) : prev.permanent_address_full,
                            }));
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Same as Residential Address</span>
                      </label>
                    </div>

                    {!formData.same_as_residential && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="sm:col-span-3">
                          <label className="font-bold text-slate-700 block mb-1">Permanent Address</label>
                          <input
                            type="text"
                            name="permanent_address_full"
                            value={formData.permanent_address_full}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Full permanent residence address"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Door / Flat Number</label>
                          <input
                            type="text"
                            name="perm_door_no"
                            value={formData.perm_door_no}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Door No"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Street</label>
                          <input
                            type="text"
                            name="perm_street"
                            value={formData.perm_street}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Street"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Area</label>
                          <input
                            type="text"
                            name="perm_area"
                            value={formData.perm_area}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Area"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Village / Town / City</label>
                          <input
                            type="text"
                            name="perm_city"
                            value={formData.perm_city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Taluk</label>
                          <input
                            type="text"
                            name="perm_taluk"
                            value={formData.perm_taluk}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Taluk"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">District</label>
                          <input
                            type="text"
                            name="perm_district"
                            value={formData.perm_district}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="District"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">State</label>
                          <input
                            type="text"
                            name="perm_state"
                            value={formData.perm_state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Country</label>
                          <input
                            type="text"
                            name="perm_country"
                            value={formData.perm_country}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Country"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                          <input
                            type="text"
                            name="perm_pin_code"
                            value={formData.perm_pin_code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold"
                            placeholder="PIN Code"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 10: Medical / Health Details */}
              {activeTab === 'medical' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <HeartPulse className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">10. Medical / Health Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                      <select
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
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
                      <label className="font-bold text-slate-700 block mb-1">Height (cm)</label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="e.g. 142 cm"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="e.g. 38 kg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Medical Condition</label>
                      <input
                        type="text"
                        name="medical_condition"
                        value={formData.medical_condition}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="General / None"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Allergies</label>
                      <input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Peanuts, Penicillin, Dust, None"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Chronic Condition</label>
                      <input
                        type="text"
                        name="chronic_condition"
                        value={formData.chronic_condition}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Asthma, Diabetes, None"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Regular Medication</label>
                      <input
                        type="text"
                        name="regular_medication"
                        value={formData.regular_medication}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Name of medicines if taken daily"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Health Insurance</label>
                      <select
                        name="health_insurance"
                        value={formData.health_insurance}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Insurance Number</label>
                      <input
                        type="text"
                        name="insurance_number"
                        value={formData.insurance_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Policy / Card ID"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                      <input
                        type="text"
                        name="doctor_name"
                        value={formData.doctor_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Family Physician"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Doctor Contact Number</label>
                      <input
                        type="text"
                        name="doctor_contact"
                        value={formData.doctor_contact}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Clinic Phone Number"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic</label>
                      <input
                        type="text"
                        name="hospital_clinic"
                        value={formData.hospital_clinic}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Preferred Hospital Name"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="font-bold text-slate-700 block mb-1">Emergency Medical Information</label>
                      <textarea
                        rows={2}
                        name="emergency_medical_info"
                        value={formData.emergency_medical_info}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="Instructions for school nurse / first-aid in emergency..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 11: Emergency Contact */}
              {activeTab === 'emergency' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">11. Emergency Contact</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Name</label>
                      <input
                        type="text"
                        name="emergency_name"
                        value={formData.emergency_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                        placeholder="Emergency Contact Person"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                      <input
                        type="text"
                        name="emergency_relation"
                        value={formData.emergency_relation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Uncle / Neighbour / Grandparent"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                      <input
                        type="text"
                        name="emergency_mobile"
                        value={formData.emergency_mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold"
                        placeholder="Emergency Phone"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Alternate Mobile Number</label>
                      <input
                        type="text"
                        name="emergency_alt_mobile"
                        value={formData.emergency_alt_mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Secondary Phone"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email</label>
                      <input
                        type="email"
                        name="emergency_email"
                        value={formData.emergency_email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="emergency@example.com"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Authorized Person for Pickup</label>
                      <input
                        type="text"
                        name="pickup_person"
                        value={formData.pickup_person}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Authorized guardian / driver name"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Priority</label>
                      <select
                        name="emergency_priority"
                        value={formData.emergency_priority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="1 - High">1 - High</option>
                        <option value="2 - Medium">2 - Medium</option>
                        <option value="3 - Low">3 - Low</option>
                      </select>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="font-bold text-slate-700 block mb-1">Address</label>
                      <input
                        type="text"
                        name="emergency_address"
                        value={formData.emergency_address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Emergency contact residential address"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 12: Previous School Details */}
              {activeTab === 'previous_school' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <School className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">12. Previous School Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">Previous School Name</label>
                      <input
                        type="text"
                        name="prev_school_name"
                        value={formData.prev_school_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Full previous institution name"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">School Address</label>
                      <input
                        type="text"
                        name="prev_school_address"
                        value={formData.prev_school_address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="City, District, State"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Board</label>
                      <select
                        name="prev_board"
                        value={formData.prev_board}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="Matriculation">Matriculation</option>
                        <option value="IB">IB</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Medium</label>
                      <select
                        name="prev_medium"
                        value={formData.prev_medium}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Previous Class</label>
                      <input
                        type="text"
                        name="prev_class_studied"
                        value={formData.prev_class_studied}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. Class 4"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Previous Academic Year</label>
                      <input
                        type="text"
                        name="prev_academic_year"
                        value={formData.prev_academic_year}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 2024-2025"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Previous Admission Number</label>
                      <input
                        type="text"
                        name="prev_admission_number"
                        value={formData.prev_admission_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="Old School Roll / Adm No"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">TC Number</label>
                      <input
                        type="text"
                        name="tc_number"
                        value={formData.tc_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        placeholder="TC-2025-XXXX"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">TC Date</label>
                      <input
                        type="date"
                        name="tc_date"
                        value={formData.tc_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Previous Marks / Grade</label>
                      <input
                        type="text"
                        name="prev_marks_grade"
                        value={formData.prev_marks_grade}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 92% / Grade A1"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Reason for Transfer</label>
                      <input
                        type="text"
                        name="reason_for_transfer"
                        value={formData.reason_for_transfer}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Parent Job Relocation, etc."
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Transfer Certificate Document</label>
                      <input
                        type="text"
                        name="tc_document_name"
                        value={formData.tc_document_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        placeholder="Original TC Attached (Yes/No)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 13: Student Documents */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">13. Student Documents</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">
                    Track compliance and verification status of mandatory enrollment documents.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    {[
                      { key: 'doc_birth_certificate', label: 'Birth Certificate' },
                      { key: 'doc_aadhaar', label: 'Aadhaar' },
                      { key: 'doc_community_cert', label: 'Community Certificate' },
                      { key: 'doc_income_cert', label: 'Income Certificate' },
                      { key: 'doc_transfer_cert', label: 'Transfer Certificate' },
                      { key: 'doc_prev_marksheet', label: 'Previous Mark Sheet' },
                      { key: 'doc_passport', label: 'Passport' },
                      { key: 'doc_address_proof', label: 'Address Proof' },
                      { key: 'doc_medical_cert', label: 'Medical Certificate' },
                      { key: 'doc_disability_cert', label: 'Disability Certificate' },
                      { key: 'doc_other', label: 'Other Document' },
                    ].map((doc) => (
                      <div key={doc.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <label className="font-bold text-slate-800 block mb-1.5">{doc.label}</label>
                        <div className="flex items-center space-x-2">
                          <select
                            name={doc.key}
                            value={formData[doc.key] || 'Pending'}
                            onChange={handleChange}
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
                              formData[doc.key] === 'Submitted'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : formData[doc.key] === 'Pending'
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : 'bg-white border-slate-300 text-slate-700'
                            }`}
                          >
                            <option value="Submitted">Submitted & Verified</option>
                            <option value="Pending">Pending Submission</option>
                            <option value="Under Verification">Under Verification</option>
                            <option value="Not Required">Not Required</option>
                            <option value="N/A">N/A</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 14: Student Photo / Identity */}
              {activeTab === 'photo' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-800">14. Student Photo / Identity</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    {/* Student Photo */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-dashed border-emerald-300 flex items-center justify-center mb-3 overflow-hidden shadow-inner">
                        {formData.student_photo ? (
                          <img src={formData.student_photo} alt="Student" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-8 h-8 text-emerald-600" />
                        )}
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">Student Photo</h4>
                      <p className="text-[11px] text-slate-400 mb-3">Passport size formal portrait photo</p>
                      <input
                        type="text"
                        name="student_photo"
                        value={formData.student_photo}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono mb-2"
                        placeholder="Paste Image URL / base64"
                      />
                      <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Student Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData((prev) => ({ ...prev, student_photo: event.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Parent Photo */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-800 border-2 border-dashed border-indigo-300 flex items-center justify-center mb-3 overflow-hidden shadow-inner">
                        {formData.parent_photo ? (
                          <img src={formData.parent_photo} alt="Parent" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-indigo-600" />
                        )}
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">Parent / Guardian Photo</h4>
                      <p className="text-[11px] text-slate-400 mb-3">Primary contact identity photograph</p>
                      <input
                        type="text"
                        name="parent_photo"
                        value={formData.parent_photo}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono mb-2"
                        placeholder="Paste Image URL / base64"
                      />
                      <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Parent Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData((prev) => ({ ...prev, parent_photo: event.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrevTab}
            disabled={currentTabIndex === 0}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Tab</span>
          </button>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              Tab {currentTabIndex + 1} of {TABS.length}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{isSaving ? 'Saving Changes...' : 'Save All Details'}</span>
            </button>
            <button
              type="button"
              onClick={handleNextTab}
              disabled={currentTabIndex === TABS.length - 1}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next Tab</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentComprehensiveEditModal;
