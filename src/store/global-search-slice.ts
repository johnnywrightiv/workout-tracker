import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalSearchState {
	value: string;
}

const initialState: GlobalSearchState = {
	value: '',
};

const globalSearchSlice = createSlice({
	name: 'globalSearch',
	initialState,
	reducers: {
		setGlobalSearchValue: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
	},
});

export const { setGlobalSearchValue } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;
