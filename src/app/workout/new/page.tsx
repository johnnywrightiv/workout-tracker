'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CreateWorkout() {
	const [duration, setDuration] = useState(0);
	const [notes, setNotes] = useState('');
	const [exercises, setExercises] = useState([
		{ name: '', sets: '', reps: '', weight: '', notes: '' },
	]);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleExerciseChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const updatedExercises = [...exercises];
		updatedExercises[index][e.target.name] = e.target.value;
		setExercises(updatedExercises);
	};

	const handleAddExercise = () => {
		setExercises([
			...exercises,
			{ name: '', sets: '', reps: '', weight: '', notes: '' },
		]);
	};

	const handleRemoveExercise = (index: number) => {
		const updatedExercises = exercises.filter((_, i) => i !== index);
		setExercises(updatedExercises);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await axios.post(
				'/api/workouts',
				{
					duration,
					notes,
					exercises, // Include exercises in the POST data
				},
				{
					withCredentials: true,
				}
			);
			toast({
				title: 'Workout created',
				description: 'Your new workout has been successfully added.',
			});
			router.push('/'); // Navigate back to workouts list
		} catch (error) {
			console.error('Failed to create workout:', error);
			toast({
				title: 'Error',
				description: 'Failed to create workout. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto py-6">
			{/* Update max-w-md to a larger value like max-w-xl or w-full */}
			<Card className="max-w-xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Create New Workout
					</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
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
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								'Create Workout'
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
