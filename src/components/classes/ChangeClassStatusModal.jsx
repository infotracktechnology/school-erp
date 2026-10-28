import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
export const ChangeClassStatusModal = ({ isOpen, onClose, classItem, onConfirm }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    if (!isOpen || !classItem)
        return null;
    const currentStatus = classItem.status;
    const targetStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const isDeactivating = targetStatus === 'Inactive';
    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await onConfirm(targetStatus);
            onClose();
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDeactivating
            ? 'bg-amber-100 text-amber-800 border border-amber-200'
            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
              {isDeactivating ? (<AlertTriangle className="w-6 h-6"/>) : (<CheckCircle2 className="w-6 h-6"/>)}
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900">
                {isDeactivating ? 'Deactivate Class' : 'Activate Class'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Are you sure you want to change status of class <strong>"{classItem.name}"</strong> to{' '}
                <span className={isDeactivating ? 'text-amber-800 font-bold' : 'text-emerald-800 font-bold'}>
                  {targetStatus}
                </span>
                ?
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Class Code:</span>
              <span className="font-mono font-bold text-slate-800">{classItem.code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assigned Sections:</span>
              <span className="font-semibold text-slate-800">{classItem.sections || 'None'}</span>
            </div>
          </div>

          {isDeactivating && classItem.is_locked ? (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Class is Locked
              </span>
              <p>
                This class currently has <strong>{classItem.student_count || 0} student(s)</strong> assigned to it in this academic year. 
                You cannot deactivate or disable a class while students are assigned.
              </p>
            </div>
          ) : isDeactivating ? (
            <p className="mt-3 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              Note: Inactive classes will be hidden from timetable scheduling, student enrollment, and daily attendance records.
            </p>
          ) : null}

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleConfirm} 
              disabled={isProcessing || (isDeactivating && classItem.is_locked)} 
              className={`px-5 py-2 text-xs sm:text-sm font-bold text-white rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isDeactivating
                ? 'bg-amber-700 hover:bg-amber-800'
                : 'bg-emerald-700 hover:bg-emerald-800'}`}
            >
              {isProcessing ? 'Updating...' : `Confirm ${targetStatus}`}
            </button>
          </div>
        </div>
      </div>
    </div>);
};
