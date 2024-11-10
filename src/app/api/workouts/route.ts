import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Workout from '@/models/workout';
import { verifyAuth } from '@/middleware/verify-auth';

// GET - Fetch all workouts for user
export async function GET(req: NextRequest) {
    const user = verifyAuth(req);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const workouts = await Workout.find({ user_id: user.userId });
    return NextResponse.json(workouts, { status: 200 });
}

// POST - Create new workout
export async function POST(req: NextRequest) {
	// Verify user authentication
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Parse incoming JSON data
	const data = await req.json();

	// Create a new Workout object
	const workout = new Workout({
		user_id: user.userId,
		date: new Date(),
		name: data.name,
		startTime: new Date(data.startTime),
		endTime: data.endTime ? new Date(data.endTime) : undefined,
		duration: data.duration,
		notes: data.notes,
		exercises: data.exercises.map((exercise: any) => ({
			name: exercise.name,
			sets: exercise.sets,
			reps: exercise.reps,
			weight: exercise.weight,
			notes: exercise.notes,
			muscleGroup: exercise.muscleGroup,
			weightType: exercise.weightType,
			equipmentSettings: exercise.equipmentSettings,
			duration: exercise.duration,
			exerciseType: exercise.exerciseType,
			speed: exercise.speed,
			distance: exercise.distance,
		})),
	});

	// Save the workout to the database
	try {
		await workout.save();
	} catch (error) {
		return NextResponse.json(
			{ message: 'Error saving workout' },
			{ status: 500 }
		);
	}

	// Return the saved workout as a response
	return NextResponse.json(workout, { status: 201 });
}
