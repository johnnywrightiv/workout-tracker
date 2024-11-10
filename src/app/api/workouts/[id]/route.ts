import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Workout from '@/models/workout';
import { verifyAuth } from '@/middleware/verify-auth';

// GET single workout
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const workout = await Workout.findOne({
		_id: params.id,
		user_id: user.userId,
	});

	if (!workout) {
		return NextResponse.json({ message: 'Workout not found' }, { status: 404 });
	}

	return NextResponse.json(workout);
}

// UPDATE a workout by ID
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const data = await req.json();

	// Prepare the update data with all fields
	const updateData = {
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
	};

	const workout = await Workout.findOneAndUpdate(
		{ _id: params.id, user_id: user.userId },
		{ $set: updateData },
		{ new: true }
	);

	if (!workout) {
		return NextResponse.json({ message: 'Workout not found' }, { status: 404 });
	}

	return NextResponse.json(workout);
}

// DELETE - Delete workout
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const workout = await Workout.findOneAndDelete({
		_id: params.id,
		user_id: user.userId,
	});

	if (!workout) {
		return NextResponse.json({ message: 'Workout not found' }, { status: 404 });
	}

	return NextResponse.json({ message: 'Workout deleted' });
}
