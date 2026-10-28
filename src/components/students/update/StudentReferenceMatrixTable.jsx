import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Save,
  Loader2,
  CheckCircle2,
  X,
  RefreshCw,
  User,
  Hash,
  GraduationCap,
  Calendar,
  Phone,
  Users,
  Home,
  BookOpen,
  MapPin,
  HeartPulse,
  AlertCircle,
  Landmark,
  FileText,
  Camera,
  Download,
  Upload,
  FileSpreadsheet,
  ArrowLeft,
  PanelLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStudents, getClasses, getSections, getAcademicGroups, getBranches, bulkUpdateStudents } from '../../../services/api';
import { useErp } from '../../../context/ErpContext';
import { StudentCsvExportModal } from './StudentCsvExportModal';
import { StudentCsvImportModal } from './StudentCsvImportModal';

// 14 Tab Definitions
const TABS = [
  { id: 'tab1', num: 1, label: 'Student Name', icon: User },
  { id: 'tab2', num: 2, label: 'Identification', icon: Hash },
  { id: 'tab3', num: 3, label: 'Academic Details', icon: GraduationCap },
  { id: 'tab4', num: 4, label: 'Basic Details', icon: Calendar },
  { id: 'tab5', num: 5, label: 'Contact Details', icon: Phone },
  { id: 'tab6', num: 6, label: 'Parent / Guardian', icon: Users },
  { id: 'tab7', num: 7, label: 'Family Details', icon: Home },
  { id: 'tab8', num: 8, label: 'Admission Details', icon: BookOpen },
  { id: 'tab9', num: 9, label: 'Address Details', icon: MapPin },
  { id: 'tab10', num: 10, label: 'Medical / Health', icon: HeartPulse },
  { id: 'tab11', num: 11, label: 'Emergency Contact', icon: AlertCircle },
  { id: 'tab12', num: 12, label: 'Previous School', icon: Landmark },
  { id: 'tab13', num: 13, label: 'Student Documents', icon: FileText },
  { id: 'tab14', num: 14, label: 'Photo / Identity', icon: Camera },
];

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES = ['Active', 'Inactive', 'Transferred', 'TC Issued', 'Withdrawn'];
const DOC_STATUSES = ['Submitted', 'Pending', 'Verified', 'Not Applicable'];

