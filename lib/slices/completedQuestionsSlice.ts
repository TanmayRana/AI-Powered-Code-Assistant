// redux/slices/completedQuestionsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { completedQuestionsService } from "../services/completedQuestionsService";
// import { completedQuestionsService } from "@/services/completedQuestionsService";

interface Question {
  questionId: string;
  completed: boolean;
}

interface Sheet {
  sheetId: string;
  questions: Question[];
  completedCount: number;
}

interface CompletedQuestionsState {
  userId: string | null;
  completedQuestions: Sheet[];
  loading: boolean;
  error: string | null;
}

const initialState: CompletedQuestionsState = {
  userId: null,
  completedQuestions: [],
  loading: false,
  error: null,
};

// ✅ Fetch user progress
export const fetchCompletedQuestions = createAsyncThunk(
  "completedQuestions/fetch",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await completedQuestionsService.getUserProgress(userId);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Toggle question completion
export const toggleQuestion = createAsyncThunk(
  "completedQuestions/toggle",
  async (
    {
      userId,
      sheetId,
      questionId,
      completed,
    }: {
      userId: string;
      sheetId: string;
      questionId: string;
      completed: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      return await completedQuestionsService.toggleQuestionCompletion({
        userId,
        sheetId,
        questionId,
        completed,
      });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const completedQuestionsSlice = createSlice({
  name: "completedQuestions",
  initialState,
  reducers: {
    resetProgress: (state) => {
      state.completedQuestions = [];
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.completedQuestions = action.payload.completedQuestions;
      })
      .addCase(fetchCompletedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleQuestion.fulfilled, (state, action) => {
        state.completedQuestions = action.payload.completedQuestions;
      })
      .addCase(toggleQuestion.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetProgress } = completedQuestionsSlice.actions;
export default completedQuestionsSlice.reducer;
