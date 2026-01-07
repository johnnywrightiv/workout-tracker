// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

async function connectToDatabase() {
	const start = Date.now();
	try {
		if (!MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined');
		}
		const connection = await mongoose.connect(MONGODB_URI, {
			bufferCommands: false,
			connectTimeoutMS: 30000,
			socketTimeoutMS: 30000,
		});
		const elapsed = Date.now() - start;
		console.log(`MongoDB connected in ${elapsed} ms`);
		return connection;
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw error;
	}
}

export default connectToDatabase;
