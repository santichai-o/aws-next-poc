import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";

export async function GET(request: NextRequest) {
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
    return NextResponse.json(
      { success: false, message: "API_URL not set" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${apiUrl}/members/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Fetch error", error: err.message || err },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    return NextResponse.json(
      { success: false, message: "API_URL not set" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${apiUrl}/members/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
      body: JSON.stringify(await request.json()),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Fetch error", error: err.message || err },
      { status: 500 },
    );
  }
}