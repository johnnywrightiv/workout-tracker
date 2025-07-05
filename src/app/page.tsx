'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import {
	fetchWorkouts,
	removeWorkout,
	clearWorkouts,
} from '@/store/workouts-slice';
import axios from 'axios';
import { Button } from '@/components/ui/button';
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
	CalendarIcon,
	Filter,
	SortAsc,
	UserPlus,
	LogIn,
	SortDesc,
} from 'lucide-react';
import { setUserDetails } from '@/store/auth-slice';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { SearchBar } from '@/components/search-bar';
import { WorkoutCard } from '@/components/workout-card';
import { convertWeight, convertDistance } from '@/lib/utils';

import { EXERCISE_TYPES, MUSCLE_GROUPS, WEIGHT_TYPES } from '@/lib/constants';

export default function Home() {
	const dispatch = useDispatch<AppDispatch>();
	const { items: workouts } = useSelector((state: RootState) => state.workouts);
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);
	const user = useSelector((state: RootState) => state.auth.user);

	const measurementSystem = useSelector(
		(state: RootState) =>
			state.auth.user?.preferences?.measurementSystem || 'imperial'
	);

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
	const [isMobile, setIsMobile] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 640);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

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

		if (searchQuery) {
			const lowercaseQuery = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(workout) =>
					workout.name.toLowerCase().includes(lowercaseQuery) ||
					workout.exercises.some((exercise) =>
						exercise.name.toLowerCase().includes(lowercaseQuery)
					)
			);
		}

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
	}, [workouts, sortOrder, filters, searchQuery]);

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

	const FilterContent = () => (
		<>
			<SheetHeader className="">
				<SheetTitle>Filter Workouts</SheetTitle>
			</SheetHeader>
			<SheetDescription />
			<div className="py-4 space-y-6">
				<div className="space-y-4">
					<Label>Date Range</Label>
					<div className="flex gap-2">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="justify-start text-left font-normal w-full sm:w-[140px] whitespace-nowrap truncate max-w-full"
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
									className="justify-start text-left font-normal w-full sm:w-[140px] whitespace-nowrap truncate max-w-full"
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
								<div key={item} className="flex items-center space-x-2">
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
									<Label htmlFor={`${filterKey}-${item}`} className="text-sm">
										{item}
									</Label>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
			<SheetFooter className="">
				<Button variant="outline" onClick={resetFilters} className="w-full">
					Reset Filters
				</Button>
			</SheetFooter>
		</>
	);

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
			<div className="w-full space-y-4">
				<div className="flex justify-between items-center gap-4 w-full flex-wrap">
					<h1 className="text-3xl sm:text-4xl font-bold w-full sm:w-auto">
						Past Workouts
					</h1>
					<h2 className="text-sm font-semibold italic text-center text-yellow-200 bg-yellow-900 px-4 py-2 rounded-md shadow-md mx-2 mt-2">
  REMEMBER: you EARN progressive overload through proper REST & RECOVERY, not by FORCING extra strength during workouts!!
</h2>


					{/* Filter and Sort Controls */}
					<div className="w-full sm:w-auto flex flex-row gap-4 justify-end">
						{/* Filter Button (Drawer for mobile, Sheet for desktop) */}
						<div className="w-1/2 sm:w-auto">
							{isMobile ? (
								<Drawer>
									<DrawerTrigger asChild>
										<Button variant="outline" className="w-full">
											<Filter className="mr-2 h-4 w-4" />
											Filter
										</Button>
									</DrawerTrigger>
									<DrawerContent>
										<div className="pl-2 mx-auto w-full max-w-sm">
											<FilterContent
												filters={filters}
												setFilters={setFilters}
												resetFilters={resetFilters}
											/>
										</div>
									</DrawerContent>
								</Drawer>
							) : (
								<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
									<SheetTrigger asChild>
										<Button variant="outline" className="w-full">
											<Filter className="mr-2 h-4 w-4" />
											Filter
										</Button>
									</SheetTrigger>
									<SheetContent className="animate-slide-in-from-right">
										<FilterContent
											filters={filters}
											setFilters={setFilters}
											resetFilters={resetFilters}
										/>
									</SheetContent>
								</Sheet>
							)}
						</div>

						{/* Sort Dropdown */}
						<div className="w-1/2 sm:w-auto">
							<Select
								value={sortOrder}
								onValueChange={(value: 'newest' | 'oldest') =>
									setSortOrder(value)
								}
							>
								<SelectTrigger className="w-full justify-center">
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
					<div className="w-full">
						<SearchBar onSearch={setSearchQuery} />
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{filteredWorkouts.map((workout) => (
					<WorkoutCard
						key={workout._id}
						workout={workout}
						handleDelete={handleDelete}
						measurementSystem={measurementSystem}
						convertWeight={convertWeight}
						convertDistance={convertDistance}
					/>
				))}
			</div>
		</div>
	);
}
