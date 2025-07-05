import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
  muscleGroup: string;
}

interface Template {
  _id: string;
  user_id: string;
  name: string;
  duration: number;
  notes: string;
  exercises: Exercise[];
}

interface TemplatesState {
  items: Template[];
}

const initialState: TemplatesState = {
  items: [],
};

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/templates', {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch templates',
      );
    }
  },
);

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (
    templateData: Omit<Template, '_id' | 'user_id'>,
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post('/api/templates', templateData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create template',
      );
    }
  },
);

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (templateId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/templates/${templateId}`, {
        withCredentials: true,
      });
      return templateId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete template',
      );
    }
  },
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearTemplates: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch templates
      .addCase(fetchTemplates.pending, () => {})
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchTemplates.rejected, () => {})
      // Create template
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Delete template
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (template) => template._id !== action.payload,
        );
      });
  },
});

export const { clearTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;
