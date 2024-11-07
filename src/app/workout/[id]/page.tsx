'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditWorkout = () => {
	const [workout, setWorkout] = useState(null);
	const [duration, setDuration] = useState(0);
	const [notes, setNotes] = useState('');
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			axios.get(`/api/workouts/${id}`).then((response) => {
				setWorkout(response.data);
				setDuration(response.data.duration);
				setNotes(response.data.notes);
			});
		}
	}, [id]);

	const handleSubmit = async (e: { preventDefault: () => void; }) => {
		e.preventDefault();
		await axios.put(`/api/workouts/${id}`, { duration, notes });
		router.push('/');
	};

	if (!workout) return <div>Loading...</div>;

	return (
		<div>
			<h1>Edit Workout</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Duration:</label>
					<input
						type="number"
						value={duration}
						onChange={(e) => setDuration(Number(e.target.value))}
					/>
				</div>
				<div>
					<label>Notes:</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					></textarea>
				</div>
				<button type="submit">Save</button>
			</form>
		</div>
	);
};

export default EditWorkout;
