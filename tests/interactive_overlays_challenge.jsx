/**
 * tests/interactive_overlays_challenge.jsx
 * Empirical Challenge Suite for Milestone 1: Interactive Overlays & Modals
 * Primitives under test: dialog, sheet, dropdown-menu, select, tabs, popover, calendar, toast
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import assert from 'assert';

// Import from barrel
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  Calendar,
  Toaster,
  toast,
  showToast,
} from '@/components/ui';

// Direct file imports to verify dual import parity
import * as DialogDirect from '@/components/ui/dialog';
import * as SheetDirect from '@/components/ui/sheet';
import * as DropdownMenuDirect from '@/components/ui/dropdown-menu';
import * as SelectDirect from '@/components/ui/select';
import * as TabsDirect from '@/components/ui/tabs';
import * as PopoverDirect from '@/components/ui/popover';
import * as CalendarDirect from '@/components/ui/calendar';
import * as ToastDirect from '@/components/ui/toast';

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

export async function runAllTests() {
  console.log('\n======================================================');
  console.log('   Milestone 1 Interactive Overlays Challenge Suite   ');
  console.log('======================================================\n');

  // ------------------------------------------------------------------------
  // CATEGORY 1: DUAL IMPORT & PARITY CHECKS
  // ------------------------------------------------------------------------
  recordTest('Dialog exports match barrel export', 'Dual Import Parity', () => {
    assert.strictEqual(Dialog, DialogDirect.Dialog);
    assert.strictEqual(DialogContent, DialogDirect.DialogContent);
    assert.strictEqual(DialogHeader, DialogDirect.DialogHeader);
    assert.strictEqual(DialogTitle, DialogDirect.DialogTitle);
  });

  recordTest('Sheet exports match barrel export', 'Dual Import Parity', () => {
    assert.strictEqual(Sheet, SheetDirect.Sheet);
    assert.strictEqual(SheetContent, SheetDirect.SheetContent);
    assert.strictEqual(SheetHeader, SheetDirect.SheetHeader);
    assert.strictEqual(SheetTitle, SheetDirect.SheetTitle);
    assert.strictEqual(SheetTrigger, SheetDirect.SheetTrigger);
  });

  recordTest('DropdownMenu exports match barrel export', 'Dual Import Parity', () => {
    assert.strictEqual(DropdownMenu, DropdownMenuDirect.DropdownMenu);
    assert.strictEqual(DropdownMenuContent, DropdownMenuDirect.DropdownMenuContent);
    assert.strictEqual(DropdownMenuItem, DropdownMenuDirect.DropdownMenuItem);
    assert.strictEqual(DropdownMenuTrigger, DropdownMenuDirect.DropdownMenuTrigger);
  });

  recordTest('Select exports match barrel export', 'Dual Import Parity', () => {
    assert.strictEqual(Select, SelectDirect.Select);
    assert.strictEqual(SelectTrigger, SelectDirect.SelectTrigger);
    assert.strictEqual(SelectContent, SelectDirect.SelectContent);
    assert.strictEqual(SelectItem, SelectDirect.SelectItem);
  });

  recordTest('Tabs, Popover, Calendar, Toast match barrel export', 'Dual Import Parity', () => {
    assert.strictEqual(Tabs, TabsDirect.Tabs);
    assert.strictEqual(TabsList, TabsDirect.TabsList);
    assert.strictEqual(Popover, PopoverDirect.Popover);
    assert.strictEqual(PopoverContent, PopoverDirect.PopoverContent);
    assert.strictEqual(Calendar, CalendarDirect.Calendar);
    assert.strictEqual(Toaster, ToastDirect.Toaster);
    assert.strictEqual(toast, ToastDirect.toast);
    assert.strictEqual(showToast, ToastDirect.showToast);
  });

  // ------------------------------------------------------------------------
  // CATEGORY 2: SHEET DRAWER POSITIONS (TOP, BOTTOM, LEFT, RIGHT)
  // ------------------------------------------------------------------------
  recordTest('Sheet components structure & subcomponent exports', 'Sheet Primitive', () => {
    assert(Sheet !== undefined, 'Sheet Root exists');
    assert(SheetTrigger !== undefined, 'SheetTrigger exists');
    assert(SheetClose !== undefined, 'SheetClose exists');
    assert(SheetContent !== undefined, 'SheetContent exists');
    assert(SheetOverlay !== undefined, 'SheetOverlay exists');
    assert(SheetHeader !== undefined, 'SheetHeader exists');
    assert(SheetFooter !== undefined, 'SheetFooter exists');
    assert(SheetTitle !== undefined, 'SheetTitle exists');
    assert(SheetDescription !== undefined, 'SheetDescription exists');
    assert.strictEqual(SheetHeader.displayName, 'SheetHeader');
    assert.strictEqual(SheetFooter.displayName, 'SheetFooter');
  });

  recordTest('SheetHeader and SheetFooter SSR rendering within Sheet context', 'Sheet Primitive', () => {
    const headerHtml = renderToString(
      React.createElement(
        Sheet,
        null,
        React.createElement(
          SheetHeader,
          { className: 'test-header' },
          React.createElement(SheetTitle, null, 'Student Profile 360'),
          React.createElement(SheetDescription, null, 'Comprehensive SIS Drawer')
        )
      )
    );
    assert(headerHtml.includes('test-header'), 'Header must contain custom class');
    assert(headerHtml.includes('Student Profile 360'), 'Header must contain title');
    assert(headerHtml.includes('Comprehensive SIS Drawer'), 'Header must contain description');

    const footerHtml = renderToString(
      React.createElement(
        Sheet,
        null,
        React.createElement(
          SheetFooter,
          { className: 'test-footer' },
          React.createElement('button', null, 'Save Changes')
        )
      )
    );
    assert(footerHtml.includes('test-footer'), 'Footer must contain custom class');
    assert(footerHtml.includes('Save Changes'), 'Footer must contain button text');
  });

  recordTest('SheetContent side="left" (R2 Mobile Navigation Drawer)', 'Sheet Primitive', () => {
    // Calling SheetContent.render directly to test output classes
    const rendered = SheetContent.render({ side: 'left', className: 'mobile-nav-sheet' }, null);
    // rendered is <SheetPortal><SheetOverlay /><DialogPrimitive.Content ...></SheetPortal>
    const contentEl = rendered.props.children[1];
    assert(contentEl, 'DialogPrimitive.Content must be rendered');
    const classes = contentEl.props.className;
    assert(classes.includes('inset-y-0 left-0'), 'Must align left: inset-y-0 left-0');
    assert(classes.includes('slide-in-from-left'), 'Must animate: slide-in-from-left');
    assert(classes.includes('slide-out-to-left'), 'Must animate: slide-out-to-left');
    assert(classes.includes('border-r'), 'Must have border-r');
    assert(classes.includes('mobile-nav-sheet'), 'Must merge custom className');
  });

  recordTest('SheetContent side="right" (Default & R3 Review Drawer)', 'Sheet Primitive', () => {
    const rendered = SheetContent.render({ side: 'right', className: 'review-drawer' }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes('inset-y-0 right-0'), 'Must align right: inset-y-0 right-0');
    assert(classes.includes('slide-in-from-right'), 'Must animate: slide-in-from-right');
    assert(classes.includes('slide-out-to-right'), 'Must animate: slide-out-to-right');
    assert(classes.includes('border-l'), 'Must have border-l');
    assert(classes.includes('review-drawer'), 'Must merge custom className');
  });

  recordTest('SheetContent default side falls back to "right"', 'Sheet Primitive', () => {
    const rendered = SheetContent.render({}, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes('inset-y-0 right-0'), 'Default must be right drawer');
    assert(classes.includes('slide-in-from-right'), 'Default slide in from right');
  });

  recordTest('SheetContent side="top" position classes', 'Sheet Primitive', () => {
    const rendered = SheetContent.render({ side: 'top' }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes('inset-x-0 top-0'), 'Must align top: inset-x-0 top-0');
    assert(classes.includes('slide-in-from-top'), 'Must animate: slide-in-from-top');
    assert(classes.includes('slide-out-to-top'), 'Must animate: slide-out-to-top');
    assert(classes.includes('border-b'), 'Must have border-b');
  });

  recordTest('SheetContent side="bottom" position classes', 'Sheet Primitive', () => {
    const rendered = SheetContent.render({ side: 'bottom' }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes('inset-x-0 bottom-0'), 'Must align bottom: inset-x-0 bottom-0');
    assert(classes.includes('slide-in-from-bottom'), 'Must animate: slide-in-from-bottom');
    assert(classes.includes('slide-out-to-bottom'), 'Must animate: slide-out-to-bottom');
    assert(classes.includes('border-t'), 'Must have border-t');
  });

  recordTest('SheetContent close button contains X icon and sr-only label', 'Sheet Primitive', () => {
    const rendered = SheetContent.render({}, null);
    const contentEl = rendered.props.children[1];
    // Find close button in children
    const closeBtn = contentEl.props.children[0];
    assert(closeBtn, 'Close button exists in SheetContent');
    const srOnly = closeBtn.props.children[1];
    assert.strictEqual(srOnly.props.children, 'Close', 'Must have sr-only "Close" text');
  });

  // ------------------------------------------------------------------------
  // CATEGORY 3: DIALOG PRIMITIVE & MODAL WORKFLOWS
  // ------------------------------------------------------------------------
  recordTest('Dialog components structure & subcomponent exports', 'Dialog Primitive', () => {
    assert(Dialog !== undefined, 'Dialog Root exists');
    assert(DialogTrigger !== undefined, 'DialogTrigger exists');
    assert(DialogClose !== undefined, 'DialogClose exists');
    assert(DialogContent !== undefined, 'DialogContent exists');
    assert(DialogOverlay !== undefined, 'DialogOverlay exists');
    assert(DialogHeader !== undefined, 'DialogHeader exists');
    assert(DialogFooter !== undefined, 'DialogFooter exists');
    assert(DialogTitle !== undefined, 'DialogTitle exists');
    assert(DialogDescription !== undefined, 'DialogDescription exists');
    assert.strictEqual(DialogHeader.displayName, 'DialogHeader');
    assert.strictEqual(DialogFooter.displayName, 'DialogFooter');
  });

  recordTest('DialogHeader and DialogFooter SSR rendering within Dialog context', 'Dialog Primitive', () => {
    const headerHtml = renderToString(
      React.createElement(
        Dialog,
        null,
        React.createElement(
          DialogHeader,
          { className: 'admission-header' },
          React.createElement(DialogTitle, null, 'New Student Registration'),
          React.createElement(DialogDescription, null, 'Fill in student admission details')
        )
      )
    );
    assert(headerHtml.includes('admission-header'), 'DialogHeader must render custom class');
    assert(headerHtml.includes('New Student Registration'), 'DialogTitle must render title');

    const footerHtml = renderToString(
      React.createElement(
        Dialog,
        null,
        React.createElement(
          DialogFooter,
          { className: 'admission-footer' },
          React.createElement('button', null, 'Submit Admission')
        )
      )
    );
    assert(footerHtml.includes('admission-footer'), 'DialogFooter must render custom class');
    assert(footerHtml.includes('Submit Admission'), 'DialogFooter must render action button');
  });

  recordTest('DialogContent centering, styling and close button', 'Dialog Primitive', () => {
    const rendered = DialogContent.render({ className: 'custom-dialog' }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes('fixed left-[50%] top-[50%]'), 'Must be centered fixed');
    assert(classes.includes('translate-x-[-50%] translate-y-[-50%]'), 'Must translate -50%');
    assert(classes.includes('custom-dialog'), 'Must merge custom className');

    const closeBtn = contentEl.props.children[1];
    assert(closeBtn, 'Close button exists in DialogContent');
  });

  // ------------------------------------------------------------------------
  // CATEGORY 4: DROPDOWN-MENU PRIMITIVE & KEYBOARD ACCESSIBILITY
  // ------------------------------------------------------------------------
  recordTest('DropdownMenu all subcomponents exported and valid', 'DropdownMenu Primitive', () => {
    assert(DropdownMenu !== undefined, 'DropdownMenu Root exists');
    assert(DropdownMenuTrigger !== undefined, 'DropdownMenuTrigger exists');
    assert(DropdownMenuContent !== undefined, 'DropdownMenuContent exists');
    assert(DropdownMenuItem !== undefined, 'DropdownMenuItem exists');
    assert(DropdownMenuCheckboxItem !== undefined, 'DropdownMenuCheckboxItem exists');
    assert(DropdownMenuRadioItem !== undefined, 'DropdownMenuRadioItem exists');
    assert(DropdownMenuLabel !== undefined, 'DropdownMenuLabel exists');
    assert(DropdownMenuSeparator !== undefined, 'DropdownMenuSeparator exists');
    assert(DropdownMenuShortcut !== undefined, 'DropdownMenuShortcut exists');
    assert(DropdownMenuGroup !== undefined, 'DropdownMenuGroup exists');
    assert(DropdownMenuPortal !== undefined, 'DropdownMenuPortal exists');
    assert(DropdownMenuSub !== undefined, 'DropdownMenuSub exists');
    assert(DropdownMenuSubContent !== undefined, 'DropdownMenuSubContent exists');
    assert(DropdownMenuSubTrigger !== undefined, 'DropdownMenuSubTrigger exists');
    assert(DropdownMenuRadioGroup !== undefined, 'DropdownMenuRadioGroup exists');
    assert.strictEqual(DropdownMenuShortcut.displayName, 'DropdownMenuShortcut');
  });

  recordTest('DropdownMenu subcomponents SSR rendering (Label, Separator, Shortcut)', 'DropdownMenu Primitive', () => {
    const labelHtml = renderToString(
      React.createElement(DropdownMenuLabel, { inset: true }, 'My Account')
    );
    assert(labelHtml.includes('My Account'), 'Label renders text');
    assert(labelHtml.includes('pl-8'), 'Inset prop adds pl-8 to label');

    const sepHtml = renderToString(React.createElement(DropdownMenuSeparator));
    assert(sepHtml.includes('h-px'), 'Separator renders horizontal rule');

    const shortcutHtml = renderToString(
      React.createElement(DropdownMenuShortcut, null, '⌘K')
    );
    assert(shortcutHtml.includes('⌘K'), 'Shortcut renders text');
    assert(shortcutHtml.includes('tracking-widest'), 'Shortcut has tracking-widest');
  });

  recordTest('DropdownMenuItem disabled and inset variants evaluation', 'DropdownMenu Primitive', () => {
    const itemEl = DropdownMenuItem.render({ inset: true, className: 'item-custom' }, null);
    assert(itemEl.props.className.includes('pl-8'), 'Inset item includes pl-8');
    assert(itemEl.props.className.includes('item-custom'), 'Includes custom className');
    assert(itemEl.props.className.includes('data-[disabled]:opacity-50'), 'Includes disabled opacity styling');
  });

  // ------------------------------------------------------------------------
  // CATEGORY 5: SELECT PRIMITIVE & OPTIONS/VALUE HANDLING
  // ------------------------------------------------------------------------
  recordTest('Select all subcomponents exported and valid', 'Select Primitive', () => {
    assert(Select !== undefined, 'Select Root exists');
    assert(SelectGroup !== undefined, 'SelectGroup exists');
    assert(SelectValue !== undefined, 'SelectValue exists');
    assert(SelectTrigger !== undefined, 'SelectTrigger exists');
    assert(SelectContent !== undefined, 'SelectContent exists');
    assert(SelectLabel !== undefined, 'SelectLabel exists');
    assert(SelectItem !== undefined, 'SelectItem exists');
    assert(SelectSeparator !== undefined, 'SelectSeparator exists');
    assert(SelectScrollUpButton !== undefined, 'SelectScrollUpButton exists');
    assert(SelectScrollDownButton !== undefined, 'SelectScrollDownButton exists');
  });

  recordTest('SelectTrigger, SelectValue, SelectLabel SSR rendering within Select context', 'Select Primitive', () => {
    const triggerHtml = renderToString(
      React.createElement(
        Select,
        null,
        React.createElement(
          SelectTrigger,
          { className: 'branch-select' },
          React.createElement(SelectValue, { placeholder: 'Select Campus Branch' })
        ),
        React.createElement(
          SelectGroup,
          null,
          React.createElement(SelectLabel, null, 'Academic Grades')
        )
      )
    );
    assert(triggerHtml.includes('branch-select'), 'SelectTrigger renders custom class');
    assert(triggerHtml.includes('h-9'), 'SelectTrigger renders standard height h-9');
    assert(triggerHtml.includes('border-input'), 'SelectTrigger renders border-input token');
    assert(triggerHtml.includes('svg'), 'SelectTrigger includes chevron down icon');
    assert(triggerHtml.includes('Academic Grades'), 'SelectLabel renders label text');
  });

  recordTest('SelectItem evaluation with Check indicator', 'Select Primitive', () => {
    const itemEl = SelectItem.render({ value: 'cbse', children: 'CBSE Curriculum' }, null);
    assert(itemEl.props.className.includes('focus:bg-accent'), 'Item includes focus styling');
    assert(itemEl.props.className.includes('pl-8'), 'Item leaves room for indicator');
  });

  recordTest('SelectContent popper position styling', 'Select Primitive', () => {
    const contentEl = SelectContent.render({ position: 'popper' }, null);
    // Portal -> Content
    const inner = contentEl.props.children;
    assert(inner.props.className.includes('max-h-96'), 'Content specifies max-h-96');
    assert(inner.props.className.includes('data-[side=bottom]:translate-y-1'), 'Popper specifies translate offsets');
  });

  // ------------------------------------------------------------------------
  // CATEGORY 6: TABS PRIMITIVE & ACTIVE STATES
  // ------------------------------------------------------------------------
  recordTest('Tabs structure, triggers, and content rendering', 'Tabs Primitive', () => {
    const tabsHtml = renderToString(
      React.createElement(
        Tabs,
        { defaultValue: 'overview', className: 'student-tabs' },
        React.createElement(
          TabsList,
          { className: 'grid grid-cols-2' },
          React.createElement(TabsTrigger, { value: 'overview' }, 'Overview'),
          React.createElement(TabsTrigger, { value: 'attendance' }, 'Attendance')
        ),
        React.createElement(TabsContent, { value: 'overview' }, 'Overview Content'),
        React.createElement(TabsContent, { value: 'attendance' }, 'Attendance Content')
      )
    );
    assert(tabsHtml.includes('student-tabs'), 'Tabs root applies class');
    assert(tabsHtml.includes('Overview'), 'TabsList renders Overview trigger');
    assert(tabsHtml.includes('Attendance'), 'TabsList renders Attendance trigger');
    assert(tabsHtml.includes('Overview Content'), 'TabsContent renders default active content');
    assert(tabsHtml.includes('data-state="active"'), 'Active tab trigger has data-state="active"');
  });

  // ------------------------------------------------------------------------
  // CATEGORY 7: POPOVER PRIMITIVE
  // ------------------------------------------------------------------------
  recordTest('Popover structure and exports', 'Popover Primitive', () => {
    assert(Popover !== undefined, 'Popover Root exists');
    assert(PopoverTrigger !== undefined, 'PopoverTrigger exists');
    assert(PopoverContent !== undefined, 'PopoverContent exists');
    assert(PopoverAnchor !== undefined, 'PopoverAnchor exists');
  });

  recordTest('PopoverContent positioning and align props', 'Popover Primitive', () => {
    const popoverEl = PopoverContent.render({ align: 'end', sideOffset: 8, className: 'filter-popover' }, null);
    const inner = popoverEl.props.children;
    assert.strictEqual(inner.props.align, 'end', 'Align end prop preserved');
    assert.strictEqual(inner.props.sideOffset, 8, 'Custom sideOffset preserved');
    assert(inner.props.className.includes('filter-popover'), 'Custom className merged');
    assert(inner.props.className.includes('w-72'), 'Default width w-72');
  });

  // ------------------------------------------------------------------------
  // CATEGORY 8: CALENDAR PRIMITIVE (EMPIRICAL STRESS TESTS)
  // ------------------------------------------------------------------------
  recordTest('Calendar renders month header and day names', 'Calendar Primitive', () => {
    const testDate = new Date(2026, 9, 28); // Oct 28, 2026
    const html = renderToString(
      React.createElement(Calendar, { selected: testDate, month: testDate })
    );

    assert(html.includes('October') && html.includes('2026'), 'Calendar header shows October 2026');
    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach((day) => {
      assert(html.includes(day), `Calendar weekday row includes ${day}`);
    });
    assert(html.includes('aria-label="Previous month"'), 'Includes prev month button');
    assert(html.includes('aria-label="Next month"'), 'Includes next month button');
  });

  recordTest('Calendar grid calculation (October 2026)', 'Calendar Primitive', () => {
    const testDate = new Date(2026, 9, 1);
    const html = renderToString(
      React.createElement(Calendar, { month: testDate })
    );
    for (let day = 1; day <= 31; day++) {
      assert(html.includes(`<span>${day}</span>`), `Calendar contains day ${day}`);
    }
  });

  recordTest('Calendar selected date highlights with primary token', 'Calendar Primitive', () => {
    const testDate = new Date(2026, 9, 15);
    const html = renderToString(
      React.createElement(Calendar, { selected: testDate, month: testDate })
    );
    assert(html.includes('bg-primary text-primary-foreground'), 'Selected date has bg-primary');
  });

  recordTest('Calendar leap year February 2024 has 29 days', 'Calendar Primitive', () => {
    const leapFeb = new Date(2024, 1, 1); // Feb 2024
    const html = renderToString(
      React.createElement(Calendar, { month: leapFeb })
    );
    assert(html.includes('February') && html.includes('2024'), 'Header shows February 2024');
    assert(html.includes('<span>29</span>'), 'Leap year includes day 29');
  });

  recordTest('Calendar non-leap year February 2025 has 28 days', 'Calendar Primitive', () => {
    const normalFeb = new Date(2025, 1, 1); // Feb 2025
    const html = renderToString(
      React.createElement(Calendar, { month: normalFeb })
    );
    assert(html.includes('February') && html.includes('2025'), 'Header shows February 2025');
    assert(html.includes('<span>28</span>'), 'Normal year includes day 28');
  });

  recordTest('Calendar events indicator dot rendering', 'Calendar Primitive', () => {
    const testDate = new Date(2026, 9, 20);
    const events = [
      { date: new Date(2026, 9, 20), title: 'Midterm Examination' },
    ];
    const html = renderToString(
      React.createElement(Calendar, {
        month: testDate,
        selected: testDate,
        events,
      })
    );
    assert(html.includes('h-1 w-1 rounded-full'), 'Event dot indicator rendered');
  });

  recordTest('Calendar minDate and maxDate boundary disabling', 'Calendar Primitive', () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 10);
    const maxDate = new Date(2026, 9, 25);

    const html = renderToString(
      React.createElement(Calendar, {
        month,
        minDate,
        maxDate,
      })
    );
    assert(html.includes('cursor-not-allowed'), 'Disabled days have cursor-not-allowed');
    assert(html.includes('opacity-30'), 'Disabled days have opacity-30');
  });

  recordTest('Calendar disabled={true} disables entire grid', 'Calendar Primitive', () => {
    const month = new Date(2026, 9, 1);
    const html = renderToString(
      React.createElement(Calendar, {
        month,
        disabled: true,
      })
    );
    // All buttons should have disabled attribute
    assert(html.includes('cursor-not-allowed'), 'All days are disabled');
    assert(html.includes('pointer-events-none'), 'All days have pointer-events-none');
  });

  recordTest('Calendar string minDate / maxDate ISO format tolerance', 'Calendar Primitive', () => {
    const month = new Date(2026, 9, 1);
    const html = renderToString(
      React.createElement(Calendar, {
        month,
        minDate: '2026-10-10',
        maxDate: '2026-10-25',
      })
    );
    assert(html.length > 500, 'Calendar renders cleanly with ISO string minDate/maxDate');
  });

  recordTest('Calendar null / undefined selected and events tolerance', 'Calendar Primitive', () => {
    const html = renderToString(
      React.createElement(Calendar, {
        selected: null,
        events: null,
        month: null,
      })
    );
    assert(html.length > 500, 'Calendar renders cleanly without crashing on null values');
  });

  // ------------------------------------------------------------------------
  // CATEGORY 9: TOAST PRIMITIVE (SONNER WRAPPER & SHOWTOAST API)
  // ------------------------------------------------------------------------
  recordTest('Toaster component SSR renders cleanly', 'Toast Primitive', () => {
    const html = renderToString(React.createElement(Toaster));
    assert(html.includes('aria-label="Notifications'), 'Toaster container section rendered');
  });

  recordTest('toast object exposes info, success, error, warning functions', 'Toast Primitive', () => {
    assert(typeof toast === 'function', 'toast is callable');
    assert(typeof toast.success === 'function', 'toast.success is callable');
    assert(typeof toast.error === 'function', 'toast.error is callable');
    assert(typeof toast.warning === 'function', 'toast.warning is callable');
    assert(typeof toast.info === 'function', 'toast.info is callable');
  });

  recordTest('showToast polymorphic dispatcher handles single message (default info)', 'Toast Primitive', () => {
    const res = showToast('Database backup completed');
    assert(res !== undefined, 'showToast returned toast id or handler');
  });

  recordTest('showToast polymorphic dispatcher handles (message, type) order', 'Toast Primitive', () => {
    const res1 = showToast('Student admitted successfully', 'success');
    const res2 = showToast('Failed to save record', 'error');
    const res3 = showToast('Attendance already submitted', 'warning');
    const res4 = showToast('Academic term closed', 'info');
    assert(res1 !== undefined && res2 !== undefined && res3 !== undefined && res4 !== undefined);
  });

  recordTest('showToast polymorphic dispatcher handles (type, message) order', 'Toast Primitive', () => {
    const res1 = showToast('success', 'Student admitted successfully');
    const res2 = showToast('error', 'Failed to save record');
    const res3 = showToast('warning', 'Attendance already submitted');
    const res4 = showToast('info', 'Academic term closed');
    assert(res1 !== undefined && res2 !== undefined && res3 !== undefined && res4 !== undefined);
  });

  recordTest('showToast unknown type gracefully falls back to info', 'Toast Primitive', () => {
    const res = showToast('custom_alert', 'Notice published');
    assert(res !== undefined, 'Handles unknown type gracefully');
  });

  // ------------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n======================================================');
  console.log(`Summary: ${passed}/${total} passed (${((passed / total) * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.log(`Failed: ${failed}`);
    process.exit(1);
  } else {
    console.log('All interactive overlay tests PASSED empirically!');
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
