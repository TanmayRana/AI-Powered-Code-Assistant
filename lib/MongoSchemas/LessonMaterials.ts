import { Schema, model, models } from "mongoose";

const lessonMaterialsSchema = new Schema(
  {
    purpose: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    lessons: { type: Array },
    userEmail: { type: String, required: true },
    aiAgentType: { type: String, required: true },
    status: {
      type: String,
      default: "Generating",
      enum: ["Generating", "Ready", "Error", "Pending"],
      required: true,
    },
  },
  {
    timestamps: true,
    // Ensure the status field is always included in queries
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add a pre-save middleware to ensure status is always set
lessonMaterialsSchema.pre("save", function (next: any) {
  if (!this.status) {
    this.status = "Generating";
  }
  next();
});

// Add a pre-update middleware to ensure status updates are tracked
lessonMaterialsSchema.pre("findOneAndUpdate", function (next: any) {
  this.set({ updatedAt: new Date() });
  next();
});

// Add a pre-update middleware for updateOne operations
lessonMaterialsSchema.pre("updateOne", function (next: any) {
  this.set({ updatedAt: new Date() });
  next();
});

// Add a pre-update middleware for updateMany operations
lessonMaterialsSchema.pre("updateMany", function (next: any) {
  this.set({ updatedAt: new Date() });
  next();
});

// Fix the complex union type issue by using any type
const LessonMaterials: any =
  (models.LessonMaterials as any) ||
  model("LessonMaterials", lessonMaterialsSchema);

export default LessonMaterials;
