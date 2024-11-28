'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

interface Workout {
	exercises: Array<{
		muscleGroup: string;
	}>;
}

export default function MuscleGroupDistribution({
	workouts,
}: {
	workouts: Workout[];
}) {
	const muscleGroupCounts: Record<string, number> = {};
	workouts.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			if (exercise.muscleGroup) {
				muscleGroupCounts[exercise.muscleGroup] =
					(muscleGroupCounts[exercise.muscleGroup] || 0) + 1;
			}
		});
	});

	const data = Object.entries(muscleGroupCounts)
		.map(([name, value]) => ({ name, value }))
		.sort((a, b) => b.value - a.value);

	const COLORS = [
		'#3498db', // Bright Blue
		'#2ecc71', // Emerald Green
		'#e74c3c', // Vibrant Red
		'#f39c12', // Warm Orange
		'#9b59b6', // Purple
		'#1abc9c', // Turquoise
		'#34495e', // Dark Blue-Gray
	];

	return (
		<ChartContainer
			config={{
				value: {
					label: 'Exercises by Muscle Group',
					color: 'hsl(var(--primary))',
				},
			}}
			className="h-[300px] w-full"
		>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						outerRadius="80%"
						paddingAngle={3}
						dataKey="value"
						label={({ name, percent }) =>
							`${name} (${(percent * 100).toFixed(0)}%)`
						}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<ChartTooltip content={<ChartTooltipContent />} />
				</PieChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
