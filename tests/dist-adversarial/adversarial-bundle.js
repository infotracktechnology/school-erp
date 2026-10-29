import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { renderToString } from "react-dom/server";
import assert from "assert";
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
import "sonner";
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
async function executeAdversarialChallenge() {
  console.log("\n======================================================");
  console.log("   ADVERSARIAL CHALLENGE: Calendar, Badge, Sheet, Barrel");
  console.log("======================================================\n");
  console.log("▶ [CHALLENGE 1] Calendar Date Boundary & Equality Edge Cases");
  runTest("Cell EXACTLY EQUAL to minDate must be ENABLED (not disabled)", "Calendar Boundaries", () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 15);
    const maxDate = new Date(2026, 9, 25);
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { month, minDate, maxDate })
    );
    const regex15 = /<button[^>]*><span>15<\/span>[^<]*<\/button>/;
    const match15 = html.match(regex15);
    assert(match15, "Day 15 button must exist in HTML");
    const buttonHtml15 = match15[0];
    assert(!buttonHtml15.includes('disabled=""') && !buttonHtml15.includes("disabled "), "Day 15 must NOT have disabled attribute");
    assert(!buttonHtml15.includes("cursor-not-allowed"), "Day 15 must NOT have cursor-not-allowed");
    assert(!buttonHtml15.includes("opacity-30"), "Day 15 must NOT have opacity-30");
    assert(!buttonHtml15.includes("pointer-events-none"), "Day 15 must NOT have pointer-events-none");
  });
  runTest("Cell EXACTLY EQUAL to maxDate must be ENABLED (not disabled)", "Calendar Boundaries", () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 15);
    const maxDate = new Date(2026, 9, 25);
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { month, minDate, maxDate })
    );
    const regex25 = /<button[^>]*><span>25<\/span>[^<]*<\/button>/;
    const match25 = html.match(regex25);
    assert(match25, "Day 25 button must exist in HTML");
    const buttonHtml25 = match25[0];
    assert(!buttonHtml25.includes('disabled=""') && !buttonHtml25.includes("disabled "), "Day 25 must NOT have disabled attribute");
    assert(!buttonHtml25.includes("cursor-not-allowed"), "Day 25 must NOT have cursor-not-allowed");
    assert(!buttonHtml25.includes("opacity-30"), "Day 25 must NOT have opacity-30");
    assert(!buttonHtml25.includes("pointer-events-none"), "Day 25 must NOT have pointer-events-none");
  });
  runTest("Day immediately BEFORE minDate (Oct 14) must be DISABLED", "Calendar Boundaries", () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 15);
    const maxDate = new Date(2026, 9, 25);
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { month, minDate, maxDate })
    );
    const regex14 = /<button[^>]*><span>14<\/span>[^<]*<\/button>/;
    const match14 = html.match(regex14);
    assert(match14, "Day 14 button must exist in HTML");
    const buttonHtml14 = match14[0];
    assert(buttonHtml14.includes("disabled"), "Day 14 must have disabled attribute");
    assert(buttonHtml14.includes("cursor-not-allowed"), "Day 14 must have cursor-not-allowed");
    assert(buttonHtml14.includes("opacity-30"), "Day 14 must have opacity-30");
    assert(buttonHtml14.includes("pointer-events-none"), "Day 14 must have pointer-events-none");
  });
  runTest("Day immediately AFTER maxDate (Oct 26) must be DISABLED", "Calendar Boundaries", () => {
    const month = new Date(2026, 9, 1);
    const minDate = new Date(2026, 9, 15);
    const maxDate = new Date(2026, 9, 25);
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { month, minDate, maxDate })
    );
    const regex26 = /<button[^>]*><span>26<\/span>[^<]*<\/button>/;
    const match26 = html.match(regex26);
    assert(match26, "Day 26 button must exist in HTML");
    const buttonHtml26 = match26[0];
    assert(buttonHtml26.includes("disabled"), "Day 26 must have disabled attribute");
    assert(buttonHtml26.includes("cursor-not-allowed"), "Day 26 must have cursor-not-allowed");
    assert(buttonHtml26.includes("opacity-30"), "Day 26 must have opacity-30");
    assert(buttonHtml26.includes("pointer-events-none"), "Day 26 must have pointer-events-none");
  });
  runTest("minDate and maxDate set to EXACT SAME DAY allows only that single day", "Calendar Boundaries", () => {
    const month = new Date(2026, 9, 1);
    const singleDay = new Date(2026, 9, 20);
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { month, minDate: singleDay, maxDate: singleDay })
    );
    const match20 = html.match(/<button[^>]*><span>20<\/span>[^<]*<\/button>/);
    assert(match20, "Day 20 must exist");
    assert(!match20[0].includes("disabled"), "Day 20 must be enabled");
    const match19 = html.match(/<button[^>]*><span>19<\/span>[^<]*<\/button>/);
    assert(match19 && match19[0].includes("disabled"), "Day 19 must be disabled");
    const match21 = html.match(/<button[^>]*><span>21<\/span>[^<]*<\/button>/);
    assert(match21 && match21[0].includes("disabled"), "Day 21 must be disabled");
  });
  runTest("minDate with specific time (e.g. 15:30:00) does not disable early hours of that same date", "Calendar Boundaries", () => {
    const month = new Date(2026, 9, 1);
    const minDateTime = new Date(2026, 9, 15, 18, 45, 0);
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { month, minDate: minDateTime })
    );
    const match15 = html.match(/<button[^>]*><span>15<\/span>[^<]*<\/button>/);
    assert(match15, "Day 15 must exist");
    assert(!match15[0].includes("disabled"), "Day 15 must NOT be disabled by time components in minDate");
  });
  runTest("maxDate with specific time (e.g. 02:15:00) does not disable that date", "Calendar Boundaries", () => {
    const month = new Date(2026, 9, 1);
    const maxDateTime = new Date(2026, 9, 15, 2, 15, 0);
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { month, maxDate: maxDateTime })
    );
    const match15 = html.match(/<button[^>]*><span>15<\/span>[^<]*<\/button>/);
    assert(match15, "Day 15 must exist");
    assert(!match15[0].includes("disabled"), "Day 15 must NOT be disabled by early time in maxDate");
  });
  console.log("\n▶ [CHALLENGE 2] Leap Year & Century Date Math");
  runTest("Leap year 2024 Feb has 29 days", "Calendar Leap Years", () => {
    const feb2024 = new Date(2024, 1, 1);
    const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month: feb2024 }));
    assert(html.includes("February") && html.includes("2024"), "Header shows February 2024");
    assert(html.includes("<span>29</span>"), "Day 29 present in Feb 2024");
  });
  runTest("Century leap year 2000 Feb has 29 days", "Calendar Leap Years", () => {
    const feb2000 = new Date(2e3, 1, 1);
    const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month: feb2000 }));
    assert(html.includes("February") && html.includes("2000"), "Header shows February 2000");
    assert(html.includes("<span>29</span>"), "Day 29 present in Feb 2000");
  });
  runTest("Century NON-leap year 1900 Feb has 28 days only", "Calendar Leap Years", () => {
    const feb1900 = new Date(1900, 1, 1);
    const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month: feb1900 }));
    assert(html.includes("February") && html.includes("1900"), "Header shows February 1900");
    assert(html.includes("<span>28</span>"), "Day 28 present in Feb 1900");
  });
  runTest("Month transition December 31 boundary (Dec 2026)", "Calendar Month Transitions", () => {
    const dec2026 = new Date(2026, 11, 1);
    const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month: dec2026 }));
    assert(html.includes("December") && html.includes("2026"), "Header shows December 2026");
    assert(html.includes("<span>31</span>"), "Day 31 present in Dec 2026");
  });
  runTest("Month transition January 1 boundary (Jan 2027)", "Calendar Month Transitions", () => {
    const jan2027 = new Date(2027, 0, 1);
    const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month: jan2027 }));
    assert(html.includes("January") && html.includes("2027"), "Header shows January 2027");
    assert(html.includes("<span>1</span>"), "Day 1 present in Jan 2027");
  });
  console.log("\n▶ [CHALLENGE 3] Calendar Fuzzing & Malformed Props");
  runTest("Fuzz: events with mixed garbage elements (null, undefined, non-objects)", "Calendar Fuzzing", () => {
    const month = new Date(2026, 9, 1);
    const fuzzEvents = [
      null,
      void 0,
      42,
      "not an event",
      {},
      { date: null },
      { date: void 0 },
      { date: "not-a-date" },
      { date: new Date(2026, 9, 10), title: "Valid Event" },
      { date: "2026-10-12", title: "Valid String Event" }
    ];
    const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month, events: fuzzEvents }));
    assert(html.includes("October") && html.includes("2026"), "Renders October 2026 despite garbage in events");
    assert(html.includes("rounded-full"), "Renders event dot for the valid events");
  });
  runTest("Fuzz: events as non-array types (string, number, object)", "Calendar Fuzzing", () => {
    const month = new Date(2026, 9, 1);
    const badEvents = [
      "just a string",
      12345,
      { title: "single event object" },
      true
    ];
    badEvents.forEach((ev) => {
      const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month, events: ev }));
      assert(html.includes("October") && html.includes("2026"), "Renders safely with non-array events");
    });
  });
  runTest("Fuzz: minDate and maxDate as epoch milliseconds", "Calendar Fuzzing", () => {
    const month = new Date(2026, 9, 1);
    const minMs = new Date(2026, 9, 10).getTime();
    const maxMs = new Date(2026, 9, 20).getTime();
    const html = renderToString(/* @__PURE__ */ jsx(Calendar, { month, minDate: minMs, maxDate: maxMs }));
    assert(html.includes("October") && html.includes("2026"), "Epoch ms accepted as minDate/maxDate");
    const match10 = html.match(/<button[^>]*><span>10<\/span>[^<]*<\/button>/);
    assert(match10 && !match10[0].includes("disabled"), "Day 10 enabled");
    const match9 = html.match(/<button[^>]*><span>9<\/span>[^<]*<\/button>/);
    assert(match9 && match9[0].includes("disabled"), "Day 9 disabled");
  });
  runTest('Fuzz: invalid Date object (new Date("invalid"))', "Calendar Fuzzing", () => {
    const invalidDate = /* @__PURE__ */ new Date("invalid");
    const html = renderToString(
      /* @__PURE__ */ jsx(Calendar, { selected: invalidDate, minDate: invalidDate, maxDate: invalidDate, month: invalidDate })
    );
    assert(html.includes("Su") && html.includes("Mo"), "Renders calendar without throwing on NaN dates");
  });
  console.log("\n▶ [CHALLENGE 4] Badge Variants, Styling & Boundary Stress");
  const expectedVariantClasses = {
    default: ["bg-primary", "text-primary-foreground"],
    secondary: ["bg-secondary", "text-secondary-foreground"],
    destructive: ["bg-destructive", "text-destructive-foreground"],
    outline: ["text-foreground", "border-border"],
    success: ["bg-emerald-50", "text-emerald-800", "border-emerald-200"],
    emerald: ["bg-emerald-50", "text-emerald-800", "border-emerald-200"]
  };
  Object.entries(expectedVariantClasses).forEach(([variant, expectedClasses]) => {
    runTest(`Badge variant="${variant}" includes required design tokens`, "Badge Variants", () => {
      const html = renderToString(/* @__PURE__ */ jsxs(Badge, { variant, children: [
        "Badge ",
        variant
      ] }));
      expectedClasses.forEach((cls) => {
        assert(html.includes(cls), `Badge variant "${variant}" must include class "${cls}"`);
      });
      assert(html.includes("rounded-full"), `Badge variant "${variant}" must have "rounded-full" pill shape`);
      assert(html.includes("text-xs font-semibold"), `Badge must have "text-xs font-semibold"`);
    });
  });
  runTest("badgeVariants CVA function standalone direct execution", "Badge CVA Function", () => {
    const defaultClasses = badgeVariants();
    assert(defaultClasses.includes("bg-primary"), "Default invocation yields bg-primary");
    assert(defaultClasses.includes("rounded-full"), "Default invocation yields rounded-full");
    const emeraldClasses = badgeVariants({ variant: "emerald" });
    assert(emeraldClasses.includes("bg-emerald-50"), "Emerald invocation yields bg-emerald-50");
    const customClasses = badgeVariants({ variant: "secondary", className: "extra-padding font-bold" });
    assert(customClasses.includes("extra-padding"), "Merges extra-padding");
    assert(customClasses.includes("bg-secondary"), "Includes bg-secondary");
    const fallbackClasses = badgeVariants({ variant: void 0 });
    assert(fallbackClasses.includes("bg-primary"), "Undefined variant falls back to default");
  });
  runTest("Badge boundary children: 0, empty string, symbols, long text", "Badge Boundary", () => {
    const html0 = renderToString(/* @__PURE__ */ jsx(Badge, { children: 0 }));
    assert(html0.includes(">0</div>"), "Badge renders numeric 0");
    const htmlEmpty = renderToString(/* @__PURE__ */ jsx(Badge, {}));
    assert(htmlEmpty.includes('<div class="'), "Badge renders empty cleanly");
    const htmlLong = renderToString(/* @__PURE__ */ jsx(Badge, { children: "A".repeat(500) }));
    assert(htmlLong.includes("A".repeat(500)), "Badge renders long string without truncation or crash");
  });
  console.log("\n▶ [CHALLENGE 5] Sheet Component & sheetVariants Behavior");
  const sideConfigs = [
    { side: "top", required: ["inset-x-0 top-0", "border-b", "slide-in-from-top", "slide-out-to-top"] },
    { side: "bottom", required: ["inset-x-0 bottom-0", "border-t", "slide-in-from-bottom", "slide-out-to-bottom"] },
    { side: "left", required: ["inset-y-0 left-0", "border-r", "slide-in-from-left", "slide-out-to-left", "sm:max-w-sm"] },
    { side: "right", required: ["inset-y-0 right-0", "border-l", "slide-in-from-right", "slide-out-to-right", "sm:max-w-sm"] }
  ];
  sideConfigs.forEach(({ side, required }) => {
    runTest(`sheetVariants({ side: "${side}" }) produces correct layout & animation classes`, "sheetVariants CVA", () => {
      const classes = sheetVariants({ side });
      required.forEach((req) => {
        assert(classes.includes(req), `sheetVariants for side "${side}" must include "${req}"`);
      });
      assert(classes.includes("fixed z-50 gap-4 bg-background p-6 shadow-lg"), "Includes common fixed drawer tokens");
      assert(classes.includes("data-[state=open]:duration-500"), "Includes open duration");
      assert(classes.includes("data-[state=closed]:duration-300"), "Includes close duration");
    });
  });
  runTest('sheetVariants default invocation falls back to side="right"', "sheetVariants CVA", () => {
    const classes = sheetVariants();
    assert(classes.includes("inset-y-0 right-0"), "Default is right side drawer");
    assert(classes.includes("slide-in-from-right"), "Default animation slides in from right");
  });
  runTest("sheetVariants with custom className merges cleanly", "sheetVariants CVA", () => {
    const classes = sheetVariants({ side: "left", className: "w-[400px] border-emerald-500" });
    assert(classes.includes("w-[400px]"), "Custom width merged");
    assert(classes.includes("border-emerald-500"), "Custom border class merged");
    assert(classes.includes("inset-y-0 left-0"), "Left positioning preserved");
  });
  runTest("SheetContent forwardRef renders close button with Lucide X and sr-only Close", "SheetContent Subcomponent", () => {
    const rendered = SheetContent.render({ side: "left", className: "mobile-nav" }, null);
    const portalChildren = rendered.props.children;
    assert.strictEqual(portalChildren.length, 2, "SheetPortal contains Overlay and Content");
    const overlay = portalChildren[0];
    assert(overlay.type === SheetOverlay, "First child is SheetOverlay");
    const content = portalChildren[1];
    assert(content.props.className.includes("mobile-nav"), "Content has custom class");
    assert(content.props.className.includes("inset-y-0 left-0"), "Content has left side class");
    const closeBtn = content.props.children[0];
    assert(closeBtn, "Close button exists");
    assert(closeBtn.props.className.includes("absolute right-4 top-4"), "Close button has absolute position");
    const xIcon = closeBtn.props.children[0];
    assert(xIcon, "Close button has X icon");
    const srOnly = closeBtn.props.children[1];
    assert.strictEqual(srOnly.props.children, "Close", 'Close button has sr-only text "Close"');
  });
  runTest("SheetHeader, SheetFooter, SheetTitle, SheetDescription render properly", "Sheet Subcomponents", () => {
    const headerHtml = renderToString(
      /* @__PURE__ */ jsx(Sheet, { children: /* @__PURE__ */ jsxs(SheetHeader, { className: "custom-header", children: [
        /* @__PURE__ */ jsx(SheetTitle, { className: "custom-title", children: "Sheet Title" }),
        /* @__PURE__ */ jsx(SheetDescription, { className: "custom-desc", children: "Sheet Subtext" })
      ] }) })
    );
    assert(headerHtml.includes("custom-header"), "SheetHeader applies class");
    assert(headerHtml.includes("custom-title"), "SheetTitle applies class");
    assert(headerHtml.includes("custom-desc"), "SheetDescription applies class");
    assert(headerHtml.includes("Sheet Title"), "SheetTitle text rendered");
    assert(headerHtml.includes("Sheet Subtext"), "SheetDescription text rendered");
    const footerHtml = renderToString(
      /* @__PURE__ */ jsx(Sheet, { children: /* @__PURE__ */ jsx(SheetFooter, { className: "custom-footer", children: /* @__PURE__ */ jsx("button", { children: "Submit" }) }) })
    );
    assert(footerHtml.includes("custom-footer"), "SheetFooter applies class");
    assert(footerHtml.includes("flex flex-col-reverse sm:flex-row sm:justify-end"), "SheetFooter layout classes");
  });
  console.log("\n▶ [CHALLENGE 6] Barrel Export Parity & Cross-Reference");
  runTest("Calendar direct vs barrel export parity", "Barrel Integrity", () => {
    assert.strictEqual(Calendar, Calendar, "Calendar matches CalendarFile.Calendar");
  });
  runTest("Badge and badgeVariants direct vs barrel export parity", "Barrel Integrity", () => {
    assert.strictEqual(Badge, Badge, "Badge matches BadgeFile.Badge");
    assert.strictEqual(badgeVariants, badgeVariants, "badgeVariants matches BadgeFile.badgeVariants");
  });
  runTest("Sheet components and sheetVariants direct vs barrel export parity", "Barrel Integrity", () => {
    assert.strictEqual(Sheet, Sheet, "Sheet matches");
    assert.strictEqual(SheetPortal, SheetPortal, "SheetPortal matches");
    assert.strictEqual(SheetOverlay, SheetOverlay, "SheetOverlay matches");
    assert.strictEqual(SheetTrigger, SheetTrigger, "SheetTrigger matches");
    assert.strictEqual(SheetClose, SheetClose, "SheetClose matches");
    assert.strictEqual(SheetContent, SheetContent, "SheetContent matches");
    assert.strictEqual(SheetHeader, SheetHeader, "SheetHeader matches");
    assert.strictEqual(SheetFooter, SheetFooter, "SheetFooter matches");
    assert.strictEqual(SheetTitle, SheetTitle, "SheetTitle matches");
    assert.strictEqual(SheetDescription, SheetDescription, "SheetDescription matches");
    assert.strictEqual(sheetVariants, sheetVariants, "sheetVariants matches");
  });
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;
  console.log("\n======================================================");
  console.log(`ADVERSARIAL CHALLENGE SUMMARY: ${passed}/${total} PASSED (${(passed / total * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.log(`FAILURES (${failed}):`);
    testResults.filter((r) => !r.passed).forEach((f, idx) => {
      console.log(`  ${idx + 1}. [${f.category}] ${f.name}`);
      console.log(`     Error: ${f.error}`);
    });
  } else {
    console.log("ALL EMPIRICAL ADVERSARIAL CHALLENGES PASSED WITH ZERO ERRORS!");
  }
  console.log("======================================================\n");
  return { total, passed, failed, failures: testResults.filter((r) => !r.passed) };
}
executeAdversarialChallenge().then((res) => {
  if (res.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch((err) => {
  console.error("Adversarial suite crashed:", err);
  process.exit(1);
});
export {
  executeAdversarialChallenge
};
