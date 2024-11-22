'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface Workout {
	date: string;
	exercises: Array<{
		name: string;
		weight: number;
		// ... other properties
	}>;
}

interface ExerciseProgressProps {
	workouts: Workout[];
	measurementSystem: 'metric' | 'imperial';
}

export default function ExerciseProgress({
	workouts,
	measurementSystem,
}: ExerciseProgressProps) {
	const [selectedExercise, setSelectedExercise] = useState<string>('');

	const exerciseNames = Array.from(
		new Set(workouts.flatMap((w) => w.exercises.map((e) => e.name)))
	);

	const exerciseData = workouts
		.filter((workout) =>
			workout.exercises.some((e) => e.name === selectedExercise)
		)
		.map((workout) => {
			const exercise = workout.exercises.find(
				(e) => e.name === selectedExercise
			);
			return {
				date: new Date(workout.date).toLocaleDateString(),
				weight: exercise ? exercise.weight : 0,
			};
		})
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return (
		<Card>
			<CardHeader>
				<CardTitle>Exercise Progress</CardTitle>
			</CardHeader>
			<CardContent>
				<Select onValueChange={setSelectedExercise} value={selectedExercise}>
					<SelectTrigger className="w-[180px] mb-4">
						<SelectValue placeholder="Select an exercise" />
					</SelectTrigger>
					<SelectContent>
						{exerciseNames.map((name) => (
							<SelectItem key={name} value={name}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{selectedExercise && (
					<ChartContainer
						config={{
							weight: {
								label: `Weight (${measurementSystem === 'metric' ? 'kg' : 'lbs'})`,
								color: 'hsl(var(--primary))',
							},
						}}
						className="h-[300px]"
					>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={exerciseData}>
								<XAxis dataKey="date" />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									type="monotone"
									dataKey="weight"
									stroke="var(--color-weight)"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
