'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkoutFrequency from '@/components/workout-frequency';
import ExerciseProgress from '@/components/exercise-progress';
import MuscleGroupDistribution from '@/components/muscle-group-distribution';
import WorkoutDuration from '@/components/workout-duration';
import Achievements from '@/components/achievements';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { RootState } from '@/store/store';

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

export default function ProgressDashboard() {
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const measurementSystem = useSelector(
		(state: RootState) =>
			state.auth.user?.preferences.measurementSystem || 'metric'
	);

	useEffect(() => {
		const fetchWorkouts = async () => {
			try {
				const response = await fetch('/api/workouts');
				if (!response.ok) {
					throw new Error('Failed to fetch workouts');
				}
				const data = await response.json();
				setWorkouts(data);
			} catch (err) {
				setError('An error occurred while fetching workout data');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchWorkouts();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	const totalWorkouts = workouts.length;
	const avgWorkoutDuration = Math.round(
		workouts.reduce((acc, w) => acc + w.duration, 0) / totalWorkouts
	);
	const mostCommonExercise = getMostCommonExercise(workouts);
	const totalWeightLifted = getTotalWeightLifted(workouts);

	return (
		<Tabs defaultValue="overview" className="space-y-4">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="exercises">Exercises</TabsTrigger>
				<TabsTrigger value="achievements">Achievements</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Workouts
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalWorkouts}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Avg. Workout Duration
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{avgWorkoutDuration} min</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Most Common Exercise
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{mostCommonExercise}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Weight Lifted
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalWeightLifted}{' '}
								{measurementSystem === 'metric' ? 'kg' : 'lbs'}
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Workout Frequency</CardTitle>
						</CardHeader>
						<CardContent className="pl-2">
							<WorkoutFrequency workouts={workouts} />
						</CardContent>
					</Card>
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Muscle Group Distribution</CardTitle>
						</CardHeader>
						<CardContent>
							<MuscleGroupDistribution workouts={workouts} />
						</CardContent>
					</Card>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Workout Duration Trend</CardTitle>
					</CardHeader>
					<CardContent>
						<WorkoutDuration workouts={workouts} />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="exercises">
				<ExerciseProgress
					workouts={workouts}
					measurementSystem={measurementSystem}
				/>
			</TabsContent>
			<TabsContent value="achievements">
				<Achievements
					workouts={workouts}
					measurementSystem={measurementSystem}
				/>
			</TabsContent>
		</Tabs>
	);
}

function getMostCommonExercise(workouts: Workout[]): string {
	const exerciseCounts: { [key: string]: number } = {};
	workouts.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
		});
	});
	return Object.entries(exerciseCounts).reduce((a, b) =>
		a[1] > b[1] ? a : b
	)[0];
}

function getTotalWeightLifted(workouts: Workout[]): number {
	return workouts.reduce((total, workout) => {
		return (
			total +
			workout.exercises.reduce((workoutTotal, exercise) => {
				return workoutTotal + exercise.weight * exercise.sets * exercise.reps;
			}, 0)
		);
	}, 0);
}
