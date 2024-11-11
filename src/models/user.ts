import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password_hash: { type: String, required: true },
	name: { type: String, required: false },
	preferences: {
		colorScheme: { type: String, default: 'blue' },
		measurementSystem: { type: String, default: 'metric' },
	},
});

userSchema.methods.comparePassword = async function (password: string) {
	return bcrypt.compare(password, this.password_hash);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
