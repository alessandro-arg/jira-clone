import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-neutral-300 border border-neutral-200 dark:border-neutral-600 shadow-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-blue-600 to-blue-700 text-primary-foreground dark:text-neutral-100 hover:from-blue-700 hover:to-blue-700",
        destructive:
          "bg-gradient-to-b from-amber-600 to-amber-700 text-primary-foreground hover:from-amber-700 hover:to-amber-700",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-white text-black hover:bg-neutral-100 dark:border-border dark:bg-background dark:text-white dark:hover:bg-neutral-900",
        ghost:
          "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
        muted:
          "bg-neutral-200 dark:bg-muted dark:hover:bg-neutral-700 dark:border-border text-neutral-600 dark:text-muted-foreground hover:bg-neutral-200/80",
        transparent:
          "bg-transparent border-none p-0! hover:text-black dark:hover:text-white shadow-none",
        teritary:
          "bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        xs: "h-7 rounded-md gap-1.5 px-2 has-[>svg]:px-1.5 text-xs",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-5",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
