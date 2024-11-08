import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    notes: String,
    muscleGroup: String,
});

const workoutSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
		ref: 'User',
	},
	name: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	notes: String,
	exercises: [exerciseSchema],
});

const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
export default Workout;