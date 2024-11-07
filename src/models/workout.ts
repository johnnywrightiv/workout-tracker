import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false,
	},
	date: { type: Date, required: true },
	duration: { type: Number, required: true },
	notes: { type: String, required: false },
});

export default mongoose.models.Workout ||
	mongoose.model('Workout', workoutSchema);
