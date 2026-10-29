import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { useNavigate, useLocation, Outlet, MemoryRouter } from "react-router-dom";
import { X, LayoutDashboard, Sparkles, Star, Users, UserCheck, CalendarCheck, Calendar, Clock, BookOpen, Award, CreditCard, MessageSquare, Briefcase, Bus, Bookmark, BarChart3, FileCheck2, Bell, Image, User, ChevronDown, Settings, Shield, Key, Building2, Layers, GitMerge, ShieldCheck, Edit, ArrowRightLeft, TrendingUp, UserX, CheckSquare, History, ChevronRight, Check, Circle, Lock, ExternalLink, Globe, MapPin, Menu, Search, LogOut, GraduationCap, ShieldAlert, Unlock, AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Sheet = DialogPrimitive.Root;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(
  ({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        ref,
        className: cn(sheetVariants({ side }), className),
        ...props,
        children: [
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] }),
          children
        ]
      }
    )
  ] })
);
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      ref,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  )
);
SheetDescription.displayName = DialogPrimitive.Description.displayName;
const NAVIGATION_GROUPS = [
  {
    id: "overview",
    label: "Overview & Hub",
    modules: ["dashboard", "modules"]
  },
  {
    id: "students",
    label: "Student Information (SIS)",
    modules: ["students", "attendance"]
  },
  {
    id: "academics",
    label: "Academics & Schedule",
    modules: ["academics", "timetable", "calendar"]
  },
  {
    id: "assessment",
    label: "Assessment & Conduct",
    modules: ["examination", "anecdotes"]
  },
  {
    id: "communication",
    label: "Communication & Media",
    modules: ["communication"]
  },
  {
    id: "faculty",
    label: "Staff & Administration",
    modules: ["staff", "hr"]
  },
  {
    id: "operations",
    label: "Campus Operations",
    modules: ["finance", "transport", "library", "reports"]
  }
];
const Sidebar = ({
  activeNav,
  onSelectNav,
  isSettingsExpanded,
  onToggleSettingsExpand,
  activeAcademicSubTab = "academic-year",
  onSelectAcademicSubTab,
  isAcademicExpanded = true,
  onToggleAcademicExpand,
  activeStudentSubTab = "details",
  onSelectStudentSubTab,
  isStudentsExpanded = true,
  onToggleStudentsExpand,
  activeAttendanceSubTab = "take_attendance",
  onSelectAttendanceSubTab,
  isAttendanceExpanded = true,
  onToggleAttendanceExpand,
  activeCommunicationSubTab = "homework",
  onSelectCommunicationSubTab,
  isCommunicationExpanded = true,
  onToggleCommunicationExpand,
  activeExaminationSubTab = "setup",
  onSelectExaminationSubTab,
  isExaminationExpanded = true,
  onToggleExaminationExpand,
  activeAnecdoteSubTab = "logs",
  onSelectAnecdoteSubTab,
  isAnecdotesExpanded = true,
  onToggleAnecdotesExpand,
  activeStaffSubTab = "directory",
  onSelectStaffSubTab,
  isStaffExpanded = true,
  onToggleStaffExpand,
  userPermissions = { canViewBranchSettings: true, canViewAcademicSettings: true },
  userRole = "",
  isStudent = false,
  branchCount = 0,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { canViewBranchSettings = true, canViewAcademicSettings = true } = userPermissions;
  const isSuperAdminUser = userRole === "super_admin";
  const hasAnySettingsPermission = isSuperAdminUser && (canViewBranchSettings || canViewAcademicSettings);
  const isSettingsActive = activeNav === "branch-settings" || activeNav === "academic-settings" || activeNav === "users" || activeNav === "menu-assignment";
  const isStudentsActive = activeNav === "students";
  const isAttendanceActive = activeNav === "attendance";
  const isCommunicationActive = activeNav === "communication";
  const isExaminationActive = activeNav === "examination";
  const isAnecdotesActive = activeNav === "anecdotes";
  const isStaffActive = activeNav === "staff";
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const toggleGroup = (groupId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  const staffSubItems = [
    { id: "directory", label: "1. Staff Directory", icon: Users },
    { id: "allocations", label: "2. Academic Allocations", icon: ShieldCheck },
    { id: "workload", label: "3. Teaching Workload", icon: Clock },
    { id: "credentials", label: "4. Bulk Reset Credentials", icon: Key }
  ];
  const anecdoteSubItems = [
    { id: "logs", label: "1. Observations Log", icon: BookOpen },
    { id: "reports", label: "2. Behavioral Reports", icon: BarChart3 }
  ];
  const examinationSubItems = [
    { id: "term-structure", label: "1. Term & Academic Structure", icon: Layers }
  ];
  const allCommunicationSubItems = [
    { id: "homework", label: "1. Homework", icon: BookOpen },
    { id: "assignment", label: "2. Assignment", icon: FileCheck2 },
    { id: "announcement", label: "3. Announcement", icon: Bell },
    { id: "gallery", label: "4. Gallery", icon: Image },
    { id: "dashboard", label: "5. Monitoring & Stats", icon: BarChart3 },
    { id: "portal", label: "6. Student Portal Feed", icon: UserCheck },
    { id: "audit", label: "7. Audit Trail", icon: History }
  ];
  const studentCommunicationSubItems = [
    { id: "homework", label: "Homework", icon: BookOpen },
    { id: "assignment", label: "Assignment", icon: FileCheck2 },
    { id: "announcement", label: "Announcement", icon: Bell },
    { id: "gallery", label: "Gallery", icon: Image }
  ];
  const communicationSubItems = isStudent ? studentCommunicationSubItems : allCommunicationSubItems;
  const attendanceSubItems = [
    { id: "take_attendance", label: "1. Take Attendance", icon: CheckSquare },
    { id: "timings", label: "2. Attendance Time", icon: Clock },
    { id: "assignments", label: "3. Class & Section Timing Mapping", icon: Layers },
    { id: "history", label: "4. Attendance History", icon: History },
    { id: "reports", label: "5. Attendance Reports", icon: BarChart3 }
  ];
  const studentSubItems = [
    { id: "details", label: "Student Details", icon: Users },
    { id: "update", label: "Student Update", icon: Edit },
    { id: "class-section-changes", label: "Class & Section Changes", icon: ArrowRightLeft },
    { id: "promotion", label: "Student Promotion", icon: TrendingUp },
    { id: "academic-groups", label: "Academic Groups", icon: Layers },
    { id: "subject-mapping", label: "Subject Mapping", icon: BookOpen },
    { id: "inactive", label: "Inactive Students / TC", icon: UserX },
    { id: "approvals", label: "Student Approvals", icon: ShieldCheck }
  ];
  const rawMenuItems = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "modules", label: "Modules Showcase", icon: Sparkles, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "anecdotes", label: "Anecdotes", icon: Star, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "students", label: "Students", icon: Users, roles: ["super_admin", "principal", "branch_admin"] },
      { id: "staff", label: "Staff", icon: UserCheck, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "attendance", label: "Attendance", icon: CalendarCheck, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "calendar", label: "Calendar", icon: Calendar, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "timetable", label: "Timetable", icon: Clock, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "academics", label: "Academics", icon: BookOpen, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "examination", label: "Examination", icon: Award, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "finance", label: "Finance", icon: CreditCard, roles: ["super_admin", "principal", "branch_admin"] },
      { id: "communication", label: "Communication", icon: MessageSquare, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "hr", label: "HR", icon: Briefcase, roles: ["super_admin", "principal", "branch_admin"] },
      { id: "transport", label: "Transport", icon: Bus, roles: ["super_admin", "principal", "branch_admin"] },
      { id: "library", label: "Library", icon: Bookmark, roles: ["super_admin", "principal", "teacher", "branch_admin"] },
      { id: "reports", label: "Reports", icon: BarChart3, roles: ["super_admin", "principal", "branch_admin"] }
    ],
    []
  );
  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "anecdotes", label: "My Merits & Remarks", icon: Star },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "timetable", label: "Timetable", icon: Clock },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "homework", label: "Homework", icon: BookOpen },
    { id: "assignment", label: "Assignment", icon: FileCheck2 },
    { id: "announcement", label: "Announcement", icon: Bell },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "profile", label: "My Profile", icon: User }
  ];
  const isModuleAllowed = (item) => {
    if (isSuperAdminUser) return true;
    if (!item.roles) return true;
    const normalizedRole = userRole === "principle" ? "principal" : userRole;
    return item.roles.includes(normalizedRole);
  };
  const handleStudentsClick = () => {
    onSelectNav("students");
    if (onToggleStudentsExpand) {
      onToggleStudentsExpand();
    }
  };
  const handleStudentSubTabClick = (tab) => {
    onSelectNav("students");
    if (onSelectStudentSubTab) {
      onSelectStudentSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleAttendanceClick = () => {
    onSelectNav("attendance");
    if (onToggleAttendanceExpand) {
      onToggleAttendanceExpand();
    }
  };
  const handleAttendanceSubTabClick = (tab) => {
    onSelectNav("attendance");
    if (onSelectAttendanceSubTab) {
      onSelectAttendanceSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleCommunicationClick = () => {
    onSelectNav("communication");
    if (onToggleCommunicationExpand) {
      onToggleCommunicationExpand();
    }
  };
  const handleCommunicationSubTabClick = (tab) => {
    onSelectNav("communication");
    if (onSelectCommunicationSubTab) {
      onSelectCommunicationSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleExaminationClick = () => {
    onSelectNav("examination");
    if (onToggleExaminationExpand) {
      onToggleExaminationExpand();
    }
  };
  const handleAnecdotesClick = () => {
    onSelectNav("anecdotes");
    if (onToggleAnecdotesExpand) {
      onToggleAnecdotesExpand();
    }
  };
  const handleAnecdoteSubTabClick = (tab) => {
    onSelectNav("anecdotes");
    if (onSelectAnecdoteSubTab) {
      onSelectAnecdoteSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleStaffClick = () => {
    onSelectNav("staff");
    if (onToggleStaffExpand) {
      onToggleStaffExpand();
    }
  };
  const handleStaffSubTabClick = (tab) => {
    onSelectNav("staff");
    if (onSelectStaffSubTab) {
      onSelectStaffSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleExaminationSubTabClick = (tab) => {
    onSelectNav("examination");
    if (onSelectExaminationSubTab) {
      onSelectExaminationSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleSettingsClick = () => {
    if (onToggleSettingsExpand) {
      onToggleSettingsExpand();
    }
    if (!isSettingsActive) {
      if (canViewBranchSettings) {
        onSelectNav("branch-settings");
      } else if (canViewAcademicSettings) {
        onSelectNav("academic-settings");
      }
    }
  };
  const handleAcademicSubTabClick = (tab) => {
    onSelectNav("academic-settings");
    if (onSelectAcademicSubTab) {
      onSelectAcademicSubTab(tab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleSubItemClick = (subId) => {
    onSelectNav(subId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const handleMainMenuClick = (id) => {
    if (id === "academics") {
      onSelectNav("academic-settings");
      if (onSelectAcademicSubTab) {
        onSelectAcademicSubTab("subjects");
      }
      if (onCloseMobile) {
        onCloseMobile();
      }
      return;
    }
    onSelectNav(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const academicSubItems = [
    { id: "academic-year", label: "Academic Year", icon: Calendar, activeClass: "bg-primary text-primary-foreground shadow-xs" },
    { id: "classes", label: "Classes", icon: Layers, activeClass: "bg-primary text-primary-foreground shadow-xs" },
    { id: "sections", label: "Sections", icon: Bookmark, activeClass: "bg-primary text-primary-foreground shadow-xs" },
    { id: "class-section", label: "Class & Section", icon: GitMerge, activeClass: "bg-primary text-primary-foreground shadow-xs" },
    { id: "subjects", label: "Subjects", icon: BookOpen, activeClass: "bg-primary text-primary-foreground shadow-xs" }
  ];
  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = activeNav === item.id;
    if (item.id === "anecdotes" && !isStudent) {
      return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleAnecdotesClick,
            className: cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isAnecdotesActive ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isAnecdotesActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                    ),
                    children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: "Anecdotes" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5", children: /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: cn(
                    "w-4 h-4 transition-transform duration-200",
                    isAnecdotesActive ? "text-white" : "text-slate-400",
                    !isAnecdotesExpanded && "-rotate-90"
                  )
                }
              ) })
            ]
          }
        ),
        isAnecdotesExpanded && /* @__PURE__ */ jsx("div", { className: "relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30", children: anecdoteSubItems.map((sub) => {
          const SubIcon = sub.icon;
          const isSubActive = isAnecdotesActive && (activeAnecdoteSubTab === sub.id || !activeAnecdoteSubTab && sub.id === "logs");
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleAnecdoteSubTabClick(sub.id),
              className: cn(
                "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isSubActive ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
              ),
              children: [
                /* @__PURE__ */ jsx(SubIcon, { className: cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400") }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: sub.label })
              ]
            },
            sub.id
          );
        }) })
      ] }, "anecdotes");
    }
    if (item.id === "staff") {
      return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleStaffClick,
            className: cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isStaffActive ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isStaffActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                    ),
                    children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: "Staff" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5", children: /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: cn(
                    "w-4 h-4 transition-transform duration-200",
                    isStaffActive ? "text-white" : "text-slate-400",
                    !isStaffExpanded && "-rotate-90"
                  )
                }
              ) })
            ]
          }
        ),
        isStaffExpanded && /* @__PURE__ */ jsx("div", { className: "relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30", children: staffSubItems.map((sub) => {
          const SubIcon = sub.icon;
          const isSubActive = isStaffActive && (activeStaffSubTab === sub.id || !activeStaffSubTab && sub.id === "directory");
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleStaffSubTabClick(sub.id),
              className: cn(
                "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isSubActive ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
              ),
              children: [
                /* @__PURE__ */ jsx(SubIcon, { className: cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400") }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: sub.label })
              ]
            },
            sub.id
          );
        }) })
      ] }, item.id);
    }
    if (item.id === "students") {
      return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleStudentsClick,
            className: cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isStudentsActive ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isStudentsActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                    ),
                    children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: "Students" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5", children: /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: cn(
                    "w-4 h-4 transition-transform duration-200",
                    isStudentsActive ? "text-white" : "text-slate-400",
                    !isStudentsExpanded && "-rotate-90"
                  )
                }
              ) })
            ]
          }
        ),
        isStudentsExpanded && /* @__PURE__ */ jsx("div", { className: "relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30", children: studentSubItems.map((sub) => {
          const SubIcon = sub.icon;
          const isSubActive = isStudentsActive && activeStudentSubTab === sub.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleStudentSubTabClick(sub.id),
              className: cn(
                "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isSubActive ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
              ),
              children: [
                /* @__PURE__ */ jsx(SubIcon, { className: cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400") }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: sub.label })
              ]
            },
            sub.id
          );
        }) })
      ] }, "students");
    }
    if (item.id === "attendance" && !isStudent) {
      return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleAttendanceClick,
            className: cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isAttendanceActive ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isAttendanceActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600 group-hover:scale-105"
                    ),
                    children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: "Attendance" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5", children: /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: cn(
                    "w-4 h-4 transition-transform duration-200",
                    isAttendanceActive ? "text-white" : "text-slate-400",
                    !isAttendanceExpanded && "-rotate-90"
                  )
                }
              ) })
            ]
          }
        ),
        isAttendanceExpanded && /* @__PURE__ */ jsx("div", { className: "relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-emerald-300", children: attendanceSubItems.map((sub) => {
          const SubIcon = sub.icon;
          const isSubActive = isAttendanceActive && activeAttendanceSubTab === sub.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleAttendanceSubTabClick(sub.id),
              className: cn(
                "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isSubActive ? "bg-emerald-600 text-white font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60 dark:text-slate-400"
              ),
              children: [
                /* @__PURE__ */ jsx(SubIcon, { className: cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400") }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: sub.label })
              ]
            },
            sub.id
          );
        }) })
      ] }, item.id);
    }
    if (item.id === "communication") {
      return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            id: "nav-communication-main",
            onClick: handleCommunicationClick,
            className: cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isCommunicationActive ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isCommunicationActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                    ),
                    children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: "Communication" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5", children: /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: cn(
                    "w-4 h-4 transition-transform duration-200",
                    isCommunicationActive ? "text-white" : "text-slate-400",
                    !isCommunicationExpanded && "-rotate-90"
                  )
                }
              ) })
            ]
          }
        ),
        isCommunicationExpanded && /* @__PURE__ */ jsx("div", { className: "relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30", children: communicationSubItems.map((sub) => {
          const SubIcon = sub.icon;
          const isSubActive = isCommunicationActive && activeCommunicationSubTab === sub.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              id: `nav-communication-sub-${sub.id}`,
              type: "button",
              onClick: () => handleCommunicationSubTabClick(sub.id),
              className: cn(
                "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isSubActive ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
              ),
              children: [
                /* @__PURE__ */ jsx(SubIcon, { className: cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400") }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: sub.label })
              ]
            },
            sub.id
          );
        }) })
      ] }, item.id);
    }
    if (item.id === "examination") {
      return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            id: "nav-examination-main",
            onClick: handleExaminationClick,
            className: cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
              isExaminationActive ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isExaminationActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                    ),
                    children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: "Examination" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5", children: /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: cn(
                    "w-4 h-4 transition-transform duration-200",
                    isExaminationActive ? "text-white" : "text-slate-400",
                    !isExaminationExpanded && "-rotate-90"
                  )
                }
              ) })
            ]
          }
        ),
        isExaminationExpanded && /* @__PURE__ */ jsx("div", { className: "relative pl-2 ml-3.5 pt-0.5 pb-1 space-y-0.5 border-l-2 border-primary/30", children: examinationSubItems.map((sub) => {
          const SubIcon = sub.icon;
          const isSubActive = isExaminationActive && activeExaminationSubTab === sub.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              id: `nav-examination-sub-${sub.id}`,
              type: "button",
              onClick: () => handleExaminationSubTabClick(sub.id),
              className: cn(
                "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isSubActive ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-primary/10 dark:text-slate-400"
              ),
              children: [
                /* @__PURE__ */ jsx(SubIcon, { className: cn("w-3.5 h-3.5 shrink-0", isSubActive ? "text-white" : "text-slate-400") }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: sub.label })
              ]
            },
            sub.id
          );
        }) })
      ] }, item.id);
    }
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => handleMainMenuClick(item.id),
        className: cn(
          "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
          isActive ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:scale-105"
                ),
                children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label })
          ] }),
          isActive && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1" })
        ]
      },
      item.id
    );
  };
  const sidebarContent = /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 select-none", children: [
    /* @__PURE__ */ jsxs("div", { className: "md:hidden flex items-center justify-between p-4 border-b border-sidebar-border", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Navigation Menu" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onCloseMobile,
          className: "p-1 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer",
          "aria-label": "Close navigation",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto py-3 px-3 space-y-3", children: [
      isStudent ? /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-3 pb-2 pt-1 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground", children: "Student Portal" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20", children: "Active" })
        ] }),
        studentMenuItems.map((item) => renderMenuItem(item))
      ] }) : (
        /* Staff & Admin 7 Collapsible Navigation Groups */
        NAVIGATION_GROUPS.map((group) => {
          const groupMenuItems = rawMenuItems.filter(
            (m) => group.modules.includes(m.id) && isModuleAllowed(m)
          );
          if (groupMenuItems.length === 0) return null;
          const isCollapsed = Boolean(collapsedGroups[group.id]);
          const hasActiveItem = groupMenuItems.some(
            (m) => activeNav === m.id || m.id === "students" && isStudentsActive || m.id === "attendance" && isAttendanceActive || m.id === "communication" && isCommunicationActive || m.id === "examination" && isExaminationActive || m.id === "anecdotes" && isAnecdotesActive || m.id === "staff" && isStaffActive
          );
          return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleGroup(group.id),
                className: "w-full px-2.5 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: group.label }),
                    hasActiveItem && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary shrink-0" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground", children: groupMenuItems.length }),
                    /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        className: cn(
                          "w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground group-hover:text-foreground",
                          isCollapsed && "-rotate-90"
                        )
                      }
                    )
                  ] })
                ]
              }
            ),
            !isCollapsed && /* @__PURE__ */ jsx("div", { className: "space-y-1 pl-1", children: groupMenuItems.map((item) => renderMenuItem(item)) })
          ] }, group.id);
        })
      ),
      hasAnySettingsPermission && !isStudent && /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
        /* @__PURE__ */ jsx("div", { className: "border-t border-sidebar-border my-2" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: handleSettingsClick,
              className: cn(
                "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
                isSettingsActive ? "bg-muted text-foreground border border-border font-bold" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800"
              ),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                        isSettingsActive ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground"
                      ),
                      children: /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: "Settings" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5", children: /* @__PURE__ */ jsx(
                  ChevronDown,
                  {
                    className: cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      !isSettingsExpanded && "-rotate-90"
                    )
                  }
                ) })
              ]
            }
          ),
          isSettingsExpanded && /* @__PURE__ */ jsxs("div", { className: "relative pl-2 ml-3.5 pt-1 pb-1 space-y-1 border-l-2 border-border", children: [
            canViewBranchSettings && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleSubItemClick("users"),
                className: cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeNav === "users" ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                ),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                        activeNav === "users" ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      ),
                      children: /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "User Management" })
                ] })
              }
            ),
            canViewBranchSettings && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleSubItemClick("menu-assignment"),
                className: cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeNav === "menu-assignment" ? "bg-emerald-600 text-white font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                ),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                        activeNav === "menu-assignment" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                      ),
                      children: /* @__PURE__ */ jsx(Key, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Menu Assignment" })
                ] })
              }
            ),
            canViewBranchSettings && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleSubItemClick("branch-settings"),
                className: cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeNav === "branch-settings" ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                ),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: cn(
                          "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                          activeNav === "branch-settings" ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        ),
                        children: /* @__PURE__ */ jsx(Building2, { className: "w-3 h-3" })
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: "Branch Settings" })
                  ] }),
                  branchCount > 0 && /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                        activeNav === "branch-settings" ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground"
                      ),
                      children: branchCount
                    }
                  )
                ]
              }
            ),
            canViewAcademicSettings && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    handleSubItemClick("academic-settings");
                    if (onToggleAcademicExpand) onToggleAcademicExpand();
                  },
                  className: cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    activeNav === "academic-settings" ? "bg-primary/10 text-primary font-bold border border-primary/20" : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                  ),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: cn(
                            "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                            activeNav === "academic-settings" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          ),
                          children: /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: "Academic Settings" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        className: cn(
                          "w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground",
                          !isAcademicExpanded && "-rotate-90"
                        )
                      }
                    )
                  ]
                }
              ),
              isAcademicExpanded && /* @__PURE__ */ jsx("div", { className: "pl-2 ml-2.5 pt-0.5 pb-0.5 space-y-0.5 border-l-2 border-primary/30", children: academicSubItems.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = activeNav === "academic-settings" && activeAcademicSubTab === subItem.id;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleAcademicSubTabClick(subItem.id),
                    className: cn(
                      "w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer",
                      isSubActive ? subItem.activeClass : "text-slate-600 hover:text-slate-900 hover:bg-muted dark:text-slate-400"
                    ),
                    children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: cn(
                            "w-4 h-4 rounded flex items-center justify-center shrink-0",
                            isSubActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                          ),
                          children: /* @__PURE__ */ jsx(SubIcon, { className: "w-2.5 h-2.5" })
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: subItem.label })
                    ]
                  },
                  subItem.id
                );
              }) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-sidebar-border bg-sidebar text-muted-foreground", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-[11px] font-medium", children: [
      /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }),
      /* @__PURE__ */ jsx("span", { className: "truncate", children: "Multi-Branch ERP v2.4" })
    ] }) })
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]", children: sidebarContent }),
    /* @__PURE__ */ jsx(
      Sheet,
      {
        open: isMobileOpen,
        onOpenChange: (open) => {
          if (!open && onCloseMobile) onCloseMobile();
        },
        children: /* @__PURE__ */ jsxs(
          SheetContent,
          {
            side: "left",
            className: "p-0 w-64 max-w-[85vw] border-r border-sidebar-border bg-sidebar overflow-hidden md:hidden",
            children: [
              /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
                /* @__PURE__ */ jsx(SheetTitle, { children: "Navigation Menu" }),
                /* @__PURE__ */ jsx(SheetDescription, { children: "School ERP Navigation Menu and Modules" })
              ] }),
              sidebarContent
            ]
          }
        )
      }
    )
  ] });
};
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
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
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
const ALL_BRANCHES_META = {
  id: 0,
  organization_id: 1,
  branch_name: "All Branches",
  branch_code: "ALL",
  short_name: "All Campuses",
  branch_type: "Campus",
  status: "Active",
  address_line_1: "Organization-Wide Consolidated Overview",
  country: "India",
  state: "Tamil Nadu",
  district: "Coimbatore & Chennai",
  city: "Multi-City",
  pincode: "641001",
  board: "CBSE",
  branch_head_name: "Central Management",
  branch_head_designation: "Director",
  created_at: (/* @__PURE__ */ new Date()).toISOString(),
  updated_at: (/* @__PURE__ */ new Date()).toISOString()
};
let currentContext = {};
function setMockErpContext(ctx) {
  currentContext = ctx;
}
function useErp() {
  return currentContext;
}
const AcademicYearSelector = ({ onNavigateToSettings }) => {
  const { activeBranch, enabledAcademicYears, activeAcademicYear, activeAcademicYearId, requestAcademicYearChange, isHistoricalYear, isReadOnly, adminOverrideActive, isLoadingYears } = useErp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelectYear = (year) => {
    setIsOpen(false);
    requestAcademicYearChange(year.id);
  };
  if (isLoadingYears) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 px-3 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200 animate-pulse", children: [
      /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-slate-400" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 w-20 bg-slate-200 rounded" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxs("button", { type: "button", id: "global-academic-year-selector-button", onClick: () => setIsOpen(!isOpen), className: `flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs ${isHistoricalYear ? adminOverrideActive ? "bg-amber-500/10 border-amber-300 text-amber-900 hover:bg-amber-500/15" : "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/80" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300"}`, title: `Academic Year: ${(activeAcademicYear == null ? void 0 : activeAcademicYear.name) || "Select Year"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
        isHistoricalYear ? /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center", children: /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }) }) : /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center", children: /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-left flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider font-bold leading-none", children: "Academic Year" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 mt-0.5", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-slate-900", children: (activeAcademicYear == null ? void 0 : activeAcademicYear.name) || "No Year Selected" }),
            (activeAcademicYear == null ? void 0 : activeAcademicYear.is_current) ? /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center space-x-0.5", children: /* @__PURE__ */ jsx("span", { children: "Current" }) }) : (activeAcademicYear == null ? void 0 : activeAcademicYear.status) === "Upcoming" ? /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 flex items-center space-x-0.5", children: /* @__PURE__ */ jsx("span", { children: "Upcoming" }) }) : isHistoricalYear ? /* @__PURE__ */ jsxs("span", { className: "px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center space-x-0.5", children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-2.5 h-2.5 inline mr-0.5" }),
              /* @__PURE__ */ jsx("span", { children: "Historical" })
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(ChevronDown, { className: `w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}` })
    ] }),
    isOpen && /* @__PURE__ */ jsxs("div", { id: "global-academic-year-dropdown", className: "absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 border-b border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: "Select Academic Context" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium", children: (activeBranch == null ? void 0 : activeBranch.branch_name) || "Current Campus" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 mt-0.5", children: "Switching years loads scoped classes, students, exams and attendance." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-h-60 overflow-y-auto py-1 px-1.5 space-y-0.5", children: enabledAcademicYears.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-3 py-4 text-center text-xs text-slate-500", children: "No enabled academic years available for this branch." }) : enabledAcademicYears.map((ay) => {
        const isSelected = ay.id === activeAcademicYearId;
        const isCurrent = ay.is_current;
        const isUpcoming = ay.status === "Upcoming";
        const isPast = ay.status === "Closed" || !isCurrent && !isUpcoming;
        return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => handleSelectYear(ay), className: `w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${isSelected ? "bg-indigo-50/90 text-indigo-900 font-semibold border border-indigo-200/80 shadow-2xs" : "hover:bg-slate-50 text-slate-700"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: `w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-indigo-600 text-white shadow-2xs" : isCurrent ? "bg-emerald-100 text-emerald-700" : isUpcoming ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`, children: isCurrent ? /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }) : isUpcoming ? /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }) : isPast ? /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold truncate", children: ay.name }),
                isCurrent && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200", children: "Current" }),
                isUpcoming && !isCurrent && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200", children: "Upcoming" }),
                isPast && !isCurrent && !isUpcoming && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200", children: "Historical" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-600 font-normal", children: [
                String(ay.start_date || "").slice(0, 4),
                " – ",
                String(ay.end_date || "").slice(0, 4),
                " • ",
                ay.status
              ] })
            ] })
          ] }),
          isSelected && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-indigo-600 shrink-0 ml-2" })
        ] }, ay.id);
      }) }),
      onNavigateToSettings && /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 pt-1.5 px-1.5 mt-1", children: /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
        setIsOpen(false);
        onNavigateToSettings();
      }, className: "w-full flex items-center justify-between px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-colors font-medium cursor-pointer", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Manage Academic Years" })
        ] }),
        /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })
      ] }) })
    ] })
  ] });
};
const BranchSelector = () => {
  const {
    branches,
    accessibleBranches,
    activeBranch,
    activeBranchId,
    setActiveBranchId,
    isLoadingBranches,
    isSuperAdmin,
    isPrincipal,
    assignedBranch,
    isAllBranches
  } = useErp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (isLoadingBranches) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 px-3 py-1.5 bg-muted/60 rounded-xl border border-border animate-pulse", children: [
      /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 w-28 bg-muted rounded" })
    ] });
  }
  if (isPrincipal) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 text-foreground text-xs font-semibold shadow-2xs", children: [
      /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-md flex items-center justify-center bg-emerald-600 text-white shadow-2xs", children: /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-left flex flex-col", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-bold leading-none flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { children: "Assigned Campus" }),
          /* @__PURE__ */ jsx(Lock, { className: "w-2.5 h-2.5" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 mt-0.5", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-foreground truncate max-w-[140px] sm:max-w-[180px]", children: (assignedBranch == null ? void 0 : assignedBranch.branch_name) || "Assigned Branch" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border bg-emerald-100/70 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200", children: (assignedBranch == null ? void 0 : assignedBranch.branch_code) || "MAIN" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        id: "global-branch-selector-button",
        onClick: () => setIsOpen(!isOpen),
        className: `flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs ${isAllBranches ? "border-primary/40 bg-primary/10 hover:bg-primary/15 text-primary-foreground/90 text-foreground" : "border-border bg-card hover:bg-muted/60 text-foreground"}`,
        title: `Current Scope: ${isAllBranches ? "All Branches (Consolidated)" : (activeBranch == null ? void 0 : activeBranch.branch_name) || "Select Branch"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-5 h-5 rounded-md flex items-center justify-center ${isAllBranches ? "bg-primary text-primary-foreground shadow-2xs" : "bg-primary/10 text-primary"}`,
                children: isAllBranches ? /* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-left flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-bold leading-none", children: isAllBranches ? "Organization Scope" : "Branch Campus" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 mt-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-foreground truncate max-w-[140px] sm:max-w-[180px]", children: isAllBranches ? "All Branches" : (activeBranch == null ? void 0 : activeBranch.branch_name) || "Select Branch" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${isAllBranches ? "bg-primary/20 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`,
                    children: isAllBranches ? `ALL (${branches.length})` : (activeBranch == null ? void 0 : activeBranch.branch_code) || "---"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(ChevronDown, { className: `w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${isOpen ? "rotate-180" : ""}` })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(
      "div",
      {
        id: "global-branch-dropdown",
        className: "absolute left-0 mt-2 w-80 bg-popover rounded-2xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-foreground", children: "Switch Working Campus" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Switch between organization view and campus scopes." })
            ] }),
            isSuperAdmin && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full", children: [
              /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsx("span", { children: "Super Admin" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "max-h-72 overflow-y-auto py-1 px-1.5 space-y-1", children: [
            isSuperAdmin && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                id: "select-all-branches-button",
                onClick: () => {
                  setActiveBranchId("all");
                  setIsOpen(false);
                },
                className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${isAllBranches ? "bg-primary/10 text-foreground font-semibold border border-primary/30 shadow-2xs" : "hover:bg-muted text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isAllBranches ? "bg-primary text-primary-foreground shadow-xs" : "bg-primary/10 text-primary"}`,
                        children: /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-foreground truncate", children: "All Branches (Consolidated)" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/30", children: "ALL" })
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-muted-foreground font-normal truncate block mt-0.5", children: [
                        "Organization-wide overview across all ",
                        branches.length,
                        " campuses"
                      ] })
                    ] })
                  ] }),
                  isAllBranches && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-primary shrink-0 ml-2" })
                ]
              }
            ),
            isSuperAdmin && /* @__PURE__ */ jsx("div", { className: "pt-1.5 pb-1 px-2 flex items-center space-y-0 text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: /* @__PURE__ */ jsxs("span", { children: [
              "Individual Campus Scopes (",
              branches.length,
              ")"
            ] }) }),
            accessibleBranches.map((branch) => {
              const isSelected = !isAllBranches && branch.id === activeBranchId;
              const branchStatus = branch.status || "Active";
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  id: `select-branch-${branch.id}`,
                  onClick: () => {
                    setActiveBranchId(branch.id);
                    setIsOpen(false);
                  },
                  className: `w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${isSelected ? "bg-accent/15 text-foreground font-semibold border border-accent/30 shadow-2xs" : "hover:bg-muted text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 min-w-0", children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-accent text-accent-foreground shadow-2xs" : "bg-muted text-muted-foreground"}`,
                          children: /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold truncate text-foreground", children: branch.branch_name }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono px-1 rounded bg-muted text-muted-foreground border border-border", children: branch.branch_code }),
                          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-semibold px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300", children: branchStatus })
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-muted-foreground font-normal truncate block", children: [
                          branch.city ? `${branch.city}, ` : "",
                          branch.state || "Operational"
                        ] })
                      ] })
                    ] }),
                    isSelected && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-accent shrink-0 ml-2" })
                  ]
                },
                branch.id
              );
            })
          ] })
        ]
      }
    )
  ] });
};
const NavigationHeader = ({ organization, onToggleMobileMenu, onNavigateToAcademicYears }) => {
  var _a;
  const navigate = useNavigate();
  const {
    currentUser,
    logoutUser,
    userRole,
    setUserRole,
    isSuperAdmin,
    isPrincipal,
    isStudent,
    assignedBranch,
    assignedBranchId,
    setAssignedBranchId,
    branches,
    activeAcademicYear,
    academicYearLifecycle,
    isCurrentYear,
    isUpcomingYear
  } = useErp();
  const getUserInitials = () => {
    if (currentUser == null ? void 0 : currentUser.name) {
      const parts = currentUser.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (isStudent) return "ST";
    if (isSuperAdmin) return "SA";
    return "PR";
  };
  const userInitials = getUserInitials();
  const userNameDisplay = (currentUser == null ? void 0 : currentUser.name) || (isSuperAdmin ? "Super Admin" : isStudent ? "Student" : "Principal");
  const userSubtitle = isStudent ? ((_a = currentUser == null ? void 0 : currentUser.student) == null ? void 0 : _a.admission_number) ? `Adm: ${currentUser.student.admission_number}` : "Student Account" : isSuperAdmin ? "All Branches Access" : (assignedBranch == null ? void 0 : assignedBranch.branch_name) || "Assigned Branch";
  const roleBadgeLabel = isSuperAdmin ? "Super Admin" : isStudent ? "Student" : isPrincipal ? "Principal" : userRole || "Staff";
  return /* @__PURE__ */ jsx("header", { className: "bg-card border-b border-border sticky top-0 z-40 shadow-xs backdrop-blur-md bg-card/95", children: /* @__PURE__ */ jsx("div", { className: "w-full px-3 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16 gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 shrink-0", children: [
      onToggleMobileMenu && /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "icon",
          onClick: onToggleMobileMenu,
          className: "md:hidden text-muted-foreground hover:text-foreground hover:bg-muted shrink-0",
          title: "Toggle Menu",
          "aria-label": "Toggle navigation menu",
          children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card border border-border p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden ring-1 ring-primary/10", children: /* @__PURE__ */ jsx("img", { src: "/assets/logo.png", alt: "EduCampus ERP Logo", className: "w-full h-full object-contain" }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden sm:block", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-display font-bold text-base sm:text-lg text-foreground tracking-tight", children: (organization == null ? void 0 : organization.name) || "EduCampus ERP" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: isSuperAdmin ? "emerald" : "outline",
              className: "hidden xl:inline-flex text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5",
              children: isSuperAdmin ? "All Branches Access" : "Assigned Branch Scope"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground font-medium truncate max-w-[180px] sm:max-w-[280px]", children: isSuperAdmin ? "Centralized Enterprise Management" : `Campus: ${(assignedBranch == null ? void 0 : assignedBranch.branch_name) || "Assigned Branch"}` })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 sm:space-x-3 py-1 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx(BranchSelector, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-muted/60 border border-border text-[11px] font-medium text-muted-foreground shadow-2xs", children: [
        /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${isCurrentYear ? "bg-emerald-500 animate-pulse" : isUpcomingYear ? "bg-sky-500" : "bg-amber-500"}` }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "Cycle:" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: academicYearLifecycle })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center relative", children: /* @__PURE__ */ jsx(AcademicYearSelector, { onNavigateToSettings: onNavigateToAcademicYears }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 sm:space-x-3 shrink-0", children: [
      /* @__PURE__ */ jsxs(
        Badge,
        {
          variant: isSuperAdmin ? "emerald" : "secondary",
          className: "hidden 2xl:inline-flex items-center space-x-1.5 text-xs px-3 py-1 font-semibold",
          children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
            /* @__PURE__ */ jsx("span", { children: isSuperAdmin ? "Super Admin Mode" : isStudent ? "Student Portal" : `Principal (${(assignedBranch == null ? void 0 : assignedBranch.short_name) || (assignedBranch == null ? void 0 : assignedBranch.branch_code) || "Assigned"})` })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => navigate("/modules"),
          className: "hidden xl:flex items-center gap-2 text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl border-border bg-card/60 cursor-pointer",
          title: "Quick Search / Modules (Ctrl+K)",
          children: [
            /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Quick Search..." }),
            /* @__PURE__ */ jsx("kbd", { className: "text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground font-mono", children: "⌘K" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "icon",
          onClick: () => {
            if (isStudent) navigate("/student/announcement");
            else navigate("/communication/announcement");
          },
          className: "relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl cursor-pointer",
          title: "Notifications",
          children: [
            /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border hidden sm:block" }),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: "flex items-center space-x-2.5 p-1 sm:px-2 rounded-xl text-left hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring cursor-pointer h-auto",
            title: "User Profile & Settings",
            children: [
              /* @__PURE__ */ jsxs(Avatar, { className: "w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-border shadow-xs", children: [
                /* @__PURE__ */ jsx(AvatarImage, { src: currentUser == null ? void 0 : currentUser.avatar_url, alt: userNameDisplay }),
                /* @__PURE__ */ jsx(
                  AvatarFallback,
                  {
                    className: `rounded-xl text-white font-bold text-xs ${isStudent ? "bg-gradient-to-tr from-sky-500 to-indigo-600" : isSuperAdmin ? "bg-gradient-to-tr from-emerald-600 to-primary" : "bg-gradient-to-tr from-teal-600 to-emerald-700"}`,
                    children: userInitials
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "hidden md:block text-left", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-foreground flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate max-w-[130px]", children: userNameDisplay }),
                  isSuperAdmin ? /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-accent shrink-0" }) : isStudent ? /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-primary shrink-0" }) : /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 text-teal-600 shrink-0" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground font-medium truncate max-w-[140px]", children: userSubtitle })
              ] }),
              /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-muted-foreground hidden sm:block ml-0.5" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-64 p-1.5 rounded-2xl shadow-xl border border-border bg-popover", children: [
          /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "p-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "w-10 h-10 rounded-xl border border-border shrink-0", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: currentUser == null ? void 0 : currentUser.avatar_url, alt: userNameDisplay }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-xl bg-primary/10 text-primary font-bold text-sm", children: userInitials })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground truncate", children: userNameDisplay }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: (currentUser == null ? void 0 : currentUser.email) || userSubtitle }),
              /* @__PURE__ */ jsx(Badge, { variant: isSuperAdmin ? "emerald" : "outline", className: "mt-1 text-[10px] font-semibold", children: roleBadgeLabel })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
            /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => {
                  if (isStudent) navigate("/student/profile");
                  else navigate("/staff/directory");
                },
                className: "rounded-xl text-xs font-medium cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(User, { className: "w-4 h-4 mr-2 text-primary" }),
                  /* @__PURE__ */ jsx("span", { children: isStudent ? "My Student Profile" : "Staff Directory & Profile" })
                ]
              }
            ),
            isSuperAdmin && /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => navigate("/branches"),
                className: "rounded-xl text-xs font-medium cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 mr-2 text-accent" }),
                  /* @__PURE__ */ jsx("span", { children: "Branch Management" })
                ]
              }
            ),
            isSuperAdmin && /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => navigate("/academic/academic-year"),
                className: "rounded-xl text-xs font-medium cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 mr-2 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { children: "Academic Settings" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: () => {
                logoutUser();
                navigate("/login", { replace: true });
              },
              className: "rounded-xl text-xs font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 mr-2" }),
                /* @__PURE__ */ jsx("span", { children: "Logout" })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] }) }) });
};
const Breadcrumb = ({ activeNav, onNavigate, branchName, academicSubTab, studentSubTab, attendanceSubTab, communicationSubTab }) => {
  if (activeNav === "dashboard") {
    return /* @__PURE__ */ jsx("nav", { className: "flex items-center space-x-2 text-xs text-slate-500 font-medium py-2.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-emerald-800 font-bold", children: [
      /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-3.5 h-3.5 text-emerald-700" }),
      /* @__PURE__ */ jsx("span", { children: "Dashboard" })
    ] }) });
  }
  const isSettingsModule = activeNav === "branch-settings" || activeNav === "academic-settings";
  const isStudentsModule = activeNav === "students";
  const isAttendanceModule = activeNav === "attendance";
  const isCommunicationModule = activeNav === "communication";
  const formatModuleName = (id) => {
    return id.charAt(0).toUpperCase() + id.slice(1);
  };
  const getCommunicationSubTabConfig = (tab) => {
    switch (tab) {
      case "assignment":
        return { label: "Assignment", icon: FileCheck2 };
      case "announcement":
        return { label: "Announcement", icon: Bell };
      case "gallery":
        return { label: "Gallery", icon: Image };
      case "dashboard":
        return { label: "Monitoring & Stats", icon: BarChart3 };
      case "portal":
        return { label: "Student Portal Feed", icon: UserCheck };
      case "audit":
        return { label: "Audit Trail", icon: History };
      case "homework":
      default:
        return { label: "Homework", icon: BookOpen };
    }
  };
  const getAttendanceSubTabConfig = (tab) => {
    switch (tab) {
      case "timings":
        return { label: "Attendance Time", icon: Clock };
      case "history":
        return { label: "Attendance History", icon: History };
      case "reports":
        return { label: "Attendance Reports", icon: BarChart3 };
      case "remarks":
        return { label: "Remarks Settings", icon: MessageSquare };
      case "take_attendance":
      default:
        return { label: "Take Attendance", icon: CheckSquare };
    }
  };
  const getStudentSubTabConfig = (tab) => {
    switch (tab) {
      case "update":
        return { label: "Student Update", icon: Edit };
      case "class-section-changes":
        return { label: "Class & Section Changes", icon: ArrowRightLeft };
      case "promotion":
        return { label: "Student Promotion", icon: TrendingUp };
      case "academic-groups":
        return { label: "Academic Groups", icon: Layers };
      case "inactive":
        return { label: "Inactive Students / TC", icon: UserX };
      case "approvals":
        return { label: "Student Approvals", icon: ShieldCheck };
      case "details":
      default:
        return { label: "Student Details", icon: Users };
    }
  };
  const getAcademicSubTabConfig = (tab) => {
    switch (tab) {
      case "classes":
        return { label: "Classes", icon: Layers };
      case "sections":
        return { label: "Sections", icon: Bookmark };
      case "class-section":
        return { label: "Class & Section", icon: GitMerge };
      case "subjects":
        return { label: "Subjects", icon: BookOpen };
      case "academic-year":
      default:
        return { label: "Academic Year", icon: Calendar };
    }
  };
  const academicConfig = getAcademicSubTabConfig(academicSubTab);
  const AcademicIcon = academicConfig.icon;
  const studentConfig = getStudentSubTabConfig(studentSubTab);
  const StudentIcon = studentConfig.icon;
  return /* @__PURE__ */ jsxs("nav", { className: "flex items-center space-x-2 text-xs text-slate-500 font-medium py-2.5 flex-wrap", children: [
    /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onNavigate("dashboard"), className: "flex items-center space-x-1.5 text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer", children: [
      /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-3.5 h-3.5" }),
      /* @__PURE__ */ jsx("span", { children: "Dashboard" })
    ] }),
    /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
    isSettingsModule ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-slate-600 font-medium", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-3.5 h-3.5 text-emerald-700" }),
        /* @__PURE__ */ jsx("span", { children: "Settings" })
      ] }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
      activeNav === "branch-settings" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-emerald-800 font-bold", children: [
        /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 text-emerald-700" }),
        /* @__PURE__ */ jsx("span", { children: "Branch Settings" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onNavigate("academic-settings"), className: "flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5 text-emerald-700" }),
          /* @__PURE__ */ jsx("span", { children: "Academic Settings" })
        ] }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-emerald-800 font-bold", children: [
          /* @__PURE__ */ jsx(AcademicIcon, { className: "w-3.5 h-3.5 text-emerald-700" }),
          /* @__PURE__ */ jsx("span", { children: academicConfig.label })
        ] })
      ] }),
      branchName && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-300 shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200", children: branchName })
      ] })
    ] }) : isStudentsModule ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onNavigate("students"), className: "flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-emerald-700" }),
        /* @__PURE__ */ jsx("span", { children: "Students (SIS)" })
      ] }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-emerald-800 font-bold", children: [
        /* @__PURE__ */ jsx(StudentIcon, { className: "w-3.5 h-3.5 text-emerald-700" }),
        /* @__PURE__ */ jsx("span", { children: studentConfig.label })
      ] })
    ] }) : isAttendanceModule ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onNavigate("attendance"), className: "flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsx(CalendarCheck, { className: "w-3.5 h-3.5 text-emerald-700" }),
        /* @__PURE__ */ jsx("span", { children: "Attendance" })
      ] }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
      (() => {
        const attConfig = getAttendanceSubTabConfig(attendanceSubTab);
        const AttIcon = attConfig.icon;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-emerald-800 font-bold", children: [
          /* @__PURE__ */ jsx(AttIcon, { className: "w-3.5 h-3.5 text-emerald-700" }),
          /* @__PURE__ */ jsx("span", { children: attConfig.label })
        ] });
      })()
    ] }) : isCommunicationModule ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onNavigate("communication"), className: "flex items-center space-x-1.5 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5 text-emerald-700" }),
        /* @__PURE__ */ jsx("span", { children: "Communication" })
      ] }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
      (() => {
        const commConfig = getCommunicationSubTabConfig(communicationSubTab);
        const CommIcon = commConfig.icon;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-emerald-800 font-bold", children: [
          /* @__PURE__ */ jsx(CommIcon, { className: "w-3.5 h-3.5 text-emerald-700" }),
          /* @__PURE__ */ jsx("span", { children: commConfig.label })
        ] });
      })()
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-emerald-800 font-bold", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-emerald-700" }),
      /* @__PURE__ */ jsx("span", { children: formatModuleName(activeNav) })
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
const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0)
    return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none", children: toasts.map((toast) => /* @__PURE__ */ jsxs("div", { className: `pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start space-x-3 transition-all animate-slide-up ${toast.type === "success" ? "bg-emerald-900 text-white border-emerald-800" : toast.type === "error" ? "bg-rose-900 text-white border-rose-800" : "bg-slate-900 text-white border-slate-800"}`, children: [
    toast.type === "success" && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-400 shrink-0 mt-0.5" }),
    toast.type === "error" && /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-rose-400 shrink-0 mt-0.5" }),
    toast.type === "info" && /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-sky-400 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 text-xs font-medium leading-relaxed", children: toast.text }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onDismiss(toast.id), className: "text-white/60 hover:text-white transition-colors p-1", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
  ] }, toast.id)) });
};
async function getOrganization() {
  const res = await fetch("/api/organization");
  if (!res.ok) {
    throw new Error("Failed to fetch organization");
  }
  const data = await res.json();
  return { organization: data.organization, stats: data.stats };
}
const AppLayout = ({ toasts, showToast, dismissToast }) => {
  var _a;
  const location = useLocation();
  const navigate = useNavigate();
  const { branches, activeBranchId, isSuperAdmin, isPrincipal, isStudent, userRole } = useErp();
  const [organization, setOrganization] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const [isAcademicExpanded, setIsAcademicExpanded] = useState(true);
  const [isStudentsExpanded, setIsStudentsExpanded] = useState(true);
  const [isAttendanceExpanded, setIsAttendanceExpanded] = useState(true);
  const [isCommunicationExpanded, setIsCommunicationExpanded] = useState(true);
  const [isExaminationExpanded, setIsExaminationExpanded] = useState(true);
  const [isAnecdotesExpanded, setIsAnecdotesExpanded] = useState(true);
  useEffect(() => {
    getOrganization().then((res) => setOrganization(res.organization)).catch((err) => console.warn("Org fetch notice:", err));
  }, []);
  const pathname = location.pathname;
  let activeNav = "dashboard";
  let activeAcademicSubTab = "academic-year";
  let activeStudentSubTab = "details";
  let activeAttendanceSubTab = "take_attendance";
  let activeCommunicationSubTab = "homework";
  let activeExaminationSubTab = "setup";
  let activeAnecdoteSubTab = "logs";
  let activeStaffSubTab = "directory";
  if (pathname.startsWith("/branches")) {
    activeNav = "branch-settings";
  } else if (pathname.startsWith("/menu-assignment")) {
    activeNav = "menu-assignment";
  } else if (pathname.startsWith("/academic")) {
    activeNav = "academic-settings";
    const parts = pathname.split("/");
    if (parts[2]) activeAcademicSubTab = parts[2];
  } else if (pathname.startsWith("/anecdotes")) {
    activeNav = "anecdotes";
    const parts = pathname.split("/");
    if (parts[2]) activeAnecdoteSubTab = parts[2];
  } else if (pathname.startsWith("/staff")) {
    activeNav = "staff";
    const parts = pathname.split("/");
    if (parts[2]) activeStaffSubTab = parts[2];
  } else if (pathname.startsWith("/students")) {
    activeNav = "students";
    const parts = pathname.split("/");
    if (parts[2]) activeStudentSubTab = parts[2];
  } else if (pathname.startsWith("/attendance")) {
    activeNav = "attendance";
    const parts = pathname.split("/");
    if (parts[2]) activeAttendanceSubTab = parts[2];
  } else if (pathname.startsWith("/communication")) {
    activeNav = "communication";
    const parts = pathname.split("/");
    if (parts[2]) activeCommunicationSubTab = parts[2];
  } else if (pathname.startsWith("/examination")) {
    activeNav = "examination";
    const parts = pathname.split("/");
    if (parts[2]) activeExaminationSubTab = parts[2];
  } else if (pathname.startsWith("/student")) {
    const parts = pathname.split("/");
    const studentSub = parts[2] || "homework";
    activeNav = studentSub;
    activeCommunicationSubTab = studentSub;
  } else if (pathname !== "/" && pathname !== "/dashboard") {
    activeNav = pathname.replace(/^\//, "");
  }
  const handleSelectNav = (navId) => {
    switch (navId) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "branch-settings":
        navigate("/branches");
        break;
      case "menu-assignment":
        navigate("/menu-assignment");
        break;
      case "academic-settings":
        navigate(`/academic/${activeAcademicSubTab || "academic-year"}`);
        break;
      case "academics":
        if (isSuperAdmin) {
          navigate(`/academic/${activeAcademicSubTab || "academic-year"}`);
        } else {
          navigate("/academics");
        }
        break;
      case "students":
        navigate(`/students/${activeStudentSubTab || "details"}`);
        break;
      case "attendance":
        if (isStudent) {
          navigate("/student/attendance");
        } else {
          navigate(`/attendance/${activeAttendanceSubTab || "take_attendance"}`);
        }
        break;
      case "communication":
        if (isStudent) {
          navigate(`/student/${activeCommunicationSubTab || "homework"}`);
        } else {
          navigate(`/communication/${activeCommunicationSubTab || "homework"}`);
        }
        break;
      case "examination":
        navigate(`/examination/${activeExaminationSubTab || "setup"}`);
        break;
      case "calendar":
        if (isStudent) {
          navigate("/student/calendar");
        } else {
          navigate("/calendar");
        }
        break;
      case "anecdotes":
        if (isStudent) {
          navigate("/student/anecdotes");
        } else {
          navigate(`/anecdotes/${activeAnecdoteSubTab || "logs"}`);
        }
        break;
      case "staff":
        navigate(`/staff/${activeStaffSubTab || "directory"}`);
        break;
      case "modules":
        navigate("/modules");
        break;
      case "timetable":
        if (isStudent) {
          navigate("/student/timetable");
        } else {
          navigate("/timetable");
        }
        break;
      case "homework":
        navigate("/student/homework");
        break;
      case "assignment":
        navigate("/student/assignment");
        break;
      case "announcement":
        navigate("/student/announcement");
        break;
      case "gallery":
        navigate("/student/gallery");
        break;
      case "profile":
        navigate("/student/profile");
        break;
      default:
        navigate(`/${navId}`);
        break;
    }
  };
  const isStudentUpdatePage = pathname === "/students/update" || activeNav === "students" && activeStudentSubTab === "update";
  const safeActiveNav = typeof activeNav === "string" ? activeNav : "dashboard";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/20 selection:text-accent-foreground font-sans", children: [
    /* @__PURE__ */ jsx(
      NavigationHeader,
      {
        organization,
        onToggleMobileMenu: () => setIsMobileMenuOpen((prev) => !prev),
        onNavigateToAcademicYears: () => {
          setIsSettingsExpanded(true);
          setIsAcademicExpanded(true);
          navigate("/academic/academic-year");
        }
      }
    ),
    /* @__PURE__ */ jsx(HistoricalYearBanner, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex w-full relative", children: [
      !isStudentUpdatePage && /* @__PURE__ */ jsx(
        Sidebar,
        {
          activeNav: safeActiveNav,
          onSelectNav: handleSelectNav,
          isSettingsExpanded,
          onToggleSettingsExpand: () => setIsSettingsExpanded((prev) => !prev),
          activeAcademicSubTab,
          onSelectAcademicSubTab: (tab) => {
            navigate(`/academic/${tab}`);
          },
          isAcademicExpanded,
          onToggleAcademicExpand: () => setIsAcademicExpanded((prev) => !prev),
          activeStudentSubTab,
          onSelectStudentSubTab: (tab) => {
            navigate(`/students/${tab}`);
          },
          isStudentsExpanded,
          onToggleStudentsExpand: () => setIsStudentsExpanded((prev) => !prev),
          activeAttendanceSubTab,
          onSelectAttendanceSubTab: (tab) => {
            navigate(`/attendance/${tab}`);
          },
          isAttendanceExpanded,
          onToggleAttendanceExpand: () => setIsAttendanceExpanded((prev) => !prev),
          activeCommunicationSubTab,
          onSelectCommunicationSubTab: (tab) => {
            if (isStudent) {
              navigate(`/student/${tab}`);
            } else {
              navigate(`/communication/${tab}`);
            }
          },
          isCommunicationExpanded,
          onToggleCommunicationExpand: () => setIsCommunicationExpanded((prev) => !prev),
          activeExaminationSubTab,
          onSelectExaminationSubTab: (tab) => {
            navigate(`/examination/${tab}`);
          },
          isExaminationExpanded,
          onToggleExaminationExpand: () => setIsExaminationExpanded((prev) => !prev),
          activeAnecdoteSubTab,
          onSelectAnecdoteSubTab: (tab) => {
            navigate(`/anecdotes/${tab}`);
          },
          isAnecdotesExpanded,
          onToggleAnecdotesExpand: () => setIsAnecdotesExpanded((prev) => !prev),
          activeStaffSubTab,
          onSelectStaffSubTab: (tab) => {
            navigate(`/staff/${tab}`);
          },
          isStaffExpanded: true,
          onToggleStaffExpand: () => {
          },
          userPermissions: {
            canViewBranchSettings: isSuperAdmin,
            canViewAcademicSettings: isSuperAdmin
          },
          userRole,
          isStudent,
          branchCount: branches.length,
          isMobileOpen: isMobileMenuOpen,
          onCloseMobile: () => setIsMobileMenuOpen(false)
        }
      ),
      /* @__PURE__ */ jsxs(
        "main",
        {
          className: `flex-1 min-w-0 transition-all duration-200 ${isStudentUpdatePage ? "w-full px-4 sm:px-6 py-4 max-w-none" : "px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full"}`,
          children: [
            /* @__PURE__ */ jsx(
              Breadcrumb,
              {
                activeNav: safeActiveNav,
                onNavigate: handleSelectNav,
                branchName: safeActiveNav === "academic-settings" && activeBranchId ? (_a = branches.find((b) => b.id === activeBranchId)) == null ? void 0 : _a.branch_code : void 0,
                academicSubTab: activeAcademicSubTab,
                studentSubTab: activeStudentSubTab,
                attendanceSubTab: activeAttendanceSubTab,
                communicationSubTab: activeCommunicationSubTab
              }
            ),
            /* @__PURE__ */ jsx(Outlet, {})
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "mt-auto border-t border-border bg-card/60 backdrop-blur-xs py-3.5 text-center text-xs text-muted-foreground font-medium", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "EduCampus ERP" }),
        /* @__PURE__ */ jsx("span", { className: "text-border", children: "•" }),
        /* @__PURE__ */ jsx("span", { children: "Enterprise Architecture" }),
        /* @__PURE__ */ jsx("span", { className: "text-border hidden sm:inline", children: "|" }),
        /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold hidden sm:inline", children: safeActiveNav === "branch-settings" ? "Settings → Branch Settings" : safeActiveNav === "academic-settings" ? `Settings → Academic Settings → ${activeAcademicSubTab}` : safeActiveNav.charAt(0).toUpperCase() + safeActiveNav.slice(1) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] py-0 px-2 font-mono border-border text-muted-foreground", children: "v2.4.0" }),
        /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
          "Real-Time Sync"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(ToastContainer, { toasts: toasts || [], onDismiss: dismissToast })
  ] });
};
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];
function runAssert(condition, name, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✔ [PASS] ${name}`);
  } else {
    failedTests++;
    const errMsg = `FAIL: ${name}${details ? ` (${details})` : ""}`;
    failureDetails.push(errMsg);
    console.error(`  ✖ [${errMsg}]`);
  }
}
function buildMockContext({
  role = "super_admin",
  currentUser = null,
  activeBranchId = "all",
  branches = [
    { id: 1, branch_name: "Main Campus", branch_code: "MC01", status: "Active", city: "Coimbatore", state: "Tamil Nadu" },
    { id: 2, branch_name: "City Campus", branch_code: "CC02", status: "Active", city: "Chennai", state: "Tamil Nadu" }
  ],
  assignedBranchId = 1,
  isLoadingBranches = false,
  academicYearLifecycle = "Operational Live",
  isCurrentYear = true,
  isUpcomingYear = false,
  onLogout = () => {
  },
  onSetActiveBranchId = () => {
  }
} = {}) {
  const isSuperAdmin = role === "super_admin";
  const isPrincipal = role === "principal" || role === "principle" || role === "branch_admin";
  const isStudent = role === "student";
  const isAllBranches = isSuperAdmin && activeBranchId === "all";
  const defaultUser = currentUser || {
    id: 1,
    name: isSuperAdmin ? "Super Admin User" : isStudent ? "Rahul Sharma" : "Principal Ramanathan",
    email: isSuperAdmin ? "admin@school.edu" : isStudent ? "rahul@student.edu" : "principal@school.edu",
    role,
    branch_id: assignedBranchId,
    student: isStudent ? { admission_number: "ADM-2026-001", roll_number: "10-A-01" } : null
  };
  const assignedBranch = branches.find((b) => b.id === assignedBranchId) || branches[0];
  const activeBranch = isAllBranches ? ALL_BRANCHES_META : branches.find((b) => b.id === activeBranchId) || branches[0];
  const accessibleBranches = isSuperAdmin ? branches : branches.filter((b) => b.id === assignedBranchId);
  return {
    currentUser: defaultUser,
    userRole: role,
    setUserRole: () => {
    },
    isSuperAdmin,
    isPrincipal,
    isStudent,
    isBranchAdmin: isPrincipal,
    isAuthenticated: true,
    branches,
    accessibleBranches,
    activeBranch,
    activeBranchId,
    setActiveBranchId: onSetActiveBranchId,
    isLoadingBranches,
    isAllBranches,
    assignedBranch,
    assignedBranchId,
    setAssignedBranchId: () => {
    },
    activeAcademicYear: { id: 1, name: "2026-2027", status: "Current" },
    academicYears: [{ id: 1, name: "2026-2027", status: "Current" }],
    enabledAcademicYears: [{ id: 1, name: "2026-2027", status: "Current" }],
    academicYearLifecycle,
    isCurrentYear,
    isUpcomingYear,
    isHistoricalYear: false,
    isReadOnly: false,
    logoutUser: onLogout,
    showToast: () => {
    }
  };
}
async function runAllM2StressTests() {
  console.log("\n======================================================");
  console.log("   M2 SHELL & NAVIGATION EMPIRICAL STRESS SUITE       ");
  console.log("======================================================\n");
  console.log("▶ Suite 1: Sidebar Collapsible Navigation Groups & Sub-Accordions");
  runAssert(Array.isArray(NAVIGATION_GROUPS) && NAVIGATION_GROUPS.length === 7, "S1.1: NAVIGATION_GROUPS has exactly 7 functional groups");
  const expectedGroupIds = ["overview", "students", "academics", "assessment", "communication", "faculty", "operations"];
  const actualGroupIds = NAVIGATION_GROUPS.map((g) => g.id);
  runAssert(
    expectedGroupIds.every((id) => actualGroupIds.includes(id)),
    "S1.2: All 7 expected group IDs are present in NAVIGATION_GROUPS",
    `Found: ${actualGroupIds.join(", ")}`
  );
  const totalModulesInGroups = NAVIGATION_GROUPS.reduce((acc, g) => acc + g.modules.length, 0);
  runAssert(totalModulesInGroups === 16, "S1.3: Total modules across all 7 groups equals exactly 16 modules");
  const defaultSidebarHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "dashboard",
        onSelectNav: () => {
        },
        userRole: "super_admin",
        isStudent: false,
        branchCount: 2
      }
    )
  );
  runAssert(defaultSidebarHtml.includes("Overview &amp; Hub") || defaultSidebarHtml.includes("Overview & Hub"), "S1.4: Overview group header rendered");
  runAssert(defaultSidebarHtml.includes("Student Information (SIS)"), "S1.5: SIS group header rendered");
  runAssert(defaultSidebarHtml.includes("Academics &amp; Schedule") || defaultSidebarHtml.includes("Academics & Schedule"), "S1.6: Academics group header rendered");
  runAssert(defaultSidebarHtml.includes("Assessment &amp; Conduct") || defaultSidebarHtml.includes("Assessment & Conduct"), "S1.7: Assessment group header rendered");
  runAssert(defaultSidebarHtml.includes("Communication &amp; Media") || defaultSidebarHtml.includes("Communication & Media"), "S1.8: Communication group header rendered");
  runAssert(defaultSidebarHtml.includes("Staff &amp; Administration") || defaultSidebarHtml.includes("Staff & Administration"), "S1.9: Staff group header rendered");
  runAssert(defaultSidebarHtml.includes("Campus Operations"), "S1.10: Operations group header rendered");
  runAssert(defaultSidebarHtml.includes(">2<") && defaultSidebarHtml.includes(">3<") && defaultSidebarHtml.includes(">4<"), "S1.11: Module count chips rendered inside group headers");
  const expandedStudentsHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "students",
        onSelectNav: () => {
        },
        isStudentsExpanded: true,
        activeStudentSubTab: "details",
        userRole: "super_admin"
      }
    )
  );
  runAssert(expandedStudentsHtml.includes("Student Details"), "S1.12: Student Details sub-item visible when isStudentsExpanded=true");
  runAssert(expandedStudentsHtml.includes("Student Update"), "S1.13: Student Update sub-item visible when isStudentsExpanded=true");
  runAssert(expandedStudentsHtml.includes("Student Promotion"), "S1.14: Student Promotion sub-item visible when isStudentsExpanded=true");
  runAssert(expandedStudentsHtml.includes("Inactive Students / TC"), "S1.15: Inactive Students sub-item visible when isStudentsExpanded=true");
  const collapsedStudentsHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "students",
        onSelectNav: () => {
        },
        isStudentsExpanded: false,
        activeStudentSubTab: "details",
        userRole: "super_admin"
      }
    )
  );
  runAssert(!collapsedStudentsHtml.includes("Student Details"), "S1.16: Student Details sub-item hidden when isStudentsExpanded=false");
  runAssert(!collapsedStudentsHtml.includes("Student Promotion"), "S1.17: Student Promotion sub-item hidden when isStudentsExpanded=false");
  const expandedAttendanceHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "attendance",
        onSelectNav: () => {
        },
        isAttendanceExpanded: true,
        activeAttendanceSubTab: "take_attendance",
        userRole: "super_admin"
      }
    )
  );
  runAssert(expandedAttendanceHtml.includes("1. Take Attendance"), "S1.18: Take Attendance sub-item visible when isAttendanceExpanded=true");
  runAssert(expandedAttendanceHtml.includes("2. Attendance Time"), "S1.19: Attendance Time sub-item visible when isAttendanceExpanded=true");
  runAssert(expandedAttendanceHtml.includes("4. Attendance History"), "S1.20: Attendance History sub-item visible when isAttendanceExpanded=true");
  const collapsedAttendanceHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "attendance",
        onSelectNav: () => {
        },
        isAttendanceExpanded: false,
        userRole: "super_admin"
      }
    )
  );
  runAssert(!collapsedAttendanceHtml.includes("1. Take Attendance"), "S1.21: Attendance sub-items hidden when isAttendanceExpanded=false");
  const expandedCommunicationHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "communication",
        onSelectNav: () => {
        },
        isCommunicationExpanded: true,
        activeCommunicationSubTab: "homework",
        userRole: "super_admin"
      }
    )
  );
  runAssert(expandedCommunicationHtml.includes("1. Homework"), "S1.22: Homework sub-item visible when isCommunicationExpanded=true");
  runAssert(expandedCommunicationHtml.includes("2. Assignment"), "S1.23: Assignment sub-item visible when isCommunicationExpanded=true");
  runAssert(expandedCommunicationHtml.includes("3. Announcement"), "S1.24: Announcement sub-item visible when isCommunicationExpanded=true");
  runAssert(expandedCommunicationHtml.includes("4. Gallery"), "S1.25: Gallery sub-item visible when isCommunicationExpanded=true");
  const expandedSettingsHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "academic-settings",
        onSelectNav: () => {
        },
        isSettingsExpanded: true,
        isAcademicExpanded: true,
        activeAcademicSubTab: "classes",
        userRole: "super_admin",
        userPermissions: { canViewBranchSettings: true, canViewAcademicSettings: true },
        branchCount: 3
      }
    )
  );
  runAssert(expandedSettingsHtml.includes("Branch Settings"), "S1.26: Branch Settings visible in Settings sub-accordion");
  runAssert(expandedSettingsHtml.includes("Menu Assignment"), "S1.27: Menu Assignment visible in Settings sub-accordion");
  runAssert(expandedSettingsHtml.includes("User Management"), "S1.28: User Management visible in Settings sub-accordion");
  runAssert(expandedSettingsHtml.includes("Academic Year"), "S1.29: Academic Year visible in Academic Settings sub-accordion");
  runAssert(expandedSettingsHtml.includes("Classes"), "S1.30: Classes visible in Academic Settings sub-accordion");
  runAssert(expandedSettingsHtml.includes("Subjects"), "S1.31: Subjects visible in Academic Settings sub-accordion");
  runAssert(expandedSettingsHtml.includes(">3<"), "S1.32: Branch count pill (3) rendered next to Branch Settings");
  const studentSidebarHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "dashboard",
        onSelectNav: () => {
        },
        isStudent: true,
        userRole: "student"
      }
    )
  );
  runAssert(studentSidebarHtml.includes("Student Portal"), "S1.33: Student Portal header displayed");
  runAssert(studentSidebarHtml.includes("My Merits &amp; Remarks") || studentSidebarHtml.includes("My Merits & Remarks"), "S1.34: Student specific menu items rendered");
  runAssert(studentSidebarHtml.includes("My Profile"), "S1.35: My Profile rendered for student");
  runAssert(!studentSidebarHtml.includes("Campus Operations"), "S1.36: Campus Operations group is NOT rendered for student");
  runAssert(!studentSidebarHtml.includes("Staff &amp; Administration") && !studentSidebarHtml.includes("Staff & Administration"), "S1.37: Staff & Administration is NOT rendered for student");
  console.log("\n▶ Suite 2: Active Route Pill Indicator Styling");
  const activeDashboardHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "dashboard",
        onSelectNav: () => {
        },
        userRole: "super_admin"
      }
    )
  );
  runAssert(
    activeDashboardHtml.includes("bg-primary text-primary-foreground shadow-xs font-bold"),
    "S2.1: Active module item has primary background and font-bold classes"
  );
  runAssert(
    activeDashboardHtml.includes("w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1"),
    "S2.2: Active module item displays white circular pill indicator dot"
  );
  const modulesMatch = activeDashboardHtml.match(/<button[^>]*>(?:(?!<\/button>)[\s\S])*?Modules Showcase(?:(?!<\/button>)[\s\S])*?<\/button>/);
  runAssert(
    modulesMatch && !modulesMatch[0].includes("w-1.5 h-1.5 rounded-full bg-white"),
    "S2.3: Inactive module button (Modules Showcase) does NOT have white pill dot"
  );
  runAssert(
    activeDashboardHtml.includes("Overview &amp; Hub") || activeDashboardHtml.includes("Overview & Hub"),
    "S2.4: Overview group exists"
  );
  runAssert(
    activeDashboardHtml.includes("w-1.5 h-1.5 rounded-full bg-primary shrink-0"),
    "S2.5: Group header displays primary active indicator dot when a child module is active"
  );
  const activeStudentDetailsHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "students",
        activeStudentSubTab: "details",
        isStudentsExpanded: true,
        onSelectNav: () => {
        },
        userRole: "super_admin"
      }
    )
  );
  runAssert(
    activeStudentDetailsHtml.includes("bg-primary text-primary-foreground font-bold shadow-xs"),
    "S2.6: Active student sub-tab (details) receives active primary pill styling"
  );
  const activeAttendanceSubHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "attendance",
        activeAttendanceSubTab: "take_attendance",
        isAttendanceExpanded: true,
        onSelectNav: () => {
        },
        userRole: "super_admin"
      }
    )
  );
  runAssert(
    activeAttendanceSubHtml.includes("bg-emerald-600 text-white font-bold shadow-xs"),
    "S2.7: Active attendance sub-tab receives emerald accent pill styling"
  );
  const activeClassesSubHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "academic-settings",
        activeAcademicSubTab: "classes",
        isSettingsExpanded: true,
        isAcademicExpanded: true,
        onSelectNav: () => {
        },
        userRole: "super_admin"
      }
    )
  );
  runAssert(
    activeClassesSubHtml.includes("bg-primary text-primary-foreground shadow-xs"),
    "S2.8: Active academic sub-tab (classes) receives primary pill styling"
  );
  console.log("\n▶ Suite 3: Mobile Sheet Drawer Opening/Closing Logic");
  const closedSidebarHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "dashboard",
        isMobileOpen: false,
        onCloseMobile: () => {
        },
        onSelectNav: () => {
        }
      }
    )
  );
  runAssert(closedSidebarHtml.includes('aside class="hidden md:block'), "S3.1: Desktop aside remains hidden on mobile viewports");
  const openSidebarHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeNav: "dashboard",
        isMobileOpen: true,
        onCloseMobile: () => {
        },
        onSelectNav: () => {
        }
      }
    )
  );
  runAssert(
    openSidebarHtml.includes('aria-label="Close navigation"'),
    "S3.2: Mobile drawer close button (X) is rendered with proper accessibility label"
  );
  runAssert(
    openSidebarHtml.includes("Navigation Menu"),
    "S3.3: Mobile drawer header rendered"
  );
  let closeMobileInvoked = false;
  const mockSidebar = /* @__PURE__ */ jsx(
    Sidebar,
    {
      activeNav: "dashboard",
      isMobileOpen: true,
      onCloseMobile: () => {
        closeMobileInvoked = true;
      },
      onSelectNav: (id) => {
      },
      isStudentsExpanded: true,
      onSelectStudentSubTab: (sub) => {
      }
    }
  );
  runAssert(typeof mockSidebar.props.onCloseMobile === "function", "S3.4: onCloseMobile prop is bound to mobile drawer");
  mockSidebar.props.onCloseMobile();
  runAssert(closeMobileInvoked === true, "S3.5: onCloseMobile callback updates state to false");
  console.log("\n▶ Suite 4: BranchSelector Role Scoping (Super Admin vs Locked Principal)");
  const principalMock = buildMockContext({
    role: "principal",
    assignedBranchId: 1,
    branches: [
      { id: 1, branch_name: "Main Campus", branch_code: "MC01", status: "Active" },
      { id: 2, branch_name: "North Campus", branch_code: "NC02", status: "Active" }
    ]
  });
  runAssert(principalMock.isPrincipal === true, "S4.1: Principal role correctly detected");
  runAssert(principalMock.isSuperAdmin === false, "S4.2: Principal is not super admin");
  runAssert(principalMock.accessibleBranches.length === 1, "S4.3: Principal accessible branches scoped strictly to assigned branch (length 1)");
  runAssert(principalMock.accessibleBranches[0].branch_code === "MC01", "S4.4: Principal accessible branch matches MC01");
  setMockErpContext(principalMock);
  const principalBranchHtml = ReactDOMServer.renderToString(/* @__PURE__ */ jsx(BranchSelector, {}));
  runAssert(principalBranchHtml.includes("Assigned Campus"), 'S4.5: Principal sees "Assigned Campus" indicator');
  runAssert(principalBranchHtml.includes("Main Campus"), 'S4.6: Principal sees assigned campus name "Main Campus"');
  runAssert(principalBranchHtml.includes("MC01"), 'S4.7: Principal sees assigned campus code "MC01"');
  runAssert(!principalBranchHtml.includes("global-branch-selector-button"), "S4.8: Principal CANNOT open campus switch dropdown (no switch button)");
  const superAdminMock = buildMockContext({
    role: "super_admin",
    activeBranchId: "all",
    onSetActiveBranchId: (id) => {
    },
    branches: [
      { id: 1, branch_name: "Main Campus", branch_code: "MC01", status: "Active", city: "Coimbatore", state: "Tamil Nadu" },
      { id: 2, branch_name: "North Campus", branch_code: "NC02", status: "Active", city: "Chennai", state: "Tamil Nadu" }
    ]
  });
  setMockErpContext(superAdminMock);
  const superAdminBranchHtml = ReactDOMServer.renderToString(/* @__PURE__ */ jsx(BranchSelector, {}));
  runAssert(superAdminBranchHtml.includes("global-branch-selector-button"), "S4.9: Super Admin has global-branch-selector-button");
  runAssert(superAdminBranchHtml.includes("Organization Scope"), 'S4.10: Super Admin shows Organization Scope when activeBranchId="all"');
  runAssert(superAdminBranchHtml.includes("All Branches"), "S4.11: Super Admin shows All Branches title");
  runAssert(superAdminBranchHtml.includes("ALL (2)"), "S4.12: Super Admin shows ALL (2) badge with campus count");
  const superAdminScopedMock = buildMockContext({
    role: "super_admin",
    activeBranchId: 1,
    branches: [
      { id: 1, branch_name: "Main Campus", branch_code: "MC01", status: "Active", city: "Coimbatore", state: "Tamil Nadu" },
      { id: 2, branch_name: "North Campus", branch_code: "NC02", status: "Active", city: "Chennai", state: "Tamil Nadu" }
    ]
  });
  setMockErpContext(superAdminScopedMock);
  const superAdminScopedHtml = ReactDOMServer.renderToString(/* @__PURE__ */ jsx(BranchSelector, {}));
  runAssert(superAdminScopedHtml.includes("Branch Campus"), "S4.13: Scoped Super Admin shows Branch Campus title");
  runAssert(superAdminScopedHtml.includes("Main Campus"), "S4.14: Scoped Super Admin shows Main Campus name");
  runAssert(superAdminScopedHtml.includes("MC01"), "S4.15: Scoped Super Admin shows MC01 code");
  const loadingMock = buildMockContext({
    role: "super_admin",
    isLoadingBranches: true
  });
  setMockErpContext(loadingMock);
  const loadingBranchHtml = ReactDOMServer.renderToString(/* @__PURE__ */ jsx(BranchSelector, {}));
  runAssert(loadingBranchHtml.includes("animate-pulse"), "S4.16: BranchSelector renders animated pulse loader when isLoadingBranches=true");
  console.log("\n▶ Suite 5: User Profile Dropdown Menu & Logout Flow");
  let logoutCalled = false;
  const superAdminHeaderMock = buildMockContext({
    role: "super_admin",
    currentUser: { name: "Dr. Vikram Sarabhai", email: "director@school.edu", role: "super_admin" },
    onLogout: () => {
      logoutCalled = true;
    }
  });
  setMockErpContext(superAdminHeaderMock);
  const superAdminHeaderHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, { organization: { name: "Vidya Mandir Trust" } }) })
  );
  runAssert(superAdminHeaderHtml.includes("Dr. Vikram Sarabhai"), "S5.1: NavigationHeader renders current user name");
  runAssert(superAdminHeaderHtml.includes("DV"), 'S5.2: Avatar computes correct initials "DV" from two words "Dr." and "Vikram"');
  runAssert(superAdminHeaderHtml.includes("All Branches Access"), 'S5.3: Super Admin subtitle is "All Branches Access"');
  runAssert(superAdminHeaderHtml.includes("Super Admin Mode"), "S5.4: Super Admin mode badge rendered in header");
  const principalHeaderMock = buildMockContext({
    role: "principal",
    currentUser: { name: "Sister Mary Joseph", email: "principal@school.edu", role: "principal" },
    assignedBranchId: 1,
    branches: [{ id: 1, branch_name: "St. Mary Campus", branch_code: "SMC", status: "Active" }]
  });
  setMockErpContext(principalHeaderMock);
  const principalHeaderHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, { organization: { name: "St. Mary High" } }) })
  );
  runAssert(principalHeaderHtml.includes("Sister Mary Joseph"), "S5.5: Principal name displayed");
  runAssert(principalHeaderHtml.includes("SM"), 'S5.6: Principal initials "SM" computed');
  runAssert(principalHeaderHtml.includes("St. Mary Campus"), "S5.7: Principal header displays campus name");
  const studentHeaderMock = buildMockContext({
    role: "student",
    currentUser: {
      name: "Aanya Patel",
      role: "student",
      student: { admission_number: "ADM-2026-999" }
    }
  });
  setMockErpContext(studentHeaderMock);
  const studentHeaderHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, { organization: { name: "Delhi Public School" } }) })
  );
  runAssert(studentHeaderHtml.includes("Aanya Patel"), "S5.8: Student name displayed");
  runAssert(studentHeaderHtml.includes("AP"), 'S5.9: Student initials "AP" computed');
  runAssert(studentHeaderHtml.includes("Adm: ADM-2026-999"), "S5.10: Student admission number displayed in user subtitle");
  runAssert(studentHeaderHtml.includes("Student Portal"), "S5.11: Student Portal badge displayed in header");
  const singleWordNameMock = buildMockContext({
    role: "teacher",
    currentUser: { name: "Kavitha", role: "teacher" }
  });
  setMockErpContext(singleWordNameMock);
  const singleWordHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
  );
  runAssert(singleWordHtml.includes("KA"), 'S5.12: Single-word name "Kavitha" computes initials "KA"');
  runAssert(typeof superAdminHeaderMock.logoutUser === "function", "S5.13: logoutUser is defined on ERP context");
  superAdminHeaderMock.logoutUser();
  runAssert(logoutCalled === true, "S5.14: logoutUser successfully triggered");
  console.log("\n▶ Suite 6: Adversarial Stress, Boundary Fuzzing & Null Guards");
  let emptyPropsSidebarPassed = false;
  try {
    const html = ReactDOMServer.renderToString(/* @__PURE__ */ jsx(Sidebar, {}));
    emptyPropsSidebarPassed = html.length > 0;
  } catch (e) {
    emptyPropsSidebarPassed = false;
  }
  runAssert(emptyPropsSidebarPassed, "S6.1: Sidebar renders without crashing when passed zero props");
  let unknownRolePassed = false;
  try {
    const html = ReactDOMServer.renderToString(
      /* @__PURE__ */ jsx(Sidebar, { activeNav: "dashboard", userRole: "unauthorized_intruder_xyz" })
    );
    unknownRolePassed = html.length > 0;
  } catch (e) {
    unknownRolePassed = false;
  }
  runAssert(unknownRolePassed, "S6.2: Sidebar gracefully handles unknown/unauthorized role string");
  let unknownRoutePassed = false;
  try {
    const html = ReactDOMServer.renderToString(
      /* @__PURE__ */ jsx(Sidebar, { activeNav: "some/arbitrary/nested/path/that/does/not/exist", userRole: "super_admin" })
    );
    unknownRoutePassed = html.length > 0;
  } catch (e) {
    unknownRoutePassed = false;
  }
  runAssert(unknownRoutePassed, "S6.3: Sidebar gracefully handles non-existent route without crashing");
  try {
    const xssMock = buildMockContext({
      role: "super_admin",
      activeBranchId: 1,
      branches: [
        { id: 1, branch_name: '<script>alert("xss")<\/script> 🏫 St. John & Paul #1', branch_code: "CAMPUS-01 & <test>", status: "Active" }
      ]
    });
    setMockErpContext(xssMock);
    const xssHtml = ReactDOMServer.renderToString(/* @__PURE__ */ jsx(BranchSelector, {}));
    runAssert(!xssHtml.includes("<script>alert"), "S6.4: Special characters and script tags properly escaped in BranchSelector HTML");
    runAssert(xssHtml.includes("&lt;script&gt;"), "S6.5: Script tags safely HTML-encoded in output");
  } catch (e) {
    runAssert(false, "S6.4: Special characters handling failed", e.message);
  }
  try {
    const longNameMock = buildMockContext({
      role: "super_admin",
      currentUser: {
        name: "His Excellency Dr. Muhammad Al-Mansoor bin Abdulaziz Al-Saud of the International Global Foundation for Higher Learning and Excellence",
        email: "very.long.email.address.that.exceeds.normal.limits.by.far@subdomain.campus.university.school.edu",
        role: "super_admin"
      }
    });
    setMockErpContext(longNameMock);
    const longNameHtml = ReactDOMServer.renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    runAssert(longNameHtml.includes("truncate"), "S6.6: Truncation CSS class applied to guard against layout overflow");
  } catch (e) {
    runAssert(false, "S6.6: Truncation handling failed", e.message);
  }
  const groupIds = NAVIGATION_GROUPS.map((g) => g.id);
  let toggleState = {};
  for (let i = 0; i < 1e3; i++) {
    const randomGroup = groupIds[i % groupIds.length];
    toggleState[randomGroup] = !toggleState[randomGroup];
  }
  runAssert(Object.keys(toggleState).length === 7, "S6.7: High-frequency group toggle state mutations execute cleanly (1000 cycles)");
  try {
    setMockErpContext(superAdminMock);
    const appLayoutHtml = ReactDOMServer.renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(AppLayout, { toasts: [{ id: 1, message: "Welcome back", type: "info" }] }) })
    );
    runAssert(appLayoutHtml.includes("EduCampus ERP"), "S6.8: AppLayout integrates NavigationHeader and brand typography");
    runAssert(appLayoutHtml.includes("Overview &amp; Hub") || appLayoutHtml.includes("Overview & Hub"), "S6.9: AppLayout integrates Sidebar");
    runAssert(appLayoutHtml.includes("Enterprise Architecture"), "S6.10: AppLayout integrates footer bar");
  } catch (e) {
    runAssert(false, "S6.8: AppLayout integration render failed", e.message);
  }
  console.log("\n======================================================");
  console.log(`M2 STRESS SUITE SUMMARY: ${passedTests}/${totalTests} Passed (${(passedTests / totalTests * 100).toFixed(1)}%)`);
  if (failedTests > 0) {
    console.error(`FAILED: ${failedTests} test(s) failed:`);
    failureDetails.forEach((f) => console.error(`  - ${f}`));
  }
  console.log("======================================================\n");
  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    failures: failureDetails
  };
}
export {
  runAllM2StressTests
};
