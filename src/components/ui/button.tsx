import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-hover text-white shadow-xs",
        destructive:
          "bg-danger hover:bg-danger-hover text-white shadow-xs",
        outline:
          "border border-border bg-surface hover:bg-surface-hover text-text-primary hover:border-border-medium",
        secondary:
          "bg-surface hover:bg-surface-hover text-text-primary border border-border",
        ghost:
          "text-text-secondary hover:text-primary-accent hover:bg-surface-hover",
        ghostMuted:
          "text-text-muted hover:text-primary-accent hover:bg-surface-hover",
        ghostDanger:
          "text-text-muted hover:text-danger-500 hover:bg-danger-50",
        link:
          "text-primary-accent underline-offset-4 hover:underline",
        outlineDanger:
          "border border-danger-500/40 text-danger-500 hover:bg-danger-50",
      },
      size: {
        default: "h-9 px-3.5 py-2 text-[13px]",
        sm: "h-8 rounded-md px-2.5 text-xs",
        lg: "h-10 rounded-lg px-6 text-sm",
        icon: "h-9 w-9 p-0",
        iconSm: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
