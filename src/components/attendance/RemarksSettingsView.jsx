import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, CheckCircle2, XCircle, AlertCircle, Trash2, RefreshCw, Search, MessageSquare, ShieldCheck, X } from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { useErp } from '../../context/ErpContext';
export const RemarksSettingsView = () => {
    const { showToast, userRole } = useErp();
    const [remarks, setRemarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRemark, setEditingRemark] = useState(null);
    const [remarkName, setRemarkName] = useState('');
    const [remarkStatus, setRemarkStatus] = useState('Active');
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    // Load remarks
    const loadRemarks = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await attendanceApi.getRemarks();
            setRemarks(data);
        }
        catch (err) {
            console.error('Error fetching remarks:', err);
            showToast('Failed to load remarks master', 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [showToast]);
    useEffect(() => {
        loadRemarks();
    }, [loadRemarks]);
    const handleOpenAdd = () => {
        setEditingRemark(null);
        setRemarkName('');
        setRemarkStatus('Active');
        setFormError(null);
        setIsModalOpen(true);
    };
    const handleOpenEdit = (remark) => {
        setEditingRemark(remark);
        setRemarkName(remark.name);
        setRemarkStatus(remark.status);
        setFormError(null);
        setIsModalOpen(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!remarkName.trim()) {
            setFormError('Remark Name is required.');
            return;
        }
        setIsSaving(true);
        setFormError(null);
        try {
            if (editingRemark) {
                await attendanceApi.updateRemark(editingRemark.id, {
                    name: remarkName.trim(),
                    status: remarkStatus
                });
                showToast('Remark updated successfully', 'success');
            }
            else {
                await attendanceApi.createRemark({
                    name: remarkName.trim(),
                    status: remarkStatus
                });
                showToast('New remark added successfully', 'success');
            }
            setIsModalOpen(false);
            loadRemarks();
        }
        catch (err) {
            console.error('Error saving remark:', err);
            setFormError(err.message || 'Failed to save remark');
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleToggleStatus = async (remark) => {
        const nextStatus = remark.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await attendanceApi.toggleRemarkStatus(remark.id, nextStatus);
            showToast(`Remark "${remark.name}" marked ${nextStatus}`, 'info');
            loadRemarks();
        }
        catch (err) {
            console.error('Error toggling status:', err);
            showToast(err.message || 'Failed to update status', 'error');
        }
    };
    const handleDelete = async (remark) => {
        if (remark.usage_count && remark.usage_count > 0) {
            showToast(`Cannot delete "${remark.name}" because it is used in ${remark.usage_count} attendance records. Please deactivate it instead.`, 'error');
            return;
        }
        if (!window.confirm(`Are you sure you want to delete remark "${remark.name}"?`)) {
            return;
        }
        try {
            await attendanceApi.deleteRemark(remark.id);
            showToast(`Remark "${remark.name}" deleted successfully`, 'success');
            loadRemarks();
        }
        catch (err) {
            console.error('Error deleting remark:', err);
            showToast(err.message || 'Failed to delete remark', 'error');
        }
    };
    const filteredRemarks = remarks.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const canManage = userRole === 'super_admin' || userRole === 'branch_admin';
    return (<div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400"/>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Remarks Master Settings</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage standardized remark options available in the Take Attendance dropdown across all classes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button type="button" onClick={loadRemarks} disabled={isLoading} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-semibold inline-flex items-center transition-colors" title="Refresh list">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
          </button>

          {canManage && (<button type="button" id="add-remark-btn" onClick={handleOpenAdd} className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors">
              <Plus className="w-4 h-4"/>
              <span>Add Remark</span>
            </button>)}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400"/>
          <input type="text" id="search-remarks-input" placeholder="Search remark name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredRemarks.length}</span> standard remarks
        </div>
      </div>

      {/* Remarks Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        {isLoading ? (<div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3"/>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading remarks master...</p>
          </div>) : filteredRemarks.length === 0 ? (<div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2"/>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">No remarks found</h4>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm ? 'No remarks match your search criteria.' : 'No standard remarks configured yet.'}
            </p>
          </div>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-xs" id="remarks-table">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Remark</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Usage in Records</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRemarks.map((rem, idx) => (<tr key={rem.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">
                        {rem.name}
                      </div>
                      {rem.name === 'Other' && (<div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Enables custom text entry on Take Attendance screen
                        </div>)}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${rem.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${rem.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}/>
                        {rem.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {rem.usage_count ?? 0} record{rem.usage_count === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {canManage && (<>
                            <button type="button" id={`edit-remark-${rem.id}-btn`} onClick={() => handleOpenEdit(rem)} className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded text-xs font-semibold inline-flex items-center space-x-1 transition-colors">
                              <Edit2 className="w-3.5 h-3.5"/>
                              <span>Edit</span>
                            </button>

                            <button type="button" id={`toggle-remark-${rem.id}-btn`} onClick={() => handleToggleStatus(rem)} className={`px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center space-x-1 transition-colors ${rem.status === 'Active'
                        ? 'text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-slate-700'
                        : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700'}`}>
                              {rem.status === 'Active' ? (<>
                                  <XCircle className="w-3.5 h-3.5"/>
                                  <span>Deactivate</span>
                                </>) : (<>
                                  <CheckCircle2 className="w-3.5 h-3.5"/>
                                  <span>Activate</span>
                                </>)}
                            </button>

                            {/* Safe delete: disabled if used */}
                            {(!rem.usage_count || rem.usage_count === 0) && rem.name !== 'Other' && (<button type="button" id={`delete-remark-${rem.id}-btn`} onClick={() => handleDelete(rem)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded transition-colors" title="Delete unused remark">
                                <Trash2 className="w-3.5 h-3.5"/>
                              </button>)}
                          </>)}
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600"/>
                <span>{editingRemark ? 'Edit Remark' : 'Add Remark'}</span>
              </h4>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4"/>
              </button>
            </div>

            {formError && (<div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0"/>
                <span>{formError}</span>
              </div>)}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Remark Name <span className="text-rose-500">*</span>
                </label>
                <input type="text" id="remark-name-input" required placeholder="e.g. Sick, Family Function, Medical Leave" value={remarkName} onChange={e => setRemarkName(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <div className="flex items-center space-x-4 pt-1">
                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input type="radio" name="remarkStatus" value="Active" checked={remarkStatus === 'Active'} onChange={() => setRemarkStatus('Active')} className="text-emerald-600 focus:ring-emerald-500"/>
                    <span>Active</span>
                  </label>

                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input type="radio" name="remarkStatus" value="Inactive" checked={remarkStatus === 'Inactive'} onChange={() => setRemarkStatus('Inactive')} className="text-emerald-600 focus:ring-emerald-500"/>
                    <span>Inactive</span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Only Active remarks appear in the Take Attendance dropdown for daily marking.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancel
                </button>

                <button type="submit" id="save-remark-btn" disabled={isSaving} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Remark'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
