import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/auth-slice';
import themeReducer from '@/store/theme-slice';
import workoutsReducer from '@/store/workouts-slice';
import templateReducer from '@/store/template-slice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		theme: themeReducer,
		workouts: workoutsReducer,
		template: templateReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
