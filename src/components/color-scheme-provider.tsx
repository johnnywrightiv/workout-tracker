'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function ColorSchemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const colorScheme = useSelector(
		(state: RootState) => state.auth.user?.preferences?.colorScheme || 'blue'
	);

	useEffect(() => {
		// Check local storage first
		const storedScheme = localStorage.getItem('colorScheme');
		if (storedScheme) {
			document.documentElement.classList.add(`theme-${storedScheme}`);
		} else {
			document.documentElement.classList.add(`theme-${colorScheme}`);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (!isLoading) {
			document.documentElement.classList.remove('theme-blue', 'theme-purple', 'theme-orange', 'theme-stone');
			document.documentElement.classList.add(`theme-${colorScheme}`);
			localStorage.setItem('colorScheme', colorScheme);
		}
	}, [colorScheme, isLoading]);

	if (isLoading) {
		return null;
	}

	return <>{children}</>;
}
