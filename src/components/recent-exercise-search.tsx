'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';

interface Exercise {
	name?: string;
	sets?: number;
	reps?: number;
	weight?: number;
	weightType?: string;
	notes?: string;
}

interface Workout {
	exercises: Exercise[];
	date?: string;
}

export default function RecentExerciseSearch({}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [mostRecentExercise, setMostRecentExercise] = useState<Exercise | null>(
		null
	);

	useEffect(() => {
		const fetchMostRecentExercise = async () => {
			try {
				const { data } = await axios.get<Workout[]>(`/api/workouts`, {
					withCredentials: true,
				});
				const filteredExercises = data.flatMap((workout: Workout) =>
					(workout.exercises || []).filter((exercise: Exercise) =>
						exercise.name?.toLowerCase().includes(searchQuery.toLowerCase())
					)
				);
				const sortedExercises = filteredExercises.sort(() => {
					// We need workout date for sorting, but exercises don't have it
					// So we'll just return 0 for now
					return 0;
				});
				console.log(sortedExercises); // Add this to check the sorted order
				setMostRecentExercise(
					sortedExercises.length > 0 ? sortedExercises[0] : null
				);
			} catch (error) {
				console.error('Failed to fetch exercises:', error);
			}
		};

		searchQuery ? fetchMostRecentExercise() : setMostRecentExercise(null);
	}, [searchQuery]);

	return (
		<div>
			<Input
				type="text"
				placeholder="Search for an Exercise"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="mt-4"
			/>
			{mostRecentExercise && (
				<div className="bg-card mt-4 rounded-lg p-4">
					<h3 className="font-semibold">Most Recent {searchQuery} Exercise:</h3>
					<p>Name: {mostRecentExercise.name}</p>
					{mostRecentExercise.sets &&
						mostRecentExercise.reps &&
						mostRecentExercise.weight && (
							<p>
								{mostRecentExercise.sets} sets x {mostRecentExercise.reps} reps
								@{mostRecentExercise.weight} lbs{' '}
								{mostRecentExercise.weightType &&
									`(${mostRecentExercise.weightType})`}
							</p>
						)}
					{mostRecentExercise.notes && <p>Notes: {mostRecentExercise.notes}</p>}
				</div>
			)}
		</div>
	);
}
