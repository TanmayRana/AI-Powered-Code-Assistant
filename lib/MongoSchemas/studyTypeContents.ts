import { Schema, model, models } from "mongoose";

const studyTypeContentsSchema = new Schema(
  {
    lessonId: { type: String, required: true },
    studyType: { type: String },
    content: { type: Array },

    status: { type: String, default: "Generating" },
  },
  { timestamps: true }
);

// Fix the complex union type issue by using any type
const StudyTypeContents: any =
  models.StudyTypeContents ||
  model("StudyTypeContents", studyTypeContentsSchema);

export default StudyTypeContents;
