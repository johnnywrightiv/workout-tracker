import { configureStore } from "@reduxjs/toolkit";
import globalSearchReducer from '@/store/global-search-slice';

export const store = configureStore({
  reducer: {
    globalSearch: globalSearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
