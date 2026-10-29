# Project: School Web ERP shadcn/ui Migration

## Architecture
- **Framework & Bundler**: React 19.0.1, Vite 6.2.3 / 6.4.5, ECMAScript/JSX.
- **Routing**: React Router DOM 7.18.3 with `BrowserRouter`, `ProtectedRoute` role verification, and nested `AppLayout`.
- **Styling**: Tailwind CSS 4.1.14 with `@tailwindcss/vite` and `@theme inline` mapping in `src/index.css`.
- **Theme Palette**: Vibrant Modern aesthetic (Sky Blue primary `#0284c7`, Emerald accent `#10b981`, Slate neutrals `#f8fafc`/`#0f172a`, smooth rounded borders `0.625rem`).
- **Design Primitives**: shadcn/ui suite in `src/components/ui/` based on `@radix-ui/*` primitives, `class-variance-authority`, `clsx`, and `tailwind-merge`.
- **State & Context**: `ErpContext.jsx` managing user auth, role scoping (`super_admin`, `principal`, `teacher`, `student`), multi-campus branch scoping, academic year lifecycle, and toast notifications.
- **Service Layer**: REST/Mock API services in `src/services/` (`api.js`, `attendanceApi.js`, `communicationService.js`, `staffService.js`, `timetableService.js`, `anecdoteService.js`, `permissionService.js`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Vite Alias & Path Resolution | Configure `@` -> `./src` and create `jsconfig.json` | M1 | survey |
| 2 | Tailwind v4 Theme Tokens | `@theme inline` and Vibrant Modern CSS variables in `src/index.css` | M1 | survey |
| 3 | Radix UI Dependencies | Install `@radix-ui/*`, `sonner`, and utility packages | M1 | survey |
| 4 | Primitive: button.jsx | shadcn button with Sky Blue primary, Emerald accent, outline, ghost variants | M1 | survey |
| 5 | Primitive: badge.jsx | shadcn badge with Vibrant Modern variants (default, secondary, outline, emerald, destructive) | M1 | survey |
| 6 | Primitive: card.jsx | shadcn card components with border-border and rounded-xl | M1 | survey |
| 7 | Primitive: input.jsx | shadcn input with focus-visible:ring-ring and border-input | M1 | survey |
| 8 | Primitive: table.jsx | shadcn table components with responsive overflow and subtle hover | M1 | survey |
| 9 | Primitive: dialog.jsx | Radix dialog with portal, animated backdrop overlay, and clean content styling | M1 | survey |
| 10 | Primitive: sheet.jsx | Radix dialog-based slide-in sheet drawer for mobile nav and side panels | M1 | survey |
| 11 | Primitive: dropdown-menu.jsx | Radix dropdown menu for user profiles, action menus, and filters | M1 | survey |
| 12 | Primitive: select.jsx | Radix select with trigger, value, content, items, and indicators | M1 | survey |
| 13 | Primitive: tabs.jsx | Radix tabs with clean pill/underline triggers and animated content | M1 | survey |
| 14 | Primitive: avatar.jsx | Radix avatar with image and fallback initials | M1 | survey |
| 15 | Primitive: toast.jsx | Unified toast notification primitive (Sonner wrapper) | M1 | survey |
| 16 | Primitive: calendar.jsx | Calendar grid primitive for date picking and scheduling | M1 | survey |
| 17 | Primitive: popover.jsx | Radix popover for tooltips and contextual flyouts | M1 | survey |
| 18 | Primitive: separator.jsx | Radix separator for visual hierarchy | M1 | survey |
| 19 | Primitives Barrel Export | `src/components/ui/index.js` exporting all UI primitives | M1 | survey |
| 20 | Global AppLayout Shell | Modernized `AppLayout.jsx` container, responsive layout, and spreadsheet matrix condition | M2 | survey |
| 21 | Sidebar Navigation | 16 modules, 7 collapsible groups, active pill indicators, student menu | M2 | survey |
| 22 | Mobile Sheet Drawer | Responsive navigation drawer using shadcn `Sheet` on `< md` viewports | M2 | survey |
| 23 | Topbar Header | Quick actions, branding, academic cycle indicator, and breadcrumb | M2 | survey |
| 24 | Branch Selector Integration | Reintegrate `BranchSelector.jsx` into Topbar with multi-campus role scoping | M2 | survey |
| 25 | Academic Year Switcher | Topbar year switcher and historical year warning banner | M2 | survey |
| 26 | User Profile & Logout Flow | `DropdownMenu` + `Avatar` with role display and logout action | M2 | survey |
| 27 | Route Guards & Navigation Integrity | Strict preservation of 22+ routes, `ProtectedRoute` rules, and transitions | M2 | survey |
| 28 | Dashboard Module | Operational, SuperAdmin, and Student dashboards with stat cards, metrics, and charts | M3 | survey |
| 29 | Students Directory Table | SIS data table with search, class/section/status filters, sorting, and pagination | M3 | survey |
| 30 | Student Admission Modal | Multi-step admission wizard using shadcn `Dialog` and `Tabs` | M3 | survey |
| 31 | Student 360 Profile Sheet | Comprehensive 16-tab student profile drawer using `Sheet`/`Dialog` and `Avatar` | M3 | survey |
| 32 | Student Spreadsheet & Transfer | Student reference update matrix, CSV import/export, and class promotion wizard | M3 | survey |
| 33 | Attendance Roll-Call | Daily roll-call matrix with rapid P/A/L/HD toggles and absent parent alerts | M3 | survey |
| 34 | Attendance Timings & Setup | Morning/afternoon session windows and class-timing mapping tables | M3 | survey |
| 35 | Attendance History & Reports | Audited logs, monthly summaries, and student portal calendar view | M3 | survey |
| 36 | Homework Management | Staff publishing form, deadline badges, download chips, and student homework portal | M4 | survey |
| 37 | Assignments & Grading | Interactive submission review `Sheet`, grading `Dialog`, and student upload dialog | M4 | survey |
| 38 | Communication Notices | Notice board priority cards (`Card`, `Badge`) and audience targeting dialog | M4 | survey |
| 39 | Gallery & Media Lightbox | Album photo grid and full-screen lightbox zoom preview dialog | M4 | survey |
| 40 | Staff Directory & Workload | Staff directory table/cards, onboarding modal, password reset, and workload view | M4 | survey |
| 41 | Timetable Grid Matrix | Weekly schedule table with period slots, subject cards, and allocation modal | M4 | survey |
| 42 | Role & Permissions Matrix | Permissions toggle tree table (`MenuAssignmentPage`) with module checkboxes | M4 | survey |
| 43 | Branches Management View | Campus registry, branch head assignment, status toggles, and edit dialogs | M4 | survey |
| 44 | Academic Settings & Curricular | Academic year lifecycle, classes, sections, and subjects setup | M4 | survey |
| 45 | Examination, Calendar, Anecdotes | Assessment term setup, monthly event calendar, behavioral logs, user management | M4 | survey |
| 46 | E2E Test Suite Pass (Tiers 1-4) | 100% pass across all E2E test cases verified by runner | M5 | test-track |
| 47 | Adversarial Coverage Hardening | Tier 5 white-box stress testing, boundary fuzzing, and regression elimination | M5 | test-track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirements-driven test runner and Tiers 1-4 test suite; publishes TEST_READY.md | none | IN_PROGRESS |
| M1 | Design System & Primitives | Tailwind v4 config, theme tokens, Radix UI packages, complete 15-primitive UI library | none | PLANNED |
| M2 | Global Shell & Navigation | AppLayout, Sidebar with Sheet drawer, Topbar with Branch/Year switchers, Profile menu | M1 | PLANNED |
| M3 | Core SIS, Attendance & Dashboard | Dashboard views, Students directory/modals/matrix, Daily attendance & timings | M1, M2 | PLANNED |
| M4 | Communication, Staff & Operations | Homework, Assignments, Announcements, Gallery, Staff, Timetable, Settings | M1, M2 | PLANNED |
| M5 | Final Milestone: Acceptance & Hardening | 100% E2E test suite pass (Tiers 1-4) followed by Tier 5 adversarial hardening | M3, M4, E2E | PLANNED |

## Interface Contracts
### Primitives ↔ Shell & Modules
- `components/ui/*`: Export standardized components (`Button`, `Card`, `Badge`, `Dialog`, `Sheet`, `DropdownMenu`, `Select`, `Tabs`, `Avatar`, `Table`, `Input`, `Calendar`, `Popover`, `Separator`).
- Import paths: `@/components/ui/<primitive>` or `@/components/ui` barrel export.
- Styling tokens: `primary` (Sky Blue), `accent` (Emerald), `border`, `card`, `muted`, `destructive`, `ring`.

### Shell ↔ Pages & Modules
- `AppLayout.jsx`: Injects `NavigationHeader`, `Sidebar`, `Breadcrumb`, `Outlet`, `ToastContainer`.
- Hides Sidebar when path matches `isStudentUpdatePage` (`/students/update`).
- Mobile breakpoint (`< 768px`): Sidebar collapses into `Sheet` triggered from Topbar menu button.
- Topbar: Exposes `BranchSelector` (scoping `activeBranchId`) and `AcademicYearSelector` (scoping `activeAcademicYearId`).

### Data & Service Contracts
- Service methods in `src/services/` must retain all method signatures and return types.
- `ErpContext.jsx` state hooks (`useErp()`) must retain all exported properties: `currentUser`, `userRole`, `activeBranchId`, `activeAcademicYearId`, `showToast`, etc.

## Code Layout
- `src/index.css`: Tailwind v4 theme definitions and Vibrant Modern CSS variables.
- `src/lib/utils.js`: `cn()` utility combining `clsx` and `tailwind-merge`.
- `src/components/ui/`: 15 canonical shadcn UI primitives + `index.js`.
- `src/components/layout/`: `AppLayout.jsx`, `Sidebar.jsx`, `NavigationHeader.jsx`, `Breadcrumb.jsx`.
- `src/components/dashboard/`: Dashboard view components.
- `src/components/students/`: SIS directory, modals, profile sheets, and update tables.
- `src/components/attendance/`: Attendance roll-call, timings, history, and reports.
- `src/components/communication/`: Homework, assignments, announcements, gallery.
- `src/components/staff/`: Staff directory, onboarding, credentials, and workload.
- `src/components/timetable/`: Timetable structures, allocations, and class mappings.
- `src/components/settings/`: Menu and permission assignment matrix.
- `src/components/branches/`: Branch management and branch selector.
- `src/components/academic/`: Academic years, classes, and subjects.
- `tests/e2e/`: Requirement-driven E2E test runner and test suites (Tiers 1-4).
