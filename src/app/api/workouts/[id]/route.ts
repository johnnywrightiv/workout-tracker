// src / app / api / workouts / [id] / route.ts;
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

// PUT - Update workout
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

	const workout = await Workout.findOneAndUpdate(
		{ _id: params.id, user_id: user.userId },
		{ $set: data },
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
