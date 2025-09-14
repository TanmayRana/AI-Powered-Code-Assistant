import { Schema, model, models } from "mongoose";

const sheetSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    link: { type: String, default: null },
    session: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    followers: { type: Number, default: 0 },
    tag: [{ type: String }],
    banner: { type: String },
    totalQuestions: { type: Number, default: 0 },
    userSolved: { type: Number, default: 0 },
    isFollowing: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Sheet = (models.Sheet as any) || model("Sheet", sheetSchema);
export default Sheet;
