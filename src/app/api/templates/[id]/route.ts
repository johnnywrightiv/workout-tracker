import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/template';
import { verifyAuth } from '@/middleware/verify-auth';

type Props = {
	params: {
		id: string;
	};
};

export async function GET(request: NextRequest, props: Props) {
	// Verify the user's authentication
	const user = verifyAuth(request);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Fetch the template based on userId and templateId
	const template = await Template.findOne({
		_id: props.params.id,
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

export async function PUT(request: NextRequest, props: Props) {
	const user = verifyAuth(request);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const data = await request.json();

	// Define the exercise interface
	interface Exercise {
		name: string;
		sets?: number;
		reps?: number;
		weight?: number;
		notes?: string;
		muscleGroup?: string;
		weightType?: string;
		equipmentSettings?: string;
		duration?: number;
		exerciseType?: string;
		speed?: number;
		distance?: number;
	}

	// Prepare the update data with all fields
	const updateData = {
		name: data.name,
		duration: data.duration,
		notes: data.notes,
		exercises: data.exercises.map((exercise: Exercise) => ({
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
		{ _id: props.params.id, user_id: user.userId },
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

export async function DELETE(request: NextRequest, props: Props) {
	// Verify the user's authentication
	const user = verifyAuth(request);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Find and delete the template based on ID and user ID
	const template = await Template.findOneAndDelete({
		_id: props.params.id,
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
