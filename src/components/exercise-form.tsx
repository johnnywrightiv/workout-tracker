import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { MUSCLE_GROUPS, WEIGHT_TYPES, EXERCISE_TYPES } from '@/lib/constants';
import { Exercise } from '@/types/workout';
import { IncrementDecrementButton } from './increment-decrement-button';

interface ExerciseFormProps {
	exercise: Exercise;
	onChange: (updatedExercise: Exercise) => void;
	onRemove: () => void;
	measurementSystem: 'metric' | 'imperial';
	isLastExercise: boolean;
}

export function ExerciseForm({
	exercise,
	onChange,
	onRemove,
	measurementSystem,
	isLastExercise,
}: ExerciseFormProps) {
	const handleChange = (field: keyof Exercise, value: string | number) => {
		onChange({ ...exercise, [field]: value });
	};

	const convertWeight = (weight: number, to: 'kg' | 'lbs') => {
		return to === 'kg' ? weight * 0.45359237 : weight / 0.45359237;
	};

	const convertDistance = (distance: number, to: 'km' | 'miles') => {
		return to === 'km' ? distance * 1.60934 : distance / 1.60934;
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="grid gap-4">
					<div className="grid sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Exercise Name
							</label>
							<Input
								id="name"
								placeholder="e.g. Bench Press"
								value={exercise.name}
								onChange={(e) => handleChange('name', e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="exerciseType" className="text-sm font-medium">
								Exercise Type
							</label>
							<Select
								value={exercise.exerciseType}
								onValueChange={(value) => handleChange('exerciseType', value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select exercise type" />
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
									<label htmlFor="muscleGroup" className="text-sm font-medium">
										Muscle Group
									</label>
									<Select
										value={exercise.muscleGroup}
										onValueChange={(value) =>
											handleChange('muscleGroup', value)
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
								<div className="space-y-2">
									<label htmlFor="weightType" className="text-sm font-medium">
										Weight Type
									</label>
									<Select
										value={exercise.weightType}
										onValueChange={(value) => handleChange('weightType', value)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select weight type" />
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
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
								<div className="text-center space-y-2 min-w-0">
									<label
										htmlFor="sets"
										className="text-sm font-medium truncate text-clip"
									>
										Sets
									</label>
									<IncrementDecrementButton
										value={exercise.sets}
										onChange={(value) => handleChange('sets', value)}
									/>
								</div>
								<div className="text-center space-y-2 min-w-0">
									<label
										htmlFor="reps"
										className="text-sm font-medium truncate"
									>
										Reps
									</label>
									<IncrementDecrementButton
										value={exercise.reps}
										onChange={(value) => handleChange('reps', value)}
									/>
								</div>
								<div className="text-center space-y-2 min-w-0">
									<label
										htmlFor="weight"
										className="text-sm font-medium truncate"
									>
										Weight ({measurementSystem === 'metric' ? 'kg' : 'lbs'})
									</label>
									<IncrementDecrementButton
										value={
											measurementSystem === 'metric'
												? convertWeight(exercise.weight, 'kg')
												: exercise.weight
										}
										onChange={(value) => handleChange('weight', value)}
										step={measurementSystem === 'metric' ? 2.5 : 5}
										allowDecimals={true}
									/>
								</div>
							</div>
						</>
					)}

					{exercise.exerciseType === 'Cardio' && (
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
							<div className="space-y-2 min-w-0">
								<label
									htmlFor="duration"
									className="text-sm font-medium truncate"
								>
									Duration (mins)
								</label>
								<IncrementDecrementButton
									value={exercise.duration}
									onChange={(value) => handleChange('duration', value)}
								/>
							</div>
							<div className="space-y-2 min-w-0">
								<label
									htmlFor="distance"
									className="text-sm font-medium truncate"
								>
									Distance ({measurementSystem === 'metric' ? 'km' : 'miles'})
								</label>
								<IncrementDecrementButton
									value={
										measurementSystem === 'metric'
											? convertDistance(exercise.distance, 'km')
											: exercise.distance
									}
									onChange={(value) => handleChange('distance', value)}
									step={0.1}
									allowDecimals={true}
								/>
							</div>
						</div>
					)}

					<div className="space-y-2">
						<label htmlFor="notes" className="text-sm font-medium">
							Notes
						</label>
						<Textarea
							id="notes"
							value={exercise.notes}
							onChange={(e) => handleChange('notes', e.target.value)}
							placeholder="Any specific instructions or notes"
							className="min-h-[60px]"
						/>
					</div>
					<div className="flex justify-end">
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={onRemove}
							disabled={isLastExercise}
						>
							Remove Exercise
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
