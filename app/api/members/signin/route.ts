import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";
import crypto from "crypto";

import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const secretHash = crypto
    .createHmac("sha256", process.env.COGNITO_CLIENT_SECRET || "")
    .update(email + process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID)
    .digest("base64");

  const client = new CognitoIdentityProviderClient({ region: "ap-southeast-1" });

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH", // ต้องเปิดใน App client settings ของ Cognito
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      }
    });

    const res = await client.send(command);

    const idToken = res.AuthenticationResult?.IdToken;
    if (!idToken) {
      throw new Error("No token returned");
    }

    const response = NextResponse.json({ success: true });
    if (sessionOptions.cookieOptions) {
      // sessionOptions.cookieOptions.maxAge = data.expiresIn;
    }

    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    session.idToken = idToken;
    await session.save();
    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
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
