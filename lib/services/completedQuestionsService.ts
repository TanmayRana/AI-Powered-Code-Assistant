// services/completedQuestionsService.ts
export const completedQuestionsService = {
  async getUserProgress(userId: string) {
    const res = await fetch(`/api/completed-questions?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch progress");
    return res.json();
  },

  async toggleQuestionCompletion({
    userId,
    sheetId,
    questionId,
    completed,
  }: {
    userId: string;
    sheetId: string;
    questionId: string;
    completed: boolean;
  }) {
    const res = await fetch("/api/completed-questions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, sheetId, questionId, completed }),
    });

    if (!res.ok) throw new Error("Failed to update completion");
    return res.json();
  },
};
