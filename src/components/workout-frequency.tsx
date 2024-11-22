'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

interface Workout {
	_id: string;
	user_id: string;
	name: string;
	date: string;
	startTime: string;
	endTime?: string;
	duration: number;
	notes: string;
	exercises: Array<{
		name: string;
		sets: number;
		reps: number;
		weight: number;
		notes: string;
		muscleGroup: string;
		weightType: string;
		equipmentSettings: string;
		duration: number;
		exerciseType: string;
		speed: number;
		distance: number;
	}>;
}

export default function WorkoutFrequency({
	workouts,
}: {
	workouts: Workout[];
}) {
	const frequencyData = workouts.reduce(
		(acc, workout) => {
			const day = new Date(workout.date).toLocaleDateString('en-US', {
				weekday: 'short',
			});
			acc[day] = (acc[day] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const data = [
		{ name: 'Sun', total: frequencyData['Sun'] || 0 },
		{ name: 'Mon', total: frequencyData['Mon'] || 0 },
		{ name: 'Tue', total: frequencyData['Tue'] || 0 },
		{ name: 'Wed', total: frequencyData['Wed'] || 0 },
		{ name: 'Thu', total: frequencyData['Thu'] || 0 },
		{ name: 'Fri', total: frequencyData['Fri'] || 0 },
		{ name: 'Sat', total: frequencyData['Sat'] || 0 },
	];

	return (
		<ChartContainer
			config={{
				total: {
					label: 'Workouts',
					color: 'hsl(var(--primary))',
				},
			}}
			className="h-[300px]"
		>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<XAxis dataKey="name" />
					<YAxis />
					<ChartTooltip content={<ChartTooltipContent />} />
					<Bar
						dataKey="total"
						fill="var(--color-total)"
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
