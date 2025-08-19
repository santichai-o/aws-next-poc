import NextAuth, { type NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!, 
      // ตัวอย่าง issuer:
      // "https://ap-southeast-1jkmn5a5nr.auth.ap-southeast-1.amazoncognito.com"
      authorization: {
        params: {
          scope: "openid profile", // 👈 สำคัญ
          // identity_provider: "Cognito", // 👈 ถ้าใช้ Cognito Hosted UI
        },
      },
    }),
  ],
  pages: {
    signIn: "/members/login",
    signOut: "/members/signout",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // เพิ่ม accessToken จาก Cognito ลงใน JWT
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // ส่ง token ไปที่ client
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// 🚨 ต้อง export ทั้ง GET/POST
export { handler as GET, handler as POST };
