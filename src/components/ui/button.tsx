import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-ink px-4 text-sm font-bold shadow-pixel-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-mint text-ink hover:bg-butter",
        peach: "bg-peach text-ink hover:bg-butter",
        outline: "bg-shell text-ink hover:bg-sky",
        ghost: "border-transparent bg-transparent shadow-none hover:bg-screen"
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-xs",
        icon: "h-10 w-10 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
