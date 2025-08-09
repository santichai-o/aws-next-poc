import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(request, new NextResponse(), sessionOptions);

  if (!session || !session.idToken) {
    return NextResponse.json(
      { success: false, message: "User token not found" },
      { status: 401 },
    );
  }

  const userToken = session.idToken;

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json({ success: false, message: "API_URL not set" }, { status: 500 });
  }

  const { code, redirectUri } = await request.json();

  if (!code || !redirectUri) {
    return NextResponse.json({ success: false, message: "Code not provided" }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiUrl}/members/line/connect`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({ code, redirectUri }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Invalid credentials" },
        { status: res.status || 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Unexpected error" }, { status: 500 });
  }
}
