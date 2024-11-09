import React from 'react';

const Loading = () => {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="flex items-center justify-center h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-solid border-primary border-t-accent"></div>
		</div>
	);
};

export default Loading;
