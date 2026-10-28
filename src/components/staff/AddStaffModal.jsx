import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  X,
  Save,
  AlertCircle,
  Key,
  Shield,
  GraduationCap,
  Building,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import staffService from '../../services/staffService';

export default function AddStaffModal({ isOpen, onClose, onSuccess, branchId = 1, editStaff = null }) {
  if (!isOpen) return null;

  // Basic staff profile
  const [formData, setFormData] = useState({
    staff_code: editStaff?.staff_code || '',
    first_name: editStaff?.first_name || '',
    last_name: editStaff?.last_name || '',
    staff_type: editStaff?.staff_type || 'Teaching',
    department: editStaff?.department || 'Mathematics',
    designation: editStaff?.designation || 'Class Teacher',
    gender: editStaff?.gender || 'Male',
    date_of_joining: editStaff?.date_of_joining || new Date().toISOString().slice(0, 10),
    mobile: editStaff?.mobile || '',
    email: editStaff?.email || '',
    qualification: editStaff?.qualification || '',
    experience_years: editStaff?.experience_years || 0,
    employment_type: editStaff?.employment_type || 'Permanent',
    status: editStaff?.status || 'Active'
  });

  // Explicit Admin-Selected Master Role
  const [selectedRoleId, setSelectedRoleId] = useState(9); // default: Class Teacher
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Master Roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await fetch('/api/permissions/roles').then(r => r.json());
        const filtered = (res.data || []).filter(r => r.name !== 'Student' && r.name !== 'Parent');
        setRoles(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    loadRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.first_name || !formData.mobile || !formData.department || !formData.designation) {
      setError('Please fill in required fields (First name, Mobile, Department, Designation).');
      return;
    }

    try {
      setSaving(true);
      const autoEmail = formData.email?.trim() || `${formData.staff_code || formData.first_name.toLowerCase().replace(/\s+/g, '')}@school.edu`;
      const payload = {
        ...formData,
        branch_id: branchId,
        // Automatic ERP Login Creation
        create_login: true,
        login_role_id: selectedRoleId,
        login_email: autoEmail,
        login_password: 'School@123'
      };

      if (editStaff?.id) {
        await staffService.updateStaff(editStaff.id, payload);
      } else {
        await staffService.createStaff(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving staff member.');
    } finally {
      setSaving(false);
    }
  };

  const selectedRoleName = roles.find(r => r.id === Number(selectedRoleId))?.name || 'Assigned Role';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-gray-100">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                {editStaff ? 'Edit Staff Profile' : 'Add Staff & Assign Role'}
              </h3>
              <p className="text-[11px] text-gray-500">
                Staff profile and ERP Login account are automatically created and linked.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Staff Type Selection */}
          <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, staff_type: 'Teaching' })}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition cursor-pointer ${
                  formData.staff_type === 'Teaching'
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs">🎓 Teaching Staff</div>
                  <div className={`text-[10px] ${formData.staff_type === 'Teaching' ? 'text-indigo-100' : 'text-gray-400'}`}>Teachers, Mentors, Specialists</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, staff_type: 'Non-Teaching' })}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition cursor-pointer ${
                  formData.staff_type === 'Non-Teaching'
                    ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs">🏢 Non-Teaching Staff</div>
                  <div className={`text-[10px] ${formData.staff_type === 'Non-Teaching' ? 'text-amber-100' : 'text-gray-400'}`}>Accounts, Office, Transport, Library</div>
                </div>
              </button>
            </div>
          </div>

          {/* Basic Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                required
                placeholder="e.g. Anand"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="e.g. Kumar"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Staff Code</label>
              <input
                type="text"
                value={formData.staff_code}
                onChange={e => setFormData({ ...formData, staff_code: e.target.value })}
                placeholder="Auto-generated if blank"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Department, Designation & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                required
                placeholder="e.g. Mathematics, Transport"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Designation *</label>
              <input
                type="text"
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                required
                placeholder="e.g. PGT Teacher, Accountant"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mobile Phone *</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                required
                placeholder="e.g. 9840112233"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Section 2: 👑 Master Role Assignment (Auto-Generated Login) */}
          <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold shadow-2xs">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-950 text-xs">
                    Master Role Assignment
                  </h4>
                  <p className="text-[10px] text-indigo-700">
                    ERP user account is automatically created with this role and credentials.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                Auto-Login Enabled
              </span>
            </div>

            <div>
              <label className="block font-bold text-gray-800 text-xs mb-1.5">
                Select Master Role *
              </label>
              <select
                value={selectedRoleId}
                onChange={e => setSelectedRoleId(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white font-bold text-indigo-950 text-xs cursor-pointer shadow-2xs"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/80 rounded-lg p-2.5 border border-indigo-100 text-[11px] text-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Login Username: <strong className="font-mono text-indigo-950">{formData.email || `${formData.staff_code || (formData.first_name ? formData.first_name.toLowerCase().replace(/\s+/g, '') : 'staff')}@school.edu`}</strong>
                </span>
              </div>
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                Default Password: School@123
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Creating Staff & User...' : 'Save Staff & Auto-Create Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
