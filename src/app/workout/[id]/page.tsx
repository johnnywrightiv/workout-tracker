'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';

export default function EditWorkout() {
	const [workout, setWorkout] = useState(null);
	const params = useParams();
	const id = params.id;

	useEffect(() => {
		async function fetchWorkout() {
			if (!id) return;
			const response = await axios.get(`/api/workouts/${id}`, {
				withCredentials: true,
			});
			setWorkout(response.data);
		}
		fetchWorkout();
	}, [id]);

	const handleSubmit = async (data) => {
		await axios.put(`/api/workouts/${id}`, data, {
			withCredentials: true,
		});
	};

	return <WorkoutForm initialData={workout} id={id} onSubmit={handleSubmit} />;
}
