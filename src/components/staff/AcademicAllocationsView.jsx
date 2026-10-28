import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import staffService from '../../services/staffService';

export default function AcademicAllocationsView({ branchId = 1, academicYearId = 2 }) {
  const [allocations, setAllocations] = useState([]);
  const [teachingStaff, setTeachingStaff] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [allocationType, setAllocationType] = useState('Class Teacher');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [weeklyPeriods, setWeeklyPeriods] = useState(5);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allocRes, staffRes, classesRes, sectionsRes, subjectsRes] = await Promise.all([
        staffService.getAllocations({ branch_id: branchId }),
        staffService.getStaffList({ branch_id: branchId, staff_type: 'Teaching' }),
        fetch(`/api/classes?branch_id=${branchId}&status=Active`).then(r => r.json()),
        fetch(`/api/sections?branch_id=${branchId}`).then(r => r.json()),
        fetch(`/api/subjects?branch_id=${branchId}`).then(r => r.json())
      ]);

      setAllocations(allocRes.data || []);
      setTeachingStaff(staffRes.data || []);
      setClasses(classesRes.data || classesRes || []);
      setSections(sectionsRes.data || sectionsRes || []);
      setSubjects(subjectsRes.data || subjectsRes || []);
    } catch (err) {
      console.error('[AcademicAllocationsView Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [branchId]);

  const handleSaveAllocation = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !selectedClassId) return;

    try {
      setSaving(true);
      await staffService.saveAllocation({
        branch_id: branchId,
        academic_year_id: academicYearId,
        staff_id: selectedStaffId,
        allocation_type: allocationType,
        class_id: selectedClassId,
        section_id: (allocationType === 'Class Coordinator') ? null : (selectedSectionId || null),
        subject_id: (allocationType === 'Subject Teacher') ? selectedSubjectId : null,
        weekly_periods: (allocationType === 'Subject Teacher') ? weeklyPeriods : 0
      });

      setSuccessMessage(`${allocationType} successfully assigned!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving allocation');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllocation = async (id) => {
    if (!confirm('Are you sure you want to remove this academic assignment?')) return;
    try {
      await staffService.deleteAllocation(id);
      fetchData();
    } catch (err) {
      alert('Failed to remove allocation');
    }
  };

  const filteredSections = selectedClassId
    ? sections.filter(s => String(s.class_id) === String(selectedClassId))
    : sections;

  return (
    <div className="space-y-6">
      {/* Top Banner / Explainer */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white p-5 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-white backdrop-blur-xs mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Academic Role Management
            </span>
            <h2 className="text-xl font-bold tracking-tight">Academic Responsibilities & Class Assignments</h2>
            <p className="text-indigo-200 text-xs mt-1 max-w-2xl">
              Assign teachers as <strong className="text-white">Class Teacher</strong>, <strong className="text-white">Assistant Class Teacher</strong>, <strong className="text-white">Class Coordinator</strong>, or <strong className="text-white">Subject Teacher</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Assignment Form (Left) & Current Allocations Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 lg:col-span-1 h-fit">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Plus className="w-4 h-4 text-indigo-600" />
            Assign Academic Responsibility
          </h3>

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveAllocation} className="space-y-3.5 text-xs">
            {/* Allocation Role Type */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Responsibility Role
              </label>
              <select
                value={allocationType}
                onChange={e => setAllocationType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-semibold text-gray-800"
              >
                <option value="Class Teacher">🛡️ Class Teacher (வகுப்பு ஆசிரியர்)</option>
                <option value="Assistant Class Teacher">👥 Assistant Class Teacher (துணை ஆசிரியர்)</option>
                <option value="Class Coordinator">✨ Class Coordinator (ஒருங்கிணைப்பாளர்)</option>
                <option value="Subject Teacher">📚 Subject Teacher (பாட ஆசிரியர்)</option>
              </select>
            </div>

            {/* Select Teacher */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Select Teaching Staff *
              </label>
              <select
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              >
                <option value="">-- Choose Teacher --</option>
                {teachingStaff.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.first_name} {t.last_name || ''} ({t.staff_code} - {t.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Class */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Target Class *
              </label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              >
                <option value="">-- Choose Class --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.class_name || c.name || `Class ${c.id}`}</option>
                ))}
              </select>
            </div>

            {/* Select Section (Not needed for Coordinator) */}
            {allocationType !== 'Class Coordinator' && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Section *
                </label>
                <select
                  value={selectedSectionId}
                  onChange={e => setSelectedSectionId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                >
                  <option value="">-- Choose Section --</option>
                  {filteredSections.map(s => (
                    <option key={s.id} value={s.id}>Section {s.section_name || s.name || s.id}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject Selection (Only for Subject Teacher) */}
            {allocationType === 'Subject Teacher' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Subject *
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={e => setSelectedSubjectId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name || sub.subject_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Weekly Periods / Load
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={weeklyPeriods}
                    onChange={e => setWeeklyPeriods(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-xs disabled:opacity-50"
            >
              {saving ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </form>
        </div>

        {/* Existing Allocations Grid (Right) */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Active Academic Responsibilities</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Showing all mapped teachers for Academic Year 2025-2026</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
              {allocations.length} Active Assignments
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              <p className="mt-2 text-xs text-gray-500">Loading assignments...</p>
            </div>
          ) : allocations.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-xs">
              No academic responsibilities assigned yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-600 uppercase">
                    <th className="py-3 px-4">Class & Section</th>
                    <th className="py-3 px-4">Responsibility</th>
                    <th className="py-3 px-4">Assigned Teacher</th>
                    <th className="py-3 px-4">Subject / Load</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allocations.map(a => (
                    <tr key={a.id} className="hover:bg-indigo-50/30 transition-colors">
                      {/* Class */}
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {a.class_name || `Class ${a.class_id}`}
                        {a.section_name && (
                          <span className="ml-1 text-gray-500 font-normal">
                            - Sec {a.section_name}
                          </span>
                        )}
                        {!a.section_name && (
                          <span className="ml-1.5 text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">
                            All Sections
                          </span>
                        )}
                      </td>

                      {/* Allocation Role Badge */}
                      <td className="py-3 px-4">
                        {a.allocation_type === 'Class Teacher' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Class Teacher
                          </span>
                        )}
                        {a.allocation_type === 'Assistant Class Teacher' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                            <Users className="w-3 h-3 text-teal-600" />
                            Asst Class Teacher
                          </span>
                        )}
                        {a.allocation_type === 'Class Coordinator' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            Class Coordinator
                          </span>
                        )}
                        {a.allocation_type === 'Subject Teacher' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            Subject Teacher
                          </span>
                        )}
                      </td>

                      {/* Teacher Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">
                          {a.first_name} {a.last_name || ''}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {a.staff_code} • {a.department}
                        </div>
                      </td>

                      {/* Subject / Load */}
                      <td className="py-3 px-4">
                        {a.allocation_type === 'Subject Teacher' ? (
                          <div className="text-gray-800">
                            <span className="font-medium">{a.subject_name || 'Subject'}</span>
                            <span className="text-[10px] text-gray-500 block">
                              {a.weekly_periods} periods/wk
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteAllocation(a.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
