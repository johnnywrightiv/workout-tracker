'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
	fetchWorkouts,
	removeWorkout,
	clearWorkouts,
} from '@/store/workouts-slice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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
	Circle,
	Calendar,
	Clock,
	Trash2,
	Edit2,
	Filter,
	SortAsc,
	MoreVertical,
	UserPlus,
	LogIn
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setUserDetails } from '@/store/auth-slice';

export default function Home() {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const { items: workouts } = useSelector((state: RootState) => state.workouts);
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);
	const user = useSelector((state: RootState) => state.auth.user);

	useEffect(() => {
		// Check if we're authenticated but missing user data
		if (isAuthenticated && !user) {
			const savedUser = localStorage.getItem('auth_user');
			if (savedUser) {
				dispatch(setUserDetails(JSON.parse(savedUser)));
			}
		}

		// Fetch workouts if authenticated
		if (isAuthenticated) {
			dispatch(fetchWorkouts());
		} else {
			dispatch(clearWorkouts());
		}
	}, [dispatch, isAuthenticated, user]);

	const handleDelete = async (workoutId: string) => {
		try {
			await axios.delete(`/api/workouts/${workoutId}`);
			dispatch(removeWorkout(workoutId));
		} catch (error) {
			console.error('Error deleting workout:', error);
			dispatch(fetchWorkouts());
		}
	};

	const handleFilter = () => {
		console.log('Filter button clicked');
	};

	const handleSort = () => {
		console.log('Sort button clicked');
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
				<div className="space-x-4">
					<Button variant="outline" asChild>
						<Link href="/signup" className="flex items-center space-x-2">
							<UserPlus className="h-4 w-4" />
							<span>Sign Up</span>
						</Link>
					</Button>
					<Button variant="default" asChild>
						<Link href="/login" className="flex items-center space-x-2">
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
			<div className="flex flex-row justify-between items-center gap-4 w-full">
				<h1 className="text-3xl sm:text-4xl font-bold">Past Workouts</h1>
				<div className="flex space-x-4">
					<Button variant="outline" size="sm" onClick={handleFilter}>
						<Filter className="mr-2 h-4 w-4" />
						Filter
					</Button>
					<Button variant="outline" size="sm" onClick={handleSort}>
						<SortAsc className="mr-2 h-4 w-4" />
						Sort
					</Button>
				</div>
			</div>

			<div className="space-y-6">
				{workouts.map((workout) => (
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
							<div className="flex flex-col  space-y-1 text-muted-foreground">
								<div className="flex items-center">
									<Calendar className="mr-2 h-4 w-4" />
									<span>{new Date(workout.date).toLocaleDateString()}</span>
									<span className="ml-1">
										{new Date(workout.date).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								</div>
								<div className="flex items-center text-muted-foreground">
									<Clock className="mr-2 h-4 w-4" />
									<span>{workout.duration} minutes</span>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">{workout.notes}</p>
							{workout.exercises && (
								<div className="space-y-4">
									{Object.entries(
										workout.exercises.reduce((acc, exercise) => {
											if (!acc[exercise.muscleGroup]) {
												acc[exercise.muscleGroup] = [];
											}
											acc[exercise.muscleGroup].push(exercise);
											return acc;
										}, {} as Record<string, typeof workout.exercises>)
									).map(([muscleGroup, exercises]) => (
										<div key={muscleGroup}>
											<h4 className="font-semibold mb-2">{muscleGroup}</h4>
											<ul className="space-y-1">
												{exercises.map((exercise, index) => (
													<li key={index} className="flex flex-col">
														<div className="flex items-center space-x-2">
															<Circle className="mr-2 h-1 w-1 bg-foreground rounded-full flex-shrink-0" />
															<div className="text-sm">
																{exercise.name}: {exercise.sets} ×{' '}
																{exercise.reps} @ {exercise.weight}lbs
															</div>
														</div>
														<div className="text-sm text-muted-foreground ml-6">
															{exercise.notes}
														</div>
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