'use client';

import React from 'react';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
	return (
		<div className="bg-destructive mb-2 p-4 text-end">
			<h1 className="text-destructive-foreground">
				Oops, something went wrong!
			</h1>
			<p>
				<strong>Error:</strong> {error.message}
			</p>
			<button
				className="bg-secondary text-secondary-foreground hover:bg-accent mr-2 mt-8 rounded border px-4 py-2 hover:scale-105"
				onClick={() => reset()}
			>
				Try again
			</button>
		</div>
	);
};

export default Error;
