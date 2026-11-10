import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${apiUrl}/api/v1/auth/google`);
}
