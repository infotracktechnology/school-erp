import React, { useState } from 'react';
import { X, ShieldCheck, Calendar, Check, FileText, Sliders } from 'lucide-react';
export const BranchSettingsModal = ({ branch, isOpen, onClose, onShowToast }) => {
    const [academicYear, setAcademicYear] = useState('2026-2027');
    const [currency, setCurrency] = useState('INR (₹)');
    const [receiptPrefix, setReceiptPrefix] = useState(branch ? `${branch.branch_code}-REC` : 'REC');
    const [admissionPrefix, setAdmissionPrefix] = useState(branch ? `${branch.branch_code}-ADM` : 'ADM');
    const [isSaving, setIsSaving] = useState(false);
    if (!isOpen || !branch)
        return null;
    const handleSaveSettings = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            onShowToast(`Settings updated for ${branch.branch_name}`, 'success');
            onClose();
        }, 400);
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              <Sliders className="w-4 h-4"/>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Branch Settings – {branch.branch_name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Code: {branch.branch_code} • Org ID: #{branch.organization_id}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200/60 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Multi-Tenant Data Isolation Notice */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-900 flex items-start space-x-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"/>
            <div>
              <p className="font-bold">Multi-Branch Architecture & Data Isolation</p>
              <p className="text-emerald-800/90 mt-0.5 leading-relaxed">
                All future ERP operational modules (Academic Years, Classes, Students, Fees, Attendance) will bind strictly to <span className="font-mono font-bold">branch_id: {branch.id}</span> under <span className="font-mono font-bold">organization_id: {branch.organization_id}</span>.
              </p>
            </div>
          </div>

          {/* Operational Prefixes */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-slate-500"/>
              <span>Operational Prefixes & Numbering</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Admission Number Prefix
                </label>
                <input type="text" value={admissionPrefix} onChange={(e) => setAdmissionPrefix(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Fee Receipt Prefix
                </label>
                <input type="text" value={receiptPrefix} onChange={(e) => setReceiptPrefix(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"/>
              </div>
            </div>
          </div>

          {/* Default Localization & Cycle */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500"/>
              <span>Academic Cycle & Currency</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Active Academic Year
                </label>
                <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700">
                  <option value="2026-2027">2026 – 2027 (Current)</option>
                  <option value="2025-2026">2025 – 2026</option>
                  <option value="2027-2028">2027 – 2028 (Upcoming)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Base Accounting Currency
                </label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700">
                  <option value="INR (₹)">INR (₹) – Indian Rupee</option>
                  <option value="USD ($)">USD ($) – US Dollar</option>
                  <option value="EUR (€)">EUR (€) – Euro</option>
                  <option value="GBP (£)">GBP (£) – British Pound</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 transition-colors">
            Close
          </button>

          <button type="button" onClick={handleSaveSettings} disabled={isSaving} className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5">
            {isSaving ? (<span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>) : (<Check className="w-3.5 h-3.5"/>)}
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>);
};
