import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import { z } from 'zod';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
	email: z.string().email().toLowerCase().trim(),
	password: z.string().min(8),
});

const defaultPreferences = {
	colorScheme: 'blue' as const,
	measurementSystem: 'metric' as const,
};

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const body = await req.json();
		const { email, password } = loginSchema.parse(body);

		const existingUser = await User.findOne({ email }).select('+password_hash');
		if (!existingUser) {
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const isPasswordValid = await bcrypt.compare(
			password,
			existingUser.password_hash
		);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error('JWT_SECRET environment variable is not set');
		}

		const token = jwt.sign({ userId: existingUser._id }, jwtSecret, {
			expiresIn: '1h',
		});

		// Merge default preferences with user preferences
		const userPreferences = {
			...defaultPreferences,
			...existingUser.preferences,
		};

		const response = NextResponse.json(
			{
				message: 'Login successful',
				user: {
					userId: existingUser._id,
					email: existingUser.email,
					name: existingUser.name,
					preferences: userPreferences,
				},
			},
			{ status: 200 }
		);

		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 3600,
			path: '/',
		});

		return response;
	} catch (error) {
		console.error('Login error:', error);
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: 'Invalid login data', errors: error.errors },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
