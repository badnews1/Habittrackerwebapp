import * as React from "react"

import { cn } from "./utils"

// Расширяем типы для поддержки showCounter и variant
export interface InputProps extends React.ComponentProps<"input"> {
  showCounter?: boolean; // Опциональный проп для отображения счетчика символов
  variant?: "default" | "borderless"; // Вариант отображения
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showCounter, maxLength, value, variant = "default", ...props }, ref) => {
    // Определяем базовые классы в зависимости от варианта
    const baseClasses = variant === "borderless"
      ? "flex h-9 w-full bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      : "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-tertiary focus-visible:outline-none focus-visible:border-border-focus disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

    // Если showCounter включен, нужен wrapper для позиционирования счетчика
    if (showCounter && maxLength) {
      const currentLength = typeof value === 'string' ? value.length : 0;
      const remaining = maxLength - currentLength;

      return (
        <div className={cn("relative", className)}>
          <input
            type={type}
            className={cn(
              baseClasses,
              "pr-12" // Отступ справа для счетчика
            )}
            ref={ref}
            maxLength={maxLength}
            value={value}
            {...props}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
            {remaining}
          </span>
        </div>
      );
    }

    // Обычный Input без счетчика
    return (
      <input
        type={type}
        className={cn(
          baseClasses,
          className
        )}
        ref={ref}
        maxLength={maxLength}
        value={value}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
