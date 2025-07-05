import mongoose from 'mongoose';

const connectToDatabase = async () => {
	if (mongoose.connection.readyState >= 1) return;

	try {
		await mongoose.connect(process.env.MONGODB_URI!);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	}
};

export default connectToDatabase;
