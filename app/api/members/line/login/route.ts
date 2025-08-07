import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json({ success: false, message: "API_URL not set" }, { status: 500 });
  }

  const { code, redirectUri } = await request.json();
  if (!code || !redirectUri) {
    return NextResponse.json({ success: false, message: "Code not provided" }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiUrl}/members/line/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }),
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
    sessionOptions.cookieOptions.maxAge = data.expiresIn;

    const session = await getIronSession(request, response, sessionOptions);

    session.idToken = data.idToken;
    await session.save();

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Unexpected error" }, { status: 500 });
  }
}
