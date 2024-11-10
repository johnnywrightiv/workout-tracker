'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

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

	const handleSubmit = async (data) => {
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
			<div className="flex items-center justify-center min-h-[200px]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return <WorkoutForm onSubmit={handleSubmit} initialData={initialData} />;
}
