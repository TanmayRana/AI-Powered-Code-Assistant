// lib/services/questionNotesService.ts
import axios from "axios";

const API_URL = "/api/question-notes";

// Create or update note (POST)
export const saveNote = async (note: {
  userId: any;
  questionId: string;
  notes: string;
}) => {
  const response = await axios.post(API_URL, note);
  return response.data;
};

// Get notes (optionally filter by userId or questionId)
// export const getNotes = async (filters?: {
//   userId?: string;
//   questionId?: string;
// }) => {
//   console.log("Filters:", filters);

//   const params = new URLSearchParams(filters as any).toString();
//   const response = await axios.get(`${API_URL}?${params}`);
//   return response.data;
// };

export const getNotes = async (filters?: {
  userId?: string;
  questionId?: string;
}) => {
  console.log("Filters:", filters);

  const params = new URLSearchParams();

  if (filters) {
    if (filters.userId) {
      params.append("userId", filters.userId);
    }
    if (filters.questionId) {
      params.append("questionId", filters.questionId);
    }
  }

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

// Delete note by userId + questionId
export const deleteNote = async (userId: string, questionId: string) => {
  const params = new URLSearchParams({ userId, questionId }).toString();
  const response = await axios.delete(`${API_URL}?${params}`);
  return response.data;
};
