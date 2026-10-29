# Test Infrastructure Specification: School Web ERP

## 1. Test Philosophy
The School Web ERP test suite operates under a strict **requirement-driven, opaque-box, progressive testability** philosophy.
- **Opaque-Box Verification**: Tests interact with the system via observable interfaces—public HTTP API endpoints, exported UI primitive contracts, browser shell layouts, routing state machines, and database persistence—without coupling to private implementation trivia.
- **Authoritative Expected Outputs**: Every test derivation traces directly to `PROJECT.md` and `ORIGINAL_REQUEST.md`. Where reference APIs are live, real API round-trips with database verification serve as the oracle.
- **Progressive Testability**: Tests are designed to validate milestones in progression. As M1 (shadcn primitives), M2 (shell and navigation), M3 (core SIS & attendance), and M4 (operations & academic management) are integrated, the test suite verifies structural contracts, functional behavior, and end-to-end user workflows.
- **Zero-False-Positive Integrity**: Facade tests that pass vacuously are forbidden. Tests make real network requests, inspect actual source tokens, validate state transitions, and assert precise contract boundaries.

---

## 2. Feature Inventory
The test suite covers all 45 operational and architectural features documented in `PROJECT.md`:

| Feature # | Feature Name | Milestone | Domain Scope |
|---|---|---|---|
| F01 | Vite Alias & Path Resolution | M1 | Build & Bundler Config |
| F02 | Tailwind v4 Theme Tokens | M1 | Vibrant Modern Palette & Variables |
| F03 | Radix UI Dependencies & Utilities | M1 | Class Merging (`cn`) & Primitive Runtime |
| F04 | Primitive: button.jsx | M1 | Button Variants & Sizes |
| F05 | Primitive: badge.jsx | M1 | Badge Variants & Emerald Accents |
| F06 | Primitive: card.jsx | M1 | Card Composition & Border Tokens |
| F07 | Primitive: input.jsx | M1 | Input Focus Rings & Form States |
| F08 | Primitive: table.jsx | M1 | Responsive Table & Hover Styles |
| F09 | Primitive: dialog.jsx | M1 | Modal Overlay & ARIA Dialog Contract |
| F10 | Primitive: sheet.jsx | M1 | Mobile Drawer & Slide-In Transitions |
| F11 | Primitive: dropdown-menu.jsx | M1 | Dropdown Menus & Action Portals |
| F12 | Primitive: select.jsx | M1 | Form Select Trigger & Option Lists |
| F13 | Primitive: tabs.jsx | M1 | Pill/Underline Tab Navigation |
| F14 | Primitive: avatar.jsx | M1 | Avatar Image & Fallback Initials |
| F15 | Primitive: toast.jsx | M1 | Unified Toast Notification Queuing |
| F16 | Primitive: calendar.jsx | M1 | Date Grid & Scheduling Picker |
| F17 | Primitive: popover.jsx | M1 | Contextual Flyout & Tooltips |
| F18 | Primitive: separator.jsx | M1 | Visual Separators & Orientation |
| F19 | Primitives Barrel Export | M1 | Standardized Component Barrel Index |
| F20 | Global AppLayout Shell | M2 | Shell Container, Breadcrumbs & Toasts |
| F21 | Sidebar Navigation | M2 | 16 Modules, 7 Collapsible Groups |
| F22 | Mobile Sheet Drawer | M2 | Responsive Drawer for Mobile Viewports |
| F23 | Topbar Header | M2 | Quick Actions, Brand & Academic Indicator |
| F24 | Branch Selector Integration | M2 | Multi-Campus Role-Scoped Branch Picker |
| F25 | Academic Year Switcher | M2 | Academic Year Selector & Read-Only Banner |
| F26 | User Profile & Logout Flow | M2 | Avatar Dropdown, Role Badge & Logout |
| F27 | Route Guards & Navigation Integrity | M2 | ProtectedRoute Roles & Redirections |
| F28 | Dashboard Module | M3 | Central, Campus & Student Dashboards |
| F29 | Students Directory Table | M3 | SIS Table, Search, Filter & Pagination |
| F30 | Student Admission Modal | M3 | Multi-Step Admission Wizard |
| F31 | Student 360 Profile Sheet | M3 | Comprehensive Tabbed Student Drawer |
| F32 | Student Spreadsheet & Transfer | M3 | Bulk Matrix, Transfers & Promotions |
| F33 | Attendance Roll-Call | M3 | Daily Roll-Call & Absent Parent Alerts |
| F34 | Attendance Timings & Setup | M3 | Session Windows & Class Timing Mappings |
| F35 | Attendance History & Reports | M3 | Audited Logs & Monthly Summary Reports |
| F36 | Homework Management | M4 | Publishing Form, Feed & Student Portal |
| F37 | Assignments & Grading | M4 | Submissions Review Sheet & Grading Dialog |
| F38 | Communication Notices | M4 | Notice Board Priority Cards & Audience Filters |
| F39 | Gallery & Media Lightbox | M4 | Photo Grid & Zoom Preview Dialog |
| F40 | Staff Directory & Workload | M4 | Staff Directory, Onboarding & Workload |
| F41 | Timetable Grid Matrix | M4 | Weekly Schedule Grid & Slot Allocations |
| F42 | Role & Permissions Matrix | M4 | Menu & Permission Assignment Matrix |
| F43 | Branches Management View | M4 | Campus Registry, Status Toggles & Edit Modals |
| F44 | Academic Settings & Curricular | M4 | Academic Years, Classes, Sections & Subjects |
| F45 | Examination, Calendar, Anecdotes | M4 | Assessment Terms, Calendar & Behavioral Logs |

