import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Send data to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/mobile-instagram-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        source: 'mobile-chrome-extension',
        timestamp: new Date().toISOString()
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing mobile Instagram data:', error)
    return NextResponse.json({ error: 'Failed to process mobile data' }, { status: 500 })
  }
} 