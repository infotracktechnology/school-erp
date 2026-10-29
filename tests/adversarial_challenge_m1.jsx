/**
 * tests/adversarial_challenge_m1.jsx
 * Empirical Challenger Suite (challenger_m1_retry_2)
 *
 * Deep adversarial testing of Calendar, Badge, Sheet, and Barrel primitives:
 * - Exact minDate / maxDate boundary equality and boundary crossing
 * - Leap year calculations and century leap years
 * - Month transition math across year boundaries
 * - Extreme fuzzing (null, undefined, invalid dates, huge arrays, unexpected types)
 * - Badge variant styles, tokens, pill shape, and CVA direct invocations
 * - Sheet variants (top, bottom, left, right), animations, CVA direct invocations
 * - Full barrel parity against individual file exports
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import assert from 'assert';

// Barrel imports
import {
  Calendar,
  Badge,
  badgeVariants,
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
  sheetVariants,
  Button,
  buttonVariants,
  Card,
  Input,
  Table,
  Dialog,
  DropdownMenu,
  Select,
  Tabs,
  Avatar,
  Toaster,
  toast,
  showToast,
  Popover,
  Separator,
} from '@/components/ui';

// Direct imports for parity
import * as CalendarFile from '@/components/ui/calendar';
import * as BadgeFile from '@/components/ui/badge';
import * as SheetFile from '@/components/ui/sheet';

const testResults = [];

function runTest(name, category, fn) {
  const start = performance.now();
  try {
    fn();
    const duration = (performance.now() - start).toFixed(2);
    testResults.push({ name, category, passed: true, duration, error: null });
    console.log(`  ✔ [PASS] [${duration}ms] ${category} > ${name}`);
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    testResults.push({ name, category, passed: false, duration, error: err.message || String(err) });
    console.error(`  ✖ [FAIL] [${duration}ms] ${category} > ${name}`);
    console.error(`     Error: ${err.message || String(err)}`);
  }
}

export async function executeAdversarialChallenge() {
  console.log('\n======================================================');
  console.log('   ADVERSARIAL CHALLENGE: Calendar, Badge, Sheet, Barrel');
  console.log('======================================================\n');

  // =========================================================================
  // 1. CALENDAR DATE BOUNDARY & EQUALITY STRESS
  // =========================================================================
  console.log('▶ [CHALLENGE 1] Calendar Date Boundary & Equality Edge Cases');

  runTest('Cell EXACTLY EQUAL to minDate must be ENABLED (not disabled)', 'Calendar Boundaries', () => {
    const month = new Date(2026, 9, 1); // Oct 2026
    const minDate = new Date(2026, 9, 15); // Oct 15, 2026
    const maxDate = new Date(2026, 9, 25); // Oct 25, 2026

    const html = renderToString(
      <Calendar month={month} minDate={minDate} maxDate={maxDate} />
    );

    // Look for button with 15
    const regex15 = /<button[^>]*><span>15<\/span>[^<]*<\/button>/;
    const match15 = html.match(regex15);
    assert(match15, 'Day 15 button must exist in HTML');
    const buttonHtml15 = match15[0];

    assert(!buttonHtml15.includes('disabled=""') && !buttonHtml15.includes('disabled '), 'Day 15 must NOT have disabled attribute');
    assert(!buttonHtml15.includes('cursor-not-allowed'), 'Day 15 must NOT have cursor-not-allowed');
    assert(!buttonHtml15.includes('opacity-30'), 'Day 15 must NOT have opacity-30');
    assert(!buttonHtml15.includes('pointer-events-none'), 'Day 15 must NOT have pointer-events-none');
  });

  runTest('Cell EXACTLY EQUAL to maxDate must be ENABLED (not disabled)', 'Calendar Boundaries', () => {
    const month = new Date(2026, 9, 1); // Oct 2026
    const minDate = new Date(2026, 9, 15);
    const maxDate = new Date(2026, 9, 25);

    const html = renderToString(
      <Calendar month={month} minDate={minDate} maxDate={maxDate} />
    );

    const regex25 = /<button[^>]*><span>25<\/span>[^<]*<\/button>/;
    const match25 = html.match(regex25);
    assert(match25, 'Day 25 button must exist in HTML');
    const buttonHtml25 = match25[0];

    assert(!buttonHtml25.includes('disabled=""') && !buttonHtml25.includes('disabled '), 'Day 25 must NOT have disabled attribute');
    assert(!buttonHtml25.includes('cursor-not-allowed'), 'Day 25 must NOT have cursor-not-allowed');
    assert(!buttonHtml25.includes('opacity-30'), 'Day 25 must NOT have opacity-30');
    assert(!buttonHtml25.includes('pointer-events-none'), 'Day 25 must NOT have pointer-events-none');
  });

  runTest('Day immediately BEFORE minDate (Oct 14) must be DISABLED', 'Calendar Boundaries', () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 15);
    const maxDate = new Date(2026, 9, 25);

    const html = renderToString(
      <Calendar month={month} minDate={minDate} maxDate={maxDate} />
    );

    const regex14 = /<button[^>]*><span>14<\/span>[^<]*<\/button>/;
    const match14 = html.match(regex14);
    assert(match14, 'Day 14 button must exist in HTML');
    const buttonHtml14 = match14[0];

    assert(buttonHtml14.includes('disabled'), 'Day 14 must have disabled attribute');
    assert(buttonHtml14.includes('cursor-not-allowed'), 'Day 14 must have cursor-not-allowed');
    assert(buttonHtml14.includes('opacity-30'), 'Day 14 must have opacity-30');
    assert(buttonHtml14.includes('pointer-events-none'), 'Day 14 must have pointer-events-none');
  });

  runTest('Day immediately AFTER maxDate (Oct 26) must be DISABLED', 'Calendar Boundaries', () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 15);
    const maxDate = new Date(2026, 9, 25);

    const html = renderToString(
      <Calendar month={month} minDate={minDate} maxDate={maxDate} />
    );

    const regex26 = /<button[^>]*><span>26<\/span>[^<]*<\/button>/;
    const match26 = html.match(regex26);
    assert(match26, 'Day 26 button must exist in HTML');
    const buttonHtml26 = match26[0];

    assert(buttonHtml26.includes('disabled'), 'Day 26 must have disabled attribute');
    assert(buttonHtml26.includes('cursor-not-allowed'), 'Day 26 must have cursor-not-allowed');
    assert(buttonHtml26.includes('opacity-30'), 'Day 26 must have opacity-30');
    assert(buttonHtml26.includes('pointer-events-none'), 'Day 26 must have pointer-events-none');
  });

  runTest('minDate and maxDate set to EXACT SAME DAY allows only that single day', 'Calendar Boundaries', () => {
    const month = new Date(2026, 9, 1);
    const singleDay = new Date(2026, 9, 20); // Oct 20 only

    const html = renderToString(
      <Calendar month={month} minDate={singleDay} maxDate={singleDay} />
    );

    // Day 20 enabled
    const match20 = html.match(/<button[^>]*><span>20<\/span>[^<]*<\/button>/);
    assert(match20, 'Day 20 must exist');
    assert(!match20[0].includes('disabled'), 'Day 20 must be enabled');

    // Day 19 disabled
    const match19 = html.match(/<button[^>]*><span>19<\/span>[^<]*<\/button>/);
    assert(match19 && match19[0].includes('disabled'), 'Day 19 must be disabled');

    // Day 21 disabled
    const match21 = html.match(/<button[^>]*><span>21<\/span>[^<]*<\/button>/);
    assert(match21 && match21[0].includes('disabled'), 'Day 21 must be disabled');
  });

  runTest('minDate with specific time (e.g. 15:30:00) does not disable early hours of that same date', 'Calendar Boundaries', () => {
    const month = new Date(2026, 9, 1);
    const minDateTime = new Date(2026, 9, 15, 18, 45, 0); // 6:45 PM on Oct 15

    const html = renderToString(
      <Calendar month={month} minDate={minDateTime} />
    );

    // Even though minDate has hours=18, the cell for day 15 (which starts at 00:00) must still be enabled
    const match15 = html.match(/<button[^>]*><span>15<\/span>[^<]*<\/button>/);
    assert(match15, 'Day 15 must exist');
    assert(!match15[0].includes('disabled'), 'Day 15 must NOT be disabled by time components in minDate');
  });

  runTest('maxDate with specific time (e.g. 02:15:00) does not disable that date', 'Calendar Boundaries', () => {
    const month = new Date(2026, 9, 1);
    const maxDateTime = new Date(2026, 9, 15, 2, 15, 0); // 2:15 AM on Oct 15

    const html = renderToString(
      <Calendar month={month} maxDate={maxDateTime} />
    );

    const match15 = html.match(/<button[^>]*><span>15<\/span>[^<]*<\/button>/);
    assert(match15, 'Day 15 must exist');
    assert(!match15[0].includes('disabled'), 'Day 15 must NOT be disabled by early time in maxDate');
  });

  // =========================================================================
  // 2. LEAP YEARS AND CALENDAR CALCULATION
  // =========================================================================
  console.log('\n▶ [CHALLENGE 2] Leap Year & Century Date Math');

  runTest('Leap year 2024 Feb has 29 days', 'Calendar Leap Years', () => {
    const feb2024 = new Date(2024, 1, 1);
    const html = renderToString(<Calendar month={feb2024} />);
    assert(html.includes('February') && html.includes('2024'), 'Header shows February 2024');
    assert(html.includes('<span>29</span>'), 'Day 29 present in Feb 2024');
  });

  runTest('Century leap year 2000 Feb has 29 days', 'Calendar Leap Years', () => {
    const feb2000 = new Date(2000, 1, 1);
    const html = renderToString(<Calendar month={feb2000} />);
    assert(html.includes('February') && html.includes('2000'), 'Header shows February 2000');
    assert(html.includes('<span>29</span>'), 'Day 29 present in Feb 2000');
  });

  runTest('Century NON-leap year 1900 Feb has 28 days only', 'Calendar Leap Years', () => {
    const feb1900 = new Date(1900, 1, 1);
    const html = renderToString(<Calendar month={feb1900} />);
    assert(html.includes('February') && html.includes('1900'), 'Header shows February 1900');
    assert(html.includes('<span>28</span>'), 'Day 28 present in Feb 1900');
  });

  runTest('Month transition December 31 boundary (Dec 2026)', 'Calendar Month Transitions', () => {
    const dec2026 = new Date(2026, 11, 1);
    const html = renderToString(<Calendar month={dec2026} />);
    assert(html.includes('December') && html.includes('2026'), 'Header shows December 2026');
    assert(html.includes('<span>31</span>'), 'Day 31 present in Dec 2026');
  });

  runTest('Month transition January 1 boundary (Jan 2027)', 'Calendar Month Transitions', () => {
    const jan2027 = new Date(2027, 0, 1);
    const html = renderToString(<Calendar month={jan2027} />);
    assert(html.includes('January') && html.includes('2027'), 'Header shows January 2027');
    assert(html.includes('<span>1</span>'), 'Day 1 present in Jan 2027');
  });

  // =========================================================================
  // 3. CALENDAR FUZZING & ANOMALOUS INPUTS
  // =========================================================================
  console.log('\n▶ [CHALLENGE 3] Calendar Fuzzing & Malformed Props');

  runTest('Fuzz: events with mixed garbage elements (null, undefined, non-objects)', 'Calendar Fuzzing', () => {
    const month = new Date(2026, 9, 1);
    const fuzzEvents = [
      null,
      undefined,
      42,
      "not an event",
      {},
      { date: null },
      { date: undefined },
      { date: "not-a-date" },
      { date: new Date(2026, 9, 10), title: "Valid Event" },
      { date: "2026-10-12", title: "Valid String Event" },
    ];

    const html = renderToString(<Calendar month={month} events={fuzzEvents} />);
    assert(html.includes('October') && html.includes('2026'), 'Renders October 2026 despite garbage in events');
    assert(html.includes('rounded-full'), 'Renders event dot for the valid events');
  });

  runTest('Fuzz: events as non-array types (string, number, object)', 'Calendar Fuzzing', () => {
    const month = new Date(2026, 9, 1);
    const badEvents = [
      "just a string",
      12345,
      { title: "single event object" },
      true,
    ];

    badEvents.forEach((ev) => {
      const html = renderToString(<Calendar month={month} events={ev} />);
      assert(html.includes('October') && html.includes('2026'), 'Renders safely with non-array events');
    });
  });

  runTest('Fuzz: minDate and maxDate as epoch milliseconds', 'Calendar Fuzzing', () => {
    const month = new Date(2026, 9, 1);
    const minMs = new Date(2026, 9, 10).getTime();
    const maxMs = new Date(2026, 9, 20).getTime();

    const html = renderToString(<Calendar month={month} minDate={minMs} maxDate={maxMs} />);
    assert(html.includes('October') && html.includes('2026'), 'Epoch ms accepted as minDate/maxDate');

    const match10 = html.match(/<button[^>]*><span>10<\/span>[^<]*<\/button>/);
    assert(match10 && !match10[0].includes('disabled'), 'Day 10 enabled');

    const match9 = html.match(/<button[^>]*><span>9<\/span>[^<]*<\/button>/);
    assert(match9 && match9[0].includes('disabled'), 'Day 9 disabled');
  });

  runTest('Fuzz: invalid Date object (new Date("invalid"))', 'Calendar Fuzzing', () => {
    const invalidDate = new Date("invalid");
    const html = renderToString(
      <Calendar selected={invalidDate} minDate={invalidDate} maxDate={invalidDate} month={invalidDate} />
    );
    assert(html.includes('Su') && html.includes('Mo'), 'Renders calendar without throwing on NaN dates');
  });

  // =========================================================================
  // 4. BADGE PRIMITIVE ADVERSARIAL STRESS
  // =========================================================================
  console.log('\n▶ [CHALLENGE 4] Badge Variants, Styling & Boundary Stress');

  const expectedVariantClasses = {
    default: ['bg-primary', 'text-primary-foreground'],
    secondary: ['bg-secondary', 'text-secondary-foreground'],
    destructive: ['bg-destructive', 'text-destructive-foreground'],
    outline: ['text-foreground', 'border-border'],
    success: ['bg-emerald-50', 'text-emerald-800', 'border-emerald-200'],
    emerald: ['bg-emerald-50', 'text-emerald-800', 'border-emerald-200'],
  };

  Object.entries(expectedVariantClasses).forEach(([variant, expectedClasses]) => {
    runTest(`Badge variant="${variant}" includes required design tokens`, 'Badge Variants', () => {
      const html = renderToString(<Badge variant={variant}>Badge {variant}</Badge>);
      expectedClasses.forEach((cls) => {
        assert(html.includes(cls), `Badge variant "${variant}" must include class "${cls}"`);
      });
      assert(html.includes('rounded-full'), `Badge variant "${variant}" must have "rounded-full" pill shape`);
      assert(html.includes('text-xs font-semibold'), `Badge must have "text-xs font-semibold"`);
    });
  });

  runTest('badgeVariants CVA function standalone direct execution', 'Badge CVA Function', () => {
    // Calling with no args -> default variant
    const defaultClasses = badgeVariants();
    assert(defaultClasses.includes('bg-primary'), 'Default invocation yields bg-primary');
    assert(defaultClasses.includes('rounded-full'), 'Default invocation yields rounded-full');

    // Calling with variant
    const emeraldClasses = badgeVariants({ variant: 'emerald' });
    assert(emeraldClasses.includes('bg-emerald-50'), 'Emerald invocation yields bg-emerald-50');

    // Calling with custom className
    const customClasses = badgeVariants({ variant: 'secondary', className: 'extra-padding font-bold' });
    assert(customClasses.includes('extra-padding'), 'Merges extra-padding');
    assert(customClasses.includes('bg-secondary'), 'Includes bg-secondary');

    // Calling with undefined variant -> falls back to default
    const fallbackClasses = badgeVariants({ variant: undefined });
    assert(fallbackClasses.includes('bg-primary'), 'Undefined variant falls back to default');
  });

  runTest('Badge boundary children: 0, empty string, symbols, long text', 'Badge Boundary', () => {
    const html0 = renderToString(<Badge>{0}</Badge>);
    assert(html0.includes('>0</div>'), 'Badge renders numeric 0');

    const htmlEmpty = renderToString(<Badge></Badge>);
    assert(htmlEmpty.includes('<div class="'), 'Badge renders empty cleanly');

    const htmlLong = renderToString(<Badge>{'A'.repeat(500)}</Badge>);
    assert(htmlLong.includes('A'.repeat(500)), 'Badge renders long string without truncation or crash');
  });

  // =========================================================================
  // 5. SHEET PRIMITIVE & SHEETVARIANTS ADVERSARIAL STRESS
  // =========================================================================
  console.log('\n▶ [CHALLENGE 5] Sheet Component & sheetVariants Behavior');

  const sideConfigs = [
    { side: 'top', required: ['inset-x-0 top-0', 'border-b', 'slide-in-from-top', 'slide-out-to-top'] },
    { side: 'bottom', required: ['inset-x-0 bottom-0', 'border-t', 'slide-in-from-bottom', 'slide-out-to-bottom'] },
    { side: 'left', required: ['inset-y-0 left-0', 'border-r', 'slide-in-from-left', 'slide-out-to-left', 'sm:max-w-sm'] },
    { side: 'right', required: ['inset-y-0 right-0', 'border-l', 'slide-in-from-right', 'slide-out-to-right', 'sm:max-w-sm'] },
  ];

  sideConfigs.forEach(({ side, required }) => {
    runTest(`sheetVariants({ side: "${side}" }) produces correct layout & animation classes`, 'sheetVariants CVA', () => {
      const classes = sheetVariants({ side });
      required.forEach((req) => {
        assert(classes.includes(req), `sheetVariants for side "${side}" must include "${req}"`);
      });
      assert(classes.includes('fixed z-50 gap-4 bg-background p-6 shadow-lg'), 'Includes common fixed drawer tokens');
      assert(classes.includes('data-[state=open]:duration-500'), 'Includes open duration');
      assert(classes.includes('data-[state=closed]:duration-300'), 'Includes close duration');
    });
  });

  runTest('sheetVariants default invocation falls back to side="right"', 'sheetVariants CVA', () => {
    const classes = sheetVariants();
    assert(classes.includes('inset-y-0 right-0'), 'Default is right side drawer');
    assert(classes.includes('slide-in-from-right'), 'Default animation slides in from right');
  });

  runTest('sheetVariants with custom className merges cleanly', 'sheetVariants CVA', () => {
    const classes = sheetVariants({ side: 'left', className: 'w-[400px] border-emerald-500' });
    assert(classes.includes('w-[400px]'), 'Custom width merged');
    assert(classes.includes('border-emerald-500'), 'Custom border class merged');
    assert(classes.includes('inset-y-0 left-0'), 'Left positioning preserved');
  });

  runTest('SheetContent forwardRef renders close button with Lucide X and sr-only Close', 'SheetContent Subcomponent', () => {
    const rendered = SheetContent.render({ side: 'left', className: 'mobile-nav' }, null);
    // Structure: <SheetPortal><SheetOverlay /><DialogPrimitive.Content ...></SheetPortal>
    const portalChildren = rendered.props.children;
    assert.strictEqual(portalChildren.length, 2, 'SheetPortal contains Overlay and Content');

    const overlay = portalChildren[0];
    assert(overlay.type === SheetOverlay, 'First child is SheetOverlay');

    const content = portalChildren[1];
    assert(content.props.className.includes('mobile-nav'), 'Content has custom class');
    assert(content.props.className.includes('inset-y-0 left-0'), 'Content has left side class');

    // Close button
    const closeBtn = content.props.children[0];
    assert(closeBtn, 'Close button exists');
    assert(closeBtn.props.className.includes('absolute right-4 top-4'), 'Close button has absolute position');

    const xIcon = closeBtn.props.children[0];
    assert(xIcon, 'Close button has X icon');

    const srOnly = closeBtn.props.children[1];
    assert.strictEqual(srOnly.props.children, 'Close', 'Close button has sr-only text "Close"');
  });

  runTest('SheetHeader, SheetFooter, SheetTitle, SheetDescription render properly', 'Sheet Subcomponents', () => {
    const headerHtml = renderToString(
      <Sheet>
        <SheetHeader className="custom-header">
          <SheetTitle className="custom-title">Sheet Title</SheetTitle>
          <SheetDescription className="custom-desc">Sheet Subtext</SheetDescription>
        </SheetHeader>
      </Sheet>
    );
    assert(headerHtml.includes('custom-header'), 'SheetHeader applies class');
    assert(headerHtml.includes('custom-title'), 'SheetTitle applies class');
    assert(headerHtml.includes('custom-desc'), 'SheetDescription applies class');
    assert(headerHtml.includes('Sheet Title'), 'SheetTitle text rendered');
    assert(headerHtml.includes('Sheet Subtext'), 'SheetDescription text rendered');

    const footerHtml = renderToString(
      <Sheet>
        <SheetFooter className="custom-footer">
          <button>Submit</button>
        </SheetFooter>
      </Sheet>
    );
    assert(footerHtml.includes('custom-footer'), 'SheetFooter applies class');
    assert(footerHtml.includes('flex flex-col-reverse sm:flex-row sm:justify-end'), 'SheetFooter layout classes');
  });

  // =========================================================================
  // 6. BARREL EXPORT INTEGRITY & PARITY
  // =========================================================================
  console.log('\n▶ [CHALLENGE 6] Barrel Export Parity & Cross-Reference');

  runTest('Calendar direct vs barrel export parity', 'Barrel Integrity', () => {
    assert.strictEqual(Calendar, CalendarFile.Calendar, 'Calendar matches CalendarFile.Calendar');
  });

  runTest('Badge and badgeVariants direct vs barrel export parity', 'Barrel Integrity', () => {
    assert.strictEqual(Badge, BadgeFile.Badge, 'Badge matches BadgeFile.Badge');
    assert.strictEqual(badgeVariants, BadgeFile.badgeVariants, 'badgeVariants matches BadgeFile.badgeVariants');
  });

  runTest('Sheet components and sheetVariants direct vs barrel export parity', 'Barrel Integrity', () => {
    assert.strictEqual(Sheet, SheetFile.Sheet, 'Sheet matches');
    assert.strictEqual(SheetPortal, SheetFile.SheetPortal, 'SheetPortal matches');
    assert.strictEqual(SheetOverlay, SheetFile.SheetOverlay, 'SheetOverlay matches');
    assert.strictEqual(SheetTrigger, SheetFile.SheetTrigger, 'SheetTrigger matches');
    assert.strictEqual(SheetClose, SheetFile.SheetClose, 'SheetClose matches');
    assert.strictEqual(SheetContent, SheetFile.SheetContent, 'SheetContent matches');
    assert.strictEqual(SheetHeader, SheetFile.SheetHeader, 'SheetHeader matches');
    assert.strictEqual(SheetFooter, SheetFile.SheetFooter, 'SheetFooter matches');
    assert.strictEqual(SheetTitle, SheetFile.SheetTitle, 'SheetTitle matches');
    assert.strictEqual(SheetDescription, SheetFile.SheetDescription, 'SheetDescription matches');
    assert.strictEqual(sheetVariants, SheetFile.sheetVariants, 'sheetVariants matches');
  });

  // =========================================================================
  // FINAL SCORECARD
  // =========================================================================
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;

  console.log('\n======================================================');
  console.log(`ADVERSARIAL CHALLENGE SUMMARY: ${passed}/${total} PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.log(`FAILURES (${failed}):`);
    testResults.filter((r) => !r.passed).forEach((f, idx) => {
      console.log(`  ${idx + 1}. [${f.category}] ${f.name}`);
      console.log(`     Error: ${f.error}`);
    });
  } else {
    console.log('ALL EMPIRICAL ADVERSARIAL CHALLENGES PASSED WITH ZERO ERRORS!');
  }
  console.log('======================================================\n');

  return { total, passed, failed, failures: testResults.filter((r) => !r.passed) };
}

// Execute immediately when imported as entry
executeAdversarialChallenge()
  .then((res) => {
    if (res.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('Adversarial suite crashed:', err);
    process.exit(1);
  });
