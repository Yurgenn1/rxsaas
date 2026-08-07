"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.ComponentProps<"div"> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  inputProps?: React.ComponentProps<"input">
}

function FormField({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  inputProps,
  className,
  ...props
}: FormFieldProps) {
  const inputId = React.useId()

  return (
    <div
      data-slot="form-field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium text-foreground",
            disabled && "opacity-50",
            error && "text-error"
          )}
          aria-required={required}
        >
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      <Input
        id={inputId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error || helperText ? `${inputId}-description` : undefined}
        {...inputProps}
      />

      {(error || helperText) && (
        <p
          id={`${inputId}-description`}
          className={cn(
            "text-xs",
            error
              ? "text-error"
              : "text-muted-foreground"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export { FormField }
