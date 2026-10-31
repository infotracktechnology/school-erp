import React, { useState, useEffect } from 'react';
import {
  Key,
  Calendar,
  Lock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  CheckSquare,
  Square,
  GraduationCap,
  Building,
  Mail,
  RefreshCw,
  Save,
  Check
} from 'lucide-react';
import StudentCredentialsModal from './StudentCredentialsModal';

export default function StudentCredentialsView({
  branchId = 1,
  academicYearId,
  onRefresh
}) {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedClassId, setSelectedClassId] = useState('All');
  const [selectedSectionId, setSelectedSectionId] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Formula Configuration
  const [passwordPattern, setPasswordPattern] = useState('admission_no'); // 'admission_no', 'dob', 'default', 'custom'
  const [customPassword, setCustomPassword] = useState('');
  const [usernamePattern, setUsernamePattern] = useState('admission_no'); // 'admission_no', 'email'

  // Selection
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Status & Feedback
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Single Modal
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Fetch Students & Academic Structures
  const fetchStudents = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const q = new URLSearchParams();
      if (branchId && branchId !== 'all') q.set('branch_id', branchId);
      if (academicYearId && academicYearId !== 'all') q.set('academic_year_id', academicYearId);
      q.set('limit', '500');

      const res = await fetch(`/api/students?${q.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStudents(data.data);
      } else if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (err) {
      setErrorMessage('Failed to load students list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassesAndSections = async () => {
    try {
      const cRes = await fetch(`/api/classes?branch_id=${branchId}`);
      const cData = await cRes.json();
      if (cData.success && Array.isArray(cData.data)) {
        setClasses(cData.data);
      }

      const sRes = await fetch(`/api/sections?branch_id=${branchId}`);
      const sData = await sRes.json();
      if (sData.success && Array.isArray(sData.data)) {
        setSections(sData.data);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchStudents();
    fetchClassesAndSections();
  }, [branchId, academicYearId]);

  // Filtering Logic
  const filteredStudents = students.filter((s) => {
    const classMatch = selectedClassId === 'All' || String(s.class_id) === String(selectedClassId);
    const sectionMatch = selectedSectionId === 'All' || String(s.section_id) === String(selectedSectionId);
    
    const fullName = `${s.first_name || ''} ${s.last_name || ''}`.trim().toLowerCase();
    const adm = (s.admission_number || s.admission_no || '').toLowerCase();
    const roll = String(s.roll_number || '').toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    const searchMatch = !query || fullName.includes(query) || adm.includes(query) || roll.includes(query);

    return classMatch && sectionMatch && searchMatch;
  });

  const filteredIds = filteredStudents.map((s) => s.id);
  const isAllSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedStudentIds.includes(id));

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleToggleStudent = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    setSelectedStudentIds(filteredIds);
  };

  const handleClearSelection = () => {
    setSelectedStudentIds([]);
  };

  // Bulk Apply Handler
  const handleBulkApply = async () => {
    if (selectedStudentIds.length === 0) {
      setErrorMessage('Please select at least one student to update credentials.');
      return;
    }
    if (passwordPattern === 'custom' && !customPassword.trim()) {
      setErrorMessage('Please enter a custom password formula.');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/students/bulk-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_ids: selectedStudentIds,
          password_pattern: passwordPattern,
          custom_password: customPassword,
          username_pattern: usernamePattern
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Bulk credential update failed');
      }

      setSuccessMessage(data.message || `Successfully updated credentials for ${selectedStudentIds.length} student(s)!`);
      fetchStudents();
      if (onRefresh) onRefresh();
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred during bulk update.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-sky-600/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Key className="w-4 h-4 text-sky-300" />
              <span>Security & ERP Access Management</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Bulk Reset Student ERP Credentials
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl mt-1 leading-relaxed">
              Generate and synchronize login credentials for student mobile applications and student portals across your campus.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={fetchStudents}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Students</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-600 font-bold hover:underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-600 font-bold hover:underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Credential Formula Configuration Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              Formula & Generation Rules
            </h2>
            <p className="text-xs text-slate-500">
              Configure how usernames and passwords are mathematically created for the selected students
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password Pattern Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              Password Formula
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'admission_no', label: 'Admission Number', desc: 'e.g. ADM-2025-017' },
                { id: 'dob', label: 'DOB (DDMMYYYY)', desc: 'e.g. 07062019' },
                { id: 'default', label: 'Default Password', desc: 'student123' },
                { id: 'custom', label: 'Custom Password', desc: 'Your custom text' }
              ].map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setPasswordPattern(pattern.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    passwordPattern === pattern.id
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold">{pattern.label}</span>
                    {passwordPattern === pattern.id && (
                      <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{pattern.desc}</span>
                </button>
              ))}
            </div>

            {passwordPattern === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="Enter custom password (min 4 characters)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-white outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            )}
          </div>

          {/* Username Pattern Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-sky-500" />
              Username Formula
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'admission_no', label: 'Admission Number', desc: 'e.g. ADM-2025-017 (Recommended)' },
                { id: 'email', label: 'Student / Parent Email', desc: 'Email address if available' }
              ].map((uPattern) => (
                <button
                  key={uPattern.id}
                  type="button"
                  onClick={() => setUsernamePattern(uPattern.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    usernamePattern === uPattern.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold">{uPattern.label}</span>
                    {usernamePattern === uPattern.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{uPattern.desc}</span>
                </button>
              ))}
            </div>

            {/* Apply Action Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Selected: <span className="font-bold text-sky-600 dark:text-sky-400 font-mono">{selectedStudentIds.length}</span> / {filteredStudents.length}
              </span>
              <button
                type="button"
                onClick={handleBulkApply}
                disabled={saving || selectedStudentIds.length === 0}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition flex items-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synchronizing {selectedStudentIds.length} Students...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>Apply Credentials to {selectedStudentIds.length} Student(s)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Filters Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search admission no, student..."
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-hidden focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium outline-hidden"
            >
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name || c.name}
                </option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium outline-hidden"
            >
              <option value="All">All Sections</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.section_name || sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Selection Actions */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={handleSelectAllFiltered}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition font-medium"
            >
              Select All Filtered ({filteredStudents.length})
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={handleClearSelection}
              disabled={selectedStudentIds.length === 0}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition font-medium disabled:opacity-40"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleToggleAll}
                    className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3">Admission No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Class & Sec</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">ERP Login Username</th>
                <th className="p-3">Access Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading students roster...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const isSelected = selectedStudentIds.includes(st.id);
                  const fullName = `${st.first_name || ''} ${st.last_name || ''}`.trim() || st.name || 'Student';
                  const adm = st.admission_number || st.admission_no || `ADM-${st.id}`;
                  const hasUserLinked = Boolean(st.user_id);

                  return (
                    <tr
                      key={st.id}
                      onClick={() => handleToggleStudent(st.id)}
                      className={`cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                        isSelected ? 'bg-sky-50/60 dark:bg-sky-950/20' : ''
                      }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleToggleStudent(st.id)}
                          className="text-slate-400 hover:text-sky-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {adm}
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {fullName}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {st.class_name || 'Class'} - {st.section_name || 'Sec'}
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                        {st.roll_number || '-'}
                      </td>
                      <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                        {adm}
                      </td>
                      <td className="p-3">
                        {hasUserLinked ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Synced Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            Ready to Sync
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForModal(st)}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 dark:text-sky-300 font-bold transition flex items-center space-x-1 ml-auto"
                        >
                          <Key className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Student Modal */}
      {selectedStudentForModal && (
        <StudentCredentialsModal
          isOpen={Boolean(selectedStudentForModal)}
          onClose={() => setSelectedStudentForModal(null)}
          student={selectedStudentForModal}
          onSuccess={fetchStudents}
        />
      )}
    </div>
  );
}
