import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const { email, password } = await req.json();
		console.log('Login attempt for email:', email); // Debug log

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			);
		}

		const existingUser = await User.findOne({ email });
		console.log('User found:', existingUser ? 'Yes' : 'No'); // Debug log

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
		console.log('Password valid:', isPasswordValid); // Debug log

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const token = jwt.sign(
			{ userId: existingUser._id },
			process.env.JWT_SECRET || 'fallback-secret-for-development',
			{ expiresIn: '1h' }
		);

		const response = NextResponse.json(
			{
				message: 'Login successful',
				userId: existingUser._id,
				email: existingUser.email,
				name: existingUser.name,
			},
			{ status: 200 }
		);

		response.cookies.set('token', token, {
			httpOnly: true,
			// secure: process.env.NODE_ENV === 'production',
			maxAge: 3600,
			path: '/',
		});

		return response;
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
