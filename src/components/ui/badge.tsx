import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        
        // Цветные варианты из универсальной палитры (20 цветов)
        gray: "bg-[var(--palette-gray-bg)] text-[var(--palette-gray-text)] border-[var(--palette-gray-border)]",
        zinc: "bg-[var(--palette-zinc-bg)] text-[var(--palette-zinc-text)] border-[var(--palette-zinc-border)]",
        stone: "bg-[var(--palette-stone-bg)] text-[var(--palette-stone-text)] border-[var(--palette-stone-border)]",
        red: "bg-[var(--palette-red-bg)] text-[var(--palette-red-text)] border-[var(--palette-red-border)]",
        rose: "bg-[var(--palette-rose-bg)] text-[var(--palette-rose-text)] border-[var(--palette-rose-border)]",
        pink: "bg-[var(--palette-pink-bg)] text-[var(--palette-pink-text)] border-[var(--palette-pink-border)]",
        orange: "bg-[var(--palette-orange-bg)] text-[var(--palette-orange-text)] border-[var(--palette-orange-border)]",
        amber: "bg-[var(--palette-amber-bg)] text-[var(--palette-amber-text)] border-[var(--palette-amber-border)]",
        yellow: "bg-[var(--palette-yellow-bg)] text-[var(--palette-yellow-text)] border-[var(--palette-yellow-border)]",
        lime: "bg-[var(--palette-lime-bg)] text-[var(--palette-lime-text)] border-[var(--palette-lime-border)]",
        green: "bg-[var(--palette-green-bg)] text-[var(--palette-green-text)] border-[var(--palette-green-border)]",
        emerald: "bg-[var(--palette-emerald-bg)] text-[var(--palette-emerald-text)] border-[var(--palette-emerald-border)]",
        teal: "bg-[var(--palette-teal-bg)] text-[var(--palette-teal-text)] border-[var(--palette-teal-border)]",
        cyan: "bg-[var(--palette-cyan-bg)] text-[var(--palette-cyan-text)] border-[var(--palette-cyan-border)]",
        sky: "bg-[var(--palette-sky-bg)] text-[var(--palette-sky-text)] border-[var(--palette-sky-border)]",
        blue: "bg-[var(--palette-blue-bg)] text-[var(--palette-blue-text)] border-[var(--palette-blue-border)]",
        indigo: "bg-[var(--palette-indigo-bg)] text-[var(--palette-indigo-text)] border-[var(--palette-indigo-border)]",
        violet: "bg-[var(--palette-violet-bg)] text-[var(--palette-violet-text)] border-[var(--palette-violet-border)]",
        purple: "bg-[var(--palette-purple-bg)] text-[var(--palette-purple-text)] border-[var(--palette-purple-border)]",
        fuchsia: "bg-[var(--palette-fuchsia-bg)] text-[var(--palette-fuchsia-text)] border-[var(--palette-fuchsia-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
