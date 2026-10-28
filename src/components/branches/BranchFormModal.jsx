import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, AlertCircle, Building2, MapPin, Phone, User, GraduationCap, Image as ImageIcon, Trash2, Info } from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, BRANCH_TYPES, EDUCATION_BOARDS, MEDIUMS, SCHOOL_TYPES, BRANCH_HEAD_DESIGNATIONS } from '../../data/indiaData';
const INITIAL_FORM_DATA = {
    branch_name: '',
    branch_code: '',
    short_name: '',
    branch_type: 'Main Branch',
    status: 'Active',
    logo: '',
    address_line_1: '',
    address_line_2: '',
    country: 'India',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    pincode: '',
    phone: '',
    alternative_phone: '',
    email: '',
    website: '',
    branch_head_name: '',
    branch_head_designation: 'Principal',
    branch_head_mobile: '',
    branch_head_email: '',
    board: 'CBSE',
    medium: 'English',
    school_type: 'Co-Education',
    udise_code: '',
    affiliation_number: '',
    established_year: ''
};
export const BranchFormModal = ({ isOpen, onClose, onSuccess, branchToEdit, existingBranchCodes = [] }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [activeTab, setActiveTab] = useState('A');
    const fileInputRef = useRef(null);
    const isEdit = !!branchToEdit;
    // Initialize or reset form data when opening / editing
    useEffect(() => {
        if (isOpen) {
            if (branchToEdit) {
                setFormData({
                    branch_name: branchToEdit.branch_name || '',
                    branch_code: branchToEdit.branch_code || '',
                    short_name: branchToEdit.short_name || '',
                    branch_type: branchToEdit.branch_type || 'Main Branch',
                    status: branchToEdit.status || 'Active',
                    logo: branchToEdit.logo || '',
                    address_line_1: branchToEdit.address_line_1 || '',
                    address_line_2: branchToEdit.address_line_2 || '',
                    country: branchToEdit.country || 'India',
                    state: branchToEdit.state || 'Tamil Nadu',
                    district: branchToEdit.district || 'Chennai',
                    city: branchToEdit.city || '',
                    pincode: branchToEdit.pincode || '',
                    phone: branchToEdit.phone || '',
                    alternative_phone: branchToEdit.alternative_phone || '',
                    email: branchToEdit.email || '',
                    website: branchToEdit.website || '',
                    branch_head_name: branchToEdit.branch_head_name || '',
                    branch_head_designation: branchToEdit.branch_head_designation || 'Principal',
                    branch_head_mobile: branchToEdit.branch_head_mobile || '',
                    branch_head_email: branchToEdit.branch_head_email || '',
                    board: branchToEdit.board || 'CBSE',
                    medium: branchToEdit.medium || 'English',
                    school_type: branchToEdit.school_type || 'Co-Education',
                    udise_code: branchToEdit.udise_code || '',
                    affiliation_number: branchToEdit.affiliation_number || '',
                    established_year: branchToEdit.established_year || ''
                });
            }
            else {
                setFormData(INITIAL_FORM_DATA);
            }
            setErrors({});
            setTouched({});
            setServerError(null);
            setActiveTab('A');
        }
    }, [isOpen, branchToEdit]);
    // When state changes, adjust district list if necessary
    const currentDistricts = INDIAN_STATES_DISTRICTS[formData.state] || [];
    const handleStateChange = (newState) => {
        const districts = INDIAN_STATES_DISTRICTS[newState] || [];
        setFormData((prev) => ({
            ...prev,
            state: newState,
            district: districts.length > 0 ? districts[0] : ''
        }));
    };
    // Field change handler with auto uppercase for branch_code
    const handleChange = (field, value) => {
        let finalValue = value;
        if (field === 'branch_code') {
            finalValue = String(value).toUpperCase();
        }
        setFormData((prev) => ({ ...prev, [field]: finalValue }));
        setTouched((prev) => ({ ...prev, [field]: true }));
        // Clear field-specific error as user types
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };
    // Logo file upload handler
    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Validate image format
        const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validFormats.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                logo: 'Please upload a valid image file (JPG, JPEG, PNG, or WEBP).'
            }));
            return;
        }
        // Validate size (max 3MB)
        if (file.size > 3 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                logo: 'Image size should be less than 3MB.'
            }));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            setFormData((prev) => ({ ...prev, logo: base64String }));
            setErrors((prev) => {
                const next = { ...prev };
                delete next.logo;
                return next;
            });
        };
        reader.readAsDataURL(file);
    };
    const handleRemoveLogo = () => {
        setFormData((prev) => ({ ...prev, logo: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    // Client-side validation logic
    const validateForm = () => {
        const newErrors = {};
        const name = formData.branch_name.trim();
        const code = formData.branch_code.trim().toUpperCase();
        const address1 = formData.address_line_1.trim();
        const country = formData.country.trim();
        const state = formData.state.trim();
        const district = formData.district.trim();
        const city = formData.city.trim();
        const pincode = formData.pincode.trim();
        const board = formData.board;
        const branchType = formData.branch_type;
        const status = formData.status;
        // Mandatory fields
        if (!name)
            newErrors.branch_name = 'Branch Name is required';
        if (!code) {
            newErrors.branch_code = 'Branch Code is required';
        }
        else {
            // Check duplicate code (excluding current branch if editing)
            const duplicate = existingBranchCodes.some((c) => c.toUpperCase() === code && (!isEdit || branchToEdit?.branch_code.toUpperCase() !== code));
            if (duplicate) {
                newErrors.branch_code = `Branch Code "${code}" already exists in the organization`;
            }
        }
        if (!branchType)
            newErrors.branch_type = 'Branch Type is required';
        if (!status)
            newErrors.status = 'Branch Status is required';
        if (!address1)
            newErrors.address_line_1 = 'Address Line 1 is required';
        if (!country)
            newErrors.country = 'Country is required';
        if (!state)
            newErrors.state = 'State is required';
        if (!district)
            newErrors.district = 'District is required';
        if (!city)
            newErrors.city = 'City is required';
        // Pincode validation: 6-digits Indian pincode
        if (!pincode) {
            newErrors.pincode = 'Pincode is required';
        }
        else if (!/^\d{6}$/.test(pincode)) {
            newErrors.pincode = 'Must be a valid 6-digit Indian pincode';
        }
        if (!board)
            newErrors.board = 'Education Board is required';
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid official email address';
        }
        if (formData.branch_head_email.trim() && !emailRegex.test(formData.branch_head_email.trim())) {
            newErrors.branch_head_email = 'Please enter a valid branch head email address';
        }
        // Phone validation
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
        if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid phone number (e.g. +91 44 2619 4500)';
        }
        if (formData.branch_head_mobile.trim() && !phoneRegex.test(formData.branch_head_mobile.trim())) {
            newErrors.branch_head_mobile = 'Please enter a valid mobile number';
        }
        // Website validation
        if (formData.website.trim()) {
            try {
                const url = new URL(formData.website.trim().startsWith('http')
                    ? formData.website.trim()
                    : `https://${formData.website.trim()}`);
                if (!url.hostname)
                    newErrors.website = 'Please enter a valid website URL';
            }
            catch {
                newErrors.website = 'Please enter a valid website URL (e.g. https://greenparkschool.edu.in)';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Check if mandatory fields are valid to enable Save button
    const isFormValid = () => {
        const nameValid = !!formData.branch_name.trim();
        const codeValid = !!formData.branch_code.trim();
        const addressValid = !!formData.address_line_1.trim();
        const countryValid = !!formData.country.trim();
        const stateValid = !!formData.state.trim();
        const districtValid = !!formData.district.trim();
        const cityValid = !!formData.city.trim();
        const pincodeValid = /^\d{6}$/.test(formData.pincode.trim());
        const boardValid = !!formData.board;
        const typeValid = !!formData.branch_type;
        const statusValid = !!formData.status;
        return (nameValid &&
            codeValid &&
            addressValid &&
            countryValid &&
            stateValid &&
            districtValid &&
            cityValid &&
            pincodeValid &&
            boardValid &&
            typeValid &&
            statusValid);
    };
    // Section completion check indicators
    const isSectionAComplete = !!formData.branch_name.trim() && !!formData.branch_code.trim();
    const isSectionBComplete = !!formData.address_line_1.trim() &&
        !!formData.city.trim() &&
        /^\d{6}$/.test(formData.pincode.trim());
    const isSectionEComplete = !!formData.board;
    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting)
            return;
        setServerError(null);
        // Mark all as touched
        const allTouched = {};
        Object.keys(formData).forEach((k) => (allTouched[k] = true));
        setTouched(allTouched);
        if (!validateForm()) {
            // Switch to first tab with error
            if (errors.branch_name || errors.branch_code || errors.branch_type) {
                setActiveTab('A');
            }
            else if (errors.address_line_1 || errors.city || errors.pincode || errors.state || errors.district) {
                setActiveTab('B');
            }
            else if (errors.phone || errors.email || errors.website) {
                setActiveTab('C');
            }
            else if (errors.branch_head_mobile || errors.branch_head_email) {
                setActiveTab('D');
            }
            else if (errors.board) {
                setActiveTab('E');
            }
            return;
        }
        setIsSubmitting(true);
        try {
            // Trim all string inputs
            const payload = {
                ...formData,
                branch_name: formData.branch_name.trim(),
                branch_code: formData.branch_code.trim().toUpperCase(),
                short_name: formData.short_name.trim(),
                address_line_1: formData.address_line_1.trim(),
                address_line_2: formData.address_line_2.trim(),
                city: formData.city.trim(),
                pincode: formData.pincode.trim(),
                phone: formData.phone.trim(),
                alternative_phone: formData.alternative_phone.trim(),
                email: formData.email.trim(),
                website: formData.website.trim(),
                branch_head_name: formData.branch_head_name.trim(),
                branch_head_mobile: formData.branch_head_mobile.trim(),
                branch_head_email: formData.branch_head_email.trim(),
                udise_code: formData.udise_code.trim(),
                affiliation_number: formData.affiliation_number.trim()
            };
            const url = isEdit ? `/api/branches/${branchToEdit.id}` : '/api/branches';
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                }
                throw new Error(data.message || 'Failed to save branch information');
            }
            onSuccess(data.data, isEdit);
        }
        catch (err) {
            console.error('Error saving branch:', err);
            setServerError(err.message || 'An unexpected error occurred while saving.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!isOpen)
        return null;
    // Generate years for Established Year selector (e.g. 1950 to current year)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1947 + 1 }, (_, i) => currentYear - i);
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5"/>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {isEdit ? `Edit Branch: ${branchToEdit?.branch_name}` : 'Add New Branch'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isEdit
            ? 'Update campus configuration and administrative records'
            : 'Create a new school campus under the organization'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200/60 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Global Server Error Banner */}
        {serverError && (<div className="mx-6 mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"/>
            <div>
              <p className="font-semibold">{serverError}</p>
            </div>
          </div>)}

        {/* Section Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex overflow-x-auto gap-2 py-2.5 shrink-0 scrollbar-none">
          <button type="button" onClick={() => setActiveTab('A')} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === 'A'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Building2 className="w-3.5 h-3.5"/>
            <span>Section A – Basic Info</span>
            {isSectionAComplete && <Check className={`w-3.5 h-3.5 ${activeTab === 'A' ? 'text-emerald-200' : 'text-emerald-600'}`}/>}
          </button>

          <button type="button" onClick={() => setActiveTab('B')} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === 'B'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <MapPin className="w-3.5 h-3.5"/>
            <span>Section B – Address</span>
            {isSectionBComplete && <Check className={`w-3.5 h-3.5 ${activeTab === 'B' ? 'text-emerald-200' : 'text-emerald-600'}`}/>}
          </button>

          <button type="button" onClick={() => setActiveTab('C')} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === 'C'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Phone className="w-3.5 h-3.5"/>
            <span>Section C – Contact</span>
          </button>

          <button type="button" onClick={() => setActiveTab('D')} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === 'D'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <User className="w-3.5 h-3.5"/>
            <span>Section D – Branch Head</span>
          </button>

          <button type="button" onClick={() => setActiveTab('E')} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === 'E'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <GraduationCap className="w-3.5 h-3.5"/>
            <span>Section E – School Details</span>
            {isSectionEComplete && <Check className={`w-3.5 h-3.5 ${activeTab === 'E' ? 'text-emerald-200' : 'text-emerald-600'}`}/>}
          </button>
        </div>

        {/* Form Body Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION A – BASIC INFORMATION */}
          {activeTab === 'A' && (<div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <span>Section A – Basic Information</span>
                  <span className="text-[11px] font-normal text-slate-500">(* indicates required field)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch Name * */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Name <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" id="input-branch-name" value={formData.branch_name} onChange={(e) => handleChange('branch_name', e.target.value)} placeholder="e.g. Green Park Main Campus" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.branch_name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.branch_name && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.branch_name}</span>
                    </p>)}
                </div>

                {/* Branch Code * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Code <span className="text-rose-500">*</span>
                    <span className="text-[11px] text-slate-500 font-normal ml-1">(Unique, auto uppercase)</span>
                  </label>
                  <input type="text" id="input-branch-code" value={formData.branch_code} onChange={(e) => handleChange('branch_code', e.target.value)} placeholder="e.g. GPC001" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-mono uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.branch_code ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.branch_code ? (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.branch_code}</span>
                    </p>) : (<p className="mt-1 text-[11px] text-slate-500">
                      System unique identifier across organizations
                    </p>)}
                </div>

                {/* Branch Short Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Short Name
                  </label>
                  <input type="text" id="input-branch-short-name" value={formData.short_name} onChange={(e) => handleChange('short_name', e.target.value)} placeholder="e.g. GPC Main" className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"/>
                  <p className="mt-1 text-[11px] text-slate-500">Compact name for report cards & tabs</p>
                </div>

                {/* Branch Type * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Type <span className="text-rose-500">*</span>
                  </label>
                  <select id="select-branch-type" value={formData.branch_type} onChange={(e) => handleChange('branch_type', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    {BRANCH_TYPES.map((type) => (<option key={type} value={type}>
                        {type}
                      </option>))}
                  </select>
                </div>

                {/* Branch Status * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Status <span className="text-rose-500">*</span>
                  </label>
                  <select id="select-branch-status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <p className="mt-1 text-[11px] text-slate-500">Default: Active</p>
                </div>

                {/* Branch Logo Upload */}
                <div className="md:col-span-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Branch Logo
                    <span className="text-[11px] text-slate-500 font-normal ml-1">
                      (JPG, JPEG, PNG, WEBP — Max 3MB)
                    </span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    {formData.logo ? (<div className="relative group shrink-0">
                        <img src={formData.logo} alt="Branch Logo Preview" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-xs bg-white" referrerPolicy="no-referrer"/>
                        <button type="button" onClick={handleRemoveLogo} className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full shadow-xs hover:bg-rose-700 transition-colors" title="Remove logo">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>) : (<div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-8 h-8 text-slate-300"/>
                      </div>)}

                    <div className="flex-1">
                      <input ref={fileInputRef} type="file" id="branch-logo-file-input" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleLogoUpload} className="hidden"/>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 active:bg-slate-200 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 text-emerald-700"/>
                        <span>{formData.logo ? 'Change Logo' : 'Upload Campus Logo'}</span>
                      </button>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Will appear on student report cards, fee receipts, and official letterheads.
                      </p>
                      {errors.logo && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5"/>
                          <span>{errors.logo}</span>
                        </p>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>)}

          {/* SECTION B – BRANCH ADDRESS */}
          {activeTab === 'B' && (<div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <span>Section B – Branch Address</span>
                  <span className="text-[11px] font-normal text-slate-500">(* indicates required field)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address Line 1 * */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address Line 1 <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" id="input-address-line-1" value={formData.address_line_1} onChange={(e) => handleChange('address_line_1', e.target.value)} placeholder="e.g. 124, Rajaji Avenue, Anna Nagar East" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.address_line_1 ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.address_line_1 && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.address_line_1}</span>
                    </p>)}
                </div>

                {/* Address Line 2 */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address Line 2
                  </label>
                  <input type="text" id="input-address-line-2" value={formData.address_line_2} onChange={(e) => handleChange('address_line_2', e.target.value)} placeholder="e.g. Near Central Park Ring, Landmark" className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"/>
                </div>

                {/* Country * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <select id="select-country" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    <option value="India">India</option>
                  </select>
                </div>

                {/* State * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select id="select-state" value={formData.state} onChange={(e) => handleStateChange(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (<option key={st} value={st}>
                        {st}
                      </option>))}
                  </select>
                </div>

                {/* District * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <select id="select-district" value={formData.district} onChange={(e) => handleChange('district', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    {currentDistricts.map((dist) => (<option key={dist} value={dist}>
                        {dist}
                      </option>))}
                  </select>
                </div>

                {/* City * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" id="input-city" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="e.g. Chennai" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.city && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.city}</span>
                    </p>)}
                </div>

                {/* Pincode * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pincode <span className="text-rose-500">*</span>
                    <span className="text-[11px] text-slate-500 font-normal ml-1">(6 digits)</span>
                  </label>
                  <input type="text" id="input-pincode" maxLength={6} value={formData.pincode} onChange={(e) => handleChange('pincode', e.target.value)} placeholder="e.g. 600102" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.pincode && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.pincode}</span>
                    </p>)}
                </div>
              </div>
            </div>)}

          {/* SECTION C – CONTACT INFORMATION */}
          {activeTab === 'C' && (<div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Section C – Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Official Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Phone Number
                  </label>
                  <input type="text" id="input-official-phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="e.g. +91 44 2619 4500" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.phone && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.phone}</span>
                    </p>)}
                </div>

                {/* Alternative Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alternative Phone Number
                  </label>
                  <input type="text" id="input-alternative-phone" value={formData.alternative_phone} onChange={(e) => handleChange('alternative_phone', e.target.value)} placeholder="e.g. +91 44 2619 4501" className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"/>
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input type="email" id="input-official-email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="e.g. info.main@greenparkschool.edu.in" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.email && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.email}</span>
                    </p>)}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website URL
                  </label>
                  <input type="text" id="input-website-url" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} placeholder="e.g. https://greenparkschool.edu.in" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.website ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.website && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.website}</span>
                    </p>)}
                </div>
              </div>
            </div>)}

          {/* SECTION D – BRANCH HEAD */}
          {activeTab === 'D' && (<div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Section D – Branch Head
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch Head Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Head Name
                  </label>
                  <input type="text" id="input-branch-head-name" value={formData.branch_head_name} onChange={(e) => handleChange('branch_head_name', e.target.value)} placeholder="e.g. Dr. Rajeshwari Sundaram" className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"/>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <select id="select-branch-head-designation" value={formData.branch_head_designation} onChange={(e) => handleChange('branch_head_designation', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    {BRANCH_HEAD_DESIGNATIONS.map((des) => (<option key={des} value={des}>
                        {des}
                      </option>))}
                  </select>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input type="text" id="input-branch-head-mobile" value={formData.branch_head_mobile} onChange={(e) => handleChange('branch_head_mobile', e.target.value)} placeholder="e.g. +91 98401 23456" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.branch_head_mobile ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.branch_head_mobile && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.branch_head_mobile}</span>
                    </p>)}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input type="email" id="input-branch-head-email" value={formData.branch_head_email} onChange={(e) => handleChange('branch_head_email', e.target.value)} placeholder="e.g. principal.gpc@greenparkschool.edu.in" className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${errors.branch_head_email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}/>
                  {errors.branch_head_email && (<p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5"/>
                      <span>{errors.branch_head_email}</span>
                    </p>)}
                </div>
              </div>
            </div>)}

          {/* SECTION E – SCHOOL DETAILS */}
          {activeTab === 'E' && (<div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <span>Section E – School Details</span>
                  <span className="text-[11px] font-normal text-slate-500">(* indicates required field)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education Board * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Education Board <span className="text-rose-500">*</span>
                  </label>
                  <select id="select-education-board" value={formData.board} onChange={(e) => handleChange('board', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    {EDUCATION_BOARDS.map((board) => (<option key={board} value={board}>
                        {board}
                      </option>))}
                  </select>
                </div>

                {/* Medium of Instruction */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medium of Instruction
                  </label>
                  <select id="select-medium" value={formData.medium} onChange={(e) => handleChange('medium', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    {MEDIUMS.map((med) => (<option key={med} value={med}>
                        {med}
                      </option>))}
                  </select>
                </div>

                {/* School Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    School Type
                  </label>
                  <select id="select-school-type" value={formData.school_type} onChange={(e) => handleChange('school_type', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    {SCHOOL_TYPES.map((st) => (<option key={st} value={st}>
                        {st}
                      </option>))}
                  </select>
                </div>

                {/* Established Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Established Year
                  </label>
                  <select id="select-established-year" value={formData.established_year} onChange={(e) => handleChange('established_year', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer">
                    <option value="">Select Established Year</option>
                    {yearOptions.map((yr) => (<option key={yr} value={yr}>
                        {yr}
                      </option>))}
                  </select>
                </div>

                {/* UDISE Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UDISE Code
                  </label>
                  <input type="text" id="input-udise-code" value={formData.udise_code} onChange={(e) => handleChange('udise_code', e.target.value)} placeholder="e.g. 33020104501" className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"/>
                  <p className="mt-1 text-[11px] text-slate-500">Unified District Info System for Education code</p>
                </div>

                {/* Affiliation Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Affiliation Number
                  </label>
                  <input type="text" id="input-affiliation-number" value={formData.affiliation_number} onChange={(e) => handleChange('affiliation_number', e.target.value)} placeholder="e.g. CBSE-TN-1930482" className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"/>
                </div>
              </div>
            </div>)}
        </form>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            {!isFormValid() ? (<span className="text-amber-700 flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-amber-600"/>
                <span>Fill mandatory fields (* Name, Code, Address, City, Pincode) to enable Save.</span>
              </span>) : (<span className="text-emerald-700 flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-600"/>
                <span>All mandatory validations met.</span>
              </span>)}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer">
              Cancel
            </button>

            <button type="button" id="save-branch-btn" onClick={handleSubmit} disabled={!isFormValid() || isSubmitting} className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white shadow-xs transition-all flex items-center space-x-2 ${!isFormValid() || isSubmitting
            ? 'bg-slate-400 cursor-not-allowed opacity-60'
            : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 cursor-pointer shadow-md'}`}>
              {isSubmitting ? (<>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Saving Branch...</span>
                </>) : (<span>Save Branch</span>)}
            </button>
          </div>
        </div>
      </div>
    </div>);
};
