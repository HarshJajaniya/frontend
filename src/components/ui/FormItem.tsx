import React from "react"

export default function FormItem({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}
