'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import WorkoutForm from '@/components/workout-form';
import { Loader2 } from 'lucide-react';
import RecentExerciseSearch from '@/components/recent-exercise-search';

export default function EditWorkout() {
  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchWorkout = async () => {
      try {
        const { data } = await axios.get(`/api/workouts/${id}`, {
          withCredentials: true,
        });
        setWorkout(data);
      } catch (error) {
        console.error('Failed to fetch workout:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  const handleSubmit = async (data) => {
    await axios.put(`/api/workouts/${id}`, data, { withCredentials: true });
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-16 w-16 animate-spin" />
      </div>
    );
  }

  return workout ? (
    <div className="container mx-auto px-4 py-6">
      <RecentExerciseSearch />
      <WorkoutForm initialData={workout} id={id} onSubmit={handleSubmit} />
    </div>
  ) : (
    <div className="text-center">Workout not found</div>
  );
}
