import React from "react"

export default function FormControl({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`${className}`}>{children}</div>
}
