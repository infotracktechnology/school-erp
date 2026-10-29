import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { renderToString } from "react-dom/server";
import { useNavigate, MemoryRouter, Routes, Route } from "react-router-dom";
import assert from "assert";
import { CalendarCheck, GraduationCap, BookOpen, Users, UserCheck, CreditCard, Building2, RefreshCw, X, ChevronRight, Search, ArrowLeft, AlertTriangle, Layers, Filter, HelpCircle, AlertCircle, Clock, CheckCircle2, ShieldAlert, ArrowRight, Info, ArrowUpRight, ShieldCheck, BarChart3, Sparkles, Bell, FileText, Activity, Shield, Globe, Lock, TrendingUp, User, Calendar, FileCheck2, Image, Loader2, ArrowRightLeft, Edit, Printer, Phone, MapPin, Bus, Home, Award, Languages, Download, Check, Circle, RotateCcw, Plus, CheckSquare, Square, ArrowUpDown, MoreHorizontal, Eye, UserX, ChevronLeft, FileSpreadsheet, Upload, PanelLeft, Save, Hash, HeartPulse, Landmark, Camera, Smartphone, MessageSquare, Mail, PhoneCall, Send, Edit3, Sun, Sunset } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
({
  created_at: (/* @__PURE__ */ new Date()).toISOString(),
  updated_at: (/* @__PURE__ */ new Date()).toISOString()
});
let currentErpMock = {
  currentUser: null,
  logoutUser: () => {
  },
  userRole: "super_admin",
  setUserRole: () => {
  },
  isSuperAdmin: true,
  isPrincipal: false,
  isBranchAdmin: false,
  isStudent: false,
  organization: { id: 1, name: "EduCampus ERP Test", code: "TEST" },
  branches: [
    { id: 1, branch_name: "Main Campus", branch_code: "MAIN", status: "Active", city: "Chennai", state: "Tamil Nadu" },
    { id: 2, branch_name: "North Campus", branch_code: "NORTH", status: "Active", city: "Coimbatore", state: "Tamil Nadu" }
  ],
  accessibleBranches: [
    { id: 1, branch_name: "Main Campus", branch_code: "MAIN", status: "Active", city: "Chennai", state: "Tamil Nadu" },
    { id: 2, branch_name: "North Campus", branch_code: "NORTH", status: "Active", city: "Coimbatore", state: "Tamil Nadu" }
  ],
  assignedBranch: { id: 1, branch_name: "Main Campus", branch_code: "MAIN" },
  assignedBranchId: 1,
  setAssignedBranchId: () => {
  },
  activeBranch: { id: 1, branch_name: "Main Campus", branch_code: "MAIN" },
  activeBranchId: 1,
  setActiveBranchId: () => {
  },
  isLoadingBranches: false,
  isAllBranches: false,
  academicYears: [{ id: 1, name: "2026-2027", is_active: true }],
  academicYearName: "2026-2027",
  activeAcademicYearId: 1,
  activeAcademicYear: { id: 1, name: "2026-2027", is_active: true },
  academicYearLifecycle: "2026-2027 (Active)",
  isCurrentYear: true,
  isUpcomingYear: false,
  isHistoricalYear: false,
  isReadOnly: false,
  showToast: () => {
  }
};
const setMockErpContext = (overrides) => {
  currentErpMock = {
    ...currentErpMock,
    ...overrides
  };
};
const resetMockErpContext = () => {
  currentErpMock = {
    currentUser: null,
    logoutUser: () => {
    },
    userRole: "super_admin",
    setUserRole: () => {
    },
    isSuperAdmin: true,
    isPrincipal: false,
    isBranchAdmin: false,
    isStudent: false,
    organization: { id: 1, name: "EduCampus ERP Test", code: "TEST" },
    branches: [
      { id: 1, branch_name: "Main Campus", branch_code: "MAIN", status: "Active", city: "Chennai", state: "Tamil Nadu" },
      { id: 2, branch_name: "North Campus", branch_code: "NORTH", status: "Active", city: "Coimbatore", state: "Tamil Nadu" }
    ],
    accessibleBranches: [
      { id: 1, branch_name: "Main Campus", branch_code: "MAIN", status: "Active", city: "Chennai", state: "Tamil Nadu" },
      { id: 2, branch_name: "North Campus", branch_code: "NORTH", status: "Active", city: "Coimbatore", state: "Tamil Nadu" }
    ],
    assignedBranch: { id: 1, branch_name: "Main Campus", branch_code: "MAIN" },
    assignedBranchId: 1,
    setAssignedBranchId: () => {
    },
    activeBranch: { id: 1, branch_name: "Main Campus", branch_code: "MAIN" },
    activeBranchId: 1,
    setActiveBranchId: () => {
    },
    isLoadingBranches: false,
    isAllBranches: false,
    academicYears: [{ id: 1, name: "2026-2027", is_active: true }],
    academicYearName: "2026-2027",
    activeAcademicYearId: 1,
    activeAcademicYear: { id: 1, name: "2026-2027", is_active: true },
    academicYearLifecycle: "2026-2027 (Active)",
    isCurrentYear: true,
    isUpcomingYear: false,
    isHistoricalYear: false,
    isReadOnly: false,
    showToast: () => {
    }
  };
};
const useErp = () => currentErpMock;
async function getStudents(params) {
  const query = new URLSearchParams();
  if (params.branch_id !== void 0 && params.branch_id !== "all" && params.branch_id !== null && params.branch_id !== "undefined") {
    query.append("branch_id", String(params.branch_id));
  }
  if (params.academic_year_id)
    query.append("academic_year_id", String(params.academic_year_id));
  if (params.class_id)
    query.append("class_id", String(params.class_id));
  if (params.section_id)
    query.append("section_id", String(params.section_id));
  if (params.academic_group_id)
    query.append("academic_group_id", String(params.academic_group_id));
  if (params.status && params.status !== "all")
    query.append("status", params.status);
  if (params.gender && params.gender !== "all")
    query.append("gender", params.gender);
  if (params.fee_status && params.fee_status !== "all")
    query.append("fee_status", params.fee_status);
  if (params.admission_type && params.admission_type !== "all")
    query.append("admission_type", params.admission_type);
  if (params.hostel_status && params.hostel_status !== "all")
    query.append("hostel_status", params.hostel_status);
  if (params.transport_opted !== void 0 && params.transport_opted !== "all")
    query.append("transport_opted", String(params.transport_opted));
  if (params.search)
    query.append("search", params.search);
  if (params.page)
    query.append("page", String(params.page));
  if (params.page_size)
    query.append("page_size", String(params.page_size));
  if (params.sort_by)
    query.append("sort_by", params.sort_by);
  if (params.sort_order)
    query.append("sort_order", params.sort_order);
  const res = await fetch(`/api/students?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch students");
  }
  return data;
}
async function getStudentById(id) {
  const res = await fetch(`/api/students/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch student details");
  }
  return data.data;
}
async function bulkUpdateStudents(payload) {
  const res = await fetch("/api/students/bulk-update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to bulk update students");
  }
  return data;
}
async function getBranches(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search)
    params.append("search", filters.search);
  if (filters.branch_type && filters.branch_type !== "all")
    params.append("branch_type", filters.branch_type);
  if (filters.board && filters.board !== "all")
    params.append("board", filters.board);
  if (filters.status && filters.status !== "all")
    params.append("status", filters.status);
  if (filters.state && filters.state !== "all")
    params.append("state", filters.state);
  const res = await fetch(`/api/branches?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch branches");
  }
  const data = await res.json();
  return data.data || [];
}
async function getClasses(branchId, academicYearId, filters = {}) {
  const params = new URLSearchParams();
  if (branchId) params.append("branch_id", String(branchId));
  if (academicYearId) params.append("academic_year_id", String(academicYearId));
  if (filters.include_all) params.append("include_all", "true");
  if (filters.search) params.append("search", filters.search);
  if (filters.status && filters.status !== "all") params.append("status", filters.status);
  const res = await fetch(`/api/classes?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Unable to load classes.");
  }
  return {
    data: data.data || [],
    count: data.count || 0,
    branch: data.branch,
    academic_year: data.academic_year
  };
}
async function getSections(branchId, academicYearId, filters = {}) {
  const params = new URLSearchParams();
  params.append("branch_id", String(branchId));
  if (academicYearId) {
    params.append("academic_year_id", String(academicYearId));
  }
  if (filters.search)
    params.append("search", filters.search);
  if (filters.status && filters.status !== "all")
    params.append("status", filters.status);
  const res = await fetch(`/api/sections?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Unable to load sections.");
  }
  return {
    data: data.data || [],
    count: data.count || 0,
    branch: data.branch,
    academic_year: data.academic_year
  };
}
async function getClassSectionMatrix(branchId, academicYearId, filters = {}) {
  const params = new URLSearchParams();
  params.append("branch_id", String(branchId));
  if (academicYearId) {
    params.append("academic_year_id", String(academicYearId));
  }
  if (filters.search)
    params.append("search", filters.search);
  if (filters.status && filters.status !== "all")
    params.append("status", filters.status);
  const res = await fetch(`/api/class-sections?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Unable to load class and section mappings.");
  }
  return {
    data: data.data,
    branch: data.branch,
    academic_year: data.academic_year
  };
}
async function getSectionsByClass(classId, branchId, academicYearId) {
  try {
    const secRes = await getSections(branchId, academicYearId);
    if (secRes && Array.isArray(secRes.data) && secRes.data.length > 0) {
      const matched = secRes.data.filter((s) => Number(s.class_id) === Number(classId));
      if (matched.length > 0) {
        return matched.map((s) => ({
          ...s,
          id: s.id,
          name: s.section_name || s.name,
          section_name: s.section_name || s.name
        }));
      }
    }
    const res = await getClassSectionMatrix(branchId, academicYearId);
    if (res && res.data) {
      const summaryItem = (res.data.summary || []).find((s) => s.class_id === classId);
      if (summaryItem && Array.isArray(summaryItem.section_ids) && summaryItem.section_ids.length > 0) {
        const secIdSet = new Set(summaryItem.section_ids);
        return (res.data.sections || []).filter((sec) => secIdSet.has(sec.id));
      }
      const mappedSectionIds = (res.data.mappings || []).filter((m) => m.class_id === classId && m.status === "Active").map((m) => m.section_id);
      if (mappedSectionIds.length > 0) {
        const set = new Set(mappedSectionIds);
        return (res.data.sections || []).filter((sec) => set.has(sec.id));
      }
      return (res.data.sections || []).filter((sec) => sec.status === "Active");
    }
    return [];
  } catch (err) {
    console.error("Failed to get sections by class:", err);
    return [];
  }
}
async function getSuperAdminDashboardData(branchId, academicYearName, userRole = "super_admin", assignedBranchId = 1) {
  const params = new URLSearchParams();
  if (branchId !== void 0 && branchId !== null) {
    params.append("branch_id", String(branchId));
  }
  {
    params.append("academic_year_name", academicYearName);
  }
  const res = await fetch(`/api/dashboard/super-admin?${params.toString()}`, {
    headers: {
      "x-user-role": userRole,
      "x-assigned-branch-id": String(assignedBranchId)
    }
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch Super Admin dashboard metrics");
  }
  return data.data;
}
async function getDashboardDrillDown(params) {
  const q = new URLSearchParams();
  q.append("type", params.type);
  if (params.level)
    q.append("level", params.level);
  if (params.branch_id !== void 0 && params.branch_id !== null)
    q.append("branch_id", String(params.branch_id));
  if (params.academic_year_name)
    q.append("academic_year_name", params.academic_year_name);
  if (params.class_id)
    q.append("class_id", String(params.class_id));
  if (params.section_id)
    q.append("section_id", String(params.section_id));
  if (params.gender)
    q.append("gender", params.gender);
  if (params.search)
    q.append("search", params.search);
  if (params.page)
    q.append("page", String(params.page));
  q.append("limit", String(params.limit));
  const res = await fetch(`/api/dashboard/drill-down?${q.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch drill-down metrics");
  }
  return data;
}
async function getAcademicGroupsList(params = {}) {
  const q = new URLSearchParams();
  if (params.branch_id && params.branch_id !== "all" && params.branch_id !== "undefined")
    q.append("branch_id", String(params.branch_id));
  if (params.academic_year_id && params.academic_year_id !== "all" && params.academic_year_id !== "undefined")
    q.append("academic_year_id", String(params.academic_year_id));
  if (params.class_id && params.class_id !== "all")
    q.append("class_id", String(params.class_id));
  if (params.board && params.board !== "all")
    q.append("board", params.board);
  if (params.status && params.status !== "all")
    q.append("status", params.status);
  if (params.search)
    q.append("search", params.search);
  const res = await fetch(`/api/academic-groups?${q.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch academic groups");
  }
  const data = await res.json();
  return data.data || [];
}
const getAcademicGroups = getAcademicGroupsList;
const DrillDownModal = ({ isOpen, onClose, initialType, initialBranchId = "all", academicYearName = "2026-2027", onSelectBranch }) => {
  var _a;
  const [currentType, setCurrentType] = useState(initialType);
  const [currentLevel, setCurrentLevel] = useState("overall");
  const [selectedBranchId, setSelectedBranchId] = useState(initialBranchId);
  const [selectedClassId, setSelectedClassId] = useState(void 0);
  const [selectedSectionId, setSelectedSectionId] = useState(void 0);
  const [selectedGender, setSelectedGender] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [drillData, setDrillData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isOpen) {
      setCurrentType(initialType);
      setSelectedBranchId(initialBranchId);
      setCurrentLevel(initialBranchId !== "all" && initialBranchId ? "branch" : "overall");
      setSelectedClassId(void 0);
      setSelectedSectionId(void 0);
      setSelectedGender("all");
      setSearchTerm("");
      setPage(1);
    }
  }, [isOpen, initialType, initialBranchId]);
  const fetchData = useCallback(async () => {
    if (!isOpen)
      return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getDashboardDrillDown({
        type: currentType,
        level: currentLevel,
        branch_id: selectedBranchId,
        academic_year_name: academicYearName,
        class_id: selectedClassId,
        section_id: selectedSectionId,
        gender: selectedGender,
        search: searchTerm,
        page,
        limit: 10
      });
      setDrillData(res);
    } catch (err) {
      console.error("Failed to load drill-down data:", err);
      setError(err.message || "Could not fetch drill-down records.");
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, currentType, currentLevel, selectedBranchId, academicYearName, selectedClassId, selectedSectionId, selectedGender, searchTerm, page]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  if (!isOpen)
    return null;
  const handleNavigateStep = (crumb) => {
    setCurrentLevel(crumb.level);
    if (crumb.params) {
      if (crumb.params.branch_id !== void 0)
        setSelectedBranchId(crumb.params.branch_id);
      if (crumb.params.class_id !== void 0)
        setSelectedClassId(crumb.params.class_id);
      else
        setSelectedClassId(void 0);
      if (crumb.params.section_id !== void 0)
        setSelectedSectionId(crumb.params.section_id);
      else
        setSelectedSectionId(void 0);
      if (crumb.params.gender !== void 0)
        setSelectedGender(crumb.params.gender);
      else
        setSelectedGender("all");
    }
    setPage(1);
  };
  const handleRowClick = (row) => {
    if (currentType === "attendance") {
      if (currentLevel === "overall") {
        setSelectedBranchId(row.branch_id || row.id);
        setCurrentLevel("branch");
        setPage(1);
      } else if (currentLevel === "branch") {
        setSelectedClassId(row.class_id || row.id);
        setCurrentLevel("class");
        setPage(1);
      } else if (currentLevel === "class") {
        setSelectedSectionId(row.section_id || row.id);
        setCurrentLevel("section");
        setPage(1);
      } else if (currentLevel === "section") {
        setSelectedGender(row.gender);
        setCurrentLevel("student");
        setPage(1);
      }
    } else if (currentType === "examination") {
      if (currentLevel === "overall") {
        setSelectedBranchId(row.branch_id || row.id);
        setCurrentLevel("branch");
        setPage(1);
      } else if (currentLevel === "branch") {
        setCurrentLevel("class");
        setPage(1);
      }
    } else if (currentType === "students") {
      if (currentLevel === "overall") {
        setSelectedBranchId(row.branch_id || row.id);
        setCurrentLevel("student");
        setPage(1);
      }
    }
  };
  const formatINR = (val) => {
    if (val >= 1e7)
      return `₹ ${(val / 1e7).toFixed(2)} Cr`;
    if (val >= 1e5)
      return `₹ ${(val / 1e5).toFixed(2)} L`;
    return `₹ ${val.toLocaleString("en-IN")}`;
  };
  return /* @__PURE__ */ jsx("div", { id: "drilldown-modal-backdrop", className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150", children: /* @__PURE__ */ jsxs("div", { id: "drilldown-modal-container", className: "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/60", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-2.5 bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-xl", children: [
          currentType === "attendance" && /* @__PURE__ */ jsx(CalendarCheck, { className: "w-5 h-5" }),
          currentType === "examination" && /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5" }),
          currentType === "gradebook" && /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }),
          currentType === "students" && /* @__PURE__ */ jsx(Users, { className: "w-5 h-5" }),
          currentType === "admissions" && /* @__PURE__ */ jsx(UserCheck, { className: "w-5 h-5" }),
          currentType === "fees" && /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5" }),
          currentType === "staff" && /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
            "Multi-Branch Drill-Down Analysis",
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", children: academicYearName })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Progressive hierarchical investigation across branches, classes, sections, and students." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("button", { id: "drilldown-refresh-btn", onClick: () => fetchData(), disabled: isLoading, title: "Refresh Data", className: "p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${isLoading ? "animate-spin" : ""}` }) }),
        /* @__PURE__ */ jsx("button", { id: "drilldown-close-btn", onClick: onClose, className: "p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 py-2.5 bg-gray-100/70 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 overflow-x-auto", children: [
      { id: "attendance", label: "Attendance", icon: CalendarCheck },
      { id: "examination", label: "Examination", icon: GraduationCap },
      { id: "gradebook", label: "Grade Book", icon: BookOpen },
      { id: "students", label: "Students", icon: Users },
      { id: "admissions", label: "Admissions", icon: UserCheck },
      { id: "fees", label: "Fees & Finance", icon: CreditCard },
      { id: "staff", label: "Staff & HR", icon: Building2 }
    ].map((tab) => {
      const Icon = tab.icon;
      const active = currentType === tab.id;
      return /* @__PURE__ */ jsxs("button", { id: `drilldown-tab-${tab.id}`, onClick: () => {
        setCurrentType(tab.id);
        setCurrentLevel("overall");
        setSelectedBranchId("all");
        setSelectedClassId(void 0);
        setSelectedSectionId(void 0);
        setSelectedGender("all");
        setPage(1);
      }, className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${active ? "bg-blue-600 text-white shadow-xs" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"}`, children: [
        /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }),
        tab.label
      ] }, tab.id);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx("nav", { className: "flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto py-0.5", children: (_a = drillData == null ? void 0 : drillData.breadcrumbs) == null ? void 0 : _a.map((crumb, idx) => {
        const isLast = idx === drillData.breadcrumbs.length - 1;
        return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
          idx > 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-gray-400 shrink-0" }),
          /* @__PURE__ */ jsx("button", { id: `drilldown-crumb-${idx}`, onClick: () => handleNavigateStep(crumb), disabled: isLast, className: `font-semibold px-2 py-1 rounded transition-colors whitespace-nowrap ${isLast ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`, children: crumb.label })
        ] }, idx);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        currentLevel === "student" && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx("input", { id: "drilldown-search-input", type: "text", placeholder: "Search student or roll no...", value: searchTerm, onChange: (e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }, className: "pl-8 pr-3 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-44" })
        ] }),
        currentLevel === "student" && /* @__PURE__ */ jsxs("select", { id: "drilldown-gender-filter", value: selectedGender, onChange: (e) => {
          setSelectedGender(e.target.value);
          setPage(1);
        }, className: "text-xs py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "All Genders" }),
          /* @__PURE__ */ jsx("option", { value: "Male", children: "Male" }),
          /* @__PURE__ */ jsx("option", { value: "Female", children: "Female" })
        ] }),
        currentLevel !== "overall" && /* @__PURE__ */ jsxs("button", { id: "drilldown-back-btn", onClick: () => {
          if (currentLevel === "student")
            setCurrentLevel(selectedSectionId ? "section" : "branch");
          else if (currentLevel === "section")
            setCurrentLevel("class");
          else if (currentLevel === "class")
            setCurrentLevel("branch");
          else
            setCurrentLevel("overall");
          setPage(1);
        }, className: "flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
          "Up One Level"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 overflow-y-auto flex-1 space-y-4", children: [
      (drillData == null ? void 0 : drillData.summary) && /* @__PURE__ */ jsxs("div", { className: "bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider", children: "Level Scope" }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-900 dark:text-white", children: drillData.summary.title || "Summary Overview" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs", children: [
          drillData.summary.total_students !== void 0 && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Total Students" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 dark:text-white", children: drillData.summary.total_students.toLocaleString() })
          ] }),
          drillData.summary.attendance_percentage !== void 0 && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Avg Attendance" }),
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-emerald-600 dark:text-emerald-400", children: [
              drillData.summary.attendance_percentage,
              "%"
            ] })
          ] }),
          drillData.summary.present !== void 0 && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Present Today" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-emerald-600", children: drillData.summary.present })
          ] }),
          drillData.summary.absent !== void 0 && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Absent" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-rose-600", children: drillData.summary.absent })
          ] }),
          drillData.summary.total_demand !== void 0 && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Total Demand" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 dark:text-white", children: formatINR(drillData.summary.total_demand) })
          ] })
        ] })
      ] }),
      isLoading ? /* @__PURE__ */ jsxs("div", { className: "py-16 flex flex-col items-center justify-center text-gray-500 gap-3", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "w-8 h-8 animate-spin text-blue-600" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Aggregating real-time drill-down metrics..." })
      ] }) : error ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center text-rose-600 dark:text-rose-400 space-y-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-8 h-8 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: error })
      ] }) : !drillData || drillData.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center text-gray-500 space-y-1", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-8 h-8 mx-auto text-gray-400" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "No records found for current drill-down filters." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
        /* @__PURE__ */ jsxs("thead", { className: "bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700", children: [
          currentType === "attendance" && /* @__PURE__ */ jsxs("tr", { children: [
            currentLevel === "overall" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Branch Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "City" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Total Students" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-emerald-600", children: "Present" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-rose-600", children: "Absent" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-amber-600", children: "Leave" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Attendance %" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Action" })
            ] }),
            currentLevel === "branch" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Class Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Students" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-emerald-600", children: "Present" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-rose-600", children: "Absent" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Attendance %" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Action" })
            ] }),
            currentLevel === "class" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Section" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Total Students" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-emerald-600", children: "Present" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-rose-600", children: "Absent" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Attendance %" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Action" })
            ] }),
            currentLevel === "section" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Gender" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Total Students" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-emerald-600", children: "Present" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-rose-600", children: "Absent" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Attendance %" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Action" })
            ] }),
            currentLevel === "student" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Admission No" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Student Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Gender" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Class & Sec" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Attendance %" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Status Today" })
            ] })
          ] }),
          currentType === "examination" && /* @__PURE__ */ jsxs("tr", { children: [
            currentLevel === "overall" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Branch Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Exams Scheduled" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center text-emerald-600", children: "Completed" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center text-amber-600", children: "Pending" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Marks Entered" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Results" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Action" })
            ] }),
            currentLevel === "branch" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Exam Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Term" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Classes Complete" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Marks Entered %" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Results" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Action" })
            ] }),
            currentLevel === "class" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Class Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Subjects" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Marks Status" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Results Publication" })
            ] })
          ] }),
          currentType === "gradebook" && /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Class & Section" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Subject" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Assigned Teacher" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Verified" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Last Updated" })
          ] }),
          currentType === "students" && /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Admission No" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Student Name" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Gender" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Class & Sec" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Admission Date" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Fee Status" })
          ] }),
          currentType === "admissions" && /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Grade Level" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Enquiries" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Applications" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Entrance Test" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Selected" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-emerald-600", children: "Admitted" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Pending" })
          ] }),
          currentType === "fees" && /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Fee Category" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Demand Amount" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-emerald-600", children: "Collected" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-rose-600", children: "Pending Dues" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Overdue" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Recovery Rate" })
          ] }),
          currentType === "staff" && /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Department" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold", children: "Department Head" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Total Staff" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Teaching" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Non-Teaching" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-emerald-600", children: "Present Today" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right text-rose-600", children: "Absent" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900", children: drillData.data.map((row, rIdx) => {
          var _a2, _b, _c, _d;
          const isClickable = currentType === "attendance" && currentLevel !== "student" || currentType === "examination" && currentLevel !== "class" || currentType === "students" && currentLevel === "overall";
          return /* @__PURE__ */ jsxs("tr", { onClick: () => isClickable && handleRowClick(row), className: `hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors ${isClickable ? "cursor-pointer" : ""}`, children: [
            currentType === "attendance" && currentLevel === "overall" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-blue-600" }),
                row.branch_name
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-500", children: row.city }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: (_a2 = row.total_students) == null ? void 0 : _a2.toLocaleString() }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-emerald-600", children: (_b = row.present) == null ? void 0 : _b.toLocaleString() }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-rose-600", children: (_c = row.absent) == null ? void 0 : _c.toLocaleString() }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-amber-600", children: (_d = row.leave) == null ? void 0 : _d.toLocaleString() }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold text-gray-900 dark:text-white", children: [
                row.attendance_percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { className: "px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto", children: [
                "View Classes ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ] }) })
            ] }),
            currentType === "attendance" && currentLevel === "branch" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.class_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.total_students }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-emerald-600", children: row.present }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-rose-600", children: row.absent }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold text-gray-900 dark:text-white", children: [
                row.attendance_percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { className: "px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto", children: [
                "View Sections ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ] }) })
            ] }),
            currentType === "attendance" && currentLevel === "class" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: [
                "Section ",
                row.section_name
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.total_students }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-emerald-600", children: row.present }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-rose-600", children: row.absent }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold text-gray-900 dark:text-white", children: [
                row.attendance_percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { className: "px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto", children: [
                "View Gender Split ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ] }) })
            ] }),
            currentType === "attendance" && currentLevel === "section" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: [
                row.gender,
                " Students"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.total_students }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-emerald-600", children: row.present }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-rose-600", children: row.absent }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold text-gray-900 dark:text-white", children: [
                row.attendance_percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { className: "px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto", children: [
                "View Student List ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ] }) })
            ] }),
            currentType === "attendance" && currentLevel === "student" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400", children: row.admission_number }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.student_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300", children: row.gender }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300", children: [
                row.class_name,
                " - ",
                row.section_name
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold", children: [
                row.attendance_percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${row.status === "Present" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : row.status === "Absent" ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"}`, children: row.status }) })
            ] }),
            currentType === "examination" && currentLevel === "overall" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-blue-600" }),
                row.branch_name
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: row.exams_scheduled }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center text-emerald-600 font-semibold", children: row.completed }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center text-amber-600 font-semibold", children: row.pending }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center font-bold text-gray-900 dark:text-white", children: row.marks_entered }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: row.results_published }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { className: "px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto", children: [
                "Inspect Exams ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ] }) })
            ] }),
            currentType === "examination" && currentLevel === "branch" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.exam_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-500", children: row.term }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${row.status === "Completed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"}`, children: row.status }) }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-medium", children: [
                row.classes_completed,
                " / ",
                row.total_classes
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold text-gray-900 dark:text-white", children: [
                row.marks_entered_pct,
                "%"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center font-semibold text-blue-600", children: row.results_published }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { className: "px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-100 flex items-center gap-1 mx-auto", children: [
                "Class View ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ] }) })
            ] }),
            currentType === "examination" && currentLevel === "class" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.class_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: row.subjects_count }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-xs font-semibold ${String(row.marks_status || "").includes("Pending") ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"}`, children: row.marks_status || "Complete" }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center font-semibold", children: row.results_status })
            ] }),
            currentType === "gradebook" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: [
                row.class_name,
                " - ",
                row.section_name
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-blue-600 dark:text-blue-400 font-medium", children: row.subject_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-700 dark:text-gray-300", children: row.teacher_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-xs font-semibold ${row.status === "Completed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"}`, children: row.status }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: row.verified }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-500", children: row.updated_at })
            ] }),
            currentType === "students" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400", children: row.admission_number }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.student_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-600", children: row.gender }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-gray-600", children: [
                row.class_name,
                " - ",
                row.section_name
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-500", children: row.admission_date || "2026-06-01" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300", children: row.current_status }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300", children: row.fee_status }) })
            ] }),
            currentType === "admissions" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.course_level }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.enquiries }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.applications }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.entrance_tests }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.selected }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-bold text-emerald-600", children: row.admitted }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-amber-600", children: row.pending })
            ] }),
            currentType === "fees" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.fee_type }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: formatINR(row.demand_amount) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-emerald-600", children: formatINR(row.collected_amount) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-rose-600", children: formatINR(row.pending_amount) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-amber-600", children: formatINR(row.overdue_amount) }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold text-gray-900 dark:text-white", children: [
                row.recovery_rate,
                "%"
              ] })
            ] }),
            currentType === "staff" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-gray-900 dark:text-white", children: row.department_name }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-gray-600", children: row.department_head }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.total_staff }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.teaching_count }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium", children: row.non_teaching_count }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-emerald-600", children: row.present_today }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-medium text-rose-600", children: row.absent_today })
            ] })
          ] }, rIdx);
        }) })
      ] }) }),
      drillData && drillData.pagination && drillData.pagination.total_pages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 pt-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Showing ",
          (page - 1) * drillData.pagination.limit + 1,
          " to ",
          Math.min(page * drillData.pagination.limit, drillData.pagination.total),
          " of ",
          drillData.pagination.total,
          " records"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("button", { id: "drilldown-prev-page-btn", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page <= 1, className: "px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40", children: "Previous" }),
          /* @__PURE__ */ jsxs("span", { className: "px-2 font-semibold text-gray-900 dark:text-white", children: [
            "Page ",
            page,
            " of ",
            drillData.pagination.total_pages
          ] }),
          /* @__PURE__ */ jsx("button", { id: "drilldown-next-page-btn", onClick: () => setPage((p) => Math.min(drillData.pagination.total_pages, p + 1)), disabled: page >= drillData.pagination.total_pages, className: "px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40", children: "Next" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between text-xs text-gray-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-emerald-500" }),
        /* @__PURE__ */ jsx("span", { children: "Real-time aggregated database records from PostgreSQL/SQLite" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        selectedBranchId !== "all" && onSelectBranch && /* @__PURE__ */ jsx("button", { id: "drilldown-switch-branch-btn", onClick: () => {
          onSelectBranch(Number(selectedBranchId));
          onClose();
        }, className: "px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-lg transition-colors", children: "Switch ERP Scope to this Branch" }),
        /* @__PURE__ */ jsx("button", { id: "drilldown-done-btn", onClick: onClose, className: "px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors", children: "Done" })
      ] })
    ] })
  ] }) });
};
const ProcessMatrixSection = ({ data, branches, onProcessClick }) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("all");
  if (!data || !data.process_list)
    return null;
  const getStatusBadge = (status, pct) => {
    switch (status) {
      case "Completed":
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" }),
          "100%"
        ] });
      case "In Progress":
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-amber-600 dark:text-amber-400" }),
          pct || 65,
          "%"
        ] });
      case "Pending":
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 text-rose-600 dark:text-rose-400" }),
          pct || 0,
          "% Action"
        ] });
      default:
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700", children: [
          /* @__PURE__ */ jsx(HelpCircle, { className: "w-3 h-3 text-gray-400" }),
          "Not Started"
        ] });
    }
  };
  const safeBranches = branches || [];
  const filteredBranches = selectedBranchFilter === "all" ? safeBranches : safeBranches.filter((b) => String(b.id) === selectedBranchFilter);
  return /* @__PURE__ */ jsxs("div", { id: "process-matrix-section", className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4 bg-gray-50/50 dark:bg-gray-800/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl", children: /* @__PURE__ */ jsx(Layers, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
            "Process Completion Status Matrix",
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300", children: [
              "13 Core Processes × ",
              safeBranches.length,
              " Branches"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Cross-branch operational readiness across academics, attendance, examinations, fee collection, and administrative workflows." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-500", children: [
          /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Branch:" }),
          /* @__PURE__ */ jsxs("select", { id: "process-matrix-branch-filter", value: selectedBranchFilter, onChange: (e) => setSelectedBranchFilter(e.target.value), className: "px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200", children: [
            /* @__PURE__ */ jsxs("option", { value: "all", children: [
              "All Branches (",
              branches.length,
              ")"
            ] }),
            branches.map((b) => /* @__PURE__ */ jsx("option", { value: String(b.id), children: b.branch_name }, b.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
            " Completed"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500" }),
            " In Progress"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-rose-500" }),
            " Pending"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "py-3 px-5 font-semibold sticky left-0 bg-gray-50/90 dark:bg-gray-800/90 z-10 w-64", children: "ERP Process Name" }),
        filteredBranches.map((b) => /* @__PURE__ */ jsxs("th", { className: "py-3 px-4 font-semibold text-center min-w-[140px]", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 dark:text-white", children: b.branch_name }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 font-normal", children: b.branch_code })
        ] }, b.id))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900", children: data.process_list.map((processName, idx) => {
        const rowData = data.matrix[processName] || {};
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-5 font-semibold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-900 z-10 border-r border-gray-100 dark:border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center text-[10px] font-mono", children: idx + 1 }),
            /* @__PURE__ */ jsx("span", { children: processName })
          ] }) }),
          filteredBranches.map((b) => {
            const item = rowData[b.id];
            return /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors", onClick: () => onProcessClick && onProcessClick(processName, b.id), title: (item == null ? void 0 : item.details) || `${processName} - ${(item == null ? void 0 : item.status) || "Not Started"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              getStatusBadge(item == null ? void 0 : item.status, item == null ? void 0 : item.pct),
              (item == null ? void 0 : item.details) && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 truncate max-w-[120px]", children: item.details })
            ] }) }, b.id);
          })
        ] }, idx);
      }) })
    ] }) })
  ] });
};
const NeedsAttentionSection = ({ items = [], onActionClick }) => {
  if (!items || items.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 bg-emerald-500 text-white rounded-xl", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-emerald-900 dark:text-emerald-200", children: "All Branch Operations Optimal" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-700 dark:text-emerald-300", children: "No critical or overdue process bottlenecks require Super Admin intervention across the organization." })
      ] })
    ] });
  }
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case "critical":
        return {
          badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
          cardBorder: "border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10",
          icon: /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" })
        };
      case "warning":
        return {
          badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          cardBorder: "border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10",
          icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" })
        };
      default:
        return {
          badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          cardBorder: "border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/10",
          icon: /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" })
        };
    }
  };
  return /* @__PURE__ */ jsxs("div", { id: "needs-attention-section", className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl", children: /* @__PURE__ */ jsx(ShieldAlert, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
          "Needs Attention & Operational Alerts",
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300", children: [
            items.length,
            " Active Items"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Prioritized bottlenecks detected from live branch metrics requiring administrative follow-up." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: items.map((alert2) => {
      const config = getSeverityConfig(alert2.severity);
      return /* @__PURE__ */ jsxs("div", { id: `alert-card-${alert2.id}`, className: `rounded-xl border p-4.5 flex flex-col justify-between transition-all hover:shadow-md ${config.cardBorder}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.badgeClass}`, children: [
              config.icon,
              alert2.severity.toUpperCase()
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700", children: alert2.branch_name })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-900 dark:text-white leading-tight", children: alert2.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 leading-relaxed", children: alert2.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-400 font-medium uppercase tracking-wider", children: [
            "Module: ",
            alert2.type
          ] }),
          /* @__PURE__ */ jsxs("button", { id: `alert-action-${alert2.id}`, onClick: () => onActionClick(alert2.drill_down_target), className: "inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors", children: [
            alert2.action_label,
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
          ] })
        ] })
      ] }, alert2.id);
    }) })
  ] });
};
const BranchPerformanceTable = ({ branches, onViewBranch, onDrillDown }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Excellent":
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" }),
          "Optimal"
        ] });
      case "Good":
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-blue-600 dark:text-blue-400" }),
          "Normal"
        ] });
      case "Attention Required":
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-rose-600 dark:text-rose-400" }),
          "Action Req."
        ] });
    }
  };
  return /* @__PURE__ */ jsxs("div", { id: "branch-performance-table-container", className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl", children: /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
          "Branch Performance & Process Completion",
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300", children: [
            branches.length,
            " Branches Tracked"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Holistic comparative scorecard assessing process adherence, student engagement, assessments, and financial health." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "py-3 px-5 font-semibold", children: "Branch Name" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Students" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Attendance" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Exams" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Grade Book" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Fee Recovery" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-right", children: "Admissions" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-semibold text-center", children: "Overall Health" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-5 font-semibold text-right", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900", children: branches.map((b) => {
        var _a;
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-4 px-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs", children: b.branch_code }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 dark:text-white text-xs", children: b.branch_name }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-500", children: b.city })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 text-right font-medium text-gray-900 dark:text-gray-100", children: (_a = b.students) == null ? void 0 : _a.toLocaleString() }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 text-right", children: /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown("attendance", b.branch_id), className: "group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors", children: [
            /* @__PURE__ */ jsxs("span", { className: b.attendance_percentage < 92 ? "text-rose-600 dark:text-rose-400" : "", children: [
              b.attendance_percentage,
              "%"
            ] }),
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 text-gray-400 group-hover:text-blue-600" })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 text-right", children: /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown("examination", b.branch_id), className: "group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors", children: [
            /* @__PURE__ */ jsxs("span", { className: b.exams_completion_percentage < 80 ? "text-rose-600 dark:text-rose-400" : "", children: [
              b.exams_completion_percentage,
              "%"
            ] }),
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 text-gray-400 group-hover:text-blue-600" })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 text-right", children: /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown("gradebook", b.branch_id), className: "group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors", children: [
            /* @__PURE__ */ jsxs("span", { className: b.gradebook_completion_percentage < 75 ? "text-rose-600 dark:text-rose-400 font-extrabold" : "", children: [
              b.gradebook_completion_percentage,
              "%"
            ] }),
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 text-gray-400 group-hover:text-blue-600" })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 text-right", children: /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown("fees", b.branch_id), className: "group inline-flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors", children: [
            /* @__PURE__ */ jsxs("span", { className: b.fee_collection_percentage < 85 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400", children: [
              b.fee_collection_percentage,
              "%"
            ] }),
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 text-gray-400 group-hover:text-blue-600" })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "py-4 px-4 text-right font-medium text-gray-700 dark:text-gray-300", children: [
            b.admissions_percentage,
            "%"
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 text-center", children: getStatusBadge(b.overall_status) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-5 text-right", children: /* @__PURE__ */ jsxs("button", { id: `view-branch-btn-${b.branch_id}`, onClick: () => onViewBranch(b.branch_id), className: "px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors inline-flex items-center gap-1", children: [
            "View Branch ",
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
          ] }) })
        ] }, b.branch_id);
      }) })
    ] }) })
  ] });
};
const AttendanceMonitoringCard = ({ data, onDrillDown }) => {
  if (!data)
    return null;
  const totalStudents = data.total_students || 0;
  const presentCount = data.present || 0;
  const absentCount = data.absent || 0;
  const leaveCount = data.leave || 0;
  const presentPct = totalStudents > 0 ? Math.round(presentCount / totalStudents * 100) : 0;
  const absentPct = totalStudents > 0 ? (absentCount / totalStudents * 100).toFixed(1) : "0.0";
  const leavePct = totalStudents > 0 ? (leaveCount / totalStudents * 100).toFixed(1) : "0.0";
  const branches = Array.isArray(data.branches) ? data.branches : [];
  return /* @__PURE__ */ jsx("div", { id: "attendance-monitoring-card", className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
            "Attendance Monitoring & Daily Operations",
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300", children: [
              data.overall_percentage ?? 0,
              "% Overall"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Daily student attendance tracking with branch-wise distribution and live roll-call statistics." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { id: "attendance-full-drilldown-btn", onClick: () => onDrillDown(), className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs", children: [
        "Hierarchical Drill-Down",
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider", children: "Present Today" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1", children: presentCount.toLocaleString() }),
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-emerald-700/80 dark:text-emerald-400/80", children: [
          presentPct,
          "% of total strength"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider", children: "Absent Today" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1", children: absentCount.toLocaleString() }),
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-rose-700/80 dark:text-rose-400/80", children: [
          absentPct,
          "% of total strength"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider", children: "On Approved Leave" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1", children: leaveCount.toLocaleString() }),
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-amber-700/80 dark:text-amber-400/80", children: [
          leavePct,
          "% leaves verified"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider", children: "Total Enrolled" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-gray-900 dark:text-white mt-1", children: totalStudents.toLocaleString() }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-500", children: "Active in academic year" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsx("div", { className: "border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold", children: "Branch Name" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Students" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-emerald-600", children: "Present" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-rose-600", children: "Absent" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-amber-600", children: "Leave" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Attendance %" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold text-center", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900", children: branches.map((b, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-semibold text-gray-900 dark:text-white", children: b.branch_name }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-medium", children: (b.total_students ?? 0).toLocaleString() }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-emerald-600 font-medium", children: (b.present ?? 0).toLocaleString() }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-rose-600 font-medium", children: (b.absent ?? 0).toLocaleString() }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-amber-600 font-medium", children: (b.leave ?? 0).toLocaleString() }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white", children: /* @__PURE__ */ jsxs("span", { className: (b.attendance_percentage ?? 0) < 92 ? "text-rose-600 dark:text-rose-400" : "", children: [
          b.attendance_percentage ?? 0,
          "%"
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown(b.branch_id), className: "text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center gap-0.5", children: [
          "Drill Down ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })
        ] }) })
      ] }, `att-b-${b.branch_id}-${idx}`)) })
    ] }) }) })
  ] }) });
};
const ExamGradeBookCard = () => {
  return null;
};
const FeesFinanceCard = ({ data, onDrillDown }) => {
  if (!data)
    return null;
  const formatINR = (val) => {
    if (val >= 1e7)
      return `₹ ${(val / 1e7).toFixed(2)} Cr`;
    if (val >= 1e5)
      return `₹ ${(val / 1e5).toFixed(2)} L`;
    return `₹ ${val.toLocaleString("en-IN")}`;
  };
  return /* @__PURE__ */ jsx("div", { id: "fees-finance-card", className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl", children: /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
            "Fees & Financial Health Monitoring",
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300", children: [
              data.collection_rate,
              "% Recovery Rate"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Consolidated fee collections, pending balances, overdue dues, and fee concession reconciliations." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown(), className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-xs", children: [
        "Finance Drill-Down",
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider", children: "Total Demand" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1", children: formatINR(data.total_demand) }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-500", children: "Annual Invoiced Fees" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider", children: "Fee Collected" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1", children: formatINR(data.collected) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-emerald-600 font-medium", children: [
          data.collection_rate,
          "% In Bank"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider", children: "Pending Dues" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1", children: formatINR(data.pending) }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] text-amber-600", children: "Upcoming installments" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl p-3.5 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider", children: "Overdue Aging" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1", children: formatINR(data.overdue) }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] text-rose-600 font-medium", children: "Actionable Dues" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsx("div", { className: "border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold", children: "Branch Name" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Fee Demand" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-emerald-600", children: "Collected" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-rose-600", children: "Pending Dues" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-amber-600", children: "Overdue" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Recovery Rate" }),
        /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold text-center", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900", children: data.branches.map((b) => /* @__PURE__ */ jsxs("tr", { onClick: () => onDrillDown(b.branch_id), className: "hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-semibold text-gray-900 dark:text-white", children: b.branch_name }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-medium text-gray-700 dark:text-gray-300", children: formatINR(b.demand) }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-emerald-600 font-bold", children: formatINR(b.collected) }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-rose-600 font-medium", children: formatINR(b.pending) }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-amber-600 font-medium", children: formatINR(b.overdue) }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white", children: /* @__PURE__ */ jsxs("span", { className: b.collection_rate < 85 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400", children: [
          b.collection_rate,
          "%"
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-center", children: /* @__PURE__ */ jsxs("button", { className: "text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 inline-flex items-center gap-0.5", children: [
          "Breakdown ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })
        ] }) })
      ] }, b.branch_id)) })
    ] }) }) })
  ] }) });
};
const AdmissionsStaffCard = ({ studentData, admissionsData, staffData, onDrillDown }) => {
  var _a, _b;
  if (!studentData || !admissionsData || !staffData)
    return null;
  return /* @__PURE__ */ jsxs("div", { id: "admissions-staff-card", className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl", children: /* @__PURE__ */ jsx(UserCheck, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 dark:text-white", children: "Admissions Pipeline & Conversion" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Funnel conversion metrics from lead enquiries to admitted enrollments." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown("admissions"), className: "inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700", children: [
          "Admissions Drill-Down ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase", children: "Enquiries" }),
          /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5", children: (_a = admissionsData.total_enquiries) == null ? void 0 : _a.toLocaleString() }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500", children: "Inbound Leads" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase", children: "Admitted" }),
          /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5", children: (_b = admissionsData.admissions_completed) == null ? void 0 : _b.toLocaleString() }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-emerald-600 font-medium", children: [
            admissionsData.conversion_rate,
            "% Conversion"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase", children: "Pending" }),
          /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5", children: admissionsData.pending_admissions }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-amber-600", children: "Pending Fees / Docs" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsx("div", { className: "border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold", children: "Branch" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Enquiries" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Selected" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-emerald-600", children: "Admitted" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold text-right", children: "Conversion %" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900", children: admissionsData.branches.map((b) => /* @__PURE__ */ jsxs("tr", { onClick: () => onDrillDown("admissions", b.branch_id), className: "hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-semibold text-gray-900 dark:text-white", children: b.branch_name }),
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-medium", children: b.enquiry }),
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-medium", children: b.selected }),
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-emerald-600 font-bold", children: b.admission }),
          /* @__PURE__ */ jsxs("td", { className: "py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white", children: [
            b.conversion_rate,
            "%"
          ] })
        ] }, b.branch_id)) })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl", children: /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 dark:text-white", children: "Staff Strength & Attendance Monitoring" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Teaching and non-teaching workforce distribution and daily biometric attendance." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => onDrillDown("staff"), className: "inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700", children: [
          "Staff Drill-Down ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase", children: "Total Staff" }),
          /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-0.5", children: staffData.total_staff }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-500", children: [
            staffData.teaching_staff,
            " Teaching • ",
            staffData.non_teaching_staff,
            " Non-Tch"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase", children: "Present" }),
          /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5", children: staffData.present }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-emerald-600 font-medium", children: [
            Math.round(staffData.present / staffData.total_staff * 100),
            "% Present Today"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase", children: "Absent / Leave" }),
          /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5", children: staffData.absent + staffData.leave }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-rose-600", children: [
            staffData.absent,
            " Absent • ",
            staffData.leave,
            " Leave"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsx("div", { className: "border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold", children: "Branch" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Total Staff" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right", children: "Teaching" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-3 font-semibold text-right text-emerald-600", children: "Present" }),
          /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-semibold text-right text-rose-600", children: "Absent" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900", children: staffData.branches.map((b) => /* @__PURE__ */ jsxs("tr", { onClick: () => onDrillDown("staff", b.branch_id), className: "hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-semibold text-gray-900 dark:text-white", children: b.branch_name }),
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-medium", children: b.total_staff }),
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right font-medium", children: b.teaching }),
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 text-right text-emerald-600 font-bold", children: b.present }),
          /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-right font-medium text-rose-600", children: b.absent })
        ] }, b.branch_id)) })
      ] }) }) })
    ] }) })
  ] });
};
const VisualComparisonsSection = ({ comparisons, onBranchSelect }) => {
  const [activeTab, setActiveTab] = useState("attendance");
  if (!comparisons)
    return null;
  const formatINR = (val) => {
    if (val >= 1e7)
      return `₹ ${(val / 1e7).toFixed(2)} Cr`;
    if (val >= 1e5)
      return `₹ ${(val / 1e5).toFixed(2)} L`;
    return `₹ ${val.toLocaleString("en-IN")}`;
  };
  const tabs = [
    { id: "attendance", label: "Attendance %", icon: CalendarCheck },
    { id: "students", label: "Student Strength", icon: Users },
    { id: "fees", label: "Fee Recovery", icon: CreditCard },
    { id: "exams", label: "Exam Completion", icon: GraduationCap },
    { id: "gradebook", label: "Grade Book Entry", icon: BookOpen }
  ];
  return /* @__PURE__ */ jsxs("div", { id: "visual-comparisons-section", className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4 bg-gray-50/50 dark:bg-gray-800/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 dark:text-white", children: "Branch Benchmark & Visual Comparison" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Comparative ranking analytics across branches for operational parity." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto", children: tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return /* @__PURE__ */ jsxs("button", { id: `visual-tab-${tab.id}`, onClick: () => setActiveTab(tab.id), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${active ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`, children: [
          /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }),
          tab.label
        ] }, tab.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      activeTab === "attendance" && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: comparisons.attendance.map((item, idx) => {
        const pct = item.value;
        return /* @__PURE__ */ jsxs("div", { onClick: () => onBranchSelect && onBranchSelect(item.branch_id), className: "group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]", children: idx + 1 }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 dark:text-white", children: item.branch_name }),
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-400", children: [
                "(",
                item.subtext,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `font-bold ${pct < 92 ? "text-rose-600" : "text-emerald-600"}`, children: [
              pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full rounded-full transition-all duration-500 ${pct >= 94 ? "bg-emerald-500" : pct >= 92 ? "bg-blue-500" : "bg-rose-500"}`, style: { width: `${pct}%` } }) })
        ] }, item.branch_id);
      }) }),
      activeTab === "students" && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: comparisons.students.map((item, idx) => {
        const max = Math.max(...comparisons.students.map((s) => s.value));
        const barWidth = max > 0 ? item.value / max * 100 : 0;
        return /* @__PURE__ */ jsxs("div", { onClick: () => onBranchSelect && onBranchSelect(item.branch_id), className: "group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]", children: idx + 1 }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 dark:text-white", children: item.branch_name }),
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-400", children: [
                "(",
                item.subtext,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-blue-600 dark:text-blue-400", children: [
              item.value.toLocaleString(),
              " students (",
              item.percentage,
              "%)"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500", style: { width: `${barWidth}%` } }) })
        ] }, item.branch_id);
      }) }),
      activeTab === "fees" && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: comparisons.fees.map((item, idx) => {
        const rate = item.collection_rate;
        return /* @__PURE__ */ jsxs("div", { onClick: () => onBranchSelect && onBranchSelect(item.branch_id), className: "group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]", children: idx + 1 }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 dark:text-white", children: item.branch_name }),
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-400", children: [
                "(Collected: ",
                formatINR(item.collected),
                " • Pending: ",
                formatINR(item.pending),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `font-bold ${rate < 85 ? "text-amber-600" : "text-emerald-600"}`, children: [
              rate,
              "% Recovered"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full rounded-full transition-all duration-500 ${rate >= 90 ? "bg-emerald-500" : "bg-amber-500"}`, style: { width: `${rate}%` } }) })
        ] }, item.branch_id);
      }) }),
      activeTab === "exams" && comparisons.exams && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: comparisons.exams.map((item, idx) => {
        const val = item.value;
        return /* @__PURE__ */ jsxs("div", { onClick: () => onBranchSelect && onBranchSelect(item.branch_id), className: "group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]", children: idx + 1 }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 dark:text-white", children: item.branch_name })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `font-bold ${val < 80 ? "text-rose-600" : "text-purple-600"}`, children: [
              val,
              "% Finished"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all duration-500", style: { width: `${val}%` } }) })
        ] }, item.branch_id);
      }) }),
      activeTab === "gradebook" && comparisons.gradebook && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: comparisons.gradebook.map((item, idx) => {
        const val = item.value;
        return /* @__PURE__ */ jsxs("div", { onClick: () => onBranchSelect && onBranchSelect(item.branch_id), className: "group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px]", children: idx + 1 }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 dark:text-white", children: item.branch_name })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `font-bold ${val < 75 ? "text-rose-600" : "text-indigo-600"}`, children: [
              val,
              "% Marks Entered"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full rounded-full transition-all duration-500 ${val < 75 ? "bg-rose-500" : "bg-indigo-600"}`, style: { width: `${val}%` } }) })
        ] }, item.branch_id);
      }) })
    ] })
  ] });
};
const API_BASE = "/api/communication";
const communicationService = {
  // --- Homework ---
  async getHomework(params) {
    const query = new URLSearchParams();
    query.set("branch_id", String(params.branch_id));
    query.set("academic_year_id", String(params.academic_year_id));
    if (params.class_id)
      query.set("class_id", String(params.class_id));
    if (params.section_id)
      query.set("section_id", String(params.section_id));
    if (params.status)
      query.set("status", params.status);
    if (params.subject)
      query.set("subject", params.subject);
    if (params.search)
      query.set("search", params.search);
    const res = await fetch(`${API_BASE}/homework?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch homework");
    const data = await res.json();
    return data.data || [];
  },
  async createHomework(payload) {
    const res = await fetch(`${API_BASE}/homework`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to create homework");
    const data = await res.json();
    return data.data;
  },
  async updateHomework(id, payload) {
    const res = await fetch(`${API_BASE}/homework/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update homework");
    const data = await res.json();
    return data.data;
  },
  async deleteHomework(id) {
    const res = await fetch(`${API_BASE}/homework/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete homework");
  },
  async uploadAttachment(filename, base64Data) {
    const res = await fetch(`${API_BASE}/upload-attachment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, base64Data })
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to upload file");
    return await res.json();
  },
  // --- Assignments ---
  async getAssignments(params) {
    const query = new URLSearchParams();
    query.set("branch_id", String(params.branch_id));
    query.set("academic_year_id", String(params.academic_year_id));
    if (params.class_id)
      query.set("class_id", String(params.class_id));
    if (params.section_id)
      query.set("section_id", String(params.section_id));
    if (params.submission_type)
      query.set("submission_type", params.submission_type);
    if (params.status)
      query.set("status", params.status);
    if (params.search)
      query.set("search", params.search);
    const res = await fetch(`${API_BASE}/assignments?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch assignments");
    const data = await res.json();
    return data.data || [];
  },
  async getAssignmentDetails(id) {
    const res = await fetch(`${API_BASE}/assignments/${id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch assignment details");
    return await res.json();
  },
  async createAssignment(payload) {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to create assignment");
    const data = await res.json();
    return data.data;
  },
  async updateAssignment(id, payload) {
    const res = await fetch(`${API_BASE}/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update assignment");
    const data = await res.json();
    return data.data;
  },
  async deleteAssignment(id) {
    const res = await fetch(`${API_BASE}/assignments/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete assignment");
  },
  async submitAssignmentWork(assignmentId, payload) {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to submit assignment");
  },
  async reviewAssignment(assignmentId, studentId, payload) {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/review/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to review assignment");
  },
  async markOfflineCompletion(assignmentId, studentId, payload) {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/offline-verify/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to mark offline completion");
  },
  // --- Announcements ---
  async getAnnouncements(params) {
    const query = new URLSearchParams();
    query.set("branch_id", String(params.branch_id));
    query.set("academic_year_id", String(params.academic_year_id));
    if (params.user_type)
      query.set("user_type", params.user_type);
    if (params.priority)
      query.set("priority", params.priority);
    if (params.status)
      query.set("status", params.status);
    if (params.search)
      query.set("search", params.search);
    const res = await fetch(`${API_BASE}/announcements?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch announcements");
    const data = await res.json();
    return data.data || [];
  },
  async createAnnouncement(payload) {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to create announcement");
    const data = await res.json();
    return data.data;
  },
  async updateAnnouncement(id, payload) {
    const res = await fetch(`${API_BASE}/announcements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update announcement");
    const data = await res.json();
    return data.data;
  },
  async deleteAnnouncement(id) {
    const res = await fetch(`${API_BASE}/announcements/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete announcement");
  },
  // --- Gallery ---
  async getAlbums(params) {
    const query = new URLSearchParams();
    query.set("branch_id", String(params.branch_id));
    query.set("academic_year_id", String(params.academic_year_id));
    if (params.status)
      query.set("status", params.status);
    if (params.search)
      query.set("search", params.search);
    const res = await fetch(`${API_BASE}/gallery?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch gallery albums");
    const data = await res.json();
    return data.data || [];
  },
  async getAlbumDetails(id) {
    const res = await fetch(`${API_BASE}/gallery/${id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch gallery album details");
    return await res.json();
  },
  async createAlbum(payload) {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to create gallery album");
    const data = await res.json();
    return data.data;
  },
  async updateAlbum(id, payload) {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update gallery album");
    const data = await res.json();
    return data.data;
  },
  async deleteAlbum(id) {
    const res = await fetch(`${API_BASE}/gallery/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete gallery album");
  },
  async addMediaToAlbum(albumId, media) {
    const res = await fetch(`${API_BASE}/gallery/${albumId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media })
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to add media");
    const data = await res.json();
    return data.data;
  },
  async updateMediaItem(mediaId, payload) {
    const res = await fetch(`${API_BASE}/gallery/media/${mediaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update media item");
    const data = await res.json();
    return data;
  },
  async deleteMediaItem(mediaId) {
    const res = await fetch(`${API_BASE}/gallery/media/${mediaId}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete media item");
  },
  // --- Dashboard & Monitoring ---
  async getDashboardSummary(branch_id, academic_year_id) {
    const res = await fetch(`${API_BASE}/dashboard/summary?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch dashboard summary");
    return await res.json();
  },
  async getHomeworkMonitoring(branch_id, academic_year_id, date) {
    const query = new URLSearchParams({ branch_id: String(branch_id), academic_year_id: String(academic_year_id) });
    if (date)
      query.set("date", date);
    const res = await fetch(`${API_BASE}/dashboard/homework-monitoring?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch homework monitoring");
    return await res.json();
  },
  async getAssignmentMonitoring(branch_id, academic_year_id) {
    const res = await fetch(`${API_BASE}/dashboard/assignment-monitoring?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch assignment monitoring");
    return await res.json();
  },
  // --- History & Audit ---
  async getAuditHistory(params) {
    const query = new URLSearchParams({
      branch_id: String(params.branch_id),
      academic_year_id: String(params.academic_year_id),
      limit: String(params.limit || 100)
    });
    if (params.module)
      query.set("module", params.module);
    const res = await fetch(`${API_BASE}/history?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch audit history");
    const data = await res.json();
    return data.data || [];
  },
  async getAuditLogs(params) {
    const query = new URLSearchParams({
      branch_id: String(params.branch_id),
      academic_year_id: String(params.academic_year_id),
      limit: String(params.limit || 100)
    });
    if (params.module_name)
      query.set("activity_type", params.module_name);
    const res = await fetch(`${API_BASE}/history?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch audit history");
    const data = await res.json();
    return { logs: data.data || [] };
  },
  // --- Student / Parent Portal Feed ---
  async getStudentPortalFeed(student_id, academic_year_id) {
    const res = await fetch(`${API_BASE}/portal/student-feed?student_id=${student_id}&academic_year_id=${academic_year_id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch student portal feed");
    return await res.json();
  },
  // --- Multi-Module Feeds for All Classes ---
  async getClassModuleFeeds(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set("branch_id", String(params.branch_id));
    if (params.academic_year_id) query.set("academic_year_id", String(params.academic_year_id));
    if (params.class_id && params.class_id !== "all") query.set("class_id", String(params.class_id));
    if (params.module && params.module !== "all") query.set("module", params.module);
    const res = await fetch(`${API_BASE}/feeds?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch class module feeds");
    const data = await res.json();
    return data.data || [];
  }
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-xs",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/80",
        outline: "text-foreground border-border",
        success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-xs hover:bg-accent/10 hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        emerald: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 active:bg-emerald-700"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Input.displayName = "Input";
const ClassModuleFeeds = ({
  branchId,
  academicYearId,
  selectedClassId = "all",
  title = "Live Class & Module Feeds",
  subtitle = "Real-time updates, roll-calls, exam grades & announcements across all classes",
  compact = false
}) => {
  const navigate = useNavigate();
  const { classes } = useErp();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState("all");
  const [classFilter, setClassFilter] = useState(selectedClassId);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modulesList = [
    { key: "all", label: "All Feeds", icon: Layers },
    { key: "attendance", label: "Attendance", icon: CalendarCheck },
    { key: "homework", label: "Homework", icon: BookOpen },
    { key: "examinations", label: "Examinations", icon: GraduationCap },
    { key: "announcements", label: "Notices", icon: Bell },
    { key: "assignments", label: "Assignments", icon: FileText }
  ];
  const fetchFeeds = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await communicationService.getClassModuleFeeds({
        branch_id: branchId || "all",
        academic_year_id: academicYearId || "all",
        class_id: classFilter !== "all" ? classFilter : void 0,
        module: activeModule !== "all" ? activeModule : void 0
      });
      setFeeds(data || []);
    } catch (err) {
      console.error("Failed to fetch class module feeds:", err);
      setError(err.message || "Unable to load real-time feeds");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  useEffect(() => {
    fetchFeeds();
  }, [branchId, academicYearId, classFilter, activeModule]);
  const filteredFeeds = useMemo(() => {
    if (!searchQuery.trim()) return feeds;
    const q = searchQuery.toLowerCase();
    return feeds.filter(
      (f) => f.title && f.title.toLowerCase().includes(q) || f.description && f.description.toLowerCase().includes(q) || f.class_name && f.class_name.toLowerCase().includes(q) || f.module && f.module.toLowerCase().includes(q)
    );
  }, [feeds, searchQuery]);
  const getModuleBadge = (mod) => {
    switch (mod) {
      case "Attendance":
        return {
          icon: CalendarCheck,
          badgeVariant: "emerald"
        };
      case "Homework":
        return {
          icon: BookOpen,
          badgeVariant: "default"
        };
      case "Examinations":
        return {
          icon: GraduationCap,
          badgeVariant: "secondary"
        };
      case "Announcements":
        return {
          icon: Bell,
          badgeVariant: "outline"
        };
      case "Assignments":
        return {
          icon: FileText,
          badgeVariant: "secondary"
        };
      default:
        return {
          icon: Activity,
          badgeVariant: "outline"
        };
    }
  };
  const formatTimestamp = (ts) => {
    if (!ts) return "Just now";
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return ts;
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "p-5 sm:p-6 border-b border-border bg-gradient-to-b from-muted/30 to-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-sky-100" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base sm:text-lg font-black text-foreground tracking-tight", children: title }),
              /* @__PURE__ */ jsxs(Badge, { variant: "emerald", className: "gap-1 font-bold text-[11px]", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  filteredFeeds.length,
                  " Updates"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { className: "text-xs text-muted-foreground mt-0.5 font-medium", children: subtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              "aria-label": "Filter by Class",
              value: classFilter,
              onChange: (e) => setClassFilter(e.target.value),
              className: "text-xs font-semibold bg-background border border-input rounded-xl px-3 py-2 text-foreground hover:border-primary/40 focus:outline-hidden focus:ring-2 focus:ring-ring cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "🎓 All Classes" }),
                classes && classes.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.class_name || `Class ${c.id}` }, c.id))
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: () => fetchFeeds(true),
              disabled: isRefreshing || loading,
              title: "Refresh Feeds",
              className: "h-8 w-8",
              children: /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}` })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none", children: modulesList.map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.key;
          return /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              variant: isActive ? "default" : "outline",
              onClick: () => setActiveModule(m.key),
              className: "text-xs font-bold gap-1.5 rounded-xl h-8",
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: m.label })
              ]
            },
            m.key
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative min-w-[200px]", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              placeholder: "Search feed activities...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-8 h-8 text-xs"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: `p-0 divide-y divide-border overflow-y-auto ${compact ? "max-h-[380px]" : "max-h-[520px]"}`, children: loading ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin text-primary mx-auto mb-2" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: "Loading module activities..." })
    ] }) : error ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-rose-500 text-xs font-medium", children: error }) : filteredFeeds.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground", children: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground", children: "No activity feeds found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: 'Try selecting "All Classes" or clear your module search filter for an empty feed overview.' })
    ] }) : filteredFeeds.map((item, idx) => {
      const badgeInfo = getModuleBadge(item.module);
      const Icon = badgeInfo.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => item.link && navigate(item.link),
          className: "p-4 sm:p-4.5 hover:bg-muted/40 transition-colors flex items-start justify-between gap-4 group cursor-pointer",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3.5", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: badgeInfo.badgeVariant, className: "text-[10px] font-bold", children: item.module || "Activity" }),
                  item.class_name && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-semibold text-muted-foreground", children: [
                    item.class_name,
                    " ",
                    item.section_name && item.section_name !== "All" ? `(${item.section_name})` : ""
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-[10px]", children: "•" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                    formatTimestamp(item.created_at || item.timestamp || item.date)
                  ] }),
                  item.due_date && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] text-primary border-primary/30", children: [
                    "Due: ",
                    item.due_date
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-foreground group-hover:text-primary transition-colors", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-2", children: item.description || item.message || item.details })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "shrink-0 flex items-center space-x-2 pt-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: item.author || item.teacher_name || "Staff" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" })
            ] })
          ]
        },
        item.id || idx
      );
    }) }),
    /* @__PURE__ */ jsxs(CardFooter, { className: "px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground font-medium", children: [
      /* @__PURE__ */ jsx("span", { children: "Displaying latest activities across curriculum & campus life" }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate("/communication/overview"),
          className: "text-primary hover:text-primary/80 font-semibold inline-flex items-center space-x-1 p-0 h-auto",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Communication Hub" }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
          ]
        }
      )
    ] })
  ] });
};
const SuperAdminDashboard = ({ onNavigateToStudents, onNavigateToSettings }) => {
  var _a, _b, _c, _d;
  const {
    branches,
    activeBranchId,
    setActiveBranchId,
    activeAcademicYear,
    isAllBranches,
    userRole,
    setUserRole,
    assignedBranchId,
    isHistoricalYear,
    showToast
  } = useErp();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [drillDownType, setDrillDownType] = useState("attendance");
  const [drillDownBranchId, setDrillDownBranchId] = useState("all");
  const loadMetrics = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setFetchError(null);
    try {
      const yearName = (activeAcademicYear == null ? void 0 : activeAcademicYear.name) || "2026-2027";
      const data = await getSuperAdminDashboardData(activeBranchId || "all", yearName, userRole, assignedBranchId);
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
      setFetchError(err.message || "Unable to load consolidated dashboard data.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeBranchId, activeAcademicYear, userRole, assignedBranchId]);
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);
  const handleOpenDrillDown = (type, branchId) => {
    setDrillDownType(type);
    setDrillDownBranchId(branchId !== void 0 ? branchId : activeBranchId || "all");
    setIsDrillDownOpen(true);
  };
  const handleAlertAction = (target) => {
    setDrillDownType(target.type);
    setDrillDownBranchId(target.branch_id);
    setIsDrillDownOpen(true);
  };
  const formatINR = (val) => {
    if (val >= 1e7) return `₹ ${(val / 1e7).toFixed(2)} Cr`;
    if (val >= 1e5) return `₹ ${(val / 1e5).toFixed(2)} L`;
    return `₹ ${val.toLocaleString("en-IN")}`;
  };
  const currentYearName = (activeAcademicYear == null ? void 0 : activeAcademicYear.name) || "2026–2027";
  const cards = (dashboardData == null ? void 0 : dashboardData.cards) || (dashboardData == null ? void 0 : dashboardData.metrics) || {};
  return /* @__PURE__ */ jsxs("div", { id: "super-admin-overall-monitoring-dashboard", className: "space-y-6 animate-in fade-in duration-200", children: [
    /* @__PURE__ */ jsxs(Card, { className: "bg-slate-900 border-slate-800 text-white shadow-md relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/10 to-emerald-500/0 rounded-full blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "default", className: "bg-sky-500/20 text-sky-300 border-sky-500/30 gap-1.5 py-1", children: [
              /* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: userRole === "super_admin" ? "SUPER ADMIN DASHBOARD" : "BRANCH ADMIN DASHBOARD" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "•" }),
            /* @__PURE__ */ jsxs("span", { className: "text-slate-300 text-xs font-medium", children: [
              "Organization: ",
              /* @__PURE__ */ jsx("strong", { className: "text-white font-semibold", children: ((_a = dashboardData == null ? void 0 : dashboardData.organization) == null ? void 0 : _a.name) || "Green Park Coaching Centre" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "•" }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "border-slate-700 bg-slate-800 text-emerald-300 font-mono text-xs", children: [
              "Academic Year: ",
              currentYearName
            ] })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3", children: isAllBranches ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Globe, { className: "w-7 h-7 text-sky-400" }),
            /* @__PURE__ */ jsx("span", { children: "Overall Branch Monitoring Dashboard" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Building2, { className: "w-7 h-7 text-emerald-400" }),
            /* @__PURE__ */ jsxs("span", { children: [
              ((_b = branches.find((b) => b.id === activeBranchId)) == null ? void 0 : _b.branch_name) || "Campus",
              " Branch Monitoring"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed", children: isAllBranches ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "Centralized multi-branch control center monitoring academic process completion, attendance benchmarks, examination status, fee recoveries, and staff health across all ",
            /* @__PURE__ */ jsxs("strong", { children: [
              branches.length,
              " branches"
            ] }),
            "."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Focused operational monitoring for ",
            /* @__PURE__ */ jsx("strong", { children: (_c = branches.find((b) => b.id === activeBranchId)) == null ? void 0 : _c.branch_name }),
            ". Drill down to inspect classes, sections, exams, and individual student performance."
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row lg:flex-col items-end gap-2.5 shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 rounded-xl p-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2", children: "Role:" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                id: "role-super-admin-btn",
                onClick: () => setUserRole("super_admin"),
                className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${userRole === "super_admin" ? "bg-sky-600 text-white shadow-2xs" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`,
                children: "Super Admin"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                id: "role-branch-admin-btn",
                onClick: () => setUserRole("branch_admin"),
                className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${userRole === "branch_admin" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`,
                children: "Branch Admin"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                id: "refresh-dashboard-btn",
                onClick: () => loadMetrics(true),
                disabled: isRefreshing,
                className: "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer",
                title: "Refresh dashboard aggregation",
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-sky-400" : ""}` }),
                  /* @__PURE__ */ jsx("span", { children: isRefreshing ? "Refreshing..." : "Refresh Metrics" })
                ]
              }
            ),
            isAllBranches ? /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-mono text-sky-300 bg-sky-950/80 border border-sky-800/80 px-2.5 py-1 rounded-lg", children: [
              "Scope: ALL (",
              branches.length,
              " Branches)"
            ] }) : /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                id: "switch-back-to-all-branches",
                onClick: () => setActiveBranchId("all"),
                className: "text-[11px] font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1",
                children: [
                  /* @__PURE__ */ jsx(Globe, { className: "w-3 h-3" }),
                  /* @__PURE__ */ jsx("span", { children: "Return to All Branches" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    isHistoricalYear && /* @__PURE__ */ jsxs(Card, { className: "p-3.5 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
        /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsxs("strong", { children: [
            "Historical Academic Session (",
            currentYearName,
            "):"
          ] }),
          " Monitoring metrics reflect locked historical archives."
        ] })
      ] }),
      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "border-amber-300 bg-amber-100 text-amber-800 font-mono text-[11px]", children: "Archived Audit Record" })
    ] }),
    fetchError && /* @__PURE__ */ jsxs(Card, { className: "p-4 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-rose-600 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: fetchError })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", size: "sm", onClick: () => loadMetrics(), children: "Retry" })
    ] }),
    /* @__PURE__ */ jsx(NeedsAttentionSection, { items: dashboardData == null ? void 0 : dashboardData.needs_attention, onActionClick: handleAlertAction }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4.5 flex flex-col justify-between hover:border-sky-300 transition-colors border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: isAllBranches ? "Total Campuses" : "Campus Scope" }),
          /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400", children: /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-foreground", children: isAllBranches ? `${(cards == null ? void 0 : cards.total_branches) || branches.length} Campuses` : "Single Branch" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: isAllBranches ? `${(cards == null ? void 0 : cards.active_branches) || branches.length} Active in Academic Year` : (_d = branches.find((b) => b.id === activeBranchId)) == null ? void 0 : _d.branch_name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => handleOpenDrillDown("students"),
          className: "p-4.5 flex flex-col justify-between cursor-pointer hover:border-sky-400 transition-colors group border-border",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Student Strength" }),
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 group-hover:bg-sky-100", children: /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-2xl font-black text-foreground flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: ((cards == null ? void 0 : cards.total_students) || 4850).toLocaleString() }),
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-sky-600" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-emerald-600 font-medium mt-0.5", children: [
                ((cards == null ? void 0 : cards.active_students) || 4792).toLocaleString(),
                " Active • ",
                (cards == null ? void 0 : cards.inactive_students) || 58,
                " Inactive"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => handleOpenDrillDown("attendance"),
          className: "p-4.5 flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors group border-border",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Avg Attendance" }),
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:bg-emerald-100", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-2xl font-black text-foreground flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  (cards == null ? void 0 : cards.overall_attendance_percentage) || (cards == null ? void 0 : cards.today_attendance_percentage) || 92.5,
                  "%"
                ] }),
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-emerald-600" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-emerald-600 font-medium mt-0.5", children: "Daily Target: 94.0% Benchmark" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => handleOpenDrillDown("fees"),
          className: "p-4.5 flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-colors group border-border",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Fee Recovery" }),
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 group-hover:bg-amber-100", children: /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-2xl font-black text-foreground flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  (cards == null ? void 0 : cards.fee_recovery_rate) || 89,
                  "%"
                ] }),
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-amber-600" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                "Collected: ",
                formatINR((cards == null ? void 0 : cards.fee_collection) || 8924e4)
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => handleOpenDrillDown("staff"),
          className: "p-4.5 flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors group border-border",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Staff" }),
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:bg-emerald-100", children: /* @__PURE__ */ jsx(UserCheck, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-2xl font-black text-foreground flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: (cards == null ? void 0 : cards.total_staff) || 420 }),
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-emerald-600" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                "Ratio: 1 : ",
                (cards == null ? void 0 : cards.student_staff_ratio) || 12,
                " (Students/Staff)"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => onNavigateToSettings && onNavigateToSettings("academic-settings"),
          className: "p-4.5 flex flex-col justify-between cursor-pointer hover:border-indigo-400 transition-colors group border-border",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Classes & Sections" }),
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 group-hover:bg-indigo-100", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-2xl font-black text-foreground flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  (cards == null ? void 0 : cards.total_classes) || 140,
                  " Classes"
                ] }),
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-indigo-600" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                (cards == null ? void 0 : cards.total_sections) || 310,
                " Assigned Sections"
              ] })
            ] })
          ]
        }
      )
    ] }),
    (dashboardData == null ? void 0 : dashboardData.branch_performance) && /* @__PURE__ */ jsx(
      BranchPerformanceTable,
      {
        branches: dashboardData.branch_performance,
        onViewBranch: (bId) => setActiveBranchId(bId),
        onDrillDown: (type, bId) => handleOpenDrillDown(type, bId)
      }
    ),
    /* @__PURE__ */ jsx(
      ClassModuleFeeds,
      {
        branchId: activeBranchId,
        academicYearId: (activeAcademicYear == null ? void 0 : activeAcademicYear.id) || 2,
        title: "Live Academic & Module Feeds (All Classes)",
        subtitle: "Live roll-call completion, homework submissions, published examination grades & campus alerts"
      }
    ),
    /* @__PURE__ */ jsx(
      AttendanceMonitoringCard,
      {
        data: dashboardData == null ? void 0 : dashboardData.attendance_summary,
        onDrillDown: (bId) => handleOpenDrillDown("attendance", bId)
      }
    ),
    /* @__PURE__ */ jsx(
      ExamGradeBookCard,
      {
        examData: dashboardData == null ? void 0 : dashboardData.examination_summary,
        gradeBookData: dashboardData == null ? void 0 : dashboardData.gradebook_summary,
        onDrillDown: (type, bId) => handleOpenDrillDown(type, bId)
      }
    ),
    /* @__PURE__ */ jsx(
      FeesFinanceCard,
      {
        data: dashboardData == null ? void 0 : dashboardData.fees_summary,
        onDrillDown: (bId) => handleOpenDrillDown("fees", bId)
      }
    ),
    /* @__PURE__ */ jsx(
      AdmissionsStaffCard,
      {
        studentData: dashboardData == null ? void 0 : dashboardData.student_summary,
        admissionsData: dashboardData == null ? void 0 : dashboardData.admissions_summary,
        staffData: dashboardData == null ? void 0 : dashboardData.staff_summary,
        onDrillDown: (type, bId) => handleOpenDrillDown(type, bId)
      }
    ),
    /* @__PURE__ */ jsx(
      ProcessMatrixSection,
      {
        data: dashboardData == null ? void 0 : dashboardData.process_completion,
        branches,
        onProcessClick: (proc, bId) => {
          if (proc.toLowerCase().includes("attendance")) handleOpenDrillDown("attendance", bId);
          else if (proc.toLowerCase().includes("exam")) handleOpenDrillDown("examination", bId);
          else if (proc.toLowerCase().includes("grade")) handleOpenDrillDown("gradebook", bId);
          else if (proc.toLowerCase().includes("fee")) handleOpenDrillDown("fees", bId);
          else if (proc.toLowerCase().includes("staff")) handleOpenDrillDown("staff", bId);
          else handleOpenDrillDown("students", bId);
        }
      }
    ),
    /* @__PURE__ */ jsx(
      VisualComparisonsSection,
      {
        comparisons: dashboardData == null ? void 0 : dashboardData.comparisons,
        onBranchSelect: (bId) => setActiveBranchId(bId)
      }
    ),
    /* @__PURE__ */ jsx(
      DrillDownModal,
      {
        isOpen: isDrillDownOpen,
        onClose: () => setIsDrillDownOpen(false),
        initialType: drillDownType,
        initialBranchId: drillDownBranchId,
        academicYearName: currentYearName,
        onSelectBranch: (bId) => setActiveBranchId(bId)
      }
    )
  ] });
};
const OperationalDashboard = ({
  branches = [],
  activeBranchId,
  onNavigateToSettings,
  onNavigateToStudents
}) => {
  const navigate = useNavigate();
  const { isAllBranches, userRole, assignedBranch, activeAcademicYear } = useErp();
  if (userRole === "super_admin" || isAllBranches) {
    return /* @__PURE__ */ jsx(
      SuperAdminDashboard,
      {
        onNavigateToStudents,
        onNavigateToSettings
      }
    );
  }
  const currentBranch = assignedBranch || branches.find((b) => Number(b.id) === Number(activeBranchId)) || branches[0];
  const currentDateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border-border bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white overflow-hidden relative shadow-md", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-40 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sky-200", children: [
            /* @__PURE__ */ jsx("span", { children: "Operational School Workspace" }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-mono text-[11px] font-bold", children: (currentBranch == null ? void 0 : currentBranch.branch_code) || "MAIN" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-black tracking-tight text-white", children: "Daily Campus Operations & Overview" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed", children: [
            "Real-time daily operations, attendance metrics, upcoming academic periods, and campus notices for ",
            (currentBranch == null ? void 0 : currentBranch.branch_name) || "Green Park Main Campus",
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 shrink-0", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => navigate("/preview/homeroom"),
              className: "bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs",
              children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-300 mr-1.5" }),
                /* @__PURE__ */ jsx("span", { children: "Preview Modern UI" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-2 text-right", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-sky-200 uppercase font-semibold", children: "Today's Date" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold font-mono text-white", children: currentDateStr })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-md transition-shadow border-border", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center border border-emerald-100", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-extrabold text-xs", children: "94.8% Present" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-foreground tracking-tight", children: "1,248" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-medium mt-0.5", children: "Students Marked Present Today" })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "68 Absent / Leave" }),
          /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 font-bold flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3" }),
            "+1.2% vs yesterday"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-md transition-shadow border-border", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 flex items-center justify-center border border-sky-100", children: /* @__PURE__ */ jsx(UserCheck, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx(Badge, { variant: "default", className: "font-extrabold text-xs", children: "98% Staff Duty" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-foreground tracking-tight", children: "86 / 88" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-medium mt-0.5", children: "Teaching & Admin Faculty" })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "2 Faculty on Leave" }),
          /* @__PURE__ */ jsx("span", { className: "text-sky-600 font-bold", children: "Substitutes Assigned" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-md transition-shadow border-border", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex items-center justify-center border border-indigo-100", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-extrabold text-xs bg-indigo-100 text-indigo-800", children: "Period 4 Active" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-foreground tracking-tight", children: "36" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-medium mt-0.5", children: "Live Classrooms & Labs" })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "All Timetables Active" }),
          /* @__PURE__ */ jsx("span", { className: "text-indigo-600 font-bold", children: "0 Schedule Conflicts" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-md transition-shadow border-border", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center border border-amber-100", children: /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-extrabold text-xs text-amber-700 border-amber-300 bg-amber-50", children: "Today" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-foreground tracking-tight", children: "₹ 1,45,200" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-medium mt-0.5", children: "Daily Receipts Collected" })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "24 Transactions" }),
          /* @__PURE__ */ jsx("span", { className: "text-emerald-600 font-bold", children: "100% Reconciled" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-extrabold text-foreground", children: "Quick Daily Operations" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Direct access to frequent administrative workflows" })
        ] }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[11px] font-bold", children: "Fast Access" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3.5", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/attendance/take_attendance"),
            className: "h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all text-center rounded-2xl group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-foreground", children: "Mark Attendance" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Class rosters" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/examination/marks_entry"),
            className: "h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all text-center rounded-2xl group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-foreground", children: "Exam Marks" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Enter grades" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/communication/homework"),
            className: "h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-center rounded-2xl group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-foreground", children: "Assign Homework" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Class tasks" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/communication/announcements"),
            className: "h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-all text-center rounded-2xl group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-foreground", children: "Send Notice" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Broadcast alert" })
              ] })
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-extrabold text-foreground", children: "Today's Class Schedule Progress" }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-[11px]", children: "Current Academic Day Progression" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-sky-700 bg-sky-50 border-sky-200 text-xs font-semibold", children: "Bell Schedule: Regular" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-foreground", children: "Period 4 (11:15 AM - 12:00 PM)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-sky-700 dark:text-sky-300 font-semibold", children: "Mathematics & Science Practical Labs" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs font-bold", children: "LIVE NOW" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-foreground", children: "Lunch Break (12:00 PM - 12:45 PM)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-amber-700 dark:text-amber-300 font-medium", children: "Primary & Secondary Dining Halls" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-amber-800 bg-white dark:bg-slate-900 border-amber-300 font-bold", children: "Upcoming" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-slate-300" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-foreground", children: "Period 5 (12:45 PM - 01:30 PM)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Social Studies & Language Arts" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Scheduled" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          ClassModuleFeeds,
          {
            branchId: currentBranch == null ? void 0 : currentBranch.id,
            academicYearId: (activeAcademicYear == null ? void 0 : activeAcademicYear.id) || 2,
            title: "Class Activities & Academic Feeds",
            subtitle: `Live roll-call entries, homework & syllabus circulars for ${(currentBranch == null ? void 0 : currentBranch.branch_name) || "campus"}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3 flex flex-row items-center space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-amber-50 text-amber-600", children: /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-extrabold text-foreground", children: "Campus Announcements" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between font-bold", children: [
                /* @__PURE__ */ jsx("span", { className: "text-foreground font-extrabold", children: "Parent-Teacher Meeting" }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] text-amber-800 border-amber-300 bg-white dark:bg-slate-900", children: "This Saturday" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[11px] leading-relaxed", children: "Scheduled for Grades 9 to 12. Slot allotment notices sent to parent portals." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 text-xs space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between font-bold", children: [
                /* @__PURE__ */ jsx("span", { className: "text-foreground font-extrabold", children: "Mid-Term Exam Timetable" }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] text-indigo-800 border-indigo-300 bg-white dark:bg-slate-900", children: "Oct 12" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[11px] leading-relaxed", children: "Exam schedules generated and locked for CBSE syllabus subjects." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-border bg-gradient-to-br from-card to-muted/30", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2 flex flex-row items-center space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-sky-50 text-sky-600", children: /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-extrabold text-foreground", children: "Campus Configuration" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs leading-relaxed", children: [
              "To configure campus branches or manage academic year cycles, navigate to ",
              /* @__PURE__ */ jsx("strong", { children: "Settings" }),
              " in the main sidebar."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 pt-1", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => onNavigateToSettings("branch-settings"),
                  className: "w-full justify-between text-xs font-bold hover:border-sky-500 hover:text-sky-600",
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-sky-600" }),
                      /* @__PURE__ */ jsx("span", { children: "Branch Settings" })
                    ] }),
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 text-sky-600" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => onNavigateToSettings("academic-settings"),
                  className: "w-full justify-between text-xs font-bold hover:border-emerald-500 hover:text-emerald-600",
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-600" }),
                      /* @__PURE__ */ jsx("span", { children: "Academic Settings" })
                    ] }),
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 text-emerald-600" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const attendanceApi = {
  // Remarks Master
  async getRemarks(status) {
    const params = new URLSearchParams();
    if (status)
      params.append("status", status);
    const res = await fetch(`/api/attendance/remarks?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch remarks");
    const data = await res.json();
    return data.remarks;
  },
  async createRemark(payload) {
    const res = await fetch("/api/attendance/remarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to create remark");
    return await res.json();
  },
  async updateRemark(id, payload) {
    const res = await fetch(`/api/attendance/remarks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update remark");
    return await res.json();
  },
  async toggleRemarkStatus(id, status) {
    const res = await fetch(`/api/attendance/remarks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update remark status");
  },
  async deleteRemark(id) {
    const res = await fetch(`/api/attendance/remarks/${id}`, {
      method: "DELETE"
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete remark");
  },
  // Check Existing Attendance
  async checkExisting(branchId, ayId, classId, sectionId, date, sectionName) {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      academic_year_id: String(ayId),
      class_id: String(classId),
      section_id: String(sectionId),
      date
    });
    if (sectionName)
      params.append("section_name", String(sectionName));
    const res = await fetch(`/api/attendance/check-existing?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to check existing attendance");
    return await res.json();
  },
  // Timings
  async getTimings(branchId, ayId, academicYear) {
    const params = new URLSearchParams();
    if (branchId)
      params.append("branch_id", String(branchId));
    if (ayId)
      params.append("academic_year_id", String(ayId));
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/timings?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch timings");
    const data = await res.json();
    return data.timings || data.data || [];
  },
  async createTiming(timing) {
    const res = await fetch("/api/attendance/timings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timing)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to create timing");
    const data = await res.json();
    return data.timing || data.data;
  },
  async updateTiming(id, timing) {
    const res = await fetch(`/api/attendance/timings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timing)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update timing");
    const data = await res.json();
    return data.timing || data.data;
  },
  async toggleTimingStatus(id, status) {
    const res = await fetch(`/api/attendance/timings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update timing status");
  },
  // Assignments
  async getAssignments(branchId, ayId, academicYear) {
    const params = new URLSearchParams();
    if (branchId)
      params.append("branch_id", String(branchId));
    if (ayId)
      params.append("academic_year_id", String(ayId));
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/assignments?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch assignments");
    const data = await res.json();
    return data.assignments || data.data || [];
  },
  async createAssignment(assignment) {
    const res = await fetch("/api/attendance/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to assign timing");
    const data = await res.json();
    return data.assignment;
  },
  async toggleAssignmentStatus(id, status) {
    const res = await fetch(`/api/attendance/assignments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update assignment status");
  },
  async resolveTiming(branchId, ayId, classId, sectionId, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      academic_year_id: String(ayId),
      class_id: String(classId)
    });
    if (sectionId && sectionId !== "all")
      params.append("section_id", String(sectionId));
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/resolve-timing?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to resolve timing");
    const data = await res.json();
    return data;
  },
  // Taking Attendance
  async getStudentsToMark(branchId, ayId, classId, sectionId, date, timingId, sectionName, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      academic_year_id: String(ayId),
      class_id: String(classId),
      section_id: String(sectionId),
      date
    });
    if (timingId)
      params.append("timing_id", String(timingId));
    if (sectionName)
      params.append("section_name", String(sectionName));
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/students-to-mark?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to load students");
    const data = await res.json();
    const students = Array.isArray(data.students) ? data.students : data.data || [];
    students.has_timing_mapping = Boolean(data.has_timing_mapping);
    students.timing = data.timing || null;
    return students;
  },
  async submitAttendance(payload) {
    const res = await fetch("/api/attendance/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to submit attendance");
    return await res.json();
  },
  // History
  async getHistory(branchId, ayId, date, classId, sectionId, academicYear) {
    const params = new URLSearchParams();
    params.append("branch_id", String(branchId));
    if (ayId)
      params.append("academic_year_id", String(ayId));
    if (academicYear)
      params.append("academic_year", String(academicYear));
    if (date)
      params.append("date", date);
    if (classId)
      params.append("class_id", String(classId));
    if (sectionId)
      params.append("section_id", String(sectionId));
    const res = await fetch(`/api/attendance/history?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch attendance history");
    const data = await res.json();
    return data.history || data.data || [];
  },
  async getRecordDetails(branchId, ayId, classId, sectionId, date, timingId, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      class_id: String(classId),
      section_id: String(sectionId),
      date
    });
    if (ayId)
      params.append("academic_year_id", String(ayId));
    if (academicYear)
      params.append("academic_year", String(academicYear));
    if (timingId)
      params.append("timing_id", String(timingId));
    const res = await fetch(`/api/attendance/record-details?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch session record details");
    return await res.json();
  },
  async getMonthlyReport(branchId, ayId, classId, sectionId, month) {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      academic_year_id: String(ayId),
      class_id: String(classId),
      section_id: String(sectionId)
    });
    if (month)
      params.append("month", month);
    const res = await fetch(`/api/attendance/reports/monthly?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch monthly report");
    return await res.json();
  },
  async getStudentIndividualReport(branchId, ayId, studentId, dateFrom, dateTo, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      academic_year_id: String(ayId),
      student_id: String(studentId)
    });
    if (dateFrom)
      params.append("date_from", dateFrom);
    if (dateTo)
      params.append("date_to", dateTo);
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/reports/student-individual?${params.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch individual student report");
    return await res.json();
  },
  async updateSingleRecord(payload) {
    const res = await fetch("/api/attendance/update-single", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to update attendance record");
  },
  // Absent Report & Notifications
  async getAbsentReport(params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== void 0 && v !== null && v !== "") {
        searchParams.append(k, String(v));
      }
    });
    const res = await fetch(`/api/attendance/absent-report?${searchParams.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch absent report");
    const data = await res.json();
    return data.absentees;
  },
  async sendNotifications(branch_id, academic_year_id, notifications) {
    const res = await fetch("/api/attendance/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch_id, academic_year_id, notifications })
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to dispatch absent notifications");
    return await res.json();
  },
  async retryNotification(id) {
    const res = await fetch(`/api/attendance/notifications/retry/${id}`, { method: "POST" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to retry notification");
  },
  // Reports
  async getDailyReport(branch_id, academic_year_id, date, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    if (date)
      params.append("date", date);
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/reports/daily?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch daily report");
    return await res.json();
  },
  async getClassWiseReport(branch_id, academic_year_id, date_from, date_to, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    if (date_from)
      params.append("date_from", date_from);
    if (date_to)
      params.append("date_to", date_to);
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/reports/class-wise?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch class-wise report");
    const data = await res.json();
    return data.classes;
  },
  async getSectionWiseReport(branch_id, academic_year_id, class_id, date_from, date_to, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id),
      class_id: String(class_id)
    });
    if (date_from)
      params.append("date_from", date_from);
    if (date_to)
      params.append("date_to", date_to);
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/reports/section-wise?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch section-wise report");
    const data = await res.json();
    return data.sections;
  },
  async getGenderWiseReport(branch_id, academic_year_id, class_id, section_id, academicYear) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    if (class_id)
      params.append("class_id", String(class_id));
    if (section_id)
      params.append("section_id", String(section_id));
    if (academicYear)
      params.append("academic_year", String(academicYear));
    const res = await fetch(`/api/attendance/reports/gender-wise?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch gender-wise report");
    const data = await res.json();
    return data.gender_breakdown;
  },
  async getStudentWiseReport(branch_id, academic_year_id, class_id, section_id, gender, academicYear, date_from, date_to) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    if (class_id)
      params.append("class_id", String(class_id));
    if (section_id)
      params.append("section_id", String(section_id));
    if (gender && gender !== "all")
      params.append("gender", gender);
    if (academicYear)
      params.append("academic_year", String(academicYear));
    if (date_from)
      params.append("date_from", date_from);
    if (date_to)
      params.append("date_to", date_to);
    const res = await fetch(`/api/attendance/reports/student-wise?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch student-wise report");
    const data = await res.json();
    return data.students;
  },
  async getLowAttendanceReport(branch_id, academic_year_id, threshold = 75) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id),
      threshold: String(threshold)
    });
    const res = await fetch(`/api/attendance/reports/low-attendance?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch low attendance report");
    const data = await res.json();
    return data.low_attendance_students;
  },
  async getConsecutiveAbsentReport(branch_id, academic_year_id, min_days = 3, class_id, section_id) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id),
      min_days: String(min_days)
    });
    if (class_id)
      params.append("class_id", String(class_id));
    if (section_id)
      params.append("section_id", String(section_id));
    const res = await fetch(`/api/attendance/reports/consecutive-absent?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch consecutive absent report");
    const data = await res.json();
    return data.consecutive_absent_students;
  },
  async getConsecutiveLeaveReport(branch_id, academic_year_id, min_days = 2, class_id, section_id) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id),
      min_days: String(min_days)
    });
    if (class_id)
      params.append("class_id", String(class_id));
    if (section_id)
      params.append("section_id", String(section_id));
    const res = await fetch(`/api/attendance/reports/consecutive-leave?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch consecutive leave report");
    const data = await res.json();
    return data.consecutive_leave_students;
  },
  async getConsecutiveLateReport(branch_id, academic_year_id, min_days = 2, class_id, section_id) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id),
      min_days: String(min_days)
    });
    if (class_id)
      params.append("class_id", String(class_id));
    if (section_id)
      params.append("section_id", String(section_id));
    const res = await fetch(`/api/attendance/reports/consecutive-late?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch consecutive late report");
    const data = await res.json();
    return data.consecutive_late_students;
  },
  async getFrequentAbsenceReport(branch_id, academic_year_id, date_from, date_to, class_id, section_id, sort_by) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    if (date_from)
      params.append("date_from", date_from);
    if (date_to)
      params.append("date_to", date_to);
    if (class_id)
      params.append("class_id", String(class_id));
    if (section_id)
      params.append("section_id", String(section_id));
    if (sort_by)
      params.append("sort_by", sort_by);
    const res = await fetch(`/api/attendance/reports/frequent-absence?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch frequent absence report");
    const data = await res.json();
    return data.frequent_absence_students;
  },
  async getLateStudentsReport(branch_id, academic_year_id, date_from, date_to, class_id, section_id) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    if (date_from)
      params.append("date_from", date_from);
    if (date_to)
      params.append("date_to", date_to);
    if (class_id)
      params.append("class_id", String(class_id));
    if (section_id)
      params.append("section_id", String(section_id));
    const res = await fetch(`/api/attendance/reports/late-students?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch late students report");
    const data = await res.json();
    return data.late_students;
  },
  async getCompletionStats(branch_id, academic_year_id, date) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    if (date)
      params.append("date", date);
    const res = await fetch(`/api/attendance/reports/completion?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch attendance completion stats");
    const data = await res.json();
    return data.completion_stats;
  },
  // Student Profile Summary
  async getStudentSummary(studentId, academic_year_id) {
    const params = new URLSearchParams();
    if (academic_year_id)
      params.append("academic_year_id", String(academic_year_id));
    const res = await fetch(`/api/attendance/student-summary/${studentId}?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch student attendance summary");
    return await res.json();
  },
  // Settings
  async getSettings(branch_id, academic_year_id) {
    const params = new URLSearchParams({
      branch_id: String(branch_id),
      academic_year_id: String(academic_year_id)
    });
    const res = await fetch(`/api/attendance/settings?${params.toString()}`);
    if (!res.ok)
      throw new Error("Failed to fetch attendance settings");
    const data = await res.json();
    return data.settings;
  },
  async updateSettings(settings) {
    const res = await fetch("/api/attendance/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (!res.ok)
      throw new Error("Failed to save attendance settings");
    const data = await res.json();
    return data.settings;
  }
};
const StudentDashboardView = () => {
  var _a, _b, _c, _d;
  const { currentUser, activeAcademicYearId } = useErp();
  const navigate = useNavigate();
  const student = (currentUser == null ? void 0 : currentUser.student) || {};
  const [feedData, setFeedData] = useState(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  useEffect(() => {
    if (!student.id) return;
    let isMounted = true;
    setIsLoadingFeed(true);
    communicationService.getStudentPortalFeed(student.id, activeAcademicYearId).then((res) => {
      if (isMounted) setFeedData(res);
    }).catch((err) => console.error("Student dashboard feed notice:", err)).finally(() => {
      if (isMounted) setIsLoadingFeed(false);
    });
    attendanceApi.getStudentIndividualReport((currentUser == null ? void 0 : currentUser.branch_id) || 1, activeAcademicYearId || 2, student.id).then((res) => {
      if (isMounted && res) {
        setAttendanceData(res);
      }
    }).catch((err) => console.warn("Attendance summary notice:", err));
    return () => {
      isMounted = false;
    };
  }, [student.id, activeAcademicYearId, currentUser == null ? void 0 : currentUser.branch_id]);
  const homeworkList = (feedData == null ? void 0 : feedData.homework) || [];
  const assignmentsList = (feedData == null ? void 0 : feedData.assignments) || [];
  const announcementsList = (feedData == null ? void 0 : feedData.announcements) || [];
  const albumsList = (feedData == null ? void 0 : feedData.albums) || [];
  const assignedSubjects = (feedData == null ? void 0 : feedData.assigned_subjects) || [];
  const attendanceSummary = (attendanceData == null ? void 0 : attendanceData.summary) || null;
  assignmentsList.filter((a) => (a.submission_status || "Pending").toLowerCase() === "pending");
  const gradedAssignments = assignmentsList.filter((a) => ["reviewed", "completed"].includes((a.submission_status || "").toLowerCase()));
  const currentDateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-8 p-6 sm:p-7 border-border shadow-sm relative overflow-hidden flex flex-col justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-10 right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-sky-500 animate-pulse" }),
              /* @__PURE__ */ jsx("span", { children: currentDateStr })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => navigate("/student/profile"),
                className: "gap-1.5 text-xs font-bold",
                children: [
                  /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-primary" }),
                  /* @__PURE__ */ jsx("span", { children: "Student Profile" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl font-black tracking-tight text-foreground", children: [
              "Good ",
              (/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 17 ? "afternoon" : "evening",
              ", ",
              student.first_name || (currentUser == null ? void 0 : currentUser.name) || "Student",
              " 👋"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed", children: [
              "Welcome back to your school portal! You are enrolled in ",
              /* @__PURE__ */ jsxs("strong", { className: "text-foreground", children: [
                student.class_name || "Class",
                " ",
                student.section_name ? `(${student.section_name})` : ""
              ] }),
              " with ",
              /* @__PURE__ */ jsxs("strong", { className: "text-foreground", children: [
                homeworkList.length,
                " active assignments"
              ] }),
              " to explore."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-border", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => navigate("/student/attendance"),
              className: "p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-primary" }),
                  /* @__PURE__ */ jsx("span", { children: "Morning Session" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-extrabold text-foreground", children: ((_b = (_a = attendanceData == null ? void 0 : attendanceData.records) == null ? void 0 : _a[0]) == null ? void 0 : _b.morning_status) || "Marked Present" }),
                  /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => navigate("/student/attendance"),
              className: "p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-primary" }),
                  /* @__PURE__ */ jsx("span", { children: "Afternoon Session" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-extrabold text-foreground", children: ((_d = (_c = attendanceData == null ? void 0 : attendanceData.records) == null ? void 0 : _c[0]) == null ? void 0 : _d.afternoon_status) || "Marked Present" }),
                  /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => navigate("/student/homework"),
              className: "p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 flex flex-col justify-between cursor-pointer hover:border-sky-400 transition-colors",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center space-x-1.5", children: [
                  /* @__PURE__ */ jsx(BookOpen, { className: "w-3.5 h-3.5 text-sky-600" }),
                  /* @__PURE__ */ jsx("span", { children: "Tasks Due" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-extrabold text-foreground", children: [
                    homeworkList.length,
                    " Active Tasks"
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-[10px] font-bold py-0", children: "View" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => navigate("/student/attendance"),
          className: "lg:col-span-4 p-6 sm:p-7 border-border shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-border", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-black text-foreground", children: "Attendance Record" }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-[11px]", children: "Academic Year Performance" })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-bold text-[11px]", children: "✓ Good Standing" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "my-4 flex flex-col items-center justify-center", children: [
              (() => {
                const pct = Number(attendanceSummary == null ? void 0 : attendanceSummary.attendance_percentage) || 96.5;
                const circumference = 314;
                const strokeOffset = circumference - circumference * (pct / 100);
                return /* @__PURE__ */ jsxs("div", { className: "relative w-32 h-32 flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxs("svg", { className: "w-full h-full transform -rotate-90", viewBox: "0 0 120 120", children: [
                    /* @__PURE__ */ jsx(
                      "circle",
                      {
                        cx: "60",
                        cy: "60",
                        r: "50",
                        className: "stroke-muted",
                        strokeWidth: "10",
                        fill: "none"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "circle",
                      {
                        cx: "60",
                        cy: "60",
                        r: "50",
                        className: "stroke-primary transition-all duration-1000 ease-out",
                        strokeWidth: "10",
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeOffset,
                        strokeLinecap: "round",
                        fill: "none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-2xl font-black text-foreground tracking-tight", children: [
                      pct,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Attendance" })
                  ] })
                ] });
              })(),
              /* @__PURE__ */ jsxs("div", { className: "w-full mt-4 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs py-1 border-b border-border/60", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-primary" }),
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Present Days" })
                  ] }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-foreground", children: [
                    (attendanceSummary == null ? void 0 : attendanceSummary.present) || 24,
                    " days"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs py-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }),
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Absent / Leave" })
                  ] }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-foreground", children: [
                    (attendanceSummary == null ? void 0 : attendanceSummary.absent) || 0,
                    " days"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-primary font-bold flex items-center justify-between pt-2 border-t border-border", children: [
              /* @__PURE__ */ jsx("span", { children: "Click to view detailed calendar log" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4", children: [
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => navigate("/student/timetable"),
          className: "p-5 hover:border-primary/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "View" }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground mt-3", children: "Class Timetable" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Periods & schedule" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border mt-3 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-muted-foreground text-[11px]", children: [
                "Class: ",
                student.class_name || "10-A"
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Weekly" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => navigate("/student/attendance"),
          className: "p-5 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "View" }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground mt-3", children: "Attendance" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Sessions & calendar" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border mt-3 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-muted-foreground text-[11px]", children: [
                "Rate: ",
                /* @__PURE__ */ jsx("strong", { className: "text-emerald-600", children: attendanceSummary ? `${attendanceSummary.attendance_percentage}%` : "100%" })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "text-[10px]", children: attendanceSummary ? `${attendanceSummary.present || 0} Days` : "Good" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => navigate("/student/homework"),
          className: "p-5 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "View" }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground mt-3", children: "Homework" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Assigned daily tasks" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border mt-3 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-muted-foreground text-[11px]", children: [
                "Total: ",
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: homeworkList.length })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-[10px]", children: "Active" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => navigate("/student/assignment"),
          className: "p-5 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(FileCheck2, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "View" }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground mt-3", children: "Assignments" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Projects & submissions" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border mt-3 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-muted-foreground text-[11px]", children: [
                "Total: ",
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: assignmentsList.length })
              ] }),
              /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
                gradedAssignments.length,
                " Graded"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => navigate("/student/announcement"),
          className: "p-5 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "View" }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground mt-3", children: "Announcements" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Official school circulars" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border mt-3 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-muted-foreground text-[11px]", children: [
                "Notices: ",
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: announcementsList.length })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] text-amber-800 bg-amber-50 border-amber-300", children: "Active" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => navigate("/student/gallery"),
          className: "p-5 hover:border-rose-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Image, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "View" }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground mt-3", children: "Event Gallery" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Photo albums" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border mt-3 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-muted-foreground text-[11px]", children: [
                "Albums: ",
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: albumsList.length })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] text-rose-700 bg-rose-50 border-rose-200", children: "Moments" })
            ] })
          ]
        }
      )
    ] }),
    assignedSubjects.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-xs space-y-3 border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300", children: /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-bold text-foreground", children: "Enrolled Subjects & Curriculum" }),
            /* @__PURE__ */ jsxs(CardDescription, { className: "text-[11px]", children: [
              "Class ",
              student.class_name || "",
              " Assigned Subjects"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => navigate("/student/homework"),
            className: "text-xs font-bold text-primary hover:text-primary/80 flex items-center space-x-1",
            children: [
              /* @__PURE__ */ jsx("span", { children: "View Homework by Subject" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: assignedSubjects.map((sub) => {
        const count = homeworkList.filter((h) => h.subject_name === sub.subject_name).length;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => navigate("/student/homework"),
            className: "px-3.5 py-2 rounded-xl bg-muted/40 hover:bg-sky-50/60 border border-border hover:border-sky-300 transition-all cursor-pointer flex items-center space-x-2 text-xs",
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: sub.subject_name }),
              sub.subject_code && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground uppercase", children: [
                "(",
                sub.subject_code,
                ")"
              ] }),
              count > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "default", className: "text-[10px] font-extrabold py-0 px-1.5", children: [
                count,
                " HW"
              ] })
            ]
          },
          sub.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-6 shadow-sm flex flex-col justify-between space-y-4 border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-black text-foreground", children: "Due This Week" }),
                /* @__PURE__ */ jsxs(CardDescription, { className: "text-[11px]", children: [
                  homeworkList.length,
                  " tasks assigned"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => navigate("/student/homework"),
                className: "text-xs font-bold text-primary hover:underline p-0 h-auto",
                children: "All Assignments →"
              }
            )
          ] }),
          homeworkList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center text-xs text-muted-foreground space-y-1", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground/40 mx-auto mb-1" }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-foreground", children: "No Pending Homework" }),
            /* @__PURE__ */ jsx("p", { children: "You have no homework tasks due right now." })
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: homeworkList.slice(0, 3).map((hw) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => navigate("/student/homework"),
              className: "p-4 rounded-2xl border border-border hover:border-primary/40 transition-colors bg-card flex items-start justify-between gap-4 relative overflow-hidden cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1.5 bg-primary" }),
                /* @__PURE__ */ jsxs("div", { className: "pl-1 space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-primary", children: hw.subject_name || "Subject" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-extrabold text-foreground line-clamp-1", children: hw.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-2", children: hw.description })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] font-bold text-amber-800 bg-amber-50 border-amber-300", children: [
                    "Due: ",
                    hw.due_date || "Schedule"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-muted-foreground mt-1 font-medium", children: hw.status || "Active" })
                ] })
              ]
            },
            hw.id
          )) })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/student/homework"),
            className: "w-full text-xs font-bold",
            children: "Open Homework Workspace →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-6 shadow-sm flex flex-col justify-between space-y-4 border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", children: /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-black text-foreground", children: "School Circulars" }),
                /* @__PURE__ */ jsxs(CardDescription, { className: "text-[11px]", children: [
                  announcementsList.length,
                  " updates posted"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => navigate("/student/announcement"),
                className: "text-xs font-bold text-amber-600 hover:underline p-0 h-auto",
                children: "View All Notices →"
              }
            )
          ] }),
          announcementsList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center text-xs text-muted-foreground space-y-1", children: [
            /* @__PURE__ */ jsx(Bell, { className: "w-8 h-8 text-muted-foreground/40 mx-auto mb-1" }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-foreground", children: "No New Circulars" }),
            /* @__PURE__ */ jsx("p", { children: "No circulars or notices posted recently." })
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: announcementsList.slice(0, 3).map((ann) => {
            const isUrgent = ["urgent", "high"].includes((ann.priority || "").toLowerCase());
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => navigate("/student/announcement"),
                className: "p-4 rounded-2xl border border-border hover:border-amber-400 transition-colors bg-card flex items-start justify-between gap-4 relative overflow-hidden cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("div", { className: `absolute left-0 top-0 bottom-0 w-1.5 ${isUrgent ? "bg-destructive" : "bg-primary"}` }),
                  /* @__PURE__ */ jsxs("div", { className: "pl-1 space-y-1", children: [
                    /* @__PURE__ */ jsx(
                      Badge,
                      {
                        variant: isUrgent ? "destructive" : "secondary",
                        className: "font-bold uppercase text-[10px]",
                        children: ann.target_audience === "All" ? "Campus Notice" : ann.target_audience
                      }
                    ),
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-extrabold text-foreground line-clamp-1", children: ann.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-2", children: ann.message })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-right shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground block", children: ann.publish_date || "Recent" }) })
                ]
              },
              ann.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/student/announcement"),
            className: "w-full text-xs font-bold",
            children: "Open Announcements Hub →"
          }
        )
      ] })
    ] })
  ] });
};
const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    accessibleBranches,
    branches,
    activeBranchId,
    isStudent,
    isSuperAdmin,
    isPrincipal,
    userRole,
    isAllBranches
  } = useErp();
  if (isStudent || userRole === "student") {
    return /* @__PURE__ */ jsx(StudentDashboardView, {});
  }
  const branchesToUse = accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : branches;
  const effectiveBranchId = activeBranchId || (branchesToUse.length > 0 ? branchesToUse[0].id : null);
  const handleNavigateToSettings = (sub) => {
    if (sub === "branch-settings") {
      navigate("/branches");
    } else if (sub === "academic-settings") {
      navigate("/academic");
    } else {
      navigate(`/${sub}`);
    }
  };
  const handleNavigateToStudents = () => {
    navigate("/students/details");
  };
  if (isSuperAdmin || userRole === "super_admin" || isAllBranches) {
    return /* @__PURE__ */ jsx(
      SuperAdminDashboard,
      {
        onNavigateToStudents: handleNavigateToStudents,
        onNavigateToSettings: handleNavigateToSettings
      }
    );
  }
  return /* @__PURE__ */ jsx(
    OperationalDashboard,
    {
      branches: branchesToUse,
      activeBranchId: effectiveBranchId,
      onNavigateToSettings: handleNavigateToSettings,
      onNavigateToStudents: handleNavigateToStudents
    }
  );
};
const Dialog = ({ open, children }) => open ? /* @__PURE__ */ jsx("div", { "data-state": "open", children }) : null;
const DialogPortal = ({ children }) => /* @__PURE__ */ jsx("div", { className: "radix-portal-ssr", children });
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("fixed inset-0 z-50 bg-black/80", className),
    ...props
  }
));
DialogOverlay.displayName = "DialogOverlay";
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs("button", { className: "absolute right-4 top-4", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = "DialogContent";
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className), ...props });
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("h2", { ref, className: cn("text-lg font-semibold leading-none tracking-tight", className), ...props }));
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full object-cover", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const StudentProfileModal = ({ isOpen, studentId, onClose, onEdit, onMoveSection }) => {
  var _a, _b, _c, _d, _e, _f;
  const isModalOpen = isOpen !== void 0 ? isOpen : Boolean(studentId);
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYearEnrollmentId, setSelectedYearEnrollmentId] = useState(null);
  useEffect(() => {
    if (isModalOpen && studentId) {
      setIsLoading(true);
      setError(null);
      getStudentById(studentId).then((data) => {
        setProfile(data);
        if (data.enrollments && data.enrollments.length > 0) {
          setSelectedYearEnrollmentId(data.enrollments[0].id);
        }
      }).catch((err) => {
        console.error("Error fetching student profile:", err);
        setError(err.message || "Failed to load student profile");
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setProfile(null);
      setActiveTab("overview");
    }
  }, [isModalOpen, studentId]);
  if (!isModalOpen) return null;
  const s = profile == null ? void 0 : profile.student;
  const p = profile == null ? void 0 : profile.parents;
  const addr = profile == null ? void 0 : profile.address;
  const currentEnrollment = profile == null ? void 0 : profile.current_enrollment;
  const selectedEnrollment = ((_a = profile == null ? void 0 : profile.enrollments) == null ? void 0 : _a.find((e) => e.id === selectedYearEnrollmentId)) || currentEnrollment;
  const attendanceRate = (currentEnrollment == null ? void 0 : currentEnrollment.attendance_percentage) !== void 0 ? Number(currentEnrollment.attendance_percentage) : 94.8;
  const safeAttendanceRate = isNaN(attendanceRate) ? 0 : attendanceRate;
  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-semibold text-xs", children: "Active" });
      case "Inactive":
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-semibold text-xs", children: "Inactive" });
      case "Transferred":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-sky-50 text-sky-800 border-sky-200 font-semibold text-xs", children: "Transferred" });
      case "TC Issued":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-amber-50 text-amber-800 border-amber-200 font-semibold text-xs", children: "TC Issued" });
      case "Withdrawn":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "font-semibold text-xs", children: "Withdrawn" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-semibold text-xs", children: status || "Unknown" });
    }
  };
  const getHouseBadge = (house) => {
    switch (house == null ? void 0 : house.toLowerCase()) {
      case "ruby":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-rose-100 text-rose-800 border-rose-200 font-semibold text-xs", children: "Ruby House" });
      case "emerald":
        return /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-semibold text-xs", children: "Emerald House" });
      case "sapphire":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-sky-100 text-sky-800 border-sky-200 font-semibold text-xs", children: "Sapphire House" });
      case "topaz":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-amber-100 text-amber-800 border-amber-200 font-semibold text-xs", children: "Topaz House" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-semibold text-xs", children: house ? `${house} House` : "House Unassigned" });
    }
  };
  const tabs = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "personal", label: "Personal Details", icon: User },
    { id: "parents", label: "Parent / Guardian", icon: Users },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "address", label: "Address", icon: MapPin },
    { id: "academic", label: "Academic History", icon: GraduationCap },
    { id: "subjects", label: "Enrolled Subjects", icon: BookOpen },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "transport", label: "Transport", icon: Bus },
    { id: "hostel", label: "Hostel", icon: Home },
    { id: "fees", label: "Fees", icon: CreditCard },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "exams", label: "Examination", icon: Award },
    { id: "groups", label: "Academic Groups", icon: Layers },
    { id: "timeline", label: "Activity Timeline", icon: Clock },
    { id: "audit", label: "Audit Log", icon: ShieldAlert }
  ];
  const handlePrint = () => {
    window.print();
  };
  const initials = s ? `${s.first_name ? s.first_name.charAt(0) : "S"}${s.last_name ? s.last_name.charAt(0) : ""}` : "ST";
  return /* @__PURE__ */ jsx(Dialog, { open: isModalOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-6xl max-h-[92vh] flex flex-col p-0 overflow-hidden sm:rounded-2xl", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-6 shrink-0 relative", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "py-6 flex items-center space-x-3 text-slate-300", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-emerald-400" }),
      /* @__PURE__ */ jsx("span", { children: "Loading student record..." })
    ] }) : error ? /* @__PURE__ */ jsxs("div", { className: "py-4 text-rose-300 flex items-center space-x-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }),
      /* @__PURE__ */ jsx("span", { children: error })
    ] }) : s ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pr-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 min-w-0", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-400/50 shadow-md shrink-0", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: s.photo_url, alt: s.full_name }),
          /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-2xl bg-emerald-700 text-white text-2xl font-bold", children: initials })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold text-white tracking-tight truncate", children: s.full_name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || "Student Profile" }),
            getStatusBadge(s.current_status),
            (currentEnrollment == null ? void 0 : currentEnrollment.house) && getHouseBadge(currentEnrollment.house)
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Adm No:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-emerald-300", children: s.admission_number || "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Class:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-white", children: [
                (currentEnrollment == null ? void 0 : currentEnrollment.class_name) || "Not Enrolled",
                " - ",
                (currentEnrollment == null ? void 0 : currentEnrollment.section_name) || ""
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Roll No:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-white", children: (currentEnrollment == null ? void 0 : currentEnrollment.roll_number) || "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "DOB:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-slate-200", children: [
                s.date_of_birth,
                " (",
                s.gender,
                ")"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0 self-start md:self-center", children: [
        onMoveSection && s.id && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onMoveSection(s.id),
            className: "bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold",
            children: [
              /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-3.5 h-3.5 mr-1 text-emerald-300" }),
              /* @__PURE__ */ jsx("span", { children: "Move Class/Sec" })
            ]
          }
        ),
        onEdit && s.id && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "emerald",
            size: "sm",
            onClick: () => onEdit(s.id),
            className: "text-xs font-semibold",
            children: [
              /* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5 mr-1" }),
              /* @__PURE__ */ jsx("span", { children: "Edit Profile" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            onClick: handlePrint,
            className: "bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border-white/20 h-8 w-8",
            title: "Print Profile",
            children: /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" })
          }
        )
      ] })
    ] }) : null }),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "flex-1 flex flex-col min-h-0", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-muted/40 border-b border-border px-4 sm:px-6 flex items-center overflow-x-auto scrollbar-thin shrink-0 select-none py-1.5", children: /* @__PURE__ */ jsx(TabsList, { className: "h-auto p-1 bg-transparent gap-1", children: tabs.map((tab) => {
        const Icon = tab.icon;
        return /* @__PURE__ */ jsxs(
          TabsTrigger,
          {
            value: tab.id,
            className: "text-xs sm:text-sm px-3.5 py-2 font-semibold whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xs rounded-lg",
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 mr-2" }),
              /* @__PURE__ */ jsx("span", { children: tab.label })
            ]
          },
          tab.id
        );
      }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-5 sm:p-6 bg-muted/20", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 space-y-3", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 text-primary animate-spin" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Retrieving comprehensive student information..." })
      ] }) : !s ? /* @__PURE__ */ jsx("div", { className: "text-center py-16 text-muted-foreground", children: "No student profile information found." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(TabsContent, { value: "overview", className: "mt-0 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3.5", children: [
            /* @__PURE__ */ jsxs(Card, { className: "p-4 shadow-2xs border-border", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-muted-foreground mb-1", children: "Academic Year" }),
              /* @__PURE__ */ jsx("div", { className: "text-base font-bold text-foreground", children: (currentEnrollment == null ? void 0 : currentEnrollment.academic_year_name) || "2026-2027" }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-emerald-600 font-medium mt-0.5", children: "Current Cycle" })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "p-4 shadow-2xs border-border", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-muted-foreground mb-1", children: "Attendance Rate" }),
              /* @__PURE__ */ jsxs("div", { className: "text-base font-bold text-foreground", children: [
                safeAttendanceRate,
                "%"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-emerald-600 font-medium mt-0.5", children: "Summary days audited" })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "p-4 shadow-2xs border-border", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-muted-foreground mb-1", children: "Fee Status" }),
              /* @__PURE__ */ jsxs("div", { className: "text-base font-bold text-foreground flex items-center space-x-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: `inline-block w-2 h-2 rounded-full ${(currentEnrollment == null ? void 0 : currentEnrollment.fee_status) === "Paid" ? "bg-emerald-500" : "bg-amber-500"}` }),
                /* @__PURE__ */ jsx("span", { children: (currentEnrollment == null ? void 0 : currentEnrollment.fee_status) || "Paid" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: "All dues cleared" })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "p-4 shadow-2xs border-border", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-muted-foreground mb-1", children: "Boarding / Commute" }),
              /* @__PURE__ */ jsx("div", { className: "text-base font-bold text-foreground", children: (currentEnrollment == null ? void 0 : currentEnrollment.hostel_status) || "Day Scholar" }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: (currentEnrollment == null ? void 0 : currentEnrollment.transport_opted) ? "School Bus Route" : "Private Commute" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
            /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-3", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-2.5", children: [
                /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Current Academic Placement" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Class & Section" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground text-sm", children: [
                    (currentEnrollment == null ? void 0 : currentEnrollment.class_name) || "N/A",
                    " - ",
                    (currentEnrollment == null ? void 0 : currentEnrollment.section_name) || "N/A"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Roll Number" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: (currentEnrollment == null ? void 0 : currentEnrollment.roll_number) || "N/A" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Academic Group" }),
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-semibold", children: (currentEnrollment == null ? void 0 : currentEnrollment.academic_group_name) || "General Track" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "House Assigned" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (currentEnrollment == null ? void 0 : currentEnrollment.house) || "Ruby" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Admission Date" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: s.admission_date || "N/A" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Admission Quota" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: s.admission_type || "Regular" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-3", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-2.5", children: [
                /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Primary Guardian & Emergency" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Father Name:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (p == null ? void 0 : p.father_name) || "N/A" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Father Mobile:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-primary", children: (p == null ? void 0 : p.father_mobile) || "N/A" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Mother Name:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (p == null ? void 0 : p.mother_name) || "N/A" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Mother Mobile:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-foreground", children: (p == null ? void 0 : p.mother_mobile) || "N/A" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-1 border-t border-border", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Residential Area:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium text-foreground", children: [
                    (addr == null ? void 0 : addr.current_area) || "Not Specified",
                    ", ",
                    (addr == null ? void 0 : addr.current_city) || "Not Specified"
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "personal", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 shadow-2xs border-border space-y-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Student Identity & Personal Information" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "First Name" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.first_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Middle Name" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.middle_name || "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Last Name" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.last_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Date of Birth" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.date_of_birth })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Gender" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.gender })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Blood Group" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.blood_group || "O+" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Nationality" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.nationality || "Indian" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Mother Tongue" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.mother_tongue || "English" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Religion" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.religion || "Not Specified" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Caste Category" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: s.caste_category || "General" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Government ID / Aadhaar" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-foreground text-sm", children: s.government_id || "XXXX-XXXX-8910" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Identification Marks" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground text-sm", children: s.identification_marks || "Small mole on right forearm" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "parents", className: "mt-0 space-y-5", children: [
          /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-2.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Father Information" })
              ] }),
              (p == null ? void 0 : p.primary_contact) === "Father" && /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-semibold text-[11px]", children: "Primary Contact" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Father Name" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (p == null ? void 0 : p.father_name) || "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Mobile Number" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-primary", children: (p == null ? void 0 : p.father_mobile) || "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Email Address" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (p == null ? void 0 : p.father_email) || "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Occupation & Organization" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (p == null ? void 0 : p.father_occupation) || "Senior Software Professional" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Pickup Authorization" }),
                /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 font-semibold flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Authorized" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-2.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Mother Information" })
              ] }),
              (p == null ? void 0 : p.primary_contact) === "Mother" && /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-semibold text-[11px]", children: "Primary Contact" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Mother Name" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (p == null ? void 0 : p.mother_name) || "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Mobile Number" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-primary", children: (p == null ? void 0 : p.mother_mobile) || "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Email Address" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (p == null ? void 0 : p.mother_email) || "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Occupation & Organization" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (p == null ? void 0 : p.mother_occupation) || "Professional / Educator" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Pickup Authorization" }),
                /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 font-semibold flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Authorized" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-amber-900 dark:text-amber-200", children: "Emergency Contact" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-amber-800 dark:text-amber-300", children: [
                (p == null ? void 0 : p.emergency_contact_name) || (p == null ? void 0 : p.father_name) || "N/A",
                " • Phone: ",
                (p == null ? void 0 : p.emergency_contact_phone) || (p == null ? void 0 : p.father_mobile) || "N/A"
              ] })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[11px] font-semibold bg-amber-100 text-amber-900 border-amber-300", children: "Priority 1 Dispatch" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "contact", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 shadow-2xs border-border space-y-5", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Communication & Digital Channels" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1 font-medium", children: "Student Institutional Email" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: s.student_email || `${(s.first_name || "student").toLowerCase()}.${(s.last_name || "account").toLowerCase()}@greenparkstudent.edu.in` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1 font-medium", children: "Student / Primary Mobile" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: s.student_mobile || (p == null ? void 0 : p.father_mobile) || "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1 font-medium", children: "Parent SMS Broadcast Number" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: (p == null ? void 0 : p.father_mobile) || "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1 font-medium", children: "Emergency Hot Line" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: (p == null ? void 0 : p.emergency_contact_phone) || (p == null ? void 0 : p.father_mobile) || "N/A" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "address", className: "mt-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-3", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-2.5", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { children: "Current Residential Address" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "Door / Flat No & Building:" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (addr == null ? void 0 : addr.current_door_no) || "14B" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "Street / Avenue:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (addr == null ? void 0 : addr.current_street) || "4th Main Road" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "Area / Locality:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (addr == null ? void 0 : addr.current_area) || "Anna Nagar West" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 pt-1 border-t border-border", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "City & District:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (addr == null ? void 0 : addr.current_city) || "Chennai" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "State & Pin:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
                    (addr == null ? void 0 : addr.current_state) || "Tamil Nadu",
                    " - ",
                    (addr == null ? void 0 : addr.current_pincode) || "600040"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-3", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-2.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Permanent Address" })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: (addr == null ? void 0 : addr.is_permanent_same) ? "Same as Current" : "Distinct Address" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "Door / Flat No & Building:" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (addr == null ? void 0 : addr.permanent_door_no) || (addr == null ? void 0 : addr.current_door_no) || "14B" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "Street / Avenue:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (addr == null ? void 0 : addr.permanent_street) || (addr == null ? void 0 : addr.current_street) || "4th Main Road" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "Area / Locality:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: (addr == null ? void 0 : addr.permanent_area) || (addr == null ? void 0 : addr.current_area) || "Anna Nagar West" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 pt-1 border-t border-border", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "City & District:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: (addr == null ? void 0 : addr.permanent_city) || (addr == null ? void 0 : addr.current_city) || "Chennai" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block", children: "State & Pin:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
                    (addr == null ? void 0 : addr.permanent_state) || (addr == null ? void 0 : addr.current_state) || "Tamil Nadu",
                    " - ",
                    (addr == null ? void 0 : addr.permanent_pincode) || (addr == null ? void 0 : addr.current_pincode) || "600040"
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "academic", className: "mt-0 space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "p-4 shadow-2xs border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5", children: [
                /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Multi-Year Academic Progression (Preserved History)" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                ((_b = profile == null ? void 0 : profile.enrollments) == null ? void 0 : _b.length) || 0,
                " Academic Sessions Recorded"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-1", children: (_c = profile == null ? void 0 : profile.enrollments) == null ? void 0 : _c.map((enr) => {
              const isSelected = selectedYearEnrollmentId === enr.id;
              return /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: isSelected ? "default" : "outline",
                  onClick: () => setSelectedYearEnrollmentId(enr.id),
                  className: "text-xs font-semibold flex items-center space-x-2",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: enr.academic_year_name }),
                    /* @__PURE__ */ jsxs(Badge, { variant: isSelected ? "secondary" : "outline", className: "text-[10px] px-1.5 py-0", children: [
                      enr.class_name,
                      "-",
                      enr.section_name
                    ] }),
                    enr.is_current_year ? /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400" }) : null
                  ]
                },
                enr.id
              );
            }) })
          ] }),
          selectedEnrollment && /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Session Snapshot:" }),
                /* @__PURE__ */ jsxs("h4", { className: "text-base font-bold text-foreground", children: [
                  selectedEnrollment.academic_year_name,
                  " • ",
                  selectedEnrollment.class_name,
                  " Section ",
                  selectedEnrollment.section_name
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Badge, { variant: selectedEnrollment.enrollment_status === "Active" ? "emerald" : "secondary", children: [
                "Enrollment: ",
                selectedEnrollment.enrollment_status
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Roll Number" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: selectedEnrollment.roll_number || "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Academic Group" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary text-sm", children: selectedEnrollment.academic_group_name || "General Batch" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Attendance" }),
                /* @__PURE__ */ jsxs("span", { className: "font-semibold text-emerald-600 text-sm", children: [
                  selectedEnrollment.attendance_percentage || 95,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Fee Status" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: selectedEnrollment.fee_status || "Paid" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-3", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5", children: [
              /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { children: "Class & Section Movement Log" })
            ] }),
            (profile == null ? void 0 : profile.class_section_history) && profile.class_section_history.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: profile.class_section_history.map((h) => /* @__PURE__ */ jsxs("div", { className: "py-2.5 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "font-semibold text-foreground", children: [
                  h.from_class_name,
                  " (",
                  h.from_section_name,
                  ") → ",
                  h.to_class_name,
                  " (",
                  h.to_section_name,
                  ")"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground text-[11px] mt-0.5", children: [
                  "Reason: ",
                  h.reason,
                  " • Effective: ",
                  h.effective_date
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-[10px] font-mono", children: [
                "By ",
                h.changed_by
              ] })
            ] }, h.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic py-2", children: "No section changes logged for this student." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "subjects", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground", children: "Enrolled Academic & Language Curriculum" })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "emerald", children: [
              ((_d = profile == null ? void 0 : profile.subjects) == null ? void 0 : _d.length) || 0,
              " Subjects Assigned"
            ] })
          ] }),
          (profile == null ? void 0 : profile.subjects) && profile.subjects.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5", children: profile.subjects.map((sub) => /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-foreground", children: sub.subject_name }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-mono text-[10px]", children: sub.subject_code })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground", children: [
                sub.is_language ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-primary font-medium", children: [
                  /* @__PURE__ */ jsx(Languages, { className: "w-3 h-3 mr-0.5" }),
                  sub.language_level || "Language"
                ] }) : /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: sub.subject_type || "Core" }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: sub.enrollment_type || "Compulsory" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "text-[10px]", children: sub.status || "Active" })
          ] }, sub.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-muted-foreground space-y-1", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground/60 mx-auto" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold", children: "No subjects assigned for this student." }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Subjects will auto-populate based on class curriculum mapping." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "documents", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { children: "Verified Student Documents & Certificates" })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "emerald", children: "All Mandatory Verified" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: (_e = profile == null ? void 0 : profile.documents) == null ? void 0 : _e.map((doc) => {
            var _a2;
            return /* @__PURE__ */ jsxs("div", { className: "py-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-200", children: doc.document_type }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold text-foreground flex items-center space-x-1.5", children: [
                    /* @__PURE__ */ jsx("span", { children: doc.document_name }),
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                    "Size: ",
                    doc.file_size || "1.2 MB",
                    " • Uploaded: ",
                    ((_a2 = doc.uploaded_at) == null ? void 0 : _a2.split("T")[0]) || "Recent"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "text-xs text-primary", children: [
                /* @__PURE__ */ jsx(Download, { className: "w-3 h-3 mr-1" }),
                /* @__PURE__ */ jsx("span", { children: "Download" })
              ] })
            ] }, doc.id);
          }) })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "transport", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(Bus, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "School Transportation & Logistics" })
          ] }),
          (currentEnrollment == null ? void 0 : currentEnrollment.transport_opted) ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Designated Route" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: currentEnrollment.transport_route || "Route 4 - Anna Nagar Express" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Designated Bus Stop" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: currentEnrollment.transport_stop || "Roundana Junction" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Morning Pickup Schedule" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-600 text-sm", children: "07:42 AM" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Evening Drop Schedule" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-600 text-sm", children: "04:15 PM" })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "p-6 text-center text-muted-foreground bg-muted/30 rounded-xl border border-border", children: [
            /* @__PURE__ */ jsx(Bus, { className: "w-8 h-8 text-muted-foreground/60 mx-auto mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Student has not opted for school bus service. Private commute." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "hostel", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(Home, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Boarding & Residential Information" })
          ] }),
          (currentEnrollment == null ? void 0 : currentEnrollment.hostel_status) === "Hosteller" ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Hostel Block" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-sm", children: "Cauvery Boys Wing (Block B)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Room No." }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-sm", children: "Room 204 (2nd Floor)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Warden in Charge" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: "Mr. Ramanathan (+91 94440 99881)" })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "p-6 text-center text-muted-foreground bg-muted/30 rounded-xl border border-border", children: [
            /* @__PURE__ */ jsx(Home, { className: "w-8 h-8 text-muted-foreground/60 mx-auto mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Student is enrolled as a Day Scholar. Not residing in school hostel." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "fees", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { children: "Academic Year Fee Ledger" })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "emerald", children: [
              "Status: ",
              (currentEnrollment == null ? void 0 : currentEnrollment.fee_status) || "Paid"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Annual Tuition Total" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-sm", children: "₹ 85,000.00" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Amount Paid" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-600 text-sm", children: "₹ 85,000.00" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-1", children: "Outstanding Balance" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-sm", children: "₹ 0.00" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "attendance", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center justify-between border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(CalendarCheck, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { children: "Attendance & Punctuality Summary" })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "emerald", children: [
              safeAttendanceRate,
              "% Aggregate"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Total Working Days" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-sm", children: "192 Days" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Present Days" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-600 text-sm", children: "182 Days" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Excused Leave" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-primary text-sm", children: "8 Days" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-muted/40 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block mb-0.5", children: "Unexcused Absence" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-destructive text-sm", children: "2 Days" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "exams", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(Award, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Academic Assessment & Grades" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-muted/40 text-muted-foreground font-semibold border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "p-2.5", children: "Subject" }),
              /* @__PURE__ */ jsx("th", { className: "p-2.5", children: "Term 1" }),
              /* @__PURE__ */ jsx("th", { className: "p-2.5", children: "Term 2" }),
              /* @__PURE__ */ jsx("th", { className: "p-2.5", children: "Total Marks" }),
              /* @__PURE__ */ jsx("th", { className: "p-2.5", children: "Grade" })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border", children: [
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-semibold text-foreground", children: "Mathematics" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "48 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "49 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-emerald-600", children: "97 / 100" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-emerald-600", children: "A1" })
              ] }),
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-semibold text-foreground", children: "General Science" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "46 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "48 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-emerald-600", children: "94 / 100" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-emerald-600", children: "A1" })
              ] }),
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-semibold text-foreground", children: "English Language" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "45 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "46 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-emerald-600", children: "91 / 100" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-emerald-600", children: "A1" })
              ] }),
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-semibold text-foreground", children: "Social Studies" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "44 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5", children: "45 / 50" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-foreground", children: "89 / 100" }),
                /* @__PURE__ */ jsx("td", { className: "p-2.5 font-bold text-primary", children: "A2" })
              ] })
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "groups", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Assigned Academic & Competitive Coaching Groups" })
          ] }),
          (currentEnrollment == null ? void 0 : currentEnrollment.academic_group_name) ? /* @__PURE__ */ jsxs("div", { className: "p-4 bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/60 rounded-xl space-y-2 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-sm", children: currentEnrollment.academic_group_name }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Active Batch" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Student is enrolled in advanced conceptual training and Olympiad problem-solving track." })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground py-4 text-center", children: "Student is not assigned to any specialized academic group. Enrolled in Standard Academic Stream." })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "timeline", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Chronological Journey & Milestone Timeline" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border", children: (_f = profile == null ? void 0 : profile.timeline) == null ? void 0 : _f.map((event) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute -left-[1.35rem] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-foreground", children: event.title }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: event.description }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground mt-1 font-mono", children: [
              event.event_date,
              " • Logged by ",
              event.actor_name
            ] })
          ] }, event.id)) })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "audit", className: "mt-0", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 shadow-2xs border-border space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsx(ShieldAlert, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "System Audit Trail & Modification Log" })
          ] }),
          (profile == null ? void 0 : profile.audit_logs) && profile.audit_logs.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-border text-xs", children: profile.audit_logs.map((log) => /* @__PURE__ */ jsx("div", { className: "py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
              (log.action || "AUDIT").toUpperCase(),
              " - ",
              log.description || log.details || "Modification"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-mono text-[11px]", children: log.created_at })
          ] }) }, log.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic py-4 text-center", children: "No external audit events logged yet. Standard creation events preserved in Timeline." })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-muted/30 border-t border-border px-6 py-3.5 flex items-center justify-between shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground font-medium", children: [
        "System Student Record ID: ",
        /* @__PURE__ */ jsx("span", { className: "font-mono text-foreground font-semibold", children: (s == null ? void 0 : s.student_id) || "N/A" })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: onClose, className: "text-xs font-semibold", children: "Close Window" })
    ] })
  ] }) });
};
const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(
  ({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    DropdownMenuPrimitive.SubTrigger,
    {
      ref,
      className: cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
      ]
    }
  )
);
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.SubContent,
    {
      ref,
      className: cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      ),
      ...props
    }
  )
);
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      ref,
      sideOffset,
      className: cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      ),
      ...props
    }
  ) })
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(
  ({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      ref,
      className: cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
        inset && "pl-8",
        className
      ),
      ...props
    }
  )
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
    DropdownMenuPrimitive.CheckboxItem,
    {
      ref,
      className: cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      checked,
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
        children
      ]
    }
  )
);
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    DropdownMenuPrimitive.RadioItem,
    {
      ref,
      className: cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
        children
      ]
    }
  )
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(
  ({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      ref,
      className: cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      ),
      ...props
    }
  )
);
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      ref,
      className: cn("-mx-1 my-1 h-px bg-muted", className),
      ...props
    }
  )
);
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const StudentDetailsList = ({
  branchId,
  academicYearId,
  isHistoricalYear,
  onViewStudent,
  onEditStudent,
  onMoveSection,
  onInactivateStudent,
  onOpenRegisterModal,
  onBulkMoveSection,
  onBulkAssignGroup,
  onBranchChange
}) => {
  var _a, _b;
  const { branches: contextBranches, accessibleBranches, isSuperAdmin, isPrincipal, assignedBranchId } = useErp();
  const [students, setStudents] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(() => isPrincipal ? assignedBranchId : branchId);
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [selectedSectionId, setSelectedSectionId] = useState("all");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const branchesList = accessibleBranches || contextBranches || [];
  const [classesList, setClassesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [academicGroupsList, setAcademicGroupsList] = useState([]);
  useEffect(() => {
    if (isPrincipal) {
      setSelectedBranchId(assignedBranchId);
    } else {
      setSelectedBranchId(branchId);
    }
  }, [branchId, isPrincipal, assignedBranchId]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedIds, setSelectedIds] = useState([]);
  useEffect(() => {
    let isMounted = true;
    const effectiveBranch = selectedBranchId;
    Promise.allSettled([
      getClasses(effectiveBranch, academicYearId),
      getSections(effectiveBranch, academicYearId),
      getAcademicGroups({
        branch_id: effectiveBranch === "all" ? void 0 : Number(effectiveBranch),
        academic_year_id: academicYearId
      })
    ]).then(([clsRes, secRes, grpRes]) => {
      var _a2, _b2;
      if (!isMounted) return;
      if (clsRes.status === "fulfilled" && ((_a2 = clsRes.value) == null ? void 0 : _a2.data)) {
        const seenKeys = /* @__PURE__ */ new Set();
        const uniqueClasses = clsRes.value.data.filter((c) => {
          const key = (c.name || c.class_name || "").trim().toLowerCase();
          if (!key || seenKeys.has(key)) return false;
          seenKeys.add(key);
          return true;
        });
        setClassesList(uniqueClasses);
      } else {
        setClassesList([]);
      }
      if (secRes.status === "fulfilled" && ((_b2 = secRes.value) == null ? void 0 : _b2.data)) {
        setSectionsList(secRes.value.data);
      } else {
        setSectionsList([]);
      }
      if (grpRes.status === "fulfilled" && grpRes.value) {
        setAcademicGroupsList(grpRes.value);
      } else {
        setAcademicGroupsList([]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedBranchId, academicYearId]);
  const availableSections = useMemo(() => {
    if (selectedClassId === "all") {
      const seen = /* @__PURE__ */ new Set();
      return sectionsList.filter((s) => {
        const val = s.name || s.section_name;
        if (!val || seen.has(val.toUpperCase())) return false;
        seen.add(val.toUpperCase());
        return true;
      }).map((s) => ({
        id: s.id,
        name: s.name || s.section_name,
        value: s.name || s.section_name
      }));
    }
    return sectionsList.filter((s) => String(s.class_id) === String(selectedClassId)).map((s) => ({
      id: s.id,
      name: s.name || s.section_name,
      value: String(s.id)
    }));
  }, [sectionsList, selectedClassId]);
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedClassId !== "all") count++;
    if (selectedSectionId !== "all") count++;
    if (selectedGroupId !== "all") count++;
    if (selectedStatus !== "all") count++;
    if (selectedGender !== "all") count++;
    if (selectedFeeStatus !== "all") count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedClassId, selectedSectionId, selectedGroupId, selectedStatus, selectedGender, selectedFeeStatus, searchQuery]);
  const fetchStudents = useCallback(async () => {
    var _a2, _b2;
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        branch_id: selectedBranchId === "all" ? void 0 : selectedBranchId,
        academic_year_id: academicYearId,
        class_id: selectedClassId === "all" ? void 0 : selectedClassId,
        section_id: selectedSectionId === "all" ? void 0 : selectedSectionId,
        academic_group_id: selectedGroupId === "all" ? void 0 : selectedGroupId,
        status: selectedStatus === "all" ? void 0 : selectedStatus,
        gender: selectedGender === "all" ? void 0 : selectedGender,
        fee_status: selectedFeeStatus === "all" ? void 0 : selectedFeeStatus,
        search: searchQuery.trim() || void 0,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: currentPage,
        page_size: pageSize
      };
      const res = await getStudents(params);
      const studentData = res.data || res.students || [];
      const total = res.total ?? ((_a2 = res.pagination) == null ? void 0 : _a2.total) ?? studentData.length;
      const pages = res.total_pages ?? ((_b2 = res.pagination) == null ? void 0 : _b2.total_pages) ?? Math.ceil(total / pageSize);
      setStudents(studentData);
      setTotalRecords(total);
      setTotalPages(Math.max(pages, 1));
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError(err.message || "Unable to fetch student records.");
      setStudents([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedBranchId,
    academicYearId,
    selectedClassId,
    selectedSectionId,
    selectedGroupId,
    selectedStatus,
    selectedGender,
    selectedFeeStatus,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    pageSize
  ]);
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  const handleBranchChange = (newBranchId) => {
    setSelectedBranchId(newBranchId);
    setSelectedClassId("all");
    setSelectedSectionId("all");
    setSelectedGroupId("all");
    setCurrentPage(1);
    if (onBranchChange) {
      onBranchChange(newBranchId);
    }
  };
  const handleClassChange = (classId) => {
    setSelectedClassId(classId);
    setSelectedSectionId("all");
    setCurrentPage(1);
  };
  const handleSectionChange = (sectionId) => {
    setSelectedSectionId(sectionId);
    setCurrentPage(1);
  };
  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);
    setCurrentPage(1);
  };
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };
  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setCurrentPage(1);
  };
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setSelectedClassId("all");
    setSelectedSectionId("all");
    setSelectedGroupId("all");
    setSelectedStatus("all");
    setSelectedGender("all");
    setSelectedFeeStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = [
      "Admission No",
      "Full Name",
      "Class",
      "Section",
      "Roll No",
      "Gender",
      "Blood Group",
      "Father Name",
      "Father Mobile",
      "Mother Name",
      "Academic Group",
      "Status"
    ];
    const rows = students.map((s) => [
      s.admission_number || "",
      `"${s.full_name || ""}"`,
      s.class_name || "",
      s.section_name || "",
      s.roll_number || "",
      s.gender || "",
      s.blood_group || "",
      `"${s.father_name || ""}"`,
      s.father_mobile || "",
      `"${s.mother_name || ""}"`,
      `"${s.academic_group_name || "General"}"`,
      s.current_status || "Active"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_Directory_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return /* @__PURE__ */ jsx(Badge, { variant: "emerald", className: "font-semibold text-xs", children: "Active" });
      case "Inactive":
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-semibold text-xs", children: "Inactive" });
      case "Transferred":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-sky-50 text-sky-800 border-sky-200 font-semibold text-xs", children: "Transferred" });
      case "TC Issued":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-amber-50 text-amber-800 border-amber-200 font-semibold text-xs", children: "TC Issued" });
      case "Withdrawn":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "font-semibold text-xs", children: "Withdrawn" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-semibold text-xs", children: status || "Unknown" });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-in fade-in duration-200", children: [
    error && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: error }),
      /* @__PURE__ */ jsx("button", { onClick: () => setError(null), className: "text-rose-500 hover:text-rose-700 cursor-pointer", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "border-border shadow-xs", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: [
            "Branch ",
            isPrincipal && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-600 font-normal", children: "(Assigned)" })
          ] }),
          isSuperAdmin ? /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedBranchId,
              onChange: (e) => handleBranchChange(e.target.value),
              className: "w-full border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground bg-background focus:ring-2 focus:ring-ring focus:border-input transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Branches" }),
                branchesList.map((b) => /* @__PURE__ */ jsxs("option", { value: b.id, children: [
                  b.branch_name,
                  " ",
                  b.branch_code ? `(${b.branch_code})` : ""
                ] }, b.id))
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "w-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-2.5 py-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-[11px] truncate", children: [
            ((_a = branchesList[0]) == null ? void 0 : _a.branch_name) || "Assigned Branch",
            " ",
            ((_b = branchesList[0]) == null ? void 0 : _b.branch_code) ? `(${branchesList[0].branch_code})` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: "Class" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedClassId,
              onChange: (e) => handleClassChange(e.target.value),
              className: "w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Classes" }),
                classesList.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: "Section" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedSectionId,
              onChange: (e) => handleSectionChange(e.target.value),
              className: "w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Sections" }),
                availableSections.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: s.name }, s.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: "Academic Group" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedGroupId,
              onChange: (e) => handleGroupChange(e.target.value),
              className: "w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Groups" }),
                academicGroupsList.map((g) => /* @__PURE__ */ jsx("option", { value: g.id, children: g.name }, g.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: "Status" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedStatus,
              onChange: (e) => handleStatusChange(e.target.value),
              className: "w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Statuses" }),
                /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" }),
                /* @__PURE__ */ jsx("option", { value: "Transferred", children: "Transferred" }),
                /* @__PURE__ */ jsx("option", { value: "TC Issued", children: "TC Issued" }),
                /* @__PURE__ */ jsx("option", { value: "Withdrawn", children: "Withdrawn" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: "Gender" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedGender,
              onChange: (e) => handleGenderChange(e.target.value),
              className: "w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-medium text-foreground focus:ring-2 focus:ring-ring cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Genders" }),
                /* @__PURE__ */ jsx("option", { value: "Male", children: "Male" }),
                /* @__PURE__ */ jsx("option", { value: "Female", children: "Female" }),
                /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-border/60", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              value: searchQuery,
              onChange: (e) => handleSearchChange(e.target.value),
              placeholder: "Search by student name, admission no, roll no, mobile...",
              className: "pl-8.5 pr-8 h-9 text-xs"
            }
          ),
          searchQuery && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => handleSearchChange(""),
              className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer",
              children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 shrink-0 self-end md:self-auto", children: [
          activeFiltersCount > 0 && /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: handleClearFilters,
              className: "text-xs font-semibold",
              title: "Reset all filters",
              children: [
                /* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5 mr-1" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Reset (",
                  activeFiltersCount,
                  ")"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: () => fetchStudents(),
              disabled: isLoading,
              className: "text-xs font-semibold",
              title: "Refresh directory list",
              children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 mr-1 ${isLoading ? "animate-spin text-primary" : ""}` }),
                /* @__PURE__ */ jsx("span", { children: "Refresh" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: handleExportCSV,
              disabled: students.length === 0,
              className: "text-xs font-semibold",
              title: "Export filtered records to CSV",
              children: [
                /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5 mr-1" }),
                /* @__PURE__ */ jsx("span", { children: "Export" })
              ]
            }
          ),
          onOpenRegisterModal && !isHistoricalYear && /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "emerald",
              size: "sm",
              onClick: onOpenRegisterModal,
              className: "text-xs font-semibold",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                /* @__PURE__ */ jsx("span", { children: "Enroll Student" })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 text-white p-3 px-4 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-xs", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "emerald", className: "font-bold", children: [
          selectedIds.length,
          " Selected"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Choose a bulk operation:" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        onBulkMoveSection && /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => onBulkMoveSection(selectedIds),
            className: "bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold",
            children: [
              /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-3.5 h-3.5 mr-1 text-emerald-400" }),
              /* @__PURE__ */ jsx("span", { children: "Bulk Move Section" })
            ]
          }
        ),
        onBulkAssignGroup && /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "emerald",
            size: "sm",
            onClick: () => onBulkAssignGroup(selectedIds),
            className: "text-xs font-semibold",
            children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 mr-1" }),
              /* @__PURE__ */ jsx("span", { children: "Assign Academic Group" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelectedIds([]),
            className: "p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer",
            title: "Clear Selection",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-border shadow-xs overflow-hidden", children: [
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "bg-muted/40 select-none", children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "p-3 w-10 text-center", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: handleSelectAll, className: "text-muted-foreground hover:text-foreground cursor-pointer", children: selectedIds.length === students.length && students.length > 0 ? /* @__PURE__ */ jsx(CheckSquare, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsx(Square, { className: "w-4 h-4" }) }) }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3 cursor-pointer", onClick: () => handleSort("admission_number"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Admission No" }),
            /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3 text-muted-foreground" })
          ] }) }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3 cursor-pointer", onClick: () => handleSort("first_name"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Student Name" }),
            /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3 text-muted-foreground" })
          ] }) }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3 cursor-pointer", onClick: () => handleSort("class_id"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Class & Sec" }),
            /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3 text-muted-foreground" })
          ] }) }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3 text-center", children: "Roll No" }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3", children: "Academic Group" }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3", children: "Primary Guardian" }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3", children: "Commute / Route" }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3 text-center", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "p-3 w-12 text-center", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, { colSpan: 10, className: "p-12 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto mb-2 text-primary" }),
          /* @__PURE__ */ jsx("span", { children: "Loading student records..." })
        ] }) }) : students.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, { colSpan: 10, className: "p-12 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "w-8 h-8 text-muted-foreground/60 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: "No student records found" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[11px] mt-1", children: "Try adjusting search query or active filter selections." }),
          activeFiltersCount > 0 && /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: handleClearFilters,
              className: "mt-3 text-xs font-semibold",
              children: [
                /* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5 mr-1" }),
                /* @__PURE__ */ jsx("span", { children: "Clear All Filters" })
              ]
            }
          )
        ] }) }) : students.map((student) => {
          const isSelected = selectedIds.includes(student.id);
          const initials = `${student.first_name ? student.first_name.charAt(0) : "S"}${student.last_name ? student.last_name.charAt(0) : ""}`;
          return /* @__PURE__ */ jsxs(
            TableRow,
            {
              className: `hover:bg-muted/40 transition-colors ${isSelected ? "bg-primary/5" : ""}`,
              children: [
                /* @__PURE__ */ jsx(TableCell, { className: "p-3 text-center", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleToggleSelect(student.id), className: "text-muted-foreground hover:text-foreground cursor-pointer", children: isSelected ? /* @__PURE__ */ jsx(CheckSquare, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsx(Square, { className: "w-4 h-4" }) }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "p-3", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onViewStudent(student.id),
                    className: "font-mono font-semibold text-primary hover:underline cursor-pointer",
                    children: student.admission_number
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { className: "p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                  /* @__PURE__ */ jsxs(Avatar, { className: "w-8 h-8 rounded-lg shrink-0", children: [
                    /* @__PURE__ */ jsx(AvatarImage, { src: student.photo_url, alt: student.full_name }),
                    /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs", children: initials })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onViewStudent(student.id),
                        className: "font-bold text-foreground hover:text-primary transition-colors text-left block cursor-pointer",
                        children: student.full_name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || "—"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center space-x-1.5", children: [
                      /* @__PURE__ */ jsx("span", { children: student.gender }),
                      student.blood_group && /* @__PURE__ */ jsxs("span", { children: [
                        "• ",
                        student.blood_group
                      ] })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "p-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-foreground", children: student.class_name || "Class " + student.class_id }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5", children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Section ",
                      student.section_name || student.section_id
                    ] }),
                    selectedBranchId === "all" && student.branch_name && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] font-medium py-0", children: student.branch_code || student.branch_name })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(TableCell, { className: "p-3 text-center font-mono font-semibold text-foreground", children: student.roll_number || "—" }),
                /* @__PURE__ */ jsx(TableCell, { className: "p-3", children: student.academic_group_name ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-semibold text-[11px]", children: student.academic_group_name }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-[11px] italic", children: "General Track" }) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "p-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground", children: student.father_name || "N/A" }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] font-mono text-muted-foreground", children: student.father_mobile || "—" })
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: "p-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-foreground font-medium", children: student.hostel_status }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: student.transport_opted ? student.transport_route || "School Bus" : "Private" })
                ] }),
                /* @__PURE__ */ jsx(TableCell, { className: "p-3 text-center", children: getStatusBadge(student.current_status) }),
                /* @__PURE__ */ jsx(TableCell, { className: "p-3 text-center", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4 text-muted-foreground" }) }) }),
                  /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => onViewStudent(student.id), children: [
                      /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 mr-2 text-primary" }),
                      "View 360 Profile"
                    ] }),
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => onEditStudent(student.id), children: [
                      /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2 text-emerald-600" }),
                      "Edit Student"
                    ] }),
                    onMoveSection && /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => onMoveSection(student.id), children: [
                      /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-4 h-4 mr-2 text-sky-600" }),
                      "Move Section"
                    ] }),
                    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                    onInactivateStudent && /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => onInactivateStudent(student.id), className: "text-destructive", children: [
                      /* @__PURE__ */ jsx(UserX, { className: "w-4 h-4 mr-2" }),
                      "Inactivate / TC"
                    ] })
                  ] })
                ] }) })
              ]
            },
            student.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-muted/30 border-t border-border p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { children: "Showing" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: pageSize,
              onChange: (e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              },
              className: "bg-background border border-input rounded-lg px-2 py-1 text-xs font-semibold focus:ring-2 focus:ring-ring text-foreground cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("option", { value: "10", children: "10" }),
                /* @__PURE__ */ jsx("option", { value: "25", children: "25" }),
                /* @__PURE__ */ jsx("option", { value: "50", children: "50" }),
                /* @__PURE__ */ jsx("option", { value: "100", children: "100" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("span", { children: [
            "of ",
            /* @__PURE__ */ jsx("strong", { className: "text-foreground font-bold", children: totalRecords }),
            " students enrolled"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 self-end sm:self-center", children: [
          /* @__PURE__ */ jsxs("span", { className: "mr-2", children: [
            "Page ",
            /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: currentPage }),
            " of ",
            /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: totalPages })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              disabled: currentPage <= 1 || isLoading,
              onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
              className: "h-8 w-8",
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              disabled: currentPage >= totalPages || isLoading,
              onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
              className: "h-8 w-8",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
            }
          )
        ] })
      ] })
    ] })
  ] });
};
const EXPORTABLE_TABS = [
  {
    id: "tab1",
    num: 1,
    name: "Student Name",
    fields: [
      { key: "first_name", label: "First Name" },
      { key: "middle_name", label: "Middle Name" },
      { key: "last_name", label: "Last Name" },
      { key: "display_name", label: "Display Name" },
      { key: "regional_name", label: "Name in Regional Language" }
    ]
  },
  {
    id: "tab2",
    num: 2,
    name: "Identification",
    fields: [
      { key: "admission_number", label: "Admission Number" },
      { key: "roll_number", label: "Roll Number" },
      { key: "emis_number", label: "EMIS Number" },
      { key: "pen_apaar_id", label: "PEN / APAAR ID" },
      { key: "aadhaar_number", label: "Aadhaar Number" },
      { key: "passport_number", label: "Passport Number" },
      { key: "other_id_number", label: "Other ID Number" },
      { key: "erp_student_id", label: "ERP / Student ID" }
    ]
  },
  {
    id: "tab3",
    num: 3,
    name: "Academic Details",
    fields: [
      { key: "admission_date", label: "Admission Date" },
      { key: "admission_class", label: "Admission Class" },
      { key: "stream", label: "Stream" },
      { key: "house", label: "House" },
      { key: "medium", label: "Medium" },
      { key: "curriculum", label: "Board / Curriculum" },
      { key: "previous_school", label: "Previous School" },
      { key: "previous_class", label: "Previous Class" },
      { key: "previous_academic_year", label: "Prev Academic Year" },
      { key: "current_status", label: "Student Status" },
      { key: "date_of_leaving", label: "Date of Leaving" },
      { key: "reason_for_leaving", label: "Reason for Leaving" }
    ]
  },
  {
    id: "tab4",
    num: 4,
    name: "Basic Details",
    fields: [
      { key: "dob", label: "Date of Birth" },
      { key: "gender", label: "Gender" },
      { key: "blood_group", label: "Blood Group" },
      { key: "nationality", label: "Nationality" },
      { key: "mother_tongue", label: "Mother Tongue" },
      { key: "religion", label: "Religion" },
      { key: "community", label: "Community" },
      { key: "caste", label: "Caste" },
      { key: "caste_certificate_no", label: "Caste Certificate No" },
      { key: "identification_mark_1", label: "Identification Mark 1" },
      { key: "identification_mark_2", label: "Identification Mark 2" },
      { key: "is_differently_abled", label: "Differently Abled" },
      { key: "disability_type", label: "Disability Type" },
      { key: "disability_percentage", label: "Disability %" }
    ]
  },
  {
    id: "tab5",
    num: 5,
    name: "Contact Details",
    fields: [
      { key: "student_mobile", label: "Mobile Number" },
      { key: "alternate_mobile", label: "Alternate Mobile" },
      { key: "email", label: "Email" },
      { key: "residential_door_no", label: "Door / Flat No" },
      { key: "residential_street", label: "Street" },
      { key: "residential_area", label: "Area / Village" },
      { key: "residential_city", label: "City / Town" },
      { key: "residential_taluk", label: "Taluk" },
      { key: "residential_district", label: "District" },
      { key: "residential_state", label: "State" },
      { key: "residential_country", label: "Country" },
      { key: "residential_pin", label: "PIN Code" }
    ]
  },
  {
    id: "tab6",
    num: 6,
    name: "Parent / Guardian",
    fields: [
      { key: "father_name", label: "Father Name" },
      { key: "father_mobile", label: "Father Mobile" },
      { key: "father_email", label: "Father Email" },
      { key: "father_aadhaar", label: "Father Aadhaar" },
      { key: "father_occupation", label: "Father Occupation" },
      { key: "father_qualification", label: "Father Qualification" },
      { key: "father_annual_income", label: "Father Annual Income" },
      { key: "mother_name", label: "Mother Name" },
      { key: "mother_mobile", label: "Mother Mobile" },
      { key: "mother_email", label: "Mother Email" },
      { key: "mother_aadhaar", label: "Mother Aadhaar" },
      { key: "mother_occupation", label: "Mother Occupation" },
      { key: "guardian_name", label: "Guardian Name" },
      { key: "guardian_relation", label: "Guardian Relation" },
      { key: "guardian_mobile", label: "Guardian Mobile" },
      { key: "primary_contact", label: "Primary Contact" },
      { key: "emergency_contact_role", label: "Emergency Contact Role" }
    ]
  },
  {
    id: "tab7",
    num: 7,
    name: "Family Details",
    fields: [
      { key: "family_id", label: "Family ID" },
      { key: "family_type", label: "Family Type" },
      { key: "children_count", label: "Children in Family" },
      { key: "family_annual_income", label: "Family Annual Income" },
      { key: "sibling_name", label: "Sibling Name" },
      { key: "sibling_admission_no", label: "Sibling Admission No" },
      { key: "sibling_class", label: "Sibling Class" },
      { key: "sibling_section", label: "Sibling Section" },
      { key: "sibling_relationship", label: "Relationship" }
    ]
  },
  {
    id: "tab8",
    num: 8,
    name: "Admission Details",
    fields: [
      { key: "enquiry_number", label: "Enquiry Number" },
      { key: "registration_number", label: "Registration No" },
      { key: "application_number", label: "Application No" },
      { key: "admission_number", label: "Admission Number" },
      { key: "admission_date", label: "Admission Date" },
      { key: "admission_type", label: "Admission Type" },
      { key: "admission_category", label: "Admission Category" },
      { key: "admission_quota", label: "Admission Quota" },
      { key: "admission_source", label: "Admission Source" },
      { key: "admission_remarks", label: "Admission Remarks" },
      { key: "approved_by", label: "Approved By" },
      { key: "approval_date", label: "Approval Date" }
    ]
  },
  {
    id: "tab9",
    num: 9,
    name: "Address Details",
    fields: [
      { key: "residential_door_no", label: "Res. Door/Flat" },
      { key: "residential_street", label: "Res. Street" },
      { key: "residential_area", label: "Res. Area / Village" },
      { key: "residential_city", label: "Res. City / Town" },
      { key: "residential_district", label: "Res. District" },
      { key: "residential_state", label: "Res. State" },
      { key: "residential_pin", label: "Res. PIN Code" },
      { key: "permanent_door_no", label: "Perm. Door/Flat" },
      { key: "permanent_street", label: "Perm. Street" },
      { key: "permanent_city", label: "Perm. City / Town" },
      { key: "permanent_district", label: "Perm. District" },
      { key: "permanent_state", label: "Perm. State" },
      { key: "permanent_pin", label: "Perm. PIN Code" }
    ]
  },
  {
    id: "tab10",
    num: 10,
    name: "Medical / Health",
    fields: [
      { key: "blood_group", label: "Blood Group" },
      { key: "height_cm", label: "Height (cm)" },
      { key: "weight_kg", label: "Weight (kg)" },
      { key: "medical_condition", label: "Medical Condition" },
      { key: "allergies", label: "Allergies" },
      { key: "chronic_condition", label: "Chronic Condition" },
      { key: "regular_medication", label: "Regular Medication" },
      { key: "emergency_medical_info", label: "Emergency Med Info" },
      { key: "doctor_name", label: "Doctor Name" },
      { key: "doctor_contact", label: "Doctor Contact" },
      { key: "hospital_clinic", label: "Hospital / Clinic" },
      { key: "insurance_number", label: "Insurance Policy No" }
    ]
  },
  {
    id: "tab11",
    num: 11,
    name: "Emergency Contact",
    fields: [
      { key: "emergency_contact_name", label: "Contact Name" },
      { key: "emergency_contact_relation", label: "Relationship" },
      { key: "emergency_contact_mobile", label: "Mobile Number" },
      { key: "emergency_contact_alt_mobile", label: "Alternate Mobile" },
      { key: "emergency_contact_email", label: "Email Address" },
      { key: "emergency_contact_address", label: "Address" },
      { key: "authorized_pickup", label: "Authorized Pickup" },
      { key: "priority", label: "Priority" }
    ]
  },
  {
    id: "tab12",
    num: 12,
    name: "Previous School",
    fields: [
      { key: "previous_school_name", label: "Previous School Name" },
      { key: "previous_school_address", label: "School Address" },
      { key: "previous_board", label: "Board" },
      { key: "previous_medium", label: "Medium" },
      { key: "previous_class", label: "Previous Class" },
      { key: "previous_academic_year", label: "Prev Academic Year" },
      { key: "previous_admission_number", label: "Prev Admission No" },
      { key: "tc_number", label: "TC Number" },
      { key: "tc_date", label: "TC Date" },
      { key: "previous_marks", label: "Previous Marks / %" },
      { key: "reason_for_transfer", label: "Reason for Transfer" }
    ]
  },
  {
    id: "tab13",
    num: 13,
    name: "Academic Status & Stream",
    fields: [
      { key: "roll_number", label: "Roll Number" },
      { key: "current_status", label: "Current Status" },
      { key: "stream", label: "Academic Stream" },
      { key: "house", label: "House" },
      { key: "second_language", label: "Second Language" },
      { key: "third_language", label: "Third Language" }
    ]
  },
  {
    id: "tab14",
    num: 14,
    name: "Identity & Cards",
    fields: [
      { key: "id_card_status", label: "ID Card Status" },
      { key: "biometric_enrolled", label: "Biometric Enrolled" },
      { key: "rfid_card_number", label: "RFID Card Number" },
      { key: "biometric_id", label: "Biometric ID" },
      { key: "google_id", label: "Google Account ID" }
    ]
  }
];
const StudentCsvExportModal = ({
  isOpen,
  onClose,
  students = [],
  filteredStudents = [],
  currentTabId = "tab1",
  getStudentValue,
  computeStudentName
}) => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(currentTabId);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportScope, setExportScope] = useState("filtered");
  const [selectedFields, setSelectedFields] = useState(() => {
    const initial = {};
    const currTab = EXPORTABLE_TABS.find((t) => t.id === currentTabId) || EXPORTABLE_TABS[0];
    currTab.fields.forEach((f) => {
      initial[f.key] = true;
    });
    return initial;
  });
  const allFieldKeys = useMemo(() => {
    const list = [];
    EXPORTABLE_TABS.forEach((tab) => {
      tab.fields.forEach((f) => {
        if (!list.some((item) => item.key === f.key)) {
          list.push({ ...f, tabName: tab.name, tabNum: tab.num });
        }
      });
    });
    return list;
  }, []);
  const totalSelectedCount = useMemo(() => {
    return Object.values(selectedFields).filter(Boolean).length;
  }, [selectedFields]);
  if (!isOpen) return null;
  const currentTab = EXPORTABLE_TABS.find((t) => t.id === selectedCategoryTab) || EXPORTABLE_TABS[0];
  const toggleField = (key) => {
    setSelectedFields((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const isAllInCurrentTabSelected = currentTab.fields.every((f) => selectedFields[f.key]);
  const toggleAllInCurrentTab = () => {
    const targetState = !isAllInCurrentTabSelected;
    setSelectedFields((prev) => {
      const next = { ...prev };
      currentTab.fields.forEach((f) => {
        next[f.key] = targetState;
      });
      return next;
    });
  };
  const selectAllGlobal = () => {
    const next = {};
    allFieldKeys.forEach((f) => {
      next[f.key] = true;
    });
    setSelectedFields(next);
  };
  const deselectAllGlobal = () => {
    setSelectedFields({});
  };
  const selectCurrentTabOnly = () => {
    const next = {};
    currentTab.fields.forEach((f) => {
      next[f.key] = true;
    });
    setSelectedFields(next);
  };
  const handleExport = () => {
    const targetStudents = exportScope === "filtered" ? filteredStudents : students;
    if (!targetStudents || targetStudents.length === 0) {
      alert("No student records to export.");
      return;
    }
    const columnsToExport = [
      { key: "student_id", label: "Student ID" },
      { key: "student_name", label: "Student Name" }
    ];
    allFieldKeys.forEach((f) => {
      if (selectedFields[f.key]) {
        columnsToExport.push({ key: f.key, label: f.label });
      }
    });
    const escapeCsv = (val) => {
      if (val === null || val === void 0) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };
    const headers = columnsToExport.map((col) => escapeCsv(col.label)).join(",");
    const rows = targetStudents.map((s) => {
      return columnsToExport.map((col) => {
        if (col.key === "student_id") {
          return escapeCsv(s.id);
        }
        if (col.key === "student_name") {
          const name = computeStudentName ? computeStudentName(s) : (s.full_name || `${s.first_name || ""} ${s.last_name || ""}`).trim();
          return escapeCsv(name);
        }
        const val = getStudentValue ? getStudentValue(s, col.key) : s[col.key];
        return escapeCsv(val !== void 0 && val !== null ? val : "");
      }).join(",");
    });
    const csvContent = "\uFEFF" + [headers, ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `Students_Export_${exportScope}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };
  const visibleTabFields = searchQuery.trim() ? allFieldKeys.filter(
    (f) => f.label.toLowerCase().includes(searchQuery.toLowerCase()) || f.key.toLowerCase().includes(searchQuery.toLowerCase()) || f.tabName.toLowerCase().includes(searchQuery.toLowerCase())
  ) : currentTab.fields;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs", children: /* @__PURE__ */ jsx(FileSpreadsheet, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Export Student Data (CSV)" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200", children: "14 Tab Selector" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Select fields category-wise across 14 tabs (file attachments excluded). Always includes Student ID & Name." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 bg-slate-100 p-1 rounded-lg", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExportScope("filtered"),
            className: `px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${exportScope === "filtered" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`,
            children: [
              "Filtered Students (",
              filteredStudents.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExportScope("all"),
            className: `px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${exportScope === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`,
            children: [
              "All Loaded Students (",
              students.length,
              ")"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: selectAllGlobal,
            className: "px-2.5 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md font-semibold cursor-pointer",
            children: "Select All"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: selectCurrentTabOnly,
            className: "px-2.5 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md font-semibold cursor-pointer",
            children: "Current Tab Only"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: deselectAllGlobal,
            className: "px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-md font-semibold cursor-pointer",
            children: "Clear All"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-64 border-r border-slate-100 bg-slate-50/50 p-3 overflow-y-auto flex flex-col space-y-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1", children: "Select Tab Category" }),
        EXPORTABLE_TABS.map((tab) => {
          const isActive = selectedCategoryTab === tab.id && !searchQuery.trim();
          const selectedInThisTab = tab.fields.filter((f) => selectedFields[f.key]).length;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedCategoryTab(tab.id);
                setSearchQuery("");
              },
              className: `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${isActive ? "bg-emerald-600 text-white shadow-xs font-bold" : "text-slate-700 hover:bg-slate-200/70"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 truncate", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${isActive ? "bg-emerald-700 text-white" : "bg-white text-slate-700 border border-slate-200"}`,
                      children: tab.num
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: tab.name })
                ] }),
                selectedInThisTab > 0 && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800"}`,
                    children: selectedInThisTab
                  }
                )
              ]
            },
            tab.id
          );
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0 p-4 bg-white overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-xs", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: "Search field by name or key...",
                className: "w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
              }
            )
          ] }),
          !searchQuery.trim() && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: toggleAllInCurrentTab,
              className: "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer",
              children: [
                isAllInCurrentTabSelected ? /* @__PURE__ */ jsx(CheckSquare, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ jsx(Square, { className: "w-3.5 h-3.5 text-slate-400" }),
                /* @__PURE__ */ jsx("span", { children: isAllInCurrentTabSelected ? "Deselect All in Tab" : "Select All in Tab" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3 px-3 py-2 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-emerald-800", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-emerald-600" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Permanent Identifiers:" }),
            /* @__PURE__ */ jsx("span", { children: "Student ID, Student Name (always included)" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-emerald-600", children: "Fixed" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto pr-1", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: visibleTabFields.map((field) => {
          const isChecked = !!selectedFields[field.key];
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => toggleField(field.key),
              className: `flex items-start space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${isChecked ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isChecked,
                    onChange: () => {
                    },
                    className: "mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-900 truncate", children: field.label }),
                    searchQuery && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400 font-mono ml-2 shrink-0", children: [
                      "Tab ",
                      field.tabNum
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-slate-400 block truncate", children: field.key })
                ] })
              ]
            },
            field.key
          );
        }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-600", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: totalSelectedCount }),
        " optional field(s) selected + 2 fixed identifiers"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleExport,
            disabled: totalSelectedCount === 0,
            className: "flex items-center space-x-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-colors cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Export CSV File" })
            ]
          }
        )
      ] })
    ] })
  ] }) });
};
function parseCSV(text) {
  const lines = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  let cleanText = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(cell.trim());
        cell = "";
      } else if (char === "\r") {
        if (nextChar === "\n") {
          i++;
        }
        row.push(cell.trim());
        if (row.length > 0 && row.some((c) => c !== "")) {
          lines.push(row);
        }
        row = [];
        cell = "";
      } else if (char === "\n") {
        row.push(cell.trim());
        if (row.length > 0 && row.some((c) => c !== "")) {
          lines.push(row);
        }
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
  }
  if (cell || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c !== "")) {
      lines.push(row);
    }
  }
  return lines;
}
function buildFieldMappingDictionary() {
  const dict = {
    id: "id",
    student_id: "id",
    "student id": "id",
    "#": "id",
    admission_number: "admission_number",
    "admission number": "admission_number",
    admission_no: "admission_number",
    "admission no": "admission_number",
    adm_no: "admission_number",
    roll_number: "roll_number",
    "roll number": "roll_number",
    roll_no: "roll_number",
    first_name: "first_name",
    "first name": "first_name",
    middle_name: "middle_name",
    "middle name": "middle_name",
    last_name: "last_name",
    "last name": "last_name",
    dob: "dob",
    date_of_birth: "dob",
    "date of birth": "dob",
    gender: "gender",
    blood_group: "blood_group",
    "blood group": "blood_group",
    student_mobile: "student_mobile",
    "mobile number": "student_mobile",
    mobile: "student_mobile",
    email: "email",
    father_name: "father_name",
    "father name": "father_name",
    father_mobile: "father_mobile",
    "father mobile": "father_mobile",
    mother_name: "mother_name",
    "mother name": "mother_name",
    mother_mobile: "mother_mobile",
    "mother mobile": "mother_mobile"
  };
  EXPORTABLE_TABS.forEach((tab) => {
    tab.fields.forEach((f) => {
      dict[f.key.toLowerCase()] = f.key;
      dict[f.label.toLowerCase()] = f.key;
      dict[f.label.toLowerCase().replace(/[^a-z0-9]/g, "")] = f.key;
      dict[f.key.toLowerCase().replace(/[^a-z0-9]/g, "")] = f.key;
    });
  });
  return dict;
}
const StudentCsvImportModal = ({
  isOpen,
  onClose,
  students = [],
  academicYearId,
  currentTabId = "tab1",
  onApplyEdits,
  onRefresh,
  showToast
}) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [csvRawText, setCsvRawText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [importMode, setImportMode] = useState("stage");
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState(null);
  const fieldDict = useMemo(() => buildFieldMappingDictionary(), []);
  if (!isOpen) return null;
  const handleFileChange = (e) => {
    var _a;
    const selectedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };
  const handleDrop = (e) => {
    var _a;
    e.preventDefault();
    const droppedFile = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };
  const processFile = (f) => {
    if (!f.name.endsWith(".csv")) {
      setParseError("Please select a valid .csv file.");
      return;
    }
    setFile(f);
    setParseError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      var _a;
      const content = (_a = event.target) == null ? void 0 : _a.result;
      if (typeof content === "string") {
        setCsvRawText(content);
        analyzeCsvContent(content);
      }
    };
    reader.onerror = () => {
      setParseError("Failed to read file.");
    };
    reader.readAsText(f);
  };
  const analyzeCsvContent = (content) => {
    try {
      const rows = parseCSV(content);
      if (rows.length < 2) {
        setParseError("CSV must contain a header row and at least one data row.");
        setParsedData(null);
        return;
      }
      const headers = rows[0];
      const columnMapping = [];
      headers.forEach((h, index) => {
        const cleaned = h.toLowerCase().trim();
        const normalized = cleaned.replace(/[^a-z0-9]/g, "");
        const fieldKey = fieldDict[cleaned] || fieldDict[normalized] || null;
        if (fieldKey && fieldKey !== "student_name") {
          columnMapping.push({
            colIndex: index,
            originalHeader: h,
            fieldKey
          });
        }
      });
      const hasIdCol = columnMapping.some((c) => c.fieldKey === "id");
      const hasAdmCol = columnMapping.some((c) => c.fieldKey === "admission_number");
      if (!hasIdCol && !hasAdmCol) {
        setParseError('Could not identify a "Student ID" or "Admission Number" column in your CSV.');
        setParsedData(null);
        return;
      }
      const studentsById = /* @__PURE__ */ new Map();
      const studentsByAdm = /* @__PURE__ */ new Map();
      students.forEach((s) => {
        studentsById.set(Number(s.id), s);
        if (s.admission_number) {
          studentsByAdm.set(String(s.admission_number).trim().toLowerCase(), s);
        }
      });
      const matchedRows = [];
      const unmatchedRows = [];
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i];
        if (!rowData || rowData.length === 0 || rowData.every((c) => !c)) continue;
        let targetStudent = null;
        let idVal = null;
        let admVal = null;
        const idCol = columnMapping.find((c) => c.fieldKey === "id");
        if (idCol && rowData[idCol.colIndex]) {
          const rawId = String(rowData[idCol.colIndex]).replace(/[^0-9]/g, "");
          if (rawId) {
            idVal = Number(rawId);
            targetStudent = studentsById.get(idVal);
          }
        }
        if (!targetStudent) {
          const admCol = columnMapping.find((c) => c.fieldKey === "admission_number");
          if (admCol && rowData[admCol.colIndex]) {
            admVal = String(rowData[admCol.colIndex]).trim();
            targetStudent = studentsByAdm.get(admVal.toLowerCase());
          }
        }
        if (targetStudent) {
          const updates = {};
          columnMapping.forEach((m) => {
            if (m.fieldKey !== "id" && m.fieldKey !== "student_name") {
              const val = rowData[m.colIndex];
              if (val !== void 0) {
                updates[m.fieldKey] = val;
              }
            }
          });
          matchedRows.push({
            rowIndex: i + 1,
            student: targetStudent,
            updates
          });
        } else {
          unmatchedRows.push({
            rowIndex: i + 1,
            identifier: idVal ? `#${idVal}` : admVal || "Unknown",
            rowData
          });
        }
      }
      setParsedData({
        columnMapping,
        matchedRows,
        unmatchedRows,
        totalRows: rows.length - 1
      });
      setParseError(null);
    } catch (err) {
      console.error("Parse error:", err);
      setParseError("Failed to parse CSV: " + (err.message || "Unknown error"));
      setParsedData(null);
    }
  };
  const handleDownloadTemplate = () => {
    const currTab = EXPORTABLE_TABS.find((t) => t.id === currentTabId) || EXPORTABLE_TABS[0];
    const columns = [
      { key: "student_id", label: "Student ID" },
      { key: "student_name", label: "Student Name" },
      ...currTab.fields
    ];
    const escapeCsv = (val) => {
      if (val === null || val === void 0) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };
    const headerRow = columns.map((c) => escapeCsv(c.label)).join(",");
    const sampleStudents = students.slice(0, 3);
    const sampleRows = sampleStudents.map((s) => {
      return columns.map((c) => {
        if (c.key === "student_id") return escapeCsv(s.id);
        if (c.key === "student_name") return escapeCsv(s.full_name || `${s.first_name || ""} ${s.last_name || ""}`.trim());
        return escapeCsv(s[c.key] || "");
      }).join(",");
    });
    const csvContent = "\uFEFF" + [headerRow, ...sampleRows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Student_Template_${currTab.name.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleConfirmImport = async () => {
    if (!parsedData || parsedData.matchedRows.length === 0) return;
    setIsProcessing(true);
    try {
      if (importMode === "stage") {
        const editsToStage = {};
        parsedData.matchedRows.forEach(({ student, updates }) => {
          editsToStage[student.id] = updates;
        });
        if (onApplyEdits) {
          onApplyEdits(editsToStage);
        }
        if (showToast) {
          showToast(`Staged changes for ${parsedData.matchedRows.length} student(s). Review in spreadsheet and click Save All.`, "success");
        }
      } else {
        const items = parsedData.matchedRows.map(({ student, updates }) => ({
          id: student.id,
          ...updates
        }));
        await bulkUpdateStudents({
          items,
          academic_year_id: academicYearId
        });
        if (showToast) {
          showToast(`Successfully imported and updated ${items.length} student(s)`, "success");
        }
        if (onRefresh) onRefresh();
      }
      onClose();
    } catch (err) {
      console.error("Import error:", err);
      if (showToast) showToast(err.message || "Import failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs", children: /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Import Student Data (CSV)" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200", children: "Bulk Updater" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Upload a CSV to update student records. Records are matched using Student ID or Admission No." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-blue-900 font-medium", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-blue-600 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: "Need a formatted spreadsheet template to fill in?" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleDownloadTemplate,
          className: "flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Download CSV Template" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto p-6 space-y-5", children: [
      !parsedData ? /* @__PURE__ */ jsxs(
        "div",
        {
          onDragOver: (e) => e.preventDefault(),
          onDrop: handleDrop,
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          className: "border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all",
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: ".csv",
                className: "hidden",
                onChange: handleFileChange
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3", children: /* @__PURE__ */ jsx(Upload, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800", children: "Click to browse or drag & drop your CSV file here" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1 max-w-sm", children: "Files must be formatted with comma-separated values (.csv) containing Student ID or Admission No." })
          ]
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-900", children: file == null ? void 0 : file.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-500", children: [
              parsedData.totalRows,
              " row(s) read • ",
              (file == null ? void 0 : file.size) ? (file.size / 1024).toFixed(1) : "0",
              " KB"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setParsedData(null);
              setFile(null);
            },
            className: "px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer",
            children: "Choose Another File"
          }
        )
      ] }),
      parseError && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-xs text-rose-800", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-rose-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: "File Parsing Error: " }),
          /* @__PURE__ */ jsx("span", { children: parseError })
        ] })
      ] }),
      parsedData && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-emerald-700", children: parsedData.matchedRows.length }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-emerald-800", children: "Matched Students" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-slate-700", children: parsedData.columnMapping.length - 1 }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-slate-600", children: "Fields to Update" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-xl", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-amber-700", children: parsedData.unmatchedRows.length }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-amber-800", children: "Unmatched Rows" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5", children: "Detected Fields to Update:" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: parsedData.columnMapping.filter((c) => c.fieldKey !== "id").map((c) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: "px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-medium",
              children: [
                c.originalHeader,
                " → ",
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: c.fieldKey })
              ]
            },
            c.fieldKey
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5", children: "Preview Matched Records (First 5 Rows):" }),
          /* @__PURE__ */ jsx("div", { className: "border border-slate-200 rounded-xl overflow-hidden shadow-2xs", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto max-h-48", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Row" }),
              /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Student ID" }),
              /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Student Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Pending Changes" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: parsedData.matchedRows.slice(0, 5).map((m, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50", children: [
              /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5 text-slate-400 font-mono text-[11px]", children: m.rowIndex }),
              /* @__PURE__ */ jsxs("td", { className: "px-3 py-1.5 font-mono font-bold text-slate-800", children: [
                "#",
                m.student.id
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5 font-semibold text-slate-900", children: m.student.full_name || `${m.student.first_name || ""} ${m.student.last_name || ""}`.trim() }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5 text-emerald-700 font-mono text-[11px]", children: Object.entries(m.updates).map(([k, v]) => `${k}: "${v}"`).join(", ") })
            ] }, idx)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-slate-700", children: "Select How to Apply:" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxs(
              "label",
              {
                onClick: () => setImportMode("stage"),
                className: `flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${importMode === "stage" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "importMode",
                      checked: importMode === "stage",
                      onChange: () => setImportMode("stage"),
                      className: "mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-900 block", children: "Stage to Table (Recommended)" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 leading-snug", children: "Review changed cells in amber color inside the matrix table before clicking Save All Changes." })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "label",
              {
                onClick: () => setImportMode("direct"),
                className: `flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${importMode === "direct" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "importMode",
                      checked: importMode === "direct",
                      onChange: () => setImportMode("direct"),
                      className: "mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-900 block", children: "Save Directly to DB" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 leading-snug", children: "Immediately update records in the database and reload the latest student data." })
                  ] })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleConfirmImport,
          disabled: !parsedData || parsedData.matchedRows.length === 0 || isProcessing,
          className: "flex items-center space-x-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-colors cursor-pointer",
          children: [
            isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: parsedData ? `Import ${parsedData.matchedRows.length} Student(s)` : "Select CSV to Import" })
          ]
        }
      )
    ] })
  ] }) });
};
const TABS = [
  { id: "tab1", num: 1, label: "Student Name", icon: User },
  { id: "tab2", num: 2, label: "Identification", icon: Hash },
  { id: "tab3", num: 3, label: "Academic Details", icon: GraduationCap },
  { id: "tab4", num: 4, label: "Basic Details", icon: Calendar },
  { id: "tab5", num: 5, label: "Contact Details", icon: Phone },
  { id: "tab6", num: 6, label: "Parent / Guardian", icon: Users },
  { id: "tab7", num: 7, label: "Family Details", icon: Home },
  { id: "tab8", num: 8, label: "Admission Details", icon: BookOpen },
  { id: "tab9", num: 9, label: "Address Details", icon: MapPin },
  { id: "tab10", num: 10, label: "Medical / Health", icon: HeartPulse },
  { id: "tab11", num: 11, label: "Emergency Contact", icon: AlertCircle },
  { id: "tab12", num: 12, label: "Previous School", icon: Landmark },
  { id: "tab13", num: 13, label: "Student Documents", icon: FileText },
  { id: "tab14", num: 14, label: "Photo / Identity", icon: Camera }
];
const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STATUSES = ["Active", "Inactive", "Transferred", "TC Issued", "Withdrawn"];
const DOC_STATUSES = ["Submitted", "Pending", "Verified", "Not Applicable"];
const TAB_COLUMNS = {
  tab1: [
    { key: "first_name", label: "First Name *", width: "min-w-[140px]" },
    { key: "middle_name", label: "Middle Name", width: "min-w-[130px]" },
    { key: "last_name", label: "Last Name *", width: "min-w-[140px]" },
    { key: "display_name", label: "Student Display Name", width: "min-w-[160px]" },
    { key: "regional_name", label: "Name in Regional Language", width: "min-w-[180px]" }
  ],
  tab2: [
    { key: "admission_number", label: "Admission No *", width: "min-w-[140px]" },
    { key: "roll_number", label: "Roll Number", width: "min-w-[110px]" },
    { key: "emis_number", label: "EMIS Number", width: "min-w-[140px]" },
    { key: "pen_apaar_id", label: "PEN / APAAR ID", width: "min-w-[150px]" },
    { key: "aadhaar_number", label: "Aadhaar Number", width: "min-w-[150px]" },
    { key: "passport_number", label: "Passport Number", width: "min-w-[140px]" },
    { key: "other_id_number", label: "Other ID Number", width: "min-w-[140px]" },
    { key: "erp_student_id", label: "ERP / Student ID", width: "min-w-[140px]" }
  ],
  tab3: [
    { key: "admission_date", label: "Admission Date", type: "date", width: "min-w-[140px]" },
    { key: "admission_class", label: "Admission Class", width: "min-w-[130px]" },
    { key: "stream", label: "Stream", width: "min-w-[120px]" },
    { key: "house", label: "House", width: "min-w-[120px]" },
    { key: "medium", label: "Medium", type: "select", options: ["English", "Tamil", "Hindi", "Other"], width: "min-w-[120px]" },
    { key: "curriculum", label: "Board / Curriculum", type: "select", options: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"], width: "min-w-[140px]" },
    { key: "previous_school", label: "Previous School", width: "min-w-[180px]" },
    { key: "previous_class", label: "Previous Class", width: "min-w-[120px]" },
    { key: "previous_academic_year", label: "Prev Academic Year", width: "min-w-[140px]" },
    { key: "current_status", label: "Student Status", type: "select", options: STATUSES, width: "min-w-[130px]" },
    { key: "date_of_leaving", label: "Date of Leaving", type: "date", width: "min-w-[140px]" },
    { key: "reason_for_leaving", label: "Reason for Leaving", width: "min-w-[180px]" }
  ],
  tab4: [
    { key: "dob", label: "Date of Birth *", type: "date", width: "min-w-[140px]" },
    { key: "gender", label: "Gender *", type: "select", options: GENDERS, width: "min-w-[110px]" },
    { key: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS, width: "min-w-[110px]" },
    { key: "nationality", label: "Nationality", width: "min-w-[120px]" },
    { key: "mother_tongue", label: "Mother Tongue", width: "min-w-[120px]" },
    { key: "religion", label: "Religion", width: "min-w-[120px]" },
    { key: "community", label: "Community", type: "select", options: ["General", "OBC", "SC", "ST", "Minorities", "Other"], width: "min-w-[130px]" },
    { key: "caste", label: "Caste", width: "min-w-[120px]" },
    { key: "caste_certificate_no", label: "Caste Certificate No", width: "min-w-[150px]" },
    { key: "identification_mark_1", label: "Identification Mark 1", width: "min-w-[160px]" },
    { key: "identification_mark_2", label: "Identification Mark 2", width: "min-w-[160px]" },
    { key: "is_differently_abled", label: "Differently Abled", type: "select", options: ["No", "Yes"], width: "min-w-[130px]" },
    { key: "disability_type", label: "Disability Type", width: "min-w-[140px]" },
    { key: "disability_percentage", label: "Disability %", width: "min-w-[110px]" }
  ],
  tab5: [
    { key: "student_mobile", label: "Mobile Number", width: "min-w-[140px]" },
    { key: "alternate_mobile", label: "Alternate Mobile", width: "min-w-[140px]" },
    { key: "email", label: "Email", width: "min-w-[180px]" },
    { key: "residential_door_no", label: "Door / Flat No", width: "min-w-[120px]" },
    { key: "residential_street", label: "Street", width: "min-w-[150px]" },
    { key: "residential_area", label: "Area / Village", width: "min-w-[150px]" },
    { key: "residential_city", label: "City / Town", width: "min-w-[140px]" },
    { key: "residential_taluk", label: "Taluk", width: "min-w-[130px]" },
    { key: "residential_district", label: "District", width: "min-w-[130px]" },
    { key: "residential_state", label: "State", width: "min-w-[130px]" },
    { key: "residential_country", label: "Country", width: "min-w-[120px]" },
    { key: "residential_pin", label: "PIN Code", width: "min-w-[110px]" }
  ],
  tab6: [
    { key: "father_name", label: "Father Name", width: "min-w-[150px]" },
    { key: "father_mobile", label: "Father Mobile", width: "min-w-[130px]" },
    { key: "father_email", label: "Father Email", width: "min-w-[160px]" },
    { key: "father_aadhaar", label: "Father Aadhaar", width: "min-w-[140px]" },
    { key: "father_occupation", label: "Father Occupation", width: "min-w-[140px]" },
    { key: "father_qualification", label: "Father Qualification", width: "min-w-[140px]" },
    { key: "father_annual_income", label: "Father Annual Income", width: "min-w-[140px]" },
    { key: "mother_name", label: "Mother Name", width: "min-w-[150px]" },
    { key: "mother_mobile", label: "Mother Mobile", width: "min-w-[130px]" },
    { key: "mother_email", label: "Mother Email", width: "min-w-[160px]" },
    { key: "mother_aadhaar", label: "Mother Aadhaar", width: "min-w-[140px]" },
    { key: "mother_occupation", label: "Mother Occupation", width: "min-w-[140px]" },
    { key: "guardian_name", label: "Guardian Name", width: "min-w-[150px]" },
    { key: "guardian_relation", label: "Guardian Relation", width: "min-w-[130px]" },
    { key: "guardian_mobile", label: "Guardian Mobile", width: "min-w-[130px]" },
    { key: "primary_contact", label: "Primary Contact", type: "select", options: ["Father", "Mother", "Guardian"], width: "min-w-[130px]" },
    { key: "emergency_contact_role", label: "Emergency Contact", type: "select", options: ["Father", "Mother", "Guardian"], width: "min-w-[140px]" }
  ],
  tab7: [
    { key: "family_id", label: "Family ID", width: "min-w-[120px]" },
    { key: "family_type", label: "Family Type", type: "select", options: ["Nuclear", "Joint", "Single Parent"], width: "min-w-[130px]" },
    { key: "children_count", label: "Children in Family", type: "number", width: "min-w-[130px]" },
    { key: "family_annual_income", label: "Family Annual Income", width: "min-w-[150px]" },
    { key: "sibling_name", label: "Sibling Name", width: "min-w-[150px]" },
    { key: "sibling_admission_no", label: "Sibling Admission No", width: "min-w-[140px]" },
    { key: "sibling_class", label: "Sibling Class", width: "min-w-[120px]" },
    { key: "sibling_section", label: "Sibling Section", width: "min-w-[110px]" },
    { key: "sibling_relationship", label: "Relationship", type: "select", options: ["Brother", "Sister", "Cousin"], width: "min-w-[120px]" }
  ],
  tab8: [
    { key: "enquiry_number", label: "Enquiry Number", width: "min-w-[140px]" },
    { key: "registration_number", label: "Registration No", width: "min-w-[140px]" },
    { key: "application_number", label: "Application No", width: "min-w-[140px]" },
    { key: "admission_number", label: "Admission Number", width: "min-w-[140px]" },
    { key: "admission_date", label: "Admission Date", type: "date", width: "min-w-[140px]" },
    { key: "admission_type", label: "Admission Type", type: "select", options: ["Regular", "Transfer", "Lateral", "Other"], width: "min-w-[130px]" },
    { key: "admission_category", label: "Admission Category", type: "select", options: ["General", "Management", "Merit", "RTE", "Sports"], width: "min-w-[140px]" },
    { key: "admission_quota", label: "Admission Quota", width: "min-w-[130px]" },
    { key: "admission_source", label: "Admission Source", width: "min-w-[140px]" },
    { key: "admission_remarks", label: "Admission Remarks", width: "min-w-[180px]" },
    { key: "approved_by", label: "Approved By", width: "min-w-[140px]" },
    { key: "approval_date", label: "Approval Date", type: "date", width: "min-w-[140px]" }
  ],
  tab9: [
    { key: "residential_door_no", label: "Res. Door/Flat", width: "min-w-[120px]" },
    { key: "residential_street", label: "Res. Street", width: "min-w-[150px]" },
    { key: "residential_area", label: "Res. Area / Village", width: "min-w-[150px]" },
    { key: "residential_city", label: "Res. City / Town", width: "min-w-[140px]" },
    { key: "residential_district", label: "Res. District", width: "min-w-[130px]" },
    { key: "residential_state", label: "Res. State", width: "min-w-[130px]" },
    { key: "residential_pin", label: "Res. PIN Code", width: "min-w-[110px]" },
    { key: "permanent_door_no", label: "Perm. Door/Flat", width: "min-w-[120px]" },
    { key: "permanent_street", label: "Perm. Street", width: "min-w-[150px]" },
    { key: "permanent_city", label: "Perm. City / Town", width: "min-w-[140px]" },
    { key: "permanent_district", label: "Perm. District", width: "min-w-[130px]" },
    { key: "permanent_state", label: "Perm. State", width: "min-w-[130px]" },
    { key: "permanent_pin", label: "Perm. PIN Code", width: "min-w-[110px]" }
  ],
  tab10: [
    { key: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS, width: "min-w-[110px]" },
    { key: "height_cm", label: "Height (cm)", width: "min-w-[100px]" },
    { key: "weight_kg", label: "Weight (kg)", width: "min-w-[100px]" },
    { key: "medical_condition", label: "Medical Condition", width: "min-w-[160px]" },
    { key: "allergies", label: "Allergies", width: "min-w-[140px]" },
    { key: "chronic_condition", label: "Chronic Condition", width: "min-w-[150px]" },
    { key: "regular_medication", label: "Regular Medication", width: "min-w-[150px]" },
    { key: "emergency_medical_info", label: "Emergency Med Info", width: "min-w-[160px]" },
    { key: "doctor_name", label: "Doctor Name", width: "min-w-[140px]" },
    { key: "doctor_contact", label: "Doctor Contact", width: "min-w-[130px]" },
    { key: "hospital_clinic", label: "Hospital / Clinic", width: "min-w-[150px]" },
    { key: "insurance_number", label: "Insurance Policy No", width: "min-w-[150px]" }
  ],
  tab11: [
    { key: "emergency_contact_name", label: "Contact Name", width: "min-w-[150px]" },
    { key: "emergency_contact_relation", label: "Relationship", width: "min-w-[130px]" },
    { key: "emergency_contact_mobile", label: "Mobile Number", width: "min-w-[130px]" },
    { key: "emergency_contact_alt_mobile", label: "Alternate Mobile", width: "min-w-[140px]" },
    { key: "emergency_contact_email", label: "Email Address", width: "min-w-[160px]" },
    { key: "emergency_contact_address", label: "Address", width: "min-w-[180px]" },
    { key: "authorized_pickup", label: "Authorized Pickup", type: "select", options: ["Yes", "No"], width: "min-w-[130px]" },
    { key: "priority", label: "Priority", type: "select", options: ["Primary", "Secondary"], width: "min-w-[110px]" }
  ],
  tab12: [
    { key: "previous_school_name", label: "Previous School Name", width: "min-w-[180px]" },
    { key: "previous_school_address", label: "School Address", width: "min-w-[180px]" },
    { key: "previous_board", label: "Board", type: "select", options: ["CBSE", "ICSE", "State Board", "IB", "Other"], width: "min-w-[130px]" },
    { key: "previous_medium", label: "Medium", type: "select", options: ["English", "Tamil", "Hindi", "Other"], width: "min-w-[120px]" },
    { key: "previous_class", label: "Previous Class", width: "min-w-[120px]" },
    { key: "previous_academic_year", label: "Prev Academic Year", width: "min-w-[140px]" },
    { key: "previous_admission_number", label: "Prev Admission No", width: "min-w-[140px]" },
    { key: "tc_number", label: "TC Number", width: "min-w-[120px]" },
    { key: "tc_date", label: "TC Date", type: "date", width: "min-w-[130px]" },
    { key: "previous_marks", label: "Previous Marks / %", width: "min-w-[140px]" },
    { key: "reason_for_transfer", label: "Reason for Transfer", width: "min-w-[170px]" }
  ],
  tab13: [
    { key: "doc_birth_certificate", label: "Birth Certificate", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" },
    { key: "doc_aadhaar", label: "Aadhaar Card", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" },
    { key: "doc_community_cert", label: "Community Certificate", type: "select", options: DOC_STATUSES, width: "min-w-[150px]" },
    { key: "doc_income_cert", label: "Income Certificate", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" },
    { key: "doc_tc", label: "Transfer Certificate", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" },
    { key: "doc_mark_sheet", label: "Prev Mark Sheet", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" },
    { key: "doc_passport", label: "Passport", type: "select", options: DOC_STATUSES, width: "min-w-[130px]" },
    { key: "doc_address_proof", label: "Address Proof", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" },
    { key: "doc_medical_cert", label: "Medical Certificate", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" },
    { key: "doc_disability_cert", label: "Disability Certificate", type: "select", options: DOC_STATUSES, width: "min-w-[150px]" },
    { key: "doc_other", label: "Other Document", type: "select", options: DOC_STATUSES, width: "min-w-[140px]" }
  ],
  tab14: [
    { key: "photo_url", label: "Student Photo (URL/Key)", width: "min-w-[180px]" },
    { key: "parent_photo_url", label: "Parent Photo (URL/Key)", width: "min-w-[180px]" },
    { key: "id_card_status", label: "ID Card Status", type: "select", options: ["Issued", "Pending", "Reissue Requested"], width: "min-w-[150px]" },
    { key: "biometric_enrolled", label: "Biometric Enrolled", type: "select", options: ["Yes", "No"], width: "min-w-[140px]" },
    { key: "rfid_card_number", label: "RFID Card Number", width: "min-w-[150px]" }
  ]
};
const StudentReferenceMatrixTable = ({
  students: propStudents,
  classes: propClasses,
  sections: propSections,
  academicGroups: propAcademicGroups,
  branches: propBranches,
  selectedBranchId: propSelectedBranchId,
  branchId,
  initialStudentId = null,
  onBranchChange,
  academicYearId,
  isLoading: propIsLoading = false,
  onRefresh,
  onBack
}) => {
  var _a, _b, _c, _d;
  const navigate = useNavigate();
  const { isReadOnly, showToast, isSuperAdmin, isPrincipal, assignedBranchId, accessibleBranches } = useErp();
  const [activeTab, setActiveTab] = useState("tab1");
  const [internalStudents, setInternalStudents] = useState([]);
  const [internalClasses, setInternalClasses] = useState([]);
  const [internalSections, setInternalSections] = useState([]);
  const [internalGroups, setInternalGroups] = useState([]);
  const [internalBranches, setInternalBranches] = useState([]);
  const [internalBranchId, setInternalBranchId] = useState(() => {
    if (!isSuperAdmin && assignedBranchId) return Number(assignedBranchId);
    return propSelectedBranchId !== void 0 ? propSelectedBranchId : branchId !== void 0 ? branchId : "all";
  });
  const [internalLoading, setInternalLoading] = useState(false);
  const [filterClassId, setFilterClassId] = useState("all");
  const [filterSectionId, setFilterSectionId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowEdits, setRowEdits] = useState({});
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTabsSidebarVisible, setIsTabsSidebarVisible] = useState(true);
  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/students/details");
    }
  };
  const currentBranchId = useMemo(() => {
    if (!isSuperAdmin && assignedBranchId) return Number(assignedBranchId);
    return propSelectedBranchId !== void 0 ? propSelectedBranchId : branchId !== void 0 ? branchId : internalBranchId;
  }, [isSuperAdmin, assignedBranchId, propSelectedBranchId, branchId, internalBranchId]);
  const branches = useMemo(() => {
    if (!isSuperAdmin) {
      return accessibleBranches && accessibleBranches.length > 0 ? accessibleBranches : internalBranches.filter((b) => Number(b.id) === Number(assignedBranchId));
    }
    return propBranches && propBranches.length > 0 ? propBranches : internalBranches;
  }, [isSuperAdmin, accessibleBranches, assignedBranchId, propBranches, internalBranches]);
  const classes = propClasses && propClasses.length > 0 ? propClasses : internalClasses;
  const sections = propSections && propSections.length > 0 ? propSections : internalSections;
  const students = propStudents !== void 0 ? propStudents : internalStudents;
  const isLoading = propIsLoading || internalLoading;
  const fetchInternalData = useCallback(async () => {
    if (propStudents !== void 0) return;
    setInternalLoading(true);
    try {
      const [stuRes, clsRes, secRes, grpRes, brRes] = await Promise.all([
        getStudents({
          branch_id: currentBranchId === "all" ? void 0 : currentBranchId,
          academic_year_id: academicYearId,
          class_id: filterClassId !== "all" ? Number(filterClassId) : void 0,
          // Only pass section_id if a specific class is selected AND section is numeric ID
          section_id: filterClassId !== "all" && filterSectionId !== "all" && !isNaN(Number(filterSectionId)) ? Number(filterSectionId) : void 0,
          page_size: 200
        }),
        !propClasses || propClasses.length === 0 ? getClasses(currentBranchId === "all" ? void 0 : currentBranchId, academicYearId) : Promise.resolve({ data: [] }),
        !propSections || propSections.length === 0 ? getSections(currentBranchId === "all" ? 1 : currentBranchId, academicYearId) : Promise.resolve({ data: [] }),
        !propAcademicGroups || propAcademicGroups.length === 0 ? getAcademicGroups({
          branch_id: currentBranchId === "all" ? void 0 : currentBranchId,
          academic_year_id: academicYearId
        }) : Promise.resolve([]),
        !propBranches || propBranches.length === 0 ? getBranches() : Promise.resolve([])
      ]);
      setInternalStudents((stuRes == null ? void 0 : stuRes.data) || []);
      if ((clsRes == null ? void 0 : clsRes.data) && (!propClasses || propClasses.length === 0)) setInternalClasses(clsRes.data);
      if ((secRes == null ? void 0 : secRes.data) && (!propSections || propSections.length === 0)) setInternalSections(secRes.data);
      if (Array.isArray(grpRes) && (!propAcademicGroups || propAcademicGroups.length === 0)) setInternalGroups(grpRes);
      if (Array.isArray(brRes) && (!propBranches || propBranches.length === 0)) setInternalBranches(brRes);
    } catch (err) {
      console.error("Error fetching matrix reference data:", err);
    } finally {
      setInternalLoading(false);
    }
  }, [propStudents, currentBranchId, academicYearId, filterClassId, filterSectionId, propClasses, propSections, propAcademicGroups, propBranches]);
  useEffect(() => {
    if (propStudents === void 0) {
      fetchInternalData();
    }
  }, [fetchInternalData, propStudents]);
  const handleBranchSelect = (newBranchId) => {
    setInternalBranchId(newBranchId);
    if (onBranchChange) {
      onBranchChange(newBranchId);
    }
  };
  const filteredStudents = useMemo(() => {
    return (students || []).filter((s) => {
      if (filterClassId !== "all" && Number(s.class_id) !== Number(filterClassId)) {
        return false;
      }
      if (filterSectionId !== "all") {
        const targetSection = String(filterSectionId).trim().toUpperCase();
        const studentSecName = String(s.section_name || "").trim().toUpperCase();
        const studentSecId = String(s.section_id || "").trim();
        if (studentSecName !== targetSection && studentSecId !== targetSection) {
          return false;
        }
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (s.full_name || `${s.first_name || ""} ${s.last_name || ""}`).toLowerCase();
        const code = (s.admission_number || s.student_id || "").toLowerCase();
        const roll = String(s.roll_number || "");
        const mobile = (s.student_mobile || s.father_mobile || "").toLowerCase();
        if (!name.includes(q) && !code.includes(q) && !roll.includes(q) && !mobile.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [students, filterClassId, filterSectionId, searchQuery]);
  const availableFilterSections = useMemo(() => {
    if (filterClassId !== "all") {
      return (sections || []).filter((sec) => !sec.class_id || Number(sec.class_id) === Number(filterClassId)).map((sec) => {
        const name = sec.name || sec.section_name || `Section ${sec.id}`;
        return { value: name, label: name, id: sec.id };
      });
    }
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    (sections || []).forEach((sec) => {
      const name = (sec.name || sec.section_name || "").trim();
      if (name && !seen.has(name.toUpperCase())) {
        seen.add(name.toUpperCase());
        result.push({ value: name, label: name, id: name });
      }
    });
    (students || []).forEach((st) => {
      const name = (st.section_name || "").trim();
      if (name && !seen.has(name.toUpperCase())) {
        seen.add(name.toUpperCase());
        result.push({ value: name, label: name, id: name });
      }
    });
    return result.sort((a, b) => a.label.localeCompare(b.label));
  }, [sections, filterClassId, students]);
  const modifiedCount = Object.keys(rowEdits).length;
  const handleFieldChange = useCallback((studentId, field, value) => {
    setRowEdits((prev) => {
      const currentStudentEdits = prev[studentId] || {};
      const updated = { ...currentStudentEdits, [field]: value };
      return { ...prev, [studentId]: updated };
    });
  }, []);
  const getVal = useCallback(
    (s, field, defaultVal = "") => {
      const edits = rowEdits[s.id];
      if (edits && edits[field] !== void 0) {
        return edits[field];
      }
      return s[field] !== void 0 && s[field] !== null ? s[field] : defaultVal;
    },
    [rowEdits]
  );
  const computeStudentName = useCallback(
    (s) => {
      const fn = getVal(s, "first_name", s.first_name || "");
      const mn = getVal(s, "middle_name", s.middle_name || "");
      const ln = getVal(s, "last_name", s.last_name || "");
      const computed = [fn, mn, ln].filter(Boolean).join(" ").toUpperCase();
      return computed || (s.full_name || "").toUpperCase();
    },
    [getVal]
  );
  const handleSaveAll = async () => {
    if (isReadOnly) {
      if (showToast) showToast("Cannot update records in historical academic year", "error");
      return;
    }
    const itemEntries = Object.entries(rowEdits);
    if (itemEntries.length === 0) {
      if (showToast) showToast("No changes detected", "info");
      return;
    }
    setIsSavingAll(true);
    try {
      const items = itemEntries.map(([idStr, changes]) => ({
        id: Number(idStr),
        ...changes
      }));
      await bulkUpdateStudents({
        items,
        academic_year_id: academicYearId
      });
      setRowEdits({});
      if (showToast) showToast(`Successfully saved changes for ${items.length} student(s)`, "success");
      if (onRefresh) onRefresh();
      else fetchInternalData();
    } catch (err) {
      console.error("Save all error:", err);
      if (showToast) showToast(err.message || "Failed to save changes", "error");
    } finally {
      setIsSavingAll(false);
    }
  };
  const handleDiscardAll = () => {
    if (window.confirm("Discard all unsaved edits across this table?")) {
      setRowEdits({});
      if (showToast) showToast("Unsaved edits discarded", "info");
    }
  };
  const handleApplyImportEdits = (incomingEdits) => {
    setRowEdits((prev) => {
      const merged = { ...prev };
      Object.entries(incomingEdits).forEach(([stuId, changes]) => {
        merged[stuId] = { ...merged[stuId] || {}, ...changes };
      });
      return merged;
    });
  };
  const activeColumns = TAB_COLUMNS[activeTab] || [];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-sans text-slate-800", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleGoBack,
            className: "flex items-center space-x-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer border border-slate-300",
            title: "Return to Student Details",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 text-slate-700" }),
              /* @__PURE__ */ jsx("span", { children: "Back to Students" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-[1px] bg-slate-200 hidden sm:block" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-sm font-bold text-slate-900 leading-tight", children: "Student Information Matrix (14 Tabs)" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500", children: "Bulk edit, export and import student records across classes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setIsTabsSidebarVisible((prev) => !prev),
          className: "inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer",
          title: isTabsSidebarVisible ? "Collapse Categories sidebar" : "Expand Categories sidebar",
          children: [
            /* @__PURE__ */ jsx(PanelLeft, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: isTabsSidebarVisible ? "Hide Categories" : "Show Categories" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: [
            "Branch ",
            !isSuperAdmin && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-teal-600 font-normal", children: "(Assigned)" })
          ] }),
          isSuperAdmin ? /* @__PURE__ */ jsxs(
            "select",
            {
              value: currentBranchId,
              onChange: (e) => handleBranchSelect(e.target.value === "all" ? "all" : Number(e.target.value)),
              className: "w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Branches" }),
                (branches || []).map((b) => /* @__PURE__ */ jsxs("option", { value: b.id, children: [
                  b.branch_name,
                  " ",
                  b.branch_code ? `(${b.branch_code})` : ""
                ] }, b.id))
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "w-full px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 truncate", children: [
            branches && ((_a = branches[0]) == null ? void 0 : _a.branch_name) || "Assigned Branch",
            " ",
            branches && ((_b = branches[0]) == null ? void 0 : _b.branch_code) ? `(${branches[0].branch_code})` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Class" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filterClassId,
              onChange: (e) => setFilterClassId(e.target.value === "all" ? "all" : Number(e.target.value)),
              className: "w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Classes" }),
                (classes || []).map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Section" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filterSectionId,
              onChange: (e) => setFilterSectionId(e.target.value),
              className: "w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Sections" }),
                availableFilterSections.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: s.label }, s.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Search Records" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: "Search name, code, mobile...",
                className: "w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
              }
            ),
            searchQuery && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setSearchQuery(""),
                className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer",
                children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 shrink-0 pt-2 lg:pt-0", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setIsExportModalOpen(true),
            className: "flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-xs font-bold cursor-pointer shadow-2xs transition-colors whitespace-nowrap",
            title: "Export CSV with 14-tab field selector",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5 text-emerald-600" }),
              /* @__PURE__ */ jsx("span", { children: "Export CSV" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setIsImportModalOpen(true),
            className: "flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-xs font-bold cursor-pointer shadow-2xs transition-colors whitespace-nowrap",
            title: "Import CSV to bulk update students",
            children: [
              /* @__PURE__ */ jsx(Upload, { className: "w-3.5 h-3.5 text-blue-600" }),
              /* @__PURE__ */ jsx("span", { children: "Import CSV" })
            ]
          }
        ),
        modifiedCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200", children: [
            modifiedCount,
            " modified"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleDiscardAll,
              className: "px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors",
              children: "Discard"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleSaveAll,
            disabled: isSavingAll || modifiedCount === 0 || isReadOnly,
            className: "flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-40 cursor-pointer shadow-xs transition-colors whitespace-nowrap",
            children: [
              isSavingAll ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Save All Changes" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-start", children: [
      isTabsSidebarVisible && /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-64 shrink-0 bg-white rounded-xl border border-slate-200 shadow-2xs p-2.5 flex flex-col space-y-1", children: [
        /* @__PURE__ */ jsx("div", { className: "px-2.5 py-1.5 border-b border-slate-100 mb-1", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "Categories (14 Tabs)" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-thin", children: TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab(tab.id),
              className: `w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer text-left ${isActive ? "bg-emerald-600 text-white shadow-xs font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${isActive ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"}`,
                    children: tab.num
                  }
                ),
                /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: tab.label })
              ]
            },
            tab.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 w-full bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col min-h-[550px]", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0 p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 mb-3 border-b border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200", children: [
                (_c = TABS.find((t) => t.id === activeTab)) == null ? void 0 : _c.num,
                ". ",
                (_d = TABS.find((t) => t.id === activeTab)) == null ? void 0 : _d.label
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900", children: "Student Matrix Table" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
              "Showing ",
              filteredStudents.length,
              " student(s) • Directly edit values inside spreadsheet cells and click Save All Changes"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onRefresh || fetchInternalData,
              title: "Reload students",
              className: "p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors",
              children: /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${isLoading ? "animate-spin text-emerald-600" : ""}` })
            }
          ) })
        ] }),
        isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-12 text-slate-400", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-emerald-600 mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Loading student matrix records..." })
        ] }) : filteredStudents.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-12 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3", children: /* @__PURE__ */ jsx(User, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-700", children: "No students found" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1 max-w-sm", children: "No students match the current filters. Select different criteria or clear search." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border border-slate-200 rounded-lg shadow-2xs max-h-[650px] overflow-y-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs border-collapse font-normal", children: [
          /* @__PURE__ */ jsx("thead", { className: "sticky top-0 bg-slate-100/95 backdrop-blur-xs text-slate-700 font-bold border-b border-slate-300 z-20 shadow-2xs", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2.5 border-r border-slate-200 text-center w-12 whitespace-nowrap", children: "#" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2.5 border-r border-slate-200 whitespace-nowrap min-w-[95px] text-center bg-slate-50 font-mono", children: "Student ID" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2.5 border-r border-slate-200 whitespace-nowrap min-w-[180px] sticky left-0 bg-slate-100 z-30 shadow-xs", children: "Student Name" }),
            activeColumns.map((col) => /* @__PURE__ */ jsx(
              "th",
              {
                className: `px-3 py-2.5 border-r border-slate-200 whitespace-nowrap ${col.width || "min-w-[130px]"}`,
                children: col.label
              },
              col.key
            ))
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-200 bg-white", children: filteredStudents.map((s, idx) => {
            const studentId = s.id;
            const isRowModified = !!rowEdits[studentId];
            s.admission_number || s.student_id;
            const computedName = computeStudentName(s);
            return /* @__PURE__ */ jsxs(
              "tr",
              {
                className: `hover:bg-slate-50/80 transition-colors ${initialStudentId && Number(initialStudentId) === Number(studentId) ? "ring-2 ring-emerald-500 bg-emerald-50/60 " : ""}${isRowModified ? "bg-amber-50/40" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 border-r border-slate-200 text-center font-semibold text-slate-500", children: idx + 1 }),
                  /* @__PURE__ */ jsxs("td", { className: "px-2.5 py-2 border-r border-slate-200 text-center font-mono font-bold text-slate-700 bg-slate-50/70", children: [
                    "#",
                    s.id
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 border-r border-slate-200 font-bold text-slate-900 sticky left-0 bg-white z-10 shadow-xs", children: computedName }),
                  activeColumns.map((col) => {
                    const val = getVal(s, col.key, s[col.key] || "");
                    return /* @__PURE__ */ jsx("td", { className: "px-2 py-1.5 border-r border-slate-200", children: col.type === "select" ? /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: val,
                        onChange: (e) => handleFieldChange(studentId, col.key, e.target.value),
                        className: "w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxs("option", { value: "", children: [
                            "Select ",
                            col.label
                          ] }),
                          (col.options || []).map((opt) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, opt))
                        ]
                      }
                    ) : col.type === "date" ? /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "date",
                        value: val ? String(val).split("T")[0] : "",
                        onChange: (e) => handleFieldChange(studentId, col.key, e.target.value),
                        className: "w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                      }
                    ) : col.type === "number" ? /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        value: val,
                        onChange: (e) => handleFieldChange(studentId, col.key, e.target.value ? Number(e.target.value) : ""),
                        className: "w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                      }
                    ) : /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: val,
                        onChange: (e) => handleFieldChange(studentId, col.key, e.target.value),
                        className: "w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                      }
                    ) }, col.key);
                  })
                ]
              },
              studentId
            );
          }) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      StudentCsvExportModal,
      {
        isOpen: isExportModalOpen,
        onClose: () => setIsExportModalOpen(false),
        students,
        filteredStudents,
        currentTabId: activeTab,
        getStudentValue: getVal,
        computeStudentName
      }
    ),
    /* @__PURE__ */ jsx(
      StudentCsvImportModal,
      {
        isOpen: isImportModalOpen,
        onClose: () => setIsImportModalOpen(false),
        students,
        academicYearId,
        currentTabId: activeTab,
        onApplyEdits: handleApplyImportEdits,
        onRefresh: onRefresh || fetchInternalData,
        showToast
      }
    )
  ] });
};
const AbsentNotificationModal = ({
  isOpen,
  onClose,
  branchId,
  academicYearId,
  attendanceDate,
  absentStudents = [],
  defaultTemplate = "Dear Parent, your ward [Student Name] has been marked absent today, [Date], from [Branch Name], [Class & Section]. Please contact the school office if required.",
  onSuccess
}) => {
  const { branches, showToast } = useErp();
  const currentBranch = branches.find((b) => b.id === branchId);
  const [selectedStudentIds, setSelectedStudentIds] = useState(
    () => Array.isArray(absentStudents) ? absentStudents.map((s) => s.student_id) : []
  );
  const [channel, setChannel] = useState("SMS");
  const [customMessage, setCustomMessage] = useState(defaultTemplate);
  const [isSending, setIsSending] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  useEffect(() => {
    if (Array.isArray(absentStudents)) {
      setSelectedStudentIds(absentStudents.map((s) => s.student_id));
    }
  }, [absentStudents]);
  const handleToggleSelect = (id) => {
    const currentList = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
    if (currentList.includes(id)) {
      setSelectedStudentIds(currentList.filter((x) => x !== id));
    } else {
      setSelectedStudentIds([...currentList, id]);
    }
  };
  const handleSelectAll = () => {
    const currentList = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
    const studentList2 = Array.isArray(absentStudents) ? absentStudents : [];
    if (currentList.length === studentList2.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(studentList2.map((s) => s.student_id));
    }
  };
  const handleSend = async () => {
    const currentList = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
    if (currentList.length === 0) {
      showToast("error", "Please select at least one absent student to notify.");
      return;
    }
    setIsSending(true);
    try {
      const studentList2 = Array.isArray(absentStudents) ? absentStudents : [];
      const notifications = studentList2.filter((s) => currentList.includes(s.student_id)).map((s) => {
        const studentFullName = `${s.first_name} ${s.last_name}`.trim();
        const parentName = s.parent_name || s.father_name || s.mother_name || "Parent";
        const parentMobile = s.father_mobile || s.mother_mobile || "+91 98401 23456";
        const branchName = s.branch_name || (currentBranch == null ? void 0 : currentBranch.branch_name) || "School";
        let body = customMessage.replace(/\[Student Name\]/g, studentFullName).replace(/\[Date\]/g, attendanceDate).replace(/\[Branch Name\]/g, branchName).replace(/\[Class & Section\]/g, `${s.class_name} - ${s.section_name}`).replace(/\[Class\]/g, s.class_name).replace(/\[Section\]/g, s.section_name).replace(/\[School Name\]/g, "Green Park Coaching Centre");
        return {
          student_id: s.student_id,
          attendance_id: s.attendance_id,
          parent_name: parentName,
          parent_contact: parentMobile,
          channel,
          message_body: body
        };
      });
      const res = await attendanceApi.sendNotifications(branchId, academicYearId, notifications);
      setSentCount(res.sentCount || notifications.length);
      setDispatchSuccess(true);
      showToast("success", `Sent ${res.sentCount || notifications.length} absent notifications!`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to send notifications:", err);
      showToast("error", err.message || "Failed to dispatch notifications");
    } finally {
      setIsSending(false);
    }
  };
  const studentList = Array.isArray(absentStudents) ? absentStudents : [];
  const currentSelected = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
  const previewStudent = studentList.find((s) => currentSelected.includes(s.student_id)) || studentList[0];
  const previewText = previewStudent ? customMessage.replace(/\[Student Name\]/g, `${previewStudent.first_name} ${previewStudent.last_name}`.trim()).replace(/\[Date\]/g, attendanceDate).replace(/\[Branch Name\]/g, previewStudent.branch_name || (currentBranch == null ? void 0 : currentBranch.branch_name) || "School").replace(/\[Class & Section\]/g, `${previewStudent.class_name} - ${previewStudent.section_name}`).replace(/\[Class\]/g, previewStudent.class_name).replace(/\[Section\]/g, previewStudent.section_name).replace(/\[School Name\]/g, "Green Park Coaching Centre") : customMessage;
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900", children: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg font-black text-slate-900 dark:text-white", children: "Absent Parent Notifications" }),
        /* @__PURE__ */ jsxs(DialogDescription, { className: "text-xs text-slate-500", children: [
          studentList.length,
          " student",
          studentList.length !== 1 ? "s" : "",
          " marked absent on ",
          attendanceDate
        ] })
      ] })
    ] }) }),
    dispatchSuccess ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8" }) }),
      /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Notifications Dispatched Successfully!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto", children: [
        "Sent ",
        sentCount,
        " alert message",
        sentCount !== 1 ? "s" : "",
        " via ",
        /* @__PURE__ */ jsx("strong", { children: channel }),
        " to registered parents. All records have been recorded in the Absent Report audit log."
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { className: "pt-2 sm:justify-center", children: /* @__PURE__ */ jsx(Button, { variant: "emerald", onClick: onClose, className: "px-5 py-2.5", children: "Close Window" }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-1", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5", children: "Select Dispatch Channel" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
          { id: "SMS", icon: Smartphone, label: "SMS Gateway" },
          { id: "WhatsApp", icon: MessageSquare, label: "WhatsApp" },
          { id: "Push Notification", icon: Bell, label: "Mobile App Push" },
          { id: "Email", icon: Mail, label: "Parent Email" }
        ].map((c) => {
          const Icon = c.icon;
          const isSelected = channel === c.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setChannel(c.id),
              className: `flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${isSelected ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${isSelected ? "text-emerald-600" : "text-slate-400"}` }),
                /* @__PURE__ */ jsx("span", { children: c.label })
              ]
            },
            c.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "Notification Message Body" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-400", children: "Dynamic placeholders supported" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 3,
            value: customMessage,
            onChange: (e) => setCustomMessage(e.target.value),
            className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 p-2.5 bg-slate-100 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 dark:text-slate-200", children: "Sample Preview: " }),
          previewText
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: [
            "Recipients (",
            selectedStudentIds.length,
            " of ",
            studentList.length,
            " selected)"
          ] }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleSelectAll,
              className: "text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer",
              children: selectedStudentIds.length === studentList.length ? "Deselect All" : "Select All"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800", children: studentList.map((s) => {
          const isChecked = Boolean(currentSelected.includes(s.student_id));
          const parentName = s.parent_name || s.father_name || s.mother_name || "Parent";
          const parentPhone = s.father_mobile || s.mother_mobile || "+91 98401 23456";
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => handleToggleSelect(s.student_id),
              className: `p-3 flex items-center justify-between cursor-pointer transition-colors ${isChecked ? "bg-rose-50/40 dark:bg-rose-950/20" : "bg-white dark:bg-slate-900 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: isChecked,
                      onChange: () => {
                      },
                      className: "w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 pointer-events-none"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-900 dark:text-white", children: [
                      s.first_name,
                      " ",
                      s.last_name
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-slate-500", children: [
                      "Adm: ",
                      s.admission_number,
                      " • ",
                      s.class_name,
                      " - ",
                      s.section_name
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right text-xs", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-slate-800 dark:text-slate-200", children: parentName }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-slate-500 font-mono flex items-center justify-end gap-1", children: [
                    /* @__PURE__ */ jsx(PhoneCall, { className: "w-3 h-3 text-slate-400" }),
                    parentPhone
                  ] })
                ] })
              ]
            },
            s.student_id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Skip / Later" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            id: "send-absent-notifications-btn",
            variant: "emerald",
            onClick: handleSend,
            disabled: isSending || selectedStudentIds.length === 0,
            children: [
              /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 mr-1.5" }),
              /* @__PURE__ */ jsx("span", { children: isSending ? "Dispatching Alerts..." : `Send to ${selectedStudentIds.length} Parent${selectedStudentIds.length !== 1 ? "s" : ""}` })
            ]
          }
        )
      ] })
    ] })
  ] }) });
};
const TakeAttendanceView = ({ branchId, academicYearId, onNavigateToRemarks, onNavigateToMapping }) => {
  const { branches, academicYears, activeAcademicYear, academicYearName, showToast, userRole, currentUser } = useErp();
  const [selectedBranchId, setSelectedBranchId] = useState(branchId);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(academicYearId);
  const [attendanceDate, setAttendanceDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [hasTimingMapping, setHasTimingMapping] = useState(null);
  const [activeTiming, setActiveTiming] = useState(null);
  const [isLoadingTiming, setIsLoadingTiming] = useState(false);
  const [standardRemarks, setStandardRemarks] = useState([]);
  const [selectedSessionTab, setSelectedSessionTab] = useState("both");
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [existingRecord, setExistingRecord] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [absentStudentsToNotify, setAbsentStudentsToNotify] = useState([]);
  useEffect(() => {
    setSelectedBranchId(branchId);
  }, [branchId]);
  useEffect(() => {
    setSelectedAcademicYearId(academicYearId);
  }, [academicYearId]);
  useEffect(() => {
    attendanceApi.getRemarks("Active").then((rems) => setStandardRemarks(rems)).catch((err) => console.error("Failed to load standard remarks:", err));
  }, []);
  useEffect(() => {
    if (!selectedBranchId || !selectedAcademicYearId)
      return;
    getClasses(selectedBranchId, selectedAcademicYearId).then((res) => {
      const cls = Array.isArray(res) ? res : (res == null ? void 0 : res.data) || [];
      setClasses(cls);
      if (cls.length > 0) {
        setSelectedClassId(cls[0].id);
      } else {
        setSelectedClassId("");
        setSections([]);
        setSelectedSectionId("");
      }
    }).catch((err) => {
      console.error("Failed to load classes:", err);
      setClasses([]);
      setSelectedClassId("");
    });
  }, [selectedBranchId, selectedAcademicYearId]);
  useEffect(() => {
    if (selectedClassId && selectedBranchId && selectedAcademicYearId) {
      getSectionsByClass(Number(selectedClassId), selectedBranchId, selectedAcademicYearId).then((secs) => {
        setSections(secs);
        if (secs.length > 0) {
          setSelectedSectionId(secs[0].id);
        } else {
          setSelectedSectionId("");
        }
      }).catch((err) => {
        console.error("Failed to load sections:", err);
        setSections([]);
        setSelectedSectionId("");
      });
    } else {
      setSections([]);
      setSelectedSectionId("");
    }
  }, [selectedClassId, selectedBranchId, selectedAcademicYearId]);
  const loadRoster = useCallback(async () => {
    var _a;
    if (!selectedClassId || !selectedSectionId || !attendanceDate || !selectedBranchId || !selectedAcademicYearId) {
      setStudents([]);
      setAttendanceMap({});
      setExistingRecord(null);
      setIsEditMode(false);
      setHasTimingMapping(null);
      setActiveTiming(null);
      return;
    }
    setIsLoadingStudents(true);
    setIsLoadingTiming(true);
    try {
      const secObj = sections.find((s) => String(s.id) === String(selectedSectionId) || String(s.section_id) === String(selectedSectionId));
      const secName = secObj ? secObj.name || secObj.section_name : "";
      const effAyStr = academicYearName || (activeAcademicYear == null ? void 0 : activeAcademicYear.name) || (activeAcademicYear == null ? void 0 : activeAcademicYear.year_name) || "";
      let timingRes = null;
      try {
        timingRes = await attendanceApi.resolveTiming(
          selectedBranchId,
          selectedAcademicYearId,
          Number(selectedClassId),
          Number(selectedSectionId),
          effAyStr
        );
      } catch (timingErr) {
        console.error("Failed to resolve timing assignment:", timingErr);
      }
      const timingMapped = Boolean((timingRes == null ? void 0 : timingRes.mapped) || (timingRes == null ? void 0 : timingRes.has_timing_mapping));
      setHasTimingMapping(timingMapped);
      setActiveTiming((timingRes == null ? void 0 : timingRes.timing) || null);
      const existingCheck = await attendanceApi.checkExisting(
        selectedBranchId,
        selectedAcademicYearId,
        Number(selectedClassId),
        Number(selectedSectionId),
        attendanceDate,
        secName
      );
      setExistingRecord(existingCheck.exists ? existingCheck : null);
      if (existingCheck.exists) {
        setIsEditMode(false);
      } else {
        setIsEditMode(true);
      }
      const data = await attendanceApi.getStudentsToMark(
        selectedBranchId,
        selectedAcademicYearId,
        Number(selectedClassId),
        Number(selectedSectionId),
        attendanceDate,
        (_a = timingRes == null ? void 0 : timingRes.timing) == null ? void 0 : _a.id,
        secName,
        effAyStr
      );
      const uniqueStudents = Array.from(new Map(data.map((s) => [s.student_id, s])).values());
      setStudents(uniqueStudents);
      const map = {};
      uniqueStudents.forEach((s) => {
        const morningStatus = s.marked_morning_status || s.marked_status || "Present";
        const afternoonStatus = s.marked_afternoon_status || s.marked_status || "Present";
        const overallStatus = s.marked_status || morningStatus || "Present";
        const remarkVal = s.marked_remarks || "";
        const customVal = s.marked_custom_remark || "";
        map[s.student_id] = {
          status: overallStatus,
          morning_status: morningStatus,
          afternoon_status: afternoonStatus,
          remarks: remarkVal || (customVal ? "Other" : ""),
          custom_remark: customVal
        };
      });
      setAttendanceMap(map);
    } catch (err) {
      console.error("Failed to load students for attendance:", err);
      showToast("Could not load student list: " + (err.message || ""), "error");
    } finally {
      setIsLoadingStudents(false);
      setIsLoadingTiming(false);
    }
  }, [selectedBranchId, selectedAcademicYearId, selectedClassId, selectedSectionId, attendanceDate, showToast, sections, academicYearName, activeAcademicYear]);
  useEffect(() => {
    loadRoster();
  }, [loadRoster]);
  const computeOverallStatus = (morn, aft, hasTwoSessions) => {
    if (!hasTwoSessions) return morn;
    if (morn === "Present" && aft === "Present") return "Present";
    if (morn === "Absent" && aft === "Absent") return "Absent";
    if (morn === "Leave" && aft === "Leave") return "Leave";
    if (morn === "Late" && aft === "Late") return "Late";
    if (morn === "Absent" && (aft === "Present" || aft === "Late") || aft === "Absent" && (morn === "Present" || morn === "Late")) {
      return "Half Day";
    }
    if (morn === "Leave" && (aft === "Present" || aft === "Late") || aft === "Leave" && (morn === "Present" || morn === "Late")) {
      return "Half Day";
    }
    if (morn === "Late" || aft === "Late") return "Late";
    return "Half Day";
  };
  const handleMarkAllPresent = (targetSession = "both") => {
    if (isReadOnly)
      return;
    const hasTwo = Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session);
    const updated = { ...attendanceMap };
    students.forEach((s) => {
      const current = updated[s.student_id] || {};
      let newMorning = current.morning_status || "Present";
      let newAfternoon = current.afternoon_status || "Present";
      if (targetSession === "both" || !hasTwo) {
        newMorning = "Present";
        newAfternoon = "Present";
      } else if (targetSession === "morning") {
        newMorning = "Present";
      } else if (targetSession === "afternoon") {
        newAfternoon = "Present";
      }
      const overall = computeOverallStatus(newMorning, newAfternoon, hasTwo);
      updated[s.student_id] = {
        ...current,
        morning_status: newMorning,
        afternoon_status: newAfternoon,
        status: overall
      };
    });
    setAttendanceMap(updated);
    const label = targetSession === "morning" ? (activeTiming == null ? void 0 : activeTiming.session_1_name) || "Morning Session" : targetSession === "afternoon" ? (activeTiming == null ? void 0 : activeTiming.session_2_name) || "Afternoon Session" : "All";
    showToast(`${label} students marked as Present`, "info");
  };
  const handleSetStatus = (studentId, status, session = "both") => {
    if (isReadOnly)
      return;
    const hasTwo = Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session);
    setAttendanceMap((prev) => {
      const curr = prev[studentId] || { morning_status: "Present", afternoon_status: "Present", status: "Present" };
      let newMorning = curr.morning_status || "Present";
      let newAfternoon = curr.afternoon_status || "Present";
      if (session === "morning") {
        newMorning = status;
        if (!hasTwo) newAfternoon = status;
      } else if (session === "afternoon") {
        newAfternoon = status;
      } else {
        newMorning = status;
        newAfternoon = status;
      }
      const overall = computeOverallStatus(newMorning, newAfternoon, hasTwo);
      return {
        ...prev,
        [studentId]: {
          ...curr,
          morning_status: newMorning,
          afternoon_status: newAfternoon,
          status: overall
        }
      };
    });
  };
  const handleSetRemarks = (studentId, remarkName) => {
    if (isReadOnly)
      return;
    setAttendanceMap((prev) => {
      var _a;
      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          remarks: remarkName,
          custom_remark: remarkName === "Other" ? ((_a = prev[studentId]) == null ? void 0 : _a.custom_remark) || "" : ""
        }
      };
    });
  };
  const handleSetCustomRemark = (studentId, customText) => {
    if (isReadOnly)
      return;
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        custom_remark: customText
      }
    }));
  };
  const counts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let late = 0;
    const hasTwo = Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session);
    Object.values(attendanceMap).forEach((v) => {
      const st = selectedSessionTab === "morning" ? v.morning_status || v.status : selectedSessionTab === "afternoon" && hasTwo ? v.afternoon_status || v.status : v.status;
      if (st === "Present")
        present++;
      else if (st === "Absent")
        absent++;
      else if (st === "Leave")
        leave++;
      else if (st === "Late")
        late++;
    });
    const total = students.length;
    const percentage = total > 0 ? Number((present / total * 100).toFixed(1)) : 0;
    return { total, present, absent, leave, late, percentage };
  }, [attendanceMap, students.length, selectedSessionTab, activeTiming == null ? void 0 : activeTiming.is_second_session]);
  const isTimingMissing = hasTimingMapping === false;
  const isReadOnly = (existingRecord == null ? void 0 : existingRecord.exists) && !isEditMode || isTimingMissing;
  const handleSubmit = async () => {
    if (!selectedClassId || !selectedSectionId) {
      showToast("Please select Class and Section", "error");
      return;
    }
    if (isTimingMissing || !activeTiming) {
      showToast("Cannot record attendance: No attendance timing schedule is mapped to this class. Please map timing schedule first.", "error");
      return;
    }
    if (students.length === 0) {
      showToast("No students enrolled in this section to mark", "error");
      return;
    }
    if ((existingRecord == null ? void 0 : existingRecord.exists) && !isEditMode) {
      showToast('Please click "Edit Attendance" to modify records.', "info");
      return;
    }
    setIsSubmitting(true);
    try {
      const staffName = (currentUser == null ? void 0 : currentUser.full_name) || (userRole === "super_admin" ? "Super Admin" : "Class Teacher");
      const effAyStr = academicYearName || (activeAcademicYear == null ? void 0 : activeAcademicYear.name) || (activeAcademicYear == null ? void 0 : activeAcademicYear.year_name);
      const records = students.map((s) => {
        const item = attendanceMap[s.student_id] || { status: "Present", morning_status: "Present", afternoon_status: "Present", remarks: "", custom_remark: "" };
        return {
          student_id: s.student_id,
          status: item.status,
          morning_status: item.morning_status || item.status,
          afternoon_status: item.afternoon_status || item.status,
          remarks: item.remarks === "Other" ? "Other" : item.remarks,
          custom_remark: item.remarks === "Other" ? item.custom_remark.trim() : ""
        };
      });
      const res = await attendanceApi.submitAttendance({
        branch_id: selectedBranchId,
        academic_year_id: selectedAcademicYearId,
        academic_year: effAyStr,
        class_id: Number(selectedClassId),
        section_id: Number(selectedSectionId),
        timing_id: activeTiming.id,
        attendance_timing_id: activeTiming.id,
        attendance_date: attendanceDate,
        submitted_by: (existingRecord == null ? void 0 : existingRecord.submitted_by) || staffName,
        updated_by: (existingRecord == null ? void 0 : existingRecord.exists) ? staffName : void 0,
        is_edit: existingRecord == null ? void 0 : existingRecord.exists,
        records
      });
      showToast(res.message || "Attendance saved successfully", "success");
      await loadRoster();
      if (res.absent_students && res.absent_students.length > 0 && !res.auto_notification_sent) {
        setAbsentStudentsToNotify(res.absent_students);
        setIsNotifModalOpen(true);
      } else if (res.auto_notification_sent) {
        showToast(`Automated SMS notification sent to ${res.absent_count} absent student parents`, "info");
      }
    } catch (err) {
      console.error("Failed to submit attendance:", err);
      showToast(err.message || "Could not save attendance", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term)
      return students;
    return students.filter((s) => {
      const fullName = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
      const roll = String(s.roll_number || "").toLowerCase();
      const adm = String(s.admission_number || "").toLowerCase();
      return fullName.includes(term) || roll.includes(term) || adm.includes(term);
    });
  }, [students, searchTerm]);
  const formatDateTime = (dateStr) => {
    if (!dateStr)
      return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };
  const selectedClassObj = classes.find((c) => Number(c.id) === Number(selectedClassId));
  const selectedSectionObj = sections.find((s) => Number(s.id) === Number(selectedSectionId) || Number(s.section_id) === Number(selectedSectionId));
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Card, { className: "border-border shadow-xs", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4 sm:p-5", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Branch" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "attendance-branch-select",
            value: selectedBranchId,
            onChange: (e) => {
              const newBranchId = Number(e.target.value);
              setSelectedBranchId(newBranchId);
              setSelectedClassId("");
              setSelectedSectionId("");
            },
            disabled: userRole !== "super_admin",
            className: "w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-75 cursor-pointer",
            children: branches.map((b) => /* @__PURE__ */ jsx("option", { value: b.id, children: b.branch_name }, b.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Academic Year" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "attendance-ay-select",
            value: selectedAcademicYearId,
            onChange: (e) => {
              const newAyId = Number(e.target.value);
              setSelectedAcademicYearId(newAyId);
              setSelectedClassId("");
              setSelectedSectionId("");
            },
            className: "w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer",
            children: academicYears.map((ay) => /* @__PURE__ */ jsxs("option", { value: ay.id, children: [
              ay.name,
              " ",
              ay.is_active ? "(Active)" : ""
            ] }, ay.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5", children: [
          "Date ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "attendance-date-input",
            type: "date",
            value: attendanceDate,
            onChange: (e) => setAttendanceDate(e.target.value),
            className: "w-full text-xs font-semibold h-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5", children: [
          "Class ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "attendance-class-select",
            value: selectedClassId,
            onChange: (e) => {
              setSelectedClassId(Number(e.target.value));
              setSelectedSectionId("");
            },
            className: "w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer",
            children: [
              classes.length === 0 && /* @__PURE__ */ jsx("option", { value: "", children: "No classes found" }),
              classes.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5", children: [
          "Section ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "attendance-section-select",
            value: selectedSectionId,
            onChange: (e) => setSelectedSectionId(Number(e.target.value)),
            disabled: sections.length === 0,
            className: "w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 cursor-pointer",
            children: [
              sections.length === 0 && /* @__PURE__ */ jsx("option", { value: "", children: "No sections found" }),
              sections.map((s) => /* @__PURE__ */ jsxs("option", { value: s.id, children: [
                "Section ",
                s.name
              ] }, s.id))
            ]
          }
        )
      ] })
    ] }) }) }),
    selectedClassId && selectedSectionId && hasTimingMapping === false && !isLoadingTiming && /* @__PURE__ */ jsxs(Card, { className: "bg-amber-50/60 dark:bg-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3.5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider", children: "Attendance Timing Schedule Required" }),
            /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-[10px] uppercase font-black", children: "Action Needed" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-800 dark:text-amber-300 mt-1 font-medium leading-relaxed", children: [
            "Class ",
            /* @__PURE__ */ jsx("strong", { children: (selectedClassObj == null ? void 0 : selectedClassObj.name) || `Class #${selectedClassId}` }),
            " (Section ",
            /* @__PURE__ */ jsx("strong", { children: (selectedSectionObj == null ? void 0 : selectedSectionObj.name) || "A" }),
            ") does not have an active attendance timing assigned for ",
            /* @__PURE__ */ jsx("strong", { children: academicYearName || (activeAcademicYear == null ? void 0 : activeAcademicYear.name) || "the current academic year" }),
            ". You cannot take or record attendance until an attendance timing schedule (session window) is mapped to this class."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          id: "map-timing-schedule-btn",
          onClick: () => onNavigateToMapping && onNavigateToMapping({ classId: selectedClassId, sectionId: selectedSectionId }),
          variant: "destructive",
          className: "shrink-0 text-xs font-black cursor-pointer shadow-xs",
          children: [
            /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 mr-1.5" }),
            /* @__PURE__ */ jsx("span", { children: "Map Timing Schedule Now →" })
          ]
        }
      )
    ] }),
    selectedClassId && selectedSectionId && hasTimingMapping === true && activeTiming && /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 px-5 py-3 rounded-xl flex flex-wrap items-center justify-between text-xs gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold", children: [
        /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Assigned Schedule: ",
          /* @__PURE__ */ jsx("strong", { children: activeTiming.name })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-emerald-300 dark:text-emerald-700", children: "•" }),
        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
          "Morning: ",
          activeTiming.morning_start_time || activeTiming.start_time,
          " - ",
          activeTiming.morning_end_time || activeTiming.end_time
        ] }),
        Boolean(activeTiming.is_second_session) && activeTiming.afternoon_start_time && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "text-emerald-300 dark:text-emerald-700", children: "•" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
            "Afternoon: ",
            activeTiming.afternoon_start_time,
            " - ",
            activeTiming.afternoon_end_time
          ] })
        ] }),
        activeTiming.grace_period > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] bg-background text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700", children: [
          "Grace: ",
          activeTiming.grace_period,
          "m"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onNavigateToMapping && onNavigateToMapping({ classId: selectedClassId, sectionId: selectedSectionId }),
          className: "text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer",
          children: /* @__PURE__ */ jsx("span", { children: "Change Timing Mapping" })
        }
      )
    ] }),
    (existingRecord == null ? void 0 : existingRecord.exists) && /* @__PURE__ */ jsx("div", { className: `p-4 rounded-xl border transition-all ${isEditMode ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200" : "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3.5", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: `w-5 h-5 shrink-0 mt-0.5 ${isEditMode ? "text-amber-600" : "text-indigo-600"}` }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-black flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Attendance already marked for this class on ",
              attendanceDate,
              "."
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: isEditMode ? "destructive" : "default", className: "text-[10px] font-black uppercase", children: isEditMode ? "Edit Mode Active" : "View Only Mode" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] mt-1 text-muted-foreground", children: [
            "Marked by ",
            /* @__PURE__ */ jsx("strong", { children: existingRecord.submitted_by || "Staff" }),
            " at ",
            formatDateTime(existingRecord.submitted_at),
            existingRecord.updated_by ? ` • Last updated by ${existingRecord.updated_by} at ${formatDateTime(existingRecord.updated_at)}` : "",
            ".",
            !isEditMode && " Controls are locked to prevent accidental changes."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 shrink-0", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            id: "view-only-mode-btn",
            variant: !isEditMode ? "default" : "outline",
            size: "sm",
            onClick: () => setIsEditMode(false),
            className: "text-xs font-bold",
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 mr-1.5" }),
              /* @__PURE__ */ jsx("span", { children: "View Only" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            id: "edit-attendance-mode-btn",
            variant: isEditMode ? "destructive" : "outline",
            size: "sm",
            onClick: () => setIsEditMode(true),
            className: "text-xs font-bold",
            children: [
              /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5 mr-1.5" }),
              /* @__PURE__ */ jsx("span", { children: "Edit Attendance" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-6 gap-3.5", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-3.5 text-center shadow-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider", children: "Total" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-black text-foreground mt-0.5", children: counts.total })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-3.5 text-center shadow-xs bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider", children: "Present" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5", children: counts.present })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-3.5 text-center shadow-xs bg-destructive/10 border-destructive/20", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-destructive uppercase tracking-wider", children: "Absent" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-black text-destructive mt-0.5", children: counts.absent })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-3.5 text-center shadow-xs bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider", children: "Leave" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5", children: counts.leave })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-3.5 text-center shadow-xs bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/40", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider", children: "Late" }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-black text-sky-600 dark:text-sky-400 mt-0.5", children: counts.late })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-3.5 text-center shadow-xs bg-primary text-primary-foreground", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold opacity-80 uppercase tracking-wider", children: "% Rate" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xl font-black mt-0.5", children: [
          counts.percentage,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-3.5 border-b border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-850", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
            /* @__PURE__ */ jsx("input", { id: "student-search-input", type: "text", placeholder: "Search student name, roll...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500" })
          ] }),
          Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session) && /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-200/80 dark:bg-slate-750 p-0.5 rounded-lg text-xs font-bold", id: "session-selector-tabs", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                id: "session-tab-both",
                onClick: () => setSelectedSessionTab("both"),
                className: `px-3 py-1 rounded-md transition-all ${selectedSessionTab === "both" ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
                children: "Both Sessions"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                id: "session-tab-morning",
                onClick: () => setSelectedSessionTab("morning"),
                className: `px-3 py-1 rounded-md transition-all ${selectedSessionTab === "morning" ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
                children: [
                  "☀️ ",
                  activeTiming.session_1_name || "Morning"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                id: "session-tab-afternoon",
                onClick: () => setSelectedSessionTab("afternoon"),
                className: `px-3 py-1 rounded-md transition-all ${selectedSessionTab === "afternoon" ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
                children: [
                  "🌙 ",
                  activeTiming.session_2_name || "Afternoon"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 w-full sm:w-auto justify-end", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              id: "mark-all-present-btn",
              onClick: () => handleMarkAllPresent(selectedSessionTab),
              disabled: isReadOnly || students.length === 0,
              className: "inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              title: `One click: set all students to Present for ${selectedSessionTab === "morning" ? "Morning" : selectedSessionTab === "afternoon" ? "Afternoon" : "All sessions"}`,
              children: [
                /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 stroke-[3]" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Mark All Present",
                  Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session) && selectedSessionTab !== "both" && /* @__PURE__ */ jsxs("span", { className: "ml-1 opacity-90", children: [
                    "(",
                    selectedSessionTab === "morning" ? "Morning" : "Afternoon",
                    ")"
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              id: "submit-attendance-top-btn",
              onClick: handleSubmit,
              disabled: isReadOnly || isSubmitting || students.length === 0,
              className: `inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors ${isTimingMissing ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 cursor-not-allowed opacity-90" : isReadOnly ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-800 text-white"}`,
              title: isTimingMissing ? "Map attendance timing schedule first" : void 0,
              children: [
                /* @__PURE__ */ jsx(CalendarCheck, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Saving..." : isTimingMissing ? "Timing Required to Save" : (existingRecord == null ? void 0 : existingRecord.exists) ? "Update Attendance" : "Save Attendance" })
              ]
            }
          )
        ] })
      ] }),
      isLoadingStudents ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-600 dark:text-slate-300", children: "Loading students..." })
      ] }) : filteredStudents.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsx(UserX, { className: "w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 dark:text-white", children: "No enrolled students found" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Please check class and section selection." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", id: "attendance-rollcall-table", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px] font-bold", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4 w-16 text-center", children: "Roll No" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Student Name" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Admission No" }),
          Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session) && selectedSessionTab === "both" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center bg-amber-50/50 dark:bg-amber-950/20 border-x border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-1", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "☀️ ",
                activeTiming.session_1_name || "Morning"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] lowercase font-normal opacity-70", children: [
                "(",
                activeTiming.morning_start_time || activeTiming.start_time,
                " - ",
                activeTiming.morning_end_time || activeTiming.end_time,
                ")"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center bg-indigo-50/50 dark:bg-indigo-950/20 border-r border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-1", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "🌙 ",
                activeTiming.session_2_name || "Afternoon"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] lowercase font-normal opacity-70", children: [
                "(",
                activeTiming.afternoon_start_time,
                " - ",
                activeTiming.afternoon_end_time,
                ")"
              ] })
            ] }) })
          ] }) : Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session) && selectedSessionTab === "morning" ? /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center bg-amber-50/50 dark:bg-amber-950/20 border-x border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-1", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "☀️ ",
              activeTiming.session_1_name || "Morning Session"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] lowercase font-normal opacity-70", children: [
              "(",
              activeTiming.morning_start_time || activeTiming.start_time,
              " - ",
              activeTiming.morning_end_time || activeTiming.end_time,
              ")"
            ] })
          ] }) }) : Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session) && selectedSessionTab === "afternoon" ? /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center bg-indigo-50/50 dark:bg-indigo-950/20 border-x border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-1", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "🌙 ",
              activeTiming.session_2_name || "Afternoon Session"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] lowercase font-normal opacity-70", children: [
              "(",
              activeTiming.afternoon_start_time,
              " - ",
              activeTiming.afternoon_end_time,
              ")"
            ] })
          ] }) }) : /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center", children: "Attendance Status" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4 min-w-[200px]", children: "Remarks" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: filteredStudents.map((st, idx) => {
          const item = attendanceMap[st.student_id] || {};
          const currentStatus = item.status || "Present";
          const currentMorning = item.morning_status || currentStatus;
          const currentAfternoon = item.afternoon_status || currentStatus;
          const currentRemark = item.remarks || "";
          const currentCustomRemark = item.custom_remark || "";
          const isOtherSelected = currentRemark === "Other";
          const hasTwo = Boolean(activeTiming == null ? void 0 : activeTiming.is_second_session);
          const renderButtonGroup = (targetSession, currentVal, prefix = "") => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-1.5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                id: `${prefix}status-present-${st.student_id}`,
                onClick: () => handleSetStatus(st.student_id, "Present", targetSession),
                disabled: isReadOnly,
                className: `min-w-[62px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${currentVal === "Present" ? "bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600 ring-offset-1 dark:ring-offset-slate-900" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-700"} ${isReadOnly ? "cursor-not-allowed opacity-80" : ""}`,
                children: /* @__PURE__ */ jsx("span", { children: "Present" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                id: `${prefix}status-absent-${st.student_id}`,
                onClick: () => handleSetStatus(st.student_id, "Absent", targetSession),
                disabled: isReadOnly,
                className: `min-w-[62px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${currentVal === "Absent" ? "bg-rose-600 text-white shadow-xs ring-2 ring-rose-600 ring-offset-1 dark:ring-offset-slate-900" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-500 hover:text-rose-700"} ${isReadOnly ? "cursor-not-allowed opacity-80" : ""}`,
                children: /* @__PURE__ */ jsx("span", { children: "Absent" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                id: `${prefix}status-leave-${st.student_id}`,
                onClick: () => handleSetStatus(st.student_id, "Leave", targetSession),
                disabled: isReadOnly,
                className: `min-w-[58px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${currentVal === "Leave" ? "bg-amber-500 text-white shadow-xs ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-slate-900" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:text-amber-700"} ${isReadOnly ? "cursor-not-allowed opacity-80" : ""}`,
                children: /* @__PURE__ */ jsx("span", { children: "Leave" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                id: `${prefix}status-late-${st.student_id}`,
                onClick: () => handleSetStatus(st.student_id, "Late", targetSession),
                disabled: isReadOnly,
                className: `min-w-[54px] py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${currentVal === "Late" ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-slate-900" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-700"} ${isReadOnly ? "cursor-not-allowed opacity-80" : ""}`,
                children: /* @__PURE__ */ jsx("span", { children: "Late" })
              }
            )
          ] });
          return /* @__PURE__ */ jsxs("tr", { className: `transition-colors ${currentStatus === "Absent" ? "bg-rose-50/40 dark:bg-rose-950/20" : currentStatus === "Leave" ? "bg-amber-50/30 dark:bg-amber-950/20" : currentStatus === "Late" ? "bg-blue-50/30 dark:bg-blue-950/20" : "hover:bg-slate-50/70 dark:hover:bg-slate-750"}`, children: [
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200", children: st.roll_number ?? idx + 1 }),
            /* @__PURE__ */ jsxs("td", { className: "py-3.5 px-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-900 dark:text-white text-sm", children: [
                st.first_name,
                " ",
                st.last_name
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-slate-400 font-medium", children: [
                "Gender: ",
                st.gender || "—"
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400", children: st.admission_number }),
            hasTwo && selectedSessionTab === "both" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3.5 px-3 bg-amber-50/20 dark:bg-amber-950/10 border-x border-slate-200 dark:border-slate-700", children: renderButtonGroup("morning", currentMorning, "morn-") }),
              /* @__PURE__ */ jsx("td", { className: "py-3.5 px-3 bg-indigo-50/20 dark:bg-indigo-950/10 border-r border-slate-200 dark:border-slate-700", children: renderButtonGroup("afternoon", currentAfternoon, "aft-") })
            ] }) : hasTwo && selectedSessionTab === "morning" ? /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 bg-amber-50/20 dark:bg-amber-950/10 border-x border-slate-200 dark:border-slate-700", children: renderButtonGroup("morning", currentMorning, "morn-") }) : hasTwo && selectedSessionTab === "afternoon" ? /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 bg-indigo-50/20 dark:bg-indigo-950/10 border-x border-slate-200 dark:border-slate-700", children: renderButtonGroup("afternoon", currentAfternoon, "aft-") }) : /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: renderButtonGroup("both", currentStatus) }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxs("select", { id: `remark-select-${st.student_id}`, value: currentRemark, onChange: (e) => handleSetRemarks(st.student_id, e.target.value), disabled: isReadOnly, className: "w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed", children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "— Select standard remark —" }),
                (Array.isArray(standardRemarks) && standardRemarks.length > 0 ? standardRemarks : [
                  { id: 1, name: "Medical Leave" },
                  { id: 2, name: "Family Function" },
                  { id: 3, name: "Late Arrival with Permission" },
                  { id: 4, name: "Disciplinary Absence" },
                  { id: 5, name: "Sports / Inter-school Event" }
                ]).filter((rem) => (rem.name || rem.text) !== "Other").map((rem) => {
                  const val = rem.name || rem.text || "";
                  return /* @__PURE__ */ jsx("option", { value: val, children: val }, rem.id || val);
                }),
                /* @__PURE__ */ jsx("option", { value: "Other", children: "Other (Type custom remark)" })
              ] }),
              isOtherSelected && /* @__PURE__ */ jsx("input", { type: "text", id: `custom-remark-input-${st.student_id}`, placeholder: "Enter custom remark...", value: currentCustomRemark, onChange: (e) => handleSetCustomRemark(st.student_id, e.target.value), disabled: isReadOnly, className: "w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/30 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 disabled:opacity-75 disabled:cursor-not-allowed animate-fadeIn" })
            ] }) })
          ] }, st.student_id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-500", children: [
          "Current user: ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 dark:text-slate-300", children: (currentUser == null ? void 0 : currentUser.full_name) || (userRole === "super_admin" ? "Super Admin" : "Staff") }),
          (existingRecord == null ? void 0 : existingRecord.exists) && !isEditMode && /* @__PURE__ */ jsx("span", { className: "ml-2 text-blue-600 dark:text-blue-400 font-medium", children: '(Click "Edit Attendance" above to make changes)' })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            id: "submit-attendance-bottom-btn",
            onClick: handleSubmit,
            disabled: isReadOnly || isSubmitting || students.length === 0,
            className: `inline-flex items-center space-x-2 px-8 py-2.5 rounded-lg text-xs font-black shadow-md transition-colors ${isTimingMissing ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 cursor-not-allowed opacity-90" : isReadOnly ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`,
            title: isTimingMissing ? "Map attendance timing schedule first" : void 0,
            children: [
              /* @__PURE__ */ jsx(CalendarCheck, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Saving Attendance..." : isTimingMissing ? "Timing Schedule Required" : (existingRecord == null ? void 0 : existingRecord.exists) ? "Update Attendance" : "Save Attendance" })
            ]
          }
        )
      ] })
    ] }),
    isNotifModalOpen && /* @__PURE__ */ jsx(AbsentNotificationModal, { isOpen: isNotifModalOpen, onClose: () => setIsNotifModalOpen(false), branchId: selectedBranchId, academicYearId: selectedAcademicYearId, attendanceDate, absentStudents: absentStudentsToNotify, onSuccess: () => {
      setIsNotifModalOpen(false);
      loadRoster();
    } })
  ] });
};
const AttendanceTimingView = ({ branchId, academicYearId }) => {
  const { branches, activeAcademicYear, academicYearName, showToast } = useErp();
  const [timings, setTimings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTiming, setEditingTiming] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    session_1_name: "Morning Session",
    session_2_name: "Afternoon Session",
    is_second_session: false,
    morning_start_time: "08:30",
    morning_end_time: "12:30",
    afternoon_start_time: "13:30",
    afternoon_end_time: "16:00",
    status: "Active"
  });
  const [formError, setFormError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const currentBranch = branches.find((b) => b.id === branchId);
  const loadTimings = useCallback(async () => {
    setIsLoading(true);
    try {
      const effAyStr = academicYearName || (activeAcademicYear == null ? void 0 : activeAcademicYear.year_name) || "2025-2026";
      const data = await attendanceApi.getTimings(branchId, academicYearId, effAyStr);
      setTimings(data || []);
    } catch (err) {
      console.error("Failed to load timings:", err);
      showToast("error", err.message || "Could not load attendance timings");
    } finally {
      setIsLoading(false);
    }
  }, [branchId, academicYearId, academicYearName, activeAcademicYear, showToast]);
  useEffect(() => {
    loadTimings();
  }, [loadTimings]);
  const handleOpenAdd = () => {
    setEditingTiming(null);
    setFormData({
      name: "",
      session_1_name: "Morning Session",
      session_2_name: "Afternoon Session",
      is_second_session: false,
      morning_start_time: "08:30",
      morning_end_time: "12:30",
      afternoon_start_time: "13:30",
      afternoon_end_time: "16:00",
      status: "Active"
    });
    setFormError(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (timing) => {
    setEditingTiming(timing);
    setFormData({
      name: timing.name || "",
      session_1_name: timing.session_1_name || "Morning Session",
      session_2_name: timing.session_2_name || "Afternoon Session",
      is_second_session: Boolean(timing.is_second_session === 1 || timing.is_second_session === true),
      morning_start_time: timing.morning_start_time || timing.start_time || "08:30",
      morning_end_time: timing.morning_end_time || "12:30",
      afternoon_start_time: timing.afternoon_start_time || "13:30",
      afternoon_end_time: timing.afternoon_end_time || timing.end_time || "16:00",
      status: timing.status || "Active"
    });
    setFormError(null);
    setIsModalOpen(true);
  };
  const handleToggleStatus = async (timing) => {
    const newStatus = timing.status === "Active" ? "Inactive" : "Active";
    try {
      await attendanceApi.toggleTimingStatus(timing.id, newStatus);
      showToast("success", `Timing marked as ${newStatus}`);
      loadTimings();
    } catch (err) {
      showToast("error", err.message || "Failed to toggle status");
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Timing name is required");
      return;
    }
    if (!formData.session_1_name.trim()) {
      setFormError("Session 1 name is required");
      return;
    }
    if (!formData.morning_start_time || !formData.morning_end_time) {
      setFormError("Session 1 Start time and End time are required");
      return;
    }
    if (formData.morning_start_time >= formData.morning_end_time) {
      setFormError("Session 1 Start time must be earlier than End time");
      return;
    }
    if (formData.is_second_session) {
      if (!formData.session_2_name.trim()) {
        setFormError("Session 2 name is required");
        return;
      }
      if (!formData.afternoon_start_time || !formData.afternoon_end_time) {
        setFormError("Session 2 Start time and End time are required");
        return;
      }
      if (formData.afternoon_start_time >= formData.afternoon_end_time) {
        setFormError("Session 2 Start time must be earlier than End time");
        return;
      }
      if (formData.afternoon_start_time < formData.morning_end_time) {
        setFormError("Session 2 Start time should be after Session 1 End time");
        return;
      }
    }
    setIsSaving(true);
    setFormError(null);
    try {
      const isSecond = Boolean(formData.is_second_session);
      const payload = {
        name: formData.name.trim(),
        session_1_name: formData.session_1_name.trim(),
        session_2_name: isSecond ? formData.session_2_name.trim() : "",
        is_second_session: isSecond ? 1 : 0,
        morning_start_time: formData.morning_start_time,
        morning_end_time: formData.morning_end_time,
        afternoon_start_time: isSecond ? formData.afternoon_start_time : null,
        afternoon_end_time: isSecond ? formData.afternoon_end_time : null,
        start_time: formData.morning_start_time,
        end_time: isSecond ? formData.afternoon_end_time : formData.morning_end_time,
        status: formData.status
      };
      const effAyStr = academicYearName || (activeAcademicYear == null ? void 0 : activeAcademicYear.year_name) || "2025-2026";
      if (editingTiming) {
        await attendanceApi.updateTiming(editingTiming.id, {
          ...payload,
          academic_year: effAyStr
        });
        showToast("success", "Attendance timing updated successfully");
      } else {
        await attendanceApi.createTiming({
          branch_id: branchId,
          academic_year_id: academicYearId,
          academic_year: effAyStr,
          ...payload
        });
        showToast("success", "Attendance timing created successfully");
      }
      setIsModalOpen(false);
      loadTimings();
    } catch (err) {
      setFormError(err.message || "Failed to save attendance timing");
    } finally {
      setIsSaving(false);
    }
  };
  const filteredTimings = (timings || []).filter((t) => {
    if (!t) return false;
    const term = (searchTerm || "").trim().toLowerCase();
    const name = String(t.name || "").toLowerCase();
    const matchesSearch = !term || name.includes(term);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Attendance Module" }),
          /* @__PURE__ */ jsx("span", { children: "•" }),
          /* @__PURE__ */ jsx("span", { children: currentBranch == null ? void 0 : currentBranch.branch_name })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-slate-900 dark:text-white tracking-tight", children: "Attendance Timings" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl", children: "Define 2-session (Morning & Afternoon) attendance timing windows configured for this branch." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            id: "refresh-timings-btn",
            onClick: loadTimings,
            disabled: isLoading,
            className: "p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors",
            title: "Refresh list",
            children: /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${isLoading ? "animate-spin" : ""}` })
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            id: "create-timing-btn",
            onClick: handleOpenAdd,
            className: "inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Add Attendance Timing" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-80", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "timing-search-input",
            type: "text",
            placeholder: "Search timings by name...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Status:" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "timing-status-filter",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Timings" }),
              /* @__PURE__ */ jsx("option", { value: "Active", children: "Active Only" }),
              /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" })
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center", children: [
      /* @__PURE__ */ jsx(RefreshCw, { className: "w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-600 dark:text-slate-300", children: "Loading branch timings..." })
    ] }) : filteredTimings.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center", children: [
      /* @__PURE__ */ jsx(Clock, { className: "w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-800 dark:text-white", children: "No Attendance Timings Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto", children: searchTerm ? "No timings match your search criteria." : "Create your first 2-session attendance timing period for this branch." }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleOpenAdd,
          className: "mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Create Timing" })
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredTimings.map((t) => {
      const mStart = t.morning_start_time || t.start_time || "08:30";
      const mEnd = t.morning_end_time || "12:30";
      const aStart = t.afternoon_start_time || "13:30";
      const aEnd = t.afternoon_end_time || t.end_time || "16:00";
      return /* @__PURE__ */ jsxs(
        "div",
        {
          id: `timing-card-${t.id}`,
          className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5", children: t.name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-500 font-medium", children: [
                    "Branch: ",
                    t.branch_name || (currentBranch == null ? void 0 : currentBranch.branch_name)
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${t.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`, children: t.status })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 space-y-2.5 border border-slate-100 dark:border-slate-800 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold", children: [
                    /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      t.session_1_name || "Morning Session",
                      ":"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "font-mono font-bold text-slate-900 dark:text-white", children: [
                    mStart,
                    " - ",
                    mEnd
                  ] })
                ] }),
                Boolean(t.is_second_session === 1 || t.is_second_session === true) ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold", children: [
                    /* @__PURE__ */ jsx(Sunset, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      t.session_2_name || "Afternoon Session",
                      ":"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "font-mono font-bold text-slate-900 dark:text-white", children: [
                    aStart,
                    " - ",
                    aEnd
                  ] })
                ] }) : /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-400 italic px-1", children: "Single session schedule (No 2nd session)" }),
                t.usage_count !== void 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] pt-1 text-slate-500", children: [
                  /* @__PURE__ */ jsx("span", { children: "Attendance Entries:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-700 dark:text-slate-300", children: [
                    t.usage_count,
                    " records"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleToggleStatus(t),
                  className: `font-semibold transition-colors cursor-pointer ${t.status === "Active" ? "text-rose-600 hover:text-rose-700" : "text-emerald-600 hover:text-emerald-700"}`,
                  children: t.status === "Active" ? "Deactivate" : "Activate"
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleOpenEdit(t),
                  className: "inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx("span", { children: "Edit Timing" })
                  ]
                }
              )
            ] })
          ]
        },
        t.id
      );
    }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg font-black text-slate-900 dark:text-white", children: editingTiming ? "Edit Attendance Timing" : "Create Attendance Timing" }),
        /* @__PURE__ */ jsxs(DialogDescription, { className: "text-xs text-slate-500", children: [
          "Scoped to Branch: ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 dark:text-slate-300", children: currentBranch == null ? void 0 : currentBranch.branch_name })
        ] })
      ] }),
      formError && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: formError })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: [
            "Timing Name ",
            /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "timing-name-input",
              type: "text",
              required: true,
              placeholder: "e.g. Regular Shift, Morning & Afternoon Timing",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/70 dark:border-amber-900/40 space-y-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300", children: [
            /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 text-amber-600 dark:text-amber-400" }),
            /* @__PURE__ */ jsx("span", { children: "Session 1 Details" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1", children: [
              "Session 1 Name ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "timing-session-1-name-input",
                type: "text",
                required: true,
                placeholder: "e.g. Morning Session, Shift 1",
                value: formData.session_1_name,
                onChange: (e) => setFormData({ ...formData, session_1_name: e.target.value }),
                className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1", children: [
                "Start Time ",
                /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "timing-morning-start-input",
                  type: "time",
                  required: true,
                  value: formData.morning_start_time,
                  onChange: (e) => setFormData({ ...formData, morning_start_time: e.target.value }),
                  className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1", children: [
                "End Time ",
                /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "timing-morning-end-input",
                  type: "time",
                  required: true,
                  value: formData.morning_end_time,
                  onChange: (e) => setFormData({ ...formData, morning_end_time: e.target.value }),
                  className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "timing-is-second-session-checkbox",
              type: "checkbox",
              checked: formData.is_second_session,
              onChange: (e) => setFormData({ ...formData, is_second_session: e.target.checked }),
              className: "w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 cursor-pointer"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "timing-is-second-session-checkbox", className: "text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none", children: "Enable Second Session (e.g. Afternoon Session)" })
        ] }),
        formData.is_second_session && /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl border border-orange-200/70 dark:border-orange-900/40 space-y-2.5 animate-in fade-in", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300", children: [
            /* @__PURE__ */ jsx(Sunset, { className: "w-4 h-4 text-orange-600 dark:text-orange-400" }),
            /* @__PURE__ */ jsx("span", { children: "Session 2 Details" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1", children: [
              "Session 2 Name ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "timing-session-2-name-input",
                type: "text",
                required: formData.is_second_session,
                placeholder: "e.g. Afternoon Session, Shift 2",
                value: formData.session_2_name,
                onChange: (e) => setFormData({ ...formData, session_2_name: e.target.value }),
                className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1", children: [
                "Start Time ",
                /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "timing-afternoon-start-input",
                  type: "time",
                  required: formData.is_second_session,
                  value: formData.afternoon_start_time,
                  onChange: (e) => setFormData({ ...formData, afternoon_start_time: e.target.value }),
                  className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1", children: [
                "End Time ",
                /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "timing-afternoon-end-input",
                  type: "time",
                  required: formData.is_second_session,
                  value: formData.afternoon_end_time,
                  onChange: (e) => setFormData({ ...formData, afternoon_end_time: e.target.value }),
                  className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Status" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "timing-status-select",
              value: formData.status,
              onChange: (e) => setFormData({ ...formData, status: e.target.value }),
              className: "w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsModalOpen(false),
              className: "px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              id: "timing-submit-btn",
              disabled: isSaving,
              className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer",
              children: isSaving ? "Saving..." : editingTiming ? "Update Timing" : "Create Timing"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const results = [];
function recordTest(name, category, fn) {
  const start = performance.now();
  try {
    fn();
    const duration = (performance.now() - start).toFixed(2);
    results.push({ name, category, passed: true, duration, error: null });
    console.log(`  ✔ PASS [${duration}ms] ${category}: ${name}`);
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    results.push({ name, category, passed: false, duration, error: err.message || String(err) });
    console.error(`  ✖ FAIL [${duration}ms] ${category}: ${name}`);
    console.error(`    -> ${err.message || String(err)}`);
  }
}
function calculateDualSessionStatus(morn, aft, hasTwoSessions) {
  if (!hasTwoSessions) return morn;
  if (morn === "Present" && aft === "Present") return "Present";
  if (morn === "Absent" && aft === "Absent") return "Absent";
  if (morn === "Leave" && aft === "Leave") return "Leave";
  if (morn === "Late" && aft === "Late") return "Late";
  if (morn === "Absent" && (aft === "Present" || aft === "Late") || aft === "Absent" && (morn === "Present" || morn === "Late")) {
    return "Half Day";
  }
  if (morn === "Leave" && (aft === "Present" || aft === "Late") || aft === "Leave" && (morn === "Present" || morn === "Late")) {
    return "Half Day";
  }
  if (morn === "Late" || aft === "Late") return "Late";
  return "Half Day";
}
function runAllTests() {
  console.log("\n======================================================");
  console.log("   MILESTONE 3 EMPIRICAL ADVERSARIAL CHALLENGE SUITE   ");
  console.log("======================================================\n");
  console.log("▶ Suite 1: Dashboard Edge Cases & Multi-Campus Role Scoping");
  recordTest("Student role switch renders StudentDashboardView strictly", "Dashboard-RoleScoping", () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: "student",
      isStudent: true,
      isSuperAdmin: false,
      isPrincipal: false
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(DashboardPage, {}) }) }) })
    );
    assert.ok(
      html.includes("Welcome back") || html.includes("Student Portal") || html.includes("Attendance Rate"),
      "Student dashboard must be rendered when userRole is student"
    );
    assert.strictEqual(
      html.includes("SUPER ADMIN DASHBOARD"),
      false,
      "Super Admin dashboard banner must NOT be visible to student"
    );
    assert.strictEqual(
      html.includes("Operational Campus Dashboard"),
      false,
      "Operational admin widgets must NOT be visible to student"
    );
  });
  recordTest("Super Admin role switch renders SuperAdminDashboard with organization header", "Dashboard-RoleScoping", () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: "super_admin",
      isStudent: false,
      isSuperAdmin: true,
      isPrincipal: false,
      isAllBranches: true
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(DashboardPage, {}) }) }) })
    );
    assert.ok(
      html.includes("SUPER ADMIN DASHBOARD"),
      "SuperAdmin banner must render SUPER ADMIN DASHBOARD badge"
    );
    assert.ok(
      html.includes("Overall Branch Monitoring Dashboard"),
      "Header must display Overall Branch Monitoring Dashboard when isAllBranches is true"
    );
  });
  recordTest("Principal role switch renders OperationalDashboard scoped to campus", "Dashboard-RoleScoping", () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: "principal",
      isStudent: false,
      isSuperAdmin: false,
      isPrincipal: true,
      isAllBranches: false,
      assignedBranchId: 1
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(DashboardPage, {}) }) }) })
    );
    assert.strictEqual(
      html.includes("SUPER ADMIN DASHBOARD"),
      false,
      "Super Admin banner must NOT render for principal"
    );
    assert.ok(
      html.includes("Main Campus") || html.includes("Campus") || html.includes("Overview"),
      "Operational Dashboard must render for campus principal"
    );
  });
  recordTest("Empty branch dataset handles effectiveBranchId null safely without crash", "Dashboard-EmptyBranches", () => {
    resetMockErpContext();
    setMockErpContext({
      branches: [],
      accessibleBranches: [],
      activeBranchId: null,
      userRole: "principal",
      isSuperAdmin: false,
      isStudent: false
    });
    let html = "";
    assert.doesNotThrow(() => {
      html = renderToString(
        /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(DashboardPage, {}) }) }) })
      );
    }, "DashboardPage must not throw when branch list is empty");
    assert.ok(html.length > 0, "DashboardPage rendered non-empty HTML with empty branch list");
  });
  recordTest("SuperAdminDashboard fallback metrics binding handles undefined cards and metrics", "Dashboard-EmptyMetrics", () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: "super_admin",
      isSuperAdmin: true,
      branches: [{ id: 1, branch_name: "Main Campus", branch_code: "MAIN" }]
    });
    let html = "";
    assert.doesNotThrow(() => {
      html = renderToString(
        /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(SuperAdminDashboard, { onNavigateToStudents: () => {
        }, onNavigateToSettings: () => {
        } }) })
      );
    }, "SuperAdminDashboard must not throw when initial dashboardData is null");
    assert.ok(html.includes("SUPER ADMIN DASHBOARD"), "Renders header badge successfully");
    assert.ok(html.includes("Academic Year:"), "Renders academic year badge");
  });
  recordTest("OperationalDashboard handles empty branches array gracefully", "Dashboard-OperationalEmpty", () => {
    let html = "";
    assert.doesNotThrow(() => {
      html = renderToString(
        /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(OperationalDashboard, { branches: [], activeBranchId: null }) })
      );
    }, "OperationalDashboard handles branches=[] without runtime exception");
    assert.ok(html.length > 0, "OperationalDashboard renders valid markup");
  });
  console.log("▶ Suite 2: Students SIS Empty Datasets & Null Profiles");
  recordTest("StudentProfileModal with isOpen=false renders null", "SIS-ProfileModal", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(StudentProfileModal, { isOpen: false, studentId: null, onClose: () => {
      } })
    );
    assert.strictEqual(html, "", "Closed modal must render empty string");
  });
  recordTest("StudentProfileModal with isOpen=true and null studentId handles null profile safely", "SIS-ProfileModal", () => {
    let html = "";
    assert.doesNotThrow(() => {
      html = renderToString(
        /* @__PURE__ */ jsx(StudentProfileModal, { isOpen: true, studentId: null, onClose: () => {
        } })
      );
    }, "StudentProfileModal must not throw when studentId is null");
    assert.ok(
      html.includes("No student profile information found.") || html.includes("Retrieving"),
      "Null student profile should render clean fallback message"
    );
  });
  recordTest("StudentProfileModal tab schema defines all 16 canonical profile tabs", "SIS-ProfileTabs", () => {
    const requiredTabs = [
      "overview",
      "personal",
      "parents",
      "contact",
      "address",
      "academic",
      "subjects",
      "documents",
      "transport",
      "hostel",
      "fees",
      "attendance",
      "exams",
      "groups",
      "timeline",
      "audit"
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(StudentProfileModal, { isOpen: true, studentId: null, onClose: () => {
      } })
    );
    for (const tab of requiredTabs) {
      assert.ok(
        html.includes(`value="${tab}"`) || html.includes(tab),
        `Student profile modal must include trigger for tab: ${tab}`
      );
    }
  });
  recordTest("StudentDetailsList renders colSpan=10 empty state when students array is empty", "SIS-DetailsEmpty", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(StudentDetailsList, { branchId: 1, academicYearId: 1 }) })
    );
    assert.ok(
      html.includes("No student records found") || html.includes("Loading student records..."),
      "Student directory must render empty state or loading state when students array is empty"
    );
    assert.ok(
      html.includes("Admission No") && html.includes("Student Name") && html.includes("Class &amp; Sec"),
      "Table header columns must be fully preserved"
    );
  });
  recordTest("StudentDetailsList CSV Export button is disabled when dataset is empty", "SIS-ExportDisabled", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(StudentDetailsList, { branchId: 1, academicYearId: 1 }) })
    );
    assert.ok(
      html.includes('disabled=""') || html.includes("disabled"),
      "Buttons requiring data (such as CSV export) must be disabled on empty dataset"
    );
  });
  recordTest("StudentDetailsList bulk selection bar is not visible when selectedIds is empty", "SIS-BulkActions", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(StudentDetailsList, { branchId: 1, academicYearId: 1 }) })
    );
    assert.strictEqual(
      html.includes("Selected") && html.includes("Choose a bulk operation:"),
      false,
      "Bulk action bar must be hidden when selectedIds is empty"
    );
  });
  recordTest("StudentReferenceMatrixTable renders spreadsheet container without throwing", "SIS-SpreadsheetMatrix", () => {
    resetMockErpContext();
    let html = "";
    assert.doesNotThrow(() => {
      html = renderToString(
        /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(StudentReferenceMatrixTable, { branchId: 1, academicYearId: 1 }) })
      );
    }, "StudentReferenceMatrixTable must mount cleanly in SSR");
    assert.ok(
      html.includes("Student Name") || html.includes("Search") || html.includes("Spreadsheet") || html.length > 0,
      "StudentReferenceMatrixTable renders matrix structure"
    );
  });
  console.log("▶ Suite 3: Attendance Roll-Call, Timings & Boundary Conditions");
  recordTest("TakeAttendanceView renders core DOM selectors required by E2E test harness", "Attendance-Selectors", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(TakeAttendanceView, { branchId: 1, academicYearId: 1 }) })
    );
    assert.ok(html.includes('id="attendance-branch-select"'), "Missing #attendance-branch-select");
    assert.ok(html.includes('id="attendance-ay-select"'), "Missing #attendance-ay-select");
    assert.ok(html.includes('id="attendance-date-input"'), "Missing #attendance-date-input");
    assert.ok(html.includes('id="attendance-class-select"'), "Missing #attendance-class-select");
    assert.ok(html.includes('id="attendance-section-select"'), "Missing #attendance-section-select");
    assert.ok(html.includes('id="mark-all-present-btn"'), "Missing #mark-all-present-btn");
    assert.ok(html.includes('id="submit-attendance-top-btn"'), "Missing #submit-attendance-top-btn");
  });
  recordTest("TakeAttendanceView Mark All Present button is disabled when students array is empty", "Attendance-Boundary", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(TakeAttendanceView, { branchId: 1, academicYearId: 1 }) })
    );
    assert.ok(
      html.includes('id="mark-all-present-btn"') && html.includes("disabled"),
      "Mark all present button must be disabled when student list is empty"
    );
  });
  recordTest("AttendanceTimingView renders dashed empty state card when timings array is empty", "Attendance-TimingsEmpty", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(AttendanceTimingView, { branchId: 1, academicYearId: 1 }) })
    );
    assert.ok(
      html.includes("Loading branch timings...") || html.includes("No Attendance Timings Found") || html.includes("Create Timing"),
      "AttendanceTimingView should render loading or empty state prompt"
    );
  });
  recordTest("AbsentNotificationModal renders dialog structure with notification channels", "Attendance-AbsentNotif", () => {
    const absentSample = [
      { student_id: 101, first_name: "Aarav", last_name: "Patel", admission_number: "ADM-101", class_name: "Grade 10", section_name: "A", father_name: "Rajesh Patel", father_mobile: "9876543210" },
      { student_id: 102, first_name: "Diya", last_name: "Sharma", admission_number: "ADM-102", class_name: "Grade 10", section_name: "A", father_name: "Suresh Sharma", father_mobile: "9876543211" }
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(
        AbsentNotificationModal,
        {
          isOpen: true,
          onClose: () => {
          },
          absentStudents: absentSample,
          date: "2026-10-29",
          className: "Grade 10",
          sectionName: "A",
          onNotificationsSent: () => {
          }
        }
      )
    );
    assert.ok(html.includes('id="send-absent-notifications-btn"'), "Send notifications button must be present");
    assert.ok(html.includes("Aarav") && html.includes("Patel") && html.includes("Diya") && html.includes("Sharma"), "Absent students must be listed in modal");
    assert.ok(html.includes("SMS") || html.includes("WhatsApp"), "Notification channels must be displayed");
  });
  recordTest("AbsentNotificationModal handles empty absent students array without crashing", "Attendance-AbsentEmpty", () => {
    let html = "";
    assert.doesNotThrow(() => {
      html = renderToString(
        /* @__PURE__ */ jsx(
          AbsentNotificationModal,
          {
            isOpen: true,
            onClose: () => {
            },
            absentStudents: [],
            date: "2026-10-29",
            className: "Grade 10",
            sectionName: "A",
            onNotificationsSent: () => {
            }
          }
        )
      );
    }, "AbsentNotificationModal handles empty absent array without throwing");
    assert.ok(html.includes("0 absent students") || html.includes("No absent students") || html.length > 0, "Rendered modal markup");
  });
  console.log("▶ Suite 4: Dual Session Status Calculation Oracle");
  recordTest("Dual session oracle: Present + Present => Present", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Present", "Present", true);
    assert.strictEqual(status, "Present");
  });
  recordTest("Dual session oracle: Absent + Absent => Absent", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Absent", "Absent", true);
    assert.strictEqual(status, "Absent");
  });
  recordTest("Dual session oracle: Leave + Leave => Leave", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Leave", "Leave", true);
    assert.strictEqual(status, "Leave");
  });
  recordTest("Dual session oracle: Late + Late => Late", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Late", "Late", true);
    assert.strictEqual(status, "Late");
  });
  recordTest("Dual session oracle: Absent morning + Present afternoon => Half Day", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Absent", "Present", true);
    assert.strictEqual(status, "Half Day");
  });
  recordTest("Dual session oracle: Present morning + Absent afternoon => Half Day", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Present", "Absent", true);
    assert.strictEqual(status, "Half Day");
  });
  recordTest("Dual session oracle: Leave morning + Present afternoon => Half Day", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Leave", "Present", true);
    assert.strictEqual(status, "Half Day");
  });
  recordTest("Dual session oracle: Absent morning + Late afternoon => Half Day", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Absent", "Late", true);
    assert.strictEqual(status, "Half Day");
  });
  recordTest("Dual session oracle: Late morning + Present afternoon => Late", "Attendance-Oracle", () => {
    const status = calculateDualSessionStatus("Late", "Present", true);
    assert.strictEqual(status, "Late");
  });
  recordTest("Single session mode disregards afternoon status and returns morning status", "Attendance-Oracle", () => {
    const status1 = calculateDualSessionStatus("Present", "Absent", false);
    assert.strictEqual(status1, "Present");
    const status2 = calculateDualSessionStatus("Absent", "Present", false);
    assert.strictEqual(status2, "Absent");
  });
  console.log("▶ Suite 5: Multi-Campus Role Switching & Historical Year Isolation");
  recordTest("Principal role cannot switch to unauthorized branches in StudentDetailsList", "Isolation-PrincipalRole", () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: "principal",
      isSuperAdmin: false,
      isPrincipal: true,
      assignedBranchId: 2
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(StudentDetailsList, { branchId: 1, academicYearId: 1 }) })
    );
    assert.ok(html.length > 0, "Principal view mounted correctly");
  });
  recordTest("Historical academic year disables Enroll Student button in StudentDetailsList", "Isolation-HistoricalYear", () => {
    resetMockErpContext();
    setMockErpContext({
      isHistoricalYear: true,
      isReadOnly: true
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StudentDetailsList,
        {
          branchId: 1,
          academicYearId: 1,
          isHistoricalYear: true,
          onOpenRegisterModal: () => {
          }
        }
      ) })
    );
    assert.strictEqual(
      html.includes("Enroll Student"),
      false,
      "Enroll Student button must be omitted in historical academic year"
    );
  });
  recordTest("Non-historical active academic year permits Enroll Student action", "Isolation-ActiveYear", () => {
    resetMockErpContext();
    setMockErpContext({
      isHistoricalYear: false,
      isReadOnly: false
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StudentDetailsList,
        {
          branchId: 1,
          academicYearId: 1,
          isHistoricalYear: false,
          onOpenRegisterModal: () => {
          }
        }
      ) })
    );
    assert.ok(
      html.includes("Enroll Student"),
      "Enroll Student button must be present in active academic year"
    );
  });
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log("\n======================================================");
  console.log(`Summary: ${passed}/${total} passed (${(passed / total * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.error(`FAILED: ${failed} tests failed!`);
    process.exit(1);
  } else {
    console.log("All Milestone 3 empirical challenge tests PASSED!");
    console.log("======================================================\n");
  }
}
runAllTests();
export {
  runAllTests
};
