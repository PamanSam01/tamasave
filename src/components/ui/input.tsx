import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border-2 border-ink bg-shell px-3 text-sm outline-none ring-mint transition focus:ring-4",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
