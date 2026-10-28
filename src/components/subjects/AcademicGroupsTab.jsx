import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Users, BookOpen, Search, Filter, CheckCircle2, XCircle, AlertCircle, X, Save } from 'lucide-react';
import { createAcademicGroup, updateAcademicGroup, updateAcademicGroupStatus, deleteAcademicGroup } from '../../services/api';
export const AcademicGroupsTab = ({ groups, classes, branchId, academicYearId, branchName, academicYearName, onRefresh, showToast, isReadOnly = false }) => {
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    // Delete / Inactive warning modal
    const [deletingGroup, setDeletingGroup] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        short_name: '',
        class_id: '',
        board: 'CBSE',
        description: '',
        display_order: 1,
        status: 'Active'
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const filteredGroups = groups.filter((g) => {
        if (classFilter !== 'all' && String(g.class_id) !== classFilter)
            return false;
        if (statusFilter !== 'all' && g.status !== statusFilter)
            return false;
        if (search.trim()) {
            const q = search.toLowerCase();
            const matchName = g.name.toLowerCase().includes(q);
            const matchCode = g.code.toLowerCase().includes(q);
            const matchClass = (g.class_name || '').toLowerCase().includes(q);
            if (!matchName && !matchCode && !matchClass)
                return false;
        }
        return true;
    });
    const handleOpenAdd = () => {
        const higherSecondaryClass = classes.find((c) => c.group_required || c.name.includes('11') || c.name.includes('12'));
        setEditingGroup(null);
        setFormData({
            name: '',
            code: '',
            short_name: '',
            class_id: higherSecondaryClass ? higherSecondaryClass.id : (classes[0]?.id || ''),
            board: 'CBSE',
            description: '',
            display_order: groups.length + 1,
            status: 'Active'
        });
        setFormErrors({});
        setIsModalOpen(true);
    };
    const handleOpenEdit = (group) => {
        setEditingGroup(group);
        setFormData({
            name: group.name,
            code: group.code,
            short_name: group.short_name || '',
            class_id: group.class_id || '',
            board: group.board || 'CBSE',
            description: group.description || '',
            display_order: group.display_order || 1,
            status: group.status || 'Active'
        });
        setFormErrors({});
        setIsModalOpen(true);
    };
    const validate = () => {
        const errs = {};
        if (!formData.name.trim())
            errs.name = 'Group / Stream Name is required';
        if (!formData.code.trim())
            errs.code = 'Group Code is required (e.g. SCI-BIO)';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setIsSubmitting(true);
        try {
            if (editingGroup) {
                await updateAcademicGroup(editingGroup.id, {
                    ...formData,
                    code: formData.code.trim().toUpperCase(),
                    class_id: formData.class_id ? Number(formData.class_id) : null
                });
                showToast(`Group "${formData.name}" updated successfully.`, 'success');
            }
            else {
                await createAcademicGroup({
                    ...formData,
                    branch_id: branchId,
                    academic_year_id: academicYearId,
                    code: formData.code.trim().toUpperCase(),
                    class_id: formData.class_id ? Number(formData.class_id) : null
                });
                showToast(`Group "${formData.name}" created successfully.`, 'success');
            }
            setIsModalOpen(false);
            onRefresh();
        }
        catch (err) {
            showToast(err.message || 'Failed to save academic group.', 'error');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleToggleStatus = async (group) => {
        const next = group.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await updateAcademicGroupStatus(group.id, next);
            showToast(`Group "${group.name}" status changed to ${next}.`, 'success');
            onRefresh();
        }
        catch (err) {
            showToast(err.message || 'Failed to change status.', 'error');
        }
    };
    const handleDelete = async () => {
        if (!deletingGroup)
            return;
        setIsDeleting(true);
        try {
            await deleteAcademicGroup(deletingGroup.id);
            showToast(`Group "${deletingGroup.name}" deleted.`, 'success');
            setDeletingGroup(null);
            onRefresh();
        }
        catch (err) {
            showToast(err.message || 'Cannot delete group. Try marking it Inactive instead.', 'error');
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (<div className="space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-700"/>
            <span>Academic Groups & Streams Master</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage streams for Higher Secondary classes (e.g. Science - Bio, Computer Science, Commerce, Arts)
          </p>
        </div>

        <button type="button" onClick={handleOpenAdd} disabled={isReadOnly} className="inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer">
          <Plus className="w-4 h-4"/>
          <span>Add New Stream / Group</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search streams by name or code..." className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700"/>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400"/>
          <span className="font-bold text-slate-600">Class:</span>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="font-semibold rounded-lg border border-slate-200 px-2 py-1.5 bg-slate-50 cursor-pointer">
            <option value="all">All Classes</option>
            {classes.map((c) => (<option key={c.id} value={String(c.id)}>{c.name}</option>))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-600">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="font-semibold rounded-lg border border-slate-200 px-2 py-1.5 bg-slate-50 cursor-pointer">
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Stream Code</th>
                <th className="py-3 px-4">Stream / Group Name</th>
                <th className="py-3 px-4">Assigned Class</th>
                <th className="py-3 px-4">Board</th>
                <th className="py-3 px-4 text-center">Configured Subjects</th>
                <th className="py-3 px-4 text-center">Enrolled Students</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredGroups.length === 0 ? (<tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No academic groups or streams found for this criteria.
                  </td>
                </tr>) : (filteredGroups.map((g) => {
            const isActive = g.status === 'Active';
            return (<tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-900">
                        <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200 text-xs">
                          {g.code}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{g.name}</div>
                        {g.description && (<div className="text-[11px] text-slate-400 mt-0.5">{g.description}</div>)}
                      </td>
                      <td className="py-3 px-4">
                        {g.class_name ? (<span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {g.class_name}
                          </span>) : (<span className="text-slate-400 italic">Common / All Higher Sec</span>)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {g.board || 'CBSE'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <BookOpen className="w-3 h-3 mr-1"/>
                          {g.subject_count ?? 0} Subjects
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Users className="w-3 h-3 mr-1"/>
                          {g.student_count ?? 0} Students
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button type="button" onClick={() => handleToggleStatus(g)} disabled={isReadOnly} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}>
                          {isActive ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> : <XCircle className="w-3 h-3 mr-1 text-slate-400"/>}
                          {g.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button type="button" onClick={() => handleOpenEdit(g)} disabled={isReadOnly} className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors cursor-pointer" title="Edit Stream">
                            <Edit2 className="w-3.5 h-3.5"/>
                          </button>
                          <button type="button" onClick={() => setDeletingGroup(g)} disabled={isReadOnly} className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Delete / Deactivate">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </td>
                    </tr>);
        }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT STREAM MODAL */}
      {isModalOpen && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4"/>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingGroup ? 'Edit Group / Stream' : 'Add New Group / Stream'}
                </h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stream Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={formData.name} onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (!formData.code) {
                    const c = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
                    setFormData((prev) => ({ ...prev, name: e.target.value, code: c }));
                }
            }} placeholder="e.g. Science – Biology, Commerce, Humanities" className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700"/>
                {formErrors.name && <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stream Code <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. SCI-BIO, COM" className="w-full text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700"/>
                  {formErrors.code && <p className="text-[11px] text-red-600 mt-1">{formErrors.code}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Board
                  </label>
                  <select value={formData.board} onChange={(e) => setFormData({ ...formData, board: e.target.value })} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white cursor-pointer">
                    {['CBSE', 'ICSE', 'State Board', 'Cambridge', 'IB'].map((b) => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Applicable Class
                  </label>
                  <select value={formData.class_id} onChange={(e) => setFormData({ ...formData, class_id: e.target.value ? Number(e.target.value) : '' })} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white cursor-pointer">
                    <option value="">All Higher Secondary Classes</option>
                    {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Combination Notes
                </label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} placeholder="e.g. Physics, Chemistry, Maths, Biology combination" className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2"/>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs disabled:opacity-50 flex items-center space-x-1">
                  <Save className="w-3.5 h-3.5"/>
                  <span>{isSubmitting ? 'Saving...' : 'Save Stream'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* SAFE DELETE / INACTIVE WARNING MODAL */}
      {deletingGroup && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6"/>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Delete Academic Stream?
              </h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{deletingGroup.name}</strong>?
              </p>

              {(deletingGroup.subject_count || 0) > 0 || (deletingGroup.student_count || 0) > 0 ? (<div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <span>Academic Integrity Rule:</span>
                  </div>
                  <div>
                    This stream currently has <strong>{deletingGroup.subject_count || 0} configured subjects</strong> and <strong>{deletingGroup.student_count || 0} enrolled students</strong>. Physical deletion will be blocked by the system to protect student historical records.
                  </div>
                  <div className="pt-1 font-semibold text-amber-800">
                    Recommended Action: Mark this stream as <strong>Inactive</strong> instead.
                  </div>
                </div>) : null}
            </div>

            <div className="flex items-center justify-end space-x-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button type="button" onClick={() => setDeletingGroup(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-200 rounded-xl">
                Cancel
              </button>
              <button type="button" onClick={async () => {
                await handleToggleStatus(deletingGroup);
                setDeletingGroup(null);
            }} className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl">
                Set as Inactive
              </button>
              {!(deletingGroup.subject_count || 0) && !(deletingGroup.student_count || 0) && (<button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50">
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>)}
            </div>
          </div>
        </div>)}
    </div>);
};
