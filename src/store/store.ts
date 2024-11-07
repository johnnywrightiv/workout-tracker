import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/auth-slice';
import workoutsReducer from '@/store/workouts-slice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		workouts: workoutsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
