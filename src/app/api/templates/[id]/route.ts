// import { NextRequest, NextResponse } from 'next/server';
// import connectToDatabase from '@/lib/mongoose';
// import Template from '@/models/template';
// import { verifyAuth } from '@/middleware/verify-auth';


// export async function GET(
// 	request: NextRequest,
// 	{ params }: { params: { id: string } }
// ) {
// 	try {
// 		// Verify the user's authentication
// 		const user = verifyAuth(request);
// 		if (!user) {
// 			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
// 		}

// 		// Connect to the database
// 		await connectToDatabase();

// 		// Retrieve the template based on user ID and template ID from URL params
// 		const template = await Template.findOne({
// 			_id: params.id,
// 			user_id: user.userId,
// 		});

// 		// If template doesn't exist, return a 404 response
// 		if (!template) {
// 			return NextResponse.json(
// 				{ message: 'Template not found' },
// 				{ status: 404 }
// 			);
// 		}

// 		// Return the template as JSON
// 		return NextResponse.json(template);
// 	} catch (error) {
// 		console.error('Failed to fetch template:', error);
// 		return NextResponse.json(
// 			{ message: 'Internal Server Error' },
// 			{ status: 500 }
// 		);
// 	}
// }


// export async function PUT(
// 	request: NextRequest,
// 	{ params }: { params: { id: string } }
// ) {
// 	try {
// 		// Verify the user's authentication
// 		const user = verifyAuth(request);
// 		if (!user) {
// 			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
// 		}

// 		// Parse the request body to get the updated template data
// 		const body = await request.json();

// 		// Connect to the database
// 		await connectToDatabase();

// 		// Find and update the template based on user ID and template ID
// 		const template = await Template.findOneAndUpdate(
// 			{ _id: params.id, user_id: user.userId },
// 			body,
// 			{ new: true } // Return the updated template
// 		);

// 		// If the template is not found, return a 404 response
// 		if (!template) {
// 			return NextResponse.json(
// 				{ message: 'Template not found' },
// 				{ status: 404 }
// 			);
// 		}

// 		// Return the updated template as JSON
// 		return NextResponse.json(template);
// 	} catch (error) {
// 		console.error('Failed to update template:', error);
// 		return NextResponse.json(
// 			{ message: 'Internal Server Error' },
// 			{ status: 500 }
// 		);
// 	}
// }


// export async function DELETE(
// 	req: NextRequest,
// 	{ params }: { params: { id: string } }
// ) {
// 	const user = verifyAuth(req);
// 	if (!user) {
// 		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
// 	}

// 	await connectToDatabase();
// 	const template = await Template.findOneAndDelete({
// 		_id: params.id,
// 		user_id: user.userId,
// 	});

// 	if (!template) {
// 		return NextResponse.json(
// 			{ message: 'Template not found' },
// 			{ status: 404 }
// 		);
// 	}

// 	return NextResponse.json({ message: 'Template deleted' });
// }


import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/template';
import { verifyAuth } from '@/middleware/verify-auth';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	// Verify the user's authentication
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Fetch the template based on userId and templateId
	const template = await Template.findOne({
		_id: params.id,
		user_id: user.userId,
	});

	// If template not found, return 404
	if (!template) {
		return NextResponse.json(
			{ message: 'Template not found' },
			{ status: 404 }
		);
	}

	// Return the template data as JSON
	return NextResponse.json(template);
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	// Verify the user's authentication
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Parse the request body for the updated template data
	const data = await req.json();

	// Find the template by ID and update it
	const template = await Template.findOneAndUpdate(
		{ _id: params.id, user_id: user.userId },
		{ $set: data },
		{ new: true } // Return the updated document
	);

	// If template is not found, return 404
	if (!template) {
		return NextResponse.json(
			{ message: 'Template not found' },
			{ status: 404 }
		);
	}

	// Return the updated template data as JSON
	return NextResponse.json(template);
}


export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	// Verify the user's authentication
	const user = verifyAuth(req);
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Connect to the database
	await connectToDatabase();

	// Find and delete the template based on ID and user ID
	const template = await Template.findOneAndDelete({
		_id: params.id,
		user_id: user.userId,
	});

	// If template not found, return 404
	if (!template) {
		return NextResponse.json(
			{ message: 'Template not found' },
			{ status: 404 }
		);
	}

	// Return success message
	return NextResponse.json({ message: 'Template deleted' });
}