'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';

export default function RecentExerciseSearch({}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mostRecentExercise, setMostRecentExercise] = useState(null);

  useEffect(() => {
    const fetchMostRecentExercise = async () => {
      try {
        const { data } = await axios.get(`/api/workouts`, {
          withCredentials: true,
        });
        const filteredExercises = data.flatMap(
          (workout: { exercises: any[] }) =>
            workout.exercises.filter((exercise: { name: string }) =>
              exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        );
        const sortedExercises = filteredExercises.sort(
          (a: { date: string }, b: { date: string }) =>
            Date.parse(b.date) - Date.parse(a.date),
        );
        console.log(sortedExercises); // Add this to check the sorted order
        setMostRecentExercise(
          sortedExercises.length > 0 ? sortedExercises[0] : null,
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
          <p>
            {mostRecentExercise.sets} sets x {mostRecentExercise.reps} reps @
            {mostRecentExercise.weight} lbs ({mostRecentExercise.weightType})
          </p>
          <p>Notes: {mostRecentExercise.notes}</p>
        </div>
      )}
    </div>
  );
}
