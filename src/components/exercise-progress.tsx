'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Line,
	LineChart,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Workout {
	date: string;
	exercises: Array<{
		name: string;
		weight: number;
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
	).sort();

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
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Exercise Progress</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Select onValueChange={setSelectedExercise} value={selectedExercise}>
					<SelectTrigger className="w-full max-w-[300px]">
						<SelectValue placeholder="Select an exercise" />
					</SelectTrigger>
					<SelectContent>
						<ScrollArea className="h-72">
							{exerciseNames.map((name) => (
								<SelectItem key={name} value={name}>
									{name}
								</SelectItem>
							))}
						</ScrollArea>
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
						className="h-[300px] w-full"
					>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={exerciseData}
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
								<XAxis dataKey="date" axisLine={false} tickLine={false} />
								<YAxis axisLine={false} tickLine={false} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									type="monotone"
									dataKey="weight"
									stroke="var(--color-weight)"
									strokeWidth={2}
									dot={{ r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
