import { Schema, model, models } from "mongoose";

const dailyquestionSchema = new Schema(
  {
    date: { type: String, required: true },
    results: [
      {
        platform: { type: String, required: true },
        title: String,
        difficulty: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

const DailyQuestion =
  models.DailyQuestion || model("DailyQuestion", dailyquestionSchema);

export default DailyQuestion;
