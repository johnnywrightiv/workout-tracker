import * as React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { selectColorScheme, setColorScheme } from '@/store/theme-slice';

export function ColorSchemeSelect() {
	const dispatch = useDispatch();
	const colorScheme = useSelector(selectColorScheme);

	// Set initial color scheme on mount
	React.useEffect(() => {
		document.documentElement.classList.add(`theme-${colorScheme}`);
		return () => {
			document.documentElement.classList.remove(`theme-${colorScheme}`);
		};
	}, [colorScheme]);

	const handleColorSchemeChange = (newScheme: ColorScheme) => {
		dispatch(setColorScheme(newScheme));
		document.documentElement.classList.remove(`theme-${colorScheme}`);
		document.documentElement.classList.add(`theme-${newScheme}`);
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
					<div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
					Blue Theme
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleColorSchemeChange('purple')}
					className="flex items-center"
				>
					<div className="w-4 h-4 rounded-full bg-purple-500 mr-2" />
					Purple Theme
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
