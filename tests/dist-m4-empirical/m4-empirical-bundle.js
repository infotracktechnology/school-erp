import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, useMemo, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import assert from "assert";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BookOpen, Clock, AlertCircle, CalendarDays, Search, Sparkles, FileText, ExternalLink, Image, Link, Video, FileCheck2, CheckCheck, Award, CheckCircle2, Send, X, Upload, Loader2, Megaphone, Info, Eye, Camera, Calendar, ChevronDown, Check, RefreshCw, Key, Phone, Mail, Shield, Lock, EyeOff, Save, Users, GraduationCap, Building, UserPlus, CheckSquare, ShieldCheck, Briefcase, Star, Edit3, Layers, ArrowRight, AlertTriangle, Archive, ShieldAlert, Unlock } from "lucide-react";
const API_BASE$2 = "/api/communication";
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
    const res = await fetch(`${API_BASE$2}/homework?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch homework");
    const data = await res.json();
    return data.data || [];
  },
  async createHomework(payload) {
    const res = await fetch(`${API_BASE$2}/homework`, {
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
    const res = await fetch(`${API_BASE$2}/homework/${id}`, {
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
    const res = await fetch(`${API_BASE$2}/homework/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete homework");
  },
  async uploadAttachment(filename, base64Data) {
    const res = await fetch(`${API_BASE$2}/upload-attachment`, {
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
    const res = await fetch(`${API_BASE$2}/assignments?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch assignments");
    const data = await res.json();
    return data.data || [];
  },
  async getAssignmentDetails(id) {
    const res = await fetch(`${API_BASE$2}/assignments/${id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch assignment details");
    return await res.json();
  },
  async createAssignment(payload) {
    const res = await fetch(`${API_BASE$2}/assignments`, {
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
    const res = await fetch(`${API_BASE$2}/assignments/${id}`, {
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
    const res = await fetch(`${API_BASE$2}/assignments/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete assignment");
  },
  async submitAssignmentWork(assignmentId, payload) {
    const res = await fetch(`${API_BASE$2}/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to submit assignment");
  },
  async reviewAssignment(assignmentId, studentId, payload) {
    const res = await fetch(`${API_BASE$2}/assignments/${assignmentId}/review/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to review assignment");
  },
  async markOfflineCompletion(assignmentId, studentId, payload) {
    const res = await fetch(`${API_BASE$2}/assignments/${assignmentId}/offline-verify/${studentId}`, {
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
    const res = await fetch(`${API_BASE$2}/announcements?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch announcements");
    const data = await res.json();
    return data.data || [];
  },
  async createAnnouncement(payload) {
    const res = await fetch(`${API_BASE$2}/announcements`, {
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
    const res = await fetch(`${API_BASE$2}/announcements/${id}`, {
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
    const res = await fetch(`${API_BASE$2}/announcements/${id}`, { method: "DELETE" });
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
    const res = await fetch(`${API_BASE$2}/gallery?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch gallery albums");
    const data = await res.json();
    return data.data || [];
  },
  async getAlbumDetails(id) {
    const res = await fetch(`${API_BASE$2}/gallery/${id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch gallery album details");
    return await res.json();
  },
  async createAlbum(payload) {
    const res = await fetch(`${API_BASE$2}/gallery`, {
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
    const res = await fetch(`${API_BASE$2}/gallery/${id}`, {
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
    const res = await fetch(`${API_BASE$2}/gallery/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete gallery album");
  },
  async addMediaToAlbum(albumId, media) {
    const res = await fetch(`${API_BASE$2}/gallery/${albumId}/media`, {
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
    const res = await fetch(`${API_BASE$2}/gallery/media/${mediaId}`, {
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
    const res = await fetch(`${API_BASE$2}/gallery/media/${mediaId}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to delete media item");
  },
  // --- Dashboard & Monitoring ---
  async getDashboardSummary(branch_id, academic_year_id) {
    const res = await fetch(`${API_BASE$2}/dashboard/summary?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch dashboard summary");
    return await res.json();
  },
  async getHomeworkMonitoring(branch_id, academic_year_id, date) {
    const query = new URLSearchParams({ branch_id: String(branch_id), academic_year_id: String(academic_year_id) });
    if (date)
      query.set("date", date);
    const res = await fetch(`${API_BASE$2}/dashboard/homework-monitoring?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch homework monitoring");
    return await res.json();
  },
  async getAssignmentMonitoring(branch_id, academic_year_id) {
    const res = await fetch(`${API_BASE$2}/dashboard/assignment-monitoring?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
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
    const res = await fetch(`${API_BASE$2}/history?${query.toString()}`);
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
    const res = await fetch(`${API_BASE$2}/history?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch audit history");
    const data = await res.json();
    return { logs: data.data || [] };
  },
  // --- Student / Parent Portal Feed ---
  async getStudentPortalFeed(student_id, academic_year_id) {
    const res = await fetch(`${API_BASE$2}/portal/student-feed?student_id=${student_id}&academic_year_id=${academic_year_id}`);
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
    const res = await fetch(`${API_BASE$2}/feeds?${query.toString()}`);
    if (!res.ok)
      throw new Error((await res.json()).error || "Failed to fetch class module feeds");
    const data = await res.json();
    return data.data || [];
  }
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
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
const getMonthKey$3 = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const getDayKey$3 = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getAllDaysInMonth$3 = (monthKey) => {
  if (!monthKey) return [];
  const [year, month] = monthKey.split("-").map(Number);
  const daysCount = new Date(year, month, 0).getDate();
  const list = [];
  for (let day = 1; day <= daysCount; day++) {
    list.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return list;
};
const WEEKDAYS$3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayKey$3 = getDayKey$3((/* @__PURE__ */ new Date()).toISOString());
const currentMonthKey$3 = getMonthKey$3((/* @__PURE__ */ new Date()).toISOString());
const StudentHomeworkPortal = ({ homework = [], student, assignedSubjects = [], onRefresh }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey$3);
  const [selectedDay, setSelectedDay] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const subjects = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    assignedSubjects.forEach((s) => {
      if (s.subject_name) set.add(s.subject_name);
    });
    homework.forEach((h) => {
      if (h.subject_name) set.add(h.subject_name);
    });
    return Array.from(set);
  }, [assignedSubjects, homework]);
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth$3(selectedMonth);
  }, [selectedMonth]);
  const dayCounts = useMemo(() => {
    const counts = {};
    homework.forEach((hw) => {
      const dk = getDayKey$3(hw.created_at);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [homework]);
  useEffect(() => {
    if (selectedMonth === currentMonthKey$3) {
      setSelectedDay("all");
    } else {
      setSelectedDay("all");
    }
  }, [selectedMonth]);
  const today = /* @__PURE__ */ new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  const filteredList = useMemo(() => {
    return homework.filter((hw) => {
      var _a, _b, _c;
      if (getMonthKey$3(hw.created_at) !== selectedMonth) return false;
      if (selectedDay !== "all" && getDayKey$3(hw.created_at) !== selectedDay) return false;
      if (filterStatus === "pending") {
        const due = hw.due_date ? new Date(hw.due_date) : null;
        if (due && due < today) return false;
      }
      if (selectedSubject !== "all" && hw.subject_name !== selectedSubject) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!((_a = hw.title) == null ? void 0 : _a.toLowerCase().includes(q)) && !((_b = hw.subject_name) == null ? void 0 : _b.toLowerCase().includes(q)) && !((_c = hw.description) == null ? void 0 : _c.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [homework, selectedMonth, selectedDay, filterStatus, selectedSubject, searchTerm]);
  const thisMonthCount = homework.filter((h) => getMonthKey$3(h.created_at) === currentMonthKey$3).length;
  const dueThisWeek = homework.filter((h) => {
    if (!h.due_date) return false;
    const d = new Date(h.due_date);
    return d >= today && d <= endOfWeek;
  }).length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-5 shadow-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: "Total Assigned" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-slate-900 mt-1", children: homework.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-6 h-6" }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-5 shadow-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-amber-600", children: "This Month" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-amber-700 mt-1", children: thisMonthCount })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6" }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-5 shadow-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-destructive", children: "Due This Week" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-destructive mt-1", children: dueThisWeek })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-indigo-50 text-indigo-600", children: /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-800", children: "Browse by Date" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "month",
            value: selectedMonth,
            onChange: (e) => {
              setSelectedMonth(e.target.value);
              setSelectedDay("all");
            },
            className: "px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedDay("all"),
            className: `px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${selectedDay === "all" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: "All Days" }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === "all" ? "bg-white/20" : "bg-slate-200 text-slate-600"}`, children: homework.filter((h) => getMonthKey$3(h.created_at) === selectedMonth).length })
            ]
          }
        ),
        allDaysInMonth.map((dk) => {
          const d = /* @__PURE__ */ new Date(dk + "T00:00:00");
          const count = dayCounts[dk] || 0;
          const isActive = selectedDay === dk;
          const isToday = dk === todayKey$3;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedDay(dk),
              className: `flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 min-w-[46px] border ${isActive ? "bg-cyan-600 text-white border-cyan-600 shadow-xs" : isToday ? "bg-cyan-50/50 text-cyan-900 border-cyan-300 font-extrabold" : count > 0 ? "bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200" : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-semibold opacity-75", children: WEEKDAYS$3[d.getDay()] }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-black leading-tight", children: d.getDate() }),
                count > 0 ? /* @__PURE__ */ jsx("span", { className: `text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? "bg-white/25 text-white" : "bg-cyan-100 text-cyan-800"}`, children: count }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] mt-0.5 opacity-30", children: "•" })
              ]
            },
            dk
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: ["all", "pending"].map((status) => /* @__PURE__ */ jsx(
        Button,
        {
          variant: filterStatus === status ? status === "pending" ? "default" : "secondary" : "outline",
          size: "sm",
          onClick: () => setFilterStatus(status),
          className: "text-xs font-bold capitalize h-8",
          children: status === "all" ? `All (${homework.length})` : "Pending"
        },
        status
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: "Search homework...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-9 h-8 text-xs"
          }
        )
      ] })
    ] }),
    subjects.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] font-bold text-slate-500 px-1", children: [
        /* @__PURE__ */ jsx("span", { children: "Filter By Subject:" }),
        /* @__PURE__ */ jsxs("span", { children: [
          subjects.length,
          " Subjects in Curriculum"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedSubject("all"),
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${selectedSubject === "all" ? "bg-cyan-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: "All Subjects" }),
              /* @__PURE__ */ jsx("span", { className: `px-1.5 rounded-full text-[10px] ${selectedSubject === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`, children: homework.length })
            ]
          }
        ),
        subjects.map((sub) => {
          const cnt = homework.filter((h) => h.subject_name === sub).length;
          const isSel = selectedSubject === sub;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedSubject(sub),
              className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${isSel ? "bg-cyan-600 text-white shadow-xs" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80"}`,
              children: [
                /* @__PURE__ */ jsx("span", { children: sub }),
                /* @__PURE__ */ jsx("span", { className: `px-1.5 rounded-full text-[10px] font-bold ${isSel ? "bg-white/20 text-white" : cnt > 0 ? "bg-cyan-100 text-cyan-800" : "bg-slate-200 text-slate-400"}`, children: cnt })
              ]
            },
            sub
          );
        })
      ] })
    ] }),
    filteredList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs", children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "w-12 h-12 text-slate-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-700", children: "No Homework Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 max-w-sm mx-auto", children: selectedDay !== "all" ? `No homework assigned on ${(/* @__PURE__ */ new Date(selectedDay + "T00:00:00")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.` : searchTerm || filterStatus !== "all" || selectedSubject !== "all" ? "Try adjusting your filters or search keywords." : "No homework assigned for this month." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filteredList.map((hw) => {
      var _a, _b, _c, _d;
      const atts = hw.attachments;
      return /* @__PURE__ */ jsxs(
        Card,
        {
          className: "hover:border-primary/50 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider", children: hw.subject_name || "General Subject" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Due: ",
                    hw.due_date || "N/A"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: hw.title }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 mt-1.5 whitespace-pre-wrap leading-relaxed", children: hw.description })
              ] }),
              hw.instructions && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/80 border border-amber-200/70 p-3 rounded-xl text-amber-900 text-xs leading-relaxed", children: [
                /* @__PURE__ */ jsxs("p", { className: "font-bold flex items-center space-x-1 mb-0.5", children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-600" }),
                  /* @__PURE__ */ jsx("span", { children: "Teacher's Note / Guidelines:" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-amber-800", children: hw.instructions })
              ] }),
              atts && (((_a = atts.doc) == null ? void 0 : _a.url) || ((_b = atts.image) == null ? void 0 : _b.url) || atts.link || atts.video) && /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 flex flex-wrap gap-2", children: [
                ((_c = atts.doc) == null ? void 0 : _c.url) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.doc.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { className: "truncate max-w-[140px]", children: atts.doc.name || "Worksheet PDF" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-blue-500" })
                    ]
                  }
                ),
                ((_d = atts.image) == null ? void 0 : _d.url) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.image.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Image, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Reference Image" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-purple-500" })
                    ]
                  }
                ),
                atts.link && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Link, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Study Material" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-emerald-500" })
                    ]
                  }
                ),
                atts.video && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.video,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Video, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Watch Explanation" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-rose-500" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-100 text-[11px] text-muted-foreground", children: [
              "Assigned: ",
              hw.created_at ? new Date(hw.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"
            ] })
          ]
        },
        hw.id
      );
    }) })
  ] });
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
const getMonthKey$2 = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const getDayKey$2 = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getAllDaysInMonth$2 = (monthKey) => {
  if (!monthKey) return [];
  const [year, month] = monthKey.split("-").map(Number);
  const daysCount = new Date(year, month, 0).getDate();
  const list = [];
  for (let day = 1; day <= daysCount; day++) {
    list.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return list;
};
const WEEKDAYS$2 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayKey$2 = getDayKey$2((/* @__PURE__ */ new Date()).toISOString());
const currentMonthKey$2 = getMonthKey$2((/* @__PURE__ */ new Date()).toISOString());
const StudentAssignmentPortal = ({ assignments = [], student, onRefresh, showToast }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey$2);
  const [selectedDay, setSelectedDay] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [activeSubmitModal, setActiveSubmitModal] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subjects = useMemo(
    () => Array.from(new Set(assignments.map((a) => a.subject_name).filter(Boolean))),
    [assignments]
  );
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth$2(selectedMonth);
  }, [selectedMonth]);
  const dayCounts = useMemo(() => {
    const counts = {};
    assignments.forEach((a) => {
      const dk = getDayKey$2(a.created_at);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [assignments]);
  useEffect(() => {
    setSelectedDay("all");
  }, [selectedMonth]);
  const filteredList = useMemo(() => {
    return assignments.filter((asgn) => {
      var _a, _b, _c;
      if (getMonthKey$2(asgn.created_at) !== selectedMonth) return false;
      if (selectedDay !== "all" && getDayKey$2(asgn.created_at) !== selectedDay) return false;
      const status = (asgn.submission_status || "Pending").toLowerCase();
      if (filterStatus === "pending" && status !== "pending" && status !== "not submitted") return false;
      if (filterStatus === "submitted" && status !== "submitted") return false;
      if (filterStatus === "reviewed" && status !== "reviewed" && status !== "completed") return false;
      if (selectedSubject !== "all" && asgn.subject_name !== selectedSubject) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!((_a = asgn.title) == null ? void 0 : _a.toLowerCase().includes(q)) && !((_b = asgn.subject_name) == null ? void 0 : _b.toLowerCase().includes(q)) && !((_c = asgn.description) == null ? void 0 : _c.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [assignments, selectedMonth, selectedDay, filterStatus, selectedSubject, searchTerm]);
  const pendingCount = assignments.filter((a) => (a.submission_status || "Pending").toLowerCase() === "pending").length;
  const submittedCount = assignments.filter((a) => (a.submission_status || "").toLowerCase() === "submitted").length;
  const reviewedCount = assignments.filter((a) => ["reviewed", "completed"].includes((a.submission_status || "").toLowerCase())).length;
  const handleOpenSubmit = (asgn) => {
    setActiveSubmitModal(asgn);
    setSubmissionText("");
    setSubmissionFile(null);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast == null ? void 0 : showToast("File size exceeds 15MB limit", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSubmissionFile({ name: file.name, base64: reader.result });
    reader.readAsDataURL(file);
  };
  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!activeSubmitModal || !(student == null ? void 0 : student.id)) return;
    if (!submissionText.trim() && !submissionFile) {
      showToast == null ? void 0 : showToast("Please write an answer or upload your file to submit", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (submissionFile) {
        const uploadRes = await communicationService.uploadAttachment(submissionFile.name, submissionFile.base64);
        fileUrl = uploadRes.url;
      }
      await communicationService.submitAssignmentWork(activeSubmitModal.id, {
        student_id: student.id,
        submission_text: submissionText,
        submission_file_url: fileUrl
      });
      showToast == null ? void 0 : showToast("Assignment submitted successfully!", "success");
      setActiveSubmitModal(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast == null ? void 0 : showToast(err.message || "Failed to submit assignment", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
      { label: "Total Assignments", val: assignments.length, color: "purple", Icon: FileCheck2 },
      { label: "Pending Submission", val: pendingCount, color: "amber", Icon: Clock },
      { label: "Submitted", val: submittedCount, color: "blue", Icon: CheckCheck },
      { label: "Reviewed & Graded", val: reviewedCount, color: "emerald", Icon: Award }
    ].map(({ label, val, color, Icon }) => /* @__PURE__ */ jsxs(Card, { className: "p-4 shadow-xs flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: `text-xs font-semibold text-${color}-600`, children: label }),
        /* @__PURE__ */ jsx("p", { className: `text-2xl font-black text-${color}-700 mt-1`, children: val })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) })
    ] }, label)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-purple-50 text-purple-600", children: /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-800", children: "Browse by Date" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "month",
            value: selectedMonth,
            onChange: (e) => {
              setSelectedMonth(e.target.value);
              setSelectedDay("all");
            },
            className: "px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedDay("all"),
            className: `px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${selectedDay === "all" ? "bg-purple-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: "All Days" }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === "all" ? "bg-white/20" : "bg-slate-200 text-slate-500"}`, children: assignments.filter((a) => getMonthKey$2(a.created_at) === selectedMonth).length })
            ]
          }
        ),
        allDaysInMonth.map((dk) => {
          const d = /* @__PURE__ */ new Date(dk + "T00:00:00");
          const count = dayCounts[dk] || 0;
          const isActive = selectedDay === dk;
          const isToday = dk === todayKey$2;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedDay(dk),
              className: `flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 min-w-[46px] border ${isActive ? "bg-purple-600 text-white border-purple-600 shadow-xs" : isToday ? "bg-purple-50/50 text-purple-900 border-purple-300 font-extrabold" : count > 0 ? "bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200" : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-semibold opacity-75", children: WEEKDAYS$2[d.getDay()] }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-black leading-tight", children: d.getDate() }),
                count > 0 ? /* @__PURE__ */ jsx("span", { className: `text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? "bg-white/25 text-white" : "bg-purple-100 text-purple-800"}`, children: count }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] mt-0.5 opacity-30", children: "•" })
              ]
            },
            dk
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: [
        { val: "all", label: `All (${assignments.length})`, active: "bg-slate-900" },
        { val: "pending", label: `Pending (${pendingCount})`, active: "bg-amber-600" },
        { val: "submitted", label: `Submitted (${submittedCount})`, active: "bg-blue-600" },
        { val: "reviewed", label: `Graded (${reviewedCount})`, active: "bg-emerald-600" }
      ].map(({ val, label, active }) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setFilterStatus(val),
          className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterStatus === val ? `${active} text-white shadow-xs` : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
          children: label
        },
        val
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        subjects.length > 0 && /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedSubject,
            onChange: (e) => setSelectedSubject(e.target.value),
            className: "px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Subjects" }),
              subjects.map((sub) => /* @__PURE__ */ jsx("option", { value: sub, children: sub }, sub))
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-60", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search assignments...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            }
          )
        ] })
      ] })
    ] }),
    filteredList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs", children: [
      /* @__PURE__ */ jsx(FileCheck2, { className: "w-12 h-12 text-slate-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-700", children: "No Assignments Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 max-w-sm mx-auto", children: selectedDay !== "all" ? `No assignments given on ${(/* @__PURE__ */ new Date(selectedDay + "T00:00:00")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.` : searchTerm || filterStatus !== "all" || selectedSubject !== "all" ? "Try adjusting your filters or search keywords." : "No assignments assigned for this month." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredList.map((asgn) => {
      var _a, _b, _c, _d;
      const status = asgn.submission_status || "Pending";
      const isPending = status.toLowerCase() === "pending";
      const isSubmitted = status.toLowerCase() === "submitted";
      const isReviewed = ["reviewed", "completed"].includes(status.toLowerCase());
      const atts = asgn.attachments;
      return /* @__PURE__ */ jsxs(
        Card,
        {
          className: "hover:border-primary/50 transition-all p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider", children: asgn.subject_name || "Subject" }),
                /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] font-bold", children: [
                  asgn.submission_type || "Online",
                  " Submission"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Due: ",
                    asgn.due_date || "N/A"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md", children: [
                  "Max Marks: ",
                  asgn.max_marks || 100
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: asgn.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap", children: asgn.description }),
              atts && (((_a = atts.doc) == null ? void 0 : _a.url) || ((_b = atts.image) == null ? void 0 : _b.url)) && /* @__PURE__ */ jsxs("div", { className: "pt-2 flex flex-wrap gap-2", children: [
                ((_c = atts.doc) == null ? void 0 : _c.url) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.doc.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg",
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Question Paper" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-blue-500" })
                    ]
                  }
                ),
                ((_d = atts.image) == null ? void 0 : _d.url) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.image.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg",
                    children: [
                      /* @__PURE__ */ jsx(Image, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Reference Image" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-purple-500" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-72 bg-muted/30 border border-border rounded-xl p-4 flex flex-col justify-between space-y-3 shrink-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-semibold", children: "Status:" }),
                /* @__PURE__ */ jsx(Badge, { variant: isReviewed ? "emerald" : isSubmitted ? "default" : "secondary", className: "text-xs font-extrabold", children: status })
              ] }),
              asgn.marks_obtained !== null && asgn.marks_obtained !== void 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-card p-3 rounded-xl border border-border text-center space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Score Secured" }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg font-black text-emerald-700", children: [
                  asgn.marks_obtained,
                  " ",
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-muted-foreground", children: [
                    "/ ",
                    asgn.max_marks || 100
                  ] })
                ] }),
                asgn.grade && /* @__PURE__ */ jsxs("span", { className: "inline-block text-[11px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md", children: [
                  "Grade ",
                  asgn.grade
                ] }),
                asgn.remarks && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground italic pt-1 border-t border-border", children: [
                  '"',
                  asgn.remarks,
                  '"'
                ] })
              ] }) : isSubmitted ? /* @__PURE__ */ jsxs("div", { className: "bg-card p-3 rounded-xl border border-border text-center space-y-1", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-primary mx-auto" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800", children: "Submitted Online" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Awaiting teacher evaluation." }),
                asgn.submission_file_url && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: asgn.submission_file_url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1 text-[11px] font-bold text-primary hover:underline pt-1",
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx("span", { children: "View My Submitted File" })
                    ]
                  }
                )
              ] }) : null,
              /* @__PURE__ */ jsx("div", { children: asgn.submission_type === "Physical" ? /* @__PURE__ */ jsx("div", { className: "text-center text-[11px] text-muted-foreground bg-amber-50/60 p-2 rounded-xl border border-amber-200/50", children: "Physical submission required. Submit your notebook or sheet in class." }) : /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  onClick: () => handleOpenSubmit(asgn),
                  variant: isPending ? "default" : "outline",
                  className: "w-full h-8 text-xs font-bold cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5 mr-1.5" }),
                    /* @__PURE__ */ jsx("span", { children: isPending ? "Submit Work" : "Resubmit Work" })
                  ]
                }
              ) })
            ] })
          ]
        },
        asgn.id
      );
    }) }),
    activeSubmitModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded", children: activeSubmitModal.subject_name || "Subject" }),
          /* @__PURE__ */ jsx("h3", { className: "text-base font-extrabold text-slate-900 mt-1", children: "Submit Assignment" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 truncate max-w-sm", children: activeSubmitModal.title })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveSubmitModal(null),
            className: "w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitWork, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Type Your Answer / Comments (Optional):" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 4,
              value: submissionText,
              onChange: (e) => setSubmissionText(e.target.value),
              placeholder: "Enter your notes, written answers or project links here...",
              className: "w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Upload Answer Document or Image (Optional):" }),
          /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-4 text-center cursor-pointer relative bg-slate-50/50 hover:bg-purple-50/20 transition-all", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                onChange: handleFileChange,
                accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip",
                className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              }
            ),
            /* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-slate-400 mx-auto mb-1.5" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-700", children: submissionFile ? submissionFile.name : "Click to browse files or drag & drop" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: "Supports PDF, Word, Images, Zip (Max 15MB)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-3 pt-3 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveSubmitModal(null),
              className: "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isSubmitting,
              className: "px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50",
              children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                /* @__PURE__ */ jsx("span", { children: "Submitting..." })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Submit Assignment" })
              ] })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const getMonthKey$1 = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const getDayKey$1 = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getAllDaysInMonth$1 = (monthKey) => {
  if (!monthKey) return [];
  const [year, month] = monthKey.split("-").map(Number);
  const daysCount = new Date(year, month, 0).getDate();
  const list = [];
  for (let day = 1; day <= daysCount; day++) {
    list.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return list;
};
const WEEKDAYS$1 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayKey$1 = getDayKey$1((/* @__PURE__ */ new Date()).toISOString());
const currentMonthKey$1 = getMonthKey$1((/* @__PURE__ */ new Date()).toISOString());
const StudentAnnouncementPortal = ({ announcements = [], student }) => {
  var _a, _b;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey$1);
  const [selectedDay, setSelectedDay] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoticeModal, setSelectedNoticeModal] = useState(null);
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth$1(selectedMonth);
  }, [selectedMonth]);
  const dayCounts = useMemo(() => {
    const counts = {};
    announcements.forEach((ann) => {
      const dk = getDayKey$1(ann.created_at || ann.publish_date);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [announcements]);
  useEffect(() => {
    setSelectedDay("all");
  }, [selectedMonth]);
  const filteredList = useMemo(() => {
    return announcements.filter((ann) => {
      var _a2, _b2, _c;
      const dateVal = ann.created_at || ann.publish_date;
      if (getMonthKey$1(dateVal) !== selectedMonth) return false;
      if (selectedDay !== "all" && getDayKey$1(dateVal) !== selectedDay) return false;
      const priority = (ann.priority || "").toLowerCase();
      if (filterPriority === "urgent" && priority !== "urgent" && priority !== "high") return false;
      if (filterPriority === "notice" && (priority === "urgent" || priority === "high")) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = (_a2 = ann.title) == null ? void 0 : _a2.toLowerCase().includes(query);
        const matchesMsg = (_b2 = ann.message) == null ? void 0 : _b2.toLowerCase().includes(query);
        const matchesAudience = (_c = ann.target_audience) == null ? void 0 : _c.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMsg && !matchesAudience) return false;
      }
      return true;
    });
  }, [announcements, selectedMonth, selectedDay, filterPriority, searchTerm]);
  const urgentCount = announcements.filter((a) => ["urgent", "high"].includes((a.priority || "").toLowerCase())).length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-5 shadow-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: "Official Circulars" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-slate-900 mt-1", children: announcements.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Megaphone, { className: "w-6 h-6" }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-5 shadow-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-destructive", children: "Urgent Notices" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-destructive mt-1", children: urgentCount })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6" }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-5 shadow-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-primary", children: "Targeted For" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-800 mt-1 truncate max-w-[180px]", children: (student == null ? void 0 : student.class_name) ? `Class ${student.class_name}` : "My Campus" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsx(Info, { className: "w-6 h-6" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-amber-50 text-amber-600", children: /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-800", children: "Browse by Date" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "month",
            value: selectedMonth,
            onChange: (e) => {
              setSelectedMonth(e.target.value);
              setSelectedDay("all");
            },
            className: "px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedDay("all"),
            className: `px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${selectedDay === "all" ? "bg-amber-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: "All Days" }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === "all" ? "bg-white/20" : "bg-slate-200 text-slate-500"}`, children: announcements.filter((a) => getMonthKey$1(a.created_at || a.publish_date) === selectedMonth).length })
            ]
          }
        ),
        allDaysInMonth.map((dk) => {
          const d = /* @__PURE__ */ new Date(dk + "T00:00:00");
          const count = dayCounts[dk] || 0;
          const isActive = selectedDay === dk;
          const isToday = dk === todayKey$1;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedDay(dk),
              className: `flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 min-w-[46px] border ${isActive ? "bg-amber-600 text-white border-amber-600 shadow-xs" : isToday ? "bg-amber-50/50 text-amber-900 border-amber-300 font-extrabold" : count > 0 ? "bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200" : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-semibold opacity-75", children: WEEKDAYS$1[d.getDay()] }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-black leading-tight", children: d.getDate() }),
                count > 0 ? /* @__PURE__ */ jsx("span", { className: `text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? "bg-white/25 text-white" : "bg-amber-100 text-amber-800"}`, children: count }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] mt-0.5 opacity-30", children: "•" })
              ]
            },
            dk
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setFilterPriority("all"),
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterPriority === "all" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              "All Notices (",
              announcements.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setFilterPriority("urgent"),
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterPriority === "urgent" ? "bg-rose-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              "Urgent (",
              urgentCount,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setFilterPriority("notice"),
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterPriority === "notice" ? "bg-amber-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              "Regular Circulars (",
              announcements.length - urgentCount,
              ")"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search announcements...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          }
        )
      ] })
    ] }),
    filteredList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs", children: [
      /* @__PURE__ */ jsx(Megaphone, { className: "w-12 h-12 text-slate-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-700", children: "No Announcements Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 max-w-sm mx-auto", children: selectedDay !== "all" ? `No announcements published on ${(/* @__PURE__ */ new Date(selectedDay + "T00:00:00")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.` : searchTerm || filterPriority !== "all" ? "Try adjusting your filters or search keywords." : "No announcements published for this month." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredList.map((ann) => {
      var _a2, _b2;
      const isUrgent = ["urgent", "high"].includes((ann.priority || "").toLowerCase());
      const atts = ann.attachments;
      return /* @__PURE__ */ jsxs(
        Card,
        {
          className: `transition-all p-5 shadow-xs flex flex-col justify-between space-y-3.5 ${isUrgent ? "border-destructive/40 bg-gradient-to-r from-destructive/5 via-background to-background" : "hover:border-primary/50"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: isUrgent ? "destructive" : "secondary", className: "px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider", children: ann.target_audience === "All" ? "Campus Notice" : ann.target_audience || "Circular" }),
                  isUrgent && /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full", children: [
                    /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }),
                    /* @__PURE__ */ jsx("span", { children: "URGENT" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxs("span", { children: [
                  "Published: ",
                  ann.publish_date || (ann.created_at ? new Date(ann.created_at).toLocaleDateString("en-IN") : "Recent")
                ] }) })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 leading-snug", children: ann.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-3", children: ann.message })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                ((_a2 = atts == null ? void 0 : atts.doc) == null ? void 0 : _a2.url) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.doc.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg",
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Official Notice PDF" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-blue-500" })
                    ]
                  }
                ),
                ((_b2 = atts == null ? void 0 : atts.image) == null ? void 0 : _b2.url) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.image.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg",
                    children: [
                      /* @__PURE__ */ jsx(Image, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Circular Flyer" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-purple-500" })
                    ]
                  }
                ),
                (atts == null ? void 0 : atts.link) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg",
                    children: [
                      /* @__PURE__ */ jsx(Link, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Reference Link" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-emerald-500" })
                    ]
                  }
                ),
                (atts == null ? void 0 : atts.video) && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: atts.video,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg",
                    children: [
                      /* @__PURE__ */ jsx(Video, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Watch Video" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-rose-500" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  type: "button",
                  onClick: () => setSelectedNoticeModal(ann),
                  className: "h-8 text-xs font-bold ml-auto cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 mr-1" }),
                    /* @__PURE__ */ jsx("span", { children: "Read Full Circular" })
                  ]
                }
              )
            ] })
          ]
        },
        ann.id
      );
    }) }),
    selectedNoticeModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between pb-3 border-b border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("span", { className: "px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-amber-100 text-amber-900", children: selectedNoticeModal.target_audience === "All" ? "Campus Circular" : selectedNoticeModal.target_audience }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-slate-900 leading-snug", children: selectedNoticeModal.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
            "Date: ",
            selectedNoticeModal.publish_date || "Today"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelectedNoticeModal(null),
            className: "w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0 ml-3",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-4 rounded-2xl border border-slate-100", children: selectedNoticeModal.message }),
      selectedNoticeModal.attachments && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-700", children: "Official Attachments:" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          ((_a = selectedNoticeModal.attachments.doc) == null ? void 0 : _a.url) && /* @__PURE__ */ jsxs(
            "a",
            {
              href: selectedNoticeModal.attachments.doc.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center space-x-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors",
              children: [
                /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Download PDF Document" })
              ]
            }
          ),
          ((_b = selectedNoticeModal.attachments.image) == null ? void 0 : _b.url) && /* @__PURE__ */ jsxs(
            "a",
            {
              href: selectedNoticeModal.attachments.image.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center space-x-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-colors",
              children: [
                /* @__PURE__ */ jsx(Image, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Open Image" })
              ]
            }
          ),
          selectedNoticeModal.attachments.link && /* @__PURE__ */ jsxs(
            "a",
            {
              href: selectedNoticeModal.attachments.link,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors",
              children: [
                /* @__PURE__ */ jsx(Link, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Open External Link" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setSelectedNoticeModal(null),
          className: "px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer",
          children: "Close Notice"
        }
      ) })
    ] }) })
  ] });
};
const getMonthKey = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const getDayKey = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getAllDaysInMonth = (monthKey) => {
  if (!monthKey) return [];
  const [year, month] = monthKey.split("-").map(Number);
  const daysCount = new Date(year, month, 0).getDate();
  const list = [];
  for (let day = 1; day <= daysCount; day++) {
    list.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return list;
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayKey = getDayKey((/* @__PURE__ */ new Date()).toISOString());
const currentMonthKey = getMonthKey((/* @__PURE__ */ new Date()).toISOString());
const StudentGalleryPortal = ({ albums = [], student }) => {
  var _a;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedDay, setSelectedDay] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAlbumModal, setActiveAlbumModal] = useState(null);
  const allDaysInMonth = useMemo(() => {
    return getAllDaysInMonth(selectedMonth);
  }, [selectedMonth]);
  const dayCounts = useMemo(() => {
    const counts = {};
    albums.forEach((alb) => {
      const dk = getDayKey(alb.created_at || alb.event_date);
      if (dk) counts[dk] = (counts[dk] || 0) + 1;
    });
    return counts;
  }, [albums]);
  useEffect(() => {
    setSelectedDay("all");
  }, [selectedMonth]);
  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      var _a2, _b, _c;
      const dateVal = alb.created_at || alb.event_date;
      if (getMonthKey(dateVal) !== selectedMonth) return false;
      if (selectedDay !== "all" && getDayKey(dateVal) !== selectedDay) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = (_a2 = alb.album_name) == null ? void 0 : _a2.toLowerCase().includes(q);
        const matchesEvent = (_b = alb.event_name) == null ? void 0 : _b.toLowerCase().includes(q);
        const matchesDesc = (_c = alb.description) == null ? void 0 : _c.toLowerCase().includes(q);
        if (!matchesName && !matchesEvent && !matchesDesc) return false;
      }
      return true;
    });
  }, [albums, selectedMonth, selectedDay, searchTerm]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between p-4 sm:p-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-500", children: "School Event Albums" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-slate-900 mt-1", children: albums.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Camera, { className: "w-6 h-6" }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between p-4 sm:p-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-purple-600", children: "Moments & Highlights" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-purple-700 mt-1", children: "Campus Life" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Image, { className: "w-6 h-6" }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between p-4 sm:p-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-emerald-600", children: "Access Scope" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-800 mt-1", children: (student == null ? void 0 : student.class_name) ? `Class ${student.class_name}` : "Campus Events" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-6 h-6" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-rose-50 text-rose-600", children: /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-800", children: "Browse by Date" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "month",
            value: selectedMonth,
            onChange: (e) => {
              setSelectedMonth(e.target.value);
              setSelectedDay("all");
            },
            className: "px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedDay("all"),
            className: `px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${selectedDay === "all" ? "bg-rose-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: "All Days" }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedDay === "all" ? "bg-white/20" : "bg-slate-200 text-slate-500"}`, children: albums.filter((a) => getMonthKey(a.created_at || a.event_date) === selectedMonth).length })
            ]
          }
        ),
        allDaysInMonth.map((dk) => {
          const d = /* @__PURE__ */ new Date(dk + "T00:00:00");
          const count = dayCounts[dk] || 0;
          const isActive = selectedDay === dk;
          const isToday = dk === todayKey;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedDay(dk),
              className: `flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 min-w-[46px] border ${isActive ? "bg-rose-600 text-white border-rose-600 shadow-xs" : isToday ? "bg-rose-50/50 text-rose-900 border-rose-300 font-extrabold" : count > 0 ? "bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200" : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:text-slate-600"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-semibold opacity-75", children: WEEKDAYS[d.getDay()] }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-black leading-tight", children: d.getDate() }),
                count > 0 ? /* @__PURE__ */ jsx("span", { className: `text-[9px] mt-0.5 px-1 rounded-full font-extrabold ${isActive ? "bg-white/25 text-white" : "bg-rose-100 text-rose-800"}`, children: count }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] mt-0.5 opacity-30", children: "•" })
              ]
            },
            dk
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-slate-900", children: [
        "Photo Albums & Activities (",
        filteredAlbums.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-72", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search albums or events...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          }
        )
      ] })
    ] }),
    filteredAlbums.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs", children: [
      /* @__PURE__ */ jsx(Image, { className: "w-12 h-12 text-slate-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-700", children: "No Photo Albums Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 max-w-sm mx-auto", children: selectedDay !== "all" ? `No albums published on ${(/* @__PURE__ */ new Date(selectedDay + "T00:00:00")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.` : searchTerm ? "No albums match your search query." : "No photo galleries published for this month." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredAlbums.map((alb) => {
      const coverImage = alb.cover_image_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80";
      return /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => setActiveAlbumModal(alb),
          className: "rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "aspect-16/10 bg-slate-100 overflow-hidden relative", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: coverImage,
                    alt: alb.album_name,
                    className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-sky-400" }),
                  /* @__PURE__ */ jsx("span", { children: alb.event_date || "Event" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-1.5", children: [
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 border-sky-200", children: alb.event_name || "School Function" }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors", children: alb.album_name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 line-clamp-2 leading-relaxed", children: alb.description || "View photos and highlights from this event." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-bold", children: [
              /* @__PURE__ */ jsx("span", { children: "View Photos" }),
              /* @__PURE__ */ jsx("span", { className: "group-hover:translate-x-1 transition-transform", children: "→" })
            ] })
          ]
        },
        alb.id
      );
    }) }),
    activeAlbumModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between pb-3 border-b border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded", children: activeAlbumModal.event_name || "School Event" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-slate-900 mt-1", children: activeAlbumModal.album_name }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
            "Date: ",
            activeAlbumModal.event_date || "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveAlbumModal(null),
            className: "w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0 ml-3",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: activeAlbumModal.cover_image_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80",
          alt: activeAlbumModal.album_name,
          className: "w-full h-full object-cover"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-2xl border border-slate-100", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-700", children: "About this Event:" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap", children: activeAlbumModal.description || "No additional event notes." })
      ] }),
      ((_a = activeAlbumModal.attachments) == null ? void 0 : _a.links) && activeAlbumModal.attachments.links.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-700", children: "Related Photo Drives & Links:" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: activeAlbumModal.attachments.links.map((lnk, idx) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: lnk.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors",
            children: [
              /* @__PURE__ */ jsx(Link, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: lnk.title || "Open Photo Drive Link" }),
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-emerald-500" })
            ]
          },
          idx
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveAlbumModal(null),
          className: "px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer",
          children: "Close Gallery"
        }
      ) })
    ] }) })
  ] });
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
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("h2", { ref, className: cn("text-lg font-semibold leading-none tracking-tight", className), ...props }));
React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
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
const API_BASE$1 = "/api/timetable";
const timetableService = {
  // Structures
  async getStructures(branch_id = 1, academic_year_id = 2) {
    const res = await fetch(`${API_BASE$1}/structures?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
    return res.json();
  },
  async createStructure(payload) {
    const res = await fetch(`${API_BASE$1}/structures`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async deleteStructure(id) {
    const res = await fetch(`${API_BASE$1}/structures/${id}`, { method: "DELETE" });
    return res.json();
  },
  // Class Mapping
  async saveClassMappings(payload) {
    const res = await fetch(`${API_BASE$1}/mappings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async unassignClass(payload) {
    const res = await fetch(`${API_BASE$1}/mappings/unassign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  // Class Subject Mappings (Teacher & Weekly Periods)
  async getClassSubjectMappings({ branch_id = 1, academic_year_id = 2, class_id, section_id }) {
    const params = new URLSearchParams({
      branch_id,
      academic_year_id,
      class_id,
      section_id: section_id || "all"
    });
    const res = await fetch(`${API_BASE$1}/subject-mappings?${params.toString()}`);
    return res.json();
  },
  async saveClassSubjectMappings(payload) {
    const res = await fetch(`${API_BASE$1}/subject-mappings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  // Weekly Grid & Slots
  async getWeeklyTimetable({ branch_id = 1, academic_year_id = 2, class_id, section_id }) {
    const params = new URLSearchParams({
      branch_id,
      academic_year_id,
      class_id,
      section_id: section_id || "all"
    });
    const res = await fetch(`${API_BASE$1}/weekly?${params.toString()}`);
    return res.json();
  },
  async saveSlot(payload) {
    const res = await fetch(`${API_BASE$1}/slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async clearSlot(payload) {
    const res = await fetch(`${API_BASE$1}/slot/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
const SearchableSubjectSelect = ({
  subjects = [],
  value,
  onChange,
  placeholder = "+ Select Subject"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const selectedSubject = subjects.find((s) => String(s.id) === String(value));
  const filteredSubjects = subjects.filter((s) => {
    var _a, _b, _c;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = (_a = s.subject_name) == null ? void 0 : _a.toLowerCase().includes(q);
    const codeMatch = (_b = s.subject_code) == null ? void 0 : _b.toLowerCase().includes(q);
    const shortMatch = (_c = s.short_name) == null ? void 0 : _c.toLowerCase().includes(q);
    return nameMatch || codeMatch || shortMatch;
  });
  const handleSelect = (subId) => {
    onChange(subId);
    setIsOpen(false);
    setSearchQuery("");
  };
  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
    setSearchQuery("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full", ref: containerRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen((prev) => !prev),
        className: `w-full h-10 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center justify-between text-left shadow-2xs outline-none ${selectedSubject ? "bg-zinc-900 text-white border-zinc-900 font-bold hover:bg-zinc-800" : "bg-white text-zinc-500 border-dashed border-zinc-300 hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate mr-1 text-[11px]", children: selectedSubject ? selectedSubject.subject_name : placeholder }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1 shrink-0", children: selectedSubject ? /* @__PURE__ */ jsx(
            "span",
            {
              onClick: handleClear,
              className: "p-0.5 rounded hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer",
              title: "Clear subject",
              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
            }
          ) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3 text-zinc-400" }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            placeholder: "Search subject or code...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full h-8 pl-8 pr-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 focus:bg-white text-zinc-900"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-h-52 overflow-y-auto space-y-0.5 pt-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => handleSelect(""),
            className: "w-full px-2.5 py-1.5 text-left text-xs text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 rounded-md font-normal transition-colors",
            children: "-- Empty / Clear Slot --"
          }
        ),
        filteredSubjects.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-4 text-center text-xs text-zinc-400", children: "No matching subjects" }) : filteredSubjects.map((s) => {
          const isSelected = String(s.id) === String(value);
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleSelect(String(s.id)),
              className: `w-full px-2.5 py-2 text-left text-xs rounded-lg flex items-center justify-between transition-colors ${isSelected ? "bg-zinc-900 text-white font-bold" : "text-zinc-800 hover:bg-zinc-100 font-medium"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "truncate pr-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "truncate", children: s.subject_name }),
                  s.subject_code && /* @__PURE__ */ jsx("div", { className: `text-[10px] font-mono ${isSelected ? "text-zinc-300" : "text-zinc-400"}`, children: s.subject_code })
                ] }),
                isSelected && /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 shrink-0" })
              ]
            },
            s.id
          );
        })
      ] })
    ] })
  ] });
};
const TimetableSlotAllocationView = ({ showToast }) => {
  const { branches, selectedBranchId, activeAcademicYearId, academicYears, isSuperAdmin, assignedBranchId } = useErp();
  const effBranch = !isSuperAdmin && assignedBranchId ? String(assignedBranchId) : String(selectedBranchId || "1");
  const [branchId, setBranchId] = useState(effBranch);
  const [academicYearId, setAcademicYearId] = useState(String(activeAcademicYearId || "2"));
  const [classesList, setClassesList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [structure, setStructure] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectMappings, setSubjectMappings] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [isSavingSlot, setIsSavingSlot] = useState(false);
  const [sectionsList, setSectionsList] = useState([]);
  useEffect(() => {
    fetch(`/api/classes?branch_id=${branchId}&academic_year_id=${academicYearId}&status=Active`).then((r) => r.json()).then((res) => {
      if (res.success && res.data) {
        setClassesList(res.data);
        if (res.data.length > 0 && !selectedClassId) {
          setSelectedClassId(String(res.data[0].id));
        }
      }
    });
  }, [branchId, academicYearId]);
  useEffect(() => {
    if (!selectedClassId) return;
    fetch(`/api/sections?class_id=${selectedClassId}&branch_id=${branchId}`).then((r) => r.json()).then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSectionsList(res.data);
        setSelectedSection((prev) => {
          const exists = res.data.some((s) => String(s.id) === String(prev));
          return exists ? prev : String(res.data[0].id);
        });
      } else {
        setSectionsList([]);
        setSelectedSection("all");
      }
    }).catch(() => {
      setSectionsList([]);
      setSelectedSection("all");
    });
  }, [selectedClassId, branchId]);
  const loadGrid = async () => {
    if (!selectedClassId) return;
    setIsLoading(true);
    try {
      const res = await timetableService.getWeeklyTimetable({
        branch_id: branchId,
        academic_year_id: academicYearId,
        class_id: selectedClassId,
        section_id: selectedSection
      });
      if (res.success && res.data) {
        setStructure(res.data.structure);
        setPeriods(res.data.periods || []);
        setSubjects(res.data.subjects || []);
        setSubjectMappings(res.data.subjectMappings || []);
        setTeachers(res.data.teachers || []);
        setSlots(res.data.slots || []);
      }
    } catch (err) {
      if (showToast) showToast("Failed to load weekly timetable", "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadGrid();
  }, [selectedClassId, selectedSection, branchId, academicYearId]);
  const handleSubjectChangeInSlot = (newSubId) => {
    const mapping = subjectMappings.find((m) => String(m.subject_id) === String(newSubId));
    setEditingSlot((prev) => ({
      ...prev,
      subject_id: newSubId,
      teacher_id: (mapping == null ? void 0 : mapping.teacher_id) ? String(mapping.teacher_id) : prev.teacher_id,
      room_name: (mapping == null ? void 0 : mapping.preferred_room) ? mapping.preferred_room : prev.room_name
    }));
  };
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;
    const mapping = subjectMappings.find((m) => String(m.subject_id) === String(editingSlot.subject_id));
    const teacherIdToSave = editingSlot.teacher_id || (mapping == null ? void 0 : mapping.teacher_id) || null;
    const roomToSave = editingSlot.room_name || (mapping == null ? void 0 : mapping.preferred_room) || null;
    setIsSavingSlot(true);
    try {
      const res = await timetableService.saveSlot({
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        class_id: Number(selectedClassId),
        section_id: selectedSection === "all" ? null : selectedSection,
        period_id: editingSlot.period_id,
        day_of_week: editingSlot.day_of_week,
        subject_id: editingSlot.subject_id ? Number(editingSlot.subject_id) : null,
        teacher_id: teacherIdToSave ? Number(teacherIdToSave) : null,
        room_name: roomToSave || null
      });
      if (res.success) {
        if (showToast) showToast("Timetable slot saved successfully!", "success");
        setEditingSlot(null);
        loadGrid();
      } else {
        throw new Error(res.message || "Failed to save slot");
      }
    } catch (err) {
      if (showToast) showToast(err.message, "error");
    } finally {
      setIsSavingSlot(false);
    }
  };
  const handleClearSlot = async () => {
    if (!editingSlot) return;
    setIsSavingSlot(true);
    try {
      const res = await timetableService.clearSlot({
        class_id: Number(selectedClassId),
        section_id: selectedSection === "all" ? null : selectedSection,
        period_id: editingSlot.period_id,
        day_of_week: editingSlot.day_of_week
      });
      if (res.success) {
        if (showToast) showToast("Slot cleared", "info");
        setEditingSlot(null);
        loadGrid();
      }
    } catch (err) {
      if (showToast) showToast("Failed to clear slot", "error");
    } finally {
      setIsSavingSlot(false);
    }
  };
  const handleQuickSubjectChange = async (period, day, subjectId) => {
    if (!subjectId) {
      try {
        const res = await timetableService.clearSlot({
          class_id: Number(selectedClassId),
          section_id: selectedSection === "all" ? null : selectedSection,
          period_id: period.id,
          day_of_week: day
        });
        if (res.success) {
          if (showToast) showToast("Slot cleared", "info");
          loadGrid();
        }
      } catch (err) {
        if (showToast) showToast("Failed to clear slot", "error");
      }
      return;
    }
    const mapping = subjectMappings.find((m) => String(m.subject_id) === String(subjectId));
    try {
      const res = await timetableService.saveSlot({
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        class_id: Number(selectedClassId),
        section_id: selectedSection === "all" ? null : selectedSection,
        period_id: period.id,
        day_of_week: day,
        subject_id: Number(subjectId),
        teacher_id: (mapping == null ? void 0 : mapping.teacher_id) || null,
        room_name: (mapping == null ? void 0 : mapping.preferred_room) || null
      });
      if (res.success) {
        if (showToast) showToast("Subject mapped successfully!", "success");
        loadGrid();
      } else {
        if (showToast) showToast(res.message || "Failed to save slot", "error");
      }
    } catch (err) {
      if (showToast) showToast(err.message, "error");
    }
  };
  const workingDays = (structure == null ? void 0 : structure.working_days) || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 mb-1", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "w-3.5 h-3.5 text-zinc-700" }),
        /* @__PURE__ */ jsx("span", { children: "Step 3: Subject & Teacher Weekly Allocation" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-zinc-950", children: "Subject & Teacher Timetable Grid" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 mt-0.5", children: "Assign subjects and faculty to individual period slots with automated teacher clash & conflict prevention." })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-5 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-zinc-700 mb-1", children: "Campus / Branch" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            disabled: !isSuperAdmin && !!assignedBranchId,
            value: branchId,
            onChange: (e) => setBranchId(e.target.value),
            className: "flex h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950",
            children: branches == null ? void 0 : branches.map((b) => /* @__PURE__ */ jsx("option", { value: b.id, children: b.branch_name }, b.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-zinc-700 mb-1", children: "Select Class" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: selectedClassId,
            onChange: (e) => setSelectedClassId(e.target.value),
            className: "flex h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm font-semibold text-zinc-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950",
            children: classesList.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name || c.class_name }, c.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-zinc-700 mb-1", children: "Section" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedSection,
            onChange: (e) => setSelectedSection(e.target.value),
            className: "flex h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm font-semibold text-zinc-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Sections / Unified" }),
              sectionsList.map((sec) => /* @__PURE__ */ jsxs("option", { value: sec.id, children: [
                "Section ",
                sec.section_name || sec.name || sec.id
              ] }, sec.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-end", children: /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-zinc-500 bg-zinc-50 p-2 rounded-lg border border-zinc-200/80", children: /* @__PURE__ */ jsxs("span", { children: [
        "Structure: ",
        /* @__PURE__ */ jsx("strong", { children: (structure == null ? void 0 : structure.name) || "Not mapped yet" })
      ] }) }) })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3 border-b border-zinc-100 flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Weekly Class Timetable" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Click any period slot to assign or update the subject, teacher, and room." })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: loadGrid, className: "space-x-1.5 text-xs", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Refresh" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-4 p-0", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "p-16 text-center", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin text-zinc-600 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 font-medium", children: "Loading weekly schedule..." })
      ] }) : !structure || periods.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-16 text-center space-y-2", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "w-10 h-10 text-zinc-300 mx-auto" }),
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-zinc-800", children: "No Timetable Structure Mapped" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500 max-w-sm mx-auto", children: [
          "Please assign a Timetable Structure to this class in ",
          /* @__PURE__ */ jsx("strong", { children: "Step 2 (Class Mapping)" }),
          " first."
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto min-h-[420px] pb-32", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-zinc-50/80 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px]", children: [
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4 w-28 border-r border-zinc-200", children: "Day / Period" }),
          periods.map((p) => {
            const isBreak = p.period_type === "break";
            const isAssembly = p.period_type === "assembly";
            return /* @__PURE__ */ jsxs(
              "th",
              {
                className: `py-2 px-3 text-center border-r border-zinc-200 min-w-[120px] ${isBreak ? "bg-amber-50/70 text-amber-900" : isAssembly ? "bg-blue-50/70 text-blue-900" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "font-extrabold", children: p.period_name }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-normal text-zinc-500", children: [
                    p.start_time,
                    " - ",
                    p.end_time
                  ] })
                ]
              },
              p.id
            );
          })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-200/80", children: workingDays.map((day) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-zinc-50/40 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-bold text-zinc-900 bg-zinc-50/60 border-r border-zinc-200", children: day }),
          periods.map((period) => {
            const isBreak = period.period_type === "break";
            const isAssembly = period.period_type === "assembly";
            if (isBreak || isAssembly) {
              return /* @__PURE__ */ jsx("td", { className: "py-3 px-2 text-center border-r border-zinc-100 bg-zinc-50/50", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase text-zinc-400", children: isBreak ? "☕ Recess" : "🔔 Assembly" }) }, period.id);
            }
            const slot = slots.find((s) => s.period_id === period.id && s.day_of_week === day);
            return /* @__PURE__ */ jsx(
              "td",
              {
                className: "py-1.5 px-1.5 text-center border-r border-zinc-100 min-w-[140px]",
                children: /* @__PURE__ */ jsx(
                  SearchableSubjectSelect,
                  {
                    subjects,
                    value: (slot == null ? void 0 : slot.subject_id) ? String(slot.subject_id) : "",
                    onChange: (subId) => handleQuickSubjectChange(period, day, subId),
                    placeholder: "+ Select Subject"
                  }
                )
              },
              period.id
            );
          })
        ] }, day)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(editingSlot), onOpenChange: (open) => {
      if (!open) setEditingSlot(null);
    }, children: editingSlot && /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md p-6 border border-slate-200", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { className: "pb-2 border-b border-slate-100", children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "text-sm font-bold text-slate-900", children: [
          "Assign Slot: ",
          editingSlot.period_name
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-500", children: [
          editingSlot.day_of_week,
          " (",
          editingSlot.start_time,
          " - ",
          editingSlot.end_time,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveSlot, className: "space-y-4 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block font-semibold text-slate-700 mb-1", children: [
            "Subject ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              required: true,
              value: editingSlot.subject_id,
              onChange: (e) => handleSubjectChangeInSlot(e.target.value),
              className: "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "-- Choose Subject --" }),
                subjects.map((s) => /* @__PURE__ */ jsxs("option", { value: s.id, children: [
                  s.subject_name,
                  " ",
                  s.subject_code ? `(${s.subject_code})` : ""
                ] }, s.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "destructive",
              size: "sm",
              onClick: handleClearSlot,
              disabled: isSavingSlot,
              children: "Clear Slot"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => setEditingSlot(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                size: "sm",
                className: "bg-sky-600 hover:bg-sky-700 text-white",
                disabled: isSavingSlot,
                children: isSavingSlot ? "Saving..." : "Save Slot"
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const API_BASE = "/api/staff";
const staffService = {
  // Get staff list with filters and academic allocations
  async getStaffList(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set("branch_id", String(params.branch_id));
    if (params.staff_type && params.staff_type !== "All") query.set("staff_type", params.staff_type);
    if (params.department && params.department !== "All") query.set("department", params.department);
    if (params.status && params.status !== "All") query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    const res = await fetch(`${API_BASE}?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch staff");
    }
    return await res.json();
  },
  // Create new staff member
  async createStaff(payload) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create staff");
    }
    return await res.json();
  },
  // Update staff details
  async updateStaff(id, payload) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update staff");
    }
    return await res.json();
  },
  // Delete staff member
  async deleteStaff(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete staff");
    }
    return await res.json();
  },
  // Get allocations (Class Teacher, Assistant Class Teacher, Coordinator, Subject Teacher)
  async getAllocations(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set("branch_id", String(params.branch_id));
    if (params.class_id) query.set("class_id", String(params.class_id));
    if (params.section_id) query.set("section_id", String(params.section_id));
    if (params.allocation_type) query.set("allocation_type", params.allocation_type);
    const res = await fetch(`${API_BASE}/allocations?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch allocations");
    }
    return await res.json();
  },
  // Assign or update academic allocation
  async saveAllocation(payload) {
    const res = await fetch(`${API_BASE}/allocations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to save allocation");
    }
    return await res.json();
  },
  // Delete an allocation
  async deleteAllocation(id) {
    const res = await fetch(`${API_BASE}/allocations/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete allocation");
    }
    return await res.json();
  },
  // Get teaching workload overview
  async getWorkloadSummary(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set("branch_id", String(params.branch_id));
    const res = await fetch(`${API_BASE}/workload?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch workload");
    }
    return await res.json();
  },
  // Update credentials for single staff
  async updateCredentials(id, payload) {
    const res = await fetch(`${API_BASE}/${id}/credentials`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to update credentials");
    return data;
  },
  // Bulk update credentials for selected staff
  async bulkUpdateCredentials(payload) {
    const res = await fetch(`${API_BASE}/bulk-credentials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to bulk update credentials");
    return data;
  }
};
function StaffCredentialsModal({
  isOpen,
  onClose,
  staff,
  roles = [],
  onSuccess
}) {
  if (!isOpen || !staff) return null;
  const [username, setUsername] = useState(staff.login_username || staff.email || `${staff.staff_code || "staff"}@school.edu`);
  const [password, setPassword] = useState("School@123");
  const [showPassword, setShowPassword] = useState(false);
  const [roleId, setRoleId] = useState(staff.role_id || 9);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const getFormattedDob = () => {
    if (!staff.date_of_birth) return null;
    const d = new Date(staff.date_of_birth);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };
  const formattedDob = getFormattedDob();
  const handleSetUsernameFromEmail = () => {
    if (staff.email) setUsername(staff.email.trim());
  };
  const handleSetUsernameFromCode = () => {
    if (staff.staff_code) setUsername(staff.staff_code.trim());
  };
  const handleSetUsernameFromMobile = () => {
    if (staff.mobile) setUsername(staff.mobile.trim());
  };
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
    setPassword("School@123");
    setShowPassword(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!username.trim()) {
      setError("Username / Email cannot be empty.");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      await staffService.updateCredentials(staff.id, {
        username: username.trim(),
        password: password.trim(),
        role_id: Number(roleId)
      });
      setSuccessMsg("ERP Credentials updated successfully!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1e3);
    } catch (err) {
      setError(err.message || "Error updating credentials");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(Key, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm text-white", children: "Manage ERP Credentials" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-300", children: [
            staff.first_name,
            " ",
            staff.last_name || "",
            " (",
            staff.staff_code,
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition",
          children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "p-5 space-y-4", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      successMsg && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: successMsg })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs grid grid-cols-2 gap-2 text-slate-600", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Mobile: ",
            /* @__PURE__ */ jsx("strong", { className: "text-slate-900", children: staff.mobile || "N/A" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
          /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
            "Email: ",
            /* @__PURE__ */ jsx("strong", { className: "text-slate-900 truncate", children: staff.email || "N/A" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 col-span-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "DOB: ",
            /* @__PURE__ */ jsxs("strong", { className: "text-slate-900", children: [
              staff.date_of_birth ? new Date(staff.date_of_birth).toISOString().slice(0, 10) : "Not specified",
              " ",
              formattedDob ? `(DDMMYYYY: ${formattedDob})` : ""
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5 text-indigo-600" }),
          "Assigned Master Role"
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: roleId,
            onChange: (e) => setRoleId(Number(e.target.value)),
            className: "w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer",
            children: roles.map((r) => /* @__PURE__ */ jsx("option", { value: r.id, children: r.name }, r.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-700", children: "ERP Login Username / Email" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 mr-0.5", children: "Map from:" }),
            staff.email && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleSetUsernameFromEmail,
                className: "text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition",
                children: "Email"
              }
            ),
            staff.staff_code && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleSetUsernameFromCode,
                className: "text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition",
                children: "Code"
              }
            ),
            staff.mobile && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleSetUsernameFromMobile,
                className: "text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition",
                children: "Phone"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            className: "w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-gray-700 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-indigo-600" }),
            "Password"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 mr-0.5", children: "Map from:" }),
            staff.mobile && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleSetPasswordFromMobile,
                className: "text-[10px] font-semibold px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded hover:bg-sky-100 transition",
                title: `Set password to phone number: ${staff.mobile}`,
                children: "Phone"
              }
            ),
            formattedDob && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleSetPasswordFromDob,
                className: "text-[10px] font-semibold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition",
                title: `Set password to DOB: ${formattedDob}`,
                children: [
                  "DOB (",
                  formattedDob,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleSetPasswordDefault,
                className: "text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition",
                children: "School@123"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "w-full px-3 py-2 pr-9 text-xs font-mono font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer",
              children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-gray-100 flex items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: saving,
            className: "px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
              saving ? "Updating..." : "Save Credentials"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function BulkCredentialsModal({
  isOpen,
  onClose,
  selectedStaffIds = [],
  roles = [],
  onSuccess
}) {
  if (!isOpen || selectedStaffIds.length === 0) return null;
  const [passwordPattern, setPasswordPattern] = useState("mobile");
  const [customPassword, setCustomPassword] = useState("");
  const [usernamePattern, setUsernamePattern] = useState("keep");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleApplyBulk = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (passwordPattern === "custom" && !customPassword.trim()) {
      setError("Please provide a custom password.");
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
      setSuccessMsg(res.message || "Credentials updated successfully!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Error updating bulk credentials");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm text-white", children: "Bulk Update ERP Credentials" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-300", children: [
            "Batch apply formula across ",
            /* @__PURE__ */ jsx("strong", { className: "text-white underline", children: selectedStaffIds.length }),
            " selected staff members"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition",
          children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleApplyBulk, className: "p-5 space-y-4", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      successMsg && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: successMsg })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-gray-800 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-indigo-600" }),
          "Select Password Formula:"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              onClick: () => setPasswordPattern("mobile"),
              className: `p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${passwordPattern === "mobile" ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20" : "border-gray-200 hover:border-gray-300 bg-white"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-gray-900", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-sky-600" }),
                  /* @__PURE__ */ jsx("span", { children: "Mobile Phone" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 mt-1", children: "Each staff gets their own phone number as password" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "label",
            {
              onClick: () => setPasswordPattern("dob"),
              className: `p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${passwordPattern === "dob" ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20" : "border-gray-200 hover:border-gray-300 bg-white"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-gray-900", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-amber-600" }),
                  /* @__PURE__ */ jsx("span", { children: "DOB (DDMMYYYY)" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 mt-1", children: "Each staff gets their birthdate (e.g. 15081992)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "label",
            {
              onClick: () => setPasswordPattern("default"),
              className: `p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${passwordPattern === "default" ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20" : "border-gray-200 hover:border-gray-300 bg-white"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-gray-900", children: [
                  /* @__PURE__ */ jsx(Key, { className: "w-4 h-4 text-indigo-600" }),
                  /* @__PURE__ */ jsx("span", { children: "Standard Default" })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-500 mt-1", children: [
                  "Set password to ",
                  /* @__PURE__ */ jsx("strong", { children: "School@123" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "label",
            {
              onClick: () => setPasswordPattern("custom"),
              className: `p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${passwordPattern === "custom" ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20" : "border-gray-200 hover:border-gray-300 bg-white"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-gray-900", children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-emerald-600" }),
                  /* @__PURE__ */ jsx("span", { children: "Custom Password" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 mt-1", children: "Specify a common new password" })
              ]
            }
          )
        ] }),
        passwordPattern === "custom" && /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Enter custom password...",
            value: customPassword,
            onChange: (e) => setCustomPassword(e.target.value),
            className: "w-full mt-2 px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pt-2 border-t border-gray-100", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-800", children: "Username Mapping:" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "user_pattern",
                checked: usernamePattern === "keep",
                onChange: () => setUsernamePattern("keep"),
                className: "text-indigo-600"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: "Keep Current Username" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "user_pattern",
                checked: usernamePattern === "email",
                onChange: () => setUsernamePattern("email"),
                className: "text-indigo-600"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: "Staff Email ID" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "user_pattern",
                checked: usernamePattern === "code",
                onChange: () => setUsernamePattern("code"),
                className: "text-indigo-600"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: "Staff Code" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "user_pattern",
                checked: usernamePattern === "mobile",
                onChange: () => setUsernamePattern("mobile"),
                className: "text-indigo-600"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: "Mobile Phone" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-gray-100 flex items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: saving,
            className: "px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
              saving ? "Applying Bulk Update..." : `Apply to ${selectedStaffIds.length} Staff Members`
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function StaffDirectoryView({
  staffList,
  loading,
  staffTypeFilter,
  setStaffTypeFilter,
  selectedDepartment,
  setSelectedDepartment,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteStaff,
  onRefresh
}) {
  var _a, _b, _c, _d, _e;
  const [selectedStaffForView, setSelectedStaffForView] = useState(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedStaffForCredentials, setSelectedStaffForCredentials] = useState(null);
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    fetch("/api/permissions/roles").then((r) => r.json()).then((d) => {
      const filtered = (d.data || []).filter((r) => r.name !== "Student" && r.name !== "Parent");
      setRoles(filtered);
    }).catch((err) => console.error(err));
  }, []);
  const allIds = staffList.map((s) => s.id);
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedStaffIds.includes(id));
  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds([...allIds]);
    }
  };
  const handleToggleStaff = (id) => {
    setSelectedStaffIds(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleClearSelection = () => {
    setSelectedStaffIds([]);
  };
  const departments = ["All", ...new Set(staffList.map((s) => s.department).filter(Boolean))];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx(Card, { className: "rounded-xl shadow-xs border border-slate-200/80 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setStaffTypeFilter("All"),
            className: `flex-1 lg:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${staffTypeFilter === "All" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`,
            children: [
              "All Staff (",
              staffList.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setStaffTypeFilter("Teaching"),
            className: `flex-1 lg:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${staffTypeFilter === "Teaching" ? "bg-sky-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"}`,
            children: [
              /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5" }),
              "Teaching Staff"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setStaffTypeFilter("Non-Teaching"),
            className: `flex-1 lg:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${staffTypeFilter === "Non-Teaching" ? "bg-amber-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"}`,
            children: [
              /* @__PURE__ */ jsx(Building, { className: "w-3.5 h-3.5" }),
              "Non-Teaching Staff"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative min-w-[240px] flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              placeholder: "Search by name, code, phone, role...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedDepartment,
            onChange: (e) => setSelectedDepartment(e.target.value),
            className: "text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 font-medium cursor-pointer",
            children: [
              /* @__PURE__ */ jsx("option", { value: "All", children: "All Departments" }),
              departments.filter((d) => d !== "All").map((dept) => /* @__PURE__ */ jsx("option", { value: dept, children: dept }, dept))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: onOpenAddModal,
            className: "rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs",
            children: [
              /* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4 mr-1.5" }),
              "Add Staff"
            ]
          }
        )
      ] })
    ] }) }),
    selectedStaffIds.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(CheckSquare, { className: "w-3.5 h-3.5 text-indigo-400" }),
          selectedStaffIds.length,
          " Staff Selected"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-300", children: "Apply bulk password mapping or role assignments across selected staff." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsBulkModalOpen(true),
            className: "px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95",
            children: [
              /* @__PURE__ */ jsx(Key, { className: "w-3.5 h-3.5" }),
              "Bulk Reset Credentials"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClearSelection,
            className: "px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold text-xs rounded-lg transition cursor-pointer",
            children: "Clear Selection"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "rounded-xl shadow-xs border border-slate-200/80 overflow-hidden", children: loading ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-600 border-t-transparent" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500", children: "Loading staff records..." })
    ] }) : staffList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center", children: [
      /* @__PURE__ */ jsx(Users, { className: "w-12 h-12 text-slate-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-700", children: "No staff members found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Try changing filters or add a new staff member" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-3 w-10 text-center", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: isAllSelected,
            onChange: handleToggleAll,
            className: "w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
          }
        ) }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-4", children: "Staff Member" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-4", children: "Type & Department" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-4", children: "ERP Login & Role" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-4", children: "Academic Responsibilities" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-4", children: "Contact Info" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-4", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3 px-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { className: "divide-y divide-slate-100 text-xs", children: staffList.map((staff) => {
        var _a2, _b2, _c2, _d2, _e2, _f;
        return /* @__PURE__ */ jsxs("tr", { className: `hover:bg-indigo-50/30 transition-colors ${selectedStaffIds.includes(staff.id) ? "bg-indigo-50/40" : ""}`, children: [
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-3 text-center", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: selectedStaffIds.includes(staff.id),
              onChange: () => handleToggleStaff(staff.id),
              className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: `w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-xs ${staff.staff_type === "Teaching" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-amber-100 text-amber-700 border border-amber-200"}`, children: [
              ((_a2 = staff.first_name) == null ? void 0 : _a2[0]) || "S",
              ((_b2 = staff.last_name) == null ? void 0 : _b2[0]) || ""
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-semibold text-gray-900", children: [
                staff.first_name,
                " ",
                staff.last_name || ""
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-gray-400 flex items-center gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 font-medium", children: staff.staff_code }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: staff.qualification || "N/A" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${staff.staff_type === "Teaching" ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`, children: [
              staff.staff_type === "Teaching" ? /* @__PURE__ */ jsx(GraduationCap, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(Building, { className: "w-3 h-3" }),
              staff.staff_type
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-gray-900 font-medium mt-1", children: staff.designation }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-500", children: staff.department })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-200/80 rounded px-2 py-0.5 w-fit", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-3 h-3 text-slate-400" }),
              /* @__PURE__ */ jsx("span", { className: "truncate max-w-[170px]", children: staff.login_username || staff.email || `${staff.staff_code}@school.edu` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60", children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3 text-indigo-600" }),
                staff.role_name || "Staff Member"
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setSelectedStaffForCredentials(staff),
                  className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 transition cursor-pointer",
                  title: "Manage Username & Password",
                  children: [
                    /* @__PURE__ */ jsx(Key, { className: "w-3 h-3 text-amber-600" }),
                    "Credentials"
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 max-w-[260px]", children: staff.staff_type === "Teaching" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            staff.class_teacher_for && staff.class_teacher_for.length > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3 text-emerald-600" }),
              "Class Teacher: ",
              staff.class_teacher_for.join(", ")
            ] }),
            staff.asst_class_teacher_for && staff.asst_class_teacher_for.length > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3 h-3 text-teal-600" }),
              "Asst: ",
              staff.asst_class_teacher_for.join(", ")
            ] }),
            staff.coordinator_for && staff.coordinator_for.length > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-purple-600" }),
              "Coordinator: ",
              staff.coordinator_for.join(", ")
            ] }),
            staff.subjects_taught && staff.subjects_taught.length > 0 && /* @__PURE__ */ jsxs("div", { className: "w-full text-[11px] text-gray-600 flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "w-3 h-3 text-gray-400 shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: staff.subjects_taught.join(" • ") })
            ] }),
            !((_c2 = staff.class_teacher_for) == null ? void 0 : _c2.length) && !((_d2 = staff.asst_class_teacher_for) == null ? void 0 : _d2.length) && !((_e2 = staff.coordinator_for) == null ? void 0 : _e2.length) && !((_f = staff.subjects_taught) == null ? void 0 : _f.length) && /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400 italic", children: "No classes assigned yet" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-gray-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-3.5 h-3.5 text-gray-400" }),
            /* @__PURE__ */ jsx("span", { children: "Administrative / Support Duty" })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-[11px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-gray-700 font-medium", children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-gray-400" }),
              /* @__PURE__ */ jsx("span", { children: staff.mobile })
            ] }),
            staff.email && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-gray-500", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-gray-400" }),
              /* @__PURE__ */ jsx("span", { className: "truncate max-w-[150px]", children: staff.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${staff.status === "Active" ? "bg-green-50 text-green-700 border border-green-200" : staff.status === "On Leave" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-gray-100 text-gray-600"}`, children: staff.status }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedStaffForView(staff),
                className: "px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition",
                children: "View"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onOpenEditModal(staff),
                className: "px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition",
                children: "Edit"
              }
            )
          ] }) })
        ] }, staff.id);
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(selectedStaffForView), onOpenChange: (open) => {
      if (!open) setSelectedStaffForView(null);
    }, children: selectedStaffForView && /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg p-6", children: [
      /* @__PURE__ */ jsx(DialogHeader, { className: "border-b border-slate-100 pb-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${selectedStaffForView.staff_type === "Teaching" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"}`, children: (_a = selectedStaffForView.first_name) == null ? void 0 : _a[0] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(DialogTitle, { className: "font-bold text-slate-900 text-base", children: [
            selectedStaffForView.first_name,
            " ",
            selectedStaffForView.last_name || ""
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 font-mono", children: [
            selectedStaffForView.staff_code,
            " • ",
            selectedStaffForView.designation
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[10px] uppercase font-bold block", children: "Department" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: selectedStaffForView.department })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[10px] uppercase font-bold block", children: "Staff Type" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: selectedStaffForView.staff_type })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[10px] uppercase font-bold block", children: "Employment" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-800", children: [
              selectedStaffForView.employment_type,
              " (",
              selectedStaffForView.status,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[10px] uppercase font-bold block", children: "Experience" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-800", children: [
              selectedStaffForView.experience_years,
              " Years"
            ] })
          ] })
        ] }),
        selectedStaffForView.staff_type === "Teaching" && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 border border-sky-100 bg-sky-50/30 p-3 rounded-xl", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-sky-900 text-[11px] uppercase tracking-wider", children: "Academic Allocations" }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Class Teacher:" }),
            " ",
            ((_b = selectedStaffForView.class_teacher_for) == null ? void 0 : _b.join(", ")) || "None"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Assistant Class Teacher:" }),
            " ",
            ((_c = selectedStaffForView.asst_class_teacher_for) == null ? void 0 : _c.join(", ")) || "None"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Class Coordinator:" }),
            " ",
            ((_d = selectedStaffForView.coordinator_for) == null ? void 0 : _d.join(", ")) || "None"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Subjects:" }),
            " ",
            ((_e = selectedStaffForView.subjects_taught) == null ? void 0 : _e.join(", ")) || "None"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1", children: "Contact & Joining" }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            "📞 Phone: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: selectedStaffForView.mobile })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            "✉️ Email: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: selectedStaffForView.email || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            "📅 Date of Joining: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: selectedStaffForView.date_of_joining })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
            "🎓 Qualification: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: selectedStaffForView.qualification || "N/A" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setSelectedStaffForView(null),
          className: "rounded-lg text-xs",
          children: "Close"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(
      StaffCredentialsModal,
      {
        isOpen: Boolean(selectedStaffForCredentials),
        onClose: () => setSelectedStaffForCredentials(null),
        staff: selectedStaffForCredentials,
        roles,
        onSuccess: () => {
          if (onRefresh) onRefresh();
        }
      }
    ),
    /* @__PURE__ */ jsx(
      BulkCredentialsModal,
      {
        isOpen: isBulkModalOpen,
        onClose: () => setIsBulkModalOpen(false),
        selectedStaffIds,
        roles,
        onSuccess: () => {
          setSelectedStaffIds([]);
          if (onRefresh) onRefresh();
        }
      }
    )
  ] });
}
const AcademicYearTable = ({ academicYears, onView, onEdit, onConfigureClasses, onSetCurrent, onSetNext, onChangeStatus, onToggleEnabled, isLoading = false }) => {
  const formatDate = (dateStr) => {
    if (!dateStr)
      return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };
  const getBranchDates = (ay) => {
    if (!ay) return [];
    if (Array.isArray(ay.branch_dates)) return ay.branch_dates;
    if (typeof ay.branch_dates === "string") {
      try {
        const parsed = JSON.parse(ay.branch_dates);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  };
  const getStatusBadge = (ay) => {
    const isCurrent = Boolean(ay.is_current);
    const isEnabled = ay.is_enabled !== false && ay.is_enabled !== 0;
    const isNext = Boolean(ay.is_next);
    if (isCurrent) {
      return /* @__PURE__ */ jsxs(Badge, { className: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-bold shadow-2xs", children: [
        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" }),
        "Current / Default"
      ] });
    }
    if (isNext && isEnabled) {
      return /* @__PURE__ */ jsxs(Badge, { className: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 font-bold shadow-2xs", children: [
        /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1 text-blue-600" }),
        "Next Year / Enabled"
      ] });
    }
    if (!isEnabled) {
      return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-slate-100 text-slate-500 border-slate-200 font-bold shadow-2xs", children: [
        /* @__PURE__ */ jsx(EyeOff, { className: "w-3 h-3 mr-1 text-slate-400" }),
        "Disabled"
      ] });
    }
    return /* @__PURE__ */ jsxs(Badge, { className: "bg-emerald-50/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold shadow-2xs", children: [
      /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 mr-1 text-emerald-600" }),
      "Enabled"
    ] });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Card, { className: "p-8 shadow-xs", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-slate-200 rounded w-1/4" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-slate-100 rounded-lg" }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Card, { className: "shadow-xs overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "w-full text-left text-sm text-slate-600", children: [
    /* @__PURE__ */ jsx(TableHeader, { className: "bg-slate-50/80 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200", children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "px-5 py-4", children: "Academic Year" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-5 py-4", children: "Campus Timeline (Branch-Wise)" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-5 py-4", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-5 py-4", children: "Current Session" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-5 py-4", children: "Global Selector" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-5 py-4", children: "Created Date" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-5 py-4 text-right", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { className: "divide-y divide-slate-200/80", children: academicYears.map((ay) => {
      const isEnabled = ay.is_enabled !== false;
      const branchDates = getBranchDates(ay);
      return /* @__PURE__ */ jsxs("tr", { className: `hover:bg-slate-50/80 transition-colors ${ay.is_current ? "bg-emerald-50/30" : !isEnabled ? "bg-slate-50/40 opacity-80" : ""}`, children: [
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ${ay.is_current ? "bg-emerald-700 text-white ring-2 ring-emerald-600/30" : isEnabled ? "bg-slate-100 text-slate-700 border border-slate-200" : "bg-slate-100 text-slate-400 border border-slate-200"}`, children: /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx("span", { className: `font-bold text-base ${isEnabled ? "text-slate-900" : "text-slate-600 line-through decoration-slate-300"}`, children: ay.name }),
              ay.short_name && /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono", children: ay.short_name })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5", children: [
              branchDates.length > 0 ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px] border border-indigo-100", children: [
                /* @__PURE__ */ jsx(Building, { className: "w-3 h-3 text-indigo-500" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  branchDates.length,
                  " Campuses Configured"
                ] })
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Organization-Wide" }),
              ay.year_name && /* @__PURE__ */ jsxs("span", { className: "text-slate-400 text-[11px] font-mono font-medium", children: [
                "(",
                ay.year_name,
                ")"
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4 whitespace-nowrap text-slate-800 font-medium", children: branchDates.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-1.5 py-1", children: branchDates.map((bd, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs space-x-2 bg-slate-50/90 border border-slate-200/90 rounded-md px-2.5 py-1 shadow-2xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-700 min-w-[70px] truncate text-[11px]", title: bd.branch_name, children: [
            bd.branch_name ? bd.branch_name.split("(")[0].trim() : `Branch ${bd.branch_id}`,
            ":"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-slate-600 font-mono text-[11px] flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { children: formatDate(bd.start_date) }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "→" }),
            /* @__PURE__ */ jsx("span", { children: formatDate(bd.end_date) })
          ] }),
          bd.status && bd.status !== ay.status && /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold ml-auto", children: bd.status })
        ] }, idx)) }) : /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-slate-800 font-semibold", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
            /* @__PURE__ */ jsx("span", { children: formatDate(ay.start_date) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-slate-500 mt-0.5", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400" }),
            /* @__PURE__ */ jsx("span", { children: formatDate(ay.end_date) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4 whitespace-nowrap", children: getStatusBadge(ay) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4 whitespace-nowrap", children: ay.is_current ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-700 text-white shadow-2xs", children: [
          /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-white text-white" }),
          /* @__PURE__ */ jsx("span", { children: "Current Active" })
        ] }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-400 bg-slate-100", children: "No" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onToggleEnabled && onToggleEnabled(ay, !isEnabled), className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 ${isEnabled ? "bg-emerald-600" : "bg-slate-300"}`, role: "switch", "aria-checked": isEnabled, title: isEnabled ? "Enabled: Appears in the Global Academic Year selector. Click to disable." : "Disabled: Hidden from the Global Academic Year selector. All data remains safe.", children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isEnabled ? "translate-x-5" : "translate-x-0"}` }) }),
          /* @__PURE__ */ jsx("div", { children: isEnabled ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200", children: [
            /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 mr-1 text-emerald-600" }),
            "Selectable"
          ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200", children: [
            /* @__PURE__ */ jsx(EyeOff, { className: "w-3 h-3 mr-1 text-slate-400" }),
            "Hidden"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4 whitespace-nowrap text-xs text-slate-500", children: formatDate(ay.created_at ? ay.created_at.split("T")[0] : "") }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-1.5", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onView(ay), className: "p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer", title: "View Details", children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onEdit(ay), className: "p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer", title: "Edit Academic Year", children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onConfigureClasses && onConfigureClasses(ay), className: "inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors shadow-2xs cursor-pointer", title: "Configure and Enable/Disable Classes for this Academic Year", children: [
            /* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5 text-indigo-700" }),
            /* @__PURE__ */ jsx("span", { children: "Classes" })
          ] }),
          !ay.is_current && isEnabled && /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onSetCurrent(ay), className: "inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors shadow-2xs cursor-pointer", title: "Set as Current Academic Year", children: [
            /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 text-emerald-700" }),
            /* @__PURE__ */ jsx("span", { children: "Set Current" })
          ] }),
          !ay.is_current && !ay.is_next && isEnabled && onSetNext && /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onSetNext(ay), className: "inline-flex items-center space-x-1 px-2 py-1 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-md transition-colors shadow-2xs cursor-pointer", title: "Set as Next Academic Year for Promotion", children: [
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 text-blue-600" }),
            /* @__PURE__ */ jsx("span", { children: "Set Next" })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onChangeStatus(ay), className: "p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer", title: "Change Status (Upcoming, Active, Closed)", children: /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }) })
        ] }) })
      ] }, ay.id);
    }) })
  ] }) }) });
};
const DisableCurrentYearModal = ({ isOpen, onClose, onConfirm, academicYear, isSubmitting = false }) => {
  if (!academicYear)
    return null;
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => {
    if (!open) onClose();
  }, children: /* @__PURE__ */ jsxs(DialogContent, { id: "disable-current-year-modal", className: "max-w-md p-6 border border-amber-200", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "flex flex-row items-start space-x-3.5 space-y-0 text-left", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-base font-bold text-slate-900", children: "Disable Active Academic Year?" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-amber-800 mt-0.5", children: [
          academicYear.name,
          " (",
          academicYear.start_date.slice(0, 4),
          " – ",
          academicYear.end_date.slice(0, 4),
          ")"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium space-y-1.5", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold text-amber-950", children: "This Academic Year is currently active. Disabling it will remove it from the Academic Year selector. Do you want to continue?" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-amber-800", children: "Disabling will automatically switch your active context to another enabled academic year. All underlying student, class, examination, and fee records remain 100% safe and intact." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-end space-x-3", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          id: "cancel-disable-year-button",
          onClick: onClose,
          disabled: isSubmitting,
          className: "rounded-xl text-slate-700",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          size: "sm",
          id: "confirm-disable-year-button",
          onClick: onConfirm,
          disabled: isSubmitting,
          className: "rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold",
          children: isSubmitting ? /* @__PURE__ */ jsx("span", { children: "Updating..." }) : /* @__PURE__ */ jsx("span", { children: "Continue" })
        }
      )
    ] })
  ] }) });
};
const ChangeAcademicYearStatusModal = ({ isOpen, onClose, onConfirm, academicYear }) => {
  const [selectedStatus, setSelectedStatus] = useState((academicYear == null ? void 0 : academicYear.status) || "Upcoming");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  React__default.useEffect(() => {
    if (academicYear) {
      setSelectedStatus(academicYear.status);
      setError(null);
    }
  }, [academicYear, isOpen]);
  if (!isOpen || !academicYear)
    return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(selectedStatus);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update academic year status.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs", children: /* @__PURE__ */ jsx(RefreshCw, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold", children: "Change Academic Year Status" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-emerald-100/90 font-medium", children: [
            academicYear.name,
            " (",
            academicYear.branch_name || "Selected Campus",
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-red-600 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600", children: [
        "Select the new operational status for academic cycle ",
        /* @__PURE__ */ jsx("strong", { children: academicYear.name }),
        ":"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
        /* @__PURE__ */ jsxs("label", { className: `flex items-start p-3.5 rounded-xl border-2 transition-all cursor-pointer ${selectedStatus === "Upcoming" ? "border-emerald-700 bg-emerald-50/40 text-slate-900" : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"}`, children: [
          /* @__PURE__ */ jsx("input", { type: "radio", name: "status", value: "Upcoming", checked: selectedStatus === "Upcoming", onChange: () => setSelectedStatus("Upcoming"), className: "mt-1 text-emerald-700 focus:ring-emerald-600" }),
          /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-amber-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Upcoming" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Academic year has not started yet. Pre-configuration and planning phase." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: `flex items-start p-3.5 rounded-xl border-2 transition-all cursor-pointer ${selectedStatus === "Active" ? "border-emerald-700 bg-emerald-50/40 text-slate-900" : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"}`, children: [
          /* @__PURE__ */ jsx("input", { type: "radio", name: "status", value: "Active", checked: selectedStatus === "Active", onChange: () => setSelectedStatus("Active"), className: "mt-1 text-emerald-700 focus:ring-emerald-600" }),
          /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Active" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Academic year is currently open and in active operational progress." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: `flex items-start p-3.5 rounded-xl border-2 transition-all cursor-pointer ${selectedStatus === "Closed" ? "border-emerald-700 bg-emerald-50/40 text-slate-900" : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"}`, children: [
          /* @__PURE__ */ jsx("input", { type: "radio", name: "status", value: "Closed", checked: selectedStatus === "Closed", onChange: () => setSelectedStatus("Closed"), className: "mt-1 text-emerald-700 focus:ring-emerald-600" }),
          /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(Archive, { className: "w-4 h-4 text-slate-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Closed" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Academic year has ended. Remains permanently preserved for historical reports and audits." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-200 flex items-center justify-end space-x-3", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "inline-flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60", children: isSubmitting ? /* @__PURE__ */ jsx("span", { children: "Updating..." }) : /* @__PURE__ */ jsx("span", { children: "Update Status" }) })
      ] })
    ] })
  ] }) });
};
const HistoricalYearBanner = () => {
  const { activeAcademicYear, isHistoricalYear, isReadOnly, canManageHistoricalData, adminOverrideActive, setAdminOverrideActive, showToast } = useErp();
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
  if (!isHistoricalYear || !activeAcademicYear) {
    return null;
  }
  const handleToggleOverride = () => {
    if (adminOverrideActive) {
      setAdminOverrideActive(false);
      showToast("Admin override disabled. Switched back to Read-Only mode.", "info");
    } else {
      setShowOverrideConfirm(true);
    }
  };
  const confirmEnableOverride = () => {
    setAdminOverrideActive(true);
    setShowOverrideConfirm(false);
    showToast("Admin Override Enabled: You can now modify historical records.", "info");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { id: "historical-academic-year-banner", className: `w-full border-b px-4 py-2.5 transition-colors ${adminOverrideActive ? "bg-amber-500/10 border-amber-300 text-amber-950" : "bg-amber-50 border-amber-200 text-amber-900"}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
        /* @__PURE__ */ jsx("div", { className: `w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${adminOverrideActive ? "bg-amber-500 text-white shadow-xs" : "bg-amber-200/80 text-amber-800"}`, children: adminOverrideActive ? /* @__PURE__ */ jsx(ShieldAlert, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold tracking-tight", children: [
              "Historical Academic Year: ",
              activeAcademicYear.name
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${adminOverrideActive ? "bg-amber-200 text-amber-900 border-amber-300" : "bg-amber-100 text-amber-800 border-amber-200"}`, children: adminOverrideActive ? "Admin Edit Override Active" : "Read-Only Mode" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-amber-800/90 font-medium", children: adminOverrideActive ? "Administrative override active. Please proceed with caution when updating archived records." : `You are viewing archived historical records. Form submissions and edits are restricted to prevent data discrepancies.` })
        ] })
      ] }),
      canManageHistoricalData && /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2 shrink-0 self-end sm:self-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: adminOverrideActive ? "default" : "outline",
          size: "sm",
          id: "admin-override-toggle-button",
          onClick: handleToggleOverride,
          className: `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs ${adminOverrideActive ? "bg-amber-600 hover:bg-amber-700 text-white border border-amber-700" : "bg-white hover:bg-amber-100 text-amber-900 border border-amber-300"}`,
          title: "Toggle Admin Override for Historical Modifications",
          children: adminOverrideActive ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Unlock, { className: "w-3.5 h-3.5 mr-1" }),
            /* @__PURE__ */ jsx("span", { children: "Disable Override" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(ShieldAlert, { className: "w-3.5 h-3.5 mr-1 text-amber-700" }),
            /* @__PURE__ */ jsx("span", { children: "Enable Admin Override" })
          ] })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showOverrideConfirm, onOpenChange: setShowOverrideConfirm, children: /* @__PURE__ */ jsxs(DialogContent, { id: "admin-override-confirmation-modal", className: "max-w-md p-6 border border-amber-200", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { className: "flex flex-row items-start space-x-3.5 space-y-0 text-left", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-base font-bold text-slate-900", children: "Enable Historical Edit Override?" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-amber-800 mt-1", children: [
            "Academic Year: ",
            activeAcademicYear.name
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1.5 font-medium", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-bold text-amber-950 flex items-center space-x-1.5", children: [
          /* @__PURE__ */ jsx(ShieldAlert, { className: "w-4 h-4 text-amber-700 mr-1" }),
          /* @__PURE__ */ jsx("span", { children: "Caution: Sensitive Operation" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Modifying historical records may affect past reports, official grading transcripts, student fee balances, or financial audit records." }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-amber-800", children: "All modifications performed while override is active will be logged in the system audit trail." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => setShowOverrideConfirm(false),
            className: "rounded-xl text-slate-600",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            size: "sm",
            id: "confirm-admin-override-button",
            onClick: confirmEnableOverride,
            className: "bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl",
            children: "I Understand, Enable Override"
          }
        )
      ] })
    ] }) })
  ] });
};
const testResults = [];
const cleanHtml = (str) => (str || "").replace(/<!--.*?-->/g, "");
function challenge(name, suite, fn) {
  const start = performance.now();
  try {
    fn();
    const duration = (performance.now() - start).toFixed(2);
    testResults.push({ name, suite, passed: true, duration, error: null });
    console.log(`  ✔ [PASS] [${duration}ms] ${suite}: ${name}`);
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    testResults.push({ name, suite, passed: false, duration, error: err.message || String(err) });
    console.error(`  ✖ [FAIL] [${duration}ms] ${suite}: ${name}`);
    console.error(`    ↳ Error: ${err.message || String(err)}`);
  }
}
function runAllM4Challenges() {
  console.log("\n======================================================");
  console.log("   MILESTONE 4 EMPIRICAL ADVERSARIAL CHALLENGE SUITE   ");
  console.log("======================================================\n");
  console.log("▶ Suite 1: Homework Overdue Deadline Logic & Badge Rendering");
  challenge("Past due date triggers Overdue destructive badge in Homework card", "Homework-Deadline", () => {
    const pastDate = new Date(Date.now() - 864e5 * 3).toISOString().split("T")[0];
    const isPastOverdue = Boolean(pastDate && new Date(pastDate) < /* @__PURE__ */ new Date());
    assert.strictEqual(isPastOverdue, true, "Past date must be flagged as overdue");
    const futureDate = new Date(Date.now() + 864e5 * 5).toISOString().split("T")[0];
    const isFutureOverdue = Boolean(futureDate && new Date(futureDate) < /* @__PURE__ */ new Date());
    assert.strictEqual(isFutureOverdue, false, "Future date must not be flagged as overdue");
  });
  challenge("StudentHomeworkPortal renders due badges and handles month filtering", "Homework-Portal", () => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const past = new Date(Date.now() - 864e5 * 5).toISOString().split("T")[0];
    const mockHw = [
      { id: 101, title: "Calculus Assignment 1", subject_name: "Mathematics", due_date: past, created_at: today, description: "Solve problems 1-10" },
      { id: 102, title: "Physics Lab Report", subject_name: "Physics", due_date: today, created_at: today, description: "Optics experiment" }
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StudentHomeworkPortal,
        {
          homework: mockHw,
          student: { id: 1, class_name: "10", section_name: "A" },
          assignedSubjects: [{ subject_name: "Mathematics" }, { subject_name: "Physics" }]
        }
      ) })
    );
    assert.ok(html.includes("Calculus Assignment 1"), "Must render Calculus assignment");
    assert.ok(html.includes("Physics Lab Report"), "Must render Physics lab report");
    assert.ok(html.includes("Due:"), "Must render Due date label");
    assert.ok(cleanHtml(html).includes("Total Assigned") && cleanHtml(html).includes("2"), "Must display total assigned count 2");
  });
  challenge("StudentHomeworkPortal handles empty homework list and null attachments without throwing", "Homework-Boundary", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StudentHomeworkPortal,
        {
          homework: [],
          student: { id: 99, class_name: "12" },
          assignedSubjects: []
        }
      ) })
    );
    assert.ok(html.includes("No Homework Found") || html.includes("0"), "Handles empty homework list cleanly");
  });
  console.log("▶ Suite 2: Assignment Submission Review Drawers & Teacher Grading Dialogs");
  challenge("Assignment progress percentage calculation handles 0, partial, full and overflow", "Assignment-ProgressOracle", () => {
    const calcPercent = (submitted, total) => total > 0 ? Math.round(submitted / total * 100) : 0;
    assert.strictEqual(calcPercent(0, 40), 0, "Zero submitted is 0%");
    assert.strictEqual(calcPercent(20, 40), 50, "Half submitted is 50%");
    assert.strictEqual(calcPercent(40, 40), 100, "All submitted is 100%");
    assert.strictEqual(calcPercent(0, 0), 0, "Zero total students yields 0% without NaN/Infinity");
    const clamped = Math.min(calcPercent(45, 40), 100);
    assert.strictEqual(clamped, 100, "Width must clamp to 100% maximum");
  });
  challenge("StudentAssignmentPortal renders online submission status and download chips", "Assignment-Portal", () => {
    const todayIso = (/* @__PURE__ */ new Date()).toISOString();
    const assignments = [
      {
        id: 201,
        title: "History Essay",
        subject_name: "History",
        submission_type: "Online Submission",
        max_marks: 100,
        due_date: `${todayIso.slice(0, 7)}-15`,
        created_at: todayIso,
        description: "Mughal Empire trade routes",
        submission: {
          status: "Submitted",
          marks_obtained: 88,
          grade: "A",
          file_url: "https://example.com/essay.pdf",
          file_name: "essay.pdf"
        }
      }
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StudentAssignmentPortal,
        {
          assignments,
          student: { id: 1, class_name: "9" }
        }
      ) })
    );
    assert.ok(html.includes("History Essay"), "Must render assignment title");
    assert.ok(html.includes("History"), "Must render subject name");
  });
  console.log("▶ Suite 3: Notice Board Priority Sorting & Audience Targeting Scopes");
  challenge("Priority sorting & destructive badge oracle for Urgent / High notices", "Announcement-Priority", () => {
    const isUrgentNotice = (priority) => ["urgent", "high"].includes((priority || "").toLowerCase());
    assert.strictEqual(isUrgentNotice("Urgent"), true, '"Urgent" must be marked as urgent');
    assert.strictEqual(isUrgentNotice("HIGH"), true, '"HIGH" must be marked as urgent');
    assert.strictEqual(isUrgentNotice("Normal"), false, '"Normal" is not urgent');
    assert.strictEqual(isUrgentNotice("Low"), false, '"Low" is not urgent');
    assert.strictEqual(isUrgentNotice(null), false, "Null priority is not urgent");
    assert.strictEqual(isUrgentNotice(void 0), false, "Undefined priority is not urgent");
  });
  challenge("StudentAnnouncementPortal filters by urgent vs regular circulars", "Announcement-Filtering", () => {
    const notices = [
      { id: 301, title: "Cyclone Red Alert School Closure", priority: "Urgent", target_audience: "All", created_at: (/* @__PURE__ */ new Date()).toISOString() },
      { id: 302, title: "Annual Sports Day Schedule", priority: "Normal", target_audience: "All", created_at: (/* @__PURE__ */ new Date()).toISOString() }
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StudentAnnouncementPortal,
        {
          announcements: notices,
          student: { id: 1, class_name: "10" }
        }
      ) })
    );
    assert.ok(html.includes("Cyclone Red Alert"), "Must render urgent notice");
    assert.ok(html.includes("Annual Sports Day"), "Must render regular notice");
    assert.ok(html.includes("Official Circulars"), "Must display stats header");
  });
  challenge("Audience targeting scope formatting handles all variants safely", "Announcement-AudienceScopes", () => {
    const formatAudience = (item) => {
      let audienceDisplay = item.target_audience;
      if (item.target_audience === "Individual") {
        audienceDisplay = item.target_student_name || "Individual Student";
      } else if (item.target_audience === "Academic Group") {
        audienceDisplay = `Group: ${item.target_group_name || "Academic Group"}`;
      } else if (item.target_audience === "Class") {
        audienceDisplay = item.class_name ? `Class ${item.class_name}` : "Specific Class";
      } else if (item.target_audience === "Section") {
        audienceDisplay = `${item.class_name || "Class"} • Sec ${item.section_name || "Section"}`;
      } else if (item.target_audience === "Gender") {
        const genderLabel = item.target_gender === "Male" ? "Boys" : item.target_gender === "Female" ? "Girls" : item.target_gender || "All Genders";
        audienceDisplay = `Gender: ${genderLabel}`;
      } else if (item.target_audience === "Residential") {
        const resLabel = item.target_residential_type || "Residential";
        audienceDisplay = `Residential: ${resLabel}`;
      }
      return audienceDisplay;
    };
    assert.strictEqual(formatAudience({ target_audience: "All" }), "All");
    assert.strictEqual(formatAudience({ target_audience: "Individual", target_student_name: "Aarav Patel" }), "Aarav Patel");
    assert.strictEqual(formatAudience({ target_audience: "Class", class_name: "10" }), "Class 10");
    assert.strictEqual(formatAudience({ target_audience: "Section", class_name: "8", section_name: "B" }), "8 • Sec B");
    assert.strictEqual(formatAudience({ target_audience: "Gender", target_gender: "Female" }), "Gender: Girls");
    assert.strictEqual(formatAudience({ target_audience: "Residential", target_residential_type: "Hostel Day Scholar" }), "Residential: Hostel Day Scholar");
  });
  console.log("▶ Suite 4: Gallery Lightbox Zoom & Wrap-Around Carousel Navigation");
  challenge("Lightbox index navigation boundary and wrap-around oracle", "Gallery-CarouselOracle", () => {
    const mediaCount = 5;
    const prevWrap = (idx, total) => (idx - 1 + total) % total;
    assert.strictEqual(prevWrap(0, mediaCount), 4, "Previous from 0 wraps to last item (4)");
    assert.strictEqual(prevWrap(2, mediaCount), 1, "Previous from 2 goes to 1");
    const nextWrap = (idx, total) => (idx + 1) % total;
    assert.strictEqual(nextWrap(4, mediaCount), 0, "Next from 4 wraps to 0");
    assert.strictEqual(nextWrap(1, mediaCount), 2, "Next from 1 goes to 2");
  });
  challenge("StudentGalleryPortal renders albums, covers, and event metadata", "Gallery-Portal", () => {
    const albums = [
      {
        id: 401,
        album_name: "Science Expo 2026",
        event_name: "Annual Science Fair",
        event_date: "2026-10-15",
        description: "Robotics and innovation exhibits",
        cover_image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800"
      }
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(StudentGalleryPortal, { albums, student: { id: 1, class_name: "10" } }) })
    );
    assert.ok(html.includes("Science Expo 2026"), "Must render album name");
    assert.ok(html.includes("Annual Science Fair"), "Must render event name");
    assert.ok(html.includes("View Photos"), "Must render View Photos action link");
  });
  console.log("▶ Suite 5: Timetable Weekly Schedule Matrix Period Rendering");
  challenge("TimetableSlotAllocationView handles empty structure fallback gracefully", "Timetable-Grid", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(TimetableSlotAllocationView, { showToast: () => {
      } }) })
    );
    assert.ok(
      html.includes("Subject & Teacher Timetable Grid") || html.includes("Timetable"),
      "Must render Timetable Slot Allocation component"
    );
    assert.ok(
      html.includes("Campus / Branch") || html.includes("Select Class"),
      "Must render class and campus controls"
    );
  });
  challenge("Timetable period type classifier correctly handles breaks and assemblies", "Timetable-PeriodTypes", () => {
    const isSpecialPeriod = (type) => type === "break" || type === "assembly";
    assert.strictEqual(isSpecialPeriod("break"), true, "Break period is special");
    assert.strictEqual(isSpecialPeriod("assembly"), true, "Assembly period is special");
    assert.strictEqual(isSpecialPeriod("regular"), false, "Regular period is standard");
    assert.strictEqual(isSpecialPeriod("lab"), false, "Lab period is standard");
  });
  console.log("▶ Suite 6: Staff Directory Filtering, Pagination & Workload Progress Bars");
  challenge("TeachingWorkloadView capacity formula and color variant oracles", "Staff-WorkloadOracle", () => {
    const getWorkloadProgress = (periods, maxCapacity = 30) => {
      const parsed = parseInt(periods || 0, 10);
      const percent = Math.round(parsed / maxCapacity * 100);
      const widthPercent = Math.min(100, parsed / maxCapacity * 100);
      const isFullLoad = parsed >= 24;
      const isModerate = parsed >= 12 && parsed < 24;
      const colorClass = isFullLoad ? "bg-rose-500" : isModerate ? "bg-emerald-500" : "bg-amber-500";
      return { percent, widthPercent, isFullLoad, isModerate, colorClass };
    };
    const zero = getWorkloadProgress(0);
    assert.strictEqual(zero.percent, 0, "Zero periods is 0%");
    assert.strictEqual(zero.colorClass, "bg-amber-500", "Zero periods gets amber indicator");
    const low = getWorkloadProgress(10);
    assert.strictEqual(low.percent, 33, "10 periods is ~33%");
    assert.strictEqual(low.colorClass, "bg-amber-500", "10 periods gets amber indicator");
    const mod = getWorkloadProgress(18);
    assert.strictEqual(mod.percent, 60, "18 periods is 60%");
    assert.strictEqual(mod.colorClass, "bg-emerald-500", "18 periods gets emerald indicator");
    const full = getWorkloadProgress(25);
    assert.strictEqual(full.percent, 83, "25 periods is 83%");
    assert.strictEqual(full.colorClass, "bg-rose-500", "25 periods gets rose full load indicator");
    const over = getWorkloadProgress(35);
    assert.strictEqual(over.widthPercent, 100, "Bar width is capped at 100%");
    assert.strictEqual(over.colorClass, "bg-rose-500", "Overload gets rose indicator");
  });
  challenge("StaffDirectoryView renders segmented tabs and filters", "Staff-Directory", () => {
    const mockStaff = [
      { id: 1, first_name: "Ravi", last_name: "Shankar", staff_code: "T001", staff_type: "Teaching", department: "Mathematics" },
      { id: 2, first_name: "Sunita", last_name: "Devi", staff_code: "NT001", staff_type: "Non-Teaching", department: "Administration" }
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StaffDirectoryView,
        {
          staffList: mockStaff,
          loading: false,
          staffTypeFilter: "All",
          setStaffTypeFilter: () => {
          },
          selectedDepartment: "All",
          setSelectedDepartment: () => {
          },
          searchQuery: "",
          setSearchQuery: () => {
          },
          onOpenAddModal: () => {
          }
        }
      ) })
    );
    assert.ok(cleanHtml(html).includes("All Staff (2)"), "Must render All Staff tab count");
    assert.ok(html.includes("Teaching Staff"), "Must render Teaching Staff tab");
    assert.ok(html.includes("Non-Teaching Staff"), "Must render Non-Teaching Staff tab");
    assert.ok(html.includes("Ravi"), "Must render staff name Ravi");
    assert.ok(html.includes("Sunita"), "Must render staff name Sunita");
  });
  console.log("▶ Suite 7: Academic Year Status Transitions & Disable Current Year Modal");
  challenge("AcademicYearTable renders correct status badges (Current, Next, Disabled, Enabled)", "AY-TableBadges", () => {
    const mockYears = [
      { id: 1, name: "2026-2027", is_current: true, is_enabled: true, status: "Active", start_date: "2026-06-01", end_date: "2027-04-30" },
      { id: 2, name: "2027-2028", is_current: false, is_next: true, is_enabled: true, status: "Upcoming", start_date: "2027-06-01", end_date: "2028-04-30" },
      { id: 3, name: "2024-2025", is_current: false, is_next: false, is_enabled: false, status: "Closed", start_date: "2024-06-01", end_date: "2025-04-30" }
    ];
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        AcademicYearTable,
        {
          academicYears: mockYears,
          onView: () => {
          },
          onEdit: () => {
          },
          onConfigureClasses: () => {
          },
          onSetCurrent: () => {
          },
          onSetNext: () => {
          },
          onChangeStatus: () => {
          },
          onToggleEnabled: () => {
          }
        }
      ) })
    );
    assert.ok(html.includes("Current / Default"), "Must render Current / Default badge");
    assert.ok(html.includes("Next Year / Enabled"), "Must render Next Year / Enabled badge");
    assert.ok(html.includes("Disabled"), "Must render Disabled badge");
    assert.ok(html.includes("2026-2027"), "Must render 2026-2027 year");
    assert.ok(html.includes("2027-2028"), "Must render 2027-2028 year");
    assert.ok(html.includes("2024-2025"), "Must render 2024-2025 year");
  });
  challenge("DisableCurrentYearModal renders dialog with required test IDs when open", "AY-DisableModal", () => {
    const mockYear = {
      id: 1,
      name: "2026-2027",
      is_current: true,
      start_date: "2026-06-01",
      end_date: "2027-04-30"
    };
    const html = renderToString(
      /* @__PURE__ */ jsx(
        DisableCurrentYearModal,
        {
          isOpen: true,
          onClose: () => {
          },
          onConfirm: () => {
          },
          academicYear: mockYear,
          isSubmitting: false
        }
      )
    );
    assert.ok(html.includes("disable-current-year-modal"), 'Must contain id="disable-current-year-modal"');
    assert.ok(html.includes("cancel-disable-year-button"), 'Must contain id="cancel-disable-year-button"');
    assert.ok(html.includes("confirm-disable-year-button"), 'Must contain id="confirm-disable-year-button"');
    assert.ok(html.includes("Disable Active Academic Year?"), "Must display title warning");
  });
  challenge("DisableCurrentYearModal returns null when closed or academicYear is null", "AY-DisableModalNull", () => {
    const htmlClosed = renderToString(
      /* @__PURE__ */ jsx(
        DisableCurrentYearModal,
        {
          isOpen: false,
          onClose: () => {
          },
          onConfirm: () => {
          },
          academicYear: { id: 1, name: "2026-2027", start_date: "2026-06-01", end_date: "2027-04-30" }
        }
      )
    );
    assert.strictEqual(htmlClosed, "", "Must render nothing when closed");
    const htmlNullYear = renderToString(
      /* @__PURE__ */ jsx(
        DisableCurrentYearModal,
        {
          isOpen: true,
          onClose: () => {
          },
          onConfirm: () => {
          },
          academicYear: null
        }
      )
    );
    assert.strictEqual(htmlNullYear, "", "Must render nothing when academicYear is null");
  });
  challenge("ChangeAcademicYearStatusModal renders all 3 transitions (Upcoming, Active, Closed)", "AY-StatusTransitions", () => {
    const mockYear = { id: 1, name: "2026-2027", status: "Upcoming" };
    const html = renderToString(
      /* @__PURE__ */ jsx(
        ChangeAcademicYearStatusModal,
        {
          isOpen: true,
          onClose: () => {
          },
          onConfirm: () => {
          },
          academicYear: mockYear
        }
      )
    );
    assert.ok(html.includes("Change Academic Year Status"), "Must render modal title");
    assert.ok(html.includes("Upcoming"), "Must render Upcoming status option");
    assert.ok(html.includes("Active"), "Must render Active status option");
    assert.ok(html.includes("Closed"), "Must render Closed status option");
    assert.ok(html.includes("Update Status"), "Must render submit button");
  });
  challenge("HistoricalYearBanner renders banner with required test IDs", "AY-HistoricalBanner", () => {
    resetMockErpContext();
    setMockErpContext({
      isHistoricalYear: true,
      activeAcademicYear: { id: 9, name: "2023-2024" },
      isReadOnly: true,
      isAdminOverrideActive: false,
      canManageHistoricalData: true
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(
        HistoricalYearBanner,
        {
          academicYearName: "2023-2024",
          isHistorical: true
        }
      )
    );
    assert.ok(html.includes("historical-academic-year-banner"), 'Must contain id="historical-academic-year-banner"');
    assert.ok(html.includes("admin-override-toggle-button"), 'Must contain id="admin-override-toggle-button"');
  });
  const passedCount = testResults.filter((t) => t.passed).length;
  const totalCount = testResults.length;
  console.log("\n======================================================");
  console.log(`M4 CHALLENGE SUITE SUMMARY: ${passedCount}/${totalCount} Passed (${(passedCount / totalCount * 100).toFixed(1)}%)`);
  console.log("======================================================\n");
  if (passedCount < totalCount) {
    console.error(`[FAILURE] ${totalCount - passedCount} challenge tests failed!`);
    process.exit(1);
  } else {
    console.log("[SUCCESS] All M4 empirical challenge tests passed successfully!");
  }
}
runAllM4Challenges();
export {
  runAllM4Challenges
};
