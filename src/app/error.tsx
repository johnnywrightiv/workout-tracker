'use client';

import React from 'react';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
	return (
		<div className="mb-2 bg-destructive p-4 text-end">
			<h1 className="text-destructive-foreground">
				Oops, something went wrong!
			</h1>
			<p>
				<strong>Error:</strong> {error.message}
			</p>
			<button
				className="mr-2 mt-8 rounded bg-secondary px-4 py-2 text-secondary-foreground hover:scale-105 hover:bg-accent border"
				onClick={() => reset()}
			>
				Try again
			</button>
		</div>
	);
};

export default Error;
