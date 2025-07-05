'use client';

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	CartesianGrid,
} from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

interface Workout {
	date: string;
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
					label: 'Workouts per Day',
					color: 'hsl(var(--primary))',
				},
			}}
			className="h-[300px] w-full"
		>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={data}
					margin={{
						top: 10,
						right: 10,
						left: 0,
						bottom: 0,
					}}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						horizontal={true}
						vertical={false}
					/>
					<XAxis dataKey="name" axisLine={false} tickLine={false} />
					<YAxis axisLine={false} tickLine={false} />
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
