'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	Loader2,
	DumbbellIcon,
	InfoIcon,
	ClockIcon,
	BikeIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const MUSCLE_GROUPS = [
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

export const WEIGHT_TYPES = [
	'Dumbbell',
	'Barbell',
	'Kettlebell',
	'Cable',
	'Machine',
	'Band',
	'Bodyweight',
	'Misc',
] as const;

export const EXERCISE_TYPES = ['Strength', 'Cardio'] as const;

interface Exercise {
	name: string;
	sets: number;
	reps: number;
	weight: number;
	notes: string;
	muscleGroup: string;
	weightType: string;
	equipmentSettings: string;
	duration: number;
	exerciseType: string;
	speed: number;
	distance: number;
}

interface FormData {
	name: string;
	startTime: string;
	endTime: string;
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

const IncrementDecrementButton = ({
	value,
	onChange,
	min = 0,
	step = 1,
	allowDecimals = false,
}: {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	step?: number;
	allowDecimals?: boolean;
}) => (
	<div className="flex items-center justify-center w-full gap-2">
		<Button
			type="button"
			variant="outline"
			onClick={() => {
				const newValue = Number(Math.max(min, value - step).toFixed(2));
				onChange(newValue);
			}}
			disabled={value <= min}
			className="h-8 w-8"
		>
			-
		</Button>
		<Input
			type="number"
			value={value}
			onChange={(e) => {
				const newValue =
					e.target.value === ''
						? min
						: Math.max(min, parseFloat(e.target.value));
				onChange(
					allowDecimals ? Number(newValue.toFixed(2)) : Math.floor(newValue)
				);
			}}
			className="flex w-20 h-8 text-center mx-1"
			min={min}
			step={allowDecimals ? '0.01' : '1'}
		/>
		<Button
			type="button"
			variant="outline"
			onClick={() => {
				const newValue = Number((value + step).toFixed(2));
				onChange(newValue);
			}}
			className="h-8 w-8"
		>
			+
		</Button>
	</div>
);

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
				},
			],
		}
	);
	const [isLoading, setIsLoading] = useState(false);
	const [expandedExercises, setExpandedExercises] = useState<string[]>(['']);
	const [expandedSections, setExpandedSections] = useState<string[]>([
		'details',
	]);
	const [workoutStatus, setWorkoutStatus] = useState<
		'not_started' | 'in_progress' | 'completed'
	>('not_started');
	const router = useRouter();
	const { toast } = useToast();

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

	const measurementSystem = useSelector(
		(state: RootState) =>
			state.auth.user?.preferences?.measurementSystem || 'imperial'
	);

	const convertWeight = (weight: number, to: 'kg' | 'lbs') => {
		return to === 'kg' ? weight * 0.45359237 : weight / 0.45359237;
	};

	const convertDistance = (distance: number, to: 'km' | 'miles') => {
		return to === 'km' ? distance * 1.60934 : distance / 1.60934;
	};

	const handleExerciseChange = (
		index: number,
		field: keyof Exercise,
		value: string | number
	) => {
		const updatedExercises = [...formData.exercises];
		if (field === 'weight' && typeof value === 'number') {
			value =
				measurementSystem === 'metric' ? convertWeight(value, 'lbs') : value;
		}
		if (field === 'distance' && typeof value === 'number') {
			value =
				measurementSystem === 'metric'
					? convertDistance(value, 'miles')
					: value;
		}
		updatedExercises[index] = { ...updatedExercises[index], [field]: value };
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
				},
			],
		});
		setExpandedExercises([...expandedExercises, newIndex.toString()]);
	};

	const handleRemoveExercise = (index: number) => {
		setFormData({
			...formData,
			exercises: formData.exercises.filter((_, i) => i !== index),
		});
		setExpandedExercises(
			expandedExercises.filter((i) => i !== index.toString())
		);
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

	const formatTime = (isoString: string) => {
		if (!isoString) return null;
		const date = new Date(isoString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validate form
		if (!formData.name.trim()) {
			toast({
				variant: 'destructive',
				title: 'Validation Error',
				description: 'Please enter a workout name.',
			});
			setIsLoading(false);
			return;
		}

		if (!isTemplate) {
			if (!formData.startTime) {
				toast({
					variant: 'destructive',
					title: 'Validation Error',
					description: 'Please start the workout first.',
				});
				setIsLoading(false);
				return;
			}

			if (!formData.endTime) {
				toast({
					variant: 'destructive',
					title: 'Validation Error',
					description: 'Please end the workout before saving.',
				});
				setIsLoading(false);
				return;
			}
		}

		if (formData.exercises.length === 0) {
			toast({
				variant: 'destructive',
				title: 'Validation Error',
				description: 'Please add at least one exercise.',
			});
			setIsLoading(false);
			return;
		}

		for (const exercise of formData.exercises) {
			if (!exercise.name.trim() || !exercise.exerciseType) {
				toast({
					variant: 'destructive',
					title: 'Validation Error',
					description:
						'Please fill in all required exercise fields (name, type).',
				});
				setIsLoading(false);
				return;
			}
		}

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
						<AccordionTrigger className="hover:no-underline">
							<div className="flex items-center gap-3 w-full">
								<InfoIcon className="h-5 w-5 text-muted-foreground" />
								<span className="font-medium">Details</span>
								{formData.name && (
									<span className="text-sm text-muted-foreground ml-2">
										{formData.name}
									</span>
								)}
							</div>
						</AccordionTrigger>
						<AccordionContent className="pt-4">
							<Card>
								<CardContent className="pt-6">
									<div className="grid gap-4">
										<div className="space-y-2">
											<label htmlFor="name" className="text-sm font-medium">
												Workout Name
											</label>
											<div className="flex items-center space-x-4">
												<Input
													id="name"
													placeholder="e.g. Leg Day"
													value={formData.name}
													onChange={(e) =>
														setFormData({ ...formData, name: e.target.value })
													}
													className="flex-1"
												/>
												{!isTemplate && (
													<div className="flex flex-col items-start space-y-2">
														{workoutStatus === 'not_started' && (
															<Button
																type="button"
																onClick={handleStartWorkout}
																size="sm"
																variant="default"
															>
																Start Workout
															</Button>
														)}
														{workoutStatus === 'in_progress' && (
															<div className="flex flex-col space-y-2">
																<Button
																	type="button"
																	onClick={handleEndWorkout}
																	size="sm"
																>
																	End Workout
																</Button>
															</div>
														)}
													</div>
												)}
											</div>
										</div>

										{workoutStatus === 'in_progress' && (
											<div className="text-sm flex items-center justify-end space-x-1">
												<ClockIcon className="h-4 w-4 text-muted-foreground" />
												<span>Started: {formatTime(formData.startTime)}</span>
											</div>
										)}
										{workoutStatus === 'completed' && (
											<div className="sm:text-sm text-xs flex items-center justify-evenly">
												<div className="flex items-center space-x-1">
													<span>
														Start: {formatTime(formData.startTime)} -{' '}
													</span>
													<span>End: {formatTime(formData.endTime)}</span>
												</div>
												<div className="flex items-center space-x-1 sm:space-x-2">
													<ClockIcon className="h-4 w-4 text-muted-foreground" />
													<span>{formData.duration} minutes</span>
												</div>
											</div>
										)}

										{/* Notes Section */}
										<div className="space-y-2">
											<label htmlFor="notes" className="text-sm font-medium">
												Notes
											</label>
											<Textarea
												id="notes"
												placeholder="Any additional notes about the workout"
												value={formData.notes}
												onChange={(e) =>
													setFormData({ ...formData, notes: e.target.value })
												}
												className="min-h-[80px]"
											/>
										</div>
									</div>
								</CardContent>
							</Card>
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
						type="multiple"
						value={expandedExercises}
						onValueChange={setExpandedExercises}
						className="space-y-4"
					>
						{formData.exercises.map((exercise, index) => (
							<AccordionItem key={index} value={index.toString()}>
								<AccordionTrigger className="hover:no-underline">
									<div className="flex flex-wrap items-center gap-3 w-full">
										{exercise.exerciseType === 'Strength' ? (
											<DumbbellIcon className="h-5 w-5" />
										) : exercise.exerciseType === 'Cardio' ? (
											<BikeIcon className="h-5 w-5" />
										) : null}

										<span className="font-medium">
											{exercise.name || 'New Exercise'}
										</span>

										{/* Display strength-specific details */}
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

										{/* Display cardio-specific details */}
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
														? (exercise.speed * 1.60934).toFixed(1)
														: exercise.speed}{' '}
													{measurementSystem === 'metric' ? 'km/h' : 'mph'}
												</span>
											)}

										{/* Display notes, force them to the next row */}
										{exercise.notes && (
											<span className="text-sm text-start text-muted-foreground w-full ml-8 -mt-2">
												{exercise.notes}
											</span>
										)}
									</div>
								</AccordionTrigger>
								<AccordionContent className="pt-4">
									<Card>
										<CardContent className="pt-6">
											<div className="grid gap-4">
												<div className="grid sm:grid-cols-2 gap-4">
													<div className="space-y-2">
														<label
															htmlFor={`name-${index}`}
															className="text-sm font-medium"
														>
															Exercise Name
														</label>
														<Input
															id={`name-${index}`}
															placeholder="e.g. Bench Press"
															value={exercise.name}
															onChange={(e) =>
																handleExerciseChange(
																	index,
																	'name',
																	e.target.value
																)
															}
														/>
													</div>
													<div className="space-y-2">
														<label
															htmlFor={`exerciseType-${index}`}
															className="text-sm font-medium"
														>
															Exercise Type
														</label>
														<Select
															value={exercise.exerciseType}
															onValueChange={(value) =>
																handleExerciseChange(
																	index,
																	'exerciseType',
																	value
																)
															}
														>
															<SelectTrigger>
																<SelectValue
																	placeholder={
																		<span className="text-muted-foreground">
																			Select exercise type
																		</span>
																	}
																/>
															</SelectTrigger>
															<SelectContent>
																{EXERCISE_TYPES.map((type) => (
																	<SelectItem key={type} value={type}>
																		{type}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</div>
												</div>
												{exercise.exerciseType === 'Strength' && (
													<>
														<div className="grid sm:grid-cols-2 gap-4">
															<div className="space-y-2">
																<label
																	htmlFor={`muscleGroup-${index}`}
																	className="text-sm font-medium"
																>
																	Muscle Group
																</label>
																<Select
																	value={exercise.muscleGroup}
																	onValueChange={(value) =>
																		handleExerciseChange(
																			index,
																			'muscleGroup',
																			value
																		)
																	}
																>
																	<SelectTrigger>
																		<SelectValue
																			placeholder={
																				<span className="text-muted-foreground">
																					Select muscle group
																				</span>
																			}
																		/>
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
															<div className="space-y-2">
																<label
																	htmlFor={`weightType-${index}`}
																	className="text-sm font-medium"
																>
																	Weight Type
																</label>
																<Select
																	value={exercise.weightType}
																	onValueChange={(value) =>
																		handleExerciseChange(
																			index,
																			'weightType',
																			value
																		)
																	}
																>
																	<SelectTrigger>
																		<SelectValue
																			placeholder={
																				<span className="text-muted-foreground">
																					Select weight type
																				</span>
																			}
																		/>
																	</SelectTrigger>
																	<SelectContent>
																		{WEIGHT_TYPES.map((type) => (
																			<SelectItem key={type} value={type}>
																				{type}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</div>
														</div>
														<div className="space-y-2">
															<label
																htmlFor={`equipmentSettings-${index}`}
																className="text-sm font-medium"
															>
																Equipment Settings
															</label>
															<Input
																id={`equipmentSettings-${index}`}
																placeholder="e.g. seat height #5"
																value={exercise.equipmentSettings}
																onChange={(e) =>
																	handleExerciseChange(
																		index,
																		'equipmentSettings',
																		e.target.value
																	)
																}
															/>
														</div>
													</>
												)}

												{/* Cardio or Strength Input Values */}
												{exercise.exerciseType === 'Cardio' ? (
													<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
														<div className="space-y-2 min-w-0">
															<label
																htmlFor={`duration-${index}`}
																className="text-sm font-medium truncate"
															>
																Duration (mins)
															</label>
															<IncrementDecrementButton
																value={exercise.duration}
																onChange={(value) =>
																	handleExerciseChange(index, 'duration', value)
																}
															/>
														</div>
														<div className="space-y-2 min-w-0">
															<label
																htmlFor={`speed-${index}`}
																className="text-sm font-medium truncate"
															>
																Speed (
																{measurementSystem === 'metric'
																	? 'km/h'
																	: 'mph'}
																)
															</label>
															<IncrementDecrementButton
																value={exercise.speed}
																onChange={(value) =>
																	handleExerciseChange(index, 'speed', value)
																}
																step={0.1}
																allowDecimals={true}
															/>
														</div>
														<div className="space-y-2 min-w-0">
															<label
																htmlFor={`distance-${index}`}
																className="text-sm font-medium truncate"
															>
																Distance (
																{measurementSystem === 'metric'
																	? 'km'
																	: 'miles'}
																)
															</label>
															<IncrementDecrementButton
																value={
																	measurementSystem === 'metric'
																		? convertDistance(exercise.distance, 'km')
																		: exercise.distance
																}
																onChange={(value) =>
																	handleExerciseChange(index, 'distance', value)
																}
																step={0.1}
																allowDecimals={true}
															/>
														</div>
													</div>
												) : exercise.exerciseType === 'Strength' ? (
													<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
														<div className="space-y-2 min-w-0">
															<div className="text-center space-y-2">
																<label
																	htmlFor={`sets-${index}`}
																	className="text-sm font-medium truncate text-clip"
																>
																	Sets
																</label>
																<IncrementDecrementButton
																	value={exercise.sets}
																	onChange={(value) =>
																		handleExerciseChange(index, 'sets', value)
																	}
																/>
															</div>
														</div>
														<div className="text-center space-y-2 min-w-0">
															<label
																htmlFor={`reps-${index}`}
																className="text-sm font-medium truncate"
															>
																Reps
															</label>
															<IncrementDecrementButton
																value={exercise.reps}
																onChange={(value) =>
																	handleExerciseChange(index, 'reps', value)
																}
															/>
														</div>
														<div className="text-center space-y-2 min-w-0">
															<label
																htmlFor={`weight-${index}`}
																className="text-sm font-medium truncate"
															>
																Weight (
																{measurementSystem === 'metric' ? 'kg' : 'lbs'})
															</label>
															<IncrementDecrementButton
																value={
																	measurementSystem === 'metric'
																		? convertWeight(exercise.weight, 'kg')
																		: exercise.weight
																}
																onChange={(value) =>
																	handleExerciseChange(index, 'weight', value)
																}
																step={measurementSystem === 'metric' ? 2.5 : 5}
																allowDecimals={true}
															/>
														</div>
													</div>
												) : (
													<div></div>
												)}

												<div className="space-y-2">
													<label
														htmlFor={`notes-${index}`}
														className="text-sm font-medium"
													>
														Notes
													</label>
													<Textarea
														id={`notes-${index}`}
														value={exercise.notes}
														onChange={(e) =>
															handleExerciseChange(
																index,
																'notes',
																e.target.value
															)
														}
														placeholder="Any specific instructions or notes"
														className="min-h-[60px]"
													/>
												</div>
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
										</CardContent>
									</Card>
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
		</div>
	);
}
