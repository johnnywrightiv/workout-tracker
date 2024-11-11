import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/verify-auth';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: NextRequest) {
	try {
		await connectToDatabase();
		const user = await verifyAuth(req);
		if (user) {
			const fullUser = await User.findById(user.userId);
			return NextResponse.json({
				isAuthenticated: true,
				user: {
					userId: user.userId,
					email: fullUser.email,
					name: fullUser.name,
					preferences: fullUser.preferences,
				},
			});
		}

		return NextResponse.json({ isAuthenticated: false }, { status: 401 });
	} catch (error) {
		console.error('Auth check failed:', error);
		return NextResponse.json({ isAuthenticated: false }, { status: 401 });
	}
}
