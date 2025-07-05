import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Workout from '@/models/workout';
import { verifyAuth } from '@/middleware/verify-auth';
import { z } from 'zod';

// Validation schemas
const exerciseSchema = z.object({
	name: z.string().min(1).max(100),
	sets: z.number().int().min(0).optional(),
	reps: z.number().int().min(0).optional(),
	weight: z.number().min(0).optional(),
	notes: z.string().max(500).optional(),
	muscleGroup: z.string().max(50).optional(),
	weightType: z.string().max(50).optional(),
	equipmentSettings: z.string().max(200).optional(),
	duration: z.number().min(0).optional(),
	exerciseType: z.string().max(50).optional(),
	speed: z.number().min(0).optional(),
	distance: z.number().min(0).optional(),
	completed: z.boolean().optional(),
});

const workoutCreateSchema = z.object({
	name: z.string().min(1).max(100),
	startTime: z.string().datetime(),
	// endTime: z.string().datetime().optional(),
	duration: z.number().min(0).optional(),
	notes: z.string().max(1000).optional(),
	exercises: z.array(exerciseSchema),
});

// Error handler function
function handleError(error: any) {
	console.error('Error:', error);
	if (error instanceof z.ZodError) {
		return NextResponse.json(
			{ message: 'Validation error', errors: error.errors },
			{ status: 400 }
		);
	}
	return NextResponse.json(
		{ message: 'Internal server error' },
		{ status: 500 }
	);
}

// GET - Fetch all workouts for user
export async function GET(req: NextRequest) {
	try {
		const user = verifyAuth(req);
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await connectToDatabase();
		const workouts = await Workout.find({ user_id: user.userId }).lean();
		return NextResponse.json(workouts);
	} catch (error) {
		return handleError(error);
	}
}

// POST - Create new workout
export async function POST(req: NextRequest) {
	try {
		// Verify user authentication
		const user = verifyAuth(req);
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		// Connect to the database
		await connectToDatabase();

		// Parse and validate incoming JSON data
		const data = await req.json();
		const validatedData = workoutCreateSchema.parse(data);

		// Create a new Workout object
		const workout = new Workout({
			user_id: user.userId,
			date: new Date(),
			name: validatedData.name,
			startTime: new Date(validatedData.startTime),
			endTime: validatedData.endTime
				? new Date(validatedData.endTime)
				: undefined,
			duration: validatedData.duration,
			notes: validatedData.notes,
			exercises: validatedData.exercises,
		});

		// Save the workout to the database
		await workout.save();

		// Return the saved workout as a response
		return NextResponse.json(workout, { status: 201 });
	} catch (error) {
		return handleError(error);
	}
}
