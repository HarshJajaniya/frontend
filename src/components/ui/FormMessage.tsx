import React from "react"

export default function FormMessage({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  if (!children) return null
  return <p className={`text-sm text-red-500 mt-1 ${className}`}>{children}</p>
}
