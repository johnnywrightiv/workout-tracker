import connectToDatabase from '@/lib/mongoose';
import Exercise from '@/models/exercise';

export async function POST(req: Request) {
	await connectToDatabase();
	const { workout_id, name, sets, reps, weight } = await req.json();
	const newExercise = new Exercise({ workout_id, name, sets, reps, weight });
	await newExercise.save();
	return new Response(JSON.stringify(newExercise), { status: 201 });
}
