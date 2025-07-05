'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';

export default function NewTemplate() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const workoutId = searchParams.get('workoutId');

	const [initialData, setInitialData] = useState(null);
	const [isLoading, setIsLoading] = useState(!!workoutId);

	useEffect(() => {
		if (workoutId) {
			async function fetchWorkout() {
				try {
					const response = await axios.get(`/api/workouts/${workoutId}`, {
						withCredentials: true,
					});
					setInitialData(response.data);
				} catch (error) {
					console.error('Failed to fetch workout:', error);
				} finally {
					setIsLoading(false);
				}
			}
			fetchWorkout();
		}
	}, [workoutId]);

	const handleSubmit = async (data) => {
		try {
			await axios.post('/api/templates', data, { withCredentials: true });
			router.push('/templates');
		} catch (error) {
			console.error('Failed to create template:', error);
			throw error; // This will be caught by the WorkoutForm error handling
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="border-primary border-t-accent flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-t-4 border-solid" />
			</div>
		);
	}

	return (
		<WorkoutForm
			initialData={initialData}
			isTemplate={true}
			onSubmit={handleSubmit}
		/>
	);
}
