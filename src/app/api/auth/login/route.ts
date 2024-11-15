import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
	email: z.string().email().toLowerCase().trim(),
	password: z.string().min(8),
});

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const body = await req.json();
		const { email, password } = loginSchema.parse(body);

		const existingUser = await User.findOne({ email });
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

		const response = NextResponse.json(
			{
				message: 'Login successful',
				user: {
					userId: existingUser._id,
					email: existingUser.email,
					name: existingUser.name,
					preferences: existingUser.preferences,
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

		console.log('Login response:', response); // Log the response
		return response;
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
