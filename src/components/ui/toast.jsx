import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-emerald-500/40 group-[.toaster]:bg-emerald-50/90 dark:group-[.toaster]:bg-emerald-950/60 group-[.toast]:text-emerald-900 dark:group-[.toast]:text-emerald-200",
          error:
            "group-[.toaster]:border-destructive/40 group-[.toaster]:bg-red-50/90 dark:group-[.toaster]:bg-red-950/60 group-[.toast]:text-red-900 dark:group-[.toast]:text-red-200",
        },
      }}
      {...props}
    />
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

export { Toaster, toast, showToast };
