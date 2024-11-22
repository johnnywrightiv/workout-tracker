'use client';

import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface Workout {
	date: string;
	exercises: Array<{
		name: string;
		weight: number;
		reps: number;
		// ... other properties
	}>;
}

interface Achievement {
	title: string;
	description: string;
	date: string;
}

interface AchievementsProps {
	workouts: Workout[];
	measurementSystem: 'metric' | 'imperial';
}

export default function Achievements({
	workouts,
	measurementSystem,
}: AchievementsProps) {
	const achievements: Achievement[] = calculateAchievements(
		workouts,
		measurementSystem
	);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{achievements.map((achievement, index) => (
				<Card key={index}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{achievement.title}
						</CardTitle>
						<Trophy className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<CardDescription>{achievement.description}</CardDescription>
						<Badge className="mt-2">{achievement.date}</Badge>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function calculateAchievements(
	workouts: Workout[],
	measurementSystem: 'metric' | 'imperial'
): Achievement[] {
	const achievements: Achievement[] = [];

	// Total workouts milestone
	const totalWorkouts = workouts.length;
	if (totalWorkouts >= 10) {
		achievements.push({
			title: `${totalWorkouts} Workouts Completed`,
			description: `You've completed ${totalWorkouts} workouts!`,
			date: new Date(workouts[workouts.length - 1].date).toLocaleDateString(),
		});
	}

	// Personal bests
	const personalBests: Record<
		string,
		{ weight: number; reps: number; date: string }
	> = {};
	workouts.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			if (
				!personalBests[exercise.name] ||
				exercise.weight > personalBests[exercise.name].weight
			) {
				personalBests[exercise.name] = {
					weight: exercise.weight,
					reps: exercise.reps,
					date: workout.date,
				};
			}
		});
	});

	Object.entries(personalBests).forEach(([name, pb]) => {
		achievements.push({
			title: `Personal Best: ${name}`,
			description: `New personal best: ${pb.weight}${measurementSystem === 'metric' ? 'kg' : 'lbs'} for ${pb.reps} reps`,
			date: new Date(pb.date).toLocaleDateString(),
		});
	});

	// Consistency achievement
	const sortedWorkouts = workouts.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);
	let consistentWeeks = 0;
	for (let i = 0; i < sortedWorkouts.length - 2; i++) {
		const week1 = new Date(sortedWorkouts[i].date).getTime();
		const week2 = new Date(sortedWorkouts[i + 1].date).getTime();
		const week3 = new Date(sortedWorkouts[i + 2].date).getTime();
		if (
			week2 - week1 <= 7 * 24 * 60 * 60 * 1000 &&
			week3 - week2 <= 7 * 24 * 60 * 60 * 1000
		) {
			consistentWeeks++;
		}
	}

	if (consistentWeeks >= 4) {
		achievements.push({
			title: 'Consistent Athlete',
			description: `Worked out consistently for ${consistentWeeks} weeks`,
			date: new Date(
				sortedWorkouts[sortedWorkouts.length - 1].date
			).toLocaleDateString(),
		});
	}

	return achievements;
}
