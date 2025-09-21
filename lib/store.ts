// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import lessonReducer from "./slices/lessonSlice";
import sheetReducer from "./slices/sheetSlice";
import fullSheetsReducer from "./slices/fullSheetsSlice";
import questionReducer from "./slices/questionSlice";
import Following from "./slices/followingSlice";
import completedQuestionsReducer from "./slices/completedQuestionsSlice";
import notesReducer from "@/lib/slices/questionNotesSlice";

export const store = configureStore({
  reducer: {
    lessons: lessonReducer,
    sheets: sheetReducer,
    FullSheetsData: fullSheetsReducer,
    question: questionReducer,
    followingData: Following,
    completedQuestions: completedQuestionsReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
