import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
		// First connect to database
		await connectToDatabase();

		const { email, password, name } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			);
		}

		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 409 }
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the new user
		const user = new User({
			email,
			password_hash: hashedPassword,
			name,
		});

		await user.save();

		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || 'fallback-secret-for-development',
			{ expiresIn: '1h' }
		);

		const response = NextResponse.json(
			{ message: 'User created successfully' },
			{ status: 201 }
		);

		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 3600,
			path: '/',
		});

		return response;
	} catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}