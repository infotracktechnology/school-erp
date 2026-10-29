import * as React from "react";
import React__default from "react";
import { renderToString } from "react-dom/server";
import assert from "assert";
import { jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Check, Circle, ChevronDown, ChevronUp, ChevronLeft } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Toaster as Toaster$1, toast } from "sonner";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
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
cva(
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
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
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
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
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
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
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
const SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
SheetFooter.displayName = "SheetFooter";
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
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
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
const DropdownMenuShortcut = ({ className, ...props }) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn("ml-auto text-xs tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      ref,
      className: cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
      ]
    }
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      ref,
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
    }
  )
);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      ref,
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
    }
  )
);
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      ref,
      className: cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) })
);
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      ref,
      className: cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
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
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-emerald-500/40 group-[.toaster]:bg-emerald-50/90 dark:group-[.toaster]:bg-emerald-950/60 group-[.toast]:text-emerald-900 dark:group-[.toast]:text-emerald-200",
          error: "group-[.toaster]:border-destructive/40 group-[.toaster]:bg-red-50/90 dark:group-[.toaster]:bg-red-950/60 group-[.toast]:text-red-900 dark:group-[.toast]:text-red-200"
        }
      },
      ...props
    }
  );
};
const showToast = (param1, param2 = "info") => {
  let message = param1;
  let type = param2;
  const knownTypes = ["info", "success", "error", "warning"];
  if (knownTypes.includes(param1) && typeof param2 === "string") {
    type = param1;
    message = param2;
  }
  if (type === "success") return toast.success(message);
  if (type === "error") return toast.error(message);
  if (type === "warning") return toast.warning(message);
  return toast.info(message);
};
function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const d2 = new Date(year, month, day);
      return isNaN(d2.getTime()) ? null : d2;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}
