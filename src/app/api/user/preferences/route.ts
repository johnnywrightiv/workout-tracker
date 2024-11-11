import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/verify-auth';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
	try {
		await connectToDatabase();
		const user = await verifyAuth(req);
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const { colorScheme, measurementSystem } = await req.json();
		const updatedUser = await User.findByIdAndUpdate(
			user.userId,
			{
				$set: {
					'preferences.colorScheme': colorScheme,
					'preferences.measurementSystem': measurementSystem,
				},
			},
			{ new: true }
		);

		return NextResponse.json({
			message: 'Preferences updated successfully',
			preferences: updatedUser.preferences,
		});
	} catch (error) {
		console.error('Preference update error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
