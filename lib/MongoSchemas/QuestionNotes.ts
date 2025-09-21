import { Schema, model, models } from "mongoose";

const questionNotesSchema = new Schema(
  {
    questionId: { type: String, required: true },
    userId: { type: String, required: true },
    notes: { type: String, required: true },
  },
  { timestamps: true }
);

const QuestionNotes =
  (models?.QuestionNotes as any) || model("QuestionNotes", questionNotesSchema);

export default QuestionNotes;
