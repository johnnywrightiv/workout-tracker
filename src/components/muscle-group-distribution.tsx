'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
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

	const data = Object.entries(muscleGroupCounts).map(([name, value]) => ({
		name,
		value,
	}));

	const COLORS = [
		'var(--primary)',
		'var(--secondary)',
		'var(--accent)',
		'var(--muted)',
	];

	return (
		<ChartContainer
			config={{
				value: {
					label: 'Exercises',
					color: 'hsl(var(--primary))',
				},
			}}
			className="h-[300px]"
		>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
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
