import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const response = NextResponse.json(
			{ message: 'Logged out successfully' },
			{ status: 200 }
		);

		// Clear the token cookie
		response.cookies.delete('token');

		return response;
	} catch (error) {
		console.error('Logout error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
