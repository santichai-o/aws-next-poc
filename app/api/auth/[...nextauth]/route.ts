import NextAuth, { type NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/lib/cognito";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const { idToken, accessToken, refreshToken, expiresIn } = await authenticateUser(
          credentials.email,
          credentials.password
        );

        return {
          id: credentials.email,
          name: credentials.email,
          email: credentials.email,
          idToken,
          accessToken,
          refreshToken,
          expiresIn,
        };
      },
    }),
    CognitoProvider({
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!, 
      authorization: {
        params: {
          scope: "openid profile",
          // prompt: "consent login",
          max_age: 0,
        },
      },
      checks: ["pkce", "state", "nonce"], // 👈 เพิ่ม nonce check
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.email ?? "LINE User",
          email: profile.email ?? null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
        if (account.expires_at) {
          token.expiresAt = account.expires_at;
        }
      }

      if (user) {
        const credentialsUser = user as unknown as {
          accessToken?: string;
          idToken?: string;
          refreshToken?: string;
          expiresIn?: number;
        };

        if (credentialsUser.accessToken) {
          token.accessToken = credentialsUser.accessToken;
        }
        if (credentialsUser.idToken) {
          token.idToken = credentialsUser.idToken;
        }
        if (credentialsUser.refreshToken) {
          token.refreshToken = credentialsUser.refreshToken;
        }
        if (credentialsUser.expiresIn) {
          token.expiresAt = Math.floor(Date.now() / 1000) + credentialsUser.expiresIn;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      if (token.refreshToken) {
        session.refreshToken = token.refreshToken as string;
      }
      if (token.expiresAt) {
        session.expiresAt = token.expiresAt as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/members/login",
    signOut: "/members/signout",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
