import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Socket.IO endpoint - implement with Socket.IO server' 
  });
} 