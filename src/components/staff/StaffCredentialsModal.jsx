import React, { useState, useEffect } from 'react';
import {
  Key,
  X,
  Save,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Lock
} from 'lucide-react';
import staffService from '../../services/staffService';

export default function StaffCredentialsModal({
  isOpen,
  onClose,
  staff,
  roles = [],
  onSuccess
}) {
  if (!isOpen || !staff) return null;

  const [username, setUsername] = useState(staff.login_username || staff.email || `${staff.staff_code || 'staff'}@school.edu`);
  const [password, setPassword] = useState('School@123');
  const [showPassword, setShowPassword] = useState(false);
  const [roleId, setRoleId] = useState(staff.role_id || 9);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Format DOB if available (DDMMYYYY)
  const getFormattedDob = () => {
    if (!staff.date_of_birth) return null;
    const d = new Date(staff.date_of_birth);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  const formattedDob = getFormattedDob();

  // Quick Set Username Handlers
  const handleSetUsernameFromEmail = () => {
    if (staff.email) setUsername(staff.email.trim());
  };

  const handleSetUsernameFromCode = () => {
    if (staff.staff_code) setUsername(staff.staff_code.trim());
  };

  const handleSetUsernameFromMobile = () => {
    if (staff.mobile) setUsername(staff.mobile.trim());
  };

  // Quick Set Password Handlers
  const handleSetPasswordFromMobile = () => {
    if (staff.mobile) {
      setPassword(staff.mobile.trim());
      setShowPassword(true);
    }
  };

  const handleSetPasswordFromDob = () => {
    if (formattedDob) {
      setPassword(formattedDob);
      setShowPassword(true);
    }
  };

  const handleSetPasswordDefault = () => {
    setPassword('School@123');
    setShowPassword(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username.trim()) {
      setError('Username / Email cannot be empty.');
      return;
    }
    if (!password.trim()) {
      setError('Password cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      await staffService.updateCredentials(staff.id, {
        username: username.trim(),
        password: password.trim(),
        role_id: Number(roleId)
      });
      setSuccessMsg('ERP Credentials updated successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Error updating credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Manage ERP Credentials
              </h3>
              <p className="text-[11px] text-slate-300">
                {staff.first_name} {staff.last_name || ''} ({staff.staff_code})
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
        <form onSubmit={handleSave} className="p-5 space-y-4">
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

          {/* Staff Reference Info Card */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs grid grid-cols-2 gap-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Mobile: <strong className="text-slate-900">{staff.mobile || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Email: <strong className="text-slate-900 truncate">{staff.email || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>DOB: <strong className="text-slate-900">{staff.date_of_birth ? new Date(staff.date_of_birth).toISOString().slice(0, 10) : 'Not specified'} {formattedDob ? `(DDMMYYYY: ${formattedDob})` : ''}</strong></span>
            </div>
          </div>

          {/* Master Role */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              Assigned Master Role
            </label>
            <select
              value={roleId}
              onChange={e => setRoleId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Username Field with Quick Map Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700">
                ERP Login Username / Email
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 mr-0.5">Map from:</span>
                {staff.email && (
                  <button
                    type="button"
                    onClick={handleSetUsernameFromEmail}
                    className="text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition"
                  >
                    Email
                  </button>
                )}
                {staff.staff_code && (
                  <button
                    type="button"
                    onClick={handleSetUsernameFromCode}
                    className="text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition"
                  >
                    Code
                  </button>
                )}
                {staff.mobile && (
                  <button
                    type="button"
                    onClick={handleSetUsernameFromMobile}
                    className="text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition"
                  >
                    Phone
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Password Field with Quick Map Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Password
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 mr-0.5">Map from:</span>
                {staff.mobile && (
                  <button
                    type="button"
                    onClick={handleSetPasswordFromMobile}
                    className="text-[10px] font-semibold px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded hover:bg-sky-100 transition"
                    title={`Set password to phone number: ${staff.mobile}`}
                  >
                    Phone
                  </button>
                )}
                {formattedDob && (
                  <button
                    type="button"
                    onClick={handleSetPasswordFromDob}
                    className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition"
                    title={`Set password to DOB: ${formattedDob}`}
                  >
                    DOB ({formattedDob})
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSetPasswordDefault}
                  className="text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  School@123
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-9 text-xs font-mono font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
              {saving ? 'Updating...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
