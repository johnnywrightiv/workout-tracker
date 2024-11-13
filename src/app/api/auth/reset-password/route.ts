import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();
		const { token, password } = await req.json();

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

		// Hash new password
		const salt = await bcrypt.genSalt(10);
		const password_hash = await bcrypt.hash(password, salt);

		// Update user
		user.password_hash = password_hash;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		return NextResponse.json({
			message: 'Password successfully reset',
		});
	} catch (error) {
		console.error('Password reset error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
