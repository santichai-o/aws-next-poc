import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";

export async function GET(req) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions);
  if (!session || !session.idToken) {
    return NextResponse.json(
      { success: false, message: "User token not found" },
      { status: 401 },
    );
  }

  const userToken = session.idToken;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  // const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  // ป้องกัน CSRF ด้วยการตรวจสอบ state
  // if (state !== process.env.LINE_LOGIN_STATE) {
  //   return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  // }

  // 1. แลก code เป็น token
  const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NEXT_PUBLIC_APP_URL + '/api/members/line-connect',
      client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      client_secret: process.env.COGNITO_CLIENT_SECRET
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error(tokenData);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }

  const { id_token } = tokenData;

  // 2. Validate id_token
  try {
    const decoded = jwt.decode(id_token);
    const lineProviderUsername = decoded['cognito:username'];
    const lineUserId = decoded.identities.find(identity => identity.providerName === 'Line')?.userId;

    if (!lineProviderUsername || !lineUserId) {
      return NextResponse.json({ error: 'Line user ID not found in ID token' }, { status: 400 });
    }

    console.log('Decoded ID Token:', lineProviderUsername, lineUserId);

    const res = await fetch(`${process.env.API_URL}/members/line/connect`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({ lineProviderUsername, lineUserId }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Invalid credentials" },
        { status: res.status || 401 }
      );
    }
  } catch (err) {
    console.error('Invalid ID Token', err);
    return NextResponse.json({ error: 'Invalid ID Token' }, { status: 400 });
  }

  // 3. Redirect ไปหน้า /
  const response = NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_APP_URL, req.url));

  return response;
}
