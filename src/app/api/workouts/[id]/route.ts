import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Workout from '@/models/workout';
import { verifyAuth } from '@/middleware/verify-auth';
import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

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

const workoutUpdateSchema = z.object({
  name: z.string().min(1).max(100),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
  exercises: z.array(exerciseSchema),
});

// Validate MongoDB ObjectId
function validateObjectId(id: string): boolean {
  return isValidObjectId(id);
}

// Error handler function
function handleError(error: any) {
  console.error('Error:', error);
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { message: 'Validation error', errors: error.errors },
      { status: 400 },
    );
  }
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 },
  );
}

// GET single workout
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Validate authentication
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Validate ID format
    if (!validateObjectId(params.id)) {
      return NextResponse.json(
        { message: 'Invalid workout ID' },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const workout = await Workout.findOne({
      _id: params.id,
      user_id: user.userId,
    }).lean();

    if (!workout) {
      return NextResponse.json(
        { message: 'Workout not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    return handleError(error);
  }
}

// UPDATE a workout by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Validate authentication
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Validate ID format
    if (!validateObjectId(params.id)) {
      return NextResponse.json(
        { message: 'Invalid workout ID' },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const data = await req.json();

    // Validate input data
    const validatedData = workoutUpdateSchema.parse(data);

    // Prepare the update data
    const updateData = {
      name: validatedData.name,
      startTime: new Date(validatedData.startTime),
      endTime: validatedData.endTime
        ? new Date(validatedData.endTime)
        : undefined,
      duration: validatedData.duration,
      notes: validatedData.notes,
      exercises: validatedData.exercises,
    };

    const workout = await Workout.findOneAndUpdate(
      { _id: params.id, user_id: user.userId },
      { $set: updateData },
      { new: true, runValidators: true },
    ).lean();

    if (!workout) {
      return NextResponse.json(
        { message: 'Workout not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete workout
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Validate authentication
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Validate ID format
    if (!validateObjectId(params.id)) {
      return NextResponse.json(
        { message: 'Invalid workout ID' },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const workout = await Workout.findOneAndDelete({
      _id: params.id,
      user_id: user.userId,
    }).lean();

    if (!workout) {
      return NextResponse.json(
        { message: 'Workout not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Workout deleted' });
  } catch (error) {
    return handleError(error);
  }
}
