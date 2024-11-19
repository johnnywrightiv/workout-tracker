'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function EditWorkout() {
	const [workout, setWorkout] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const params = useParams();
	const id = params.id;

	useEffect(() => {
		async function fetchWorkout() {
			if (!id) return;
			try {
				const response = await axios.get(`/api/workouts/${id}`, {
					withCredentials: true,
				});
				setWorkout(response.data);
			} catch (error) {
				console.error('Failed to fetch workout:', error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchWorkout();
	}, [id]);

	const handleSubmit = async (data) => {
		await axios.put(`/api/workouts/${id}`, data, {
			withCredentials: true,
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex items-center justify-center h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-solid border-primary border-t-accent" />
			</div>
		);
	}

	return workout ? (
		<WorkoutForm initialData={workout} id={id} onSubmit={handleSubmit} />
	) : (
		<div>Workout not found</div>
	);
}
