import React from 'react';
import { X, Building2, MapPin, Phone, Mail, Globe, User, GraduationCap, Calendar, Clock, Edit, Power, ExternalLink } from 'lucide-react';
export const BranchProfileModal = ({ branch, isOpen, onClose, onEdit, onToggleStatus }) => {
    if (!isOpen || !branch)
        return null;
    const formatDate = (dateStr) => {
        if (!dateStr)
            return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        catch {
            return dateStr;
        }
    };
    const isInactive = branch.status === 'Inactive';
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              <Building2 className="w-4 h-4"/>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Branch Profile</h2>
              <p className="text-[11px] text-slate-500 font-medium">Administration → Branch Overview</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200/60 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Profile Hero Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-slate-50 to-white border border-emerald-900/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {branch.logo ? (<img src={branch.logo} alt={branch.branch_name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-white shrink-0" referrerPolicy="no-referrer"/>) : (<div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white shrink-0">
                  {branch.branch_name.slice(0, 2).toUpperCase()}
                </div>)}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {branch.branch_name}
                  </h1>
                  {branch.status === 'Active' ? (<span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Active</span>
                    </span>) : (<span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span>Inactive</span>
                    </span>)}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    {branch.branch_code}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-800">{branch.branch_type}</span>
                  <span>•</span>
                  <span>Board: {branch.board}</span>
                  {branch.established_year && (<>
                      <span>•</span>
                      <span>Est. {branch.established_year}</span>
                    </>)}
                </div>
              </div>
            </div>

            {/* Quick Actions in Hero */}
            <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-end pt-2 sm:pt-0">
              <button type="button" onClick={() => {
            onClose();
            onEdit(branch);
        }} className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors shadow-xs">
                <Edit className="w-3.5 h-3.5 text-blue-600"/>
                <span>Edit Branch</span>
              </button>

              <button type="button" onClick={() => onToggleStatus(branch)} className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs ${isInactive
            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
            : 'bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100'}`}>
                <Power className="w-3.5 h-3.5"/>
                <span>{isInactive ? 'Activate' : 'Deactivate'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section A: Basic Information */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3 mb-4">
                <Building2 className="w-4 h-4 text-emerald-700"/>
                <span>Basic Information</span>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">Branch Name</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">{branch.branch_name}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Branch Code</dt>
                  <dd className="font-mono font-bold text-slate-800 mt-0.5">{branch.branch_code}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Short / Display Name</dt>
                  <dd className="font-semibold text-slate-700 mt-0.5">
                    {branch.short_name || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Campus Classification</dt>
                  <dd className="font-semibold text-emerald-800 mt-0.5">{branch.branch_type}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Status</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">{branch.status}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Organization Reference</dt>
                  <dd className="font-mono text-slate-600 mt-0.5">Org #{branch.organization_id}</dd>
                </div>
              </dl>
            </div>

            {/* Section B: Branch Address */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3 mb-4">
                <MapPin className="w-4 h-4 text-emerald-700"/>
                <span>Branch Address</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Full Address</p>
                  <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                    {branch.address_line_1}
                    {branch.address_line_2 && <span>, {branch.address_line_2}</span>}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium block">City</span>
                    <span className="font-bold text-slate-800">{branch.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">District</span>
                    <span className="font-semibold text-slate-800">{branch.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">State</span>
                    <span className="font-semibold text-slate-800">{branch.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Pincode</span>
                    <span className="font-mono font-bold text-slate-800">{branch.pincode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Country</span>
                    <span className="font-semibold text-slate-800">{branch.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Contact Information */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3 mb-4">
                <Phone className="w-4 h-4 text-emerald-700"/>
                <span>Contact Information</span>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">Official Phone</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {branch.phone ? (<a href={`tel:${branch.phone}`} className="hover:text-emerald-700 transition-colors">
                        {branch.phone}
                      </a>) : ('—')}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Alternative Phone</dt>
                  <dd className="font-semibold text-slate-700 mt-0.5">
                    {branch.alternative_phone || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Official Email</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {branch.email ? (<a href={`mailto:${branch.email}`} className="text-emerald-800 hover:underline flex items-center space-x-1">
                        <Mail className="w-3 h-3 inline"/>
                        <span className="truncate">{branch.email}</span>
                      </a>) : ('—')}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Website</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {branch.website ? (<a href={branch.website.startsWith('http') ? branch.website : `https://${branch.website}`} target="_blank" rel="noreferrer" className="text-emerald-800 hover:underline flex items-center space-x-1">
                        <Globe className="w-3 h-3 inline"/>
                        <span className="truncate">{branch.website}</span>
                        <ExternalLink className="w-2.5 h-2.5 inline"/>
                      </a>) : ('—')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Section D: Branch Head */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3 mb-4">
                <User className="w-4 h-4 text-emerald-700"/>
                <span>Branch Head</span>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">Head Name</dt>
                  <dd className="font-bold text-slate-900 mt-0.5">
                    {branch.branch_head_name || 'Not Designated'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Designation</dt>
                  <dd className="font-semibold text-emerald-800 mt-0.5">
                    {branch.branch_head_designation || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Direct Mobile</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {branch.branch_head_mobile ? (<a href={`tel:${branch.branch_head_mobile}`} className="hover:text-emerald-700">
                        {branch.branch_head_mobile}
                      </a>) : ('—')}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Official Email</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {branch.branch_head_email ? (<a href={`mailto:${branch.branch_head_email}`} className="text-emerald-800 hover:underline">
                        {branch.branch_head_email}
                      </a>) : ('—')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Section E: School Details */}
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3 mb-4">
                <GraduationCap className="w-4 h-4 text-emerald-700"/>
                <span>School Details & Accreditations</span>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">Education Board</dt>
                  <dd className="font-extrabold text-slate-900 mt-0.5">{branch.board}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Medium</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {branch.medium || 'English'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">School Type</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {branch.school_type || 'Co-Education'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Established Year</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {branch.established_year || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">UDISE Code</dt>
                  <dd className="font-mono font-semibold text-slate-800 mt-0.5">
                    {branch.udise_code || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Affiliation No.</dt>
                  <dd className="font-mono font-semibold text-slate-800 mt-0.5">
                    {branch.affiliation_number || '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Audit Timestamps */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400"/>
              <span>Created Date:</span>
              <strong className="text-slate-700">{formatDate(branch.created_at)}</strong>
            </div>

            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400"/>
              <span>Last Updated:</span>
              <strong className="text-slate-700">{formatDate(branch.updated_at)}</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 active:bg-black text-white text-xs font-bold transition-colors cursor-pointer">
            Close Profile
          </button>
        </div>
      </div>
    </div>);
};
