import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for the authentication slice
interface AuthState {
	isAuthenticated: boolean;
	user: {
		userId: string;
		email: string;
		name: string;
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
		// Action to log the user in
		login: (
			state,
			action: PayloadAction<{ userId: string; email: string; name: string }>
		) => {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		// Action to log the user out
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
		},
		// Optional: Action to set user details (e.g., after re-authentication)
		setUserDetails: (
			state,
			action: PayloadAction<{ userId: string; email: string; name: string }>
		) => {
			state.user = action.payload;
		},
	},
});

export const { login, logout, setUserDetails } = authSlice.actions;
export default authSlice.reducer;
