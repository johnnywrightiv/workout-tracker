import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for the authentication slice
interface AuthState {
	isAuthenticated: boolean;
	user: {
		userId: string;
		email: string;
		name: string;
		preferences: {
			colorScheme: string;
			measurementSystem: string;
		};
	} | null;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state, action: PayloadAction<AuthState['user']>) => {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
		},
		updateUserPreferences: (
			state,
			action: PayloadAction<AuthState['user']['preferences']>
		) => {
			if (state.user) {
				state.user.preferences = action.payload;
			}
		},
		// Optional: Action to set user details (e.g., after re-authentication)
		setUserDetails: (
			state,
			action: PayloadAction<{ userId: string; email: string; name: string }>
		) => {
			state.user = action.payload;
		},
		setAuthenticated: (
			state,
			action: PayloadAction<{ userId: string; email: string; name: string }>
		) => {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		setUnauthenticated: (state) => {
			state.isAuthenticated = false;
			state.user = null;
		},
	},
});

export const {
	login,
	logout,
	updateUserPreferences,
	setUserDetails,
	setAuthenticated,
	setUnauthenticated,
} = authSlice.actions;
export default authSlice.reducer;
