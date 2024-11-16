import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import { z } from 'zod';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const signupSchema = z.object({
	email: z.string().email().toLowerCase().trim(),
	password: z.string().min(8).max(100),
	name: z.string().min(2).max(100).trim(),
});

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const body = await req.json();
		const { email, password, name } = signupSchema.parse(body);

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 409 }
			);
		}

		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			email,
			password_hash: hashedPassword,
			name,
		});
		await user.save();

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error('JWT_SECRET environment variable is not set');
		}

		const token = jwt.sign({ userId: user._id }, jwtSecret, {
			expiresIn: '1h',
		});

		const response = NextResponse.json(
			{
				message: 'User created successfully',
				user: {
					userId: user._id,
					email: user.email,
					name: user.name,
				},
			},
			{ status: 201 }
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
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: 'Invalid input format', errors: error.errors },
				{ status: 400 }
			);
		}

		console.error('Signup error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
