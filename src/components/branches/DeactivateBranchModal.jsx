import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const DeactivateBranchModal = ({ branch, isOpen, onClose, onConfirm, isLoading = false }) => {
    if (!branch)
        return null;
    const isCurrentlyActive = branch.status === 'Active';
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="max-w-md p-6 sm:p-7 text-center">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isCurrentlyActive
              ? 'bg-amber-50 text-amber-600 border border-amber-200 ring-4 ring-amber-50'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-4 ring-emerald-50'}`}>
            {isCurrentlyActive ? (<AlertTriangle className="w-7 h-7"/>) : (<CheckCircle2 className="w-7 h-7"/>)}
          </div>

          {/* Modal Title */}
          <DialogTitle className="text-xl font-bold text-slate-900 text-center">
            {isCurrentlyActive ? 'Deactivate Branch?' : 'Activate Branch?'}
          </DialogTitle>

          {/* Content matching the exact prompt specification */}
          {isCurrentlyActive ? (<div className="mt-3 space-y-3">
              <p className="text-sm text-slate-600">
                Are you sure you want to deactivate{' '}
                <strong className="text-slate-900 block mt-1 text-base">{branch.branch_name}</strong>?
              </p>
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed text-left">
                Users will not be able to create new operational records for this branch while it is inactive. Historical data is preserved.
              </div>
            </div>) : (<div className="mt-3 space-y-3">
              <p className="text-sm text-slate-600">
                Are you sure you want to reactivate{' '}
                <strong className="text-slate-900 block mt-1 text-base">{branch.branch_name}</strong>?
              </p>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 leading-relaxed text-left">
                This branch will immediately resume operational status for scheduling, enrollments, and transactions.
              </div>
            </div>)}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border-slate-300 text-xs sm:text-sm font-semibold text-slate-700"
            >
              Cancel
            </Button>

            <Button
              type="button"
              id="confirm-deactivate-btn"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs ${isCurrentlyActive
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span>{isCurrentlyActive ? 'Deactivate' : 'Activate'}</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
};
