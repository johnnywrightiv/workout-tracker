import * as React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ColorScheme = 'blue' | 'purple';

export function ColorSchemeSelect() {
	const { resolvedTheme: mode } = useTheme();
	const [colorScheme, setColorScheme] = React.useState<ColorScheme>('blue');

	const handleColorSchemeChange = (newScheme: ColorScheme) => {
		setColorScheme(newScheme);
		// Remove any existing color scheme classes
		document.documentElement.classList.remove('theme-blue', 'theme-purple');
		// Add the new color scheme class
		document.documentElement.classList.add(`theme-${newScheme}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					<Palette className="mr-2 h-4 w-4" />
					<span>Color Scheme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => handleColorSchemeChange('blue')}
					className="flex items-center"
				>
					<div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
					Blue
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleColorSchemeChange('purple')}
					className="flex items-center"
				>
					<div className="w-4 h-4 rounded-full bg-purple-500 mr-2" />
					Purple
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
