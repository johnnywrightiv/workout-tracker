import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';
import { z } from 'zod';

const resetSchema = z.object({
	token: z.string().min(64).max(64),
	password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const body = await req.json();
		const { token, password } = resetSchema.parse(body);

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return NextResponse.json(
				{ message: 'Invalid or expired reset token' },
				{ status: 400 }
			);
		}

		const salt = await bcrypt.genSalt(12);
		const password_hash = await bcrypt.hash(password, salt);

		user.password_hash = password_hash;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		return NextResponse.json({
			message: 'Password successfully reset',
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: 'Invalid token or password format' },
				{ status: 400 }
			);
		}

		console.error('Password reset error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
