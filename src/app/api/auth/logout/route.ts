import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Logout failed" },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    )
  }
}
