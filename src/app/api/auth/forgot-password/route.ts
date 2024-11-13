import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();
		const { email } = await req.json();

		const user = await User.findOne({ email });
		if (!user) {
			// Return success even if user not found for security
			return NextResponse.json({
				message: 'If an account exists, a reset link will be sent.',
			});
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString('hex');
		const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

		// Save token to user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = resetTokenExpiry;
		await user.save();

		// Send email
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
		await sendPasswordResetEmail(email, resetToken, baseUrl);

		return NextResponse.json({
			message: 'Password reset email sent',
		});
	} catch (error) {
		console.error('Password reset request error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
