/**
 * Canonical Barrel Export for School Web ERP shadcn/ui Primitives
 * Allows both:
 *   import { Button, Card, Dialog } from "@/components/ui";
 *   import { Button } from "@/components/ui/button";
 */

// 1. Button
export { Button, buttonVariants } from "./button";

// 2. Badge
export { Badge, badgeVariants } from "./badge";

// 3. Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";

// 4. Input
export { Input } from "./input";

// 5. Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";

// 6. Dialog
export {
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
} from "./dialog";

// 7. Sheet
export {
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
} from "./sheet";

// 8. Dropdown Menu
export {
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
} from "./dropdown-menu";

// 9. Select
export {
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
} from "./select";

// 10. Tabs
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./tabs";

// 11. Avatar
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./avatar";

// 12. Toast (Sonner wrapper)
export {
  Toaster,
  toast,
  showToast,
} from "./toast";

// 13. Calendar
export { Calendar } from "./calendar";

// 14. Popover
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./popover";

// 15. Separator
export { Separator } from "./separator";
