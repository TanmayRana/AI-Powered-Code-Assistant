// import { Schema, model, models, Model, InferSchemaType } from "mongoose";

// const chapterNodesSchema = new Schema(
//   {
//     chapterId: { type: String, required: true },
//     courseId: { type: String, required: true, index: true },
//     notes: { type: String, default: "" },
//     status: {
//       type: String,
//       enum: ["Generating", "Ready", "Error"],
//       default: "Generating",
//     },
//   },
//   { timestamps: true }
// );

// // Unique compound index to avoid duplicate entries for same course + chapter
// chapterNodesSchema.index({ courseId: 1, chapterId: 1 }, { unique: true });

// export type ChapterNodeDoc = InferSchemaType<typeof chapterNodesSchema>;
// export type ChapterNodeModel = Model<ChapterNodeDoc>;

// const ChapterNodes =
//   (models.ChapterNodes as ChapterNodeModel) ||
//   model<ChapterNodeDoc>("ChapterNodes", chapterNodesSchema);

// export default ChapterNodes;

// import { Schema, model, models, Model, InferSchemaType } from "mongoose";

// const chapterNodesSchema = new Schema(
//   {
//     chapterId: { type: String, required: true },
//     courseId: { type: String, required: true, index: true },
//     notes: { type: String, default: "" },
//     status: {
//       type: String,
//       enum: ["Generating", "Ready", "Error"],
//       default: "Generating",
//     },
//   },
//   { timestamps: true }
// );

// // Unique compound index
// chapterNodesSchema.index({ courseId: 1, chapterId: 1 }, { unique: true });

// export type ChapterNodeDoc = InferSchemaType<typeof chapterNodesSchema>;
// export type ChapterNodeModel = Model<ChapterNodeDoc>;

// const ChapterNodes =
//   (models.ChapterNodes as ChapterNodeModel | undefined) ??
//   model<ChapterNodeDoc>("ChapterNodes", chapterNodesSchema);

// export default ChapterNodes;

import { Schema, model, models, Model, InferSchemaType } from "mongoose";

const chapterNodesSchema = new Schema(
  {
    chapterId: { type: String, required: true },
    courseId: { type: String, required: true, index: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Generating", "Ready", "Error"],
      default: "Generating",
    },
  },
  { timestamps: true }
);

chapterNodesSchema.index({ courseId: 1, chapterId: 1 }, { unique: true });

export type ChapterNodeDoc = InferSchemaType<typeof chapterNodesSchema>;
export type ChapterNodeModel = Model<ChapterNodeDoc>;

// 👇 cast models to any before accessing
const ChapterNodes =
  ((models as any).ChapterNodes as ChapterNodeModel) ||
  model<ChapterNodeDoc>("ChapterNodes", chapterNodesSchema);

export default ChapterNodes;
