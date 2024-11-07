'use client';

import { ThemeSelect } from '@/components/theme-selector';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
	const [workouts, setWorkouts] = useState([]);

	useEffect(() => {
		async function fetchWorkouts() {
			try {
				const response = await axios.get('/api/workouts');
				setWorkouts(response.data);
			} catch (error) {
				console.error('Failed to fetch workouts:', error);
			}
		}
		fetchWorkouts();
	}, []);

	return (
		<div className="flex h-full items-center justify-center">
			<h1 className="text-3xl">Home Page - Workout Tracker</h1>
			<ThemeSelect />
			<h2>Past Workouts</h2>
			<ul>
				{workouts.map((workout) => (
					<li key={workout._id}>
						<strong>{new Date(workout.date).toLocaleString()}</strong>
						<p>{workout.notes}</p>
						<p>Duration: {workout.duration} minutes</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
