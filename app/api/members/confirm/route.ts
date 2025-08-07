import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "All fields are required" }, 
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json({ success: false, message: "API_URL not set" }, { status: 500 });
    }

    const res = await fetch(`${apiUrl}/members/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to verify code" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully",
      data 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An unexpected error occurred", error: error.message }, { status: 500 });
  }
}