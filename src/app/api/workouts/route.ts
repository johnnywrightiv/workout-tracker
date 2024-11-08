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
    const user = verifyAuth(req);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    const workout = new Workout({
        user_id: user.userId,
        date: new Date(),
        name: data.name,
        duration: data.duration,
        notes: data.notes,
        exercises: data.exercises || [] // Handle exercises data
    });

    await workout.save();
    return NextResponse.json(workout, { status: 201 });
}