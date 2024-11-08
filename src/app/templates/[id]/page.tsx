'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';

export default function EditTemplate() {
	const [template, setTemplate] = useState(null);
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
			alert('Failed to update template. Please try again.');
		}
	};

	if (!template) return <div>Loading...</div>;

	return (
    <WorkoutForm
      isTemplate
			initialData={template}
			id={id} 
			onSubmit={handleSubmit}
		/>
	);
}
