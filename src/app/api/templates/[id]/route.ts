import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/template';
import { verifyAuth } from '@/middleware/verify-auth';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	// Verify the user's authentication
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Fetch the template based on userId and templateId
	const template = await Template.findOne({
		_id: params.id,
		user_id: user.userId,
	});

	// If template not found, return 404
	if (!template) {
		return NextResponse.json(
			{ message: 'Template not found' },
			{ status: 404 }
		);
	}

	// Return the template data as JSON
	return NextResponse.json(template);
}

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

	const template = await Template.findOneAndUpdate(
		{ _id: params.id, user_id: user.userId },
		{ $set: updateData },
		{ new: true }
	);

	if (!template) {
		return NextResponse.json(
			{ message: 'Template not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(template);
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	// Verify the user's authentication
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Find and delete the template based on ID and user ID
	const template = await Template.findOneAndDelete({
		_id: params.id,
		user_id: user.userId,
	});

	// If template not found, return 404
	if (!template) {
		return NextResponse.json(
			{ message: 'Template not found' },
			{ status: 404 }
		);
	}

	// Return success message
	return NextResponse.json({ message: 'Template deleted' });
}