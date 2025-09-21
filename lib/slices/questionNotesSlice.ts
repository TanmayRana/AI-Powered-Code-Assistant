// lib/slices/questionNotesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as noteService from "@/lib/services/questionNotesService";

interface Note {
  _id: string;
  userId: string;
  questionId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

interface Filters {
  userId?: string;
  questionId?: string;
}

// Thunks
// export const fetchNotes = createAsyncThunk(
//   "notes/fetchNotes",
//   async (filters?: { userId?: string; questionId?: string }) => {
//     return await noteService.getNotes(filters);
//   }
// );

export const fetchNotes = createAsyncThunk<
  // Specify returned data type, e.g. Note[] or any if unknown
  any,
  // Specify type of argument passed to thunk
  Filters | undefined,
  {
    rejectValue: string; // type of error rejection message
  }
>("notes/fetchNotes", async (filters, { rejectWithValue }) => {
  console.log("Fetching notes with filters:", filters);

  try {
    const data = await noteService.getNotes(filters);
    return data;
  } catch (err) {
    // Provide a proper rejection message
    return rejectWithValue("Failed to fetch notes");
  }
});

export const saveNote = createAsyncThunk(
  "notes/saveNote",
  async (note: { userId: any; questionId: string; notes: string }) => {
    return await noteService.saveNote(note);
  }
);

export const removeNote = createAsyncThunk(
  "notes/removeNote",
  async ({ userId, questionId }: { userId: string; questionId: string }) => {
    return await noteService.deleteNote(userId, questionId);
  }
);

// Slice
const questionNotesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchNotes
    builder.addCase(fetchNotes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.notes = action.payload.data;
    });
    builder.addCase(fetchNotes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch notes";
    });

    // saveNote
    builder.addCase(saveNote.fulfilled, (state, action) => {
      const index = state.notes.findIndex(
        (n) =>
          n.userId === action.payload.data.userId &&
          n.questionId === action.payload.data.questionId
      );
      if (index !== -1) {
        state.notes[index] = action.payload.data;
      } else {
        state.notes.push(action.payload.data);
      }
    });

    // removeNote
    builder.addCase(removeNote.fulfilled, (state, action) => {
      state.notes = state.notes.filter(
        (n) =>
          !(
            n.userId === action.meta.arg.userId &&
            n.questionId === action.meta.arg.questionId
          )
      );
    });
  },
});

export default questionNotesSlice.reducer;
