import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-xs",
        secondary:
          "bg-surface-hover text-text-muted border border-border-subtle",
        destructive:
          "bg-danger-50 text-danger-600",
        outline:
          "text-text-primary border border-border",
        folder:
          "bg-folder-50 text-folder-600",
        file:
          "bg-file-50 text-file-600",
        warning:
          "bg-warning-50 text-warning-500 border border-warning-100",
        success:
          "bg-success-50 text-success-500 border border-success-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
