import React from "react"

export default React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ className = "", children, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
