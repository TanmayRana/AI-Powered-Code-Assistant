import { Schema, model, models } from "mongoose";

// Define schema
export const questionSchema = new Schema(
  {
    id: { type: String, required: true }, // platform-specific id
    platform: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    problemUrl: { type: String, required: true },
    topics: [{ type: String }],
    companyTags: [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Use models.Question if it exists, otherwise create a new model
const Question = (models?.Question as any) || model("Question", questionSchema);

export default Question;
