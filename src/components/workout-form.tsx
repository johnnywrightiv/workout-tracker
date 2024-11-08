import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const MUSCLE_GROUPS = [
	'Chest',
	'Back',
	'Shoulders',
	'Biceps',
	'Triceps',
	'Core/Abs',
	'Glutes',
	'Quads',
	'Hamstrings',
	'Calves',
	'Misc',
] as const;

interface Exercise {
	name: string;
	sets: number;
	reps: number;
	weight: number;
	notes: string;
	muscleGroup: string;
}

interface FormData {
	name: string;
	duration: number;
	notes: string;
	exercises: Exercise[];
}

interface WorkoutFormProps {
	initialData?: FormData;
	isTemplate?: boolean;
	id?: string;
	onSubmit: (data: FormData) => Promise<void>;
}

export default function WorkoutForm({
	initialData,
	isTemplate = false,
	id,
	onSubmit,
}: WorkoutFormProps) {
	const [formData, setFormData] = useState<FormData>(
		initialData || {
			name: '',
			duration: 0,
			notes: '',
			exercises: [
				{ name: '', sets: 0, reps: 0, weight: 0, notes: '', muscleGroup: '' },
			],
		}
	);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleExerciseChange = (
		index: number,
		field: keyof Exercise,
		value: string | number
	) => {
		const updatedExercises = [...formData.exercises];
		updatedExercises[index] = {
			...updatedExercises[index],
			[field]: value,
		};
		setFormData({ ...formData, exercises: updatedExercises });
	};

	const handleAddExercise = () => {
		setFormData({
			...formData,
			exercises: [
				...formData.exercises,
				{ name: '', sets: 0, reps: 0, weight: 0, notes: '', muscleGroup: '' },
			],
		});
	};

	const handleRemoveExercise = (index: number) => {
		setFormData({
			...formData,
			exercises: formData.exercises.filter((_, i) => i !== index),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await onSubmit(formData);
			toast({
				title: `${isTemplate ? 'Template' : 'Workout'} ${
					id ? 'updated' : 'created'
				}`,
				description: `Your ${
					isTemplate ? 'template' : 'workout'
				} has been successfully ${id ? 'updated' : 'added'}.`,
			});
			router.push(isTemplate ? '/templates' : '/');
		} catch (error) {
			console.error(
				`Failed to ${id ? 'update' : 'create'} ${
					isTemplate ? 'template' : 'workout'
				}:`,
				error
			);
			toast({
				title: 'Error',
				description: `Failed to ${id ? 'update' : 'create'} ${
					isTemplate ? 'template' : 'workout'
				}. Please try again.`,
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container max-w-2xl mx-auto px-4 py-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl md:text-2xl font-bold">
						{id ? 'Edit' : 'Create'} {isTemplate ? 'Template' : 'Workout'}
					</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{/* Name Input */}
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Name:
							</label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>

						{/* Duration Input */}
						<div className="space-y-2">
							<label htmlFor="duration" className="text-sm font-medium">
								Duration (minutes):
							</label>
							<Input
								id="duration"
								type="number"
								value={formData.duration}
								onChange={(e) =>
									setFormData({ ...formData, duration: Number(e.target.value) })
								}
								min="0"
								required
							/>
						</div>

						{/* Notes Input */}
						<div className="space-y-2">
							<label htmlFor="notes" className="text-sm font-medium">
								Notes:
							</label>
							<Textarea
								id="notes"
								value={formData.notes}
								onChange={(e) =>
									setFormData({ ...formData, notes: e.target.value })
								}
								className="min-h-[100px]"
							/>
						</div>

						{/* Exercises Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Exercises</h3>
							{formData.exercises.map((exercise, index) => (
								<div
									key={index}
									className="space-y-4 p-4 bg-secondary/10 rounded-lg"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Exercise Name and Muscle Group */}
										<div className="space-y-2">
											<label
												htmlFor={`name-${index}`}
												className="text-sm font-medium"
											>
												Exercise:
											</label>
											<Input
												id={`name-${index}`}
												value={exercise.name}
												onChange={(e) =>
													handleExerciseChange(index, 'name', e.target.value)
												}
												placeholder="Exercise name"
												required
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor={`muscleGroup-${index}`}
												className="text-sm font-medium"
											>
												Muscle Group:
											</label>
											<Select
												value={exercise.muscleGroup}
												onValueChange={(value) =>
													handleExerciseChange(index, 'muscleGroup', value)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select muscle group" />
												</SelectTrigger>
												<SelectContent>
													{MUSCLE_GROUPS.map((group) => (
														<SelectItem key={group} value={group}>
															{group}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* Sets, Reps, Weight */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<label
												htmlFor={`sets-${index}`}
												className="text-sm font-medium"
											>
												Sets:
											</label>
											<Input
												id={`sets-${index}`}
												type="number"
												value={exercise.sets}
												onChange={(e) =>
													handleExerciseChange(
														index,
														'sets',
														Number(e.target.value)
													)
												}
												min="0"
												required
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor={`reps-${index}`}
												className="text-sm font-medium"
											>
												Reps:
											</label>
											<Input
												id={`reps-${index}`}
												type="number"
												value={exercise.reps}
												onChange={(e) =>
													handleExerciseChange(
														index,
														'reps',
														Number(e.target.value)
													)
												}
												min="0"
												required
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor={`weight-${index}`}
												className="text-sm font-medium"
											>
												Weight (lbs):
											</label>
											<Input
												id={`weight-${index}`}
												type="number"
												value={exercise.weight}
												onChange={(e) =>
													handleExerciseChange(
														index,
														'weight',
														Number(e.target.value)
													)
												}
												min="0"
											/>
										</div>
									</div>

									{/* Exercise Notes */}
									<div className="space-y-2">
										<label
											htmlFor={`notes-${index}`}
											className="text-sm font-medium"
										>
											Exercise Notes:
										</label>
										<Textarea
											id={`notes-${index}`}
											value={exercise.notes}
											onChange={(e) =>
												handleExerciseChange(index, 'notes', e.target.value)
											}
											placeholder="Exercise notes"
											className="min-h-[60px]"
										/>
									</div>

									{/* Remove Exercise Button */}
									<div className="flex justify-end">
										<Button
											type="button"
											variant="destructive"
											size="sm"
											onClick={() => handleRemoveExercise(index)}
											disabled={formData.exercises.length === 1}
										>
											Remove Exercise
										</Button>
									</div>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={handleAddExercise}
								className="w-full"
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
									{id ? 'Updating...' : 'Creating...'}
								</>
							) : (
								`${id ? 'Save Changes' : 'Create'} ${
									isTemplate ? 'Template' : 'Workout'
								}`
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
