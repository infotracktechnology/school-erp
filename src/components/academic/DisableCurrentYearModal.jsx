import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const DisableCurrentYearModal = ({ isOpen, onClose, onConfirm, academicYear, isSubmitting = false }) => {
    if (!academicYear)
        return null;
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent id="disable-current-year-modal" className="max-w-md p-6 border border-amber-200">
          <DialogHeader className="flex flex-row items-start space-x-3.5 space-y-0 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5"/>
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Disable Active Academic Year?
              </DialogTitle>
              <p className="text-xs font-semibold text-amber-800 mt-0.5">
                {academicYear.name} ({academicYear.start_date.slice(0, 4)} – {academicYear.end_date.slice(0, 4)})
              </p>
            </div>
          </DialogHeader>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium space-y-1.5">
            <p className="font-bold text-amber-950">
              This Academic Year is currently active. Disabling it will remove it from the Academic Year selector. Do you want to continue?
            </p>
            <p className="text-[11px] text-amber-800">
              Disabling will automatically switch your active context to another enabled academic year. All underlying student, class, examination, and fee records remain 100% safe and intact.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              id="cancel-disable-year-button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              id="confirm-disable-year-button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isSubmitting ? (<span>Updating...</span>) : (<span>Continue</span>)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
};
