import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  // Use NextAuth session (iron-session is not used for login in this app)
  const session = await getServerSession(authOptions);

  // console.log('LINE Connect session (NextAuth):', {
  //   hasSession: !!session,
  //   hasIdToken: !!session?.idToken,
  // });

  if (!session || !session.idToken) {
    return NextResponse.json(
      { success: false, message: 'User token not found' },
      { status: 401 }
    );
  }

  const userToken = session.idToken;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  // const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  console.log('LINE Connect code:', { hasCode: !!code });

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

  // 2. Decode id_token to extract LINE federated identity info
  try {
    const decoded = jwt.decode(id_token) || {};
    const identities = Array.isArray(decoded?.identities) ? decoded.identities : [];
    // Try to get provider user id from Cognito 'identities' array when federated with LINE
    const lineUserId = identities.find((identity) => identity.providerName === 'Line')?.userId
      || decoded["custom:lineUserId"] // optional custom mapping
      || null;
    // Prefer 'name' then 'nickname', then fallback to cognito username
    const lineUsername = decoded['cognito:username'];
    const picture = decoded['picture'] || null;
    const lineProviderUser = { lineUsername, lineUserId, picture };

    if (decoded['name']) lineProviderUser.name = decoded['name'];

    if (!lineUsername || !lineUserId) {
      return NextResponse.json({ error: 'LINE user info not found in ID token' }, { status: 400 });
    }

    const res = await fetch(`${process.env.API_URL}/members/line/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(lineProviderUser),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
  if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Invalid credentials' },
        { status: res.status || 401 }
      );
    }
  // success – proceed to redirect
  } catch (err) {
    console.error('Failed to decode/handle ID Token', err);
    return NextResponse.json({ error: 'Invalid ID Token' }, { status: 400 });
  }

  // 3. Redirect ไปหน้า /
  return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_APP_URL));
}
