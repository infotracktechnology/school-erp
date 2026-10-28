import React, { useState } from 'react';
import {
  Key,
  X,
  Save,
  Shield,
  Phone,
  Calendar,
  Lock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import staffService from '../../services/staffService';

export default function BulkCredentialsModal({
  isOpen,
  onClose,
  selectedStaffIds = [],
  roles = [],
  onSuccess
}) {
  if (!isOpen || selectedStaffIds.length === 0) return null;

  const [passwordPattern, setPasswordPattern] = useState('mobile'); // 'mobile', 'dob', 'default', 'custom'
  const [customPassword, setCustomPassword] = useState('');
  const [usernamePattern, setUsernamePattern] = useState('keep'); // 'keep', 'email', 'code', 'mobile'
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleApplyBulk = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (passwordPattern === 'custom' && !customPassword.trim()) {
      setError('Please provide a custom password.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        staff_ids: selectedStaffIds,
        password_pattern: passwordPattern,
        custom_password: customPassword.trim(),
        username_pattern: usernamePattern
      };

      const res = await staffService.bulkUpdateCredentials(payload);
      setSuccessMsg(res.message || 'Credentials updated successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Error updating bulk credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Bulk Update ERP Credentials
              </h3>
              <p className="text-[11px] text-slate-300">
                Batch apply formula across <strong className="text-white underline">{selectedStaffIds.length}</strong> selected staff members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleApplyBulk} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Password Formula Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              Select Password Formula:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label
                onClick={() => setPasswordPattern('mobile')}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  passwordPattern === 'mobile'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Mobile Phone</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Each staff gets their own phone number as password
                </p>
              </label>

              <label
                onClick={() => setPasswordPattern('dob')}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  passwordPattern === 'dob'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>DOB (DDMMYYYY)</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Each staff gets their birthdate (e.g. 15081992)
                </p>
              </label>

              <label
                onClick={() => setPasswordPattern('default')}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  passwordPattern === 'default'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>Standard Default</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Set password to <strong>School@123</strong>
                </p>
              </label>

              <label
                onClick={() => setPasswordPattern('custom')}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  passwordPattern === 'custom'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Custom Password</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Specify a common new password
                </p>
              </label>
            </div>

            {passwordPattern === 'custom' && (
              <input
                type="text"
                placeholder="Enter custom password..."
                value={customPassword}
                onChange={e => setCustomPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* 2. Username Mapping Formula */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-800">
              Username Mapping:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="user_pattern"
                  checked={usernamePattern === 'keep'}
                  onChange={() => setUsernamePattern('keep')}
                  className="text-indigo-600"
                />
                <span className="font-semibold text-gray-700">Keep Current Username</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="user_pattern"
                  checked={usernamePattern === 'email'}
                  onChange={() => setUsernamePattern('email')}
                  className="text-indigo-600"
                />
                <span className="font-semibold text-gray-700">Staff Email ID</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="user_pattern"
                  checked={usernamePattern === 'code'}
                  onChange={() => setUsernamePattern('code')}
                  className="text-indigo-600"
                />
                <span className="font-semibold text-gray-700">Staff Code</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="user_pattern"
                  checked={usernamePattern === 'mobile'}
                  onChange={() => setUsernamePattern('mobile')}
                  className="text-indigo-600"
                />
                <span className="font-semibold text-gray-700">Mobile Phone</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Applying Bulk Update...' : `Apply to ${selectedStaffIds.length} Staff Members`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
