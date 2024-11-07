import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Exercise {
	name: string;
	sets: number;
	reps: number;
	weight: number;
}

interface Workout {
	_id: string;
	user_id: string;
	date: string;
	duration: number;
	notes: string;
	exercises: Exercise[];
}

interface WorkoutsState {
	items: Workout[];
	loading: boolean;
	error: string | null;
}

const initialState: WorkoutsState = {
	items: [],
	loading: false,
	error: null,
};

// Async thunk for fetching workouts
export const fetchWorkouts = createAsyncThunk(
	'workouts/fetchWorkouts',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get('/api/workouts', {
				withCredentials: true,
			});
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to fetch workouts'
			);
		}
	}
);

const workoutsSlice = createSlice({
	name: 'workouts',
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {
		clearWorkouts: (state) => {
			state.items = [];
			state.loading = false;
			state.error = null;
		},
		removeWorkout: (state, action) => {
			state.items = state.items.filter(
				(workout) => workout._id !== action.payload
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWorkouts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchWorkouts.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(fetchWorkouts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export const { clearWorkouts, removeWorkout } = workoutsSlice.actions;
export default workoutsSlice.reducer;