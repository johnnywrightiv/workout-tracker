'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Loader2, DumbbellIcon, GripVertical, InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

const IncrementDecrementButton = ({
	value,
	onChange,
	min = 0,
	step = 1,
}: {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	step?: number;
}) => (
	<div className="flex items-center">
		<Button
			type="button"
			variant="outline"
			size="icon"
			onClick={() => onChange(Math.max(min, value - step))}
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
						: Math.max(min, parseFloat(e.target.value, 10));
				onChange(isNaN(newValue) ? min : newValue);
			}}
			className="flex w-16 h-8 text-center mx-1"
			min={min}
		/>
		<Button
			type="button"
			variant="outline"
			size="icon"
			onClick={() => onChange(value + step)}
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
			duration: 0,
			notes: '',
			exercises: [
				{ name: '', sets: 0, reps: 0, weight: 0, notes: '', muscleGroup: '' },
			],
		}
	);
	const [isLoading, setIsLoading] = useState(false);
	const [expandedExercises, setExpandedExercises] = useState<string[]>(['0']);
	const [expandedSections, setExpandedSections] = useState<string[]>([
		'details',
	]);
	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);
	const router = useRouter();

	const handleExerciseChange = (
		index: number,
		field: keyof Exercise,
		value: string | number
	) => {
		const updatedExercises = [...formData.exercises];
		updatedExercises[index] = { ...updatedExercises[index], [field]: value };
		setFormData({ ...formData, exercises: updatedExercises });
	};

	const handleAddExercise = () => {
		const newIndex = formData.exercises.length;
		setFormData({
			...formData,
			exercises: [
				...formData.exercises,
				{ name: '', sets: 0, reps: 0, weight: 0, notes: '', muscleGroup: '' },
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setAlert(null);

		// Validate form
		if (!formData.name.trim()) {
			setAlert({ type: 'error', message: 'Please enter a workout name.' });
			setIsLoading(false);
			return;
		}

		if (formData.exercises.length === 0) {
			setAlert({ type: 'error', message: 'Please add at least one exercise.' });
			setIsLoading(false);
			return;
		}

		for (const exercise of formData.exercises) {
			if (!exercise.name.trim() || exercise.sets === 0 || exercise.reps === 0) {
				setAlert({
					type: 'error',
					message:
						'Please fill in all required exercise fields (name, sets, reps).',
				});
				setIsLoading(false);
				return;
			}
		}

		try {
			// Ensure all number fields are numbers, not strings
			const submissionData = {
				...formData,
				duration: Number(formData.duration),
				exercises: formData.exercises.map((ex) => ({
					...ex,
					sets: Number(ex.sets),
					reps: Number(ex.reps),
					weight: Number(ex.weight),
				})),
			};

			await onSubmit(submissionData);
			setAlert({
				type: 'success',
				message: `Your ${
					isTemplate ? 'template' : 'workout'
				} has been successfully ${id ? 'updated' : 'added'}.`,
			});
			router.push(isTemplate ? '/templates' : '/');
		} catch (error) {
			console.error('Submission error:', error);
			setAlert({
				type: 'error',
				message: `Failed to ${id ? 'update' : 'create'} ${
					isTemplate ? 'template' : 'workout'
				}. Please try again.`,
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

				{alert && (
					<Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
						<AlertTitle>
							{alert.type === 'error' ? 'Error' : 'Success'}
						</AlertTitle>
						<AlertDescription>{alert.message}</AlertDescription>
					</Alert>
				)}

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
										{formData.name} • {formData.duration} min
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
												<label htmlFor="name" className="text-sm font-medium">
													Name
												</label>
												<Input
													id="name"
													placeholder="e.g. Leg Day"
													value={formData.name}
													onChange={(e) =>
														setFormData({ ...formData, name: e.target.value })
													}
													required
												/>
											</div>
											<div className="space-y-2">
												<label
													htmlFor="duration"
													className="text-sm font-medium"
												>
													Duration (min)
												</label>
												<IncrementDecrementButton
													value={formData.duration}
													onChange={(value) =>
														setFormData({ ...formData, duration: value })
													}
													min={0}
													step={5}
												/>
											</div>
										</div>
										<div className="space-y-2">
											<label htmlFor="notes" className="text-sm font-medium">
												Notes
											</label>
											<Textarea
												id="notes"
												placeholder="The only bad workout is the one that didn't happen!"
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

				<div className="space-y-4">
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
									<div className="flex items-center gap-3 w-full">
										<GripVertical className="h-5 w-5 text-muted-foreground" />
										<DumbbellIcon className="h-5 w-5" />
										<span className="font-medium">
											{exercise.name || 'New Exercise'}
										</span>
										{exercise.sets > 0 && (
											<span className="text-sm text-muted-foreground ml-2">
												{exercise.sets} x {exercise.reps} @ {exercise.weight} lbs
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
															required
														/>
													</div>
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
												</div>
												<div className="grid grid-cols-3 gap-4">
													<div className="space-y-2">
														<label
															htmlFor={`sets-${index}`}
															className="text-sm font-medium"
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
													<div className="space-y-2">
														<label
															htmlFor={`reps-${index}`}
															className="text-sm font-medium"
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
													<div className="space-y-2">
														<label
															htmlFor={`weight-${index}`}
															className="text-sm font-medium"
														>
															Weight (lbs)
														</label>
														<IncrementDecrementButton
															value={exercise.weight}
															onChange={(value) =>
																handleExerciseChange(index, 'weight', value)
															}
															step={5}
														/>
													</div>
												</div>
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
						`${id ? 'Save' : 'Create'} ${isTemplate ? 'Template' : 'Workout'}`
					)}
				</Button>
			</form>
		</div>
	);
}