import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Alert = forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "rounded-lg border p-4",
      {
        "bg-gray-50 text-gray-900 border-gray-200": variant === "default",
        "bg-red-50 text-red-900 border-red-200": variant === "destructive",
        "bg-yellow-50 text-yellow-900 border-yellow-200": variant === "warning",
      },
      className
    )}
    {...props}
  />
))

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))

export { Alert, AlertDescription }