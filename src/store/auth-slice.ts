import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ColorScheme = 'blue' | 'purple' | 'orange' | 'stone';
type MeasurementSystem = 'metric' | 'imperial';

interface UserPreferences {
  colorScheme: ColorScheme;
  measurementSystem: MeasurementSystem;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    userId: string;
    email: string;
    name: string;
    preferences: UserPreferences;
  } | null;
}

const defaultPreferences: UserPreferences = {
  colorScheme: 'blue',
  measurementSystem: 'metric',
};

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
      state.user = {
        ...action.payload,
        preferences: {
          ...defaultPreferences,
          ...action.payload?.preferences,
        },
      };
    },
    logout: (state) => {
      // Reset to default preferences before clearing user
      if (state.user) {
        localStorage.setItem('colorScheme', defaultPreferences.colorScheme);
        document.documentElement.classList.remove(
          'theme-blue',
          'theme-purple',
          'theme-orange',
          'theme-stone',
        );
        document.documentElement.classList.add(
          `theme-${defaultPreferences.colorScheme}`,
        );
      }
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUserPreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences>>,
    ) => {
      if (state.user && state.user.preferences) {
        state.user.preferences = {
          ...state.user.preferences,
          ...action.payload,
        };
      }
    },
    setUserDetails: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = {
        ...action.payload,
        preferences: {
          ...defaultPreferences,
          ...action.payload?.preferences,
        },
      };
    },
    setAuthenticated: (state, action: PayloadAction<AuthState['user']>) => {
      state.isAuthenticated = true;
      state.user = {
        ...action.payload,
        preferences: {
          ...defaultPreferences,
          ...action.payload?.preferences,
        },
      };
    },
    setUnauthenticated: (state) => {
      // Reset to default preferences before clearing user
      if (state.user) {
        localStorage.setItem('colorScheme', defaultPreferences.colorScheme);
        document.documentElement.classList.remove(
          'theme-blue',
          'theme-purple',
          'theme-orange',
          'theme-stone',
        );
        document.documentElement.classList.add(
          `theme-${defaultPreferences.colorScheme}`,
        );
      }
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
