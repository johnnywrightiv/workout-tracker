'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, DumbbellIcon, InfoIcon, BikeIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ExerciseForm } from './exercise-form';
import { WorkoutDetails } from './workout-details';
import { WorkoutControlButton } from './workout-control-button';
import { Exercise, FormData } from '@/types/workout';

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
			startTime: '',
			endTime: '',
			duration: 0,
			notes: '',
			exercises: [
				{
					name: '',
					sets: 0,
					reps: 0,
					weight: 0,
					notes: '',
					muscleGroup: '',
					weightType: '',
					equipmentSettings: '',
					duration: 0,
					exerciseType: '',
					speed: 0,
					distance: 0,
					completed: false,
				},
			],
		}
	);
	const [isLoading, setIsLoading] = useState(false);
	const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
	const [expandedSections, setExpandedSections] = useState<string[]>([
		'details',
	]);
	const [workoutStatus, setWorkoutStatus] = useState<
		'not_started' | 'in_progress' | 'completed'
	>('not_started');
	const [showReminder, setShowReminder] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const measurementSystem = useSelector(
		(state: RootState) =>
			state.auth.user?.preferences?.measurementSystem || 'imperial'
	);

	useEffect(() => {
		if (initialData) {
			if (initialData.endTime) {
				setWorkoutStatus('completed');
			} else if (initialData.startTime) {
				setWorkoutStatus('in_progress');
			}
		}
	}, [initialData]);

	useEffect(() => {
		if (formData.startTime && formData.endTime) {
			const start = new Date(formData.startTime);
			const end = new Date(formData.endTime);
			const durationInMinutes = Math.round(
				(end.getTime() - start.getTime()) / 60000
			);
			setFormData((prevData) => ({
				...prevData,
				duration: durationInMinutes,
			}));
		}
	}, [formData.startTime, formData.endTime]);

	const handleExerciseChange = (index: number, updatedExercise: Exercise) => {
		const updatedExercises = [...formData.exercises];
		updatedExercises[index] = updatedExercise;
		setFormData({ ...formData, exercises: updatedExercises });
	};

	const handleAddExercise = () => {
		const newIndex = formData.exercises.length;
		setFormData({
			...formData,
			exercises: [
				...formData.exercises,
				{
					name: '',
					sets: 0,
					reps: 0,
					weight: 0,
					notes: '',
					muscleGroup: '',
					weightType: '',
					equipmentSettings: '',
					duration: 0,
					exerciseType: '',
					speed: 0,
					distance: 0,
					completed: false,
				},
			],
		});
		setExpandedExercise(newIndex.toString());
	};

	const handleRemoveExercise = (index: number) => {
		setFormData({
			...formData,
			exercises: formData.exercises.filter((_, i) => i !== index),
		});
		setExpandedExercise(null);
	};

	const handleStartWorkout = () => {
		setFormData({
			...formData,
			startTime: new Date().toISOString(),
		});
		setWorkoutStatus('in_progress');
	};

	const handleEndWorkout = () => {
		setFormData({
			...formData,
			endTime: new Date().toISOString(),
		});
		setWorkoutStatus('completed');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		if (!formData.name.trim()) {
			toast({
				variant: 'destructive',
				title: 'Validation Error',
				description: 'Please enter a workout name.',
			});
			setIsLoading(false);
			return;
		}

		if (!isTemplate && !formData.startTime) {
			toast({
				variant: 'destructive',
				title: 'Validation Error',
				description: 'Please start the workout first.',
			});
			setIsLoading(false);
			return;
		}

		if (!isTemplate && !formData.endTime) {
			setShowReminder(true);
			setIsLoading(false);
			return;
		}

		await submitForm();
	};

	const submitForm = async () => {
		setIsLoading(true);

		try {
			const submissionData = {
				...formData,
				duration: Number(formData.duration),
				exercises: formData.exercises.map((ex) => ({
					...ex,
					sets: Number(ex.sets),
					reps: Number(ex.reps),
					weight: Number(ex.weight.toFixed(2)),
					duration: Number(ex.duration),
					speed: Number(ex.speed.toFixed(2)),
					distance: Number(ex.distance.toFixed(2)),
				})),
			};

			await onSubmit(submissionData);
			toast({
				title: 'Success',
				description: `Your ${isTemplate ? 'template' : 'workout'} has been successfully ${id ? 'updated' : 'saved'}.`,
			});
			router.push(isTemplate ? '/templates' : '/');
		} catch (error) {
			console.error('Submission error:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: `Error: ${error}. Failed to ${id ? 'update' : 'create'} ${isTemplate ? 'template' : 'workout'}. Please try again.`,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container max-w-2xl mx-auto px-4 py-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				<h1 className="text-2xl font-bold">
					{id ? 'Edit' : 'Create'} {isTemplate ? 'Template' : 'Workout'}
				</h1>

				<Accordion
					type="multiple"
					value={expandedSections}
					onValueChange={setExpandedSections}
					className="space-y-4"
				>
					<AccordionItem value="details">
						<AccordionTrigger className="hover:no-underline bg-card px-2 rounded-[--radius]">
							<div className="flex items-center gap-3 w-full flex-wrap sm:flex-nowrap">
								<InfoIcon className="h-5 w-5 text-muted-foreground" />
								<div>Details:</div>
								<strong>{formData.name}</strong> |{' '}
								{formData.duration !== 0
									? `${formData.duration} mins`
									: formData.startTime
										? new Date(formData.startTime).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})
										: ''}
								<span className="text-muted-foreground ml-2 text-start block sm:inline">
									{formData.notes && <span>{formData.notes}</span>}
								</span>
							</div>
						</AccordionTrigger>

						<AccordionContent className="pt-4">
							{expandedSections.includes('details') ? (
								<WorkoutDetails
									formData={formData}
									setFormData={setFormData}
									workoutStatus={workoutStatus}
									isTemplate={isTemplate}
									renderControlButton={(className) => (
										<WorkoutControlButton
											workoutStatus={workoutStatus}
											onStart={handleStartWorkout}
											onEnd={handleEndWorkout}
											className={className}
										/>
									)}
								/>
							) : (
								<div className="text-sm text-muted-foreground">
									<strong>{formData.name}</strong> |{' '}
									{formData.duration !== 0
										? `${formData.duration} mins`
										: new Date(formData.startTime).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
									<br />
									{formData.notes && <span>{formData.notes}</span>}
								</div>
							)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className="space-y-4 px-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Exercises</h2>
						<Button type="button" onClick={handleAddExercise} size="sm">
							Add Exercise
						</Button>
					</div>
					<Accordion
						type="single"
						value={expandedExercise}
						onValueChange={(value) => setExpandedExercise(value)}
						collapsible
						className="space-y-4"
					>
						{formData.exercises.map((exercise, index) => (
							<AccordionItem key={index} value={index.toString()}>
								<AccordionTrigger className="hover:no-underline">
									<div className="flex flex-wrap items-center gap-3 w-full">
										<div className="flex items-center space-x-2">
											{!isTemplate ? (
												<div>
													<input
														type="checkbox"
														className="ml-2 mr-2"
														checked={exercise.completed}
														onClick={(e) => {
															e.stopPropagation();
															const updatedExercise = {
																...exercise,
																completed: !exercise.completed,
															};
															handleExerciseChange(index, updatedExercise);
														}}
													/>
												</div>
											) : null}
											{exercise.exerciseType === 'Strength' ? (
												<DumbbellIcon className="h-5 w-5" />
											) : exercise.exerciseType === 'Cardio' ? (
												<BikeIcon className="h-5 w-5" />
											) : null}
											<span
												className={`font-medium ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}
											>
												{exercise.name || 'New Exercise'}
											</span>
										</div>

										{exercise.exerciseType === 'Strength' &&
											exercise.sets > 0 && (
												<span className="text-sm text-muted-foreground flex justify-start w-full sm:w-auto sm:ml-0 ml-8 sm:mt-0 -mt-2">
													{exercise.sets} x {exercise.reps} @{' '}
													{measurementSystem === 'metric'
														? (exercise.weight * 0.45359237).toFixed(1)
														: exercise.weight}{' '}
													{measurementSystem === 'metric' ? 'kg' : 'lbs'}
													{exercise.weightType && ` (${exercise.weightType})`}
													{exercise.equipmentSettings &&
														` | ${exercise.equipmentSettings}`}
												</span>
											)}

										{exercise.exerciseType === 'Cardio' &&
											exercise.duration > 0 && (
												<span className="text-sm text-muted-foreground flex justify-start w-full sm:w-auto sm:ml-0 ml-8 sm:mt-0 -mt-2">
													{exercise.duration} minutes |{' '}
													{measurementSystem === 'metric'
														? (exercise.distance * 1.60934).toFixed(2)
														: exercise.distance}{' '}
													{measurementSystem === 'metric' ? 'km' : 'miles'} |
													Speed:{' '}
													{measurementSystem === 'metric'
														? `${((exercise.distance / exercise.duration) * 1.60934).toFixed(1)} km/h`
														: `${(exercise.distance / exercise.duration).toFixed(1)} mph`}{' '}
												</span>
											)}

										{exercise.notes && (
											<span className="text-sm text-start text-muted-foreground w-full ml-8 -mt-2">
												{exercise.notes}
											</span>
										)}
									</div>
								</AccordionTrigger>
								<AccordionContent className="pt-4">
									<ExerciseForm
										exercise={exercise}
										onChange={(updatedExercise) =>
											handleExerciseChange(index, updatedExercise)
										}
										onRemove={() => handleRemoveExercise(index)}
										measurementSystem={measurementSystem}
										isLastExercise={index === formData.exercises.length - 1}
									/>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{id ? 'Updating...' : 'Creating...'}
						</>
					) : (
						`Save ${isTemplate ? 'Template' : 'Workout'}`
					)}
				</Button>
			</form>
			<AlertDialog open={showReminder} onOpenChange={setShowReminder}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Workout Not Ended</AlertDialogTitle>
						<AlertDialogDescription>
							Your workout has not been ended yet. You can save it now, but
							remember to come back and end your workout to track your progress
							accurately.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setIsLoading(false)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={submitForm}>
							Save Anyway
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
