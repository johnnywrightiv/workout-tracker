// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/templates', '/workout', '/workouts', '/settings'];

export function middleware(request: NextRequest) {
	// Check if the current path is a protected route
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	if (isProtectedRoute) {
		// Check for the auth token in cookies
		const token = request.cookies.get('token');

		if (!token) {
			// Redirect to login if no token exists
			const loginUrl = new URL('/login', request.url);
			// Store the original URL to redirect back after login
			loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

// Configure which routes will be protected
export const config = {
	matcher: [
		'/templates/:path*',
		'/workout/:path*',
		'/workouts/:path*',
		'/settings/:path*',
	],
};
