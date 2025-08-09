// app/api/login/route.ts (Next.js 13+)
// หรือ pages/api/login.ts (Next.js 12)
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json({ success: false, message: "API_URL not set" }, { status: 500 });
  }

  try {
    const res = await fetch(`${apiUrl}/members/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.idToken) {
      return NextResponse.json(
        { success: false, message: data.message || "Invalid credentials" },
        { status: res.status || 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Dynamically set session expiration
    if (sessionOptions.cookieOptions) {
      sessionOptions.cookieOptions.maxAge = data.expiresIn;
    }

    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    session.idToken = data.idToken;
    await session.save();

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, message: "Unexpected error" }, { status: 500 });
  }
}
