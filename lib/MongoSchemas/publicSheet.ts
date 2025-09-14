import { Schema, model, models } from "mongoose";
import "@/lib/MongoSchemas/Question";

// -------------------- Full Sheet Schema --------------------
const FullSheetSchema = new Schema(
  {
    sheet: { type: Schema.Types.ObjectId, ref: "Sheet", required: true },
    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        topic: { type: String, default: "" },
        title: { type: String, default: "" },
        subTopic: { type: String, default: "" },
        resource: { type: String, default: "" },
        isPublic: { type: Boolean, default: true },
        popularSheets: { type: [String], default: [] },
        isSolved: { type: Boolean, default: false },
        questionDocumentId: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

const FullSheet = models?.FullSheet || model("FullSheet", FullSheetSchema);
export default FullSheet;
