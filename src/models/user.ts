import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password_hash: { type: String, required: true },
	name: { type: String, required: false },
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string) {
	return bcrypt.compare(password, this.password_hash);
};

export default mongoose.models.User || mongoose.model('User', userSchema);