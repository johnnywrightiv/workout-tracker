'use client';

import * as React from 'react';
import { Ruler } from 'lucide-react';
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

export function MeasurementSystemSelect() {
	const dispatch = useDispatch();
	const measurementSystem = useSelector(
		(state: RootState) =>
			state.auth.user?.preferences?.measurementSystem || 'metric'
	);

	const handleMeasurementSystemChange = async (newSystem: string) => {
		try {
			const response = await fetch('/api/user/preferences', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ measurementSystem: newSystem }),
			});

			if (response.ok) {
				const data = await response.json();
				dispatch(updateUserPreferences(data.preferences));
			} else {
				console.error('Failed to update measurement system');
			}
		} catch (error) {
			console.error('Error updating measurement system:', error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="default" className="flex items-center gap-2">
					<Ruler className="h-4 w-4" />
					<span>Measurement System</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => handleMeasurementSystemChange('imperial')}
					className="flex items-center"
				>
					Imperial
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleMeasurementSystemChange('metric')}
					className="flex items-center"
				>
					Metric
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
