import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { authenticateUser } from "@/lib/cognito";
import { SessionData } from "@/types";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const { idToken, accessToken, refreshToken, expiresIn } = await authenticateUser(email, password);

    const response = NextResponse.json({ success: true });
    if (sessionOptions.cookieOptions && expiresIn) {
      sessionOptions.cookieOptions.maxAge = expiresIn;
    }

    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    session.idToken = idToken;
    session.accessToken = accessToken;
    if (refreshToken) {
      session.refreshToken = refreshToken;
    }
    if (expiresIn) {
      session.expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
    }
    await session.save();
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // With API
  /* const apiUrl = process.env.API_URL;
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
  } */
}
