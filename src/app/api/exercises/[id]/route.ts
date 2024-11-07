import connectToDatabase from '@/lib/mongoose';
import Exercise from '@/models/exercise';

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	await connectToDatabase();
	await Exercise.findByIdAndDelete(params.id);
	return new Response(null, { status: 204 });
}