---

## 3. Test Architecture

### 3.1 Directory Layout
```
tests/e2e/
├── runner.js                      # Standalone test runner (colors, timing, CLI filters, exit codes)
├── helpers.js                     # HTTP client, session store, assertions, DOM inspectors
├── tier1-feature-coverage/        # Tier 1: Primary Feature Coverage (>=5 test cases per feature)
│   ├── m1-primitives.test.js      # Features 1-19 (95+ tests)
│   ├── m2-shell-nav.test.js       # Features 20-27 (40+ tests)
│   ├── m3-sis-attendance.test.js  # Features 28-35 (40+ tests)
│   └── m4-ops-academic.test.js    # Features 36-45 (50+ tests)
├── tier2-boundary-corners/        # Tier 2: Boundary & Corner Cases (>=5 test cases per feature)
│   ├── m1-primitives-boundary.test.js  # Limits & invalid props for F01-F19
│   ├── m2-shell-nav-boundary.test.js   # Edge routing, session timeouts for F20-F27
│   ├── m3-sis-attendance-boundary.test.js # Edge student queries, roll-call limits for F28-F35
│   └── m4-ops-academic-boundary.test.js   # Schedule conflicts, score limits for F36-F45
├── tier3-cross-feature/           # Tier 3: Pairwise Domain Interactions
│   └── cross-feature.test.js      # 10 cross-module interaction test suites
└── tier4-application-scenarios/   # Tier 4: Real-World Multi-Step Operational Workflows
    └── real-world-scenarios.test.js # 5 full lifecycle scenarios
```

### 3.2 Test Execution Model
- **Runner**: Node.js standalone ES module runner (`node tests/e2e/runner.js`).
- **Network Layer**: Built-in `fetch` against the School ERP backend (`http://127.0.0.1:5000`) and frontend Vite proxy (`http://localhost:3000`).
- **Authentication Caching**: Auto-manages Super Admin (`admin`), Principal (`principal`), and Student (`student`) tokens.
- **Reporting**: Tier-by-tier execution logs with passed/failed counts, test descriptions, timing, and error traces.

---

## 4. Test Tiers Specification

### 4.1 Tier 1: Feature Coverage (>=5 Tests per Feature, Total: 225+ Tests)
- **F01-F19**: Verifies build configuration, Tailwind v4 CSS tokens, Radix UI utility functions, and the 15 shadcn UI primitives (variants, sizes, composability, ARIA attributes, barrel exports).
- **F20-F27**: Verifies global AppLayout shell rendering, Sidebar module links, mobile Sheet drawer toggling, Topbar quick actions, BranchSelector role scoping, AcademicYearSelector state synchronization, UserProfile menu & logout, and ProtectedRoute guards.
- **F28-F35**: Verifies Dashboard KPI metric cards, Student SIS directory querying, Student Admission modal form validation, Student 360 profile tabs, Student Spreadsheet/Promotions, Attendance Roll-Call batch marking, Attendance Session Timings, and Attendance Monthly Reports.
- **F36-F45**: Verifies Homework publishing, Assignment submission review & grading, Communication notices priority cards, Gallery photo lightbox, Staff directory & workload, Timetable weekly schedule matrix, Permission toggles, Campus registry, Curricular class-subject structures, and Assessment/Calendar/Anecdotes.

