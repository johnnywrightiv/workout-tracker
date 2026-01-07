import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	CalendarIcon,
	Clock,
	Dumbbell,
	Edit2,
	MoreVertical,
	Ruler,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface WorkoutCardProps {
	workout: any;
	handleDelete: (workoutId: string) => void;
	measurementSystem: 'metric' | 'imperial';
	convertWeight: (weight: number, to: 'kg' | 'lbs') => number;
	convertDistance: (distance: number, to: 'km' | 'miles') => number;
}

export function WorkoutCard({
	workout,
	handleDelete,
	measurementSystem,
	convertWeight,
	convertDistance,
}: WorkoutCardProps) {
	return (
		<Card key={workout._id} className="w-full">
			<CardHeader className="flex flex-col">
				<div className="flex w-full items-start justify-between">
					<CardTitle className="text-xl font-bold">{workout.name}</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="">
								<span className="sr-only">Open menu</span>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link href={`/workout/${workout._id}`}>
									<Edit2 className="mr-2 h-4 w-4" />
									<span>Edit</span>
								</Link>
							</DropdownMenuItem>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<Trash2 className="mr-2 h-4 w-4" />
										<span>Delete</span>
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete
											your workout.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => handleDelete(workout._id)}
											className="bg-destructive hover:bg-destructive/80"
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
					<div className="flex items-center">
						<CalendarIcon className="mr-1 h-4 w-4" />
						<span>{new Date(workout.date).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center">
						<Clock className="mr-1 h-4 w-4" />
						<div>{workout.duration} minutes</div>
					</div>
					{workout.weightType && (
						<div className="flex items-center">
							<Dumbbell className="mr-1 h-4 w-4" />
							<span>{workout.weightType}</span>
						</div>
					)}
					{workout.distance && (
						<div className="flex items-center">
							<Ruler className="mr-1 h-4 w-4" />
							<span>{workout.distance} miles</span>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="-mt-4">
				<p className="text-muted-foreground border-muted-foreground/20 mb-4 border-b pb-2 text-sm">
					{workout.notes}
				</p>

				{workout.exercises && (
					<div className="space-y-4">
						{Object.entries(
							(workout.exercises || []).reduce(
								(acc: Record<string, any[]>, exercise: any) => {
									const group =
										exercise.exerciseType === 'Cardio'
											? 'Cardio'
											: exercise.muscleGroup || 'Other';

									if (!acc[group]) {
										acc[group] = [];
									}
									acc[group].push(exercise);
									return acc;
								},
								{} as Record<string, any[]>
							)
						).map(([category, exercises]) => {
							const exerciseArray = exercises as any[];
							return (
								<div key={category}>
									<h4 className="mb-2 font-semibold">
										{category === 'Cardio' ? 'Cardio Exercises' : category}
									</h4>

									<ul className="space-y-4">
										{exerciseArray.map((exercise: any, index: number) => (
											<li key={index} className="flex flex-col">
												<div className="flex items-center space-x-2">
													<div className="bg-foreground mr-2 h-1 w-1 flex-shrink-0 rounded-full" />
													<div className="text-sm">
														<strong>{exercise.name}</strong>
														{exercise.exerciseType === 'Strength' &&
														exercise.sets &&
														exercise.reps &&
														exercise.weight ? (
															<span>
																: {exercise.sets} × {exercise.reps} @{' '}
																{measurementSystem === 'metric'
																	? `${convertWeight(exercise.weight, 'kg').toFixed(1)} kg`
																	: `${exercise.weight} lbs`}
																{exercise.weightType &&
																	` (${exercise.weightType})`}
																{exercise.equipmentSettings &&
																	` | ${exercise.equipmentSettings}`}
															</span>
														) : exercise.duration && exercise.distance ? (
															<span>
																{' '}
																{exercise.duration} mins,{' '}
																{measurementSystem === 'metric'
																	? `${convertDistance(exercise.distance, 'km').toFixed(2)} km`
																	: `${exercise.distance} miles`}{' '}
															</span>
														) : null}
													</div>
												</div>

												{exercise.notes && (
													<div className="text-muted-foreground ml-6 text-sm">
														{exercise.notes}
													</div>
												)}
											</li>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
