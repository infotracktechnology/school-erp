import React, { useState } from 'react';
import { FolderTree, Plus, CheckCircle2, XCircle, X } from 'lucide-react';
import { createSubjectCategory, updateSubjectCategoryStatus } from '../../services/api';
export const SubjectCategoriesTab = ({ categories, onRefresh, showToast, isReadOnly = false }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [board, setBoard] = useState('CBSE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            showToast('Category name is required', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await createSubjectCategory({
                name: name.trim(),
                code: code.trim().toUpperCase() || name.slice(0, 4).toUpperCase(),
                board,
                display_order: categories.length + 1,
                status: 'Active'
            });
            showToast(`Category "${name}" created.`, 'success');
            setName('');
            setCode('');
            setIsAddOpen(false);
            onRefresh();
        }
        catch (err) {
            showToast(err.message || 'Failed to create category', 'error');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleToggle = async (cat) => {
        const next = cat.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await updateSubjectCategoryStatus(cat.id, next);
            showToast(`Category "${cat.name}" status changed to ${next}.`, 'success');
            onRefresh();
        }
        catch (err) {
            showToast(err.message || 'Failed to change status', 'error');
        }
    };
    return (<div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <FolderTree className="w-4 h-4 text-emerald-700"/>
            <span>Subject Categories Master</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Organize subjects into standard educational departments & classification buckets
          </p>
        </div>

        <button type="button" onClick={() => setIsAddOpen(true)} disabled={isReadOnly} className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer">
          <Plus className="w-4 h-4"/>
          <span>Add Subject Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => {
            const isActive = cat.status === 'Active';
            return (<div key={cat.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{cat.name}</div>
                <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                  Code: {cat.code} • {cat.board || 'Common'}
                </div>
              </div>
              <button type="button" onClick={() => handleToggle(cat)} disabled={isReadOnly} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {isActive ? (<CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/>) : (<XCircle className="w-3 h-3 mr-1 text-slate-400"/>)}
                {cat.status}
              </button>
            </div>);
        })}
      </div>

      {/* ADD CATEGORY MODAL */}
      {isAddOpen && (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Add Subject Category</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Computer Science, Fine Arts" className="w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Code
                </label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. CS, FA" className="w-full text-xs font-mono uppercase rounded-lg border border-slate-300 px-3 py-2"/>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded-lg disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
