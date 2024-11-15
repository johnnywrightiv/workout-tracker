
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		console.log('Connecting to MongoDB...');
		const db = await mongoose.connect(MONGODB_URI);
		console.log('MongoDB connected:', db.connection.readyState);

		res.status(200).json({ message: 'Connected to MongoDB!' });
	} catch (error) {
		console.error('MongoDB connection failed:', error);
		res.status(500).json({ error: 'Failed to connect to MongoDB' });
	}
}

export default handler;
