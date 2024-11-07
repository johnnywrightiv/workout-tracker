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
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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

export default function Home() {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const { items: workouts } = useSelector((state: RootState) => state.workouts);
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchWorkouts());
		} else {
			dispatch(clearWorkouts());
		}
	}, [dispatch, isAuthenticated]);

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
    // Logic for filtering workouts (e.g., show a modal or dropdown)
    console.log('Filter button clicked');
  };

  const handleSort = () => {
    // Logic for sorting workouts (e.g., toggle sorting order or open a dropdown)
    console.log('Sort button clicked');
  };


	if (!isAuthenticated) {
		return (
			<div className="container px-6 mx-auto py-6 space-y-8">
				<h2 className="text-lg">
					Please log in to view your workouts
				</h2>
				<Button asChild>
					<Link href="/login">Log In</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6 px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Past Workouts</h2>
        <div className="flex space-x-4">
          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFilter}
          >
            Filter
          </Button>

          {/* Sort Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSort}
          >
            Sort
          </Button>
				</div>
			</div>

			<div className="p-4 space-y-4">
				{workouts.map((workout) => (
					<Card key={workout._id}>
						<CardHeader>
							<CardTitle>{new Date(workout.date).toLocaleString()}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{workout.notes}</p>
							<p>Duration: {workout.duration} minutes</p>
							{workout.exercises && (
								<div className="mt-4">
									<h3 className="font-semibold mb-2">Exercises:</h3>
									<ul className="space-y-1">
										{workout.exercises.map((exercise, index) => (
											<li key={index}>
												{exercise.name}: {exercise.sets} sets × {exercise.reps}{' '}
												reps @ {exercise.weight}lbs
											</li>
										))}
									</ul>
								</div>
							)}
						</CardContent>
						<CardFooter className="flex justify-end space-x-2">
							<Button variant="outline" asChild>
								<Link href={`/workout/${workout._id}`}>Edit</Link>
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive">Delete</Button>
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
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}