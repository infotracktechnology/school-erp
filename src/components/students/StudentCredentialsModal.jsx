import React, { useState } from 'react';
import {
  Key,
  X,
  Save,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';

export default function StudentCredentialsModal({
  isOpen,
  onClose,
  student,
  onSuccess
}) {
  if (!isOpen || !student) return null;

  const initialUsername = student.admission_number || student.admission_no || student.email || `ADM-${student.id}`;
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(student.admission_number || student.admission_no || 'student123');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Format DOB if available (DDMMYYYY)
  const getFormattedDob = () => {
    const rawDob = student.dob || student.date_of_birth;
    if (!rawDob) return null;
    const d = new Date(rawDob);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  const formattedDob = getFormattedDob();

  // Quick Set Username Handlers
  const handleSetUsernameFromAdmission = () => {
    const adm = student.admission_number || student.admission_no;
    if (adm) setUsername(adm.trim());
  };

  const handleSetUsernameFromEmail = () => {
    if (student.email || student.parent_email) {
      setUsername((student.email || student.parent_email).trim());
    }
  };

  // Quick Set Password Handlers
  const handleSetPasswordFromAdmission = () => {
    const adm = student.admission_number || student.admission_no;
    if (adm) setPassword(adm.trim());
  };

  const handleSetPasswordFromDob = () => {
    if (formattedDob) setPassword(formattedDob);
  };

  const handleSetPasswordDefault = () => {
    setPassword('student123');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username / Admission Number cannot be empty.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/students/${student.id}/credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update student credentials');
      }

      setSuccessMsg('Student credentials updated successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const studentFullName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.name || 'Student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Student ERP Credentials
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
                  Role: Student
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage mobile app and student portal sign-in credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Info Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {studentFullName}
            </span>
            <div className="text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
              <span>Adm: <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{student.admission_number || student.admission_no || 'N/A'}</span></span>
              <span>•</span>
              <span>{student.class_name || 'Class'} - {student.section_name || 'Sec'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
              Active Student
            </span>
          </div>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                Login Username / Admission No
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400">Quick set:</span>
                <button
                  type="button"
                  onClick={handleSetUsernameFromAdmission}
                  className="px-1.5 py-0.5 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded font-medium transition"
                  title="Use Admission Number"
                >
                  Admission No
                </button>
                {(student.email || student.parent_email) && (
                  <button
                    type="button"
                    onClick={handleSetUsernameFromEmail}
                    className="px-1.5 py-0.5 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded font-medium transition"
                    title="Use Email"
                  >
                    Email
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ADM-2025-017"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition outline-hidden"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                Password
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400">Formula:</span>
                <button
                  type="button"
                  onClick={handleSetPasswordFromAdmission}
                  className="px-1.5 py-0.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded font-medium transition"
                >
                  Admission No
                </button>
                {formattedDob && (
                  <button
                    type="button"
                    onClick={handleSetPasswordFromDob}
                    className="px-1.5 py-0.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded font-medium transition"
                  >
                    DOB
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSetPasswordDefault}
                  className="px-1.5 py-0.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded font-medium transition"
                >
                  student123
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 font-mono pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-hidden"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Students can use this password to sign into the Mobile App and Student Portal.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 rounded-xl shadow-md shadow-sky-600/20 flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Student Credentials</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
