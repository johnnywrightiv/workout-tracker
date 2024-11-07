'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Exercise {
	name: string;
	sets: number;
	reps: number;
	weight: number;
	notes: string;
}

interface Workout {
	_id: string;
	duration: number;
	notes: string;
	exercises: Exercise[];
}

const EditWorkout = () => {
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [duration, setDuration] = useState(0);
	const [notes, setNotes] = useState('');
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const router = useRouter();
	const params = useParams();
	const id = params.id;
	const { toast } = useToast();

	useEffect(() => {
		async function fetchWorkout() {
			if (!id) return;

			try {
				setLoading(true);
				const response = await axios.get(`/api/workouts/${id}`, {
					withCredentials: true,
				});
				const workoutData = response.data;
				setWorkout(workoutData);
				setDuration(workoutData.duration);
				setNotes(workoutData.notes);
				setExercises(workoutData.exercises || []);
			} catch (err) {
				console.error('Failed to fetch workout:', err);
				setError('Failed to load workout');
			} finally {
				setLoading(false);
			}
		}

		fetchWorkout();
	}, [id]);

	const handleExerciseChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const updatedExercises = [...exercises];
		updatedExercises[index][e.target.name] = e.target.value;
		setExercises(updatedExercises);
	};

	const handleAddExercise = () => {
		setExercises([
			...exercises,
			{ name: '', sets: 0, reps: 0, weight: 0, notes: '' },
		]);
	};

	const handleRemoveExercise = (index: number) => {
		const updatedExercises = exercises.filter((_, i) => i !== index);
		setExercises(updatedExercises);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const updatedWorkout = {
				duration,
				notes,
				exercises, // Include exercises in the update request
			};

			await axios.put(`/api/workouts/${id}`, updatedWorkout, {
				withCredentials: true,
			});

			toast({
				title: 'Workout updated',
				description: 'Your workout has been successfully updated.',
			});
			router.push('/');
			router.refresh(); // Force a refresh of the server components
		} catch (err) {
			console.error('Failed to update workout:', err);
			setError('Failed to update workout');
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!workout) return <div>Workout not found</div>;

	return (
		<div className="container mx-auto py-6">
			{/* Update max-w-md to a larger value like max-w-xl */}
			<Card className="max-w-xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Edit Workout</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{/* Duration Input */}
						<div className="space-y-2">
							<label
								htmlFor="duration"
								className="text-sm font-medium leading-none"
							>
								Duration (minutes):
							</label>
							<Input
								id="duration"
								type="number"
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								min="0"
								required
							/>
						</div>

						{/* Notes Input */}
						<div className="space-y-2">
							<label
								htmlFor="notes"
								className="text-sm font-medium leading-none"
							>
								Notes:
							</label>
							<Textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="min-h-[100px]"
							/>
						</div>

						{/* Exercise Inputs */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Exercises</h3>
							{exercises.map((exercise, index) => (
								<div key={index} className="space-y-2">
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
										{/* Exercise Name Input */}
										<div className="flex flex-col">
											<label
												htmlFor={`name-${index}`}
												className="text-sm font-medium"
											>
												Exercise:
											</label>
											<Input
												id={`name-${index}`}
												name="name"
												value={exercise.name}
												onChange={(e) => handleExerciseChange(index, e)}
												placeholder="Exercise"
												required
											/>
										</div>

										{/* Sets Input */}
										<div className="flex flex-col">
											<label
												htmlFor={`sets-${index}`}
												className="text-sm font-medium"
											>
												Sets:
											</label>
											<Input
												id={`sets-${index}`}
												name="sets"
												value={exercise.sets}
												onChange={(e) => handleExerciseChange(index, e)}
												placeholder="Sets"
												required
											/>
										</div>

										{/* Reps Input */}
										<div className="flex flex-col">
											<label
												htmlFor={`reps-${index}`}
												className="text-sm font-medium"
											>
												Reps:
											</label>
											<Input
												id={`reps-${index}`}
												name="reps"
												value={exercise.reps}
												onChange={(e) => handleExerciseChange(index, e)}
												placeholder="Reps"
												required
											/>
										</div>

										{/* Weight Input */}
										<div className="flex flex-col">
											<label
												htmlFor={`weight-${index}`}
												className="text-sm font-medium"
											>
												Weight (lbs):
											</label>
											<Input
												id={`weight-${index}`}
												name="weight"
												value={exercise.weight}
												onChange={(e) => handleExerciseChange(index, e)}
												placeholder="Weight"
											/>
										</div>

										{/* Remove Exercise Button */}
										<div className="flex items-end justify-center">
											<Button
												type="button"
												variant="destructive"
												onClick={() => handleRemoveExercise(index)}
											>
												Remove
											</Button>
										</div>
									</div>

									<Textarea
										name="notes"
										value={exercise.notes}
										onChange={(e) => handleExerciseChange(index, e)}
										placeholder="Exercise Notes"
										className="min-h-[60px]"
									/>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={handleAddExercise}
							>
								Add Exercise
							</Button>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Updating...
								</>
							) : (
								'Save Changes'
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default EditWorkout;
