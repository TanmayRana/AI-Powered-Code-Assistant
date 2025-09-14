import { Schema, model, models } from "mongoose";

const completeQuestionsSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  completedQuestions: [
    {
      sheetId: {
        type: String,
        required: true,
      },
      questions: [
        {
          questionId: {
            type: String,
            required: true,
          },
          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
      completedCount: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const CompleteQuestions =
  (models.CompleteQuestions as any) ||
  model("CompleteQuestions", completeQuestionsSchema);

export default CompleteQuestions;
