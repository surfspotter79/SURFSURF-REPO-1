// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/work')) return NextResponse.next();

  const auth = req.headers.get('authorization');
  const username = process.env.BASIC_AUTH_USERNAME || 'admin';
  const password = process.env.BASIC_AUTH_PASSWORD || 'changeme';
  const valid = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  if (auth === valid) return NextResponse.next();

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Surfspotter Workbench"' }
  });
}

export const config = { matcher: ['/work', '/work/:path*'] };
