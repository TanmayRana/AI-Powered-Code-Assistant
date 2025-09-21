import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { followingService, FollowSheetsPayload } from "../services/followingService";

interface Sheet {
  _id: string;
  title: string;
  description?: string;
  [key: string]: any;
}

interface FollowingState {
  followingsheets: Sheet[];
  loading: boolean;
  error: string | null;
}

const initialState: FollowingState = {
  followingsheets: [],
  loading: false,
  error: null,
};

// ✅ GET followed sheets
export const fetchFollowedSheets = createAsyncThunk(
  "following/fetchFollowedSheets",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await followingService.fetchFollowedSheets(userId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error fetching followed sheets");
    }
  }
);

// ✅ POST follow sheets
export const followSheets = createAsyncThunk(
  "following/followSheets",
  async (payload: FollowSheetsPayload, { rejectWithValue }) => {
    try {
      return await followingService.followSheets(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error following sheets");
    }
  }
);

// ✅ POST unfollow sheet
export const unfollowSheet = createAsyncThunk(
  "following/unfollowSheet",
  async ({ userId, sheetId }: { userId: string; sheetId: string }, { rejectWithValue }) => {
    try {
      return await followingService.unfollowSheet(userId, sheetId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error unfollowing sheet");
    }
  }
);

const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    clearFollowing(state) {
      state.followingsheets = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFollowedSheets
      .addCase(fetchFollowedSheets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowedSheets.fulfilled, (state, action: PayloadAction<Sheet[]>) => {
        state.loading = false;
        state.followingsheets = action.payload;
      })
      .addCase(fetchFollowedSheets.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      // followSheets
      .addCase(followSheets.pending, (state) => {
        state.loading = true;
      })
      .addCase(followSheets.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(followSheets.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      // unfollowSheet
      .addCase(unfollowSheet.pending, (state) => {
        state.loading = true;
      })
      .addCase(unfollowSheet.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(unfollowSheet.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFollowing } = followingSlice.actions;
export default followingSlice.reducer;
