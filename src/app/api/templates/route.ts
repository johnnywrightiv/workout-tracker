import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/template';
import { verifyAuth } from '@/middleware/verify-auth';

export async function GET(req: NextRequest) {
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const templates = await Template.find({ user_id: user.userId });
	return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const data = await req.json();

	const template = new Template({
		user_id: user.userId,
		name: data.name,
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

	await template.save();
	return NextResponse.json(template);
}
