import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
	workout_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workout',
		required: true,
	},
	name: { type: String, required: true },
	sets: { type: Number, required: true },
	reps: { type: Number, required: true },
	weight: { type: Number, required: false }, // Optional for bodyweight exercises
});

export default mongoose.models.Exercise ||
	mongoose.model('Exercise', exerciseSchema);
