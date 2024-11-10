import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET!;

// Generate a JWT token when the user logs in or signs up
export const generateToken = (userId: string) => {
	return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
};

// Verify the JWT token
export const verifyToken = (token: string) => {
	try {
		return jwt.verify(token, jwtSecret);
	} catch (error) {
		return null;
	}
};