### 4.2 Tier 2: Boundary & Corner Cases (>=5 Tests per Feature, Total: 225+ Tests)
- **F01-F19 Boundary**: Falsy/undefined inputs to `cn()`, conflicting Tailwind classes, extreme button lengths, empty cards, malformed table rows, rapid dialog toggling, broken avatar image fallbacks, empty select options.
- **F20-F27 Boundary**: Deeply nested unauthorized routes, malformed role in localStorage, switching to inactive branch, switching to historical academic year, rapid sidebar section collapsing.
- **F28-F35 Boundary**: Search queries with SQL/HTML special characters, pagination at 0 and page-overflow limits, student admission with duplicate admission number, marking attendance on holidays, conflicting session timings.
- **F36-F45 Boundary**: Homework due dates in past, assignment grading scores exceeding maximum points, notice broadcasts with empty audience, timetable scheduling with faculty time collisions, revoking super-admin system permissions.

### 4.3 Tier 3: Cross-Feature Combinations (Pairwise Interactions)
1. **Auth Session ↔ Multi-Campus Branch Scoping**: Super Admin vs Principal access boundaries across branches and dashboards.
2. **Academic Year Switcher ↔ Attendance Locking**: Historical academic years enforce read-only historical attendance states.
3. **Student Admission ↔ Class Section Capacity**: Admitting students updates class-section rosters and enforces capacity limits.
4. **Attendance Roll-Call ↔ Absentee Parent Alerts**: Batch marking student absent cascades to absentee notification logs and monthly stats.
5. **Staff Directory ↔ Timetable Period Allocation**: Onboarding staff automatically enables timetable assignment and detects schedule collisions.
6. **Homework Publishing ↔ Student Portal Feed**: Published homework appears immediately in targeted class student portal.
7. **Assignment Submission ↔ Teacher Grading Drawer**: Student file upload updates submission status and triggers teacher review drawer.
8. **Role Permissions Matrix ↔ Route Guards & API Enforcement**: Modifying menu permissions updates client navigation and protects restricted endpoints.
9. **Branch Management ↔ Topbar Selector Sync**: Creating new campus immediately populates BranchSelector and scopes campus dashboard.
10. **Curricular Subject Category ↔ Timetable Period Mapping**: Subject categories drive weekly timetable distribution and period slot validations.

### 4.4 Tier 4: Real-World Application Scenarios (Multi-Step Workflows)
1. **Scenario 1: Comprehensive Academic Year Setup & Multi-Campus Branch Lifecycle**
   Super Admin logs in -> Verifies organization stats -> Creates new Academic Year -> Toggles global active status -> Verifies multi-branch scoping and synchronized state.
2. **Scenario 2: Complete Student Admission-to-Enrollment Lifecycle**
   Admin opens admission wizard -> Validates class/section capacity -> Enrolls new student -> Verifies directory listing -> Inspects 360 profile tabs and validates data consistency.
3. **Scenario 3: Teacher Daily Attendance Roll-Call & Absentee Communication Workflow**
   Teacher authenticates -> Selects class and session -> Records roll-call statuses (P/A/L/HD) -> Dispatches absentee alerts -> Generates monthly attendance audit report.
4. **Scenario 4: Homework Distribution, Student Portal Submission & Grading Lifecycle**
   Staff publishes homework with attachment -> Student logs in -> Views homework on student portal -> Submits assignment -> Teacher reviews in drawer and records graded evaluation.
5. **Scenario 5: Staff Onboarding, Workload Allocation & Timetable Scheduling Workflow**
   Admin onboards new teacher -> Assigns department credentials -> Allocates weekly timetable periods -> Validates collision avoidance -> Inspects teacher workload summary.

---

## 5. Coverage Thresholds & Quality Gates

| Gate Metric | Minimum Threshold | Enforcement Mechanism |
|---|---|---|
| Feature Coverage | 100% (45 of 45 features in `PROJECT.md`) | Tier 1 Suite Verification |
| Test Case Density | >= 5 test cases per feature in Tier 1 and Tier 2 | Suite Structure Check |
| Boundary Cases | >= 5 boundary cases per feature | Tier 2 Suite Verification |
| Cross-Feature Interactions | >= 10 pairwise domain suites | Tier 3 Suite Verification |
| Real-World Workflows | >= 5 multi-step end-to-end operational scenarios | Tier 4 Suite Verification |
| Build & Compilation | 0 bundling, JSX, or Vite build errors | `npm run build` |
| Test Runner Exit Code | Code 0 on clean pass | `node tests/e2e/runner.js` |
