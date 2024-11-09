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
import { useToast } from '@/hooks/use-toast';
import { Loader2, DumbbellIcon, GripVertical, InfoIcon } from 'lucide-react';

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
	sets: number | undefined;
	reps: number | undefined;
	weight: number | undefined;
	notes: string;
	muscleGroup: string;
}

interface FormData {
	name: string;
	duration: number | undefined;
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
			duration: undefined,
			notes: '',
			exercises: [
				{
					name: '',
					sets: undefined,
					reps: undefined,
					weight: undefined,
					notes: '',
					muscleGroup: '',
				},
			],
		}
	);
	const [isLoading, setIsLoading] = useState(false);
	const [expandedExercises, setExpandedExercises] = useState<string[]>(['0']);
	const [expandedSections, setExpandedSections] = useState<string[]>([
		'details',
	]); 
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
		const newIndex = formData.exercises.length;
		setFormData({
			...formData,
			exercises: [
				...formData.exercises,
				{
					name: '',
					sets: undefined,
					reps: undefined,
					weight: undefined,
					notes: '',
					muscleGroup: '',
				},
			],
		});
		setExpandedExercises([newIndex.toString()]);
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
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="text-xl md:text-2xl font-bold">
					{id ? 'Edit' : 'Create'} {isTemplate ? 'Template' : 'Workout'}
				</div>
				{/* Details Section */}
				<Accordion
					type="multiple"
					value={expandedSections}
					onValueChange={setExpandedSections}
					className="space-y-2"
				>
					<AccordionItem value="details" className="border rounded-lg bg-card">
						<AccordionTrigger className="px-4 hover:no-underline">
							<div className="flex items-center gap-3 w-full">
								<InfoIcon className="h-4 w-4 text-muted-foreground" />
								<div className="flex-1 text-left">
									<span className="font-medium">Details</span>
									{formData.name && (
										<span className="text-sm text-muted-foreground ml-2">
											{formData.name} • {formData.duration} min
										</span>
									)}
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent className="px-4 pb-4">
							<div className="space-y-4">
								<div className="flex flex-col md:flex-row gap-4">
									<div className="flex-1 space-y-2">
										<label htmlFor="name" className="text-sm font-medium">
											Name:
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
									<div className="md:w-1/3 space-y-2">
										<label htmlFor="duration" className="text-sm font-medium">
											Duration (min):
										</label>
										<Input
											id="duration"
											type="number"
											placeholder="0"
											value={formData.duration}
											onChange={(e) =>
												setFormData({
													...formData,
													duration: Number(e.target.value),
												})
											}
											min="0"
											required
										/>
									</div>
								</div>
								<div className="space-y-2">
									<label htmlFor="notes" className="text-sm font-medium">
										Notes:
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
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				{/* Exercises Section */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<DumbbellIcon className="h-5 w-5" />
							Exercises
						</h3>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleAddExercise}
						>
							Add Exercise
						</Button>
					</div>

					<Accordion
						type="multiple"
						value={expandedExercises}
						onValueChange={setExpandedExercises}
						className="space-y-2"
					>
						{formData.exercises.map((exercise, index) => (
							<AccordionItem
								key={index}
								value={index.toString()}
								className="border rounded-lg bg-card shadow-sm"
							>
								<AccordionTrigger className="px-4 hover:no-underline">
									<div className="flex items-center gap-3 w-full">
										<GripVertical className="h-4 w-4 text-muted-foreground" />
										<div className="flex-1 text-left">
											<span className="font-medium">
												{exercise.name || 'New Exercise'}:
											</span>

											{exercise.name && (
												<>
													<span className="text-sm ml-2">
														{exercise.sets} x {exercise.reps} @{' '}
														{exercise.weight} lbs
													</span>

													{exercise.notes && (
														<span className="text-sm text-muted-foreground mt-1">
															{' - '}
															{exercise.notes}
														</span>
													)}
												</>
											)}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-4 pb-4">
									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<label
													htmlFor={`name-${index}`}
													className="text-sm font-medium"
												>
													Exercise Name:
												</label>
												<Input
													id={`name-${index}`}
													value={exercise.name}
													onChange={(e) =>
														handleExerciseChange(index, 'name', e.target.value)
													}
													placeholder="e.g. Bench Press"
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
													Sets:
												</label>
												<Input
													id={`sets-${index}`}
													type="number"
													placeholder="0"
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
													placeholder="0"
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
													Weight:
												</label>
												<Input
													id={`weight-${index}`}
													type="number"
													placeholder="0"
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

										<div className="space-y-2">
											<label
												htmlFor={`notes-${index}`}
												className="text-sm font-medium"
											>
												Notes:
											</label>
											<Textarea
												id={`notes-${index}`}
												value={exercise.notes}
												onChange={(e) =>
													handleExerciseChange(index, 'notes', e.target.value)
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
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				{/* Submit Button */}
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