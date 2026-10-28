import React, { useState } from 'react';
import { AlertTriangle, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
export const HistoricalYearBanner = () => {
    const { activeAcademicYear, isHistoricalYear, isReadOnly, canManageHistoricalData, adminOverrideActive, setAdminOverrideActive, showToast } = useErp();
    const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
    if (!isHistoricalYear || !activeAcademicYear) {
        return null;
    }
    const handleToggleOverride = () => {
        if (adminOverrideActive) {
            setAdminOverrideActive(false);
            showToast('Admin override disabled. Switched back to Read-Only mode.', 'info');
        }
        else {
            setShowOverrideConfirm(true);
        }
    };
    const confirmEnableOverride = () => {
        setAdminOverrideActive(true);
        setShowOverrideConfirm(false);
        showToast('Admin Override Enabled: You can now modify historical records.', 'info');
    };
    return (<>
      <div id="historical-academic-year-banner" className={`w-full border-b px-4 py-2.5 transition-colors ${adminOverrideActive
            ? 'bg-amber-500/10 border-amber-300 text-amber-950'
            : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          {/* Left: Status Message */}
          <div className="flex items-center space-x-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${adminOverrideActive
            ? 'bg-amber-500 text-white shadow-xs'
            : 'bg-amber-200/80 text-amber-800'}`}>
              {adminOverrideActive ? (<ShieldAlert className="w-4 h-4"/>) : (<Lock className="w-4 h-4"/>)}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-tight">
                  Historical Academic Year: {activeAcademicYear.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${adminOverrideActive
            ? 'bg-amber-200 text-amber-900 border border-amber-300'
            : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                  {adminOverrideActive ? 'Admin Edit Override Active' : 'Read-Only Mode'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800/90 font-medium">
                {adminOverrideActive
            ? 'Administrative override active. Please proceed with caution when updating archived records.'
            : `You are viewing archived historical records. Form submissions and edits are restricted to prevent data discrepancies.`}
              </p>
            </div>
          </div>

          {/* Right: Admin Override Toggle */}
          {canManageHistoricalData && (<div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
              <button type="button" id="admin-override-toggle-button" onClick={handleToggleOverride} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${adminOverrideActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-700'
                : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'}`} title="Toggle Admin Override for Historical Modifications">
                {adminOverrideActive ? (<>
                    <Unlock className="w-3.5 h-3.5"/>
                    <span>Disable Override</span>
                  </>) : (<>
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700"/>
                    <span>Enable Admin Override</span>
                  </>)}
              </button>
            </div>)}
        </div>
      </div>

      {/* Confirmation Modal for Admin Override */}
      {showOverrideConfirm && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div id="admin-override-confirmation-modal" className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Enable Historical Edit Override?
                </h3>
                <p className="text-xs font-semibold text-amber-800 mt-1">
                  Academic Year: {activeAcademicYear.name}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1.5 font-medium">
              <p className="font-bold text-amber-950 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700"/>
                <span>Caution: Sensitive Operation</span>
              </p>
              <p>
                Modifying historical records may affect past reports, official grading transcripts, student fee balances, or financial audit records.
              </p>
              <p className="text-[11px] text-amber-800">
                All modifications performed while override is active will be logged in the system audit trail.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button type="button" onClick={() => setShowOverrideConfirm(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" id="confirm-admin-override-button" onClick={confirmEnableOverride} className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-xs">
                I Understand, Enable Override
              </button>
            </div>
          </div>
        </div>)}
    </>);
};
