// import { NextApiRequest, NextApiResponse } from 'next';
// import { verifyToken } from '@/lib/auth';

// export const verifyAuth = (req: NextApiRequest, res: NextApiResponse) => {
// 	const token = req.headers['authorization']?.split(' ')[1];

// 	if (!token) return res.status(401).json({ message: 'Unauthorized' });

// 	const decoded = verifyToken(token);

// 	if (!decoded)
// 		return res.status(401).json({ message: 'Invalid or expired token' });

// 	return decoded;
// };

// ===code2 -- typescript errors ====
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAuth(req: NextRequest) {
	const token = req.cookies.get('token');

	if (!token) {
		return null; // No token, unauthorized
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
		};
		return decoded; // Return the decoded user info (userId)
	} catch (error) {
		return null; // Invalid or expired token
	}
}

// // ====code3 -- typescript errors====
// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// export function verifyAuth(req: NextRequest) {
// 	const token = req.cookies.get('token');

// 	if (!token) {
// 		return null; // No token, unauthorized
// 	}

// 	try {
// 		// Cast to 'unknown' first, then assert the type
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown;

// 		// Now assert that 'decoded' has 'userId' property
// 		if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
// 			return decoded as { userId: string }; // Return userId
// 		}

// 		return null; // No userId found or invalid token
// 	} catch (error) {
// 		return null; // Invalid or expired token
// 	}
// }
