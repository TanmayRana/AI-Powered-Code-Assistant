import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import followingService from "../services/followingService";
// import followingService from "./followingService";

interface FullSheetsState {
  data: any[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: FullSheetsState = {
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Thunk with userId as input
export const fetchFollowingData = createAsyncThunk<
  any[],
  string,
  { rejectValue: string }
>("fullSheets/fetch", async (userId, thunkAPI) => {
  try {
    const response = await followingService.getFollowingData(userId); // updated to correct method name
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const fullSheetsSlice = createSlice({
  name: "fullSheets",
  initialState,
  reducers: {
    reset: (state) => {
      state.data = [];
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowingData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchFollowingData.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.data = action.payload;
        }
      )
      .addCase(fetchFollowingData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch following data";
      });
  },
});

export const { reset } = fullSheetsSlice.actions;
export default fullSheetsSlice.reducer;
