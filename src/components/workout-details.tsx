import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ClockIcon } from 'lucide-react';
import { FormData } from '@/types/workout';

interface WorkoutDetailsProps {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
	workoutStatus: 'not_started' | 'in_progress' | 'completed';
	isTemplate: boolean;
	handleStartWorkout: () => void;
	handleEndWorkout: () => void;
}

export function WorkoutDetails({
	formData,
	setFormData,
	workoutStatus,
	isTemplate,
	handleStartWorkout,
	handleEndWorkout,
}: WorkoutDetailsProps) {
	const formatTime = (isoString: string) => {
		if (!isoString) return null;
		const date = new Date(isoString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
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
								<span>Start: {formatTime(formData.startTime)} - </span>
								<span>End: {formatTime(formData.endTime)}</span>
							</div>
							<div className="flex items-center space-x-1 sm:space-x-2">
								<ClockIcon className="h-4 w-4 text-muted-foreground" />
								<span>{formData.duration} minutes</span>
							</div>
						</div>
					)}

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
	);
}