// Column schema for each of the 14 tabs
const TAB_COLUMNS = {
  tab1: [
    { key: 'first_name', label: 'First Name *', width: 'min-w-[140px]' },
    { key: 'middle_name', label: 'Middle Name', width: 'min-w-[130px]' },
    { key: 'last_name', label: 'Last Name *', width: 'min-w-[140px]' },
    { key: 'display_name', label: 'Student Display Name', width: 'min-w-[160px]' },
    { key: 'regional_name', label: 'Name in Regional Language', width: 'min-w-[180px]' },
  ],
  tab2: [
    { key: 'admission_number', label: 'Admission No *', width: 'min-w-[140px]' },
    { key: 'roll_number', label: 'Roll Number', width: 'min-w-[110px]' },
    { key: 'emis_number', label: 'EMIS Number', width: 'min-w-[140px]' },
    { key: 'pen_apaar_id', label: 'PEN / APAAR ID', width: 'min-w-[150px]' },
    { key: 'aadhaar_number', label: 'Aadhaar Number', width: 'min-w-[150px]' },
    { key: 'passport_number', label: 'Passport Number', width: 'min-w-[140px]' },
    { key: 'other_id_number', label: 'Other ID Number', width: 'min-w-[140px]' },
    { key: 'erp_student_id', label: 'ERP / Student ID', width: 'min-w-[140px]' },
  ],
  tab3: [
    { key: 'admission_date', label: 'Admission Date', type: 'date', width: 'min-w-[140px]' },
    { key: 'admission_class', label: 'Admission Class', width: 'min-w-[130px]' },
    { key: 'stream', label: 'Stream', width: 'min-w-[120px]' },
    { key: 'house', label: 'House', width: 'min-w-[120px]' },
    { key: 'medium', label: 'Medium', type: 'select', options: ['English', 'Tamil', 'Hindi', 'Other'], width: 'min-w-[120px]' },
    { key: 'curriculum', label: 'Board / Curriculum', type: 'select', options: ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'], width: 'min-w-[140px]' },
    { key: 'previous_school', label: 'Previous School', width: 'min-w-[180px]' },
    { key: 'previous_class', label: 'Previous Class', width: 'min-w-[120px]' },
    { key: 'previous_academic_year', label: 'Prev Academic Year', width: 'min-w-[140px]' },
    { key: 'current_status', label: 'Student Status', type: 'select', options: STATUSES, width: 'min-w-[130px]' },
    { key: 'date_of_leaving', label: 'Date of Leaving', type: 'date', width: 'min-w-[140px]' },
    { key: 'reason_for_leaving', label: 'Reason for Leaving', width: 'min-w-[180px]' },
  ],
  tab4: [
    { key: 'dob', label: 'Date of Birth *', type: 'date', width: 'min-w-[140px]' },
    { key: 'gender', label: 'Gender *', type: 'select', options: GENDERS, width: 'min-w-[110px]' },
    { key: 'blood_group', label: 'Blood Group', type: 'select', options: BLOOD_GROUPS, width: 'min-w-[110px]' },
    { key: 'nationality', label: 'Nationality', width: 'min-w-[120px]' },
    { key: 'mother_tongue', label: 'Mother Tongue', width: 'min-w-[120px]' },
    { key: 'religion', label: 'Religion', width: 'min-w-[120px]' },
    { key: 'community', label: 'Community', type: 'select', options: ['General', 'OBC', 'SC', 'ST', 'Minorities', 'Other'], width: 'min-w-[130px]' },
    { key: 'caste', label: 'Caste', width: 'min-w-[120px]' },
    { key: 'caste_certificate_no', label: 'Caste Certificate No', width: 'min-w-[150px]' },
    { key: 'identification_mark_1', label: 'Identification Mark 1', width: 'min-w-[160px]' },
    { key: 'identification_mark_2', label: 'Identification Mark 2', width: 'min-w-[160px]' },
    { key: 'is_differently_abled', label: 'Differently Abled', type: 'select', options: ['No', 'Yes'], width: 'min-w-[130px]' },
    { key: 'disability_type', label: 'Disability Type', width: 'min-w-[140px]' },
    { key: 'disability_percentage', label: 'Disability %', width: 'min-w-[110px]' },
  ],
  tab5: [
    { key: 'student_mobile', label: 'Mobile Number', width: 'min-w-[140px]' },
    { key: 'alternate_mobile', label: 'Alternate Mobile', width: 'min-w-[140px]' },
    { key: 'email', label: 'Email', width: 'min-w-[180px]' },
    { key: 'residential_door_no', label: 'Door / Flat No', width: 'min-w-[120px]' },
    { key: 'residential_street', label: 'Street', width: 'min-w-[150px]' },
    { key: 'residential_area', label: 'Area / Village', width: 'min-w-[150px]' },
    { key: 'residential_city', label: 'City / Town', width: 'min-w-[140px]' },
    { key: 'residential_taluk', label: 'Taluk', width: 'min-w-[130px]' },
    { key: 'residential_district', label: 'District', width: 'min-w-[130px]' },
    { key: 'residential_state', label: 'State', width: 'min-w-[130px]' },
    { key: 'residential_country', label: 'Country', width: 'min-w-[120px]' },
    { key: 'residential_pin', label: 'PIN Code', width: 'min-w-[110px]' },
  ],
  tab6: [
    { key: 'father_name', label: 'Father Name', width: 'min-w-[150px]' },
    { key: 'father_mobile', label: 'Father Mobile', width: 'min-w-[130px]' },
    { key: 'father_email', label: 'Father Email', width: 'min-w-[160px]' },
    { key: 'father_aadhaar', label: 'Father Aadhaar', width: 'min-w-[140px]' },
    { key: 'father_occupation', label: 'Father Occupation', width: 'min-w-[140px]' },
    { key: 'father_qualification', label: 'Father Qualification', width: 'min-w-[140px]' },
    { key: 'father_annual_income', label: 'Father Annual Income', width: 'min-w-[140px]' },
    { key: 'mother_name', label: 'Mother Name', width: 'min-w-[150px]' },
    { key: 'mother_mobile', label: 'Mother Mobile', width: 'min-w-[130px]' },
    { key: 'mother_email', label: 'Mother Email', width: 'min-w-[160px]' },
    { key: 'mother_aadhaar', label: 'Mother Aadhaar', width: 'min-w-[140px]' },
    { key: 'mother_occupation', label: 'Mother Occupation', width: 'min-w-[140px]' },
    { key: 'guardian_name', label: 'Guardian Name', width: 'min-w-[150px]' },
    { key: 'guardian_relation', label: 'Guardian Relation', width: 'min-w-[130px]' },
    { key: 'guardian_mobile', label: 'Guardian Mobile', width: 'min-w-[130px]' },
    { key: 'primary_contact', label: 'Primary Contact', type: 'select', options: ['Father', 'Mother', 'Guardian'], width: 'min-w-[130px]' },
    { key: 'emergency_contact_role', label: 'Emergency Contact', type: 'select', options: ['Father', 'Mother', 'Guardian'], width: 'min-w-[140px]' },
  ],
  tab7: [
    { key: 'family_id', label: 'Family ID', width: 'min-w-[120px]' },
    { key: 'family_type', label: 'Family Type', type: 'select', options: ['Nuclear', 'Joint', 'Single Parent'], width: 'min-w-[130px]' },
    { key: 'children_count', label: 'Children in Family', type: 'number', width: 'min-w-[130px]' },
    { key: 'family_annual_income', label: 'Family Annual Income', width: 'min-w-[150px]' },
    { key: 'sibling_name', label: 'Sibling Name', width: 'min-w-[150px]' },
    { key: 'sibling_admission_no', label: 'Sibling Admission No', width: 'min-w-[140px]' },
    { key: 'sibling_class', label: 'Sibling Class', width: 'min-w-[120px]' },
    { key: 'sibling_section', label: 'Sibling Section', width: 'min-w-[110px]' },
    { key: 'sibling_relationship', label: 'Relationship', type: 'select', options: ['Brother', 'Sister', 'Cousin'], width: 'min-w-[120px]' },
  ],
  tab8: [
    { key: 'enquiry_number', label: 'Enquiry Number', width: 'min-w-[140px]' },
    { key: 'registration_number', label: 'Registration No', width: 'min-w-[140px]' },
    { key: 'application_number', label: 'Application No', width: 'min-w-[140px]' },
    { key: 'admission_number', label: 'Admission Number', width: 'min-w-[140px]' },
    { key: 'admission_date', label: 'Admission Date', type: 'date', width: 'min-w-[140px]' },
    { key: 'admission_type', label: 'Admission Type', type: 'select', options: ['Regular', 'Transfer', 'Lateral', 'Other'], width: 'min-w-[130px]' },
    { key: 'admission_category', label: 'Admission Category', type: 'select', options: ['General', 'Management', 'Merit', 'RTE', 'Sports'], width: 'min-w-[140px]' },
    { key: 'admission_quota', label: 'Admission Quota', width: 'min-w-[130px]' },
    { key: 'admission_source', label: 'Admission Source', width: 'min-w-[140px]' },
    { key: 'admission_remarks', label: 'Admission Remarks', width: 'min-w-[180px]' },
    { key: 'approved_by', label: 'Approved By', width: 'min-w-[140px]' },
    { key: 'approval_date', label: 'Approval Date', type: 'date', width: 'min-w-[140px]' },
  ],
  tab9: [
    { key: 'residential_door_no', label: 'Res. Door/Flat', width: 'min-w-[120px]' },
    { key: 'residential_street', label: 'Res. Street', width: 'min-w-[150px]' },
    { key: 'residential_area', label: 'Res. Area / Village', width: 'min-w-[150px]' },
    { key: 'residential_city', label: 'Res. City / Town', width: 'min-w-[140px]' },
    { key: 'residential_district', label: 'Res. District', width: 'min-w-[130px]' },
    { key: 'residential_state', label: 'Res. State', width: 'min-w-[130px]' },
    { key: 'residential_pin', label: 'Res. PIN Code', width: 'min-w-[110px]' },
    { key: 'permanent_door_no', label: 'Perm. Door/Flat', width: 'min-w-[120px]' },
    { key: 'permanent_street', label: 'Perm. Street', width: 'min-w-[150px]' },
    { key: 'permanent_city', label: 'Perm. City / Town', width: 'min-w-[140px]' },
    { key: 'permanent_district', label: 'Perm. District', width: 'min-w-[130px]' },
    { key: 'permanent_state', label: 'Perm. State', width: 'min-w-[130px]' },
    { key: 'permanent_pin', label: 'Perm. PIN Code', width: 'min-w-[110px]' },
  ],
  tab10: [
    { key: 'blood_group', label: 'Blood Group', type: 'select', options: BLOOD_GROUPS, width: 'min-w-[110px]' },
    { key: 'height_cm', label: 'Height (cm)', width: 'min-w-[100px]' },
    { key: 'weight_kg', label: 'Weight (kg)', width: 'min-w-[100px]' },
    { key: 'medical_condition', label: 'Medical Condition', width: 'min-w-[160px]' },
    { key: 'allergies', label: 'Allergies', width: 'min-w-[140px]' },
    { key: 'chronic_condition', label: 'Chronic Condition', width: 'min-w-[150px]' },
    { key: 'regular_medication', label: 'Regular Medication', width: 'min-w-[150px]' },
    { key: 'emergency_medical_info', label: 'Emergency Med Info', width: 'min-w-[160px]' },
    { key: 'doctor_name', label: 'Doctor Name', width: 'min-w-[140px]' },
    { key: 'doctor_contact', label: 'Doctor Contact', width: 'min-w-[130px]' },
    { key: 'hospital_clinic', label: 'Hospital / Clinic', width: 'min-w-[150px]' },
    { key: 'insurance_number', label: 'Insurance Policy No', width: 'min-w-[150px]' },
  ],
  tab11: [
    { key: 'emergency_contact_name', label: 'Contact Name', width: 'min-w-[150px]' },
    { key: 'emergency_contact_relation', label: 'Relationship', width: 'min-w-[130px]' },
    { key: 'emergency_contact_mobile', label: 'Mobile Number', width: 'min-w-[130px]' },
    { key: 'emergency_contact_alt_mobile', label: 'Alternate Mobile', width: 'min-w-[140px]' },
    { key: 'emergency_contact_email', label: 'Email Address', width: 'min-w-[160px]' },
    { key: 'emergency_contact_address', label: 'Address', width: 'min-w-[180px]' },
    { key: 'authorized_pickup', label: 'Authorized Pickup', type: 'select', options: ['Yes', 'No'], width: 'min-w-[130px]' },
    { key: 'priority', label: 'Priority', type: 'select', options: ['Primary', 'Secondary'], width: 'min-w-[110px]' },
  ],
  tab12: [
    { key: 'previous_school_name', label: 'Previous School Name', width: 'min-w-[180px]' },
    { key: 'previous_school_address', label: 'School Address', width: 'min-w-[180px]' },
    { key: 'previous_board', label: 'Board', type: 'select', options: ['CBSE', 'ICSE', 'State Board', 'IB', 'Other'], width: 'min-w-[130px]' },
    { key: 'previous_medium', label: 'Medium', type: 'select', options: ['English', 'Tamil', 'Hindi', 'Other'], width: 'min-w-[120px]' },
    { key: 'previous_class', label: 'Previous Class', width: 'min-w-[120px]' },
    { key: 'previous_academic_year', label: 'Prev Academic Year', width: 'min-w-[140px]' },
    { key: 'previous_admission_number', label: 'Prev Admission No', width: 'min-w-[140px]' },
    { key: 'tc_number', label: 'TC Number', width: 'min-w-[120px]' },
    { key: 'tc_date', label: 'TC Date', type: 'date', width: 'min-w-[130px]' },
    { key: 'previous_marks', label: 'Previous Marks / %', width: 'min-w-[140px]' },
    { key: 'reason_for_transfer', label: 'Reason for Transfer', width: 'min-w-[170px]' },
  ],
  tab13: [
    { key: 'doc_birth_certificate', label: 'Birth Certificate', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
    { key: 'doc_aadhaar', label: 'Aadhaar Card', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
    { key: 'doc_community_cert', label: 'Community Certificate', type: 'select', options: DOC_STATUSES, width: 'min-w-[150px]' },
    { key: 'doc_income_cert', label: 'Income Certificate', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
    { key: 'doc_tc', label: 'Transfer Certificate', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
    { key: 'doc_mark_sheet', label: 'Prev Mark Sheet', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
    { key: 'doc_passport', label: 'Passport', type: 'select', options: DOC_STATUSES, width: 'min-w-[130px]' },
    { key: 'doc_address_proof', label: 'Address Proof', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
    { key: 'doc_medical_cert', label: 'Medical Certificate', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
    { key: 'doc_disability_cert', label: 'Disability Certificate', type: 'select', options: DOC_STATUSES, width: 'min-w-[150px]' },
    { key: 'doc_other', label: 'Other Document', type: 'select', options: DOC_STATUSES, width: 'min-w-[140px]' },
  ],
  tab14: [
    { key: 'photo_url', label: 'Student Photo (URL/Key)', width: 'min-w-[180px]' },
    { key: 'parent_photo_url', label: 'Parent Photo (URL/Key)', width: 'min-w-[180px]' },
    { key: 'id_card_status', label: 'ID Card Status', type: 'select', options: ['Issued', 'Pending', 'Reissue Requested'], width: 'min-w-[150px]' },
    { key: 'biometric_enrolled', label: 'Biometric Enrolled', type: 'select', options: ['Yes', 'No'], width: 'min-w-[140px]' },
    { key: 'rfid_card_number', label: 'RFID Card Number', width: 'min-w-[150px]' },
  ],
};

export const StudentReferenceMatrixTable = ({
  students: propStudents,
  classes: propClasses,
  sections: propSections,
  academicGroups: propAcademicGroups,
  branches: propBranches,
  selectedBranchId: propSelectedBranchId,
  branchId,
  initialStudentId = null,
  onBranchChange,
  academicYearId,
  isLoading: propIsLoading = false,
  onRefresh,
  onBack,
}) => {
  const navigate = useNavigate();
  const { isReadOnly, showToast, isSuperAdmin, isPrincipal, assignedBranchId, accessibleBranches } = useErp();

  // Active Tab State (defaults to Tab 1: Student Name)
  const [activeTab, setActiveTab] = useState('tab1');

  // Internal state when not supplied by parent
  const [internalStudents, setInternalStudents] = useState([]);
  const [internalClasses, setInternalClasses] = useState([]);
  const [internalSections, setInternalSections] = useState([]);
  const [internalGroups, setInternalGroups] = useState([]);
  const [internalBranches, setInternalBranches] = useState([]);
  const [internalBranchId, setInternalBranchId] = useState(() => {
    if (!isSuperAdmin && assignedBranchId) return Number(assignedBranchId);
    return propSelectedBranchId !== undefined ? propSelectedBranchId : (branchId !== undefined ? branchId : 'all');
  });
  const [internalLoading, setInternalLoading] = useState(false);

  // Filter state
  const [filterClassId, setFilterClassId] = useState('all');
  const [filterSectionId, setFilterSectionId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Row edit tracking: { [studentId]: { field: value } }
  const [rowEdits, setRowEdits] = useState({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  // CSV Export & Import Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Toggle for 14-tabs category sidebar visibility
  const [isTabsSidebarVisible, setIsTabsSidebarVisible] = useState(true);

  // Navigation back handler
  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/students/details');
    }
  };

  // Effective values
  const currentBranchId = useMemo(() => {
    if (!isSuperAdmin && assignedBranchId) return Number(assignedBranchId);
    return propSelectedBranchId !== undefined ? propSelectedBranchId : (branchId !== undefined ? branchId : internalBranchId);
  }, [isSuperAdmin, assignedBranchId, propSelectedBranchId, branchId, internalBranchId]);

  const branches = useMemo(() => {
    if (!isSuperAdmin) {
      return accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : (internalBranches.filter(b => Number(b.id) === Number(assignedBranchId)));
    }
    return propBranches && propBranches.length > 0 ? propBranches : internalBranches;
  }, [isSuperAdmin, accessibleBranches, assignedBranchId, propBranches, internalBranches]);

  const classes = propClasses && propClasses.length > 0 ? propClasses : internalClasses;
  const sections = propSections && propSections.length > 0 ? propSections : internalSections;
  const students = propStudents !== undefined ? propStudents : internalStudents;
  const isLoading = propIsLoading || internalLoading;

  // Self-fetch if students not supplied by parent
  const fetchInternalData = useCallback(async () => {
    if (propStudents !== undefined) return;
    setInternalLoading(true);
    try {
      const [stuRes, clsRes, secRes, grpRes, brRes] = await Promise.all([
        getStudents({
          branch_id: currentBranchId === 'all' ? undefined : currentBranchId,
          academic_year_id: academicYearId,
          class_id: filterClassId !== 'all' ? Number(filterClassId) : undefined,
          // Only pass section_id if a specific class is selected AND section is numeric ID
          section_id:
            filterClassId !== 'all' && filterSectionId !== 'all' && !isNaN(Number(filterSectionId))
              ? Number(filterSectionId)
              : undefined,
          page_size: 200,
        }),
        !propClasses || propClasses.length === 0
          ? getClasses(currentBranchId === 'all' ? undefined : currentBranchId, academicYearId)
          : Promise.resolve({ data: [] }),
        !propSections || propSections.length === 0
          ? getSections(currentBranchId === 'all' ? 1 : currentBranchId, academicYearId)
          : Promise.resolve({ data: [] }),
        !propAcademicGroups || propAcademicGroups.length === 0
          ? getAcademicGroups({
              branch_id: currentBranchId === 'all' ? undefined : currentBranchId,
              academic_year_id: academicYearId,
            })
          : Promise.resolve([]),
        !propBranches || propBranches.length === 0 ? getBranches() : Promise.resolve([]),
      ]);
      setInternalStudents(stuRes?.data || []);
      if (clsRes?.data && (!propClasses || propClasses.length === 0)) setInternalClasses(clsRes.data);
      if (secRes?.data && (!propSections || propSections.length === 0)) setInternalSections(secRes.data);
      if (Array.isArray(grpRes) && (!propAcademicGroups || propAcademicGroups.length === 0)) setInternalGroups(grpRes);
      if (Array.isArray(brRes) && (!propBranches || propBranches.length === 0)) setInternalBranches(brRes);
    } catch (err) {
      console.error('Error fetching matrix reference data:', err);
    } finally {
      setInternalLoading(false);
    }
  }, [propStudents, currentBranchId, academicYearId, filterClassId, filterSectionId, propClasses, propSections, propAcademicGroups, propBranches]);

  useEffect(() => {
    if (propStudents === undefined) {
      fetchInternalData();
    }
  }, [fetchInternalData, propStudents]);

  const handleBranchSelect = (newBranchId) => {
    setInternalBranchId(newBranchId);
    if (onBranchChange) {
      onBranchChange(newBranchId);
    }
  };

  // Filter students based on Class, Section, and Search Query (across ALL grades)
  const filteredStudents = useMemo(() => {
    return (students || []).filter((s) => {
      if (filterClassId !== 'all' && Number(s.class_id) !== Number(filterClassId)) {
        return false;
      }
      if (filterSectionId !== 'all') {
        const targetSection = String(filterSectionId).trim().toUpperCase();
        const studentSecName = String(s.section_name || '').trim().toUpperCase();
        const studentSecId = String(s.section_id || '').trim();
        // Match by section name ('A', 'B') across ALL grades, or by section ID
        if (studentSecName !== targetSection && studentSecId !== targetSection) {
          return false;
        }
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (s.full_name || `${s.first_name || ''} ${s.last_name || ''}`).toLowerCase();
        const code = (s.admission_number || s.student_id || '').toLowerCase();
        const roll = String(s.roll_number || '');
        const mobile = (s.student_mobile || s.father_mobile || '').toLowerCase();
        if (!name.includes(q) && !code.includes(q) && !roll.includes(q) && !mobile.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [students, filterClassId, filterSectionId, searchQuery]);

  // Available sections for filter dropdown (deduplicated across all grades or filtered by class)
  const availableFilterSections = useMemo(() => {
    if (filterClassId !== 'all') {
      return (sections || [])
        .filter((sec) => !sec.class_id || Number(sec.class_id) === Number(filterClassId))
        .map((sec) => {
          const name = sec.name || sec.section_name || `Section ${sec.id}`;
          return { value: name, label: name, id: sec.id };
        });
    }

    // When "All Classes" is selected: extract unique section names across all grades
    const seen = new Set();
    const result = [];
    (sections || []).forEach((sec) => {
      const name = (sec.name || sec.section_name || '').trim();
      if (name && !seen.has(name.toUpperCase())) {
        seen.add(name.toUpperCase());
        result.push({ value: name, label: name, id: name });
      }
    });

    (students || []).forEach((st) => {
      const name = (st.section_name || '').trim();
      if (name && !seen.has(name.toUpperCase())) {
        seen.add(name.toUpperCase());
        result.push({ value: name, label: name, id: name });
      }
    });

    return result.sort((a, b) => a.label.localeCompare(b.label));
  }, [sections, filterClassId, students]);

  const modifiedCount = Object.keys(rowEdits).length;

  // Handle cell edit
  const handleFieldChange = useCallback((studentId, field, value) => {
    setRowEdits((prev) => {
      const currentStudentEdits = prev[studentId] || {};
      const updated = { ...currentStudentEdits, [field]: value };
      return { ...prev, [studentId]: updated };
    });
  }, []);

  // Compute cell value considering pending edits
  const getVal = useCallback(
    (s, field, defaultVal = '') => {
      const edits = rowEdits[s.id];
      if (edits && edits[field] !== undefined) {
        return edits[field];
      }
      return s[field] !== undefined && s[field] !== null ? s[field] : defaultVal;
    },
    [rowEdits]
  );

  // Compute Student Name based on current edits
  const computeStudentName = useCallback(
    (s) => {
      const fn = getVal(s, 'first_name', s.first_name || '');
      const mn = getVal(s, 'middle_name', s.middle_name || '');
      const ln = getVal(s, 'last_name', s.last_name || '');
      const computed = [fn, mn, ln].filter(Boolean).join(' ').toUpperCase();
      return computed || (s.full_name || '').toUpperCase();
    },
    [getVal]
  );

  // Save all modified rows
  const handleSaveAll = async () => {
    if (isReadOnly) {
      if (showToast) showToast('Cannot update records in historical academic year', 'error');
      return;
    }
    const itemEntries = Object.entries(rowEdits);
    if (itemEntries.length === 0) {
      if (showToast) showToast('No changes detected', 'info');
      return;
    }
    setIsSavingAll(true);
    try {
      const items = itemEntries.map(([idStr, changes]) => ({
        id: Number(idStr),
        ...changes,
      }));
      await bulkUpdateStudents({
        items,
        academic_year_id: academicYearId,
      });
      setRowEdits({});
      if (showToast) showToast(`Successfully saved changes for ${items.length} student(s)`, 'success');
      if (onRefresh) onRefresh();
      else fetchInternalData();
    } catch (err) {
      console.error('Save all error:', err);
      if (showToast) showToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setIsSavingAll(false);
    }
  };

  // Discard all changes
  const handleDiscardAll = () => {
    if (window.confirm('Discard all unsaved edits across this table?')) {
      setRowEdits({});
      if (showToast) showToast('Unsaved edits discarded', 'info');
    }
  };

  // Apply imported edits to local table state (staging mode)
  const handleApplyImportEdits = (incomingEdits) => {
    setRowEdits((prev) => {
      const merged = { ...prev };
      Object.entries(incomingEdits).forEach(([stuId, changes]) => {
        merged[stuId] = { ...(merged[stuId] || {}), ...changes };
      });
      return merged;
    });
  };

  // Active tab's column definitions
  const activeColumns = TAB_COLUMNS[activeTab] || [];

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* TOP HEADER: BACK BUTTON & TITLE */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer border border-slate-300"
            title="Return to Student Details"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Back to Students</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Student Information Matrix (14 Tabs)</h1>
            <p className="text-[11px] text-slate-500">Bulk edit, export and import student records across classes</p>
          </div>
        </div>

        {/* Toggle 14-Tabs Sidebar button */}
        <button
          type="button"
          onClick={() => setIsTabsSidebarVisible((prev) => !prev)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          title={isTabsSidebarVisible ? 'Collapse Categories sidebar' : 'Expand Categories sidebar'}
        >
          <PanelLeft className="w-3.5 h-3.5" />
          <span>{isTabsSidebarVisible ? 'Hide Categories' : 'Show Categories'}</span>
        </button>
      </div>

      {/* FILTER & BATCH ACTION BAR */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          {/* Dropdown Filters & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            {/* Branch filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Branch {!isSuperAdmin && <span className="text-[10px] text-teal-600 font-normal">(Assigned)</span>}
              </label>
              {isSuperAdmin ? (
                <select
                  value={currentBranchId}
                  onChange={(e) =>
                    handleBranchSelect(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="all">All Branches</option>
                  {(branches || []).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branch_name} {b.branch_code ? `(${b.branch_code})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 truncate">
                  {(branches && branches[0]?.branch_name) || 'Assigned Branch'} {branches && branches[0]?.branch_code ? `(${branches[0].branch_code})` : ''}
                </div>
              )}
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Class</label>
              <select
                value={filterClassId}
                onChange={(e) =>
                  setFilterClassId(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">All Classes</option>
                {(classes || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter (supports filtering A, B across ALL grades) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Section</label>
              <select
                value={filterSectionId}
                onChange={(e) => setFilterSectionId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">All Sections</option>
                {availableFilterSections.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Search Records</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, code, mobile..."
                  className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Save / Discard / Import / Export Actions */}
          <div className="flex items-center space-x-2 shrink-0 pt-2 lg:pt-0">
            {/* Export CSV */}
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-xs font-bold cursor-pointer shadow-2xs transition-colors whitespace-nowrap"
              title="Export CSV with 14-tab field selector"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            {/* Import CSV */}
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-xs font-bold cursor-pointer shadow-2xs transition-colors whitespace-nowrap"
              title="Import CSV to bulk update students"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Import CSV</span>
            </button>

            {modifiedCount > 0 && (
              <>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                  {modifiedCount} modified
                </span>
                <button
                  type="button"
                  onClick={handleDiscardAll}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  Discard
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll || modifiedCount === 0 || isReadOnly}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-40 cursor-pointer shadow-xs transition-colors whitespace-nowrap"
            >
              {isSavingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save All Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 14-TAB LEFT SIDEBAR & MATRIX SPREADSHEET TABLE LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* LEFT SIDE: 14-TAB NAVIGATION */}
        {isTabsSidebarVisible && (
          <div className="w-full lg:w-64 shrink-0 bg-white rounded-xl border border-slate-200 shadow-2xs p-2.5 flex flex-col space-y-1">
            <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories (14 Tabs)</span>
            </div>
            <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-thin">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {tab.num}
                    </span>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RIGHT SIDE: MATRIX SPREADSHEET TABLE */}
        <div className="flex-1 min-w-0 w-full bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col min-h-[550px]">
          <div className="flex-1 flex flex-col min-w-0 p-4">
            {/* Header area */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {TABS.find((t) => t.id === activeTab)?.num}. {TABS.find((t) => t.id === activeTab)?.label}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">Student Matrix Table</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredStudents.length} student(s) • Directly edit values inside spreadsheet cells and click Save All Changes
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onRefresh || fetchInternalData}
                  title="Reload students"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Table Container */}
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <p className="text-sm font-medium">Loading student matrix records...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No students found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  No students match the current filters. Select different criteria or clear search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs max-h-[650px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse font-normal">
                  {/* HEAD */}
                  <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs text-slate-700 font-bold border-b border-slate-300 z-20 shadow-2xs">
                    <tr>
                      {/* Fixed Static Columns: Student ID & Student Name only */}
                      <th className="px-3 py-2.5 border-r border-slate-200 text-center w-12 whitespace-nowrap">#</th>
                      <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap min-w-[95px] text-center bg-slate-50 font-mono">
                        Student ID
                      </th>
                      <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap min-w-[180px] sticky left-0 bg-slate-100 z-30 shadow-xs">
                        Student Name
                      </th>

                      {/* Active Tab Dynamic Columns */}
                      {activeColumns.map((col) => (
                        <th
                          key={col.key}
                          className={`px-3 py-2.5 border-r border-slate-200 whitespace-nowrap ${col.width || 'min-w-[130px]'}`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredStudents.map((s, idx) => {
                      const studentId = s.id;
                      const isRowModified = !!rowEdits[studentId];
                      const enrollmentCode = s.admission_number || s.student_id;
                      const computedName = computeStudentName(s);

                      return (
                        <tr
                          key={studentId}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            initialStudentId && Number(initialStudentId) === Number(studentId)
                              ? 'ring-2 ring-emerald-500 bg-emerald-50/60 '
                              : ''
                          }${isRowModified ? 'bg-amber-50/40' : ''}`}
                        >
                          {/* S.No */}
                          <td className="px-3 py-2 border-r border-slate-200 text-center font-semibold text-slate-500">
                            {idx + 1}
                          </td>

                          {/* Student Primary ID: Read-Only */}
                          <td className="px-2.5 py-2 border-r border-slate-200 text-center font-mono font-bold text-slate-700 bg-slate-50/70">
                            #{s.id}
                          </td>

                          {/* Student Name (Sticky Left Column) */}
                          <td className="px-3 py-2 border-r border-slate-200 font-bold text-slate-900 sticky left-0 bg-white z-10 shadow-xs">
                            {computedName}
                          </td>

                          {/* Dynamic Cells for Current Tab */}
                          {activeColumns.map((col) => {
                            const val = getVal(s, col.key, s[col.key] || '');
                            return (
                              <td key={col.key} className="px-2 py-1.5 border-r border-slate-200">
                                {col.type === 'select' ? (
                                  <select
                                    value={val}
                                    onChange={(e) => handleFieldChange(studentId, col.key, e.target.value)}
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                                  >
                                    <option value="">Select {col.label}</option>
                                    {(col.options || []).map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                ) : col.type === 'date' ? (
                                  <input
                                    type="date"
                                    value={val ? String(val).split('T')[0] : ''}
                                    onChange={(e) => handleFieldChange(studentId, col.key, e.target.value)}
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                                  />
                                ) : col.type === 'number' ? (
                                  <input
                                    type="number"
                                    value={val}
                                    onChange={(e) => handleFieldChange(studentId, col.key, e.target.value ? Number(e.target.value) : '')}
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleFieldChange(studentId, col.key, e.target.value)}
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                                  />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* CSV EXPORT MODAL */}
      <StudentCsvExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        students={students}
        filteredStudents={filteredStudents}
        currentTabId={activeTab}
        getStudentValue={getVal}
        computeStudentName={computeStudentName}
      />

      {/* CSV IMPORT MODAL */}
      <StudentCsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        students={students}
        academicYearId={academicYearId}
        currentTabId={activeTab}
        onApplyEdits={handleApplyImportEdits}
        onRefresh={onRefresh || fetchInternalData}
        showToast={showToast}
      />
    </div>
  );
};

export default StudentReferenceMatrixTable;
