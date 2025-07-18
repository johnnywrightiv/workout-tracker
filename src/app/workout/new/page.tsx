'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import RecentExerciseSearch from '@/components/recent-exercise-search';
import axios from 'axios';

export default function CreateWorkout() {
	const searchParams = useSearchParams();
	const templateId = searchParams.get('template');
	const [initialData, setInitialData] = useState(null);
	const [loading, setLoading] = useState(!!templateId);

	useEffect(() => {
		const loadTemplateData = async () => {
			if (templateId) {
				try {
					const response = await axios.get(`/api/templates/${templateId}`, {
						withCredentials: true,
					});
					// Remove template-specific fields if any
					// eslint-disable-next-line no-unused-vars
					const { _id, createdAt, updatedAt, userId, ...templateData } =
						response.data;
					setInitialData(templateData);
				} catch (error) {
					console.error('Failed to load template:', error);
				} finally {
					setLoading(false);
				}
			}
		};

		loadTemplateData();
	}, [templateId]);

	const handleSubmit = async (data: any) => {
		await axios.post(
			'/api/workouts',
			{
				...data,
				date: new Date(),
			},
			{
				withCredentials: true,
			}
		);
	};

	if (loading) {
		return (
			<div className="flex min-h-[200px] items-center justify-center">
				<div className="border-primary border-t-accent flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-t-4 border-solid" />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<RecentExerciseSearch />
			<WorkoutForm onSubmit={handleSubmit} initialData={initialData} />
		</div>
	);
}
