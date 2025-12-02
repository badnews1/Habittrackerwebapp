"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-bg-hover hover:text-text-primary data-[state=on]:bg-bg-hover data-[state=on]:text-text-primary",
        outline:
          "border-2 border-input bg-transparent hover:bg-bg-hover hover:text-text-primary data-[state=on]:bg-bg-hover data-[state=on]:text-text-primary",
        
        // Цветные варианты из универсальной палитры (20 цветов)
        // Используют opacity для переключения состояний: off=60%, on=100%, hover(off)=80%
        gray: "bg-[var(--palette-gray-bg)] text-[var(--palette-gray-text)] border-[var(--palette-gray-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        zinc: "bg-[var(--palette-zinc-bg)] text-[var(--palette-zinc-text)] border-[var(--palette-zinc-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        stone: "bg-[var(--palette-stone-bg)] text-[var(--palette-stone-text)] border-[var(--palette-stone-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        red: "bg-[var(--palette-red-bg)] text-[var(--palette-red-text)] border-[var(--palette-red-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        rose: "bg-[var(--palette-rose-bg)] text-[var(--palette-rose-text)] border-[var(--palette-rose-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        pink: "bg-[var(--palette-pink-bg)] text-[var(--palette-pink-text)] border-[var(--palette-pink-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        orange: "bg-[var(--palette-orange-bg)] text-[var(--palette-orange-text)] border-[var(--palette-orange-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        amber: "bg-[var(--palette-amber-bg)] text-[var(--palette-amber-text)] border-[var(--palette-amber-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        yellow: "bg-[var(--palette-yellow-bg)] text-[var(--palette-yellow-text)] border-[var(--palette-yellow-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        lime: "bg-[var(--palette-lime-bg)] text-[var(--palette-lime-text)] border-[var(--palette-lime-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        green: "bg-[var(--palette-green-bg)] text-[var(--palette-green-text)] border-[var(--palette-green-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        emerald: "bg-[var(--palette-emerald-bg)] text-[var(--palette-emerald-text)] border-[var(--palette-emerald-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        teal: "bg-[var(--palette-teal-bg)] text-[var(--palette-teal-text)] border-[var(--palette-teal-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        cyan: "bg-[var(--palette-cyan-bg)] text-[var(--palette-cyan-text)] border-[var(--palette-cyan-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        sky: "bg-[var(--palette-sky-bg)] text-[var(--palette-sky-text)] border-[var(--palette-sky-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        blue: "bg-[var(--palette-blue-bg)] text-[var(--palette-blue-text)] border-[var(--palette-blue-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        indigo: "bg-[var(--palette-indigo-bg)] text-[var(--palette-indigo-text)] border-[var(--palette-indigo-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        violet: "bg-[var(--palette-violet-bg)] text-[var(--palette-violet-text)] border-[var(--palette-violet-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        purple: "bg-[var(--palette-purple-bg)] text-[var(--palette-purple-text)] border-[var(--palette-purple-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        fuchsia: "bg-[var(--palette-fuchsia-bg)] text-[var(--palette-fuchsia-text)] border-[var(--palette-fuchsia-border)] data-[state=off]:opacity-60 data-[state=on]:opacity-100 hover:data-[state=off]:opacity-80",
        
        // Вариант для дней недели в частоте привычек (минималистичный стиль Джонни Айва)
        day: "border border-input bg-background text-foreground hover:bg-bg-hover hover:text-text-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary",
      },
      size: {
        default: "h-9 px-2 min-w-9 rounded-md [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 px-1.5 min-w-8 rounded-md [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 px-2.5 min-w-10 rounded-md [&_svg:not([class*='size-'])]:size-4",
        tag: "h-6 px-3 rounded [&_svg:not([class*='size-'])]:size-3", // Для ToggleChip - компактный размер
        day: "h-[35px] min-w-[35px] aspect-square p-0 rounded-md", // Для дней недели - квадратная форма 35x35px
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
