import connectToDatabase from '@/lib/mongoose';
import Workout from '@/models/workout';

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } }
) {
	await connectToDatabase();
	const { duration, notes } = await req.json();

	const workout = await Workout.findById(params.id);
	if (!workout) {
		return new Response(JSON.stringify({ message: 'Workout not found' }), {
			status: 404,
		});
	}

	workout.duration = duration || workout.duration;
	workout.notes = notes || workout.notes;
	await workout.save();
	return new Response(JSON.stringify(workout), { status: 200 });
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	await connectToDatabase();
	await Workout.findByIdAndDelete(params.id);
	return new Response(null, { status: 204 });
}
