import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FullSheetsDataService from "../services/FullSheetsDataService";
// import FullSheetsDataService from "../services/FullSheetsDataService";

interface FullSheetsState {
  data: any | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: FullSheetsState = {
  data: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Async thunk to fetch full sheets data
export const fetchFullSheetsData = createAsyncThunk<
  any, // Response type
  string, // Argument type (slug)
  { rejectValue: string }
>("fullSheets/fetch", async (slug, thunkAPI) => {
  try {
    const response = await FullSheetsDataService.fetchFullSheetsData(slug);
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullSheetsData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(fetchFullSheetsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(fetchFullSheetsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch data";
      });
  },
});

export default fullSheetsSlice.reducer;
