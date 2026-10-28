import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
export const ChangeSubjectStatusModal = ({ isOpen, onClose, onConfirm, subject }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!isOpen || !subject)
        return null;
    const nextStatus = subject.status === 'Active' ? 'Inactive' : 'Active';
    const isDeactivating = nextStatus === 'Inactive';
    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm(subject.id, nextStatus);
            onClose();
        }
        catch (err) {
            console.error('Failed to change subject status:', err);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${isDeactivating
            ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700'}`}>
              {isDeactivating ? (<AlertTriangle className="w-6 h-6"/>) : (<CheckCircle2 className="w-6 h-6"/>)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isDeactivating ? 'Deactivate Subject' : 'Activate Subject'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {subject.name} ({subject.code})
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {isDeactivating
            ? `Are you sure you want to deactivate "${subject.name}"? Inactive subjects will not be visible for new homework, assignments, and exam entries until re-activated.`
            : `Are you sure you want to activate "${subject.name}"? It will be made available for curriculum planning and academic transactions.`}
          </p>

          {isDeactivating && subject.assigned_classes && (<div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900">
              <span className="font-bold block mb-1">Affected Classes:</span>
              <span className="text-amber-800">{subject.assigned_classes}</span>
            </div>)}

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={handleConfirm} disabled={isSubmitting} className={`px-5 py-2 text-xs font-bold text-white rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer ${isDeactivating
            ? 'bg-amber-600 hover:bg-amber-700'
            : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              {isSubmitting ? 'Updating...' : `Confirm ${isDeactivating ? 'Deactivation' : 'Activation'}`}
            </button>
          </div>
        </div>
      </div>
    </div>);
};
