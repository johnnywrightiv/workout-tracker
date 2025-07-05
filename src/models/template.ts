import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
  weight: Number,
  notes: String,
  muscleGroup: String,
  weightType: String,
  equipmentSettings: String,
  duration: Number,
  exerciseType: String,
  speed: Number,
  distance: Number,
});

const templateSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  duration: Number,
  notes: String,
  exercises: [exerciseSchema],
});

const Template =
  mongoose.models.Template || mongoose.model('Template', templateSchema);
export default Template;
