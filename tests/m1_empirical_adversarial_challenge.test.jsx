import React from 'react';
import ReactDOMServer from 'react-dom/server';

// Direct imports
import { Calendar as DirectCalendar } from '@/components/ui/calendar';
import { Badge as DirectBadge, badgeVariants as directBadgeVariants } from '@/components/ui/badge';
import {
  Sheet as DirectSheet,
  SheetContent as DirectSheetContent,
  sheetVariants as directSheetVariants,
} from '@/components/ui/sheet';

// Barrel imports
import {
  Calendar as BarrelCalendar,
  Badge as BarrelBadge,
  badgeVariants as barrelBadgeVariants,
  Sheet as BarrelSheet,
  SheetContent as BarrelSheetContent,
  sheetVariants as barrelSheetVariants,
} from '@/components/ui';

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✔ [PASS] ${message}`);
  } else {
    failed++;
    failures.push(message);
    console.error(`  ✖ [FAIL] ${message}`);
  }
}

function runSection(title, fn) {
  console.log(`\n======================================================`);
  console.log(`▶ ${title}`);
  console.log(`======================================================`);
  try {
    fn();
  } catch (err) {
    failed++;
    failures.push(`${title} encountered unhandled exception: ${err.message}`);
    console.error(`  ✖ [EXCEPTION] in ${title}:`, err);
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: Sheet & sheetVariants Parity and Functionality
// -----------------------------------------------------------------------------
runSection('1. Sheet & sheetVariants Export Parity and Variant Matrix', () => {
  // 1.1 Export parity
  assert(
    typeof directSheetVariants === 'function',
    'direct import: sheetVariants is a function'
  );
  assert(
    typeof barrelSheetVariants === 'function',
    'barrel import: sheetVariants is a function'
  );
  assert(
    directSheetVariants === barrelSheetVariants,
    'sheetVariants reference parity: directSheetVariants === barrelSheetVariants'
  );

  // 1.2 Side variant generation
  const defaultClasses = directSheetVariants();
  assert(
    defaultClasses.includes('right-0') && defaultClasses.includes('inset-y-0'),
    `sheetVariants() default variant is side="right" (${defaultClasses})`
  );

  const leftClasses = directSheetVariants({ side: 'left' });
  assert(
    leftClasses.includes('left-0') &&
      leftClasses.includes('slide-in-from-left') &&
      leftClasses.includes('slide-out-to-left'),
    `sheetVariants({ side: 'left' }) includes left slide classes (${leftClasses})`
  );

  const rightClasses = directSheetVariants({ side: 'right' });
  assert(
    rightClasses.includes('right-0') &&
      rightClasses.includes('slide-in-from-right') &&
      rightClasses.includes('slide-out-to-right'),
    `sheetVariants({ side: 'right' }) includes right slide classes`
  );

  const topClasses = directSheetVariants({ side: 'top' });
  assert(
    topClasses.includes('top-0') &&
      topClasses.includes('inset-x-0') &&
      topClasses.includes('slide-in-from-top'),
    `sheetVariants({ side: 'top' }) includes top slide classes`
  );

  const bottomClasses = directSheetVariants({ side: 'bottom' });
  assert(
    bottomClasses.includes('bottom-0') &&
      bottomClasses.includes('inset-x-0') &&
      bottomClasses.includes('slide-in-from-bottom'),
    `sheetVariants({ side: 'bottom' }) includes bottom slide classes`
  );

  // 1.3 Sheet Component Structure & Classes
  const renderedContent = DirectSheetContent.render({ side: 'left', className: 'mobile-nav-drawer' }, null);
  const contentEl = renderedContent.props.children[1];
  assert(
    contentEl &&
      contentEl.props.className.includes('inset-y-0 left-0') &&
      contentEl.props.className.includes('slide-in-from-left') &&
      contentEl.props.className.includes('mobile-nav-drawer'),
    'DirectSheetContent renders left drawer classes with custom className'
  );
});

// -----------------------------------------------------------------------------
// SECTION 2: Badge Variants & rounded-full Conformance
// -----------------------------------------------------------------------------
runSection('2. Badge Variants & rounded-full Conformance Across All Variants', () => {
  // 2.1 Export parity
  assert(
    typeof directBadgeVariants === 'function',
    'badgeVariants is exported as a function'
  );
  assert(
    directBadgeVariants === barrelBadgeVariants,
    'badgeVariants export parity: direct === barrel'
  );
  assert(
    DirectBadge === BarrelBadge,
    'Badge component export parity: direct === barrel'
  );

  const variants = [
    undefined, // default
    'default',
    'secondary',
    'destructive',
    'outline',
    'success',
    'emerald',
  ];

  for (const variant of variants) {
    const variantName = variant || 'implicit default';
    const classStr = directBadgeVariants({ variant });
    assert(
      classStr.includes('rounded-full'),
      `badgeVariants({ variant: "${variantName}" }) contains "rounded-full"`
    );
    assert(
      !classStr.includes('rounded-md'),
      `badgeVariants({ variant: "${variantName}" }) does NOT contain "rounded-md"`
    );

    const rendered = ReactDOMServer.renderToString(
      <DirectBadge variant={variant}>Test Badge {variantName}</DirectBadge>
    );
    assert(
      rendered.includes('rounded-full'),
      `Rendered <Badge variant="${variantName}"> HTML contains "rounded-full"`
    );
    assert(
      !rendered.includes('rounded-md'),
      `Rendered <Badge variant="${variantName}"> HTML does NOT contain "rounded-md"`
    );
  }

  // 2.2 Custom class composition
  const customRendered = ReactDOMServer.renderToString(
    <DirectBadge variant="emerald" className="custom-shadow">
      Vibrant Emerald
    </DirectBadge>
  );
  assert(
    customRendered.includes('rounded-full') &&
      customRendered.includes('custom-shadow') &&
      customRendered.includes('emerald'),
    '<Badge> correctly merges custom className with rounded-full'
  );
});

// -----------------------------------------------------------------------------
// SECTION 3: Calendar minDate & maxDate Boundary Stress
// -----------------------------------------------------------------------------
runSection('3. Calendar minDate & maxDate (string, epoch, Date) Stress', () => {
  // We'll test with month set to October 2026:
  // min: Oct 10, 2026
  // max: Oct 20, 2026
  const testMonth = new Date(2026, 9, 1); // Oct 1, 2026

  // Helper to parse day buttons and their disabled states from SSR HTML
  function analyzeCalendarHtml(html) {
    // Buttons in calendar
    const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/g;
    const days = [];
    let match;
    while ((match = buttonRegex.exec(html)) !== null) {
      const fullTag = match[0];
      const inner = match[1];
      // Exclude previous/next month navigation buttons
      if (
        fullTag.includes('aria-label="Previous month"') ||
        fullTag.includes('aria-label="Next month"')
      ) {
        continue;
      }
      const dayMatch = inner.match(/<span>(\d+)<\/span>/);
      if (dayMatch) {
        const dayNum = parseInt(dayMatch[1], 10);
        const isDisabled =
          fullTag.includes('disabled=""') ||
          fullTag.includes('disabled="true"') ||
          fullTag.includes('disabled') &&
          fullTag.includes('cursor-not-allowed');
        const isSelected = fullTag.includes('bg-primary') && fullTag.includes('text-primary-foreground');
        const hasDot = inner.includes('rounded-full');
        const isPrevOrNext = fullTag.includes('text-muted-foreground/40');
        days.push({ dayNum, isDisabled, isSelected, hasDot, isPrevOrNext, fullTag });
      }
    }
    return days;
  }

  // 3.1 String minDate & maxDate: "2026-10-10" & "2026-10-20"
  {
    const html = ReactDOMServer.renderToString(
      <DirectCalendar
        month={testMonth}
        minDate="2026-10-10"
        maxDate="2026-10-20"
      />
    );
    const days = analyzeCalendarHtml(html);
    const octDays = days.filter((d) => !d.isPrevOrNext);

    assert(octDays.length === 31, 'October 2026 has exactly 31 day cells');

    // Day 5 (before minDate) must be disabled
    const day5 = octDays.find((d) => d.dayNum === 5);
    assert(day5 && day5.isDisabled, 'minDate string: Day 5 (before 2026-10-10) is DISABLED');

    // Day 10 (exact minDate) must be enabled
    const day10 = octDays.find((d) => d.dayNum === 10);
    assert(day10 && !day10.isDisabled, 'minDate string: Day 10 (min boundary) is ENABLED');

    // Day 15 (between min and max) must be enabled
    const day15 = octDays.find((d) => d.dayNum === 15);
    assert(day15 && !day15.isDisabled, 'minDate/maxDate string: Day 15 is ENABLED');

    // Day 20 (exact maxDate) must be enabled
    const day20 = octDays.find((d) => d.dayNum === 20);
    assert(day20 && !day20.isDisabled, 'maxDate string: Day 20 (max boundary) is ENABLED');

    // Day 25 (after maxDate) must be disabled
    const day25 = octDays.find((d) => d.dayNum === 25);
    assert(day25 && day25.isDisabled, 'maxDate string: Day 25 (after 2026-10-20) is DISABLED');
  }

  // 3.2 Epoch number minDate & maxDate
  {
    const epochMin = new Date(2026, 9, 10, 12, 0, 0).getTime();
    const epochMax = new Date(2026, 9, 20, 15, 30, 0).getTime();
    const html = ReactDOMServer.renderToString(
      <DirectCalendar
        month={testMonth}
        minDate={epochMin}
        maxDate={epochMax}
      />
    );
    const days = analyzeCalendarHtml(html);
    const octDays = days.filter((d) => !d.isPrevOrNext);

    const day9 = octDays.find((d) => d.dayNum === 9);
    const day10 = octDays.find((d) => d.dayNum === 10);
    const day20 = octDays.find((d) => d.dayNum === 20);
    const day21 = octDays.find((d) => d.dayNum === 21);

    assert(day9 && day9.isDisabled, 'minDate epoch: Day 9 (before epoch min) is DISABLED');
    assert(day10 && !day10.isDisabled, 'minDate epoch: Day 10 is ENABLED (startOfDay normalized)');
    assert(day20 && !day20.isDisabled, 'maxDate epoch: Day 20 is ENABLED (endOfDay normalized)');
    assert(day21 && day21.isDisabled, 'maxDate epoch: Day 21 (after epoch max) is DISABLED');
  }

  // 3.3 Date object minDate & maxDate
  {
    const dateMin = new Date(2026, 9, 10, 18, 0, 0);
    const dateMax = new Date(2026, 9, 20, 6, 0, 0);
    const html = ReactDOMServer.renderToString(
      <DirectCalendar
        month={testMonth}
        minDate={dateMin}
        maxDate={dateMax}
      />
    );
    const days = analyzeCalendarHtml(html);
    const octDays = days.filter((d) => !d.isPrevOrNext);

    const day9 = octDays.find((d) => d.dayNum === 9);
    const day10 = octDays.find((d) => d.dayNum === 10);
    const day20 = octDays.find((d) => d.dayNum === 20);
    const day21 = octDays.find((d) => d.dayNum === 21);

    assert(day9 && day9.isDisabled, 'minDate Date object: Day 9 is DISABLED');
    assert(day10 && !day10.isDisabled, 'minDate Date object: Day 10 is ENABLED');
    assert(day20 && !day20.isDisabled, 'maxDate Date object: Day 20 is ENABLED');
    assert(day21 && day21.isDisabled, 'maxDate Date object: Day 21 is DISABLED');
  }

  // 3.4 Invalid string / null / undefined minDate / maxDate
  {
    const html = ReactDOMServer.renderToString(
      <DirectCalendar
        month={testMonth}
        minDate="invalid-date-string"
        maxDate={null}
      />
    );
    const days = analyzeCalendarHtml(html);
    const octDays = days.filter((d) => !d.isPrevOrNext);
    const anyDisabled = octDays.some((d) => d.isDisabled);
    assert(
      !anyDisabled,
      'Invalid string minDate and null maxDate gracefully default to unconstrained'
    );
  }
});

// -----------------------------------------------------------------------------
// SECTION 4: Calendar events Resilience Stress
// -----------------------------------------------------------------------------
runSection('4. Calendar events Tolerance (null, undefined, missing date, invalid)', () => {
  const testMonth = new Date(2026, 9, 1); // Oct 2026

  // Helper
  function analyzeCalendarHtml(html) {
    const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/g;
    const days = [];
    let match;
    while ((match = buttonRegex.exec(html)) !== null) {
      const fullTag = match[0];
      const inner = match[1];
      if (
        fullTag.includes('aria-label="Previous month"') ||
        fullTag.includes('aria-label="Next month"')
      ) {
        continue;
      }
      const dayMatch = inner.match(/<span>(\d+)<\/span>/);
      if (dayMatch) {
        const dayNum = parseInt(dayMatch[1], 10);
        const hasDot = inner.includes('rounded-full');
        const isPrevOrNext = fullTag.includes('text-muted-foreground/40');
        days.push({ dayNum, hasDot, isPrevOrNext });
      }
    }
    return days;
  }

  // 4.1 events={null}
  {
    const html = ReactDOMServer.renderToString(
      <DirectCalendar month={testMonth} events={null} />
    );
    const days = analyzeCalendarHtml(html);
    const dotsCount = days.filter((d) => d.hasDot).length;
    assert(dotsCount === 0, 'events={null} renders 0 event dots without crashing');
  }

  // 4.2 events={undefined}
  {
    const html = ReactDOMServer.renderToString(
      <DirectCalendar month={testMonth} events={undefined} />
    );
    const days = analyzeCalendarHtml(html);
    const dotsCount = days.filter((d) => d.hasDot).length;
    assert(dotsCount === 0, 'events={undefined} renders 0 event dots without crashing');
  }

  // 4.3 Adversarial events array: null items, missing date property, invalid dates
  {
    const adversarialEvents = [
      null,
      undefined,
      {},
      { title: 'Notice without date' },
      { date: null, title: 'Null date' },
      { date: undefined, title: 'Undefined date' },
      { date: 'invalid-string', title: 'Invalid date string' },
      { date: '2026-10-12', title: 'Mid-term exam' },
      { date: new Date(2026, 9, 18), title: 'Sports Day' },
      { date: new Date(2026, 9, 18, 14, 0, 0), title: 'Sports Day Ceremony' }, // duplicate day
    ];

    const html = ReactDOMServer.renderToString(
      <DirectCalendar month={testMonth} events={adversarialEvents} />
    );
    const days = analyzeCalendarHtml(html);
    const octDays = days.filter((d) => !d.isPrevOrNext);

    const day12 = octDays.find((d) => d.dayNum === 12);
    const day18 = octDays.find((d) => d.dayNum === 18);
    const day19 = octDays.find((d) => d.dayNum === 19);

    assert(
      day12 && day12.hasDot,
      'Adversarial events: Day 12 renders event indicator dot for "2026-10-12"'
    );
    assert(
      day18 && day18.hasDot,
      'Adversarial events: Day 18 renders event indicator dot for Date object'
    );
    assert(
      day19 && !day19.hasDot,
      'Adversarial events: Day 19 has NO event indicator dot'
    );
  }
});

// -----------------------------------------------------------------------------
// SECTION 5: Calendar Selection & Month Navigation
// -----------------------------------------------------------------------------
runSection('5. Calendar Selection Highlighting & Month Navigation', () => {
  // 5.1 Selected date as string "2026-10-14"
  {
    const html = ReactDOMServer.renderToString(
      <DirectCalendar
        month={new Date(2026, 9, 1)}
        selected="2026-10-14"
      />
    );
    assert(
      html.includes('bg-primary text-primary-foreground') &&
        html.includes('<span>14</span>'),
      'selected="2026-10-14" string highlights Day 14 with primary token'
    );
  }

  // 5.2 Selected date as Date object
  {
    const selectedDate = new Date(2026, 9, 22);
    const html = ReactDOMServer.renderToString(
      <DirectCalendar
        month={new Date(2026, 9, 1)}
        selected={selectedDate}
      />
    );
    assert(
      html.includes('bg-primary text-primary-foreground') &&
        html.includes('<span>22</span>'),
      'selected=Date(2026, 9, 22) highlights Day 22 with primary token'
    );
  }

  // 5.3 Month navigation: Month header rendering
  {
    const novemberHtml = ReactDOMServer.renderToString(
      <DirectCalendar month={new Date(2026, 10, 1)} />
    );
    assert(
      novemberHtml.includes('November') && novemberHtml.includes('2026'),
      'Calendar renders "November 2026" header correctly'
    );

    const decHtml = ReactDOMServer.renderToString(
      <DirectCalendar month="2026-12-01" />
    );
    assert(
      decHtml.includes('December') && decHtml.includes('2026'),
      'Calendar renders "December 2026" from month="2026-12-01" string'
    );
  }

  // 5.4 Navigation controls exist with proper accessible labels
  {
    const html = ReactDOMServer.renderToString(
      <DirectCalendar month={new Date(2026, 9, 1)} />
    );
    assert(
      html.includes('aria-label="Previous month"'),
      'Calendar includes accessible "Previous month" navigation button'
    );
    assert(
      html.includes('aria-label="Next month"'),
      'Calendar includes accessible "Next month" navigation button'
    );
  }
});

// -----------------------------------------------------------------------------
// FINAL SUMMARY
// -----------------------------------------------------------------------------
console.log(`\n======================================================`);
console.log(`CHALLENGER EMPIRICAL VERIFICATION SUMMARY`);
console.log(`Total Assertions: ${passed + failed}`);
console.log(`Passed:           ${passed}`);
console.log(`Failed:           ${failed}`);
console.log(`Pass Rate:        ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log(`======================================================\n`);

if (failed > 0) {
  console.error(`FAILED ASSERTIONS (${failed}):`);
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log(`[VERDICT: APPROVE] All empirical challenger assertions PASSED!`);
}
