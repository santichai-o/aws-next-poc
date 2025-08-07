import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const formData = await request.formData();

    // const firstName = formData.get("firstName");
    // const lastName = formData.get("lastName");
    // const email = formData.get("email");
    // const password = formData.get("password");
    // const phoneNumber = formData.get("phoneNumber");
    // const countryCode = formData.get("countryCode");
    // const nationalId = formData.get("nationalId");

    const memberData = await request.json();

    // Validate required fields
    if (!memberData.firstName || !memberData.lastName || !memberData.email || !memberData.password || !memberData.phoneNumber || !memberData.countryCode || !memberData.nationalId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json({ success: false, message: "API_URL not set" }, { status: 500 });
    }

    console.log('Member registration data:', memberData);

    const res = await fetch(`${apiUrl}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: error.message || "Failed to create member" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully",
      data 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An unexpected error occurred", error: error.message }, { status: 500 });
  }
}