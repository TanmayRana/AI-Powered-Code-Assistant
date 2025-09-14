// src/redux/slices/lessonSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonService } from "../services/lessonService";
// import { lessonService } from "@/services/lessonService";

interface LessonState {
  lessons: any[];
  lesson: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: LessonState = {
  lessons: [],
  lesson: null,
  loading: false,
  error: null,
};

// Async thunks
export const createLesson = createAsyncThunk(
  "lessons/create",
  async (
    data: { topic: string; difficulty?: string; purpose?: string },
    { rejectWithValue }
  ) => {
    try {
      return await lessonService.createLesson(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getLessons = createAsyncThunk(
  "lessons/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await lessonService.getLessons();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getLessonById = createAsyncThunk(
  "lessons/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await lessonService.getLessonById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "lessons/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      return await lessonService.deleteLesson(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createLesson
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons.unshift(action.payload); // add newly created lesson
      })
      .addCase(createLesson.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getLessons
      .addCase(getLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(getLessons.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getLessonById
      .addCase(getLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.lesson = action.payload;
      })
      .addCase(getLessonById.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteLesson
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = state.lessons.filter(
          (l) => l._id !== action.payload._id
        );
      })
      .addCase(deleteLesson.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lessonSlice.reducer;
