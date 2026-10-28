import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Plus, Users, Edit, CheckCircle2, AlertCircle, Loader2, X, UserPlus } from 'lucide-react';
import { getAcademicGroups, createAcademicGroup, updateAcademicGroup, toggleAcademicGroupStatus, assignStudentsToGroup, removeStudentFromGroup, getClasses, getSections, getStudents } from '../../services/api';
export const AcademicGroupsView = ({ branchId, academicYearId }) => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // Modal State for Create / Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'Active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Member Management Drawer / Modal
    const [selectedGroupForMembers, setSelectedGroupForMembers] = useState(null);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    // Assign New Members Panel
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [filterClassId, setFilterClassId] = useState(0);
    const [filterSectionId, setFilterSectionId] = useState(0);
    const [unassignedStudents, setUnassignedStudents] = useState([]);
    const [selectedStudentIdsToAssign, setSelectedStudentIdsToAssign] = useState([]);
    const [isLoadingUnassigned, setIsLoadingUnassigned] = useState(false);

    // Available sections: deduplicated unique names when 'All Classes' is selected
    const availableSections = useMemo(() => {
        if (!filterClassId || filterClassId === 0 || filterClassId === '0') {
            const unique = new Map();
            (sections || []).forEach(s => {
                if (s && s.name && !unique.has(s.name)) {
                    unique.set(s.name, { id: s.name, name: s.name });
                }
            });
            return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
        }
        return (sections || []).filter(s => s.class_id === Number(filterClassId));
    }, [filterClassId, sections]);

    // Load Groups
    const loadGroups = () => {
        if (!branchId)
            return;
        setIsLoading(true);
        setError(null);
        getAcademicGroups({ branch_id: branchId, academicYearId: academicYearId })
            .then(res => setGroups(res || []))
            .catch(err => setError(err.message || 'Failed to fetch academic groups.'))
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        loadGroups();
    }, [branchId, academicYearId]);
    // Load Lookups
    useEffect(() => {
        if (branchId && academicYearId) {
            getClasses(branchId, academicYearId).then(res => setClasses(res?.data || [])).catch(console.error);
            getSections(branchId, academicYearId).then(res => setSections(res?.data || [])).catch(console.error);
        }
    }, [branchId, academicYearId]);
    // Load Group Members
    const loadGroupMembers = (groupId) => {
        setIsLoadingMembers(true);
        getStudents({
            branch_id: branchId,
            academic_year_id: academicYearId,
            academic_group_id: groupId,
            page_size: 200
        })
            .then(res => setAssignedStudents(res.data || []))
            .catch(console.error)
            .finally(() => setIsLoadingMembers(false));
    };
    useEffect(() => {
        if (selectedGroupForMembers) {
            loadGroupMembers(selectedGroupForMembers.id);
        }
        else {
            setAssignedStudents([]);
            setShowAssignPanel(false);
        }
    }, [selectedGroupForMembers]);
    // Load Unassigned candidate students
    useEffect(() => {
        if (showAssignPanel && branchId) {
            setIsLoadingUnassigned(true);
            const isNumericSec = filterSectionId && !isNaN(Number(filterSectionId)) && filterSectionId !== 0 && filterSectionId !== '0';
            const clsParam = (filterClassId && filterClassId !== 0 && filterClassId !== '0') ? Number(filterClassId) : undefined;

            getStudents({
                branch_id: branchId,
                academic_year_id: academicYearId,
                class_id: clsParam,
                section_id: isNumericSec ? Number(filterSectionId) : undefined,
                section_name: (!isNumericSec && filterSectionId && filterSectionId !== 0 && filterSectionId !== '0') ? String(filterSectionId) : undefined,
                page_size: 150
            })
                .then(res => {
                // Filter out students already in this group
                const currentIds = assignedStudents.map(s => s.id);
                setUnassignedStudents((res.data || []).filter(s => !currentIds.includes(s.id)));
                setSelectedStudentIdsToAssign([]);
            })
                .catch(console.error)
                .finally(() => setIsLoadingUnassigned(false));
        }
    }, [showAssignPanel, filterClassId, filterSectionId, assignedStudents]);
    // Handle Create / Edit Submit
    const handleSaveGroup = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.code.trim()) {
            setError('Group name and unique code are required.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            if (editingGroupId) {
                await updateAcademicGroup(editingGroupId, formData);
                setSuccessMessage('Academic group updated successfully.');
            }
            else {
                await createAcademicGroup({
                    ...formData,
                    branch_id: branchId,
                    academic_year_id: academicYearId
                });
                setSuccessMessage('Academic group created successfully.');
            }
            setIsModalOpen(false);
            setEditingGroupId(null);
            setFormData({ name: '', code: '', description: '', status: 'Active' });
            loadGroups();
        }
        catch (err) {
            setError(err.message || 'Operation failed.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Toggle Status
    const handleToggleStatus = async (group) => {
        const nextStatus = group.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await toggleAcademicGroupStatus(group.id, nextStatus);
            loadGroups();
        }
        catch (err) {
            setError(err.message || 'Failed to update status.');
        }
    };
    // Assign Students to Group
    const handleAssignSubmit = async () => {
        if (!selectedGroupForMembers || selectedStudentIdsToAssign.length === 0)
            return;
        setIsSubmitting(true);
        try {
            await assignStudentsToGroup(selectedGroupForMembers.id, {
                student_ids: selectedStudentIdsToAssign,
                academic_year_id: academicYearId
            });
            setSuccessMessage(`Assigned ${selectedStudentIdsToAssign.length} students to ${selectedGroupForMembers.name}`);
            setShowAssignPanel(false);
            loadGroupMembers(selectedGroupForMembers.id);
            loadGroups();
        }
        catch (err) {
            setError(err.message || 'Failed to assign students.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Remove Student from Group
    const handleRemoveMember = async (studentId) => {
        if (!selectedGroupForMembers)
            return;
        try {
            await removeStudentFromGroup(selectedGroupForMembers.id, {
                student_id: studentId,
                academic_year_id: academicYearId
            });
            loadGroupMembers(selectedGroupForMembers.id);
            loadGroups();
        }
        catch (err) {
            setError(err.message || 'Failed to remove student.');
        }
    };
    return (<div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-700"/>
            <span>Academic Groups & Special Coaching Tracks</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize pupils into specialized batches for competitive exams (Olympiad, NEET, NTSE) or remedial acceleration.
          </p>
        </div>

        <button type="button" onClick={() => {
            setEditingGroupId(null);
            setFormData({ name: '', code: '', description: '', status: 'Active' });
            setIsModalOpen(true);
        }} className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto">
          <Plus className="w-4 h-4"/>
          <span>New Academic Group</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (<div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4"/>
          </button>
        </div>)}

      {error && (<div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0"/>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-800">
            <X className="w-4 h-4"/>
          </button>
        </div>)}

      {/* Groups Grid */}
      {isLoading ? (<div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600"/>
          <span>Loading academic groups...</span>
        </div>) : groups.length === 0 ? (<div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2"/>
          <p className="font-bold text-slate-700">No Academic Groups Defined</p>
          <p className="text-slate-400 text-xs mt-1">Create groups like Olympiad Achievers or JEE Foundation to assign students.</p>
        </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {groups.map((g) => (<div key={g.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    {g.code}
                  </span>
                  <button type="button" onClick={() => handleToggleStatus(g)} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer ${g.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}>
                    {g.status}
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{g.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {g.description || 'Special academic track for tailored instruction and evaluation.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold">
                  <Users className="w-3.5 h-3.5 text-slate-400"/>
                  <span>{g.student_count || 0} Pupils Enrolled</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button type="button" onClick={() => setSelectedGroupForMembers(g)} className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors cursor-pointer">
                    Manage Members
                  </button>

                  <button type="button" onClick={() => {
                    setEditingGroupId(g.id);
                    setFormData({
                        name: g.name,
                        code: g.code,
                        description: g.description || '',
                        status: g.status
                    });
                    setIsModalOpen(true);
                }} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Edit Group">
                    <Edit className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>
            </div>))}
        </div>)}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 px-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400"/>
                <span>{editingGroupId ? 'Edit Academic Group' : 'Create Academic Group'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Group Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Olympiad Achievers" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required/>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Code / Abbreviation *</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} placeholder="e.g. OLY-ACH" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 font-mono uppercase" required/>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Focus Area</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe target curriculum, entrance exams, or coaching goals..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"/>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg font-bold transition-colors cursor-pointer">
                  {isSubmitting ? 'Saving...' : 'Save Group'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* MANAGE MEMBERS MODAL / DRAWER */}
      {selectedGroupForMembers && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 px-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold flex items-center space-x-2">
                  <Users className="w-5 h-5 text-indigo-300"/>
                  <span>Members of {selectedGroupForMembers.name}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {assignedStudents.length} enrolled students in batch code: {selectedGroupForMembers.code}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => setShowAssignPanel(!showAssignPanel)} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                  <UserPlus className="w-3.5 h-3.5"/>
                  <span>{showAssignPanel ? 'Close Assign Panel' : 'Assign Students'}</span>
                </button>

                <button type="button" onClick={() => setSelectedGroupForMembers(null)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                  <X className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* ASSIGN NEW STUDENTS PANEL (Expandable) */}
            {showAssignPanel && (<div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs shrink-0">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Add Pupils to Group</span>
                  <span className="text-emerald-700">{selectedStudentIdsToAssign.length} candidates selected</span>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <select value={filterClassId} onChange={(e) => { setFilterClassId(Number(e.target.value)); setFilterSectionId(0); }} className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs">
                    <option value="0">All Classes</option>
                    {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>

                  <select value={filterSectionId} onChange={(e) => setFilterSectionId(e.target.value)} className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs">
                    <option value="0">All Sections</option>
                    {availableSections.map(s => (<option key={s.id} value={String(s.id)}>Sec {s.name}</option>))}
                  </select>

                  <button type="button" onClick={handleAssignSubmit} disabled={isSubmitting || selectedStudentIdsToAssign.length === 0} className="ml-auto px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors cursor-pointer">
                    {isSubmitting ? 'Enrolling...' : `Enroll Selected (${selectedStudentIdsToAssign.length})`}
                  </button>
                </div>

                {/* Candidate Selection Checkboxes */}
                {isLoadingUnassigned ? (<div className="p-4 text-center text-slate-400">Loading candidates...</div>) : unassignedStudents.length === 0 ? (<div className="p-3 text-center text-slate-400 italic">No unassigned students found in this filter.</div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                    {unassignedStudents.map(s => {
                        const isChecked = selectedStudentIdsToAssign.includes(s.id);
                        return (<label key={s.id} className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer ${isChecked ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
                          <input type="checkbox" checked={isChecked} onChange={() => {
                                setSelectedStudentIdsToAssign(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]);
                            }} className="rounded text-emerald-600 focus:ring-emerald-500"/>
                          <div className="truncate">
                            <span className="font-semibold text-slate-800 block truncate">{s.full_name}</span>
                            <span className="text-[10px] text-slate-400">{s.class_name}-{s.section_name}</span>
                          </div>
                        </label>);
                    })}
                  </div>)}
              </div>)}

            {/* Current Members List */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingMembers ? (<div className="py-12 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600"/>
                  <span>Loading enrolled members...</span>
                </div>) : assignedStudents.length === 0 ? (<div className="py-12 text-center text-slate-400">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2"/>
                  <p className="font-semibold text-slate-600">No students enrolled in this group yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Click &quot;Assign Students&quot; above to add pupils.</p>
                </div>) : (<table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-2.5">Admission No</th>
                      <th className="p-2.5">Pupil Name</th>
                      <th className="p-2.5">Class & Section</th>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignedStudents.map((s) => (<tr key={s.id} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-mono text-emerald-700 font-semibold">{s.admission_number}</td>
                        <td className="p-2.5 font-bold text-slate-900">{s.full_name}</td>
                        <td className="p-2.5">{s.class_name} - {s.section_name}</td>
                        <td className="p-2.5 font-mono">{s.roll_number || '—'}</td>
                        <td className="p-2.5 text-right">
                          <button type="button" onClick={() => handleRemoveMember(s.id)} className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline cursor-pointer">
                            Remove
                          </button>
                        </td>
                      </tr>))}
                  </tbody>
                </table>)}
            </div>

            {/* Footer */}
            <div className="p-3 px-6 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button type="button" onClick={() => setSelectedGroupForMembers(null)} className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
