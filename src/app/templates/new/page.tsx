'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

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
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
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
