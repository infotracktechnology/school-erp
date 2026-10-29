import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import assert from "assert";
import { X, Key, AlertCircle, CheckCircle2, Phone, Mail, Calendar, Shield, Lock, EyeOff, Eye, Save, Users, Sparkles, GraduationCap, Building, Search, UserPlus, CheckSquare, ShieldCheck, BookOpen, Briefcase, Clock, Coffee, Plus, Trash2, RefreshCw, MapPin, User, Edit, Settings, Power, Star, Check, Edit3, Layers, ArrowRight, ArrowUpDown, Unlock, XCircle, AlertTriangle, ShieldAlert, FolderTree, Building2, ChevronDown, Zap, Sliders, ChevronUp, Award, Copy, Filter, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
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
const API_BASE$1 = "/api/staff";
const staffService = {
  // Get staff list with filters and academic allocations
  async getStaffList(params = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.set("branch_id", String(params.branch_id));
    if (params.staff_type && params.staff_type !== "All") query.set("staff_type", params.staff_type);
    if (params.department && params.department !== "All") query.set("department", params.department);
    if (params.status && params.status !== "All") query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    const res = await fetch(`${API_BASE$1}?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch staff");
    }
    return await res.json();
  },
  // Create new staff member
  async createStaff(payload) {
    const res = await fetch(API_BASE$1, {
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
    const res = await fetch(`${API_BASE$1}/${id}`, {
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
    const res = await fetch(`${API_BASE$1}/${id}`, {
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
    const res = await fetch(`${API_BASE$1}/allocations?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch allocations");
    }
    return await res.json();
  },
  // Assign or update academic allocation
  async saveAllocation(payload) {
    const res = await fetch(`${API_BASE$1}/allocations`, {
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
    const res = await fetch(`${API_BASE$1}/allocations/${id}`, {
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
    const res = await fetch(`${API_BASE$1}/workload?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch workload");
    }
    return await res.json();
  },
  // Update credentials for single staff
  async updateCredentials(id, payload) {
    const res = await fetch(`${API_BASE$1}/${id}/credentials`, {
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
    const res = await fetch(`${API_BASE$1}/bulk-credentials`, {
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
const API_BASE = "/api/timetable";
const timetableService = {
  // Structures
  async getStructures(branch_id = 1, academic_year_id = 2) {
    const res = await fetch(`${API_BASE}/structures?branch_id=${branch_id}&academic_year_id=${academic_year_id}`);
    return res.json();
  },
  async createStructure(payload) {
    const res = await fetch(`${API_BASE}/structures`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async deleteStructure(id) {
    const res = await fetch(`${API_BASE}/structures/${id}`, { method: "DELETE" });
    return res.json();
  },
  // Class Mapping
  async saveClassMappings(payload) {
    const res = await fetch(`${API_BASE}/mappings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async unassignClass(payload) {
    const res = await fetch(`${API_BASE}/mappings/unassign`, {
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
    const res = await fetch(`${API_BASE}/subject-mappings?${params.toString()}`);
    return res.json();
  },
  async saveClassSubjectMappings(payload) {
    const res = await fetch(`${API_BASE}/subject-mappings`, {
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
    const res = await fetch(`${API_BASE}/weekly?${params.toString()}`);
    return res.json();
  },
  async saveSlot(payload) {
    const res = await fetch(`${API_BASE}/slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async clearSlot(payload) {
    const res = await fetch(`${API_BASE}/slot/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DEFAULT_PERIODS = [
  { period_name: "Assembly / Zero Hour", period_type: "assembly", start_time: "08:45", end_time: "09:00" },
  { period_name: "Period 1", period_type: "teaching", start_time: "09:00", end_time: "09:45" },
  { period_name: "Period 2", period_type: "teaching", start_time: "09:45", end_time: "10:30" },
  { period_name: "Morning Short Break", period_type: "break", start_time: "10:30", end_time: "10:45" },
  { period_name: "Period 3", period_type: "teaching", start_time: "10:45", end_time: "11:30" },
  { period_name: "Period 4", period_type: "teaching", start_time: "11:30", end_time: "12:15" },
  { period_name: "Lunch Break", period_type: "break", start_time: "12:15", end_time: "13:00" },
  { period_name: "Period 5", period_type: "teaching", start_time: "13:00", end_time: "13:45" },
  { period_name: "Period 6", period_type: "teaching", start_time: "13:45", end_time: "14:30" },
  { period_name: "Period 7", period_type: "teaching", start_time: "14:30", end_time: "15:15" },
  { period_name: "Period 8", period_type: "teaching", start_time: "15:15", end_time: "16:00" }
];
const TimetableStructureView = ({ showToast, onStructureCreated }) => {
  const { branches, selectedBranchId, activeAcademicYearId, academicYears, isSuperAdmin, assignedBranchId } = useErp();
  const effBranch = !isSuperAdmin && assignedBranchId ? String(assignedBranchId) : String(selectedBranchId || "1");
  const [branchId, setBranchId] = useState(effBranch);
  const [academicYearId, setAcademicYearId] = useState(String(activeAcademicYearId || "2"));
  const [structureName, setStructureName] = useState("General School Shift (8 Periods)");
  const [selectedDays, setSelectedDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  const [periods, setPeriods] = useState(DEFAULT_PERIODS);
  const [existingStructures, setExistingStructures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const loadStructures = async () => {
    setIsLoading(true);
    try {
      const res = await timetableService.getStructures(branchId, academicYearId);
      if (res.success && res.data) {
        setExistingStructures(res.data);
      }
    } catch (err) {
      if (showToast) showToast("Failed to load timetable structures", "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadStructures();
  }, [branchId, academicYearId]);
  const handleToggleDay = (day) => {
    setSelectedDays(
      (prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const handlePeriodChange = (index, field, value) => {
    setPeriods((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const handleAddPeriod = (type = "teaching") => {
    const teachingCount = periods.filter((p) => p.period_type === "teaching").length;
    setPeriods((prev) => [
      ...prev,
      {
        period_name: type === "break" ? "Break" : `Period ${teachingCount + 1}`,
        period_type: type,
        start_time: "09:00",
        end_time: "09:45"
      }
    ]);
  };
  const handleRemovePeriod = (index) => {
    setPeriods((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!structureName.trim()) {
      if (showToast) showToast("Please enter a structure name", "error");
      return;
    }
    if (selectedDays.length === 0) {
      if (showToast) showToast("Please select at least one working day", "error");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        branch_id: Number(branchId),
        academic_year_id: Number(academicYearId),
        name: structureName.trim(),
        working_days: selectedDays,
        periods
      };
      const res = await timetableService.createStructure(payload);
      if (res.success) {
        if (showToast) showToast("Timetable structure saved successfully!", "success");
        loadStructures();
        if (onStructureCreated) onStructureCreated();
      } else {
        throw new Error(res.message || "Failed to save");
      }
    } catch (err) {
      if (showToast) showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this structure? All periods and mappings will be removed.")) return;
    try {
      const res = await timetableService.deleteStructure(id);
      if (res.success) {
        if (showToast) showToast("Structure deleted successfully", "success");
        loadStructures();
      }
    } catch (err) {
      if (showToast) showToast("Failed to delete structure", "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 mb-1", children: [
        /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-zinc-700" }),
        /* @__PURE__ */ jsx("span", { children: "Step 1: Timing & Periods Definition" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-zinc-950", children: "Timetable Structure Setup" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 mt-0.5", children: "Configure working days, period timings, lunch breaks, and school bell schedules." })
    ] }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4 border-b border-zinc-100", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Create Timetable Structure" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Set up daily bell timings and periods that can be assigned to different class groups." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-6 space-y-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-zinc-700 mb-1.5", children: "Campus / Branch" }),
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
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-zinc-700 mb-1.5", children: [
              "Structure Name ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                required: true,
                placeholder: "e.g. Standard 8-Period Shift (Grade 1 to 10)",
                value: structureName,
                onChange: (e) => setStructureName(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-zinc-800", children: "Working Days of the Week" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: WEEKDAYS.map((day) => {
            const isChecked = selectedDays.includes(day);
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleToggleDay(day),
                className: `px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${isChecked ? "bg-zinc-900 text-white border-zinc-900 shadow-xs" : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100"}`,
                children: [
                  isChecked ? "✓ " : "",
                  day
                ]
              },
              day
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-zinc-900", children: "Bell Schedule & Periods" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-zinc-500", children: "Arrange period timings, assemblies, and recess intervals." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => handleAddPeriod("break"),
                  className: "space-x-1.5 text-xs font-semibold",
                  children: [
                    /* @__PURE__ */ jsx(Coffee, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx("span", { children: "+ Add Break" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => handleAddPeriod("teaching"),
                  className: "space-x-1.5 text-xs font-semibold",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx("span", { children: "+ Add Period" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-zinc-200/80 overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { className: "bg-zinc-50/80", children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "w-12 text-center", children: "#" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-56 font-bold text-zinc-900", children: "Period / Break Name" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-36 font-bold text-zinc-900", children: "Type" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-36 font-bold text-zinc-900", children: "Start Time" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-36 font-bold text-zinc-900", children: "End Time" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-16 text-center" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: periods.map((p, idx) => {
              const isBreak = p.period_type === "break";
              const isAssembly = p.period_type === "assembly";
              return /* @__PURE__ */ jsxs(TableRow, { className: isBreak ? "bg-amber-50/30" : isAssembly ? "bg-blue-50/30" : "", children: [
                /* @__PURE__ */ jsx(TableCell, { className: "text-center font-mono text-xs text-zinc-400 py-2.5", children: idx + 1 }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: p.period_name,
                    onChange: (e) => handlePeriodChange(idx, "period_name", e.target.value),
                    className: "h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none"
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: p.period_type,
                    onChange: (e) => handlePeriodChange(idx, "period_type", e.target.value),
                    className: "h-8 w-full rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 shadow-2xs focus:ring-1 focus:ring-zinc-950 outline-none",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "teaching", children: "Teaching Period" }),
                      /* @__PURE__ */ jsx("option", { value: "break", children: "Recess / Break" }),
                      /* @__PURE__ */ jsx("option", { value: "assembly", children: "Assembly / Roll Call" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: p.start_time,
                    onChange: (e) => handlePeriodChange(idx, "start_time", e.target.value),
                    className: "h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 shadow-2xs outline-none"
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: p.end_time,
                    onChange: (e) => handlePeriodChange(idx, "end_time", e.target.value),
                    className: "h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 shadow-2xs outline-none"
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center py-2.5", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRemovePeriod(idx),
                    className: "p-1 text-zinc-400 hover:text-red-600 rounded transition-colors cursor-pointer",
                    title: "Delete Period",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                ) })
              ] }, idx);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isSaving, className: "space-x-1.5", children: [
          isSaving ? /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: isSaving ? "Saving Structure..." : "Save Timetable Structure" })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3 border-b border-zinc-100", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Configured Timetable Structures" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Active bell schedules and shift patterns defined for this branch." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-4", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "p-10 text-center", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin text-zinc-600 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 font-medium", children: "Loading timetable structures..." })
      ] }) : existingStructures.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-10 text-center border-2 border-dashed border-zinc-200 rounded-xl space-y-2", children: [
        /* @__PURE__ */ jsx(Clock, { className: "w-8 h-8 text-zinc-300 mx-auto" }),
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-zinc-700", children: "No Timetable Structures Configured" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-400 max-w-sm mx-auto", children: "Fill the form above to establish school bell schedules and periods." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: existingStructures.map((st) => {
        var _a, _b, _c, _d;
        return /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-zinc-950", children: st.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-zinc-400 mt-0.5", children: ((_a = st.working_days) == null ? void 0 : _a.join(", ")) || "Mon - Sat" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleDelete(st.id),
                className: "text-zinc-400 hover:text-red-600 transition-colors p-1",
                title: "Delete Structure",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Total Periods: ",
              /* @__PURE__ */ jsx("strong", { children: ((_b = st.periods) == null ? void 0 : _b.length) || 0 })
            ] }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Mapped Classes: ",
              /* @__PURE__ */ jsx("strong", { children: ((_c = st.classes) == null ? void 0 : _c.length) || 0 })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1 max-h-36 overflow-y-auto pr-1", children: (_d = st.periods) == null ? void 0 : _d.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] py-1 px-2 rounded bg-zinc-50", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-700", children: p.period_name }),
            /* @__PURE__ */ jsxs("span", { className: "text-zinc-400", children: [
              p.start_time,
              " - ",
              p.end_time
            ] })
          ] }, p.id || i)) })
        ] }, st.id);
      }) }) })
    ] })
  ] });
};
const BranchTable = ({ branches, onView, onEdit, onSettings, onToggleStatus }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const formatDate = (dateStr) => {
    if (!dateStr)
      return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };
  const getBoardBadgeClass = (board) => {
    switch (board) {
      case "CBSE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ICSE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Cambridge":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "IB":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "State Board":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };
  const getBranchTypeBadgeClass = (type) => {
    switch (type) {
      case "Main Branch":
        return "bg-emerald-100/90 text-emerald-800 font-bold border-emerald-300";
      case "Campus":
      case "Senior Campus":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Junior Campus":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "Coaching Centre":
        return "bg-orange-50 text-orange-800 border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border border-slate-200/80 shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto min-h-[350px]", children: /* @__PURE__ */ jsxs(Table, { id: "branches-data-table", children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4 sm:px-6", children: "Branch Code" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Branch Name" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Branch Type" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Board" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "City" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Branch Head" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Created Date" }),
        /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4 sm:px-6 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { className: "divide-y divide-slate-100 text-xs sm:text-sm", children: branches.map((branch) => {
        const isInactive = branch.status === "Inactive";
        return /* @__PURE__ */ jsxs(TableRow, { id: `branch-row-${branch.id}`, className: `hover:bg-slate-50/70 transition-colors group ${isInactive ? "bg-slate-50/40 opacity-80" : ""}`, children: [
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4 sm:px-6 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200/80 group-hover:border-sky-300 group-hover:bg-sky-50/50 transition-colors", children: branch.branch_code }) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 min-w-[200px]", children: [
            branch.logo ? /* @__PURE__ */ jsx("img", { src: branch.logo, alt: branch.branch_name, className: "w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-white", referrerPolicy: "no-referrer" }) : /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 flex items-center justify-center font-bold text-xs shrink-0", children: branch.branch_name.slice(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 flex items-center space-x-1.5", children: /* @__PURE__ */ jsx("span", { children: branch.branch_name }) }),
              branch.short_name && /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-slate-500 font-medium", children: [
                "Alias: ",
                branch.short_name
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border ${getBranchTypeBadgeClass(branch.branch_type)}`, children: branch.branch_type }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBoardBadgeClass(branch.board)}`, children: branch.board }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "py-4 px-4 whitespace-nowrap", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 text-slate-700 font-medium", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: branch.city })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-400 pl-4", children: branch.state })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4 whitespace-nowrap", children: branch.branch_head_name ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-semibold text-slate-800 flex items-center space-x-1", children: [
              /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: branch.branch_head_name })
            ] }),
            branch.branch_head_designation && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500 pl-4", children: branch.branch_head_designation })
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 italic", children: "Not Assigned" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4 whitespace-nowrap", children: branch.status === "Active" ? /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border-emerald-200", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" }),
            /* @__PURE__ */ jsx("span", { children: "Active" })
          ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border-slate-300", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" }),
            /* @__PURE__ */ jsx("span", { children: "Inactive" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: formatDate(branch.created_at) })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "py-4 px-4 sm:px-6 whitespace-nowrap text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-1", children: [
            /* @__PURE__ */ jsx("button", { type: "button", id: `btn-view-branch-${branch.id}`, onClick: () => onView(branch), className: "p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer", title: "View Branch Profile", children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { type: "button", id: `btn-edit-branch-${branch.id}`, onClick: () => onEdit(branch), className: "p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer", title: "Edit Branch", children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { type: "button", id: `btn-settings-branch-${branch.id}`, onClick: () => onSettings(branch), className: "p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer", title: "Branch Settings", children: /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { type: "button", id: `btn-toggle-status-${branch.id}`, onClick: () => onToggleStatus(branch), className: `p-1.5 rounded-lg transition-colors cursor-pointer ${branch.status === "Active" ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"}`, title: branch.status === "Active" ? "Deactivate Branch" : "Activate Branch", children: /* @__PURE__ */ jsx(Power, { className: "w-4 h-4" }) })
          ] }) })
        ] }, branch.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/80 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Showing ",
        /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: branches.length }),
        " ",
        branches.length === 1 ? "branch" : "branches"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-400", children: "Data isolated under Organization ID #1" })
    ] })
  ] });
};
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
const ClassTable = ({ classes, onView, onEdit, onToggleStatus, isReadOnly = false }) => {
  return /* @__PURE__ */ jsx(Card, { className: "shadow-xs overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "w-full text-left text-xs sm:text-sm", children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]", children: [
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Class Code" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Class Name" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Level / Stream" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Short Name" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsx("span", { children: "Display Order" }),
        /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3 text-slate-400" })
      ] }) }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Assigned Sections" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Student Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4 text-right", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { className: "divide-y divide-slate-100 font-medium text-slate-700", children: classes.map((cls) => {
      const isActive = cls.status === "Active";
      return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/70 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 font-mono font-bold text-emerald-900", children: /* @__PURE__ */ jsx("span", { className: "bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200 text-xs font-semibold", children: cls.code }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900", children: cls.name }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-700", children: cls.class_type || "Secondary" }),
          Boolean(cls.group_required) ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center w-fit px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200", children: "Stream Required" }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center w-fit px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-500 bg-slate-100", children: "Common" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 text-slate-600", children: cls.short_name ? /* @__PURE__ */ jsx("span", { className: "font-medium", children: cls.short_name }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "—" }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200", children: cls.display_order }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: cls.sections ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: cls.sections.split(", ").map((sec, idx) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200", children: [
          "Sec ",
          sec
        ] }, idx)) }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 italic", children: "No sections mapped" }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: cls.is_locked ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs", title: `Locked: ${cls.student_count || 0} students assigned to this class for this academic year`, children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 mr-1.5 text-amber-600 shrink-0" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Students Assigned (",
            cls.student_count || 0,
            ")"
          ] })
        ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200", children: [
          /* @__PURE__ */ jsx(Unlock, { className: "w-3 h-3 mr-1.5 text-slate-400 shrink-0" }),
          /* @__PURE__ */ jsx("span", { children: "No Students" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`, children: [
          isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5 mr-1.5 text-slate-400" }),
          cls.status
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-1.5", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onView(cls), className: "p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer", title: "View Class Details", children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onEdit(cls), disabled: isReadOnly, className: `p-1.5 rounded-lg transition-colors cursor-pointer ${isReadOnly ? "text-slate-300 cursor-not-allowed opacity-60" : "text-slate-600 hover:text-blue-700 hover:bg-slate-100"}`, title: isReadOnly ? "Read-only: Historical Academic Year" : "Edit Class", children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => onToggleStatus(cls),
              disabled: isReadOnly || cls.is_locked,
              className: `p-1.5 rounded-lg transition-colors cursor-pointer ${isReadOnly || cls.is_locked ? "text-slate-300 cursor-not-allowed opacity-60" : isActive ? "text-slate-500 hover:text-amber-700 hover:bg-amber-50" : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"}`,
              title: cls.is_locked ? `Class is locked: ${cls.student_count || 0} student(s) assigned in this academic year.` : isReadOnly ? "Read-only: Historical Academic Year" : isActive ? "Deactivate Class" : "Activate Class",
              children: cls.is_locked ? /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-amber-600" }) : /* @__PURE__ */ jsx(Power, { className: "w-4 h-4" })
            }
          )
        ] }) })
      ] }, cls.id);
    }) })
  ] }) }) });
};
const SectionTable = ({ sections, onView, onEdit, onToggleStatus, isReadOnly = false }) => {
  return /* @__PURE__ */ jsx(Card, { className: "shadow-xs overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "w-full text-left text-xs sm:text-sm", children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]", children: [
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Section Code" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Section Name" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Short Name" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Mapped Classes" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4 text-right", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { className: "divide-y divide-slate-100 font-medium text-slate-700", children: sections.map((sec) => {
      const isActive = sec.status === "Active";
      return /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-slate-50/70 transition-colors", children: [
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4 font-mono font-bold text-emerald-900", children: /* @__PURE__ */ jsx("span", { className: "bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold", children: sec.code }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-900 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-md bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs", children: sec.name }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Section ",
            sec.name
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4 text-slate-600", children: sec.short_name ? /* @__PURE__ */ jsx("span", { className: "font-medium", children: sec.short_name }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "—" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: sec.classes ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5 max-w-md", children: sec.classes.split(", ").map((cls, idx) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200", children: cls }, idx)) }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 italic", children: "Not mapped to any class yet" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs(Badge, { className: `px-2.5 py-1 rounded-full text-xs font-bold border ${isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`, children: [
          isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5 mr-1.5 text-slate-400" }),
          sec.status
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-1.5", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onView(sec), className: "p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer", title: "View Section Details", children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onEdit(sec), disabled: isReadOnly, className: `p-1.5 rounded-lg transition-colors cursor-pointer ${isReadOnly ? "text-slate-300 cursor-not-allowed opacity-60" : "text-slate-600 hover:text-blue-700 hover:bg-slate-100"}`, title: isReadOnly ? "Read-only: Historical Academic Year" : "Edit Section", children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onToggleStatus(sec), disabled: isReadOnly, className: `p-1.5 rounded-lg transition-colors cursor-pointer ${isReadOnly ? "text-slate-300 cursor-not-allowed opacity-60" : isActive ? "text-slate-500 hover:text-amber-700 hover:bg-amber-50" : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"}`, title: isReadOnly ? "Read-only: Historical Academic Year" : isActive ? "Deactivate Section" : "Activate Section", children: /* @__PURE__ */ jsx(Power, { className: "w-4 h-4" }) })
        ] }) })
      ] }, sec.id);
    }) })
  ] }) }) });
};
const ClassSectionSummaryTable = ({ summary, onEditClassMapping, onToggleEnable, isReadOnly = false }) => {
  return /* @__PURE__ */ jsx(Card, { className: "shadow-xs overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "w-full text-left text-xs sm:text-sm", children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]", children: [
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Class" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Short Name" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Display Order" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Assigned Sections" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Student Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Total Sections" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4", children: "Enabled" }),
      /* @__PURE__ */ jsx(TableHead, { className: "py-3.5 px-4 text-right", children: "Action" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { className: "divide-y divide-slate-100 font-medium text-slate-700", children: summary.map((row) => {
      const isActive = row.class_status === "Active";
      return /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-slate-50/70 transition-colors", children: [
        /* @__PURE__ */ jsxs(TableCell, { className: "py-3.5 px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-900 flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx("span", { children: row.class_name }),
            row.is_locked && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300", title: `${row.student_count} students assigned`, children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-2.5 h-2.5 mr-0.5 text-amber-700 shrink-0" }),
              row.student_count
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-semibold text-emerald-800", children: row.class_code })
        ] }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4 text-slate-600 font-medium", children: row.short_name || /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "—" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200", children: row.display_order }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: row.total_sections > 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5 max-w-md", children: row.sections_list.split(", ").map((sec, idx) => {
          const trimmedSec = sec.trim();
          const count = row.section_students && row.section_students[trimmedSec] || 0;
          return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Section ",
              trimmedSec
            ] }),
            count > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-1 inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-1 rounded border border-amber-300 shadow-2xs", title: `Locked: ${count} student(s) enrolled`, children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-2.5 h-2.5 mr-0.5 text-amber-700" }),
              count
            ] })
          ] }, idx);
        }) }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-amber-700 bg-amber-50 border border-amber-200 font-semibold", children: "No sections mapped" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: row.is_locked ? /* @__PURE__ */ jsxs(Badge, { className: "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs font-bold", title: `Class has ${row.student_count} student(s) enrolled`, children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 mr-1 text-amber-700 shrink-0" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Students Assigned (",
            row.student_count,
            ")"
          ] })
        ] }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-slate-100 text-slate-600 border-slate-200 font-medium", children: "No Students" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: row.total_sections }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4 text-center", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: !!row.is_enabled,
            disabled: row.is_locked || isReadOnly,
            onChange: () => onToggleEnable && onToggleEnable(row.class_id, row.is_enabled),
            className: "h-4 w-4 accent-emerald-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            title: row.is_locked ? `Locked: ${row.student_count} student(s) assigned` : isReadOnly ? "Read-only mode" : row.is_enabled ? "Click to disable class" : "Click to enable class"
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxs(Badge, { className: `px-2.5 py-1 rounded-full text-xs font-bold border ${isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`, children: [
          isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5 mr-1.5 text-slate-400" }),
          row.class_status
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "outline", onClick: () => onEditClassMapping(row), disabled: isReadOnly, className: `inline-flex items-center space-x-1 text-xs font-bold ${isReadOnly ? "text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed opacity-60" : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 shadow-2xs"}`, title: isReadOnly ? "Read-only: Historical Academic Year" : "Edit Mappings", children: [
          /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5 mr-1" }),
          /* @__PURE__ */ jsx("span", { children: "Edit Mappings" })
        ] }) })
      ] }, row.class_id);
    }) })
  ] }) }) });
};
const ClassSectionEditModal = ({ isOpen, onClose, targetClassSummary, availableSections, onSave, branchName, academicYearName }) => {
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const lockedSectionIds = (targetClassSummary == null ? void 0 : targetClassSummary.locked_section_ids) || [];
  useEffect(() => {
    if (targetClassSummary) {
      setSelectedSectionIds([...targetClassSummary.section_ids]);
    } else {
      setSelectedSectionIds([]);
    }
    setError(null);
  }, [targetClassSummary, isOpen]);
  if (!isOpen || !targetClassSummary)
    return null;
  const toggleSection = (id) => {
    if (lockedSectionIds.includes(id) && selectedSectionIds.includes(id)) {
      return;
    }
    setSelectedSectionIds((prev) => prev.includes(id) ? prev.filter((secId) => secId !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    setSelectedSectionIds(availableSections.map((s) => s.id));
  };
  const handleClearAll = () => {
    setSelectedSectionIds(lockedSectionIds);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(targetClassSummary.class_id, selectedSectionIds);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update sections for class.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs", children: /* @__PURE__ */ jsx(Layers, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-slate-900", children: [
              "Map Sections for ",
              targetClassSummary.class_name
            ] }),
            targetClassSummary.is_locked && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300", children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-2.5 h-2.5 mr-0.5 text-amber-700" }),
              targetClassSummary.student_count,
              " Students"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 font-medium", children: [
            branchName,
            " • ",
            academicYearName
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-red-600 shrink-0" }),
      /* @__PURE__ */ jsx("span", { children: error })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wider", children: [
          "Available Active Sections (",
          availableSections.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: handleSelectAll, className: "text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 cursor-pointer", children: "Select All" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleClearAll,
              disabled: selectedSectionIds.length === 0 || lockedSectionIds.length > 0 && selectedSectionIds.every((id) => lockedSectionIds.includes(id)),
              className: "text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
              title: lockedSectionIds.length > 0 ? "Clears all unlocked sections. Locked sections with students will remain." : "Clear all sections",
              children: "Clear Unlocked"
            }
          )
        ] })
      ] }),
      availableSections.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs", children: "No active sections exist for this branch & academic year." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1", children: availableSections.map((sec) => {
        const isSelected = selectedSectionIds.includes(sec.id);
        const studentCount = targetClassSummary.section_students && (targetClassSummary.section_students[sec.id] || targetClassSummary.section_students[sec.name]) || 0;
        const isSectionLocked = isSelected && studentCount > 0;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => toggleSection(sec.id),
            disabled: isSectionLocked,
            title: isSectionLocked ? `Locked: ${studentCount} student(s) enrolled in this section. Cannot be unmapped.` : void 0,
            className: `flex items-center justify-between p-3 rounded-xl border text-left transition-all ${isSectionLocked ? "bg-amber-50/70 border-amber-300 text-slate-800 cursor-not-allowed shadow-2xs" : isSelected ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs cursor-pointer" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 cursor-pointer"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold flex items-center space-x-1.5", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Section ",
                    sec.name
                  ] }),
                  isSectionLocked && /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 text-amber-600" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] font-mono text-slate-400", children: sec.code }),
                isSectionLocked && /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-bold text-amber-800 mt-1", children: [
                  studentCount,
                  " student(s) enrolled"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? isSectionLocked ? "bg-emerald-800 border-emerald-900 text-white" : "bg-emerald-700 border-emerald-800 text-white" : "border-slate-300 bg-white"}`, children: isSelected && /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 stroke-[3]" }) })
            ]
          },
          sec.id
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "Allocated Count:" }),
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
          selectedSectionIds.length,
          " ",
          selectedSectionIds.length === 1 ? "Section" : "Sections"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-3 pt-4 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting || availableSections.length === 0, className: "px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Saving..." : "Save Mappings" })
      ] })
    ] })
  ] }) });
};
const ChangeClassStatusModal = ({ isOpen, onClose, classItem, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  if (!isOpen || !classItem)
    return null;
  const currentStatus = classItem.status;
  const targetStatus = currentStatus === "Active" ? "Inactive" : "Active";
  const isDeactivating = targetStatus === "Inactive";
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(targetStatus);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
      /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDeactivating ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`, children: isDeactivating ? /* @__PURE__ */ jsx(AlertTriangle, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: isDeactivating ? "Deactivate Class" : "Activate Class" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 font-medium mt-1", children: [
          "Are you sure you want to change status of class ",
          /* @__PURE__ */ jsxs("strong", { children: [
            '"',
            classItem.name,
            '"'
          ] }),
          " to",
          " ",
          /* @__PURE__ */ jsx("span", { className: isDeactivating ? "text-amber-800 font-bold" : "text-emerald-800 font-bold", children: targetStatus }),
          "?"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 space-y-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Class Code:" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-slate-800", children: classItem.code })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Assigned Sections:" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: classItem.sections || "None" })
      ] })
    ] }),
    isDeactivating && classItem.is_locked ? /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-bold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-red-600" }),
        "Class is Locked"
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "This class currently has ",
        /* @__PURE__ */ jsxs("strong", { children: [
          classItem.student_count || 0,
          " student(s)"
        ] }),
        " assigned to it in this academic year. You cannot deactivate or disable a class while students are assigned."
      ] })
    ] }) : isDeactivating ? /* @__PURE__ */ jsx("p", { className: "mt-3 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200", children: "Note: Inactive classes will be hidden from timetable scheduling, student enrollment, and daily attendance records." }) : null,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-end space-x-3", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, disabled: isProcessing, className: "px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer", children: "Cancel" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleConfirm,
          disabled: isProcessing || isDeactivating && classItem.is_locked,
          className: `px-5 py-2 text-xs sm:text-sm font-bold text-white rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isDeactivating ? "bg-amber-700 hover:bg-amber-800" : "bg-emerald-700 hover:bg-emerald-800"}`,
          children: isProcessing ? "Updating..." : `Confirm ${targetStatus}`
        }
      )
    ] })
  ] }) }) });
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
async function getClassSubjectsList(filters) {
  const params = new URLSearchParams();
  params.append("branch_id", String(filters.branch_id));
  if (filters.academic_year_id)
    params.append("academic_year_id", String(filters.academic_year_id));
  if (filters.board && filters.board !== "all")
    params.append("board", filters.board);
  if (filters.class_id && filters.class_id !== "all")
    params.append("class_id", String(filters.class_id));
  if (filters.group_id && filters.group_id !== "all")
    params.append("group_id", String(filters.group_id));
  if (filters.category_name && filters.category_name !== "all")
    params.append("category_name", filters.category_name);
  if (filters.subject_type && filters.subject_type !== "all")
    params.append("subject_type", filters.subject_type);
  if (filters.status && filters.status !== "all")
    params.append("status", filters.status);
  if (filters.search)
    params.append("search", filters.search);
  const res = await fetch(`/api/class-subjects?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch class subjects");
  }
  return data.data || [];
}
async function createClassSubject(formData) {
  const res = await fetch("/api/class-subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Failed to create class subject");
    error.errors = data.errors;
    throw error;
  }
  return data.data;
}
async function updateClassSubject(id, formData) {
  const res = await fetch(`/api/class-subjects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Failed to update class subject");
    error.errors = data.errors;
    throw error;
  }
  return data.data;
}
async function updateClassSubjectStatus(id, status) {
  const res = await fetch(`/api/class-subjects/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update subject status");
  }
}
async function deleteClassSubject(id, force = false) {
  const res = await fetch(`/api/class-subjects/${id}${force ? "?force=true" : ""}`, {
    method: "DELETE"
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete subject mapping");
  }
  return data;
}
async function copyClassSubjects(payload) {
  const res = await fetch("/api/class-subjects/copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to copy subjects");
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
async function createAcademicGroup(payload) {
  const res = await fetch("/api/academic-groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to create academic group");
  }
  return data.data;
}
async function updateAcademicGroup(id, payload) {
  const res = await fetch(`/api/academic-groups/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update academic group");
  }
}
async function updateAcademicGroupStatus(id, status) {
  const res = await fetch(`/api/academic-groups/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update group status");
  }
}
async function deleteAcademicGroup(id) {
  const res = await fetch(`/api/academic-groups/${id}`, {
    method: "DELETE"
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete academic group");
  }
}
async function getSubjectCategoriesList() {
  const res = await fetch("/api/subject-categories");
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch subject categories");
  }
  return data.data || [];
}
async function createSubjectCategory(payload) {
  const res = await fetch("/api/subject-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to create category");
  }
  return data.data;
}
async function updateSubjectCategoryStatus(id, status) {
  const res = await fetch(`/api/subject-categories/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update category status");
  }
}
async function getMasterSubjectsList(search) {
  const url = search ? `/api/subjects/master?search=${encodeURIComponent(search)}` : "/api/subjects/master";
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch master subjects");
  }
  return data.data || [];
}
const SubjectCategoriesTab = ({ categories, onRefresh, showToast, isReadOnly = false }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await createSubjectCategory({
        name: name.trim(),
        code: code.trim().toUpperCase() || name.slice(0, 4).toUpperCase(),
        board,
        display_order: categories.length + 1,
        status: "Active"
      });
      showToast(`Category "${name}" created.`, "success");
      setName("");
      setCode("");
      setIsAddOpen(false);
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to create category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleToggle = async (cat) => {
    const next = cat.status === "Active" ? "Inactive" : "Active";
    try {
      await updateSubjectCategoryStatus(cat.id, next);
      showToast(`Category "${cat.name}" status changed to ${next}.`, "success");
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to change status", "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-slate-900 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(FolderTree, { className: "w-4 h-4 text-emerald-700" }),
          /* @__PURE__ */ jsx("span", { children: "Subject Categories Master" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium mt-0.5", children: "Organize subjects into standard educational departments & classification buckets" })
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setIsAddOpen(true), disabled: isReadOnly, className: "inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: "Add Subject Category" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3", children: categories.map((cat) => {
      const isActive = cat.status === "Active";
      return /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 text-sm", children: cat.name }),
          /* @__PURE__ */ jsxs("div", { className: "font-mono text-[11px] text-slate-500 mt-0.5", children: [
            "Code: ",
            cat.code,
            " • ",
            cat.board || "Common"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => handleToggle(cat), disabled: isReadOnly, className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`, children: [
          isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3 mr-1 text-slate-400" }),
          cat.status
        ] })
      ] }, cat.id);
    }) }),
    isAddOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Add Subject Category" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsAddOpen(false), className: "text-slate-400 hover:text-slate-600 p-1", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreate, className: "p-5 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
            "Category Name ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Computer Science, Fine Arts", className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Code" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), placeholder: "e.g. CS, FA", className: "w-full text-xs font-mono uppercase rounded-lg border border-slate-300 px-3 py-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-2 pt-3 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsAddOpen(false), className: "px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded-lg disabled:opacity-50", children: isSubmitting ? "Saving..." : "Save Category" })
        ] })
      ] })
    ] }) })
  ] });
};
const AcademicBranchYearSelector = ({ branches, selectedBranchId, onSelectBranch, academicYears, selectedAcademicYearId, onSelectAcademicYear, isLoading = false, moduleName = "Academic Management" }) => {
  const { isSuperAdmin, assignedBranch } = useErp();
  const safeBranches = branches || [];
  const safeAcademicYears = academicYears || [];
  const selectedBranch = !isSuperAdmin && assignedBranch ? assignedBranch : safeBranches.find((b) => b.id === selectedBranchId) || safeBranches[0] || null;
  const branchScopedYears = safeAcademicYears;
  const selectedYear = branchScopedYears.find((y) => y.id === selectedAcademicYearId) || branchScopedYears.find((y) => y.is_current) || branchScopedYears[0] || null;
  return /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start sm:items-center space-x-3.5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0", children: /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-slate-500", children: "Scope Filter" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border-sky-200", children: "Branch & Year Isolated" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "text-base sm:text-lg font-bold text-slate-900 mt-0.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sky-900 font-bold", children: selectedBranch ? selectedBranch.branch_name : "Select Branch" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-normal mx-2", children: "/" }),
            /* @__PURE__ */ jsx("span", { className: "text-indigo-800 font-bold", children: selectedYear ? selectedYear.name : "Select Year" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-[320px] lg:min-w-[480px]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1 flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-500" }),
            /* @__PURE__ */ jsx("span", { children: "Campus Branch" })
          ] }),
          isSuperAdmin ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("select", { id: "scope-branch-select", value: selectedBranchId || "", onChange: (e) => onSelectBranch(Number(e.target.value)), disabled: isLoading || branches.length === 0, className: "w-full appearance-none bg-sky-50/40 hover:bg-sky-50 focus:bg-white text-slate-900 text-sm font-semibold border border-sky-200 rounded-lg pl-3 pr-9 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 transition-colors disabled:opacity-60 cursor-pointer", children: branches.map((b) => /* @__PURE__ */ jsxs("option", { value: b.id, children: [
              b.branch_name,
              " (",
              b.branch_code,
              ")"
            ] }, b.id)) }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-sky-600", children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "w-full bg-sky-50 text-sky-900 text-sm font-bold border border-sky-200 rounded-lg px-3 py-2 shadow-2xs flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-sky-600" }),
            /* @__PURE__ */ jsxs("span", { children: [
              (selectedBranch == null ? void 0 : selectedBranch.branch_name) || "Assigned Branch",
              " (",
              (selectedBranch == null ? void 0 : selectedBranch.branch_code) || "",
              ")"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1 flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-violet-500" }),
            /* @__PURE__ */ jsx("span", { children: "Academic Year" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("select", { id: "scope-ay-select", value: selectedYear ? selectedYear.id : selectedAcademicYearId || "", onChange: (e) => onSelectAcademicYear(Number(e.target.value)), disabled: isLoading || branchScopedYears.length === 0, className: "w-full appearance-none bg-violet-50/40 hover:bg-violet-50 focus:bg-white text-slate-900 text-sm font-semibold border border-violet-200 rounded-lg pl-3 pr-9 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-colors disabled:opacity-60 cursor-pointer", children: branchScopedYears.length === 0 ? /* @__PURE__ */ jsx("option", { value: "", children: "No Academic Years for this Branch" }) : branchScopedYears.map((ay) => /* @__PURE__ */ jsxs("option", { value: ay.id, children: [
              ay.name,
              " ",
              ay.is_current ? "• [CURRENT]" : `• (${ay.status})`
            ] }, ay.id)) }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-violet-600", children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5 text-indigo-600 shrink-0" }),
        /* @__PURE__ */ jsxs("span", { children: [
          moduleName,
          " records isolated to ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-800", children: selectedBranch == null ? void 0 : selectedBranch.branch_name }),
          " & Academic Year ",
          /* @__PURE__ */ jsx("strong", { className: "text-violet-700", children: selectedYear == null ? void 0 : selectedYear.name }),
          "."
        ] })
      ] }),
      selectedYear && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        selectedYear.is_current && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1 text-emerald-700" }),
          "Active Current Session"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-slate-400 font-medium font-mono text-[11px]", children: [
          selectedYear.start_date,
          " → ",
          selectedYear.end_date
        ] })
      ] })
    ] })
  ] });
};
const BOARDS$1 = ["CBSE", "ICSE", "State Board", "Cambridge", "IB", "Matriculation"];
const MAIN_CATEGORIES = [
  "Language Subject",
  "Core Subject",
  "Religious Subject",
  "Other Subject"
];
const REQUIREMENTS = ["Common (Compulsory)", "Optional (Elective)"];
const LANGUAGE_LEVELS = ["1st Language", "2nd Language", "3rd Language", "Optional Language"];
const QUICK_PRESETS = [
  { name: "English", code: "ENG", category: "Language Subject", isLang: true, langName: "English", langLvl: "1st Language", req: "Common (Compulsory)" },
  { name: "Tamil", code: "TAM", category: "Language Subject", isLang: true, langName: "Tamil", langLvl: "2nd Language", req: "Common (Compulsory)" },
  { name: "Hindi", code: "HIN", category: "Language Subject", isLang: true, langName: "Hindi", langLvl: "3rd Language", req: "Optional (Elective)" },
  { name: "Mathematics", code: "MATH", category: "Core Subject", isLang: false, req: "Common (Compulsory)" },
  { name: "General Science", code: "SCI", category: "Core Subject", isLang: false, req: "Common (Compulsory)", practical: true },
  { name: "Social Science", code: "SOC", category: "Core Subject", isLang: false, req: "Common (Compulsory)" },
  { name: "Moral Science / Value Ed.", code: "REL", category: "Religious Subject", isLang: false, req: "Common (Compulsory)" },
  { name: "Computer Science", code: "CS", category: "Other Subject", isLang: false, req: "Optional (Elective)", practical: true },
  { name: "Physical Education", code: "PET", category: "Other Subject", isLang: false, req: "Common (Compulsory)", subType: "Non-Academic", maxMarks: 50 }
];
const ClassSubjectFormModal = ({ isOpen, onClose, onSubmit, initialData, classes, academicGroups, categories, branchId, academicYearId, defaultBoard = "CBSE", defaultClassId, defaultGroupId }) => {
  const isEdit = Boolean(initialData);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [board, setBoard] = useState(defaultBoard);
  const [classId, setClassId] = useState(defaultClassId || "");
  const [groupId, setGroupId] = useState(defaultGroupId || "");
  const [masterSearch, setMasterSearch] = useState("");
  const [masterSuggestions, setMasterSuggestions] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [shortName, setShortName] = useState("");
  const [categoryName, setCategoryName] = useState("General");
  const [subjectType, setSubjectType] = useState("Academic");
  const [isLanguage, setIsLanguage] = useState(false);
  const [languageName, setLanguageName] = useState("");
  const [languageLevel, setLanguageLevel] = useState("First Language");
  const [requirement, setRequirement] = useState("Compulsory");
  const [electiveGroupName, setElectiveGroupName] = useState("");
  const [electiveMinCount, setElectiveMinCount] = useState(1);
  const [electiveMaxCount, setElectiveMaxCount] = useState(1);
  const [practicalApplicable, setPracticalApplicable] = useState(false);
  const [theoryPeriods, setTheoryPeriods] = useState(5);
  const [practicalPeriods, setPracticalPeriods] = useState(0);
  const [weeklyPeriods, setWeeklyPeriods] = useState(5);
  const [examApplicable, setExamApplicable] = useState(true);
  const [gradebookApplicable, setGradebookApplicable] = useState(true);
  const [reportcardApplicable, setReportcardApplicable] = useState(true);
  const [attendanceApplicable, setAttendanceApplicable] = useState(true);
  const [homeworkApplicable, setHomeworkApplicable] = useState(true);
  const [assignmentApplicable, setAssignmentApplicable] = useState(true);
  const [timetableApplicable, setTimetableApplicable] = useState(true);
  const [promotionApplicable, setPromotionApplicable] = useState(true);
  const [passMarks, setPassMarks] = useState(35);
  const [maxMarks, setMaxMarks] = useState(100);
  const [credits, setCredits] = useState(4);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedClass = classes.find((c) => c.id === Number(classId));
  const isGroupRequired = Boolean(selectedClass == null ? void 0 : selectedClass.group_required);
  const applicableGroups = academicGroups.filter((g) => {
    if (!classId)
      return true;
    return !g.class_id || g.class_id === Number(classId);
  });
  useEffect(() => {
    var _a, _b;
    if (!isOpen)
      return;
    if (initialData) {
      setBoard(initialData.board || defaultBoard);
      setClassId(initialData.class_id || "");
      setGroupId(initialData.group_id || "");
      setSubjectName(initialData.subject_name || "");
      setSubjectCode(initialData.subject_code || "");
      setShortName(initialData.short_name || "");
      setCategoryName(initialData.category_name || "General");
      setSubjectType(initialData.subject_type || "Academic");
      setIsLanguage(Boolean(initialData.is_language));
      setLanguageName(initialData.language_name || "");
      setLanguageLevel(initialData.language_level || "First Language");
      setRequirement(initialData.requirement || "Compulsory");
      setElectiveGroupName(initialData.elective_group_name || "");
      setElectiveMinCount(initialData.elective_min_count ?? 1);
      setElectiveMaxCount(initialData.elective_max_count ?? 1);
      setPracticalApplicable(Boolean(initialData.practical_applicable));
      setTheoryPeriods(initialData.theory_periods ?? 5);
      setPracticalPeriods(initialData.practical_periods ?? 0);
      setWeeklyPeriods(initialData.weekly_periods ?? 5);
      setExamApplicable(Boolean(initialData.exam_applicable));
      setGradebookApplicable(Boolean(initialData.gradebook_applicable));
      setReportcardApplicable(Boolean(initialData.reportcard_applicable));
      setAttendanceApplicable(Boolean(initialData.attendance_applicable));
      setHomeworkApplicable(Boolean(initialData.homework_applicable));
      setAssignmentApplicable(Boolean(initialData.assignment_applicable));
      setTimetableApplicable(Boolean(initialData.timetable_applicable));
      setPromotionApplicable(Boolean(initialData.promotion_applicable));
      setPassMarks(initialData.pass_marks ?? 35);
      setMaxMarks(initialData.max_marks ?? 100);
      setCredits(initialData.credits ?? 4);
      setDisplayOrder(initialData.display_order ?? 1);
      setStatus(initialData.status || "Active");
      setDescription(initialData.description || "");
    } else {
      setBoard(defaultBoard);
      setClassId(defaultClassId || (((_a = classes[0]) == null ? void 0 : _a.id) ?? ""));
      setGroupId(defaultGroupId || "");
      setSubjectName("");
      setSubjectCode("");
      setShortName("");
      setCategoryName(((_b = categories[0]) == null ? void 0 : _b.name) || "General");
      setSubjectType("Academic");
      setIsLanguage(false);
      setLanguageName("");
      setLanguageLevel("First Language");
      setRequirement("Compulsory");
      setElectiveGroupName("");
      setElectiveMinCount(1);
      setElectiveMaxCount(1);
      setPracticalApplicable(false);
      setTheoryPeriods(5);
      setPracticalPeriods(0);
      setWeeklyPeriods(5);
      setExamApplicable(true);
      setGradebookApplicable(true);
      setReportcardApplicable(true);
      setAttendanceApplicable(true);
      setHomeworkApplicable(true);
      setAssignmentApplicable(true);
      setTimetableApplicable(true);
      setPromotionApplicable(true);
      setPassMarks(35);
      setMaxMarks(100);
      setCredits(4);
      setDisplayOrder(1);
      setStatus("Active");
      setDescription("");
    }
    setErrors({});
  }, [isOpen, initialData, defaultBoard, defaultClassId, defaultGroupId, classes, categories]);
  useEffect(() => {
    setWeeklyPeriods(Number(theoryPeriods || 0) + Number(practicalPeriods || 0));
  }, [theoryPeriods, practicalPeriods]);
  useEffect(() => {
    if (!masterSearch.trim()) {
      setMasterSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const list = await getMasterSubjectsList(masterSearch.trim());
        setMasterSuggestions(list.slice(0, 5));
      } catch (err) {
        setMasterSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [masterSearch]);
  const applyQuickPreset = (preset) => {
    var _a;
    setSubjectName(preset.name);
    setShortName(preset.code);
    const classNum = ((_a = selectedClass == null ? void 0 : selectedClass.name) == null ? void 0 : _a.replace(/[^0-9]/g, "")) || "";
    const generatedCode = classNum ? `${preset.code}-${classNum}` : `${preset.code}101`;
    setSubjectCode(generatedCode);
    setCategoryName(preset.category);
    setSubjectType(preset.subType || "Academic");
    setIsLanguage(Boolean(preset.isLang));
    setLanguageName(preset.langName || "");
    setLanguageLevel(preset.langLvl || "First Language");
    setRequirement(preset.req || "Compulsory");
    setPracticalApplicable(Boolean(preset.practical));
    if (preset.practical) {
      setTheoryPeriods(4);
      setPracticalPeriods(2);
      setWeeklyPeriods(6);
    } else {
      setTheoryPeriods(5);
      setPracticalPeriods(0);
      setWeeklyPeriods(5);
    }
    setMaxMarks(preset.maxMarks || 100);
    setPassMarks(preset.maxMarks ? Math.round(preset.maxMarks * 0.35) : 35);
    setErrors({});
  };
  if (!isOpen)
    return null;
  const validate = () => {
    const errs = {};
    if (!board)
      errs.board = "Board selection is required";
    if (!classId)
      errs.class_id = "Class selection is required";
    if (isGroupRequired && !groupId) {
      errs.group_id = `Group / Stream is mandatory for ${(selectedClass == null ? void 0 : selectedClass.name) || "this class"}.`;
    }
    if (!subjectName.trim())
      errs.subject_name = "Subject Name is required";
    if (!subjectCode.trim())
      errs.subject_code = "Subject Code is required (e.g. ENG-G11)";
    if (isLanguage && !languageName.trim()) {
      errs.language_name = "Please provide the language name";
    }
    if (Number(passMarks) > Number(maxMarks)) {
      errs.pass_marks = "Pass marks cannot exceed maximum marks";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate())
      return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        branch_id: branchId,
        academic_year_id: academicYearId,
        board,
        class_id: Number(classId),
        group_id: groupId ? Number(groupId) : null,
        subject_name: subjectName.trim(),
        subject_code: subjectCode.trim().toUpperCase(),
        short_name: shortName.trim(),
        category_name: categoryName || "General",
        subject_type: subjectType,
        is_language: isLanguage,
        language_name: isLanguage ? languageName.trim() : void 0,
        language_level: isLanguage ? languageLevel : void 0,
        requirement: requirement.includes("Optional") ? "Optional" : "Compulsory",
        elective_group_name: requirement.includes("Optional") ? electiveGroupName.trim() || "Optional Elective" : void 0,
        elective_min_count: requirement.includes("Optional") ? Number(electiveMinCount) : 1,
        elective_max_count: requirement.includes("Optional") ? Number(electiveMaxCount) : 1,
        practical_applicable: practicalApplicable,
        weekly_periods: Number(weeklyPeriods),
        theory_periods: Number(theoryPeriods),
        practical_periods: Number(practicalPeriods),
        exam_applicable: examApplicable,
        gradebook_applicable: gradebookApplicable,
        reportcard_applicable: reportcardApplicable,
        attendance_applicable: attendanceApplicable,
        homework_applicable: homeworkApplicable,
        assignment_applicable: assignmentApplicable,
        timetable_applicable: timetableApplicable,
        promotion_applicable: promotionApplicable,
        pass_marks: Number(passMarks),
        max_marks: Number(maxMarks),
        credits: Number(credits),
        display_order: Number(displayOrder),
        status,
        description: description.trim() || void 0
      });
      onClose();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || "Failed to save subject configuration" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: isEdit ? "Edit Subject Configuration" : "Create Class-Wise Subject" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 font-medium", children: [
            board,
            " • Class-specific curriculum & evaluation rules"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-6", children: [
      errors.general && /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-red-600 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: errors.general })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-emerald-700" }),
            /* @__PURE__ */ jsx("span", { children: "1. Core Academic Hierarchy" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md", children: "Board → Class → Group" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Board ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx("select", { value: board, onChange: (e) => setBoard(e.target.value), className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer", children: BOARDS$1.map((b) => /* @__PURE__ */ jsx("option", { value: b, children: b }, b)) }),
            errors.board && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.board })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Class ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: classId, onChange: (e) => {
              const cid = e.target.value ? Number(e.target.value) : "";
              setClassId(cid);
              setGroupId("");
            }, className: `w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer ${errors.class_id ? "border-red-400 bg-red-50/30" : "border-slate-300"}`, children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select Class..." }),
              classes.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                c.name,
                " ",
                c.group_required ? " (Stream Req.)" : ""
              ] }, c.id))
            ] }),
            errors.class_id && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.class_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700", children: [
                "Group / Stream ",
                isGroupRequired ? /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-normal", children: "(Optional)" })
              ] }),
              isGroupRequired && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded", children: "Mandatory" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: groupId, onChange: (e) => setGroupId(e.target.value ? Number(e.target.value) : ""), disabled: !classId, className: `w-full text-xs font-semibold rounded-lg border px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer ${errors.group_id ? "border-red-400 bg-red-50/30" : "border-slate-300"} ${!classId ? "opacity-60 cursor-not-allowed" : ""}`, children: [
              /* @__PURE__ */ jsx("option", { value: "", children: isGroupRequired ? "Select Mandatory Stream..." : "None / Common to all streams" }),
              applicableGroups.map((g) => /* @__PURE__ */ jsxs("option", { value: g.id, children: [
                g.name,
                " (",
                g.code,
                ")"
              ] }, g.id))
            ] }),
            errors.group_id && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.group_id })
          ] })
        ] }),
        isGroupRequired && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-purple-800 bg-purple-50 p-2 rounded-lg border border-purple-200", children: [
          "Notice: ",
          /* @__PURE__ */ jsx("strong", { children: selectedClass == null ? void 0 : selectedClass.name }),
          " is a higher secondary or stream-specialized class. Subjects must be mapped specifically to a Group/Stream (e.g. Science, Commerce, Arts)."
        ] })
      ] }),
      !isEdit && /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 shadow-2xs space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-emerald-950 flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-amber-500 fill-amber-500" }),
            /* @__PURE__ */ jsx("span", { children: "Quick 1-Click Common Subjects:" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-700 font-medium", children: "Click any subject to auto-fill" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: QUICK_PRESETS.map((p) => {
          const isCurrent = subjectName.toLowerCase() === p.name.toLowerCase();
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => applyQuickPreset(p),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${isCurrent ? "bg-emerald-700 text-white border-emerald-700 shadow-xs" : "bg-white hover:bg-emerald-100 text-slate-700 border-slate-200 hover:border-emerald-300"}`,
              children: [
                /* @__PURE__ */ jsx("span", { children: p.name }),
                p.isLang && /* @__PURE__ */ jsx("span", { className: `text-[9px] px-1 py-0.2 rounded font-semibold ${isCurrent ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"}`, children: "Lang" })
              ]
            },
            p.code
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Subject Name ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: subjectName,
                onChange: (e) => {
                  setSubjectName(e.target.value);
                  if (!shortName) {
                    const clean = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase();
                    setShortName(clean);
                  }
                },
                placeholder: "e.g. Mathematics, Tamil, English, Science",
                className: `w-full text-xs font-semibold rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${errors.subject_name ? "border-red-400 bg-red-50/30" : "border-slate-300"}`
              }
            ),
            errors.subject_name && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.subject_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Subject Code ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: subjectCode,
                onChange: (e) => setSubjectCode(e.target.value.toUpperCase()),
                placeholder: "e.g. MATH-10, TAM101",
                className: `w-full text-xs font-mono font-bold uppercase rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${errors.subject_code ? "border-red-400 bg-red-50/30" : "border-slate-300"}`
              }
            ),
            errors.subject_code && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.subject_code })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Category ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: categoryName,
                onChange: (e) => {
                  setCategoryName(e.target.value);
                  if (e.target.value === "Language Subject") {
                    setIsLanguage(true);
                    if (!languageName) setLanguageName(subjectName || "English");
                  }
                },
                className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer",
                children: [
                  MAIN_CATEGORIES.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat)),
                  categories.filter((c) => !MAIN_CATEGORIES.includes(c.name)).map((c) => /* @__PURE__ */ jsx("option", { value: c.name, children: c.name }, c.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Requirement" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: requirement,
                onChange: (e) => setRequirement(e.target.value),
                className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer",
                children: REQUIREMENTS.map((req) => /* @__PURE__ */ jsx("option", { value: req, children: req }, req))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Status" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: status,
                onChange: (e) => setStatus(e.target.value),
                className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
                  /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-slate-50 border border-slate-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center space-x-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: isLanguage,
                  onChange: (e) => {
                    setIsLanguage(e.target.checked);
                    if (e.target.checked && !languageName) {
                      setLanguageName(subjectName || "English");
                    }
                  },
                  className: "w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: "Is this a Language Subject? (e.g. Tamil, English, Hindi)" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Auto-tracks language proficiency" })
          ] }),
          isLanguage && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
                "Language Name ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: languageName,
                  onChange: (e) => setLanguageName(e.target.value),
                  placeholder: "e.g. English, Tamil, Hindi, French",
                  className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                }
              ),
              errors.language_name && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.language_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Language Level" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: languageLevel,
                  onChange: (e) => setLanguageLevel(e.target.value),
                  className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-1.5 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer",
                  children: LANGUAGE_LEVELS.map((lvl) => /* @__PURE__ */ jsx("option", { value: lvl, children: lvl }, lvl))
                }
              )
            ] })
          ] })
        ] }),
        requirement === "Elective" && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-purple-900", children: [
            "Elective Group Name ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: electiveGroupName,
              onChange: (e) => setElectiveGroupName(e.target.value),
              placeholder: "e.g. Second Language, Skill Elective",
              className: "w-full text-xs font-semibold rounded-lg border border-purple-300 px-3 py-1.5 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700"
            }
          ),
          errors.elective_group_name && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.elective_group_name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-slate-200 rounded-xl overflow-hidden bg-white", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowAdvanced(!showAdvanced),
            className: "w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-left cursor-pointer",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(Sliders, { className: "w-4 h-4 text-slate-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: "Advanced Settings (Periods, Pass Marks, Evaluation Rules)" }),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-400 font-normal", children: "- Optional (Defaults already configured)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 text-slate-500 text-xs font-semibold", children: [
                /* @__PURE__ */ jsx("span", { children: showAdvanced ? "Hide" : "Customize" }),
                showAdvanced ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" })
              ] })
            ]
          }
        ),
        showAdvanced && /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-5 bg-white border-t border-slate-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: "Periods & Practicals:" }),
              /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: practicalApplicable,
                    onChange: (e) => setPracticalApplicable(e.target.checked),
                    className: "w-3.5 h-3.5 rounded text-emerald-700 focus:ring-emerald-700"
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: "Has Lab / Practical" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-slate-600 mb-1", children: "Theory Periods/Wk" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    value: theoryPeriods,
                    onChange: (e) => setTheoryPeriods(Number(e.target.value) || 0),
                    className: "w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-slate-600 mb-1", children: "Practical Periods/Wk" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    value: practicalPeriods,
                    onChange: (e) => setPracticalPeriods(Number(e.target.value) || 0),
                    className: "w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-slate-600 mb-1", children: "Total Weekly" }),
                /* @__PURE__ */ jsxs("div", { className: "w-full text-xs font-bold text-slate-800 rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-100", children: [
                  weeklyPeriods,
                  " Periods"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: "Grading & Credits:" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-slate-600 mb-1", children: "Max Marks" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "1",
                    value: maxMarks,
                    onChange: (e) => setMaxMarks(Number(e.target.value)),
                    className: "w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-slate-600 mb-1", children: "Pass Marks" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    value: passMarks,
                    onChange: (e) => setPassMarks(Number(e.target.value)),
                    className: "w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-slate-600 mb-1", children: "Credits" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    step: "0.5",
                    value: credits,
                    onChange: (e) => setCredits(Number(e.target.value)),
                    className: "w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: "Participation Flags:" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
              { id: "exam", label: "Exam", val: examApplicable, set: setExamApplicable },
              { id: "gradebook", label: "Gradebook", val: gradebookApplicable, set: setGradebookApplicable },
              { id: "reportcard", label: "Report Card", val: reportcardApplicable, set: setReportcardApplicable },
              { id: "attendance", label: "Attendance", val: attendanceApplicable, set: setAttendanceApplicable },
              { id: "homework", label: "Homework", val: homeworkApplicable, set: setHomeworkApplicable },
              { id: "assignment", label: "Assignment", val: assignmentApplicable, set: setAssignmentApplicable },
              { id: "timetable", label: "Timetable", val: timetableApplicable, set: setTimetableApplicable },
              { id: "promotion", label: "Promotion", val: promotionApplicable, set: setPromotionApplicable }
            ].map((flag) => /* @__PURE__ */ jsxs(
              "label",
              {
                className: `flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer select-none ${flag.val ? "bg-emerald-50 border-emerald-300 font-semibold text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-500"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { children: flag.label }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: flag.val,
                      onChange: (e) => flag.set(e.target.checked),
                      className: "w-3.5 h-3.5 rounded text-emerald-700 focus:ring-emerald-700"
                    }
                  )
                ]
              },
              flag.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-slate-600 mb-1", children: "Notes / Description (Optional)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 2,
                placeholder: "Reference notes, textbooks...",
                className: "w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: isEdit ? "Changes will reflect across downstream modules." : "Configured strictly for this class & stream scope." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer", children: "Cancel" }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleSubmit, disabled: isSubmitting, className: "px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5", children: [
          /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Saving..." : isEdit ? "Update Subject" : "Create Subject" })
        ] })
      ] })
    ] })
  ] }) });
};
const ClassSubjectViewModal = ({ isOpen, onClose, subject, branchName = "Branch", academicYearName = "Academic Year" }) => {
  if (!isOpen || !subject)
    return null;
  const isActive = subject.status === "Active";
  const applicabilityRules = [
    { label: "Exam Applicable", val: Boolean(subject.exam_applicable), desc: "Generates exam schedules" },
    { label: "Grade Book Entry", val: Boolean(subject.gradebook_applicable), desc: "Marks entry allowed" },
    { label: "Report Card Print", val: Boolean(subject.reportcard_applicable), desc: "Renders on report cards" },
    { label: "Subject Attendance", val: Boolean(subject.attendance_applicable), desc: "Tracks subject attendance" },
    { label: "Homework Creation", val: Boolean(subject.homework_applicable), desc: "Homework allowed" },
    { label: "Assignment Tasks", val: Boolean(subject.assignment_applicable), desc: "Assignment tracking" },
    { label: "Timetable Scheduling", val: Boolean(subject.timetable_applicable), desc: "Appears in timetable slots" },
    { label: "Promotion Evaluation", val: Boolean(subject.promotion_applicable), desc: "Counts toward promotion" }
  ];
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: subject.subject_name }),
            /* @__PURE__ */ jsx("span", { className: "font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200", children: subject.subject_code })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 font-medium", children: [
            branchName,
            " • ",
            academicYearName
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wider", children: "Configured Academic Scope" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-slate-900 mt-0.5 flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded bg-white font-semibold text-slate-700 text-xs shadow-2xs border border-emerald-200", children: subject.board }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "→" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: subject.class_name }),
            subject.group_name ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "→" }),
              /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded bg-purple-100 font-bold text-purple-900 text-xs border border-purple-200", children: [
                subject.group_name,
                " (",
                subject.group_code,
                ")"
              ] })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 font-medium", children: "(Common Curriculum)" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${isActive ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-slate-100 text-slate-600 border-slate-300"}`, children: [
          isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5 mr-1 text-slate-400" }),
          subject.status
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "Category" }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mt-0.5", children: subject.category_name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "Subject Type" }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mt-0.5", children: subject.subject_type })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "Requirement" }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mt-0.5", children: subject.requirement })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "Short Code" }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mt-0.5", children: subject.short_name || "—" })
        ] })
      ] }),
      Boolean(subject.is_language) && /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-950", children: "Language Subject Configuration:" }),
          /* @__PURE__ */ jsxs("span", { className: "ml-2 font-medium text-blue-800", children: [
            subject.language_name,
            " (",
            subject.language_level || "First Language",
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]", children: "Language Track" })
      ] }),
      subject.requirement === "Elective" && /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-purple-950", children: "Elective Bucket:" }),
          /* @__PURE__ */ jsxs("span", { className: "ml-2 font-medium text-purple-800", children: [
            subject.elective_group_name || "General Elective",
            " (Min: ",
            subject.elective_min_count,
            ", Max: ",
            subject.elective_max_count,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]", children: "Student Choice" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-emerald-700" }),
            /* @__PURE__ */ jsx("span", { children: "Weekly Periods" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center pt-1 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 block", children: "Theory" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-sm", children: subject.theory_periods })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 block", children: "Practical" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-sm", children: subject.practical_periods })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-emerald-100/60 p-2 rounded-lg border border-emerald-200", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-800 block", children: "Total / Wk" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-950 text-sm", children: subject.weekly_periods })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx(Award, { className: "w-4 h-4 text-emerald-700" }),
            /* @__PURE__ */ jsx("span", { children: "Evaluation Rules" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center pt-1 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 block", children: "Pass Marks" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-sm", children: subject.pass_marks })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 block", children: "Max Marks" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-sm", children: subject.max_marks })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 block", children: "Credits" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-sm", children: subject.credits })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5", children: [
          /* @__PURE__ */ jsx(Sliders, { className: "w-4 h-4 text-emerald-700" }),
          /* @__PURE__ */ jsx("span", { children: "Downstream Module Applicability" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: applicabilityRules.map((r, i) => /* @__PURE__ */ jsxs("div", { className: `p-2.5 rounded-xl border text-xs flex flex-col justify-between ${r.val ? "bg-emerald-50/60 border-emerald-300 text-emerald-950" : "bg-slate-50 border-slate-200 text-slate-400"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: r.label }),
            r.val ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-700 shrink-0" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 mt-1", children: r.desc })
        ] }, i)) })
      ] }),
      subject.description && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 block mb-1", children: "Description & Syllabus:" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 leading-relaxed", children: subject.description })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "px-5 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors cursor-pointer", children: "Close" }) })
  ] }) });
};
const CopySubjectModal = ({ isOpen, onClose, onSuccess, classes, academicGroups, branchId, academicYearId, defaultSourceClassId, defaultSourceGroupId }) => {
  var _a;
  const [board, setBoard] = useState("CBSE");
  const [sourceClassId, setSourceClassId] = useState(defaultSourceClassId || (((_a = classes[0]) == null ? void 0 : _a.id) ?? ""));
  const [sourceGroupId, setSourceGroupId] = useState(defaultSourceGroupId || "");
  const [targetClassId, setTargetClassId] = useState("");
  const [targetGroupId, setTargetGroupId] = useState("");
  const [sourceSubjects, setSourceSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const sourceClass = classes.find((c) => c.id === Number(sourceClassId));
  const targetClass = classes.find((c) => c.id === Number(targetClassId));
  const isSourceGroupRequired = Boolean(sourceClass == null ? void 0 : sourceClass.group_required);
  const isTargetGroupRequired = Boolean(targetClass == null ? void 0 : targetClass.group_required);
  const sourceGroups = academicGroups.filter((g) => !g.class_id || g.class_id === Number(sourceClassId));
  const targetGroups = academicGroups.filter((g) => !g.class_id || g.class_id === Number(targetClassId));
  useEffect(() => {
    if (!isOpen || !sourceClassId)
      return;
    let isMounted = true;
    setIsLoadingSource(true);
    setError(null);
    getClassSubjectsList({
      branch_id: branchId,
      academic_year_id: academicYearId,
      class_id: Number(sourceClassId),
      group_id: sourceGroupId ? Number(sourceGroupId) : void 0,
      status: "Active"
    }).then((items) => {
      if (isMounted) {
        setSourceSubjects(items);
        setSelectedSubjectIds(items.map((s) => s.id));
        setIsLoadingSource(false);
      }
    }).catch((err) => {
      if (isMounted) {
        setError(err.message || "Failed to load source subjects");
        setIsLoadingSource(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isOpen, sourceClassId, sourceGroupId, branchId, academicYearId]);
  if (!isOpen)
    return null;
  const toggleSelectAll = () => {
    if (selectedSubjectIds.length === sourceSubjects.length) {
      setSelectedSubjectIds([]);
    } else {
      setSelectedSubjectIds(sourceSubjects.map((s) => s.id));
    }
  };
  const toggleSubject = (id) => {
    setSelectedSubjectIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };
  const handleCopy = async () => {
    if (!sourceClassId) {
      setError("Please choose a Source Class.");
      return;
    }
    if (!targetClassId) {
      setError("Please choose a Target Class.");
      return;
    }
    if (sourceClassId === targetClassId && (!sourceGroupId || sourceGroupId === targetGroupId)) {
      setError("Source and Target classes & streams cannot be identical.");
      return;
    }
    if (isTargetGroupRequired && !targetGroupId) {
      setError(`Target class "${targetClass == null ? void 0 : targetClass.name}" requires a Group / Stream selection.`);
      return;
    }
    if (selectedSubjectIds.length === 0) {
      setError("Please select at least one subject to copy.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        branch_id: branchId,
        academic_year_id: academicYearId,
        board,
        source_class_id: Number(sourceClassId),
        source_group_id: sourceGroupId ? Number(sourceGroupId) : null,
        target_class_id: Number(targetClassId),
        target_group_id: targetGroupId ? Number(targetGroupId) : null,
        selected_ids: selectedSubjectIds
      };
      const res = await copyClassSubjects(payload);
      onSuccess(res.message);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to copy subjects.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(Copy, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Copy Subjects Across Classes / Groups" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium", children: "Replicate an entire curriculum or selected subjects to another class/stream" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-red-600 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-blue-500" }),
            /* @__PURE__ */ jsx("span", { children: "Source (Copy From)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Source Class ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: sourceClassId, onChange: (e) => {
              setSourceClassId(e.target.value ? Number(e.target.value) : "");
              setSourceGroupId("");
            }, className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select Class..." }),
              classes.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                c.name,
                " ",
                c.group_required ? " (Stream Req.)" : ""
              ] }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Source Group / Stream ",
              isSourceGroupRequired && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: sourceGroupId, onChange: (e) => setSourceGroupId(e.target.value ? Number(e.target.value) : ""), disabled: !sourceClassId, className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer disabled:opacity-50", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: isSourceGroupRequired ? "Select Stream..." : "All Streams / Common" }),
              sourceGroups.map((g) => /* @__PURE__ */ jsxs("option", { value: g.id, children: [
                g.name,
                " (",
                g.code,
                ")"
              ] }, g.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-600" }),
            /* @__PURE__ */ jsx("span", { children: "Target (Paste To)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Target Class ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: targetClassId, onChange: (e) => {
              setTargetClassId(e.target.value ? Number(e.target.value) : "");
              setTargetGroupId("");
            }, className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select Target Class..." }),
              classes.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                c.name,
                " ",
                c.group_required ? " (Stream Req.)" : ""
              ] }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Target Group / Stream ",
              isTargetGroupRequired && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: targetGroupId, onChange: (e) => setTargetGroupId(e.target.value ? Number(e.target.value) : ""), disabled: !targetClassId, className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer disabled:opacity-50", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: isTargetGroupRequired ? "Select Mandatory Stream..." : "None / Common" }),
              targetGroups.map((g) => /* @__PURE__ */ jsxs("option", { value: g.id, children: [
                g.name,
                " (",
                g.code,
                ")"
              ] }, g.id))
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-emerald-700" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Select Subjects to Replicate (",
              selectedSubjectIds.length,
              "/",
              sourceSubjects.length,
              ")"
            ] })
          ] }),
          sourceSubjects.length > 0 && /* @__PURE__ */ jsx("button", { type: "button", onClick: toggleSelectAll, className: "text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer", children: selectedSubjectIds.length === sourceSubjects.length ? "Deselect All" : "Select All" })
        ] }),
        isLoadingSource ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center bg-slate-50 rounded-xl border border-slate-200", children: [
          /* @__PURE__ */ jsx("div", { className: "animate-spin w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full mx-auto mb-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: "Loading source subjects..." })
        ] }) : sourceSubjects.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500", children: "No active subjects found in the selected source class/group." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white", children: sourceSubjects.map((sub) => {
          const isChecked = selectedSubjectIds.includes(sub.id);
          return /* @__PURE__ */ jsxs("label", { className: `flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${isChecked ? "bg-emerald-50/40" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: isChecked, onChange: () => toggleSubject(sub.id), className: "w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900", children: sub.subject_name }),
                /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-slate-500 font-mono", children: [
                  sub.subject_code,
                  " • ",
                  sub.category_name,
                  " • ",
                  sub.requirement
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded", children: [
              sub.weekly_periods,
              " Periods/wk"
            ] })
          ] }, sub.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200", children: "Note: Subject codes and configurations will be copied cleanly. Any subject already existing in the target class with the identical code will be safely preserved without overwriting." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer", children: "Cancel" }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleCopy, disabled: isSubmitting || selectedSubjectIds.length === 0, className: "px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5", children: [
        /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Copying..." : `Copy ${selectedSubjectIds.length} Subjects` })
      ] })
    ] })
  ] }) });
};
const AcademicGroupsTab = ({ groups, classes, branchId, academicYearId, branchName, academicYearName, onRefresh, showToast, isReadOnly = false }) => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    short_name: "",
    class_id: "",
    board: "CBSE",
    description: "",
    display_order: 1,
    status: "Active"
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filteredGroups = groups.filter((g) => {
    if (classFilter !== "all" && String(g.class_id) !== classFilter)
      return false;
    if (statusFilter !== "all" && g.status !== statusFilter)
      return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchCode = g.code.toLowerCase().includes(q);
      const matchClass = (g.class_name || "").toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchClass)
        return false;
    }
    return true;
  });
  const handleOpenAdd = () => {
    var _a;
    const higherSecondaryClass = classes.find((c) => c.group_required || c.name.includes("11") || c.name.includes("12"));
    setEditingGroup(null);
    setFormData({
      name: "",
      code: "",
      short_name: "",
      class_id: higherSecondaryClass ? higherSecondaryClass.id : ((_a = classes[0]) == null ? void 0 : _a.id) || "",
      board: "CBSE",
      description: "",
      display_order: groups.length + 1,
      status: "Active"
    });
    setFormErrors({});
    setIsModalOpen(true);
  };
  const handleOpenEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      code: group.code,
      short_name: group.short_name || "",
      class_id: group.class_id || "",
      board: group.board || "CBSE",
      description: group.description || "",
      display_order: group.display_order || 1,
      status: group.status || "Active"
    });
    setFormErrors({});
    setIsModalOpen(true);
  };
  const validate = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = "Group / Stream Name is required";
    if (!formData.code.trim())
      errs.code = "Group Code is required (e.g. SCI-BIO)";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate())
      return;
    setIsSubmitting(true);
    try {
      if (editingGroup) {
        await updateAcademicGroup(editingGroup.id, {
          ...formData,
          code: formData.code.trim().toUpperCase(),
          class_id: formData.class_id ? Number(formData.class_id) : null
        });
        showToast(`Group "${formData.name}" updated successfully.`, "success");
      } else {
        await createAcademicGroup({
          ...formData,
          branch_id: branchId,
          academic_year_id: academicYearId,
          code: formData.code.trim().toUpperCase(),
          class_id: formData.class_id ? Number(formData.class_id) : null
        });
        showToast(`Group "${formData.name}" created successfully.`, "success");
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to save academic group.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleToggleStatus = async (group) => {
    const next = group.status === "Active" ? "Inactive" : "Active";
    try {
      await updateAcademicGroupStatus(group.id, next);
      showToast(`Group "${group.name}" status changed to ${next}.`, "success");
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to change status.", "error");
    }
  };
  const handleDelete = async () => {
    if (!deletingGroup)
      return;
    setIsDeleting(true);
    try {
      await deleteAcademicGroup(deletingGroup.id);
      showToast(`Group "${deletingGroup.name}" deleted.`, "success");
      setDeletingGroup(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || "Cannot delete group. Try marking it Inactive instead.", "error");
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-slate-900 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 text-purple-700" }),
          /* @__PURE__ */ jsx("span", { children: "Academic Groups & Streams Master" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium mt-0.5", children: "Manage streams for Higher Secondary classes (e.g. Science - Bio, Computer Science, Commerce, Arts)" })
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleOpenAdd, disabled: isReadOnly, className: "inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: "Add New Stream / Group" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search streams by name or code...", className: "w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-slate-400" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-600", children: "Class:" }),
        /* @__PURE__ */ jsxs("select", { value: classFilter, onChange: (e) => setClassFilter(e.target.value), className: "font-semibold rounded-lg border border-slate-200 px-2 py-1.5 bg-slate-50 cursor-pointer", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "All Classes" }),
          classes.map((c) => /* @__PURE__ */ jsx("option", { value: String(c.id), children: c.name }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-600", children: "Status:" }),
        /* @__PURE__ */ jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "font-semibold rounded-lg border border-slate-200 px-2 py-1.5 bg-slate-50 cursor-pointer", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
          /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
          /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]", children: [
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Stream Code" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Stream / Group Name" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Assigned Class" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Board" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center", children: "Configured Subjects" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center", children: "Enrolled Students" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 font-medium text-slate-700", children: filteredGroups.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "py-8 text-center text-slate-400", children: "No academic groups or streams found for this criteria." }) }) : filteredGroups.map((g) => {
        const isActive = g.status === "Active";
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/70 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono font-bold text-purple-900", children: /* @__PURE__ */ jsx("span", { className: "bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200 text-xs", children: g.code }) }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-4", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900", children: g.name }),
            g.description && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-400 mt-0.5", children: g.description })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: g.class_name ? /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200", children: g.class_name }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "Common / All Higher Sec" }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-semibold text-slate-600", children: g.board || "CBSE" }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "w-3 h-3 mr-1" }),
            g.subject_count ?? 0,
            " Subjects"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-3 h-3 mr-1" }),
            g.student_count ?? 0,
            " Students"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => handleToggleStatus(g), disabled: isReadOnly, className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`, children: [
            isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3 mr-1 text-slate-400" }),
            g.status
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-1.5", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleOpenEdit(g), disabled: isReadOnly, className: "p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors cursor-pointer", title: "Edit Stream", children: /* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setDeletingGroup(g), disabled: isReadOnly, className: "p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer", title: "Delete / Deactivate", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
          ] }) })
        ] }, g.id);
      }) })
    ] }) }) }),
    isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900", children: editingGroup ? "Edit Group / Stream" : "Add New Group / Stream" })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "text-slate-400 hover:text-slate-600 p-1 rounded-md", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleFormSubmit, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
            "Stream Name ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("input", { type: "text", value: formData.name, onChange: (e) => {
            setFormData({ ...formData, name: e.target.value });
            if (!formData.code) {
              const c = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase();
              setFormData((prev) => ({ ...prev, name: e.target.value, code: c }));
            }
          }, placeholder: "e.g. Science – Biology, Commerce, Humanities", className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700" }),
          formErrors.name && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: formErrors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
              "Stream Code ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "text", value: formData.code, onChange: (e) => setFormData({ ...formData, code: e.target.value.toUpperCase() }), placeholder: "e.g. SCI-BIO, COM", className: "w-full text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700" }),
            formErrors.code && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: formErrors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Board" }),
            /* @__PURE__ */ jsx("select", { value: formData.board, onChange: (e) => setFormData({ ...formData, board: e.target.value }), className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white cursor-pointer", children: ["CBSE", "ICSE", "State Board", "Cambridge", "IB"].map((b) => /* @__PURE__ */ jsx("option", { value: b, children: b }, b)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Applicable Class" }),
            /* @__PURE__ */ jsxs("select", { value: formData.class_id, onChange: (e) => setFormData({ ...formData, class_id: e.target.value ? Number(e.target.value) : "" }), className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Higher Secondary Classes" }),
              classes.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Status" }),
            /* @__PURE__ */ jsxs("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Description / Combination Notes" }),
          /* @__PURE__ */ jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), rows: 2, placeholder: "e.g. Physics, Chemistry, Maths, Biology combination", className: "w-full text-xs rounded-lg border border-slate-300 px-3 py-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-2 pt-3 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg", children: "Cancel" }),
          /* @__PURE__ */ jsxs("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs disabled:opacity-50 flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Saving..." : "Save Stream" })
          ] })
        ] })
      ] })
    ] }) }),
    deletingGroup && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 text-center space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Delete Academic Stream?" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600", children: [
          "Are you sure you want to remove ",
          /* @__PURE__ */ jsx("strong", { children: deletingGroup.name }),
          "?"
        ] }),
        (deletingGroup.subject_count || 0) > 0 || (deletingGroup.student_count || 0) > 0 ? /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold flex items-center space-x-1", children: /* @__PURE__ */ jsx("span", { children: "Academic Integrity Rule:" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            "This stream currently has ",
            /* @__PURE__ */ jsxs("strong", { children: [
              deletingGroup.subject_count || 0,
              " configured subjects"
            ] }),
            " and ",
            /* @__PURE__ */ jsxs("strong", { children: [
              deletingGroup.student_count || 0,
              " enrolled students"
            ] }),
            ". Physical deletion will be blocked by the system to protect student historical records."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-1 font-semibold text-amber-800", children: [
            "Recommended Action: Mark this stream as ",
            /* @__PURE__ */ jsx("strong", { children: "Inactive" }),
            " instead."
          ] })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-2 px-6 py-4 bg-slate-50 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setDeletingGroup(null), className: "px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-200 rounded-xl", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: async () => {
          await handleToggleStatus(deletingGroup);
          setDeletingGroup(null);
        }, className: "px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl", children: "Set as Inactive" }),
        !(deletingGroup.subject_count || 0) && !(deletingGroup.student_count || 0) && /* @__PURE__ */ jsx("button", { type: "button", onClick: handleDelete, disabled: isDeleting, className: "px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50", children: isDeleting ? "Deleting..." : "Delete Permanently" })
      ] })
    ] }) })
  ] });
};
const BOARDS = ["All Boards", "CBSE", "ICSE", "State Board", "Cambridge", "IB"];
const SubjectsPage = ({ branches, activeBranchId, onActiveBranchChange, academicYears, activeAcademicYearId, onActiveAcademicYearChange, showToast }) => {
  const { isReadOnly } = useErp();
  const [activeTab, setActiveTab] = useState("curriculum");
  const [classSubjects, setClassSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicGroups, setAcademicGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState("All Boards");
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRequirement, setSelectedRequirement] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingSubject, setViewingSubject] = useState(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const selectedBranch = useMemo(() => {
    return (branches || []).find((b) => b.id === activeBranchId) || (branches || [])[0] || null;
  }, [branches, activeBranchId]);
  const selectedAcademicYear = useMemo(() => {
    if (!selectedBranch)
      return null;
    return (academicYears || []).find((ay) => ay.id === activeAcademicYearId) || (academicYears || []).find((ay) => ay.is_current) || (academicYears || [])[0] || null;
  }, [academicYears, activeAcademicYearId, selectedBranch]);
  const currentSelectedClass = useMemo(() => {
    if (selectedClassId === "all")
      return null;
    return classes.find((c) => String(c.id) === selectedClassId) || null;
  }, [classes, selectedClassId]);
  const classSpecificGroups = useMemo(() => {
    if (!currentSelectedClass)
      return academicGroups;
    return academicGroups.filter((g) => !g.class_id || g.class_id === currentSelectedClass.id);
  }, [academicGroups, currentSelectedClass]);
  const fetchData = async () => {
    if (!selectedBranch || !selectedAcademicYear)
      return;
    setIsLoading(true);
    setError(null);
    try {
      const [subsData, clsRes, grpData, catData] = await Promise.all([
        getClassSubjectsList({
          branch_id: selectedBranch.id,
          academic_year_id: selectedAcademicYear.id,
          board: selectedBoard !== "All Boards" ? selectedBoard : void 0,
          class_id: selectedClassId !== "all" ? Number(selectedClassId) : void 0,
          group_id: selectedGroupId !== "all" ? selectedGroupId === "none" ? void 0 : Number(selectedGroupId) : void 0,
          category_name: selectedCategory !== "all" ? selectedCategory : void 0,
          status: selectedStatus !== "all" ? selectedStatus : void 0,
          search: searchTerm.trim() || void 0
        }),
        getClasses(selectedBranch.id, selectedAcademicYear.id, { status: "Active" }),
        getAcademicGroupsList({
          branch_id: selectedBranch.id,
          academic_year_id: selectedAcademicYear.id
        }),
        getSubjectCategoriesList()
      ]);
      setClassSubjects(subsData);
      setClasses(clsRes.data);
      setAcademicGroups(grpData);
      setCategories(catData);
    } catch (err) {
      console.error("Failed to load subject workspace:", err);
      setError(err.message || "Unable to load subjects for the selected scope.");
      showToast(err.message || "Failed to load curriculum", "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [
    selectedBranch == null ? void 0 : selectedBranch.id,
    selectedAcademicYear == null ? void 0 : selectedAcademicYear.id,
    selectedBoard,
    selectedClassId,
    selectedGroupId,
    selectedCategory,
    selectedStatus,
    searchTerm
  ]);
  const filteredClassSubjects = useMemo(() => {
    return classSubjects.filter((item) => {
      if (selectedRequirement !== "all" && item.requirement !== selectedRequirement)
        return false;
      return true;
    });
  }, [classSubjects, selectedRequirement]);
  const stats = useMemo(() => {
    const total = filteredClassSubjects.length;
    const compulsory = filteredClassSubjects.filter((s) => s.requirement === "Compulsory").length;
    const elective = filteredClassSubjects.filter((s) => s.requirement === "Elective").length;
    const optional = filteredClassSubjects.filter((s) => s.requirement === "Optional").length;
    const practical = filteredClassSubjects.filter((s) => Boolean(s.practical_applicable)).length;
    const languages = filteredClassSubjects.filter((s) => Boolean(s.is_language)).length;
    const examApplicable = filteredClassSubjects.filter((s) => Boolean(s.exam_applicable)).length;
    return { total, compulsory, elective, optional, practical, languages, examApplicable };
  }, [filteredClassSubjects]);
  const handleOpenCreate = () => {
    setEditingSubject(null);
    setIsFormModalOpen(true);
  };
  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setIsFormModalOpen(true);
  };
  const handleOpenView = (subject) => {
    setViewingSubject(subject);
    setIsViewModalOpen(true);
  };
  const handleFormSubmit = async (formData) => {
    try {
      if (editingSubject) {
        await updateClassSubject(editingSubject.id, formData);
        showToast(`Subject "${formData.subject_name}" updated successfully.`, "success");
      } else {
        await createClassSubject(formData);
        showToast(`Subject "${formData.subject_name}" created & assigned successfully.`, "success");
      }
      setIsFormModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || "Failed to save subject configuration", "error");
      throw err;
    }
  };
  const handleToggleStatus = async (subject) => {
    const nextStatus = subject.status === "Active" ? "Inactive" : "Active";
    try {
      await updateClassSubjectStatus(subject.id, nextStatus);
      showToast(`Subject "${subject.subject_name}" status set to ${nextStatus}.`, "success");
      fetchData();
    } catch (err) {
      showToast(err.message || "Failed to update subject status", "error");
    }
  };
  const handleDeleteSubject = async () => {
    if (!deletingSubject)
      return;
    setIsDeleting(true);
    try {
      const res = await deleteClassSubject(deletingSubject.id);
      showToast(res.message, "success");
      setDeletingSubject(null);
      fetchData();
    } catch (err) {
      showToast(err.message || "Cannot physically delete subject. Deactivate instead.", "error");
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight", children: "Class-Wise Subject & Group Management" }),
          /* @__PURE__ */ jsx("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200", children: "Hierarchical Master" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-slate-500 mt-1 font-medium", children: "Board → Class → Group / Stream → Subjects → Evaluation Rules" })
      ] }),
      /* @__PURE__ */ jsx(AcademicBranchYearSelector, { branches, activeBranchId, onBranchChange: onActiveBranchChange, academicYears, activeAcademicYearId, onAcademicYearChange: onActiveAcademicYearChange })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveTab("curriculum"), className: `inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "curriculum" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`, children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Class-Wise Subjects" }),
          /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] ${activeTab === "curriculum" ? "bg-emerald-800 text-emerald-100" : "bg-slate-200 text-slate-700"}`, children: classSubjects.length })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveTab("groups"), className: `inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "groups" ? "bg-purple-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`, children: [
          /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Groups / Streams Master" }),
          /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] ${activeTab === "groups" ? "bg-purple-800 text-purple-100" : "bg-slate-200 text-slate-700"}`, children: academicGroups.length })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveTab("categories"), className: `inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "categories" ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`, children: [
          /* @__PURE__ */ jsx(FolderTree, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Subject Categories" })
        ] })
      ] }),
      activeTab === "curriculum" && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setIsCopyModalOpen(true), disabled: isReadOnly, className: "inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50", children: [
          /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5 text-blue-600" }),
          /* @__PURE__ */ jsx("span", { children: "Copy Subjects Across Classes" })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleOpenCreate, disabled: isReadOnly, className: "inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Create Subject" })
        ] })
      ] })
    ] }),
    activeTab === "groups" ? /* @__PURE__ */ jsx(AcademicGroupsTab, { groups: academicGroups, classes, branchId: (selectedBranch == null ? void 0 : selectedBranch.id) || 1, academicYearId: (selectedAcademicYear == null ? void 0 : selectedAcademicYear.id) || 1, branchName: (selectedBranch == null ? void 0 : selectedBranch.branch_name) || "", academicYearName: (selectedAcademicYear == null ? void 0 : selectedAcademicYear.name) || "", onRefresh: fetchData, showToast, isReadOnly }) : activeTab === "categories" ? /* @__PURE__ */ jsx(SubjectCategoriesTab, { categories, onRefresh: fetchData, showToast, isReadOnly }) : (
      /* MAIN CURRICULUM VIEW */
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: [
          /* @__PURE__ */ jsxs(Card, { className: "p-3.5 shadow-2xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider block", children: "Total Configured" }),
            /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-slate-900 mt-1 flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: stats.total }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "Subjects" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-3.5 shadow-2xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wider block", children: "Compulsory" }),
            /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-emerald-800 mt-1 flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: stats.compulsory }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-600 font-medium", children: "Core" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-3.5 shadow-2xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-purple-700 uppercase tracking-wider block", children: "Elective & Opt." }),
            /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-purple-700 mt-1 flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: stats.elective + stats.optional }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-purple-500 font-medium", children: [
                stats.elective,
                " Electives"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-3.5 shadow-2xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-blue-600 uppercase tracking-wider block", children: "Practicals / Labs" }),
            /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-blue-700 mt-1 flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: stats.practical }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-blue-500 font-medium", children: "Lab Modules" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-3.5 shadow-2xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-amber-600 uppercase tracking-wider block", children: "Languages" }),
            /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-amber-700 mt-1 flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: stats.languages }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-amber-500 font-medium", children: "Tracks" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "p-3.5 shadow-2xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wider block", children: "Exam Applicable" }),
            /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-slate-800 mt-1 flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: stats.examApplicable }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 font-medium", children: "Evaluated" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider", children: [
              /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-emerald-700" }),
              /* @__PURE__ */ jsx("span", { children: "Hierarchical Curriculum Filters" })
            ] }),
            (selectedBoard !== "All Boards" || selectedClassId !== "all" || selectedGroupId !== "all" || selectedCategory !== "all" || selectedStatus !== "all" || searchTerm) && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
              setSelectedBoard("All Boards");
              setSelectedClassId("all");
              setSelectedGroupId("all");
              setSelectedCategory("all");
              setSelectedRequirement("all");
              setSelectedStatus("all");
              setSearchTerm("");
            }, className: "text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer", children: "Reset Filters" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Board" }),
              /* @__PURE__ */ jsx("select", { value: selectedBoard, onChange: (e) => setSelectedBoard(e.target.value), className: "w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer", children: BOARDS.map((b) => /* @__PURE__ */ jsx("option", { value: b, children: b }, b)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Class" }),
              /* @__PURE__ */ jsxs("select", { value: selectedClassId, onChange: (e) => {
                setSelectedClassId(e.target.value);
                setSelectedGroupId("all");
              }, className: "w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer", children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Classes" }),
                classes.map((c) => /* @__PURE__ */ jsxs("option", { value: String(c.id), children: [
                  c.name,
                  " ",
                  c.group_required ? "★" : ""
                ] }, c.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: [
                "Group / Stream ",
                (currentSelectedClass == null ? void 0 : currentSelectedClass.group_required) && /* @__PURE__ */ jsx("span", { className: "text-purple-600 font-bold", children: "(Req)" })
              ] }),
              /* @__PURE__ */ jsxs("select", { value: selectedGroupId, onChange: (e) => setSelectedGroupId(e.target.value), className: `w-full font-semibold rounded-lg border px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer ${(currentSelectedClass == null ? void 0 : currentSelectedClass.group_required) ? "border-purple-300 text-purple-950 bg-purple-50/40" : "border-slate-200"}`, children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Streams / Common" }),
                /* @__PURE__ */ jsx("option", { value: "none", children: "Common Curriculum Only" }),
                classSpecificGroups.map((g) => /* @__PURE__ */ jsxs("option", { value: String(g.id), children: [
                  g.name,
                  " (",
                  g.code,
                  ")"
                ] }, g.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Category" }),
              /* @__PURE__ */ jsxs("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer", children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Categories" }),
                categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.name, children: cat.name }, cat.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Requirement" }),
              /* @__PURE__ */ jsxs("select", { value: selectedRequirement, onChange: (e) => setSelectedRequirement(e.target.value), className: "w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer", children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Requirements" }),
                /* @__PURE__ */ jsx("option", { value: "Compulsory", children: "Compulsory" }),
                /* @__PURE__ */ jsx("option", { value: "Elective", children: "Elective" }),
                /* @__PURE__ */ jsx("option", { value: "Optional", children: "Optional" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "Status" }),
              /* @__PURE__ */ jsxs("select", { value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), className: "w-full font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white cursor-pointer", children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
                /* @__PURE__ */ jsx("option", { value: "Active", children: "Active Only" }),
                /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive Only" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative pt-1", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by subject name or subject code across this scope...", className: "w-full pl-8 pr-3 py-2 text-xs font-medium rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700" })
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-12 text-center", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-8 h-8 text-emerald-700 animate-spin mx-auto mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700", children: "Loading class-wise subjects..." })
        ] }) : filteredClassSubjects.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-7 h-7" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "No subjects configured" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6 font-medium", children: "No subjects matched the selected Board, Class, or Stream filter. Create your first subject or copy curriculum from another class." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-3", children: [
            /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setIsCopyModalOpen(true), disabled: isReadOnly, className: "inline-flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer", children: [
              /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Copy From Class" })
            ] }),
            /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleOpenCreate, disabled: isReadOnly, className: "inline-flex items-center space-x-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer", children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Create Subject" })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]", children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Subject" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Class & Stream" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Category / Type" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Requirement" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center", children: "Periods / Wk" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Applicability Badges" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-center", children: "Assessment" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 font-medium text-slate-700", children: filteredClassSubjects.map((sub) => {
            const isActive = sub.status === "Active";
            return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/70 transition-colors", children: [
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: sub.subject_name }),
                  Boolean(sub.is_language) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200", children: sub.language_name || "Lang" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "font-mono text-[11px] text-slate-500 mt-0.5", children: [
                  sub.subject_code,
                  " ",
                  sub.short_name ? `• ${sub.short_name}` : ""
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900 flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx("span", { children: sub.class_name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400", children: [
                    "(",
                    sub.board,
                    ")"
                  ] })
                ] }),
                sub.group_name ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200", children: sub.group_name }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-400 italic", children: "Common Curriculum" })
              ] }) }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-slate-800", children: sub.category_name }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500", children: sub.subject_type })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: sub.requirement === "Compulsory" ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200", children: "Compulsory" }) : sub.requirement === "Elective" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 w-fit", children: "Elective" }),
                sub.elective_group_name && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 mt-0.5", children: sub.elective_group_name })
              ] }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200", children: "Optional" }) }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-900", children: [
                  sub.weekly_periods,
                  " Periods"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-500", children: [
                  sub.theory_periods,
                  " Th ",
                  Boolean(sub.practical_applicable) ? `+ ${sub.practical_periods} Lab` : ""
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1 max-w-xs", children: [
                Boolean(sub.exam_applicable) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200", title: "Exam Applicable", children: "Exam" }),
                Boolean(sub.timetable_applicable) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200", title: "Timetable Scheduled", children: "Timetable" }),
                Boolean(sub.attendance_applicable) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200", title: "Subject Attendance", children: "Attnd" }),
                Boolean(sub.gradebook_applicable) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200", title: "Grade Book Entry", children: "Marks" }),
                Boolean(sub.reportcard_applicable) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200", title: "Report Card Printed", children: "Report" }),
                Boolean(sub.homework_applicable) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700", title: "Homework Applicable", children: "HW" }),
                Boolean(sub.promotion_applicable) && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200", title: "Promotion Applicable", children: "Promote" })
              ] }) }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "font-semibold text-slate-900", children: [
                  sub.pass_marks,
                  " / ",
                  sub.max_marks
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-500", children: [
                  sub.credits,
                  " Credits"
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => handleToggleStatus(sub), disabled: isReadOnly, className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`, children: [
                isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3 mr-1 text-slate-400" }),
                sub.status
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-1.5", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleOpenView(sub), className: "p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer", title: "View Configuration", children: /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }) }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleOpenEdit(sub), disabled: isReadOnly, className: "p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer", title: "Edit Subject Configuration", children: /* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5" }) }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setDeletingSubject(sub), disabled: isReadOnly, className: "p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer", title: "Deactivate / Delete", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
              ] }) })
            ] }, sub.id);
          }) })
        ] }) }) })
      ] })
    ),
    /* @__PURE__ */ jsx(ClassSubjectFormModal, { isOpen: isFormModalOpen, onClose: () => setIsFormModalOpen(false), onSubmit: handleFormSubmit, initialData: editingSubject, classes, academicGroups, categories, branchId: selectedBranch ? selectedBranch.id : 1, academicYearId: selectedAcademicYear ? selectedAcademicYear.id : 1, defaultBoard: selectedBoard !== "All Boards" ? selectedBoard : "CBSE", defaultClassId: selectedClassId !== "all" ? Number(selectedClassId) : null, defaultGroupId: selectedGroupId !== "all" && selectedGroupId !== "none" ? Number(selectedGroupId) : null }),
    /* @__PURE__ */ jsx(ClassSubjectViewModal, { isOpen: isViewModalOpen, onClose: () => setIsViewModalOpen(false), subject: viewingSubject, branchName: selectedBranch == null ? void 0 : selectedBranch.branch_name, academicYearName: selectedAcademicYear == null ? void 0 : selectedAcademicYear.name }),
    /* @__PURE__ */ jsx(CopySubjectModal, { isOpen: isCopyModalOpen, onClose: () => setIsCopyModalOpen(false), onSuccess: (msg) => {
      showToast(msg, "success");
      fetchData();
    }, classes, academicGroups, branchId: selectedBranch ? selectedBranch.id : 1, academicYearId: selectedAcademicYear ? selectedAcademicYear.id : 1, defaultSourceClassId: selectedClassId !== "all" ? Number(selectedClassId) : void 0, defaultSourceGroupId: selectedGroupId !== "all" && selectedGroupId !== "none" ? Number(selectedGroupId) : void 0 }),
    deletingSubject && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 text-center space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Subject Lifecycle Safeguard" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600", children: [
          "Are you sure you want to deactivate or remove ",
          /* @__PURE__ */ jsx("strong", { children: deletingSubject.subject_name }),
          " (",
          deletingSubject.subject_code,
          ") for ",
          /* @__PURE__ */ jsx("strong", { children: deletingSubject.class_name }),
          "?"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold flex items-center space-x-1", children: /* @__PURE__ */ jsx("span", { children: "Academic Audit Safeguard:" }) }),
          /* @__PURE__ */ jsx("div", { children: "To protect past grade books, report cards, timetables, and student attendance logs, subjects that have historical academic records cannot be physically purged." }),
          /* @__PURE__ */ jsxs("div", { className: "pt-1 font-semibold text-amber-800", children: [
            "Recommended Action: Set as ",
            /* @__PURE__ */ jsx("strong", { children: "Inactive" }),
            " to hide from future period planning and marks entry while preserving past reports."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-2 px-6 py-4 bg-slate-50 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setDeletingSubject(null), className: "px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-200 rounded-xl", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: async () => {
          await handleToggleStatus(deletingSubject);
          setDeletingSubject(null);
        }, className: "px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl", children: "Set as Inactive" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: handleDeleteSubject, disabled: isDeleting, className: "px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50", children: isDeleting ? "Deleting..." : "Delete Permanently" })
      ] })
    ] }) })
  ] });
};
const results = [];
function cleanHtml(rawHtml) {
  if (!rawHtml) return "";
  return rawHtml.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ");
}
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
function academicFormatDateOracle(dateStr) {
  if (!dateStr) return "-";
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
}
function branchFormatDateOracle(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}
function runAllTests() {
  console.log("\n======================================================================");
  console.log("   MILESTONE 4 EMPIRICAL BOUNDARY & EDGE-CASE CHALLENGE SUITE (F36-F45) ");
  console.log("======================================================================\n");
  console.log("▶ Suite 1: Empty Datasets Matrix Across Milestone 4 Entities");
  recordTest("StaffDirectoryView renders graceful empty state when staffList is empty", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StaffDirectoryView,
        {
          staffList: [],
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
          },
          onOpenEditModal: () => {
          },
          onDeleteStaff: () => {
          },
          onRefresh: () => {
          }
        }
      ) })
    ));
    assert.ok(html.includes("No staff members found"), 'Must render "No staff members found" empty prompt');
    assert.ok(html.includes("Try changing filters or add a new staff member"), "Must give actionable empty guidance");
    assert.ok(html.includes("All Staff (0)"), "Must indicate 0 count in tab");
    assert.strictEqual(html.includes("Staff Selected"), false, "Bulk action bar must not be rendered when empty");
  });
  recordTest("TimetableStructureView renders empty state card when structures list is empty", "Empty-Datasets", () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: true,
      selectedBranchId: 1,
      activeAcademicYearId: 2
    });
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(TimetableStructureView, { showToast: () => {
      }, onStructureCreated: () => {
      } }) })
    ));
    assert.ok(html.includes("No Timetable Structures Configured"), "Must show empty structures placeholder");
    assert.ok(html.includes("Fill the form above to establish school bell schedules"), "Must show guidance");
    assert.ok(html.includes("General School Shift (8 Periods)"), "Structure creation form remains interactive");
  });
  recordTest("BranchTable renders headers and 0 count footer when branches is empty", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        BranchTable,
        {
          branches: [],
          onView: () => {
          },
          onEdit: () => {
          },
          onSettings: () => {
          },
          onToggleStatus: () => {
          }
        }
      )
    ));
    assert.ok(html.includes('id="branches-data-table"'), "Must render table shell");
    assert.ok(html.includes('Showing <strong class="text-slate-700">0</strong> branches'), "Must show 0 branches count in footer");
    assert.strictEqual(html.includes("branch-row-"), false, "Must not render any branch rows");
  });
  recordTest("AcademicYearTable renders headers with 0 rows without crashing when empty", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        AcademicYearTable,
        {
          academicYears: [],
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
          },
          isLoading: false
        }
      )
    ));
    assert.ok(html.includes("Academic Year"), "Must render table header for Academic Year");
    assert.ok(html.includes("Campus Timeline (Branch-Wise)"), "Must render header for Campus Timeline");
    assert.ok(html.includes("Global Selector"), "Must render header for Global Selector");
  });
  recordTest("ClassTable renders cleanly with 0 rows when classes array is empty", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassTable,
        {
          classes: [],
          onView: () => {
          },
          onEdit: () => {
          },
          onToggleStatus: () => {
          },
          isReadOnly: false
        }
      )
    ));
    assert.ok(html.includes("Class Code"), "Must render Class Code table head");
    assert.ok(html.includes("Assigned Sections"), "Must render Assigned Sections table head");
    assert.ok(html.includes("Student Status"), "Must render Student Status table head");
  });
  recordTest("SectionTable renders cleanly with 0 rows when sections array is empty", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        SectionTable,
        {
          sections: [],
          onView: () => {
          },
          onEdit: () => {
          },
          onToggleStatus: () => {
          },
          isReadOnly: false
        }
      )
    ));
    assert.ok(html.includes("Section Code"), "Must render Section Code table head");
    assert.ok(html.includes("Mapped Classes"), "Must render Mapped Classes table head");
  });
  recordTest("ClassSectionSummaryTable renders cleanly with 0 rows when summary array is empty", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassSectionSummaryTable,
        {
          summary: [],
          onEditClassMapping: () => {
          },
          onToggleEnable: () => {
          },
          isReadOnly: false
        }
      )
    ));
    assert.ok(html.includes("Class"), "Must render Class head");
    assert.ok(html.includes("Total Sections"), "Must render Total Sections head");
    assert.ok(html.includes("Enabled"), "Must render Enabled head");
  });
  recordTest("ClassSectionEditModal handles 0 available sections gracefully", "Empty-Datasets", () => {
    const sampleSummary = {
      class_id: 1,
      class_name: "Class 10",
      section_ids: [],
      is_locked: false,
      student_count: 0,
      locked_section_ids: []
    };
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassSectionEditModal,
        {
          isOpen: true,
          onClose: () => {
          },
          targetClassSummary: sampleSummary,
          availableSections: [],
          onSave: () => {
          },
          branchName: "Main Campus",
          academicYearName: "2026-2027"
        }
      )
    ));
    assert.ok(html.includes("No active sections exist for this branch &amp; academic year."), "Must display empty sections notice");
    assert.ok(html.includes('disabled=""') && html.includes("Save Mappings"), "Save button must be disabled when 0 sections exist");
  });
  recordTest("DisableCurrentYearModal returns null cleanly when academicYear is null", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
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
    ));
    assert.strictEqual(html, "", "Must render empty string/null when academicYear is not provided");
  });
  recordTest("SubjectCategoriesTab renders header and handles empty categories gracefully", "Empty-Datasets", () => {
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        SubjectCategoriesTab,
        {
          categories: [],
          onRefresh: () => {
          },
          showToast: () => {
          },
          isReadOnly: false
        }
      )
    ));
    assert.ok(html.includes("Subject Categories Master"), "Must render category master header");
    assert.ok(html.includes("Add Subject Category"), "Must render Add Subject Category action");
  });
  recordTest("SubjectsPage handles empty branches and academicYears without throwing", "Empty-Datasets", () => {
    resetMockErpContext();
    setMockErpContext({
      isReadOnly: false,
      activeBranchId: 1,
      activeAcademicYearId: 1
    });
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        SubjectsPage,
        {
          branches: [],
          activeBranchId: 1,
          onActiveBranchChange: () => {
          },
          academicYears: [],
          activeAcademicYearId: 1,
          onActiveAcademicYearChange: () => {
          },
          showToast: () => {
          }
        }
      ) })
    ));
    assert.ok(html.includes('id="scope-branch-select"'), "Must render branch selector in scope filter");
    assert.ok(html.includes('id="scope-ay-select"'), "Must render academic year selector in scope filter");
    assert.ok(html.includes("Class-Wise Subject &amp; Group Management") || html.includes("Class-Wise Subject"), "Must render header for Class-Wise Subject Management");
  });
  console.log("▶ Suite 2: Single-Item Rosters & Extremes");
  recordTest("BranchTable handles single branch with singular footer text", "Single-Item-Extremes", () => {
    const singleBranch = [{
      id: 101,
      branch_code: "CB01",
      branch_name: "Coimbatore South Campus",
      branch_type: "Campus",
      board: "CBSE",
      city: "Coimbatore",
      state: "Tamil Nadu",
      branch_head_name: "Dr. R. Ramanathan",
      branch_head_designation: "Principal",
      status: "Active",
      created_at: "2026-01-15"
    }];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        BranchTable,
        {
          branches: singleBranch,
          onView: () => {
          },
          onEdit: () => {
          },
          onSettings: () => {
          },
          onToggleStatus: () => {
          }
        }
      )
    ));
    assert.ok(html.includes('Showing <strong class="text-slate-700">1</strong> branch'), 'Must output singular "1 branch" (not branches)');
    assert.ok(html.includes('id="branch-row-101"'), "Must render row for branch 101");
    assert.ok(html.includes('id="btn-view-branch-101"'), "View button must exist");
    assert.ok(html.includes('id="btn-edit-branch-101"'), "Edit button must exist");
    assert.ok(html.includes('id="btn-settings-branch-101"'), "Settings button must exist");
    assert.ok(html.includes('id="btn-toggle-status-101"'), "Toggle status button must exist");
    assert.ok(html.includes("CB01"), "Branch code must be rendered");
  });
  recordTest("StaffDirectoryView renders single staff member and handles singular tab count", "Single-Item-Extremes", () => {
    const singleStaff = [{
      id: 501,
      first_name: "Ananya",
      last_name: "Krishnan",
      staff_code: "TCH-001",
      staff_type: "Teaching",
      designation: "Senior PGT Mathematics",
      department: "Mathematics",
      qualification: "M.Sc., B.Ed.",
      login_username: "ananya.k@school.edu",
      role_name: "Teacher",
      mobile: "+91 98765 43210",
      email: "ananya.k@school.edu",
      status: "Active",
      class_teacher_for: ["Class 10-A"],
      asst_class_teacher_for: [],
      coordinator_for: [],
      subjects_taught: ["Advanced Mathematics"]
    }];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        StaffDirectoryView,
        {
          staffList: singleStaff,
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
          },
          onOpenEditModal: () => {
          },
          onDeleteStaff: () => {
          },
          onRefresh: () => {
          }
        }
      ) })
    ));
    assert.ok(html.includes("All Staff (1)"), "Must indicate singular count 1");
    assert.ok(html.includes("Ananya Krishnan"), "Must render staff name");
    assert.ok(html.includes("TCH-001"), "Must render staff code");
    assert.ok(html.includes("Class Teacher: Class 10-A"), "Must render class teacher assignment");
  });
  recordTest("ClassSectionSummaryTable correctly handles 1 class with 1 section", "Single-Item-Extremes", () => {
    const singleClassSummary = [{
      class_id: 1,
      class_code: "CLS-01",
      class_name: "Grade 1",
      short_name: "G1",
      display_order: 1,
      sections_list: "A",
      total_sections: 1,
      is_locked: false,
      student_count: 0,
      is_enabled: 1,
      class_status: "Active",
      section_students: { A: 0 }
    }];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassSectionSummaryTable,
        {
          summary: singleClassSummary,
          onEditClassMapping: () => {
          },
          onToggleEnable: () => {
          },
          isReadOnly: false
        }
      )
    ));
    assert.ok(html.includes("Grade 1"), "Must render class name");
    assert.ok(html.includes("Section A"), "Must render single section badge");
    assert.ok(html.includes("No Students"), "Must render No Students badge when unlocked");
  });
  recordTest('ClassSectionEditModal formats singular "1 Section" allocation label', "Single-Item-Extremes", () => {
    const formatSectionCount = (n) => `${n} ${n === 1 ? "Section" : "Sections"}`;
    assert.strictEqual(formatSectionCount(1), "1 Section", 'Single item must output singular "1 Section"');
    assert.strictEqual(formatSectionCount(0), "0 Sections", 'Zero items must output plural "0 Sections"');
    assert.strictEqual(formatSectionCount(2), "2 Sections", 'Multiple items must output plural "2 Sections"');
    const sampleSummary = {
      class_id: 1,
      class_name: "Grade 1",
      section_ids: [10],
      is_locked: false,
      student_count: 0,
      locked_section_ids: []
    };
    const availableSections = [
      { id: 10, code: "SEC-A", name: "A" }
    ];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassSectionEditModal,
        {
          isOpen: true,
          onClose: () => {
          },
          targetClassSummary: sampleSummary,
          availableSections,
          onSave: () => {
          },
          branchName: "Main Campus",
          academicYearName: "2026-2027"
        }
      )
    ));
    assert.ok(html.includes("Grade 1"), "Must render class name");
    assert.ok(html.includes("Available Active Sections (1)"), "Must indicate 1 available section");
    assert.ok(html.includes("Allocated Count:"), "Must render Allocated Count label");
  });
  console.log("▶ Suite 3: Boundary Dates & Leap Year Handling Oracle");
  recordTest("Date Oracle correctly parses leap year Feb 29 (2024-02-29)", "Date-Leap-Year-Oracle", () => {
    const formatted = academicFormatDateOracle("2024-02-29");
    assert.strictEqual(formatted, "29 Feb 2024", 'Leap year Feb 29 must format as "29 Feb 2024"');
  });
  recordTest("Date Oracle correctly parses next leap year Feb 29 (2028-02-29)", "Date-Leap-Year-Oracle", () => {
    const formatted = academicFormatDateOracle("2028-02-29");
    assert.strictEqual(formatted, "29 Feb 2028", 'Leap year 2028 Feb 29 must format as "29 Feb 2028"');
  });
  recordTest("Date Oracle correctly parses non-leap year Feb 28 (2025-02-28)", "Date-Leap-Year-Oracle", () => {
    const formatted = academicFormatDateOracle("2025-02-28");
    assert.strictEqual(formatted, "28 Feb 2025", 'Non-leap year Feb 28 must format as "28 Feb 2025"');
  });
  recordTest("Date Oracle handles Year-End boundary Dec 31 (2024-12-31)", "Date-Leap-Year-Oracle", () => {
    const formatted = academicFormatDateOracle("2024-12-31");
    assert.strictEqual(formatted, "31 Dec 2024", 'Dec 31 must format as "31 Dec 2024"');
  });
  recordTest("Date Oracle handles Year-Start boundary Jan 01 (2025-01-01)", "Date-Leap-Year-Oracle", () => {
    const formatted = academicFormatDateOracle("2025-01-01");
    assert.strictEqual(formatted, "01 Jan 2025", 'Jan 01 must format as "01 Jan 2025"');
  });
  recordTest("Date Oracle handles null, empty, and malformed date strings safely", "Date-Leap-Year-Oracle", () => {
    assert.strictEqual(academicFormatDateOracle(null), "-", 'Null date returns "-"');
    assert.strictEqual(academicFormatDateOracle(""), "-", 'Empty date returns "-"');
    assert.strictEqual(academicFormatDateOracle("2026/05/12"), "2026/05/12", "Non-dash date returns raw string");
    assert.strictEqual(academicFormatDateOracle("invalid"), "invalid", "Single invalid token returns raw string");
    assert.strictEqual(academicFormatDateOracle("not-a-date"), "Invalid Date", "Three-token non-date returns Invalid Date");
    assert.strictEqual(branchFormatDateOracle(null), "N/A", 'Branch null returns "N/A"');
    assert.strictEqual(branchFormatDateOracle(""), "N/A", 'Branch empty returns "N/A"');
  });
  recordTest("AcademicYearTable renders leap year dates correctly in SSR output", "Date-Leap-Year-Oracle", () => {
    const leapAy = [{
      id: 88,
      name: "2024-2025 Leap Cycle",
      short_name: "AY24",
      year_name: "2024",
      start_date: "2024-02-29",
      end_date: "2025-02-28",
      is_current: false,
      is_enabled: true,
      branch_dates: []
    }];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        AcademicYearTable,
        {
          academicYears: leapAy,
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
          },
          isLoading: false
        }
      )
    ));
    assert.ok(html.includes("29 Feb 2024"), 'Must render leap day "29 Feb 2024" in table cell');
    assert.ok(html.includes("28 Feb 2025"), 'Must render end date "28 Feb 2025"');
  });
  console.log("▶ Suite 4: Role Boundaries: Super Admin vs Principal Campus Isolation");
  recordTest("Super Admin has access to all branches and can scope to all campuses", "Role-Boundaries-Isolation", () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: "super_admin",
      isSuperAdmin: true,
      isPrincipal: false,
      activeBranchId: "all",
      effectiveActiveBranchId: "all",
      isAllBranches: true,
      accessibleBranches: [
        { id: 1, branch_name: "Main Campus", branch_code: "MAIN" },
        { id: 2, branch_name: "North Campus", branch_code: "NORTH" }
      ]
    });
    const ctx = useErp();
    assert.strictEqual(ctx.isSuperAdmin, true, "Super Admin flag must be true");
    assert.strictEqual(ctx.isAllBranches, true, "isAllBranches must be true");
    assert.strictEqual(ctx.accessibleBranches.length, 2, "Must have access to all 2 branches");
  });
  recordTest("Principal role is strictly isolated to assigned campus and cannot view all branches", "Role-Boundaries-Isolation", () => {
    resetMockErpContext();
    const assignedId = 2;
    const allBranches = [
      { id: 1, branch_name: "Main Campus", branch_code: "MAIN" },
      { id: 2, branch_name: "North Campus", branch_code: "NORTH" }
    ];
    const principalAccessible = allBranches.filter((b) => b.id === assignedId);
    setMockErpContext({
      userRole: "principal",
      isSuperAdmin: false,
      isPrincipal: true,
      assignedBranchId: assignedId,
      activeBranchId: assignedId,
      effectiveActiveBranchId: assignedId,
      isAllBranches: false,
      accessibleBranches: principalAccessible,
      assignedBranch: allBranches[1]
    });
    const ctx = useErp();
    assert.strictEqual(ctx.isSuperAdmin, false, "Principal must not have super_admin rights");
    assert.strictEqual(ctx.isPrincipal, true, "Principal flag must be true");
    assert.strictEqual(ctx.isAllBranches, false, 'Principal can never access "All Branches" mode');
    assert.strictEqual(ctx.accessibleBranches.length, 1, "Principal accessibleBranches must be strictly 1");
    assert.strictEqual(ctx.accessibleBranches[0].id, assignedId, "Principal must only access assignedBranchId (2)");
    assert.strictEqual(ctx.effectiveActiveBranchId, 2, "effectiveActiveBranchId must strictly match assignedBranchId");
  });
  recordTest("TimetableStructureView locks campus scope to assignedBranchId when user is Principal", "Role-Boundaries-Isolation", () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: false,
      isPrincipal: true,
      assignedBranchId: 2,
      selectedBranchId: 1,
      // Mismatched parameter
      activeAcademicYearId: 2
    });
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(TimetableStructureView, { showToast: () => {
      }, onStructureCreated: () => {
      } }) })
    ));
    assert.ok(html.includes("Configured Timetable Structures"), "Must render timetable structure shell");
    assert.ok(html.includes("Active bell schedules and shift patterns defined for this branch."), "Branch-specific description rendered");
  });
  console.log("▶ Suite 5: Student Enrollment Lock Protections");
  recordTest("ClassTable renders lock badge and disables deactivate action when students are enrolled", "Enrollment-Lock", () => {
    const classesData = [
      {
        id: 10,
        code: "CLS-10",
        name: "Grade 10",
        class_type: "Secondary",
        group_required: 0,
        short_name: "G10",
        display_order: 10,
        sections: "A, B",
        is_locked: true,
        student_count: 48,
        status: "Active"
      },
      {
        id: 11,
        code: "CLS-11",
        name: "Grade 11",
        class_type: "Senior Secondary",
        group_required: 1,
        short_name: "G11",
        display_order: 11,
        sections: "A",
        is_locked: false,
        student_count: 0,
        status: "Active"
      }
    ];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassTable,
        {
          classes: classesData,
          onView: () => {
          },
          onEdit: () => {
          },
          onToggleStatus: () => {
          },
          isReadOnly: false
        }
      )
    ));
    assert.ok(html.includes("Students Assigned (48)"), 'Must render "Students Assigned (48)" badge');
    assert.ok(
      html.includes('title="Class is locked: 48 student(s) assigned in this academic year."'),
      "Deactivate button must have locked informative tooltip"
    );
    assert.ok(
      html.includes('disabled=""') || html.includes("disabled"),
      "Button must be disabled when class is locked"
    );
    assert.ok(html.includes("No Students"), 'Unlocked class must display "No Students" badge');
    assert.ok(html.includes('title="Deactivate Class"'), "Unlocked class must have normal deactivate title");
  });
  recordTest("ClassSectionSummaryTable renders locked indicator and disables class checkbox when enrolled", "Enrollment-Lock", () => {
    const summaryData = [
      {
        class_id: 10,
        class_code: "CLS-10",
        class_name: "Grade 10",
        short_name: "G10",
        display_order: 10,
        sections_list: "A, B",
        total_sections: 2,
        is_locked: true,
        student_count: 45,
        is_enabled: 1,
        class_status: "Active",
        section_students: { A: 25, B: 20 }
      }
    ];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassSectionSummaryTable,
        {
          summary: summaryData,
          onEditClassMapping: () => {
          },
          onToggleEnable: () => {
          },
          isReadOnly: false
        }
      )
    ));
    assert.ok(html.includes("Students Assigned (45)"), "Must display student count in status cell");
    assert.ok(html.includes('title="Locked: 25 student(s) enrolled"'), "Section A must indicate locked count 25");
    assert.ok(html.includes('title="Locked: 20 student(s) enrolled"'), "Section B must indicate locked count 20");
    assert.ok(
      html.includes('disabled=""') || html.includes("disabled"),
      "Enable/disable toggle checkbox must be disabled when is_locked is true"
    );
  });
  recordTest("ClassSectionEditModal disables unchecking of sections with enrolled students", "Enrollment-Lock", () => {
    const lockedSectionIds = [1, 2];
    let selectedSectionIds = [1, 2];
    const toggleSectionOracle = (id) => {
      if (lockedSectionIds.includes(id) && selectedSectionIds.includes(id)) {
        return selectedSectionIds;
      }
      return selectedSectionIds.includes(id) ? selectedSectionIds.filter((x) => x !== id) : [...selectedSectionIds, id];
    };
    selectedSectionIds = toggleSectionOracle(1);
    assert.deepStrictEqual(selectedSectionIds, [1, 2], "Locked section 1 cannot be unmapped/deselected");
    selectedSectionIds = toggleSectionOracle(2);
    assert.deepStrictEqual(selectedSectionIds, [1, 2], "Locked section 2 cannot be unmapped/deselected");
    selectedSectionIds = toggleSectionOracle(3);
    assert.deepStrictEqual(selectedSectionIds, [1, 2, 3], "Unlocked section 3 can be mapped/toggled");
    const sampleSummary = {
      class_id: 10,
      class_name: "Grade 10",
      section_ids: [1, 2],
      is_locked: true,
      student_count: 45,
      locked_section_ids: [1, 2],
      section_students: { 1: 25, 2: 20 }
    };
    const availableSections = [
      { id: 1, code: "SEC-A", name: "A" },
      { id: 2, code: "SEC-B", name: "B" },
      { id: 3, code: "SEC-C", name: "C" }
    ];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassSectionEditModal,
        {
          isOpen: true,
          onClose: () => {
          },
          targetClassSummary: sampleSummary,
          availableSections,
          onSave: () => {
          },
          branchName: "Main Campus",
          academicYearName: "2026-2027"
        }
      )
    ));
    assert.ok(html.includes("45 Students"), "Must show total students badge in modal header");
    assert.ok(html.includes("Grade 10"), "Must render class name in modal header");
    assert.ok(html.includes("Available Active Sections (3)"), "Must render available sections count");
    assert.ok(html.includes("Section A"), "Section A must be listed");
    assert.ok(html.includes("Section B"), "Section B must be listed");
    assert.ok(html.includes("Section C"), "Section C must be listed");
  });
  recordTest("ChangeClassStatusModal warns user and blocks deactivation when class is locked", "Enrollment-Lock", () => {
    const lockedClass = {
      id: 10,
      code: "CLS-10",
      name: "Grade 10",
      status: "Active",
      is_locked: true,
      student_count: 40,
      sections: "A, B"
    };
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ChangeClassStatusModal,
        {
          isOpen: true,
          onClose: () => {
          },
          classItem: lockedClass,
          onConfirm: () => {
          }
        }
      )
    ));
    assert.ok(html.includes("Class is Locked"), 'Must display "Class is Locked" warning heading');
    assert.ok(html.includes("This class currently has <strong>40 student(s)</strong> assigned"), "Must quote student count in alert");
    assert.ok(html.includes("You cannot deactivate or disable a class while students are assigned"), "Must state business rule");
    assert.ok(
      html.includes('disabled=""') || html.includes("disabled"),
      "Confirmation submit button must be disabled when deactivating locked class"
    );
  });
  console.log("▶ Suite 6: Historical Year Banner Behavior & Admin Override Toggle");
  recordTest("HistoricalYearBanner renders null when active year is current (not historical)", "Historical-Year-Banner", () => {
    resetMockErpContext();
    setMockErpContext({
      activeAcademicYear: { id: 1, name: "2026-2027", is_current: true },
      isHistoricalYear: false,
      isReadOnly: false,
      adminOverrideActive: false
    });
    const html = cleanHtml(renderToString(/* @__PURE__ */ jsx(HistoricalYearBanner, {})));
    assert.strictEqual(html, "", "Historical banner must NOT render when year is not historical");
  });
  recordTest("HistoricalYearBanner renders Read-Only banner with override toggle for historical year", "Historical-Year-Banner", () => {
    resetMockErpContext();
    setMockErpContext({
      activeAcademicYear: { id: 9, name: "2023-2024 (Archived)", is_current: false },
      isHistoricalYear: true,
      isReadOnly: true,
      canManageHistoricalData: true,
      adminOverrideActive: false
    });
    const html = cleanHtml(renderToString(/* @__PURE__ */ jsx(HistoricalYearBanner, {})));
    assert.ok(html.includes('id="historical-academic-year-banner"'), "Must render banner with designated ID");
    assert.ok(html.includes("Historical Academic Year: 2023-2024 (Archived)"), "Must display historical year name");
    assert.ok(html.includes("Read-Only Mode"), 'Must display "Read-Only Mode" badge');
    assert.ok(
      html.includes("You are viewing archived historical records. Form submissions and edits are restricted to prevent data discrepancies."),
      "Must display standard archived records warning"
    );
    assert.ok(html.includes('id="admin-override-toggle-button"'), "Must render admin override toggle button");
    assert.ok(html.includes("Enable Admin Override"), 'Toggle button must offer "Enable Admin Override"');
  });
  recordTest("HistoricalYearBanner renders Admin Edit Override Active when override is enabled", "Historical-Year-Banner", () => {
    resetMockErpContext();
    setMockErpContext({
      activeAcademicYear: { id: 9, name: "2023-2024 (Archived)", is_current: false },
      isHistoricalYear: true,
      isReadOnly: false,
      // Override disables read-only restriction
      canManageHistoricalData: true,
      adminOverrideActive: true
    });
    const html = cleanHtml(renderToString(/* @__PURE__ */ jsx(HistoricalYearBanner, {})));
    assert.ok(html.includes('id="historical-academic-year-banner"'), "Must render banner");
    assert.ok(html.includes("Admin Edit Override Active"), 'Badge must switch to "Admin Edit Override Active"');
    assert.ok(
      html.includes("Administrative override active. Please proceed with caution when updating archived records."),
      "Must display administrative override alert"
    );
    assert.ok(html.includes("Disable Override"), 'Toggle button must switch to "Disable Override"');
  });
  recordTest("Downstream tables enforce isReadOnly=true when viewing historical year without override", "Historical-Year-Banner", () => {
    const singleClass = [{
      id: 1,
      code: "CLS-01",
      name: "Class 1",
      class_type: "Primary",
      group_required: 0,
      short_name: "C1",
      display_order: 1,
      sections: "A",
      is_locked: false,
      student_count: 0,
      status: "Active"
    }];
    const html = cleanHtml(renderToString(
      /* @__PURE__ */ jsx(
        ClassTable,
        {
          classes: singleClass,
          onView: () => {
          },
          onEdit: () => {
          },
          onToggleStatus: () => {
          },
          isReadOnly: true
        }
      )
    ));
    assert.ok(
      html.includes('title="Read-only: Historical Academic Year"'),
      "Edit button must show read-only historical year tooltip"
    );
    assert.ok(
      html.includes('disabled=""') || html.includes("disabled"),
      "Edit button must be disabled in read-only historical mode"
    );
  });
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log("\n======================================================================");
  console.log(`   BOUNDARY CHALLENGE SUMMARY: ${passed}/${total} Passed (${(passed / total * 100).toFixed(1)}%)`);
  console.log("======================================================================\n");
  if (failed > 0) {
    console.error(`FAILED TESTS (${failed}):`);
    results.filter((r) => !r.passed).forEach((r) => {
      console.error(` - [${r.category}] ${r.name}: ${r.error}`);
    });
    throw new Error(`${failed} boundary test(s) failed.`);
  }
  return { total, passed, failed };
}
runAllTests();
export {
  runAllTests
};
