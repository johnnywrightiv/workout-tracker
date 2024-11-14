import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/verify-auth';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';
import { z } from 'zod';

const preferencesSchema = z.object({
	colorScheme: z.enum(['light', 'dark', 'system']),
	measurementSystem: z.enum(['metric', 'imperial']),
});

export async function PUT(req: NextRequest) {
	try {
		await connectToDatabase();
		const user = await verifyAuth(req);
		if (!user?.userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const body = await req.json();
		const validatedData = preferencesSchema.parse(body);

		const updatedUser = await User.findByIdAndUpdate(
			user.userId,
			{
				$set: {
					'preferences.colorScheme': validatedData.colorScheme,
					'preferences.measurementSystem': validatedData.measurementSystem,
				},
			},
			{ new: true, runValidators: true }
		).select('preferences');

		if (!updatedUser) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({
			message: 'Preferences updated successfully',
			preferences: updatedUser.preferences,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: 'Invalid preferences format', errors: error.errors },
				{ status: 400 }
			);
		}

		console.error('Preference update error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
