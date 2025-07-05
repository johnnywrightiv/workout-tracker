'use client';

import * as React from 'react';
import { Palette } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateUserPreferences } from '@/store/auth-slice';
import { RootState } from '@/store/store';

type ColorScheme = 'blue' | 'purple' | 'orange' | 'stone';

export function ColorSchemeSelect() {
	const dispatch = useDispatch();
	const currentScheme = useSelector(
		(state: RootState) => state.auth.user?.preferences?.colorScheme || 'blue'
	);

	const handleColorSchemeChange = async (newScheme: ColorScheme) => {
		try {
			// Store current values for potential rollback
			const previousScheme = currentScheme;

			// Optimistically update local state
			dispatch(updateUserPreferences({ colorScheme: newScheme }));
			localStorage.setItem('colorScheme', newScheme);

			const response = await fetch('/api/user/preferences', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ colorScheme: newScheme }),
			});

			const data = await response.json();

			if (!response.ok) {
				// Revert both Redux and localStorage if the request failed
				dispatch(updateUserPreferences({ colorScheme: previousScheme }));
				localStorage.setItem('colorScheme', previousScheme);
				throw new Error(data.message || 'Failed to update color scheme');
			}
		} catch (error) {
			console.error('Error updating color scheme:', error);
		}
	};

	const colorSchemes: { scheme: ColorScheme; bgClass: string }[] = [
		{ scheme: 'blue', bgClass: 'bg-blue-600' },
		{ scheme: 'purple', bgClass: 'bg-violet-600' },
		{ scheme: 'orange', bgClass: 'bg-orange-600' },
		{ scheme: 'stone', bgClass: 'bg-stone-400' },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="default" className="flex items-center gap-2">
					<Palette className="h-4 w-4" />
					<span>
						Color Scheme:{' '}
						{currentScheme.charAt(0).toUpperCase() + currentScheme.slice(1)}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{colorSchemes.map(({ scheme, bgClass }) => (
					<DropdownMenuItem
						key={scheme}
						onClick={() => handleColorSchemeChange(scheme)}
						className="flex cursor-pointer items-center"
					>
						<div className={`h-4 w-4 rounded-full ${bgClass} mr-2`} />
						{scheme.charAt(0).toUpperCase() + scheme.slice(1)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
