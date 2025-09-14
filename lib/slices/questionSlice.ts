// /lib/slices/questionSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import QuestionService from "../services/questionService";

// -------------------- Async Thunk --------------------
export const fetchQuestionById = createAsyncThunk(
  "question/fetchById",
  async (id: string, thunkAPI) => {
    try {
      const response = await QuestionService.getQuestionById(id);
      return response.data; // API returns { success, data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch question"
      );
    }
  }
);

// -------------------- Slice --------------------
interface QuestionState {
  question: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  question: null,
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    clearQuestion: (state) => {
      state.question = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestionById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchQuestionById.fulfilled, (state, action) => {
      state.loading = false;
      state.question = action.payload;
    });
    builder.addCase(fetchQuestionById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearQuestion } = questionSlice.actions;
export default questionSlice.reducer;
