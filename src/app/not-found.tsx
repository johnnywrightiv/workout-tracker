import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
	return (
		<div className="flex h-full items-center justify-center">
			<div>
				<h1>404 Page Not Found</h1>
				<nav className="mb-8 mt-4 flex justify-center">
					<Button variant="outline" asChild>
						<Link href="/">Back to Home</Link>
					</Button>
				</nav>
			</div>
		</div>
	);
};

export default NotFound;
