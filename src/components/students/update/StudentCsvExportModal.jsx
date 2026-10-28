import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  CheckSquare,
  Square,
  Search,
  Check,
  FileSpreadsheet,
} from 'lucide-react';

// 14-tab schema without file upload/document attachment fields ("no need files")
export const EXPORTABLE_TABS = [
  {
    id: 'tab1',
    num: 1,
    name: 'Student Name',
    fields: [
      { key: 'first_name', label: 'First Name' },
      { key: 'middle_name', label: 'Middle Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'display_name', label: 'Display Name' },
      { key: 'regional_name', label: 'Name in Regional Language' },
    ],
  },
  {
    id: 'tab2',
    num: 2,
    name: 'Identification',
    fields: [
      { key: 'admission_number', label: 'Admission Number' },
      { key: 'roll_number', label: 'Roll Number' },
      { key: 'emis_number', label: 'EMIS Number' },
      { key: 'pen_apaar_id', label: 'PEN / APAAR ID' },
      { key: 'aadhaar_number', label: 'Aadhaar Number' },
      { key: 'passport_number', label: 'Passport Number' },
      { key: 'other_id_number', label: 'Other ID Number' },
      { key: 'erp_student_id', label: 'ERP / Student ID' },
    ],
  },
  {
    id: 'tab3',
    num: 3,
    name: 'Academic Details',
    fields: [
      { key: 'admission_date', label: 'Admission Date' },
      { key: 'admission_class', label: 'Admission Class' },
      { key: 'stream', label: 'Stream' },
      { key: 'house', label: 'House' },
      { key: 'medium', label: 'Medium' },
      { key: 'curriculum', label: 'Board / Curriculum' },
      { key: 'previous_school', label: 'Previous School' },
      { key: 'previous_class', label: 'Previous Class' },
      { key: 'previous_academic_year', label: 'Prev Academic Year' },
      { key: 'current_status', label: 'Student Status' },
      { key: 'date_of_leaving', label: 'Date of Leaving' },
      { key: 'reason_for_leaving', label: 'Reason for Leaving' },
    ],
  },
  {
    id: 'tab4',
    num: 4,
    name: 'Basic Details',
    fields: [
      { key: 'dob', label: 'Date of Birth' },
      { key: 'gender', label: 'Gender' },
      { key: 'blood_group', label: 'Blood Group' },
      { key: 'nationality', label: 'Nationality' },
      { key: 'mother_tongue', label: 'Mother Tongue' },
      { key: 'religion', label: 'Religion' },
      { key: 'community', label: 'Community' },
      { key: 'caste', label: 'Caste' },
      { key: 'caste_certificate_no', label: 'Caste Certificate No' },
      { key: 'identification_mark_1', label: 'Identification Mark 1' },
      { key: 'identification_mark_2', label: 'Identification Mark 2' },
      { key: 'is_differently_abled', label: 'Differently Abled' },
      { key: 'disability_type', label: 'Disability Type' },
      { key: 'disability_percentage', label: 'Disability %' },
    ],
  },
  {
    id: 'tab5',
    num: 5,
    name: 'Contact Details',
    fields: [
      { key: 'student_mobile', label: 'Mobile Number' },
      { key: 'alternate_mobile', label: 'Alternate Mobile' },
      { key: 'email', label: 'Email' },
      { key: 'residential_door_no', label: 'Door / Flat No' },
      { key: 'residential_street', label: 'Street' },
      { key: 'residential_area', label: 'Area / Village' },
      { key: 'residential_city', label: 'City / Town' },
      { key: 'residential_taluk', label: 'Taluk' },
      { key: 'residential_district', label: 'District' },
      { key: 'residential_state', label: 'State' },
      { key: 'residential_country', label: 'Country' },
      { key: 'residential_pin', label: 'PIN Code' },
    ],
  },
  {
    id: 'tab6',
    num: 6,
    name: 'Parent / Guardian',
    fields: [
      { key: 'father_name', label: 'Father Name' },
      { key: 'father_mobile', label: 'Father Mobile' },
      { key: 'father_email', label: 'Father Email' },
      { key: 'father_aadhaar', label: 'Father Aadhaar' },
      { key: 'father_occupation', label: 'Father Occupation' },
      { key: 'father_qualification', label: 'Father Qualification' },
      { key: 'father_annual_income', label: 'Father Annual Income' },
      { key: 'mother_name', label: 'Mother Name' },
      { key: 'mother_mobile', label: 'Mother Mobile' },
      { key: 'mother_email', label: 'Mother Email' },
      { key: 'mother_aadhaar', label: 'Mother Aadhaar' },
      { key: 'mother_occupation', label: 'Mother Occupation' },
      { key: 'guardian_name', label: 'Guardian Name' },
      { key: 'guardian_relation', label: 'Guardian Relation' },
      { key: 'guardian_mobile', label: 'Guardian Mobile' },
      { key: 'primary_contact', label: 'Primary Contact' },
      { key: 'emergency_contact_role', label: 'Emergency Contact Role' },
    ],
  },
  {
    id: 'tab7',
    num: 7,
    name: 'Family Details',
    fields: [
      { key: 'family_id', label: 'Family ID' },
      { key: 'family_type', label: 'Family Type' },
      { key: 'children_count', label: 'Children in Family' },
      { key: 'family_annual_income', label: 'Family Annual Income' },
      { key: 'sibling_name', label: 'Sibling Name' },
      { key: 'sibling_admission_no', label: 'Sibling Admission No' },
      { key: 'sibling_class', label: 'Sibling Class' },
      { key: 'sibling_section', label: 'Sibling Section' },
      { key: 'sibling_relationship', label: 'Relationship' },
    ],
  },
  {
    id: 'tab8',
    num: 8,
    name: 'Admission Details',
    fields: [
      { key: 'enquiry_number', label: 'Enquiry Number' },
      { key: 'registration_number', label: 'Registration No' },
      { key: 'application_number', label: 'Application No' },
      { key: 'admission_number', label: 'Admission Number' },
      { key: 'admission_date', label: 'Admission Date' },
      { key: 'admission_type', label: 'Admission Type' },
      { key: 'admission_category', label: 'Admission Category' },
      { key: 'admission_quota', label: 'Admission Quota' },
      { key: 'admission_source', label: 'Admission Source' },
      { key: 'admission_remarks', label: 'Admission Remarks' },
      { key: 'approved_by', label: 'Approved By' },
      { key: 'approval_date', label: 'Approval Date' },
    ],
  },
  {
    id: 'tab9',
    num: 9,
    name: 'Address Details',
    fields: [
      { key: 'residential_door_no', label: 'Res. Door/Flat' },
      { key: 'residential_street', label: 'Res. Street' },
      { key: 'residential_area', label: 'Res. Area / Village' },
      { key: 'residential_city', label: 'Res. City / Town' },
      { key: 'residential_district', label: 'Res. District' },
      { key: 'residential_state', label: 'Res. State' },
      { key: 'residential_pin', label: 'Res. PIN Code' },
      { key: 'permanent_door_no', label: 'Perm. Door/Flat' },
      { key: 'permanent_street', label: 'Perm. Street' },
      { key: 'permanent_city', label: 'Perm. City / Town' },
      { key: 'permanent_district', label: 'Perm. District' },
      { key: 'permanent_state', label: 'Perm. State' },
      { key: 'permanent_pin', label: 'Perm. PIN Code' },
    ],
  },
  {
    id: 'tab10',
    num: 10,
    name: 'Medical / Health',
    fields: [
      { key: 'blood_group', label: 'Blood Group' },
      { key: 'height_cm', label: 'Height (cm)' },
      { key: 'weight_kg', label: 'Weight (kg)' },
      { key: 'medical_condition', label: 'Medical Condition' },
      { key: 'allergies', label: 'Allergies' },
      { key: 'chronic_condition', label: 'Chronic Condition' },
      { key: 'regular_medication', label: 'Regular Medication' },
      { key: 'emergency_medical_info', label: 'Emergency Med Info' },
      { key: 'doctor_name', label: 'Doctor Name' },
      { key: 'doctor_contact', label: 'Doctor Contact' },
      { key: 'hospital_clinic', label: 'Hospital / Clinic' },
      { key: 'insurance_number', label: 'Insurance Policy No' },
    ],
  },
  {
    id: 'tab11',
    num: 11,
    name: 'Emergency Contact',
    fields: [
      { key: 'emergency_contact_name', label: 'Contact Name' },
      { key: 'emergency_contact_relation', label: 'Relationship' },
      { key: 'emergency_contact_mobile', label: 'Mobile Number' },
      { key: 'emergency_contact_alt_mobile', label: 'Alternate Mobile' },
      { key: 'emergency_contact_email', label: 'Email Address' },
      { key: 'emergency_contact_address', label: 'Address' },
      { key: 'authorized_pickup', label: 'Authorized Pickup' },
      { key: 'priority', label: 'Priority' },
    ],
  },
  {
    id: 'tab12',
    num: 12,
    name: 'Previous School',
    fields: [
      { key: 'previous_school_name', label: 'Previous School Name' },
      { key: 'previous_school_address', label: 'School Address' },
      { key: 'previous_board', label: 'Board' },
      { key: 'previous_medium', label: 'Medium' },
      { key: 'previous_class', label: 'Previous Class' },
      { key: 'previous_academic_year', label: 'Prev Academic Year' },
      { key: 'previous_admission_number', label: 'Prev Admission No' },
      { key: 'tc_number', label: 'TC Number' },
      { key: 'tc_date', label: 'TC Date' },
      { key: 'previous_marks', label: 'Previous Marks / %' },
      { key: 'reason_for_transfer', label: 'Reason for Transfer' },
    ],
  },
  {
    id: 'tab13',
    num: 13,
    name: 'Academic Status & Stream',
    fields: [
      { key: 'roll_number', label: 'Roll Number' },
      { key: 'current_status', label: 'Current Status' },
      { key: 'stream', label: 'Academic Stream' },
      { key: 'house', label: 'House' },
      { key: 'second_language', label: 'Second Language' },
      { key: 'third_language', label: 'Third Language' },
    ],
  },
  {
    id: 'tab14',
    num: 14,
    name: 'Identity & Cards',
    fields: [
      { key: 'id_card_status', label: 'ID Card Status' },
      { key: 'biometric_enrolled', label: 'Biometric Enrolled' },
      { key: 'rfid_card_number', label: 'RFID Card Number' },
      { key: 'biometric_id', label: 'Biometric ID' },
      { key: 'google_id', label: 'Google Account ID' },
    ],
  },
];

export const StudentCsvExportModal = ({
  isOpen,
  onClose,
  students = [],
  filteredStudents = [],
  currentTabId = 'tab1',
  getStudentValue,
  computeStudentName,
}) => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(currentTabId);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportScope, setExportScope] = useState('filtered'); // 'filtered' | 'all'

  // Selected field keys set: key -> boolean
  const [selectedFields, setSelectedFields] = useState(() => {
    const initial = {};
    const currTab = EXPORTABLE_TABS.find((t) => t.id === currentTabId) || EXPORTABLE_TABS[0];
    currTab.fields.forEach((f) => {
      initial[f.key] = true;
    });
    return initial;
  });

  // All available fields mapped
  const allFieldKeys = useMemo(() => {
    const list = [];
    EXPORTABLE_TABS.forEach((tab) => {
      tab.fields.forEach((f) => {
        if (!list.some((item) => item.key === f.key)) {
          list.push({ ...f, tabName: tab.name, tabNum: tab.num });
        }
      });
    });
    return list;
  }, []);

  const totalSelectedCount = useMemo(() => {
    return Object.values(selectedFields).filter(Boolean).length;
  }, [selectedFields]);

  if (!isOpen) return null;

  const currentTab = EXPORTABLE_TABS.find((t) => t.id === selectedCategoryTab) || EXPORTABLE_TABS[0];

  const toggleField = (key) => {
    setSelectedFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isAllInCurrentTabSelected = currentTab.fields.every((f) => selectedFields[f.key]);
  const toggleAllInCurrentTab = () => {
    const targetState = !isAllInCurrentTabSelected;
    setSelectedFields((prev) => {
      const next = { ...prev };
      currentTab.fields.forEach((f) => {
        next[f.key] = targetState;
      });
      return next;
    });
  };

  const selectAllGlobal = () => {
    const next = {};
    allFieldKeys.forEach((f) => {
      next[f.key] = true;
    });
    setSelectedFields(next);
  };

  const deselectAllGlobal = () => {
    setSelectedFields({});
  };

  const selectCurrentTabOnly = () => {
    const next = {};
    currentTab.fields.forEach((f) => {
      next[f.key] = true;
    });
    setSelectedFields(next);
  };

  const handleExport = () => {
    const targetStudents = exportScope === 'filtered' ? filteredStudents : students;

    if (!targetStudents || targetStudents.length === 0) {
      alert('No student records to export.');
      return;
    }

    // Header array starting with Student ID and Student Name
    const columnsToExport = [
      { key: 'student_id', label: 'Student ID' },
      { key: 'student_name', label: 'Student Name' },
    ];

    allFieldKeys.forEach((f) => {
      if (selectedFields[f.key]) {
        columnsToExport.push({ key: f.key, label: f.label });
      }
    });

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = columnsToExport.map((col) => escapeCsv(col.label)).join(',');

    const rows = targetStudents.map((s) => {
      return columnsToExport
        .map((col) => {
          if (col.key === 'student_id') {
            return escapeCsv(s.id);
          }
          if (col.key === 'student_name') {
            const name = computeStudentName ? computeStudentName(s) : (s.full_name || `${s.first_name || ''} ${s.last_name || ''}`).trim();
            return escapeCsv(name);
          }
          const val = getStudentValue ? getStudentValue(s, col.key) : s[col.key];
          return escapeCsv(val !== undefined && val !== null ? val : '');
        })
        .join(',');
    });

    const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `Students_Export_${exportScope}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onClose();
  };

  const visibleTabFields = searchQuery.trim()
    ? allFieldKeys.filter(
        (f) =>
          f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.tabName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentTab.fields;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Export Student Data (CSV)</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  14 Tab Selector
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Select fields category-wise across 14 tabs (file attachments excluded). Always includes Student ID & Name.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP CONTROLS & PRESETS */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setExportScope('filtered')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                exportScope === 'filtered'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Filtered Students ({filteredStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setExportScope('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                exportScope === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Loaded Students ({students.length})
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={selectAllGlobal}
              className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md font-semibold cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={selectCurrentTabOnly}
              className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md font-semibold cursor-pointer"
            >
              Current Tab Only
            </button>
            <button
              type="button"
              onClick={deselectAllGlobal}
              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-md font-semibold cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* BODY: SPLIT VIEW - TABS (LEFT) & FIELDS CHECKBOXES (RIGHT) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT: 14 TABS LIST */}
          <div className="w-full md:w-64 border-r border-slate-100 bg-slate-50/50 p-3 overflow-y-auto flex flex-col space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Select Tab Category
            </div>
            {EXPORTABLE_TABS.map((tab) => {
              const isActive = selectedCategoryTab === tab.id && !searchQuery.trim();
              const selectedInThisTab = tab.fields.filter((f) => selectedFields[f.key]).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isActive ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {tab.num}
                    </span>
                    <span className="truncate">{tab.name}</span>
                  </div>
                  {selectedInThisTab > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {selectedInThisTab}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: FIELD SELECTION CHECKBOXES */}
          <div className="flex-1 flex flex-col min-w-0 p-4 bg-white overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search field by name or key..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {!searchQuery.trim() && (
                <button
                  type="button"
                  onClick={toggleAllInCurrentTab}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  {isAllInCurrentTabSelected ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{isAllInCurrentTabSelected ? 'Deselect All in Tab' : 'Select All in Tab'}</span>
                </button>
              )}
            </div>

            {/* Permanent Fixed Columns Info */}
            <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Permanent Identifiers:</span>
                <span>Student ID, Student Name (always included)</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Fixed</span>
            </div>

            {/* Checkbox Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {visibleTabFields.map((field) => {
                  const isChecked = !!selectedFields[field.key];
                  return (
                    <div
                      key={field.key}
                      onClick={() => toggleField(field.key)}
                      className={`flex items-start space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900 truncate">{field.label}</span>
                          {searchQuery && (
                            <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">
                              Tab {field.tabNum}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block truncate">{field.key}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-900">{totalSelectedCount}</span> optional field(s) selected + 2
            fixed identifiers
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={totalSelectedCount === 0}
              className="flex items-center space-x-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCsvExportModal;
