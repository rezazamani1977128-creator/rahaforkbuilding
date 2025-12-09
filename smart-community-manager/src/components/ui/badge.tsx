import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        paid: "border-transparent bg-success/10 text-success",
        pending: "border-transparent bg-warning/10 text-warning",
        overdue: "border-transparent bg-destructive/10 text-destructive",
        gold: "border-transparent bg-gradient-to-l from-amber-400 to-yellow-500 text-amber-950",
        silver: "border-transparent bg-gradient-to-l from-gray-300 to-gray-400 text-gray-800",
        bronze: "border-transparent bg-gradient-to-l from-amber-600 to-orange-700 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
