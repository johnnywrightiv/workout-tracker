import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/templates', '/workout', '/workouts', '/settings'];
const protectedApiRoutes = ['/api/templates', '/api/workouts', '/api/user'];

export function middleware(request: NextRequest) {
	// Check if the current path is a protected route or API endpoint
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	const isProtectedApi = protectedApiRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	if (isProtectedRoute || isProtectedApi) {
		// Check for the auth token in cookies
		const token = request.cookies.get('token');

		if (!token) {
			// For API routes, return 401 instead of redirecting
			if (isProtectedApi) {
				return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
			}

			// Redirect to login if no token exists for page routes
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/templates/:path*',
		'/workout/:path*',
		'/workouts/:path*',
		'/settings/:path*',
		'/api/templates/:path*',
		'/api/workouts/:path*',
		'/api/user/:path*',
	],
};
