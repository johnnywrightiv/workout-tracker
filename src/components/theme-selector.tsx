'use client';

import * as React from 'react';
import { Moon, Sun, Settings } from 'lucide-react'; // Import wrench icon
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSelect() {
	const { theme, setTheme } = useTheme(); // Get current theme and setTheme function

	// Determine the current theme to display (light, dark, or system)
	const currentTheme = theme === 'system' ? 'system' : theme;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="default" className="flex items-center">
					{currentTheme === 'system' ? (
						<Settings className="h-4 w-4" />
					) : currentTheme === 'light' ? (
						<Sun className="h-4 w-4" />
					) : (
						<Moon className="h-4 w-4" />
					)}
					Brightness:{' '}
					{currentTheme === 'light'
						? 'Light'
						: currentTheme === 'dark'
							? 'Dark'
							: 'System'}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
