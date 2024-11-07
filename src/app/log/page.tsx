'use client'

import { useState } from 'react';
import axios from 'axios';

const LogWorkout = () => {
	const [duration, setDuration] = useState(0);
	const [notes, setNotes] = useState('');

	const handleSubmit = async (event: { preventDefault: () => void; }) => {
		event.preventDefault();

		await axios.post('/api/workouts', {
			date: new Date(),
			duration,
			notes,
		});

		alert('Workout logged!');
	};

	return (
		<div>
			<h1>Log a Workout</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Duration (minutes):</label>
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
				<button type="submit">Log Workout</button>
			</form>
		</div>
	);
};

export default LogWorkout;
