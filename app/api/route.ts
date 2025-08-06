import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Hello from API!',
      timestamp: new Date().toISOString(),
      method: 'GET'
    },
    { status: 200 }
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json(
      { 
        message: 'Data received successfully',
        data: body,
        timestamp: new Date().toISOString(),
        method: 'POST'
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Invalid JSON',
        error: 'Failed to parse request body',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }
}
