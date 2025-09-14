// src/services/lessonService.ts
import axios from "axios";

// const API_URL = "/api/generate-course";

export const lessonService = {
  createLesson: async (data: {
    topic: string;
    difficulty?: string;
    purpose?: string;
  }) => {
    const res = await axios.post("/api/generate-lesson-outline", data);
    return res.data;
  },

  getLessons: async () => {
    const res = await axios.get("/api/lesson");
    return res.data;
  },

  getLessonById: async (id: string) => {
    const res = await axios.get(`/api/lesson/${id}`);
    return res.data;
  },

  deleteLesson: async (id: string) => {
    const res = await axios.delete(`/api/lesson/${id}`);
    return res.data;
  },
};
