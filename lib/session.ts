import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "session_id",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // ใช้ secure cookie ใน production เท่านั้น
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

// ✅ บอก TypeScript ว่า session จะมีอะไรได้บ้าง
declare module "iron-session" {
  interface IronSessionData {
    idToken?: string;
    user?: {
      username: string;
      // เพิ่ม fields ได้ตามต้องการ
    };
  }
}