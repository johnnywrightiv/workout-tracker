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

export function ColorSchemeSelect() {
	const dispatch = useDispatch();
	const colorScheme = useSelector(
		(state: RootState) => state.auth.user?.preferences?.colorScheme || 'blue'
	);

	const handleColorSchemeChange = async (newScheme: string) => {
		try {
			localStorage.setItem('colorScheme', newScheme);
			dispatch(updateUserPreferences({ colorScheme: newScheme }));

			const response = await fetch('/api/user/preferences', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ colorScheme: newScheme }),
			});

			if (!response.ok) {
				console.error('Failed to update color scheme on server');
				// Optionally, revert the local change if the server update fails
			}
		} catch (error) {
			console.error('Error updating color scheme:', error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="default" className="flex items-center gap-2">
					<Palette className="h-4 w-4" />
					<span>Color Scheme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => handleColorSchemeChange('blue')}
					className="flex items-center"
				>
					<div className="w-4 h-4 rounded-full bg-blue-600 mr-2" />
					Blue
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleColorSchemeChange('purple')}
					className="flex items-center"
				>
					<div className="w-4 h-4 rounded-full bg-violet-600 mr-2" />
					Purple
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleColorSchemeChange('orange')}
					className="flex items-center"
				>
					<div className="w-4 h-4 rounded-full bg-orange-600 mr-2" />
					Orange
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleColorSchemeChange('stone')}
					className="flex items-center"
				>
					<div className="w-4 h-4 rounded-full bg-stone-400 mr-2" />
					Stone
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
