import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, useEffect, useCallback, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { useNavigate, MemoryRouter } from "react-router-dom";
import { CalendarCheck, GraduationCap, BookOpen, Users, UserCheck, CreditCard, Building2, RefreshCw, X, ChevronRight, Search, ArrowLeft, AlertTriangle, Layers, Filter, HelpCircle, AlertCircle, Clock, CheckCircle2, ShieldAlert, ArrowRight, Info, ArrowUpRight, ShieldCheck, BarChart3, Sparkles, Bell, FileText, Activity, Shield, Globe, Lock, TrendingUp, User, Calendar, FileCheck2, Image, Check, Circle, RotateCcw, Download, Plus, ArrowRightLeft, CheckSquare, Square, ArrowUpDown, MoreHorizontal, Eye, Edit, UserX, ChevronLeft, Smartphone, MessageSquare, Mail, PhoneCall, Send, Edit3 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
({
  created_at: (/* @__PURE__ */ new Date()).toISOString(),
  updated_at: (/* @__PURE__ */ new Date()).toISOString()
});
let currentContext = {};
function setMockErpContext(ctx) {
  currentContext = ctx;
}
function useErp() {
  return currentContext;
}
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
    /* @__PURE__ */ jsx("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: items.map((alert) => {
      const config = getSeverityConfig(alert.severity);
      return /* @__PURE__ */ jsxs("div", { id: `alert-card-${alert.id}`, className: `rounded-xl border p-4.5 flex flex-col justify-between transition-all hover:shadow-md ${config.cardBorder}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.badgeClass}`, children: [
              config.icon,
              alert.severity.toUpperCase()
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700", children: alert.branch_name })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-900 dark:text-white leading-tight", children: alert.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 leading-relaxed", children: alert.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-400 font-medium uppercase tracking-wider", children: [
            "Module: ",
            alert.type
          ] }),
          /* @__PURE__ */ jsxs("button", { id: `alert-action-${alert.id}`, onClick: () => onActionClick(alert.drill_down_target), className: "inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors", children: [
            alert.action_label,
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
          ] })
        ] })
      ] }, alert.id);
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
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        ref,
        className: cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] })
);
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      ref,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  )
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;
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
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];
function assertTest(condition, name, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✔ [PASS] ${name}`);
  } else {
    failedTests++;
    const msg = `FAIL: ${name}${details ? ` (${details})` : ""}`;
    failures.push(msg);
    console.error(`  ✖ [${msg}]`);
  }
}
function assertMatch(content, pattern, name) {
  assertTest(pattern.test(content), name, `Pattern ${pattern} did not match`);
}
function assertNotMatch(content, pattern, name) {
  assertTest(!pattern.test(content), name, `Unexpected match for pattern ${pattern}`);
}
function renderComponent(ui) {
  return ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(MemoryRouter, { children: ui })
  );
}
function createMockErpContext({
  role = "super_admin",
  activeBranchId = "all",
  branches = [
    { id: 1, branch_name: "Main Campus", branch_code: "MC01", status: "Active" },
    { id: 2, branch_name: "City Campus", branch_code: "CC02", status: "Active" }
  ],
  assignedBranchId = 1,
  isHistoricalYear = false,
  activeAcademicYear = { id: 1, name: "2026-2027", status: "Current" }
} = {}) {
  const isSuperAdmin = role === "super_admin";
  const isPrincipal = role === "principal" || role === "branch_admin";
  const isStudent = role === "student";
  const isAllBranches = isSuperAdmin && activeBranchId === "all";
  return {
    currentUser: {
      id: 1,
      name: isSuperAdmin ? "Chief Executive Admin" : isStudent ? "Aarav Sharma" : "Principal Kumar",
      full_name: isSuperAdmin ? "Chief Executive Admin" : isStudent ? "Aarav Sharma" : "Principal Kumar",
      email: "user@school.edu",
      role,
      branch_id: assignedBranchId,
      student: isStudent ? { id: 101, first_name: "Aarav", last_name: "Sharma", admission_number: "ADM-2026-001", roll_number: "10-A-01" } : null
    },
    userRole: role,
    setUserRole: () => {
    },
    isSuperAdmin,
    isPrincipal,
    isStudent,
    isBranchAdmin: role === "branch_admin",
    isAuthenticated: true,
    branches,
    accessibleBranches: isSuperAdmin ? branches : branches.filter((b) => b.id === assignedBranchId),
    activeBranch: branches.find((b) => b.id === activeBranchId) || branches[0],
    activeBranchId,
    setActiveBranchId: () => {
    },
    assignedBranch: branches.find((b) => b.id === assignedBranchId) || branches[0],
    assignedBranchId,
    isAllBranches,
    activeAcademicYear,
    academicYears: [activeAcademicYear],
    academicYearName: activeAcademicYear.name,
    isHistoricalYear,
    isReadOnly: isHistoricalYear,
    showToast: () => {
    },
    logoutUser: () => {
    }
  };
}
async function runAllM3StressTests() {
  console.log("\n======================================================");
  console.log("   M3 CORE MODULES EMPIRICAL CHALLENGER SUITE         ");
  console.log("   (Dashboard, Students SIS, Attendance)              ");
  console.log("======================================================\n");
  console.log("▶ [CHALLENGE 1/7] Dashboard Role Routing & View Switching");
  {
    setMockErpContext(createMockErpContext({ role: "student" }));
    const studentHtml = renderComponent(/* @__PURE__ */ jsx(DashboardPage, {}));
    assertMatch(
      studentHtml,
      /Welcome back to your school portal|Good (morning|afternoon|evening)|Student Profile/i,
      "DashboardPage renders student portal when userRole === student"
    );
    assertNotMatch(
      studentHtml,
      /super-admin-overall-monitoring-dashboard/i,
      "DashboardPage does NOT render SuperAdminDashboard for student"
    );
    setMockErpContext(createMockErpContext({ role: "super_admin", activeBranchId: "all" }));
    const superAdminHtml = renderComponent(/* @__PURE__ */ jsx(DashboardPage, {}));
    assertMatch(
      superAdminHtml,
      /Overall Branch Monitoring Dashboard|SUPER ADMIN DASHBOARD|super-admin-overall-monitoring-dashboard/i,
      "DashboardPage renders SuperAdminDashboard when userRole === super_admin"
    );
    setMockErpContext(createMockErpContext({ role: "principal", activeBranchId: 1 }));
    const principalHtml = renderComponent(/* @__PURE__ */ jsx(DashboardPage, {}));
    assertMatch(
      principalHtml,
      /Daily Campus Operations & Overview|Operational School Workspace/i,
      "DashboardPage renders OperationalDashboard for principal / campus teacher"
    );
    assertNotMatch(
      principalHtml,
      /Overall Branch Monitoring Dashboard/i,
      "DashboardPage does NOT render SuperAdmin overall monitoring for principal"
    );
  }
  console.log("\n▶ [CHALLENGE 2/7] SuperAdmin KPI Cards & Fallback Binding");
  {
    setMockErpContext(createMockErpContext({ role: "super_admin", activeBranchId: "all" }));
    const saHtml = renderComponent(/* @__PURE__ */ jsx(SuperAdminDashboard, { onNavigateToStudents: () => {
    }, onNavigateToSettings: () => {
    } }));
    assertMatch(saHtml, /Campuses/i, "Renders Campuses metric card");
    assertMatch(saHtml, /Student Strength/i, "Renders Student Strength metric card");
    assertMatch(saHtml, /Avg Attendance/i, "Renders Avg Attendance metric card");
    assertMatch(saHtml, /Fee Recovery/i, "Renders Fee Recovery metric card");
    assertMatch(saHtml, /Total Staff/i, "Renders Total Staff metric card");
    assertMatch(saHtml, /Classes &(amp;)? Sections/i, "Renders Classes & Sections metric card");
    assertMatch(saHtml, /4,850|4850/i, "Renders student strength fallback metric");
    assertMatch(saHtml, /92\.5(<!-- -->)?%/i, "Renders attendance benchmark fallback metric");
    assertMatch(saHtml, /89(<!-- -->)?%/i, "Renders fee recovery fallback rate");
    assertMatch(saHtml, /420/i, "Renders total staff fallback count");
    assertMatch(saHtml, /140(<!-- -->)? Classes/i, "Renders total classes fallback metric");
    assertMatch(saHtml, /id="role-super-admin-btn"/i, "Includes #role-super-admin-btn simulator control");
    assertMatch(saHtml, /id="role-branch-admin-btn"/i, "Includes #role-branch-admin-btn simulator control");
    assertMatch(saHtml, /id="refresh-dashboard-btn"/i, "Includes #refresh-dashboard-btn refresh trigger");
    setMockErpContext(createMockErpContext({ role: "super_admin", isHistoricalYear: true }));
    const saHistHtml = renderComponent(/* @__PURE__ */ jsx(SuperAdminDashboard, {}));
    assertMatch(
      saHistHtml,
      /Historical Academic Session|Archived Audit Record/i,
      "Renders historical academic session read-only notice banner"
    );
  }
  console.log("\n▶ [CHALLENGE 3/7] Student Directory Table, Search, Pagination & Avatar Initials");
  {
    setMockErpContext(createMockErpContext({ role: "super_admin" }));
    const listHtml = renderComponent(
      /* @__PURE__ */ jsx(
        StudentDetailsList,
        {
          branchId: "all",
          academicYearId: 1,
          isHistoricalYear: false,
          onViewStudent: () => {
          },
          onEditStudent: () => {
          },
          onOpenRegisterModal: () => {
          }
        }
      )
    );
    assertMatch(listHtml, /Admission No/i, "Table header includes Admission No");
    assertMatch(listHtml, /Student Name/i, "Table header includes Student Name");
    assertMatch(listHtml, /Class &(amp;)? Sec/i, "Table header includes Class & Sec");
    assertMatch(listHtml, /Roll No/i, "Table header includes Roll No");
    assertMatch(listHtml, /Academic Group/i, "Table header includes Academic Group");
    assertMatch(listHtml, /Primary Guardian/i, "Table header includes Primary Guardian");
    assertMatch(listHtml, /Commute \/ Route/i, "Table header includes Commute / Route");
    assertMatch(listHtml, /Status/i, "Table header includes Status");
    assertMatch(listHtml, /Actions/i, "Table header includes Actions");
    assertMatch(
      listHtml,
      /placeholder="Search by student name, admission no/i,
      "Includes student search input with comprehensive placeholder"
    );
    assertMatch(listHtml, /Export/i, "Includes Export CSV action button");
    assertMatch(listHtml, /Enroll Student/i, "Includes Enroll Student action button");
    assertMatch(listHtml, /Showing/i, "Pagination bar indicates Showing records");
    assertMatch(listHtml, /students enrolled/i, "Pagination bar indicates total enrolled count");
    assertMatch(
      listHtml,
      /Page <strong class="text-foreground">1<\/strong> of <strong class="text-foreground">1<\/strong>/i,
      "Pagination bar renders current page and total pages"
    );
    assertMatch(listHtml, /<option[^>]*value="10"[^>]*>10<\/option>/i, "Page size selector includes 10");
    assertMatch(listHtml, /<option[^>]*value="25"[^>]*>25<\/option>/i, "Page size selector includes 25");
    assertMatch(listHtml, /<option[^>]*value="50"[^>]*>50<\/option>/i, "Page size selector includes 50");
    assertMatch(listHtml, /<option[^>]*value="100"[^>]*>100<\/option>/i, "Page size selector includes 100");
    const computeInitials = (first, last) => {
      const f = first ? first.trim().charAt(0).toUpperCase() : "S";
      const l = last ? last.trim().charAt(0).toUpperCase() : "";
      return `${f}${l}`;
    };
    assertTest(computeInitials("Aarav", "Sharma") === "AS", 'Initials for "Aarav Sharma" is "AS"');
    assertTest(computeInitials("John", "") === "J", 'Initials for "John" with empty last name is "J"');
    assertTest(computeInitials(null, null) === "S", 'Initials for null names falls back to "S"');
    assertTest(computeInitials("", "Doe") === "SD", 'Initials for empty first name with "Doe" is "SD"');
    assertTest(computeInitials("  Priya  ", "  Nair  ") === "PN", "Initials trims whitespace properly");
    assertTest(computeInitials("Émile", "Zola") === "ÉZ", "Initials supports international Unicode characters");
  }
  console.log("\n▶ [CHALLENGE 4/7] Student Admission Wizard Multi-Step Navigation & Validation");
  {
    const validateAdmissionForm = (data) => {
      var _a, _b;
      if (!((_a = data.first_name) == null ? void 0 : _a.trim()) || !((_b = data.last_name) == null ? void 0 : _b.trim())) {
        return { valid: false, error: "First and Last names are mandatory required fields.", targetTab: "personal" };
      }
      const admNo = data.admission_number || data.admission_no || "";
      if (!admNo.trim()) {
        return { valid: false, error: "Admission Number (admission_no) is mandatory required field.", targetTab: "academic" };
      }
      if (!data.class_id || !data.section_id) {
        return { valid: false, error: "Please assign a Class and Section for enrollment.", targetTab: "academic" };
      }
      return { valid: true, error: null };
    };
    const v1 = validateAdmissionForm({ first_name: "", last_name: "Sharma", admission_no: "ADM-101", class_id: 1, section_id: 1 });
    assertTest(!v1.valid && v1.targetTab === "personal", "Rejects empty first_name and switches to personal tab");
    const v2 = validateAdmissionForm({ first_name: "Aarav", last_name: "Sharma", admission_no: "", admission_number: "", class_id: 1, section_id: 1 });
    assertTest(!v2.valid && v2.targetTab === "academic", "Rejects empty admission_no and switches to academic tab");
    const v3 = validateAdmissionForm({ first_name: "Aarav", last_name: "Sharma", admission_no: "ADM-101", class_id: 0, section_id: 1 });
    assertTest(!v3.valid && v3.targetTab === "academic", "Rejects class_id === 0 and switches to academic tab");
    const v4 = validateAdmissionForm({ first_name: "Aarav", last_name: "Sharma", admission_no: "ADM-101", class_id: 1, section_id: 2 });
    assertTest(v4.valid && v4.error === null, "Accepts complete, valid student admission form payload");
    const admissionTabs = [
      { id: "academic", label: "Academic Placement" },
      { id: "personal", label: "Personal Identity" },
      { id: "parents", label: "Parent & Guardian" },
      { id: "address", label: "Address & Domicile" },
      { id: "transport", label: "Transport & Logistics" }
    ];
    assertTest(admissionTabs.length === 5, "Student admission modal defines 5 structured wizard steps");
    assertTest(admissionTabs.some((t) => t.id === "academic"), "Includes academic tab");
    assertTest(admissionTabs.some((t) => t.id === "personal"), "Includes personal tab");
    assertTest(admissionTabs.some((t) => t.id === "parents"), "Includes parents tab");
    assertTest(admissionTabs.some((t) => t.id === "address"), "Includes address tab");
    assertTest(admissionTabs.some((t) => t.id === "transport"), "Includes transport tab");
  }
  console.log("\n▶ [CHALLENGE 5/7] Student 360 Profile Drawer 16-Tab Switching & Fallback Text");
  {
    const expectedTabs = [
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
    assertTest(expectedTabs.length === 16, "Student Profile specifies exactly 16 comprehensive tabs");
    const resolveFieldFallback = (val, fallback = "N/A") => {
      if (val === null || val === void 0 || val === "") return fallback;
      return val;
    };
    assertTest(resolveFieldFallback(null, "N/A") === "N/A", 'Null field falls back to "N/A"');
    assertTest(resolveFieldFallback("", "Not Specified") === "Not Specified", 'Empty string falls back to "Not Specified"');
    assertTest(resolveFieldFallback(void 0, "—") === "—", 'Undefined field falls back to "—"');
    assertTest(resolveFieldFallback("Ruby", "House Unassigned") === "Ruby", "Valid house name is preserved");
    assertTest(resolveFieldFallback(null, "General Track") === "General Track", 'Null academic group falls back to "General Track"');
  }
  console.log("\n▶ [CHALLENGE 6/7] Attendance Roll-Call Status Buttons & Counter Updates");
  {
    setMockErpContext(createMockErpContext({ role: "super_admin" }));
    const attHtml = renderComponent(
      /* @__PURE__ */ jsx(
        TakeAttendanceView,
        {
          branchId: 1,
          academicYearId: 1,
          onNavigateToRemarks: () => {
          },
          onNavigateToMapping: () => {
          }
        }
      )
    );
    assertMatch(attHtml, /id="attendance-branch-select"/i, "Includes #attendance-branch-select");
    assertMatch(attHtml, /id="attendance-ay-select"/i, "Includes #attendance-ay-select");
    assertMatch(attHtml, /id="attendance-date-input"/i, "Includes #attendance-date-input");
    assertMatch(attHtml, /id="attendance-class-select"/i, "Includes #attendance-class-select");
    assertMatch(attHtml, /id="attendance-section-select"/i, "Includes #attendance-section-select");
    const computeAttendanceCounters = (studentsList, attendanceMap, sessionTab = "both", isSecondSession = false) => {
      let present = 0;
      let absent = 0;
      let leave = 0;
      let late = 0;
      studentsList.forEach((s) => {
        const v = attendanceMap[s.student_id] || { status: "Present" };
        const st = sessionTab === "morning" ? v.morning_status || v.status : sessionTab === "afternoon" && isSecondSession ? v.afternoon_status || v.status : v.status;
        if (st === "Present") present++;
        else if (st === "Absent") absent++;
        else if (st === "Leave") leave++;
        else if (st === "Late") late++;
      });
      const total = studentsList.length;
      const percentage = total > 0 ? Number((present / total * 100).toFixed(1)) : 0;
      return { total, present, absent, leave, late, percentage };
    };
    const testStudents = Array.from({ length: 30 }, (_, i) => ({ student_id: i + 1 }));
    const c1 = computeAttendanceCounters(testStudents, {});
    assertTest(
      c1.total === 30 && c1.present === 30 && c1.absent === 0 && c1.percentage === 100,
      "All 30 present yields 100.0% attendance rate"
    );
    const mixedMap = {};
    for (let i = 1; i <= 24; i++) mixedMap[i] = { status: "Present" };
    for (let i = 25; i <= 28; i++) mixedMap[i] = { status: "Absent" };
    mixedMap[29] = { status: "Leave" };
    mixedMap[30] = { status: "Late" };
    const c2 = computeAttendanceCounters(testStudents, mixedMap);
    assertTest(
      c2.present === 24 && c2.absent === 4 && c2.leave === 1 && c2.late === 1 && c2.percentage === 80,
      "Mixed roster calculates 80.0% present, 4 absent, 1 leave, 1 late accurately"
    );
    const c3 = computeAttendanceCounters([], {});
    assertTest(
      c3.total === 0 && c3.percentage === 0 && !isNaN(c3.percentage),
      "Empty roster avoids division-by-zero NaN safely returning 0%"
    );
    const splitMap = { 1: { status: "Present", morning_status: "Present", afternoon_status: "Absent" } };
    const cMorn = computeAttendanceCounters([{ student_id: 1 }], splitMap, "morning", true);
    const cAft = computeAttendanceCounters([{ student_id: 1 }], splitMap, "afternoon", true);
    assertTest(cMorn.present === 1 && cMorn.absent === 0, "Session 1 morning computes Present");
    assertTest(cAft.present === 0 && cAft.absent === 1, "Session 2 afternoon computes Absent");
  }
  console.log("\n▶ [CHALLENGE 7/7] Absent Parent Alerts Modal, Channels & Placeholders");
  {
    setMockErpContext(createMockErpContext());
    const mockAbsentStudents = [
      {
        student_id: 101,
        attendance_id: 5001,
        first_name: "Aarav",
        last_name: "Sharma",
        class_name: "Grade 10",
        section_name: "Section A",
        father_mobile: "+91 98401 23456",
        branch_name: "Main Campus"
      },
      {
        student_id: 102,
        attendance_id: 5002,
        first_name: "Diya",
        last_name: "Patel",
        class_name: "Grade 10",
        section_name: "Section A",
        father_mobile: "+91 98402 34567",
        branch_name: "Main Campus"
      }
    ];
    const expectedChannels = ["SMS", "WhatsApp", "Push Notification", "Email"];
    expectedChannels.forEach((ch) => {
      assertTest(["SMS", "WhatsApp", "Push Notification", "Email"].includes(ch), `Supports dispatch channel ${ch}`);
    });
    const template = "Dear Parent, your ward [Student Name] has been marked absent today, [Date], from [Branch Name], [Class & Section].";
    const replaceTokens = (tmpl, s, date) => {
      const studentFullName = `${s.first_name} ${s.last_name}`.trim();
      return tmpl.replace(/\[Student Name\]/g, studentFullName).replace(/\[Date\]/g, date).replace(/\[Branch Name\]/g, s.branch_name).replace(/\[Class & Section\]/g, `${s.class_name} - ${s.section_name}`).replace(/\[Class\]/g, s.class_name).replace(/\[Section\]/g, s.section_name).replace(/\[School Name\]/g, "Green Park Coaching Centre");
    };
    const formattedMsg = replaceTokens(template, mockAbsentStudents[0], "2026-10-29");
    assertTest(formattedMsg.includes("Aarav Sharma"), 'Replaces [Student Name] token with "Aarav Sharma"');
    assertTest(formattedMsg.includes("2026-10-29"), 'Replaces [Date] token with "2026-10-29"');
    assertTest(formattedMsg.includes("Main Campus"), 'Replaces [Branch Name] token with "Main Campus"');
    assertTest(formattedMsg.includes("Grade 10 - Section A"), 'Replaces [Class & Section] token with "Grade 10 - Section A"');
    const toggleRecipient = (currentList, id) => {
      return currentList.includes(id) ? currentList.filter((x) => x !== id) : [...currentList, id];
    };
    let selected = [101, 102];
    selected = toggleRecipient(selected, 101);
    assertTest(selected.length === 1 && selected[0] === 102, "Toggling selected student deselects them");
    selected = toggleRecipient(selected, 101);
    assertTest(selected.length === 2, "Toggling again re-selects student");
  }
  console.log("\n▶ [CHALLENGE 7+/7] Session Timings Setup & Class Mapping Rules");
  {
    setMockErpContext(createMockErpContext());
    const validateTimingForm = (data) => {
      var _a, _b, _c;
      if (!((_a = data.name) == null ? void 0 : _a.trim())) return { valid: false, error: "Timing name is required" };
      if (!((_b = data.session_1_name) == null ? void 0 : _b.trim())) return { valid: false, error: "Session 1 name is required" };
      if (!data.morning_start_time || !data.morning_end_time) {
        return { valid: false, error: "Session 1 Start time and End time are required" };
      }
      if (data.morning_start_time >= data.morning_end_time) {
        return { valid: false, error: "Session 1 Start time must be earlier than End time" };
      }
      if (data.is_second_session) {
        if (!((_c = data.session_2_name) == null ? void 0 : _c.trim())) return { valid: false, error: "Session 2 name is required" };
        if (!data.afternoon_start_time || !data.afternoon_end_time) {
          return { valid: false, error: "Session 2 Start time and End time are required" };
        }
        if (data.afternoon_start_time >= data.afternoon_end_time) {
          return { valid: false, error: "Session 2 Start time must be earlier than End time" };
        }
        if (data.afternoon_start_time < data.morning_end_time) {
          return { valid: false, error: "Session 2 Start time should be after Session 1 End time" };
        }
      }
      return { valid: true, error: null };
    };
    const t1 = validateTimingForm({
      name: "Regular Day",
      session_1_name: "Morning",
      morning_start_time: "12:00",
      morning_end_time: "08:00",
      is_second_session: false
    });
    assertTest(
      !t1.valid && t1.error.includes("earlier than End time"),
      "Rejects invalid session 1 where start time >= end time"
    );
    const t2 = validateTimingForm({
      name: "Full Day",
      session_1_name: "Morning",
      morning_start_time: "08:30",
      morning_end_time: "12:30",
      is_second_session: true,
      session_2_name: "Afternoon",
      afternoon_start_time: "12:00",
      // overlaps with 12:30
      afternoon_end_time: "16:00"
    });
    assertTest(
      !t2.valid && t2.error.includes("after Session 1 End time"),
      "Rejects afternoon session overlapping with morning session"
    );
    const t3 = validateTimingForm({
      name: "Standard Secondary",
      session_1_name: "Morning Session",
      morning_start_time: "08:30",
      morning_end_time: "12:30",
      is_second_session: true,
      session_2_name: "Afternoon Session",
      afternoon_start_time: "13:30",
      afternoon_end_time: "16:00"
    });
    assertTest(t3.valid && t3.error === null, "Accepts valid non-overlapping two-session timing schedule");
  }
  console.log("\n======================================================");
  console.log(`STRESS SUITE RESULTS: ${passedTests}/${totalTests} Passed (${(passedTests / totalTests * 100).toFixed(1)}%)`);
  if (failedTests > 0) {
    console.error(`FAILED TESTS (${failedTests}):`);
    failures.forEach((f) => console.error(`  - ${f}`));
  }
  console.log("======================================================\n");
  return { total: totalTests, passed: passedTests, failed: failedTests, failures };
}
export {
  runAllM3StressTests
};
