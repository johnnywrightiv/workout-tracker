import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/verify-auth';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	try {
		await connectToDatabase();
		const user = await verifyAuth(req);

		if (!user?.userId) {
			return NextResponse.json({ isAuthenticated: false }, { status: 401 });
		}

		const fullUser = await User.findById(user.userId).select(
			'-password_hash -resetPasswordToken -resetPasswordExpires'
		);

		if (!fullUser) {
			return NextResponse.json({ isAuthenticated: false }, { status: 401 });
		}

		return NextResponse.json({
			isAuthenticated: true,
			user: {
				userId: user.userId,
				email: fullUser.email,
				name: fullUser.name,
				preferences: fullUser.preferences,
			},
		});
	} catch (error) {
		console.error('Auth check failed:', error);
		return NextResponse.json(
			{ message: 'Authentication failed' },
			{ status: 401 }
		);
	}
}
