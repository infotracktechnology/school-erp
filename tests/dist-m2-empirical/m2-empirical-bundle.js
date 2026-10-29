import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, useRef, useEffect, useMemo } from "react";
import { renderToString } from "react-dom/server";
import { useNavigate, useLocation, Outlet, MemoryRouter, Routes, Route } from "react-router-dom";
import assert from "assert";
import { ChevronRight, Check, Circle, Calendar, Clock, Lock, ChevronDown, Sparkles, Settings, ExternalLink, Building2, Globe, Shield, MapPin, Menu, Search, Bell, ShieldCheck, User, LogOut, X, LayoutDashboard, Star, Users, UserCheck, CalendarCheck, BookOpen, Award, CreditCard, MessageSquare, Briefcase, Bus, Bookmark, BarChart3, FileCheck2, Image, Key, Layers, GitMerge, Edit, ArrowRightLeft, TrendingUp, UserX, CheckSquare, History, GraduationCap, ShieldAlert, Unlock, AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
function runAllTests() {
  console.log("\n======================================================");
  console.log("   MILESTONE 2 SHELL & NAVIGATION EMPIRICAL CHALLENGE  ");
  console.log("======================================================\n");
  console.log("▶ Suite 1: Layout Full-Width Suppression on /students/update");
  recordTest("Sidebar is suppressed on /students/update", "Layout-FullWidth", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/students/update"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/students/*", element: /* @__PURE__ */ jsx(AppLayout, { toasts: [] }) }) }) })
    );
    assert.strictEqual(
      html.includes("Multi-Branch ERP v2.4"),
      false,
      "Sidebar footer Multi-Branch ERP v2.4 must NOT be rendered on /students/update"
    );
    assert.strictEqual(
      html.includes("Overview &amp; Hub") || html.includes("Overview & Hub"),
      false,
      "Sidebar Navigation Groups must NOT be rendered on /students/update"
    );
  });
  recordTest("Main container uses max-w-none full-width on /students/update", "Layout-FullWidth", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/students/update"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/students/*", element: /* @__PURE__ */ jsx(AppLayout, { toasts: [] }) }) }) })
    );
    assert.ok(
      html.includes("max-w-none"),
      "Main element must contain max-w-none on /students/update for spreadsheet matrix"
    );
    assert.strictEqual(
      html.includes("max-w-7xl mx-auto"),
      false,
      "Main element must NOT contain max-w-7xl mx-auto on /students/update"
    );
  });
  recordTest("Sidebar is suppressed on trailing slash /students/update/", "Layout-FullWidth", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/students/update/"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/students/*", element: /* @__PURE__ */ jsx(AppLayout, { toasts: [] }) }) }) })
    );
    assert.strictEqual(
      html.includes("Multi-Branch ERP v2.4"),
      false,
      "Sidebar must NOT be rendered on /students/update/"
    );
    assert.ok(
      html.includes("max-w-none"),
      "Main container must retain max-w-none on /students/update/"
    );
  });
  recordTest("Sidebar is rendered normally on standard /students/details route", "Layout-FullWidth", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/students/details"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/students/*", element: /* @__PURE__ */ jsx(AppLayout, { toasts: [] }) }) }) })
    );
    assert.ok(
      html.includes("Multi-Branch ERP v2.4"),
      "Sidebar must be rendered on standard /students/details route"
    );
    assert.ok(
      html.includes("max-w-7xl mx-auto"),
      "Main container must have standard max-w-7xl mx-auto on /students/details"
    );
    assert.strictEqual(
      html.includes("max-w-none"),
      false,
      "Main container must NOT be max-w-none on standard /students/details"
    );
  });
  recordTest("Sidebar is rendered normally on root dashboard route", "Layout-FullWidth", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(AppLayout, { toasts: [] }) }) }) })
    );
    assert.ok(
      html.includes("Multi-Branch ERP v2.4"),
      "Sidebar must be rendered on /dashboard"
    );
    assert.ok(
      html.includes("max-w-7xl mx-auto"),
      "Main container must have max-w-7xl mx-auto on /dashboard"
    );
  });
  console.log("\n▶ Suite 2: Empty Toasts Handling & Boundary Conditions");
  recordTest("AppLayout handles toasts={null} without throwing", "Toast-Handling", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(AppLayout, { toasts: null }) }) }) })
    );
    assert.ok(html.length > 0, "AppLayout renders cleanly with toasts={null}");
  });
  recordTest("AppLayout handles toasts={undefined} without throwing", "Toast-Handling", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(AppLayout, {}) }) }) })
    );
    assert.ok(html.length > 0, "AppLayout renders cleanly with undefined toasts");
  });
  recordTest("AppLayout handles toasts={[]} returning null ToastContainer", "Toast-Handling", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: ["/dashboard"], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(AppLayout, { toasts: [] }) }) }) })
    );
    assert.strictEqual(
      html.includes("animate-slide-up"),
      false,
      "No toast message DOM nodes rendered when toasts array is empty"
    );
  });
  recordTest("ToastContainer directly returns null on empty toasts", "Toast-Handling", () => {
    const html = renderToString(/* @__PURE__ */ jsx(ToastContainer, { toasts: [], onDismiss: () => {
    } }));
    assert.strictEqual(html, "", "ToastContainer should return empty markup for []");
  });
  recordTest("ToastContainer renders multi-type toasts correctly", "Toast-Handling", () => {
    const testToasts = [
      { id: 1, type: "success", text: "Academic year activated successfully." },
      { id: 2, type: "error", text: "Failed to synchronize branch permissions." },
      { id: 3, type: "info", text: "System backup in progress." }
    ];
    const html = renderToString(/* @__PURE__ */ jsx(ToastContainer, { toasts: testToasts, onDismiss: () => {
    } }));
    assert.ok(html.includes("Academic year activated successfully."));
    assert.ok(html.includes("Failed to synchronize branch permissions."));
    assert.ok(html.includes("System backup in progress."));
    assert.ok(html.includes("bg-emerald-900"), "Success toast has emerald background");
    assert.ok(html.includes("bg-rose-900"), "Error toast has rose background");
    assert.ok(html.includes("bg-slate-900"), "Info toast has slate background");
  });
  recordTest("ToastContainer handles empty string text and missing onDismiss", "Toast-Handling", () => {
    const testToasts = [{ id: 4, type: "info", text: "" }];
    const html = renderToString(/* @__PURE__ */ jsx(ToastContainer, { toasts: testToasts }));
    assert.ok(html.includes("bg-slate-900"));
  });
  console.log("\n▶ Suite 3: Null User Fallbacks & Avatar Initials");
  recordTest("NavigationHeader with null currentUser for super_admin", "User-Fallback", () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: null,
      isSuperAdmin: true,
      isPrincipal: false,
      isStudent: false,
      userRole: "super_admin"
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(html.includes("SA"), "Fallback initials for Super Admin must be SA");
    assert.ok(html.includes("Super Admin"), "Display name fallback must be Super Admin");
    assert.ok(html.includes("All Branches Access"), "Subtitle fallback must be All Branches Access");
  });
  recordTest("NavigationHeader with null currentUser for student", "User-Fallback", () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: null,
      isSuperAdmin: false,
      isPrincipal: false,
      isStudent: true,
      userRole: "student"
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(html.includes("ST"), "Fallback initials for Student must be ST");
    assert.ok(html.includes("Student"), "Display name fallback must be Student");
    assert.ok(html.includes("Student Account"), "Subtitle fallback must be Student Account");
  });
  recordTest("NavigationHeader with null currentUser for principal", "User-Fallback", () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: null,
      isSuperAdmin: false,
      isPrincipal: true,
      isStudent: false,
      userRole: "principal",
      assignedBranch: { branch_name: "Coimbatore Campus", branch_code: "CBE" }
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(html.includes("PR"), "Fallback initials for Principal must be PR");
    assert.ok(html.includes("Principal"), "Display name fallback must be Principal");
    assert.ok(html.includes("Coimbatore Campus"), "Subtitle reflects assigned branch");
  });
  recordTest('NavigationHeader initials for single-word name "Aarav"', "User-Fallback", () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: "Aarav", student: { admission_number: "ADM-404" } },
      isStudent: true
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(html.includes("AA"), "Single-word Aarav initials must be AA");
    assert.ok(html.includes("Adm: ADM-404"), "Admission number rendered in subtitle");
  });
  recordTest('NavigationHeader initials for two-word name "Rohan Sharma"', "User-Fallback", () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: "Rohan Sharma" },
      isSuperAdmin: true
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(html.includes("RS"), "Two-word Rohan Sharma initials must be RS");
  });
  recordTest('NavigationHeader initials for multi-word name "Dr. Jane Mary Smith"', "User-Fallback", () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: "Dr. Jane Mary Smith" },
      isPrincipal: true
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(html.includes("DJ"), "First two word initials must be DJ");
  });
  recordTest("NavigationHeader empty name string falls back cleanly", "User-Fallback", () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: "   " },
      isSuperAdmin: false,
      isPrincipal: true,
      userRole: "principal"
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(html.length > 0, "Renders without throwing for whitespace name");
    assert.ok(html.includes("Principal"), "Displays fallback name Principal");
  });
  recordTest("NavigationHeader contains User Profile dropdown trigger", "User-Fallback", () => {
    resetMockErpContext();
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(NavigationHeader, {}) })
    );
    assert.ok(
      html.includes('title="User Profile &amp; Settings"') || html.includes('title="User Profile & Settings"'),
      "Dropdown trigger contains User Profile & Settings title"
    );
    assert.ok(html.includes("EduCampus ERP Logo"), "Header contains school logo");
    assert.ok(html.includes("Cycle:"), "Header contains academic cycle indicator");
  });
  console.log("\n▶ Suite 4: Multi-Role Menu Permissions & Group Visibility");
  recordTest("Sidebar super_admin has all 7 groups and Settings", "Role-Permissions", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        Sidebar,
        {
          activeNav: "dashboard",
          onSelectNav: () => {
          },
          userRole: "super_admin",
          isStudent: false,
          branchCount: 3,
          isSettingsExpanded: true,
          userPermissions: { canViewBranchSettings: true, canViewAcademicSettings: true }
        }
      ) })
    );
    for (const group of NAVIGATION_GROUPS) {
      assert.ok(
        html.includes(group.label.replace("&", "&amp;")) || html.includes(group.label),
        `Group "${group.label}" must be rendered for super_admin`
      );
    }
    assert.ok(html.includes("Settings"), "Settings must be visible for super_admin");
    assert.ok(html.includes("User Management"), "User Management must be visible for super_admin");
    assert.ok(html.includes("Menu Assignment"), "Menu Assignment must be visible for super_admin");
    assert.ok(html.includes("Branch Settings"), "Branch Settings must be visible for super_admin");
    assert.ok(html.includes("Academic Settings"), "Academic Settings must be visible for super_admin");
  });
  recordTest("Sidebar principal has all 7 groups but Settings is hidden", "Role-Permissions", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        Sidebar,
        {
          activeNav: "dashboard",
          onSelectNav: () => {
          },
          userRole: "principal",
          isStudent: false,
          branchCount: 1,
          userPermissions: { canViewBranchSettings: false, canViewAcademicSettings: false }
        }
      ) })
    );
    assert.ok(
      html.includes("Overview &amp; Hub") || html.includes("Overview & Hub"),
      "Overview group visible for principal"
    );
    assert.ok(
      html.includes("Student Information (SIS)"),
      "Students group visible for principal"
    );
    assert.ok(
      html.includes("Campus Operations"),
      "Campus Operations visible for principal"
    );
    assert.strictEqual(
      html.includes("User Management"),
      false,
      "User Management must NOT be visible for principal"
    );
    assert.strictEqual(
      html.includes("Menu Assignment"),
      false,
      "Menu Assignment must NOT be visible for principal"
    );
  });
  recordTest("Sidebar teacher filters out unauthorized modules", "Role-Permissions", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        Sidebar,
        {
          activeNav: "dashboard",
          onSelectNav: () => {
          },
          userRole: "teacher",
          isStudent: false,
          branchCount: 1
        }
      ) })
    );
    assert.ok(html.includes("Attendance"), "Teacher can see Attendance");
    assert.ok(html.includes("Timetable"), "Teacher can see Timetable");
    assert.ok(html.includes("Communication"), "Teacher can see Communication");
    assert.ok(html.includes("Library"), "Teacher can see Library");
    assert.strictEqual(html.includes(">Finance<"), false, "Teacher cannot see Finance");
    assert.strictEqual(html.includes(">Transport<"), false, "Teacher cannot see Transport");
    assert.strictEqual(html.includes(">HR<"), false, "Teacher cannot see HR");
    assert.strictEqual(html.includes(">Reports<"), false, "Teacher cannot see Reports");
    assert.strictEqual(html.includes("Settings"), false, "Teacher cannot see Settings");
  });
  recordTest("Sidebar student portal mode renders studentMenuItems strictly", "Role-Permissions", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        Sidebar,
        {
          activeNav: "dashboard",
          onSelectNav: () => {
          },
          userRole: "student",
          isStudent: true,
          branchCount: 1
        }
      ) })
    );
    assert.ok(html.includes("Student Portal"), "Contains Student Portal title");
    assert.ok(html.includes("My Merits &amp; Remarks") || html.includes("My Merits & Remarks"));
    assert.ok(html.includes("Homework"));
    assert.ok(html.includes("Assignment"));
    assert.ok(html.includes("My Profile"));
    assert.strictEqual(html.includes("Overview &amp; Hub"), false);
    assert.strictEqual(html.includes("Campus Operations"), false);
    assert.strictEqual(html.includes("Staff &amp; Administration"), false);
    assert.strictEqual(html.includes("Settings"), false);
  });
  recordTest('Sidebar legacy role "principle" normalizes to "principal"', "Role-Permissions", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        Sidebar,
        {
          activeNav: "dashboard",
          onSelectNav: () => {
          },
          userRole: "principle",
          isStudent: false,
          branchCount: 1
        }
      ) })
    );
    assert.ok(
      html.includes("Student Information (SIS)"),
      "Normalized principle role can access Students group"
    );
  });
  recordTest("Sidebar unknown role handles gracefully without throwing", "Role-Permissions", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        Sidebar,
        {
          activeNav: "dashboard",
          onSelectNav: () => {
          },
          userRole: "guest_visitor",
          isStudent: false,
          branchCount: 0
        }
      ) })
    );
    assert.ok(html.includes("Multi-Branch ERP v2.4"));
  });
  recordTest('Sidebar mobile sheet configures side="left" with left drawer positioning', "Role-Permissions", () => {
    let sidebarEl;
    function HookRunner() {
      sidebarEl = Sidebar({
        activeNav: "dashboard",
        onSelectNav: () => {
        },
        userRole: "super_admin",
        isStudent: false,
        isMobileOpen: true,
        onCloseMobile: () => {
        }
      });
      return null;
    }
    renderToString(/* @__PURE__ */ jsx(HookRunner, {}));
    const children = React__default.Children.toArray(sidebarEl.props.children);
    const sheetEl = children.find((c) => c && c.props && "open" in c.props);
    assert.ok(sheetEl, "Sidebar must render Sheet with open prop");
    assert.strictEqual(sheetEl.props.open, true, "Sheet open prop must reflect isMobileOpen");
    const sheetContentEl = sheetEl.props.children;
    assert.ok(sheetContentEl, "Sheet must contain SheetContent");
    assert.strictEqual(sheetContentEl.props.side, "left", 'SheetContent side must be "left"');
    assert.ok(
      sheetContentEl.props.className.includes("w-64"),
      "SheetContent has responsive w-64 drawer width"
    );
  });
  console.log("\n▶ Suite 5: BranchSelector Scoping & Boundary Conditions");
  recordTest("BranchSelector renders principal locked mode", "Branch-Scoping", () => {
    resetMockErpContext();
    setMockErpContext({
      isPrincipal: true,
      isSuperAdmin: false,
      assignedBranch: { branch_name: "Trichy Campus", branch_code: "TRY" },
      isLoadingBranches: false
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(BranchSelector, {}) })
    );
    assert.ok(html.includes("Assigned Campus"), "Principal displays Assigned Campus badge");
    assert.ok(html.includes("Trichy Campus"), "Displays assigned branch name");
    assert.ok(html.includes("TRY"), "Displays assigned branch code");
    assert.strictEqual(
      html.includes("global-branch-selector-button"),
      false,
      "Principal must NOT have interactive selector button"
    );
  });
  recordTest('BranchSelector renders SuperAdmin consolidated "All Branches"', "Branch-Scoping", () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: true,
      isPrincipal: false,
      isAllBranches: true,
      branches: [
        { id: 1, branch_name: "Campus A", branch_code: "CA" },
        { id: 2, branch_name: "Campus B", branch_code: "CB" },
        { id: 3, branch_name: "Campus C", branch_code: "CC" }
      ],
      isLoadingBranches: false
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(BranchSelector, {}) })
    );
    assert.ok(html.includes("All Branches"), "SuperAdmin displays All Branches");
    assert.ok(html.includes("ALL (3)"), "Displays consolidated count ALL (3)");
    assert.ok(html.includes("Organization Scope"), "Displays Organization Scope header");
  });
  recordTest("BranchSelector renders loading skeleton on isLoadingBranches=true", "Branch-Scoping", () => {
    resetMockErpContext();
    setMockErpContext({
      isLoadingBranches: true
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(BranchSelector, {}) })
    );
    assert.ok(html.includes("animate-pulse"), "Renders animated pulse skeleton");
  });
  recordTest("BranchSelector handles empty branches array", "Branch-Scoping", () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: true,
      isPrincipal: false,
      isAllBranches: true,
      branches: [],
      accessibleBranches: [],
      isLoadingBranches: false
    });
    const html = renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(BranchSelector, {}) })
    );
    assert.ok(html.includes("ALL (0)"), "Displays ALL (0) for empty branches");
  });
  console.log("\n▶ Suite 6: Breadcrumb Hierarchy & Module Formats");
  recordTest("Breadcrumb renders root dashboard", "Breadcrumb-Nav", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(Breadcrumb, { activeNav: "dashboard", onNavigate: () => {
      } })
    );
    assert.ok(html.includes("Dashboard"));
  });
  recordTest("Breadcrumb renders Settings → Branch Settings with branch name", "Breadcrumb-Nav", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(
        Breadcrumb,
        {
          activeNav: "branch-settings",
          onNavigate: () => {
          },
          branchName: "HQ-MAIN"
        }
      )
    );
    assert.ok(html.includes("Settings"));
    assert.ok(html.includes("Branch Settings"));
    assert.ok(html.includes("HQ-MAIN"));
  });
  recordTest("Breadcrumb renders Settings → Academic Settings → Classes", "Breadcrumb-Nav", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(
        Breadcrumb,
        {
          activeNav: "academic-settings",
          onNavigate: () => {
          },
          academicSubTab: "classes"
        }
      )
    );
    assert.ok(html.includes("Settings"));
    assert.ok(html.includes("Academic Settings"));
    assert.ok(html.includes("Classes"));
  });
  recordTest("Breadcrumb renders Students (SIS) → Student Update", "Breadcrumb-Nav", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(
        Breadcrumb,
        {
          activeNav: "students",
          onNavigate: () => {
          },
          studentSubTab: "update"
        }
      )
    );
    assert.ok(html.includes("Students (SIS)"));
    assert.ok(html.includes("Student Update"));
  });
  recordTest("Breadcrumb renders Attendance → Take Attendance", "Breadcrumb-Nav", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(
        Breadcrumb,
        {
          activeNav: "attendance",
          onNavigate: () => {
          },
          attendanceSubTab: "take_attendance"
        }
      )
    );
    assert.ok(html.includes("Attendance"));
    assert.ok(html.includes("Take Attendance"));
  });
  recordTest("Breadcrumb renders Communication → Homework", "Breadcrumb-Nav", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(
        Breadcrumb,
        {
          activeNav: "communication",
          onNavigate: () => {
          },
          communicationSubTab: "homework"
        }
      )
    );
    assert.ok(html.includes("Communication"));
    assert.ok(html.includes("Homework"));
  });
  recordTest("Breadcrumb capitalizes generic modules", "Breadcrumb-Nav", () => {
    const html = renderToString(
      /* @__PURE__ */ jsx(Breadcrumb, { activeNav: "timetable", onNavigate: () => {
      } })
    );
    assert.ok(html.includes("Timetable"));
  });
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log("\n======================================================");
  console.log(`M2 SHELL CHALLENGE SUMMARY: ${passed}/${results.length} Passed (${(passed / results.length * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.error(`FAILED: ${failed} tests failed!`);
    throw new Error(`${failed} tests failed in M2 Shell Challenge Suite`);
  } else {
    console.log("[SUCCESS] All Milestone 2 empirical challenge tests PASSED!");
  }
  console.log("======================================================\n");
}
runAllTests();
export {
  runAllTests
};
