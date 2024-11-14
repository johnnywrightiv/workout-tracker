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

type Props = {
	params: {
		id: string;
	};
};

export async function GET(request: NextRequest, { params }: Props) {
	try {
		const user = await verifyAuth(request);
		if (!user?.userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await connectToDatabase();

		if (
			!z
				.string()
				.regex(/^[0-9a-fA-F]{24}$/)
				.safeParse(params.id).success
		) {
			return NextResponse.json(
				{ message: 'Invalid template ID' },
				{ status: 400 }
			);
		}

		const template = await Template.findOne({
			_id: params.id,
			user_id: user.userId,
		}).lean();

		if (!template) {
			return NextResponse.json(
				{ message: 'Template not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(template);
	} catch (error) {
		console.error('Template fetch error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest, { params }: Props) {
	try {
		const user = await verifyAuth(request);
		if (!user?.userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await connectToDatabase();

		if (
			!z
				.string()
				.regex(/^[0-9a-fA-F]{24}$/)
				.safeParse(params.id).success
		) {
			return NextResponse.json(
				{ message: 'Invalid template ID' },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const validatedData = templateSchema.parse(body);

		const template = await Template.findOneAndUpdate(
			{ _id: params.id, user_id: user.userId },
			{ $set: validatedData },
			{ new: true, runValidators: true }
		).lean();

		if (!template) {
			return NextResponse.json(
				{ message: 'Template not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(template);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: 'Invalid input format', errors: error.errors },
				{ status: 400 }
			);
		}

		console.error('Template update error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: Props) {
	try {
		const user = await verifyAuth(request);
		if (!user?.userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await connectToDatabase();

		if (
			!z
				.string()
				.regex(/^[0-9a-fA-F]{24}$/)
				.safeParse(params.id).success
		) {
			return NextResponse.json(
				{ message: 'Invalid template ID' },
				{ status: 400 }
			);
		}

		const template = await Template.findOneAndDelete({
			_id: params.id,
			user_id: user.userId,
		}).lean();

		if (!template) {
			return NextResponse.json(
				{ message: 'Template not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ message: 'Template deleted successfully' });
	} catch (error) {
		console.error('Template deletion error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
