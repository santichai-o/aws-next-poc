import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const phoneNumber = formData.get("phoneNumber");
    const countryCode = formData.get("countryCode");
    const nationalId = formData.get("nationalId");

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phoneNumber || !countryCode || !nationalId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" }, 
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json({ success: false, message: "API_URL not set" }, { status: 500 });
    }

    const memberData = {
      firstName: firstName.toString(),
      lastName: lastName.toString(),
      email: email.toString(),
      password: password.toString(),
      phoneNumber: phoneNumber.toString(),
      countryCode: countryCode.toString(),
      nationalId: nationalId.toString(),
    };

    console.log('Member registration data:', memberData);

    const res = await fetch(`${apiUrl}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
      cache: "no-store",
    });

    console.log('Member registration response:', res);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "Failed to create member account" 
        }, 
        { status: res.status }
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