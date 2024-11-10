import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ColorScheme = 'blue' | 'purple';

interface ThemeState {
	colorScheme: ColorScheme;
}

// Get initial color scheme from localStorage if available
const getInitialColorScheme = (): ColorScheme => {
	if (typeof window !== 'undefined') {
		return (localStorage.getItem('color-scheme') as ColorScheme) || 'blue';
	}
	return 'blue';
};

const initialState: ThemeState = {
	colorScheme: getInitialColorScheme(),
};

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
			state.colorScheme = action.payload;
			// Save to localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('color-scheme', action.payload);
			}
			// Update DOM
			document.documentElement.classList.remove('theme-blue', 'theme-purple');
			document.documentElement.classList.add(`theme-${action.payload}`);
		},
	},
});

export const { setColorScheme } = themeSlice.actions;

// Selectors
export const selectColorScheme = (state: { theme: ThemeState }) =>
	state.theme.colorScheme;

export default themeSlice.reducer;
