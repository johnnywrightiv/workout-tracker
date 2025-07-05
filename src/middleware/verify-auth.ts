import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAuth(req: NextRequest) {
	// Try to get token from cookie first
	const tokenFromCookie = req.cookies.get('token')?.value;

	// If no cookie, try Authorization header
	const authHeader = req.headers.get('authorization');
	const tokenFromHeader = authHeader?.startsWith('Bearer ')
		? authHeader.split(' ')[1]
		: null;

	// Use whichever token is available
	const token = tokenFromCookie || tokenFromHeader;

	if (!token) {
		return null;
	}

	try {
		// Verify the token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as jwt.JwtPayload;

		// Ensure the decoded token has a userId
		if (!decoded || !decoded.userId) {
			return null;
		}

		return {
			userId: decoded.userId,
		};
	} catch (error) {
		console.error('Token verification failed:', error);
		return null;
	}
}
