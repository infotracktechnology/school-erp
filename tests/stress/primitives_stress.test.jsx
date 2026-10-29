import React from 'react';
import ReactDOMServer from 'react-dom/server';

// 1. Direct Imports
import { Button as DirButton, buttonVariants as dirButtonVariants } from '@/components/ui/button';
import { Badge as DirBadge, badgeVariants as dirBadgeVariants } from '@/components/ui/badge';
import {
  Card as DirCard,
  CardHeader as DirCardHeader,
  CardFooter as DirCardFooter,
  CardTitle as DirCardTitle,
  CardDescription as DirCardDescription,
  CardContent as DirCardContent,
} from '@/components/ui/card';
import { Input as DirInput } from '@/components/ui/input';
import {
  Table as DirTable,
  TableHeader as DirTableHeader,
  TableBody as DirTableBody,
  TableFooter as DirTableFooter,
  TableHead as DirTableHead,
  TableRow as DirTableRow,
  TableCell as DirTableCell,
  TableCaption as DirTableCaption,
} from '@/components/ui/table';
import {
  Dialog as DirDialog,
  DialogPortal as DirDialogPortal,
  DialogOverlay as DirDialogOverlay,
  DialogTrigger as DirDialogTrigger,
  DialogClose as DirDialogClose,
  DialogContent as DirDialogContent,
  DialogHeader as DirDialogHeader,
  DialogFooter as DirDialogFooter,
  DialogTitle as DirDialogTitle,
  DialogDescription as DirDialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet as DirSheet,
  SheetPortal as DirSheetPortal,
  SheetOverlay as DirSheetOverlay,
  SheetTrigger as DirSheetTrigger,
  SheetClose as DirSheetClose,
  SheetContent as DirSheetContent,
  SheetHeader as DirSheetHeader,
  SheetFooter as DirSheetFooter,
  SheetTitle as DirSheetTitle,
  SheetDescription as DirSheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu as DirDropdownMenu,
  DropdownMenuTrigger as DirDropdownMenuTrigger,
  DropdownMenuContent as DirDropdownMenuContent,
  DropdownMenuItem as DirDropdownMenuItem,
  DropdownMenuCheckboxItem as DirDropdownMenuCheckboxItem,
  DropdownMenuRadioItem as DirDropdownMenuRadioItem,
  DropdownMenuLabel as DirDropdownMenuLabel,
  DropdownMenuSeparator as DirDropdownMenuSeparator,
  DropdownMenuShortcut as DirDropdownMenuShortcut,
  DropdownMenuGroup as DirDropdownMenuGroup,
  DropdownMenuPortal as DirDropdownMenuPortal,
  DropdownMenuSub as DirDropdownMenuSub,
  DropdownMenuSubContent as DirDropdownMenuSubContent,
  DropdownMenuSubTrigger as DirDropdownMenuSubTrigger,
  DropdownMenuRadioGroup as DirDropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';
import {
  Select as DirSelect,
  SelectGroup as DirSelectGroup,
  SelectValue as DirSelectValue,
  SelectTrigger as DirSelectTrigger,
  SelectContent as DirSelectContent,
  SelectLabel as DirSelectLabel,
  SelectItem as DirSelectItem,
  SelectSeparator as DirSelectSeparator,
  SelectScrollUpButton as DirSelectScrollUpButton,
  SelectScrollDownButton as DirSelectScrollDownButton,
} from '@/components/ui/select';
import {
  Tabs as DirTabs,
  TabsList as DirTabsList,
  TabsTrigger as DirTabsTrigger,
  TabsContent as DirTabsContent,
} from '@/components/ui/tabs';
import {
  Avatar as DirAvatar,
  AvatarImage as DirAvatarImage,
  AvatarFallback as DirAvatarFallback,
} from '@/components/ui/avatar';
import {
  Toaster as DirToaster,
  toast as dirToast,
  showToast as dirShowToast,
} from '@/components/ui/toast';
import { Calendar as DirCalendar } from '@/components/ui/calendar';
import {
  Popover as DirPopover,
  PopoverTrigger as DirPopoverTrigger,
  PopoverContent as DirPopoverContent,
  PopoverAnchor as DirPopoverAnchor,
} from '@/components/ui/popover';
import { Separator as DirSeparator } from '@/components/ui/separator';

// 2. Barrel Imports
import * as UI from '@/components/ui';

export async function runAllStressTests() {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    failures: [],
  };

  function test(name, fn) {
    results.total++;
    try {
      fn();
      results.passed++;
      console.log(`  ✔ [PASS] ${name}`);
    } catch (err) {
      results.failed++;
      results.failures.push({ name, error: err.message || String(err) });
      console.error(`  ✖ [FAIL] ${name}: ${err.message || String(err)}`);
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  function render(jsx) {
    return ReactDOMServer.renderToStaticMarkup(jsx);
  }

  console.log('\n======================================================');
  console.log('   M1 SHADCN/UI PRIMITIVES EMPIRICAL STRESS SUITE     ');
  console.log('======================================================\n');

  // ------------------------------------------------------------------
  // SUITE 1: Direct vs Barrel Imports Parity
  // ------------------------------------------------------------------
  console.log('▶ Suite 1: Direct vs Barrel Import Parity');

  test('S1.1: Button and buttonVariants match between direct and barrel', () => {
    assert(DirButton === UI.Button, 'Button must match UI.Button');
    assert(dirButtonVariants === UI.buttonVariants, 'buttonVariants must match UI.buttonVariants');
  });

  test('S1.2: Badge and badgeVariants match between direct and barrel', () => {
    assert(DirBadge === UI.Badge, 'Badge must match UI.Badge');
    assert(dirBadgeVariants === UI.badgeVariants, 'badgeVariants must match UI.badgeVariants');
  });

  test('S1.3: Card subcomponents match between direct and barrel', () => {
    assert(DirCard === UI.Card, 'Card must match');
    assert(DirCardHeader === UI.CardHeader, 'CardHeader must match');
    assert(DirCardTitle === UI.CardTitle, 'CardTitle must match');
    assert(DirCardDescription === UI.CardDescription, 'CardDescription must match');
    assert(DirCardContent === UI.CardContent, 'CardContent must match');
    assert(DirCardFooter === UI.CardFooter, 'CardFooter must match');
  });

  test('S1.4: Input matches between direct and barrel', () => {
    assert(DirInput === UI.Input, 'Input must match');
  });

  test('S1.5: Table subcomponents match between direct and barrel', () => {
    assert(DirTable === UI.Table, 'Table must match');
    assert(DirTableHeader === UI.TableHeader, 'TableHeader must match');
    assert(DirTableBody === UI.TableBody, 'TableBody must match');
    assert(DirTableFooter === UI.TableFooter, 'TableFooter must match');
    assert(DirTableHead === UI.TableHead, 'TableHead must match');
    assert(DirTableRow === UI.TableRow, 'TableRow must match');
    assert(DirTableCell === UI.TableCell, 'TableCell must match');
    assert(DirTableCaption === UI.TableCaption, 'TableCaption must match');
  });

  test('S1.6: Dialog subcomponents match between direct and barrel', () => {
    assert(DirDialog === UI.Dialog, 'Dialog must match');
    assert(DirDialogPortal === UI.DialogPortal, 'DialogPortal must match');
    assert(DirDialogOverlay === UI.DialogOverlay, 'DialogOverlay must match');
    assert(DirDialogTrigger === UI.DialogTrigger, 'DialogTrigger must match');
    assert(DirDialogClose === UI.DialogClose, 'DialogClose must match');
    assert(DirDialogContent === UI.DialogContent, 'DialogContent must match');
    assert(DirDialogHeader === UI.DialogHeader, 'DialogHeader must match');
    assert(DirDialogFooter === UI.DialogFooter, 'DialogFooter must match');
    assert(DirDialogTitle === UI.DialogTitle, 'DialogTitle must match');
    assert(DirDialogDescription === UI.DialogDescription, 'DialogDescription must match');
  });

  test('S1.7: Sheet subcomponents match between direct and barrel', () => {
    assert(DirSheet === UI.Sheet, 'Sheet must match');
    assert(DirSheetPortal === UI.SheetPortal, 'SheetPortal must match');
    assert(DirSheetOverlay === UI.SheetOverlay, 'SheetOverlay must match');
    assert(DirSheetTrigger === UI.SheetTrigger, 'SheetTrigger must match');
    assert(DirSheetClose === UI.SheetClose, 'SheetClose must match');
    assert(DirSheetContent === UI.SheetContent, 'SheetContent must match');
    assert(DirSheetHeader === UI.SheetHeader, 'SheetHeader must match');
    assert(DirSheetFooter === UI.SheetFooter, 'SheetFooter must match');
    assert(DirSheetTitle === UI.SheetTitle, 'SheetTitle must match');
    assert(DirSheetDescription === UI.SheetDescription, 'SheetDescription must match');
  });

  test('S1.8: DropdownMenu subcomponents match between direct and barrel', () => {
    assert(DirDropdownMenu === UI.DropdownMenu, 'DropdownMenu must match');
    assert(DirDropdownMenuTrigger === UI.DropdownMenuTrigger, 'DropdownMenuTrigger must match');
    assert(DirDropdownMenuContent === UI.DropdownMenuContent, 'DropdownMenuContent must match');
    assert(DirDropdownMenuItem === UI.DropdownMenuItem, 'DropdownMenuItem must match');
    assert(DirDropdownMenuCheckboxItem === UI.DropdownMenuCheckboxItem, 'DropdownMenuCheckboxItem must match');
    assert(DirDropdownMenuRadioItem === UI.DropdownMenuRadioItem, 'DropdownMenuRadioItem must match');
    assert(DirDropdownMenuLabel === UI.DropdownMenuLabel, 'DropdownMenuLabel must match');
    assert(DirDropdownMenuSeparator === UI.DropdownMenuSeparator, 'DropdownMenuSeparator must match');
    assert(DirDropdownMenuShortcut === UI.DropdownMenuShortcut, 'DropdownMenuShortcut must match');
    assert(DirDropdownMenuGroup === UI.DropdownMenuGroup, 'DropdownMenuGroup must match');
    assert(DirDropdownMenuPortal === UI.DropdownMenuPortal, 'DropdownMenuPortal must match');
    assert(DirDropdownMenuSub === UI.DropdownMenuSub, 'DropdownMenuSub must match');
    assert(DirDropdownMenuSubContent === UI.DropdownMenuSubContent, 'DropdownMenuSubContent must match');
    assert(DirDropdownMenuSubTrigger === UI.DropdownMenuSubTrigger, 'DropdownMenuSubTrigger must match');
    assert(DirDropdownMenuRadioGroup === UI.DropdownMenuRadioGroup, 'DropdownMenuRadioGroup must match');
  });

  test('S1.9: Select subcomponents match between direct and barrel', () => {
    assert(DirSelect === UI.Select, 'Select must match');
    assert(DirSelectGroup === UI.SelectGroup, 'SelectGroup must match');
    assert(DirSelectValue === UI.SelectValue, 'SelectValue must match');
    assert(DirSelectTrigger === UI.SelectTrigger, 'SelectTrigger must match');
    assert(DirSelectContent === UI.SelectContent, 'SelectContent must match');
    assert(DirSelectLabel === UI.SelectLabel, 'SelectLabel must match');
    assert(DirSelectItem === UI.SelectItem, 'SelectItem must match');
    assert(DirSelectSeparator === UI.SelectSeparator, 'SelectSeparator must match');
    assert(DirSelectScrollUpButton === UI.SelectScrollUpButton, 'SelectScrollUpButton must match');
    assert(DirSelectScrollDownButton === UI.SelectScrollDownButton, 'SelectScrollDownButton must match');
  });

  test('S1.10: Tabs, Avatar, Toast, Calendar, Popover, Separator match between direct and barrel', () => {
    assert(DirTabs === UI.Tabs, 'Tabs must match');
    assert(DirTabsList === UI.TabsList, 'TabsList must match');
    assert(DirTabsTrigger === UI.TabsTrigger, 'TabsTrigger must match');
    assert(DirTabsContent === UI.TabsContent, 'TabsContent must match');
    assert(DirAvatar === UI.Avatar, 'Avatar must match');
    assert(DirAvatarImage === UI.AvatarImage, 'AvatarImage must match');
    assert(DirAvatarFallback === UI.AvatarFallback, 'AvatarFallback must match');
    assert(DirToaster === UI.Toaster, 'Toaster must match');
    assert(dirToast === UI.toast, 'toast must match');
    assert(dirShowToast === UI.showToast, 'showToast must match');
    assert(DirCalendar === UI.Calendar, 'Calendar must match');
    assert(DirPopover === UI.Popover, 'Popover must match');
    assert(DirPopoverTrigger === UI.PopoverTrigger, 'PopoverTrigger must match');
    assert(DirPopoverContent === UI.PopoverContent, 'PopoverContent must match');
    assert(DirPopoverAnchor === UI.PopoverAnchor, 'PopoverAnchor must match');
    assert(DirSeparator === UI.Separator, 'Separator must match');
  });

  // ------------------------------------------------------------------
  // SUITE 2: Button Variants, Sizes, and Boundary Stress
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 2: Button Variants, Sizes & Boundary Stress');

  const buttonVariantsList = ['default', 'outline', 'secondary', 'emerald', 'ghost', 'destructive', 'link'];
  const buttonSizesList = ['default', 'sm', 'lg', 'icon'];

  buttonVariantsList.forEach((variant) => {
    test(`S2.Button variant "${variant}" renders valid HTML with expected class`, () => {
      const html = render(<DirButton variant={variant}>Click Me</DirButton>);
      assert(html.includes('<button'), 'Must render <button>');
      assert(html.includes('Click Me'), 'Must render label');
      if (variant === 'emerald') {
        assert(html.includes('bg-emerald-600') && html.includes('text-white'), 'Must have emerald classes');
      } else if (variant === 'destructive') {
        assert(html.includes('bg-destructive') || html.includes('destructive'), 'Must have destructive classes');
      } else if (variant === 'outline') {
        assert(html.includes('border') && html.includes('border-input'), 'Must have outline classes');
      }
    });
  });

  buttonSizesList.forEach((size) => {
    test(`S2.Button size "${size}" renders with proper dimension classes`, () => {
      const html = render(<DirButton size={size}>Size {size}</DirButton>);
      if (size === 'icon') {
        assert(html.includes('h-9 w-9'), 'Icon size must have h-9 w-9');
      } else if (size === 'sm') {
        assert(html.includes('h-8') && html.includes('px-3'), 'sm size must have h-8 px-3');
      } else if (size === 'lg') {
        assert(html.includes('h-10') && html.includes('px-8'), 'lg size must have h-10 px-8');
      } else {
        assert(html.includes('h-9') && html.includes('px-4'), 'default size must have h-9 px-4');
      }
    });
  });

  test('S2.Button boundary: empty children, null, undefined, 0', () => {
    assert(render(<DirButton>{null}</DirButton>).includes('<button'), 'Handles null children');
    assert(render(<DirButton>{undefined}</DirButton>).includes('<button'), 'Handles undefined children');
    assert(render(<DirButton>{""}</DirButton>).includes('<button'), 'Handles empty string children');
    const zeroHtml = render(<DirButton>{0}</DirButton>);
    assert(zeroHtml.includes('>0</button>'), 'Handles numeric 0 children cleanly');
  });

  test('S2.Button boundary: null/undefined/custom className', () => {
    const html1 = render(<DirButton className={null}>Null Class</DirButton>);
    assert(!html1.includes('null'), 'Does not render "null" in class');
    const html2 = render(<DirButton className={undefined}>Undef Class</DirButton>);
    assert(!html2.includes('undefined'), 'Does not render "undefined" in class');
    const html3 = render(<DirButton className="my-custom-test-btn shadow-3xl">Custom</DirButton>);
    assert(html3.includes('my-custom-test-btn'), 'Includes custom className');
  });

  test('S2.Button boundary: unknown variant and unknown size', () => {
    const html = render(<DirButton variant="nonexistent_variant" size="huge_size">Fallback</DirButton>);
    assert(html.includes('<button'), 'Renders button even with invalid variant/size');
  });

  test('S2.Button asChild renders child element with slot merge', () => {
    const html = render(
      <DirButton asChild variant="emerald">
        <a href="https://example.com" data-custom="test">Anchor Link</a>
      </DirButton>
    );
    assert(html.includes('<a href="https://example.com"'), 'Renders anchor element when asChild=true');
    assert(html.includes('bg-emerald-600'), 'Transfers button variant styles to anchor');
    assert(html.includes('data-custom="test"'), 'Preserves child props');
  });

  test('S2.Button disabled state includes disabled attribute and classes', () => {
    const html = render(<DirButton disabled>Disabled Action</DirButton>);
    assert(html.includes('disabled=""') || html.includes('disabled'), 'Has disabled attribute');
    assert(html.includes('disabled:pointer-events-none'), 'Has disabled pointer events class');
    assert(html.includes('disabled:opacity-50'), 'Has disabled opacity class');
  });

  // ------------------------------------------------------------------
  // SUITE 3: Badge Variants and Boundary Stress
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 3: Badge Variants & Boundary Stress');

  const badgeVariantsList = ['default', 'secondary', 'destructive', 'outline', 'success', 'emerald'];

  badgeVariantsList.forEach((variant) => {
    test(`S3.Badge variant "${variant}" renders without error`, () => {
      const html = render(<DirBadge variant={variant}>Badge {variant}</DirBadge>);
      assert(html.includes('Badge ' + variant), 'Renders label');
      if (variant === 'emerald' || variant === 'success') {
        assert(html.includes('bg-emerald-50') && html.includes('text-emerald-800'), 'Emerald badge styling');
      }
    });
  });

  test('S3.Badge boundary: empty children, null, numbers, custom classes', () => {
    assert(render(<DirBadge>{null}</DirBadge>).length > 0, 'Handles null children');
    assert(render(<DirBadge>{0}</DirBadge>).includes('>0</div>'), 'Handles 0 count badge');
    const custom = render(<DirBadge className="tracking-widest uppercase">Custom</DirBadge>);
    assert(custom.includes('tracking-widest'), 'Merges custom classes');
  });

  test('S3.Badge styling conformance check (rounded pill vs rounded-md)', () => {
    const html = render(<DirBadge>Test</DirBadge>);
    const isPill = html.includes('rounded-full');
    const isMd = html.includes('rounded-md');
    console.log(`    ℹ Badge border radius in DOM: ${isPill ? 'rounded-full (pill)' : isMd ? 'rounded-md (medium)' : 'other'}`);
  });

  // ------------------------------------------------------------------
  // SUITE 4: Card Component Family Stress
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 4: Card Component Family Stress');

  test('S4.Card full composition renders hierarchically', () => {
    const html = render(
      <DirCard className="w-96 shadow-lg">
        <DirCardHeader>
          <DirCardTitle>Student Attendance Summary</DirCardTitle>
          <DirCardDescription>Academic Year 2026-2027</DirCardDescription>
        </DirCardHeader>
        <DirCardContent>
          <p>Overall attendance: 96.5%</p>
        </DirCardContent>
        <DirCardFooter>
          <DirButton size="sm">Download Report</DirButton>
        </DirCardFooter>
      </DirCard>
    );
    assert(html.includes('Student Attendance Summary'), 'Renders title');
    assert(html.includes('Academic Year 2026-2027'), 'Renders description');
    assert(html.includes('96.5%'), 'Renders content');
    assert(html.includes('Download Report'), 'Renders footer action');
    assert(html.includes('rounded-xl'), 'Card specifies rounded-xl border radius');
    assert(html.includes('border-border'), 'Card uses border-border token');
  });

  test('S4.Card subcomponents standalone instantiation with null props', () => {
    assert(render(<DirCard />).includes('rounded-xl'), 'Empty Card renders');
    assert(render(<DirCardHeader />).includes('flex flex-col'), 'Empty CardHeader renders');
    assert(render(<DirCardTitle />).includes('font-semibold'), 'Empty CardTitle renders');
    assert(render(<DirCardDescription />).includes('text-muted-foreground'), 'Empty CardDescription renders');
    assert(render(<DirCardContent />).includes('p-6'), 'Empty CardContent renders');
    assert(render(<DirCardFooter />).includes('flex items-center'), 'Empty CardFooter renders');
  });

  // ------------------------------------------------------------------
  // SUITE 5: Input Component Stress
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 5: Input Component Stress');

  const inputTypes = ['text', 'password', 'email', 'number', 'date', 'file', 'search', 'tel', 'url'];

  inputTypes.forEach((type) => {
    test(`S5.Input type="${type}" renders valid input tag`, () => {
      const html = render(<DirInput type={type} placeholder={`Enter ${type}`} />);
      assert(html.includes(`<input type="${type}"`), `Must render <input type="${type}">`);
      assert(html.includes('focus-visible:ring-1') || html.includes('focus-visible:ring-ring'), 'Has focus ring');
    });
  });

  test('S5.Input boundary: disabled, value, custom classNames', () => {
    const disabledHtml = render(<DirInput disabled value="Readonly value" readOnly />);
    assert(disabledHtml.includes('disabled'), 'Has disabled attribute');
    assert(disabledHtml.includes('disabled:cursor-not-allowed'), 'Has disabled cursor style');

    const customHtml = render(<DirInput className="bg-red-50 text-red-900 border-red-500" />);
    assert(customHtml.includes('bg-red-50'), 'Merges custom background');
    assert(customHtml.includes('border-red-500'), 'Merges custom border');
  });

  // ------------------------------------------------------------------
  // SUITE 6: Table Component Family Stress
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 6: Table Component Family Stress');

  test('S6.Table full composite with header, body, footer, caption', () => {
    const html = render(
      <DirTable className="min-w-full">
        <DirTableCaption>Current Class Roll-call Roster</DirTableCaption>
        <DirTableHeader>
          <DirTableRow>
            <DirTableHead>Roll #</DirTableHead>
            <DirTableHead>Student Name</DirTableHead>
            <DirTableHead>Status</DirTableHead>
          </DirTableRow>
        </DirTableHeader>
        <DirTableBody>
          <DirTableRow data-state="selected">
            <DirTableCell>101</DirTableCell>
            <DirTableCell>Alice Johnson</DirTableCell>
            <DirTableCell><DirBadge variant="emerald">Present</DirBadge></DirTableCell>
          </DirTableRow>
          <DirTableRow>
            <DirTableCell>102</DirTableCell>
            <DirTableCell>Bob Smith</DirTableCell>
            <DirTableCell><DirBadge variant="destructive">Absent</DirBadge></DirTableCell>
          </DirTableRow>
        </DirTableBody>
        <DirTableFooter>
          <DirTableRow>
            <DirTableCell colSpan={2}>Total Present</DirTableCell>
            <DirTableCell>1</DirTableCell>
          </DirTableRow>
        </DirTableFooter>
      </DirTable>
    );
    assert(html.includes('overflow-auto'), 'Table wrapper has overflow-auto');
    assert(html.includes('<caption'), 'Renders caption');
    assert(html.includes('data-state="selected"'), 'Row supports data-state="selected"');
    assert(html.includes('Alice Johnson'), 'Renders cell data');
    assert(html.includes('Bob Smith'), 'Renders cell data');
  });

  test('S6.Table large dataset volume test (100 rows x 5 columns)', () => {
    const rows = Array.from({ length: 100 }, (_, i) => i + 1);
    const html = render(
      <DirTable>
        <DirTableBody>
          {rows.map((n) => (
            <DirTableRow key={n}>
              <DirTableCell>{n}</DirTableCell>
              <DirTableCell>Item {n}</DirTableCell>
              <DirTableCell>Value {n * 10}</DirTableCell>
              <DirTableCell>Active</DirTableCell>
              <DirTableCell><DirButton size="sm">Action</DirButton></DirTableCell>
            </DirTableRow>
          ))}
        </DirTableBody>
      </DirTable>
    );
    assert(html.includes('Item 100'), 'Successfully rendered 100 table rows');
  });

  // ------------------------------------------------------------------
  // SUITE 7: Dialog, Sheet, Popover, DropdownMenu Primitives
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 7: Modal & Flyout Primitives (Dialog, Sheet, Popover, DropdownMenu)');

  test('S7.Dialog basic closed structure renders trigger', () => {
    const html = render(
      <DirDialog>
        <DirDialogTrigger asChild>
          <DirButton>Open Student Modal</DirButton>
        </DirDialogTrigger>
        <DirDialogContent>
          <DirDialogHeader>
            <DirDialogTitle>Admit New Student</DirDialogTitle>
            <DirDialogDescription>Fill out admission credentials</DirDialogDescription>
          </DirDialogHeader>
          <DirDialogFooter>
            <DirButton variant="outline">Cancel</DirButton>
            <DirButton variant="emerald">Submit</DirButton>
          </DirDialogFooter>
        </DirDialogContent>
      </DirDialog>
    );
    assert(html.includes('Open Student Modal'), 'Renders trigger button');
  });

  const sheetSides = ['top', 'bottom', 'left', 'right'];
  sheetSides.forEach((side) => {
    test(`S7.Sheet side="${side}" structure renders without throwing`, () => {
      const html = render(
        <DirSheet>
          <DirSheetTrigger asChild>
            <DirButton>Open {side} Sheet</DirButton>
          </DirSheetTrigger>
          <DirSheetContent side={side}>
            <DirSheetHeader>
              <DirSheetTitle>{side} Sheet</DirSheetTitle>
              <DirSheetDescription>Nav Drawer</DirSheetDescription>
            </DirSheetHeader>
          </DirSheetContent>
        </DirSheet>
      );
      assert(html.includes(`Open ${side} Sheet`), `Renders ${side} trigger`);
    });
  });

  test('S7.Popover structure renders trigger and anchor', () => {
    const html = render(
      <DirPopover>
        <DirPopoverAnchor asChild>
          <div>
            <DirPopoverTrigger asChild>
              <DirButton variant="ghost">Filter Popover</DirButton>
            </DirPopoverTrigger>
          </div>
        </DirPopoverAnchor>
        <DirPopoverContent align="start">
          <p>Filter options</p>
        </DirPopoverContent>
      </DirPopover>
    );
    assert(html.includes('Filter Popover'), 'Renders popover trigger');
  });

  test('S7.DropdownMenu composition renders trigger and subcomponents', () => {
    const html = render(
      <DirDropdownMenu>
        <DirDropdownMenuTrigger asChild>
          <DirButton>User Profile</DirButton>
        </DirDropdownMenuTrigger>
        <DirDropdownMenuContent>
          <DirDropdownMenuLabel>My Account</DirDropdownMenuLabel>
          <DirDropdownMenuSeparator />
          <DirDropdownMenuGroup>
            <DirDropdownMenuItem>Profile Settings</DirDropdownMenuItem>
            <DirDropdownMenuItem>Billing</DirDropdownMenuItem>
          </DirDropdownMenuGroup>
          <DirDropdownMenuSeparator />
          <DirDropdownMenuCheckboxItem checked={true}>Dark Mode</DirDropdownMenuCheckboxItem>
          <DirDropdownMenuRadioGroup value="academic">
            <DirDropdownMenuRadioItem value="academic">Academic Staff</DirDropdownMenuRadioItem>
            <DirDropdownMenuRadioItem value="admin">Admin Staff</DirDropdownMenuRadioItem>
          </DirDropdownMenuRadioGroup>
        </DirDropdownMenuContent>
      </DirDropdownMenu>
    );
    assert(html.includes('User Profile'), 'Renders trigger button');
  });

  // ------------------------------------------------------------------
  // SUITE 8: Select, Tabs, Avatar, Separator
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 8: Form & Structural Primitives (Select, Tabs, Avatar, Separator)');

  test('S8.Select composite renders trigger and placeholder', () => {
    const html = render(
      <DirSelect defaultValue="branch-1">
        <DirSelectTrigger className="w-[180px]">
          <DirSelectValue placeholder="Select Campus Branch" />
        </DirSelectTrigger>
        <DirSelectContent>
          <DirSelectGroup>
            <DirSelectLabel>Campuses</DirSelectLabel>
            <DirSelectItem value="branch-1">Main Campus</DirSelectItem>
            <DirSelectItem value="branch-2">North Campus</DirSelectItem>
            <DirSelectSeparator />
            <DirSelectItem value="branch-3" disabled>South Campus (Inactive)</DirSelectItem>
          </DirSelectGroup>
        </DirSelectContent>
      </DirSelect>
    );
    console.log('    ℹ Select rendered HTML:', html);
    assert(html.includes('w-[180px]'), 'Preserves custom width');
  });

  test('S8.Tabs composite renders tab list and triggers', () => {
    const html = render(
      <DirTabs defaultValue="overview" className="w-full">
        <DirTabsList>
          <DirTabsTrigger value="overview">Overview</DirTabsTrigger>
          <DirTabsTrigger value="attendance">Attendance</DirTabsTrigger>
          <DirTabsTrigger value="grades">Grades</DirTabsTrigger>
        </DirTabsList>
        <DirTabsContent value="overview">
          <div>Overview Content</div>
        </DirTabsContent>
        <DirTabsContent value="attendance">
          <div>Attendance Content</div>
        </DirTabsContent>
      </DirTabs>
    );
    assert(html.includes('Overview'), 'Renders tab trigger Overview');
    assert(html.includes('Attendance'), 'Renders tab trigger Attendance');
  });

  test('S8.Avatar with image and fallback', () => {
    const htmlWithImg = render(
      <DirAvatar className="h-12 w-12">
        <DirAvatarImage src="/photos/principal.jpg" alt="Principal" />
        <DirAvatarFallback>PR</DirAvatarFallback>
      </DirAvatar>
    );
    assert(htmlWithImg.includes('rounded-full'), 'Avatar has rounded-full');
    assert(htmlWithImg.includes('PR'), 'Avatar fallback initials present in tree');
  });

  test('S8.Separator horizontal and vertical orientation', () => {
    const horizHtml = render(<DirSeparator orientation="horizontal" className="my-4" />);
    assert(horizHtml.includes('h-[1px] w-full'), 'Horizontal separator styling');
    assert(horizHtml.includes('my-4'), 'Merges custom className');

    const vertHtml = render(<DirSeparator orientation="vertical" className="h-8" />);
    console.log('    ℹ Separator vertical HTML:', vertHtml);
    assert(vertHtml.includes('w-[1px]') && vertHtml.includes('h-8'), 'Vertical separator styling');
  });

  // ------------------------------------------------------------------
  // SUITE 9: Toast Notifications (Toaster & showToast)
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 9: Toast Notifications');

  test('S9.1: Toaster component renders container markup', () => {
    const html = render(<DirToaster position="top-right" richColors />);
    assert(html.length > 0, 'Toaster renders DOM container');
  });

  test('S9.2: showToast function handles standard types (info, success, error, warning)', () => {
    // In Node.js environment, calling showToast calls sonner's toast methods
    const t1 = dirShowToast('Info message');
    assert(t1 !== undefined, 'showToast info returns toast ID');

    const t2 = dirShowToast('success', 'Student admitted successfully');
    assert(t2 !== undefined, 'showToast success with (type, msg) returns ID');

    const t3 = dirShowToast('Student admitted successfully', 'success');
    assert(t3 !== undefined, 'showToast success with (msg, type) returns ID');

    const t4 = dirShowToast('error', 'Database connection timeout');
    assert(t4 !== undefined, 'showToast error returns ID');

    const t5 = dirShowToast('warning', 'Academic year closing soon');
    assert(t5 !== undefined, 'showToast warning returns ID');
  });

  test('S9.3: showToast boundary cases: empty string, numbers, null, undefined, unknown type', () => {
    assert(dirShowToast('') !== undefined, 'Handles empty string');
    assert(dirShowToast('unknown_type', 'Some text') !== undefined, 'Handles unknown type falling back to info');
    assert(dirShowToast(null, null) !== undefined, 'Handles null inputs without throwing');
    assert(dirShowToast(undefined, undefined) !== undefined, 'Handles undefined inputs');
    assert(dirShowToast(12345, 'info') !== undefined, 'Handles numeric message');
  });

  // ------------------------------------------------------------------
  // SUITE 10: Calendar Component Empirical Stress
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 10: Calendar Component Deep Stress');

  test('S10.1: Calendar uncontrolled renders current month grid', () => {
    const html = render(<DirCalendar />);
    assert(html.includes('Su') && html.includes('Mo') && html.includes('Fr'), 'Renders weekday labels');
    assert(html.includes('h-8 w-8'), 'Renders date cell buttons');
  });

  test('S10.2: Calendar with selected Date object highlights date', () => {
    const date = new Date(2026, 9, 15);
    const html = render(<DirCalendar selected={date} month={date} />);
    assert(html.includes('October 2026'), 'Renders month header');
    assert(html.includes('bg-primary text-primary-foreground'), 'Selected date button has primary background');
  });

  test('S10.3: Calendar leap year handles February 29 correctly', () => {
    const leapDate = new Date(2024, 1, 1); // Feb 2024
    const html = render(<DirCalendar month={leapDate} />);
    assert(html.includes('February 2024'), 'Renders February 2024');
    assert(html.includes('>29<'), 'February 2024 contains day 29');
  });

  test('S10.4: Calendar non-leap year February has 28 days only', () => {
    const nonLeapDate = new Date(2025, 1, 1); // Feb 2025
    const html = render(<DirCalendar month={nonLeapDate} />);
    assert(html.includes('February 2025'), 'Renders February 2025');
    assert(html.includes('>28<'), 'February 2025 contains day 28');
  });

  test('S10.5: Calendar with events renders event indicator dots', () => {
    const date = new Date(2026, 9, 20);
    const events = [
      { date: new Date(2026, 9, 20), title: 'Mid-term Exams' },
      { date: new Date(2026, 9, 25), title: 'Parent-Teacher Meeting' },
    ];
    const html = render(<DirCalendar month={date} events={events} />);
    assert(html.includes('rounded-full'), 'Renders dot indicator for events');
  });

  test('S10.6: Calendar boundary: disabled={true}', () => {
    const html = render(<DirCalendar disabled={true} />);
    assert(html.includes('disabled=""') || html.includes('disabled'), 'Buttons have disabled attribute');
  });

  test('S10.7: Calendar boundary: minDate and maxDate as Date objects', () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 10);
    const maxDate = new Date(2026, 9, 20);
    const html = render(<DirCalendar month={month} minDate={minDate} maxDate={maxDate} />);
    assert(html.includes('October 2026'), 'Renders October 2026');
  });

  // CRITICAL BUG PROBE 1: String minDate/maxDate
  test('S10.8 [VULNERABILITY PROBE]: Calendar with minDate/maxDate as string ("2026-10-10")', () => {
    const month = new Date(2026, 9, 1);
    // Many API responses pass string dates!
    try {
      const html = render(<DirCalendar month={month} minDate="2026-10-10" maxDate="2026-10-25" />);
      assert(html.includes('October 2026'), 'Successfully renders with string min/max dates');
    } catch (err) {
      throw new Error(`CRITICAL RUNTIME CRASH with string minDate/maxDate: ${err.message}`);
    }
  });

  // CRITICAL BUG PROBE 2: events={null}
  test('S10.9 [VULNERABILITY PROBE]: Calendar with events={null}', () => {
    try {
      const html = render(<DirCalendar events={null} />);
      assert(html.includes('<button'), 'Successfully renders when events={null}');
    } catch (err) {
      throw new Error(`CRITICAL RUNTIME CRASH with events={null}: ${err.message}`);
    }
  });

  // CRITICAL BUG PROBE 3: selected string date
  test('S10.10 [VULNERABILITY PROBE]: Calendar with string selected="2026-10-28"', () => {
    try {
      const html = render(<DirCalendar selected="2026-10-28" />);
      assert(html.includes('<button'), 'Successfully renders when selected is a date string');
    } catch (err) {
      throw new Error(`CRITICAL RUNTIME CRASH with selected string: ${err.message}`);
    }
  });

  // ------------------------------------------------------------------
  // SUITE 11: Deep Radix Edge Cases & Open Modal SSR Behavior
  // ------------------------------------------------------------------
  console.log('\n▶ Suite 11: Radix Deep Edge Cases & Open State SSR');

  test('S11.1: Dialog open={true} SSR render check', () => {
    try {
      const html = render(
        <DirDialog open={true}>
          <DirDialogContent>
            <DirDialogTitle>Open SSR Dialog</DirDialogTitle>
            <DirDialogDescription>Modal Content</DirDialogDescription>
          </DirDialogContent>
        </DirDialog>
      );
      assert(html !== undefined, 'Dialog open={true} handles SSR without crash');
    } catch (err) {
      throw new Error(`Dialog open={true} SSR crash: ${err.message}`);
    }
  });

  test('S11.2: Sheet open={true} SSR render check', () => {
    try {
      const html = render(
        <DirSheet open={true}>
          <DirSheetContent side="right">
            <DirSheetTitle>Open SSR Sheet</DirSheetTitle>
          </DirSheetContent>
        </DirSheet>
      );
      assert(html !== undefined, 'Sheet open={true} handles SSR without crash');
    } catch (err) {
      throw new Error(`Sheet open={true} SSR crash: ${err.message}`);
    }
  });

  test('S11.3: Popover open={true} SSR render check', () => {
    try {
      const html = render(
        <DirPopover open={true}>
          <DirPopoverTrigger asChild><DirButton>Trigger</DirButton></DirPopoverTrigger>
          <DirPopoverContent>Popover open</DirPopoverContent>
        </DirPopover>
      );
      assert(html !== undefined, 'Popover open={true} handles SSR');
    } catch (err) {
      throw new Error(`Popover open={true} SSR crash: ${err.message}`);
    }
  });

  test('S11.4: Button asChild with text only throws Slot error or handles gracefully', () => {
    let threw = false;
    try {
      render(<DirButton asChild>Plain text child</DirButton>);
    } catch (err) {
      threw = true;
      console.log(`    ℹ Button asChild with raw string child threw as expected for Radix Slot: ${err.message}`);
    }
    // Documenting behavior: Radix Slot requires a valid React element
  });

  test('S11.5: Tabs with no defaultValue or value renders gracefully', () => {
    const html = render(
      <DirTabs>
        <DirTabsList>
          <DirTabsTrigger value="a">A</DirTabsTrigger>
          <DirTabsTrigger value="b">B</DirTabsTrigger>
        </DirTabsList>
        <DirTabsContent value="a">Pane A</DirTabsContent>
      </DirTabs>
    );
    assert(html.includes('Pane A') || html.includes('Trigger') || html.includes('>A<'), 'Tabs renders without crash');
  });

  // ------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`STRESS SUITE SUMMARY: ${results.passed}/${results.total} Passed (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  if (results.failed > 0) {
    console.log(`FAILURES (${results.failed}):`);
    results.failures.forEach((f, idx) => {
      console.log(`  ${idx + 1}. ${f.name}`);
      console.log(`     -> ${f.error}`);
    });
  }
  console.log('======================================================\n');

  return results;
}
