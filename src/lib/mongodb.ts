import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
	if (cached.conn) {
		console.log('MongoDB connection reused from cache');
		return cached.conn;
	}

	if (!cached.promise) {
		console.log('Connecting to MongoDB...');
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
			console.log('MongoDB connected');
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (e) {
		cached.promise = null;
		console.error('MongoDB connection failed:', e);
		throw e;
	}
}

export default connectToDatabase;
