import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/verify-auth';

export async function GET(req: NextRequest) {
	try {
		const user = await verifyAuth(req);

		if (user) {
			return NextResponse.json({
				isAuthenticated: true,
				user: {
					userId: user.userId,
					name: user.name,
					email: user.email,
				},
			});
		}

		return NextResponse.json({ isAuthenticated: false }, { status: 401 });
	} catch (error) {
		console.error('Auth check failed:', error);
		return NextResponse.json({ isAuthenticated: false }, { status: 401 });
	}
}