function startOfDay(val) {
  const d = parseDate(val);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
}
function endOfDay(val) {
  const d = parseDate(val);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
}
function isSameDay(date1, date2) {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function Calendar({
  className,
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  events = [],
  minDate,
  maxDate,
  disabled,
  ...props
}) {
  const parsedControlled = parseDate(controlledMonth);
  const parsedSelected = parseDate(selected);
  const initialMonth = React.useMemo(() => {
    if (parsedControlled) return parsedControlled;
    if (parsedSelected) return parsedSelected;
    return /* @__PURE__ */ new Date();
  }, []);
  const [currentMonth, setCurrentMonth] = React.useState(initialMonth);
  const activeMonth = parsedControlled || currentMonth;
  const year = activeMonth.getFullYear();
  const monthIndex = activeMonth.getMonth();
  const handlePrevMonth = () => {
    const newMonth = new Date(year, monthIndex - 1, 1);
    if (!controlledMonth) {
      setCurrentMonth(newMonth);
    }
    onMonthChange == null ? void 0 : onMonthChange(newMonth);
  };
  const handleNextMonth = () => {
    const newMonth = new Date(year, monthIndex + 1, 1);
    if (!controlledMonth) {
      setCurrentMonth(newMonth);
    }
    onMonthChange == null ? void 0 : onMonthChange(newMonth);
  };
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
  const calendarDays = React.useMemo(() => {
    const days = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const date = new Date(year, monthIndex - 1, dayNum);
      days.push({
        date,
        dayNum,
        isCurrentMonth: false,
        isPrev: true
      });
    }
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const date = new Date(year, monthIndex, dayNum);
      days.push({
        date,
        dayNum,
        isCurrentMonth: true
      });
    }
    const targetLength = days.length > 35 ? 42 : 35;
    let nextMonthDay = 1;
    while (days.length < targetLength) {
      const date = new Date(year, monthIndex + 1, nextMonthDay);
      days.push({
        date,
        dayNum: nextMonthDay,
        isCurrentMonth: false,
        isNext: true
      });
      nextMonthDay++;
    }
    return days;
  }, [year, monthIndex, daysInMonth, firstDayOfWeek, daysInPrevMonth]);
  const today = /* @__PURE__ */ new Date();
  const safeEvents = Array.isArray(events) ? events : [];
  const minTime = startOfDay(minDate);
  const maxTime = endOfDay(maxDate);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "p-3 bg-card text-card-foreground border border-border rounded-xl shadow-xs w-fit select-none",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 pt-1 px-1", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-sm font-semibold text-foreground", children: [
            MONTH_NAMES[monthIndex],
            " ",
            year
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handlePrevMonth,
                className: cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                ),
                "aria-label": "Previous month",
                children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleNextMonth,
                className: cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                ),
                "aria-label": "Next month",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1 text-center mb-1", children: DAYS_OF_WEEK.map((d) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-[0.8rem] font-medium text-muted-foreground h-8 flex items-center justify-center",
            children: d
          },
          d
        )) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1", children: calendarDays.map((item, idx) => {
          const isSelected = isSameDay(item.date, selected);
          const isToday = isSameDay(item.date, today);
          let isDisabled = Boolean(disabled);
          const itemTime = item.date.getTime();
          if (minTime !== null && itemTime < minTime) {
            isDisabled = true;
          }
          if (maxTime !== null && itemTime > maxTime) {
            isDisabled = true;
          }
          const dayEvents = safeEvents.filter(
            (ev) => ev && ev.date && isSameDay(ev.date, item.date)
          );
          const hasEvents = dayEvents.length > 0;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              disabled: isDisabled,
              onClick: () => {
                if (!isDisabled) {
                  onSelect == null ? void 0 : onSelect(item.date);
                }
              },
              className: cn(
                "h-8 w-8 text-center text-sm p-0 font-normal relative rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer",
                !item.isCurrentMonth && "text-muted-foreground/40",
                item.isCurrentMonth && !isSelected && "hover:bg-accent/10 hover:text-accent-foreground",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
                isToday && !isSelected && "border border-primary text-primary font-semibold",
                isDisabled && "opacity-30 cursor-not-allowed pointer-events-none"
              ),
              children: [
                /* @__PURE__ */ jsx("span", { children: item.dayNum }),
                hasEvents && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "absolute bottom-1 h-1 w-1 rounded-full",
                      isSelected ? "bg-primary-foreground" : "bg-accent"
                    )
                  }
                )
              ]
            },
            idx
          );
        }) })
      ]
    }
  );
}
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      ref,
      align,
      sideOffset,
      className: cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      ),
      ...props
    }
  ) })
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
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
async function runAllTests() {
  console.log("\n======================================================");
  console.log("   Milestone 1 Interactive Overlays Challenge Suite   ");
  console.log("======================================================\n");
  recordTest("Dialog exports match barrel export", "Dual Import Parity", () => {
    assert.strictEqual(Dialog, Dialog);
    assert.strictEqual(DialogContent, DialogContent);
    assert.strictEqual(DialogHeader, DialogHeader);
    assert.strictEqual(DialogTitle, DialogTitle);
  });
  recordTest("Sheet exports match barrel export", "Dual Import Parity", () => {
    assert.strictEqual(Sheet, Sheet);
    assert.strictEqual(SheetContent, SheetContent);
    assert.strictEqual(SheetHeader, SheetHeader);
    assert.strictEqual(SheetTitle, SheetTitle);
    assert.strictEqual(SheetTrigger, SheetTrigger);
  });
  recordTest("DropdownMenu exports match barrel export", "Dual Import Parity", () => {
    assert.strictEqual(DropdownMenu, DropdownMenu);
    assert.strictEqual(DropdownMenuContent, DropdownMenuContent);
    assert.strictEqual(DropdownMenuItem, DropdownMenuItem);
    assert.strictEqual(DropdownMenuTrigger, DropdownMenuTrigger);
  });
  recordTest("Select exports match barrel export", "Dual Import Parity", () => {
    assert.strictEqual(Select, Select);
    assert.strictEqual(SelectTrigger, SelectTrigger);
    assert.strictEqual(SelectContent, SelectContent);
    assert.strictEqual(SelectItem, SelectItem);
  });
  recordTest("Tabs, Popover, Calendar, Toast match barrel export", "Dual Import Parity", () => {
    assert.strictEqual(Tabs, Tabs);
    assert.strictEqual(TabsList, TabsList);
    assert.strictEqual(Popover, Popover);
    assert.strictEqual(PopoverContent, PopoverContent);
    assert.strictEqual(Calendar, Calendar);
    assert.strictEqual(Toaster, Toaster);
    assert.strictEqual(toast, toast);
    assert.strictEqual(showToast, showToast);
  });
  recordTest("Sheet components structure & subcomponent exports", "Sheet Primitive", () => {
    assert(Sheet !== void 0, "Sheet Root exists");
    assert(SheetTrigger !== void 0, "SheetTrigger exists");
    assert(SheetClose !== void 0, "SheetClose exists");
    assert(SheetContent !== void 0, "SheetContent exists");
    assert(SheetOverlay !== void 0, "SheetOverlay exists");
    assert(SheetHeader !== void 0, "SheetHeader exists");
    assert(SheetFooter !== void 0, "SheetFooter exists");
    assert(SheetTitle !== void 0, "SheetTitle exists");
    assert(SheetDescription !== void 0, "SheetDescription exists");
    assert.strictEqual(SheetHeader.displayName, "SheetHeader");
    assert.strictEqual(SheetFooter.displayName, "SheetFooter");
  });
  recordTest("SheetHeader and SheetFooter SSR rendering within Sheet context", "Sheet Primitive", () => {
    const headerHtml = renderToString(
      React__default.createElement(
        Sheet,
        null,
        React__default.createElement(
          SheetHeader,
          { className: "test-header" },
          React__default.createElement(SheetTitle, null, "Student Profile 360"),
          React__default.createElement(SheetDescription, null, "Comprehensive SIS Drawer")
        )
      )
    );
    assert(headerHtml.includes("test-header"), "Header must contain custom class");
    assert(headerHtml.includes("Student Profile 360"), "Header must contain title");
    assert(headerHtml.includes("Comprehensive SIS Drawer"), "Header must contain description");
    const footerHtml = renderToString(
      React__default.createElement(
        Sheet,
        null,
        React__default.createElement(
          SheetFooter,
          { className: "test-footer" },
          React__default.createElement("button", null, "Save Changes")
        )
      )
    );
    assert(footerHtml.includes("test-footer"), "Footer must contain custom class");
    assert(footerHtml.includes("Save Changes"), "Footer must contain button text");
  });
  recordTest('SheetContent side="left" (R2 Mobile Navigation Drawer)', "Sheet Primitive", () => {
    const rendered = SheetContent.render({ side: "left", className: "mobile-nav-sheet" }, null);
    const contentEl = rendered.props.children[1];
    assert(contentEl, "DialogPrimitive.Content must be rendered");
    const classes = contentEl.props.className;
    assert(classes.includes("inset-y-0 left-0"), "Must align left: inset-y-0 left-0");
    assert(classes.includes("slide-in-from-left"), "Must animate: slide-in-from-left");
    assert(classes.includes("slide-out-to-left"), "Must animate: slide-out-to-left");
    assert(classes.includes("border-r"), "Must have border-r");
    assert(classes.includes("mobile-nav-sheet"), "Must merge custom className");
  });
  recordTest('SheetContent side="right" (Default & R3 Review Drawer)', "Sheet Primitive", () => {
    const rendered = SheetContent.render({ side: "right", className: "review-drawer" }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes("inset-y-0 right-0"), "Must align right: inset-y-0 right-0");
    assert(classes.includes("slide-in-from-right"), "Must animate: slide-in-from-right");
    assert(classes.includes("slide-out-to-right"), "Must animate: slide-out-to-right");
    assert(classes.includes("border-l"), "Must have border-l");
    assert(classes.includes("review-drawer"), "Must merge custom className");
  });
  recordTest('SheetContent default side falls back to "right"', "Sheet Primitive", () => {
    const rendered = SheetContent.render({}, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes("inset-y-0 right-0"), "Default must be right drawer");
    assert(classes.includes("slide-in-from-right"), "Default slide in from right");
  });
  recordTest('SheetContent side="top" position classes', "Sheet Primitive", () => {
    const rendered = SheetContent.render({ side: "top" }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes("inset-x-0 top-0"), "Must align top: inset-x-0 top-0");
    assert(classes.includes("slide-in-from-top"), "Must animate: slide-in-from-top");
    assert(classes.includes("slide-out-to-top"), "Must animate: slide-out-to-top");
    assert(classes.includes("border-b"), "Must have border-b");
  });
  recordTest('SheetContent side="bottom" position classes', "Sheet Primitive", () => {
    const rendered = SheetContent.render({ side: "bottom" }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes("inset-x-0 bottom-0"), "Must align bottom: inset-x-0 bottom-0");
    assert(classes.includes("slide-in-from-bottom"), "Must animate: slide-in-from-bottom");
    assert(classes.includes("slide-out-to-bottom"), "Must animate: slide-out-to-bottom");
    assert(classes.includes("border-t"), "Must have border-t");
  });
  recordTest("SheetContent close button contains X icon and sr-only label", "Sheet Primitive", () => {
    const rendered = SheetContent.render({}, null);
    const contentEl = rendered.props.children[1];
    const closeBtn = contentEl.props.children[0];
    assert(closeBtn, "Close button exists in SheetContent");
    const srOnly = closeBtn.props.children[1];
    assert.strictEqual(srOnly.props.children, "Close", 'Must have sr-only "Close" text');
  });
  recordTest("Dialog components structure & subcomponent exports", "Dialog Primitive", () => {
    assert(Dialog !== void 0, "Dialog Root exists");
    assert(DialogTrigger !== void 0, "DialogTrigger exists");
    assert(DialogClose !== void 0, "DialogClose exists");
    assert(DialogContent !== void 0, "DialogContent exists");
    assert(DialogOverlay !== void 0, "DialogOverlay exists");
    assert(DialogHeader !== void 0, "DialogHeader exists");
    assert(DialogFooter !== void 0, "DialogFooter exists");
    assert(DialogTitle !== void 0, "DialogTitle exists");
    assert(DialogDescription !== void 0, "DialogDescription exists");
    assert.strictEqual(DialogHeader.displayName, "DialogHeader");
    assert.strictEqual(DialogFooter.displayName, "DialogFooter");
  });
  recordTest("DialogHeader and DialogFooter SSR rendering within Dialog context", "Dialog Primitive", () => {
    const headerHtml = renderToString(
      React__default.createElement(
        Dialog,
        null,
        React__default.createElement(
          DialogHeader,
          { className: "admission-header" },
          React__default.createElement(DialogTitle, null, "New Student Registration"),
          React__default.createElement(DialogDescription, null, "Fill in student admission details")
        )
      )
    );
    assert(headerHtml.includes("admission-header"), "DialogHeader must render custom class");
    assert(headerHtml.includes("New Student Registration"), "DialogTitle must render title");
    const footerHtml = renderToString(
      React__default.createElement(
        Dialog,
        null,
        React__default.createElement(
          DialogFooter,
          { className: "admission-footer" },
          React__default.createElement("button", null, "Submit Admission")
        )
      )
    );
    assert(footerHtml.includes("admission-footer"), "DialogFooter must render custom class");
    assert(footerHtml.includes("Submit Admission"), "DialogFooter must render action button");
  });
  recordTest("DialogContent centering, styling and close button", "Dialog Primitive", () => {
    const rendered = DialogContent.render({ className: "custom-dialog" }, null);
    const contentEl = rendered.props.children[1];
    const classes = contentEl.props.className;
    assert(classes.includes("fixed left-[50%] top-[50%]"), "Must be centered fixed");
    assert(classes.includes("translate-x-[-50%] translate-y-[-50%]"), "Must translate -50%");
    assert(classes.includes("custom-dialog"), "Must merge custom className");
    const closeBtn = contentEl.props.children[1];
    assert(closeBtn, "Close button exists in DialogContent");
  });
  recordTest("DropdownMenu all subcomponents exported and valid", "DropdownMenu Primitive", () => {
    assert(DropdownMenu !== void 0, "DropdownMenu Root exists");
    assert(DropdownMenuTrigger !== void 0, "DropdownMenuTrigger exists");
    assert(DropdownMenuContent !== void 0, "DropdownMenuContent exists");
    assert(DropdownMenuItem !== void 0, "DropdownMenuItem exists");
    assert(DropdownMenuCheckboxItem !== void 0, "DropdownMenuCheckboxItem exists");
    assert(DropdownMenuRadioItem !== void 0, "DropdownMenuRadioItem exists");
    assert(DropdownMenuLabel !== void 0, "DropdownMenuLabel exists");
    assert(DropdownMenuSeparator !== void 0, "DropdownMenuSeparator exists");
    assert(DropdownMenuShortcut !== void 0, "DropdownMenuShortcut exists");
    assert(DropdownMenuGroup !== void 0, "DropdownMenuGroup exists");
    assert(DropdownMenuPortal !== void 0, "DropdownMenuPortal exists");
    assert(DropdownMenuSub !== void 0, "DropdownMenuSub exists");
    assert(DropdownMenuSubContent !== void 0, "DropdownMenuSubContent exists");
    assert(DropdownMenuSubTrigger !== void 0, "DropdownMenuSubTrigger exists");
    assert(DropdownMenuRadioGroup !== void 0, "DropdownMenuRadioGroup exists");
    assert.strictEqual(DropdownMenuShortcut.displayName, "DropdownMenuShortcut");
  });
  recordTest("DropdownMenu subcomponents SSR rendering (Label, Separator, Shortcut)", "DropdownMenu Primitive", () => {
    const labelHtml = renderToString(
      React__default.createElement(DropdownMenuLabel, { inset: true }, "My Account")
    );
    assert(labelHtml.includes("My Account"), "Label renders text");
    assert(labelHtml.includes("pl-8"), "Inset prop adds pl-8 to label");
    const sepHtml = renderToString(React__default.createElement(DropdownMenuSeparator));
    assert(sepHtml.includes("h-px"), "Separator renders horizontal rule");
    const shortcutHtml = renderToString(
      React__default.createElement(DropdownMenuShortcut, null, "⌘K")
    );
    assert(shortcutHtml.includes("⌘K"), "Shortcut renders text");
    assert(shortcutHtml.includes("tracking-widest"), "Shortcut has tracking-widest");
  });
  recordTest("DropdownMenuItem disabled and inset variants evaluation", "DropdownMenu Primitive", () => {
    const itemEl = DropdownMenuItem.render({ inset: true, className: "item-custom" }, null);
    assert(itemEl.props.className.includes("pl-8"), "Inset item includes pl-8");
    assert(itemEl.props.className.includes("item-custom"), "Includes custom className");
    assert(itemEl.props.className.includes("data-[disabled]:opacity-50"), "Includes disabled opacity styling");
  });
  recordTest("Select all subcomponents exported and valid", "Select Primitive", () => {
    assert(Select !== void 0, "Select Root exists");
    assert(SelectGroup !== void 0, "SelectGroup exists");
    assert(SelectValue !== void 0, "SelectValue exists");
    assert(SelectTrigger !== void 0, "SelectTrigger exists");
    assert(SelectContent !== void 0, "SelectContent exists");
    assert(SelectLabel !== void 0, "SelectLabel exists");
    assert(SelectItem !== void 0, "SelectItem exists");
    assert(SelectSeparator !== void 0, "SelectSeparator exists");
    assert(SelectScrollUpButton !== void 0, "SelectScrollUpButton exists");
    assert(SelectScrollDownButton !== void 0, "SelectScrollDownButton exists");
  });
  recordTest("SelectTrigger, SelectValue, SelectLabel SSR rendering within Select context", "Select Primitive", () => {
    const triggerHtml = renderToString(
      React__default.createElement(
        Select,
        null,
        React__default.createElement(
          SelectTrigger,
          { className: "branch-select" },
          React__default.createElement(SelectValue, { placeholder: "Select Campus Branch" })
        ),
        React__default.createElement(
          SelectGroup,
          null,
          React__default.createElement(SelectLabel, null, "Academic Grades")
        )
      )
    );
    assert(triggerHtml.includes("branch-select"), "SelectTrigger renders custom class");
    assert(triggerHtml.includes("h-9"), "SelectTrigger renders standard height h-9");
    assert(triggerHtml.includes("border-input"), "SelectTrigger renders border-input token");
    assert(triggerHtml.includes("svg"), "SelectTrigger includes chevron down icon");
    assert(triggerHtml.includes("Academic Grades"), "SelectLabel renders label text");
  });
  recordTest("SelectItem evaluation with Check indicator", "Select Primitive", () => {
    const itemEl = SelectItem.render({ value: "cbse", children: "CBSE Curriculum" }, null);
    assert(itemEl.props.className.includes("focus:bg-accent"), "Item includes focus styling");
    assert(itemEl.props.className.includes("pl-8"), "Item leaves room for indicator");
  });
  recordTest("SelectContent popper position styling", "Select Primitive", () => {
    const contentEl = SelectContent.render({ position: "popper" }, null);
    const inner = contentEl.props.children;
    assert(inner.props.className.includes("max-h-96"), "Content specifies max-h-96");
    assert(inner.props.className.includes("data-[side=bottom]:translate-y-1"), "Popper specifies translate offsets");
  });
  recordTest("Tabs structure, triggers, and content rendering", "Tabs Primitive", () => {
    const tabsHtml = renderToString(
      React__default.createElement(
        Tabs,
        { defaultValue: "overview", className: "student-tabs" },
        React__default.createElement(
          TabsList,
          { className: "grid grid-cols-2" },
          React__default.createElement(TabsTrigger, { value: "overview" }, "Overview"),
          React__default.createElement(TabsTrigger, { value: "attendance" }, "Attendance")
        ),
        React__default.createElement(TabsContent, { value: "overview" }, "Overview Content"),
        React__default.createElement(TabsContent, { value: "attendance" }, "Attendance Content")
      )
    );
    assert(tabsHtml.includes("student-tabs"), "Tabs root applies class");
    assert(tabsHtml.includes("Overview"), "TabsList renders Overview trigger");
    assert(tabsHtml.includes("Attendance"), "TabsList renders Attendance trigger");
    assert(tabsHtml.includes("Overview Content"), "TabsContent renders default active content");
    assert(tabsHtml.includes('data-state="active"'), 'Active tab trigger has data-state="active"');
  });
  recordTest("Popover structure and exports", "Popover Primitive", () => {
    assert(Popover !== void 0, "Popover Root exists");
    assert(PopoverTrigger !== void 0, "PopoverTrigger exists");
    assert(PopoverContent !== void 0, "PopoverContent exists");
    assert(PopoverAnchor !== void 0, "PopoverAnchor exists");
  });
  recordTest("PopoverContent positioning and align props", "Popover Primitive", () => {
    const popoverEl = PopoverContent.render({ align: "end", sideOffset: 8, className: "filter-popover" }, null);
    const inner = popoverEl.props.children;
    assert.strictEqual(inner.props.align, "end", "Align end prop preserved");
    assert.strictEqual(inner.props.sideOffset, 8, "Custom sideOffset preserved");
    assert(inner.props.className.includes("filter-popover"), "Custom className merged");
    assert(inner.props.className.includes("w-72"), "Default width w-72");
  });
  recordTest("Calendar renders month header and day names", "Calendar Primitive", () => {
    const testDate = new Date(2026, 9, 28);
    const html = renderToString(
      React__default.createElement(Calendar, { selected: testDate, month: testDate })
    );
    assert(html.includes("October") && html.includes("2026"), "Calendar header shows October 2026");
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach((day) => {
      assert(html.includes(day), `Calendar weekday row includes ${day}`);
    });
    assert(html.includes('aria-label="Previous month"'), "Includes prev month button");
    assert(html.includes('aria-label="Next month"'), "Includes next month button");
  });
  recordTest("Calendar grid calculation (October 2026)", "Calendar Primitive", () => {
    const testDate = new Date(2026, 9, 1);
    const html = renderToString(
      React__default.createElement(Calendar, { month: testDate })
    );
    for (let day = 1; day <= 31; day++) {
      assert(html.includes(`<span>${day}</span>`), `Calendar contains day ${day}`);
    }
  });
  recordTest("Calendar selected date highlights with primary token", "Calendar Primitive", () => {
    const testDate = new Date(2026, 9, 15);
    const html = renderToString(
      React__default.createElement(Calendar, { selected: testDate, month: testDate })
    );
    assert(html.includes("bg-primary text-primary-foreground"), "Selected date has bg-primary");
  });
  recordTest("Calendar leap year February 2024 has 29 days", "Calendar Primitive", () => {
    const leapFeb = new Date(2024, 1, 1);
    const html = renderToString(
      React__default.createElement(Calendar, { month: leapFeb })
    );
    assert(html.includes("February") && html.includes("2024"), "Header shows February 2024");
    assert(html.includes("<span>29</span>"), "Leap year includes day 29");
  });
  recordTest("Calendar non-leap year February 2025 has 28 days", "Calendar Primitive", () => {
    const normalFeb = new Date(2025, 1, 1);
    const html = renderToString(
      React__default.createElement(Calendar, { month: normalFeb })
    );
    assert(html.includes("February") && html.includes("2025"), "Header shows February 2025");
    assert(html.includes("<span>28</span>"), "Normal year includes day 28");
  });
  recordTest("Calendar events indicator dot rendering", "Calendar Primitive", () => {
    const testDate = new Date(2026, 9, 20);
    const events = [
      { date: new Date(2026, 9, 20), title: "Midterm Examination" }
    ];
    const html = renderToString(
      React__default.createElement(Calendar, {
        month: testDate,
        selected: testDate,
        events
      })
    );
    assert(html.includes("h-1 w-1 rounded-full"), "Event dot indicator rendered");
  });
  recordTest("Calendar minDate and maxDate boundary disabling", "Calendar Primitive", () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 10);
    const maxDate = new Date(2026, 9, 25);
    const html = renderToString(
      React__default.createElement(Calendar, {
        month,
        minDate,
        maxDate
      })
    );
    assert(html.includes("cursor-not-allowed"), "Disabled days have cursor-not-allowed");
    assert(html.includes("opacity-30"), "Disabled days have opacity-30");
  });
  recordTest("Calendar disabled={true} disables entire grid", "Calendar Primitive", () => {
    const month = new Date(2026, 9, 1);
    const html = renderToString(
      React__default.createElement(Calendar, {
        month,
        disabled: true
      })
    );
    assert(html.includes("cursor-not-allowed"), "All days are disabled");
    assert(html.includes("pointer-events-none"), "All days have pointer-events-none");
  });
  recordTest("Calendar string minDate / maxDate ISO format tolerance", "Calendar Primitive", () => {
    const month = new Date(2026, 9, 1);
    const html = renderToString(
      React__default.createElement(Calendar, {
        month,
        minDate: "2026-10-10",
        maxDate: "2026-10-25"
      })
    );
    assert(html.length > 500, "Calendar renders cleanly with ISO string minDate/maxDate");
  });
  recordTest("Calendar null / undefined selected and events tolerance", "Calendar Primitive", () => {
    const html = renderToString(
      React__default.createElement(Calendar, {
        selected: null,
        events: null,
        month: null
      })
    );
    assert(html.length > 500, "Calendar renders cleanly without crashing on null values");
  });
  recordTest("Toaster component SSR renders cleanly", "Toast Primitive", () => {
    const html = renderToString(React__default.createElement(Toaster));
    assert(html.includes('aria-label="Notifications'), "Toaster container section rendered");
  });
  recordTest("toast object exposes info, success, error, warning functions", "Toast Primitive", () => {
    assert(typeof toast === "function", "toast is callable");
    assert(typeof toast.success === "function", "toast.success is callable");
    assert(typeof toast.error === "function", "toast.error is callable");
    assert(typeof toast.warning === "function", "toast.warning is callable");
    assert(typeof toast.info === "function", "toast.info is callable");
  });
  recordTest("showToast polymorphic dispatcher handles single message (default info)", "Toast Primitive", () => {
    const res = showToast("Database backup completed");
    assert(res !== void 0, "showToast returned toast id or handler");
  });
  recordTest("showToast polymorphic dispatcher handles (message, type) order", "Toast Primitive", () => {
    const res1 = showToast("Student admitted successfully", "success");
    const res2 = showToast("Failed to save record", "error");
    const res3 = showToast("Attendance already submitted", "warning");
    const res4 = showToast("Academic term closed", "info");
    assert(res1 !== void 0 && res2 !== void 0 && res3 !== void 0 && res4 !== void 0);
  });
  recordTest("showToast polymorphic dispatcher handles (type, message) order", "Toast Primitive", () => {
    const res1 = showToast("success", "Student admitted successfully");
    const res2 = showToast("error", "Failed to save record");
    const res3 = showToast("warning", "Attendance already submitted");
    const res4 = showToast("info", "Academic term closed");
    assert(res1 !== void 0 && res2 !== void 0 && res3 !== void 0 && res4 !== void 0);
  });
  recordTest("showToast unknown type gracefully falls back to info", "Toast Primitive", () => {
    const res = showToast("custom_alert", "Notice published");
    assert(res !== void 0, "Handles unknown type gracefully");
  });
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log("\n======================================================");
  console.log(`Summary: ${passed}/${total} passed (${(passed / total * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.log(`Failed: ${failed}`);
    process.exit(1);
  } else {
    console.log("All interactive overlay tests PASSED empirically!");
    process.exit(0);
  }
}
runAllTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
export {
  runAllTests
};
