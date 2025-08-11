import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function GET(req) {
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
      redirect_uri: process.env.NEXT_PUBLIC_APP_URL + '/api/members/line-callback',
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
  // try {
  //   const decoded = jwt.decode(id_token); // แค่ decode ไม่ verify
  //   console.log('Decoded ID Token:', decoded);

  //   // TODO: fetch public keys จาก https://api.line.me/oauth2/v2.1/certs แล้ว verify signature
  // } catch (err) {
  //   console.error('Invalid ID Token', err);
  //   return NextResponse.json({ error: 'Invalid ID Token' }, { status: 400 });
  // }

  // 3. เก็บ id_token ใน session
  const response = NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_APP_URL, req.url));
  // Ensure cookieOptions is defined
  sessionOptions.cookieOptions = sessionOptions.cookieOptions || {};
  // Dynamically set session expiration
  sessionOptions.cookieOptions.maxAge = 3600; // Default to 1 hour if not provided
  const session = await getIronSession(req, response, sessionOptions);

  session.idToken = id_token;
  await session.save();

  // 4. Redirect ไปหน้า /
  return response;
}
