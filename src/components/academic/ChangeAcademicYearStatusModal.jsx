import React, { useState } from 'react';
import { RefreshCw, Clock, CheckCircle2, Archive, X, AlertCircle } from 'lucide-react';
export const ChangeAcademicYearStatusModal = ({ isOpen, onClose, onConfirm, academicYear }) => {
    const [selectedStatus, setSelectedStatus] = useState(academicYear?.status || 'Upcoming');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    React.useEffect(() => {
        if (academicYear) {
            setSelectedStatus(academicYear.status);
            setError(null);
        }
    }, [academicYear, isOpen]);
    if (!isOpen || !academicYear)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await onConfirm(selectedStatus);
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to update academic year status.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs">
              <RefreshCw className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold">Change Academic Year Status</h3>
              <p className="text-xs text-emerald-100/90 font-medium">
                {academicYear.name} ({academicYear.branch_name || 'Selected Campus'})
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (<div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>
              <span>{error}</span>
            </div>)}

          <p className="text-xs text-slate-600">
            Select the new operational status for academic cycle <strong>{academicYear.name}</strong>:
          </p>

          <div className="space-y-2.5">
            {/* Upcoming */}
            <label className={`flex items-start p-3.5 rounded-xl border-2 transition-all cursor-pointer ${selectedStatus === 'Upcoming'
            ? 'border-emerald-700 bg-emerald-50/40 text-slate-900'
            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}>
              <input type="radio" name="status" value="Upcoming" checked={selectedStatus === 'Upcoming'} onChange={() => setSelectedStatus('Upcoming')} className="mt-1 text-emerald-700 focus:ring-emerald-600"/>
              <div className="ml-3 flex-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600"/>
                  <span className="text-sm font-bold">Upcoming</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic year has not started yet. Pre-configuration and planning phase.
                </p>
              </div>
            </label>

            {/* Active */}
            <label className={`flex items-start p-3.5 rounded-xl border-2 transition-all cursor-pointer ${selectedStatus === 'Active'
            ? 'border-emerald-700 bg-emerald-50/40 text-slate-900'
            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}>
              <input type="radio" name="status" value="Active" checked={selectedStatus === 'Active'} onChange={() => setSelectedStatus('Active')} className="mt-1 text-emerald-700 focus:ring-emerald-600"/>
              <div className="ml-3 flex-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
                  <span className="text-sm font-bold">Active</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic year is currently open and in active operational progress.
                </p>
              </div>
            </label>

            {/* Closed */}
            <label className={`flex items-start p-3.5 rounded-xl border-2 transition-all cursor-pointer ${selectedStatus === 'Closed'
            ? 'border-emerald-700 bg-emerald-50/40 text-slate-900'
            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}>
              <input type="radio" name="status" value="Closed" checked={selectedStatus === 'Closed'} onChange={() => setSelectedStatus('Closed')} className="mt-1 text-emerald-700 focus:ring-emerald-600"/>
              <div className="ml-3 flex-1">
                <div className="flex items-center space-x-2">
                  <Archive className="w-4 h-4 text-slate-500"/>
                  <span className="text-sm font-bold">Closed</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic year has ended. Remains permanently preserved for historical reports and audits.
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60">
              {isSubmitting ? <span>Updating...</span> : <span>Update Status</span>}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
