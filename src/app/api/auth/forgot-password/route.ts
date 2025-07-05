import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';

const requestSchema = z.object({
	email: z.string().email().toLowerCase().trim(),
});

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const body = await req.json();
		const { email } = requestSchema.parse(body);

		const user = await User.findOne({ email });

		const response = {
			message: 'If an account exists, a reset link will be sent.',
		};

		if (user) {
			const resetToken = crypto.randomBytes(32).toString('hex');
			const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

			user.resetPasswordToken = resetToken;
			user.resetPasswordExpires = resetTokenExpiry;
			await user.save();

			const baseUrl =
				process.env.NODE_ENV === 'development'
					? process.env.NEXT_PUBLIC_BASE_URL // Development URL
					: 'https://workout-tracker-eta-green.vercel.app'; // Production URL
			if (!baseUrl) {
				throw new Error('BASE_URL environment variable is not set');
			}

			await sendPasswordResetEmail(email, resetToken, baseUrl);
		}

		return NextResponse.json(response);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: 'Invalid email format' },
				{ status: 400 }
			);
		}

		console.error('Password reset request error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
