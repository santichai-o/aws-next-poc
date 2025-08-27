import NextAuth, { type NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CognitoProvider({
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!, 
      authorization: {
        params: {
          scope: "openid profile",
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
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
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
