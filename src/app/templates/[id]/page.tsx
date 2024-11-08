'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function EditTemplate() {
	const [template, setTemplate] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const params = useParams();
	const id = params.id;

	useEffect(() => {
		async function fetchTemplate() {
			if (!id) return;

			try {
				const response = await axios.get(`/api/templates/${id}`, {
					withCredentials: true,
				});
				setTemplate(response.data);
			} catch (error) {
				console.error('Failed to fetch template:', error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchTemplate();
	}, [id]);

	const handleSubmit = async (data) => {
		try {
			await axios.put(`/api/templates/${id}`, data, {
				withCredentials: true,
			});
		} catch (error) {
			console.error('Failed to update template:', error);
			throw error; // Let the WorkoutForm handle the error
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return template ? (
		<WorkoutForm
			isTemplate
			initialData={template}
			id={id}
			onSubmit={handleSubmit}
		/>
	) : (
		<div>Template not found</div>
	);
}