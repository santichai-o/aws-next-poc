import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  // สร้าง response ว่างก่อน เพื่อให้ session ใช้จัดการ cookie
  const response = new NextResponse();

  const session = await getIronSession(request, response, sessionOptions);
  await session.destroy();

  // ใส่เนื้อหา JSON หลังจาก session ถูกลบ
  return NextResponse.json({ success: true }, response);
}
