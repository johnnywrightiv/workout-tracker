import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Workout from '@/models/workout';
import { verifyAuth } from '@/middleware/verify-auth';

export async function GET(req: NextRequest) {
	const user = verifyAuth(req);

	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();

	const workouts = await Workout.find({ user_id: user.userId }); // Filter by user_id
	return NextResponse.json(workouts, { status: 200 });
}

export async function POST(req: NextRequest) {
	const user = verifyAuth(req);

	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();

	const { duration, notes } = await req.json();

	const workout = new Workout({
		user_id: user.userId, // Assign the userId from the token
		date: new Date(),
		duration,
		notes,
	});

	await workout.save();
	return NextResponse.json(workout, { status: 201 });
}