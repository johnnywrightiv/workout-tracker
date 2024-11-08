// app/api/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/template';
import { verifyAuth } from '@/middleware/verify-auth';

// GET - Fetch all templates for a user
export async function GET(req: NextRequest) {
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const templates = await Template.find({ user_id: user.userId });
	return NextResponse.json(templates);
}

// POST - Create new template
export async function POST(req: NextRequest) {
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await connectToDatabase();
	const data = await req.json();

	const template = new Template({
		...data,
		user_id: user.userId,
	});

	await template.save();
	return NextResponse.json(template);
}
