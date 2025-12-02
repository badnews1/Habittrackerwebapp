import * as React from "react"

import { cn } from "./utils"
import { Label } from "./label"

// Расширяем типы для поддержки showCounter
export interface TextareaProps extends React.ComponentProps<"textarea"> {
  showCounter?: boolean; // Опциональный проп для отображения счетчика символов
  label?: string; // Опциональный label для отображения с счетчиком
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCounter, maxLength, value, label, id, ...props }, ref) => {
    // Если showCounter включен, рендерим wrapper с label и счетчиком сверху
    if (showCounter && maxLength) {
      const currentLength = typeof value === 'string' ? value.length : 0;

      return (
        <div className="w-full">
          {/* Строка с label и счетчиком */}
          <div className="flex items-center justify-between mb-1">
            {label && <Label htmlFor={id}>{label}</Label>}
            <span className="text-[10px] text-muted-foreground">
              {currentLength}/{maxLength}
            </span>
          </div>
          
          {/* Textarea */}
          <textarea
            className={cn(
              "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-text-tertiary focus-visible:outline-none focus-visible:border-border-focus disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            id={id}
            maxLength={maxLength}
            value={value}
            {...props}
          />
        </div>
      );
    }

    // Обычный Textarea без счетчика
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-text-tertiary focus-visible:outline-none focus-visible:border-border-focus disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        id={id}
        maxLength={maxLength}
        value={value}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
