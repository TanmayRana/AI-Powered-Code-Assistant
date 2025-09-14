import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sheetService } from "../services/sheetService";
// import { sheetService } from "@/services/sheetService";

interface SheetState {
  sheets: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SheetState = {
  sheets: [],
  loading: false,
  error: null,
};

// Async thunk to fetch sheets
export const fetchSheets = createAsyncThunk(
  "sheets/fetchSheets",
  async (_, thunkAPI) => {
    try {
      return await sheetService.getSheets();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch sheets"
      );
    }
  }
);

const sheetSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSheets.fulfilled, (state, action) => {
        state.loading = false;
        state.sheets = action.payload;
      })
      .addCase(fetchSheets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sheetSlice.reducer;
