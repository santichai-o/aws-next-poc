import { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "session_id",
  cookieOptions: {
    secure: false, //process.env.NODE_ENV === "production",
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