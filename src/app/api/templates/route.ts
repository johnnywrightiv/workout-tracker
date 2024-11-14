import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/template';
import { verifyAuth } from '@/middleware/verify-auth';
import { z } from 'zod';

// Define the exercise schema
const exerciseSchema = z.object({
    name: z.string().min(1).max(100).trim(),
    sets: z.number().min(0).max(1000).optional(),
    reps: z.number().min(0).max(1000).optional(),
    weight: z.number().min(0).max(2000).optional(),
    notes: z.string().max(1000).optional(),
    muscleGroup: z.string().max(100).optional(),
    weightType: z.string().max(50).optional(),
    equipmentSettings: z.string().max(200).optional(),
    duration: z.number().min(0).max(86400).optional(), // max 24 hours in seconds
    exerciseType: z.string().max(50).optional(),
    speed: z.number().min(0).max(100).optional(),
    distance: z.number().min(0).max(1000).optional(),
});

const templateSchema = z.object({
	name: z.string().min(1).max(100).trim(),
	duration: z.number().min(0).max(86400).optional(),
	notes: z.string().max(1000).optional(),
	exercises: z.array(exerciseSchema).min(1).max(100),
});

export async function GET(req: NextRequest) {
	try {
		const user = await verifyAuth(req);
		if (!user?.userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await connectToDatabase();
		const templates = await Template.find({ user_id: user.userId })
			.lean()
			.select('-__v');

		return NextResponse.json(templates);
	} catch (error) {
		console.error('Templates fetch error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await verifyAuth(req);
		if (!user?.userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await connectToDatabase();
		const body = await req.json();
		const validatedData = templateSchema.parse(body);

		const template = new Template({
			user_id: user.userId,
			...validatedData,
		});

		await template.save();
		return NextResponse.json(template, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: 'Invalid input format', errors: error.errors },
				{ status: 400 }
			);
		}

		console.error('Template creation error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
