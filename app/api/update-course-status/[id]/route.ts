import connectDB from "@/lib/mongodb";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const courseId = params?.id;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Ensure the lesson exists
    const existingLesson = await LessonMaterials.findById(courseId);

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Lesson material not found" },
        { status: 404 }
      );
    }

    // ✅ Correct way to update
    const updatedLesson = await LessonMaterials.findByIdAndUpdate(
      courseId,
      { $set: { status: "Ready" } },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Lesson material status updated successfully",
      lessonId: updatedLesson?._id,
      oldStatus: existingLesson.status,
      newStatus: updatedLesson?.status,
      updated: true,
    });
  } catch (error: any) {
    console.error("Error updating lesson material status:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
