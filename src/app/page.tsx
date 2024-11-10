'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
	fetchWorkouts,
	removeWorkout,
	clearWorkouts,
} from '@/store/workouts-slice';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
	SheetDescription,
} from '@/components/ui/sheet';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
	Circle,
	Calendar as CalendarIcon,
	Clock,
	Trash2,
	Edit2,
	Filter,
	SortAsc,
	MoreVertical,
	UserPlus,
	LogIn,
	Dumbbell,
	Ruler,
	SortDesc,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setUserDetails } from '@/store/auth-slice';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import {
	EXERCISE_TYPES,
	MUSCLE_GROUPS,
	WEIGHT_TYPES,
} from '@/components/workout-form';

export default function Component() {
	const dispatch = useDispatch<AppDispatch>();
	const { items: workouts } = useSelector((state: RootState) => state.workouts);
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);
	const user = useSelector((state: RootState) => state.auth.user);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({
		exerciseTypes: new Set<string>(),
		muscleGroups: new Set<string>(),
		weightTypes: new Set<string>(),
		dateRange: {
			from: undefined as Date | undefined,
			to: undefined as Date | undefined,
		},
	});
	const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
	const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);

	useEffect(() => {
		if (isAuthenticated && !user) {
			const savedUser = localStorage.getItem('auth_user');
			if (savedUser) {
				dispatch(setUserDetails(JSON.parse(savedUser)));
			}
		}

		if (isAuthenticated) {
			dispatch(fetchWorkouts());
		} else {
			dispatch(clearWorkouts());
		}
	}, [dispatch, isAuthenticated, user]);

	useEffect(() => {
		let filtered = [...workouts];

		if (filters.dateRange.from || filters.dateRange.to) {
			filtered = filtered.filter((workout) => {
				const workoutDate = new Date(workout.date);
				if (filters.dateRange.from && workoutDate < filters.dateRange.from)
					return false;
				if (filters.dateRange.to && workoutDate > filters.dateRange.to)
					return false;
				return true;
			});
		}

		if (
			filters.exerciseTypes.size > 0 ||
			filters.muscleGroups.size > 0 ||
			filters.weightTypes.size > 0
		) {
			filtered = filtered.filter((workout) =>
				workout.exercises.some((exercise) => {
					const matchesType =
						filters.exerciseTypes.size === 0 ||
						filters.exerciseTypes.has(exercise.exerciseType);
					const matchesMuscle =
						filters.muscleGroups.size === 0 ||
						filters.muscleGroups.has(exercise.muscleGroup);
					const matchesWeight =
						filters.weightTypes.size === 0 ||
						filters.weightTypes.has(exercise.weightType);
					return matchesType && matchesMuscle && matchesWeight;
				})
			);
		}

		filtered.sort((a, b) => {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
		});

		setFilteredWorkouts(filtered);
	}, [workouts, sortOrder]);

	const handleDelete = async (workoutId: string) => {
		try {
			await axios.delete(`/api/workouts/${workoutId}`);
			dispatch(removeWorkout(workoutId));
		} catch (error) {
			console.error('Error deleting workout:', error);
			dispatch(fetchWorkouts());
		}
	};

	const resetFilters = () => {
		setFilters({
			exerciseTypes: new Set(),
			muscleGroups: new Set(),
			weightTypes: new Set(),
			dateRange: {
				from: undefined,
				to: undefined,
			},
		});
	};

	if (!isAuthenticated) {
		return (
			<div className="container mx-auto py-16 px-4 text-center">
				<h2 className="text-3xl font-bold mb-8">
					Welcome to Your Workout Tracker
				</h2>
				<p className="text-xl mb-8">
					Please log in or sign up to view and manage your workouts.
				</p>
				<div className="space-y-4 sm:space-y-0 sm:space-x-4">
					<Button variant="outline" asChild className="w-full sm:w-auto">
						<Link
							href="/signup"
							className="flex items-center justify-center space-x-2"
						>
							<UserPlus className="h-4 w-4" />
							<span>Sign Up</span>
						</Link>
					</Button>
					<Button variant="default" asChild className="w-full sm:w-auto">
						<Link
							href="/login"
							className="flex items-center justify-center space-x-2"
						>
							<LogIn className="h-4 w-4" />
							<span>Login</span>
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4 space-y-8">
			<div className="flex justify-between items-start gap-4 w-full">
				<div className="flex justify-between gap-4 w-full">
					<h1 className="text-3xl sm:text-4xl font-bold">Past Workouts</h1>

					<div className="flex gap-2 w-1/2 sm:w-auto justify-end">
						<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
							<SheetTrigger asChild>
								<Button variant="outline" className="sm:w-auto w-full">
									<Filter className="mr-2 h-4 w-4" />
									Filter
								</Button>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Filter Workouts</SheetTitle>
								</SheetHeader>
								<SheetDescription>
									Configure options to filter your workouts{' '}
								</SheetDescription>
								<div className="py-4 space-y-6">
									<div className="space-y-4">
										<Label>Date Range</Label>
										<div className="flex flex-col sm:flex-row gap-2">
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="justify-start text-left font-normal w-full sm:w-[140px]"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{filters.dateRange.from ? (
															format(filters.dateRange.from, 'PPP')
														) : (
															<span>From date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={filters.dateRange.from}
														onSelect={(date) =>
															setFilters((prev) => ({
																...prev,
																dateRange: {
																	...prev.dateRange,
																	from: date ?? undefined,
																},
															}))
														}
													/>
												</PopoverContent>
											</Popover>

											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="justify-start text-left font-normal w-full sm:w-[140px]"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{filters.dateRange.to ? (
															format(filters.dateRange.to, 'PPP')
														) : (
															<span>To date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={filters.dateRange.to}
														onSelect={(date) =>
															setFilters((prev) => ({
																...prev,
																dateRange: {
																	...prev.dateRange,
																	to: date ?? undefined,
																},
															}))
														}
													/>
												</PopoverContent>
											</Popover>
										</div>
									</div>

									{[
										{
											title: 'Exercise Type',
											items: EXERCISE_TYPES,
											filterKey: 'exerciseTypes' as const,
										},
										{
											title: 'Muscle Group',
											items: MUSCLE_GROUPS,
											filterKey: 'muscleGroups' as const,
										},
										{
											title: 'Weight Type',
											items: WEIGHT_TYPES,
											filterKey: 'weightTypes' as const,
										},
									].map(({ title, items, filterKey }) => (
										<div key={title} className="space-y-4">
											<Label>{title}</Label>
											<div className="grid grid-cols-2 gap-2">
												{items.map((item) => (
													<div
														key={item}
														className="flex items-center space-x-2"
													>
														<Checkbox
															id={`${filterKey}-${item}`}
															checked={filters[filterKey].has(item)}
															onCheckedChange={(checked) => {
																setFilters((prev) => {
																	const newSet = new Set(prev[filterKey]);
																	if (checked) {
																		newSet.add(item);
																	} else {
																		newSet.delete(item);
																	}
																	return { ...prev, [filterKey]: newSet };
																});
															}}
														/>
														<Label
															htmlFor={`${filterKey}-${item}`}
															className="text-sm"
														>
															{item}
														</Label>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
								<SheetFooter>
									<Button
										variant="outline"
										onClick={resetFilters}
										className="w-full"
									>
										Reset Filters
									</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>

						{/* Sort Dropdown */}
						<Select
							value={sortOrder}
							onValueChange={(value: 'newest' | 'oldest') =>
								setSortOrder(value)
							}
						>
							<SelectTrigger className="sm:w-[140px] w-full">
								<div className="flex items-center">
									{sortOrder === 'newest' ? (
										<SortDesc className="mr-2 h-4 w-4" />
									) : (
										<SortAsc className="mr-2 h-4 w-4" />
									)}
									<SelectValue placeholder="Sort by" />
								</div>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest</SelectItem>
								<SelectItem value="oldest">Oldest</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{filteredWorkouts.map((workout) => (
					<Card key={workout._id} className="w-full">
						<CardHeader className="flex flex-col">
							<div className="flex justify-between items-start w-full">
								<CardTitle className="text-2xl font-bold">
									{workout.name}
								</CardTitle>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-8 w-8 p-0">
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
														This action cannot be undone. This will permanently
														delete your workout.
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
							<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
								<div className="flex items-center">
									<CalendarIcon className="mr-1 h-4 w-4" />
									<span>{new Date(workout.date).toLocaleDateString()}</span>
								</div>
								<div className="flex items-center">
									<Clock className="mr-1 h-4 w-4" />
									<span>{workout.duration} minutes</span>
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
						<CardContent>
							<p className="text-muted-foreground mb-4">{workout.notes}</p>

							{workout.exercises && (
								<div className="space-y-4">
									{/* Group by Muscle Group and Cardio */}
									{Object.entries(
										workout.exercises.reduce(
											(acc, exercise) => {
												// Add cardio as a "muscle group" to categorize exercises
												const group =
													exercise.exerciseType === 'Cardio'
														? 'Cardio'
														: exercise.muscleGroup;

												if (!acc[group]) {
													acc[group] = [];
												}
												acc[group].push(exercise);
												return acc;
											},
											{} as Record<string, typeof workout.exercises>
										)
									).map(([category, exercises]) => (
										<div key={category}>
											{/* Header for Muscle Groups or Cardio */}
											<h4 className="font-semibold mb-2">
												{category === 'Cardio' ? 'Cardio Exercises' : category}
											</h4>

											<ul className="space-y-4">
												{exercises.map((exercise, index) => (
													<li key={index} className="flex flex-col">
														<div className="flex items-center space-x-2">
															<Circle className="mr-2 h-1 w-1 bg-foreground rounded-full flex-shrink-0" />
															<div className="text-sm">
																<strong>{exercise.name}</strong>
																{exercise.exerciseType === 'Strength' ? (
																	// Strength Exercise Display
																	<span>
																		: {exercise.sets} × {exercise.reps} @{' '}
																		{exercise.weight} lbs
																		{exercise.weightType &&
																			` (${exercise.weightType})`}
																		{exercise.equipmentSettings &&
																			` | ${exercise.equipmentSettings}`}
																	</span>
																) : (
																	// Cardio Exercise Display
																	<span>
																		{' '}
																		{exercise.duration} mins.{' | '}
																		{exercise.distance} miles | Speed:{' '}
																		{exercise.speed}
																	</span>
																)}
															</div>
														</div>

														{/* Display notes for both exercise types */}
														{exercise.notes && (
															<div className="text-sm text-muted-foreground ml-6">
																{exercise.notes}
															</div>
														)}
													</li>
												))}
											</ul>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
